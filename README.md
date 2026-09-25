# AI & Machine Learning Developer Portfolio

A modern, professional, recruiter-ready personal portfolio built for **B.Tech Artificial Intelligence & Machine Learning** students preparing for competitive internships and full-time software engineering / AI placement roles.

Includes a fully responsive dark AI theme, glassmorphic UI components, dynamic statistics calculation, and a **secure Admin Dashboard** to manage profile photos, projects, certificates, resume, skills, and inquiries without editing source code.

---

## 🌟 Key Highlights & Architecture

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with curated dark black/deep navy AI aesthetics (`#030712`), cyan/purple gradients, and glassmorphism
- **Backend & Cloud Database**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth)
- **Asset Storage**: Supabase Storage for profile photos, project screenshots, certificate images/PDFs, and resume PDF
- **Zero-Code Updates**: Secure protected Admin Dashboard at `/admin`
- **Dynamic Stats**: Calculates project, certification, and skill counts automatically from real database content (no fake numbers)
- **Recruiter Experience**: Highlights core ML specialties, LeetCode / DSA milestones, verified credentials, and immediate resume download
- **Production & Vercel Ready**: Optimized builds with responsive layouts across mobile, tablet, and ultra-wide screens

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the portfolio.  
Visit [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Dashboard.

> **Note:** The application features a dual-mode service architecture. Even before you connect your live Supabase database, the portfolio runs smoothly in local storage mode with full interactive CRUD support!

---

## 🛠️ Supabase Setup & Production Deployment

For complete, step-by-step instructions on creating your Supabase project, executing the database schema (`supabase/schema.sql`), configuring authentication, setting up storage buckets, and deploying to Vercel, refer to:

👉 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## 📂 Project Structure

```
├── public/                 # Static assets & icons
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── admin/          # Admin Dashboard & protected subpages
│   │   │   ├── certificates/
│   │   │   ├── education/
│   │   │   ├── experience/
│   │   │   ├── login/      # Admin authentication page
│   │   │   ├── messages/   # Contact inquiries inbox
│   │   │   ├── photo/      # Profile photo upload & replace
│   │   │   ├── profile/    # Personal information editor
│   │   │   ├── projects/   # Projects CRUD manager
│   │   │   ├── resume/     # Resume PDF uploader & viewer
│   │   │   ├── settings/   # GitHub sync & SEO metadata
│   │   │   ├── skills/     # Skills & competencies manager
│   │   │   └── social/     # External social links
│   │   ├── api/            # API endpoints (contact form, etc.)
│   │   ├── globals.css     # Global theme & glassmorphic styling
│   │   ├── layout.tsx      # SEO metadata & AuthProvider
│   │   └── page.tsx        # Public portfolio landing page
│   ├── components/
│   │   ├── admin/          # Dashboard sidebar, header, and cards
│   │   ├── sections/       # Hero, About, Skills, Projects, Certs, etc.
│   │   └── ui/             # Navbar, Footer, Modal, ImageUpload, ConfirmDialog
│   └── lib/
│       ├── auth/           # Authentication context & hooks
│       ├── data/           # Portfolio service, storage service, initial data
│       └── supabase/       # Browser client & TypeScript interfaces
├── supabase/
│   └── schema.sql          # 1-Click PostgreSQL schema, RLS, and buckets
├── .env.example            # Environment variables template
└── SETUP_GUIDE.md          # Step-by-step Supabase & Vercel deployment guide
```

---

## 📜 License

Created for student portfolio, placement, and internship presentations.
