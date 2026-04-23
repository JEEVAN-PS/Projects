@echo off
REM Hospital Management System - Build and Run Script

setlocal enabledelayedexpansion

REM ====== SET MAVEN PATH ======
set MAVEN_HOME=C:\apache-maven-3.9.14
set PATH=%MAVEN_HOME%\bin;%PATH%

REM ====== GO TO PROJECT DIRECTORY ======
cd /d C:\Users\Admin\OneDrive\Desktop\Projects\hospital-management

echo.
echo ============================================
echo   Hospital Management System - Build & Run
echo ============================================
echo.

:menu
echo.
echo Select an option:
echo 1. Clean Build
echo 2. Run Application
echo 3. Kill Java Process
echo 4. Build and Run
echo 5. Exit
echo.

set /p choice="Enter choice (1-5):"

if "%choice%"=="1" goto build
if "%choice%"=="2" goto run
if "%choice%"=="3" goto kill
if "%choice%"=="4" goto buildandrun
if "%choice%"=="5" goto exit

echo Invalid choice. Try again.
goto menu

:build
echo.
echo Starting Maven build...
mvn clean install -DskipTests

if errorlevel 1 (
    echo.
    echo BUILD FAILED! Check errors above.
    pause
    goto menu
)

echo.
echo Build completed successfully!
pause
goto menu

:run
echo.
echo Starting Spring Boot Application...
echo Press Ctrl+C to stop the application
echo.

mvn spring-boot:run

pause
goto menu

:kill
echo.
echo Killing Java processes...
taskkill /F /IM java.exe >nul 2>&1
echo Done!
pause
goto menu

:buildandrun
echo.
echo Killing existing Java processes...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo Starting Maven build...
mvn clean install -DskipTests

if errorlevel 1 (
    echo.
    echo BUILD FAILED! Check errors above.
    pause
    goto menu
)

echo.
echo Build successful! Starting application...
timeout /t 2 >nul

mvn spring-boot:run

pause
goto menu

:exit
echo.
echo Goodbye!
endlocal
exit