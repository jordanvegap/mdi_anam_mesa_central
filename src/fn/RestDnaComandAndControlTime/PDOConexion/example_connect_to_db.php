<?php

$Combo = $_REQUEST['TipoConsulta'];

include ("../lib_to_json/response.php");
include ("../PDOConexion/pdo_database.class.php");
include ("../PDOConexion/database.cnfg.php");

//Conexion a Base de Datos;
$db = new wArLeY_DBMS($DB_type, $DB_server, $DB_db, $DB_user, $DB_pass, $DB_port);
$dbCN = $db->Cnxn(); //Funcion para realizar conexion y obtener errores.
if($dbCN==false) die($db->getError());

//Clase CombosBarra
class CombosBarra
{		
		var $ID;
		var $Descripcion;
}
switch($Combo){
	case "Pais":
	$rs = $db->query("SELECT PAI_CSCPAIS,"
		." PAI_DESCPAIS"
		." FROM SAMT_PAISES"
		." WHERE EMP_CSC_EMPRESA_HOST = ".$EHos);

	$result = array();
	foreach($rs as $row){
		$nodo = array();
		$nodo['ID'] = $row["PAI_CSCPAIS"];
		$nodo['Descripcion'] = trim($row["PAI_DESCPAIS"]);
		array_push($result,$nodo);
	}
		$res = new Response();
		$res->success = true;
		$res->message = "Datos Cargados";
		$res->total = $db->rowcount();
		$res->data = $result;
	//Printing json ARRAY
		echo $res->to_json();
		$db->disconnect();
	break;
}
?>