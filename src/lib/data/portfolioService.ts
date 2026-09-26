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
  SYNCED: 'portfolio_server_synced_v1',
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
    console.warn(`Failed to persist to localStorage [${key}]`, e);
  }
}

// Broadcast event to other components and tabs
function broadcastUpdate(section: string) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('portfolio-updated', { detail: { section } }));
    // Also trigger storage event in other windows
    localStorage.setItem('portfolio_last_updated', Date.now().toString());
  } catch {}
}

// Helper to push section changes to the persistent server API
async function saveSectionToServer(section: string, data: any): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data }),
    });
    return res.ok;
  } catch (err) {
    console.warn(`Failed to sync [${section}] to server:`, err);
    return false;
  }
}

// Memory cache for the current session
let serverDataCache: any = null;
let serverFetchPromise: Promise<any> | null = null;

export const portfolioService = {
  /**
   * Fetches all live data from the server's persistent JSON store (/api/portfolio)
   * Populates client cache and localStorage
   */
  async fetchAll() {
    if (typeof window === 'undefined') return null;

    if (serverFetchPromise) {
      return serverFetchPromise;
    }

    serverFetchPromise = (async () => {
      try {
        const res = await fetch('/api/portfolio', {
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache' }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            serverDataCache = json.data;
            
            // Sync to local storage for offline resiliency
            if (json.data.profile) setLocalItem(STORAGE_KEYS.PROFILE, json.data.profile);
            if (json.data.projects) setLocalItem(STORAGE_KEYS.PROJECTS, json.data.projects);
            if (json.data.certificates) setLocalItem(STORAGE_KEYS.CERTIFICATES, json.data.certificates);
            if (json.data.skills) setLocalItem(STORAGE_KEYS.SKILLS, json.data.skills);
            if (json.data.education) setLocalItem(STORAGE_KEYS.EDUCATION, json.data.education);
            if (json.data.experience) setLocalItem(STORAGE_KEYS.EXPERIENCE, json.data.experience);
            if (json.data.achievements) setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, json.data.achievements);
            if (json.data.socialLinks) setLocalItem(STORAGE_KEYS.SOCIAL, json.data.socialLinks);
            if (json.data.settings) setLocalItem(STORAGE_KEYS.SETTINGS, json.data.settings);
            if (json.data.messages) setLocalItem(STORAGE_KEYS.MESSAGES, json.data.messages);

            return json.data;
          }
        }
      } catch (err) {
        console.warn('Could not reach /api/portfolio, using client fallback', err);
      } finally {
        serverFetchPromise = null;
      }
      return null;
    })();

    return serverFetchPromise;
  },

  /**
   * If the user previously made edits in localStorage before the server API existed,
   * push those local changes to the server so they are visible on mobile and other devices.
   */
  async syncLocalToServerIfAvailable(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const alreadySynced = localStorage.getItem(STORAGE_KEYS.SYNCED);
      if (alreadySynced) return;

      const localProfile = getLocalItem<Profile | null>(STORAGE_KEYS.PROFILE, null);
      const isCustomized = localProfile && localProfile.full_name && !localProfile.full_name.includes('[YOUR');

      if (isCustomized) {
        const fullData = {
          profile: localProfile,
          projects: getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects),
          certificates: getLocalItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, initialCertificates),
          skills: getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills),
          education: getLocalItem<Education[]>(STORAGE_KEYS.EDUCATION, initialEducation),
          experience: getLocalItem<Experience[]>(STORAGE_KEYS.EXPERIENCE, initialExperience),
          achievements: getLocalItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements),
          socialLinks: getLocalItem<SocialLink[]>(STORAGE_KEYS.SOCIAL, initialSocialLinks),
          settings: getLocalItem<PortfolioSettings>(STORAGE_KEYS.SETTINGS, initialSettings),
          messages: getLocalItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []),
        };

        await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullData }),
        });
      }
      localStorage.setItem(STORAGE_KEYS.SYNCED, 'true');
    } catch (e) {
      console.warn('Auto-sync local to server encountered an error:', e);
    }
  },

  // ----------------------------------------------------
  // PROFILE
  // ----------------------------------------------------
  async getProfile(): Promise<Profile> {
    // 1. Check server cache if available
    if (serverDataCache?.profile) {
      return serverDataCache.profile;
    }

    // 2. Check live Supabase if active
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
        if (!error && data) return data as Profile;
      } catch (e) {
        console.warn('Falling back to server/local profile data', e);
      }
    }

    // 3. Try fetching from server API
    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.profile) return full.profile;
      } catch {}
    }

    // 4. Local storage / initial data fallback
    return getLocalItem<Profile>(STORAGE_KEYS.PROFILE, initialProfile);
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile();
    const updated: Profile = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // 1. Update memory cache & local storage
    if (serverDataCache) serverDataCache.profile = updated;
    setLocalItem(STORAGE_KEYS.PROFILE, updated);

    // 2. Persist to server JSON store
    await saveSectionToServer('profile', updated);

    // 3. Persist to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('profiles').upsert(updated);
      } catch (e) {
        console.warn('Supabase update failed, persisted locally and to server file', e);
      }
    }

    // 4. Broadcast update event
    broadcastUpdate('profile');
    return updated;
  },

  // ----------------------------------------------------
  // PROJECTS
  // ----------------------------------------------------
  async getProjects(): Promise<Project[]> {
    if (serverDataCache?.projects) return serverDataCache.projects;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });
        if (!error && data) return data as Project[];
      } catch (e) {
        console.warn('Falling back to server/local projects', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.projects) return full.projects;
      } catch {}
    }

    return getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  },

  async createProject(item: Omit<Project, 'id'>): Promise<Project> {
    const current = await this.getProjects();
    const newItem: Project = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const updatedList = [newItem, ...current];
    if (serverDataCache) serverDataCache.projects = updatedList;
    setLocalItem(STORAGE_KEYS.PROJECTS, updatedList);

    await saveSectionToServer('projects', updatedList);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('projects').insert(newItem);
      } catch (e) {
        console.warn('Supabase project insert failed', e);
      }
    }

    broadcastUpdate('projects');
    return newItem;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const current = await this.getProjects();
    let updatedItem: Project | null = null;
    const updatedList = current.map(p => {
      if (p.id === id) {
        updatedItem = { ...p, ...updates };
        return updatedItem;
      }
      return p;
    });

    if (serverDataCache) serverDataCache.projects = updatedList;
    setLocalItem(STORAGE_KEYS.PROJECTS, updatedList);

    await saveSectionToServer('projects', updatedList);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('projects').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase project update failed', e);
      }
    }

    broadcastUpdate('projects');
    return updatedItem || ({ ...updates, id } as Project);
  },

  async deleteProject(id: string): Promise<boolean> {
    const current = await this.getProjects();
    const updated = current.filter(p => p.id !== id);

    if (serverDataCache) serverDataCache.projects = updated;
    setLocalItem(STORAGE_KEYS.PROJECTS, updated);

    await saveSectionToServer('projects', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete project failed', e);
      }
    }

    broadcastUpdate('projects');
    return true;
  },

  // ----------------------------------------------------
  // CERTIFICATES
  // ----------------------------------------------------
  async getCertificates(): Promise<Certificate[]> {
    if (serverDataCache?.certificates) return serverDataCache.certificates;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Certificate[];
      } catch (e) {
        console.warn('Falling back to local certificates', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.certificates) return full.certificates;
      } catch {}
    }

    return getLocalItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  },

  async createCertificate(item: Omit<Certificate, 'id'>): Promise<Certificate> {
    const current = await this.getCertificates();
    const newItem: Certificate = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const updated = [newItem, ...current];
    if (serverDataCache) serverDataCache.certificates = updated;
    setLocalItem(STORAGE_KEYS.CERTIFICATES, updated);

    await saveSectionToServer('certificates', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('certificates').insert(newItem);
      } catch (e) {
        console.warn('Supabase certificate insert failed', e);
      }
    }

    broadcastUpdate('certificates');
    return newItem;
  },

  async updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate> {
    const current = await this.getCertificates();
    let updatedItem: Certificate | null = null;
    const updated = current.map(c => {
      if (c.id === id) {
        updatedItem = { ...c, ...updates };
        return updatedItem;
      }
      return c;
    });

    if (serverDataCache) serverDataCache.certificates = updated;
    setLocalItem(STORAGE_KEYS.CERTIFICATES, updated);

    await saveSectionToServer('certificates', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('certificates').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase cert update failed', e);
      }
    }

    broadcastUpdate('certificates');
    return updatedItem || ({ ...updates, id } as Certificate);
  },

  async deleteCertificate(id: string): Promise<boolean> {
    const current = await this.getCertificates();
    const updated = current.filter(c => c.id !== id);

    if (serverDataCache) serverDataCache.certificates = updated;
    setLocalItem(STORAGE_KEYS.CERTIFICATES, updated);

    await saveSectionToServer('certificates', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('certificates').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase cert delete failed', e);
      }
    }

    broadcastUpdate('certificates');
    return true;
  },

  // ----------------------------------------------------
  // SKILLS
  // ----------------------------------------------------
  async getSkills(): Promise<Skill[]> {
    if (serverDataCache?.skills) return serverDataCache.skills;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Skill[];
      } catch (e) {
        console.warn('Falling back to local skills', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.skills) return full.skills;
      } catch {}
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

    const updated = [...current, newItem];
    if (serverDataCache) serverDataCache.skills = updated;
    setLocalItem(STORAGE_KEYS.SKILLS, updated);

    await saveSectionToServer('skills', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('skills').insert(newItem);
      } catch (e) {
        console.warn('Supabase skill insert failed', e);
      }
    }

    broadcastUpdate('skills');
    return newItem;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    const current = await this.getSkills();
    let updatedItem: Skill | null = null;
    const updated = current.map(s => {
      if (s.id === id) {
        updatedItem = { ...s, ...updates };
        return updatedItem;
      }
      return s;
    });

    if (serverDataCache) serverDataCache.skills = updated;
    setLocalItem(STORAGE_KEYS.SKILLS, updated);

    await saveSectionToServer('skills', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('skills').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase skill update failed', e);
      }
    }

    broadcastUpdate('skills');
    return updatedItem || ({ ...updates, id } as Skill);
  },

  async deleteSkill(id: string): Promise<boolean> {
    const current = await this.getSkills();
    const updated = current.filter(s => s.id !== id);

    if (serverDataCache) serverDataCache.skills = updated;
    setLocalItem(STORAGE_KEYS.SKILLS, updated);

    await saveSectionToServer('skills', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('skills').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete skill failed', e);
      }
    }

    broadcastUpdate('skills');
    return true;
  },

  async reorderSkills(orderedSkills: Skill[]): Promise<void> {
    const updated = orderedSkills.map((s, idx) => ({ ...s, order_index: idx + 1 }));

    if (serverDataCache) serverDataCache.skills = updated;
    setLocalItem(STORAGE_KEYS.SKILLS, updated);

    await saveSectionToServer('skills', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        for (const item of updated) {
          await supabase.from('skills').update({ order_index: item.order_index }).eq('id', item.id);
        }
      } catch (e) {
        console.warn('Supabase reorder failed', e);
      }
    }

    broadcastUpdate('skills');
  },

  // ----------------------------------------------------
  // EDUCATION
  // ----------------------------------------------------
  async getEducation(): Promise<Education[]> {
    if (serverDataCache?.education) return serverDataCache.education;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('education').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Education[];
      } catch (e) {
        console.warn('Falling back to local education', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.education) return full.education;
      } catch {}
    }

    return getLocalItem<Education[]>(STORAGE_KEYS.EDUCATION, initialEducation);
  },

  async createEducation(item: Omit<Education, 'id'>): Promise<Education> {
    const current = await this.getEducation();
    const newItem: Education = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const updated = [...current, newItem];
    if (serverDataCache) serverDataCache.education = updated;
    setLocalItem(STORAGE_KEYS.EDUCATION, updated);

    await saveSectionToServer('education', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('education').insert(newItem);
      } catch (e) {
        console.warn('Supabase education insert failed', e);
      }
    }

    broadcastUpdate('education');
    return newItem;
  },

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    const current = await this.getEducation();
    let updatedItem: Education | null = null;
    const updated = current.map(e => {
      if (e.id === id) {
        updatedItem = { ...e, ...updates };
        return updatedItem;
      }
      return e;
    });

    if (serverDataCache) serverDataCache.education = updated;
    setLocalItem(STORAGE_KEYS.EDUCATION, updated);

    await saveSectionToServer('education', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('education').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase edu update failed', e);
      }
    }

    broadcastUpdate('education');
    return updatedItem || ({ ...updates, id } as Education);
  },

  async deleteEducation(id: string): Promise<boolean> {
    const current = await this.getEducation();
    const updated = current.filter(e => e.id !== id);

    if (serverDataCache) serverDataCache.education = updated;
    setLocalItem(STORAGE_KEYS.EDUCATION, updated);

    await saveSectionToServer('education', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('education').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase edu delete failed', e);
      }
    }

    broadcastUpdate('education');
    return true;
  },

  // ----------------------------------------------------
  // EXPERIENCE / INTERNSHIPS
  // ----------------------------------------------------
  async getExperience(): Promise<Experience[]> {
    if (serverDataCache?.experience) return serverDataCache.experience;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('experience').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Experience[];
      } catch (e) {
        console.warn('Falling back to local experience', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.experience) return full.experience;
      } catch {}
    }

    return getLocalItem<Experience[]>(STORAGE_KEYS.EXPERIENCE, initialExperience);
  },

  async createExperience(item: Omit<Experience, 'id'>): Promise<Experience> {
    const current = await this.getExperience();
    const newItem: Experience = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const updated = [newItem, ...current];
    if (serverDataCache) serverDataCache.experience = updated;
    setLocalItem(STORAGE_KEYS.EXPERIENCE, updated);

    await saveSectionToServer('experience', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('experience').insert(newItem);
      } catch (e) {
        console.warn('Supabase exp insert failed', e);
      }
    }

    broadcastUpdate('experience');
    return newItem;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    const current = await this.getExperience();
    let updatedItem: Experience | null = null;
    const updated = current.map(exp => {
      if (exp.id === id) {
        updatedItem = { ...exp, ...updates };
        return updatedItem;
      }
      return exp;
    });

    if (serverDataCache) serverDataCache.experience = updated;
    setLocalItem(STORAGE_KEYS.EXPERIENCE, updated);

    await saveSectionToServer('experience', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('experience').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase exp update failed', e);
      }
    }

    broadcastUpdate('experience');
    return updatedItem || ({ ...updates, id } as Experience);
  },

  async deleteExperience(id: string): Promise<boolean> {
    const current = await this.getExperience();
    const updated = current.filter(exp => exp.id !== id);

    if (serverDataCache) serverDataCache.experience = updated;
    setLocalItem(STORAGE_KEYS.EXPERIENCE, updated);

    await saveSectionToServer('experience', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('experience').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase exp delete failed', e);
      }
    }

    broadcastUpdate('experience');
    return true;
  },

  // ----------------------------------------------------
  // ACHIEVEMENTS
  // ----------------------------------------------------
  async getAchievements(): Promise<Achievement[]> {
    if (serverDataCache?.achievements) return serverDataCache.achievements;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('achievements').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as Achievement[];
      } catch (e) {
        console.warn('Falling back to local achievements', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.achievements) return full.achievements;
      } catch {}
    }

    return getLocalItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
  },

  async createAchievement(item: Omit<Achievement, 'id'>): Promise<Achievement> {
    const current = await this.getAchievements();
    const newItem: Achievement = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `a-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    const updated = [newItem, ...current];
    if (serverDataCache) serverDataCache.achievements = updated;
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, updated);

    await saveSectionToServer('achievements', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('achievements').insert(newItem);
      } catch (e) {
        console.warn('Supabase achievement insert failed', e);
      }
    }

    broadcastUpdate('achievements');
    return newItem;
  },

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    const current = await this.getAchievements();
    let updatedItem: Achievement | null = null;
    const updated = current.map(a => {
      if (a.id === id) {
        updatedItem = { ...a, ...updates };
        return updatedItem;
      }
      return a;
    });

    if (serverDataCache) serverDataCache.achievements = updated;
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, updated);

    await saveSectionToServer('achievements', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('achievements').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase achievement update failed', e);
      }
    }

    broadcastUpdate('achievements');
    return updatedItem || ({ ...updates, id } as Achievement);
  },

  async deleteAchievement(id: string): Promise<boolean> {
    const current = await this.getAchievements();
    const updated = current.filter(a => a.id !== id);

    if (serverDataCache) serverDataCache.achievements = updated;
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, updated);

    await saveSectionToServer('achievements', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('achievements').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase achievement delete failed', e);
      }
    }

    broadcastUpdate('achievements');
    return true;
  },

  // ----------------------------------------------------
  // SOCIAL LINKS
  // ----------------------------------------------------
  async getSocialLinks(): Promise<SocialLink[]> {
    if (serverDataCache?.socialLinks) return serverDataCache.socialLinks;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('social_links').select('*').order('order_index', { ascending: true });
        if (!error && data) return data as SocialLink[];
      } catch (e) {
        console.warn('Falling back to local social links', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.socialLinks) return full.socialLinks;
      } catch {}
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

    if (serverDataCache) serverDataCache.socialLinks = updated;
    setLocalItem(STORAGE_KEYS.SOCIAL, updated);

    await saveSectionToServer('socialLinks', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('social_links').upsert(target);
      } catch (e) {
        console.warn('Supabase social link save failed', e);
      }
    }

    broadcastUpdate('socialLinks');
    return target;
  },

  async deleteSocialLink(id: string): Promise<boolean> {
    const current = await this.getSocialLinks();
    const updated = current.filter(s => s.id !== id);

    if (serverDataCache) serverDataCache.socialLinks = updated;
    setLocalItem(STORAGE_KEYS.SOCIAL, updated);

    await saveSectionToServer('socialLinks', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('social_links').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase social delete failed', e);
      }
    }

    broadcastUpdate('socialLinks');
    return true;
  },

  // ----------------------------------------------------
  // CONTACT MESSAGES
  // ----------------------------------------------------
  async getContactMessages(): Promise<ContactMessage[]> {
    if (serverDataCache?.messages) return serverDataCache.messages;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as ContactMessage[];
      } catch (e) {
        console.warn('Falling back to local messages', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.messages) return full.messages;
      } catch {}
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

    const current = await this.getContactMessages();
    const updated = [newMsg, ...current];

    if (serverDataCache) serverDataCache.messages = updated;
    setLocalItem(STORAGE_KEYS.MESSAGES, updated);

    await saveSectionToServer('messages', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_messages').insert(newMsg);
      } catch (e) {
        console.warn('Supabase message insert failed', e);
      }
    }

    broadcastUpdate('messages');
    return newMsg;
  },

  async markMessageAsRead(id: string): Promise<void> {
    const current = await this.getContactMessages();
    const updated = current.map(m => m.id === id ? { ...m, is_read: true } : m);

    if (serverDataCache) serverDataCache.messages = updated;
    setLocalItem(STORAGE_KEYS.MESSAGES, updated);

    await saveSectionToServer('messages', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
      } catch (e) {
        console.warn('Supabase message update failed', e);
      }
    }

    broadcastUpdate('messages');
  },

  async deleteContactMessage(id: string): Promise<void> {
    const current = await this.getContactMessages();
    const updated = current.filter(m => m.id !== id);

    if (serverDataCache) serverDataCache.messages = updated;
    setLocalItem(STORAGE_KEYS.MESSAGES, updated);

    await saveSectionToServer('messages', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase message delete failed', e);
      }
    }

    broadcastUpdate('messages');
  },

  // ----------------------------------------------------
  // SETTINGS
  // ----------------------------------------------------
  async getSettings(): Promise<PortfolioSettings> {
    if (serverDataCache?.settings) return serverDataCache.settings;

    if (typeof window !== 'undefined') {
      try {
        const full = await this.fetchAll();
        if (full?.settings) return full.settings;
      } catch {}
    }

    return getLocalItem<PortfolioSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },

  async updateSettings(updates: Partial<PortfolioSettings>): Promise<PortfolioSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...updates };

    if (serverDataCache) serverDataCache.settings = updated;
    setLocalItem(STORAGE_KEYS.SETTINGS, updated);

    await saveSectionToServer('settings', updated);

    broadcastUpdate('settings');
    return updated;
  },

  // ----------------------------------------------------
  // STATISTICS
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
