SalesDashboard.dashboardModel = function() {
    var self = this;
    var obj_DatosEmpleado = null;
    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");
    self.patname = window.location.pathname;
    var _gdkey = 'GD_ARCHIVO_CSC';
    var _srvKey = 'CAM_CSC_SERVICIO';
    var _cempkey = 'EMPLEADO_CSC_EMPLEADO';
    var treeBajaKey = 'EMP_TREE_BAJA_CSC';
    var __url_gerencia = "https://cdn.dnasystem.io:2027/api/Api_GDoc/CreaGerenciaDeDocumentos"
    /** TODO: Formatos y fechas
     * self.TimeZoneServidor: Se utilizara para los INSERT y UPDATE de la BD
     * self.TimeZoneEmpleado: Se utiliza para saber la fecha y hora de la plataforma del empleado
     * self.TiempoUTCEmpleado: Segun el tipo de dato se sumara o restara esas horas a las 
     *                         fechas se trae en los campos de fecha de la BD
    */

    const syncTreeViewSelection = function (treeViewInstance, value) {
      if (!value) {
          treeViewInstance.unselectAll();
      } else {
          treeViewInstance.selectItem(value);
      }
    };

    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();

    //! Define si se cargan catalogos inactivos false = Solo Carga Activos - True =  Carga todo para consulta
    self.LoadCatFull = false;

    //! Define al dar clicl en el boton de alta los catalogos se cargen con los valores por defecto
    self.setDefaultValues = true;

    self.DatosEmpleadosGet = null;
    self.T_obj_SessionInfo = null;

    self._Obj_Empleados_Grid_iEmp = new DevExpress.data.ArrayStore({data: []});
    self._Cmb_Proceso_ObjData = new DevExpress.data.ArrayStore({data: []});
    self._Cmb_Estatus_Empl_ObjData = new DevExpress.data.ArrayStore({data: []});
    self._Cmb_SubProceso_ObjData = new DevExpress.data.ArrayStore({data: []});

    self._CountryCodes_ObjData = new DevExpress.data.ArrayStore({data: []});
    self._TimeZones_ObjData = new DevExpress.data.ArrayStore({data: []});

    self.CatalogosPantalla = [];

    self.NombreAutor = null;
    self.init = function() {
        /** 
         * ! SIEMPRE AGREGAR ESTA LINEA 
        */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** 
         * ! SIEMPRE AGREGAR ESTA LINEA 
        */

        /** LABELS  PANTALLA*/
        //$('#adm_title_ms').html(Globalize.formatMessage("adm_title_ms"));
        /** LABELS  PANTALLA*/

        /** 
         * TODO: Obtiene los datos encriptados de los local storage 
         * */
        var originalData = decrypt(localStorage.getItem('DatosEncriptados'));
        obj_DatosEmpleado = JSON.parse(originalData);
        self.T_obj_SessionInfo = JSON.parse(localStorage.getItem('obj_SessionInfo'));

        self.NombreAutor = `${obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO} ${obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO} ${obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO}`;

        
        loadPanel.hide();

        self._PopSearchEmpleado = $('#Pop_Busqueda_Empleados').dxPopup({
            width: 20,
            height: 20,
            visible: false,
            showTitle: true,
            showCloseButton:true,
            title: '',
            hideOnOutsideClick: false,
            onHiding: function (e) {
              e.component.content().empty();
            }
        }).dxPopup('instance');

        self._Pop_Colonias_Codigo_Postal = $("#Pop_Colonias_Codigo_Postal").dxPopup({
          width:600,
          height: 300,
          showTitle: true,
          title:"Selecciona la colonia correspondiente",
          visible:false,
          dragEnabled: false,
          hideOnOutsideClick: false,
          shadingColor:"#000000bf",
          onHiding: function (e) {
              $("#Datagrid_Colonias_Codigo_Postal").dxDataGrid("instance").option("dataSource",[]);
          },
          onShowing: function(e) {
          },
          onShown: function (e) {
              
          },
          contentTemplate: function (e) {
              e.append(
                $("<div />").attr({"id":"Datagrid_Colonias_Codigo_Postal","style":"margin-top: 0px;"}).dxDataGrid({
                  dataSource:[],
                  height: 200,
                  showBorders: true,
                  columnMinWidth: 100,
                  columnAutoWidth: true,
                  selection: {
                      mode: "single"
                  },
                  filterRow: {
                      visible: true,
                      applyFilter: "auto"
                  },
                  columns: [{
                      dataField: "COLONIA",
                      caption: "Colonia",
                  },{
                      dataField: "ESTADO",
                      caption: "Estado",
                  },{
                      dataField: "MUNICIPIO",
                      caption: "Delegacion/Municipio",
                  }],

                  scrolling: {
                      mode: "virtual"
                  },
                  sorting: {
                      mode: "none"
                  },
                  onRowDblClick:function(row){
                    self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_EDO_CSCESTADO").option("value",row.data.ID_ESTADO);
                    self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_MUNICIPIO").option("value",row.data.MUNICIPIO);
                    self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_COLONIA").option("value",row.data.COLONIA);
                    self._Pop_Colonias_Codigo_Postal.hide();
                  }
                }),

                $("<div />").attr({"id":"Btn_Selec_Municipio","style":"margin-top: 10px;"}).dxButton({
                    stylingMode: "contained",
                    type: "default",
                    width:'100%',
                    icon: 'fa fa-check',
                    text: "Seleccionar Colonia",
                    onClick: function(e) {
                        var SelectColonia =  $("#Datagrid_Colonias_Codigo_Postal").dxDataGrid("instance").option("selectedRowKeys");
                        console.log(SelectColonia);
                        if(SelectColonia.length == 0){
                            DevExpress.ui.notify( 'SELECCIONA UNA COLONIA', 'error', 3000);         
                        }
                        else{
                          self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_EDO_CSCESTADO").option("value",SelectColonia[0].ID_ESTADO);
                          self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_MUNICIPIO").option("value",SelectColonia[0].MUNICIPIO);
                          self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_COLONIA").option("value",SelectColonia[0].COLONIA);
                          self._Pop_Colonias_Codigo_Postal.hide();
                        }
                    }

                })
              )
          }
        }).dxPopup("instance");


        self._Pop_Confirma_Baja_Vacantes = $("#Pop_Confirma_Baja_Vacantes").dxPopup({
          width:340,
          height: 100,
          showTitle: false,
          visible:false,
          dragEnabled: false,
          hideOnOutsideClick: false,
          shadingColor:"#000000bf",
          onHiding: function (e) {
          },
          contentTemplate: function (e) {
            e.append(
              $("<div />").attr({"style":"padding: 5px; height: 100%;"})
              .append(

                $("<div />").attr({"style":`padding-top: 5px; 
                padding-bottom: 15px; 
                padding-left: 18px; 
                padding-right: 18px; 
                font-size: 14px; 
                text-align: center; 
                font-weight: 700;`})
                .append("¿Desea Conservar la vacante?"),

                $("<div />").attr({"id":"Toolbar_Confirma_Baja_Vacantes","style":"margin-top: 0px;"}).dxToolbar({
                  items: [{
                    location: 'before',
                    widget: 'dxButton',
                    options: {
                      width:150,
                      type: 'default',
                      icon: "edit",
                      text: "Conservar Vacante",
                      onInitialized:function(e){
                        $Boton_Conservar_Vacante = e.component;
                      },
                      onClick: function() {
                        loadPanel.show();
                        
                        var Estatus_Headcount_Vac = jslinq(self.__Estatus_Headcount).where(function(el) {
                          return el.ESTATUS_CLAVE.indexOf("VAC") != -1;
                        }) .toList();

                        var Sub_Estatus_Headcount_Vac = jslinq( self.__Sub_Estatus_Headcount ).where(function(el) {
                            return el.ESTATUS_HEADCOUNT_CSC == Estatus_Headcount_Vac[0].ESTATUS_HEADCOUNT_CSC ;
                        }) .toList();

                        var Update_Libera_Headcaunt_Autorizado = {
                          Type:localStorage.getItem('Type'),
                          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                          DATA_UPDATE:{
                            HCA_FECHA_PROGRAMADA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            HCA_FECHA_PROGRAMADA_FIN:moment().add(1,'months').tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            EMPLEADO_CSC_EMPLEADO:null,
                            TIPO_ESTATUS_HEADCOUNT_CSC:Estatus_Headcount_Vac[0].ESTATUS_HEADCOUNT_CSC,
                            SUBESTATUS_HEADCOUNT_CSC:Sub_Estatus_Headcount_Vac[0].SUBESTATUS_HEADCOUNT_CSC,
                            HCA_FECHA_ESTATUS:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                          },
                          DATA_WHERE:{
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            HCA_PUESTOS_CSC:self.DatosEmpleadosGet.TIPO_VACANTE_CSC
                          }
                        };
                        
                        __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Headcaunt_Autorizado', 'POST', JSON.stringify(Update_Libera_Headcaunt_Autorizado), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((Result_Update_Libera_Headcaunt_Autorizado)=>{

                          var Update_Empleado_Vacante = {
                            Type:localStorage.getItem('Type'),
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            DATA_UPDATE:{
                              TIPO_VACANTE_CSC:null,
                              AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                              AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                            },
                            DATA_WHERE:{
                              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                              EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                              EMPLEADO_UNIQUE_ID:self.DatosEmpleadosGet.EMPLEADO_UNIQUE_ID
                            }
                          };
                          
                          __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado','POST',JSON.stringify(Update_Empleado_Vacante),getJSON(DeveloperType).ApiRecursosHumanos.token).then((Resualt_Update_Empleado_Vacante)=>{
                            
                            self.Insert_Bitacora_Puestos_Anteriores();
                            loadPanel.hide();

                          }).catch(function(e){
                            loadPanel.hide();
                            self._Pop_Confirma_Baja_Vacantes.hide();
                            console.log(e);
                            DevExpress.ui.notify( 'ERROR DE COMUNICACION CON EL SERVIDOR VACANTE NO LIBERADA, INTENTELO NUEVAMETE MAS TARDE', 'error', 3000);
                          });
                        }).catch(function(e){
                          loadPanel.hide();
                          self._Pop_Confirma_Baja_Vacantes.hide();
                          console.log(e);
                          DevExpress.ui.notify( 'ERROR DE COMUNICACION CON EL SERVIDOR VACANTE NO LIBERADA, INTENTELO NUEVAMETE MAS TARDE', 'error', 3000);
                        });

                      }
                    }
                  },{
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                      width:150,
                      type: 'danger',
                      icon: "trash",
                      text: "Eliminar Vacante",
                      onInitialized:function(e){
                        $Boton_Eliminar_Vacante = e.component;
                      },
                      onClick: function() {
                        loadPanel.show();
                        var Delete_Headcaunt_Autorizado = {
                          Type:localStorage.getItem('Type'),
                          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                          EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                          HCA_PUESTOS_CSC:self.DatosEmpleadosGet.TIPO_VACANTE_CSC
                        };
                        
                        __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Delete_Headcaunt_Autorizado', 'POST', JSON.stringify(Delete_Headcaunt_Autorizado), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((Result_Update_Libera_Headcaunt_Autorizado)=>{

                          var Update_Empleado_Vacante = {
                            Type:localStorage.getItem('Type'),
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            DATA_UPDATE:{
                              TIPO_VACANTE_CSC:null,
                              AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                              AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                            },
                            DATA_WHERE:{
                              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                              EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                              EMPLEADO_UNIQUE_ID:self.DatosEmpleadosGet.EMPLEADO_UNIQUE_ID
                            }
                          };
                          
                          __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado','POST',JSON.stringify(Update_Empleado_Vacante),getJSON(DeveloperType).ApiRecursosHumanos.token).then((Resualt_Update_Empleado_Vacante)=>{
                            
                            self.Insert_Bitacora_Puestos_Anteriores();
                            loadPanel.hide()

                          }).catch(function(e){
                            loadPanel.hide();
                            self._Pop_Confirma_Baja_Vacantes.hide();
                            console.log(e);
                            DevExpress.ui.notify( 'ERROR DE COMUNICACION CON EL SERVIDOR EMPLEADO NO ACTUALIZADO, INTENTELO NUEVAMETE MAS TARDE', 'error', 3000);
                          });
                        }).catch(function(e){
                          loadPanel.hide();
                          self._Pop_Confirma_Baja_Vacantes.hide();
                          console.log(e);
                          DevExpress.ui.notify( 'ERROR DE COMUNICACION CON EL SERVIDOR VACANTE NO ELIMINADA, INTENTELO NUEVAMETE MAS TARDE', 'error', 3000);
                        });

                      }
                    }
                  }]
                })
              )
            )
          }
        }).dxPopup("instance");


        self.__Pop_DataGrid_Vacantes = $('#Pop_DataGrid_Vacantes').dxPopup({
          width:900,
          height: 350,
          showTitle: true,
          title:"Organigrama",
          visible:false,
          dragEnabled: false,
          hideOnOutsideClick: false,
          shadingColor:"#000000bf",
          onHiding: function (e) {
          },
          onShowing: function (e) {
            loadPanel.show();
            $("#DataGrid_Vacantes").dxDataGrid("instance").refresh().done(function(){
              loadPanel.hide();
          }).fail(function(error) {
              loadPanel.hide();
              console.log(error);
          });
          },
          contentTemplate: function (e) {
            e.append(
              $("<div />").attr({"id":"DataGrid_Vacantes","style":"margin-top: 0px;"}).dxDataGrid({
                selection: { mode: "none"},
                height: "100%",
                scrolling: { mode: 'virtual' },       
                hoverStateEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                columnAutoWidth: false,
                columnWidth: 150,
                filterRow: { visible: true, applyFilter: 'auto' },
                headerFilter: { visible: true },
                dataSource: new DevExpress.data.DataSource({
                  loadMode:'raw',
                  load: async function () {
                      try {
                          var objRequest = {
                              Type:localStorage.getItem('Type'),
                              EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                              ESTATUS_CLAVE:"VAC"
                          };
                          return __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Headcount_Autorizado_By_Clave_Estatus',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(dataRequest){
                              if (dataRequest.success == true) {
                                  return dataRequest.JsonData;
                              }
                              else{
                                  console.log(dataRequest.message );
                                  return [];
                              }
                          }); 
                      }
                      catch (error) { console.log(error); }
                  }
              }),
                columns: [{
                  width: 110,
                  fixed: true,
                  type: 'buttons',
                  buttons: [{
                      text: 'Seleccionar',
                      onClick(e) {
                        loadPanel.show();
                        var Data_Vacante = Object.assign({}, e.row.data);

                        var Estatus_Headcount_Vac = jslinq(self.__Estatus_Headcount).where(function(el) {
                            return el.ESTATUS_CLAVE.indexOf("VAC") != -1;
                        }) .toList();

                        var Sub_Estatus_Headcount_Vac = jslinq( self.__Sub_Estatus_Headcount ).where(function(el) {
                            return el.ESTATUS_HEADCOUNT_CSC == Estatus_Headcount_Vac[0].ESTATUS_HEADCOUNT_CSC ;
                        }) .toList();

                        var Update_Libera_Vacante = {
                          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                          Type:localStorage.getItem('Type'),
                          DATA_UPDATE:{
                            TIPO_ESTATUS_HEADCOUNT_CSC:Estatus_Headcount_Vac[0].ESTATUS_HEADCOUNT_CSC,
                            SUBESTATUS_HEADCOUNT_CSC:Sub_Estatus_Headcount_Vac[0].SUBESTATUS_HEADCOUNT_CSC,
                            EMPLEADO_CSC_EMPLEADO:null,
                            HCA_FECHA_PROGRAMADA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            HCA_FECHA_PROGRAMADA_FIN:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            HCA_FECHA_ESTATUS:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                          },
                          DATA_WHERE:{
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO
                          }
                        }

                        __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Headcaunt_Autorizado', 'POST', JSON.stringify(Update_Libera_Vacante), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((Result_Update_libera_Vacante)=>{

                          var Update_Empleado_Headcount = {
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            Type:localStorage.getItem('Type'),
                            DATA_UPDATE:{
                              TIPO_VACANTE_CSC:Data_Vacante.HCA_PUESTOS_CSC,
                              CAT_CATEGORIA_PUESTO_CSC:Data_Vacante.CAT_CATEGORIA_PUESTO_CSC,
                              CAT_PUESTO_CSCEMPLEADO:Data_Vacante.TIPO_PUESTO_CSCEMPLEADO,
                              CAT_CENTRO_COSTOS_CSC:Data_Vacante.CAT_CENTRO_COSTOS_CSC,
                              CAT_AREA_CSC:Data_Vacante.TIPO_AREA_CSC,
                              CAT_DEPARTAMENTO_CSC:Data_Vacante.EMPLEADO_DEPARTAMENTO_CSC,
                              REQ_CSCREQUISICION:Data_Vacante.HCA_REQ_CSCREQUISICION,
                              TIPO_UBICACION_LABORAL_CSC:Data_Vacante.TIPO_UBICACION_LABORAL_CSC,
                              TIPO_EMPLEADO_COMPARTIDO_CSC:Data_Vacante.TIPO_EMPLEADO_COMPARTIDO_CSC,
                              TIPO_EMPLEADO_WS_CSC:Data_Vacante.TIPO_EMPLEADO_WS_CSC,
                              TIPO_EMPLEADO_EMPLEADO_CSC:Data_Vacante.TIPO_EMPLEADO_EMPLEADO_CSC,
                              TIPO_FRECUENCIA_CSC:Data_Vacante.TIPO_FRECUENCIA_CSC,
                              SAMT_PF_TIPO_ACTUALIZA_EMPLEADO_CSC:Data_Vacante.SAMT_PF_TIPO_ACTUALIZA_EMPLEADO_CSC,
                              CAT_PROVEEDOR_CSC:Data_Vacante.CAT_PROVEEDOR_CSC,
                              TIPO_TURNO_CSCTURNO:Data_Vacante.TIPO_TURNO_CSCTURNO,
                              AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                              AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                            },
                            DATA_WHERE:{
                              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                              EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                              EMPLEADO_UNIQUE_ID:self.DatosEmpleadosGet.EMPLEADO_UNIQUE_ID,
                            }
                          };

                          __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado', 'POST', JSON.stringify(Update_Empleado_Headcount), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((Result_Update_Empleado)=>{
                            if(Result_Update_Empleado.success === true){

                              var Estatus_Headcount_Cub = jslinq(self.__Estatus_Headcount).where(function(el) {
                                  return el.ESTATUS_CLAVE.indexOf("CUB") != -1;
                              }) .toList();
      
                              var Sub_Estatus_Headcount_Cub = jslinq( self.__Sub_Estatus_Headcount ).where(function(el) {
                                  return el.ESTATUS_HEADCOUNT_CSC == Estatus_Headcount_Cub[0].ESTATUS_HEADCOUNT_CSC ;
                              }) .toList();


                              var Update_Ocupa_Vacante = {
                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type:localStorage.getItem('Type'),
                                DATA_UPDATE:{
                                  TIPO_ESTATUS_HEADCOUNT_CSC:Estatus_Headcount_Cub[0].ESTATUS_HEADCOUNT_CSC,
                                  SUBESTATUS_HEADCOUNT_CSC:Sub_Estatus_Headcount_Cub[0].SUBESTATUS_HEADCOUNT_CSC,
                                  EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                  HCA_FECHA_CUBRE_VACANTE:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                  HCA_FECHA_ESTATUS:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                  AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                  AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                                },
                                DATA_WHERE:{
                                  EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                  HCA_PUESTOS_CSC:Data_Vacante.HCA_PUESTOS_CSC
                                }
                              }
                              __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Headcaunt_Autorizado', 'POST', JSON.stringify(Update_Ocupa_Vacante), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((Result_Update_Ocupa_Vacante)=>{
                                if(Result_Update_Ocupa_Vacante.success == true){
                                  var Insert_Headcount_Detalle = {
                                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                    Type:localStorage.getItem('Type'),
                                    DATA_INSERT:{
                                      EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                      HCA_PUESTOS_CSC:Data_Vacante.TIPO_PUESTO_CSCEMPLEADO,
                                      CSC_PUESTO:Data_Vacante.TIPO_PUESTO_CSCEMPLEADO,
                                      CAT_CATEGORIA_PUESTO_CSC:Data_Vacante.CAT_CATEGORIA_PUESTO_CSC,
                                      EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                      EMPLEADO_RESPONSABLE_CSC:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                      HCD_FECHA_INICIA:Data_Vacante.HCA_FECHA_PROGRAMADA,
                                      HCD_FECHA_FIN:Data_Vacante.HCA_FECHA_PROGRAMADA_FIN,
                                      AUDITORIA_USU_ALTA:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                      AUDITORIA_USU_ULT_MOD:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                      AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                      AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                                    }
                                  };

                                  __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Headcount_Detalle', 'POST', JSON.stringify(Insert_Headcount_Detalle), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((Result_Insert_Headcount_Detalle)=>{
                                    if(Result_Insert_Headcount_Detalle.success == true){

                                      var Get_Servicio_Empleado_Existente = {
                                        EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                        Type:localStorage.getItem('Type'),
                                        EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                        CAM_CSC_SERVICIO:Data_Vacante.CAM_CSC_SERVICIO
                                      };

                                      __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Cam_Servicios_Empleado',"GET", Get_Servicio_Empleado_Existente, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(Result_Get_Servicio){
                                        if (Result_Get_Servicio.success == true) {

                                          if( Data_Vacante.CLIENTE_CSC == self.DatosEmpleadosGet.CLIENTE_CSC && Data_Vacante.PM_CSC_PROYECTO == self.DatosEmpleadosGet.PM_CSC_PROYECTO && Data_Vacante.CAM_CSC_SERVICIO == self.DatosEmpleadosGet.CAM_CSC_SERVICIO ){
                                            console.log("Los datos del empleado de cliente proyectoy servicio son los mismos que ya tenia el empleado")
                                          }
                                          else{

                                            await new Promise(function(resolve,reject){
                                              var Bitacora_Clientes = {
                                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                                Type:localStorage.getItem('Type'),
                                                DATA_INSERT:{
                                                  EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                  EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                                  BITACORA_FECHA_INICIO:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                                  BITACORA_FECHA_FIN:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                                  AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                  AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                  AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                                  AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                                                }
                                              };
                        
                                              __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Bitacora_Cliente', 'POST', JSON.stringify(Bitacora_Clientes), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async (Result_Bitacora_Clientes)=>{
                                                resolve("resolve");
                                              }).catch(function(e){
                                                console.log(e);
                                                reject("reject");
                                              })
                                            });
                                          }

                                          
                                          self.__Pop_DataGrid_Vacantes.hide();

                                          self.RestablecerBotonesEndUpdate();

                                          var data_obj_Empleado = {
                                              EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                              Type:localStorage.getItem('Type'),
                                              EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                              EMPLEADO_UNIQUE_ID: self.Frm_Datos_Empleado.option('formData').EMPLEADO_UNIQUE_ID
                                          };                
                                          self.BuscaEmpleados(data_obj_Empleado, 'CargaDatos');

                                          DevExpress.ui.notify( 'ACTUALIZACION CORRECTA', 'success', 3000);

                                          loadPanel.hide();
                                          
                                        }
                                        else{
                                            var _Obj_Insert_Servicio_Empleado = {
                                              EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                              Type:localStorage.getItem('Type'),
                                              DATA_INSERT:{
                                                EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                                CAM_CSC_SERVICIO:Data_Vacante.CAM_CSC_SERVICIO,
                                                SERVICIOS_EMP_UNIQUE:createUUID(36),
                                                TEL:1,
                                                CHAT:0,
                                                REDES_SOCIALES:0,
                                                MAIL:0,
                                                DNA:0,
                                                TEL_OUT:0,
                                                SMS:0,
                                                VIDEO_CONFERENCIA:0,
                                                NOTIFICACIONES:0,
                                                ACD:0,
                                                ACTIVO_BARCONTACT:0,
                                                SERVICIO_PRINCIPAL:0,
                                                SERVICIO_ACTIVO:1,
                                                SERVICIO_FECHA_INICIO:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD'),
                                                SERVICIO_FECHA_FIN:moment().add(1,'years').tz(self.TimeZoneServidor).format('YYYY-MM-DD'),
                                                AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                                AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                                              }
                                            };

                                            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Cam_Servicio_Empleados',"POST", JSON.stringify(_Obj_Insert_Servicio_Empleado), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(Result_Data_Insert_Servicio){
                                                if (Result_Data_Insert_Servicio.success == true){
                                                  DevExpress.ui.notify( 'ACTUALIZACION CORRECTA', 'success', 3000);
                                                }
                                                else{
                                                  DevExpress.ui.notify( 'REALCION SERVICIO NO CREADA', 'error', 3000);
                                                }


                                                if( Data_Vacante.CLIENTE_CSC == self.DatosEmpleadosGet.CLIENTE_CSC && Data_Vacante.PM_CSC_PROYECTO == self.DatosEmpleadosGet.PM_CSC_PROYECTO && Data_Vacante.CAM_CSC_SERVICIO == self.DatosEmpleadosGet.CAM_CSC_SERVICIO ){
                                                  console.log("Los datos del empleado de cliente proyectoy servicio son los mismos que ya tenia el empleado")
                                                }
                                                else{

                                                  await new Promise(function(resolve,reject){
                                                    var Bitacora_Clientes = {
                                                      EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                                      Type:localStorage.getItem('Type'),
                                                      DATA_INSERT:{
                                                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                        EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                                                        BITACORA_FECHA_INICIO:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                                        BITACORA_FECHA_FIN:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                                        AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                        AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                        AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                                        AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                                                      }
                                                    };
                              
                                                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Bitacora_Cliente', 'POST', JSON.stringify(Bitacora_Clientes), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async (Result_Bitacora_Clientes)=>{
                                                      resolve("resolve");
                                                    }).catch(function(e){
                                                      console.log(e);
                                                      reject("reject");
                                                    })
                                                  });
                                                }
                                                
                                                self.__Pop_DataGrid_Vacantes.hide();

                                                self.RestablecerBotonesEndUpdate();

                                                var data_obj_Empleado = {
                                                  EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                                  Type:localStorage.getItem('Type'),
                                                  EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                  EMPLEADO_UNIQUE_ID: self.Frm_Datos_Empleado.option('formData').EMPLEADO_UNIQUE_ID
                                              };                
                                              self.BuscaEmpleados(data_obj_Empleado, 'CargaDatos');

                                              loadPanel.hide();

                                            }).catch(function(err){
                                              console.log(err);
                                              loadPanel.hide();
                                              DevExpress.ui.notify( 'ERROR DE COMUNICACIÓN, REALCION SERVICIO NO CREADA', 'error', 3000);
                                            });
                                          }
                                      });

                                    }
                                    else{
                                      loadPanel.hide();
                                      DevExpress.ui.notify( 'NO SE PUEDE GENERAR BITACORAS DE HEADCAUNT, INTENTELO NUEVAMENTE', 'error', 3000);
                                    }
                                  }).catch(function(err){
                                    console.log(err);
                                    loadPanel.hide();
                                    DevExpress.ui.notify( 'ERROR DE COMUNICACIÓN, NO SE PUEDE GENERAR BITACORA HEADCOUNT', 'error', 3000);
                                  });

                                }
                                else{
                                  loadPanel.hide();
                                  DevExpress.ui.notify( 'NO SE PUEDE ACTUALIZAR EL HEADCAUNT INTENTELO NUEVAMENTE', 'error', 3000);
                                }
                              }).catch(function(err){
                                console.log(err);
                                loadPanel.hide();
                                DevExpress.ui.notify( 'ERROR DE COMUNICACIÓN, NO SE PUEDE ACTUALIZAR LA VACANTE INTENTELO NUEVAMENTE', 'error', 3000);
                              });
                            }
                            else{
                              loadPanel.hide();
                              DevExpress.ui.notify( 'NO SE PUEDE ACTUALIZAR EL EMPLEADO, INTENTELO MAS TARDE', 'error', 3000);
                            }
                          }).catch(function(err){
                            console.log(err);
                            loadPanel.hide();
                            DevExpress.ui.notify( 'ERROR DE COMUNICACIÓN, NO SE PUEDE ACTUALIZAR EL EMPLEADO, INTENTELO MAS TARDE', 'error', 3000);
                          });

                        }).catch(function(err){
                          console.log(err);
                          loadPanel.hide();
                          DevExpress.ui.notify( 'ERROR DE COMUNICACIÓN, NO SE PUEDO VALIDAR VACANTEAS EXISTENTES, INTENTELO MAS TARDE', 'error', 3000);
                        });
                          
                      }
                  }]
                },{
                  width: 100,
                  alignment: "left",
                  caption: "ID",
                  dataField: "HCA_PUESTOS_CSC"
                },{
                  alignment: "left",
                  caption: "Estatus",
                  dataField: "TIPO_ESTATUS_HEADCOUNT_CSC",
                  lookup: {
                    valueExpr:"ESTATUS_HEADCOUNT_CSC",
                    displayExpr: "ESTATUS_HC_IDIOMA1",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_ESTATUS_HEADCOUNT"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Fecha Inicio",
                  dataField: "HCA_FECHA_PROGRAMADA"
                },
                {
                  alignment: "left",
                  caption: "Cliente",
                  dataField: "CLIENTE_CSC",
                  lookup: {
                    valueExpr:"CLIENTE_CSC",
                    displayExpr: "CLIENTE_NOMBRE",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_CLIENTES"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Campaña",
                  dataField: "PM_CSC_PROYECTO",
                  lookup: {
                    valueExpr:"PM_CSC_PROYECTO",
                    displayExpr: "PM_NOMBRE",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_PROYECTOS"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Subcampaña",
                  dataField: "CAM_CSC_SERVICIO",
                  lookup: {
                    valueExpr:"CAM_CSC_SERVICIO",
                    displayExpr: "CAM_SERVICIO_NOMBRE",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_CAM_SERVICIO"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },
                {
                  alignment: "left",
                  caption: "Turno",
                  dataField: "TIPO_TURNO_CSCTURNO",
                  lookup: {
                    valueExpr:"TIPO_TURNO_CSCTURNO",
                    displayExpr: "TIPO_TURNO_IDIOMA1",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_TIPO_TURNO_EMPLEADOS"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Presupuesto Contrato",
                  dataField: "HCA_PRESUPUESTO_CONTRATADO"
                },{
                  alignment: "left",
                  caption: "Categoria Puesto",
                  dataField: "CAT_CATEGORIA_PUESTO_CSC",
                  lookup: {
                    valueExpr:"CAT_CATEGORIA_PUESTO_CSC",
                    displayExpr: "CAT_CATEGORIA_PUESTO_IDIOMA1",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_CAT_CATEGORIA_PUESTO"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Puesto",
                  dataField: "TIPO_PUESTO_CSCEMPLEADO",
                  lookup: {
                    valueExpr:"TIPO_PUESTO_CSCEMPLEADO",
                    displayExpr: "TIPO_PUESTO_IDIOMA1",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_TIPO_PUESTO_EMPLEADO"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Area",
                  dataField: "TIPO_AREA_CSC",
                  lookup: {
                    valueExpr:"TIPO_AREA_CSC",
                    displayExpr: "TIPO_AREA_IDIOMA1",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_CAT_EMPLEADO_AREA"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Departamento",
                  dataField: "EMPLEADO_DEPARTAMENTO_CSC",
                  lookup: {
                    valueExpr:"EMPLEADO_DEPARTAMENTO_CSC",
                    displayExpr: "SAMT_TIPO_DEPARTAMENTO_IDIOMA1",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_CAT_EMPLEADO_DEPARTAMENTO"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                },{
                  alignment: "left",
                  caption: "Reaquisición",
                  dataField: "HCA_REQ_CSCREQUISICION",
                  lookup: {
                    valueExpr:"REQ_CSCREQUISICION",
                    displayExpr: "REQ_NOMBREAREA",
                    dataSource: {
                      store: new DevExpress.data.CustomStore({
                        loadMode: "raw",
                        paginate: false,   
                        load: async function () {
                          try {
                            var allServicios = {Tbl:"SAMT_REQUISICIONES"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                              if (dataInsert.success == true) { return dataInsert.JsonData; }
                              else { console.log(dataInsert.message); return []; }
                            }); 
                          } catch (error) { console.log(error); }
                        }
                      })
                    }
                  }
                }]
              })
            )
          }
        }).dxPopup("instance");
        

        self.TabPanelEmpleadoExtra = $('#TabPanelEmpleadoExtra').dxTabPanel({
          height: 260,
          selectedIndex: 0,
          loop: false,
          animationEnabled: false,
          swipeEnabled: false,
          deferRendering: false,
          onSelectionChanged(e) {
            $('.selected-index')
              .text(e.component.option('selectedIndex') + 1);
          },
        }).dxTabPanel('instance');
        

        self.TabPanelEmpleadoExtra.option("dataSource",  [
            { icon: './images/Icons/Card-file-icon64.png', title: "Mi menú", template: "tab_miMenu"}
        ]);
      
        self.Btns_Configurador = $("#BtnsAcciones").dxForm({
          readOnly: true,
          labelLocation: "left", // or "left" | "right"
          colCount:2,
        }).dxForm('instance');

        
        self.TabBarEventos = $('#___Tab_Empleados').dxToolbar({
          onContentReady: function(){
              $btn_Alta_Empleado.option('visible',true);
              $btn_Modificar_Empleado.option('visible',true);
              $btn_Salvar_Alta_Empleado.option('visible',false);
              $btn_Salvar_Modifica_Empleado.option('visible',false);
              $btn_Cancelar_Alta_Empleado.option('visible',false);
              $btn_Cancelar_Modificar_Empleado.option('visible',false);

              $btn_Busca_Avanzada_Empleado.option("disabled",false);
              $Num_Id_Interno.option("disabled",false);
              $Num_Id_Externo.option("disabled",false);
          },
          items: [
              {
                  location: 'before',
                  widget: 'dxButton',
                  options: {
                      icon: "./images/Icons/seasrchicon.png",
                      text: Globalize.formatMessage("Busca"),
                      onInitialized: function(e) {  
                        $btn_Busca_Avanzada_Empleado = e.component;  
                      },
                      onClick: function() {
                        self.DatosEmpleadosGet = null;
                        self.Frm_Datos_Empleado.resetValues();
                        self.Frm_Datos_Empleado.option('formData',{});
                        $("#imgEmpleado").css("background-image", "none");
                        $Num_Id_Interno.option('value',null);
                        $Num_Id_Externo.option('value',null);
                        self.BuscaEmpSoloActivos('CargaEmpleado');
                        
                      }
                  }
              },
              {
                location: 'before',
                template: function() {
                    return $("<div class='toolbar-label'><b>ID:</div>");
                }
              },
              {
                location: 'before',
                widget: 'dxNumberBox',
                options:{
                    width: 90,
                    min:0,
                    onInitialized: function(e) {  
                        $Num_Id_Interno = e.component;  
                    },
                    onEnterKey: function(e) {
                      self.DatosEmpleadosGet = null;
                      self.Frm_Datos_Empleado.resetValues();
                      self.Frm_Datos_Empleado.option('formData',{});
                      $("#imgEmpleado").css("background-image", "none");
                      
                      $Num_Id_Externo.option('value',0);  
                      if ($Num_Id_Interno.option('value') == 0 || $Num_Id_Interno.option('value') == null) {
                          DevExpress.ui.notify("Ingrese un valor en el campo de ID!!!");
                      }
                      else {
                        var data_obj_Empleado = {
                          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                          Type:localStorage.getItem('Type'),
                          EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                          EMPLEADO_CSC_EMPLEADO:$Num_Id_Interno.option('value')
                        };                
                        self.BuscaEmpleados(data_obj_Empleado)
                      }
                  },
                  buttons: [{
                    name: 'btn_BuscarEmpleadoID',
                    location: 'after',
                    options: {
                      stylingMode: 'Contained',
                      icon: 'search',
                      type: 'normal',
                      readOnly: false,
                      onClick(e) {
                        self.DatosEmpleadosGet = null;
                        self.Frm_Datos_Empleado.resetValues();
                        self.Frm_Datos_Empleado.option('formData',{});
                        $("#imgEmpleado").css("background-image", "none");
                        
                        $Num_Id_Externo.option('value',0);  
                        if ($Num_Id_Interno.option('value') == 0 || $Num_Id_Interno.option('value') == null) {
                            DevExpress.ui.notify("Ingrese un valor en el campo de ID!!!");
                        } else {
                            var data_obj_Empleado = {
                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type:localStorage.getItem('Type'),
                                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                EMPLEADO_CSC_EMPLEADO:$Num_Id_Interno.option('value')
                            };                
                            self.BuscaEmpleados(data_obj_Empleado)
                        }
                      }
                    }
                  }]
                }
              },
              {
                location: 'before',
                template: function() {
                    return $("<div class='toolbar-label'><b>"+Globalize.formatMessage("NoEmp")+":</div>");
                }
              },            
              {
                location: 'before',
                widget: 'dxTextBox',
                options:{
                    width: 90,
                    onInitialized: function(e) {  
                        $Num_Id_Externo = e.component;  
                    },
                    onEnterKey: function(e) {
                      self.Frm_Datos_Empleado.resetValues();
                      self.Frm_Datos_Empleado.option('formData',{});
                      $("#imgEmpleado").css("background-image", "none");
                      
                      $Num_Id_Interno.option('value',0);
                      if ($Num_Id_Externo.option('value') == 0 || $Num_Id_Externo.option('value') == null) {
                          DevExpress.ui.notify(`Ingrese un valor en el campo de  ${Globalize.formatMessage("NoEmp")}`);
                      }
                      else {
                        var data_obj_Empleado = {
                          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                          Type:localStorage.getItem('Type'),
                          EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                          EMPLEADO_ID_EXTERNO:$Num_Id_Externo.option('value')
                        };                
                        self.BuscaEmpleados(data_obj_Empleado); 
                      }
                    },
                    buttons: [{
                      name: 'btn_BuscarEmpleadoNomina',
                      location: 'after',
                      options: {
                          stylingMode: 'Contained',
                          icon: 'search',
                          type: 'normal',
                          readOnly: false,
                          onClick(e) {
                            self.Frm_Datos_Empleado.resetValues();
                            self.Frm_Datos_Empleado.option('formData',{});
                            $("#imgEmpleado").css("background-image", "none");
                            
                            $Num_Id_Interno.option('value',0);
                            if ($Num_Id_Externo.option('value') == 0 || $Num_Id_Externo.option('value') == null) {
                                DevExpress.ui.notify(`Ingrese un valor en el campo de  ${Globalize.formatMessage("NoEmp")}`);
                            } else {
                                var data_obj_Empleado = {
                                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                    Type:localStorage.getItem('Type'),
                                    EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                    EMPLEADO_ID_EXTERNO:$Num_Id_Externo.option('value')
                                };                
                                self.BuscaEmpleados(data_obj_Empleado); 
                            }
                          }
                      }
                    }]
                }
              },
              /** BOTONERA ALTA */
              {
                  location: 'before',
                  widget: 'dxButton',
                  locateInMenu: 'auto',
                  options: {
                      icon: 'plus',
                      text: 'Alta',
                      type: 'default',
                      onInitialized: function(e) {  
                          $btn_Alta_Empleado = e.component;
                      },
                      onClick() {

                        loadPanel.show();

                        $btn_Alta_Empleado.option('visible',false);
                        $btn_Modificar_Empleado.option('visible',false);
                        $btn_Cancelar_Alta_Empleado.option('visible',true);
                        $btn_Salvar_Alta_Empleado.option('visible',true);
                        

                        $btn_Busca_Avanzada_Empleado.option("disabled",true);
                        $Num_Id_Interno.option("disabled",true);
                        $Num_Id_Externo.option("disabled",true);

                        $("#imgEmpleado").css("background-image", "none");

                        self.setDefaultValues = true;
                        self.onBarraClickAlta();

                        self.Switch_Boton_Buscar_codigo_postal();
                        loadPanel.hide();

                        self.Frm_Datos_Empleado.getEditor('NOMBRE_JEFE_INMEDIATO').option('value', self.NombreAutor);
                        self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO_PADRE').option('value', obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO);
                        
                      },
                  },
              },
              {
                  location: 'before',
                  widget: 'dxButton',
                  locateInMenu: 'auto',
                  options: {
                      icon: 'save',
                      text: 'Salvar',
                      type: 'success',
                      onInitialized: function(e) {  
                          $btn_Salvar_Alta_Empleado = e.component;
                      },
                      onClick() {
                        loadPanel.show();
                        $btn_Salvar_Alta_Empleado.option("disabled",true);
                        self.onClickAlta_Empleado();
                        $("#imgEmpleado").css("background-image", "none");
                      },
                  },
              },
              {
                  location: 'after',
                  widget: 'dxButton',
                  locateInMenu: 'auto',
                  options: {
                      icon: 'clear',
                      text: 'Cancelar',
                      type: 'danger',
                      onInitialized: function(e) {  
                          $btn_Cancelar_Alta_Empleado = e.component;
                      },
                      onClick() {
                          loadPanel.show();
                          $btn_Alta_Empleado.option('visible',true);
                          $btn_Modificar_Empleado.option('visible',true);
                          $btn_Cancelar_Alta_Empleado.option('visible',false);
                          $btn_Salvar_Alta_Empleado.option('visible',false);
                          self.Frm_Datos_Empleado.resetValues();
                          self.Frm_Datos_Empleado.option('formData',{});
                          self.Frm_Datos_Empleado.option('readOnly', true);
                          
                          $btn_Busca_Avanzada_Empleado.option("disabled",false);
                          $Num_Id_Interno.option("disabled",false);
                          $Num_Id_Externo.option("disabled",false);

                          $("#imgEmpleado").css("background-image", "none");

                          self.Switch_Boton_Buscar_codigo_postal();
                          loadPanel.hide();
                      },
                  },
              },
              /** //BOTONERA ALTA */
              /** BOTONERA MODIFICAR */
              {
                  location: 'after',
                  widget: 'dxButton',
                  locateInMenu: 'auto',
                  options: {
                    icon: 'edit',
                    text: 'Modificar',
                    type: 'normal',
                    onInitialized: function(e) {  
                        $btn_Modificar_Empleado = e.component;
                    },
                    onClick() {

                      loadPanel.show();
                      if (self.DatosEmpleadosGet == null) {
                        DevExpress.ui.notify({message: `No ha seleccionado un empleado`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                        loadPanel.hide();
                        return;
                      } 
                      
                      $btn_Modificar_Empleado.option('visible',false);
                      $btn_Alta_Empleado.option('visible',false);
                      $btn_Salvar_Modifica_Empleado.option('visible',true);
                      $btn_Cancelar_Modificar_Empleado.option('visible',true);

                      $btn_Busca_Avanzada_Empleado.option("disabled",true);
                      $Num_Id_Interno.option("disabled",true);
                      $Num_Id_Externo.option("disabled",true);
                      
                      self.setDefaultValues = true;
                      self.Frm_Datos_Empleado.option('readOnly', false);
                      const cmp_NOMBRE_JEFE_INMEDIATO = self.Frm_Datos_Empleado.getEditor('NOMBRE_JEFE_INMEDIATO');  
                      //cmp_NOMBRE_JEFE_INMEDIATO.option("buttons[0].options.disabled", false);
                      

                      self.Switch_Boton_Buscar_codigo_postal();
                      
                      loadPanel.hide();
                    },
                  },
              },
              {
                  location: 'before',
                  widget: 'dxButton',
                  locateInMenu: 'auto',
                  options: {
                      icon: 'refresh',
                      text: 'Actualizar',
                      type: 'success',
                      onInitialized: function(e) {  
                          $btn_Salvar_Modifica_Empleado = e.component;
                      },
                      onClick() {
                        self.ActualizaDatosEmpleado();
                      },
                  },
              },
              {
                  location: 'after',
                  widget: 'dxButton',
                  locateInMenu: 'auto',
                  options: {
                      icon: 'clearsquare',
                      text: 'Cancelar',
                      type: 'danger',
                      onInitialized: function(e) {  
                          $btn_Cancelar_Modificar_Empleado = e.component;
                      },
                      onClick() {
                        loadPanel.show();
                        $btn_Modificar_Empleado.option('visible',true);
                        $btn_Alta_Empleado.option('visible',true);
                        $btn_Salvar_Modifica_Empleado.option('visible',false);
                        $btn_Cancelar_Modificar_Empleado.option('visible',false);
                        self.Frm_Datos_Empleado.resetValues();
                        self.Frm_Datos_Empleado.option('formData',{});

                        var StringInfoForm = JSON.stringify(self.DatosEmpleadosGet);
                        self.DatosEmpleadosGet = JSON.parse(StringInfoForm);
                        self.Frm_Datos_Empleado.updateData(self.DatosEmpleadosGet);
                        self.Frm_Datos_Empleado.option('readOnly', true);
                        
                        $btn_Busca_Avanzada_Empleado.option("disabled",false);
                        $Num_Id_Interno.option("disabled",false);
                        $Num_Id_Externo.option("disabled",false);
                        self.Switch_Boton_Buscar_codigo_postal();

                        loadPanel.hide();

                        var data_obj_Empleado = {
                          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                          Type:localStorage.getItem('Type'),
                          EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                          EMPLEADO_UNIQUE_ID: self.DatosEmpleadosGet.EMPLEADO_UNIQUE_ID
                      };               
                      self.BuscaEmpleados(data_obj_Empleado, 'CargaDatos');
                      },
                  },
              }
              /** //BOTONERA MODIFICAR */
              
          ],
        }).dxToolbar('instance');


        self.Frm_Datos_Empleado = $("#dxFrmDetEmp").dxForm({
            readOnly: true,
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: "Validacion_Frm_",
            colCount: 4,
            labelMode: 'static',
            labelLocation: 'top',
            items: [
              //! Items Ocultos
              {
                itemType: "group",
                colCount: 8,
                colSpan: 4,
                cssClass:"hidden_box",
                items: [
                  {
                    dataField: "EMPLEADO_UNIQUE_ID",
                    label: {
                      text: "EMPLEADO UNIQUE ID"
                    },
                    editorType: "dxTextBox",
                    colSpan: 4,
                    editorOptions: {
                      readOnly: true,
                      valueChangeEvent: "keyup"
                    },
                    validationRules: [
                      {
                        type: "required",
                        message: "requerido"
                      },
                      {
                        type: "stringLength",
                        max: 50,
                        message: "Maximo 50 caractres"
                      }
                    ]
                  },
                ]
              },
              //! Items Ocultos
              {
              itemType: "group",
              colCount: 8,
              colSpan: 2,
              items: [
                {
                  colSpan: 8,
                  template: `<div class='heading_InnerFrmForms'>
                    <div class='div__img'>
                      <img src='./images/Icons/Student-id-icon64.png' /> 
                    </div> 
                    <h2>Información Personal</h2>
                  </div>`,
                },
                {
                  itemType: "group",
                  colSpan: 8,
                  colCount: 8,
                  cssClass:"border_conteiner_empleado",
                  items: [
                    
                    {
                      dataField: "EMPLEADO_CSC_EMPLEADO",
                      label: {
                        text: "Id"
                      },
                      editorType: "dxNumberBox",
                      colSpan: 4,
                      editorOptions: {
                        readOnly: true
                      }
                    },
                    {
                      dataField: "EMPLEADO_ID_EXTERNO",
                      label: {
                        text: Globalize.formatMessage("NoEmp"),
                      },
                      editorType: "dxTextBox",
                      colSpan: 4,
                      editorOptions: {
                        valueChangeEvent: "change",
                        onValueChanged: function(e) {
                          if (e.value == null || e.value == "") {
                            return
                          }
                          if (self.DatosEmpleadosGet == null) {
                            console.log(e.value);
                            var data_obj_Empleado = {
                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type:localStorage.getItem('Type'),
                                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                EMPLEADO_ID_EXTERNO: e.value,
                                ESTATUS_PROCESO_EMP_CSC: 2,
                                TIPO_CONSULTA: "AVANZADO"
                            };              
                            self.BuscaEmpleados(data_obj_Empleado, "Validacion").then((ValidaEmp)=>{
                              console.log(ValidaEmp);
                              if (ValidaEmp == true) {
    
                                var result = DevExpress.ui.dialog.custom({
                                  title: Globalize.formatMessage("_lbl_title_confirma_cancel"),  
                                  messageHtml: "<div style='text-align:center'> <img src='../../images/AsisVritual_Warning.svg' width='120'> <br> <i>"+Globalize.formatMessage("_lbl_confrma_cancel")+"</i></div>",   
                                  buttons: [  
                                  {  
                                      text:  'Entendido',  
                                      onClick: function() {
                                        $btn_Alta_Empleado.option('visible',true);
                                        $btn_Modificar_Empleado.option('visible',true);
                                        $btn_Cancelar_Alta_Empleado.option('visible',false);
                                        $btn_Salvar_Alta_Empleado.option('visible',false);
                                        self.Frm_Datos_Empleado.resetValues();
                                        self.Frm_Datos_Empleado.option('formData',{});
                                        self.Frm_Datos_Empleado.option('readOnly', true);

                                        $btn_Salvar_Modifica_Empleado.option('visible',false);
                                        $btn_Cancelar_Modificar_Empleado.option('visible',false);
                                        
                                        $btn_Busca_Avanzada_Empleado.option("disabled",false);
                                        $Num_Id_Interno.option("disabled",false);
                                        $Num_Id_Externo.option("disabled",false);

                                        self.Switch_Boton_Buscar_codigo_postal();
                                        
                                        return true  
                                      }  
                                  }],  
                                }); 
                                result.show();
                              } else {
                                
                              }
                            });
                          }
                        },
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          min: 1,
                          message: "Minimo 1 caracteres"
                        },
                        {
                          type: "required",
                          message: "requerido"
                        },
                        {
                          type: "stringLength",
                          max: 50,
                          message: "Maximo 50 caractres"
                        }
                      ]
                    },
                    {
                      dataField: "EMPLEADO_NOMBREEMPLEADO",
                      label: {
                        text: "Nombre(s)"
                      },
                      editorType: "dxTextBox",
                      colSpan: 4,
                      editorOptions: {
                        valueChangeEvent: "keyup",
                        onValueChanged: function (e) {
                          if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                        }
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          min: 1,
                          message: "Minimo 1 caracteres"
                        },
                        {
                          type: "required",
                          message: "requerido"
                        },
                        {
                          type: "stringLength",
                          max: 50,
                          message: "Maximo 50 caractres"
                        }
                      ]
                      },
                    {
                      dataField: "EMPLEADO_APATERNOEMPLEADO",
                      label: {
                        text: "A. Paterno"
                      },
                      editorType: "dxTextBox",
                      colSpan: 4,
                      editorOptions: {
                        valueChangeEvent: "keyup",
                        onValueChanged: function (e) {
                          if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                        }
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          min: 1,
                          message: "Minimo 1 caracteres"
                        },
                        {
                          type: "required",
                          message: "requerido"
                        },
                        {
                          type: "stringLength",
                          max: 50,
                          message: "Maximo 50 caractres"
                        }
                      ]
                    },
                    {
                      dataField: "EMPLEADO_AMATERNOEMPLEADO",
                      label: {
                        text: "A. Materno"
                      },
                      editorType: "dxTextBox",
                      colSpan: 4,
                      editorOptions: {
                        valueChangeEvent: "keyup",
                        onValueChanged: function (e) {
                          if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                        }
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          min: 1,
                          message: "Minimo 1 caracteres"
                        },
                        {
                          type: "required",
                          message: "requerido"
                        },
                        {
                          type: "stringLength",
                          max: 50,
                          message: "Maximo 50 caractres"
                        }
                      ]
                    },
                    {
                      dataField: "EMPLEADO_RFC",
                      label: {
                        text: "R.F.C."
                      },
                      editorType: "dxTextBox",
                      colSpan: 4,
                      editorOptions: {
                        valueChangeEvent: "keyup",
                        onValueChanged: function (e) {
                          if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                        },
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        },
                        {
                          type: "stringLength",
                          max: 20,
                          message: "Maximo 20 caractres"
                        },
                        {
                          type: "stringLength",
                          min: 10,
                          message: "Minimo 10 caractres"
                        }
                      ]
                    },
                    {
                      colSpan:8,
                      dataField: "EMPLEADO_TELEFONO1",
                      editorType: "dxNumberBox",
                      label: {
                          text: 'Teléfono'
                      },
                      editorOptions: {
                          // mode: 'email',
                          // valueChangeEvent: "keyup",
                          // onValueChanged: function (e) {
                          //     if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toLowerCase());}
                          // }
                      },
                      validationRules: [{
                          type: "required",
                          message: "requerido"
                      }]
                  },
                  ]
                },
                {
                  colSpan: 8,
                  template: `<div class='heading_InnerFrmForms' style='margin-top: -6px; margin-bottom: 3px;' >
                    <div class='div__img'>
                      <img src='./images/Icons/icono_30.png' />
                    </div>
                    <h2>Datos laborales</h2>
                  </div>`,
                },
                {
                  itemType: "group",
                  colSpan: 8,
                  colCount: 8,
                  cssClass:"border_conteiner_empleado",
                  items: [
                    {
                      colSpan: 8,
                      editorType: "dxSelectBox",
                      dataField: "EMPRESA_LABORAL_CSC",
                      label: {
                        text: "Empresa laboral"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "EMPRESA_LABORAL_RAZONSOCIALNOMBRE",
                        valueExpr: "EMPRESA_LABORAL_CSC",
                        dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,    
                            load: async function (e) {
                                try {
                                    var _ary = {Tbl:"SAMT_EMPRESA_LABORAL"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            return all_data.JsonData;
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            },
                            onError: async function (e) {
                              try {
                                  var _ary = {Tbl:"SAMT_EMPRESA_LABORAL"};
                                  return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                      if (all_data.success == true){
                                          return all_data.JsonData;
                                      }
                                      else {
                                          console.log(all_data.message);
                                      }
                                  });
                              }
                              catch (error) {
                                  console.log(error);
                              }
                          },
                        }),
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            var CargaTodo = setInterval(() => {
                                dtsSource = e.component.getDataSource().items();
                                if (dtsSource.length == 0) {
                                    
                                } else {
                                    clearInterval(CargaTodo);
                                    self.EMPRESA_LABORAL_CSC = dtsSource;
                                    if (self.LoadCatFull == false) {
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.EMPRESA_LABORAL_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                    }
                                    
                                    return;
                                } 
                            }, 1);
                            
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.EMPRESA_LABORAL_CSC);
                        },
                        onValueChanged: function (e) {
                          
                        },
                      },
                      validationRules: [{
                        type: "required",
                        message: "Campo requerido"
                      }]
                    },
                    {
                      colSpan: 8,
                      editorType: "dxTextBox",
                      dataField: "EMPLEADO_EMAILLABORAL",
                      label: {
                        text: "Correo laboral"
                      },
                      editorOptions: {
                        valueChangeEvent: "keyup"
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "Campo requerido"
                        },
                        {
                          type: 'email',
                          message: 'Correo invalido',
                        },
                        {
                          type: "stringLength",
                          max: 50,
                          message: "Maximo 50 caractres"
                        }
                      ]
                    },
                    {
                      colSpan: 8,
                      editorType: "dxDateBox",
                      dataField: "EMPLEADO_FECH_INGRESOEMP",
                      label: {
                        text: "Fecha de ingreso"
                      },
                      editorOptions: {
                        acceptCustomValue:false,
                        adaptivityEnabled:true,
                        pickerType:"rollers",
                        type: "datetime",
                        placeholder: "DD/MM/AAAA",
                        displayFormat: "dd/MM/yyyy",
                        dateSerializationFormat: "yyyy-MM-dd",
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                    },
                    {
                      colSpan: 8,
                      editorType: "dxSelectBox",
                      dataField: "REQ_CSCREQUISICION",
                      label: {
                        text: "Ubicación laboral"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "REQ_NOMBREAREA",
                        valueExpr: "REQ_CSCREQUISICION",
                        dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,    
                            load: async function (e) {
                                try {
                                    var _ary = {Tbl:"SAMT_REQUISICIONES"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            return all_data.JsonData;
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            },
                            onError: async function (e) {
                              try {
                                  var _ary = {Tbl:"SAMT_REQUISICIONES"};
                                  return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                      if (all_data.success == true){
                                          return all_data.JsonData;
                                      }
                                      else {
                                          console.log(all_data.message);
                                      }
                                  });
                              }
                              catch (error) {
                                  console.log(error);
                              }
                          },
                        }),
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            var CargaTodo = setInterval(() => {
                                dtsSource = e.component.getDataSource().items();
                                if (dtsSource.length == 0) {
                                    
                                } else {
                                    clearInterval(CargaTodo);
                                    self.EMPLEADO_SITE_CSC = dtsSource;
                                    if (self.LoadCatFull == false) {
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.ESTATUS_REQUISICION_CSC == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                    }
                                    
                                    return;
                                } 
                            }, 1);
                            
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.EMPLEADO_SITE_CSC);
                        },
                        onValueChanged: function (e) {
                          var newValue = e.value;
                        },
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                      
                    },
                    
                    {
                      colSpan: 8,
                      editorType: "dxSelectBox",
                      dataField: "TIPO_UBICACION_LABORAL_CSC",
                      label: {
                        text: "Ámbito laboral"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "TIPO_UBICACION_IDIOMA1",
                        valueExpr: "TIPO_UBICACION_LABORAL_CSC",
                        dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,    
                            load: async function (e) {
                                try {
                                    var _ary = {Tbl:"SAMT_TIPO_UBICACION_LABORAL"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            return all_data.JsonData;
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            },
                            onError: async function (e) {
                              try {
                                  var _ary = {Tbl:"SAMT_TIPO_UBICACION_LABORAL"};
                                  return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                      if (all_data.success == true){
                                          return all_data.JsonData;
                                      }
                                      else {
                                          console.log(all_data.message);
                                      }
                                  });
                              }
                              catch (error) {
                                  console.log(error);
                              }
                          },
                        }),
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            var CargaTodo = setInterval(() => {
                                dtsSource = e.component.getDataSource().items();
                                if (dtsSource.length == 0) {
                                    
                                } else {
                                    clearInterval(CargaTodo);
                                    self.TIPO_UBICACION_LABORAL_CSC = dtsSource;
                                    if (self.LoadCatFull == false) {
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.TIPO_UBICACION_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                    }
                                    
                                    return;
                                } 
                            }, 1);
                            
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.TIPO_UBICACION_LABORAL_CSC);
                        },
                        onValueChanged: function (e) {
                          
                        },
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                    },

                    {
                      colSpan: 4,
                      editorType: "dxSelectBox",
                      dataField: "CAT_AREA_CSC",
                      label: {
                        text: "Direccion"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "TIPO_AREA_IDIOMA1",
                        valueExpr: "TIPO_AREA_CSC",
                        dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,    
                            load: async function (e) {
                                try {
                                    var _ary = {Tbl:"SAMT_CAT_EMPLEADO_AREA"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            return all_data.JsonData;
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            },
                            onError: async function (e) {
                              try {
                                  var _ary = {Tbl:"SAMT_CAT_EMPLEADO_AREA"};
                                  return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                      if (all_data.success == true){
                                          return all_data.JsonData;
                                      }
                                      else {
                                          console.log(all_data.message);
                                      }
                                  });
                              }
                              catch (error) {
                                  console.log(error);
                              }
                          },
                        }),
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            var CargaTodo = setInterval(() => {
                                dtsSource = e.component.getDataSource().items();
                                if (dtsSource.length == 0) {
                                    
                                } else {
                                    clearInterval(CargaTodo);
                                    self.SAMT_CAT_EMPLEADO_AREA_CSC = dtsSource;
                                    if (self.LoadCatFull == false) {
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.TIPO_AREA_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                    }
                                    
                                    return;
                                } 
                            }, 1);
                            
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.SAMT_CAT_EMPLEADO_AREA_CSC);
                        },
                        onValueChanged: function (e) {
                          
                        },
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                    },

                    {
                      colSpan: 4,
                      editorType: "dxSelectBox",
                      dataField: "TIPO_PERFIL_CSC",
                      label: {
                        text: "Puesto"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "SAMT_TIPO_PERFIL_IDIOMA1",
                        valueExpr: "SAMT_CSC_PERFIL",
                        dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,    
                            load: async function (e) {
                                try {
                                    var _ary = {Tbl:"SAMT_TIPO_EMPLEADO_PERFIL"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            return all_data.JsonData;
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            },
                            onError: async function (e) {
                              try {
                                  var _ary = {Tbl:"SAMT_TIPO_EMPLEADO_PERFIL"};
                                  return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                      if (all_data.success == true){
                                          return all_data.JsonData;
                                      }
                                      else {
                                          console.log(all_data.message);
                                      }
                                  });
                              }
                              catch (error) {
                                  console.log(error);
                              }
                          },
                        }),
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            var CargaTodo = setInterval(() => {
                                dtsSource = e.component.getDataSource().items();
                                if (dtsSource.length == 0) {
                                    
                                } else {
                                    clearInterval(CargaTodo);
                                    self.TIPO_PERFIL_CSC = dtsSource;
                                    if (self.LoadCatFull == false) {
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.SAMT_TIPO_PERFIL_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                    }
                                    
                                    return;
                                } 
                            }, 1);
                            
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.TIPO_PERFIL_CSC);
                        },
                        onValueChanged: function (e) {
                          
                        },
                      },
                      validationRules: [{
                        type: "required",
                        message: "Campo requerido"
                      }]
                    },
                    {
                      colSpan: 8,
                      editorType: "dxSelectBox",
                      dataField: "TIPO_TURNO_CSCTURNO",
                      label: {
                        text: "Turno"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "TIPO_TURNO_IDIOMA1",
                        valueExpr: "TIPO_TURNO_CSCTURNO",
                        dataSource: new DevExpress.data.DataSource({
                          loadMode: "raw", paginate: false,    
                          load: async function (e) {
                                try {
                                    var _ary = {Tbl:"SAMT_TIPO_TURNO_EMPLEADOS"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            return all_data.JsonData;
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            },
                            onError: async function (e) {
                              try {
                                  var _ary = {Tbl:"SAMT_TIPO_TURNO_EMPLEADOS"};
                                  return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                      if (all_data.success == true){
                                          return all_data.JsonData;
                                      }
                                      else {
                                          console.log(all_data.message);
                                      }
                                  });
                              }
                              catch (error) {
                                  console.log(error);
                              }
                          },
                        }),
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            var CargaTodo = setInterval(() => {
                                dtsSource = e.component.getDataSource().items();
                                if (dtsSource.length == 0) {
                                    
                                } else {
                                    clearInterval(CargaTodo);
                                    self.TIPO_TURNO_CSCTURNO = dtsSource;
                                    if (self.LoadCatFull == false) {
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.TIPO_TURNO_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                    }
                                    
                                    return;
                                } 
                            }, 1);
                            
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.TIPO_TURNO_CSCTURNO);
                        },
                      }
                    },
                    {
                      colSpan: 3,
                      editorType: "dxNumberBox",
                      dataField: "EMPLEADO_CSC_EMPLEADO_PADRE",
                      label: {
                        text: "Id Administrador de contrato"
                      },
                      editorOptions: {
                        readOnly: true
                      }
                    },
                    {
                      colSpan: 5,
                      editorType: "dxTextBox",
                      dataField: "NOMBRE_JEFE_INMEDIATO",
                      label: {
                        text: "Administrador de contrato"
                      },
                      editorOptions: {
                        readOnly: true,
                        // buttons: [{
                        //     name: 'btn_BuscarEmpleado',
                        //     location: 'after',
                        //     options: {
                        //         stylingMode: 'Contained',
                        //         icon: 'search',
                        //         type: 'normal',
                        //         readOnly: false,
                        //         onClick(e) {
                        //             self.BuscaEmpSoloActivos('JefeInmediato');
                        //         }
                        //     }
                        // }]
                      }
                    },
                  ]
                },
              ]
            },
            {
              itemType: "group",
              colCount: 8,
              colSpan: 2,
              items: [
                {
                  colSpan: 8,
                  template: `<div class='heading_InnerFrmForms'>
                    <div class='div__img'>
                      <img src='./images/Icons/Card-file-icon64.png' />
                    </div>
                    <h2>Proceso Operativo</h2>
                    </div>`,
                },
                {
                  itemType: "group",
                  colSpan: 8,
                  colCount: 8,
                  cssClass:"border_conteiner_empleado",
                  items: [
                    {
                      dataField: "CAT_PROCESO_EMP_CSC",
                      label: {
                        text: "Proceso"
                      },
                      editorType: "dxSelectBox",
                      colSpan: 4,
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "CAT_PROCESO_EMP_IDIOMA1",
                        valueExpr: "CAT_PROCESO_EMP_CSC",
                        dataSource: self._Cmb_Proceso_ObjData,
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            var CargaTodo = setInterval(() => {
                                dtsSource = e.component.getDataSource().items();
                                if (dtsSource.length == 0) {
                                    
                                } else {
                                    clearInterval(CargaTodo);
                                    self.CAT_PROCESO_EMP_CSC = dtsSource;
                                    if (self.LoadCatFull == false) {
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.CAT_PROCESO_EMP_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                    }
                                    
                                    return;
                                } 
                            }, 1);
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.CAT_PROCESO_EMP_CSC);
                        },
                        onValueChanged: function (e) {
                          var newValue = e.value;
                          /** Inicio Componentes */
                          const cmp_CAT_SUBPROCESO_EMP_CSC = self.Frm_Datos_Empleado.getEditor('CAT_SUBPROCESO_EMP_CSC');
                          const cmp_ESTATUS_PROCESO_EMP_CSC = self.Frm_Datos_Empleado.getEditor('ESTATUS_PROCESO_EMP_CSC');                      
                          const cmp_EMPLEADO_FECH_CAMBIO_PROCESO = self.Frm_Datos_Empleado.getEditor('EMPLEADO_FECH_CAMBIO_PROCESO');                      
                          /** Fin Componentes */
  
                          cmp_CAT_SUBPROCESO_EMP_CSC.option('value',null);
                          cmp_ESTATUS_PROCESO_EMP_CSC.option('value',null);
                          cmp_EMPLEADO_FECH_CAMBIO_PROCESO.option('value',null);
  
                          var processedArray = new DevExpress.data.query(self._Cmb_SubProceso_ObjData._array)
                          .filter([ "CAT_PROCESO_EMP_CSC", "=", newValue ])
                          .sortBy("CAT_SUBPROCESO_EMP_ORDEN").toArray();
                          cmp_CAT_SUBPROCESO_EMP_CSC.option('dataSource', processedArray);
                        },
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                    },
                    {
                      dataField: "CAT_SUBPROCESO_EMP_CSC",
                      label: {
                        text: "Sub Proceso"
                      },
                      editorType: "dxSelectBox",
                      colSpan: 4,
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "CAT_SUBPROCESO_EMP_IDIOMA1",
                        valueExpr: "CAT_SUBPROCESO_EMP_CSC",
                        dataSource: self._Cmb_SubProceso_ObjData,
                        onOpened: function(e){
                            var dtsSource = e.component.getDataSource().items();
                            self.CAT_SUBPROCESO_EMP_CSC = dtsSource;
                            if (self.LoadCatFull == false) {
                                var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                    return el.CAT_SUBPROCESO_EMP_ACTIVO == 1;
                                }).toList(); 
                                e.component.option('dataSource',__ActiveCat);
                            }
                        },
                        onClosed: function(e){
                            e.component.option('dataSource',self.CAT_SUBPROCESO_EMP_CSC);
                        },
                        onValueChanged: function (e) {
                          var newValue = e.value;
                          if (newValue == null) {
                            
                          }
                          else {
                            var item = e.component.option('selectedItem');
                            // ! Inicio Componentes
                            const cmp_CAT_SUBPROCESO_EMP_CSC = self.Frm_Datos_Empleado.getEditor('CAT_SUBPROCESO_EMP_CSC');  
                            const cmp_ESTATUS_PROCESO_EMP_CSC = self.Frm_Datos_Empleado.getEditor('ESTATUS_PROCESO_EMP_CSC');  
                            const cmp_EMPLEADO_FECH_CAMBIO_PROCESO = self.Frm_Datos_Empleado.getEditor('EMPLEADO_FECH_CAMBIO_PROCESO');                      
                            const cmp_EMPLEADO_FECH_BAJAEMPLEADO = self.Frm_Datos_Empleado.getEditor('EMPLEADO_FECH_BAJAEMPLEADO');                      
                            // ! Fin Componentes
  
                            item = e.component.option('selectedItem');
  
                            if (item == null) {
                                  
                            }
                            else {
                              var status = (self.DatosEmpleadosGet == null) ? 0 : self.DatosEmpleadosGet.CAT_SUBPROCESO_EMP_CSC;
  
                              self.Frm_Datos_Empleado.getEditor('ESTATUS_PROCESO_EMP_CSC').option('value',item.CAT_ESTATUS_PROCESO_EMP_CSC);
                              self.Frm_Datos_Empleado.getEditor('EMPLEADO_FECH_CAMBIO_PROCESO').option('value', moment().tz(self.TimeZoneEmpleado).format('YYYY-MM-DD HH:mm:ss'));
  
                              if (item.CAT_SUBPROCESO_EMP_CLAVE.trim() == 'BAJA') {
                                self.Frm_Datos_Empleado.itemOption("tabbed.CAT_EMP_TREE_BAJA_CSC", 'isRequired', true);
                                self.Frm_Datos_Empleado.itemOption("tabbed.EMPLEADO_FECH_BAJAEMPLEADO", 'isRequired', true);
                                self.Frm_Datos_Empleado.getEditor('CAT_EMP_TREE_BAJA_CSC').option("disabled",false);
                                self.Frm_Datos_Empleado.getEditor('EMPLEADO_FECH_BAJAEMPLEADO').option("disabled",false);
                              }
                              else {
                                self.Frm_Datos_Empleado.itemOption("tabbed.CAT_EMP_TREE_BAJA_CSC", 'isRequired', false);
                                self.Frm_Datos_Empleado.itemOption("tabbed.EMPLEADO_FECH_BAJAEMPLEADO", 'isRequired', false);
                                self.Frm_Datos_Empleado.getEditor('CAT_EMP_TREE_BAJA_CSC').option("disabled",true);
                                self.Frm_Datos_Empleado.getEditor('EMPLEADO_FECH_BAJAEMPLEADO').option("disabled",true);
                              }
                              
                              
                              //cmp_ESTATUS_PROCESO_EMP_CSC.option('value',item.CAT_ESTATUS_PROCESO_EMP_CSC);
                              //cmp_EMPLEADO_FECH_CAMBIO_PROCESO.option('value', moment().tz(self.TimeZoneEmpleado).format('YYYY-MM-DD HH:mm:ss'));
                                
                            }
                          }
                          
                        }
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                    },
                    {
                      dataField: "ESTATUS_PROCESO_EMP_CSC",
                      label: {
                        text: "Estatus"
                      },
                      editorType: "dxSelectBox",
                      colSpan: 4,
                      editorOptions: {
                        readOnly: true,
                        searchEnabled:false,
                        dataSource: self._Cmb_Estatus_Empl_ObjData,
                        displayExpr: "CAT_ESTATUS_PROCESO_EMP_IDIOMA1",
                        valueExpr: "CAT_ESTATUS_PROCESO_EMP_CSC",
                      }
                    },
                    {
                      dataField: "EMPLEADO_FECH_CAMBIO_PROCESO",
                      label: {
                        text: "Fecha sub proceso"
                      },
                      editorType: "dxDateBox",
                      colSpan: 4,
                      editorOptions: {
                        readOnly: true,
                        type: "datetime",
                        placeholder: "DD/MM/AAAA HH:mm:ss",
                        //useMaskBehavior: true,
                        displayFormat: "dd/MM/yyyy HH:mm:ss"
                      }
                    }
                  ]
                },
                {
                  colSpan: 8,
                  template: `<div class='heading_InnerFrmForms' style='margin-top: -6px; margin-bottom: 3px;' >
                    <div class='div__img'>
                      <img src='./images/Icons/ubicacion.png' />
                    </div>
                    <h2>Dirección</h2>
                  </div>`,
                },
                {
                  itemType: "group",
                  colSpan: 8,
                  colCount: 8,
                  cssClass:"border_conteiner_empleado",
                  items: [
                    {
                      colSpan: 4,
                      editorType: "dxSelectBox",
                      dataField: "EMPLEADO_DIRECCION_PAIS_CSCPAIS",
                      label: {
                        text: "País"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "country_name",
                        valueExpr: "PAI_CSCPAIS_DNA",
                        dataSource: self._CountryCodes_ObjData,
                        onValueChanged: function (e) {
                          var newValue = e.value;
                          var item = e.component.option('selectedItem') ;
                          if (item == null) {
                            self.Switch_Boton_Buscar_codigo_postal();
                            return;
                          }
  
                          self.Frm_Datos_Empleado.getEditor('EMPLEADO_DIRECCION_EDO_CSCESTADO').option('value', null);
                          var _ary = {PAI_CSCPAIS: newValue};
                          __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Estados_Adress','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                              if (all_data.success == true){
                                  self.Frm_Datos_Empleado.getEditor('EMPLEADO_DIRECCION_EDO_CSCESTADO').option('dataSource', all_data.JsonData);
                              }
                              else {
                                  self.Frm_Datos_Empleado.getEditor('EMPLEADO_DIRECCION_EDO_CSCESTADO').option('dataSource', []);
                              }
                          });

                          /** Inicio Componentes */
                          const EMPLEADO_ZONA_HORARIA_CLAVE = self.Frm_Datos_Empleado.getEditor('EMPLEADO_ZONA_HORARIA_CLAVE');
                          /** Fin Componentes */
                          EMPLEADO_ZONA_HORARIA_CLAVE.option('value',null);
                          
                          var processedArray = new DevExpress.data.query(self._TimeZones_ObjData._array)
                          .filter([ "country_code", "=", item.country_code ])
                          .sortBy("country_name").toArray();
                          EMPLEADO_ZONA_HORARIA_CLAVE.option('dataSource', processedArray);

                          self.Switch_Boton_Buscar_codigo_postal();
                          
                        },
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                    },
                    {
                      colSpan: 4,
                      editorType: "dxSelectBox",
                      dataField: "EMPLEADO_ZONA_HORARIA_CLAVE",
                      label: {
                        text: "Zona horaria"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "timeZoneCode",
                        valueExpr: "timeZoneCode",
                      },
                      onValueChanged: function (e) {
                        var newValue = e.value;
                      },
                      validationRules: [
                        {
                          type: "required",
                          message: "requerido"
                        }
                      ]
                    },
                    {
                      colSpan: 4,
                      editorType: "dxTextBox",
                      dataField: "EMPLEADO_DIRECCION_CODIGOPOSTAL",
                      label: {
                        text: "C.P."
                      },
                      editorOptions: {
                        valueChangeEvent: "keyup",
                        buttons: [{
                          name: 'btn_Buscar_cp',
                          location: 'after',
                          options: {
                            stylingMode: 'Contained',
                            icon: 'search',
                            type: 'default',
                            text:"Buscar",
                            disabled: true,
                            onInitialized: function(e) {  
                              $Btn_buscar_codigo_postal = e.component;
                            },
                            onClick(e) {
                              var cp = self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_CODIGOPOSTAL").option("value");
                                if(cp !== null){
                                    if(cp.length === 5){
                                        loadPanel.show();
                                        var RequestCp = {
                                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                            Type:localStorage.getItem('Type'),
                                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                            SFP_SOLICITUD_CP:cp
                                        };
                                        __Reques_ajax( getJSON(DeveloperType).ApiGeneral.url+'Get_CP_Adress', 'GET', RequestCp, getJSON(DeveloperType).ApiGeneral.token ).then((datacp)=>{
                                            if (datacp.success == true) {
                                              loadPanel.hide();
                                              if(datacp.count == 1 ){
                                                var Direccion = datacp.JsonData[0];
                                                self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_EDO_CSCESTADO").option("value",Direccion.ID_ESTADO);
                                                self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_MUNICIPIO").option("value",Direccion.MUNICIPIO);
                                                self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_COLONIA").option("value",Direccion.COLONIA);
                                              }
                                              else{
                                                self._Pop_Colonias_Codigo_Postal.show();
                                                $("#Datagrid_Colonias_Codigo_Postal").dxDataGrid("instance").option("dataSource",datacp.JsonData);
                                              }
                                            }
                                            else {
                                              loadPanel.hide();
                                              DevExpress.ui.notify( 'CODIGO POSTAL NO ENCONTRADO', 'error', 3000);
                                              console.log(datacp.message);
                                            }
                                        }); 
                                    }
                                    else{
                                        DevExpress.ui.notify( 'EL CODIGO POSTAL NO ES VALIDO', 'error', 3000);         
                                    }
                                }
                                else{
                                    DevExpress.ui.notify( 'EL CODIGO POSTAL NO ES VALIDO', 'error', 3000); 
                                }
                              
                            }
                          }
                        }]
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          max: 5,
                          message: "Maximo 5 caractres"
                        }
                      ]
                    },
                    {
                      colSpan: 4,
                      editorType: "dxSelectBox",
                      dataField: "EMPLEADO_DIRECCION_EDO_CSCESTADO",
                      label: {
                        text: "Estado"
                      },
                      editorOptions: {
                        searchEnabled:false,
                        displayExpr: "EDO_DESCESTADO",
                        valueExpr: "EDO_CSCESTADO",
                      }
                    },
                    {
                      colSpan: 4,
                      editorType: "dxTextBox",
                      dataField: "EMPLEADO_DIRECCION_MUNICIPIO",
                      label: {
                        text: "Del/Municipio"
                      },
                      editorOptions: {
                        valueChangeEvent: "keyup"
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          max: 50,
                          message: "Maximo 50 caractres"
                        }
                      ]
                    },
                    {
                      editorType: "dxTextBox",
                      colSpan: 4,
                      dataField: "EMPLEADO_DIRECCION_COLONIA",
                      label: {
                        text: "Colonia"
                      },
                      editorOptions: {
                        valueChangeEvent: "keyup"
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          max: 50,
                          message: "Maximo 50 caractres"
                        }
                      ]
                    },
                    {
                      dataField: "EMPLEADO_DIRECCION_CALLE",
                      label: {
                        text: "Calle"
                      },
                      editorType: "dxTextBox",
                      colSpan: 4,
                      editorOptions: {
                        valueChangeEvent: "keyup"
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          max: 200,
                          message: "Maximo 200 caractres"
                        }
                      ]
                    },
                    {
                      dataField: "EMPLEADO_DIRECCION_NUMERO_EXT",
                      label: {
                        text: "No. Exterior"
                      },
                      editorType: "dxTextBox",
                      colSpan: 2,
                      editorOptions: {
                        valueChangeEvent: "keyup"
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          max: 20,
                          message: "Maximo 20 caractres"
                        }
                      ]
                    },
                    {
                      dataField: "EMPLEADO_DIRECCION_NUMERO_INT",
                      label: {
                        text: "No. Interior"
                      },
                      editorType: "dxTextBox",
                      colSpan: 2,
                      editorOptions: {
                        valueChangeEvent: "keyup"
                      },
                      validationRules: [
                        {
                          type: "stringLength",
                          max: 20,
                          message: "Maximo 20 caractres"
                        }
                      ]
                    }
                  ]
                },
                {
                  colSpan: 8,
                  template: `<div class='heading_InnerFrmForms' style='margin-top: -6px; margin-bottom: 3px;'>
                    <div class='div__img'>
                      <img src='./images/Icons/order256.png' />
                    </div>
                    <h2>Baja</h2>
                  </div>`,
                },
                {
                  itemType: "group",
                  colSpan: 8,
                  colCount: 8,
                  cssClass:"border_conteiner_empleado",
                  items: [
                    {
                      colSpan: 8,
                      editorType: "dxDropDownBox",
                      dataField: "CAT_EMP_TREE_BAJA_CSC",
                      label: {
                        text: "Causa de baja"
                      },
                      editorOptions: {
                        deferRendering: false,
                        displayExpr: "EMP_TREE_IDIOMA1",
                        valueExpr: "EMP_TREE_BAJA_CSC",
                        onOpened: function(e){
                          //e.component.getDataSource().reload()
                        },
                        dataSource: new DevExpress.data.DataSource({
                          loadMode:'raw',
                          key: "EMP_TREE_BAJA_CSC", 
                          load: async function () {
                            try {
                                var allServicios = {Tbl:"SAMT_EMP_TREE_BAJA",WHR:"EMP_TREE_ACTIVO = 1 "};
                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                                    if (dataInsert.success == true) {    
                                        return dataInsert.JsonData;
                                    } else {
                                        console.log(dataInsert.message);
                                    }
                                }); 
                            } catch (error) {
                                console.log(error);
                            }
                          }
                        }),
                        contentTemplate: function(e){
                          var value = e.component.option("value"),
                          $treeView = $("<div>").dxTreeView({
                            dataSource: e.component.getDataSource(),
                            dataStructure: "plain",
                            autoExpandAll: true,
                            keyExpr: "EMP_TREE_BAJA_CSC",
                            parentIdExpr: "EMP_TREE_BAJA_PARENT",
                            selectionMode: "single",
                            displayExpr: "EMP_TREE_IDIOMA1",
                            selectByClick: true,
                            expandEvent: "click",
                            selectNodesRecursive: false,
                            onContentReady: function(args){
                                //console.log(args.component.option("value"));
                                syncTreeViewSelection(args.component, args.component.option("value"));
                            },
                            onItemSelectionChanged: function(args){
                              if (args.node.children.length == 0) {
                                self.DxDropBoxDxTreeSelectParent = false;
                                var selectedKeys = args.node.itemData.EMP_TREE_BAJA_CSC;
                                e.component.option("value", selectedKeys);
                              }
                              else {
                                  self.DxDropBoxDxTreeSelectParent = true;
                              }
                            }
                          });
                          
                          treeView = $treeView.dxTreeView("instance");
                          
                          e.component.on('valueChanged', (args) => {
                            setTimeout(() => {
                              syncTreeViewSelection(treeView, args.value);
                              if (self.DxDropBoxDxTreeSelectParent == true) {
                                  DevExpress.ui.notify({ message: 'Seleccione un valor del siguiente nivel', position: { my: 'top center',  at: 'top center'}},'error',5000);
                              } else {
                                  self.DxDropBoxDxTreeSelectParent = false;
                                  e.component.close();
                              }
                            }, 500);
                          });
                          
                          return $treeView;
                        }
                      }
                    },
                    {
                      colSpan: 8,
                      editorType: "dxDateBox",
                      dataField: "EMPLEADO_FECH_BAJAEMPLEADO",
                      label: {
                        text: "Fecha de Baja"
                      },
                      editorOptions: {
                        acceptCustomValue:false,
                        adaptivityEnabled:true,
                        pickerType:"rollers",
                        type: "date",
                        placeholder: "DD/MM/AAAA",
                        displayFormat: "dd/MM/yyyy",
                        dateSerializationFormat: "yyyy-MM-dd",
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }).dxForm("instance");



        $('#tooltip_btn_rfc').dxTooltip({
          target: '#btn_calcula_rfc',
          showEvent: 'mouseenter',
          hideEvent: 'mouseleave',
          hideOnOutsideClick: false,
        });


        $('#tooltip_btn_select_vacante').dxTooltip({
          target: '#btn_select_vacante',
          showEvent: 'mouseenter',
          hideEvent: 'mouseleave',
          hideOnOutsideClick: false
        });




        self.onBarraClickAlta = function(){
            self.Frm_Datos_Empleado.resetValues();
            self.Frm_Datos_Empleado.option('formData',{});
            self.Frm_Datos_Empleado.option('readOnly', false);
            self.LoadCatFull = false;
            const cmp_NOMBRE_JEFE_INMEDIATO = self.Frm_Datos_Empleado.getEditor('NOMBRE_JEFE_INMEDIATO');  
            //cmp_NOMBRE_JEFE_INMEDIATO.option("buttons[0].options.disabled", false);
            
            self.Frm_Datos_Empleado.getEditor('EMPLEADO_UNIQUE_ID').option('value', createUUID(36));
            self.DatosEmpleadosGet = null;
        }


        self.onClickAlta_Empleado = function(){
            loadPanel.show();
            //TODO: Se obtiene la fecha actual del servidor para las fechas que lo requieran 
            var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

            //! Valida Formularios 

            if (self.Frm_Datos_Empleado.validate().isValid === true) {
              /**
               * TODO: Se obtienen los datos del formulario y se recorren para detectar valores NULL
               * ! Obligatorio
               */
              var valuesNotNull = {};
              var _Obj_Datos_Fomrulario = self.Frm_Datos_Empleado.option('formData');
              for(var key in _Obj_Datos_Fomrulario){
                  if(_Obj_Datos_Fomrulario[key]){
                      valuesNotNull[key] = _Obj_Datos_Fomrulario[key];
                  }
              }

              var _Obj_Insert_Data_Formulario = valuesNotNull;
               // TODO: Agregar campos de auditoria
              _Obj_Insert_Data_Formulario.AUDITORIA_USU_ALTA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
              _Obj_Insert_Data_Formulario.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
              _Obj_Insert_Data_Formulario.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
              _Obj_Insert_Data_Formulario.AUDITORIA_FEC_ALTA = FechaActualSistema;
              _Obj_Insert_Data_Formulario.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
              _Obj_Insert_Data_Formulario.EMPLEADO_CVEESTATUS = 1;

              //* Si hay campos que se ingresan manualmente se tiene que formatear la fecha 
              
              if(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_CAMBIO_PROCESO){ //Se detecta si la fecha viene llena
                _Obj_Insert_Data_Formulario.EMPLEADO_FECH_CAMBIO_PROCESO = moment(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_CAMBIO_PROCESO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }
              /*
              if(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_INGRESOEMP){ //Se detecta si la fecha viene llena
                _Obj_Insert_Data_Formulario.EMPLEADO_FECH_INGRESOEMP = moment(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_INGRESOEMP).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }*/
              
              if(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_FIRMACONTRATO){ //Se detecta si la fecha viene llena
                _Obj_Insert_Data_Formulario.EMPLEADO_FECH_FIRMACONTRATO = moment(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_FIRMACONTRATO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }
              if(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_CAPACITACION){ //Se detecta si la fecha viene llena
                _Obj_Insert_Data_Formulario.EMPLEADO_FECH_CAPACITACION = moment(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_CAPACITACION).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }
              if(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_INICIAOPERACION){ //Se detecta si la fecha viene llena
                _Obj_Insert_Data_Formulario.EMPLEADO_FECH_INICIAOPERACION = moment(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_INICIAOPERACION).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }

              if(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_REINGRESO){ //Se detecta si la fecha viene llena
                _Obj_Insert_Data_Formulario.EMPLEADO_FECH_REINGRESO = moment(_Obj_Insert_Data_Formulario.EMPLEADO_FECH_REINGRESO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }

              //! Eliminar Objetos que no pertenecen a BD
              delete _Obj_Insert_Data_Formulario['NOMBRE_JEFE_INMEDIATO'];

              //! Objeto que se enviara al llamado del API
              var _Objeto_Inserta_Api = {
                  EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                  Type: localStorage.getItem('Type'),
                  EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                  DATA_INSERT: _Obj_Insert_Data_Formulario
              };

                __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado','POST',JSON.stringify(_Objeto_Inserta_Api),getJSON(DeveloperType).ApiRecursosHumanos.token).then(async (in_emp)=>{
                  if (in_emp.success == true) {
                    console.log(in_emp);
                      
                    DevExpress.ui.notify({message: `Empleado insertado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});            

                    $btn_Alta_Empleado.option('visible',true);
                    $btn_Modificar_Empleado.option('visible',true);
                    $btn_Salvar_Alta_Empleado.option('visible',false);
                    $btn_Salvar_Modifica_Empleado.option('visible',false);
                    $btn_Cancelar_Alta_Empleado.option('visible',false);
                    $btn_Cancelar_Modificar_Empleado.option('visible',false);

                    $btn_Busca_Avanzada_Empleado.option("disabled",false);
                    $Num_Id_Interno.option("disabled",false);
                    $Num_Id_Externo.option("disabled",false);

                    self.Frm_Datos_Empleado.option('readOnly', true);

                    self.Switch_Boton_Buscar_codigo_postal();

                    
                    await new Promise(function(resolve,reject){
                      var Select_Proceso_Empleado = $("#dxFrmDetEmp").dxForm("instance").getEditor("CAT_PROCESO_EMP_CSC").option("selectedItem");
                      var Select_Sub_Proceso_Empleado = $("#dxFrmDetEmp").dxForm("instance").getEditor("CAT_SUBPROCESO_EMP_CSC").option("selectedItem");
                      var Select_Estatus_Proceso_Empleado = $("#dxFrmDetEmp").dxForm("instance").getEditor("ESTATUS_PROCESO_EMP_CSC").option("selectedItem");
    
                      //console.log(Select_Proceso_Empleado);
                      //console.log(Select_Sub_Proceso_Empleado);
                      //console.log(Select_Estatus_Proceso_Empleado);
    
                      if(Select_Estatus_Proceso_Empleado.CAT_ESTATUS_PROCESO_EMP_CLAVE == "ACT"){
                        var PROCESO_BAJA = 0;
                      }
                      else{
                        var PROCESO_BAJA = 1;
                      }
    
                      var End_Bitacora_proceso = {
                        EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                        Type:localStorage.getItem('Type'),
                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                        EMPLEADO_CSC_EMPLEADO:in_emp.JsonData,
                        PROCESO_BAJA_EMPLEADO:PROCESO_BAJA,
                        EMPLEADO_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO
                      };
    
                      __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'UpdateFinalizaBitacoraDateProceso', "POST", JSON.stringify(End_Bitacora_proceso), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(resultdata){
                        if(_Obj_Insert_Data_Formulario.CAM_CSC_SERVICIO == undefined || _Obj_Insert_Data_Formulario.CAM_CSC_SERVICIO == null){
                          var Serv_Bitacora = 0;
                        }
                        else{
                          var Serv_Bitacora = _Obj_Insert_Data_Formulario.CAM_CSC_SERVICIO;
                        }

                        if(_Obj_Insert_Data_Formulario.EMPLEADO_CSC_EMPLEADO_PADRE == undefined || _Obj_Insert_Data_Formulario.EMPLEADO_CSC_EMPLEADO_PADRE == null){
                          var Emp_Responsable = 0;
                        }
                        else{
                          var Emp_Responsable = _Obj_Insert_Data_Formulario.EMPLEADO_CSC_EMPLEADO_PADRE;
                        }
    
                        var Insert_Bitacora_Proceso = {
                          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                          Type:localStorage.getItem('Type'),
                          DATA_INSERT:{
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            EMPLEADO_CSC_EMPLEADO:in_emp.JsonData,
                            CAM_CSC_SERVICIO: Serv_Bitacora,
                            CAT_PROCESO_EMP_CSC: Select_Proceso_Empleado.CAT_PROCESO_EMP_CSC,
                            CAT_SUBPROCESO_EMP_CSC: Select_Sub_Proceso_Empleado.CAT_SUBPROCESO_EMP_CSC,
                            CAT_ESTATUS_PROCESO_EMP_CSC: Select_Estatus_Proceso_Empleado.CAT_ESTATUS_PROCESO_EMP_CSC,
                            PROCESO_FECHA_INICIO:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            RESPONSABLE_EMPLEADO_CSC:Emp_Responsable,
                            AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                          }
                        };
    
                        __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Proceso_Detalle', 'POST', JSON.stringify(Insert_Bitacora_Proceso), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async (resultdata)=>{
                          resolve("resolve");
                        }).catch(function(e){
                          console.log(e);
                          reject("reject");
                        })
                      }).catch(function(e){
                        console.log(e);
                        reject("reject");
                      })
                    });

                    var data_obj_Empleado = {
                        EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                        Type:localStorage.getItem('Type'),
                        EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                        EMPLEADO_UNIQUE_ID: self.Frm_Datos_Empleado.option('formData').EMPLEADO_UNIQUE_ID
                    };               
                    self.BuscaEmpleados(data_obj_Empleado, 'CargaDatos');

                    $btn_Salvar_Alta_Empleado.option("disabled",false);
                    
                    loadPanel.hide();

                  }
                  else {
                      loadPanel.hide();
                  }
                }).catch(function(e){
                  console.log(e);
                  
                  loadPanel.hide();
                  DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                });
              
            } 
            else {

              // var AuxValidate = self.Frm_Datos_Empleado.validate();
              
              // var Primer_No_Valido = AuxValidate.brokenRules[0].validator.option("adapter").editor.option("name");

              // //console.log(Primer_No_Valido);

              // if(
              //   Primer_No_Valido === "CAT_CATEGORIA_PUESTO_CSC" ||
              //   Primer_No_Valido === "CAT_PUESTO_CSCEMPLEADO" ||
              //   Primer_No_Valido === "REQ_CSCREQUISICION" ||
              //   Primer_No_Valido === "CAT_AREA_CSC" ||
              //   Primer_No_Valido === "CAT_DEPARTAMENTO_CSC" ||
              //   Primer_No_Valido === "TIPO_EMPLEADO_EMPLEADO_CSC" ||
              //   Primer_No_Valido === "TIPO_TURNO_CSCTURNO" ||
              //   Primer_No_Valido === "TIPO_UBICACION_LABORAL_CSC" ||
              //   Primer_No_Valido === "EMPLEADO_FECH_INGRESOEMP" ||
              //   Primer_No_Valido === "EMPLEADO_FECH_FIRMACONTRATO" ||
              //   Primer_No_Valido === "EMPLEADO_FECH_CAPACITACION" ||
              //   Primer_No_Valido === "EMPLEADO_FECH_INICIAOPERACION" ||
              //   Primer_No_Valido === "EMPLEADO_FECH_REINGRESO" ||
              //   Primer_No_Valido === "CAT_EMP_TREE_BAJA_CSC" ||
              //   Primer_No_Valido === "EMPLEADO_FECH_BAJAEMPLEADO" ||
              //   Primer_No_Valido === "PM_CSC_PROYECTO" ||
              //   Primer_No_Valido === "CAM_CSC_SERVICIO"
              // ){
              //   $TabPanel_Empleado.option("selectedIndex",0);
              // }
              // else if(
              //   Primer_No_Valido === "EMPLEADO_ESTADO_CIVIL_CSC" ||
              //   Primer_No_Valido === "EMPRESA_LABORAL_CSC" ||
              //   Primer_No_Valido === "CAT_PROVEEDOR_CSC" ||
              //   Primer_No_Valido === "TIPO_FRECUENCIA_CSC" ||
              //   Primer_No_Valido === "TIPO_PERFIL_CSC" 
              // ){
              //   $TabPanel_Empleado.option("selectedIndex",1);
              // }

              // /*
              // AuxValidate.brokenRules.forEach(function(rule) {
              //   console.log(rule.validator.option("adapter").editor);
              //   console.log(rule.validator.option("adapter").editor.option("name"));
              // });*/

              $btn_Salvar_Alta_Empleado.option("disabled",false);
              loadPanel.hide();
              DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
            }
        }


        self.onClickActualiza_Empleado = function(){
            
        }


        self.BuscaEmpleados = function(_aryFiltroBusqueda,TipoConsulta = 'CargaDatos') {
          var _ObjDefault = {
              EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
              Type:localStorage.getItem('Type')
          };

          if ($Num_Id_Externo.option('value') != 0) {
            if ($Num_Id_Externo.option('value') != obj_DatosEmpleado.EMPLEADO_ID_EXTERNO) {
              _ObjDefault.EMPLEADO_CSC_EMPLEADO_PADRE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            }
          } else if ($Num_Id_Interno.option('value') != 0) {
            if ($Num_Id_Interno.option('value') != obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO) {
              _ObjDefault.EMPLEADO_CSC_EMPLEADO_PADRE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            }
          } 
            const ObjetoMergeBus = {..._ObjDefault, ..._aryFiltroBusqueda};
            return __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'GetEmpleado','GET',ObjetoMergeBus,getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                if (in_emp.success == true) {
                  if (TipoConsulta == 'Validacion') {
                    return true;
                  } 
                  else {
                    
                    var ConteoEmpleado = in_emp.JsonData.length;
                    var CargaFrm = null;                      
                    if (ConteoEmpleado >= 2) {
                      var __Reciente = jslinq(in_emp.JsonData).orderByDescending(function(el) {
                          return el.AUDITORIA_FEC_ALTA;
                      }).toList();
                      CargaFrm = __Reciente[0];
                    } else {
                      CargaFrm = in_emp.JsonData[0];
                    }
                    if(CargaFrm.EMPLEADO_FECH_CAMBIO_PROCESO){ //! Toma la fecha del servidor y le agrega o resta el UTC del Usuario
                      CargaFrm.EMPLEADO_FECH_CAMBIO_PROCESO = moment(CargaFrm.EMPLEADO_FECH_CAMBIO_PROCESO).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                    }
                    if(CargaFrm.EMPLEADO_FECH_INGRESOEMP){ //! Toma la fecha del servidor y le agrega o resta el UTC del Usuario
                      CargaFrm.EMPLEADO_FECH_INGRESOEMP = moment(CargaFrm.EMPLEADO_FECH_INGRESOEMP).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                    }
                    /*
                    if(CargaFrm.EMPLEADO_FECH_FIRMACONTRATO){  //! Toma la fecha del servidor y le agrega o resta el UTC del Usuario
                      CargaFrm.EMPLEADO_FECH_FIRMACONTRATO = moment(CargaFrm.EMPLEADO_FECH_FIRMACONTRATO).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                    }
                    */
                    if(CargaFrm.EMPLEADO_FECH_CAPACITACION){ //! Toma la fecha del servidor y le agrega o resta el UTC del Usuario
                      CargaFrm.EMPLEADO_FECH_CAPACITACION = moment(CargaFrm.EMPLEADO_FECH_CAPACITACION).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                    }
                    if(CargaFrm.EMPLEADO_FECH_INICIAOPERACION){ //! Toma la fecha del servidor y le agrega o resta el UTC del Usuario
                      CargaFrm.EMPLEADO_FECH_INICIAOPERACION = moment(CargaFrm.EMPLEADO_FECH_INICIAOPERACION).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                    }
                    if(CargaFrm.EMPLEADO_FECH_REINGRESO){ //! Toma la fecha del servidor y le agrega o resta el UTC del Usuario
                      CargaFrm.EMPLEADO_FECH_REINGRESO = moment(CargaFrm.EMPLEADO_FECH_REINGRESO).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                    }
                    var StringInfoForm = JSON.stringify(CargaFrm);
                    self.DatosEmpleadosGet = JSON.parse(StringInfoForm);
                    self.Frm_Datos_Empleado.updateData( self.DatosEmpleadosGet );

                    var imgLoginEm = null == self.DatosEmpleadosGet.EMPLEADO_PATHFOTO ? "none" : "url(data:image/png;base64," + toBase64(self.DatosEmpleadosGet.EMPLEADO_PATHFOTO.data) + ")";
                    

                    $("#imgEmpleado").css("background-image", `${imgLoginEm}`);
                    setTimeout(function(){
                      self.Refresh_Empleado_Mapa();
                    },2000);

                    self.Switch_Boton_Buscar_codigo_postal();
                    
                  }
                }
                else{
                  if (TipoConsulta == 'Validacion') {
                    return false;
                  }
                  self.DatosEmpleadosGet = null;
                  self.Frm_Datos_Empleado.updateData( {} );
                  DevExpress.ui.notify({message: `Empleado no localizado`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                }
            }).catch(function(e){
              console.log(e);
              DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
            });
        }


        self.Run = function() {
          
        }

          //! Componente para busqueda de empleados
        self.BuscaEmpSoloActivos = function (CamposLlena,selMode) {
            const  popupContentTemplate = function () {
                return $('<div>').append(
                    $("<div class='popup-property-details'>").append(
                        $("<div/>").attr("id", "DataGridEmpleadosBusqueda").dxDataGrid({
                            headerFilter: { visible: false },
                            dataSource: self._Obj_Empleados_Grid_iEmp,
                            selection: {
                                mode: selMode
                            },
                            height: 300,
                            filterRow: {
                                visible: true,
                                applyFilter: 'auto',
                            },
                            scrolling: {
                                useNative: false,
                                scrollByContent: true,
                                scrollByThumb: true,
                                showScrollbar: "always"
                            },
                            groupPanel: { visible: true },
                            grouping: {
                                autoExpandAll: true
                            },
                            paging: {
                                enabled: false,
                                pageIndex: 0,
                                pageSize: 20
                            },        
                            hoverStateEnabled: true,
                            showBorders: true,
                            showRowLines: true,
                            showColumnLines: true,
                            rowAlternationEnabled: true,
                            columnAutoWidth: false,
                            columns: [
                                {
                                    caption: "NO. DE EMPLEADO",
                                    dataField: "EMPLEADO_ID_EXTERNO",
                                    alignment: "left",
                                    width: 120
                                },
                                {
                                    caption: "NOMBRE",
                                    dataField: "NOMBRE",
                                    sortOrder: 'asc',
                                    alignment: "left"
                                },
                                {
                                    dataField: "ACCIONES",
                                    type: 'buttons',
                                    width: 110,
                                    buttons: [{
                                        text: 'Seleccionar',
                                        onClick(e) {
                                            switch (CamposLlena) {
                                                case 'JefeInmediato':
                                                  console.log(self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO').option('value'));
                                                  
                                                  if (self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO').option('value') != null) {
                                                    if (e.row.data.EMPLEADO_CSC_EMPLEADO === self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO').option('value')) {
                                                      DevExpress.ui.notify({message: `Acción no permitida - No puede ser Jefe Inmediato de sí mismo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                                      return;
                                                    } 
  
                                                    if (e.row.data.EMPLEADO_CSC_EMPLEADO_PADRE === self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO').option('value')) {
                                                      DevExpress.ui.notify({message: `Acción no permitida - Es Jefe Inmediato de ${e.row.data.NOMBRE}`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                                      return;
                                                    }
  
                                                    if (e.row.data.EMPLEADO_CSC_EMPLEADO === self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO_PADRE').option('value')) {
                                                      DevExpress.ui.notify({message: `Acción no permitida - ${e.row.data.NOMBRE}, Es el actual Jefe Inmediato`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                                      return;
                                                    }  
                                                  }

                                                  self.Frm_Datos_Empleado.getEditor('NOMBRE_JEFE_INMEDIATO').option('value', e.row.data.NOMBRE);
                                                  self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO_PADRE').option('value', e.row.data.EMPLEADO_CSC_EMPLEADO);
                                                  self._PopSearchEmpleado.hide();
                                                break;

                                                case 'CargaEmpleado':
                                                  var data_obj_Empleado = {
                                                      ...ReturnDefaultData_Init(),
                                                      EMPLEADO_CSC_EMPLEADO: e.row.data.EMPLEADO_CSC_EMPLEADO
                                                  };                
                                                  self.BuscaEmpleados(data_obj_Empleado)
                                                  self._PopSearchEmpleado.hide();
                                                break;

                                                case 'EmpleadoCapacitador':
                                                  if (e.row.data.EMPLEADO_CSC_EMPLEADO === self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO').option('value')) {
                                                    DevExpress.ui.notify({message: `Acción no permitida - No puede capacitarse a sí mismo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                                    return;
                                                  }

                                                  
                                                  self._PopSearchEmpleado.hide();
                                                break;
                                            }
                                        },
                                    }],
                                },
                            ],toolbar: {
                              items: [
                                {
                                  location: 'before',
                                  template: function() {
                                      return $("<div class='toolbar-label'><b>Proceso*:</div>");
                                  }
                                },
                                {
                                  location: 'before',
                                  widget: 'dxSelectBox',
                                  options: {
                                      dataSource: self._Cmb_Proceso_ObjData,
                                      displayExpr: "CAT_PROCESO_EMP_IDIOMA1",
                                      valueExpr: "CAT_PROCESO_EMP_CSC",
                                      onValueChanged(e) {
                                        var newValue = e.value;
                                        $_cmbSubProcesoSearch.option('value', null)
                                        $_cmbEstatusSearch.option('value', null)
                                        var processedArray = new DevExpress.data.query(self._Cmb_SubProceso_ObjData._array)
                                        .filter([ "CAT_PROCESO_EMP_CSC", "=", newValue ])
                                        .sortBy("CAT_SUBPROCESO_EMP_ORDEN").toArray();
                                        $_cmbSubProcesoSearch.option('dataSource', processedArray);
                                      },
                                      onOpened: function(e){
                                        var dtsSource = e.component.getDataSource().items();
                                        self._tempProceso = dtsSource;
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.CAT_PROCESO_EMP_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource',__ActiveCat);
                                      },
                                      onClosed: function(e){
                                        e.component.option('dataSource',self._tempProceso);
                                      },
                                      onInitialized: function(e) {  
                                        $_cmbProcesoSearch = e.component;
                                      },
                                  },
                                },
                                {
                                  location: 'before',
                                  template: function() {
                                      return $("<div class='toolbar-label'><b>Sub Proceso*:</div>");
                                  }
                                },
                                {
                                  location: 'before',
                                  widget: 'dxSelectBox',
                                  options: {
                                      dataSource: self._Cmb_SubProceso_ObjData,
                                      displayExpr: "CAT_SUBPROCESO_EMP_IDIOMA1",
                                      valueExpr: "CAT_SUBPROCESO_EMP_CSC",
                                      onValueChanged(e) {
                                        var item = e.component.option('selectedItem') ;
                                        if (item == null) {
                                          return;
                                        }
                                        $_cmbEstatusSearch.option('value',item.CAT_ESTATUS_PROCESO_EMP_CSC);
                                      },
                                      onOpened: function(e){
                                        var dtsSource = e.component.getDataSource().items();
                                        self._tempSubProc = dtsSource;
                                        var __ActiveCat =jslinq(dtsSource).where(function(el) {
                                            return el.CAT_SUBPROCESO_EMP_ACTIVO == 1;
                                        }).toList(); 
                                        e.component.option('dataSource', (CamposLlena == 'JefeInmediato') ? __ActiveCat : self._tempSubProc);
                                      },
                                      onClosed: function(e){
                                        e.component.option('dataSource',self._tempSubProc);
                                      },
                                      onInitialized: function(e) {  
                                        $_cmbSubProcesoSearch = e.component;
                                      },
                                  },
                                },
                                {
                                  location: 'before',
                                  template: function() {
                                      return $("<div class='toolbar-label'><b>Estatus:</div>");
                                  }
                                },
                                {
                                  location: 'before',
                                  widget: 'dxSelectBox',
                                  options: {
                                      dataSource: self._Cmb_Estatus_Empl_ObjData,
                                      displayExpr: "CAT_ESTATUS_PROCESO_EMP_IDIOMA1",
                                      valueExpr: "CAT_ESTATUS_PROCESO_EMP_CSC",
                                      readOnly: true,
                                      onValueChanged(e) {
                                      },
                                      onOpened: function(e){
                                      },
                                      onClosed: function(e){
                                        e.component.option('dataSource',self._Cmb_Estatus_Empl_ObjData);
                                      },
                                      onInitialized: function(e) {  
                                        $_cmbEstatusSearch = e.component;
                                      },
                                  },
                                },
                                {
                                  location: 'after',
                                  widget: 'dxButton',
                                  locateInMenu: 'auto',
                                  options: {
                                      icon: 'search',
                                      text: 'Buscar',
                                      type: 'default',
                                      onInitialized: function(e) {  
                                          $btn_Busca_Pop_Empleado = e.component;
                                      },
                                      onClick() {
                                        if ($_cmbProcesoSearch.option('value') == null
                                        || $_cmbSubProcesoSearch.option('value') == null
                                        || $_cmbEstatusSearch.option('value') == null) {
                                          DevExpress.ui.notify({message: `Llena los campos marcados con *`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                          return;
                                        } 
                                        self._Obj_Empleados_Grid_iEmp.clear()
                                        let _BusquedaEmpleados ={};
                                        let _UrlApi = null;
                                        let _FnName = null;
                                        _BusquedaEmpleados = {
                                            ...ReturnDefaultData_Init(),
                                            CAT_PROCESO_EMP_CSC: $_cmbProcesoSearch.option('value'),
                                            CAT_SUBPROCESO_EMP_CSC: $_cmbSubProcesoSearch.option('value'),
                                            ESTATUS_PROCESO_EMP_CSC: $_cmbEstatusSearch.option('value'),
                                            TIPO_CONSULTA: "AVANZADO",
                                            INFO: "ALLEMP",
                                            EMPLEADO_CSC_EMPLEADO_PADRE: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO
                                        };
                                        _UrlApi = 'ApiRecursosHumanos';
                                        _FnName = 'GetEmpleado';
                                        self.CargaEmpleadosBy(_BusquedaEmpleados,_UrlApi,_FnName);
                                      },
                                  },
                                }
                              ]
                          },
                        })
                    )
                );
            };
            self._Obj_Empleados_Grid_iEmp.clear();
            self._PopSearchEmpleado.option("title","Buscar Empleado");
            self._PopSearchEmpleado.option("height",'450');
            self._PopSearchEmpleado.option("width",'800');
            self._PopSearchEmpleado.option('contentTemplate', popupContentTemplate);
            self._PopSearchEmpleado.show();
        }


        self.CargaEmpleadosBy=(_Parametros,apiData,fnname)=>{
          loadPanel.show();
          __Reques_ajax(getJSON(DeveloperType)[apiData].url+fnname,'GET',_Parametros,getJSON(DeveloperType)[apiData].token).then((in_emp)=>{
              if (in_emp.success == true) {      
                  var selectedRowsData = in_emp.JsonData;
                  selectedRowsData.forEach(function(item) {
                      self._Obj_Empleados_Grid_iEmp.insert(item);
                  });
                  $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").refresh();
                  loadPanel.hide();
              } else{
                  DevExpress.ui.notify({message: `No se localizaron empleados`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                  $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").refresh();
                  loadPanel.hide();
              }
          }).catch(function(e){
              console.log(e);
              DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
              $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").refresh();
              loadPanel.hide();
          });
        }


        self.ActualizaDatosEmpleado = async function(){
          loadPanel.show();
          var StringInfoForm = JSON.stringify(self.DatosEmpleadosGet);
          self.DatosEmpleadosGet = JSON.parse(StringInfoForm);

          var Form_Data_Ticket_servicio = self.Frm_Datos_Empleado.option('formData');
          var _Obj_Data_Update_Frm = GetUpdateData(self.DatosEmpleadosGet, Form_Data_Ticket_servicio);
          delete _Obj_Data_Update_Frm['EMPLEADO_PATHFOTO'];
          var __ValidaCambios = Object.keys(_Obj_Data_Update_Frm).length === 0;
          var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

          if( self.Frm_Datos_Empleado.validate().isValid == true){
            if (__ValidaCambios == true) {
                loadPanel.hide();
                DevExpress.ui.notify({message: `No se detecto ningun cambio`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            } else {
              //* Si hay campos que se ingresan manualmente se tiene que formatear la fecha 
              
              if(_Obj_Data_Update_Frm.EMPLEADO_FECH_CAMBIO_PROCESO){ //Se detecta si la fecha viene llena
                _Obj_Data_Update_Frm.EMPLEADO_FECH_CAMBIO_PROCESO = moment(_Obj_Data_Update_Frm.EMPLEADO_FECH_CAMBIO_PROCESO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }

              if(_Obj_Data_Update_Frm.EMPLEADO_FECH_FIRMACONTRATO){ //Se detecta si la fecha viene llena
                _Obj_Data_Update_Frm.EMPLEADO_FECH_FIRMACONTRATO = moment(_Obj_Data_Update_Frm.EMPLEADO_FECH_FIRMACONTRATO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }

              if(_Obj_Data_Update_Frm.EMPLEADO_FECH_CAPACITACION){ //Se detecta si la fecha viene llena
                _Obj_Data_Update_Frm.EMPLEADO_FECH_CAPACITACION = moment(_Obj_Data_Update_Frm.EMPLEADO_FECH_CAPACITACION).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }

              if(_Obj_Data_Update_Frm.EMPLEADO_FECH_INICIAOPERACION){ //Se detecta si la fecha viene llena
                _Obj_Data_Update_Frm.EMPLEADO_FECH_INICIAOPERACION = moment(_Obj_Data_Update_Frm.EMPLEADO_FECH_INICIAOPERACION).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }

              if(_Obj_Data_Update_Frm.EMPLEADO_FECH_REINGRESO){ //Se detecta si la fecha viene llena
                _Obj_Data_Update_Frm.EMPLEADO_FECH_REINGRESO = moment(_Obj_Data_Update_Frm.EMPLEADO_FECH_REINGRESO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }

              /*
              if(_Obj_Data_Update_Frm.EMPLEADO_FECH_BAJAEMPLEADO){ //Se detecta si la fecha viene llena
                _Obj_Data_Update_Frm.EMPLEADO_FECH_BAJAEMPLEADO = moment(_Obj_Data_Update_Frm.EMPLEADO_FECH_BAJAEMPLEADO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
              }
              */

              
              _Obj_Data_Update_Frm.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
              _Obj_Data_Update_Frm.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;

              //! Eliminar Objetos que no pertenecen a BD
              delete _Obj_Data_Update_Frm['NOMBRE_JEFE_INMEDIATO'];
              

              if(_Obj_Data_Update_Frm.CAT_SUBPROCESO_EMP_CSC){
                console.log("Cambio de proceso");
                ///FALTA CODIGO PARA ACTUALIZAR PROCESO
                await new Promise(function(resolve,reject){
                  var Select_Proceso_Empleado = $("#dxFrmDetEmp").dxForm("instance").getEditor("CAT_PROCESO_EMP_CSC").option("selectedItem");
                  var Select_Sub_Proceso_Empleado = $("#dxFrmDetEmp").dxForm("instance").getEditor("CAT_SUBPROCESO_EMP_CSC").option("selectedItem");
                  var Select_Estatus_Proceso_Empleado = $("#dxFrmDetEmp").dxForm("instance").getEditor("ESTATUS_PROCESO_EMP_CSC").option("selectedItem");

                  //console.log(Select_Proceso_Empleado);
                  //console.log(Select_Sub_Proceso_Empleado);
                  //console.log(Select_Estatus_Proceso_Empleado);

                  if(Select_Estatus_Proceso_Empleado.CAT_ESTATUS_PROCESO_EMP_CLAVE == "ACT"){
                    var PROCESO_BAJA = 0;

                    if(self.DatosEmpleadosGet.CAT_EMP_TREE_BAJA_CSC !== null || self.DatosEmpleadosGet.EMPLEADO_FECH_BAJAEMPLEADO !== null ){
                      _Obj_Data_Update_Frm.CAT_EMP_TREE_BAJA_CSC = null;
                      _Obj_Data_Update_Frm.EMPLEADO_FECH_BAJAEMPLEADO = null;
                    }
                  }
                  else{
                    var PROCESO_BAJA = 1;
                  }

                  var End_Bitacora_proceso = {
                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                    Type:localStorage.getItem('Type'),
                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                    PROCESO_BAJA_EMPLEADO:PROCESO_BAJA,
                    EMPLEADO_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO
                  };

                  __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'UpdateFinalizaBitacoraDateProceso', "POST", JSON.stringify(End_Bitacora_proceso), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(resultdata){
                    if(self.DatosEmpleadosGet.CAM_CSC_SERVICIO == undefined || self.DatosEmpleadosGet.CAM_CSC_SERVICIO == null){
                      var Serv_Bitacora = 0;
                    }
                    else{
                      var Serv_Bitacora = self.DatosEmpleadosGet.CAM_CSC_SERVICIO;
                    }

                    var Insert_Bitacora_Proceso = {
                      EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                      Type:localStorage.getItem('Type'),
                      DATA_INSERT:{
                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                        EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                        CAM_CSC_SERVICIO: Serv_Bitacora,
                        CAT_PROCESO_EMP_CSC: Select_Proceso_Empleado.CAT_PROCESO_EMP_CSC,
                        CAT_SUBPROCESO_EMP_CSC: Select_Sub_Proceso_Empleado.CAT_SUBPROCESO_EMP_CSC,
                        CAT_ESTATUS_PROCESO_EMP_CSC: Select_Estatus_Proceso_Empleado.CAT_ESTATUS_PROCESO_EMP_CSC,
                        PROCESO_FECHA_INICIO:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                        RESPONSABLE_EMPLEADO_CSC:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO_PADRE,
                        AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                        AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                        AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                        AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                      }
                    };

                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Proceso_Detalle', 'POST', JSON.stringify(Insert_Bitacora_Proceso), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async (resultdata)=>{
                      resolve("resolve");
                    }).catch(function(){
                      reject("reject");
                    })
                  }).catch(function(){
                    reject("reject");
                  })
                });

                var Selected_Sub_Proceso = self.Frm_Datos_Empleado.getEditor("CAT_SUBPROCESO_EMP_CSC").option('selectedItem');


                if(Selected_Sub_Proceso.CAT_SUBPROCESO_EMP_CLAVE != null){
                  if (Selected_Sub_Proceso.CAT_SUBPROCESO_EMP_CLAVE.trim() == 'BAJA') {
                    if(self.DatosEmpleadosGet.TIPO_VACANTE_CSC != null){
                      if(self.DatosEmpleadosGet.TIPO_VACANTE_CSC != 0){
                        self._Pop_Confirma_Baja_Vacantes.show();
                      }
                    }
                  }
                }
              }

              var __Obj_Update = {
                  EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                  Type: localStorage.getItem('Type'),
                  EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                  DATA_UPDATE: _Obj_Data_Update_Frm,
                  DATA_WHERE:{
                      "EMPLEADO_CSC_EMPLEADO": self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                      "EMPLEADO_UNIQUE_ID": self.DatosEmpleadosGet.EMPLEADO_UNIQUE_ID,
                      "EMP_CSC_EMPRESA_HOST": self.DatosEmpleadosGet.EMP_CSC_EMPRESA_HOST
                  }
              };

              __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                if (in_emp.success == true) {
                  self.RestablecerBotonesEndUpdate();
                  //self.Obtener_Bitacora_Proceso_Empleado(self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO);
                  //self.Get_Informacion_Escolaridad();
                  DevExpress.ui.notify({message: `Empleado actualizado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                  
                  var data_obj_Empleado = {
                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                    Type:localStorage.getItem('Type'),
                    EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    EMPLEADO_UNIQUE_ID: self.DatosEmpleadosGet.EMPLEADO_UNIQUE_ID
                  };                
                  self.BuscaEmpleados(data_obj_Empleado, 'CargaDatos');
                  loadPanel.hide();
                }
                else {
                  loadPanel.hide();
                }
              }).catch(function(e){
                loadPanel.hide();
                DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
              });

            }
          } else {
            loadPanel.hide();
            DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
          }
        }


        self.RestablecerBotonesEndUpdate = function(){

          var Form_Data_Ticket_servicio = self.Frm_Datos_Empleado.option('formData');
          
          $btn_Alta_Empleado.option('visible',true);
          $btn_Modificar_Empleado.option('visible',true);
          $btn_Salvar_Alta_Empleado.option('visible',false);
          $btn_Salvar_Modifica_Empleado.option('visible',false);
          $btn_Cancelar_Alta_Empleado.option('visible',false);
          $btn_Cancelar_Modificar_Empleado.option('visible',false);

          $btn_Busca_Avanzada_Empleado.option("disabled",false);
          $Num_Id_Interno.option("disabled",false);
          $Num_Id_Externo.option("disabled",false);

          self.Frm_Datos_Empleado.option('readOnly', true);

          if (Form_Data_Ticket_servicio.ESTATUS_PROCESO_EMP_CSC == 1) {
            var data_obj_Usuario = {
              EMPLEADO_CSC_EMPLEADO: Form_Data_Ticket_servicio.EMPLEADO_CSC_EMPLEADO
            };
            self.ValidaUsuario(data_obj_Usuario); 
          }

        }

        
        self.AbrirPopConfiguracion = function(_Obj){
          var _aryFiltroBusqueda = {
            EMPLEADO_CSC_EMPLEADO: _Obj.EMPLEADO_CSC_EMPLEADO
          };
          var _ObjDefault = {
              EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
              Type:localStorage.getItem('Type')
          };
          const ObjetoMergeBus = {..._ObjDefault, ..._aryFiltroBusqueda};

          var UrlPop = null;
          var extraVars = null;
          __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Usuario','GET',ObjetoMergeBus,getJSON(DeveloperType).ApiRecursosHumanos.token).then((resutl)=>{  
            if (resutl.success == true ) {  
              extraVars = "TpoUsuario="+_Obj.TpoUsuario
              +"&idemp="+_Obj.EMPLEADO_CSC_EMPLEADO
              +"&idusu="+resutl.JsonData[0].USU_CSC_USUARIO;
            } else{
              extraVars = "TpoUsuario="+_Obj.TpoUsuario
              +"&idemp="+_Obj.EMPLEADO_CSC_EMPLEADO
              +"&idusu=null";
            }

            if (_Obj.NAMESPACE == 'Seguridad') {
                
            } else {
              if (_Obj.NAMESPACE != 'Seguridad' && resutl.success == false) {
                DevExpress.ui.notify({message: `Genere usuario y contraseña en el menú "SEGURIDAD"`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                return;   
              } 
            }
            UrlPop = "/"+self.patname.split('/')[1]+"/views/Vistas_Recursos_Humanos/"+_Obj.NAMESPACE+"/"+_Obj.NAMESPACE+".html?"+extraVars;
            const popupContentTemplate = function (container) {
                return $('<div style="height:100%;">').append(
                    '<iframe src='+UrlPop+' width="100%" height="100%" scrolling="auto" frameBorder="0" style=" flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;"></iframe>'
                );
            };
            self._PopSearchEmpleado.option("title",_Obj.EMPLEADO_MNU_DESCRIPCION1);
            self._PopSearchEmpleado.option("height", _Obj.h);
            self._PopSearchEmpleado.option("width", _Obj.w);
            self._PopSearchEmpleado.option('contentTemplate', popupContentTemplate);
            self._PopSearchEmpleado.show();
          })
          
          loadPanel.hide();
        }


        self.Get_Rh_Menu_Empleado = function(){
          var _ObjDefault = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
            USU_CODESQUEMASEG: self.T_obj_SessionInfo.USU_CODESQUEMASEG,
            EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO
          };
          __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Rh_Menu_Empleado','GET',_ObjDefault,getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
            loadPanel.show()
            if (in_emp.success == true) {
              var DataServicios = in_emp.JsonData;
              var ObjetoMenuTemporal = [];
              
              var menuOrdenado = jslinq(DataServicios)
              .orderBy(function(el) {
                return parseInt(el.EMPLEADO_MNU_ORDEN);
              }).toList();
              menuOrdenado.forEach(function(item) {
                const newObjetc = {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        icon: "data:image/png;base64," + toBase64(item.EMPLEADO_MNU_IMAGEN_GRANDE_ACTIVO.data),
                        text: item.EMPLEADO_MNU_DESCRIPCION1,
                        type: "default",
                        width: "100%",
                        stylingMode: "text",
                        useSubmitBehavior: true,
                        onClick: function() {
                          var Em = self.Frm_Datos_Empleado.getEditor('EMPLEADO_CSC_EMPLEADO').option('value');
                          if (Em == null || Em == 0) {
                            DevExpress.ui.notify({message: `No ha seleccionado un empleado`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                          } else {
                            self.AbrirPopConfiguracion({
                              EMPLEADO_CSC_EMPLEADO: Em,
                              TpoUsuario: "ADMIN_ANAM",
                              w: 800,
                              h: 520,
                              NAMESPACE: item.EMPLEADO_MNU_WEB_NAMESPACE,
                              EMPLEADO_MNU_DESCRIPCION1:item.EMPLEADO_MNU_DESCRIPCION1
                            });
                          }
                        }
                    }
                };
                ObjetoMenuTemporal.push(newObjetc);
              });

             

              self.Btns_Configurador.option('items', ObjetoMenuTemporal);
              loadPanel.hide()
            }
            else{
              console.log('Sin Menú Asignados');
              loadPanel.hide()
            }
          })
        }


        self.Get_Rh_Menu_Empleado();

      
        self.ValidaUsuario = function(_aryFiltroBusqueda){
            var _ObjDefault = {
                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                Type:localStorage.getItem('Type')
            };
            const ObjetoMergeBus = {..._ObjDefault, ..._aryFiltroBusqueda};
            
            __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Usuario','GET',ObjetoMergeBus,getJSON(DeveloperType).ApiRecursosHumanos.token).then((resutl)=>{
                if (resutl.success == true ) {
                    var CargaFrm = resutl.JsonData[0];
                    self.DesactivaUsuario(CargaFrm);
                }
            })
        }


        self.DesactivaUsuario = function(params) {
          var __Obj_Update = {
              EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
              Type: localStorage.getItem('Type'),
              EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
              DATA_UPDATE: {USU_INDICAACTIVO: 0, USU_AUTENTIFICA_REMOTO: 0},
              DATA_WHERE:{
                  "EMPLEADO_CSC_EMPLEADO": params.EMPLEADO_CSC_EMPLEADO,
                  "NEWID": params.NEWID,
                  "USU_CSC_USUARIO": params.USU_CSC_USUARIO,
                  "EMP_CSC_EMPRESA_HOST": params.EMP_CSC_EMPRESA_HOST
              }
          };
          __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Usuario','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
            if (in_emp.success == true) {
              DevExpress.ui.notify({message: `Usuario desactivado`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            }
          })
        }

  

        self._LoadCatEspecializados = () =>{
          const _ObjetoPreConsulta = [
              {Tbl:"Get_Country_Code"},
              {Tbl:"Get_TimeZone_Country"},
          ];
          var promises = _ObjetoPreConsulta.map( (fileKey) => {
              return self.CargaCatalogosEspecialPromise(fileKey);
          });

          Promise.all(promises).then( (_Result) => {
              self.CatalogosPantalla = _Result;
              var Country = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'Get_Country_Code')).toList();
              var TimeZones = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'Get_TimeZone_Country')).toList();

              Country.forEach(function(item) {
                self._CountryCodes_ObjData.insert(item);
              });

              TimeZones.forEach(function(item) {
                self._TimeZones_ObjData.insert(item);
              });

          }).catch(function (err) {
              console.error('Ha ocurrido un error:', err);
          });
          
        }


        self.CargaCatalogosEspecialPromise = (Objeto) => {
          return new Promise((resolve, reject) => {
              try {
                  __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+Objeto.Tbl,'GET',Objeto,getJSON(DeveloperType).ApiGeneral.token).then((dataResponse)=>{
                  if (dataResponse.success === true) {
                      dataResponse.CatName = Objeto.Tbl;
                      resolve(dataResponse);
                  } else{
                      resolve(dataResponse);
                  }
              })
              } catch (error) {
                  reject(error);
              }
          });
        }
      

        self._LoadCatalogos = () =>{
            const _ObjetoPreConsulta = [
                {Tbl:"SAMT_CAT_ESTATUS_PROCESO_MPLEADOS"},
                {Tbl:"SAMT_CAT_PROCESO_EMPLEADOS"},
                {Tbl:"SAMT_CAT_SUBPROCESO_EMPLEADOS"},
                {Tbl:"SAMT_ESTATUS_HEADCOUNT"},
                {Tbl:"SAMT_SUBESTATUS_HEADCOUNT"},
            ];
            var promises = _ObjetoPreConsulta.map( (fileKey) => {
                return self.CargaCatalogosPromise(fileKey, "Get_Cat_Full");
            });

            Promise.all(promises).then( (_Result) => {
                self.CatalogosPantalla = _Result;
                var _ProcEmpl = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'SAMT_CAT_PROCESO_EMPLEADOS')).toList();
                var _SubProcEmpl = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'SAMT_CAT_SUBPROCESO_EMPLEADOS')).toList();
                var _EstaEmpl = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'SAMT_CAT_ESTATUS_PROCESO_MPLEADOS')).toList();

                self.__Estatus_Headcount = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'SAMT_ESTATUS_HEADCOUNT')).toList();
                self.__Sub_Estatus_Headcount = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'SAMT_SUBESTATUS_HEADCOUNT')).toList();

                _ProcEmpl.forEach(function(item) {
                  self._Cmb_Proceso_ObjData.insert(item);
                });

                _EstaEmpl.forEach(function(item) {
                  self._Cmb_Estatus_Empl_ObjData.insert(item);
                });

                _SubProcEmpl.forEach(function(item) {
                  self._Cmb_SubProceso_ObjData.insert(item);
                });

            }).catch(function (err) {
                console.error('Ha ocurrido un error:', err);
            });
        }


        self.CargaCatalogosPromise = (Objeto,EndPointRoute) => {
          return new Promise((resolve, reject) => {
              try {
                  __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+EndPointRoute,'GET',Objeto,getJSON(DeveloperType).ApiGeneral.token).then((dataResponse)=>{
                  if (dataResponse.success === true) {
                      dataResponse.CatName = Objeto.Tbl;
                      resolve(dataResponse);
                  } else{
                      resolve(dataResponse);
                  }
              })
              } catch (error) {
                  reject(error);
              }
          });
        }


        self.Refresh_Empleado_Mapa = function(){
          if(self.DatosEmpleadosGet != null){
            if(
              (self.DatosEmpleadosGet.EMPLEADO_DIRECCION_PAIS_CSCPAIS == null || self.DatosEmpleadosGet.EMPLEADO_DIRECCION_PAIS_CSCPAIS == 0)
              || (self.DatosEmpleadosGet.EMPLEADO_DIRECCION_EDO_CSCESTADO == null || self.DatosEmpleadosGet.EMPLEADO_DIRECCION_EDO_CSCESTADO == 0)
              || (self.DatosEmpleadosGet.EMPLEADO_DIRECCION_MUNICIPIO == null || self.DatosEmpleadosGet.EMPLEADO_DIRECCION_MUNICIPIO.trim() == "")
              || (self.DatosEmpleadosGet.EMPLEADO_DIRECCION_COLONIA == null || self.DatosEmpleadosGet.EMPLEADO_DIRECCION_COLONIA.trim() == "")
              || (self.DatosEmpleadosGet.EMPLEADO_DIRECCION_CALLE == null || self.DatosEmpleadosGet.EMPLEADO_DIRECCION_CALLE.trim() == "")
              || (self.DatosEmpleadosGet.EMPLEADO_DIRECCION_NUMERO_EXT == null || self.DatosEmpleadosGet.EMPLEADO_DIRECCION_NUMERO_EXT.trim() == "")
            ){
              console.log("dirección incompleta para mostrar en el mapa");
            }
            else{
              var String_Direccion = "";
              var Object_Pais = self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_PAIS_CSCPAIS").option('selectedItem');

              if(Object_Pais == null || Object_Pais == undefined){
                console.log("no se han cargado catalogos aun");
                
              }
              else{

                String_Direccion += Object_Pais.country_name;

                var Object_Estado = self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_EDO_CSCESTADO").option('selectedItem');

                if(Object_Estado == null || Object_Estado == undefined){
                  console.log("no se han cargado catalogo de estado aun");

                }
                else{
                  String_Direccion += ", " + Object_Estado.EDO_DESCESTADO;

                  String_Direccion += ", " + self.DatosEmpleadosGet.EMPLEADO_DIRECCION_MUNICIPIO;

                  String_Direccion += ", " + self.DatosEmpleadosGet.EMPLEADO_DIRECCION_COLONIA;

                  String_Direccion += ", " + self.DatosEmpleadosGet.EMPLEADO_DIRECCION_CALLE;

                  String_Direccion += ", " + self.DatosEmpleadosGet.EMPLEADO_DIRECCION_NUMERO_EXT;

                 
                }
              }
            }
          }
        }
        

        self.Insert_Bitacora_Puestos_Anteriores = function(){

          var Object_Get_Puestos_Anteriores = {
            Type:localStorage.getItem('Type'),
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO
          };
          __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Empleado_Puestos_Anteriores',"GET", Object_Get_Puestos_Anteriores, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(Response_Get_Puestos_Anteriores){
              if (Response_Get_Puestos_Anteriores.success == true) {
                
                if( self.DatosEmpleadosGet.EMPLEADO_FECH_REINGRESO == null || self.DatosEmpleadosGet.EMPLEADO_FECH_REINGRESO == undefined){
                  var PUESTO_ANT_FECHA_INICIAL = Response_Get_Puestos_Anteriores.JsonData[0].PUESTO_ANT_FECHA_FINAL;
                }
                else{
                  var PUESTO_ANT_FECHA_INICIAL = self.DatosEmpleadosGet.EMPLEADO_FECH_REINGRESO;
                }
              }
              else{
                  var PUESTO_ANT_FECHA_INICIAL = self.DatosEmpleadosGet.EMPLEADO_FECH_INGRESOEMP;
              }

              var Insert_Puestos_Anteriores = {
                Type:localStorage.getItem('Type'),
                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                DATA_INSERT:{
                  EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                  EMPLEADO_CSC_EMPLEADO:self.DatosEmpleadosGet.EMPLEADO_CSC_EMPLEADO,
                  TIPO_PUESTO_CSCEMPLEADO:self.DatosEmpleadosGet.CAT_PUESTO_CSCEMPLEADO,
                  CAT_CATEGORIA_PUESTO_CSC:self.DatosEmpleadosGet.CAT_CATEGORIA_PUESTO_CSC,
                  PUESTO_ANT_FECHA_INICIAL:PUESTO_ANT_FECHA_INICIAL,
                  PUESTO_ANT_FECHA_FINAL:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                  AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                  AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                  AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                  AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                }
              };

              __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Puestos_Anteriores','POST',JSON.stringify(Insert_Puestos_Anteriores),getJSON(DeveloperType).ApiRecursosHumanos.token).then((Resualt_Update_Empleado_Vacante)=>{
              
                self._Pop_Confirma_Baja_Vacantes.hide();
                DevExpress.ui.notify( 'VACANTE ACTUALIZADA', 'success', 3000);
                var data_obj_Empleado = {
                  EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                  Type:localStorage.getItem('Type'),
                  EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                  EMPLEADO_UNIQUE_ID: self.DatosEmpleadosGet.EMPLEADO_UNIQUE_ID
                };                
                self.BuscaEmpleados(data_obj_Empleado, 'CargaDatos');
                loadPanel.hide();

              }).catch(function(e){
                loadPanel.hide();
                self._Pop_Confirma_Baja_Vacantes.hide();
                console.log(e);
                DevExpress.ui.notify( 'ERROR DE COMUNICACION CON BITACORA NO INSERTADA', 'error', 3000);
              });

          }).catch(function(e){
            console.log(e);
            loadPanel.hide();
            self._Pop_Confirma_Baja_Vacantes.hide();
            DevExpress.ui.notify( 'ERROR DE COMUNICACION ERROR AL BUSCAR BITACORA DE PUESTOS', 'error', 3000);
          });

        }


        self.Switch_Boton_Buscar_codigo_postal = function(){

          var Estado_ReadOnly_Formulario = self.Frm_Datos_Empleado.option("readOnly");

          if(Estado_ReadOnly_Formulario == false){
            var Item_Country = self.Frm_Datos_Empleado.getEditor("EMPLEADO_DIRECCION_PAIS_CSCPAIS").option('selectedItem') ;
            if(Item_Country == null){
              $Btn_buscar_codigo_postal.option("disabled",true);
            }
            else{
              if(Item_Country.country_code == "MX"){
                $Btn_buscar_codigo_postal.option("disabled",false);
              }
              else{
                $Btn_buscar_codigo_postal.option("disabled",true);
              }
            }
          }
          else{
            $Btn_buscar_codigo_postal.option("disabled",true);
          }

        }



        self._LoadCatalogos();
        self._LoadCatEspecializados();
    }
}



function arrayBufferToHex(buffer) {
  const view = new DataView(buffer);
  let hexString = '';
  for (let i = 0; i < view.byteLength; i++) {
    let hex = view.getUint8(i).toString(16);
    hex = hex.length === 1 ? '0' + hex : hex;
    hexString += hex;
  }
  return hexString;
}


setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);