"use client";

import { useState, useEffect } from "react";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { ContactLink } from "@/lib/supabase";
import emailjs from '@emailjs/browser';
import { useTranslations } from "next-intl";

export default function Contact() {
  const t = useTranslations('Contact');
  const tCommon = useTranslations('Common');
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    fetchContactLinks();
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

  // Helper function untuk render icon
  const renderIcon = (iconName: string, iconType: 'fa' | 'si') => {
    if (iconType === 'fa') {
      const IconComponent = (FaIcons as any)[iconName];
      return IconComponent ? <IconComponent /> : null;
    } else {
      const IconComponent = (SiIcons as any)[iconName];
      return IconComponent ? <IconComponent /> : null;
    }
  };

  // Helper function untuk menentukan warna berdasarkan platform
  const getColorsByPlatform = (url: string) => {
    const urlLower = url.toLowerCase();

    if (urlLower.includes('instagram')) {
      return {
        gradient: 'from-pink-500 via-purple-500 to-orange-400',
        bgColor: 'bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-400/10'
      };
    } else if (urlLower.includes('linkedin')) {
      return {
        gradient: 'from-blue-600 via-blue-500 to-blue-400',
        bgColor: 'bg-gradient-to-br from-blue-600/10 via-blue-500/10 to-blue-400/10'
      };
    } else if (urlLower.includes('gmail') || urlLower.includes('mail.google')) {
      return {
        gradient: 'from-red-500 via-red-400 to-orange-400',
        bgColor: 'bg-gradient-to-br from-red-500/10 via-red-400/10 to-orange-400/10'
      };
    } else if (urlLower.includes('tiktok')) {
      return {
        gradient: 'from-cyan-400 via-pink-500 to-purple-500',
        bgColor: 'bg-gradient-to-br from-cyan-400/10 via-pink-500/10 to-purple-500/10'
      };
    } else if (urlLower.includes('github')) {
      return {
        gradient: 'from-gray-600 via-gray-500 to-gray-400',
        bgColor: 'bg-gradient-to-br from-gray-600/10 via-gray-500/10 to-gray-400/10'
      };
    } else if (urlLower.includes('twitter') || urlLower.includes('x.com')) {
      return {
        gradient: 'from-sky-500 via-blue-500 to-blue-600',
        bgColor: 'bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-blue-600/10'
      };
    } else if (urlLower.includes('youtube')) {
      return {
        gradient: 'from-red-600 via-red-500 to-red-400',
        bgColor: 'bg-gradient-to-br from-red-600/10 via-red-500/10 to-red-400/10'
      };
    } else if (urlLower.includes('facebook')) {
      return {
        gradient: 'from-blue-600 via-blue-500 to-blue-700',
        bgColor: 'bg-gradient-to-br from-blue-600/10 via-blue-500/10 to-blue-700/10'
      };
    } else if (urlLower.includes('whatsapp') || urlLower.includes('wa.me')) {
      return {
        gradient: 'from-green-500 via-green-400 to-emerald-500',
        bgColor: 'bg-gradient-to-br from-green-500/10 via-green-400/10 to-emerald-500/10'
      };
    } else {
      // Default gradient untuk platform lain
      return {
        gradient: 'from-zinc-700 via-zinc-600 to-zinc-800',
        bgColor: 'bg-zinc-900/50'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus({ type: null, message: '' });

    try {
      // EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      // Kirim email menggunakan EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'bangkennn29@gmail.com',
        },
        publicKey
      );

      setSendStatus({
        type: 'success',
        message: t('success')
      });
      // Reset form
      setFormData({ name: "", email: "", message: "" });

    } catch (error: any) {
      console.error('EmailJS Error:', error);
      setSendStatus({
        type: 'error',
        message: t('error')
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-10 md:py-20 max-w-7xl mx-auto px-4">

      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <FaEnvelope className="text-emerald-500" /> {t('title')}
        </h2>
        <p className="text-zinc-500 text-sm md:text-l">{t('subtitle')}</p>
      </div>

      {/* Social Media Section */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
          {t('find_me')}
        </h2>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-zinc-500">{tCommon('loading')}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactLinks.map((card) => {
              // Dapatkan warna berdasarkan URL platform
              const colors = getColorsByPlatform(card.url);

              return (
                <div
                  key={card.id}
                  className={[
                    'relative group border border-zinc-800 rounded-2xl p-6 overflow-hidden',
                    'hover:border-emerald-500/50 transition-all duration-300 min-h-[200px]',
                    colors.bgColor
                  ].join(' ')}
                >
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm font-medium transition-all duration-300 group/btn w-1/2"
                    >
                      {card.button_text}
                      <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Background gradient orb effect */}
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl animate-pulse`}></div>
                  </div>

                  {/* Icon dengan floating animation dan neon glow */}
                  <div className="absolute bottom-4 right-4 group-hover:bottom-6 group-hover:right-6 transition-all duration-300">
                    <div className="relative">
                      {/* Outer glow rings */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl blur-xl opacity-60 group-hover:opacity-80 animate-pulse`} style={{ transform: 'scale(1.5)' }}></div>
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-xl blur-md opacity-40 group-hover:opacity-60`} style={{ transform: 'scale(1.2)' }}></div>

                      {/* Main icon container dengan gradient border */}
                      <div className="relative w-14 h-14 group-hover:w-16 group-hover:h-16 transition-all duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-xl p-[2px]`}>
                          <div className="w-full h-full bg-zinc-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
                            <div className="text-2xl text-white group-hover:text-3xl transition-all duration-300 drop-shadow-2xl">
                              {renderIcon(card.icon_name, card.icon_type)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Form Section */}
      <div className="max-w-2xl">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
          {t('or_message')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
              {t('name_label')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder={t('name_placeholder')}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
              {t('email_label')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder={t('email_placeholder')}
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">
              {t('message_label')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
              placeholder={t('message_placeholder')}
            />
          </div>

          {/* Status Notification */}
          {sendStatus.type && (
            <div className={`p-4 rounded-xl border ${sendStatus.type === 'success'
              ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400'
              : 'bg-red-900/20 border-red-500/30 text-red-400'
              }`}>
              <p className="text-sm">{sendStatus.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className={`w-full px-6 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${isSending
              ? 'bg-zinc-600 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
              } text-white`}
          >
            {isSending ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('sending')}
              </>
            ) : (
              <>
                {t('send_button')}
                <FaArrowRight />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}

