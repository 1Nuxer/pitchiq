# Fix Vercel Next.js Detection Issue - Soccer Video Analysis App

## Status: Plan approved ✅

## Information Gathered
- Next.js project nested at `v0-soccer-video-analysis-main/v0-soccer-video-analysis-main/`
- Root has no package.json (only package-lock.json)
- package.json at nested path has \"next\": \"16.2.0\", standard Next.js 16 setup

## Step-by-Step Plan Execution

### Step 1: [✅ DONE] Created this TODO.md to track progress

### Step 0: [✅ DONE] Confirmed project structure & Next.js setup via tools

### Step 2: [PENDING] Fix Vercel immediately (no code change)
**User action required:**
1. Vercel Dashboard → Your Project → Settings → General
2. Set **Root Directory** = `v0-soccer-video-analysis-main/v0-soccer-video-analysis-main`
3. Save → Trigger new deployment
4. Check build logs for success
*Notify me when done or paste logs if issues*

### Step 3: [PENDING] Test locally
```bash
cd "v0-soccer-video-analysis-main/v0-soccer-video-analysis-main"
npm install
npm run dev
```
Open http://localhost:3000 - confirm works

### Step 4: [OPTIONAL/PENDING] Clean repo structure (flatten to root)
1. Move contents: All files/dirs from nested project to root
2. Delete empty `v0-soccer-video-analysis-main/`
3. `git add . &amp;&amp; git commit -m "Flatten nested Next.js structure" &amp;&amp; git push`
4. Reset Vercel Root Directory to empty

### Step 5: [PENDING] Mark complete & cleanup TODO.md

**Priority: Do Step 2 first for quick Vercel fix! Reply 'vercel done' or paste logs when complete.**


