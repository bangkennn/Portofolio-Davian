"use client";

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AuthGuard from './AuthGuard';
import { useState, useEffect } from 'react';
import Preloader from './Preloader';
import { AnimatePresence } from 'framer-motion';
import { LoadingProvider, useLoading } from '@/context/LoadingContext';

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LoadingProvider>
            <ConditionalLayoutContent>{children}</ConditionalLayoutContent>
        </LoadingProvider>
    );
}

function ConditionalLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';
    const { isLoading, setIsLoading } = useLoading();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if user has visited before in this session
        // const hasLoaded = sessionStorage.getItem("portfolio_loaded");
        // if (hasLoaded) {
        //     setIsLoading(false);
        // }
    }, [setIsLoading]);

    const handlePreloaderComplete = () => {
        setIsLoading(false);
        sessionStorage.setItem("portfolio_loaded", "true");
    };

    if (isLoginPage) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-[#0a0a0a]">
                    {children}
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#0a0a0a]">
                <AnimatePresence mode="wait">
                    {isLoading && isMounted && <Preloader onComplete={handlePreloaderComplete} />}
                </AnimatePresence>

                <div className={`flex min-h-screen transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <Sidebar />
                    <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 md:p-8 lg:p-12 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
