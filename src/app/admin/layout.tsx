"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip check untuk halaman login
    if (pathname === '/admin/login') {
      // Jika sudah login, redirect ke dashboard
      if (auth.isAuthenticated()) {
        router.push('/admin/dashboard');
      }
      return;
    }

    // Untuk halaman admin lainnya, butuh authentication
    if (!auth.isAuthenticated()) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // Halaman login tidak perlu layout dengan sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return <>{children}</>;
}

