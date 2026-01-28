"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBriefcase, FaSave, FaPlus, FaTrash, FaEdit, FaChevronRight, FaArrowLeft, FaTimes, FaUpload } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Project, TechStack } from "@/lib/supabase";
import * as Icons from "react-icons/si";

export default function ProjectsManagement() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states untuk Project
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    slug: "",
    featured: false,
    image_type: "desktop" as "desktop" | "mobile" | "multiple",
    image_url: "",
    project_url: "",
    order: 0,
    tech_stack_ids: [] as number[],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/admin/login");
    }
  }, [router]);

  // Load data
  useEffect(() => {
    if (auth.isAuthenticated()) {
      fetchProjects();
      fetchTechStacks();
    }
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

  const fetchTechStacks = async () => {
    try {
      const res = await fetch('/api/tech-stacks');
      const data = await res.json();
      setTechStacks(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tech stacks:', error);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      name: "",
      description: "",
      slug: "",
      featured: false,
      image_type: "desktop",
      image_url: "",
      project_url: "",
      order: projects.length,
      tech_stack_ids: [],
    });
    setShowProjectForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      slug: project.slug,
      featured: project.featured,
      image_type: project.image_type,
      image_url: project.image_url || "",
      project_url: project.project_url || "",
      order: project.order,
      tech_stack_ids: project.tech_stacks?.map((ts) => ts.id) || [],
    });
    setShowProjectForm(true);
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        // Update
        const res = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProject.id, ...projectForm }),
        });
        if (res.ok) {
          fetchProjects();
          setShowProjectForm(false);
        }
      } else {
        // Create
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectForm),
        });
        if (res.ok) {
          fetchProjects();
          setShowProjectForm(false);
        }
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus project ini?')) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const toggleTechStack = (techStackId: number) => {
    setProjectForm((prev) => {
      const isSelected = prev.tech_stack_ids.includes(techStackId);
      return {
        ...prev,
        tech_stack_ids: isSelected
          ? prev.tech_stack_ids.filter((id) => id !== techStackId)
          : [...prev.tech_stack_ids, techStackId],
      };
    });
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
        setProjectForm((prev) => ({ ...prev, image_url: data.url }));
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

  // Helper function untuk render icon
  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={`text-lg ${color}`} />;
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
          <span className="text-white">Kelola Projects</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kelola Projects</h1>
          <p className="text-zinc-400">Tambah, edit, dan hapus project portfolio</p>
        </div>

        {/* Projects List */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaBriefcase className="text-emerald-400 text-xl" />
              <h2 className="text-2xl font-bold text-white">Projects</h2>
            </div>
            <button
              onClick={handleAddProject}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            >
              <FaPlus /> Tambah Project
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold">{project.name}</h3>
                    {project.featured && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-xs">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm mb-2 line-clamp-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stacks?.map((tech) => (
                      <span
                        key={tech.id}
                        className="flex items-center gap-1 px-2 py-0.5 bg-zinc-700/50 border border-zinc-600 rounded text-xs text-zinc-300"
                      >
                        {renderIcon(tech.icon_name, tech.color)}
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Form Modal */}
        {showProjectForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingProject ? 'Edit Project' : 'Tambah Project'}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Nama Project</label>
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Slug</label>
                    <input
                      type="text"
                      value={projectForm.slug}
                      onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                      placeholder="project-name"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2">Deskripsi</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Tipe Gambar</label>
                    <select
                      value={projectForm.image_type}
                      onChange={(e) => setProjectForm({ ...projectForm, image_type: e.target.value as any })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
                      <option value="multiple">Multiple</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectForm.featured}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-zinc-400">Featured Project</span>
                    </label>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-zinc-400 mb-2">Gambar Project (URL atau Upload)</label>
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
                    {projectForm.image_url ? (
                      <div className="space-y-4">
                        <img
                          src={projectForm.image_url}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => setProjectForm({ ...projectForm, image_url: "" })}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Hapus Gambar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FaUpload className="text-4xl text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 mb-2">
                          Drag & drop gambar di sini atau klik untuk upload
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
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
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    placeholder="Atau masukkan URL gambar"
                    className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Project URL */}
                <div>
                  <label className="block text-zinc-400 mb-2">Link Project (URL)</label>
                  <input
                    type="url"
                    value={projectForm.project_url}
                    onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })}
                    placeholder="https://example.com atau https://github.com/username/repo"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-zinc-500 text-xs mt-1">
                    Link yang akan dibuka saat tombol "Lihat Proyek" diklik. Kosongkan jika ingin menggunakan halaman detail project.
                  </p>
                </div>

                {/* Tech Stacks Selection */}
                <div>
                  <label className="block text-zinc-400 mb-2">Tech Stacks</label>
                  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 min-h-[100px]">
                    {/* Selected Tech Stacks */}
                    {projectForm.tech_stack_ids.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {projectForm.tech_stack_ids.map((techStackId) => {
                          const tech = techStacks.find((ts) => ts.id === techStackId);
                          if (!tech) return null;
                          return (
                            <div
                              key={tech.id}
                              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg"
                            >
                              {renderIcon(tech.icon_name, tech.color)}
                              <span className="text-sm text-emerald-400">{tech.name}</span>
                              <button
                                onClick={() => toggleTechStack(tech.id)}
                                className="text-emerald-400 hover:text-emerald-300"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Available Tech Stacks */}
                    <div className="flex flex-wrap gap-2">
                      {techStacks
                        .filter((tech) => !projectForm.tech_stack_ids.includes(tech.id))
                        .map((tech) => (
                          <button
                            key={tech.id}
                            onClick={() => toggleTechStack(tech.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700/50 border border-zinc-600 rounded-lg hover:bg-zinc-700 transition-colors"
                          >
                            {renderIcon(tech.icon_name, tech.color)}
                            <span className="text-sm text-zinc-300">{tech.name}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowProjectForm(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveProject}
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

