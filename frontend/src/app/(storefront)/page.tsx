export default function StorefrontHome() {
  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4 text-slate-800">Hello World da Vitrine! 🛍️</h2>
      <p className="text-slate-600">
        Bem-vindo ao <strong>Domínio do Cliente</strong>. Este é o catálogo público que pode ser acessado como uma funcionalidade SaaS ou White Label.
      </p>
      <div className="mt-8">
        <a href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-semibold">
          Ir para o Painel Admin &rarr;
        </a>
      </div>
    </div>
  );
}
