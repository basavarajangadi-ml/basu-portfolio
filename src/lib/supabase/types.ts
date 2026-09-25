export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  full_name: string;
  tagline: string;
  short_bio: string;
  career_objective: string;
  degree: string;
  branch: string;
  college: string;
  location: string;
  email: string;
  profile_photo_url: string | null;
  career_interests: string[];
  technical_interests: string[];
  github_username: string;
  linkedin_url: string;
  resume_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ProjectCategory = 
  | 'All'
  | 'AI/ML'
  | 'Web Development'
  | 'Full Stack'
  | 'Data Science'
  | 'Generative AI'
  | 'Other';

export interface Project {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string;
  image_url: string;
  technologies: string[];
  category: 'AI/ML' | 'Web Development' | 'Full Stack' | 'Data Science' | 'Generative AI' | 'Other';
  features: string[];
  github_url: string;
  live_demo_url?: string;
  date: string;
  is_featured?: boolean;
  order_index?: number;
  created_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string;
  credential_id?: string;
  certificate_image_url?: string;
  certificate_pdf_url?: string;
  verification_url?: string;
  description?: string;
  skills: string[];
  category?: string;
  created_at?: string;
}

export type SkillCategory = 
  | 'Programming'
  | 'Web Development'
  | 'AI & Machine Learning'
  | 'Database'
  | 'Tools';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon_name?: string;
  proficiency_level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  order_index: number;
  created_at?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  branch: string;
  start_year: string;
  end_year: string;
  grade?: string;
  description?: string;
  coursework: string[];
  achievements: string[];
  order_index: number;
  created_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  company_url?: string;
  company_logo_url?: string;
  order_index: number;
  created_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Hackathon' | 'Competition' | 'Award' | 'Workshop' | 'Academic' | 'Coding' | 'Event' | 'Other';
  organization: string;
  date: string;
  description: string;
  image_url?: string;
  document_url?: string;
  link_url?: string;
  order_index?: number;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  order_index: number;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PortfolioSettings {
  github_username: string;
  site_title: string;
  site_description: string;
  keywords: string[];
  allow_contact_form: boolean;
}
