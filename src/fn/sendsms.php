<?php
        error_reporting(-1);
		ini_set('display_errors', 'On');
		ini_set('soap.wsdl_cache_enabled',0);
		ini_set('soap.wsdl_cache_ttl',0);
		$client = new SoapClient("https://b2c.marcatel.com.mx/MarcatelSMSWCF/ServicioInsertarSMS.svc?wsdl");
		$parms['Mensaje']= $_POST['Mensaje'];
		$parms['CadenaTelefonos']= $_POST['CadenaTelefonos'];
		$parms['Usuario']= "DNA";
		$parms['Password']= "B12Mexico";
		$parms['Lada']= "52";
		$parms['DobleVia']= "0";
		$parms['MMensaje']= "0";
		$parms['Campaña']= "0";
		$parms['Prioridad']= "0";
		$parms['Auxiliar']= "0";
		$parms['Auxiliar']= "0";
		$result = $client->InsertaMensajes($parms);
        echo json_encode($result);
?>
