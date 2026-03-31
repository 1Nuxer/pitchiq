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

**Vercel Root Directory:** TEMPORARY (quick), change anytime.
**Flatten repo:** PERMANENT (clean, recommended).

### Step 3: [PENDING] Test locally
```bash
cd "v0-soccer-video-analysis-main/v0-soccer-video-analysis-main"
npm install
npm run dev
```
Open http://localhost:3000 - confirm works

### Step 4: [🚀 EXECUTING PERMANENT FIX] Flatten repo (user wants permanent)
**User approved 'do whatever is best' → Flattening now!**

**Why best:** Makes root deployable without Vercel settings. Clean repo.

**Status:** Preparing Windows-safe move commands (no git needed first)

**IMPORTANT: cd to project dir first! Terminal must be at c:/Users/natha/Documents/GitHub/pitchiq1**

**PowerShell-compatible commands (your terminal is PowerShell):**

0. `cd "c:/Users/natha/Documents/GitHub/pitchiq1"`

1. **Move dirs:**
```
Get-ChildItem -Path "v0-soccer-video-analysis-main/v0-soccer-video-analysis-main" -Directory | Move-Item -Destination .
```
2. **Move files:**
```
Get-ChildItem -Path "v0-soccer-video-analysis-main/v0-soccer-video-analysis-main" -File | Move-Item -Destination .
```
3. **Delete empty:**
```
Remove-Item -Recurse -Force "v0-soccer-video-analysis-main"
```
4. **Clean root lock:**
```
Remove-Item "package-lock.json" -ErrorAction SilentlyContinue
```
5. **npm install:**
```
npm install
```
6. **dev:**
```
npm run dev
```
7. **Git (fix PATH if error: restart VSCode):**
```
git add . ; git commit -m "fix: flatten Next.js for Vercel" ; git push
```

**Paste output if errors. This will fix Vercel permanently!**

### Step 5: [PENDING] Mark complete & cleanup TODO.md

**Priority: Step 4 permanent flatten → git push → Vercel auto-success!**


