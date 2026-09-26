import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030712",
};

export const metadata: Metadata = {
  title: "Basavaraj M Angadi | AI & Machine Learning Student | Developer",
  description: "Portfolio of Basavaraj M Angadi, B.Tech AI & ML Student preparing for internships and placements. Explore cutting-edge AI/ML projects, skills, certifications, and technical experience.",
  keywords: [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "B.Tech AIML",
    "Software Developer",
    "Next.js Portfolio",
    "Python Developer",
    "Student Portfolio"
  ],
  authors: [{ name: "Basavaraj M Angadi" }],
  creator: "Basavaraj M Angadi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://basu-portfolio-five.vercel.app",
    title: "Basavaraj M Angadi | AI & Machine Learning Student | Developer",
    description: "B.Tech AI & ML student portfolio showcasing intelligent systems, deep learning projects, certifications, and technical competencies.",
    siteName: "Basavaraj M Angadi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Basavaraj M Angadi | AI & Machine Learning Student | Developer",
    description: "B.Tech AI & ML student portfolio showcasing intelligent systems, deep learning projects, and technical skills.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-gray-100 antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
