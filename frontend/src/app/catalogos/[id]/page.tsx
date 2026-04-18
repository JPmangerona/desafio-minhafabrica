import { StorefrontHeader } from '@/components/layout/StorefrontHeader';
import Link from 'next/link';

export default async function CatalogoPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1';

  let categoryData: any = null;
  let bdProducts: any[] = [];

  try {
    // Busca os produtos dessa categoria específica
    const resProd = await fetch(`${API_BASE}/products/category/${id}`, { cache: 'no-store' });
    if (resProd.ok) {
      const json = await resProd.json();
      bdProducts = json.data || [];
    }
  } catch (error) {
    console.error("Erro ao buscar produtos da categoria:", error);
  }

  // Como o backend no momento não possui rota para pegar categoria específica,
  // Podemos extrair o nome da categoria no próprio produto se ele existir,
  // ou buscar a lista toda e filtrar.
  try {
    const resCat = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    if (resCat.ok) {
      const json = await resCat.json();
      const allCategories = json.data || [];
      categoryData = allCategories.find((c: any) => c._id === id);
    }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }

  // Prepara a listagem
  const displayProducts = bdProducts.map(p => ({
    id: p._id,
    name: p.nome,
    category: p.categoria?.nome || categoryData?.nome || 'Geral',
    price: `R$ ${(p.preco || 0).toFixed(2).replace('.', ',')}`,
    image: p.image_url || p.imagem_url || 'https://picsum.photos/seed/placeholder/400/533',
    badge: p.destaque ? 'Destaque' : null,
  }));

  const catName = categoryData?.nome || "Coleção";
  const catDesc = categoryData?.descricao || "Explore os lindos produtos selecionados desta coleção e transforme seu projeto.";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StorefrontHeader />

      <main className="flex-1 px-8 py-16 max-w-[1440px] mx-auto w-full">
        <div className="mb-12">
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar para a página inicial
          </Link>
          <h1 className="text-4xl font-bold -tracking-tight text-primary mb-4">
            {catName}
          </h1>
          <p className="text-on-surface-variant max-w-xl font-light leading-relaxed">
            {catDesc}
          </p>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product) => (
              <div key={product.id} className="group flex flex-col cursor-pointer">
                <div className="relative aspect-[3/4] bg-surface-container-lowest rounded-xl overflow-hidden mb-4 border border-slate-100 shadow-sm">
                  {product.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 transition-transform duration-500 group-hover:scale-105" />
                  )}

                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {product.badge}
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-primary mb-1">{product.name}</h3>
                <p className="text-on-primary-container font-semibold">{product.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm mt-8">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">category</span>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Ainda não há produtos aqui</h3>
            <p className="text-slate-500">Volte mais tarde para ver os novos produtos desta coleção.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-[1440px] mx-auto w-full">
          <div className="mb-8 md:mb-0">
            <span className="font-bold text-slate-900 text-lg">
              <span className="text-[#fa6c1a]">Minha</span><span className="text-[#1A237E]">Fábrica</span><span className="text-[#737373]">.com</span>
            </span>
            <p className="text-slate-500 text-sm mt-2 max-w-sm">
              Encontre seu melhor estilo.
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Opty. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
