import { StorefrontHeader } from '@/components/layout/StorefrontHeader';
import Link from 'next/link';

const fallbackCategories = [
  {
    nome: 'Mobiliário Arquitetural',
    count: '124 itens',
    imagem_url: 'https://picsum.photos/seed/arch-furniture/600/700',
  },
  {
    nome: 'Iluminação Ambiente',
    count: '86 itens',
    imagem_url: 'https://picsum.photos/seed/ambient-light/600/300',
  },
  {
    nome: 'Decoração Artesanal',
    count: '210 itens',
    imagem_url: 'https://picsum.photos/seed/artisan-decor/600/300',
  },
  {
    nome: 'Têxteis Premium',
    count: '54 itens',
    imagem_url: 'https://picsum.photos/seed/premium-textiles/600/700',
  },
];

const fallbackProducts = [
  {
    id: 1,
    name: 'Poltrona Esfera',
    category: 'Mobiliário',
    price: 'R$ 9.250,00',
    image: 'https://picsum.photos/seed/sphere-chair/400/533',
    badge: null,
  },
  {
    id: 2,
    name: 'Luminária Pendente Onix',
    category: 'Iluminação',
    price: 'R$ 4.600,00',
    image: 'https://picsum.photos/seed/onix-pendant/400/533',
    badge: 'Limitado',
  },
  {
    id: 3,
    name: 'Mesa de Apoio Travertino',
    category: 'Sala de Estar',
    price: 'R$ 6.200,00',
    image: 'https://picsum.photos/seed/travertine-table/400/533',
    badge: null,
  },
  {
    id: 4,
    name: 'Tapete Textura Lã',
    category: 'Têxteis',
    price: 'R$ 12.000,00',
    image: 'https://picsum.photos/seed/wool-texture/400/533',
    badge: null,
  },
  {
    id: 5,
    name: 'Sofá Modular Cleo',
    category: 'Mobiliário',
    price: 'R$ 28.500,00',
    image: 'https://picsum.photos/seed/cleo-sofa/400/533',
    badge: 'Novo',
  },
  {
    id: 6,
    name: 'Vaso Cerâmica Orgânica',
    category: 'Decoração',
    price: 'R$ 890,00',
    image: 'https://picsum.photos/seed/organic-vase/400/533',
    badge: null,
  },
  {
    id: 7,
    name: 'Luminária de Chão Arc',
    category: 'Iluminação',
    price: 'R$ 3.400,00',
    image: 'https://picsum.photos/seed/arc-floor-lamp/400/533',
    badge: null,
  },
  {
    id: 8,
    name: 'Cadeira Barcelona',
    category: 'Mobiliário',
    price: 'R$ 7.800,00',
    image: 'https://picsum.photos/seed/barcelona-chair/400/533',
    badge: 'Limitado',
  },
];

export default async function StorefrontHome() {
  let bdCategories: any[] = [];
  let bdProducts: any[] = [];
  try {
    const resCat = await fetch('http://localhost:5000/category', { cache: 'no-store' });
    if (resCat.ok) {
      bdCategories = await resCat.json();
    }
  } catch (error) {
    console.error("Erro ao buscar catálogos:", error);
  }

  try {
    const resProd = await fetch('http://localhost:5000/product', { cache: 'no-store' });
    if (resProd.ok) {
      bdProducts = await resProd.json();
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  // Hero Section (Catálogo ordem 1)
  const heroCat = bdCategories.find((c) => c.ordem === 1 && c.ativo);
  const heroData = heroCat ? {
    title: heroCat.nome,
    description: heroCat.descricao || 'Descubra mobiliário escultural e objetos curados desenvolvidos para transformar seu espaço em uma galeria particular.',
    image: heroCat.imagem_url || 'https://picsum.photos/seed/luxury-living-room/1400/700'
  } : {
    title: 'Coleção Overzide',
    description: 'Descubra mobiliário escultural e objetos curados desenvolvidos para transformar seu espaço em uma galeria particular.',
    image: 'https://picsum.photos/seed/luxury-living-room/1400/700'
  };

  // Bento Grid (Catálogos ordem 2, 3, 4, 5)
  // Prepara os 4 itens para a grid. Se não existir, preenchemos com os placeholders originais.
  const displayCategories = [2, 3, 4, 5].map((order, index) => {
    const cat = bdCategories.find((c) => c.ordem === order && c.ativo);
    if (cat) {
      return {
        name: cat.nome,
        count: cat.descricao || 'Ver coleção', // Usamos a descrição como um "texto extra"
        image: cat.imagem_url || fallbackCategories[index].imagem_url,
      };
    }
    return {
      name: fallbackCategories[index].nome,
      count: fallbackCategories[index].count,
      image: fallbackCategories[index].imagem_url,
    };
  });

  // Filtra apenas produtos com destaque == true
  const destaqueProducts = bdProducts.filter(p => p.destaque === true).map(p => ({
    id: p._id,
    name: p.nome,
    category: p.categoria?.nome || 'Geral',
    price: `R$ ${p.preco.toFixed(2).replace('.', ',')}`, // Formatação simples BRL
    image: p.imagem_url || fallbackProducts[0].image,
    badge: null,
  }));

  // Se não houver nenhum produto em destaque ainda, usamos os placeholders para a loja não ficar vazia
  const displayProducts = destaqueProducts.length > 0 ? destaqueProducts : fallbackProducts;

  return (
    <div className="min-h-screen bg-white">
      <StorefrontHeader />
      {/* ── Hero Section ── */}
      <section className="px-8 py-12 max-w-[1440px] mx-auto" id="colecoes">
        <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroData.image}
            alt={heroData.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-primary/30 backdrop-brightness-75" />
          <div className="relative z-10 px-16 max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white mb-4 block font-medium">
              Destaque Principal
            </span>
            <h1 className="text-6xl font-bold text-white -tracking-tight mb-6 leading-tight">
              {heroData.title}
            </h1>
            <p className="text-white/90 text-lg mb-10 max-w-md font-light leading-relaxed">
              {heroData.description}
            </p>
            <div className="flex gap-4">
              <button className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
                Explorar Coleção
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Bento Grid ── */}
      <section className="px-8 py-16 max-w-[1440px] mx-auto" id="catalogos">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold -tracking-tight text-primary mb-2">
              Comprar por Categoria
            </h2>
            <p className="text-on-surface-variant font-light">
              Encontre o estilo que mais te agrada.
            </p>
          </div>
          <a
            href="#"
            className="text-primary font-semibold border-b border-primary hover:pb-1 transition-all text-sm"
          >
            Ver Todas as Categorias
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 — tall */}
          <div className="group relative aspect-square md:aspect-auto md:h-[500px] rounded-[3rem] overflow-hidden bg-surface-container-low cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayCategories[0].image}
              alt={displayCategories[0].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all" />
            <div className="absolute bottom-10 left-10">
              <h3 className="text-2xl font-bold text-white mb-1">{displayCategories[0].name}</h3>
              <p className="text-white/80 text-sm uppercase tracking-widest">{displayCategories[0].count}</p>
            </div>
          </div>

          {/* Column 2 — two halves */}
          <div className="flex flex-col gap-6">
            {displayCategories.slice(1, 3).map((cat) => (
              <div
                key={cat.name}
                className="group relative h-[238px] rounded-[3rem] overflow-hidden bg-surface-container-low cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-xs uppercase tracking-widest line-clamp-1">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3 — tall */}
          <div className="group relative aspect-square md:aspect-auto md:h-[500px] rounded-[3rem] overflow-hidden bg-surface-container-low cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayCategories[3].image}
              alt={displayCategories[3].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all" />
            <div className="absolute bottom-10 left-10">
              <h3 className="text-2xl font-bold text-white mb-1">{displayCategories[3].name}</h3>
              <p className="text-white/80 text-sm uppercase tracking-widest">{displayCategories[3].count}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="px-8 py-16 max-w-[1440px] mx-auto bg-surface-container-low rounded-[2rem] mb-8" id="destaques">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold -tracking-tight text-primary mb-4">
            Produtos Mais Procurados
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto font-light">
            Produtos versáteis que se adaptam a qualquer ocasião, e com tecnologia que permite conforto e durabilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <div key={product.id} className="group flex flex-col cursor-pointer">
              <div className="relative aspect-[3/4] bg-surface-container-lowest rounded-xl overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-xl">
                    favorite_border
                  </span>
                </div>
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

        <div className="mt-16 text-center">
          <button className="border-2 border-primary text-primary px-10 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300">
            Descobrir Mais Peças
          </button>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="px-8 py-24 max-w-[1440px] mx-auto overflow-hidden">
        <div className="bg-primary-container rounded-[3rem] p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-on-primary-container/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

          <div className="relative z-10 md:w-1/2">
            <h2 className="text-4xl font-bold text-on-primary mb-4 -tracking-tight">
              Junte-se ao Círculo Exclusivo
            </h2>
            <p className="text-on-primary-container text-lg max-w-md">
              Seja o primeiro a receber acesso exclusivo a novidades, histórias de artesãos
              e dicas de curadoria de interiores.
            </p>
          </div>

          <div className="relative z-10 md:w-1/3 w-full">
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-low/20 border-b border-on-primary-container/30 pb-2 flex items-center">
                <input
                  className="bg-transparent border-none outline-none text-on-primary placeholder:text-on-primary-container/60 w-full text-sm"
                  placeholder="Seu endereço de e-mail"
                  type="email"
                />
                <button className="text-on-primary font-bold uppercase tracking-widest text-xs shrink-0 hover:opacity-70 transition-opacity">
                  Entrar
                </button>
              </div>
              <p className="text-[10px] text-on-primary-container/60 uppercase tracking-widest">
                Ao entrar você concorda com nossa política de privacidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-[1440px] mx-auto w-full">
          <div className="mb-8 md:mb-0">
            <span className="font-bold text-slate-900 text-lg">MinhaFábrica</span>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">
              Curadoria dos melhores elementos arquiteturais para espaços modernos em todo o
              mundo.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
            <a href="#" className="text-slate-500 hover:text-[#1A237E] transition-all text-sm font-medium">
              Termos de Uso
            </a>
            <a href="#" className="text-slate-500 hover:text-[#1A237E] transition-all text-sm font-medium">
              Privacidade
            </a>
            <a href="#" className="text-slate-500 hover:text-[#1A237E] transition-all text-sm font-medium">
              Contato
            </a>
            <a href="#" className="text-slate-500 hover:text-[#1A237E] transition-all text-sm font-medium">
              Entrega
            </a>
          </div>
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end gap-4 mb-4">
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">
                language
              </span>
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">
                share
              </span>
            </div>
            <p className="text-slate-500 text-xs">
              © 2024 MinhaFábrica. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
