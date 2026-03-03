'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Plus,
  Pencil,
  Loader2,
  X,
  AlertCircle,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useClientGateways,
  useCreateClientGateway,
  useUpdateClientGateway,
  useGateways,
} from '@/features/admin/hooks';
import type { Client } from '@/features/admin/api/clientApi';
import type { ClientGatewayPopulated } from '@/features/admin/api/clientGatewayApi';
import type { Gateway } from '@/features/admin/api/gatewayApi';
import { cn } from '@/lib/utils';

function getGatewayName(gw: ClientGatewayPopulated): string {
  const g = gw.gatewayId;
  if (typeof g === 'object' && g && 'name' in g) return (g as { name?: string }).name ?? g._id;
  return String(g);
}

function getGatewayId(gw: ClientGatewayPopulated): string {
  const g = gw.gatewayId;
  if (typeof g === 'object' && g && '_id' in g) return (g as { _id: string })._id;
  return String(g);
}

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterClientId, setFilterClientId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formName, setFormName] = useState('');
  const [formClientId, setFormClientId] = useState('');
  const [formClientSecret, setFormClientSecret] = useState('');
  const [gatewaysModalClient, setGatewaysModalClient] = useState<Client | null>(null);

  const clientParams = useMemo(
    () => ({
      page,
      limit: 20,
      name: filterName.trim() || undefined,
      clientId: filterClientId.trim() || undefined,
    }),
    [page, filterName, filterClientId]
  );

  const { data, isLoading, error, refetch } = useClients(clientParams);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const clients = data?.data ?? [];
  const pagination = data?.pagination;

  const openAdd = () => {
    setEditingClient(null);
    setFormName('');
    setFormClientId('');
    setFormClientSecret('');
    setModalOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setFormName(c.name);
    setFormClientId(c.clientId);
    setFormClientSecret('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient.mutate(
        {
          id: editingClient._id,
          data: {
            name: formName.trim(),
            ...(formClientSecret.trim() ? { clientSecret: formClientSecret } : {}),
          },
        },
        { onSuccess: () => closeModal() }
      );
    } else {
      if (!formClientSecret.trim()) return;
      createClient.mutate(
        {
          name: formName.trim(),
          clientId: formClientId.trim(),
          clientSecret: formClientSecret,
        },
        { onSuccess: () => closeModal() }
      );
    }
  };

  const isPending = createClient.isPending || updateClient.isPending;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            API Clients & Apps
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Register and manage API clients; link gateways per client.
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
            <Plus className="mr-2 w-4 h-4" /> Add Client
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
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Filter by client ID..."
              value={filterClientId}
              onChange={(e) => {
                setFilterClientId(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-slate-400 mb-4" />
            <p className="text-slate-500 font-medium">Loading clients...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <p className="text-slate-700 font-medium">Failed to load clients.</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <ShieldCheck className="w-14 h-14 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No clients found.</p>
            <button
              onClick={openAdd}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
            >
              Add your first client
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Client ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-sm">{c.clientId}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setGatewaysModalClient(c)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 mr-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Add gateways
                        </button>
                        <button
                          onClick={() => openEdit(c)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                          title="Edit client"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && pagination.pages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <span className="text-xs font-medium text-slate-500">{pagination.total} total</span>
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

      {/* Add / Edit Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingClient ? 'Edit Client' : 'Add Client'}
              </h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                  placeholder="e.g. Acme App"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Client ID *</label>
                <input
                  type="text"
                  required
                  value={formClientId}
                  onChange={(e) => setFormClientId(e.target.value)}
                  disabled={!!editingClient}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none disabled:bg-slate-100"
                  placeholder="e.g. acme-app"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {editingClient ? 'New client secret (leave blank to keep current)' : 'Client secret *'}
                </label>
                <input
                  type="password"
                  value={formClientSecret}
                  onChange={(e) => setFormClientSecret(e.target.value)}
                  required={!editingClient}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3 pt-2">
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
                  {editingClient ? 'Save changes' : 'Create client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Gateways Modal */}
      {gatewaysModalClient && (
        <AddGatewaysModal
          client={gatewaysModalClient}
          onClose={() => setGatewaysModalClient(null)}
          onSuccess={() => {
            setGatewaysModalClient(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function AddGatewaysModal({
  client,
  onClose,
  onSuccess,
}: {
  client: Client;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedGatewayId, setSelectedGatewayId] = useState('');
  const [credentialsJson, setCredentialsJson] = useState('{}');
  const [editingLink, setEditingLink] = useState<ClientGatewayPopulated | null>(null);
  const [editCredentialsJson, setEditCredentialsJson] = useState('{}');

  const { data: gatewaysData } = useGateways({ limit: 200 });
  const gateways = gatewaysData?.data ?? [];

  const { data: linksData, isLoading: linksLoading, refetch: refetchLinks } = useClientGateways({
    clientId: client._id,
    limit: 100,
  });
  const links = linksData?.data ?? [];
  const linkedGatewayIds = useMemo(() => new Set(links.map((l) => getGatewayId(l))), [links]);

  const createLink = useCreateClientGateway();
  const updateLink = useUpdateClientGateway();

  const availableGateways = useMemo(
    () => gateways.filter((g) => !linkedGatewayIds.has(g._id)),
    [gateways, linkedGatewayIds]
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGatewayId) return;
    let creds: Record<string, unknown> = {};
    try {
      creds = JSON.parse(credentialsJson || '{}');
    } catch {
      creds = {};
    }
    createLink.mutate(
      {
        clientId: client._id,
        gatewayId: selectedGatewayId,
        credentials: Object.keys(creds).length ? creds : undefined,
      },
      {
        onSuccess: () => {
          setSelectedGatewayId('');
          setCredentialsJson('{}');
          refetchLinks();
        },
      }
    );
  };

  const handleEditCredentials = (link: ClientGatewayPopulated) => {
    setEditingLink(link);
    setEditCredentialsJson(JSON.stringify(link.credentials ?? {}, null, 2));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    let creds: Record<string, unknown> = {};
    try {
      creds = JSON.parse(editCredentialsJson || '{}');
    } catch {
      return;
    }
    updateLink.mutate(
      { id: editingLink._id, data: { credentials: creds } },
      {
        onSuccess: () => {
          setEditingLink(null);
          refetchLinks();
        },
      }
    );
  };

  const addPending = createLink.isPending;
  const editPending = updateLink.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Gateways for {client.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5 font-mono">{client.clientId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Add new link */}
          <form onSubmit={handleAdd} className="space-y-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Link a gateway</h3>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-slate-500 mb-1">Gateway</label>
                <select
                  value={selectedGatewayId}
                  onChange={(e) => setSelectedGatewayId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/10 outline-none"
                >
                  <option value="">Select gateway</option>
                  {availableGateways.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name} ({g.type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <button
                  type="submit"
                  disabled={!selectedGatewayId || addPending}
                  className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Credentials (JSON, optional)</label>
              <textarea
                value={credentialsJson}
                onChange={(e) => setCredentialsJson(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-900/10 outline-none"
                placeholder='{"apiKey": "..."}'
              />
            </div>
          </form>

          {/* Linked gateways */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Linked gateways</h3>
            {linksLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : links.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No gateways linked yet. Add one above.</p>
            ) : editingLink ? (
              <form onSubmit={handleSaveEdit} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <p className="text-sm font-semibold text-slate-700">
                  Edit credentials — {getGatewayName(editingLink)}
                </p>
                <textarea
                  value={editCredentialsJson}
                  onChange={(e) => setEditCredentialsJson(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-slate-900/10 outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingLink(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editPending}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {editPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <ul className="space-y-2">
                {links.map((link) => (
                  <li
                    key={link._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{getGatewayName(link)}</span>
                      {typeof link.gatewayId === 'object' && link.gatewayId && 'type' in link.gatewayId && (
                        <span className="text-slate-500 text-sm ml-2">
                          {(link.gatewayId as { type?: string }).type}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleEditCredentials(link)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      Edit credentials
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
