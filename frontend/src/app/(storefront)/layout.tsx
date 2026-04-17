import Link from 'next/link';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Top Navigation ── */}
      <nav className="bg-surface/80 backdrop-blur-md text-primary sticky top-0 z-50 border-b border-slate-100/80 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tighter text-[#1A237E]">
              MinhaFábrica
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#colecoes"
                className="text-[#1A237E] font-semibold border-b-2 border-[#1A237E] pb-1 uppercase tracking-wider text-sm"
              >
                Coleções
              </a>
              <a
                href="#lancamentos"
                className="text-slate-500 hover:text-[#1A237E] transition-colors uppercase tracking-wider text-sm"
              >
                Lançamentos
              </a>
              <a
                href="#curados"
                className="text-slate-500 hover:text-[#1A237E] transition-colors uppercase tracking-wider text-sm"
              >
                Sets Curados
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full gap-2">
              <span className="material-symbols-outlined text-outline text-xl">search</span>
              <input
                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400"
                placeholder="Buscar peças curadas..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="hover:bg-slate-100 p-2 rounded-full transition-all duration-300">
                <span className="material-symbols-outlined text-[#1A237E]">shopping_bag</span>
              </button>
              <Link
                href="/dashboard"
                className="hover:bg-slate-100 p-2 rounded-full transition-all duration-300"
                title="Painel Admin"
              >
                <span className="material-symbols-outlined text-[#1A237E]">person_outline</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
