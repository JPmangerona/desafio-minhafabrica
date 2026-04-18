'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function StorefrontHeader() {
    const [activeSection, setActiveSection] = useState('colecoes');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<{ products: any[], categories: any[] }>({ products: [], categories: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['colecoes', 'catalogos', 'destaques'];
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                const element = document.getElementById(section);
                if (element) {
                    if (scrollPosition >= element.offsetTop) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.lg\\:flex')) {
                setShowResults(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousedown', handleClickOutside);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Busca com Debounce
    useEffect(() => {
        if (searchQuery.length < 2) {
            setResults({ products: [], categories: [] });
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/v1/search?q=${searchQuery}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Erro na busca:", error);
            } finally {
                setIsLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

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
                    <div className="hidden lg:flex items-center bg-slate-50 px-4 py-2 rounded-full gap-2 relative">
                        <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                        <input
                            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400"
                            placeholder="Buscar peças..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowResults(true)}
                        />

                        {/* Dropdown de Resultados */}
                        {showResults && (searchQuery.length > 1) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] min-w-[320px]">
                                {isLoading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-[#1A237E] rounded-full mb-2" role="status"></div>
                                        <p className="text-xs text-slate-400">Buscando...</p>
                                    </div>
                                ) : (
                                    <div className="max-h-[70vh] overflow-y-auto p-2">
                                        {results.categories.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="px-4 py-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Catálogos</h4>
                                                {results.categories.map((cat: any) => (
                                                    <Link
                                                        key={cat._id}
                                                        href={`/catalogos/${cat._id}`}
                                                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                                                        onClick={() => setShowResults(false)}
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                                            {cat.imagem_url && <img src={cat.imagem_url} alt={cat.nome} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-[#1A237E]">{cat.nome}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {results.products.length > 0 && (
                                            <div>
                                                <h4 className="px-4 py-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Produtos</h4>
                                                {results.products.map((prod: any) => (
                                                    <Link
                                                        key={prod._id}
                                                        href={`/destaques`} // Idealmente teria página de detalhe, mas usaremos destaques por enquanto ou o user decide
                                                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all group"
                                                        onClick={() => setShowResults(false)}
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                                            {prod.imagem_url && <img src={prod.imagem_url} alt={prod.nome} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-slate-700 group-hover:text-[#1A237E]">{prod.nome}</span>
                                                            <span className="text-[10px] text-slate-400">R$ {prod.preco.toFixed(2)}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {results.products.length === 0 && results.categories.length === 0 && (
                                            <div className="p-8 text-center text-slate-400">
                                                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">sentiment_neutral</span>
                                                <p className="text-xs">Nenhum resultado encontrado para "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <button className="hover:bg-slate-100 p-2 rounded-full transition-all duration-300">
                            <span className="material-symbols-outlined text-[#1A237E]">shopping_bag</span>
                        </button> */}
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
