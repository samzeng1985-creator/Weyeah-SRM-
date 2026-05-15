$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$sqlFile = "c:\Users\konst\Documents\Trae SOLO\Weyeah-SRM\srm\sql\srm_database_init.sql"

$command = "$mysqlPath -u root -ppassword --default-character-set=utf8mb4 -e `"SOURCE `"$sqlFile`";`""
Invoke-Expression $command
