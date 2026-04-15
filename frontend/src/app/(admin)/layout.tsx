export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-900 text-slate-300 p-4 shrink-0">
        <h1 className="text-xl font-bold text-white mb-8 border-b border-slate-700 pb-4">MinhaFabrica</h1>
        <ul className="space-y-4">
          <li>
            <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
          </li>
          <li>
            <a href="/produtos" className="hover:text-white transition-colors">Produtos</a>
          </li>
          <li>
            <a href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mt-8 block">
              &larr; Voltar para Loja
            </a>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
