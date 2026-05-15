@echo off
cd /d "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm"
call mvn -pl srm-gateway -Dcheckstyle.skip=true -Dspotbugs.skip=true -Dpmd.skip=true spring-boot:run
pause
