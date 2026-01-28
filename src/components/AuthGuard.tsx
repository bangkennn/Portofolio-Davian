"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthenticated = auth.isAuthenticated();
    const isAdminPage = pathname?.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    // Jika sudah login dan mengakses halaman public (bukan admin), redirect ke dashboard
    if (isAuthenticated && !isAdminPage) {
      router.push('/admin/dashboard');
    }
  }, [pathname, router]);

  return <>{children}</>;
}

