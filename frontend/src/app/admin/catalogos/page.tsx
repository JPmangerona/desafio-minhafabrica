'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  Download,
  Edit3,
  Trash2,
  BookMarked,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  Hash,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import api from '@/services/api';
import { Category } from '@/types';

export default function CatalogosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ nome: '', descricao: '', ordem: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sortByOrder, setSortByOrder] = useState(false);
  const [page, setPage] = useState(1);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (err: any) {
      setError('Erro ao carregar os catálogos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const itemsPerPage = 10;

  const filtered = categories
    .filter((c) =>
      c.nome.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortByOrder) return b.ordem - a.ordem;
      return 0; // Mantém ordem original do banco
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const activeCount = categories.filter((c) => c.ativo).length;
  const inactiveCount = categories.filter((c) => !c.ativo).length;

  const handleCreateOrUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('nome', newCategory.nome);
      formData.append('descricao', newCategory.descricao);
      formData.append('ordem', String(newCategory.ordem));
      if (imageFile) formData.append('imagem', imageFile);

      if (editingId) {
        await api.put(`/category/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/category', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await fetchCategories();
      setShowModal(false);
      setEditingId(null);
      setNewCategory({ nome: '', descricao: '', ordem: 0 });
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      alert(`Erro ao ${editingId ? 'atualizar' : 'criar'} catálogo.`);
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat._id);
    setNewCategory({
      nome: cat.nome,
      descricao: cat.descricao || '',
      ordem: cat.ordem,
    });
    setImagePreview(cat.imagem_url || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este catálogo?')) {
      try {
        await api.delete(`/category/${id}`);
        await fetchCategories();
      } catch (err) {
        alert('Erro ao excluir catálogo.');
      }
    }
  };

  return (
    <>
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A237E]">
              Catálogo Global
            </span>
          </nav>
          <h2 className="text-4xl font-black text-slate-900 -tracking-tight mb-2">
            Gestão de Catálogos
          </h2>
          <p className="text-slate-500 max-w-xl">
            Organize seus produtos em categorias e catálogos. Controle a visibilidade e a
            ordem de exibição em um único lugar.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setNewCategory({ nome: '', descricao: '', ordem: 0 });
            setImagePreview(null);
            setImageFile(null);
            setShowModal(true);
          }}
          className="group flex items-center gap-3 bg-[#1A237E] text-white pl-6 pr-5 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-all shrink-0"
        >
          Novo Catálogo
          <div className="bg-white/20 p-2 rounded-xl">
            <Plus size={20} />
          </div>
        </button>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Ativos', value: String(activeCount), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total de Catálogos', value: String(categories.length), icon: BookMarked, color: 'text-[#1A237E]', bg: 'bg-indigo-50' },
          { label: 'Inativos', value: String(inactiveCount), icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Ordem Máxima', value: categories.length > 0 ? String(Math.max(...categories.map(c => c.ordem))) : '0', icon: Hash, color: 'text-blue-600', bg: 'bg-blue-50' },
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

      {/* Table */}
      <section>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-2">
          {/* Search + filters */}
          <div className="flex items-center justify-between mb-8 px-6 py-4 gap-4 flex-wrap">
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-72 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter size={18} />
              </button> */}
              <button
                onClick={() => setSortByOrder(!sortByOrder)}
                className={`p-2 rounded-lg transition-colors ${sortByOrder ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                title="Ordenar por maior ordem"
              >
                <SortAsc size={18} />
              </button>
              {/* <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <Download size={18} />
              </button> */}
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#1A237E]" size={40} />
                <p className="text-slate-500 font-medium tracking-tight">Carregando catálogos...</p>
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
                      Catálogo
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Descrição
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Ordem
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
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <BookMarked size={40} />
                          <p className="font-medium">Nenhum catálogo encontrado.</p>
                          <button
                            onClick={() => setShowModal(true)}
                            className="mt-2 text-sm font-bold text-[#1A237E] hover:underline"
                          >
                            Criar primeiro catálogo
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((cat) => (
                      <tr
                        key={cat._id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 overflow-hidden">
                              {cat.imagem_url ? (
                                <img src={cat.imagem_url} alt={cat.nome} className="w-full h-full object-cover" />
                              ) : (
                                <BookMarked size={22} className="text-[#1A237E]" />
                              )}
                            </div>
                            <p className="font-bold text-slate-900 group-hover:text-[#1A237E] transition-colors cursor-pointer">
                              {cat.nome}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-slate-500 line-clamp-1">
                            {cat.descricao || '—'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            #{cat.ordem}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          {cat.ativo ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                              <ToggleRight size={14} />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                              <ToggleLeft size={14} />
                              Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            <button onClick={() => handleEditClick(cat)} className="p-2 hover:bg-slate-100 hover:text-[#1A237E] rounded-xl transition-all" title="Editar">
                              <Edit3 size={18} />
                            </button>
                            <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all" title="Excluir">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {filtered.length > itemsPerPage && (
            <div className="mt-8 flex items-center justify-between px-4 flex-wrap gap-4">
              <p className="text-sm text-slate-500">
                Mostrando <span className="font-bold text-[#1A237E]">{paginated.length}</span> resultados de{' '}
                <span className="font-bold text-[#1A237E]">{filtered.length}</span> encontrados
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-30"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={
                      page === p
                        ? 'px-4 py-2 text-sm font-bold bg-[#1A237E] text-white rounded-lg shadow-md'
                        : 'px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all'
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-30"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </section>



      {/* ── Add Category Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1A237E]/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-[#1A237E] p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black -tracking-tight">{editingId ? 'Editar Catálogo' : 'Novo Catálogo'}</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {editingId ? 'Atualize as informações do catálogo.' : 'Adicione uma nova categoria ao sistema.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white font-bold text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block">
                  Nome do Catálogo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Móveis de Sala"
                  value={newCategory.nome}
                  onChange={(e) => setNewCategory({ ...newCategory, nome: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1A237E]/30 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block">
                  Descrição (opcional)
                </label>
                <textarea
                  placeholder="Descreva esta categoria..."
                  value={newCategory.descricao}
                  onChange={(e) => setNewCategory({ ...newCategory, descricao: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1A237E]/30 transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newCategory.ordem}
                  onChange={(e) => setNewCategory({ ...newCategory, ordem: Number(e.target.value) })}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#1A237E]/30 transition-all text-sm"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block">
                  Imagem do Catálogo
                </label>
                <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 cursor-pointer hover:border-[#1A237E]/40 transition-all bg-slate-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-28 w-28 object-cover rounded-xl" />
                  ) : (
                    <>
                      <BookMarked size={32} className="text-slate-300" />
                      <span className="text-xs text-slate-400">Clique para selecionar (jpg, png, webp · max 5MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-[#1A237E] font-bold hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateOrUpdate}
                  className="flex-[2] py-4 bg-[#1A237E] text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingId ? 'Salvar Alterações' : 'Criar Catálogo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
