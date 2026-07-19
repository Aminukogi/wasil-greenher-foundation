@echo off
title Deploy Wasil GreenHer Studio
REM Publishes the studio to https://wasilgreenher.sanity.studio
set "PATH=C:\Users\Surface Book2\node-portable\node-v22.23.1-win-x64;%PATH%"
cd /d "C:\Users\Surface Book2\Projects\wgf-studio"

echo ============================================================
echo   STEP 1 of 3 - Clearing the previous (wrong) login
echo ============================================================
call npx sanity logout
echo.

echo ============================================================
echo   STEP 2 of 3 - Sign in with the CORRECT account
echo.
echo   ***  C H O O S E   G I T H U B  --  N O T   G O O G L E  ***
echo.
echo   Your Sanity account (Aminukogi) is linked to GitHub.
echo   Logging in with Google creates a DIFFERENT, empty account,
echo   and the deploy fails with a "Forbidden" error.
echo.
echo   Use the ARROW KEYS to highlight GitHub, press ENTER, then
echo   approve in the browser window that opens.
echo ============================================================
echo.
call npx sanity login

echo.
echo ============================================================
echo   Checking the account can see your project...
echo ============================================================
call npx sanity projects list
echo.
echo   ^^^ If the list above is EMPTY, it is still the wrong
echo   account. Close this window and try again.
echo   If you can see "WASIL GreenHer Foundation", we are good.
echo.
pause

echo ============================================================
echo   STEP 3 of 3 - Deploying the studio...
echo   This builds and uploads. It may take several minutes.
echo ============================================================
echo.
call npm run deploy

echo.
echo ============================================================
echo   If it succeeded, your studio is now live at:
echo   https://wasilgreenher.sanity.studio
echo ============================================================
pause
