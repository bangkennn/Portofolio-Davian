import Link from "next/link";
import { FaGithub, FaExternalLinkAlt, FaFolder } from "react-icons/fa";

// Data Dummy (Pura-pura ada proyek)
const projects = [
  {
    id: 1,
    title: "E-Commerce Dashboard",
    description: "Aplikasi manajemen toko online dengan fitur analisis data penjualan real-time dan manajemen stok barang.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    imageColor: "bg-blue-900", // Warna placeholder sementara
  },
  {
    id: 2,
    title: "Personal Portfolio V1",
    description: "Website portofolio pribadi versi pertama yang dibuat menggunakan React dan CSS murni.",
    tech: ["React", "CSS", "Vite"],
    imageColor: "bg-emerald-900",
  },
  {
    id: 3,
    title: "Smart Home App",
    description: "Aplikasi pengontrol perangkat IoT rumah pintar berbasis web dengan integrasi MQTT.",
    tech: ["Vue.js", "Node.js", "MongoDB"],
    imageColor: "bg-purple-900",
  },
  {
    id: 4,
    title: "Cinema Booking System",
    description: "Sistem pemesanan tiket bioskop online dengan pemilihan kursi interaktif.",
    tech: ["Laravel", "PHP", "MySQL"],
    imageColor: "bg-orange-900",
  },
];

const Projects = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
             <FaFolder className="text-emerald-500" />
             Featured <span className="text-emerald-500">Projects</span>
          </h2>
          <p className="text-zinc-400">Beberapa proyek pilihan yang pernah saya kerjakan.</p>
        </div>

        {/* Grid Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              
              {/* 1. Project Thumbnail (Sementara pakai kotak warna) */}
              <div className={`h-48 w-full ${project.imageColor} flex items-center justify-center relative overflow-hidden`}>
                 {/* Overlay saat hover */}
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Link href="#" className="p-3 bg-zinc-800 rounded-full text-white hover:bg-emerald-500 transition"><FaGithub /></Link>
                    <Link href="#" className="p-3 bg-zinc-800 rounded-full text-white hover:bg-emerald-500 transition"><FaExternalLinkAlt /></Link>
                 </div>
                 <span className="text-white/20 font-bold text-4xl">Preview</span>
              </div>

              {/* 2. Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags Teknologi */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Tombol Lihat Semua */}
        <div className="mt-12 text-center">
            <Link href="/projects" className="inline-block px-6 py-3 border border-zinc-700 rounded-full text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 transition">
                View All Projects
            </Link>
        </div>

      </div>
    </section>
  );
};

export default Projects;