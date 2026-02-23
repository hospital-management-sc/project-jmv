@echo off
REM Script para resolver problemas de npm con Prisma en Windows

echo ======================================
echo Limpiando procesos npm y node...
echo ======================================
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
timeout /t 2 /nobreak

echo ======================================
echo Accediendo al directorio backend...
echo ======================================
cd /d "C:\Users\cmoin\Documentos\hospital-management-dev\pwa\backend"

echo ======================================
echo Eliminando node_modules...
echo ======================================
for /d %%i in (node_modules) do @rmdir /s /q %%i 2>nul
timeout /t 1 /nobreak

echo ======================================
echo Eliminando package-lock.json...
echo ======================================
del /f /q package-lock.json 2>nul

echo ======================================
echo Limpiando cache de npm...
echo ======================================
call npm cache clean --force 2>nul
timeout /t 3 /nobreak

echo ======================================
echo Instalando dependencias...
echo ======================================
call npm install

echo ======================================
echo Completado
echo ======================================
pause
