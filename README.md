SavvyMark – Smart Bookmark App
(To read the problems that I faced during this project, please move to line 67)

A simple, real-time bookmark manager built with Next.js (App Router), Supabase (Auth + Database + Realtime), and Tailwind CSS, deployed on Vercel.

Live URL:https://savvy-mark.vercel.app/
Github repo:https://github.com/ErenFreedom/SavvyMark

Features

🔐 Google OAuth login (no email/password)

➕ Add bookmarks (title + URL)

⭐ Mark bookmarks as favorite

❌ Delete bookmarks

🔒 Bookmarks are private per user

⚡ Real-time updates across tabs (Supabase Realtime)

🌍 Deployed on Vercel (production ready)

Tech Stack

Next.js 14 (App Router)

Supabase

Authentication (Google OAuth)

PostgreSQL Database

Realtime subscriptions

Tailwind CSS

Vercel for deployment


Architecture Overview

Authentication handled via Supabase Google OAuth

Bookmarks stored in Supabase Postgres

Row Level Security (RLS) ensures users only see their own bookmarks

Realtime channel listens for Postgres changes

UI automatically updates when changes occur

Database Schema

Table: bookmarks

Column	Type	Description
id	uuid	Primary key
created_at	timestamp	Auto generated
user_id	uuid	References auth.users
title	text	Bookmark title
url	text	Bookmark URL
is_favorite	boolean	Favorite toggle


Problems That I faced:
1)Google OAuth not redirecting correctly on production

Problem:
After deploying to Vercel, login worked but user was not redirected to /dashboard.

Cause:
Hardcoded localhost redirect URL in OAuth configuration.

Solution:
Replaced:

redirectTo: 'http://localhost:3000/dashboard'


With:

redirectTo: `${window.location.origin}/dashboard`


Also updated:

Supabase Site URL

Supabase Redirect URLs

Google OAuth Authorized Origins

Google OAuth Authorized Redirect URIs


2)Supabase production URL configuration issues

Problem:
OAuth failed silently in production.

Cause:
Missing production domain in:

Supabase URL configuration

Google Cloud Console OAuth settings

Solution:
Added:

https://savvy-mark.vercel.app


3)Real-time not updating across tabs initially

Problem:
Bookmarks did not update instantly when modified in another tab.

Solution:
Implemented Supabase Realtime subscription:

supabase
  .channel('realtime-bookmarks')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'bookmarks' },
    () => fetchBookmarks()
  )
  .subscribe()


Now updates sync instantly across tabs.

4)OAuth Redirect Loop Edge Case

Problem:
Login sometimes returned to home page instead of dashboard.

Solution:

Properly configured Supabase redirect URLs

Ensured dashboard route exists

Confirmed Google callback URL is:

https://PROJECT_ID.supabase.co/auth/v1/callback




How to Run Locally
git clone https://github.com/ErenFreedom/SavvyMark
cd SavvyMark
npm install
npm run dev


Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
