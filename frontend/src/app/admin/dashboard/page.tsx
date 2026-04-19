'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Package,
  TrendingUp,
  Layers,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  BookMarked,
  DollarSign
} from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [counts, setCounts] = useState({ users: 0, products: 0, categories: 0, inventoryValue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setCounts(data);
      } catch (err) {
        console.error('Erro ao carregar estatísticas do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total de Produtos', value: counts.products.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Catálogos', value: counts.categories.toString(), icon: BookMarked, color: 'text-[#1A237E]', bg: 'bg-indigo-50' },
    { label: 'Usuários Ativos', value: counts.users.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    {
      label: 'Valor em estoque',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(counts.inventoryValue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
  ];

  const recentActivity = [
    { id: 1, action: 'Contratar João Pedro', item: 'Vai que...', user: 'Caio Basdão', icon: AlertTriangle, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', completed: false },
    { id: 2, action: 'Painel Admin', item: 'Acessível apenas depois de logado', user: 'João Pedro', icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', completed: true },
    { id: 3, action: 'CRUD de usuários', item: 'Implementado', user: 'João Pedro', icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', completed: true },
    { id: 4, action: 'CRUD de produtos', item: 'Implementado', user: 'João Pedro', icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', completed: true },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <nav className="flex gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A237E]">
            Métricas da Plataforma
          </span>
        </nav>
        <h2 className="text-4xl font-black text-slate-900 -tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-2">Visão geral em tempo real.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
              {loading && <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-100 animate-pulse rounded-full" />}
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Atividade Recente
          </h3>
          <div className="space-y-6">
            {recentActivity.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                  <div className={`${item.iconBg} ${item.iconColor} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900">{item.action}</p>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{item.item}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {item.completed ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                      )}
                      <span className="text-[11px] font-medium text-slate-500">por {item.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health / Right Widget */}
        <div className="space-y-8">
          <div className="bg-[#1A237E] text-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-900/20">
            <h3 className="text-xl font-bold mb-4">Status do Sistema</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">API Backend</span>
                <span className="bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">MongoDB</span>
                <span className="bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Frontend</span>
                <span className="bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold">ONLINE</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Links Rápidos</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors">Documentação</button>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors">Linkedin</button>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors">GitHub</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
