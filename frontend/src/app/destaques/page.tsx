import { StorefrontHeader } from '@/components/layout/StorefrontHeader';
import Link from 'next/link';

export default async function DestaquesPage() {
  let bdProducts: any[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const resProd = await fetch(`${apiUrl}/api/v1/products`, { cache: 'no-store' });
    if (resProd.ok) {
      bdProducts = await resProd.json();
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  // Filtra apenas produtos com destaque == true
  const destaqueProducts = bdProducts.filter(p => p.destaque === true).map(p => ({
    id: p._id,
    name: p.nome,
    category: p.categoria?.nome || 'Geral',
    price: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
    image: p.imagem_url || 'https://picsum.photos/seed/placeholder/400/533',
    badge: null,
  }));

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
            Todos os Destaques
          </h1>
          <p className="text-on-surface-variant max-w-xl font-light">
            Confira a lista completa de peças e objetos curados especialmente para a nossa vitrine de destaque.
          </p>
        </div>

        {destaqueProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {destaqueProducts.map((product) => (
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
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">inventory_2</span>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Nenhum destaque encontrado</h3>
            <p className="text-slate-500">Volte mais tarde para ver novas coleções e peças incríveis publicadas.</p>
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
