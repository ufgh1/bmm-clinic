@echo off
chcp 65001 >nul
echo.
echo  ====================================
echo   БМ Клиник — Запуск сервера
echo  ====================================
echo.
echo  Сервер: http://localhost:3000
echo  Остановка: Ctrl+C
echo.

start http://localhost:3000

python -m http.server 3000
