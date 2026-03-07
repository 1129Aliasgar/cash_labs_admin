'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClients } from '@/features/admin/hooks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ClientsPage() {
  const router = useRouter();
  const { data: clientsResponse, isLoading } = useClients();
  const clients = clientsResponse?.data || [];

  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});

  const toggleSecret = (id: string) => {
    setVisibleSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-10 border-4 border-[#138aec]/20 border-t-[#138aec] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h2>
          <p className="text-slate-500 mt-0.5 text-sm font-medium">Manage client accounts, API credentials, and integration statuses.</p>
        </div>
        <button
          onClick={() => router.push('/superadmin/client/new')}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#138aec] text-white rounded-xl text-sm font-black shadow-lg shadow-[#138aec]/20 hover:bg-[#1176c9] hover:-translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create New Client
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Identity</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Integration</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Secret Key</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => {
                // Extend client for UI properties not yet in API
                const cli = client as any;
                const status = cli.status || 'ACTIVE';

                return (
                  <tr key={client._id} className="group hover:bg-slate-50/50 transition-all cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#138aec] font-black text-xs border border-slate-200">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 transition-colors">{client.name}</div>
                          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">{client.clientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">api</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">REST API</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <code className="text-[11px] font-black tracking-widest text-slate-300">
                          {visibleSecrets[client._id] ? 'sk_live_51M8vQ...' : '••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => toggleSecret(client._id)}
                          className="p-1 rounded-md text-slate-300 hover:text-[#138aec] hover:bg-[#138aec]/5 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {visibleSecrets[client._id] ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-slate-700">{cli.organizationId || '—'}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight border",
                        status === 'ACTIVE'
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      )}>
                        <span className={cn("size-1.5 rounded-full", status === 'ACTIVE' ? "bg-emerald-500" : "bg-slate-400")}></span>
                        {status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="p-2 text-slate-400 hover:text-[#138aec] hover:bg-slate-100 rounded-xl transition-all"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Revoke Key"
                        >
                          <span className="material-symbols-outlined text-[20px]">key_off</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-4xl text-slate-200">business_center</span>
                      <p className="text-sm font-bold text-slate-400">No clients found. Create your first client to start processing.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {clients.length} results</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
