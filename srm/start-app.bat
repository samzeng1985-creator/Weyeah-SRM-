@echo off
cd /d "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm"
mvn -pl srm-gateway -Dcheckstyle.skip=true spring-boot:run
pause
