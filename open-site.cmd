@echo off
rem ---------------------------------------------------------------
rem  Double-click this to open Catherine Monmarson's site locally.
rem
rem  The site needs a small local web server: its links and images
rem  start from the site root, which a plain file:// page has no way
rem  to resolve. This starts one, opens the browser, and keeps
rem  running until you close the window.
rem ---------------------------------------------------------------
cd /d "%~dp0"
title Catherine Monmarson - site local

if not exist "node_modules" (
  echo Premiere utilisation : installation des dependances...
  echo.
  call npm install || goto :fail
  echo.
)

if not exist "dist\index.html" (
  echo Construction du site...
  echo.
  call npm run build || goto :fail
  echo.
)

echo.
echo   Le site s'ouvre sur http://localhost:4321
echo   Laissez cette fenetre ouverte. Fermez-la pour arreter le site.
echo.

start "" http://localhost:4321
call npx astro preview --port 4321
goto :eof

:fail
echo.
echo   Une erreur s'est produite. Appuyez sur une touche pour fermer.
pause >nul
