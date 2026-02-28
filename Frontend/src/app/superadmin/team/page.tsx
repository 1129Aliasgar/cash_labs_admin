'use client';

import {
    Users,
    UserPlus,
    Mail,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Search,
    Filter,
    Loader2,
    Check,
    X,
    MoreVertical,
    CheckCircle2,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { useUsers, useCreateUser } from '@/features/admin/hooks';
import { cn } from '@/lib/utils';

export default function TeamManagementPage() {
    const { data: usersData, isLoading } = useUsers();
    const createUser = useCreateUser();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: '',
        role: 'ADMIN',
        companyName: ''
    });

    const users = usersData?.data || [];
    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        createUser.mutate(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ email: '', fullName: '', password: '', role: 'ADMIN', companyName: '' });
            }
        });
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return <ShieldCheck className="w-4 h-4 text-purple-600" />;
            case 'ADMIN': return <Shield className="w-4 h-4 text-blue-600" />;
            case 'MERCHANT': return <Users className="w-4 h-4 text-emerald-600" />;
            case 'AGENT': return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
            default: return <Users className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage system administrators, merchants, and agents.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200"
                >
                    <UserPlus className="mr-2 w-4 h-4" /> Add Team Member
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-full transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-sm font-medium tracking-tight">Accessing user directory...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium tracking-tight">No team members found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 mr-3">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 leading-tight">{user.fullName}</div>
                                                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(user.role)}
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{user.role.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Add Team Member</h2>
                                <p className="text-sm text-slate-500">Provision a new user with specific role permissions.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Carter"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="john@cashlabs.io"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">System Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['ADMIN', 'MERCHANT', 'AGENT'].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role })}
                                            className={cn(
                                                "py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all",
                                                formData.role === role
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.role === 'MERCHANT' && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Acme Fintech"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        value={formData.companyName}
                                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createUser.isPending}
                                    className="flex-3 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {createUser.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
