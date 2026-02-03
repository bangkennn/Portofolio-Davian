"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBriefcase, FaArrowRight } from "react-icons/fa";
import * as Icons from "react-icons/si";
import { Project, TechStack } from "@/lib/supabase";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function untuk render icon
  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={`text-lg ${color}`} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 max-w-7xl mx-auto px-4">
        <div className="text-white text-center">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-10 md:py-20 max-w-7xl mx-auto px-4">

      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <FaBriefcase className="text-emerald-500" /> Projects
        </h2>
        <p className="text-zinc-500 text-sm md:text-l">
          Pameran proyek pribadi dan open-source yang telah saya buat atau kontribusikan.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 ${project.featured ? 'md:col-span-2' : ''
              }`}
          >
            {/* Project Image/Mockup */}
            <div className="relative bg-zinc-950 h-64 overflow-hidden">
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : project.image_type === "desktop" ? (
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
                  <div className="w-full max-w-4xl mx-auto p-4">
                    <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4">
                      <div className="flex gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="bg-zinc-900 rounded h-32 flex items-center justify-center text-zinc-600">
                        <span className="text-sm">{project.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : project.image_type === "mobile" ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
                  <div className="w-48 h-80 bg-zinc-800 rounded-[2rem] border-8 border-zinc-900 p-2 shadow-2xl">
                    <div className="w-full h-full bg-zinc-900 rounded-2xl flex items-center justify-center">
                      <span className="text-zinc-600 text-xs">{project.name}</span>
                    </div>
                  </div>
                </div>
              ) : project.image_type === "multiple" ? (
                <div className="w-full h-full flex items-center justify-center gap-3 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative"
                      style={{
                        transform: `rotate(${(i - 2) * 8}deg) translateY(${(i - 2) * 15}px)`,
                        zIndex: i === 2 ? 10 : 5 - i
                      }}
                    >
                      <div className="w-36 h-56 bg-zinc-800 rounded-[2rem] border-8 border-zinc-900 p-2 shadow-2xl">
                        <div className="w-full h-full bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-zinc-900 flex flex-col">
                            <div className="h-8 bg-zinc-800 flex items-center justify-center border-b border-zinc-700">
                              <div className="w-16 h-1 bg-zinc-700 rounded-full"></div>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-4">
                              <span className="text-zinc-500 text-[10px] text-center">{project.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-3">{project.name}</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-3 mb-6">
                {project.tech_stacks?.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                  >
                    {renderIcon(tech.icon_name, tech.color)}
                    <span className="text-xs text-zinc-400">{tech.name}</span>
                  </div>
                ))}
              </div>

              {/* View Project Button */}
              {project.project_url ? (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group/btn"
                >
                  <span className="text-sm font-medium">Lihat Proyek</span>
                  <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                </a>
              ) : (
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group/btn"
                >
                  <span className="text-sm font-medium">Lihat Proyek</span>
                  <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

