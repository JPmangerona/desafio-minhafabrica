'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import api from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      const { token, role, name } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_email', email); // Salva o email para identificar o usuário logado
        // Por enquanto redireciona para o admin dashboard
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* ── Left Side: Visual/Brand ── */}
      <div className="hidden md:flex md:w-1/2 bg-[#1A237E] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-white max-w-md">
          <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12 transition-colors gap-2 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para a loja
          </Link>
          <h1 className="text-5xl font-bold tracking-tighter mb-6"><span className="text-[#fa6c1a]">Minha</span><span className="text-[#fffff]">Fábrica</span><span className="text-[#737373]">.com</span></h1>
          <p className="text-xl text-white/80 font-light leading-relaxed">
            Gestão simplificada, exposição premium. A plataforma definitiva para o seu catálogo industrial.
          </p>
        </div>
      </div>

      {/* ── Right Side: Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white md:bg-transparent">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 block md:hidden">
            <h1 className="text-3xl font-bold tracking-tighter text-[#1A237E]">MinhaFábrica</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-slate-500">Acesse sua conta para gerenciar seu catálogo.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Email corporativo</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1A237E] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] transition-all"
                  placeholder="exemplo@empresa.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-700">Senha</label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1A237E] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A237E] hover:bg-[#121858] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-[#1A237E]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
