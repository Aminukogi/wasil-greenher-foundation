@echo off
title Wasil GreenHer - Content Editor
REM Uses the newer portable Node so Sanity Studio runs correctly.
set "PATH=C:\Users\Surface Book2\node-portable\node-v22.23.1-win-x64;%PATH%"
cd /d "C:\Users\Surface Book2\Projects\wgf-studio"
echo ============================================================
echo   Starting the Wasil GreenHer content editor...
echo   When you see  http://localhost:3333  below,
echo   open that address in your web browser to edit the website.
echo   (Keep this window open while you work. Close it to stop.)
echo ============================================================
echo.
call npm run dev
echo.
echo The editor has stopped. You can close this window.
pause
