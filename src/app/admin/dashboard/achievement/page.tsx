"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrophy, FaPlus, FaTrash, FaEdit, FaChevronRight, FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Achievement } from "@/lib/supabase";

export default function AchievementManagement() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states untuk Achievement
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [achievementForm, setAchievementForm] = useState({
    title: "",
    issuer: "",
    issued_date: "",
    category: "Course",
    credential_url: "",
    certificate_url: "",
      certificate_type: "image" as "image",
    tags: [] as string[],
    order: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Check authentication
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  // Load data
  useEffect(() => {
    if (auth.isAuthenticated()) {
      fetchAchievements();
    }
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements');
      const data = await res.json();
      setAchievements(data.data || []);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAchievement = () => {
    setEditingAchievement(null);
    setAchievementForm({
      title: "",
      issuer: "",
      issued_date: "",
      category: "Course",
      credential_url: "",
      certificate_url: "",
      certificate_type: "image" as "image",
      tags: [],
      order: achievements.length,
    });
    setShowAchievementForm(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setAchievementForm({
      title: achievement.title,
      issuer: achievement.issuer,
      issued_date: achievement.issued_date,
      category: achievement.category,
      credential_url: achievement.credential_url || "",
      certificate_url: achievement.certificate_url,
      certificate_type: achievement.certificate_type,
      tags: achievement.tags || [],
      order: achievement.order,
    });
    setShowAchievementForm(true);
  };

  const handleSaveAchievement = async () => {
    try {
      if (editingAchievement) {
        // Update
        const res = await fetch('/api/achievements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingAchievement.id, ...achievementForm }),
        });
        if (res.ok) {
          fetchAchievements();
          setShowAchievementForm(false);
        }
      } else {
        // Create
        const res = await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(achievementForm),
        });
        if (res.ok) {
          fetchAchievements();
          setShowAchievementForm(false);
        }
      }
    } catch (error) {
      console.error('Failed to save achievement:', error);
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus achievement ini?')) return;

    try {
      const res = await fetch(`/api/achievements?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAchievements();
      }
    } catch (error) {
      console.error('Failed to delete achievement:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validasi: hanya terima image (PNG/JPEG)
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (PNG atau JPEG)');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Gunakan API upload standar untuk image
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal mengupload file');
      }

      const data = await res.json();
      if (data.url) {
        setAchievementForm((prev) => ({
          ...prev,
          certificate_url: data.url,
          certificate_type: 'image',
        }));
      }
    } catch (error: any) {
      console.error('Failed to upload file:', error);
      alert('Error: ' + (error.message || 'Gagal mengupload file. Pastikan file adalah PNG atau JPEG yang valid.'));
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
    } else {
      alert('File harus berupa gambar (PNG atau JPEG)');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !achievementForm.tags.includes(tagInput.trim())) {
      setAchievementForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setAchievementForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
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
          <span className="text-white">Kelola Achievement</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kelola Achievement</h1>
          <p className="text-zinc-400">Tambah, edit, dan hapus achievement/sertifikat</p>
        </div>

        {/* Achievements List */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-emerald-400 text-xl" />
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
            </div>
            <button
              onClick={handleAddAchievement}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            >
              <FaPlus /> Tambah Achievement
            </button>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-zinc-400 text-sm mb-2">{achievement.issuer} • {achievement.issued_date}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-xs">
                      {achievement.category}
                    </span>
                    {achievement.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-zinc-700/50 border border-zinc-600 text-zinc-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEditAchievement(achievement)}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteAchievement(achievement.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievement Form Modal */}
        {showAchievementForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingAchievement ? 'Edit Achievement' : 'Tambah Achievement'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 mb-2">Judul Achievement</label>
                  <input
                    type="text"
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Issuer</label>
                    <input
                      type="text"
                      value={achievementForm.issuer}
                      onChange={(e) => setAchievementForm({ ...achievementForm, issuer: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Tanggal Diterbitkan</label>
                    <input
                      type="text"
                      value={achievementForm.issued_date}
                      onChange={(e) => setAchievementForm({ ...achievementForm, issued_date: e.target.value })}
                      placeholder="January 2025"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Kategori</label>
                  <select
                    value={achievementForm.category}
                    onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Course">Course</option>
                    <option value="Competition">Competition</option>
                    <option value="Program">Program</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">URL Kredensial (Optional)</label>
                  <input
                    type="text"
                    value={achievementForm.credential_url}
                    onChange={(e) => setAchievementForm({ ...achievementForm, credential_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Certificate Upload */}
                <div>
                  <label className="block text-zinc-400 mb-2">Sertifikat (PNG atau JPEG)</label>
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
                    {achievementForm.certificate_url ? (
                      <div className="space-y-4">
                        <img
                          src={achievementForm.certificate_url}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => setAchievementForm({ ...achievementForm, certificate_url: "" })}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Hapus Sertifikat
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaUpload className="text-4xl text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 mb-2">
                          Drag & drop gambar sertifikat (PNG atau JPEG) di sini atau klik untuk upload
                        </p>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleFileInput}
                          className="hidden"
                          id="certificate-upload"
                        />
                        <label
                          htmlFor="certificate-upload"
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
                    value={achievementForm.certificate_url}
                    onChange={(e) => setAchievementForm({ ...achievementForm, certificate_url: e.target.value })}
                    placeholder="Atau masukkan URL gambar sertifikat"
                    className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-zinc-400 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {achievementForm.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm text-emerald-400"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Tambah tag..."
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAchievementForm(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveAchievement}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

