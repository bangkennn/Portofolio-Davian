"use client";

import { useState, useEffect } from "react";
import { FaUser, FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaLaptop, FaBuilding } from "react-icons/fa";
import { Career, Education } from "@/lib/supabase";

export default function About() {
  const [aboutDescription, setAboutDescription] = useState("");
  const [careerData, setCareerData] = useState<Career[]>([]);
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const [aboutRes, careersRes, educationsRes] = await Promise.all([
        fetch('/api/about'),
        fetch('/api/careers'),
        fetch('/api/educations'),
      ]);

      const aboutData = await aboutRes.json();
      const careersData = await careersRes.json();
      const educationsData = await educationsRes.json();

      if (aboutData.data) {
        setAboutDescription(aboutData.data.description || '');
      }
      setCareerData(careersData.data || []);
      setEducationData(educationsData.data || []);
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 max-w-7xl mx-auto px-4">
        <div className="text-white text-center">Loading...</div>
      </div>
    );
  }

  // Format description dengan line breaks
  const formatDescription = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="text-zinc-300 leading-relaxed text-l mb-4">
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen py-20 max-w-7xl mx-auto px-4">
      
      {/* Bagian Tentang */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FaUser className="text-emerald-500" /> Tentang
          </h2>
          <p className="text-zinc-500 text-lg">Perkenalan singkat tentang siapa saya.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-10">
          {formatDescription(aboutDescription)}
        </div>
      </section>

      {/* Bagian Karier */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FaBriefcase className="text-emerald-500" /> Karier
          </h2>
          <p className="text-zinc-500 text-l">Perjalanan profesional saya.</p>
        </div>

        <div className="space-y-6">
          {careerData.map((career) => (
            <div
              key={career.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                    {career.logo_url ? (
                      <img
                        src={career.logo_url}
                        alt={career.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{career.logo}</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {career.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <FaBuilding className="text-emerald-500" />
                      <span>{career.company}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-zinc-400">
                      <FaMapMarkerAlt className="text-emerald-500" />
                      <span>{career.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-zinc-400">
                      <FaCalendarAlt className="text-emerald-500" />
                      <span>{career.duration}</span>
                      <span className="text-zinc-600">•</span>
                      <span>{career.months}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                        {career.type}
                      </span>
                      <div className="flex items-center gap-2 text-zinc-400">
                        {career.work_type === "Remote" ? (
                          <FaLaptop className="text-emerald-500" />
                        ) : (
                          <FaBuilding className="text-emerald-500" />
                        )}
                        <span>{career.work_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Button Tampilkan Tanggung Jawab */}
                  <button className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1">
                    &gt; Tampilkan tanggung jawab
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian Pendidikan */}
      <section>
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FaGraduationCap className="text-emerald-500" /> Pendidikan
          </h2>
          <p className="text-zinc-500 text-l">Perjalanan pendidikan saya.</p>
        </div>

        <div className="space-y-6">
          {educationData.map((edu) => (
            <div
              key={edu.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                    {edu.logo_url ? (
                      <img
                        src={edu.logo_url}
                        alt={edu.institution}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{edu.logo}</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {edu.institution}
                  </h3>
                  
                  <div className="space-y-2">
                    <p className="text-zinc-400 text-lg">
                      {edu.degree} • {edu.major}{edu.degree_code ? `, ${edu.degree_code}` : ''}
                    </p>
                    
                    <div className="flex items-center gap-2 text-zinc-400">
                      <FaCalendarAlt className="text-emerald-500" />
                      <span>{edu.duration}</span>
                      <span className="text-zinc-600">•</span>
                      <FaMapMarkerAlt className="text-emerald-500" />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
