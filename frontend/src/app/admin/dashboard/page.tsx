'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Package,
  TrendingUp,
  Layers,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Tag
} from 'lucide-react';
import api from '@/services/api';

export default function DashboardPage() {
  const [counts, setCounts] = useState({ users: 0, products: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [uRes, pRes, cRes] = await Promise.all([
          api.get('/user'),
          api.get('/product'),
          api.get('/category')
        ]);
        setCounts({
          users: uRes.data.length,
          products: pRes.data.length,
          categories: cRes.data.length
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas do dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total de Produtos', value: counts.products.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Usuários Ativos', value: counts.users.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Categorias', value: counts.categories.toString(), icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Valor em estoque', value: 'R$ 0.00', icon: Layers, color: 'text-slate-400', bg: 'bg-slate-50' },
  ];

  const recentActivity = [
    { id: 1, action: 'Novo produto cadastrado', item: 'Prensa Hidráulica X-200', user: 'Bruno Martins', time: '2 min atrás', icon: Package, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { id: 2, action: 'Novo usuário registrado', item: 'Lojas Americanas - Filial 02', user: 'Sistema', time: '15 min atrás', icon: Users, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { id: 3, action: 'Estoque baixo atingido', item: 'Eixo Rotativo 15mm', user: 'Alerta de Bot', time: '1 h atrás', icon: AlertCircle, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    { id: 4, action: 'Categoria atualizada', item: 'Ferragens de Precisão', user: 'Ana Carolina', time: '3 h atrás', icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 -tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-2">Visão geral da sua fábrica e catálogo em tempo real.</p>
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
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
            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest">Live</span>
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
                      <span className="text-[10px] font-semibold text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{item.item}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                      <span className="text-[11px] font-medium text-slate-500">por {item.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full py-4 mt-6 text-sm font-bold text-[#1A237E] hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
            Ver todas as atividades
          </button>
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
                <span className="text-white/70">MongoDB Atlas</span>
                <span className="bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">CDN Assets</span>
                <span className="bg-emerald-400/20 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold">ONLINE</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Uptime 30 dias</p>
              <p className="text-2xl font-black mt-1">99.98%</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Links Rápidos</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors">Wiki Interna</button>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors">Suporte</button>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors">Logs</button>
              <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors">API Docs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
