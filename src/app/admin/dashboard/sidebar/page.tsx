"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaSave, FaChevronRight, FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SidebarProfile } from "@/lib/supabase";

export default function SidebarManagement() {
  const router = useRouter();
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    job_title: "",
    profile_image_url: "",
  });

  // Check authentication
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  // Load data
  useEffect(() => {
    if (auth.isAuthenticated()) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/sidebar-profile');
      const data = await res.json();
      if (data.data) {
        setProfile(data.data);
        setFormData({
          name: data.data.name || "",
          job_title: data.data.job_title || "",
          profile_image_url: data.data.profile_image_url || "",
        });
      }
    } catch (error) {
      console.error('Failed to fetch sidebar profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/sidebar-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        fetchProfile();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save sidebar profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, profile_image_url: data.url }));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            <span>Kembali</span>
          </Link>
          <FaChevronRight className="text-zinc-600 text-xs" />
          <span className="text-zinc-400">Admin</span>
          <FaChevronRight className="text-zinc-600 text-xs" />
          <span className="text-white">Kelola Sidebar</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kelola Sidebar</h1>
          <p className="text-zinc-400">Edit foto profile, nama, dan pekerjaan di sidebar</p>
        </div>

        {/* Profile Form */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaUser className="text-emerald-400 text-xl" />
            <h2 className="text-2xl font-bold text-white">Profile Sidebar</h2>
          </div>

          <div className="space-y-6">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-zinc-400 mb-2">Foto Profile</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-700 bg-zinc-800/50'
                }`}
              >
                {formData.profile_image_url ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-emerald-500">
                      <img
                        src={formData.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, profile_image_url: "" })}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <div>
                    <FaUpload className="text-4xl text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-2">
                      Drag & drop foto profile di sini atau klik untuk upload
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer transition-colors"
                    >
                      Pilih File
                    </label>
                    {isUploading && (
                      <p className="text-emerald-400 text-sm mt-2">Uploading...</p>
                    )}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={formData.profile_image_url}
                onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })}
                placeholder="Atau masukkan URL foto"
                className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-zinc-400 mb-2">Nama</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-zinc-400 mb-2">Pekerjaan</label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave /> {isSaving ? 'Menyimpan...' : 'Simpan Profile'}
              </button>
              {success && (
                <span className="text-emerald-400 text-sm">✓ Berhasil disimpan!</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

