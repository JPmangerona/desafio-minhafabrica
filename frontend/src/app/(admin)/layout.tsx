'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/produtos', icon: 'inventory_2', label: 'Produtos' },
  { href: '/usuarios', icon: 'group', label: 'Usuários' },
  { href: '/analytics', icon: 'insights', label: 'Analytics' },
  { href: '/configuracoes', icon: 'settings', label: 'Configurações' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Sidebar ── */}
      <aside className="fixed h-full left-0 top-0 w-64 bg-slate-50 flex flex-col py-6 gap-2 shadow-sm z-40 border-r border-slate-100">
        {/* Branding */}
        <div className="px-6 mb-8">
          <h1 className="text-lg font-black text-[#1A237E] px-4 tracking-tighter">
            Admin Panel
          </h1>
          <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500 px-4 mt-1 font-semibold">
            Gerenciando Catálogo Global
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? 'bg-[#1A237E] text-white rounded-xl mx-2 px-4 py-3 flex items-center gap-3 shadow-lg shadow-indigo-900/20 transition-transform hover:scale-[1.02]'
                    : 'text-slate-500 hover:bg-slate-100 mx-2 px-4 py-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02]'
                }
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="mt-auto px-4 space-y-4">
          <Link
            href="/produtos"
            className="w-full bg-secondary text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            Novo Produto
          </Link>

          <div className="pt-4 border-t border-slate-200">
            {/* Admin profile */}
            <div className="flex items-center gap-3 px-4 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.pravatar.cc/150?img=65"
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">João Admin</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Master Admin</p>
              </div>
            </div>

            <Link
              href="/"
              className="text-slate-500 text-sm px-4 py-2 flex items-center gap-3 hover:text-secondary transition-colors rounded-lg"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Ver Loja
            </Link>
            <a
              href="#"
              className="text-slate-500 text-sm px-4 py-2 flex items-center gap-3 hover:text-error transition-colors rounded-lg"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sair
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="ml-64 min-h-screen flex-1 p-8 lg:p-12 bg-background">
        {children}
      </main>
    </div>
  );
}
