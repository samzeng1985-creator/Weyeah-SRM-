@echo off
setlocal
cd /d "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm"
call mvn -pl srm-gateway -Dcheckstyle.skip=true spring-boot:run
pause
