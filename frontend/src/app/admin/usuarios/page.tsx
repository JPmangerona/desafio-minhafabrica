'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  SortAsc,
  Edit3,
  Trash2,
  X,
  User as UserIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Users
} from 'lucide-react';
import api from '@/services/api';
import { User } from '@/types';

// Mapeamento de cores e labels para as roles do sistema
const roleConfig: Record<string, { label: string, color: string }> = {
  admin: { label: 'Administrador', color: 'bg-indigo-100 text-indigo-700' },
  editor: { label: 'Editor', color: 'bg-blue-100 text-blue-700' },
  visualizador: { label: 'Visualizador', color: 'bg-amber-100 text-amber-700' },
  cliente: { label: 'Cliente', color: 'bg-slate-100 text-slate-700' },
};

const roles = Object.keys(roleConfig);

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'visualizador' });
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (err: any) {
      setError('Não foi possível carregar os usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'admin') {
      router.push('/admin/dashboard');
      return;
    }
    fetchUsers();
  }, []);

  const activeCount = users.filter(u => u.ativo).length;
  const inactiveCount = users.filter(u => !u.ativo).length;
  const totalCount = users.length;
  const limitCount = 250; // Limite simulado da plataforma

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert('Por favor, informe um e-mail válido (exemplo@dominio.com)');
      return;
    }

    try {
      await api.post('/user', newUser);
      await fetchUsers(); // Recarrega a lista
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'visualizador' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao criar usuário');
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente o usuário ${user.name}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      // O endpoint de deleteByName espera o nome no corpo da requisição (body)
      await api.delete('/user', { data: { name: user.name } });
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir usuário');
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      alert('Por favor, informe um e-mail válido (exemplo@dominio.com)');
      return;
    }

    try {
      await api.put(`/user/${editingUser._id}`, editingUser);
      
      // Sincroniza o localStorage se o usuário editado for o mesmo que está logado
      if (editingUser.email === localStorage.getItem('user_email')) {
        localStorage.setItem('user_name', editingUser.name);
        localStorage.setItem('user_role', editingUser.role);
        // Despacha um evento customizado para notificar a Sidebar e outros componentes
        window.dispatchEvent(new CustomEvent('user-profile-updated'));
      }

      await fetchUsers();
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar usuário');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  return (
    <>
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A237E]">
              Equipe & Segurança
            </span>
          </nav>
          <h2 className="text-4xl font-black text-slate-900 -tracking-tight mb-2">
            Gestão de Usuários
          </h2>
          <p className="text-slate-500 max-w-xl">
            Gerencie sua equipe, defina permissões e supervisione os níveis de acesso em toda a plataforma.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-3 bg-[#1A237E] text-white pl-6 pr-5 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-all shrink-0"
        >
          Adicionar Usuário
          <div className="bg-white/20 p-2 rounded-xl">
            <UserPlus size={20} />
          </div>
        </button>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Ativos', value: String(activeCount), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total de Usuários', value: String(totalCount), icon: Users, color: 'text-[#1A237E]', bg: 'bg-indigo-50' },
          { label: 'Inativos', value: String(inactiveCount), icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Limite Máximo', value: String(limitCount), icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <section className="grid grid-cols-1 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          {/* Search + filters */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Filtros removidos conforme solicitação */}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-[#1A237E]" size={40} />
                  <p className="text-slate-500 font-medium tracking-tight">Carregando usuários...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-red-500">
                  <AlertCircle size={40} />
                  <p className="font-medium">{error}</p>
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b border-slate-100 bg-slate-50/50">
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        Usuário
                      </th>
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        Email
                      </th>
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        Função
                      </th>
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        Status
                      </th>
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-slate-400">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user) => {
                        const role = roleConfig[user.role] || roleConfig.visualizador;
                        return (
                          <tr
                            key={user._id}
                            className={`hover:bg-slate-50/50 transition-colors group ${!user.ativo ? 'opacity-60' : ''}`}
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
                                  <UserIcon size={20} />
                                </div>
                                <p className={`font-bold ${user.ativo ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                                  {user.name}
                                </p>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-sm text-slate-500">
                                {user.email}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${role.color}`}
                              >
                                {role.label}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase ${user.ativo ? 'text-emerald-600' : 'text-red-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.ativo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {user.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(user)}
                                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
                                  title="Editar"
                                >
                                  <Edit3 size={18} />
                                </button>
                                
                                {user.role !== 'admin' ? (
                                  <button
                                    onClick={() => handleDelete(user)}
                                    className="p-2 rounded-xl transition-all hover:bg-red-50 text-slate-400 hover:text-red-500"
                                    title="Excluir Permanentemente"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                ) : (
                                  <div className="p-2 text-slate-200 cursor-not-allowed" title="Administradores não podem ser excluídos">
                                    <Trash2 size={18} />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Pagination */}
          {filtered.length > 10 && (
            <div className="mt-8 flex items-center justify-between px-4 flex-wrap gap-4">
              <p className="text-sm text-on-surface-variant">
                Mostrando <span className="font-bold text-primary">{Math.min(10, filtered.length)}</span> de{' '}
                <span className="font-bold text-primary">{filtered.length}</span> usuários
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="px-4 py-2 text-sm font-bold text-primary hover:bg-white rounded-lg transition-all border border-outline-variant/30"
                >
                  Anterior
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={
                      page === p
                        ? 'px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg shadow-md'
                        : 'px-4 py-2 text-sm font-bold text-primary hover:bg-white rounded-lg transition-all border border-outline-variant/30'
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm font-bold text-primary hover:bg-white rounded-lg transition-all border border-outline-variant/30"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </section>



      {/* ── Add User Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-secondary p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black -tracking-tight">Adicionar Usuário</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Registre um novo usuário na plataforma.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome completo"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="email@minhafabrica.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                />
              </div>



              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  placeholder="Defina uma senha"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  Função de Acesso
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                >
                  {roles.filter(r => r !== 'admin').map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-primary font-bold hover:bg-surface-container-high rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-[2] py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-secondary p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black -tracking-tight">Editar Usuário</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Altere os dados ou o status de {editingUser.name}.
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-1">
                    Status da Conta
                  </label>
                  <p className="text-sm font-semibold text-slate-700">
                    {editingUser.ativo ? 'Usuário Ativo' : 'Conta Inativa'}
                  </p>
                </div>
                <button
                  onClick={() => setEditingUser({ ...editingUser, ativo: !editingUser.ativo })}
                  disabled={editingUser.role === 'admin'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${editingUser.ativo ? 'bg-emerald-500' : 'bg-slate-300'} ${editingUser.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editingUser.ativo ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  E-mail
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  className="w-full bg-surface-container-low/50 text-slate-400 border-none rounded-2xl py-3 px-4 outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  Função de Acesso
                </label>
                <select
                  value={editingUser.role}
                  disabled={editingUser.role === 'admin'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Se for admin, mostramos apenas a opção admin desabilitada */}
                  {editingUser.role === 'admin' ? (
                    <option value="admin">Administrador</option>
                  ) : (
                    roles.filter(r => r !== 'admin').map((r) => (
                      <option key={r} value={r}>{roleConfig[r]?.label || r}</option>
                    ))
                  )}
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-4 text-primary font-bold hover:bg-surface-container-high rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-[2] py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
