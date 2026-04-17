'use client';

import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AdminSidebar />

      {/* ── Main content ── */}
      <main className="ml-64 min-h-screen flex-1 p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
