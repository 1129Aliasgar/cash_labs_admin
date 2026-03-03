'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Pencil,
  Loader2,
  X,
  AlertCircle,
  RefreshCw,
  Check,
  Settings2,
} from 'lucide-react';
import {
  useGateways,
  useCreateGateway,
  useUpdateGateway,
  useGatewayConfigs,
  useCreateGatewayConfig,
  useUpdateGatewayConfig,
} from '@/features/admin/hooks';
import type {
  Gateway,
  GatewayCapability,
  CreateGatewayPayload,
} from '@/features/admin/api/gatewayApi';
import type {
  GatewayRequestConfig,
  CreateConfigPayload,
} from '@/features/admin/api/gatewayRequestConfigApi';
import { cn } from '@/lib/utils';

const GATEWAY_TYPES = ['Fiat', 'Crypto', 'BankTransfer', 'Wallet', 'Alternative'] as const;
const CAPABILITY_KEYS = [
  'refund',
  'payment',
  'apm',
  'authorization',
  'subscription',
  'token',
  'payout',
  'payin',
] as const;

const CAPABILITY_LABELS: Record<(typeof CAPABILITY_KEYS)[number], string> = {
  refund: 'Refund',
  payment: 'Payment',
  apm: 'APM',
  authorization: 'Authorization',
  subscription: 'Subscription',
  token: 'Token',
  payout: 'Payout',
  payin: 'Pay-in',
};

const defaultCapability: GatewayCapability = { enabled: false, configured: false };

function defaultFormState(initial?: Partial<Gateway> | null): CreateGatewayPayload & { id?: string } {
  if (initial) {
    return {
      id: initial._id,
      name: initial.name ?? '',
      type: initial.type ?? 'Fiat',
      logo: initial.logo ?? '',
      endpoint: initial.endpoint ?? '',
      apiKey: initial.apiKey ?? '',
      apiSecret: initial.apiSecret ?? '',
      refund: initial.refund ?? defaultCapability,
      payment: initial.payment ?? defaultCapability,
      apm: initial.apm ?? defaultCapability,
      authorization: initial.authorization ?? defaultCapability,
      subscription: initial.subscription ?? defaultCapability,
      token: initial.token ?? defaultCapability,
      payout: initial.payout ?? defaultCapability,
      payin: initial.payin ?? defaultCapability,
    };
  }
  return {
    name: '',
    type: 'Fiat',
    logo: '',
    endpoint: '',
    apiKey: '',
    apiSecret: '',
    refund: { ...defaultCapability },
    payment: { ...defaultCapability },
    apm: { ...defaultCapability },
    authorization: { ...defaultCapability },
    subscription: { ...defaultCapability },
    token: { ...defaultCapability },
    payout: { ...defaultCapability },
    payin: { ...defaultCapability },
  };
}

export default function GatewaysPage() {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('');
  const [filterName, setFilterName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);
  const [form, setForm] = useState(() => defaultFormState());
  const [configGateway, setConfigGateway] = useState<Gateway | null>(null);
  const [configFormOpen, setConfigFormOpen] = useState(false);
  const [editingConfigType, setEditingConfigType] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      type: filterType || undefined,
      name: filterName.trim() || undefined,
    }),
    [page, filterType, filterName]
  );

  const { data, isLoading, error, refetch } = useGateways(params);
  const createGateway = useCreateGateway();
  const updateGateway = useUpdateGateway();

  const gateways = data?.data ?? [];
  const pagination = data?.pagination;

  const configsData = useGatewayConfigs(configGateway?._id ?? null);
  const configs = configGateway ? (configsData.data?.data ?? []) : [];
  const createConfig = useCreateGatewayConfig(configGateway?._id ?? '');
  const updateConfig = useUpdateGatewayConfig(configGateway?._id ?? '');

  const openConfigModal = (g: Gateway) => {
    setConfigGateway(g);
    setConfigFormOpen(false);
    setEditingConfigType(null);
  };

  const closeConfigModal = () => {
    setConfigGateway(null);
    setConfigFormOpen(false);
    setEditingConfigType(null);
  };

  const openAdd = () => {
    setEditingGateway(null);
    setForm(defaultFormState(null));
    setModalOpen(true);
  };

  const openEdit = (g: Gateway) => {
    setEditingGateway(g);
    setForm(defaultFormState(g));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingGateway(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateGatewayPayload = {
      name: form.name,
      type: form.type,
      logo: form.logo || undefined,
      endpoint: form.endpoint || undefined,
      apiKey: form.apiKey || undefined,
      apiSecret: form.apiSecret || undefined,
      refund: form.refund,
      payment: form.payment,
      apm: form.apm,
      authorization: form.authorization,
      subscription: form.subscription,
      token: form.token,
      payout: form.payout,
      payin: form.payin,
    };
    if (editingGateway) {
      updateGateway.mutate(
        { id: editingGateway._id, data: payload },
        { onSuccess: () => closeModal() }
      );
    } else {
      createGateway.mutate(payload, { onSuccess: () => closeModal() });
    }
  };

  const isPending = createGateway.isPending || updateGateway.isPending;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            Gateways
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Manage payment gateways: add, edit, and filter by type or name.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
          </button>
          <button
            onClick={openAdd}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200"
          >
            <Plus className="mr-2 w-4 h-4" /> Add Gateway
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 min-w-[160px]"
          >
            <option value="">All types</option>
            {GATEWAY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-slate-400 mb-4" />
            <p className="text-slate-500 font-medium">Loading gateways...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-slate-700 font-medium">
              Failed to load gateways. Check your permissions.
            </p>
          </div>
        ) : gateways.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <CreditCard className="w-14 h-14 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No gateways found.</p>
            <button
              onClick={openAdd}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
            >
              Add your first gateway
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Name
                    </th>
                    {CAPABILITY_KEYS.map((key) => (
                      <th
                        key={key}
                        className="px-2 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center"
                        title={`${CAPABILITY_LABELS[key]}: E=Enabled, C=Configured`}
                      >
                        <span className="block truncate max-w-[4rem]">
                          {CAPABILITY_LABELS[key]}
                        </span>
                        <span className="text-[9px] text-slate-400 font-normal">E / C</span>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gateways.map((g) => (
                    <tr key={g._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{g.name}</div>
                        {g.logo && (
                          <div className="text-xs text-slate-400 truncate max-w-[200px]">
                            {g.logo}
                          </div>
                        )}
                      </td>
                      {CAPABILITY_KEYS.map((key) => {
                        const cap = g[key] as GatewayCapability | undefined;
                        const en = cap?.enabled ?? false;
                        const cfg = cap?.configured ?? false;
                        return (
                          <td key={key} className="px-2 py-4 text-center">
                            <div className="flex items-center justify-center gap-0.5 text-xs">
                              <span
                                className={cn(
                                  'w-5 inline-block',
                                  en ? 'text-emerald-600 font-bold' : 'text-slate-300'
                                )}
                                title="Enabled"
                              >
                                {en ? '✓' : '—'}
                              </span>
                              <span className="text-slate-300">/</span>
                              <span
                                className={cn(
                                  'w-5 inline-block',
                                  cfg ? 'text-blue-600 font-bold' : 'text-slate-300'
                                )}
                                title="Configured"
                              >
                                {cfg ? '✓' : '—'}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openConfigModal(g)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 mr-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                          title="Configure request"
                        >
                          <Settings2 className="w-3.5 h-3.5" /> Configure
                        </button>
                        <button
                          onClick={() => openEdit(g)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                          title="Edit gateway"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <span className="text-xs font-medium text-slate-500">
                  {pagination.total} total
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    disabled={page >= pagination.pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {editingGateway ? 'Edit Gateway' : 'Add Gateway'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                    placeholder="e.g. Stripe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Type *
                  </label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                  >
                    {GATEWAY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Endpoint
                  </label>
                  <input
                    type="text"
                    value={form.endpoint}
                    onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                    placeholder="https://api.example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={form.apiKey}
                    onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Capabilities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CAPABILITY_KEYS.map((key) => {
                    const enabled = form[key]?.enabled ?? false;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            [key]: {
                              ...form[key],
                              enabled: !enabled,
                              configured: form[key]?.configured ?? false,
                            },
                          })
                        }
                        className={cn(
                          'flex items-center justify-between gap-2 p-4 rounded-xl border-2 text-left transition-all',
                          enabled
                            ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-sm'
                            : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/80'
                        )}
                      >
                        <span className="text-sm font-semibold capitalize">
                          {CAPABILITY_LABELS[key]}
                        </span>
                        {enabled && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingGateway ? 'Save changes' : 'Create gateway'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configure request modal */}
      {configGateway && (
        <ConfigModal
          gateway={configGateway}
          configs={configs}
          configsLoading={configsData.isLoading}
          configFormOpen={configFormOpen}
          setConfigFormOpen={setConfigFormOpen}
          editingConfigType={editingConfigType}
          setEditingConfigType={setEditingConfigType}
          onClose={closeConfigModal}
          createConfig={createConfig}
          updateConfig={updateConfig}
          onSuccess={() => {
            setConfigFormOpen(false);
            setEditingConfigType(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

const CONFIG_TYPES = [
  'refund',
  'payment',
  'apm',
  'authorization',
  'subscription',
  'token',
  'payout',
  'payin',
] as const;
const CONFIG_TYPE_LABELS: Record<string, string> = {
  refund: 'Refund',
  payment: 'Payment',
  apm: 'APM',
  authorization: 'Authorization',
  subscription: 'Subscription',
  token: 'Token',
  payout: 'Payout',
  payin: 'Pay-in',
};

function ConfigModal({
  gateway,
  configs,
  configsLoading,
  configFormOpen,
  setConfigFormOpen,
  editingConfigType,
  setEditingConfigType,
  onClose,
  createConfig,
  updateConfig,
  onSuccess,
}: {
  gateway: Gateway;
  configs: GatewayRequestConfig[];
  configsLoading: boolean;
  configFormOpen: boolean;
  setConfigFormOpen: (v: boolean) => void;
  editingConfigType: string | null;
  setEditingConfigType: (v: string | null) => void;
  onClose: () => void;
  createConfig: ReturnType<typeof useCreateGatewayConfig>;
  updateConfig: ReturnType<typeof useUpdateGatewayConfig>;
  onSuccess: () => void;
}) {
  const [formType, setFormType] = useState('');
  const [formHeadersStatic, setFormHeadersStatic] = useState('{}');
  const [formHeadersMapped, setFormHeadersMapped] = useState('{}');
  const [formBodyMapping, setFormBodyMapping] = useState('{}');
  const [formEndpoint, setFormEndpoint] = useState('');

  const existingTypes = configs.map((c) => c.type);
  const availableTypes = CONFIG_TYPES.filter(
    (t) => !existingTypes.includes(t) || t === editingConfigType
  );

  const openAddForm = () => {
    setEditingConfigType(null);
    setFormType(availableTypes[0] ?? '');
    setFormHeadersStatic('{}');
    setFormHeadersMapped('{}');
    setFormBodyMapping('{}');
    setFormEndpoint('');
    setConfigFormOpen(true);
  };

  const openEditForm = (config: GatewayRequestConfig) => {
    setEditingConfigType(config.type);
    setFormType(config.type);
    setFormHeadersStatic(JSON.stringify(config.headers?.static ?? {}, null, 2));
    setFormHeadersMapped(JSON.stringify(config.headers?.mapped ?? {}, null, 2));
    setFormBodyMapping(JSON.stringify(config.bodyMapping ?? {}, null, 2));
    setFormEndpoint(config.endpoint ?? '');
    setConfigFormOpen(true);
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let headersStatic: Record<string, string> = {};
    let headersMapped: Record<string, string> = {};
    let bodyMapping: Record<string, string> = {};
    try {
      headersStatic = JSON.parse(formHeadersStatic || '{}');
      headersMapped = JSON.parse(formHeadersMapped || '{}');
      bodyMapping = JSON.parse(formBodyMapping || '{}');
    } catch {
      return;
    }
    const payload: CreateConfigPayload = {
      type: formType,
      headers: { static: headersStatic, mapped: headersMapped },
      bodyMapping,
      endpoint: formEndpoint || undefined,
    };
    if (editingConfigType) {
      updateConfig.mutate(
        {
          type: editingConfigType,
          data: {
            headers: payload.headers,
            bodyMapping: payload.bodyMapping,
            endpoint: payload.endpoint,
          },
        },
        { onSuccess }
      );
    } else {
      createConfig.mutate(payload, { onSuccess });
    }
  };

  const configPending = createConfig.isPending || updateConfig.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Request config — {gateway.name}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Headers, body mapping and endpoint per config type.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {configsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : !configFormOpen ? (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={openAddForm}
                  disabled={availableTypes.length === 0}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add config
                </button>
              </div>
              {configs.length === 0 ? (
                <p className="text-slate-500 text-sm py-6 text-center">
                  No request configs yet. Add one to define headers, body mapping, and endpoint.
                </p>
              ) : (
                <ul className="space-y-2">
                  {configs.map((c) => (
                    <li
                      key={c._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">
                          {CONFIG_TYPE_LABELS[c.type] ?? c.type}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {Object.keys(c.headers?.static ?? {}).length +
                            Object.keys(c.headers?.mapped ?? {}).length}{' '}
                          header keys, {Object.keys(c.bodyMapping ?? {}).length} body mappings
                        </span>
                        {c.endpoint && (
                          <div className="text-xs text-slate-400 mt-1 truncate max-w-xs">
                            {c.endpoint}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => openEditForm(c)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-white"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <form onSubmit={handleConfigSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  disabled={!!editingConfigType}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none disabled:bg-slate-100"
                >
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {CONFIG_TYPE_LABELS[t] ?? t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Headers (static) — JSON
                </label>
                <textarea
                  value={formHeadersStatic}
                  onChange={(e) => setFormHeadersStatic(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-900/10 outline-none"
                  placeholder='{"Content-Type": "application/json"}'
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Headers (mapped) — JSON
                </label>
                <textarea
                  value={formHeadersMapped}
                  onChange={(e) => setFormHeadersMapped(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-900/10 outline-none"
                  placeholder='{"client_id": "credentials.client_id"}'
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Body mapping — JSON
                </label>
                <textarea
                  value={formBodyMapping}
                  onChange={(e) => setFormBodyMapping(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-900/10 outline-none"
                  placeholder='{"first_name": "customer.firstName", "email": "customer.email"}'
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Endpoint (optional)
                </label>
                <input
                  type="text"
                  value={formEndpoint}
                  onChange={(e) => setFormEndpoint(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                  placeholder="https://gateway.example.com/apm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfigFormOpen(false);
                    setEditingConfigType(null);
                  }}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={configPending}
                  className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {configPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingConfigType ? 'Save changes' : 'Create config'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}