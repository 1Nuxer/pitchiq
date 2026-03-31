@echo off
cd /d "C:\Users\natha\Documents\GitHub\pitchiq1"
powershell -Command "
$source = 'v0-soccer-video-analysis-main/v0-soccer-video-analysis-main'
Get-ChildItem -Path $source -Directory | Move-Item -Destination .
Get-ChildItem -Path $source -File | Move-Item -Destination .
Remove-Item -Recurse -Force $source
Remove-Item 'package-lock.json' -ErrorAction SilentlyContinue
echo Flattened! Run 'npm install' then 'git add . && git commit -m \"flatten for Vercel\" && git push' in terminal.
pause
"

