<?php
include 'iAppFunctions.php';
class iAppGeneral {
    public function API(){
        header('Content-Type: application/JSON');
        $method = $_SERVER['REQUEST_METHOD'];
        switch ($method) {
        case 'POST'://consulta
          if($this->Chk_TockenApi()==true){
            $this->getDatos();
          }
        break;
        case 'PUT'://actualiza
          if($this->Chk_TockenApi()==true){
            $this->updateOrden();
          }
            break;
        case 'DELETE'://elimina
            echo 'DELETE';
            break;
        default://metodo NO soportado
            echo 'METODO NO SOPORTADO';
            break;
        }
    }

    private function response($code=200, $status="", $message="") {
      http_response_code($code);
      if( !empty($status) && !empty($message) ){
          $response = array("status" => $status ,"message"=>$message);
          echo json_encode($response,JSON_PRETTY_PRINT);
      }
    }

    private function Chk_TockenApi(){
      $obj = json_decode( file_get_contents('php://input') );
      $objArr = (array)$obj;
      if (empty($objArr)){
          $this->response(401,"error","Unauthorized");
      }
      else{
        if(isset($obj->oAuthToken)){
          if($obj->oAuthToken == 'ibl5p24hHyfhRHEHbIWP'){
            return true;
          }
          else{
            $this->response(401,"error","Unauthorized");
          }
        }
        else{
            $this->response(401,"error","Unauthorized");
        }
      }
    }

    function getDatos(){
      switch ($_GET['action']) {
        case 'LoginSystem':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if(
                     isset( $obj->EmpresaNombre ) 
                  && isset( $obj->USU_LOGIN )
                  && isset( $obj->USU_PASSWORD )
                ){
                  $Function = new iApp();
                  $Response = $Function->Login_Usuario($obj);
                  echo json_encode($Response,JSON_PRETTY_PRINT);
                }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;
		
		  case 'LoginWeb':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if(
                     isset( $obj->EmpresaNombre ) 
                  && isset( $obj->USU_LOGIN )
                  && isset( $obj->USU_PASSWORD )
                ){
                  $Function = new iApp();
                  $Response = $Function->acceso_user($obj);
                  echo json_encode($Response,JSON_PRETTY_PRINT);
                }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;

        case 'GetCatorcenaActual':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if( 
                       isset( $obj->EmpresaNombre ) 
                    && isset( $obj->EMP_CSC_EMPRESA_HOST )
                    && isset( $obj->TPO_BUSQUEDA )
                )
              {
                  $Function = new iApp();
                  $Response = $Function->GetCatorcenaActual($obj);
                  
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;


        case 'GetProgramaEmpleado':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if( 
                       isset( $obj->EmpresaNombre ) 
                    && isset( $obj->EMP_CSC_EMPRESA_HOST )
                    && isset( $obj->SAMT_CAL_CATORCENA_F1 )
                    && isset( $obj->SAMT_CAL_CATORCENA_F2 )
                    && isset( $obj->EMPLEADO_ID_EXTERNO )
                )
              {
                  $Function = new iApp();
                  $Response = $Function->GetProgramaEmpleado($obj);
                  
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;

        case 'GetDetalleGeneral':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if( 
                       isset( $obj->EmpresaNombre ) 
                    && isset( $obj->EMP_CSC_EMPRESA_HOST )
                    && isset( $obj->SAMT_CAL_CATORCENA_F1 )
                    && isset( $obj->SAMT_CAL_CATORCENA_F2 )
                    && isset( $obj->EMPLEADO_CSC_EMPLEADO )
                )
              {
                  $Function = new iApp();
                  $Response = $Function->GetDetalleGeneral($obj);
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;

        case 'insertaFirmaMovil':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if( 
                       isset( $obj->EmpresaNombre ) 
                    && isset( $obj->EMPLEADO_CSC_EMPLEADO )
                    && isset( $obj->EMPLEADO_ID_EXTERNO )
                    && isset( $obj->FIRMA_MOVIL_TIPO_FIRMA_CSC )
                    && isset( $obj->FIRMA_MOVIL_TELEFONO )
                )
              {
                  $Function = new iApp();
                  $Response = $Function->insertaFirmaMovil($obj);
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;
        
		 case 'GetCatalogoCat':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if(isset($obj->EmpresaNombre)){
                  $Function = new iApp();
                  $Response = $Function->GetCatorcena($obj);
                  //$this->response(200,"success","new record added");
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;

        case 'GetFechaCat':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if(isset($obj->EmpresaNombre)){
                  $Function = new iApp();
                  $Response = $Function->GetFechaCatorcena($obj);
                  //$this->response(200,"success","new record added");
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;

        case 'GetEmplCargo':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if
              (
                isset( $obj->EmpresaNombre ) 
                && isset( $obj->EMP_CSC_EMPRESA_HOST )             
                && isset( $obj->EMPLEADO_CSC_EMPLEADO_PADRE )             
             )
              {
                  $Function = new iApp();
                  $Response = $Function->GetEmplCargo($obj);
                  //$this->response(200,"success","new record added");
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;
		
		case 'GetEmpDetalleFirma':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if
              (
                isset( $obj->EmpresaNombre ) 
                && isset( $obj->EMP_CSC_EMPRESA_HOST )             
                && isset( $obj->EMPLEADO_CSC_EMPLEADO )
				&& isset( $obj->SAMT_CAL_CATORCENA_F1 )
				&& isset( $obj->SAMT_CAL_CATORCENA_F2 )
             )
              {
                  $Function = new iApp();
                  $Response = $Function->GetEmpDetalleFirma($obj);
                  //$this->response(200,"success","new record added");
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;
		
		case 'Img_Empleado':
          $obj = json_decode( file_get_contents('php://input') );
          $objArr = (array)$obj;
          if (empty($objArr)){
              $this->response(422,"error","Sin datos, revisar json");
          }
          else{
              if
              (
                isset( $obj->EmpresaNombre ) 
                && isset( $obj->EMP_CSC_EMPRESA_HOST )             
                && isset( $obj->EMPLEADO_CSC_EMPLEADO )

             )
              {
                  $Function = new iApp();
                  $Response = $Function->Img_Empleado($obj);
                  //$this->response(200,"success","new record added");
                  echo json_encode($Response,JSON_PRETTY_PRINT);
              }
              else{
                  $this->response(422,"error","Las propiedades no han sido definidas");
              }
          }
        break;
		
		case 'GetEmpDetalleFirmaBiometrico':
			$obj = json_decode( file_get_contents('php://input') );
			$objArr = (array)$obj;
			if (empty($objArr)){
				$this->response(422,"error","Sin datos, revisar json");
			}
			else{
				if
				(
				  isset( $obj->EmpresaNombre ) 
				  && isset( $obj->EMPLEADO_ID_EXTERNO )             
				  && isset( $obj->EMPLEADO_CSC_EMPLEADO )
				  && isset( $obj->SAMT_CAL_CATORCENA_F1 )
				  && isset( $obj->SAMT_CAL_CATORCENA_F2 )
			   )
				{
					$Function = new iApp();
					$Response = $Function->GetEmpDetalleFirmaBiometrico($obj);
					//$this->response(200,"success","new record added");
					echo json_encode($Response,JSON_PRETTY_PRINT);
				}
				else{
					$this->response(422,"error","Las propiedades no han sido definidas");
				}
			}
      break;
      
      /** 12/08/2019 */
      case 'GetClientes':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre ) 
            && isset( $obj->EMP_CSC_EMPRESA_HOST )             
            && isset( $obj->TIPO_ESTATUS_CLIENTE_CSC )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetClientes($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'GetProyectos':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre ) 
            && isset( $obj->EMP_CSC_EMPRESA_HOST )             
            && isset( $obj->CLIENTE_CSC )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetProyectos($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;


      case 'GetSubCampanias':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre ) 
            && isset( $obj->EMP_CSC_EMPRESA_HOST )             
            && isset( $obj->PM_CSC_PROYECTO )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetSubCampanias($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;


      case 'GetEmpleados':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre ) 
            && isset( $obj->EMP_CSC_EMPRESA_HOST )             
            && isset( $obj->CLIENTE_CSC )
            && isset( $obj->PM_CSC_PROYECTO )
            && isset( $obj->CAT_PROCESO_EMP_CSC )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetEmpleados($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;



      case 'GetEstudiosEmpleado':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
            && isset( $obj->EMP_CSC_EMPRESA_HOST )             
            && isset( $obj->EMPLEADO_CSC_EMPLEADO )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetEstudiosEmpleado($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'GetGDocumentos':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
            && isset( $obj->EMP_CSC_EMPRESA_HOST )             
            && isset( $obj->EMPLEADO_CSC_EMPLEADO )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetGDocumentos($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'MoodleCursosEmpleado':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
            && isset( $obj->EMPLEADO_RFC )
          )
          {
            $Function = new iApp();
            $Response = $Function->MoodleCursosEmpleado($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'MoodleExamenesEmpleado':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
            && isset( $obj->EMPLEADO_RFC )
          )
          {
            $Function = new iApp();
            $Response = $Function->MoodleExamenesEmpleado($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'GetGridsEmpleados':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetGridsEmpleados($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'Llena_GridArchivo':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
          )
          {
            $Function = new iApp();
            $Response = $Function->Llena_GridArchivo($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;
      /** 13/09/2019 */

      case 'insertaDoctosWBSServicio':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
          )
          {
            $Function = new iApp();
            $Response = $Function->insertaDoctosWBSServicio($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;


      case 'Llena_GridArchivo_Validacion':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
          )
          {
            $Function = new iApp();
            $Response = $Function->Llena_GridArchivo_Validacion($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'insertTokenApp':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
            && isset( $obj->DISPOSITIVO_TOKEN ) 
            && isset( $obj->APP_TOKEN )
            && isset( $obj->EMPLEADO_CSC_EMPLEADO )
            && isset( $obj->CSC_TIPO_DISPOSITIVO )
          )
          {
            $Function = new iApp();
            $Response = $Function->insertTokenApp($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;

      case 'GetDispositivoToken':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre )
            && isset( $obj->DISPOSITIVO_TOKEN ) 
            && isset( $obj->APP_TOKEN )
            && isset( $obj->EMPLEADO_CSC_EMPLEADO )
          )
          {
            $Function = new iApp();
            $Response = $Function->GetDispositivoToken($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;


      case 'GetHeadCountEmpleados':
        $obj = json_decode( file_get_contents('php://input') );
        $objArr = (array)$obj;
        if (empty($objArr)){
          $this->response(422,"error","Sin datos, revisar json");
        }
        else{
          if
          (
            isset( $obj->EmpresaNombre ) 
            && isset( $obj->EMP_CSC_EMPRESA_HOST )             
          )
          {
            $Function = new iApp();
            $Response = $Function->GetHeadCountEmpleados($obj);
            //$this->response(200,"success","new record added");
            echo json_encode($Response,JSON_PRETTY_PRINT);
          }
          else{
            $this->response(422,"error","Las propiedades no han sido definidas");
          }
        }
      break;
        
        
        
      }
    }
}

?>
