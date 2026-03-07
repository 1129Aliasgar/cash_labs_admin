import { injectable, inject } from 'inversify';
import { BaseService } from './BaseService';
import { TYPES } from '../types';
import { ClientRepository } from '../repositories/ClientRepository';
import { ClientGatewayRepository } from '../repositories/ClientGatewayRepository';
import { GatewayRequestConfigRepository } from '../repositories/GatewayRequestConfigRepository';
import { TransactionEventProducerService } from './transactionEventProducer.service';
import { tenantContextStorage } from '../utils/tenantContext.provider';
import { IGatewayRequestConfigDoc } from '../types/GatewayRequestConfig.types';
import { REQUEST_CONFIG_TYPE } from '../constants/gateway.constants';
import { HTTP_STATUS } from '../constants/index';
import type { ApmTransactionBody } from '../validators/transaction.validator';

/** Get value at dot-separated path (e.g. "customer.firstName") */
function get(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((o: unknown, k: string) => (o != null && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj);
}

/** Config with optional defaultValues for body mapping */
interface ConfigWithDefaults extends IGatewayRequestConfigDoc {
  defaultValues?: Record<string, unknown>;
}

function buildBody(
  config: ConfigWithDefaults,
  internalRequest: Record<string, unknown>
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const mapping = config.bodyMapping ?? {};
  const defaultValues = config.defaultValues ?? {};
  for (const gatewayField in mapping) {
    const internalPath = mapping[gatewayField];
    const value = get(internalRequest, internalPath);
    body[gatewayField] = value ?? defaultValues[gatewayField] ?? null;
  }
  return body;
}

function buildHeaders(
  config: IGatewayRequestConfigDoc,
  credentials: Record<string, unknown>
): Record<string, string> {
  const headers: Record<string, string> = { ...(config.headers?.static ?? {}) };
  const mapped = config.headers?.mapped ?? {};
  const source = { ...config, credentials };
  for (const key in mapped) {
    const path = mapped[key];
    const value = get(source as Record<string, unknown>, path);
    if (value != null && typeof value === 'string') {
      headers[key] = value;
    }
  }
  return headers;
}

/**
 * Normalize responseMapping from config (may be object or JSON string from DB).
 */
function normalizeResponseMapping(
  raw: unknown
): Record<string, string> {
  if (raw == null) return {};
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    const result: Record<string, string> = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === 'string') result[k] = v;
    }
    return result;
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return normalizeResponseMapping(parsed);
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Map gateway response to a normalized shape using config.responseMapping.
 * responseMapping: outputKey -> dot path (e.g. transactionId -> "message.id").
 */
function mapResponse(
  source: Record<string, unknown>,
  responseMapping: Record<string, string>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const outputKey of Object.keys(responseMapping)) {
    const path = responseMapping[outputKey];
    if (typeof path !== 'string') continue;
    const value = get(source, path);
    out[outputKey] = value ?? null;
  }
  return out;
}

/**
 * Get the payload object from gateway response.
 * Handles: { data: [ {...} ] }, { data: {...} }, or raw array [ {...} ].
 */
function getGatewayPayload(gatewayResponse: unknown): Record<string, unknown> {
  if (Array.isArray(gatewayResponse) && gatewayResponse.length > 0) {
    const first = gatewayResponse[0];
    if (first != null && typeof first === 'object' && !Array.isArray(first)) {
      return first as Record<string, unknown>;
    }
  }
  if (gatewayResponse != null && typeof gatewayResponse === 'object' && !Array.isArray(gatewayResponse)) {
    const obj = gatewayResponse as Record<string, unknown>;
    const data = obj.data;
    if (Array.isArray(data) && data.length > 0 && data[0] != null && typeof data[0] === 'object') {
      return data[0] as Record<string, unknown>;
    }
    if (data != null && typeof data === 'object' && !Array.isArray(data)) {
      return data as Record<string, unknown>;
    }
    return obj;
  }
  return {};
}

@injectable()
export class TransactionService extends BaseService {
  constructor(
    @inject(TYPES.ClientRepository) private readonly clientRepository: ClientRepository,
    @inject(TYPES.ClientGatewayRepository) private readonly clientGatewayRepository: ClientGatewayRepository,
    @inject(TYPES.GatewayRequestConfigRepository) private readonly gatewayRequestConfigRepository: GatewayRequestConfigRepository,
    @inject(TYPES.TransactionEventProducerService) private readonly transactionEventProducer: TransactionEventProducerService
  ) {
    super();
  }

  async createApmTransaction(
    clientId: string,
    clientSecret: string,
    body: ApmTransactionBody
  ): Promise<{ success: boolean; data: unknown }> {
    const client = await this.clientRepository.findByClientId(clientId, true);
    this.validateValue(client, 'Client', HTTP_STATUS.UNAUTHORIZED);
    const secret = (client as { clientSecret?: string }).clientSecret;
    this.validateBusinessRule(
      secret === clientSecret,
      'Invalid client credentials',
      HTTP_STATUS.UNAUTHORIZED
    );

    const clientGateways = await this.clientGatewayRepository.findByClientId(String(client!._id));
    const withApmEnabled = clientGateways.filter((cg) => {
      const gw = cg.gatewayId as { apm?: { enabled?: boolean } };
      return gw?.apm?.enabled === true;
    });
    this.validateBusinessRule(
      withApmEnabled.length > 0,
      'No gateway with APM enabled found for this client',
      HTTP_STATUS.BAD_REQUEST
    );

    for (const cg of withApmEnabled) {
      const gw = cg.gatewayId as { _id?: { toString(): string } };
      const gatewayIdStr = gw?._id?.toString() ?? String(cg.gatewayId);
      const config = await this.gatewayRequestConfigRepository.findByGatewayIdAndType(
        gatewayIdStr,
        REQUEST_CONFIG_TYPE.APM
      );
      if (!config) continue;

      const endpoint = (config.endpoint ?? '').trim();
      this.validateValue(
        endpoint,
        'Gateway request config endpoint for APM',
        HTTP_STATUS.BAD_REQUEST
      );

      const internalRequest: Record<string, unknown> = {
        customer: body.customer,
        transaction: body.transaction,
        meta: body.meta ?? {},
      };

      const requestBody = buildBody(config as ConfigWithDefaults, internalRequest);
      const requestHeaders = buildHeaders(config, (cg.credentials ?? {}) as Record<string, unknown>);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...requestHeaders,
        },
        body: JSON.stringify(requestBody),
      });

      const gatewayResponse = await response.json().catch(() => ({})) as {
        success?: boolean;
        data?: unknown[];
        message?: string;
      };

      if (!response.ok) {
        throw this.createError(
          gatewayResponse.message ?? `Gateway responded with ${response.status}`,
          response.status
        );
      }

      const responseMapping = normalizeResponseMapping(config.responseMapping);
      const source = getGatewayPayload(gatewayResponse);

      const mappedData =
        Object.keys(responseMapping).length > 0
          ? mapResponse(source, responseMapping)
          : source;

      const tenantCtx = tenantContextStorage.getStore();
      const tenantHost = tenantCtx?.host;
      if (tenantHost) {
        this.transactionEventProducer
          .sendTransactionEvent({
            tenantHost,
            transactionId:
              (mappedData as Record<string, unknown>).transactionId as string | undefined,
            requestBody: internalRequest as Record<string, unknown>,
            gatewayResponse: gatewayResponse as Record<string, unknown>,
            status: 'success',
          })
          .catch((e) => console.error('[TransactionService] Event send failed', e));
      }

      return { success: true, data: mappedData };
    }

    throw this.createError(
      'No APM gateway with request config found for this client',
      HTTP_STATUS.BAD_REQUEST
    );
  }
}
