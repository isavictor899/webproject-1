# House of Essential Commodities — Full Setup Guide

## 1. Install & Run

```bash
npm install
npm run dev
```

---

## 2. Supabase Setup (do this ONCE)

### A. Create a free account
Go to https://supabase.com → New Project

### B. Get your keys
Project Settings → API → copy:
- **Project URL**  (looks like: https://abcdefgh.supabase.co)
- **anon/public key** (long string starting with eyJ…)

Paste both into `src/supabase.js`

### C. Create the posts table
Go to your Supabase project → SQL Editor → paste and run this:

```sql
create table posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text unique not null,
  category     text,
  excerpt      text,
  body         text,
  cover_url    text,
  files        text[] default '{}',
  published    boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now()
);

-- Allow public to read published posts
create policy "Public read published posts"
  on posts for select
  using (published = true);

-- Allow authenticated admin to do everything
create policy "Admin full access"
  on posts for all
  using (auth.role() = 'authenticated');

alter table posts enable row level security;
```

### D. Create Storage buckets
Go to Storage → New Bucket:

1. Name: `blog-images` → check **Public bucket** → Create
2. Name: `blog-files`  → check **Public bucket** → Create

For each bucket, go to Policies → Add policy → "Allow public access":
```sql
-- For blog-images bucket
create policy "Public read" on storage.objects for select using (bucket_id = 'blog-images');
create policy "Auth upload"  on storage.objects for insert using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

-- For blog-files bucket
create policy "Public read" on storage.objects for select using (bucket_id = 'blog-files');
create policy "Auth upload"  on storage.objects for insert using (bucket_id = 'blog-files' and auth.role() = 'authenticated');
```

### E. Create your admin user
Go to Authentication → Users → Invite user
Enter your email → you'll receive a link to set your password.
That email + password is what you use to log in at /admin/login

---

## 3. Routes

| URL              | What it is              |
|------------------|-------------------------|
| /                | Main website            |
| /blog            | Public blog listing     |
| /blog/:slug      | Individual blog post    |
| /admin/login     | Admin login page        |
| /admin           | Dashboard (post list)   |
| /admin/new       | Create new post         |
| /admin/edit/:id  | Edit existing post      |

---

## 4. Deploy to Vercel

```bash
npm run build
```
Upload the `dist/` folder to vercel.com/drop
OR connect your GitHub repo in Vercel dashboard.
