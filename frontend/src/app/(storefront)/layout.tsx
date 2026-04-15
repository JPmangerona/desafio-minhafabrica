export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">MinhaVitrine</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-indigo-200">Home</a>
          <a href="/login" className="hover:text-indigo-200">Login</a>
        </div>
      </nav>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
