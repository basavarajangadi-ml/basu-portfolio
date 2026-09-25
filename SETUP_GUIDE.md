# Complete Setup & Deployment Guide

This guide walks you through setting up your **AI & Machine Learning Developer Portfolio**, integrating **Supabase** (Database, Authentication, Storage), and deploying to **Vercel** with continuous deployment.

---

## 1. Supabase Project Setup

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**.
3. Choose an organization, enter a project name (e.g. `ai-portfolio`), and set a strong database password.
4. Select a region close to your primary audience and click **Create new project**.

---

## 2. Database Setup (1-Click SQL Script)

1. In your Supabase dashboard, click on the **SQL Editor** tab on the left sidebar.
2. Click **New query**.
3. Open the file [`supabase/schema.sql`](file:///c:/Users/anils/Downloads/Basu.portfolio/supabase/schema.sql) in this repository.
4. Copy the entire contents of `schema.sql` and paste it into the Supabase SQL editor.
5. Click **Run** (or `Cmd/Ctrl + Enter`).

This script will automatically:
- Create all 9 required tables:
  * `profiles`
  * `projects`
  * `certificates`
  * `skills`
  * `education`
  * `experience`
  * `achievements`
  * `social_links`
  * `contact_messages`
- Enable **Row Level Security (RLS)** on all tables.
- Add security policies allowing public read access for the portfolio and restricted write access for authenticated admin users.
- Configure public contact message submission while keeping the inbox restricted to the admin.
- Set up the public `portfolio-assets` storage bucket with upload and read permissions.
- Pre-populate the initial skills catalog, degree details, and placeholder structure (`[YOUR NAME]`, `[YOUR COLLEGE]`, etc.).

---

## 3. Storage Bucket Setup

If you ran the `supabase/schema.sql` script, the bucket `portfolio-assets` is automatically created!

To verify:
1. Go to **Storage** in the Supabase sidebar.
2. Verify that a bucket named `portfolio-assets` exists and has **Public bucket** enabled.
3. This bucket securely stores:
   - Profile Photos
   - Project Screenshots
   - Certificate Images & PDFs
   - Resume / CV PDFs
   - Achievement proofs

---

## 4. Admin Authentication Setup

1. In the Supabase sidebar, navigate to **Authentication** &rarr; **Users**.
2. Click **Add user** &rarr; **Create user**.
3. Enter your admin email and a secure password.
4. Check **Auto Confirm User?** so you don't need to verify via email right away.
5. Click **Create user**.
6. You will use this email and password to log in at `/admin/login`!

---

## 5. Environment Variables Configuration

1. In your Supabase dashboard, go to **Project Settings** (gear icon) &rarr; **API**.
2. Copy the following values:
   - **Project URL**
   - **Project API Keys &rarr; `anon` (public)**
   - **Project API Keys &rarr; `service_role` (secret)**

3. In your local project root, open or create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Email (for whitelisting)
ADMIN_EMAIL=your-admin-email@example.com

# Site URL (for production OpenGraph / SEO)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> [!IMPORTANT]
> Never commit `.env.local` to git or expose the `SUPABASE_SERVICE_ROLE_KEY` in client-side code.

---

## 6. Local Development

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Public Portfolio**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 7. Deploying to Vercel

1. Push your repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial AI developer portfolio with Supabase admin dashboard"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
3. Click **Add New...** &rarr; **Project**.
4. Import your portfolio repository.
5. In the **Environment Variables** section, add:
   * `NEXT_PUBLIC_SUPABASE_URL`: (your Supabase URL)
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your Supabase anon key)
   * `SUPABASE_SERVICE_ROLE_KEY`: (your Supabase service role key)
   * `ADMIN_EMAIL`: (your admin email)
   * `NEXT_PUBLIC_SITE_URL`: (your production Vercel domain, e.g. `https://your-portfolio.vercel.app`)
6. Click **Deploy**.

---

## 8. Updating Your Information via Admin Dashboard

Once deployed:
1. Navigate to `https://your-portfolio.vercel.app/admin`.
2. Sign in with your Supabase admin credentials.
3. Update your:
   - **Profile Photo**: Upload your high-resolution headshot.
   - **Profile Information**: Replace `[YOUR NAME]`, `[YOUR COLLEGE]`, etc. with your real details.
   - **Projects**: Add real projects with GitHub links and live demos.
   - **Certificates**: Upload your Coursera/DeepLearning.AI/AWS certificates and verification links.
   - **Skills**: Add or reorder technical competencies.
   - **Resume**: Upload your updated resume PDF.
   - **GitHub Settings**: Enter your GitHub username to show live repository cards!

Every update made in the Admin Dashboard is instantly reflected on the public website without touching or redeploying the source code!
