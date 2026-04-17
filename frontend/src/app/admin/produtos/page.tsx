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
  Copy, 
  Package, 
  Tag, 
  AlertTriangle, 
  DollarSign,
  Loader2,
  AlertCircle 
} from 'lucide-react';
import api from '@/services/api';
import { Product } from '@/types';

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ nome: '', preco: 0, estoque: 0 });
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/product');
      setProducts(response.data);
    } catch (err: any) {
      setError('Erro ao carregar catálogo de produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = async () => {
    try {
      await api.post('/product', newProduct);
      await fetchProducts();
      setShowModal(false);
      setNewProduct({ nome: '', preco: 0, estoque: 0 });
    } catch (err: any) {
      alert('Erro ao cadastrar produto.');
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
            Gestão de Produtos
          </h2>
          <p className="text-slate-500 max-w-xl">
            Cadastre, edite e organize todos os produtos do catálogo. Controle estoques e
            preços em um único lugar.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-3 bg-[#1A237E] text-white pl-6 pr-5 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-all shrink-0"
        >
          Novo Produto
          <div className="bg-white/20 p-2 rounded-xl">
            <Plus size={20} />
          </div>
        </button>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total de Produtos', value: '1.284', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Categorias Ativas', value: '18', icon: Tag, color: 'text-[#1A237E]', bg: 'bg-indigo-50' },
          { label: 'Estoque Baixo', value: '7', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Valor em Estoque', value: 'R$ 2,4M', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
              <p className={`text-2xl font-black text-slate-900`}>{stat.value}</p>
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
                placeholder="Buscar por nome ou SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-72 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <SortAsc size={18} />
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#1A237E]" size={40} />
                <p className="text-slate-500 font-medium tracking-tight">Preparando catálogo...</p>
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
                      Produto
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      SKU
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Preço
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Estoque
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
                        Nenhum produto no catálogo.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center text-slate-300">
                              {product.imagem_url ? (
                                <img
                                  src={product.imagem_url}
                                  alt={product.nome}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package size={24} />
                              )}
                            </div>
                            <p className="font-bold text-slate-900 group-hover:text-[#1A237E] transition-colors cursor-pointer">
                              {product.nome}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {product.sku || 'N/A'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-bold text-slate-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                              <span className={`text-sm font-bold ${product.estoque <= 5 ? 'text-red-500' : 'text-slate-700'}`}>
                                  {product.estoque} un.
                              </span>
                              {product.estoque <= 5 && (
                                  <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit">
                                      Baixo Estoque
                                  </span>
                              )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            <button className="p-2 hover:bg-slate-100 hover:text-[#1A237E] rounded-xl transition-all" title="Editar">
                              <Edit3 size={18} />
                            </button>
                            <button className="p-2 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all" title="Duplicar">
                              <Copy size={18} />
                            </button>
                            <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all" title="Excluir">
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
          <div className="mt-8 flex items-center justify-between px-4 flex-wrap gap-4">
            <p className="text-sm text-slate-500">
              Mostrando <span className="font-bold text-[#1A237E]">{filtered.length}</span> resultados de{' '}
              <span className="font-bold text-[#1A237E]">{products.length}</span> produtos
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
              >
                Anterior
              </button>
              {[1, 2, 3].map((p) => (
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
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 flex flex-col md:flex-row justify-between items-center py-12 border-t border-slate-100">
        <p className="text-xs text-on-surface-variant font-medium">
          © 2024 MinhaFábrica. Todos os direitos reservados.
        </p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="text-xs text-slate-500 hover:underline">Termos de Uso</a>
          <a href="#" className="text-xs text-slate-500 hover:underline">Privacidade</a>
          <a href="#" className="text-xs text-slate-500 hover:underline">Suporte</a>
        </div>
      </footer>

      {/* ── Add Product Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-primary p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black -tracking-tight">Novo Produto</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Adicione um novo item ao catálogo.
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
                  Nome do Produto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Poltrona Barcelona"
                  value={newProduct.nome}
                  onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                    Preço Inicial (R$)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProduct.preco}
                    onChange={(e) => setNewProduct({ ...newProduct, preco: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                    Qtd. Estoque
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProduct.estoque}
                    onChange={(e) => setNewProduct({ ...newProduct, estoque: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
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
                  className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Criar Produto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
