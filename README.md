# Portfolio

A personal portfolio site with an admin dashboard, built with React, TypeScript, and Supabase.

## Tech Stack

- **Frontend** — React 19, React Router v7, Tailwind CSS v4, Vite
- **Backend** — Supabase (Postgres, Auth, Storage, Edge Functions)
- **Forms** — React Hook Form + Zod
- **Email** — Resend (contact form notifications via Supabase Edge Function)

## Features

- Public portfolio with projects, work experience, blog, and contact form
- Markdown blog with tags and GFM support
- Admin dashboard behind Supabase Auth for managing all content
- Draft/published workflow for projects and blog posts
- File uploads for avatars, thumbnails, and resumes
- Project live-preview mode and thumbnail focal-point control

## Getting Started

```bash
npm install
cp .env.example .env   # fill in Supabase + Resend keys
npm run db:migrate      # run database migrations
npm run dev             # start dev server
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run database migrations |
