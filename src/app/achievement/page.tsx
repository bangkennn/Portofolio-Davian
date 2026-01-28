"use client";

import { useState, useMemo, useEffect } from "react";
import { FaTrophy, FaSearch, FaChevronDown, FaArrowRight, FaTimes } from "react-icons/fa";
import { Achievement } from "@/lib/supabase";

// Filter options
const filterOptions = [
  { value: "all", label: "All Achievements" },
  { value: "Course", label: "Course" },
  { value: "Competition", label: "Competition" },
  { value: "Program", label: "Program" },
  { value: "Certification", label: "Certification" },
];

export default function Achievement() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Achievement | null>(null);

  useEffect(() => {
    fetchAchievements();
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

  // Filter achievements berdasarkan search dan filter
  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      const matchesSearch =
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter =
        selectedFilter === "all" || achievement.category === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [achievements, searchQuery, selectedFilter]);

  const handleViewCredential = (achievement: Achievement) => {
    setSelectedCertificate(achievement);
  };

  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };

  return (
    <div className="min-h-screen py-20 max-w-7xl mx-auto px-4">
      
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <FaTrophy className="text-emerald-500" /> Pencapaian
        </h2>
        <p className="text-zinc-500 text-l">
          Kumpulan sertifikat dan badge yang saya peroleh sepanjang perjalanan profesional dan akademik.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white hover:border-emerald-500/50 transition-colors min-w-[200px] justify-between"
          >
            <span className="text-sm">
              {filterOptions.find((opt) => opt.value === selectedFilter)?.label || "Filter achievements..."}
            </span>
            <FaChevronDown
              className={`text-xs text-zinc-500 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsFilterOpen(false)}
              ></div>
              <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-20">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      selectedFilter === option.value
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Total Count */}
      <div className="mb-6">
        <p className="text-zinc-400 text-sm">
          Total: <span className="text-emerald-400 font-semibold">{filteredAchievements.length}</span>
        </p>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
          >
            {/* Certificate Image */}
            <div className="relative h-64 bg-zinc-950 overflow-hidden">
              {achievement.certificate_url ? (
                achievement.certificate_type === 'pdf' ? (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-24 h-24 mx-auto mb-4 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
                        <span className="text-4xl">📄</span>
                      </div>
                      <p className="text-zinc-400 text-xs">PDF Certificate</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={achievement.certificate_url}
                    alt={achievement.title}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
                  <div className="w-full h-full bg-zinc-800/30 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-24 h-24 mx-auto mb-4 bg-zinc-700 rounded-lg flex items-center justify-center">
                        <FaTrophy className="text-4xl text-zinc-600" />
                      </div>
                      <p className="text-zinc-600 text-xs">Certificate Preview</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay dengan tombol Lihat Kredensial */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleViewCredential(achievement)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  Lihat Kredensial <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>

            {/* Achievement Info */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {achievement.title}
              </h3>
              <div className="space-y-1 mb-4">
                <p className="text-sm text-zinc-400">
                  <span className="text-zinc-500">Issuer:</span> {achievement.issuer}
                </p>
                <p className="text-sm text-zinc-400">
                  <span className="text-zinc-500">Issued on:</span> {achievement.issued_date}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                  {achievement.category}
                </span>
                {achievement.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 bg-zinc-800/50 border border-zinc-700 text-zinc-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <FaTrophy className="text-6xl text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 text-lg">No achievements found</p>
          <p className="text-zinc-600 text-sm mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="text-zinc-500">Loading...</div>
        </div>
      )}

      {/* Certificate Modal (Semi Fullscreen) */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header dengan tombol close */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCertificate.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {selectedCertificate.issuer} • {selectedCertificate.issued_date}
                </p>
              </div>
              <button
                onClick={handleCloseCertificate}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Certificate Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedCertificate.certificate_type === 'pdf' ? (
                <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-950 rounded-lg">
                  <iframe
                    src={selectedCertificate.certificate_url}
                    className="w-full h-full min-h-[500px] rounded-lg"
                    title={selectedCertificate.title}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <img
                    src={selectedCertificate.certificate_url}
                    alt={selectedCertificate.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Footer dengan info tambahan */}
            <div className="p-6 border-t border-zinc-800">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                  {selectedCertificate.category}
                </span>
                {selectedCertificate.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-zinc-800/50 border border-zinc-700 text-zinc-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {selectedCertificate.credential_url && (
                <a
                  href={selectedCertificate.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm"
                >
                  Buka Kredensial <FaArrowRight className="text-xs" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
