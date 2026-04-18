'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function StorefrontHeader() {
    const [activeSection, setActiveSection] = useState('colecoes');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['colecoes', 'catalogos', 'destaques'];
            // Pegamos o scroll atual somado com um offset (ex: metade da tela) para acionar a troca
            // quando a seção estiver chegando no meio da janela.
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const element = document.getElementById(section);
                if (element) {
                    if (scrollPosition >= element.offsetTop) {
                        setActiveSection(section);
                        break; // Ao achar o primeiro de baixo pra cima que já passou, paramos.
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Chama no carregamento inicial
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const linkBaseClass = "uppercase tracking-wider text-sm transition-all duration-300 pb-1 border-b-2";
    const getLinkClass = (section: string) => {
        return activeSection === section 
            ? `${linkBaseClass} text-[#1A237E] font-semibold border-[#1A237E]` 
            : `${linkBaseClass} text-slate-500 hover:text-[#1A237E] font-medium border-transparent hover:border-[#1A237E]/30`;
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md text-slate-900 sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
            <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                        <span className="text-[#fa6c1a]">Minha</span><span className="text-[#1A237E]">Fábrica</span><span className="text-[#737373]">.com</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <a 
                            href="#colecoes" 
                            className={getLinkClass('colecoes')}
                            onClick={(e) => { e.preventDefault(); document.getElementById('colecoes')?.scrollIntoView({ behavior: 'smooth' }); }}
                        >
                            Coleções
                        </a>
                        <a 
                            href="#catalogos" 
                            className={getLinkClass('catalogos')}
                            onClick={(e) => { e.preventDefault(); document.getElementById('catalogos')?.scrollIntoView({ behavior: 'smooth' }); }}
                        >
                            Catálogos
                        </a>
                        <a 
                            href="#destaques" 
                            className={getLinkClass('destaques')}
                            onClick={(e) => { e.preventDefault(); document.getElementById('destaques')?.scrollIntoView({ behavior: 'smooth' }); }}
                        >
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
