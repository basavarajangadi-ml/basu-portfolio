import fs from "fs/promises";
import path from "path";
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
} from "../supabase/types";
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
} from "../data/initialData";

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  achievements: Achievement[];
  socialLinks: SocialLink[];
  settings: PortfolioSettings;
  messages: ContactMessage[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portfolio-data.json");
const TMP_DATA_FILE = path.join("/tmp", "portfolio-data.json");

// In-memory cache for fast server response & serverless instance state preservation
let memoryCache: PortfolioData | null = null;

function getInitialData(): PortfolioData {
  return {
    profile: { ...initialProfile },
    projects: [...initialProjects],
    certificates: [...initialCertificates],
    skills: [...initialSkills],
    education: [...initialEducation],
    experience: [...initialExperience],
    achievements: [...initialAchievements],
    socialLinks: [...initialSocialLinks],
    settings: { ...initialSettings },
    messages: [],
  };
}

function normalizeData(parsed: any): PortfolioData {
  return {
    profile: parsed.profile || initialProfile,
    projects: Array.isArray(parsed.projects) ? parsed.projects : initialProjects,
    certificates: Array.isArray(parsed.certificates) ? parsed.certificates : initialCertificates,
    skills: Array.isArray(parsed.skills) ? parsed.skills : initialSkills,
    education: Array.isArray(parsed.education) ? parsed.education : initialEducation,
    experience: Array.isArray(parsed.experience) ? parsed.experience : initialExperience,
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements : initialAchievements,
    socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : initialSocialLinks,
    settings: parsed.settings || initialSettings,
    messages: Array.isArray(parsed.messages) ? parsed.messages : [],
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  // 1. Return in-memory cache if available
  if (memoryCache) {
    return memoryCache;
  }

  // 2. Check /tmp on serverless runtimes
  try {
    const tmpRaw = await fs.readFile(TMP_DATA_FILE, "utf-8");
    const tmpParsed = JSON.parse(tmpRaw);
    if (tmpParsed && tmpParsed.profile) {
      memoryCache = normalizeData(tmpParsed);
      return memoryCache;
    }
  } catch {
    // /tmp file not present or unreadable, continue to project file
  }

  // 3. Read from bundled data directory
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    memoryCache = normalizeData(parsed);
    return memoryCache;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      const initial = getInitialData();
      try {
        await savePortfolioData(initial);
      } catch {
        // Safe to ignore if write fails in read-only environment
      }
      memoryCache = initial;
      return initial;
    }
    console.error("Failed to read portfolio-data.json, returning defaults", err);
    const fallback = getInitialData();
    memoryCache = fallback;
    return fallback;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  // Always update memory cache immediately
  memoryCache = { ...data };

  // Try writing to project data directory (local development / persistent disk)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return;
  } catch (err: any) {
    // If running in a read-only filesystem (like Vercel serverless functions: EROFS)
    try {
      await fs.writeFile(TMP_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
      return;
    } catch (tmpErr) {
      console.warn("Could not write to /tmp on serverless:", tmpErr);
    }
  }
}

export async function updatePortfolioSection<K extends keyof PortfolioData>(
  section: K, 
  value: PortfolioData[K]
): Promise<PortfolioData> {
  const current = await getPortfolioData();
  current[section] = value;
  await savePortfolioData(current);
  return current;
}
