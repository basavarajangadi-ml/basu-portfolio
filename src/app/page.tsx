import { getPortfolioData } from "@/lib/server/portfolioStorage";
import PortfolioClient from "@/components/portfolio/PortfolioClient";

// Ensure this page is rendered dynamically with the freshest server data on every request
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <PortfolioClient 
      initialData={{
        profile: data.profile,
        projects: data.projects,
        certificates: data.certificates,
        skills: data.skills,
        education: data.education,
        experience: data.experience,
        achievements: data.achievements,
        socialLinks: data.socialLinks,
        settings: data.settings,
      }} 
    />
  );
}
