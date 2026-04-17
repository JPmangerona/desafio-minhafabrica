import Link from 'next/link';

export function StorefrontHeader() {
    return (
        <nav className="bg-white/80 backdrop-blur-md text-slate-900 sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
            <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-[#1A237E]">
                        MinhaFábrica
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#colecoes" className="text-[#1A237E] font-semibold border-b-2 border-[#1A237E] pb-1 uppercase tracking-wider text-sm">
                            Coleções
                        </a>
                        <a href="#catalogos" className="text-slate-500 hover:text-[#1A237E] transition-colors uppercase tracking-wider text-sm">
                            Catálogos
                        </a>
                        <a href="#destaques" className="text-slate-500 hover:text-[#1A237E] transition-colors uppercase tracking-wider text-sm">
                            Destaques
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center bg-slate-50 px-4 py-2 rounded-full gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                        <input
                            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400"
                            placeholder="Buscar peças..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hover:bg-slate-100 p-2 rounded-full transition-all duration-300">
                            <span className="material-symbols-outlined text-[#1A237E]">shopping_bag</span>
                        </button>
                        <Link
                            href="/login"
                            className="hover:bg-slate-100 p-2 rounded-full transition-all duration-300"
                            title="Entrar"
                        >
                            <span className="material-symbols-outlined text-[#1A237E]">person_outline</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
