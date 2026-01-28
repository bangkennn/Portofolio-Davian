"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowRight, FaDownload } from "react-icons/fa";

const Hero = () => {
  const [description, setDescription] = useState(
    "Passionate and seasoned Software Engineer with a strong focus on frontend development. Proficient in TypeScript and well-versed in all aspects of web technologies. Proficient in UI UX design with responsive design creation and good experience"
  );

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

  return (
    // UBAH: max-w-4xl MENJADI max-w-7xl agar lurus dengan Featured Section
    <section className="max-w-7xl mx-auto pt-20 pb-20 px-4">
      
      {/* 1. Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm font-medium mb-10">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        Available for Freelance & Fulltime
      </div>

      {/* 2. Judul Utama */}
      <h1 className="text-5xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Davian Putra Swardana</span> <br />
        <span className="text-zinc-500">Fullstack Developer.</span>
      </h1>

      {/* 3. Deskripsi */}
      <p className="text-l text-zinc-400 leading-relaxed max-w-2xl mb-12">
        {description}
      </p>

      {/* 4. Tombol */}
      <div className="flex flex-wrap gap-4">
        <Link 
          href="/projects" 
          className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          View Project <FaArrowRight />
        </Link>
        
        <button className="px-8 py-4 bg-zinc-900 text-zinc-300 font-bold rounded-full border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all duration-300 flex items-center gap-2">
          Contact Me <FaDownload size={14} />
        </button>
      </div>

    </section>
  );
};

export default Hero;