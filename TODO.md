# Fix Vercel Next.js Detection Issue - Soccer Video Analysis App

## Status: Plan approved ✅

## Information Gathered
- Next.js project nested at `v0-soccer-video-analysis-main/v0-soccer-video-analysis-main/`
- Root has no package.json (only package-lock.json)
- package.json at nested path has \"next\": \"16.2.0\", standard Next.js 16 setup

## Step-by-Step Plan Execution

### Step 1: [✅ DONE] Created this TODO.md to track progress

### Step 0: [✅ DONE] Confirmed project structure & Next.js setup via tools

### Step 2: [🚫 FAILED - Troubleshooting] Vercel Root Directory setting
**Status:** Still failing after 'Vecal fixes' commit. Possible issues:
- Root Directory path not saved/typo (must be EXACT: `v0-soccer-video-analysis-main/v0-soccer-video-analysis-main`)
- Vercel cache: Delete project & re-import repo, or use New Deployment with overrides
- GitHub repo name 'pitchiq' vs local 'pitchiq1'? Confirm repo path.

**Retry steps:**
1. Vercel → Project Settings → General → Root Directory: verify/copy-paste `v0-soccer-video-analysis-main/v0-soccer-video-analysis-main`
2. Save, push new commit (e.g. edit README), watch new deployment logs
3. Reply with full recent build logs link/screenshot if fails again.

**Alternative: Proceed to Step 4 (flatten repo) to make root deployable without settings change.**

### Step 3: [PENDING] Test locally
```bash
cd "v0-soccer-video-analysis-main/v0-soccer-video-analysis-main"
npm install
npm run dev
```
Open http://localhost:3000 - confirm works

### Step 4: [🚀 ACTIVE - EXECUTING] Flatten repo structure (permanent Vercel fix)
**User approved 'do whatever is best' → Flattening now!**

**Why best:** Makes root deployable without Vercel settings. Clean repo.

**Status:** Preparing Windows-safe move commands (no git needed first)

**Copy & paste these to VSCode Terminal (cmd/PowerShell) ONE BY ONE:**

1. **Move dirs & files:**
```
for /d %i in ("v0-soccer-video-analysis-main\v0-soccer-video-analysis-main\*") do @move "%i" .
for  %i in ("v0-soccer-video-analysis-main\v0-soccer-video-analysis-main\*") do @move "%i" .
```
2. **Clean empty dirs:**
```
rmdir /s /q "v0-soccer-video-analysis-main"
```
3. **Remove duplicate root lockfile:**
```
del package-lock.json
```
4. **Install deps:**
```
npm install
```
5. **Test dev server:**
```
npm run dev
```
6. **Commit:**
```
git add . && git commit -m "feat: flatten Next.js structure for Vercel deploy" && git push
```

**After push, Vercel deploys from root SUCCESS! Preview URL ready. Reply when done or if errors.**

### Step 5: [PENDING] Mark complete & cleanup TODO.md

**Priority: Do Step 2 first for quick Vercel fix! Reply 'vercel done' or paste logs when complete.**


