"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { FaGlobe, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher({ variant = 'sidebar' }: { variant?: 'sidebar' | 'floating' }) {
    const locale = useLocale();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const onSelectChange = (nextLocale: string) => {
        setIsOpen(false);
        startTransition(() => {
            document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
            router.refresh();
        });
    };

    if (!mounted) return null;

    if (variant === 'floating') {
        return (
            <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full right-0 mb-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl min-w-[160px] z-[60]"
                        >
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => onSelectChange('en')}
                                    disabled={isPending}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${locale === 'en'
                                        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    <span className="text-left w-full">English</span>
                                    {locale === 'en' && <FaCheck className="text-xs" />}
                                </button>

                                <button
                                    onClick={() => onSelectChange('id')}
                                    disabled={isPending}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${locale === 'id'
                                        ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    <span className="text-left w-full">Indonesia</span>
                                    {locale === 'id' && <FaCheck className="text-xs" />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative z-[50] flex items-center gap-3 px-5 py-3 ${isOpen ? 'bg-zinc-800 border-emerald-500/50' : 'bg-zinc-900/90 border-zinc-700'} backdrop-blur-md border rounded-full text-white shadow-xl hover:scale-105 transition-all duration-300 group`}
                >
                    <span className="font-medium text-sm">
                        {locale === 'id' ? 'ID' : 'EN'}
                    </span>
                    <FaGlobe className={`ml-1 text-zinc-500 group-hover:text-emerald-400 transition-colors ${isOpen ? 'text-emerald-400' : ''}`} />
                </button>

                {/* Overlay to close */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-[40]"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>
        );
    }

    // Default Sidebar Variant
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-4 py-2.5 bg-zinc-800/50 border ${isOpen ? 'border-emerald-500/50 bg-zinc-800' : 'border-zinc-800'} rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-300 w-full group`}
            >
                <span className="font-medium text-sm flex-1 text-left ml-1">
                    {locale === 'id' ? 'Indonesia' : 'English'}
                </span>
                <FaGlobe className={`text-zinc-500 group-hover:text-emerald-400 transition-colors ${isOpen ? 'text-emerald-400' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 w-full mb-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl z-50"
                    >
                        <div className="p-1.5 space-y-1">
                            <button
                                onClick={() => onSelectChange('en')}
                                disabled={isPending}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${locale === 'en'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                <span>English</span>
                                {locale === 'en' && <FaCheck className="text-xs" />}
                            </button>

                            <button
                                onClick={() => onSelectChange('id')}
                                disabled={isPending}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${locale === 'id'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                    }`}
                            >
                                <span>Indonesia</span>
                                {locale === 'id' && <FaCheck className="text-xs" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
