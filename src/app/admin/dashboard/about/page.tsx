"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaSave, FaPlus, FaTrash, FaEdit, FaChevronRight, FaArrowLeft, FaBriefcase, FaGraduationCap, FaUpload } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Career, Education } from "@/lib/supabase";

interface AboutContent {
  id?: number;
  description: string;
}

export default function AboutManagement() {
  const router = useRouter();
  const [aboutDescription, setAboutDescription] = useState("");
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [aboutSuccess, setAboutSuccess] = useState(false);

  const [careers, setCareers] = useState<Career[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states untuk Career
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [careerForm, setCareerForm] = useState({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    duration: "",
    months: "",
    type: "Internship",
    work_type: "Remote",
    logo: "🟢",
    logo_url: "",
    responsibilities: "",
    order: 0,
  });

  // Form states untuk Education
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    major: "",
    degree_code: "",
    start_year: 2022,
    end_year: 2026,
    duration: "",
    location: "",
    logo: "🎓",
    logo_url: "",
    order: 0,
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
      fetchAboutDescription();
      fetchCareers();
      fetchEducations();
    }
  }, []);

  const fetchAboutDescription = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      if (data.data) {
        setAboutDescription(data.data.description || '');
      }
    } catch (error) {
      console.error('Failed to fetch about description:', error);
    }
  };

  const fetchCareers = async () => {
    try {
      const res = await fetch('/api/careers');
      const data = await res.json();
      setCareers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch careers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEducations = async () => {
    try {
      const res = await fetch('/api/educations');
      const data = await res.json();
      setEducations(data.data || []);
    } catch (error) {
      console.error('Failed to fetch educations:', error);
    }
  };

  const handleSaveAbout = async () => {
    setIsSavingAbout(true);
    setAboutSuccess(false);

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aboutDescription }),
      });

      if (res.ok) {
        setAboutSuccess(true);
        setTimeout(() => setAboutSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save about description:', error);
    } finally {
      setIsSavingAbout(false);
    }
  };

  // Career handlers
  const handleAddCareer = () => {
    setEditingCareer(null);
    setCareerForm({
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      duration: "",
      months: "",
      type: "Internship",
      work_type: "Remote",
      logo: "🟢",
      logo_url: "",
      responsibilities: "",
      order: careers.length,
    });
    setShowCareerForm(true);
  };

  const handleEditCareer = (career: Career) => {
    setEditingCareer(career);
    setCareerForm({
      title: career.title,
      company: career.company,
      location: career.location,
      start_date: career.start_date,
      end_date: career.end_date || "",
      duration: career.duration,
      months: career.months,
      type: career.type,
      work_type: career.work_type,
      logo: career.logo,
      logo_url: career.logo_url || "",
      responsibilities: career.responsibilities || "",
      order: career.order,
    });
    setShowCareerForm(true);
  };

  const handleSaveCareer = async () => {
    try {
      if (editingCareer) {
        // Update
        const res = await fetch('/api/careers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCareer.id, ...careerForm }),
        });
        if (res.ok) {
          fetchCareers();
          setShowCareerForm(false);
        }
      } else {
        // Create
        const res = await fetch('/api/careers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(careerForm),
        });
        if (res.ok) {
          fetchCareers();
          setShowCareerForm(false);
        }
      }
    } catch (error) {
      console.error('Failed to save career:', error);
    }
  };

  const handleDeleteCareer = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus career ini?')) return;

    try {
      const res = await fetch(`/api/careers?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCareers();
      }
    } catch (error) {
      console.error('Failed to delete career:', error);
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationForm({
      institution: "",
      degree: "",
      major: "",
      degree_code: "",
      start_year: 2022,
      end_year: 2026,
      duration: "",
      location: "",
      logo: "🎓",
      logo_url: "",
      order: educations.length,
    });
    setShowEducationForm(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setEducationForm({
      institution: education.institution,
      degree: education.degree,
      major: education.major,
      degree_code: education.degree_code || "",
      start_year: education.start_year,
      end_year: education.end_year || 2026,
      duration: education.duration,
      location: education.location,
      logo: education.logo,
      logo_url: education.logo_url || "",
      order: education.order,
    });
    setShowEducationForm(true);
  };

  const handleSaveEducation = async () => {
    try {
      if (editingEducation) {
        // Update
        const res = await fetch('/api/educations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEducation.id, ...educationForm }),
        });
        if (res.ok) {
          fetchEducations();
          setShowEducationForm(false);
        }
      } else {
        // Create
        const res = await fetch('/api/educations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(educationForm),
        });
        if (res.ok) {
          fetchEducations();
          setShowEducationForm(false);
        }
      }
    } catch (error) {
      console.error('Failed to save education:', error);
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus education ini?')) return;

    try {
      const res = await fetch(`/api/educations?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchEducations();
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
    }
  };

  const handleLogoUpload = async (file: File, type: 'career' | 'education') => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        if (type === 'career') {
          setCareerForm({ ...careerForm, logo_url: data.url });
        } else {
          setEducationForm({ ...educationForm, logo_url: data.url });
        }
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
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
          <span className="text-white">Kelola Konten About</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kelola Konten About</h1>
          <p className="text-zinc-400">Edit deskripsi About, Karier, dan Pendidikan</p>
        </div>

        <div className="space-y-8">
          {/* Section: About Description */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaUser className="text-emerald-400 text-xl" />
              <h2 className="text-2xl font-bold text-white">Deskripsi Tentang</h2>
            </div>

            <textarea
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              className="w-full h-64 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              placeholder="Masukkan deskripsi tentang Anda..."
            />

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleSaveAbout}
                disabled={isSavingAbout}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave /> {isSavingAbout ? 'Menyimpan...' : 'Simpan Deskripsi'}
              </button>
              {aboutSuccess && (
                <span className="text-emerald-400 text-sm">✓ Berhasil disimpan!</span>
              )}
            </div>
          </section>

          {/* Section: Careers */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaBriefcase className="text-emerald-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">Karier</h2>
              </div>
              <button
                onClick={handleAddCareer}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <FaPlus /> Tambah Karier
              </button>
            </div>

            <div className="space-y-4">
              {careers.map((career) => (
                <div
                  key={career.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-semibold">{career.title}</h3>
                    <p className="text-zinc-400 text-sm">{career.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCareer(career)}
                      className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCareer(career.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Educations */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-emerald-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">Pendidikan</h2>
              </div>
              <button
                onClick={handleAddEducation}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <FaPlus /> Tambah Pendidikan
              </button>
            </div>

            <div className="space-y-4">
              {educations.map((education) => (
                <div
                  key={education.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-semibold">{education.institution}</h3>
                    <p className="text-zinc-400 text-sm">{education.degree} • {education.major}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditEducation(education)}
                      className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(education.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Career Form Modal */}
        {showCareerForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingCareer ? 'Edit Karier' : 'Tambah Karier'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 mb-2">Judul Posisi</label>
                  <input
                    type="text"
                    value={careerForm.title}
                    onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Perusahaan</label>
                    <input
                      type="text"
                      value={careerForm.company}
                      onChange={(e) => setCareerForm({ ...careerForm, company: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Lokasi</label>
                    <input
                      type="text"
                      value={careerForm.location}
                      onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Tanggal Mulai</label>
                    <input
                      type="text"
                      value={careerForm.start_date}
                      onChange={(e) => setCareerForm({ ...careerForm, start_date: e.target.value })}
                      placeholder="Jul 2025"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Tanggal Selesai</label>
                    <input
                      type="text"
                      value={careerForm.end_date}
                      onChange={(e) => setCareerForm({ ...careerForm, end_date: e.target.value })}
                      placeholder="Sep 2025"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Durasi (Format)</label>
                    <input
                      type="text"
                      value={careerForm.duration}
                      onChange={(e) => setCareerForm({ ...careerForm, duration: e.target.value })}
                      placeholder="Jul 2025 - Sep 2025"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Bulan</label>
                    <input
                      type="text"
                      value={careerForm.months}
                      onChange={(e) => setCareerForm({ ...careerForm, months: e.target.value })}
                      placeholder="2 Months"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Tipe</label>
                    <select
                      value={careerForm.type}
                      onChange={(e) => setCareerForm({ ...careerForm, type: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Tipe Kerja</label>
                    <select
                      value={careerForm.work_type}
                      onChange={(e) => setCareerForm({ ...careerForm, work_type: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Onsite">Onsite</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Logo</label>
                  <div className="space-y-3">
                    {/* Logo URL Upload */}
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith('image/')) {
                          handleLogoUpload(file, 'career');
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-zinc-700 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                      onClick={() => document.getElementById('career-logo-upload')?.click()}
                    >
                      {careerForm.logo_url ? (
                        <div className="space-y-2">
                          <img
                            src={careerForm.logo_url}
                            alt="Logo"
                            className="w-16 h-16 mx-auto rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCareerForm({ ...careerForm, logo_url: "" });
                            }}
                            className="text-red-400 text-sm hover:text-red-300"
                          >
                            Hapus Logo
                          </button>
                        </div>
                      ) : (
                        <div>
                          <FaUpload className="text-2xl text-zinc-600 mx-auto mb-2" />
                          <p className="text-zinc-400 text-sm">Klik atau drag & drop untuk upload logo</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="career-logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleLogoUpload(file, 'career');
                          }
                        }}
                      />
                    </div>
                    {/* Logo URL Input */}
                    <input
                      type="text"
                      value={careerForm.logo_url}
                      onChange={(e) => setCareerForm({ ...careerForm, logo_url: e.target.value })}
                      placeholder="Atau masukkan URL logo"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                    {/* Logo Emoji Fallback */}
                    <input
                      type="text"
                      value={careerForm.logo}
                      onChange={(e) => setCareerForm({ ...careerForm, logo: e.target.value })}
                      placeholder="Logo Emoji (fallback jika tidak ada gambar)"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCareerForm(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCareer}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Education Form Modal */}
        {showEducationForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingEducation ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 mb-2">Institusi</label>
                  <input
                    type="text"
                    value={educationForm.institution}
                    onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Gelar</label>
                    <input
                      type="text"
                      value={educationForm.degree}
                      onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                      placeholder="Bachelor's degree"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Jurusan</label>
                    <input
                      type="text"
                      value={educationForm.major}
                      onChange={(e) => setEducationForm({ ...educationForm, major: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Kode Gelar</label>
                  <input
                    type="text"
                    value={educationForm.degree_code}
                    onChange={(e) => setEducationForm({ ...educationForm, degree_code: e.target.value })}
                    placeholder="(S.Kom)"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Tahun Mulai</label>
                    <input
                      type="number"
                      value={educationForm.start_year}
                      onChange={(e) => setEducationForm({ ...educationForm, start_year: parseInt(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Tahun Selesai</label>
                    <input
                      type="number"
                      value={educationForm.end_year}
                      onChange={(e) => setEducationForm({ ...educationForm, end_year: parseInt(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Durasi (Format)</label>
                  <input
                    type="text"
                    value={educationForm.duration}
                    onChange={(e) => setEducationForm({ ...educationForm, duration: e.target.value })}
                    placeholder="2022 - 2026"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Lokasi</label>
                  <input
                    type="text"
                    value={educationForm.location}
                    onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Logo</label>
                  <div className="space-y-3">
                    {/* Logo URL Upload */}
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith('image/')) {
                          handleLogoUpload(file, 'education');
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed border-zinc-700 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
                      onClick={() => document.getElementById('education-logo-upload')?.click()}
                    >
                      {educationForm.logo_url ? (
                        <div className="space-y-2">
                          <img
                            src={educationForm.logo_url}
                            alt="Logo"
                            className="w-16 h-16 mx-auto rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEducationForm({ ...educationForm, logo_url: "" });
                            }}
                            className="text-red-400 text-sm hover:text-red-300"
                          >
                            Hapus Logo
                          </button>
                        </div>
                      ) : (
                        <div>
                          <FaUpload className="text-2xl text-zinc-600 mx-auto mb-2" />
                          <p className="text-zinc-400 text-sm">Klik atau drag & drop untuk upload logo</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="education-logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleLogoUpload(file, 'education');
                          }
                        }}
                      />
                    </div>
                    {/* Logo URL Input */}
                    <input
                      type="text"
                      value={educationForm.logo_url}
                      onChange={(e) => setEducationForm({ ...educationForm, logo_url: e.target.value })}
                      placeholder="Atau masukkan URL logo"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                    {/* Logo Emoji Fallback */}
                    <input
                      type="text"
                      value={educationForm.logo}
                      onChange={(e) => setEducationForm({ ...educationForm, logo: e.target.value })}
                      placeholder="Logo Emoji (fallback jika tidak ada gambar)"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowEducationForm(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEducation}
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


