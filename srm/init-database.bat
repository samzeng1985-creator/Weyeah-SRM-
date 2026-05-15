@echo off
cd /d "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -ppassword < "C:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm\create_database.sql"
echo Database created successfully!
pause
