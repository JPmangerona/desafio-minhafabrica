'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/services/api';
import {
  LayoutDashboard,
  Package,
  Users,
  BookMarked,
  Settings,
  Plus,
  Store,
  LogOut
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/produtos', icon: Package, label: 'Produtos' },
  { href: '/admin/catalogos', icon: BookMarked, label: 'Catálogos' },
  { href: '/admin/usuarios', icon: Users, label: 'Usuários' },
  //  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('user_role'));
    setUserName(localStorage.getItem('user_name'));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (_) {
      // ignora erro no endpoint, faz logout local de qualquer jeito
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      document.cookie = 'token=; Max-Age=0; path=/';
      router.push('/login');
    }
  };

  const roleLabels: Record<string, string> = {
    admin: 'Master Admin',
    editor: 'Editor de Conteúdo',
    visualizador: 'Visualizador de Dados',
    cliente: 'Painel do Cliente'
  };

  // Filtra itens baseados na função do usuário
  const displayNavItems = navItems.filter(item => {
    if (item.href === '/admin/usuarios') {
      return role === 'admin';
    }
    return true;
  });

  return (
    <aside className="fixed h-full left-0 top-0 w-64 bg-white flex flex-col py-6 gap-2 shadow-sm z-40 border-r border-slate-100">
      {/* Branding */}
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold tracking-tighter px-4">
          <span className="text-[#fa6c1a]">Minha</span><span className="text-[#1A237E]">Fábrica</span><span className="text-[#737373]">.com</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500 px-4 mt-1 font-semibold">
          Painel interno do site
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-1">
        {displayNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
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
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto px-4 space-y-4">


        <div className="pt-4 border-t border-slate-200">
          {/* Admin profile */}
          <div className="flex items-center gap-3 px-4 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.vecteezy.com/ti/vetor-gratis/p1/9292244-default-avatar-icon-vector-of-social-media-user-vetor.jpg"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                {userName || 'Usuário'}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {role ? roleLabels[role] || role : 'Administrador'}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-slate-500 text-sm px-4 py-2 flex items-center gap-3 hover:text-[#1A237E] transition-colors rounded-lg"
          >
            <Store size={18} />
            Ver Loja
          </Link>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            className="text-slate-500 text-sm px-4 py-2 flex items-center gap-3 hover:text-red-500 transition-colors rounded-lg"
          >
            <LogOut size={18} />
            Sair
          </a>
        </div>
      </div>
    </aside>
  );
}
