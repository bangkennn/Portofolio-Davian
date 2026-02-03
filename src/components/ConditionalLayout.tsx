"use client";

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AuthGuard from './AuthGuard';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Halaman login tidak perlu sidebar
  if (isLoginPage) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-[#0a0a0a]">
          {children}
        </div>
      </AuthGuard>
    );
  }

  // Halaman lainnya dengan sidebar
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 md:p-8 lg:p-12 w-full">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}

