// Supabase client configuration
// Install dengan: npm install @supabase/supabase-js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types untuk database
export interface HeroContent {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BentoGridImage {
  id: number;
  type: 'project' | 'about_me';
  image_url: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: number;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  duration: string;
  months: string;
  type: string;
  work_type: string;
  logo: string;
  logo_url: string | null;
  responsibilities: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  major: string;
  degree_code: string | null;
  start_year: number;
  end_year: number | null;
  duration: string;
  location: string;
  logo: string;
  logo_url: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TechStack {
  id: number;
  name: string;
  icon_name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  slug: string;
  featured: boolean;
  image_type: 'desktop' | 'mobile' | 'multiple';
  image_url: string | null;
  project_url: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  tech_stacks?: TechStack[]; // Optional untuk join dengan tech stacks
}

export interface Achievement {
  id: number;
  title: string;
  issuer: string;
  issued_date: string;
  category: string;
  credential_url: string | null;
  certificate_url: string;
  certificate_type: 'image';
  tags: string[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactLink {
  id: number;
  title: string;
  description: string;
  button_text: string;
  url: string;
  icon_name: string;
  icon_type: 'fa' | 'si';
  gradient?: string; // Optional - warna ditentukan di frontend berdasarkan URL
  bg_color?: string; // Optional - warna ditentukan di frontend berdasarkan URL
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SidebarProfile {
  id: number;
  name: string;
  job_title: string;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

