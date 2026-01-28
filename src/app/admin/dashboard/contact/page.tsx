"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaPlus, FaTrash, FaEdit, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ContactLink } from "@/lib/supabase";

export default function ContactManagement() {
  const router = useRouter();
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<ContactLink | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    button_text: "",
    url: "",
    icon_name: "FaGithub",
    icon_type: "fa" as "fa" | "si",
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
      fetchContactLinks();
    }
  }, []);

  const fetchContactLinks = async () => {
    try {
      const res = await fetch('/api/contact-links');
      const data = await res.json();
      setContactLinks(data.data || []);
    } catch (error) {
      console.error('Failed to fetch contact links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLink(null);
    setFormData({
      title: "",
      description: "",
      button_text: "",
      url: "",
      icon_name: "FaGithub",
      icon_type: "fa",
      order: contactLinks.length,
    });
    setShowForm(true);
  };

  const handleEdit = (link: ContactLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      description: link.description,
      button_text: link.button_text,
      url: link.url,
      icon_name: link.icon_name,
      icon_type: link.icon_type,
      order: link.order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingLink) {
        const res = await fetch('/api/contact-links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingLink.id, ...formData }),
        });
        if (res.ok) {
          fetchContactLinks();
          setShowForm(false);
        }
      } else {
        const res = await fetch('/api/contact-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          fetchContactLinks();
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error('Failed to save contact link:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus contact link ini?')) return;

    try {
      const res = await fetch(`/api/contact-links?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchContactLinks();
      }
    } catch (error) {
      console.error('Failed to delete contact link:', error);
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
          <span className="text-white">Kelola Contact</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kelola Contact</h1>
          <p className="text-zinc-400">Edit link social media dan contact</p>
        </div>

        {/* Contact Links List */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-emerald-400 text-xl" />
              <h2 className="text-2xl font-bold text-white">Contact Links</h2>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            >
              <FaPlus /> Tambah Link
            </button>
          </div>

          <div className="space-y-4">
            {contactLinks.map((link) => (
              <div
                key={link.id}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{link.title}</h3>
                  <p className="text-zinc-400 text-sm mb-2">{link.description}</p>
                  <p className="text-zinc-500 text-xs">URL: {link.url}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingLink ? 'Edit Contact Link' : 'Tambah Contact Link'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-400 mb-2">Judul</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Teks Tombol</label>
                    <input
                      type="text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">URL</label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Nama Icon</label>
                    <input
                      type="text"
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      placeholder="FaGithub, SiGmail, etc"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Tipe Icon</label>
                    <select
                      value={formData.icon_type}
                      onChange={(e) => setFormData({ ...formData, icon_type: e.target.value as any })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="fa">Font Awesome (fa)</option>
                      <option value="si">Simple Icons (si)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
                  <p className="text-emerald-400 text-sm">
                    💡 <strong>Info:</strong> Warna gradient akan ditentukan otomatis berdasarkan URL platform (Instagram, LinkedIn, Gmail, TikTok, dll.). Anda hanya perlu mengisi URL yang benar.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
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

