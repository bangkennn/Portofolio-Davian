"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [isPresent, setIsPresent] = useState(true);

    useEffect(() => {
        // Total duration: 2.5 seconds
        const timer = setTimeout(() => {
            setIsPresent(false);
            // Allow exit animation to play before calling onComplete
            setTimeout(onComplete, 800);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence mode="wait">
            {isPresent && (
                <motion.div
                    key="preloader"
                    initial={{ y: 0 }}
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white"
                >
                    <div className="flex flex-col items-center">
                        {/* Welcome Text with White Glow Only */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9, color: "#ffffff" }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                color: "#ffffff",
                                textShadow: [
                                    "0 0 0px rgba(255, 255, 255, 0)",
                                    "0 0 30px rgba(255, 255, 255, 0.6)", // Stronger white glow
                                    "0 0 0px rgba(255, 255, 255, 0)"
                                ]
                            }}
                            transition={{
                                duration: 2.5,
                                ease: "easeInOut",
                            }}
                            className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-2"
                        >
                            Welcome
                        </motion.h1>

                        {/* Decorative Line - White only */}
                        <motion.div
                            initial={{ width: 0, opacity: 0, backgroundColor: "#ffffff" }}
                            animate={{ width: 120, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            className="h-1 bg-white rounded-full mt-4"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
