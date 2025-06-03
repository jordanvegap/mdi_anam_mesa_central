<?php
require_once('Nusoap/nusoap.php');
include 'PDOConexion/pdo_database.class.php';
include '../configPruebas.php';
//include '../configPruebas.php';
class iApp{
  private function Conecta($Empresa){
    new configFile($Empresa);
    try {
      $db = new wArLeY_DBMS(_DB_type, _DB_server, _DB_db, _DB_user, _DB_pass, _DB_port);
      $dbCN = $db->Cnxn(); //This step is really neccesary for create connection to database, and getting the errors in methods.

      if($dbCN==false){
        return $db->getError();
      }
      else{
        return $db;
      }
      //echo $db->getError(); //Show error description if exist, else is empty.

    } catch (Exception $exc) {
      return $exc;
        //http_response_code(500);
        exit;
    }
  }

  function codifica_password($contrasenia){
    mb_internal_encoding('UTF-8');
    $mb_encoding = mb_convert_encoding($contrasenia, 'UTF-16LE', 'UTF-8');
    $hash = base64_encode(md5($mb_encoding, true));
    return $hash;
  }

  function Login_Usuario($obj){
    $info_empresa = $this->Info_Empresa($obj->EmpresaNombre);
    $csc_empresa = $info_empresa[0]['EMP_CSC_EMPRESA_HOST'];
    
    $info_usuario = $this->Info_Usuario( $obj->EmpresaNombre, $csc_empresa, $obj->USU_LOGIN, $this->codifica_password($obj->USU_PASSWORD) );
    if( $info_usuario === 0 ){
      $arr_res = array('Estatus' => 'Error','Msj'=>'Usuario o Contraseña Incorrecta');
    }else{
      //$arr_res = array('Estatus' => 'Exito','JsonDatos'=>$info_usuario);
      $csc_empleado = $info_usuario[0]['EMPLEADO_CSC_EMPLEADO'];
      $info_empleado = $this->Info_Empleado( $obj->EmpresaNombre, $csc_empresa, $csc_empleado );
        if( $info_empleado === 0 ){
          $arr_res = array('Estatus' => 'Error','Msj'=>'Sin Informacion');
        }else{
          $cam_servicios = $this->Cam_Servicios($obj->EmpresaNombre, $csc_empresa, $csc_empleado);
          $inm_empleado = $this->Inm_Empleado($EmpresaNombre,$csc_Empresa,$info_usuario[0]['USU_CSC_USUARIO']);

          //$imag_empleado = $this->Img_Empleado( $obj->EmpresaNombre, $csc_empresa, $csc_empleado);
          
          $emp_clienteasignado = $this->Get_MDI($obj->EmpresaNombre, $csc_empresa, $csc_empleado);
          $arr_res = array(
            'Estatus' => 'Exito',
            'JsonDatosUsuario'=>$info_usuario,
            'jsonInfoEmpresa'=>$info_empresa,
            'JsonDatosEmpleado'=>$info_empleado,
            'JsonServiciosEmpleado'=>$cam_servicios,
            'JsonInmueblesEmpleado'=>$inm_empleado,
            'JsonEmplClienteAsignado'=>$emp_clienteasignado,
            //'Imagen'=>$imag_empleado
          );
        }
    }
    return $arr_res;
  }

  function Info_Empresa($EmpresaNombre){
    $connecta = $this->Conecta($EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("SELECT EMP_CSC_EMPRESA_HOST,TIPO_CSC_TIPO_EMPRESA_UNIVERSAL,EMP_CLV_EMPRESA FROM SAMT_EMPRESA WHERE EMP_CLV_EMPRESA ='".$EmpresaNombre."'");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    return $ObjReturn;
    $connecta->disconnect();
  }

 
 
  function acceso_user($obj){

    $info_empresa = $this->Info_Empresa($obj->EmpresaNombre);
    $csc_empresa = $info_empresa[0]['EMP_CSC_EMPRESA_HOST'];
    
    $info_usuario = $this->Info_pass( $obj->EmpresaNombre, $csc_empresa, $obj->USU_LOGIN, $obj->USU_PASSWORD);

    if( $info_usuario === 0 ){
      $arr_res = array('Estatus' => 'Error','Msj'=>'Número de Nomina o Contraseña Incorrecta');
    }else{
      //$arr_res = array('Estatus' => 'Exito','JsonDatos'=>$info_usuario);
      $csc_empleado = $info_usuario[0]['EMPLEADO_CSC_EMPLEADO'];
    ///  $Usuario_csc  = $info_usuario[0]['USU_CSC_USUARIO'];

     $info_empleado = $this->Info_Empleado( $obj->EmpresaNombre, $csc_empresa, $csc_empleado );

        if( $info_empleado === 0 ){
          $arr_res = array('Estatus' => 'Error','Msj'=>'Sin Informacion');
        }else{

        $cam_servicios = $this->Cam_Servicios($obj->EmpresaNombre, $csc_empresa, $csc_empleado);

       // $inm_empleado = $this->Inm_Empleado($EmpresaNombre,$csc_Empresa,$Usuario_csc);

          //$imag_empleado = $this->Img_Empleado( $obj->EmpresaNombre, $csc_empresa, $csc_empleado);
          
          $emp_clienteasignado = $this->Get_MDI($obj->EmpresaNombre, $csc_empresa, $csc_empleado);

          $arr_res = array(
            'Estatus' => 'Exito',
            'JsonDatosUsuario'=>$info_usuario,
            'jsonInfoEmpresa'=>$info_empresa,
            'JsonDatosEmpleado'=>$info_empleado,
            'JsonServiciosEmpleado'=> $Usuario_csc,
            'JsonEmplClienteAsignado'=>$emp_clienteasignado
            //'Imagen'=>$imag_empleado
           //'JsonInmueblesEmpleado'=>$inm_empleado
            
          );
        }
    }
    return $arr_res;
  }
  
  function Img_Empleado($obj){
    $connecta = $this->Conecta($obj->EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("
      SELECT ISNULL(CONVERT(varbinary(MAX), EMPLEADO_PATHFOTO),0) as EMPLEADO_PATHFOTO
      FROM SAMT_EMPLEADOS
      WHERE [EMP_CSC_EMPRESA_HOST] = ".$obj->EMP_CSC_EMPRESA_HOST."  AND [EMPLEADO_CSC_EMPLEADO] =". $obj->EMPLEADO_CSC_EMPLEADO
    );
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res = array('Estatus' => 'Error','Msj'=>'Consulta Incorrecta');
    }
    else{
	  $arr_res = array('Estatus' => 'Exito','JsonDatos'=>$ObjReturn);
      
    }
    return $arr_res;
    $connecta->disconnect();
  }


  public function Info_Empleado($EmpresaNombre,$csc_Empresa,$csc_Empleado){
    $connecta = $this->Conecta($EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("
    SELECT EMPL.EMP_CSC_EMPRESA_HOST
    ,EMPL.EMPLEADO_CSC_EMPLEADO
    ,EMPL.EMPLEADO_ID_EXTERNO
    ,CONCAT(EMPL.EMPLEADO_APATERNOEMPLEADO ,' ', EMPL.EMPLEADO_AMATERNOEMPLEADO,' ', EMPL.EMPLEADO_NOMBREEMPLEADO) AS NOMBRE_EMPLEADO
    ,(Convert(Char(10), EMPL.EMPLEADO_FECHA_NACIMIENTO, 105)) AS EMPLEADO_FECHA_NACIMIENTO
    ,floor((cast(convert(varchar(8),getdate(),112) as int)-cast(convert(varchar(8),EMPL.EMPLEADO_FECHA_NACIMIENTO,112) as int) ) / 10000) as EMPLEADO_EDAD
    ,EMPL.CAT_PUESTO_CSCEMPLEADO AS TIPO_PUESTO_CSCEMPLEADO
    ,T_PUESTO.TIPO_PUESTO_IDIOMA1
    ,EMPL.REQ_CSCREQUISICION	
    ,EMPL.EMPLEADO_CURP
    ,EMPL.EMPLEADO_IMSS
    ,EMPL.EMPLEADO_RFC
    ,EMPL.TIPO_SEXO_CSC
    ,E_SEXO.TIPO_SEXO_IDIOMA1
    ,ISNULL(CONVERT(varbinary(MAX), EMPL.EMPLEADO_PATHFOTO),0) as EMPLEADO_PATHFOTO
    ,EMPL.CLIENTE_CSC
    ,P_CLIENTE.CLIENTE_NOMBRE
    ,EMPL.PM_CSC_PROYECTO
    ,P_PROYECTO.PM_NOMBRE
    ,EMPL.CAM_CSC_SERVICIO
    ,P_CAMPANIA.CAM_SERVICIO_NOMBRE

    ,EMPL.EMPRESA_LABORAL_CSC
    ,EMP_LABORA.EMPRESA_LABORAL_RAZONSOCIALNOMBRE
    ,EMP_LABORA.EMPRESA_LABORAL_ESTADO
    ,EMP_LABORA.EMPRESA_LABORAL_MUNICIPIO
    ,EMP_LABORA.EMPRESA_LABORAL_COLONIA
    ,EMP_LABORA.EMPRESA_LABORAL_CODIGOPOSTAL
    ,EMP_LABORA.EMPRESA_LABORAL_LAT
    ,EMP_LABORA.EMPRESA_LABORAL_LONG
    ,EMP_LABORA.EMPRESA_LABORAL_DIRECCION
    ,EMP_LABORA.EMPRESA_LABORAL_TELEFONO

    
      FROM SAMT_EMPLEADOS AS EMPL
    LEFT JOIN SAMT_EMPRESA_LABORAL AS EMP_LABORA
    ON EMP_LABORA.EMPRESA_LABORAL_CSC = EMPL.EMPRESA_LABORAL_CSC AND EMP_LABORA.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST

    LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS T_PUESTO
    ON T_PUESTO.TIPO_PUESTO_CSCEMPLEADO = EMPL.CAT_PUESTO_CSCEMPLEADO AND T_PUESTO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST

    LEFT JOIN SAMT_CLIENTES AS P_CLIENTE
    ON P_CLIENTE.CLIENTE_CSC = EMPL.CLIENTE_CSC AND P_CLIENTE.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
    LEFT JOIN SAMT_PROYECTOS AS P_PROYECTO 
    ON P_PROYECTO.PM_CSC_PROYECTO = EMPL.PM_CSC_PROYECTO AND P_PROYECTO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
    LEFT JOIN SAMT_CAM_SERVICIO AS P_CAMPANIA
    ON P_CAMPANIA.CAM_CSC_SERVICIO = EMPL.CAM_CSC_SERVICIO AND P_CAMPANIA.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST

    LEFT JOIN SAMT_TIPO_SEXO AS E_SEXO
    ON E_SEXO.TIPO_SEXO_CSC = EMPL.TIPO_SEXO_CSC AND E_SEXO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
    WHERE EMPL.EMP_CSC_EMPRESA_HOST = ".$csc_Empresa."  AND EMPL.EMPLEADO_CSC_EMPLEADO =". $csc_Empleado
    );
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res_emp = 0;
    }
    else{
      $arr_res_emp = $ObjReturn;
    }
    return $arr_res_emp;
    $connecta->disconnect();
  }
  
  function Info_Usuario($EmpresaNombre,$csc_Empresa,$usu_login,$usu_password){
    $connecta = $this->Conecta($EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("
      SELECT EMP_CSC_EMPRESA_HOST ,USU_CSC_USUARIO,EMPLEADO_CSC_EMPLEADO,USU_INDICAACTIVO,USU_CSCSYSUSER,USU_CODESQUEMASEG,USU_ACCESO_SITEMA
      FROM SAMT_USUARIO
      WHERE EMP_CSC_EMPRESA_HOST = ".$csc_Empresa." 
      and USU_INDICAACTIVO = 1 
      and USU_LOGIN = '".$usu_login."' 
      and USU_PASSWORD = '".$usu_password."'
    ");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res_emp = 0;
    }
    else{
      $arr_res_emp = $ObjReturn;
    }
    return $arr_res_emp;
    $connecta->disconnect();
  }
	
   function Info_pass($EmpresaNombre,$csc_Empresa,$usu_login,$usu_password){
    $connecta = $this->Conecta($EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("
    SELECT EMP.EMPLEADO_CSC_EMPLEADO,USU.USU_CSC_USUARIO FROM SAMT_EMPLEADOS AS EMP
    LEFT JOIN SAMT_USUARIO AS USU ON
    USU.EMPLEADO_CSC_EMPLEADO=EMP.EMPLEADO_CSC_EMPLEADO AND USU.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
    WHERE EMP.EMPLEADO_ID_EXTERNO='".$usu_login."'
     AND EMP.EMPLEADO_RFC='".$usu_password."'");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res_emp = 0;
    }
    else{
      $arr_res_emp = $ObjReturn;
    }
    return $arr_res_emp;
    $connecta->disconnect();
  }
  
  function Cam_Servicios($EmpresaNombre,$csc_Empresa,$csc_Empleado){
    $connecta = $this->Conecta($EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("
    SELECT [SERV_EMP].[EMPLEADO_CSC_EMPLEADO],[SERV_EMP].[CAM_CSC_SERVICIO],SERVICIO.CAM_SERVICIO_NOMBRE
FROM [SAMT_CAM_SERVICIOS_EMPLEADOS] AS [SERV_EMP]
FULL JOIN SAMT_CAM_SERVICIO AS SERVICIO ON SERVICIO.CAM_CSC_SERVICIO = [SERV_EMP].[CAM_CSC_SERVICIO] AND SERVICIO.EMP_CSC_EMPRESA_HOST = SERV_EMP.EMP_CSC_EMPRESA_HOST
WHERE [SERV_EMP].[EMPLEADO_CSC_EMPLEADO] = ".$csc_Empleado." AND [SERV_EMP].[EMP_CSC_EMPRESA_HOST] = ".$csc_Empresa."
    ");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res_emp = 0;
    }
    else{
      $longitud = count($ObjReturn);
      $i = 0;
      $it = "";
      foreach($ObjReturn as $value) {

      if(++$i === $longitud) {
      $it .= $value['CAM_CSC_SERVICIO'];
      }
      else{
      $it .= $value['CAM_CSC_SERVICIO'] . ',';
      }

      }
      $arr_res_emp=array('WhereSql'=>$it,'WhereJslinq'=>$ObjReturn);
    }
    return $arr_res_emp;
    /**/
    $connecta->disconnect();
  }

  function Get_MDI($EmpresaNombre,$csc_Empresa,$csc_Empleado){
    $connecta = $this->Conecta($EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("
    SELECT MDI.EMP_CSC_EMPRESA_HOST
      ,MDI.SAMT_CAM_EMP_MDI_CSC
      ,MDI.TIPO_MDI_CSC
      ,TPO_MDI.TIPO_MDI_IDIOMA1
      ,TPO_MDI.TIPO_MDI_CLAVE
      ,MDI.EMPLEADO_CSC_EMPLEADO
      ,MDI.SAMT_CAM_EMP_ACTIVO
      ,MDI.CAM_CSC_SERVICIO
      ,MDI.CLIENTE_CSC
      FROM SAMT_CAM_EMP_MDI AS MDI
      INNER JOIN SAMT_CAM_TIPO_MDI AS TPO_MDI ON
      TPO_MDI.TIPO_MDI_CSC = MDI.TIPO_MDI_CSC AND TPO_MDI.EMP_CSC_EMPRESA_HOST = MDI.EMP_CSC_EMPRESA_HOST
      WHERE MDI.SAMT_CAM_EMP_ACTIVO = 1
      AND MDI.EMPLEADO_CSC_EMPLEADO = ".$csc_Empleado."
      AND MDI.EMP_CSC_EMPRESA_HOST = ".$csc_Empresa."
    ");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res_emp = 0;
    }
    else{
      $longitud = count($ObjReturn);
      $i = 0;
      $it = "";
      foreach($ObjReturn as $value) {

      if(++$i === $longitud) {
      $it .= $value['CLIENTE_CSC'];
      }
      else{
      $it .= $value['CLIENTE_CSC'] . ',';
      }

      }
      $arr_res_emp=array('WhereSql'=>$it,'WhereJslinq'=>$ObjReturn);
    }
    return $arr_res_emp;
    /**/
    $connecta->disconnect();
  }

  function Inm_Empleado($EmpresaNombre,$csc_Empresa,$csc_Usuario){
    $connecta = $this->Conecta($EmpresaNombre); // <---- Conecta a Base de Datos
    $query = $connecta->query("
    SELECT ISNULL(REQ_CSCREQUISICION, 0) AS REQ_CSCREQUISICION
      FROM SAMT_SEG_EMPRES_SUBMENU_INMUEBLE WHERE EMP_CSC_EMPRESA_HOST=1 AND USU_CSC_USUARIO=10093
      GROUP BY REQ_CSCREQUISICION
    ");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res_emp = 0;
    }
    else{
      $longitud = count($ObjReturn);
      $i = 0;
      $it = "";
      foreach($ObjReturn as $value) {

      if(++$i === $longitud) {
      $it .= $value['REQ_CSCREQUISICION'];
      }
      else{
      $it .= $value['REQ_CSCREQUISICION'] . ',';
      }

      }
      $arr_res_emp=array('WhereSql'=>$it,'WhereJslinq'=>$ObjReturn);
    }
    return $arr_res_emp;
    /**/
    $connecta->disconnect();
  }

  

//********************************************************************/
//****************** FUNCIONES PROGRAMA DE TRABAJO *******************/
//********************************************************************/

  /***** OBTIENE CATORCENA ACTUAL *****/
  public function GetCatorcenaActual($obj){
    switch ($obj->TPO_BUSQUEDA) {
      case 'ACTUAL':
          $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
          $query = $connecta->query("SELECT * From SAMT_PF_CALENDARIO_CATORCENAS WHERE EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST."
          AND (Convert(Char(10), GETDATE(), 126) >= SAMT_CAL_CATORCENA_F1 AND CONVERT(char(10), GETDATE(),126) <= SAMT_CAL_CATORCENA_F2);");
          $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
          if(empty($ObjReturn)){
            $arr_res = array(
              'Estatus' => 'Error',
              'JsonDatos'=>$ObjReturn
            );
          }
          else {
            $arr_res = array(
              'Estatus' => 'Exito',
              'JsonDatos'=>$ObjReturn
            );
          }
          return $arr_res;
          $connecta->disconnect();
        break;
      case 'MENSUAL':
          if (isset($obj->ANIO) && isset($obj->MES)) {
            $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
            $query = $connecta->query("SELECT * From SAMT_PF_CALENDARIO_CATORCENAS WHERE EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST."
            AND SAMT_CAL_CATORCENA_ANIO = ".$obj->ANIO." AND SAMT_CAL_CATORCENA_MES = ".$obj->MES.";");
            $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
            if(empty($ObjReturn)){
              $arr_res = array(
                'Estatus' => 'Error',
                'JsonDatos'=>$ObjReturn
              );
            }
            else {
              $arr_res = array(
                'Estatus' => 'Exito',
                'JsonDatos'=>$ObjReturn
              );
            }
            return $arr_res;
            $connecta->disconnect();
          }else{
            $arr_res = array(
              'Estatus' => 'Error',
              'JsonDatos'=>'Defina las propiedades Año y Mes'
            );
            return $arr_res;
          }
        break;
        case 'ANUAL':
          if (isset($obj->ANIO)) {
            $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
            $query = $connecta->query("SELECT * From SAMT_PF_CALENDARIO_CATORCENAS WHERE EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST."
            AND SAMT_CAL_CATORCENA_ANIO = ".$obj->ANIO.";");
            $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
            if(empty($ObjReturn)){
              $arr_res = array(
                'Estatus' => 'Error',
                'JsonDatos'=>$ObjReturn
              );
            }
            else {
              $arr_res = array(
                'Estatus' => 'Exito',
                'JsonDatos'=>$ObjReturn
              );
            }
            return $arr_res;
            $connecta->disconnect();
          }else{
            $arr_res = array(
              'Estatus' => 'Error',
              'JsonDatos'=>'Defina las propiedades Año'
            );
            return $arr_res;
          }
        break;
      
      default:
        # code...
        break;
    }
    
   }
   
   public function GetProgramaEmpleado($obj){

    $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
    $query = $connecta->query("
    SELECT CONVERT(VARCHAR(10)
,CCPTD.PROGRAMA_TRABAJO_FECHA, 105) as FechaFomato
,DATENAME(weekday, convert(varchar, CCPTD.PROGRAMA_TRABAJO_FECHA, 101)) AS NOMBRE_DIA
,DATEPART(DAY, CCPTD.PROGRAMA_TRABAJO_FECHA) AS DIA
,CONVERT(char(5), CCPTD.PROGRAMA_FECHA_JORNADA_ENTRADA, 108)  AS HORAENTRADA
,CONVERT(char(5), CCPTD.PROGRAMA_FECHA_JORNADA_SALIDA, 108) AS HORASALIDA
,ISNULL(CONVERT(char(5), CCPTD.PROGRAMA_FECHA_VIRTUAL_ENTRADA, 108) ,'00:00') AS HORAENTRADAREGISTRO
,ISNULL(CONVERT(char(5), CCPTD.PROGRAMA_FECHA_VIRTUAL_SALIDA, 108) ,'00:00') AS HORASALIDAREGISTRO
,CCPTD.*
,TPO_B_JORNADA.[TIPO_BASADO_EN_JORNADA_IDIOMA1]
,SUBTPO_B_JORNADA.TPF_CSC_SUB_BASADO_EN_JORNADA
,SUBTPO_B_JORNADA.[SUB_BASADO_EN_JORNADA_IDIOMA1]
,SUBTPO_B_JORNADA.SUB_BASADO_EN_JORNADA_CLAVE
,VIRTUAL.ESTATUS_VIRTUAL_IDIOMA1

FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO AS CCPTD 
LEFT JOIN SAMT_EMPLEADOS 
ON CCPTD.EMP_CSC_EMPRESA_HOST=SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST AND CCPTD.EMPLEADO_CSC_EMPLEADO=SAMT_EMPLEADOS.EMPLEADO_CSC_EMPLEADO

LEFT JOIN SAMT_PF_TIPO_BASADO_EN_JORNADA AS TPO_B_JORNADA 
ON TPO_B_JORNADA.TPF_CSC_TIPO_BASADO_EN_JORNADA = CCPTD.[TPF_CSC_TIPO_BASADO_EN_JORNADA] AND TPO_B_JORNADA.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST

LEFT JOIN [SAMT_PF_SUB_TIPO_BASADO_EN_JORNADA] AS SUBTPO_B_JORNADA 
ON SUBTPO_B_JORNADA.TPF_CSC_SUB_BASADO_EN_JORNADA = CCPTD.TPF_CSC_SUB_BASADO_EN_JORNADA AND SUBTPO_B_JORNADA.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST

LEFT JOIN SAMT_PF_ESTATUS_VIRTUAL AS VIRTUAL 
ON VIRTUAL.TPF_CSC_ESTATUS_VIRTUAL = CCPTD.TPF_CSC_ESTATUS_VIRTUAL AND VIRTUAL.EMP_CSC_EMPRESA_HOST= SAMT_EMPLEADOS.EMP_CSC_EMPRESA_HOST

WHERE CCPTD.EMP_CSC_EMPRESA_HOST=".$obj->EMP_CSC_EMPRESA_HOST."
AND CCPTD.PROGRAMA_TRABAJO_FECHA>='".$obj->SAMT_CAL_CATORCENA_F1."'
AND CCPTD.PROGRAMA_TRABAJO_FECHA<='".$obj->SAMT_CAL_CATORCENA_F2."'
AND SAMT_EMPLEADOS.EMPLEADO_ID_EXTERNO='".$obj->EMPLEADO_ID_EXTERNO."' ORDER BY CCPTD.PROGRAMA_TRABAJO_FECHA ASC;");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res = array(
        'Estatus' => 'Error',
        'JsonDatos'=>$ObjReturn
      );
    }
    else {
      $arr_res = array(
        'Estatus' => 'Exito',
        'JsonDatos'=>$ObjReturn
      );
    }
    return $arr_res;
    $connecta->disconnect();
  }
   /***** FUNCIONES PROGRAMA DE TRABAJO *****/


   public function GetDetalleGeneral($obj){

    $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
    $query = $connecta->query("SELECT EMPLEADO_CSC_EMPLEADO
   ,sum (PROGRAMA_TRABAJO_LABORADO) as LABORADO
   ,sum (PROGRAMA_TRABAJO_DIA_DESCANSO) as DESCANSO 
   ,sum (PROGRAMA_TRABAJO_LABORADO) as PROGRAMA_TRABAJO_LABORADO
   ,sum (PROGRAMA_TRABAJO_FALTA) as PROGRAMA_TRABAJO_FALTA
   ,sum (PROGRAMA_TRABAJO_FALTA_ANTICIPADA) as PROGRAMA_TRABAJO_FALTA_ANTICIPADA
   ,sum (PROGRAMA_TRABAJO_FALTA_POR_OMISION) as PROGRAMA_TRABAJO_FALTA_POR_OMISION
   ,sum (PROGRAMA_TRABAJO_FALTA_POR_RECHAZO ) as PROGRAMA_TRABAJO_FALTA_POR_RECHAZO
   ,sum (PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR) as PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR
   ,sum (PROGRAMA_TRABAJO_DIA_DESCANSO) as PROGRAMA_TRABAJO_DIA_DESCANSO
   ,sum (PROGRAMA_TRABAJO_PERMISO_SIN_GOCE) AS PROGRAMA_TRABAJO_PERMISO_SIN_GOCE
   ,SUM (PROGRAMA_TRABAJO_PERMISO_CON_GOCE) AS PROGRAMA_TRABAJO_PERMISO_CON_GOCE
   ,sum (PROGRAMA_TRABAJO_VACACIONES) AS PROGRAMA_TRABAJO_VACACIONES
   ,SUM (PROGRAMA_TRABAJO_INCAPACIDAD) AS PROGRAMA_TRABAJO_INCAPACIDAD
   ,SUM (PROGRAMA_TOTAL_TIEMPO_PLANEADO) AS PROGRAMA_TOTAL_TIEMPO_PLANEADO
	,SUM (PROGRAMA_TOTAL_TIEMPO_VIRTUAL) AS PROGRAMA_TOTAL_TIEMPO_VIRTUAL
	,SUM (PROGRAMA_TRABAJO_LABORADO+PROGRAMA_TRABAJO_FALTA+PROGRAMA_TRABAJO_FALTA_ANTICIPADA+PROGRAMA_TRABAJO_FALTA_POR_OMISION+PROGRAMA_TRABAJO_FALTA_POR_RECHAZO+PROGRAMA_TRABAJO_FALTA_POR_JUSTIFICAR+PROGRAMA_TRABAJO_DIA_DESCANSO+PROGRAMA_TRABAJO_PERMISO_SIN_GOCE+PROGRAMA_TRABAJO_PERMISO_CON_GOCE+PROGRAMA_TRABAJO_VACACIONES+PROGRAMA_TRABAJO_INCAPACIDAD) AS TOTAL_DIAS

   from SAMT_PF_PROGRAMA_TRABAJO_DIARIO
   where EMP_CSC_EMPRESA_HOST=".$obj->EMP_CSC_EMPRESA_HOST."
   AND PROGRAMA_TRABAJO_FECHA>='".$obj->SAMT_CAL_CATORCENA_F1."'
   AND PROGRAMA_TRABAJO_FECHA<='".$obj->SAMT_CAL_CATORCENA_F2."'
   AND EMPLEADO_CSC_EMPLEADO =".$obj->EMPLEADO_CSC_EMPLEADO."
   group by EMPLEADO_CSC_EMPLEADO");
    $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
    if(empty($ObjReturn)){
      $arr_res = array(
        'Estatus' => 'Error',
        'JsonDatos'=>$ObjReturn
      );
    }
    else {
      $arr_res = array(
        'Estatus' => 'Exito',
        'JsonDatos'=>$ObjReturn
      );
    }
    return $arr_res;
    $connecta->disconnect();
  }


  private function GetNewId($obj){
    /****Conecta a Base de Datos****/
    $connecta = $this->Conecta($obj->EmpresaNombre);
    /****End Conecta a Base de Datos****/
    $newIdItem = $connecta->query("SELECT NEWID() AS NEWIDITEM");
    foreach($newIdItem as $newId){
      $idNew = $newId['NEWIDITEM'];
    }
    /****Desconecta a Base de Datos****/
    $connecta->disconnect();
    /****End Desconecta a Base de Datos****/
    return $idNew;
  }
 /***** INSERTA EN BITACORA SE CAMBIA EL PROCESO Y SUBRPOCESO *****/
 public function insertaFirmaMovil($obj){
  /****Conecta a Base de Datos****/
   $connecta = $this->Conecta($obj->EmpresaNombre);
   $TipoFirma = "";
   /****End Conecta a Base de Datos****/
   if ($obj->FIRMA_MOVIL_TIPO_FIRMA_CSC == 1) {
    $TipoFirma = "Entrada";
  } else if($obj->FIRMA_MOVIL_TIPO_FIRMA_CSC == 2){
    $TipoFirma = "Salida";
  } else if($obj->FIRMA_MOVIL_TIPO_FIRMA_CSC == 3){
    $TipoFirma = "Auxiliar";
  }

  if($obj->SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO_CSC == ''){
	$Motivo = 'Null';
  }else{
	$Motivo = $obj->SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO_CSC;  
  }
   $getInsertB = $connecta->insert(
    "[SAMT_PF_FIRMA_MOVIL]", 
    "[EMP_CSC_EMPRESA_HOST] = ".$obj->EMP_CSC_EMPRESA_HOST.",
    [FIRMA_MOVIL_NEWID] = '".$this->GetNewId($obj)."',
    [EMPLEADO_CSC_EMPLEADO] = ".$obj->EMPLEADO_CSC_EMPLEADO.",
    [EMPLEADO_ID_EXTERNO] = '".$obj->EMPLEADO_ID_EXTERNO."',
    [SAMT_PF_TIPO_FIRMA_MOVIL_CSC] = ".$obj->FIRMA_MOVIL_TIPO_FIRMA_CSC.",
    [FIRMA_MOVIL_FECHA] = GETDATE(),
    [FIRMA_MOVIL_LATITUD] = ".$obj->FIRMA_MOVIL_LATITUD.",
    [FIRMA_MOVIL_LONGITUD] = ".$obj->FIRMA_MOVIL_LONGITUD.",
    [FIRMA_MOVIL_TELEFONO] = ".$obj->FIRMA_MOVIL_TELEFONO.",
    [AUDITORIA_USU_ALTA] = ".$obj->EMPLEADO_CSC_EMPLEADO.",
	[SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO_CSC] = ".$Motivo.",
    [AUDITORIA_USU_ULT_MOD] = ".$obj->EMPLEADO_CSC_EMPLEADO.",
    [FIRMA_MOVIL_COMENTARIOS] = '".$obj->FIRMA_MOVIL_COMENTARIOS."',
    [AUDITORIA_FEC_ALTA] = GETDATE(),
    [AUDITORIA_FEC_ULT_MOD] = GETDATE()");
 
 /****Desconecta a Base de Datos****/
   $connecta->disconnect();
   /****End Desconecta a Base de Datos****/
   if($getInsertB == false){
         $Datos = array('Estatus'=>'Error','Msj'=>$TipoFirma . ' Incorrecta', 'id' => $connecta->getError());
       }
       else{
        $Datos = array('Estatus'=>'Exito','Msj'=>$TipoFirma . ' Correcta', 'id' => $getInsertB);
       }
       return $Datos;
 
 }

   
//********************************************************************/
//****************** FIN FUNCIONES PROGRAMA DE TRABAJP *******************/
//********************************************************************/
 
  public function GetCatorcena($obj){

  /****Conecta a Base de Datos****/
    $connecta = $this->Conecta($obj->EmpresaNombre);
    /****End Conecta a Base de Datos****/

   
      $SQL = $connecta->query("SELECT 
        SAMT_CAL_CATORCENA_CSC AS CSC ,
        SAMT_CAL_CATORCENA_NOMBRE AS TXT
       FROM SAMT_PF_CALENDARIO_CATORCENAS 
      WHERE SAMT_CAL_CATORCENA_MES=".$obj->CSC_MES." 
      AND SAMT_CAL_CATORCENA_ANIO='".$obj->CSC_ANIO."'");
 
     $ConteoDatos = $connecta->rowcount();

    $result = array();

    if($ConteoDatos==0){
      $arr_res_emp = array('Estatus' => 'Error','Msj'=>'No tiene informacion asignada');
      $arrayReturn = array("Result"=>$arr_res_emp);
      /****Desconecta a Base de Datos****/
      $connecta->disconnect();
      /****End Desconecta a Base de Datos****/
    }
    else{
      foreach($SQL as $row){
              $nodo = array();
              $nodo['id'] = $row["CSC"];
              $nodo['text'] = $row["TXT"];
              array_push($result,$nodo);
      }
      $arr_res_emp = array('Estatus' => 'Exito','Msj'=>'Datos Cargados');
      $arrayReturn = array("Result"=>$arr_res_emp, "JsonDatos"=>$result);

    }


    /****Desconecta a Base de Datos****/
    $connecta->disconnect();
    /****End Desconecta a Base de Datos****/
    return $arrayReturn;
 }

public function GetFechaCatorcena($obj){

  /****Conecta a Base de Datos****/
    $connecta = $this->Conecta($obj->EmpresaNombre);
    /****End Conecta a Base de Datos****/

   
      $SQL = $connecta->query("select 
        SAMT_CAL_CATORCENA_F1,SAMT_CAL_CATORCENA_F2
        FROM SAMT_PF_CALENDARIO_CATORCENAS
         WHERE SAMT_CAL_CATORCENA_CSC='".$obj->SAMT_CAL_CATORCENA_CSC."'");
 
    $ConteoDatos = $connecta->rowcount();

     

    if($ConteoDatos==0){
      $arr_res_emp = array('Estatus' => 'Error','Msj'=>'No tiene informacion asignada');
      $arrayReturn = array("Result"=>$arr_res_emp);
      /****Desconecta a Base de Datos****/
      $connecta->disconnect();
      /****End Desconecta a Base de Datos****/
    }else{
      
      $arr_res_emp = array('Estatus' => 'Exito','Msj'=>'Datos Cargados');
      $arrayReturn = array("Result"=>$arr_res_emp, "JsonDatos"=>$SQL->fetchAll(PDO::FETCH_ASSOC));

    }


    /****Desconecta a Base de Datos****/
    $connecta->disconnect();
    /****End Desconecta a Base de Datos****/
    return $arrayReturn;
 }


 /**EMPLEADOS A CARGO */

 public function GetEmplCargo($obj){

  $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT EMPL.EMP_CSC_EMPRESA_HOST
  ,EMPL.EMPLEADO_CSC_EMPLEADO
  ,EMPL.EMPLEADO_ID_EXTERNO
  ,CONCAT(EMPL.EMPLEADO_NOMBREEMPLEADO , ' ' ,EMPL.EMPLEADO_APATERNOEMPLEADO ,' ', EMPL.EMPLEADO_AMATERNOEMPLEADO) AS NOMBRE_EMPLEADO
  ,(Convert(Char(10), EMPL.EMPLEADO_FECHA_NACIMIENTO, 105)) AS EMPLEADO_FECHA_NACIMIENTO
  ,floor((cast(convert(varchar(8),getdate(),112) as int)-cast(convert(varchar(8),EMPL.EMPLEADO_FECHA_NACIMIENTO,112) as int) ) / 10000) as EMPLEADO_EDAD
  ,EMPL.TIPO_PUESTO_CSCEMPLEADO
  ,T_PUESTO.TIPO_PUESTO_IDIOMA1
  ,EMPL.EMPLEADO_CURP
  ,EMPL.EMPLEADO_IMSS
  ,EMPL.EMPLEADO_RFC
  ,EMPL.TIPO_SEXO_CSC
  ,E_SEXO.TIPO_SEXO_IDIOMA1
  
  ,EMPL.CLIENTE_CSC
  ,P_CLIENTE.CLIENTE_NOMBRE
  ,EMPL.PM_CSC_PROYECTO
  ,P_PROYECTO.PM_NOMBRE
  ,EMPL.CAM_CSC_SERVICIO
  ,P_CAMPANIA.CAM_SERVICIO_NOMBRE

  ,EMPL.EMPRESA_LABORAL_CSC
  ,EMP_LABORA.EMPRESA_LABORAL_RAZONSOCIALNOMBRE
  ,EMP_LABORA.EMPRESA_LABORAL_ESTADO
  ,EMP_LABORA.EMPRESA_LABORAL_MUNICIPIO
  ,EMP_LABORA.EMPRESA_LABORAL_COLONIA
  ,EMP_LABORA.EMPRESA_LABORAL_CODIGOPOSTAL
  ,EMP_LABORA.EMPRESA_LABORAL_LAT
  ,EMP_LABORA.EMPRESA_LABORAL_LONG
  ,EMP_LABORA.EMPRESA_LABORAL_DIRECCION
  ,EMP_LABORA.EMPRESA_LABORAL_TELEFONO
  ,(SELECT COUNT(*) AS FIRMADO FROM SAMT_PF_PROGRAMA_TRABAJO_DIARIO WHERE (Convert(Char(10),PROGRAMA_TRABAJO_FECHA, 126)) = (Convert(Char(10),GETDATE(), 126)) AND EMPLEADO_CSC_EMPLEADO = EMPL.EMPLEADO_CSC_EMPLEADO AND PROGRAMA_FECHA_VIRTUAL_ENTRADA IS NOT NULL) AS CONTFIRMAS
  ,EMPL.EMPLEADO_TELEFONO1
  ,EMPL.EMPLEADO_CELULAR
    FROM SAMT_EMPLEADOS AS EMPL
  LEFT JOIN SAMT_EMPRESA_LABORAL AS EMP_LABORA
  ON EMP_LABORA.EMPRESA_LABORAL_CSC = EMPL.EMPRESA_LABORAL_CSC AND EMP_LABORA.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST

  LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO AS T_PUESTO
  ON T_PUESTO.TIPO_PUESTO_CSCEMPLEADO = EMPL.CAT_PUESTO_CSCEMPLEADO  AND T_PUESTO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST

  LEFT JOIN SAMT_CLIENTES AS P_CLIENTE
  ON P_CLIENTE.CLIENTE_CSC = EMPL.CLIENTE_CSC AND P_CLIENTE.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_PROYECTOS AS P_PROYECTO 
  ON P_PROYECTO.PM_CSC_PROYECTO = EMPL.PM_CSC_PROYECTO AND P_PROYECTO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_CAM_SERVICIO AS P_CAMPANIA
  ON P_CAMPANIA.CAM_CSC_SERVICIO = EMPL.CAM_CSC_SERVICIO AND P_CAMPANIA.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
  FULL JOIN SAMT_CAT_PROCESO_EMPLEADOS AS PROCESOEMPLEADO
  ON PROCESOEMPLEADO.CAT_PROCESO_EMP_CSC = EMPL.CAT_PROCESO_EMP_CSC AND PROCESOEMPLEADO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_SEXO AS E_SEXO
  ON E_SEXO.TIPO_SEXO_CSC = EMPL.TIPO_SEXO_CSC AND E_SEXO.EMP_CSC_EMPRESA_HOST = EMPL.EMP_CSC_EMPRESA_HOST
  WHERE EMPL.EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST."  AND EMPL.EMPLEADO_CSC_EMPLEADO_PADRE = ".$obj->EMPLEADO_CSC_EMPLEADO_PADRE."
  AND PROCESOEMPLEADO.CAT_PROCESO_EMP_CLAVE = 'ACTIVO'
ORDER BY EMPL.EMPLEADO_NOMBREEMPLEADO ASC");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}

public function GetEmpDetalleFirma($obj){
	//AND (Convert(Char(10),FIRMA.FIRMA_MOVIL_FECHA, 126)) BETWEEN '".$obj->SAMT_CAL_CATORCENA_F1."' AND '".$obj->SAMT_CAL_CATORCENA_F2."'
	
  $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT FIRMA.EMP_CSC_EMPRESA_HOST
      ,FIRMA.SAMT_PF_FIRMA_MOVIL_CSC
      ,FIRMA.FIRMA_MOVIL_NEWID
      ,FIRMA.EMPLEADO_CSC_EMPLEADO
      ,FIRMA.EMPLEADO_ID_EXTERNO
      ,FIRMA.FIRMA_MOVIL_FECHA
	  ,(Convert(Char(10),FIRMA.FIRMA_MOVIL_FECHA, 126)) AS SORTFECHA
	  ,FORMAT (FIRMA.FIRMA_MOVIL_FECHA, 'dd/MM/yyyy HH:mm:ss ') as 'FECHAFIRMA'
      ,FIRMA.SAMT_PF_TIPO_FIRMA_MOVIL_CSC
      ,FIRMA.FIRMA_MOVIL_LATITUD
      ,FIRMA.FIRMA_MOVIL_LONGITUD
      ,FIRMA.FIRMA_MOVIL_TELEFONO
      ,FIRMA.FIRMA_MOVIL_COMENTARIOS
	  ,TPO_FIRMA.TIPO_FIRMA_MOVIL_IDIOMA1
	  ,TPO_FIRMA.TIPO_FIRMA_MOVIL_CLAVE
	  ,MOTIVO.TIPO_FIRMA_MOVIL_MOTIVO_IDIOMA1
      
  FROM SAMT_PF_FIRMA_MOVIL as FIRMA
  FULL JOIN SAMT_PF_TIPO_FIRMA_MOVIL AS TPO_FIRMA ON 
    TPO_FIRMA.SAMT_PF_TIPO_FIRMA_MOVIL_CSC = FIRMA.SAMT_PF_TIPO_FIRMA_MOVIL_CSC AND TPO_FIRMA.EMP_CSC_EMPRESA_HOST = FIRMA.EMP_CSC_EMPRESA_HOST
  FULL JOIN SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO AS MOTIVO ON
    MOTIVO.SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO_CSC = FIRMA.SAMT_PF_TIPO_FIRMA_MOVIL_MOTIVO_CSC AND MOTIVO.EMP_CSC_EMPRESA_HOST = FIRMA.EMP_CSC_EMPRESA_HOST
  WHERE FIRMA.EMPLEADO_CSC_EMPLEADO = ".$obj->EMPLEADO_CSC_EMPLEADO."
  AND FIRMA.EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." 

  AND (Convert(Char(10),FIRMA.FIRMA_MOVIL_FECHA, 126)) BETWEEN '".$obj->SAMT_CAL_CATORCENA_F1."' AND '".$obj->SAMT_CAL_CATORCENA_F2."'
  ORDER BY FIRMA.FIRMA_MOVIL_FECHA DESC");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}


public function GetEmpDetalleFirmaBiometrico($obj){
	//AND (Convert(Char(10),FIRMA.FIRMA_MOVIL_FECHA, 126)) BETWEEN '".$obj->SAMT_CAL_CATORCENA_F1."' AND '".$obj->SAMT_CAL_CATORCENA_F2."'
	
  $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT  [EMP_CSC_EMPRESA_HOST]
      ,[SAMT_REGISTROS_CSC] AS SAMT_PF_FIRMA_MOVIL_CSC
	  ,'".$this->GetNewId($obj)."' AS FIRMA_MOVIL_NEWID
	  ,".$obj->EMPLEADO_CSC_EMPLEADO." AS EMPLEADO_CSC_EMPLEADO
      ,[EMPLEADO_CLAVE] AS EMPLEADO_ID_EXTERNO
      ,[REGISTRO_FECHA] AS FIRMA_MOVIL_FECHA
	  ,(Convert(Char(10),[REGISTRO_FECHA], 126)) AS SORTFECHA
      ,FORMAT ([REGISTRO_FECHA], 'dd/MM/yyyy HH:mm:ss ') as 'FECHAFIRMA'
	  ,'4' AS SAMT_PF_TIPO_FIRMA_MOVIL_CSC
	  ,NULL AS FIRMA_MOVIL_LATITUD
      ,NULL AS FIRMA_MOVIL_LONGITUD
	  ,NULL AS FIRMA_MOVIL_TELEFONO
	  ,[REGISTRO_DEVICE_NOMBRE] AS FIRMA_MOVIL_COMENTARIOS
	  ,'BIOMETRICO' AS TIPO_FIRMA_MOVIL_IDIOMA1
	  ,'BIOMETRICO' AS TIPO_FIRMA_MOVIL_CLAVE
	  ,NULL AS TIPO_FIRMA_MOVIL_MOTIVO_IDIOMA1
  FROM  [SAMT_REGISTROS]
  where [EMPLEADO_CLAVE] = '".$obj->EMPLEADO_ID_EXTERNO." '
  AND EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." 
  AND (Convert(Char(10),[REGISTRO_FECHA], 126))>='".$obj->SAMT_CAL_CATORCENA_F1."'
  AND (Convert(Char(10),[REGISTRO_FECHA], 126))<='".$obj->SAMT_CAL_CATORCENA_F2."'
  ORDER BY [REGISTRO_FECHA] DESC;");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}
 

public function GetClientes($obj){
	$connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT [EMP_CSC_EMPRESA_HOST]
    ,[CLIENTE_CSC]
    ,[TIPO_ESTATUS_CLIENTE_CSC]
    ,[CLIENTE_NOMBRE]
    ,[CLIENTE_PAGWEB]
    ,[CLIENTE_CLAVE]
  FROM  [SAMT_CLIENTES] WHERE [EMP_CSC_EMPRESA_HOST] = ".$obj->EMP_CSC_EMPRESA_HOST." AND [TIPO_ESTATUS_CLIENTE_CSC] = ".$obj->TIPO_ESTATUS_CLIENTE_CSC." ORDER BY CLIENTE_NOMBRE ASC ;");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}


public function GetProyectos($obj){
	$connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT * FROM [SAMT_PROYECTOS] WHERE EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." AND [CLIENTE_CSC] = ".$obj->CLIENTE_CSC." ORDER BY PM_NOMBRE ASC;");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}


public function GetSubCampanias($obj){
	$connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT * FROM [SAMT_CAM_SERVICIO] WHERE PM_CSC_PROYECTO = ".$obj->PM_CSC_PROYECTO." AND EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." ORDER BY CAM_SERVICIO_NOMBRE ASC;");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}


public function GetEmpleados($obj){
  $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  
  $CondicionEspecial = "";
if ( isset( $obj->FILTRO ) ) {
  if ($obj->FILTRO == 'Cliente') {
    $CondicionEspecial = " AND [CLIENTE_CSC] IN (".$obj->CLIENTE_CSC.") ";
  } else if($obj->FILTRO == 'ClienteCampania') {
    $CondicionEspecial = " AND [CLIENTE_CSC] IN (".$obj->CLIENTE_CSC.") AND PM_CSC_PROYECTO IN (".$obj->PM_CSC_PROYECTO.") ";
  }   
} else {
  $CondicionEspecial = " AND [CLIENTE_CSC] IN (".$obj->CLIENTE_CSC.") AND PM_CSC_PROYECTO IN (".$obj->PM_CSC_PROYECTO.") AND CAM_CSC_SERVICIO IN (".$obj->CAM_CSC_SERVICIO.") ";
}

  
  
  $query = $connecta->query("SELECT EMP_CSC_EMPRESA_HOST
  ,EMPLEADO_CSC_EMPLEADO
  ,EMPLEADO_CSC_EMPLEADO_PADRE
  ,EMPLEADO_ID_EXTERNO
  ,CAT_PROVEEDOR_CSC AS CAT_PROVEEDOR_INFRA_CSC
  ,CAT_PROCESO_EMP_CSC
  ,CAT_SUBPROCESO_EMP_CSC
  ,TIPO_PERFIL_CSC AS SAMT_CSC_PERFIL
  ,ESTATUS_PROCESO_EMP_CSC AS CAT_ESTATUS_PROCESO_EMP_CSC
  ,TIPO_ESPECIALIDAD_ESCOLAR_CSC AS TIPO_ESPECIALIDAD_CSC
  ,CAT_PUESTO_CSCEMPLEADO AS TIPO_PUESTO_CSCEMPLEADO
  ,CAT_AREA_CSC AS TIPO_AREA_CSC
  ,TIPO_COMPETENCIA_CSC
  ,TIPO_EMPLEADO_EMPLEADO_CSC AS TIPO_EMPLEADO_CSCEMPLEADO
  ,TIPO_TURNO_CSCTURNO
  ,TIPO_CONTRATO_CSCCONTRATO
  ,CSC_TIPO_GRUPO_EMPLEADO
  ,TIPO_GRADO_ESTUDIO_CSC AS TIPO_ESTUDIO_CSC
  ,TIPO_DOCUMENTO_CSC
  ,CAT_JORNADAS_CSC
  ,TIPO_EMPLEADO_BAJA_CSC AS TIPO_EMPLEADO_CSCBAJA
  ,TIPO_EMPLEADO_CSCMOTIVOBAJA
  ,TIPO_EMPLEADO_CSCGPO
  ,TIPO_EMPLEADO_CSCSGPO
  ,SOLICITUD_TIPO_MEDIO_CSC AS SAMT_TIPO_MEDIO_CSC
  ,SOLICITUD_MEDIO_ENTERO_CUAL AS SAMT_MEDIO_ENTERO_CUAL
  ,SOLICITUD_MEDIO_FERIA_DEL AS SAMT_MEDIO_FERIA_DEL
  ,EMPLEADO_SITE_CSC AS SAMT_TIPO_SITE_CSC
  ,CAT_DEPARTAMENTO_CSC AS EMPLEADO_DEPARTAMENTO_CSC
  ,TIPO_ESTATUS_AUDITORIA_CSC
  ,CAT_CENTRO_COSTOS_CSC AS SAMT_CSC_CENTRO_COSTOS
  ,CLIENTE_CSC
  ,PM_CSC_PROYECTO
  ,CAM_CSC_SERVICIO
  ,CAT_EMP_TREE_BAJA_CSC AS EMP_TREE_BAJA_CSC
  ,EMPLEADO_CVEEMPLEADO
  ,EMPLEADO_APATERNOEMPLEADO
  ,EMPLEADO_AMATERNOEMPLEADO
  ,EMPLEADO_NOMBREEMPLEADO
  ,EMPLEADO_NOMBREEMPLEADO_SEGUNDO
  ,EMPLEADO_RFC
  ,EMPLEADO_CURP
  ,EMPLEADO_IMSS
  ,TIPO_SEXO_CSC
  ,EMPLEADO_FECHA_NACIMIENTO
  ,EMPLEADO_DIRECCION_CALLE AS EMPLEADO_CALLENUMEMPLEADO
  ,EMPLEADO_TELEFONO1
  ,EMPLEADO_TELEFONO2
  ,EMPLEADO_EXTENSION
  ,EMPLEADO_CELULAR
  ,EMPLEADO_FAXEMPLEADO
  ,SOLICITUD_EMPLEADO_EMAIL_PERSONAL AS EMPLEADO_EMAILEMPLEADO
  ,EMPLEADO_EMAILLABORAL
  ,EMPLEADO_CONTACTO
  ,EMPLEADO_LUGAR_TRABAJO
  ,EMPLEADO_FECH_INGRESOEMP AS EMPLEADO_FECHINGRESOEMP
  ,EMPLEADO_FECH_REINGRESO AS EMPLEADO_FECHREINGRESO
  ,EMPLEADO_FEC_INICIAOPERACION
  ,EMPLEADO_FECH_BAJAEMPLEADO AS EMPLEADO_FECBAJAEMPLEADO
  ,EMPLEADO_FECH_FIRMACONTRATO AS EMPLEADO_FECFIRMACONTRATO
  ,EMPLEADO_FECH_CAPACITACION AS EMPLEADO_FECCAPACITACION
  ,EMPLEADO_FECH_INICIAOPERACION AS EMPLEADO_FECINICIAOPERACION
  ,EMPLEADO_COMENTARIOS
  ,EMPLEADO_CVEESTATUS
  ,EMPLEADO_DIRECCION_PAIS_CSCPAIS AS PAI_CSCPAIS
  ,EMPLEADO_DIRECCION_EDO_CSCESTADO AS EDO_CSCESTADO
  ,EMPLEADO_DIRECCION_MUNICIPIO AS INM_MUNICIPIO
  ,EMPLEADO_DIRECCION_COLONIA AS INM_COLONIA
  ,EMPLEADO_DIRECCION_CODIGOPOSTAL AS INM_CODIGOPOSTAL
  ,EMPLEADO_DIA_LUNES
  ,EMP_ENTRADA_LUNES
  ,EMP_SALIDA_LUNES
  ,EMP_COMIDA_INICIA_LUNES
  ,EMP_COMIDA_SALIDA_LUNES
  ,EMPLEADO_DIA_MARTES
  ,EMP_ENTRADA_MARTES
  ,EMP_SALIDA_MARTES
  ,EMP_COMIDA_INICIA_MARTES
  ,EMP_COMIDA_SALIDA_MARTES
  ,EMPLEADO_DIA_MIERCOLES
  ,EMP_ENTRADA_MIERCOLES
  ,EMP_SALIDA_MIERCOLES
  ,EMP_COMIDA_INICIA_MIERCOLES
  ,EMP_COMIDA_SALIDA_MIERCOLES
  ,EMPLEADO_DIA_JUEVES
  ,EMP_ENTRADA_JUEVES
  ,EMP_SALIDA_JUEVES
  ,EMP_COMIDA_INICIA_JUEVES
  ,EMP_COMIDA_SALIDA_JUEVES
  ,EMPLEADO_DIA_VIERNES
  ,EMP_ENTRADA_VIERNES
  ,EMP_SALIDA_VIERNES
  ,EMP_COMIDA_INICIA_VIERNES
  ,EMP_COMIDA_SALIDA_VIERNES
  ,EMPLEADO_DIA_SABADO
  ,EMP_ENTRADA_SABADO
  ,EMP_SALIDA_SABADO
  ,EMP_COMIDA_INICIA_SABADO
  ,EMP_COMIDA_SALIDA_SABADO
  ,EMPLEADO_DIA_DOMINGO
  ,EMP_ENTRADA_DOMINGO
  ,EMP_SALIDA_DOMINGO
  ,EMP_COMIDA_INICIA_DOMINGO
  ,EMP_COMIDA_SALIDA_DOMINGO
  ,EMPLEADO_DIA_DISP_LUNES
  ,EMP_ENTRADA_DISP_LUNES
  ,EMP_SALIDA_DISP_LUNES
  ,EMPLEADO_DIA_DISP_MARTES
  ,EMP_ENTRADA_DISP_MARTES
  ,EMP_SALIDA_DISP_MARTES
  ,EMPLEADO_DIA_DISP_MIERCOLES
  ,EMP_ENTRADA_DISP_MIERCOLES
  ,EMP_SALIDA_DISP_MIERCOLES
  ,EMPLEADO_DIA_DISP_JUEVES
  ,EMP_ENTRADA_DISP_JUEVES
  ,EMP_SALIDA_DISP_JUEVES
  ,EMPLEADO_DIA_DISP_VIERNES
  ,EMP_ENTRADA_DISP_VIERNES
  ,EMP_SALIDA_DISP_VIERNES
  ,EMPLEADO_DIA_DISP_SABADO
  ,EMP_ENTRADA_DISP_SABADO
  ,EMP_SALIDA_DISP_SABADO
  ,EMPLEADO_DIA_DISP_DOMINGO
  ,EMP_ENTRADA_DISP_DOMINGO
  ,EMP_SALIDA_DISP_DOMINGO
  ,EMP_MINUTOS_TOLERANCIA
  ,EMP_MINUTOS_AUXILIARES
  ,EMPLEADO_HORAS_X_JORNADA
  ,REQ_CSCREQUISICION
  ,EMPLEADO_UNIQUE_ID AS EMP_UNIQUE_ID
  ,EMPLEADO_LAT AS EMP_LAT
  ,EMPLEADO_LONG AS EMP_LONG
  ,TIPO_FRECUENCIA_CSC
  ,EMPLEADO_PUESTO_SOLICITA
  ,SOLITIUD_SUELDO_DESEADO AS EMPLEADO_SUELDO_DESEADO
  ,SOLICITUD_DISPONIBILIDAD AS EMPLEADO_DISPONIBILIDAD
  ,EMPLEADO_DISPONIBILIDAD_HORARIO_INICIAL
  ,EMPLEADO_DISPONIBILIDAD_HORARIO_FINAL
  ,EMPLEADO_ESTADO_CIVIL_CSC AS EMPLEADO__ESTADO_CIVIL_CSC
  ,SOLICITUD_LABORO_ANTERIORMENTE
  ,SOLICITUD_LABORO_CUAL
  ,SOLICITUD_LABORO_FAMILIAR
  ,SOLICITUD_LABORO_AREA
  ,SOLICITUD_SINDICALIZADO
  ,SOLICITUD_SINDICALIZADO_CUAL
  ,SOLICITUD_REFERENCIA_EMERGENCIA
  ,TIPO_EMPLEADO_REFERENCIA_EMERGENCIA_CSC
  ,SOLICITUD_REFERENCIA_TELEFONO
  ,SOLICITUD_ENFERMEDAD_CRONICA
  ,SOLICITUD_ENFERMEDAD_CRONICA_CUAL
  ,SOLICITUD_CIRUGIA
  ,SOLICITUD_CIRUGIA_CUAL
  ,SOLICITUD_HEPATITIS
  ,SOLICITUD_HEPATITIS_CUAL
  ,SOLICITUD_DONADOR
  ,SOLICITUD_DONADOR_FECHA
  ,SOLICITUD_MEDICAMENTO
  ,SOLICITUD_MEDICAMENTO_CUAL
  ,SOLICITUD_ALERGIAS
  ,SOLICITUD_ALERGIAS_CUAL
  ,SOLICITUD_HIJOS
  ,SOLICITUD_DISTANCIA_TRABAJO
  ,SOLICITUD_NOMBRE_CONOCIDO
  ,SOLICITUD_NOMBRE_CAMPA
  ,SOLICITUD_REFERIDO
  ,SOLICITUD_REFERIDO_NOMBRE
  ,SOLICITUD_REFERIDO_CAMPA
  ,SOLICITUD_TURNO
  ,SOLICITUD_FECHA_CERTIFICACION
  ,SOLICITUD_ID_ENTREVISTADOR
  ,SOLICITUD_EMBARAZADA
  ,SOLICITUD_PUESTO_SOLICITA
  ,SOLICITUD_CAMPANIA_SOLICITA
  ,SOLICITUD_TELEFONO_OFICINA
  ,SOLICIUTD_OFICINA_EXT
  ,TIPO_FUNCION_CSC
  ,EMPLEADO_CAPACITADOR
  ,EMPLEADO_ACEPTA_AVISO
  ,EMPLEADO_PEI
  ,EMPLEADO_CURSO
  ,EMPLEADO_SKILL1
  ,EMPLEADO_SKILL2
  ,EMPLEADO_SKILL3
  ,EMPLEADO_DOC_APROBADO
  ,EMPLEADO_DOC_COMENT
  ,EMPLEADO_FIN_CAPA AS EMP_FIN_CAPA
  ,EMPLEADO_VALIDA_INT AS EMP_VALIDA_INT
  ,EMPLEADO_VALIDA_EXT AS EMP_VALIDA_EXT
  ,EMPLEADO_PROMOSION
  ,EMPLEADO_FECHA_PROMO
  ,SOLICITUD_MULTICAMPANIA AS EMPLEADO_MULTICAMPANIA
  ,TIPO_ACTIVIDAD_EMPLEADO_CSC AS TIPO_ACTIVIDAD_CSCEMPLEADO
  ,SOLICITUD_INGRESAR_ESTUDIAR AS EMPLEADO_INGRESAR_ESTUDIAR
  ,SOLICITUD_ESTUDIO_TURNO AS EMPLEADO_ESTUDIO_TURNO
  ,EMPLEADO_FECHA_INGRESO_GRUPO
  ,EMPLEADO_FECHA_ULTIMO_MOV
  ,EMPLEADO_DISCAPACITADO
  ,TIPO_ORIENTACION_SEXUAL_CSC
  ,TIPO_CALCULO_NOMINA_CSC
  ,TIPO_EMPRESA_CSC
  ,fDepartamento
  ,fSueldo
  ,fTabuladorVacacional
  ,fOtro1
  ,fOtro3
  ,fMensaje
  ,EMPLEADO_DEPARTAMENTO_BCONN_CSC
  ,EMPLEADO_FORMA_PAGO_CSC
  ,EMPLEADO_ZOPE_CSC
  ,EMPLEADO_BANCO_CSC
  ,EMPLEADO_CUENTA
  ,EMPLEADO_SPEI
  ,EMPLEADO_RES_PATRONAL AS RES_PATRONAL
  ,SAMT_TIPO_SITE_PAGO_CSC
  ,EMPLEADO_ZONA_SALARIAL
  ,EMPLEADO_PENSION_ALIM
  ,EMPLEADO_MOVIMIENTO
  ,EMPLEADO_MOTIVO_MODIF_SDI
  ,EMP_CAUSA_PATRON_CSC
  ,EMPLEADO_OTRAS_CAUSAS
  ,EMPLEADO_PLAZA
  ,EMP_ESTATUS_PLAZA_CSC
  ,EMPLEADO_NIVEL_TABULADOR
  ,EMPLEADO_NOM_CLASIFICACION
  ,EMP_PRESTACIONES_CSC
  ,EMPLEADO_JEFE_PLAZA
  ,EMPLEADO_NUM_CREDITO
  ,EMP_TIPO_CREDITO_CSC
  ,EMPLEADO_FECHA_INI_DESCINF
  ,EMPLEADO_REGIMEN
  ,EMPLEADO_GRUPO
  ,EMPLEADO_PIN
  ,EMPLEADO_LUGAR_NACIMIENTO
  ,EMPLEADO_ENROLADO_BIOMETRICO
  ,EMPLEADO_CSC_EMPLEADO_ENROLADOR
  ,EMPLEADO_HUELLA_FECHA_ALTA
  ,EMPLEADO_HUELLA_FECHA_MODIFICA
  ,EMPRESA_LABORAL_CSC
  ,TIPO_DEPTO_BC_CSC
  ,EMPLEADO_HORARIO_LABORAL
  ,EMPLEADO_HORARIO_CAPACITACION
  ,TIPO_EMPRESA_RECLUTA_CSC
  ,SOLICITUD_INFONAVIT AS EMPLEADO_INFONAVIT
  ,SOLICITUD_CUENTA_INFONAVIT AS EMPLEADO_CUENTA_INFONAVIT
  ,SOLICITUD_MONTO_INFONAVIT AS EMPLEADO_MONTO_INFONAVIT
  ,SOLICITUD_FONACOT AS EMPLEADO_FONACOT
  ,SOLICIUTD_CUENTA_FONACOT AS EMPLEADO_CUENTA_FONACOT
  ,SOLICITUD_MONTO_FONACOT AS EMPLEADO_MONTO_FONACOT
  ,EMPLEADO_LABORA_FAMILIAR
  ,SOLICITUD_NOMBRE_REFERIDO AS EMPLEADO_NOMBRE_REFERIDO
  ,EMPLEADO_OBSERVACIONES
  ,EMPLEADO_AVISO_DATOS
  ,SOLICITUD_RECOMENDADO_NOMBRE AS EMPLEADO_RECOMENDADO_NOMBRE
  ,SOLICITUD_RECOMENDADO_TELEFONO AS EMPLEADO_RECOMENDADO_TELEFONO
  ,SOLICITUD_RECOMENDADO_MAIL AS EMPLEADO_RECOMENDADO_MAIL
  ,EMPLEADO_ENTREVISTADOR_CSC
  ,EMPLEADO_RECLUTADOR_CSC
  ,EMPLEADO_TIMPO_CONTRATO
  ,AUDITORIA_USU_ALTA
  ,AUDITORIA_USU_ULT_MOD
  ,AUDITORIA_FEC_ALTA
  ,AUDITORIA_FEC_ULT_MOD FROM SAMT_EMPLEADOS WHERE EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." 
  AND CAT_PROCESO_EMP_CSC IN (".$obj->CAT_PROCESO_EMP_CSC.")
  ".$CondicionEspecial."
  AND EMPLEADO_CVEESTATUS= 1
  AND CAT_PROVEEDOR_CSC IN(20,15,16,17,24,21,7,28,18)
  AND TIPO_EMPLEADO_EMPLEADO_CSC IN(10,4,3)
  ;");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}



public function GetHeadCountEmpleados($obj){
  $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  
  $CondicionEspecial = "";
if ( isset( $obj->FILTRO ) ) {
  if ($obj->FILTRO == 'Cliente') {
    $CondicionEspecial = " AND [CLIENTE_CSC] IN (".$obj->CLIENTE_CSC.") ";
  } else if($obj->FILTRO == 'ClienteCampania') {
    $CondicionEspecial = " AND [CLIENTE_CSC] IN (".$obj->CLIENTE_CSC.") AND PM_CSC_PROYECTO IN (".$obj->PM_CSC_PROYECTO.") ";
  }   
} else {
  $CondicionEspecial = " AND [CLIENTE_CSC] IN (".$obj->CLIENTE_CSC.") AND PM_CSC_PROYECTO IN (".$obj->PM_CSC_PROYECTO.") AND CAM_CSC_SERVICIO IN (".$obj->CAM_CSC_SERVICIO.") ";
}

  
  
  $query = $connecta->query("
  SELECT EMPLEADO.EMP_CSC_EMPRESA_HOST
  ,EMPLEADO.EMPLEADO_CSC_EMPLEADO
  ,EMPLEADO.EMPLEADO_CSC_EMPLEADO_PADRE
  ,EMPLEADO.EMPLEADO_ID_EXTERNO
  ,EMPLEADO.CAT_PROVEEDOR_CSC AS CAT_PROVEEDOR_INFRA_CSC
  ,EMPLEADO.CAT_PROCESO_EMP_CSC
  ,EMPLEADO.CAT_SUBPROCESO_EMP_CSC
  ,EMPLEADO.TIPO_PERFIL_CSC AS SAMT_CSC_PERFIL
  ,EMPLEADO.ESTATUS_PROCESO_EMP_CSC AS CAT_ESTATUS_PROCESO_EMP_CSC
  ,EMPLEADO.TIPO_ESPECIALIDAD_ESCOLAR_CSC AS TIPO_ESPECIALIDAD_CSC
  ,EMPLEADO.CAT_PUESTO_CSCEMPLEADO AS TIPO_PUESTO_CSCEMPLEADO
  ,EMPLEADO.CAT_AREA_CSC AS TIPO_AREA_CSC
  ,EMPLEADO.TIPO_COMPETENCIA_CSC
  ,EMPLEADO.TIPO_EMPLEADO_EMPLEADO_CSC AS TIPO_EMPLEADO_CSCEMPLEADO
  ,EMPLEADO.TIPO_TURNO_CSCTURNO
  ,EMPLEADO.TIPO_CONTRATO_CSCCONTRATO
  ,EMPLEADO.CSC_TIPO_GRUPO_EMPLEADO
  ,EMPLEADO.TIPO_GRADO_ESTUDIO_CSC AS TIPO_ESTUDIO_CSC
  ,EMPLEADO.TIPO_DOCUMENTO_CSC
  ,EMPLEADO.CAT_JORNADAS_CSC
  ,EMPLEADO.TIPO_EMPLEADO_BAJA_CSC AS TIPO_EMPLEADO_CSCBAJA
  ,EMPLEADO.TIPO_EMPLEADO_CSCMOTIVOBAJA
  ,EMPLEADO.TIPO_EMPLEADO_CSCGPO
  ,EMPLEADO.TIPO_EMPLEADO_CSCSGPO
  ,EMPLEADO.SOLICITUD_TIPO_MEDIO_CSC AS SAMT_TIPO_MEDIO_CSC
  ,EMPLEADO.SOLICITUD_MEDIO_ENTERO_CUAL AS SAMT_MEDIO_ENTERO_CUAL
  ,EMPLEADO.SOLICITUD_MEDIO_FERIA_DEL AS SAMT_MEDIO_FERIA_DEL
  ,EMPLEADO.EMPLEADO_SITE_CSC AS SAMT_TIPO_SITE_CSC
  ,EMPLEADO.CAT_DEPARTAMENTO_CSC AS EMPLEADO_DEPARTAMENTO_CSC
  ,EMPLEADO.TIPO_ESTATUS_AUDITORIA_CSC
  ,EMPLEADO.CAT_CENTRO_COSTOS_CSC AS SAMT_CSC_CENTRO_COSTOS
  ,EMPLEADO.CLIENTE_CSC
  ,EMPLEADO.PM_CSC_PROYECTO
  ,EMPLEADO.CAM_CSC_SERVICIO
  ,EMPLEADO.CAT_EMP_TREE_BAJA_CSC AS EMP_TREE_BAJA_CSC
  ,EMPLEADO.EMPLEADO_CVEEMPLEADO
  ,EMPLEADO.EMPLEADO_APATERNOEMPLEADO
  ,EMPLEADO.EMPLEADO_AMATERNOEMPLEADO
  ,EMPLEADO.EMPLEADO_NOMBREEMPLEADO
  ,EMPLEADO.EMPLEADO_NOMBREEMPLEADO_SEGUNDO
  ,ISNULL(CONCAT (EMPLEADO.EMPLEADO_NOMBREEMPLEADO, ' ' ,EMPLEADO.EMPLEADO_APATERNOEMPLEADO, ' ',EMPLEADO.EMPLEADO_AMATERNOEMPLEADO),'') as NOMBRE_EMPLEADO
  ,EMPLEADO.EMPLEADO_RFC
  ,EMPLEADO.EMPLEADO_CURP
  ,EMPLEADO.EMPLEADO_IMSS
  ,EMPLEADO.TIPO_SEXO_CSC
  ,EMPLEADO.EMPLEADO_FECHA_NACIMIENTO
  ,EMPLEADO.EMPLEADO_DIRECCION_CALLE AS EMPLEADO_CALLENUMEMPLEADO
  ,EMPLEADO.EMPLEADO_TELEFONO1
  ,EMPLEADO.EMPLEADO_TELEFONO2
  ,EMPLEADO.EMPLEADO_EXTENSION
  ,EMPLEADO.EMPLEADO_CELULAR
  ,EMPLEADO.EMPLEADO_FAXEMPLEADO
  ,EMPLEADO.SOLICITUD_EMPLEADO_EMAIL_PERSONAL AS EMPLEADO_EMAILEMPLEADO
  ,EMPLEADO.EMPLEADO_EMAILLABORAL
  ,EMPLEADO.EMPLEADO_CONTACTO
  ,EMPLEADO.EMPLEADO_LUGAR_TRABAJO
  ,EMPLEADO.EMPLEADO_FECH_INGRESOEMP AS EMPLEADO_FECHINGRESOEMP
  ,EMPLEADO.EMPLEADO_FECH_REINGRESO AS EMPLEADO_FECHREINGRESO
  ,EMPLEADO.EMPLEADO_FEC_INICIAOPERACION
  ,EMPLEADO.EMPLEADO_FECH_BAJAEMPLEADO AS EMPLEADO_FECBAJAEMPLEADO
  ,EMPLEADO.EMPLEADO_FECH_FIRMACONTRATO AS EMPLEADO_FECFIRMACONTRATO
  ,EMPLEADO.EMPLEADO_FECH_CAPACITACION AS EMPLEADO_FECCAPACITACION
  ,EMPLEADO.EMPLEADO_FECH_INICIAOPERACION AS EMPLEADO_FECINICIAOPERACION
  ,EMPLEADO.EMPLEADO_COMENTARIOS
  ,EMPLEADO.EMPLEADO_CVEESTATUS
  ,EMPLEADO.EMPLEADO_DIRECCION_PAIS_CSCPAIS AS PAI_CSCPAIS
  ,EMPLEADO.EMPLEADO_DIRECCION_EDO_CSCESTADO AS EDO_CSCESTADO
  ,EMPLEADO.EMPLEADO_DIRECCION_MUNICIPIO AS INM_MUNICIPIO
  ,EMPLEADO.EMPLEADO_DIRECCION_COLONIA AS INM_COLONIA
  ,EMPLEADO.EMPLEADO_DIRECCION_CODIGOPOSTAL AS INM_CODIGOPOSTAL
  ,EMPLEADO.EMPLEADO_DIA_LUNES
  ,EMPLEADO.EMP_ENTRADA_LUNES
  ,EMPLEADO.EMP_SALIDA_LUNES
  ,EMPLEADO.EMP_COMIDA_INICIA_LUNES
  ,EMPLEADO.EMP_COMIDA_SALIDA_LUNES
  ,EMPLEADO.EMPLEADO_DIA_MARTES
  ,EMPLEADO.EMP_ENTRADA_MARTES
  ,EMPLEADO.EMP_SALIDA_MARTES
  ,EMPLEADO.EMP_COMIDA_INICIA_MARTES
  ,EMPLEADO.EMP_COMIDA_SALIDA_MARTES
  ,EMPLEADO.EMPLEADO_DIA_MIERCOLES
  ,EMPLEADO.EMP_ENTRADA_MIERCOLES
  ,EMPLEADO.EMP_SALIDA_MIERCOLES
  ,EMPLEADO.EMP_COMIDA_INICIA_MIERCOLES
  ,EMPLEADO.EMP_COMIDA_SALIDA_MIERCOLES
  ,EMPLEADO.EMPLEADO_DIA_JUEVES
  ,EMPLEADO.EMP_ENTRADA_JUEVES
  ,EMPLEADO.EMP_SALIDA_JUEVES
  ,EMPLEADO.EMP_COMIDA_INICIA_JUEVES
  ,EMPLEADO.EMP_COMIDA_SALIDA_JUEVES
  ,EMPLEADO.EMPLEADO_DIA_VIERNES
  ,EMPLEADO.EMP_ENTRADA_VIERNES
  ,EMPLEADO.EMP_SALIDA_VIERNES
  ,EMPLEADO.EMP_COMIDA_INICIA_VIERNES
  ,EMPLEADO.EMP_COMIDA_SALIDA_VIERNES
  ,EMPLEADO.EMPLEADO_DIA_SABADO
  ,EMPLEADO.EMP_ENTRADA_SABADO
  ,EMPLEADO.EMP_SALIDA_SABADO
  ,EMPLEADO.EMP_COMIDA_INICIA_SABADO
  ,EMPLEADO.EMP_COMIDA_SALIDA_SABADO
  ,EMPLEADO.EMPLEADO_DIA_DOMINGO
  ,EMPLEADO.EMP_ENTRADA_DOMINGO
  ,EMPLEADO.EMP_SALIDA_DOMINGO
  ,EMPLEADO.EMP_COMIDA_INICIA_DOMINGO
  ,EMPLEADO.EMP_COMIDA_SALIDA_DOMINGO
  ,EMPLEADO.EMPLEADO_DIA_DISP_LUNES
  ,EMPLEADO.EMP_ENTRADA_DISP_LUNES
  ,EMPLEADO.EMP_SALIDA_DISP_LUNES
  ,EMPLEADO.EMPLEADO_DIA_DISP_MARTES
  ,EMPLEADO.EMP_ENTRADA_DISP_MARTES
  ,EMPLEADO.EMP_SALIDA_DISP_MARTES
  ,EMPLEADO.EMPLEADO_DIA_DISP_MIERCOLES
  ,EMPLEADO.EMP_ENTRADA_DISP_MIERCOLES
  ,EMPLEADO.EMP_SALIDA_DISP_MIERCOLES
  ,EMPLEADO.EMPLEADO_DIA_DISP_JUEVES
  ,EMPLEADO.EMP_ENTRADA_DISP_JUEVES
  ,EMPLEADO.EMP_SALIDA_DISP_JUEVES
  ,EMPLEADO.EMPLEADO_DIA_DISP_VIERNES
  ,EMPLEADO.EMP_ENTRADA_DISP_VIERNES
  ,EMPLEADO.EMP_SALIDA_DISP_VIERNES
  ,EMPLEADO.EMPLEADO_DIA_DISP_SABADO
  ,EMPLEADO.EMP_ENTRADA_DISP_SABADO
  ,EMPLEADO.EMP_SALIDA_DISP_SABADO
  ,EMPLEADO.EMPLEADO_DIA_DISP_DOMINGO
  ,EMPLEADO.EMP_ENTRADA_DISP_DOMINGO
  ,EMPLEADO.EMP_SALIDA_DISP_DOMINGO
  ,EMPLEADO.EMP_MINUTOS_TOLERANCIA
  ,EMPLEADO.EMP_MINUTOS_AUXILIARES
  ,EMPLEADO.EMPLEADO_HORAS_X_JORNADA
  ,EMPLEADO.REQ_CSCREQUISICION
  ,EMPLEADO.EMPLEADO_UNIQUE_ID AS EMP_UNIQUE_ID
  ,EMPLEADO.EMPLEADO_LAT AS EMP_LAT
  ,EMPLEADO.EMPLEADO_LONG AS EMP_LONG
  ,EMPLEADO.TIPO_FRECUENCIA_CSC
  ,EMPLEADO.EMPLEADO_PUESTO_SOLICITA
  ,EMPLEADO.SOLITIUD_SUELDO_DESEADO AS EMPLEADO_SUELDO_DESEADO
  ,EMPLEADO.SOLICITUD_DISPONIBILIDAD AS EMPLEADO_DISPONIBILIDAD
  ,EMPLEADO.EMPLEADO_DISPONIBILIDAD_HORARIO_INICIAL
  ,EMPLEADO.EMPLEADO_DISPONIBILIDAD_HORARIO_FINAL
  ,EMPLEADO.EMPLEADO_ESTADO_CIVIL_CSC AS EMPLEADO__ESTADO_CIVIL_CSC
  ,EMPLEADO.SOLICITUD_LABORO_ANTERIORMENTE
  ,EMPLEADO.SOLICITUD_LABORO_CUAL
  ,EMPLEADO.SOLICITUD_LABORO_FAMILIAR
  ,EMPLEADO.SOLICITUD_LABORO_AREA
  ,EMPLEADO.SOLICITUD_SINDICALIZADO
  ,EMPLEADO.SOLICITUD_SINDICALIZADO_CUAL
  ,EMPLEADO.SOLICITUD_REFERENCIA_EMERGENCIA
  ,EMPLEADO.TIPO_EMPLEADO_REFERENCIA_EMERGENCIA_CSC
  ,EMPLEADO.SOLICITUD_REFERENCIA_TELEFONO
  ,EMPLEADO.SOLICITUD_ENFERMEDAD_CRONICA
  ,EMPLEADO.SOLICITUD_ENFERMEDAD_CRONICA_CUAL
  ,EMPLEADO.SOLICITUD_CIRUGIA
  ,EMPLEADO.SOLICITUD_CIRUGIA_CUAL
  ,EMPLEADO.SOLICITUD_HEPATITIS
  ,EMPLEADO.SOLICITUD_HEPATITIS_CUAL
  ,EMPLEADO.SOLICITUD_DONADOR
  ,EMPLEADO.SOLICITUD_DONADOR_FECHA
  ,EMPLEADO.SOLICITUD_MEDICAMENTO
  ,EMPLEADO.SOLICITUD_MEDICAMENTO_CUAL
  ,EMPLEADO.SOLICITUD_ALERGIAS
  ,EMPLEADO.SOLICITUD_ALERGIAS_CUAL
  ,EMPLEADO.SOLICITUD_HIJOS
  ,EMPLEADO.SOLICITUD_DISTANCIA_TRABAJO
  ,EMPLEADO.SOLICITUD_NOMBRE_CONOCIDO
  ,EMPLEADO.SOLICITUD_NOMBRE_CAMPA
  ,EMPLEADO.SOLICITUD_REFERIDO
  ,EMPLEADO.SOLICITUD_REFERIDO_NOMBRE
  ,EMPLEADO.SOLICITUD_REFERIDO_CAMPA
  ,EMPLEADO.SOLICITUD_TURNO
  ,EMPLEADO.SOLICITUD_FECHA_CERTIFICACION
  ,EMPLEADO.SOLICITUD_ID_ENTREVISTADOR
  ,EMPLEADO.SOLICITUD_EMBARAZADA
  ,EMPLEADO.SOLICITUD_PUESTO_SOLICITA
  ,EMPLEADO.SOLICITUD_CAMPANIA_SOLICITA
  ,EMPLEADO.SOLICITUD_TELEFONO_OFICINA
  ,EMPLEADO.SOLICIUTD_OFICINA_EXT
  ,EMPLEADO.TIPO_FUNCION_CSC
  ,EMPLEADO.EMPLEADO_CAPACITADOR
  ,EMPLEADO.EMPLEADO_ACEPTA_AVISO
  ,EMPLEADO.EMPLEADO_PEI
  ,EMPLEADO.EMPLEADO_CURSO
  ,EMPLEADO.EMPLEADO_SKILL1
  ,EMPLEADO.EMPLEADO_SKILL2
  ,EMPLEADO.EMPLEADO_SKILL3
  ,EMPLEADO.EMPLEADO_DOC_APROBADO
  ,EMPLEADO.EMPLEADO_DOC_COMENT
  ,EMPLEADO.EMPLEADO_FIN_CAPA AS EMP_FIN_CAPA
  ,EMPLEADO.EMPLEADO_VALIDA_INT AS EMP_VALIDA_INT
  ,EMPLEADO.EMPLEADO_VALIDA_EXT AS EMP_VALIDA_EXT
  ,EMPLEADO.EMPLEADO_PROMOSION
  ,EMPLEADO.EMPLEADO_FECHA_PROMO
  ,EMPLEADO.SOLICITUD_MULTICAMPANIA AS EMPLEADO_MULTICAMPANIA
  ,EMPLEADO.TIPO_ACTIVIDAD_EMPLEADO_CSC AS TIPO_ACTIVIDAD_CSCEMPLEADO
  ,EMPLEADO.SOLICITUD_INGRESAR_ESTUDIAR AS EMPLEADO_INGRESAR_ESTUDIAR
  ,EMPLEADO.SOLICITUD_ESTUDIO_TURNO AS EMPLEADO_ESTUDIO_TURNO
  ,EMPLEADO.EMPLEADO_FECHA_INGRESO_GRUPO
  ,EMPLEADO.EMPLEADO_FECHA_ULTIMO_MOV
  ,EMPLEADO.EMPLEADO_DISCAPACITADO
  ,EMPLEADO.TIPO_ORIENTACION_SEXUAL_CSC
  ,EMPLEADO.TIPO_CALCULO_NOMINA_CSC
  ,EMPLEADO.TIPO_EMPRESA_CSC
  ,EMPLEADO.fDepartamento
  ,EMPLEADO.fSueldo
  ,EMPLEADO.fTabuladorVacacional
  ,EMPLEADO.fOtro1
  ,EMPLEADO.fOtro3
  ,EMPLEADO.fMensaje
  ,EMPLEADO.EMPLEADO_DEPARTAMENTO_BCONN_CSC
  ,EMPLEADO.EMPLEADO_FORMA_PAGO_CSC
  ,EMPLEADO.EMPLEADO_ZOPE_CSC
  ,EMPLEADO.EMPLEADO_BANCO_CSC
  ,EMPLEADO.EMPLEADO_CUENTA
  ,EMPLEADO.EMPLEADO_SPEI
  ,EMPLEADO.EMPLEADO_RES_PATRONAL AS RES_PATRONAL
  ,EMPLEADO.SAMT_TIPO_SITE_PAGO_CSC
  ,EMPLEADO.EMPLEADO_ZONA_SALARIAL
  ,EMPLEADO.EMPLEADO_PENSION_ALIM
  ,EMPLEADO.EMPLEADO_MOVIMIENTO
  ,EMPLEADO.EMPLEADO_MOTIVO_MODIF_SDI
  ,EMPLEADO.EMP_CAUSA_PATRON_CSC
  ,EMPLEADO.EMPLEADO_OTRAS_CAUSAS
  ,EMPLEADO.EMPLEADO_PLAZA
  ,EMPLEADO.EMP_ESTATUS_PLAZA_CSC
  ,EMPLEADO.EMPLEADO_NIVEL_TABULADOR
  ,EMPLEADO.EMPLEADO_NOM_CLASIFICACION
  ,EMPLEADO.EMP_PRESTACIONES_CSC
  ,EMPLEADO.EMPLEADO_JEFE_PLAZA
  ,EMPLEADO.EMPLEADO_NUM_CREDITO
  ,EMPLEADO.EMP_TIPO_CREDITO_CSC
  ,EMPLEADO.EMPLEADO_FECHA_INI_DESCINF
  ,EMPLEADO.EMPLEADO_REGIMEN
  ,EMPLEADO.EMPLEADO_GRUPO
  ,EMPLEADO.EMPLEADO_PIN
  ,EMPLEADO.EMPLEADO_LUGAR_NACIMIENTO
  ,EMPLEADO.EMPLEADO_ENROLADO_BIOMETRICO
  ,EMPLEADO.EMPLEADO_CSC_EMPLEADO_ENROLADOR
  ,EMPLEADO.EMPLEADO_HUELLA_FECHA_ALTA
  ,EMPLEADO.EMPLEADO_HUELLA_FECHA_MODIFICA
  ,EMPLEADO.EMPRESA_LABORAL_CSC
  ,EMPLEADO.TIPO_DEPTO_BC_CSC
  ,EMPLEADO.EMPLEADO_HORARIO_LABORAL
  ,EMPLEADO.EMPLEADO_HORARIO_CAPACITACION
  ,EMPLEADO.TIPO_EMPRESA_RECLUTA_CSC
  ,EMPLEADO.SOLICITUD_INFONAVIT AS EMPLEADO_INFONAVIT
  ,EMPLEADO.SOLICITUD_CUENTA_INFONAVIT AS EMPLEADO_CUENTA_INFONAVIT
  ,EMPLEADO.SOLICITUD_MONTO_INFONAVIT AS EMPLEADO_MONTO_INFONAVIT
  ,EMPLEADO.SOLICITUD_FONACOT AS EMPLEADO_FONACOT
  ,EMPLEADO.SOLICIUTD_CUENTA_FONACOT AS EMPLEADO_CUENTA_FONACOT
  ,EMPLEADO.SOLICITUD_MONTO_FONACOT AS EMPLEADO_MONTO_FONACOT
  ,EMPLEADO.EMPLEADO_LABORA_FAMILIAR
  ,EMPLEADO.SOLICITUD_NOMBRE_REFERIDO AS EMPLEADO_NOMBRE_REFERIDO
  ,EMPLEADO.EMPLEADO_OBSERVACIONES
  ,EMPLEADO.EMPLEADO_AVISO_DATOS
  ,EMPLEADO.SOLICITUD_RECOMENDADO_NOMBRE AS EMPLEADO_RECOMENDADO_NOMBRE
  ,EMPLEADO.SOLICITUD_RECOMENDADO_TELEFONO AS EMPLEADO_RECOMENDADO_TELEFONO
  ,EMPLEADO.SOLICITUD_RECOMENDADO_MAIL AS EMPLEADO_RECOMENDADO_MAIL
  ,EMPLEADO.EMPLEADO_ENTREVISTADOR_CSC
  ,EMPLEADO.EMPLEADO_RECLUTADOR_CSC
  ,EMPLEADO.EMPLEADO_TIMPO_CONTRATO
  ,EMPLEADO.AUDITORIA_USU_ALTA
  ,EMPLEADO.AUDITORIA_USU_ULT_MOD
  ,EMPLEADO.AUDITORIA_FEC_ALTA
  ,EMPLEADO.AUDITORIA_FEC_ULT_MOD
  ,CLIENTE.CLIENTE_NOMBRE
  ,CAMPANIA.PM_NOMBRE
  ,SERV.CAM_SERVICIO_NOMBRE
  ,REQUI.REQ_NOMBREAREA
  ,TPOESTUDIO.TIPO_ESTUDIO_IDIOMA1
  ,ESTATUSESTUDIO.TIPO_ESTATUS_ESTUDIO_IDIOMA1
  ,DOCTOESTUDIO.TIPO_DOCUMENTO_IDIOMA1
  ,ESPECIALIDADESTUDIO.TIPO_ESPECIALIDAD_IDIOMA1
  ,PERFIL.SAMT_TIPO_PERFIL_IDIOMA1
  ,EmpCont.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE
  ,Puest.TIPO_PUESTO_IDIOMA1
  ,ESTATS.TIPO_ESTATUS_IDIOMA1
  ,Pr.CAT_PROCESO_EMP_IDIOMA1
  ,RH.RECLUTAMIENTO_PRUEBA_CONOCIM_RESULTADO
  ,Actividad.TIPO_ACTIVIDAD_IDIOMA1
  ,SUPERVISOR.SUPERVISOR
  FROM (
		SELECT EM.*
		FROM SAMT_EMPLEADOS AS EM 
		WHERE EM.EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST."  
		AND [CAT_PROCESO_EMP_CSC] IN (".$obj->CAT_PROCESO_EMP_CSC.")
		AND EM.EMPLEADO_CVEESTATUS= 1
		AND EM.CAT_PROVEEDOR_CSC IN(20,15,16,17,24,21,7,28,18)
    AND EM.TIPO_EMPLEADO_EMPLEADO_CSC IN(10,4,3) 
    ".$CondicionEspecial."
	) EMPLEADO
	LEFT JOIN (
		SELECT CAM_CSC_SERVICIO, CAM_SERVICIO_NOMBRE, TIPIFICA_CSC, PM_CSC_PROYECTO, EMP_CSC_EMPRESA_HOST
		FROM SAMT_CAM_SERVICIO
	) SERV ON SERV.CAM_CSC_SERVICIO = EMPLEADO.CAM_CSC_SERVICIO AND SERV.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT EMP_CSC_EMPRESA_HOST, REQ_CSCREQUISICION, REQ_NOMBREAREA, REQ_LATITUD_DECIMAL, REQ_LONGITUD_DECIMAL 
		FROM SAMT_REQUISICIONES
	) REQUI ON REQUI.REQ_CSCREQUISICION = EMPLEADO.REQ_CSCREQUISICION AND REQUI.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT ESTU.EMPLEADO_CSC_EMPLEADO, ESTU.ESTUDIOS_ULTIMO_GRADO, ESTU.TIPO_ESTUDIO_CSC, ESTU.ESTATUS_ESTUDIO_CSC, ESTU.TIPO_DOCUMENTO_CSC, ESTU.TIPO_ESPECIALIDAD_CSC, ESTU.EMP_CSC_EMPRESA_HOST
		FROM SAMT_EMPLEADO_ESTUDIOS AS ESTU
	) ESTUDIO ON ESTUDIO.EMPLEADO_CSC_EMPLEADO = EMPLEADO.EMPLEADO_CSC_EMPLEADO AND ESTUDIO.ESTUDIOS_ULTIMO_GRADO = 1 AND ESTUDIO.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT STEE.TIPO_ESTUDIO_CSC,STEE.EMP_CSC_EMPRESA_HOST,STEE.TIPO_ESTUDIO_IDIOMA1, STEE.TIPO_ESTUDIO_ACTIVO
		FROM SAMT_TIPO_ESTUDIO_EMPLEADO AS STEE
	) TPOESTUDIO ON TPOESTUDIO.TIPO_ESTUDIO_CSC = ESTUDIO.TIPO_ESTUDIO_CSC AND TPOESTUDIO.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST AND TPOESTUDIO.TIPO_ESTUDIO_ACTIVO = 1
	LEFT JOIN (
		SELECT STEE.ESTATUS_ESTUDIO_CSC,STEE.EMP_CSC_EMPRESA_HOST,STEE.TIPO_ESTATUS_ESTUDIO_IDIOMA1, STEE.TIPO_ESTATUS_ESTUDIO_ACTIVO
		FROM SAMT_TIPO_ESTATUS_ESTUDIO AS STEE
	) ESTATUSESTUDIO ON ESTATUSESTUDIO.ESTATUS_ESTUDIO_CSC = TPOESTUDIO.TIPO_ESTUDIO_CSC AND ESTATUSESTUDIO.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT STEE.TIPO_DOCUMENTO_CSC,STEE.EMP_CSC_EMPRESA_HOST,STEE.TIPO_DOCUMENTO_IDIOMA1, STEE.TIPO_DOCUMENTO_ACTIVO
		FROM SAMT_TIPO_DOCUMENTO_EMPLEADO AS STEE
	) DOCTOESTUDIO ON DOCTOESTUDIO.TIPO_DOCUMENTO_CSC = ESTUDIO.TIPO_DOCUMENTO_CSC AND DOCTOESTUDIO.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT STEE.EMP_CSC_EMPRESA_HOST,STEE.TIPO_ESPECIALIDAD_CSC,STEE.TIPO_ESPECIALIDAD_IDIOMA1, STEE.TIPO_ESPECIALIDAD_ACTIVO
		FROM SAMT_TIPO_EMPLEADO_ESPECIALIDAD_ESCOLAR AS STEE
	) ESPECIALIDADESTUDIO ON ESPECIALIDADESTUDIO.TIPO_ESPECIALIDAD_CSC = ESTUDIO.TIPO_ESPECIALIDAD_CSC AND ESPECIALIDADESTUDIO.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT PROY.EMP_CSC_EMPRESA_HOST,PROY.PM_CSC_PROYECTO,PROY.PM_NOMBRE, PROY.CLIENTE_CSC
		FROM SAMT_PROYECTOS AS PROY
	) CAMPANIA ON CAMPANIA.PM_CSC_PROYECTO = SERV.PM_CSC_PROYECTO AND CAMPANIA.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT CLI.EMP_CSC_EMPRESA_HOST,CLI.CLIENTE_CSC,CLI.CLIENTE_NOMBRE, CLI.TIPO_CLIENTE_CSC
		FROM SAMT_CLIENTES AS CLI
	) CLIENTE ON CLIENTE.CLIENTE_CSC = CAMPANIA.CLIENTE_CSC AND CLIENTE.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT PER.EMP_CSC_EMPRESA_HOST,PER.SAMT_CSC_PERFIL,PER.SAMT_TIPO_PERFIL_IDIOMA1
		FROM SAMT_TIPO_EMPLEADO_PERFIL AS PER
	) PERFIL ON PERFIL.SAMT_CSC_PERFIL = EMPLEADO.TIPO_PERFIL_CSC AND PERFIL.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT EmpCont.EMP_CSC_EMPRESA_HOST, EmpCont.CAT_PROVEEDOR_INFRA_CSC, EmpCont.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE 
		FROM SAMT_CAT_PROVEEDORES_INFRA as EmpCont
	) EmpCont on EmpCont.CAT_PROVEEDOR_INFRA_CSC=EMPLEADO.CAT_PROVEEDOR_CSC AND EmpCont.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT Puest.EMP_CSC_EMPRESA_HOST, Puest.TIPO_PUESTO_CSCEMPLEADO, Puest.TIPO_PUESTO_IDIOMA1
		FROM SAMT_TIPO_PUESTO_EMPLEADO as Puest
	) Puest ON Puest.TIPO_PUESTO_CSCEMPLEADO=EMPLEADO.CAT_PUESTO_CSCEMPLEADO  AND Puest.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT ESTATS.EMP_CSC_EMPRESA_HOST, ESTATS.CSC_TIPO_ESTATUS_GD, ESTATS.TIPO_ESTATUS_IDIOMA1
		FROM SAMT_TIPO_ESTATUS_GD AS ESTATS 
	) ESTATS ON ESTATS.CSC_TIPO_ESTATUS_GD = EMPLEADO.EMPLEADO_DOC_APROBADO AND ESTATS.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT Pr.EMP_CSC_EMPRESA_HOST, Pr.CAT_PROCESO_EMP_CSC, Pr.CAT_PROCESO_EMP_IDIOMA1
		FROM SAMT_CAT_PROCESO_EMPLEADOS AS Pr
	) Pr ON Pr.CAT_PROCESO_EMP_CSC=EMPLEADO.CAT_PROCESO_EMP_CSC AND Pr.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT RH.EMP_CSC_EMPRESA_HOST,RH.RECLUTAMIENTO_PRUEBA_CONOCIM_RESULTADO, RH.EMPLEADO_CSC_EMPLEADO
		FROM SAMT_RH_RECLUTAMIENTO as RH 
	) RH on RH.EMPLEADO_CSC_EMPLEADO=EMPLEADO.EMPLEADO_CSC_EMPLEADO AND RH.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
	LEFT JOIN (
		SELECT Actividad.EMP_CSC_EMPRESA_HOST,Actividad.TIPO_ACTIVIDAD_CSCEMPLEADO, Actividad.TIPO_ACTIVIDAD_IDIOMA1
		FROM SAMT_TIPO_EMPLEADO_ACTIVIDAD as Actividad 
	) Actividad on Actividad.TIPO_ACTIVIDAD_CSCEMPLEADO=EMPLEADO.TIPO_ACTIVIDAD_EMPLEADO_CSC
	LEFT JOIN (
		SELECT EMP_SUPER.EMP_CSC_EMPRESA_HOST, EMP_SUPER.EMPLEADO_CSC_EMPLEADO,ISNULL(CONCAT (EMP_SUPER.EMPLEADO_NOMBREEMPLEADO, ' ' ,EMP_SUPER.EMPLEADO_APATERNOEMPLEADO, ' ',EMP_SUPER.EMPLEADO_AMATERNOEMPLEADO),'') as SUPERVISOR
		FROM SAMT_EMPLEADOS AS EMP_SUPER
	) SUPERVISOR ON SUPERVISOR.EMPLEADO_CSC_EMPLEADO = EMPLEADO.EMPLEADO_CSC_EMPLEADO_PADRE AND SUPERVISOR.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST
	ORDER BY EMPLEADO.EMPLEADO_CSC_EMPLEADO;
  ");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}

public function GetEstudiosEmpleado($obj){
	$connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT [EMP_CSC_EMPRESA_HOST]
  ,[EMPLEADO_CSC_EMPLEADO]
  ,[EMPLEADO_ESTUDIO_CSC]
  ,TIPO_GRADO_ESTUDIO_CSC AS TIPO_ESTUDIO_CSC
  ,[TIPO_DOCUMENTO_CSC]
  ,TIPO_ESPECIALIDAD_ESCOLAR_CSC AS TIPO_ESPECIALIDAD_CSC
  ,[ESTUDIOS_FECH_INI]
  ,[ESTUDIOS_FECHA_CONCLUYE]
  ,[ESTUDIOS_ESCUELA]
  ,[ESTATUS_ESTUDIO_CSC]
  ,[ESTUDIOS_CONCLUIDOS]
  ,[ESTUDIOS_ULTIMO_GRADO]
  ,[ESTUDIOS_CURSANDO]
  ,[ESTUDIOS_DIAS]
  ,[ESTUDIOS_HORARIO_INI]
  ,[ESTUDIOS_HORARIO_FIN]
  ,[ESTUDIOS_COMENTARIOS]
  ,[ESTUDIOS_CALIFICACION]
  ,[ESTUDIOS_CREDITOS]
  ,[ESTUDIOS_NOMBRE_ESPECIALIDAD]
  ,[ESTUDIOS_NOMBRE_DOCUMENTO]
FROM [SAMT_EMPLEADO_ESTUDIOS]
WHERE [EMP_CSC_EMPRESA_HOST] = ".$obj->EMP_CSC_EMPRESA_HOST." AND [EMPLEADO_CSC_EMPLEADO] = ".$obj->EMPLEADO_CSC_EMPLEADO.";");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}


public function GetGDocumentos($obj){
	$connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT GD_ARCH.GD_ARCHIVO_ENSERVIDOR,
  GD_ARCH.[GD_ARCHIVO_UNIQUE] as NOMBRE,
  'images/Icons/4.png' as icon,
  GD_ARCH.GD_ARCHIVO_ACTIVO,
  GD_ARCH.GD_ARCHIVO_COMENTARIOS,
  GD_ARCH.GD_ARCHIVO_NOMBRE,
  GD_ARCH.GD_ARCHIVO_CSC,
  GD_EMP.GD_ESTRUCTURA_PONDERACION,
  GD_EMP.GD_ESTRUCTURA_AVANCE,
  GD_EMP.GD_ESTRUCTURA_CSC AS id, 
  GD_EMP.GD_ESTRUCTURA_PADRE AS parent_id, 
  GD_EMP.GD_ESTRUCTURA_DESCRIPCION AS title, 
  GD_EMP.GD_WEB,
  GD_EMP.CSC_TIPO_ESTATUS_GD,
  STATUSGD.TIPO_ESTATUS_IDIOMA1,
  GD_EMP.EMPLEADO_CSC_EMPLEADO,
  GD_EMP.TIPO_ESTRUCTURA_DOCTO_CSC
  
  FROM SAMT_GD_ESTRUCTURA_WBS_EMPLEADOS AS GD_EMP 
  LEFT JOIN SAMT_GD_ARCHIVOS AS GD_ARCH
  ON GD_ARCH.GD_ESTRUCTURA_CSC = GD_EMP.GD_ESTRUCTURA_CSC AND GD_ARCH.GD_ARCHIVO_ACTIVO=1 AND GD_ARCH.EMP_CSC_EMPRESA_HOST = GD_EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_ESTATUS_GD STATUSGD ON STATUSGD.CSC_TIPO_ESTATUS_GD = GD_EMP.CSC_TIPO_ESTATUS_GD AND STATUSGD.EMP_CSC_EMPRESA_HOST = GD_EMP.EMP_CSC_EMPRESA_HOST
  
  WHERE GD_EMP.EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." AND GD_EMP.GD_WEB=1 AND GD_EMP.EMPLEADO_CSC_EMPLEADO=".$obj->EMPLEADO_CSC_EMPLEADO."  ORDER BY GD_EMP.GD_ESTRUCTURA_WBS ASC;");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}



private function utf8_converter($array)
{
  array_walk_recursive($array, function(&$item, $key){
    if(!mb_detect_encoding($item, 'utf-8', true)){
        $item = utf8_encode($item);
    }
  });
 
  return $array;
}

private function removeElementWithValue($array, $key, $value){
  foreach($array as $subKey => $subArray){
     if($subArray[$key] == $value){
        unset($array[$subKey]);
     }
  }
  return $array;
}

private function ConectaWSDL(){
  $cliente = new nusoap_client('http://201.161.51.106:8082/iWebService/iWsdl.php?wsdl');
  return $cliente;
}

public function MoodleCursosEmpleado($obj){
 $wsdl = $this->ConectaWSDL();
  
  $datosCursoUsuario = array(
    'Datos_In_CurUsu'=> array(
      'prefijo'=>'sat',
      'rfc_usuario'=>$obj->EMPLEADO_RFC,
      'id_curso'=>''
    )
  );
  
  $resultado = $wsdl->call('Usuarios_Curso',$datosCursoUsuario);
  $ArrayConvertido = $this->utf8_converter($resultado);
  
  $dss = $this->removeElementWithValue($ArrayConvertido, 'Calificacion', 0);
  
  return $resultado;
}

function MoodleExamenesEmpleado($obj){
  $wsdl = $this->ConectaWSDL();
  $rfc = $_GET['rfcUsuario'];
  
  $datosExmen = array(
    'Datos_In_CurUsu'=> array(
      'prefijo'=>'sat',
      'rfc_usuario'=>$obj->EMPLEADO_RFC,
      'id_curso'=>''
    )
  );
  $resultado = $wsdl->call('Usuario_Examen',$datosExmen);
  $ArrayConvertido = $this->utf8_converter($resultado);
  return $ArrayConvertido;
}



public function GetGridsEmpleados($obj){
	$connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT DISTINCT ISNULL(EMP.[EMP_CSC_EMPRESA_HOST],'') as EMP_CSC_EMPRESA_HOST
  ,EMP.ESTATUS_PROCESO_EMP_CSC AS CAT_ESTATUS_PROCESO_EMP_CSC
  ,ISNULL(EMP.[EMPLEADO_CSC_EMPLEADO],'') as EMPLEADO_CSC_EMPLEADO
  ,ISNULL(EMP.[CAM_CSC_SERVICIO],'') as CAM_CSC_SERVICIO
  ,ISNULL(SERV.[CAM_SERVICIO_NOMBRE],'') as CAM_SERVICIO_NOMBRE
  ,ISNULL(SERV.[PM_CSC_PROYECTO],'') as PM_CSC_PROYECTO
  ,ISNULL(EMP.[EMPLEADO_CSC_EMPLEADO],'') as EMPLEADO_CSC_EMPLEADO
  ,ISNULL(EMP.EMPLEADO_RFC,'') as EMPLEADO_RFC
  ,ISNULL(EMP.EMPLEADO_CURP,'') as EMPLEADO_CURP
  ,ISNULL(CONCAT (EMP.EMPLEADO_NOMBREEMPLEADO, ' ' ,EMP.EMPLEADO_APATERNOEMPLEADO, ' ',EMP.EMPLEADO_AMATERNOEMPLEADO),'') as Nombre
  ,ISNULL(CONCAT (SUP.EMPLEADO_NOMBREEMPLEADO, ' ' ,SUP.EMPLEADO_APATERNOEMPLEADO, ' ',SUP.EMPLEADO_AMATERNOEMPLEADO),'') as SUPERVISOR
   ,ISNULL(EDIF.REQ_NOMBREAREA,'') as REQ_NOMBREAREA
  ,ISNULL(CONVERT(char(10), EMP.EMPLEADO_FEC_INICIAOPERACION,105),'') as EMPLEADO_FEC_INICIAOPERACION
  ,ISNULL(CONVERT(char(10), EMP.EMPLEADO_FECH_INGRESOEMP,105),'') as EMPLEADO_FECHINGRESOEMP
  ,ISNULL(CONVERT(char(10), EMP.EMPLEADO_FECH_REINGRESO,105),'') as EMPLEADO_FECHREINGRESO
  ,ISNULL(CONVERT(char(10), EMP.SOLICITUD_FECHA_CERTIFICACION,105),'') as SOLICITUD_FECHA_CERTIFICACION
  ,ISNULL(CONVERT(char(10),EMP.EMPLEADO_FECH_CAPACITACION,105),'') as EMPLEADO_FECCAPACITACION
  ,ISNULL(CONVERT(char(10),EMP.EMPLEADO_FIN_CAPA AS EMP_FIN_CAPA,105),'') as EMPLEADO_FIN_CAPA AS EMP_FIN_CAPA 
  ,ISNULL(CONVERT(char(10), EMP.EMPLEADO_FECH_BAJAEMPLEADO,105),'') as EMPLEADO_FECBAJAEMPLEADO
  ,ISNULL(CONVERT(VARCHAR(8),EMP.EMP_ENTRADA_LUNES,108),'') as Hora_Entrada
  ,ISNULL(CONVERT(VARCHAR(8),EMP.EMP_SALIDA_LUNES,108),'') as Hora_Salida
  ,ISNULL(EmpCont.CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE,'') as CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE
  ,ISNULL(EMP.EMPLEADO_SKILL1,'') as EMPLEADO_SKILL1
  ,ISNULL(EMP.EMPLEADO_SKILL2,'') as EMPLEADO_SKILL2
  ,ISNULL(EMP.EMPLEADO_SKILL3,'') as EMPLEADO_SKILL3
  ,ISNULL(Puest.TIPO_PUESTO_IDIOMA1,'') as TIPO_PUESTO_IDIOMA1
  ,ISNULL(Pr.CAT_PROCESO_EMP_IDIOMA1,'') as CAT_PROCESO_EMP_IDIOMA1
  ,ISNULL(ESTU.TIPO_ESTUDIO_IDIOMA1,'') as TIPO_ESTUDIO_IDIOMA1
  ,ISNULL(ESPE.TIPO_ESPECIALIDAD_IDIOMA1,'') as TIPO_ESPECIALIDAD_IDIOMA1
  ,ISNULL(EMP.EMPLEADO_DOC_COMENT,'') as EMPLEADO_DOC_COMENT
  ,ISNULL(ESTATS.TIPO_ESTATUS_IDIOMA1,'') as TIPO_ESTATUS_IDIOMA1
  ,ISNULL(RH.RECLUTAMIENTO_PRUEBA_CONOCIM_RESULTADO,'') as RECLUTAMIENTO_PRUEBA_CONOCIM_RESULTADO
  ,ISNULL(RH.RECLUTAMIENTO_PRUEBA_ORTOGRAFIA_RESULTADO,'') as RECLUTAMIENTO_PRUEBA_ORTOGRAFIA_RESULTADO
  ,ISNULL(docu.TIPO_DOCUMENTO_IDIOMA1,'') as TIPO_DOCUMENTO_IDIOMA1
  ,ISNULL(EMP.EMPLEADO_VALIDA_INT,'') as EMP_VALIDA_INT
  ,ISNULL(EMP.EMPLEADO_VALIDA_EXT ,'') as EMP_VALIDA_EXT
  ,ISNULL(PER.SAMT_TIPO_PERFIL_IDIOMA1,'') as SAMT_TIPO_PERFIL_IDIOMA1
  ,ISNULL(EMP.EMPLEADO_PEI,'') as EMPLEADO_PEI
  ,case EMP.SOLICITUD_MULTICAMPANIA when 1 then 'Si' when 0 then 'No' else '' end as EMPLEADO_MULTICAMPANIA
  ,ISNULL(Actividad.TIPO_ACTIVIDAD_IDIOMA1,'') as TIPO_ACTIVIDAD_CSCEMPLEADO
  ,case EMP.EMPLEADO_PROMOSION when 1 then 'Si' when 0 then 'No' else 'No' end as EMPLEADO_PROMOSION
  ,ISNULL(CONVERT(char(10),EMP.EMPLEADO_FECHA_PROMO,105),'') as EMPLEADO_FECHA_PROMO
  ,ISNULL(estaaa.TIPO_ESTATUS_ESTUDIO_IDIOMA1,'') as TIPO_ESTATUS_ESTUDIO_IDIOMA1
  --,ISNULL(estudio.ESTUDIOS_CREDITOS,'') as ESTUDIOS_CREDITOS
  
  FROM SAMT_CAM_SERVICIO AS SERV
   
   
  INNER JOIN SAMT_PROYECTOS As PROY ON PROY.PM_CSC_PROYECTO = SERV.PM_CSC_PROYECTO And PROY.EMP_CSC_EMPRESA_HOST = SERV.EMP_CSC_EMPRESA_HOST 
  INNER JOIN SAMT_EMPLEADOS AS EMP ON EMP.CAM_CSC_SERVICIO = SERV.CAM_CSC_SERVICIO And EMP.EMP_CSC_EMPRESA_HOST = SERV.EMP_CSC_EMPRESA_HOST 
  LEFT JOIN SAMT_TIPO_SEXO AS SEX ON SEX.TIPO_SEXO_CSC = EMP.TIPO_SEXO_CSC And SEX.EMP_CSC_EMPRESA_HOST = SERV.EMP_CSC_EMPRESA_HOST 
  LEFT JOIN SAMT_TIPO_TURNO_EMPLEADOS AS TURNO ON TURNO.TIPO_TURNO_CSCTURNO = EMP.TIPO_TURNO_CSCTURNO And TURNO.EMP_CSC_EMPRESA_HOST = SERV.EMP_CSC_EMPRESA_HOST 
  LEFT JOIN SAMT_TIPO_EMPLEADO AS TPOEMP ON TPOEMP.TIPO_EMPLEADO_CSCEMPLEADO = EMP.TIPO_EMPLEADO_EMPLEADO_CSC AND TPOEMP.EMP_CSC_EMPRESA_HOST = SERV.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_REQUISICIONES AS EDIF ON EDIF.[REQ_CSCREQUISICION] = [EMP].[REQ_CSCREQUISICION] AND EDIF.[EMP_CSC_EMPRESA_HOST] = SERV.[EMP_CSC_EMPRESA_HOST]
  LEFT JOIN SAMT_TIPO_ESTATUS_GD AS ESTATS ON ESTATS.CSC_TIPO_ESTATUS_GD = EMP.EMPLEADO_DOC_APROBADO AND ESTATS.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  
  LEFT JOIN SAMT_TIPO_EMPLEADO_PERFIL AS PER ON PER.SAMT_CSC_PERFIL=EMP.TIPO_PERFIL_CSC AND PER.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA as EmpCont on EmpCont.CAT_PROVEEDOR_INFRA_CSC=EMP.CAT_PROVEEDOR_CSC AND EmpCont.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_EMPLEADOS AS SUP ON SUP.EMPLEADO_CSC_EMPLEADO=EMP.EMPLEADO_CSC_EMPLEADO_PADRE AND SUP.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO as Puest ON Puest.TIPO_PUESTO_CSCEMPLEADO=EMP.CAT_PUESTO_CSCEMPLEADO  AND Puest.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  
  LEFT JOIN SAMT_CAT_PROCESO_EMPLEADOS AS Pr ON Pr.CAT_PROCESO_EMP_CSC=EMP.CAT_PROCESO_EMP_CSC AND Pr.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_RH_RECLUTAMIENTO as RH on RH.EMPLEADO_CSC_EMPLEADO=EMP.EMPLEADO_CSC_EMPLEADO AND RH.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_EMPLEADO_ACTIVIDAD as Actividad on Actividad.TIPO_ACTIVIDAD_CSCEMPLEADO=EMP.TIPO_ACTIVIDAD_EMPLEADO_CSC
  
  INNER join SAMT_EMPLEADO_ESTUDIOS as estudio on estudio.EMPLEADO_CSC_EMPLEADO=EMP.EMPLEADO_CSC_EMPLEADO AND estudio.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_ESTUDIO_EMPLEADO AS ESTU ON ESTU.TIPO_ESTUDIO_CSC = estudio.TIPO_ESTUDIO_CSC And ESTU.EMP_CSC_EMPRESA_HOST = SERV.EMP_CSC_EMPRESA_HOST 
  LEFT JOIN SAMT_TIPO_ESTATUS_ESTUDIO as estaaa on estaaa.ESTATUS_ESTUDIO_CSC=estudio.ESTATUS_ESTUDIO_CSC AND estaaa.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_DOCUMENTO_EMPLEADO as docu ON docu.TIPO_DOCUMENTO_CSC=estudio.TIPO_DOCUMENTO_CSC AND docu.EMP_CSC_EMPRESA_HOST=EMP.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_EMPLEADO_ESPECIALIDAD_ESCOLAR AS ESPE ON ESPE.TIPO_ESPECIALIDAD_CSC = estudio.TIPO_ESPECIALIDAD_CSC And ESPE.EMP_CSC_EMPRESA_HOST = SERV.EMP_CSC_EMPRESA_HOST 
  
  WHERE EMP.EMPLEADO_CVEESTATUS = 1 
  AND estudio.ESTUDIOS_ULTIMO_GRADO = 1
  AND EMP.ESTATUS_PROCESO_EMP_CSC IN (".$obj->CAT_ESTATUS_PROCESO_EMP_CSC.")
  AND EMP.CAT_PROCESO_EMP_CSC IN (".$obj->CAT_PROCESO_EMP_CSC.")
  AND EMP.EMP_CSC_EMPRESA_HOST = (".$obj->EMP_CSC_EMPRESA_HOST.")
  AND EMP.CAM_CSC_SERVICIO IN (".$obj->CAM_CSC_SERVICIO.")
  And  PROY.PM_CSC_PROYECTO IN (".$obj->PM_CSC_PROYECTO.");");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}
public function Llena_GridArchivo($obj){
  $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT GD_EMP.EMPLEADO_CSC_EMPLEADO,
  GD_ARCH.GD_ARCHIVO_ENSERVIDOR,
  EMPLEADO.EMPLEADO_RFC,
  CONCAT (EMPLEADO.[EMPLEADO_NOMBREEMPLEADO], ' ' ,EMPLEADO.[EMPLEADO_APATERNOEMPLEADO], ' ', EMPLEADO.[EMPLEADO_AMATERNOEMPLEADO] ) AS Nombre,
  GD_EMP.GD_ESTRUCTURA_DESCRIPCION AS title,
  GD_ARCH.GD_ARCHIVO_UNIQUE, 
  GD_EMP.GD_ESTRUCTURA_PADRE AS parent_id, 
  GD_ARCH.GD_ARCHIVO_NOMBRE
  
  FROM SAMT_GD_ESTRUCTURA_WBS_EMPLEADOS AS GD_EMP 
  INNER JOIN SAMT_GD_ARCHIVOS AS GD_ARCH
  ON GD_ARCH.GD_ESTRUCTURA_CSC = GD_EMP.GD_ESTRUCTURA_CSC AND GD_ARCH.GD_ARCHIVO_ACTIVO=1 and GD_ARCHIVO_ENSERVIDOR=1
  INNER JOIN SAMT_EMPLEADOS AS EMPLEADO
  ON EMPLEADO.EMPLEADO_CSC_EMPLEADO = GD_EMP.EMPLEADO_CSC_EMPLEADO
  WHERE GD_EMP.GD_WEB=1 
  AND EMPLEADO.EMPLEADO_CVEESTATUS = 1 
  AND EMPLEADO.CAT_PROCESO_EMP_CSC = 3 
  AND EMPLEADO.EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST."
  AND EMPLEADO.CAM_CSC_SERVICIO IN (".$obj->CAM_CSC_SERVICIO.")
  AND EMPLEADO.PM_CSC_PROYECTO IN (".$obj->PM_CSC_PROYECTO.");");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
  
  
  
  }
  
  
  /***** INSERTA EN BITACORA SE CAMBIA EL PROCESO Y SUBRPOCESO *****/
 public function insertaDoctosWBSServicio($obj){
  /****Conecta a Base de Datos****/
   $connecta = $this->Conecta($obj->EmpresaNombre);

   $querySumado = $connecta->query("SELECT COUNT ([EMP_CSC_EMPRESA_HOST]) AS CONTEO
   FROM [SAMT_GD_ESTRUCTURA_WBS_SERVICIO] WHERE 
   [EMP_CSC_EMPRESA_HOST] = ".$obj->EMP_CSC_EMPRESA_HOST."
   AND [EMPLEADO_CSC_EMPLEADO] = ".$obj->EMPLEADO_CSC_EMPLEADO_SEELCCIONADO."
   AND [CAM_CSC_SERVICIO] = ".$obj->CAM_CSC_SERVICIO."
   AND [GD_ESTRUCTURA_CSC] = '".$obj->GD_ESTRUCTURA_CSC."';");
	
   $ObjReturnSumado = $querySumado->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
   if(empty($ObjReturnSumado)){
     $Datos = array('Estatus'=>'Error','Msj'=>'Datos No Localizados', "JsonDatos"=>null);
   }
   else{
      $ReturnValue = $ObjReturnSumado[0]['CONTEO'];
      if($ReturnValue == 1){

        $Datos = array('Estatus'=>'Info','Msj'=>'Archivo ya Creado', 'id' => $getInsertB);
        
      }else{
        $getInsertB = $connecta->insert(
          "[SAMT_GD_ESTRUCTURA_WBS_SERVICIO]", 
          "[EMP_CSC_EMPRESA_HOST] = ".$obj->EMP_CSC_EMPRESA_HOST.",
          [GD_ESTRUCTURA_CSC] = '".$obj->GD_ESTRUCTURA_CSC."',
          [GD_ESTRUCTURA_PADRE] = '".$obj->GD_ESTRUCTURA_PADRE."',
          [CLIENTE_CSC] = ".$obj->CLIENTE_CSC.",
          [PM_CSC_PROYECTO] = ".$obj->PM_CSC_PROYECTO.",
          [CAM_CSC_SERVICIO] = ".$obj->CAM_CSC_SERVICIO.",
          [EMPLEADO_CSC_EMPLEADO] = ".$obj->EMPLEADO_CSC_EMPLEADO_SEELCCIONADO.",
          [CSC_TIPO_ESTATUS_GD] = ".$obj->CSC_TIPO_ESTATUS_GD.",
          [GD_ESTRUCTURA_DESCRIPCION] = '".$obj->GD_ESTRUCTURA_DESCRIPCION."',
          [AUDITORIA_USU_ALTA] = ".$obj->EMPLEADO_CSC_EMPLEADO.",
          [AUDITORIA_USU_ULT_MOD] = ".$obj->EMPLEADO_CSC_EMPLEADO.",
          [AUDITORIA_FEC_ALTA] = GETDATE(),
          [AUDITORIA_FEC_ULT_MOD] = GETDATE()");

        if($connecta->getError() != ""){
          $Datos = array('Estatus'=>'Error','Msj'=>' Incorrecta', 'error' => $connecta->getError());
        }
        else{
         $Datos = array('Estatus'=>'Exito','Msj'=>'Agregado Correctamente', 'id' => $getInsertB);
        }
      }
   }
   
   
 
    /****Desconecta a Base de Datos****/
    $connecta->disconnect();
    /****End Desconecta a Base de Datos****/
    return $Datos;
 
 }

 public function Llena_GridArchivo_Validacion($obj){
  $connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $TpoBusqueda = '';
  if($obj->TpoBusqueda == 'SERVICIO' ){
    $TpoBusqueda = "AND GD_EMP.GD_CAM_CSC_SERVICIO = ".$obj->CAM_CSC_SERVICIO;
  }
  else if($obj->TpoBusqueda == 'EMPLEADO' ){
    $TpoBusqueda = " AND GD_EMP.EMPLEADO_CSC_EMPLEADO = ".$obj->EMPLEADO_CSC_EMPLEADO;
  }

  $query = $connecta->query("SELECT GD_EMP.EMPLEADO_CSC_EMPLEADO,
  GD_ARCH.GD_ARCHIVO_ENSERVIDOR,
  GD_EMP.GD_ESTRUCTURA_DESCRIPCION AS title,
  GD_ARCH.GD_ARCHIVO_UNIQUE, 
  GD_EMP.GD_ESTRUCTURA_PADRE AS parent_id, 
  GD_ARCH.GD_ARCHIVO_NOMBRE,
  GD_EMP.PUBLICOS,
  GD_EMP.VALIDACION1,
  GD_EMP.VALIDACION2,
  GD_EMP.CATALOGO_OPCION,
  GD_EMP.FECHA_VALIDACION,
  GD_EMP.VALIDADOR_CSC,
  GD_EMP.FECHA_ULTIMA_ACTUALIZACION,
  GD_EMP.GD_CAM_CSC_SERVICIO,
  SERVICIO.CAM_SERVICIO_NOMBRE,
  ISNULL(EMPLEADO.EMPLEADO_CURP,'') as EMPLEADO_CURP,
  ISNULL(CONCAT (EMPLEADO.EMPLEADO_NOMBREEMPLEADO, ' ' ,EMPLEADO.EMPLEADO_APATERNOEMPLEADO, ' ',EMPLEADO.EMPLEADO_AMATERNOEMPLEADO),'') as Nombre,
  ISNULL(EMPLEADO.EMPLEADO_RFC,'') as EMPLEADO_RFC,
  ISNULL(CONVERT(char(10), EMPLEADO.EMPLEADO_FEC_INICIAOPERACION,105),'') as EMPLEADO_FEC_INICIAOPERACION,
  ISNULL(CONVERT(char(10), EMPLEADO.EMPLEADO_FECH_INGRESOEMP,105),'') as EMPLEADO_FECHINGRESOEMP,
  ISNULL(CONVERT(char(10), EMPLEADO.EMPLEADO_FECH_REINGRESO,105),'') as EMPLEADO_FECHREINGRESO,
  ISNULL(CONVERT(char(10), EMPLEADO.SOLICITUD_FECHA_CERTIFICACION,105),'') as SOLICITUD_FECHA_CERTIFICACION,
  ISNULL(CONVERT(char(10),EMPLEADO.EMPLEADO_FECH_CAPACITACION,105),'') as EMPLEADO_FECCAPACITACION,
  ISNULL(CONVERT(char(10),EMPLEADO.EMPLEADO_FIN_CAPA AS EMP_FIN_CAPA,105),'') as EMPLEADO_FIN_CAPA AS EMP_FIN_CAPA,
  ISNULL(CONVERT(char(10), EMPLEADO.EMPLEADO_FECH_BAJAEMPLEADO,105),'') as EMPLEADO_FECBAJAEMPLEADO,
  ISNULL(CONVERT(VARCHAR(8),EMPLEADO.EMP_ENTRADA_LUNES,108),'') as Hora_Entrada,
  ISNULL(CONVERT(VARCHAR(8),EMPLEADO.EMP_SALIDA_LUNES,108),'') as Hora_Salida,
  ISNULL(EMPLEADO.EMPLEADO_SKILL1,'') as EMPLEADO_SKILL1,
  ISNULL(EMPLEADO.EMPLEADO_SKILL2,'') as EMPLEADO_SKILL2,
  ISNULL(EMPLEADO.EMPLEADO_SKILL3,'') as EMPLEADO_SKILL3,
  ISNULL(EDIF.REQ_NOMBREAREA,'') as REQ_NOMBREAREA
  ,ISNULL(Puest.TIPO_PUESTO_IDIOMA1,'') as TIPO_PUESTO_IDIOMA1
  ,ISNULL(Pr.CAT_PROCESO_EMP_IDIOMA1,'') as CAT_PROCESO_EMP_IDIOMA1
  ,ISNULL(ESTU.TIPO_ESTUDIO_IDIOMA1,'') as TIPO_ESTUDIO_IDIOMA1
  ,ISNULL(ESPE.TIPO_ESPECIALIDAD_IDIOMA1,'') as TIPO_ESPECIALIDAD_IDIOMA1
  ,ISNULL(EMPLEADO.EMPLEADO_DOC_COMENT,'') as EMPLEADO_DOC_COMENT
  ,ISNULL(ESTATS.TIPO_ESTATUS_IDIOMA1,'') as TIPO_ESTATUS_IDIOMA1
  ,ISNULL(RH.RECLUTAMIENTO_PRUEBA_CONOCIM_RESULTADO,'') as RECLUTAMIENTO_PRUEBA_CONOCIM_RESULTADO
  ,ISNULL(RH.RECLUTAMIENTO_PRUEBA_ORTOGRAFIA_RESULTADO,'') as RECLUTAMIENTO_PRUEBA_ORTOGRAFIA_RESULTADO
  ,ISNULL(docu.TIPO_DOCUMENTO_IDIOMA1,'') as TIPO_DOCUMENTO_IDIOMA1
  ,ISNULL(EMPLEADO.EMPLEADO_VALIDA_INT,'') as EMP_VALIDA_INT
  ,ISNULL(EMPLEADO.EMPLEADO_VALIDA_EXT ,'') as EMP_VALIDA_EXT
  ,ISNULL(PER.SAMT_TIPO_PERFIL_IDIOMA1,'') as SAMT_TIPO_PERFIL_IDIOMA1
  ,ISNULL(EMPLEADO.EMPLEADO_PEI,'') as EMPLEADO_PEI
  ,case EMPLEADO.SOLICITUD_MULTICAMPANIA when 1 then 'Si' when 0 then 'No' else '' end as EMPLEADO_MULTICAMPANIA
  ,ISNULL(Actividad.TIPO_ACTIVIDAD_IDIOMA1,'') as TIPO_ACTIVIDAD_CSCEMPLEADO
  ,case EMPLEADO.EMPLEADO_PROMOSION when 1 then 'Si' when 0 then 'No' else 'No' end as EMPLEADO_PROMOSION
  ,ISNULL(CONVERT(char(10),EMPLEADO.EMPLEADO_FECHA_PROMO,105),'') as EMPLEADO_FECHA_PROMO
  ,ISNULL(estaaa.TIPO_ESTATUS_ESTUDIO_IDIOMA1,'') as TIPO_ESTATUS_ESTUDIO_IDIOMA1
,GD_EMP.GD_ESTRUCTURA_CSC AS VALIDA_ESTRUCTURA
  FROM SAMT_GD_ESTRUCTURA_WBS_EMP_ESP AS GD_EMP 
  INNER JOIN SAMT_GD_ARCHIVOS AS GD_ARCH ON GD_ARCH.GD_ESTRUCTURA_CSC = GD_EMP.GD_ESTRUCTURA_CSC AND GD_ARCH.GD_ARCHIVO_ACTIVO=1 and GD_ARCH.GD_ARCHIVO_ENSERVIDOR=1
  INNER JOIN SAMT_EMPLEADOS AS EMPLEADO ON EMPLEADO.EMPLEADO_CSC_EMPLEADO = GD_EMP.EMPLEADO_CSC_EMPLEADO
  INNER JOIN SAMT_CAM_SERVICIO AS SERVICIO ON SERVICIO.CAM_CSC_SERVICIO = GD_EMP.GD_CAM_CSC_SERVICIO 
  LEFT JOIN SAMT_REQUISICIONES AS EDIF ON EDIF.[REQ_CSCREQUISICION] = EMPLEADO.REQ_CSCREQUISICION AND EDIF.[EMP_CSC_EMPRESA_HOST] = EMPLEADO.EMP_CSC_EMPRESA_HOST

  INNER join SAMT_EMPLEADO_ESTUDIOS as estudio on estudio.EMPLEADO_CSC_EMPLEADO=EMPLEADO.EMPLEADO_CSC_EMPLEADO AND estudio.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_ESTUDIO_EMPLEADO AS ESTU ON ESTU.TIPO_ESTUDIO_CSC = estudio.TIPO_ESTUDIO_CSC And ESTU.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST 
  LEFT JOIN SAMT_TIPO_ESTATUS_ESTUDIO as estaaa on estaaa.ESTATUS_ESTUDIO_CSC=estudio.ESTATUS_ESTUDIO_CSC AND estaaa.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_DOCUMENTO_EMPLEADO as docu ON docu.TIPO_DOCUMENTO_CSC=estudio.TIPO_DOCUMENTO_CSC AND docu.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_EMPLEADO_ESPECIALIDAD_ESCOLAR AS ESPE ON ESPE.TIPO_ESPECIALIDAD_CSC = estudio.TIPO_ESPECIALIDAD_CSC And ESPE.EMP_CSC_EMPRESA_HOST = EMPLEADO.EMP_CSC_EMPRESA_HOST 
  LEFT JOIN SAMT_TIPO_EMPLEADO_PERFIL AS PER ON PER.SAMT_CSC_PERFIL=EMPLEADO.TIPO_PERFIL_CSC AND PER.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_CAT_PROVEEDORES_INFRA as EmpCont on EmpCont.CAT_PROVEEDOR_INFRA_CSC=EMPLEADO.CAT_PROVEEDOR_INFRA_CSC AND EmpCont.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_PUESTO_EMPLEADO as Puest ON Puest.TIPO_PUESTO_CSCEMPLEADO=EMPLEADO.CAT_PUESTO_CSCEMPLEADO  AND Puest.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_ESTATUS_GD AS ESTATS ON ESTATS.CSC_TIPO_ESTATUS_GD = EMPLEADO.EMPLEADO_DOC_APROBADO AND ESTATS.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_CAT_PROCESO_EMPLEADOS AS Pr ON Pr.CAT_PROCESO_EMP_CSC=EMPLEADO.CAT_PROCESO_EMP_CSC AND Pr.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_RH_RECLUTAMIENTO as RH on RH.EMPLEADO_CSC_EMPLEADO=EMPLEADO.EMPLEADO_CSC_EMPLEADO AND RH.EMP_CSC_EMPRESA_HOST=EMPLEADO.EMP_CSC_EMPRESA_HOST
  LEFT JOIN SAMT_TIPO_EMPLEADO_ACTIVIDAD as Actividad on Actividad.TIPO_ACTIVIDAD_CSCEMPLEADO=EMPLEADO.TIPO_ACTIVIDAD_EMPLEADO_CSC

  WHERE EMPLEADO.EMPLEADO_CVEESTATUS = 1 
  AND estudio.ESTUDIOS_ULTIMO_GRADO = 1
  AND EMPLEADO.CAT_PROCESO_EMP_CSC = 3 ".$TpoBusqueda.";");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}

public function insertTokenApp($obj){
  /****Conecta a Base de Datos****/
   $connecta = $this->Conecta($obj->EmpresaNombre);
   $updateToken = $connecta->update(
    "SAMT_SEG_DISP_MOVIL", 
    "DISPOSITIVO_ACTIVO = 0,
    AUDITORIA_USU_ULT_MOD = ".$obj->EMPLEADO_CSC_EMPLEADO.",
    AUDITORIA_FEC_ULT_MOD = GETDATE()",
    " EMPLEADO_CSC_EMPLEADO = ".$obj->EMPLEADO_CSC_EMPLEADO." AND  APP_TOKEN = '".$obj->APP_TOKEN."' AND EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." ");

   /****End Conecta a Base de Datos****/
   $getInsertB = $connecta->insert(
    "SAMT_SEG_DISP_MOVIL", 
    "EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST.",
    EMPLEADO_CSC_EMPLEADO = ".$obj->EMPLEADO_CSC_EMPLEADO.",
    DISPOSITIVO_TOKEN = '".$obj->DISPOSITIVO_TOKEN."',
    CSC_TIPO_DISPOSITIVO = ".$obj->CSC_TIPO_DISPOSITIVO.",
    DISPOSITIVO_ACTIVO = ".$obj->DISPOSITIVO_ACTIVO.",
    AUDITORIA_USU_ALTA = ".$obj->EMPLEADO_CSC_EMPLEADO.",
    AUDITORIA_USU_ULT_MOD = ".$obj->EMPLEADO_CSC_EMPLEADO.",
    AUDITORIA_FEC_ALTA = GETDATE(),
    APP_TOKEN = '".$obj->APP_TOKEN."',
    AUDITORIA_FEC_ULT_MOD = GETDATE()");
 
 /****Desconecta a Base de Datos****/
   $connecta->disconnect();
   /****End Desconecta a Base de Datos****/
   if($getInsertB == false){
         $Datos = array('Estatus'=>'Error','Msj'=>$obj->DISPOSITIVO_TOKEN . ' Incorrecta', 'id' => $connecta->getError());
       }
       else{
        $Datos = array('Estatus'=>'Exito','Msj'=>$obj->DISPOSITIVO_TOKEN . ' Correcta', 'id' => $getInsertB);
       }
       return $Datos;
 
 }

 public function GetDispositivoToken($obj){
	$connecta = $this->Conecta( $obj->EmpresaNombre ); // <---- Conecta a Base de Datos
  $query = $connecta->query("SELECT * FROM SAMT_SEG_DISP_MOVIL WHERE EMP_CSC_EMPRESA_HOST = ".$obj->EMP_CSC_EMPRESA_HOST." AND EMPLEADO_CSC_EMPLEADO = ".$obj->EMPLEADO_CSC_EMPLEADO." AND APP_TOKEN = '".$obj->APP_TOKEN."' AND DISPOSITIVO_ACTIVO = 1;");
  $ObjReturn = $query->fetchAll(PDO::FETCH_ASSOC); // <---- Importante!
  if(empty($ObjReturn)){
    $arr_res = array(
      'Estatus' => 'Error',
      'JsonDatos'=>$ObjReturn
    );
  }
  else {
    $arr_res = array(
      'Estatus' => 'Exito',
      'JsonDatos'=>$ObjReturn
    );
  }
  return $arr_res;
  $connecta->disconnect();
}

  
}

?>
