"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaTools, FaUser, FaBriefcase, FaTrophy, FaEnvelope, FaBars } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default function AdminDashboard() {
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Kelola konten portfolio Anda</p>
        </div>

        {/* Dashboard Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/dashboard/home"
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <FaHome className="text-xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Kelola Home</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Edit deskripsi Hero dan gambar BentoGrid
            </p>
          </Link>

          <Link
            href="/admin/dashboard/about"
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <FaUser className="text-xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Kelola About</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Edit deskripsi About, Karier, dan Pendidikan
            </p>
          </Link>

          <Link
            href="/admin/dashboard/projects"
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <FaBriefcase className="text-xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Kelola Projects</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Tambah, edit, dan hapus project portfolio
            </p>
          </Link>

          <Link
            href="/admin/dashboard/achievement"
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <FaTrophy className="text-xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Kelola Achievement</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Tambah, edit, dan hapus achievement/sertifikat
            </p>
          </Link>

          <Link
            href="/admin/dashboard/contact"
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <FaEnvelope className="text-xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Kelola Contact</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Edit link social media dan contact
            </p>
          </Link>

          <Link
            href="/admin/dashboard/sidebar"
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <FaBars className="text-xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Kelola Sidebar</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Edit foto profile, nama, dan pekerjaan
            </p>
          </Link>

          {/* Placeholder untuk fitur lain */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 opacity-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                <FaTools className="text-xl text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-600">Coming Soon</h3>
            </div>
            <p className="text-zinc-600 text-sm">
              Fitur lainnya akan segera tersedia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



