<?php
include ("pdo_database.class.php");

$db = new wArLeY_DBMS("sqlsrv", "209.145.52.56,2222", "DNA_PREREP", "dna", "samgui", "2222");
$dbCN = $db->Cnxn(); //This step is really neccesary for create connection to databasse, and getting the errors in methods.
if($dbCN==false) die($db->getError());
echo $db->getError(); //Show error description if exist, else is empty.

$rs = $db->query("SELECT * FROM SAMT_EMPRESA");
foreach($rs as $row){
	$tmp_name = $row["EMP_NOMBRE_CRTO"];
	$tmp_address = $row["EMP_NOMBRE_COMPLETO"];
	echo "The user $tmp_name lives in: $tmp_address<br/>";
}
$rs = null;
$db->disconnect();
?>