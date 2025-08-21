@echo off
REM ===============================
REM Cài đặt dependencies
REM ===============================
npm install
if %errorlevel% neq 0 exit /b %errorlevel%

REM ===============================
REM Build project
REM ===============================
npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

REM ===============================
REM Chạy server ở background (ẩn log)
REM ===============================
start /B npx serve out --listen 3000 >nul 2>&1

REM Đợi server khởi động (có thể tăng thời gian nếu cần)
timeout /t 3 >nul

REM ===============================
REM Giữ cửa sổ mở (nếu muốn)
REM ===============================
pause
