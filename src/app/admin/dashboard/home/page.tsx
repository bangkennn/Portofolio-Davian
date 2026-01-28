"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaSave, FaPlus, FaTrash, FaEdit, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/lib/auth";

interface HeroContent {
  id?: number;
  description: string;
}

interface BentoGridImage {
  id: number;
  type: 'project' | 'about_me';
  image_url: string;
  order: number;
}

export default function HomeManagement() {
  const router = useRouter();
  const [heroDescription, setHeroDescription] = useState("");
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);

  const [aboutMeImages, setAboutMeImages] = useState<BentoGridImage[]>([]);
  const [projectImages, setProjectImages] = useState<BentoGridImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageType, setNewImageType] = useState<'project' | 'about_me'>('about_me');
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  // Load Hero Description
  useEffect(() => {
    if (auth.isAuthenticated()) {
      fetchHeroDescription();
    }
  }, []);

  // Load BentoGrid Images
  useEffect(() => {
    if (auth.isAuthenticated()) {
      fetchBentoGridImages();
    }
  }, []);

  const fetchHeroDescription = async () => {
    try {
      const res = await fetch('/api/hero');
      const data = await res.json();
      if (data.data) {
        setHeroDescription(data.data.description || '');
      }
    } catch (error) {
      console.error('Failed to fetch hero description:', error);
    }
  };

  const fetchBentoGridImages = async () => {
    setIsLoadingImages(true);
    try {
      const [aboutRes, projectRes] = await Promise.all([
        fetch('/api/bento-grid?type=about_me'),
        fetch('/api/bento-grid?type=project')
      ]);

      const aboutData = await aboutRes.json();
      const projectData = await projectRes.json();

      setAboutMeImages(aboutData.data || []);
      setProjectImages(projectData.data || []);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSaveHero = async () => {
    setIsSavingHero(true);
    setHeroSuccess(false);

    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: heroDescription }),
      });

      if (res.ok) {
        setHeroSuccess(true);
        setTimeout(() => setHeroSuccess(false), 3000);
      } else {
        alert('Gagal menyimpan deskripsi');
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setIsUploading(true);
    setIsSavingImage(true);

    try {
      // Upload file ke Supabase Storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'bento-grid');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || 'Gagal mengupload file');
      }

      const { url } = await uploadRes.json();

      // Simpan URL ke database
      const res = await fetch('/api/bento-grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newImageType,
          image_url: url,
          order: newImageType === 'about_me' ? aboutMeImages.length + 1 : projectImages.length + 1,
        }),
      });

      if (res.ok) {
        setPreviewImage(null);
        fetchBentoGridImages();
        alert('Gambar berhasil ditambahkan!');
      } else {
        alert('Gagal menambahkan gambar ke database');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsUploading(false);
      setIsSavingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Yakin ingin menghapus gambar ini?')) return;

    try {
      const res = await fetch(`/api/bento-grid?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBentoGridImages();
      } else {
        alert('Gagal menghapus gambar');
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-3 text-sm text-zinc-400">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center"
              title="Kembali ke Dashboard"
            >
              <FaArrowLeft />
            </Link>
            <Link 
              href="/admin/dashboard" 
              className="hover:text-emerald-400 transition-colors"
            >
              Admin
            </Link>
            <FaChevronRight className="text-xs" />
            <span className="text-emerald-400">Kelola Konten Home</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kelola Konten Home</h1>
          <p className="text-zinc-400">Edit deskripsi Hero dan gambar BentoGrid</p>
        </div>

        <div className="space-y-8">
          {/* Hero Description Section */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Hero Description</h2>
            <div className="space-y-4">
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                placeholder="Masukkan deskripsi Hero..."
              />
              <button
                onClick={handleSaveHero}
                disabled={isSavingHero}
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaSave /> {isSavingHero ? 'Menyimpan...' : 'Simpan Deskripsi'}
              </button>
              {heroSuccess && (
                <p className="text-emerald-400 text-sm">✓ Deskripsi berhasil disimpan!</p>
              )}
            </div>
          </div>

          {/* BentoGrid Images Section */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">BentoGrid Images</h2>

            {/* Add New Image */}
            <div className="mb-6 p-4 bg-zinc-800/30 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">Tambah Gambar Baru</h3>
              
              {/* Type Selector */}
              <div className="mb-4">
                <select
                  value={newImageType}
                  onChange={(e) => setNewImageType(e.target.value as 'project' | 'about_me')}
                  className="px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                >
                  <option value="about_me">About Me</option>
                  <option value="project">Project</option>
                </select>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-zinc-600 bg-zinc-900/30 hover:border-zinc-500'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading || isSavingImage}
                />
                
                {previewImage ? (
                  <div className="space-y-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    {(isUploading || isSavingImage) && (
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Mengupload...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                        <FaPlus className="text-2xl text-zinc-400" />
                      </div>
                      <div>
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                          Klik untuk memilih file
                        </label>
                        <span className="text-zinc-400 mx-2">atau</span>
                        <span className="text-zinc-400">drag & drop di sini</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        PNG, JPG, GIF maksimal 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About Me Images */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">About Me Images</h3>
              {isLoadingImages ? (
                <p className="text-zinc-400">Memuat...</p>
              ) : aboutMeImages.length === 0 ? (
                <p className="text-zinc-400">Belum ada gambar</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {aboutMeImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.image_url}
                        alt={`About me ${img.order}`}
                        className="w-full h-32 object-cover rounded-lg border border-zinc-700"
                      />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Images */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Project Images</h3>
              {isLoadingImages ? (
                <p className="text-zinc-400">Memuat...</p>
              ) : projectImages.length === 0 ? (
                <p className="text-zinc-400">Belum ada gambar</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {projectImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.image_url}
                        alt={`Project ${img.order}`}
                        className="w-full h-32 object-cover rounded-lg border border-zinc-700"
                      />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


