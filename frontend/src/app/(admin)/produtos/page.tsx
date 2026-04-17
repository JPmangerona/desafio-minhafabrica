'use client';

import { useState } from 'react';

const mockProducts = [
  {
    id: 1,
    name: 'Poltrona Esfera',
    category: 'Mobiliário',
    categoryColor: 'bg-primary/10 text-primary',
    price: 'R$ 9.250,00',
    stock: 12,
    sku: 'MOB-001',
    image: 'https://picsum.photos/seed/lounge-chair/80/80',
  },
  {
    id: 2,
    name: 'Luminária Pendente Onix',
    category: 'Iluminação',
    categoryColor: 'bg-[#ffdcbe]/60 text-[#693c00]',
    price: 'R$ 4.600,00',
    stock: 5,
    sku: 'ILU-007',
    image: 'https://picsum.photos/seed/pendant-lamp/80/80',
  },
  {
    id: 3,
    name: 'Mesa de Apoio Travertino',
    category: 'Sala de Estar',
    categoryColor: 'bg-[#c6c5d4]/40 text-[#454652]',
    price: 'R$ 6.200,00',
    stock: 8,
    sku: 'SAL-014',
    image: 'https://picsum.photos/seed/marble-table/80/80',
  },
  {
    id: 4,
    name: 'Tapete Textura Lã',
    category: 'Têxteis',
    categoryColor: 'bg-secondary/10 text-secondary',
    price: 'R$ 12.000,00',
    stock: 3,
    sku: 'TEX-022',
    image: 'https://picsum.photos/seed/wool-rug/80/80',
  },
  {
    id: 5,
    name: 'Sofá Modular Cleo',
    category: 'Mobiliário',
    categoryColor: 'bg-primary/10 text-primary',
    price: 'R$ 28.500,00',
    stock: 2,
    sku: 'MOB-038',
    image: 'https://picsum.photos/seed/modular-sofa/80/80',
  },
  {
    id: 6,
    name: 'Vaso Cerâmica Orgânica',
    category: 'Decoração',
    categoryColor: 'bg-[#c6c5d4]/40 text-[#454652]',
    price: 'R$ 890,00',
    stock: 24,
    sku: 'DEC-055',
    image: 'https://picsum.photos/seed/ceramic-vase/80/80',
  },
];

const categories = ['Mobiliário', 'Iluminação', 'Sala de Estar', 'Têxteis', 'Decoração'];

export default function ProdutosPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: categories[0], price: '', stock: '' });
  const [page, setPage] = useState(1);

  const filtered = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    alert(`Produto "${newProduct.name}" criado com sucesso! (mock)`);
    setShowModal(false);
    setNewProduct({ name: '', category: categories[0], price: '', stock: '' });
  };

  return (
    <>
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              Catálogo Global
            </span>
          </nav>
          <h2 className="text-5xl font-black text-primary -tracking-tight mb-2">
            Gestão de Produtos
          </h2>
          <p className="text-on-surface-variant max-w-xl">
            Cadastre, edite e organize todos os produtos do catálogo. Controle estoques e
            preços em um único lugar.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-3 bg-secondary text-white pl-6 pr-4 py-4 rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all shrink-0"
        >
          Novo Produto
          <div className="bg-white/20 p-2 rounded-full">
            <span className="material-symbols-outlined">add_box</span>
          </div>
        </button>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total de Produtos', value: '1.284', icon: 'inventory_2', color: 'text-primary' },
          { label: 'Categorias Ativas', value: '18', icon: 'category', color: 'text-secondary' },
          { label: 'Estoque Baixo', value: '7', icon: 'warning', color: 'text-error' },
          { label: 'Valor em Estoque', value: 'R$ 2,4M', icon: 'payments', color: 'text-[#693c00]' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/30">
            <div className="flex items-center gap-3 mb-2">
              <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
              <span className="text-xs text-on-surface-variant font-medium">{stat.label}</span>
            </div>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <section>
        <div className="bg-surface-container-low p-8 rounded-[2rem] overflow-hidden">
          {/* Search + filters */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-outline-variant/20 shadow-sm">
              <span className="material-symbols-outlined text-slate-400">search</span>
              <input
                type="text"
                placeholder="Buscar por nome, categoria ou SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-72 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-white rounded-lg transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-white rounded-lg transition-colors">
                <span className="material-symbols-outlined">sort</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-white rounded-lg transition-colors">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          {/* Product table */}
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-surface-variant">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                      Produto
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                      SKU
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                      Categoria
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                      Preço
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                      Estoque
                    </th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-surface-container-high/40 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="font-bold text-primary group-hover:underline cursor-pointer">
                              {product.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-mono text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.categoryColor}`}
                          >
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-semibold text-on-surface">{product.price}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`text-sm font-bold ${
                              product.stock <= 5 ? 'text-error' : 'text-secondary'
                            }`}
                          >
                            {product.stock} un.
                          </span>
                          {product.stock <= 5 && (
                            <span className="ml-2 text-[10px] font-bold uppercase text-error bg-error-container px-2 py-0.5 rounded-full">
                              Baixo
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 hover:bg-primary-fixed text-primary rounded-xl transition-all"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              className="p-2 hover:bg-surface-container-high text-on-surface-variant rounded-xl transition-all"
                              title="Duplicar"
                            >
                              <span className="material-symbols-outlined text-lg">content_copy</span>
                            </button>
                            <button
                              className="p-2 hover:bg-error-container text-error rounded-xl transition-all"
                              title="Excluir"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between px-4 flex-wrap gap-4">
            <p className="text-sm text-on-surface-variant">
              Mostrando <span className="font-bold text-primary">{filtered.length}</span> de{' '}
              <span className="font-bold text-primary">1.284</span> produtos
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
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                    Categoria
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                    Estoque
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
                  Preço (R$)
                </label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
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
