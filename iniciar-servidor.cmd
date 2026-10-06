@echo off
rem ==========================================================
rem  TRAZZO PWA - Servidor local
rem  Doble clic para servir esta carpeta en http://localhost:5600
rem  Usa npx.cmd (no npx.ps1), asi que no lo bloquea la
rem  politica de ejecucion de scripts de PowerShell.
rem ==========================================================
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instalalo desde https://nodejs.org y vuelve a intentarlo.
  pause
  exit /b 1
)

netstat -ano | findstr /r /c:":5600 .*LISTENING" >nul
if not errorlevel 1 (
  echo El puerto 5600 ya esta en uso: el servidor ya esta corriendo.
  echo Abre http://localhost:5600 en el navegador.
  start "" http://localhost:5600
  pause
  exit /b 0
)

echo Iniciando Trazzo en http://localhost:5600
echo Deja esta ventana abierta mientras usas la app. Ctrl+C para detener.
start "" http://localhost:5600
call npx.cmd -y http-server . -p 5600 -c-1
pause
