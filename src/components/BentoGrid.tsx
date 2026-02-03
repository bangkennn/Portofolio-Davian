"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Marquee from "react-fast-marquee";
import { FaLaptopCode, FaUser, FaTools, FaTrophy, FaComments, FaLayerGroup, FaFileAlt, FaChartLine, FaMedal, FaAward } from "react-icons/fa";
// HAPUS SiVuechain & SiLaravel yang bikin error
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiNodedotjs, SiSupabase, SiPostgresql, SiGit, SiDocker, SiFigma } from "react-icons/si";

// Default images fallback
const defaultStackImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format"
];

// --- 2. DATA SKILLS UNTUK MARQUEE ---
const topSkills = [
  { name: "React", icon: SiReact, color: "text-blue-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "Framer", icon: SiFramer, color: "text-white" },
];

const bottomSkills = [
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "Supabase", icon: SiSupabase, color: "text-emerald-400" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-300" },
  { name: "Docker", icon: SiDocker, color: "text-blue-500" },
  { name: "Figma", icon: SiFigma, color: "text-purple-400" },
];

// ============================================================================
// KOMPONEN UTAMA: BENTO GRID
// ============================================================================
const BentoGrid = () => {
  const [stackImages, setStackImages] = useState<string[]>(defaultStackImages);
  const [projectImages, setProjectImages] = useState<string[]>([]);

  // Fetch images from API
  useEffect(() => {
    // Fetch About Me images
    fetch('/api/bento-grid?type=about_me')
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          const imageUrls = data.data.map((img: any) => img.image_url);
          setStackImages(imageUrls);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch about me images:', error);
      });

    // Fetch Project images
    fetch('/api/bento-grid?type=project')
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          const imageUrls = data.data.map((img: any) => img.image_url);
          setProjectImages(imageUrls);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch project images:', error);
      });
  }, []);

  // Menambahkan style untuk menyembunyikan scrollbar pada marquee
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'marquee-scrollbar-hide';
    style.textContent = `
      .marquee-container * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .marquee-container *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      .marquee-container .rfm-marquee-container,
      .marquee-container .rfm-marquee,
      .marquee-container .rfm-marquee-container > div {
        overflow: hidden !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .marquee-container .rfm-marquee-container::-webkit-scrollbar,
      .marquee-container .rfm-marquee::-webkit-scrollbar,
      .marquee-container .rfm-marquee-container > div::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;

    // Hapus style lama jika ada
    const existingStyle = document.getElementById('marquee-scrollbar-hide');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById('marquee-scrollbar-hide');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  return (
    <section className="py-10 md:py-20 px-4 max-w-7xl mx-auto">

      {/* Header Section */}
      <div className="mb-8 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
          <FaLayerGroup className="text-emerald-500" /> Featured Sections
        </h2>
        <p className="text-zinc-500 mt-2 text-sm md:text-l">Explore everything I've crafted, contributed, and accomplished.</p>
      </div>

      {/* GRID UTAMA - Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto lg:auto-rows-[180px]">

        {/* 1. PROJECTS SHOWCASE */}
        <SpotlightCard className="lg:col-span-2 lg:row-span-2 bg-zinc-900/50 group overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="relative z-30 h-full flex flex-col justify-between p-6">
            <div className="relative z-30">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 border border-zinc-700 text-emerald-400 text-xl">
                <FaLaptopCode />
              </div>
              <h3 className="text-2xl font-bold text-white">Projects Showcase</h3>
              <p className="text-zinc-400 mt-2 max-w-[250px]">A selection of real apps built to solve real problems.</p>
            </div>

            {/* Display Project Images or Mockup */}
            {projectImages.length > 0 ? (
              <div className="absolute right-[-30px] bottom-[-50px] flex flex-col gap-3 rotate-[-12deg] group-hover:rotate-[-5deg] group-hover:scale-105 transition-all duration-500 ease-out opacity-70 group-hover:opacity-100 z-10">
                {projectImages.slice(0, 3).map((imgUrl, index) => (
                  <div
                    key={index}
                    className={`w-56 h-28 rounded-lg shadow-2xl overflow-hidden border ${index === 0 ? 'translate-x-10 opacity-60 border-zinc-700/50' :
                        index === 1 ? 'translate-x-5 opacity-80 border-zinc-700/50' :
                          'border-emerald-500/20'
                      }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Project ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="absolute right-[-30px] bottom-[-50px] flex flex-col gap-3 rotate-[-12deg] group-hover:rotate-[-5deg] group-hover:scale-105 transition-all duration-500 ease-out opacity-70 group-hover:opacity-100 z-10">
                <div className="w-56 h-28 bg-zinc-800 border border-zinc-700/50 rounded-lg shadow-2xl translate-x-10 opacity-60"></div>
                <div className="w-56 h-28 bg-zinc-900 border border-zinc-700/50 rounded-lg shadow-2xl translate-x-5 opacity-80"></div>
                <div className="w-56 h-28 bg-zinc-950 border border-emerald-500/20 rounded-lg shadow-2xl"></div>
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* 2. ABOUT ME (STACK) */}
        <SpotlightCard className="lg:col-span-1 lg:row-span-2 bg-zinc-900/50 p-6 flex flex-col items-center justify-between overflow-hidden min-h-[350px] lg:min-h-0">
          <div className="text-center relative z-20 mb-2">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-3 mx-auto border border-zinc-700 text-blue-400 text-xl">
              <FaUser />
            </div>
            <h3 className="text-lg font-bold text-white">About Me</h3>
            <p className="text-xs text-zinc-500 mt-1">Who I am and what I do.</p>
          </div>

          <div className="relative z-20 w-full flex-1 flex items-center justify-center mt-10">
            <div style={{ width: 140, height: 170, position: 'relative' }}>
              <Stack
                randomRotation={true}
                sensitivity={150}
                sendToBackOnClick={true}
                cards={stackImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`about-${i}`}
                    className="w-full h-full object-cover rounded-2xl pointer-events-none border-2 border-white/10 shadow-black/50 shadow-xl"
                  />
                ))}
              />
            </div>
          </div>
        </SpotlightCard>

        {/* 3. SKILLS & TOOLS (MARQUEE) */}
        <SpotlightCard className="lg:col-span-1 lg:row-span-2 bg-zinc-900/50 flex flex-col overflow-hidden min-h-[350px] lg:min-h-0">
          <div className="text-center p-6 pb-4 relative z-20">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 mx-auto border border-zinc-700 text-orange-400 text-xl">
              {/* Grid 3x3 icon */}
              <div className="grid grid-cols-3 gap-1 w-6 h-6">
                <div className="bg-orange-400 rounded-sm"></div>
                <div className="bg-orange-400/60 rounded-sm"></div>
                <div className="bg-orange-400 rounded-sm"></div>
                <div className="bg-orange-400/60 rounded-sm"></div>
                <div className="bg-orange-400 rounded-sm"></div>
                <div className="bg-orange-400/60 rounded-sm"></div>
                <div className="bg-orange-400 rounded-sm"></div>
                <div className="bg-orange-400/60 rounded-sm"></div>
                <div className="bg-orange-400 rounded-sm"></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Skills & Tools</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-9">Covering mobile, web, AI, and UI/UX technologies.</p>
          </div>

          {/* Marquee area - no padding, touches edges */}
          <div className="relative z-20 flex flex-col gap-7 w-full mt-auto marquee-container">
            {/* Top row - moves left */}
            <div className="overflow-hidden w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <Marquee gradient={false} speed={40} direction="left" pauseOnHover={true}>
                {[...topSkills, ...topSkills].map((skill, i) => (
                  <SkillBadge key={`top-${i}`} name={skill.name} icon={skill.icon} color={skill.color} />
                ))}
              </Marquee>
            </div>

            {/* Bottom row - moves right */}
            <div className="overflow-hidden w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <Marquee gradient={false} speed={40} direction="right" pauseOnHover={true}>
                {[...bottomSkills, ...bottomSkills].map((skill, i) => (
                  <SkillBadge key={`bottom-${i}`} name={skill.name} icon={skill.icon} color={skill.color} />
                ))}
              </Marquee>
            </div>
          </div>
        </SpotlightCard>

        {/* 4. ACHIEVEMENTS */}
        <SpotlightCard className="md:col-span-1 lg:row-span-1 bg-zinc-900/50 p-6 flex flex-col justify-between overflow-hidden min-h-[320px]">
          <div className="relative z-20 text-center">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-3 mx-auto border border-zinc-700 text-yellow-400 relative">
              <FaFileAlt className="text-yellow-400" />
              <FaChartLine className="absolute -bottom-0.5 -right-0.5 text-yellow-500 text-xs" />
            </div>
            <h3 className="font-bold text-white text-lg">Achievements</h3>
            <p className="text-xs text-zinc-500 mt-1">Milestones from programs, projects, and communities.</p>
          </div>

          {/* Visual: Medals/Trophies illustration */}
          <div className="relative z-20 mt-6 flex items-center justify-center">
            <div className="relative flex items-center gap-4">
              {/* Silver Medal - Center */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0, duration: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.15, rotate: -5, y: -5 }}
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Medal circle - larger */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500 rounded-full shadow-lg shadow-zinc-400/30 border-2 border-zinc-200/50"></div>
                  {/* Inner circle */}
                  <div className="absolute inset-2 bg-gradient-to-br from-zinc-200 to-zinc-400 rounded-full"></div>
                  {/* Trophy icon */}
                  <FaTrophy className="text-zinc-600 text-3xl relative z-10" />
                  {/* Shine effect */}
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white/50 rounded-full blur-sm"></div>
                </div>
                {/* Ribbon */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-b from-zinc-400 to-zinc-500 rounded-b-lg"></div>
              </motion.div>


              {/* Gold Medal - Left */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0, duration: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.15, rotate: 5, y: -5 }}
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Medal circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/30 border-2 border-yellow-300/50"></div>
                  {/* Inner circle */}
                  <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full"></div>
                  {/* Star icon */}
                  <FaMedal className="text-yellow-700 text-2xl relative z-10" />
                  {/* Shine effect */}
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full blur-sm"></div>
                </div>
                {/* Ribbon */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-b-lg"></div>
              </motion.div>


              {/* Bronze Medal - Right */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0, duration: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.15, rotate: 5, y: -5 }}
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Medal circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 rounded-full shadow-lg shadow-orange-600/30 border-2 border-orange-400/50"></div>
                  {/* Inner circle */}
                  <div className="absolute inset-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full"></div>
                  {/* Award icon */}
                  <FaAward className="text-orange-800 text-2xl relative z-10" />
                  {/* Shine effect */}
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white/30 rounded-full blur-sm"></div>
                </div>
                {/* Ribbon */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-gradient-to-b from-orange-600 to-orange-700 rounded-b-lg"></div>
              </motion.div>
            </div>
          </div>
        </SpotlightCard>

        {/* 5. CHAT ROOM */}
        <SpotlightCard className="md:col-span-1 lg:row-span-1 bg-zinc-900/50 p-6 flex flex-col justify-between overflow-hidden min-h-[320px]">
          <div className="relative z-20 h-full flex flex-col justify-between">
            {/* Icon and Title at top - centered */}
            <div className="text-center mb-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-3 mx-auto border border-zinc-700 text-emerald-500">
                <FaComments className="text-emerald-500" />
              </div>
              <h3 className="font-bold text-white text-lg">Chat Room</h3>
              <p className="text-xs text-zinc-500 mt-1">Open space to talk and collaborate.</p>
            </div>

            {/* Chat bubbles - centered */}
            <div className="flex flex-col gap-2.5 flex-1 justify-center items-center">
              <motion.div
                className="bg-zinc-800 text-zinc-300 p-2.5 rounded-lg rounded-tl-none max-w-[85%] text-xs shadow-lg text-left self-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Hi, is this your website?
              </motion.div>
              <motion.div
                className="bg-emerald-600 text-white p-2.5 rounded-lg rounded-tr-none max-w-[85%] text-xs shadow-lg text-right self-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Yes, I built it myself!
              </motion.div>
            </div>
          </div>
        </SpotlightCard>

        {/* 6. SERVICES */}
        <SpotlightCard className="md:col-span-2 lg:col-span-2 lg:row-span-1 bg-zinc-900/50 p-6 flex flex-col justify-center relative group overflow-hidden min-h-[320px]">
          <div className="z-20 relative">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 border border-zinc-700 text-purple-400 text-xl">
              <FaLayerGroup />
            </div>
            <h3 className="font-bold text-white text-2xl">Services</h3>
            <p className="text-sm text-zinc-400 mt-2 max-w-[200px]">End-to-end solutions in web, mobile, AI, and design.</p>
          </div>

          {/* Blurred background text - stacked vertically on right */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right opacity-40 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
            <motion.h4
              className="text-4xl font-black text-white blur-[3px] group-hover:blur-[0px] transition-all duration-500"
              initial={{ opacity: 0.2 }}
              whileHover={{ opacity: 0.5 }}
            >
              Web
            </motion.h4>
            <motion.h4
              className="text-4xl font-black text-white blur-[3px] group-hover:blur-[0px] transition-all duration-500 delay-75"
              initial={{ opacity: 0.2 }}
              whileHover={{ opacity: 0.5 }}
            >
              Mobile
            </motion.h4>
            <motion.h4
              className="text-4xl font-black text-white blur-[3px] group-hover:blur-[0px] transition-all duration-500 delay-150"
              initial={{ opacity: 0.2 }}
              whileHover={{ opacity: 0.5 }}
            >
              AI
            </motion.h4>
            <motion.h4
              className="text-4xl font-black text-white blur-[3px] group-hover:blur-[0px] transition-all duration-500 delay-200"
              initial={{ opacity: 0.2 }}
              whileHover={{ opacity: 0.5 }}
            >
              UI/UX
            </motion.h4>
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
};


// ============================================================================
// 🔥 LOGIC STACK (Last Index = Top Card) 🔥
// ============================================================================

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_event: any, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards: React.ReactNode[];
}

const Stack = ({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  sendToBackOnClick = false
}: StackProps) => {
  const [stack, setStack] = useState<{ id: number; content: React.ReactNode }[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (cards.length) {
      setStack(cards.map((content, index) => ({ id: index, content })));
    }
  }, [cards]);

  const sendToBack = (id: number) => {
    setStack((prev) => {
      const newStack = [...prev];
      const index = newStack.findIndex((card) => card.id === id);
      if (index < 0) return prev;
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  if (!isMounted) return <div className="w-full h-full bg-zinc-800 rounded-2xl animate-pulse border border-white/5" />;

  return (
    <div className="relative w-full h-full" style={{ perspective: 600 }}>
      {stack.map((card, index) => {
        const isTop = index === stack.length - 1;
        const reverseIndex = stack.length - 1 - index;
        const randomRotate = randomRotation ? (index % 2 === 0 ? 7 : 14) : 0;

        return (
          <motion.div
            key={card.id}
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{
              zIndex: index,
              transformOrigin: '50% 100%'
            }}
            animate={{
              scale: 1 - reverseIndex * 0.05,
              y: reverseIndex * -10,
              rotateZ: isTop ? 0 : randomRotate,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {isTop ? (
              <CardRotate onSendToBack={() => sendToBack(card.id)} sensitivity={sensitivity}>
                <div
                  className="w-full h-full rounded-2xl overflow-hidden bg-zinc-900 cursor-grab"
                  onClick={() => sendToBackOnClick && sendToBack(card.id)}
                >
                  {card.content}
                </div>
              </CardRotate>
            ) : (
              <div className="w-full h-full rounded-2xl overflow-hidden bg-zinc-900 relative">
                {card.content}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// --- SPOTLIGHT CARD ---
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-3xl border border-zinc-800 overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{ opacity, background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(124, 124, 124, 0.15), transparent 40%)` }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

// --- SKILL BADGE ---
const SkillBadge = ({ name, icon: Icon, color }: { name: string; icon: any; color: string }) => (
  <motion.div
    className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2.5 mx-2 cursor-pointer"
    whileHover={{ scale: 1.05, borderColor: "rgba(16, 185, 129, 0.5)" }}
    transition={{ duration: 0.2 }}
  >
    <Icon className={`${color} text-lg`} />
    <span className="text-sm font-medium text-zinc-300 whitespace-nowrap">{name}</span>
  </motion.div>
);

export default BentoGrid;