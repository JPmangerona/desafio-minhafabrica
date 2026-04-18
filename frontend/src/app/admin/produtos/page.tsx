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
  BookMarked,
  AlertTriangle,
  DollarSign,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { Product, Category } from '@/types';

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({ nome: '', preco: 0, custo: 0, estoque: 0, destaque: false, ativo: true, categoria: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [page, setPage] = useState(1);

  const [role, setRole] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllAdmin();
      setProducts(data);
    } catch (err: any) {
      setError('Erro ao carregar catálogo de produtos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllPublic();
      setCategories(data);
    } catch (err: any) {
      console.error('Erro ao carregar categorias', err);
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem('user_role'));
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const itemsPerPage = 10;

  const filtered = products
    .filter(
      (p) =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortByPrice) return b.preco - a.preco;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCreateOrUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('nome', newProduct.nome);
      formData.append('preco', String(newProduct.preco));
      formData.append('custo', String(newProduct.custo));
      formData.append('estoque', String(newProduct.estoque));
      formData.append('destaque', String(newProduct.destaque));
      formData.append('ativo', String(newProduct.ativo));
      if (newProduct.categoria) formData.append('categoria', newProduct.categoria);
      if (imageFile) formData.append('imagem', imageFile);

      if (editingId) {
        await productService.update(editingId, formData);
      } else {
        await productService.create(formData);
      }

      await fetchProducts();
      setShowModal(false);
      setEditingId(null);
      setNewProduct({ nome: '', preco: 0, custo: 0, estoque: 0, destaque: false, ativo: true, categoria: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      const message = err.response?.data?.message || `Erro ao ${editingId ? 'atualizar' : 'cadastrar'} produto.`;
      alert(message);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setNewProduct({
      nome: product.nome,
      preco: product.preco,
      custo: product.custo || 0,
      estoque: product.estoque,
      destaque: product.destaque || false,
      ativo: product.ativo !== undefined ? product.ativo : true,
      categoria: typeof product.categoria === 'object' ? product.categoria._id : (product.categoria || ''),
    });
    setImagePreview(product.imagem_url || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.delete(id);
        await fetchProducts();
      } catch (err) {
        alert('Erro ao excluir produto.');
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
            Gestão de Produtos
          </h2>
          <p className="text-slate-500 max-w-xl">
            Cadastre, edite e organize todos os produtos do catálogo. Controle estoques e
            preços em um único lugar.
          </p>
        </div>
        {role !== 'visualizador' && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewProduct({ nome: '', preco: 0, custo: 0, estoque: 0, destaque: false, ativo: true, categoria: '' });
              setImagePreview(null);
              setImageFile(null);
              setShowModal(true);
            }}
            className="group flex items-center gap-3 bg-[#1A237E] text-white pl-6 pr-5 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-all shrink-0"
          >
            Novo Produto
            <div className="bg-white/20 p-2 rounded-xl">
              <Plus size={20} />
            </div>
          </button>
        )}
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total de Produtos', value: String(products.length), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Catálogos', value: String(categories.length), icon: BookMarked, color: 'text-[#1A237E]', bg: 'bg-indigo-50' },
          { label: 'Estoque Baixo', value: String(products.filter(p => p.estoque <= 5).length), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          {
            label: 'Valor em Estoque',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              products.reduce((acc, p) => acc + (p.custo || 0) * p.estoque, 0)
            ),
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
          },
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
              {/* <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter size={18} />
              </button> */}
              <button
                onClick={() => setSortByPrice(!sortByPrice)}
                className={`p-2 rounded-lg transition-colors ${sortByPrice ? 'bg-[#1A237E] text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                title="Ordenar por maior preço"
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
                      Catálogo
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Preço
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Estoque
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-slate-400">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center text-slate-300 transition-all ${product.destaque ? 'ring-2 ring-indigo-500/30 ring-offset-2 shadow-sm' : ''}`}>
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
                          {typeof product.categoria === 'object' ? (
                            <span className="text-xs font-bold text-[#6366F1] bg-[#EEF2FF] px-3 py-1.5 rounded-full uppercase tracking-tighter border border-[#6366F1]/20">
                              {product.categoria.nome}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full uppercase tracking-tighter border border-amber-200">
                              Sem Categoria
                            </span>
                          )}
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
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             {product.ativo ? (
                               <>
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                 <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Ativo</span>
                               </>
                             ) : (
                               <>
                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Inativo</span>
                               </>
                             )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            {role !== 'visualizador' ? (
                              <>
                                <button onClick={() => handleEditClick(product)} className="p-2 hover:bg-slate-100 hover:text-[#1A237E] rounded-xl transition-all" title="Editar">
                                  <Edit3 size={18} />
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all" title="Excluir">
                                  <Trash2 size={18} />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-slate-300">Somente Leitura</span>
                            )}
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



      {/* ── Add Product Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-primary p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black -tracking-tight">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {editingId ? 'Atualize as informações do produto.' : 'Adicione um novo item ao catálogo.'}
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
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                    Categoria Mestre
                  </label>
                  <select
                    value={newProduct.categoria}
                    onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer text-slate-700"
                  >
                    <option value="">Nenhuma Categoria</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Preço + Custo + Estoque */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                    Preço (R$)
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
                    Custo (R$)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProduct.custo}
                    onChange={(e) => setNewProduct({ ...newProduct, custo: Number(e.target.value) })}
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

              {/* Destaque Toggle */}
              <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Produto Destaque</h4>
                  <p className="text-xs text-slate-500">Aparecerá na vitrine principal da loja</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={newProduct.destaque}
                    onChange={(e) => setNewProduct({ ...newProduct, destaque: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A237E]"></div>
                </label>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Status do Produto</h4>
                  <p className="text-xs text-slate-500">Define se o produto está público no catálogo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={newProduct.ativo}
                    onChange={(e) => setNewProduct({ ...newProduct, ativo: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  Imagem do Produto
                </label>
                <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 cursor-pointer hover:border-primary/40 transition-all bg-slate-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-28 w-28 object-cover rounded-xl" />
                  ) : (
                    <>
                      <Package size={32} className="text-slate-300" />
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
                  className="flex-1 py-4 text-primary font-bold hover:bg-surface-container-high rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateOrUpdate}
                  className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingId ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
