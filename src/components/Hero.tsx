"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowRight, FaDownload } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useLoading } from "@/context/LoadingContext";

const Hero = () => {
  const t = useTranslations('Hero');
  const [description, setDescription] = useState(
    "Passionate and seasoned Software Engineer with a strong focus on frontend development. Proficient in TypeScript and well-versed in all aspects of web technologies. Proficient in UI UX design with responsive design creation and good experience"
  );
  const { isLoading } = useLoading();

  useEffect(() => {
    // Fetch hero description from API
    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.description) {
          setDescription(data.data.description);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch hero description:', error);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger entry of children
        delayChildren: isLoading ? 0.2 : 0, // Wait if loading, or start immediately if visited
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // Cubic bezier for smooth motion
      },
    },
  };

  return (
    <section className="max-w-7xl mx-auto pt-20 pb-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={!isLoading ? "visible" : "hidden"}
      >
        {/* 1. Status Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm font-medium mb-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          {t('status')}
        </motion.div>

        {/* 2. Judul Utama */}
        <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 md:mb-8">
          {t('greeting')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Davian Putra Swardana</span> <br />
          <span className="text-zinc-500">{t('role')}</span>
        </motion.h1>

        {/* 3. Deskripsi */}
        <motion.p variants={itemVariants} className="text-sm md:text-base lg:text-l text-zinc-400 leading-relaxed max-w-2xl mb-8 md:mb-12">
          {description}
        </motion.p>

        {/* 4. Tombol */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {t('view_project')} <FaArrowRight />
          </Link>

          <button className="px-8 py-4 bg-zinc-900 text-zinc-300 font-bold rounded-full border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all duration-300 flex items-center gap-2">
            {t('contact_me')} <FaDownload size={14} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;