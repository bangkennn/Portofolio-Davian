"use client";

import Marquee from "react-fast-marquee";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiSupabase, SiFramer,
  SiGit, SiMongodb, SiDocker, SiPython
} from "react-icons/si";
import { useTranslations } from "next-intl";

// DATA
const skillsData = [
  { name: "React", icon: <SiReact className="text-[#61DAFB]" /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-[#3178C6]" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="text-[#06B6D4]" /> },
  { name: "Node.js", icon: <SiNodedotjs className="text-[#339933]" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="text-[#4169E1]" /> },
  { name: "Supabase", icon: <SiSupabase className="text-[#3ECF8E]" /> },
  { name: "Framer", icon: <SiFramer className="text-white" /> },
  { name: "Git", icon: <SiGit className="text-[#F05032]" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
  { name: "Docker", icon: <SiDocker className="text-[#2496ED]" /> },
  { name: "Python", icon: <SiPython className="text-[#3776AB]" /> },
];

const Skills = () => {
  const t = useTranslations('Skills');

  return (
    <section className="py-10 overflow-hidden">

      {/* UBAH DI SINI: max-w-4xl JADI max-w-7xl */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-emerald-500">My</span> {t('title').replace('My ', '')}
        </h2>
        <p className="text-zinc-500 text-l">{t('subtitle')}</p>
      </div>

      {/* Container Slider (Biarkan full width supaya keren) */}
      <div className="relative w-full border-y border-zinc-800 bg-zinc-900/30 py-8 overflow-hidden">

        {/* Efek Gradasi Pudar */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

        {/* Track Animasi dengan Marquee */}
        <Marquee
          gradient={false}
          speed={50}
          direction="left"
          pauseOnHover={true}
        >
          {[...skillsData, ...skillsData, ...skillsData].map((skill, index) => (
            <SkillItem key={`skill-${index}`} icon={skill.icon} name={skill.name} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

const SkillItem = ({ icon, name }: { icon: React.ReactNode; name: string }) => (
  <div className="flex flex-col items-center gap-3 group cursor-pointer min-w-[80px] mx-8">
    <div className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_5px_rgba(16,185,129,0.4)] my-3">
      {icon}
    </div>
    <span className="text-xs md:text-sm font-medium text-zinc-600 group-hover:text-emerald-400 transition-colors">
      {name}
    </span>
  </div>
);

export default Skills;