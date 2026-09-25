import { 
  Profile, 
  Project, 
  Certificate, 
  Skill, 
  Education, 
  Experience, 
  Achievement, 
  SocialLink, 
  ContactMessage, 
  PortfolioSettings 
} from '../supabase/types';
import { 
  initialProfile, 
  initialSkills, 
  initialProjects, 
  initialCertificates, 
  initialEducation, 
  initialExperience, 
  initialAchievements, 
  initialSocialLinks, 
  initialSettings 
} from './initialData';
import { supabase, isSupabaseConfigured } from '../supabase/client';

// Local storage key constants
const STORAGE_KEYS = {
  PROFILE: 'portfolio_profile_data',
  PROJECTS: 'portfolio_projects_data',
  CERTIFICATES: 'portfolio_certificates_data',
  SKILLS: 'portfolio_skills_data',
  EDUCATION: 'portfolio_education_data',
  EXPERIENCE: 'portfolio_experience_data',
  ACHIEVEMENTS: 'portfolio_achievements_data',
  SOCIAL: 'portfolio_social_data',
  MESSAGES: 'portfolio_messages_data',
  SETTINGS: 'portfolio_settings_data',
};

// Helper for client-side storage persistence
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to persist to localStorage [${key}]`, e);
  }
}

export const portfolioService = {
  // ----------------------------------------------------
  // PROFILE
  // ----------------------------------------------------
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
        if (!error && data) return data as Profile;
      } catch (e) {
        console.warn('Falling back to local profile data', e);
      }
    }
    return getLocalItem<Profile>(STORAGE_KEYS.PROFILE, initialProfile);
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile();
    const updated: Profile = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(updated)
          .select()
          .single();
        if (!error && data) {
          setLocalItem(STORAGE_KEYS.PROFILE, data);
          return data as Profile;
        }
      } catch (e) {
        console.warn('Supabase update failed, saving locally', e);
      }
    }

    setLocalItem(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // ----------------------------------------------------
  // PROJECTS
  // ----------------------------------------------------
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });
        if (!error && data) return data as Project[];
      } catch (e) {
        console.warn('Falling back to local projects', e);
      }
    }
    return getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  },

  async createProject(item: Omit<Project, 'id'>): Promise<Project> {
    const newItem: Project = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('projects').insert(newItem).select().single();
        if (!error && data) {
          const list = await this.getProjects();
          setLocalItem(STORAGE_KEYS.PROJECTS, [...list, data]);
          return data as Project;
        }
      } catch (e) {
        console.warn('Supabase project insert failed, saving locally', e);
      }
    }

    const current = await this.getProjects();
    const updated = [newItem, ...current];
    setLocalItem(STORAGE_KEYS.PROJECTS, updated);
    return newItem;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = await this.getProjects();
          setLocalItem(STORAGE_KEYS.PROJECTS, list.map(p => p.id === id ? data : p));
          return data as Project;
        }
      } catch (e) {
        console.warn('Supabase project update failed, falling back locally', e);
      }
    }

    const current = await this.getProjects();
    let updatedItem: Project | null = null;
    const updatedList = current.map(p => {
      if (p.id === id) {
        updatedItem = { ...p, ...updates };
        return updatedItem;
      }
      return p;
    });
    setLocalItem(STORAGE_KEYS.PROJECTS, updatedList);
    return updatedItem || ({ ...updates, id } as Project);
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete project failed', e);
      }
    }

    const current = await this.getProjects();
    const updated = current.filter(p => p.id !== id);
    setLocalItem(STORAGE_KEYS.PROJECTS, updated);
    return true;
  },

  // ----------------------------------------------------
  // CERTIFICATES
  // ----------------------------------------------------
  async getCertificates(): Promise<Certificate[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Certificate[];
      } catch (e) {
        console.warn('Falling back to local certificates', e);
      }
    }
    return getLocalItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  },

  async createCertificate(item: Omit<Certificate, 'id'>): Promise<Certificate> {
    const newItem: Certificate = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('certificates').insert(newItem).select().single();
        if (!error && data) {
          const list = await this.getCertificates();
          setLocalItem(STORAGE_KEYS.CERTIFICATES, [data, ...list]);
          return data as Certificate;
        }
      } catch (e) {
        console.warn('Supabase certificate insert failed', e);
      }
    }

    const current = await this.getCertificates();
    const updated = [newItem, ...current];
    setLocalItem(STORAGE_KEYS.CERTIFICATES, updated);
    return newItem;
  },

  async updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = await this.getCertificates();
          setLocalItem(STORAGE_KEYS.CERTIFICATES, list.map(c => c.id === id ? data : c));
          return data as Certificate;
        }
      } catch (e) {
        console.warn('Supabase cert update failed', e);
      }
    }

    const current = await this.getCertificates();
    let updatedItem: Certificate | null = null;
    const updated = current.map(c => {
      if (c.id === id) {
        updatedItem = { ...c, ...updates };
        return updatedItem;
      }
      return c;
    });
    setLocalItem(STORAGE_KEYS.CERTIFICATES, updated);
    return updatedItem || ({ ...updates, id } as Certificate);
  },

  async deleteCertificate(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('certificates').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase cert delete failed', e);
      }
    }

    const current = await this.getCertificates();
    const updated = current.filter(c => c.id !== id);
    setLocalItem(STORAGE_KEYS.CERTIFICATES, updated);
    return true;
  },

  // ----------------------------------------------------
  // SKILLS
  // ----------------------------------------------------
  async getSkills(): Promise<Skill[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Skill[];
      } catch (e) {
        console.warn('Falling back to local skills', e);
      }
    }
    return getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills);
  },

  async createSkill(item: Omit<Skill, 'id'>): Promise<Skill> {
    const current = await this.getSkills();
    const newItem: Skill = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}`,
      order_index: item.order_index ?? (current.length + 1),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('skills').insert(newItem).select().single();
        if (!error && data) {
          setLocalItem(STORAGE_KEYS.SKILLS, [...current, data]);
          return data as Skill;
        }
      } catch (e) {
        console.warn('Supabase skill insert failed', e);
      }
    }

    const updated = [...current, newItem];
    setLocalItem(STORAGE_KEYS.SKILLS, updated);
    return newItem;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single();
        if (!error && data) {
          const list = await this.getSkills();
          setLocalItem(STORAGE_KEYS.SKILLS, list.map(s => s.id === id ? data : s));
          return data as Skill;
        }
      } catch (e) {
        console.warn('Supabase skill update failed', e);
      }
    }

    const current = await this.getSkills();
    let updatedItem: Skill | null = null;
    const updated = current.map(s => {
      if (s.id === id) {
        updatedItem = { ...s, ...updates };
        return updatedItem;
      }
      return s;
    });
    setLocalItem(STORAGE_KEYS.SKILLS, updated);
    return updatedItem || ({ ...updates, id } as Skill);
  },

  async deleteSkill(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('skills').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete skill failed', e);
      }
    }

    const current = await this.getSkills();
    const updated = current.filter(s => s.id !== id);
    setLocalItem(STORAGE_KEYS.SKILLS, updated);
    return true;
  },

  async reorderSkills(orderedSkills: Skill[]): Promise<void> {
    const updated = orderedSkills.map((s, idx) => ({ ...s, order_index: idx + 1 }));
    setLocalItem(STORAGE_KEYS.SKILLS, updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        for (const item of updated) {
          await supabase.from('skills').update({ order_index: item.order_index }).eq('id', item.id);
        }
      } catch (e) {
        console.warn('Supabase reorder failed', e);
      }
    }
  },

  // ----------------------------------------------------
  // EDUCATION
  // ----------------------------------------------------
  async getEducation(): Promise<Education[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('education').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Education[];
      } catch (e) {
        console.warn('Falling back to local education', e);
      }
    }
    return getLocalItem<Education[]>(STORAGE_KEYS.EDUCATION, initialEducation);
  },

  async createEducation(item: Omit<Education, 'id'>): Promise<Education> {
    const newItem: Education = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('education').insert(newItem).select().single();
        if (!error && data) {
          const list = await this.getEducation();
          setLocalItem(STORAGE_KEYS.EDUCATION, [...list, data]);
          return data as Education;
        }
      } catch (e) {
        console.warn('Supabase education insert failed', e);
      }
    }

    const current = await this.getEducation();
    const updated = [...current, newItem];
    setLocalItem(STORAGE_KEYS.EDUCATION, updated);
    return newItem;
  },

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('education').update(updates).eq('id', id).select().single();
        if (!error && data) {
          const list = await this.getEducation();
          setLocalItem(STORAGE_KEYS.EDUCATION, list.map(e => e.id === id ? data : e));
          return data as Education;
        }
      } catch (e) {
        console.warn('Supabase edu update failed', e);
      }
    }

    const current = await this.getEducation();
    let updatedItem: Education | null = null;
    const updated = current.map(e => {
      if (e.id === id) {
        updatedItem = { ...e, ...updates };
        return updatedItem;
      }
      return e;
    });
    setLocalItem(STORAGE_KEYS.EDUCATION, updated);
    return updatedItem || ({ ...updates, id } as Education);
  },

  async deleteEducation(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('education').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase edu delete failed', e);
      }
    }

    const current = await this.getEducation();
    const updated = current.filter(e => e.id !== id);
    setLocalItem(STORAGE_KEYS.EDUCATION, updated);
    return true;
  },

  // ----------------------------------------------------
  // EXPERIENCE / INTERNSHIPS
  // ----------------------------------------------------
  async getExperience(): Promise<Experience[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('experience').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Experience[];
      } catch (e) {
        console.warn('Falling back to local experience', e);
      }
    }
    return getLocalItem<Experience[]>(STORAGE_KEYS.EXPERIENCE, initialExperience);
  },

  async createExperience(item: Omit<Experience, 'id'>): Promise<Experience> {
    const newItem: Experience = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('experience').insert(newItem).select().single();
        if (!error && data) {
          const list = await this.getExperience();
          setLocalItem(STORAGE_KEYS.EXPERIENCE, [...list, data]);
          return data as Experience;
        }
      } catch (e) {
        console.warn('Supabase exp insert failed', e);
      }
    }

    const current = await this.getExperience();
    const updated = [newItem, ...current];
    setLocalItem(STORAGE_KEYS.EXPERIENCE, updated);
    return newItem;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('experience').update(updates).eq('id', id).select().single();
        if (!error && data) {
          const list = await this.getExperience();
          setLocalItem(STORAGE_KEYS.EXPERIENCE, list.map(exp => exp.id === id ? data : exp));
          return data as Experience;
        }
      } catch (e) {
        console.warn('Supabase exp update failed', e);
      }
    }

    const current = await this.getExperience();
    let updatedItem: Experience | null = null;
    const updated = current.map(exp => {
      if (exp.id === id) {
        updatedItem = { ...exp, ...updates };
        return updatedItem;
      }
      return exp;
    });
    setLocalItem(STORAGE_KEYS.EXPERIENCE, updated);
    return updatedItem || ({ ...updates, id } as Experience);
  },

  async deleteExperience(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('experience').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase exp delete failed', e);
      }
    }

    const current = await this.getExperience();
    const updated = current.filter(exp => exp.id !== id);
    setLocalItem(STORAGE_KEYS.EXPERIENCE, updated);
    return true;
  },

  // ----------------------------------------------------
  // ACHIEVEMENTS
  // ----------------------------------------------------
  async getAchievements(): Promise<Achievement[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('achievements').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Achievement[];
      } catch (e) {
        console.warn('Falling back to local achievements', e);
      }
    }
    return getLocalItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
  },

  async createAchievement(item: Omit<Achievement, 'id'>): Promise<Achievement> {
    const newItem: Achievement = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `a-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('achievements').insert(newItem).select().single();
        if (!error && data) {
          const list = await this.getAchievements();
          setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, [data, ...list]);
          return data as Achievement;
        }
      } catch (e) {
        console.warn('Supabase achievement insert failed', e);
      }
    }

    const current = await this.getAchievements();
    const updated = [newItem, ...current];
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
    return newItem;
  },

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('achievements').update(updates).eq('id', id).select().single();
        if (!error && data) {
          const list = await this.getAchievements();
          setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, list.map(a => a.id === id ? data : a));
          return data as Achievement;
        }
      } catch (e) {
        console.warn('Supabase achievement update failed', e);
      }
    }

    const current = await this.getAchievements();
    let updatedItem: Achievement | null = null;
    const updated = current.map(a => {
      if (a.id === id) {
        updatedItem = { ...a, ...updates };
        return updatedItem;
      }
      return a;
    });
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
    return updatedItem || ({ ...updates, id } as Achievement);
  },

  async deleteAchievement(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('achievements').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase achievement delete failed', e);
      }
    }

    const current = await this.getAchievements();
    const updated = current.filter(a => a.id !== id);
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
    return true;
  },

  // ----------------------------------------------------
  // SOCIAL LINKS
  // ----------------------------------------------------
  async getSocialLinks(): Promise<SocialLink[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('social_links').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as SocialLink[];
      } catch (e) {
        console.warn('Falling back to local social links', e);
      }
    }
    return getLocalItem<SocialLink[]>(STORAGE_KEYS.SOCIAL, initialSocialLinks);
  },

  async saveSocialLink(link: Omit<SocialLink, 'id'> & { id?: string }): Promise<SocialLink> {
    const current = await this.getSocialLinks();
    let updated: SocialLink[];
    let target: SocialLink;

    if (link.id) {
      target = link as SocialLink;
      updated = current.map(item => item.id === link.id ? target : item);
    } else {
      target = {
        ...link,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sl-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      updated = [...current, target];
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('social_links').upsert(target);
      } catch (e) {
        console.warn('Supabase social link save failed', e);
      }
    }

    setLocalItem(STORAGE_KEYS.SOCIAL, updated);
    return target;
  },

  async deleteSocialLink(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('social_links').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase social delete failed', e);
      }
    }

    const current = await this.getSocialLinks();
    const updated = current.filter(s => s.id !== id);
    setLocalItem(STORAGE_KEYS.SOCIAL, updated);
    return true;
  },

  // ----------------------------------------------------
  // CONTACT MESSAGES
  // ----------------------------------------------------
  async getContactMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as ContactMessage[];
      } catch (e) {
        console.warn('Falling back to local messages', e);
      }
    }
    return getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  },

  async submitContactMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_messages').insert(newMsg);
      } catch (e) {
        console.warn('Supabase message insert failed', e);
      }
    }

    const current = await this.getContactMessages();
    setLocalItem(STORAGE_KEYS.MESSAGES, [newMsg, ...current]);
    return newMsg;
  },

  async markMessageAsRead(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
      } catch (e) {
        console.warn('Supabase message update failed', e);
      }
    }

    const current = await this.getContactMessages();
    setLocalItem(STORAGE_KEYS.MESSAGES, current.map(m => m.id === id ? { ...m, is_read: true } : m));
  },

  async deleteContactMessage(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase message delete failed', e);
      }
    }

    const current = await this.getContactMessages();
    setLocalItem(STORAGE_KEYS.MESSAGES, current.filter(m => m.id !== id));
  },

  // ----------------------------------------------------
  // SETTINGS
  // ----------------------------------------------------
  async getSettings(): Promise<PortfolioSettings> {
    return getLocalItem<PortfolioSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },

  async updateSettings(updates: Partial<PortfolioSettings>): Promise<PortfolioSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };
    setLocalItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // ----------------------------------------------------
  // STATISTICS (Accurate counts directly from real content)
  // ----------------------------------------------------
  async getStats() {
    const [projects, certificates, skills, achievements, experience] = await Promise.all([
      this.getProjects(),
      this.getCertificates(),
      this.getSkills(),
      this.getAchievements(),
      this.getExperience()
    ]);

    return {
      projectsCount: projects.length,
      certificatesCount: certificates.length,
      skillsCount: skills.length,
      achievementsCount: achievements.length,
      experienceCount: experience.length,
      recentProjects: projects.slice(0, 3),
      recentCertificates: certificates.slice(0, 3),
    };
  }
};
