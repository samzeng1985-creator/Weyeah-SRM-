@echo off
cd /d "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm"
call mvn install -Dmaven.test.skip=true -Dcheckstyle.skip=true
pause
