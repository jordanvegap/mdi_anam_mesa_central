<?php
class configFile {
  function __construct($Empresa) {
    switch ($Empresa) {
      /*case 'BCONNECT':
        define('_DB_type', 'sqlsrv');
        define('_DB_server', 'facilitymanagement.com.mx,2222');
        define('_DB_db', 'DNA_BCONNECT');
        define('_DB_user', 'DNA');
        define('_DB_pass', 'samgui');
        define('_DB_port', '2222');
      break;*/
    case 'BCONNECT':
        define('_DB_type', 'sqlsrv');
        define('_DB_server', 'dnasupport.com.mx,2222');
        define('_DB_db', 'DNA_BCONNECT');
        define('_DB_user', 'DNA');
        define('_DB_pass', 'samgui');
        define('_DB_port', '2222');
      break;
      case 'WALMART':
        define('_DB_type', 'sqlsrv');
        define('_DB_server', 'facilitymanagement.com.mx,2222');
        define('_DB_db', 'DNA_CARRIER');
        define('_DB_user', 'DNA');
        define('_DB_pass', 'samgui');
        define('_DB_port', '2222');
      break;
	  
	  case 'TELECOM':
        define('_DB_type', 'sqlsrv');
        define('_DB_server', '201.161.51.109,2222');
        define('_DB_db', 'DNA_COM');
        define('_DB_user', 'DNA');
        define('_DB_pass', 'samgui');
        define('_DB_port', '2222');
      break;
	  
	  case 'CIE':
        define('_DB_type', 'sqlsrv');
        define('_DB_server', '172.14.1.101,2222');
        define('_DB_db', 'DNA_BCONNECT');
        define('_DB_user', 'DNA');
        define('_DB_pass', 'samgui');
        define('_DB_port', '2222');
      break;
	  
	  case 'ADDRESS':
        define('_DB_type', 'sqlsrv');
        define('_DB_server', '172.14.1.101,2222');
        define('_DB_db', 'DNA_ADDRESS');
        define('_DB_user', 'DNA');
        define('_DB_pass', 'samgui');
        define('_DB_port', '2222');
      break;
	  
	  case 'GRABACIONENCUESTA':
        define('_DB_type', 'mysql');
        define('_DB_server', '172.14.1.104');
        define('_DB_db', 'asteriskcdrdb');
        define('_DB_user', 'admin');
        define('_DB_pass', 'QAZqwe789v1a');
        define('_DB_port', '3306');
      break;
	  
	  case 'PBXGRABACION':
        define('_DB_type', 'mysql');
        define('_DB_server', '172.16.1.9');
        define('_DB_db', 'asteriskcdrdb');
        define('_DB_user', 'admin');
        define('_DB_pass', 'QAZqwe789v1a');
        define('_DB_port', '3306');
      break;

    case 'MIVERA':
      define('_DB_type', 'sqlsrv');
      define('_DB_server', '172.14.1.109,2222');
      define('_DB_db', 'DNA_MIVERA');
      define('_DB_user', 'DNA');
      define('_DB_pass', 'samgui');
      define('_DB_port', '2222');
    break;

    case 'TRANSPORTE':
      define('_DB_type', 'sqlsrv');
      define('_DB_server', 'facilitymanagement.com.mx,2222');
      define('_DB_db', 'DNA_TRANSPORTE');
      define('_DB_user', 'DNA');
      define('_DB_pass', 'samgui');
      define('_DB_port', '2222');
    break;
    
    
    case 'BIOMETRICOS':
      define('_DB_type', 'sqlsrv');
      define('_DB_server', '10.100.72.1,2222');
      define('_DB_db', 'DNA_BIOMETRICOS');
      define('_DB_user', 'biometrico');
      define('_DB_pass', 'J73RPD34dnjkwqx%');
      define('_DB_port', '2222');
    break;

    case 'PREREP':
      define('_DB_type', 'sqlsrv');
      define('_DB_server', '209.145.52.56,2222');
      define('_DB_db', 'DNA_PREREP');
      define('_DB_user', 'DNA');
      define('_DB_pass', 'samgui');
      define('_DB_port', '2222');
    break;
      
	  
      default:
        //
      break;
    }
  }
}


?>
