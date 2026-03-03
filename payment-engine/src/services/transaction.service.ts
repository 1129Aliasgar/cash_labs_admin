import { injectable, inject } from 'inversify';
import { BaseService } from './BaseService';
import { TYPES } from '../types';
import { ClientRepository } from '../repositories/ClientRepository';
import { ClientGatewayRepository } from '../repositories/ClientGatewayRepository';
import { GatewayRequestConfigRepository } from '../repositories/GatewayRequestConfigRepository';
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

@injectable()
export class TransactionService extends BaseService {
  constructor(
    @inject(TYPES.ClientRepository) private readonly clientRepository: ClientRepository,
    @inject(TYPES.ClientGatewayRepository) private readonly clientGatewayRepository: ClientGatewayRepository,
    @inject(TYPES.GatewayRequestConfigRepository) private readonly gatewayRequestConfigRepository: GatewayRequestConfigRepository
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
    console.log('Client gateways:', clientGateways);
    const withApmEnabled = clientGateways.filter((cg) => {
      const gw = cg.gatewayId as { apm?: { enabled?: boolean } };
      return gw?.apm?.enabled === true;
    });
    console.log('With APM enabled:', withApmEnabled);
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

      const gateway = cg.gatewayId as { endpoint?: string };
      const endpoint = gateway?.endpoint?.trim();
      this.validateValue(endpoint, 'Gateway endpoint for APM', HTTP_STATUS.BAD_REQUEST);

      const internalRequest: Record<string, unknown> = {
        customer: body.customer,
        transaction: body.transaction,
        meta: body.meta ?? {},
      };

      const requestBody = buildBody(config as ConfigWithDefaults, internalRequest);
      const requestHeaders = buildHeaders(config, (cg.credentials ?? {}) as Record<string, unknown>);

      const response = await fetch(endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...requestHeaders,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw this.createError(
          (data as { message?: string }).message ?? `Gateway responded with ${response.status}`,
          response.status
        );
      }
      return { success: true, data };
    }

    throw this.createError(
      'No APM gateway with request config found for this client',
      HTTP_STATUS.BAD_REQUEST
    );
  }
}
