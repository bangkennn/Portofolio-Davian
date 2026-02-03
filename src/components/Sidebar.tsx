"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaUser, FaBriefcase, FaEnvelope, FaGithub, FaLinkedin, FaTrophy, FaLock, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { auth } from '@/lib/auth';
import { SidebarProfile } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState<SidebarProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication setelah component mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
    setIsAuthenticated(auth.isAuthenticated());
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/sidebar-profile');
      const data = await res.json();
      if (data.data) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sidebar profile:', error);
    }
  };

  // Redirect ke admin dashboard jika sudah login dan mengakses halaman public
  useEffect(() => {
    if (!isMounted) return;
    const isPublicPage = pathname && !pathname.startsWith('/admin');
    if (isPublicPage && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [pathname, router, isAuthenticated, isMounted]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    auth.clearSession();
    setIsAuthenticated(false);
    setShowLogoutConfirm(false);
    router.push("/admin/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-white hover:bg-zinc-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, slides in when menu open, always visible on desktop */}
      <aside className={`
        w-64 h-screen fixed left-0 top-0 bg-black border-r border-zinc-800 text-white p-6 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* Profil */}
        <div className="flex flex-col items-center mb-10">
          {/* Lingkaran Foto */}
          <div className="w-28 h-28 rounded-full bg-zinc-900 mb-5 border-2 border-emerald-500 overflow-hidden relative flex items-center justify-center shadow-lg shadow-emerald-500/10">
            {profile?.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-zinc-600">IMG</span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {profile?.name || 'Davian Putra'}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-sm text-zinc-400">{profile?.job_title || 'Web Developer'}</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 w-full relative z-10">
          <ul className="space-y-1.5">
            {!isMounted ? (
              // Placeholder saat masih loading (untuk menghindari hydration mismatch)
              <>
                <NavItem href="/" icon={<FaHome />} label="Home" />
                <NavItem href="/about" icon={<FaUser />} label="About" />
                <NavItem href="/projects" icon={<FaBriefcase />} label="Projects" />
                <NavItem href="/achievement" icon={<FaTrophy />} label="Achievement" />
                <NavItem href="/contact" icon={<FaEnvelope />} label="Contact" />
              </>
            ) : isAuthenticated ? (
              <li className="px-4 py-2.5">
                <div className="flex items-center gap-3 text-zinc-500 text-sm">
                  <span>{t('login_message')}</span>
                </div>
              </li>
            ) : (
              <>
                <NavItem href="/" icon={<FaHome />} label={t('home')} />
                <NavItem href="/about" icon={<FaUser />} label={t('about')} />
                <NavItem href="/projects" icon={<FaBriefcase />} label={t('projects')} />
                <NavItem href="/achievement" icon={<FaTrophy />} label={t('achievement')} />
                <NavItem href="/contact" icon={<FaEnvelope />} label={t('contact')} />
              </>
            )}
          </ul>
        </nav>

        {/* Sosial Media & Logout */}
        <div className="mt-auto space-y-4">

          {/* Language Switcher (Mobile Only) */}
          <div className="lg:hidden">
            <LanguageSwitcher />
          </div>

          {/* Admin Login / Logout Button */}
          {!isMounted ? (
            // Placeholder saat masih loading
            <Link
              href="/admin/login"
              className="flex items-center gap-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group"
            >
              <FaLock className="text-sm group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Admin Login</span>
            </Link>
          ) : isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 group"
            >
              <FaSignOutAlt className="text-sm group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{t('logout')}</span>
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center gap-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group"
            >
              <FaLock className="text-sm group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{t('admin')}</span>
            </Link>
          )}

          <div>
            <p className="text-xs text-zinc-600 mb-3 text-center uppercase tracking-widest font-semibold">{t('socials')}</p>
            <div className="flex gap-5 text-xl text-zinc-500 justify-center">
              <a
                href="https://github.com/bangkennn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 hover:-translate-y-1 transition-all duration-300"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/davian-putra-swardana/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 hover:-translate-y-1 transition-all duration-300"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Konfirmasi Logout</h3>
              <p className="text-zinc-400 mb-6">
                Apakah Anda yakin ingin logout? Anda harus login kembali untuk mengakses admin panel.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

// Item Menu dengan warna hover yang lebih halus
const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-emerald-400 transition-all duration-300 group">
        <span className="text-base group-hover:scale-110 transition-transform">{icon}</span>
        <span className="font-medium text-sm tracking-wide">{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
