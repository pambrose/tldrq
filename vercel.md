## Deploying to Vercel — Step by Step

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, paste and run the contents of `supabase/migrations/001_initial_schema.sql`
3. Copy your **Project URL** and **anon public key** from Settings → API

### 2. Configure OAuth Providers

In the Supabase dashboard under Authentication → Providers:

**Google:**

1. Enable the Google provider
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. Set the authorized redirect URI to: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Paste the Client ID and Client Secret into Supabase

**GitHub:**

1. Enable the GitHub provider
2. Create an OAuth App in [GitHub Developer Settings](https://github.com/settings/developers)
3. Set the authorization callback URL to: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Paste the Client ID and Client Secret into Supabase

### 3. Deploy to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project → Import the repo
3. Add two environment variables:
    - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
4. Deploy

### 4. Update Supabase Redirect URLs

Once you have your Vercel production URL (e.g. `https://reading-list-abc.vercel.app`):

1. In Supabase → Authentication → URL Configuration:
    - Set **Site URL** to your Vercel production URL
    - Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**
2. If you also want local dev to keep working, add `http://localhost:3000/auth/callback` to Redirect URLs as well

### 5. Verify

1. Visit your Vercel URL — you should be redirected to `/login`
2. Sign in with Google or GitHub
3. Save a bookmark, verify OG metadata appears
4. Create a collection, toggle it public, open the share URL in an incognito window
