SalesDashboard.dashboardModel = function() {
    var self = this;
    self.subdomain =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
    var obj_DatosEmpleado;
    let obj_SessionInfo;
    var __obj_Cat_Tpo_Foto;
    self.DataTicketOpen = null;
    self.setDefaultValues = false;
    self.Ids_TipoUso_Requi = 9;
    self.CalificadoRechazado = false;
    self.FileCorreoRespuesta = null;
    self.TipificacionesFull = null;
    self.CatalogosPantalla = [];
    self.Previous_TxtParentParent = null;
    self.Previous_TxtParent = null;
    self.Previous_TxtTipifica = null;
    self.Previous_TxtEstatus = null;
    let REQ_CSCREQUISICION_IN;

    self.Flag_Fila = false;
    
    var LoadEnvioCorreo = $("#LoadEnvioCorreo").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");
    
    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");


    self.UrlEnvioCorreos = 'http://localhost:3003';
    
    self.LoadCatFull = true;
    const syncTreeViewSelection = function (treeViewInstance, value) {
        if (!value) {
            treeViewInstance.unselectAll();
        } else {
            treeViewInstance.selectItem(value);
        }
    };
    var _keyAsync = 'ID';
    var _keyTpoAreaCsc = "TIPO_AREA_CSC";
    var _keyReqCsc = 'REQ_CSCREQUISICION';
    const makeAsyncDataSource = function (jsonFile) {
        return new DevExpress.data.CustomStore({
            loadMode: 'raw',
            key: _keyAsync,
            load() {
                return $.getJSON(`data/${jsonFile}`);
            },
        });
    };

    self.Arr_ReglaNegocio = null;
    self.Arr_UniqueRN = null; 
    self.Dts_LoadCrm = null;

    /** TODO: Formatos y fechas
     * self.TimeZoneServidor: Se utilizara para los INSERT y UPDATE de la BD
     * self.TimeZoneEmpleado: Se utiliza para saber la fecha y hora de la plataforma del empleado
     * self.TiempoUTCEmpleado: Segun el tipo de dato se sumara o restara esas horas a las 
     *                         fechas se trae en los campos de fecha de la BD
    */
    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();
    
    self.TipoOrigenCreacion = 0;
    self.TimeDefault = 86400;

    self._Obj_Agrega_Emp_Ticket = new DevExpress.data.ArrayStore({
        data: [],
        //key: 'EMPLEADO_CSC_EMPLEADO'
    });

    self._Obj_Autorizaciones_Grid = new DevExpress.data.ArrayStore({
        data: [],
        //key: 'SAMT_TICKET_AUTORIZACIONES_CSC'
    });

    self._Obj_Ot_Ticket_Grid = new DevExpress.data.ArrayStore({
        data: [],
        //key: 'OTR_CSCORDENTRABAJO'
    });

    self._Obj_Empleados_Grid = new DevExpress.data.ArrayStore({
        data: [],
        //key: 'OTR_CSCORDENTRABAJO'
    });
    self._MarkUpeditorText = null;
    self.ArchivosPermitidos = [".jpg", ".jpeg",".png", ".pdf", ".doc", ".docx", ".xlsx", ".xls"];

    self.extensionesDocumentos = [".pdf",".doc",".docx",".ppt",".pptx",".xls",".xlsx",".txt",".rtf",".csv",".odt",".ods",".odp",".odg",".odf"];
    self.extensionesImagenes = [".jpg",".jpeg",".png",".gif",".bmp",".webp",".svg"];


    self.CamposVisiblesDG = true;
    self.BotonesDisponibles = false;
    self.jsonTiposParticipanes = null;
    self._Obj_Ticket_Participantes_Grid = new DevExpress.data.ArrayStore({
        data: [],
        //key: 'OTR_CSCORDENTRABAJO'
    });

    self.editandoForma = false;


    self._CMB_SAMT_TIPO_REQ_USO_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_TIPO_TICKET_PARTICIPANTE_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_CAT_EMPLEADO_AREA_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_CAT_EMPLEADO_DEPARTAMENTO_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_CAM_MESA_DE_AYUDA_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_ESTATUS_TICKET_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_TIPO_PRIORIDAD_TICKET_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_TIPO_TICKET_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_CAM_TIPO_SERVICIO_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_TIPO_SEVERIDAD_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_CLIENTES_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_PROYECTOS_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_CAM_SERVICIO_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_REQUISICIONES_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_TIPO_CALIFICACION_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_TIPO_PUESTO_EMPLEADO_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_TIPO_RESPUESTA_AUTORIZA_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_ESTATUS_ORDEN_TRABAJO_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self._CMB_SAMT_CAM_TIPIFICACIONES_OBJDATA = new DevExpress.data.ArrayStore({data: []});
    self.pauseTicket = false;
    self.cierraTicket = false;

    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        obj_SessionInfo = JSON.parse( localStorage.getItem('obj_SessionInfo'));
        loadPanel.hide();
        LoadEnvioCorreo.hide();
        
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es-mx";}


        /** SIEMPRE AGREGAR ESTA LINEA */


        // Función para generar el HTML agradable con tres columnas
        function mostrarArchivosPermitidos() {
            // Obtener el elemento donde se mostrará la lista
            var listaArchivos = document.getElementById("lista-archivos-permitidos");
        
            // Calcular cuántas extensiones por columna (aproximadamente)
            var extensionsPerColumn = Math.ceil(self.extensionesDocumentos.length / 3);
        
            // Crear un contenedor para las columnas
            var columnContainer = document.createElement("div");
            columnContainer.classList.add("column-container");
        
            // Recorrer el arreglo de extensiones permitidas
            for (var i = 0; i < 3; i++) {
            // Crear una columna
            var column = document.createElement("div");
            column.classList.add("column");
        
            // Crear una lista no ordenada para esta columna
            var ul = document.createElement("ul");
        
            // Calcular el rango de extensiones para esta columna
            var start = i * extensionsPerColumn;
            var end = Math.min((i + 1) * extensionsPerColumn, self.extensionesDocumentos.length);
        
            // Recorrer las extensiones para esta columna
            for (var j = start; j < end; j++) {
                var extension = self.extensionesDocumentos[j];
        
                // Crear un elemento de lista para cada extensión
                var li = document.createElement("li");
                li.textContent = extension;
                ul.appendChild(li); // Agregar el elemento de lista a la lista no ordenada
            }
        
            // Agregar la lista no ordenada a la columna
            column.appendChild(ul);
            // Agregar la columna al contenedor de columnas
            columnContainer.appendChild(column);
            }
        
            // Limpiar cualquier contenido previo en el contenedor
            listaArchivos.innerHTML = '';
        
            // Agregar el contenedor de columnas al contenedor principal
            listaArchivos.appendChild(columnContainer);
        }
        
        // Llamar a la función para inicializar
        mostrarArchivosPermitidos();

        self.patname = window.location.pathname;
        var __obj_Consulta_Tipo_Requ = {Tbl:"SAMT_TIPO_REQ_USO",NACTIVE:"TIPO_USO_DE_REQ_ACTIVO"};
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',__obj_Consulta_Tipo_Requ,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
            if (all_data.success == true){
                var EstatusFilter = jslinq( all_data.JsonData ).where(function(el) { return (el.TIPO_USO_DE_REQ_CLAVE).trim() == "CA"; }).toList();
                var finalData = jslinq(all_data.JsonData).select(function(el){return el.TIPO_USO_DE_REQ_CSC;}).toList();
                self.Ids_TipoUso_Requi = finalData.join(",");
            }
            else {
                __cmb_component.option('dataSource', []);
            }
        });

        var __obj_Consulta_Tipo_Participantes = {Tbl:"SAMT_TIPO_TICKET_PARTICIPANTE"};
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',__obj_Consulta_Tipo_Participantes,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
            if (all_data.success == true){
                //var EstatusFilter = jslinq( all_data.JsonData ).where(function(el) { return (el.TIPO_USO_DE_REQ_CLAVE).trim() == "CA"; }).toList();
                //var finalData = jslinq(all_data.JsonData).select(function(el){return el.TIPO_USO_DE_REQ_CSC;}).toList();
                self.jsonTiposParticipanes = all_data.JsonData;
            }
            else {
                self.jsonTiposParticipanes = null
            }
        });

        self.TipoOrigenCreacion = (getUrlParam('TPO_USUARIO') == 'GENERA') ? 1 : 2;

        $('#___Tb_Tickets').dxToolbar({
            onContentReady: function(){
                $Btn_Alta_Ticket.option('visible',false);
                $btn_Modificar_Ticket.option('visible',true);
                $btn_Salvar_Alta_Ticket.option('visible',false);
                $btn_Salvar_Modifica_Ticket.option('visible',false);
                $btn_Cancelar_Alta_Ticket.option('visible',false);
                $btn_Cancelar_Modificar_Ticket.option('visible',false);
                $btnCalificaAtencion.option('visible',false);
            },
            items: [
                {
                    location: 'after',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'check',
                        text: 'Calificar ticket',
                        type: 'default',
                        onInitialized: function(e) {  
                            $btnCalificaAtencion = e.component;
                        },
                        onClick() {
                            if (self.DataTicketOpen.TIC_CERRADO == true) {
                                self.notificaPantalla("Acción no permitida",moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'),"El ticket ya se enuentra cerrado.");
                                return;
                            }
                            let __cmb_component_Estatus = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                            let __ValidaEnvio = __cmb_component_Estatus.option('selectedItem');
                            if (__ValidaEnvio.ESTATUS_TICKET_CLAVE == "RESUELTO" || __ValidaEnvio.ESTATUS_TICKET_CLAVE == "CANCELADO") {
                                $("#Pop_Califica_Ticket_Solicitante").dxPopup("show");
                            } else{
                                self.notificaPantalla("Acción no permitida",moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'),`El ticket aún esta en "${__ValidaEnvio.ESTATUS_TICKET_IDIOMA1}", no es posible calificar.`)
                            }
                            
                        },
                    },
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
                            $Btn_Alta_Ticket = e.component;
                        },
                        onClick() {
                            self.ClickAlta();
                        },
                    },
                },{
                    location: 'before',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'save',
                        text: 'Salvar Alta',
                        type: 'success',
                        onInitialized: function(e) {  
                            $btn_Salvar_Alta_Ticket = e.component;
                        },
                        onClick() {
                            loadPanel.show();
                            if( self.Frm_Ticket_Servicio_Instance.validate().isValid == true){
                                self.Generar_Alta_Ticket();
                            }
                            else{
                                loadPanel.hide();
                                DevExpress.ui.notify('LLENE LOS CAMPOS EN ROJO');
                            }
                            
                        },
                    },
                },{
                    location: 'after',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'clear',
                        text: 'Cancelar Alta',
                        type: 'danger',
                        onInitialized: function(e) {  
                            $btn_Cancelar_Alta_Ticket = e.component;
                        },
                        onClick() {
                            $Btn_Alta_Ticket.option('visible',true);
                            $btn_Modificar_Ticket.option('visible',true);
                            $btn_Cancelar_Alta_Ticket.option('visible',false);
                            $btn_Salvar_Alta_Ticket.option('visible',false);
                            self.Frm_Ticket_Servicio_Instance.resetValues();
                            self.Frm_Ticket_Servicio_Instance.option('readOnly', true);
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
                          $btn_Modificar_Ticket = e.component;
                      },
                      onClick() {
                        /*if (self.DataTicketOpen.TIC_ESTATUS_SLA_ENUM == 'pause') {
                            self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `El ticket se encuentra en pausa, favor de activar antes de continuar.`,300,120);
                            return;
                        }*/
                        if (self.Frm_Ticket_Servicio_Instance.getEditor("TIC_NEWID").option("value") == "") {
                            DevExpress.ui.notify({message: `No hay elemento a modificar`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                        }
                        else {
                            var __cmb_component_Estatus = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                            var __ValidaEnvio = __cmb_component_Estatus.option('selectedItem');
                            if (__ValidaEnvio.ESTATUS_TICKET_CLAVE == "RESUELTO" || __ValidaEnvio.ESTATUS_TICKET_CLAVE == "CANCELADO") {
                                self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `El ticket se encuentra en estatus de: ${__ValidaEnvio.ESTATUS_TICKET_IDIOMA1}, se espera calificación del solicitante.`,300,120);
                                return;
                            } 
                            if ( self.DataTicketOpen.TIC_CERRADO == true) {
                                self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `El ticket ya se encuentra cerrado.`);
                                return;
                            } else {
                                switch (getUrlParam('TPO_USUARIO')) {
                                    case 'GENERA':
                                        DevExpress.ui.notify('EL TICKET YA SE ENCUENTRA EN PROCESO DE ATENCIÓN.');
                                        self.Frm_Ticket_Servicio_Instance.getEditor("TIC_DESCRIPCION_SOLUCION").option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor("ESTATUS_TICKET_CSC").option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor("REQ_CSCREQUISICION").option('readOnly', false);
                                        self.Frm_Ticket_Servicio_Instance.getEditor("EMPLEADO_CSC_SOLICITA").option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor('TIC_SOLICITA').option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor("CAM_CSC_SERVICIO_SOLICITA").option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor('TIC_AUXS2').option('readOnly', true);
                                    break;
                                    default:
                                        self.setDefaultValues = false;
                                        self.LoadCatFull = false;
                                        self.editandoForma = true;
                                        $btn_Modificar_Ticket.option('visible',false);
                                        $Btn_Alta_Ticket.option('visible',false);
                                        $btn_Salvar_Modifica_Ticket.option('visible',true);
                                        $btn_Cancelar_Modificar_Ticket.option('visible',true);
                                        self.Frm_Ticket_Servicio_Instance.option('readOnly', false);
                                        
                                        self.Frm_Ticket_Servicio_Instance.getEditor("TIC_DESCRIPCION").option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor("REQ_CSCREQUISICION").option('readOnly', false);
                                        self.Frm_Ticket_Servicio_Instance.getEditor("EMPLEADO_CSC_SOLICITA").option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('readOnly', false);
                                        self.Frm_Ticket_Servicio_Instance.getEditor('TIC_SOLICITA').option('readOnly', true);
                                        self.Frm_Ticket_Servicio_Instance.getEditor('TIC_AUXS2').option('readOnly', false);
                                        
                                        
                                    break;
                                }
                            }
                            
                        }
                    },
                    },
                },{
                    location: 'before',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'save',
                        text: 'Salvar Modifica',
                        type: 'success',
                        onInitialized: function(e) {  
                            $btn_Salvar_Modifica_Ticket = e.component;
                        },
                        onClick() {
                            //! Datos temporales del Ticket
                            var StringInfoForm = JSON.stringify(self.DataTicketOpen);
                            self.DataTicketOpen = JSON.parse(StringInfoForm);
                            //! Obtiene y compara los datos del ticket
                            var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
                            var Obj_Data_Update_Ticket = GetUpdateData(self.DataTicketOpen, Form_Data_Ticket_servicio);
                            var __ValidaCambiosTicket = Object.keys(Obj_Data_Update_Ticket).length === 0;
                            var __cmb_component_Estatus = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                            var __ValidaEnvio = __cmb_component_Estatus.option('selectedItem');

                            if( self.Frm_Ticket_Servicio_Instance.validate().isValid == true){
                                if (__ValidaCambiosTicket == true) {
                                    DevExpress.ui.notify({message: `No se detecto ningun cambio`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                } else {
                                    loadPanel.show();
                                    if(self.pauseTicket == true){
                                        if (Form_Data_Ticket_servicio.TIC_ESTATUS_SLA_ENUM == 'open' || Form_Data_Ticket_servicio.TIC_ESTATUS_SLA_ENUM == '') {
                                            //Obj_Data_Update_Ticket.TIC_ESTATUS_SLA_ENUM = 'pause';
                                            let tokenMesaProveedor = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlcl9kYXRhIjp7InByb3ZpZGVyX2lkIjo3LCJwcm92aWRlcl9uYW1lIjoiTUVTQSBERSBBWVVEQSBDT1NFTVNFQyIsInByb3ZpZGVyX2lkX2VtcCI6MjM2LCJwcm92aWRlcl9lbXBob3N0IjoxLCJwcm92aWRlcl9zZXJ2aWNpbyI6NywiY29udGV4dCI6eyJjbGllbnRUeXBlIjoiYXBpIn19LCJpYXQiOjE3MjM1ODkxMjV9.YKuNATRKIO58ko1KQ2tYhXusFzRqwCMd0xI_EzoAvgA';
                                            __Reques_ajax('https://apimc.anam.gob.mx:3007/pauseTicket/7','POST',JSON.stringify({
                                                "newIdTicket":self.DataTicketOpen.TIC_NEWID,
                                                "idEmpresa": 1,
                                                "idEmpleadoProvider": 254
                                            }),tokenMesaProveedor).then((in_emp)=>{
                                                if (in_emp.success == true) {
                                                    DevExpress.ui.notify({message: `Ticket pausado`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                                }
                                                return in_emp;
                                            }).catch(function(e){
                                                loadPanel.hide();
                                                console.log(e);
                                                loadPanel.hide();
                                                DevExpress.ui.notify({message: `ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                            });
                                        }
                                    }  else{
                                        if (Form_Data_Ticket_servicio.TIC_ESTATUS_SLA_ENUM == 'pause') {
                                            //Obj_Data_Update_Ticket.TIC_ESTATUS_SLA_ENUM = 'pause';
                                            let tokenMesaProveedor = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlcl9kYXRhIjp7InByb3ZpZGVyX2lkIjo3LCJwcm92aWRlcl9uYW1lIjoiTUVTQSBERSBBWVVEQSBDT1NFTVNFQyIsInByb3ZpZGVyX2lkX2VtcCI6MjM2LCJwcm92aWRlcl9lbXBob3N0IjoxLCJwcm92aWRlcl9zZXJ2aWNpbyI6NywiY29udGV4dCI6eyJjbGllbnRUeXBlIjoiYXBpIn19LCJpYXQiOjE3MjM1ODkxMjV9.YKuNATRKIO58ko1KQ2tYhXusFzRqwCMd0xI_EzoAvgA';
                                            __Reques_ajax('https://apimc.anam.gob.mx:3007/resumeTicket/7','POST',JSON.stringify({
                                                "newIdTicket":self.DataTicketOpen.TIC_NEWID,
                                                "idEmpresa": 1,
                                                "idEmpleadoProvider": 254
                                            }),tokenMesaProveedor).then((in_emp)=>{
                                                if (in_emp.success == true) {
                                                    DevExpress.ui.notify({message: `Ticket reactivado`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                                }
                                                return in_emp;
                                            }).catch(function(e){
                                                loadPanel.hide();
                                                console.log(e);
                                                loadPanel.hide();
                                                DevExpress.ui.notify({message: `ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                            });
                                        }
                                    };
                                    setTimeout(function() {
                                    if (self.CalificadoRechazado == true) {
                                        self.InsertaBitacoraManual(Form_Data_Ticket_servicio,'Cliente rechazo la solución', true, 1, 1);
                                    } 
                                    
                                    BitacoraCambios(
                                         //self.DataTicketOpen, //INFORMACION ORIGINAL DEL FORMULARIO
                                        //Form_Data_Ticket_servicio, //INFORMACION DEL FORMULARIO ACTUAL MODIFICADA
                                        self.Frm_Ticket_Servicio_Instance,//INSATNACIA DEL FORMULARIO
                                        //343174  //ID DE LA SOLISITUD
                                    );

                                    Obj_Data_Update_Ticket.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                    Obj_Data_Update_Ticket.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                    Obj_Data_Update_Ticket.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                                    if(Obj_Data_Update_Ticket.TIC_FECHA_ALTA){
                                        Obj_Data_Update_Ticket.TIC_FECHA_ALTA = moment(Obj_Data_Update_Ticket.TIC_FECHA_ALTA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss');
                                    }
                                    
                                    if(Obj_Data_Update_Ticket.TIC_FECHA_SOLICITA){
                                        Obj_Data_Update_Ticket.TIC_FECHA_SOLICITA = moment(Obj_Data_Update_Ticket.TIC_FECHA_SOLICITA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss');
                                    };

                                    if(Obj_Data_Update_Ticket.TIC_FECHA_PROMESA){
                                        Obj_Data_Update_Ticket.TIC_FECHA_PROMESA = moment(Obj_Data_Update_Ticket.TIC_FECHA_PROMESA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss');
                                    };

                                    //if (Obj_Data_Update_Ticket.TIC_CERRADO == true) {
                                    if (__ValidaEnvio.ESTATUS_TICKET_CLAVE == "RESUELTO" || __ValidaEnvio.ESTATUS_TICKET_CLAVE == "CANCELADO") {
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE_SOLA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE_HORA_COMPLETA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                        
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE_SISTEMA = moment().tz(self.TimeZoneServidor).add(24,'hours').format('YYYY-MM-DD HH:mm:ss');
                                        Obj_Data_Update_Ticket.TIC_CERRADO_POR_SISTEMA = 1;

                                        if (self.DataTicketOpen.TIC_DURACION_EJECUCION == 0) {
                                            var now  = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                            var then = self.DataTicketOpen.TIC_FECHA_ALTA;
                                            var m1 = moment(now);
                                            var m2 = moment(then);
                                            var m3 = m1.diff(m2,'seconds');
                                            Obj_Data_Update_Ticket.TIC_DURACION_EJECUCION = m3;
                                        }

                                        let __objUpdateLogsSLA = {
                                            ...ReturnDefaultData_Init(),
                                            TIC_NEWID: self.DataTicketOpen.TIC_NEWID
                                        }
                                        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'UpdateLogSla','POST',JSON.stringify(__objUpdateLogsSLA),getJSON(DeveloperType).ApiTickets_v2.token).then((resUpdateLogs)=>{
                                            console.log(resUpdateLogs);
                                        })
                                    }
                                    if (__ValidaEnvio.ESTATUS_TICKET_CLAVE == 'AUTORIZA' && __ValidaEnvio.ESTATUS_TICKET_CERRAR == 1) {
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE_SOLA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE_HORA_COMPLETA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                        
                                        Obj_Data_Update_Ticket.TIC_FECHA_CIERRE_SISTEMA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                        Obj_Data_Update_Ticket.TIC_CERRADO_POR_SISTEMA = 1;

                                        if (self.DataTicketOpen.TIC_DURACION_EJECUCION == 0) {
                                            var now  = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                            var then = self.DataTicketOpen.TIC_FECHA_ALTA;
                                            var m1 = moment(now);
                                            var m2 = moment(then);
                                            var m3 = m1.diff(m2,'seconds');
                                            Obj_Data_Update_Ticket.TIC_DURACION_EJECUCION = m3;
                                        }

                                        let __objUpdateLogsSLA = {
                                            ...ReturnDefaultData_Init(),
                                            TIC_NEWID: self.DataTicketOpen.TIC_NEWID
                                        }
                                        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'UpdateLogSla','POST',JSON.stringify(__objUpdateLogsSLA),getJSON(DeveloperType).ApiTickets_v2.token).then((resUpdateLogs)=>{
                                            console.log(resUpdateLogs);
                                        })
                                    }
                                    if (__ValidaEnvio.ESTATUS_TICKET_CLAVE == 'AUTORIZA' && __ValidaEnvio.ESTATUS_TICKET_CERRAR == 0) {
                                        Obj_Data_Update_Ticket.TIC_REQ_AUTORIZACION = 0;
                                    }
                                    
                                    //VALIDACION DE TIEMPO DE RECEPCION
                                    if (self.DataTicketOpen.TIC_DURACION_RECEPCION == 0 && self.DataTicketOpen.TIC_FECHA_RECEPCION == null) {
                                        if (__ValidaEnvio.ESTATUS_TICKET_CLAVE != 'AUTORIZA') {
                                            var now  = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                            var then = self.DataTicketOpen.AUDITORIA_FEC_ALTA;
                                            var m1 = moment(now);
                                            var m2 = moment(then);
                                            var m3 = m1.diff(m2,'seconds');
                                            Obj_Data_Update_Ticket.TIC_DURACION_RECEPCION = m3; 
                                            Obj_Data_Update_Ticket.TIC_FECHA_RECEPCION = now;
                                        }
                                    }

                                    var __Obj_Update = {
                                        ...ReturnDefaultData_Init(),
                                        DATA_UPDATE: Obj_Data_Update_Ticket,
                                        DATA_WHERE:{
                                            "TIC_CSCTICKET":self.DataTicketOpen.TIC_CSCTICKET,
                                            "TIC_NEWID":self.DataTicketOpen.TIC_NEWID,
                                            "EMP_CSC_EMPRESA_HOST":localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                        }
                                    };
                                    loadPanel.show();
                                    
                                    __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Update_Ticket_Servicio','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                                        if (in_emp.success == true) {
                                            var __Oj_Dts_Busqueda = {
                                                ...ReturnDefaultData_Init(),
                                                TIC_NEWID: self.DataTicketOpen.TIC_NEWID
                                            }
                                            self.Get_Tickets(__Oj_Dts_Busqueda,false,null);

                                            DevExpress.ui.notify({message: `Ticket actualizado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});

                                            self.Flag_Fila = false;
                                            $btn_Modificar_Ticket.option('visible',true);
                                            $Btn_Alta_Ticket.option('visible',false);
                                            $btn_Salvar_Modifica_Ticket.option('visible',false);
                                            $btn_Cancelar_Modificar_Ticket.option('visible',false);
                                            self.Frm_Ticket_Servicio_Instance.option('readOnly', true);
                                            self.pauseTicket = false;

                                            //if (__ValidaEnvio.ESTATUS_TICKET_CLAVE == "RESUELTO" || __ValidaEnvio.ESTATUS_TICKET_CLAVE == "ORIGEN" || __ValidaEnvio.ESTATUS_TICKET_CLAVE == "RECHAZO" || __ValidaEnvio.ESTATUS_TICKET_CLAVE == "SOLDOC") {
                                                let MensajeNewId = createUUID(36);
                                                let infoMensaje = `<b>Actualización de ticket:</b> <br><br> <b>Estatus:</b> ${__ValidaEnvio.ESTATUS_TICKET_IDIOMA1} <br><br> <b>Descripción/Observaciones:</b> <br> ${Obj_Data_Update_Ticket.TIC_DESCRIPCION_SOLUCION}`;
                                                self.EnviaRespuesta("Ticket actualizado.", self.DataTicketOpen.TIC_NEWID, infoMensaje,MensajeNewId)
                                            //}
                                            
                                        }
                                        else {
                                            loadPanel.hide();
                                        }
                                        return in_emp;
                                    })
                                    .catch(function(err){
                                        console.log(err);
                                        loadPanel.hide();
                                        DevExpress.ui.notify({message: `Error al actualizar ticket intentelo nuevamente`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                    });
                                },2000);
                                }
                            } else{
                                loadPanel.hide();
                                DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            }
                            
                        },
                    },
                  },{
                    location: 'after',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'clear',
                        text: 'Cancelar Modificar',
                        type: 'danger',
                        onInitialized: function(e) {  
                            $btn_Cancelar_Modificar_Ticket = e.component;
                        },
                        onClick() {
                            self.editandoForma = false;
                            self.pauseTicket = false;
                            $btn_Modificar_Ticket.option('visible',true);
                            $Btn_Alta_Ticket.option('visible',false);
                            $btn_Salvar_Modifica_Ticket.option('visible',false);
                            $btn_Cancelar_Modificar_Ticket.option('visible',false);
                            self.Frm_Ticket_Servicio_Instance.option('readOnly', true);
                            var StringInfoForm = JSON.stringify(self.DataTicketOpen);
                            self.DataTicketOpen = JSON.parse(StringInfoForm);
                            self.Frm_Ticket_Servicio_Instance.updateData(self.DataTicketOpen);
                        },
                    },
                  }
                /** //BOTONERA MODIFICAR */
                
            ],
        }).dxToolbar('instance');

       
        __obj_Cat_Tpo_Foto = JSON.parse( sessionStorage.getItem('cat_origen_foto'));
        __obj_Cat_Tpo_Foto = jslinq(__obj_Cat_Tpo_Foto).where(function(el) { return el.TIPO_ORIGEN_CLAVE == 'TKT'; }).toList();

        $('#Pop_Notificacion_Success').dxPopup({
            width: 20,
            height: 20,
            visible: false,
            showTitle: false,
            title: 'Information',
            hideOnOutsideClick: false,
            onHiding: function (e) {
                e.component.content().empty();
            },
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                    text: 'Cerrar',
                    onClick() {
                    $('#Pop_Notificacion_Success').dxPopup("hide");
                    },
                },
            }]
        }).dxPopup('instance');

        $('#Pop_Upload_Foto_Ticket').dxPopup({
            width: 20,
            height: 20,
            visible: false,
            showTitle: true,
            title: '-',
            hideOnOutsideClick: false,
            onHiding: function (e) {
                e.component.content().empty();
            },
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                    text: 'Cerrar',
                    onClick() {
                        $('#Pop_Upload_Foto_Ticket').dxPopup("hide");
                        self.Get_Ticket_Foto();
                        self.Get_Ticket_Documentos(false);
                    },
                },
            }]
        }).dxPopup('instance');

        

        $('#Pop_CrearVerRespuesta').dxPopup({
            width: '80%',
            height: 400,
            visible: false,
            showTitle: false,
            shading: false,
            title: 'Respuesta/Mensaje',
            hideOnOutsideClick: false,
            contentTemplate: function(e) {  
                var formContainer = $("<div id='Frm_MensajeRespuesta'>");  
                formContainer.dxForm({  
                    readOnly: false,
                    showColonAfterLabel: true,
                    showValidationSummary: false,
                    validationGroup: 'Validacion_Frm_MensajeRespuesta',
                    labelMode: 'static',
                    labelLocation: 'top',
                    colCount:1,
                    screenByWidth(width) {
                        return (width < 700) ? 'sm' : 'lg';
                    }, 
                    items:[ 
                        {
                            colSpan:2,
                            dataField: "RESPUESTA_ASUNTO",
                            editorType: "dxTextBox",
                            label: {
                                text: 'Asunto'
                            },
                            editorOptions: {
                                readOnly: false,
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "requerido"
                            }]
                        },{
                            dataField: 'RESPUESTA_DESCRIPCION',
                            label: { 
                                text: "Descripción/Observación"
                            },
                            editorType: 'dxHtmlEditor',
                            editorOptions: {
                                height: 130,
                                toolbar: {
                                  items: [
                                    'undo', 'redo', 'separator',
                                    {
                                        name: 'size',
                                        acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
                                    },
                                    {
                                        name: 'font',
                                        acceptedValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
                                    },
                                    'separator',
                                    'bold', 'italic', 'strike', 'underline', 'separator',
                                    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
                                    'color', 'background',
                                  ]
                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "requerido"
                            }]
                        }
                    ]
                }).dxForm("instance");
                let dxFileformContainer = $("<div id='FileCorreoRespuesta'>");

                dxFileformContainer.dxFileUploader({
                    multiple: true,
                    allowedFileExtensions: self.ArchivosPermitidos,
                    uploadMode: "useButtons",
                    visible: true,
                    disabled: false,
                    onValueChanged: function (e) {  
                        var values = e.component.option("values");  
                        $.each(values, function (index, value) {  
                            e.element.find(".dx-fileuploader-upload-button").hide();  
                        });  
                        e.element.find(".dx-fileuploader-upload-button").hide();  
                    },  
                }).dxFileUploader("instance");

                let arP =JSON.stringify(self.ArchivosPermitidos);
                const popupContentTemplate = function (container) {
                    return $('<div style="height:100%;">').append(
                        formContainer,
                        '<div class="heading_InnerFrm" style="margin-bottom:5px;"><h2>Archivos permitidos: '+arP+'</h2></div>',
                        dxFileformContainer,
                    );
                };
                e.append(popupContentTemplate);
            },
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                    icon: 'save',
                    type: 'success',
                    text: 'Enviar respuesta',
                    onClick() {
                        loadPanel.show();
                        var Form_Data_Respuesta = $("#Frm_MensajeRespuesta").dxForm("instance").option('formData');
                        let Form_Data_Ticket = self.Frm_Ticket_Servicio_Instance.option('formData');
                        if ($("#Frm_MensajeRespuesta").dxForm("instance").validate().isValid === false) {
                            DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            loadPanel.hide();
                            return
                        }
                        let flupl_Instance = $('#FileCorreoRespuesta').dxFileUploader('instance');
                        let fileWrappers = flupl_Instance._files;
                        if (fileWrappers.length > 0) {
                            for(let i =0; i<fileWrappers.length; i++) {
                                let fileValidation = fileWrappers[i];
                                if (fileValidation.isValid() == false) {
                                    loadPanel.hide();
                                    DevExpress.ui.notify({message: `Un archivo no cumple con las reglas`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                    return;
                                } 
                            }
                        }
                        var MensajeNewId = createUUID(36)
                        var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                        var _DatosRespuestaAlta = Form_Data_Respuesta
                        _DatosRespuestaAlta.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                        _DatosRespuestaAlta.TIC_CSCTICKET = Form_Data_Ticket.TIC_CSCTICKET;
                        _DatosRespuestaAlta.SAMT_ESTATUS_RESPUESTA_CSC=1; 
                        _DatosRespuestaAlta.RESPUESTA_FECHAHORA_ALTA = FechaActualSistema;
                        _DatosRespuestaAlta.AUDITORIA_USU_ALTA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                        _DatosRespuestaAlta.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO; 
                        _DatosRespuestaAlta.AUDITORIA_FEC_ALTA = FechaActualSistema;
                        _DatosRespuestaAlta.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                        _DatosRespuestaAlta.RESPUESTA_NOMBRE = obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO +' '+ obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO;
                        _DatosRespuestaAlta.TICKET_MENSAJE_NEWID = MensajeNewId;
                        if (getUrlParam('TPO_USUARIO') == 'GENERA') {
                            _DatosRespuestaAlta.RESPUESTA_LEIDO_CLIENTE = true;
                            _DatosRespuestaAlta.RESPUESTA_FEC_LEIDO_CLIENTE = FechaActualSistema;
                            _DatosRespuestaAlta.RESPUESTA_CLAVE = "CLIENTE";                        
                        } else{
                            _DatosRespuestaAlta.RESPUESTA_LEIDO_OPERADOR = true;
                            _DatosRespuestaAlta.RESPUESTA_FEC_LEIDO_OPERADOR = FechaActualSistema;
                            _DatosRespuestaAlta.RESPUESTA_CLAVE = "OPERADOR";
                        }

                        var objInsert = {
                            ...ReturnDefaultData_Init(),
                            DATA_INSERT: _DatosRespuestaAlta
                        };

                        self.attachDocToMessageTicket(MensajeNewId);
                        
                        
                        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Respuesta_Mensaje','POST',JSON.stringify(objInsert),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                            if (in_emp.success == true) {
                                DevExpress.ui.notify({message: `Mensaje creado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                loadPanel.hide();
                                if (getUrlParam('TPO_USUARIO') == 'GENERA') {
                                                
                                } else {
                                    let AsuntoOrigen = `${Form_Data_Ticket.TIC_ASUNTO_ORIGEN} ###${Form_Data_Ticket.TIC_CSCTICKET}###${Form_Data_Ticket.TIC_NEWID}`
                                    self.EnviaRespuesta("Respuesta",  Form_Data_Ticket.TIC_NEWID, _DatosRespuestaAlta.RESPUESTA_DESCRIPCION, MensajeNewId)
                                    $('#Pop_CrearVerRespuesta').dxPopup("hide");
                                }

                                self.Get_Respuesta_Mensaje(self.Frm_Ticket_Servicio_Instance.option('formData').TIC_CSCTICKET);
                            }
                            else {
                                loadPanel.hide();
                            }
                            return in_emp;
                        }).catch(function(e){
                            console.log(e);
                            loadPanel.hide();
                            DevExpress.ui.notify({message: `ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                        });

                    },
                },
            },{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                  text: 'Cerrar',
                  onClick() {
                    $('#Pop_CrearVerRespuesta').dxPopup("hide");
                  },
                },
            }],
            onHiding: function (e) {
                $("#Frm_MensajeRespuesta").dxForm("instance").resetValues();
                $('#FileCorreoRespuesta').dxFileUploader('instance').reset();
            },
        }).dxPopup('instance');

        self.attachDocToMessageTicket = function(MensajeNewId){
            let cpmFilesToMessage = $('#FileCorreoRespuesta').dxFileUploader('instance')
            let files = cpmFilesToMessage.option("value");
            let fileWrappers = cpmFilesToMessage._files;

            if (files.length == 0) {
                
                return;
            }
            if (fileWrappers.length > 0) {
                for(let i =0; i<fileWrappers.length; i++) {
                    let fileValidation = fileWrappers[i];
                    if (fileValidation.isValid() == false) {
                        self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Un archivo no cumple con las reglas`, 400, 130);
                        return;
                    } 
                }
            }
            
            let formData = new FormData();
            let ExtraVars = {
                ClaveEmp: localStorage.getItem('EMP_CLV_EMPRESA'),
                EmpresaHost: parseInt(localStorage.getItem('EMP_CSC_EMPRESA_HOST')),
                TypeCon: localStorage.getItem('Type'),
                ClaveDoc: "TICKET_MENSAJE",
                IdEmpleado: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                cscEmpleado: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                NewIdEquipo: self.Frm_Ticket_Servicio_Instance.getEditor("TIC_NEWID").option("value"),
                OrigenCrea: self.TipoOrigenCreacion,
                NewIdMessage: MensajeNewId
            };
            console.log(ExtraVars);
            
            formData.append('extra', JSON.stringify(ExtraVars));

            if (files.length > 0) {
                for(let i =0; i<files.length; i++) {
                    let file = files[i];
                    formData.append('fileToUpload', file);
                }    
            }

            $.ajax({
                xhr: function() {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        //self.uploadProgressBar.option("visible", true);
                        let percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        //self.uploadProgressBar.option("value", percentComplete);
                        console.log(percentComplete);
                    }
                    }, false);
                    return xhr;
                },
                type: 'POST',
                //url: `http://localhost:3003/uploadAttachmentMessageToTicket`,
                url: `${getJSON(DeveloperType).Bot_Internal_Storage_Anam.url}uploadAttachmentMessageToTicket`,
                data: formData,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                headers: {
                    //"access-token": getJSON(DeveloperType).ApiSuraCrmColombia.token
                }
            }).done(function(data) {
                if (data.success == true) {
                    //self.uploadProgressBar.option("visible", false)
                    cpmFilesToMessage.reset();
                    DevExpress.ui.notify({message: `Archivo(s) cargado(s) correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                    self.Get_Ticket_Documentos(false);
                } else {
                }
            }).fail( function(e) {
                console.log(e);
                DevExpress.ui.notify({message: `Error de comunicación con servidor`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            });
        }


        $('#Pop_Califica_Ticket_Solicitante').dxPopup({
            width: 400,
            height: 300,
            visible: false,
            showTitle: true,
            title: 'Su opinion es muy importante, por favor califique el servicio.',
            hideOnOutsideClick: false,
            contentTemplate: function(e) {  
                var formContainer = $("<div id='frmCalificaTicket'>");  
                formContainer.dxForm({  
                    readOnly: false,
                    showColonAfterLabel: true,
                    showValidationSummary: false,
                    validationGroup: 'Validacion_frmCalificaTicket',
                    labelMode: 'static',
                    labelLocation: 'top',
                    colCount:1,
                    screenByWidth(width) {
                        return (width < 700) ? 'sm' : 'lg';
                    }, 
                    items:[
                        {
                            colSpan:1,
                            dataField: "TIPO_CALIFICACION_CSC",
                            editorType: "dxSelectBox",
                            label: {
                                text: "Calificación"
                            },
                            editorOptions: {
                                searchEnabled:true,
                                displayExpr: "TIPO_CALIFICACION_IDIOMA1",
                                valueExpr: "TIPO_CALIFICACION_CSC",
                                deferRendering: false,
                                dataSource: new DevExpress.data.DataSource({
                                    loadMode: "raw", paginate: false,    
                                    load: async function () {
                                        try {
                                            var _ary_Severidad = {Tbl:"SAMT_TIPO_CALIFICACION",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_CALIFICACION_ACTIVO = 1 " };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Severidad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                                if (all_data.success == true){
                                                    var _ary_Dataset_Estatus =  jslinq( all_data.JsonData ).where(function(el) { return el.TIPO_CALIFICACION_CLAVE != "NA"  ;}).toList();
                                                    return _ary_Dataset_Estatus;
                                                }
                                                else {
                                                    console.log(all_data.message);
                                                }
                                            });
                                        }
                                        catch (error) {
                                            console.log(error);
                                        }
                                    }
                                }),
                                onOpened: function(e) {
                                    e.component.getDataSource().load().done(function(data) {
                                        self.TIPO_CALIFICACION_CSC = data;
                                        var __ActiveCat = jslinq(data).where(function(el) {
                                            return el.TIPO_CALIFICACION_ACTIVO == 1;
                                        }).toList();
                                        e.component.option('dataSource', __ActiveCat);
                                    });
                                },
                                onClosed: function(e) {
                                    if (e.component.getDataSource().items() !== self.TIPO_CALIFICACION_CSC) {
                                        e.component.option('dataSource', self.TIPO_CALIFICACION_CSC);
                                    }
                                },
                                onValueChanged: function (e) {
                                    var newValue = e.value;
                                    var item = e.component.option('selectedItem')
                                    if (item == null) {
                                        //self.Frm_Ticket_Servicio_Instance.getEditor("TIC_MOTIVO_RECHAZO").option('visible', false);
                                    } else {
                                        if (item.TIPO_CALIFICACION_CLAVE == 'CCC') {
                                            $("#frmCalificaTicket").dxForm("instance").itemOption("TIC_CALIFICACION_COMENTARIO", 'isRequired', true);
                                        } else {
                                            $("#frmCalificaTicket").dxForm("instance").itemOption("TIC_CALIFICACION_COMENTARIO", 'isRequired', false);
                                        }
                                    }
                                },
                                
                            },
                            validationRules: [{
                                type: "required",
                                message: "requerido"
                            }]
                        },
                        {
                            dataField: 'TIC_CALIFICACION_COMENTARIO',
                            editorType: "dxTextArea",
                            colSpan:1,
                            label: { 
                                text: "Descripción/Observación"
                            },
                            editorOptions: {
                                height:150,
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    //if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                },
                                buttons: [{
                                    name: 'ObtenPortapapel',location: 'after',options: {stylingMode: 'Contained',icon: 'pasteplaintext',type: 'normal',onClick(e) {self.ObtenClipboard("Frm_MensajeRespuesta",'RESPUESTA_DESCRIPCION');}}
                                }]
                            },
                           
                        },
                    ]
                }).dxForm("instance");  
                e.append(formContainer);  
            },
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                    icon: 'save',
                    type: 'success',
                    text: 'Calificar',
                    onClick() {
                        var frm = $("#frmCalificaTicket").dxForm("instance").option('formData');
                        if ($("#frmCalificaTicket").dxForm("instance").validate().isValid === true) {
                            var Obj_Data_Update_Ticket = frm;
                            Obj_Data_Update_Ticket.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            Obj_Data_Update_Ticket.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            Obj_Data_Update_Ticket.TIC_CERRADO = true;
                            Obj_Data_Update_Ticket.TIC_CERRADO_POR_SISTEMA = 0;
                            Obj_Data_Update_Ticket.TIC_CALIFICADO = 1;
                            Obj_Data_Update_Ticket.TIC_CALIFICACION_FECHA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            
                            var __Obj_Update = {
                                ...ReturnDefaultData_Init(),
                                DATA_UPDATE: Obj_Data_Update_Ticket,
                                DATA_WHERE:{
                                    "TIC_CSCTICKET":self.DataTicketOpen.TIC_CSCTICKET,
                                    "TIC_NEWID":self.DataTicketOpen.TIC_NEWID,
                                    "EMP_CSC_EMPRESA_HOST":localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                }
                            };
                            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Update_Ticket_Servicio','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                                if (in_emp.success == true) {
                                    var __Oj_Dts_Busqueda = {
                                        ...ReturnDefaultData_Init(),
                                        TIC_NEWID: self.DataTicketOpen.TIC_NEWID
                                    }
                                    self.Get_Tickets(__Oj_Dts_Busqueda,false,null);
                                    $('#Pop_Califica_Ticket_Solicitante').dxPopup("hide");
                                }}
                            ).catch(function(e){
                                DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                            });
                        } else{
                            self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Llene los campos en rojo.`, 400, 130);
                        }
                    },
                },
            },{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                  text: 'Cerrar',
                  onClick() {
                    $('#Pop_Califica_Ticket_Solicitante').dxPopup("hide");
                    //self.Get_Bitacora_tickets(self.DataTicketOpen.TIC_CSCTICKET);
                  },
                },
            }],
            onHiding: function (e) {
                //self.Get_Bitacora_tickets(self.DataTicketOpen.TIC_CSCTICKET);
                $("#frmCalificaTicket").dxForm("instance").resetValues();
            },
        }).dxPopup('instance');


        $('#Pop_Insertar_BitacoraManual').dxPopup({
            width: 400,
            height: 300,
            visible: false,
            showTitle: false,
            title: 'Ingrese bitacora',
            hideOnOutsideClick: false,
            contentTemplate: function(e) {  
                var formContainer = $("<div id='Frm_BitacoraManual'>");  
                formContainer.dxForm({  
                    readOnly: false,
                    showColonAfterLabel: true,
                    showValidationSummary: false,
                    validationGroup: 'Validacion_Frm_BitacoraManual',
                    labelMode: 'static',
                    labelLocation: 'top',
                    colCount:1,
                    screenByWidth(width) {
                        return (width < 700) ? 'sm' : 'lg';
                    }, 
                    items:[{
                            dataField: 'INFO_BITACORA',
                            editorType: "dxTextArea",
                            colSpan:6,
                            label: { 
                                text: "Descripción/Observación"
                            },
                            editorOptions: {
                                height:150,
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    //if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                },
                                buttons: [{
                                    name: 'ObtenPortapapel',location: 'after',options: {stylingMode: 'Contained',icon: 'pasteplaintext',type: 'normal',onClick(e) {self.ObtenClipboard("Frm_MensajeRespuesta",'RESPUESTA_DESCRIPCION');}}
                                }]
                            },
                            validationRules: [{
                                type: "required",
                                message: "requerido"
                            }]
                        },
                    ]
                }).dxForm("instance");  
                e.append(formContainer);  
            },
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                    icon: 'save',
                    type: 'success',
                    text: 'Salvar',
                    onClick() {
                        var frm = $("#Frm_BitacoraManual").dxForm("instance").option('formData');
                        var DetalleTicket = {};
                        DetalleTicket.TIC_CSCTICKET = self.DataTicketOpen.TIC_CSCTICKET;
                        DetalleTicket.ESTATUS_TICKET_CSC = self.DataTicketOpen.ESTATUS_TICKET_CSC;
                        self.InsertaBitacoraManual(DetalleTicket,frm.INFO_BITACORA,false,1,1);
                    },
                },
            },{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                  text: 'Cerrar',
                  onClick() {
                    $('#Pop_Insertar_BitacoraManual').dxPopup("hide");
                    self.Get_Bitacora_tickets(self.DataTicketOpen.TIC_CSCTICKET);
                  },
                },
            }],
            onHiding: function (e) {
                self.Get_Bitacora_tickets(self.DataTicketOpen.TIC_CSCTICKET);
                $("#Frm_BitacoraManual").dxForm("instance").resetValues();
            },
        }).dxPopup('instance');


        $("#Pop_Open_Ot_desde_ticket").dxPopup({
            hideOnOutsideClick:false,
            title: "Orden de trabajo",
            height: '100%',  
            width: '100%',  
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onHiding: function (e) {
                self.Get_Linkeo_ticket_ot(self.DataTicketOpen.TIC_CSCTICKET); 
                self.Get_Autorizaciones_Ticket(self.DataTicketOpen.TIC_NEWID);
                document.getElementById("Mod_Embebed_Ot_desde_ticket").src = "";
            },
            onShowing: function(e) {
                
            },
            onShown: function (e) {
                //document.getElementById("Mod_Embebed_Ot").src = "../MonitoreoVideoLlamada/?roomName="+NewIdCallMonit;  
            }
        });

        function Abrir_Pop_Ots_Ticket(TIPO,OT_NEWID,TICKET_ID) {
            var extraVars = "";
            if (TICKET_ID == undefined) {
                extraVars = "TIPO="+TIPO
            +"&OT_ID="+OT_NEWID;
            } else {
                extraVars = "TIPO="+TIPO
            +"&OT_ID="+OT_NEWID
            +"&TICKET_ID="+TICKET_ID;
            }
            $("#Pop_Open_Ot_desde_ticket").dxPopup("show");
            
            var UrlPop = "/"+self.patname.split('/')[1]+"/views/Vistas_Ordenes_Trabajo/frm_ots/frm_ots.html?"+extraVars;
            document.getElementById("Mod_Embebed_Ot_desde_ticket").src = UrlPop; 
        }


        function titleTemplateTks(itemData, itemIndex, itemElement) {
            let icon = itemData.icon;
            itemElement
            .append($('<img src="'+icon+'" class="navIcon" alt="Icon Menu"/>'))
            .append($("<span>").text(itemData.title))
        }
        
        self.TabPanel_Ticket_Detalle = $("#Tab_Panel_Ticket_Detalle").dxTabPanel({
            onContentReady: function(){
                self.imageUploadToTicket =  $('#fUploadImageToTicket').dxFileUploader({
                    selectButtonText: 'Seleccione archivo(s)',
                    multiple: true,
                    maxFileSize: 20 * 1024 * 1024,
                    //allowedFileExtensions: self.ArchivosPermitidos,
                    accept: "image/*, video/mp4",
                    uploadMode: "useButtons",
                    visible: true,
                    disabled: false,
                    onValueChanged: function (e) {  
                        var values = e.component.option("values");  
                        $.each(values, function (index, value) {  
                            e.element.find(".dx-fileuploader-upload-button").hide();  
                        });  
                        e.element.find(".dx-fileuploader-upload-button").hide();  
                    },  
                }).dxFileUploader("instance");
                self.documentsUploadToTicket =  $('#documentsUploadToTicket').dxFileUploader({
                    selectButtonText: 'Seleccione archivo(s)',
                    multiple: true,
                    maxFileSize: 20 * 1024 * 1024,
                    allowedFileExtensions: self.extensionesDocumentos,
                    uploadMode: "useButtons",
                    visible: true,
                    disabled: false,
                    onValueChanged: function (e) {  
                        var values = e.component.option("values");  
                        $.each(values, function (index, value) {  
                            e.element.find(".dx-fileuploader-upload-button").hide();  
                        });  
                        e.element.find(".dx-fileuploader-upload-button").hide();  
                    },  
                }).dxFileUploader("instance");
            },
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            elementAttr: {"id": "Tab-TicketDetalle"},
            dataSource: [],
            selectedIndex: 0, // Initial selected tab index
            showNavButtons: true,
            scrollByContent:true,
            scrollingEnabled:true,
            itemTitleTemplate: titleTemplateTks,
            onSelectionChanged: function(e) {
                var selectedTab = e.addedItems[0]; // Get the selected tab data
                if (getUrlParam('TIPO') == 'ALTA'){
                    if (self.setDefaultValues == true) {
                        $_Btn_Cargar_Imagen_Sistema.option("visible", false);
                        $_Btn_Agregar_Documento.option("visible", false);
                    }
                    return;
                }
                switch (selectedTab.template) {
                    case 'tab_frmticketservicio':
                        self.Get_Ticket_Documentos(false);
                    break;
                    case 'tab_add_empleados':
                        self.Get_Emp_Ticket(self.DataTicketOpen.TIC_NEWID);
                        
                    break;
                    case 'tab_RepFotograf':
                        self.Get_Ticket_Foto();       
                        
                    break;
                    case 'tab_DocumentosTk':
                        self.Get_Ticket_Documentos(false);    
                    break;
                    case 'tab_respuestas_rapidas':
                        self.Get_Respuesta_Mensaje(self.DataTicketOpen.TIC_CSCTICKET);    
                    break;
                    case 'tab_bitacoras':
                        self.Get_Bitacora_tickets(self.DataTicketOpen.TIC_CSCTICKET);
                    break;
                    case 'tab_participantes':
                        self.Get_Ticket_Participantes(self.DataTicketOpen.TIC_NEWID);
                    break;
                    case 'tab_Empleado_Solicita':
                        if (self.DatosEmpleadosGet == null || self.DatosEmpleadosGet == undefined) {
                            self.Get_Datos_Empleado_Solicita(self.DataTicketOpen.EMPLEADO_CSC_SOLICITA);
                        }
                    break;
                }
            }
        }).dxTabPanel('instance'); 

        

        self.VistaSegunCondicion=()=>{
            switch (self.TipoOrigenCreacion) {
                case 1:
                    self.TabPanel_Ticket_Detalle.option("dataSource",  [
                        { icon: '../../../images/Icons/surveys128.png', title: Globalize.formatMessage("tabGeneralTitleTicket"), template: "tab_frmticketservicio"},
                        //{ icon: '../../../images/Icons/icono_30.png', title: Globalize.formatMessage("tabGeneralTitleEmpleados"), template: "tab_add_empleados"},
                        { icon: '../../../images/Icons/Card-file-icon64.png', title: Globalize.formatMessage("tabGeneralTitleRepFoto"), template: "tab_RepFotograf"},
                        { icon: '../../../images/Icons/Card-file-icon64.png', title: Globalize.formatMessage("tabGeneralTitleDocumentos"), template: "tab_DocumentosTk"},
                        { icon: '../../../images/Icons/Content-tree-icon48.png', title: Globalize.formatMessage("tabGeneralTitleMensajeRespuesta"), template: "tab_respuestas_rapidas"},
                        { icon: '../../../images/Icons/Actions-document-edit-icon64.png', title: Globalize.formatMessage("tabGeneralTitleBitacoras"), template: "tab_bitacoras"},
                        //{ icon: '../../../images/Icons/icono_04.png', title: Globalize.formatMessage("tabGeneralTitleAsigCompartida"), template: "tab_participantes"}
                    ]);
                    self.CamposVisiblesDG = true;
                    self.BotonesDisponibles = false;
                break;
    
                case 2:
                    self.TabPanel_Ticket_Detalle.option("dataSource",  [
                        { icon: '../../../images/Icons/surveys128.png', title: Globalize.formatMessage("tabGeneralTitleTicket"), template: "tab_frmticketservicio"},
                        //{ icon: '../../../images/Icons/user-group-icon.png', title: Globalize.formatMessage("tabGeneralTitleEmpleados"), template: "tab_add_empleados"},
                        { icon: '../../../images/Icons/Card-file-icon64.png', title: Globalize.formatMessage("tabGeneralTitleRepFoto"), template: "tab_RepFotograf"},
                        { icon: '../../../images/Icons/Card-file-icon64.png', title: Globalize.formatMessage("tabGeneralTitleDocumentos"), template: "tab_DocumentosTk"},
                        { icon: '../../../images/Icons/Content-tree-icon48.png', title: Globalize.formatMessage("tabGeneralTitleMensajeRespuesta"), template: "tab_respuestas_rapidas"},
                        { icon: '../../../images/Icons/Actions-document-edit-icon64.png', title: Globalize.formatMessage("tabGeneralTitleBitacoras"), template: "tab_bitacoras"},
                        //{ icon: '../../../images/Icons/icono_04.png', title: Globalize.formatMessage("tabGeneralTitleAsigCompartida"), template: "tab_participantes"}
                        //{ icon: '../../../images/Icons/icono_30.png', title: Globalize.formatMessage("tabGeneralTitleEmpleadoSolicita"), template: "tab_Empleado_Solicita"}
                    ]);
                    self.CamposVisiblesDG = true;
                    self.BotonesDisponibles = true;
                break;
            
                default:
                break;
            }
        }
        self.VistaSegunCondicion();

        $("#Frm_Btn_AgregarBitacora").dxForm({
            showColonAfterLabel: true,
            showValidationSummary: false,
            labelMode: 'static',
            labelLocation: 'top',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
              },
            items: [{
                itemType: "group",
                colSpan: 1,
                colCount: 1,
                items:[{
                    colSpan:1,
                    itemType: "button",
                    location: 'before',
                    locateInMenu: 'auto',
                    buttonOptions: {
                        text: "Agregar Bitacora",
                        icon: 'add',
                        type: "success",
                        width: '100%', 
                        visible:true,
                        disabled: false,
                        onInitialized: function(e) {  
                            $_Btn_Agregar_Bitacora = e.component;
                        },
                        onClick() {
                            if ( self.DataTicketOpen.TIC_CERRADO == true) {
                                DevExpress.ui.notify({message: `LA SOLICITUD YA SE ENCUENTRA CERRADO.`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            } else {
                                $("#Pop_Insertar_BitacoraManual").dxPopup("show");
                            }
                        }
                    }
                },{
                    colSpan:9,
                    template:" "
                }]
            }]
        });



        $("#Form_Btn_Cargar_Imagen_Sistema").dxForm({
            showColonAfterLabel: true,
            showValidationSummary: false,
            labelMode: 'static',
            labelLocation: 'top',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
              },
            items: [{
                itemType: "group",
                colSpan: 1,
                colCount: 1,
                items:[{
                    colSpan:1,
                    itemType: "button",
                    location: 'before',
                    locateInMenu: 'auto',
                    buttonOptions: {
                        text: Globalize.formatMessage("Add_Document"),
                        icon: 'upload',
                        type: "success",
                        width: '100%', 
                        visible: true,
                        disabled: false,
                        onInitialized: function(e) {  
                            $_Btn_Cargar_Imagen_Sistema = e.component;
                        },
                        onClick() {
                            if ( self.DataTicketOpen?.TIC_CERRADO == true) {
                                DevExpress.ui.notify({message: `${Globalize.formatMessage("infoTicketClosed")}`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            } else {
                                if (self.setDefaultValues == true) {
                                    self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Las imágenes se darán de alta automáticamente cuando salve el ticket.`, 400, 130);
                                }
                                self.uploadImageToTicket(true)
                            }
                            
                        }
                    }
                },{
                    colSpan:9,
                    template:" "
                }]
            }]
        });
        self.uploadImageToTicket = function(lengthRequired = false){
            if (self.Frm_Ticket_Servicio_Instance.getEditor("CAM_CSC_SERVICIO_SOLICITA").option("value") == null) {
                self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Selecciona el proveedor en el detalle de solicitud`, 400, 130);
                return
            }

            let files = self.imageUploadToTicket.option("value");
            let fileWrappers = self.imageUploadToTicket._files;
            if (files.length == 0) {
                return;
            }
            

            if (lengthRequired == true) {
                if (files.length == 0) {
                    self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debe seleccionar al menos 1 imagen`, 400, 130);
                    return;
                }    
            }
            
            if (fileWrappers.length > 0) {
                for(let i =0; i<fileWrappers.length; i++) {
                    let fileValidation = fileWrappers[i];
                    if (fileValidation.isValid() == false) {
                        self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Un archivo no cumple con las reglas`, 400, 130);
                        return;
                    } 
                }
            }
            
            let formData = new FormData();
            let ExtraVars = {
                ClaveEmp: localStorage.getItem('EMP_CLV_EMPRESA'),
                idEmpleadoProvider: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                newIdTicket: self.Frm_Ticket_Servicio_Instance.getEditor("TIC_NEWID").option("value")
            };
            formData.append('extra', JSON.stringify(ExtraVars));

            if (files.length > 0) {
                for(let i =0; i<files.length; i++) {
                    let file = files[i];
                    formData.append('fileToUpload', file);
                }    
            }

            $.ajax({
                xhr: function() {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        //self.uploadProgressBar.option("visible", true);
                        let percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        //self.uploadProgressBar.option("value", percentComplete);
                        console.log(percentComplete);
                    }
                    }, false);
                    return xhr;
                },
                type: 'POST',
                url: `${getJSON(DeveloperType).Bot_Internal_Storage_Anam.url}uploadImagesToTicket/${self.Frm_Ticket_Servicio_Instance.getEditor("CAM_CSC_SERVICIO_SOLICITA").option("value")}`,
                //url: `http://localhost:3003/uploadImagesToTicket`,
                data: formData,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                headers: {
                    //"access-token": getJSON(DeveloperType).ApiSuraCrmColombia.token
                }
            }).done(function(data) {
                if (data.success == true) {
                    //self.uploadProgressBar.option("visible", false)
                    self.imageUploadToTicket.reset();
                    DevExpress.ui.notify({message: `Imagen(es) cargada(s) correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});

                    self.Get_Ticket_Foto();
                } else {
                }
            }).fail( function(e) {
                console.log(e);
                DevExpress.ui.notify({message: `Error de comunicación con servidor`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            });
        }

        $("#Form_Btn_Agregar_Documento").dxForm({
            showColonAfterLabel: true,
            showValidationSummary: false,
            labelMode: 'static',
            labelLocation: 'top',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
              },
            items: [{
                itemType: "group",
                colSpan: 1,
                colCount: 1,
                items:[{
                    colSpan:1,
                    itemType: "button",
                    location: 'before',
                    locateInMenu: 'auto',
                    buttonOptions: {
                        text: Globalize.formatMessage("Add_Document"),
                        icon: 'upload',
                        type: "success",
                        width: '100%', 
                        visible:true,
                        disabled: false,
                        onInitialized: function(e) {  
                            $_Btn_Agregar_Documento = e.component;
                        },
                        onClick() {
                            if ( self.DataTicketOpen?.TIC_CERRADO == true) {
                                DevExpress.ui.notify({message: `${Globalize.formatMessage("infoTicketClosed")}`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            } else {    
                                self.uploadFileToTicket(true);
                            }
                        }
                    }
                },{
                    colSpan:9,
                    template:" "
                }]
            }]
        });
        self.uploadFileToTicket = function(lengthRequired = false){
            if (self.Frm_Ticket_Servicio_Instance.getEditor("CAM_CSC_SERVICIO_SOLICITA").option("value") == null) {
                self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Selecciona el proveedor en el detalle de solicitud`, 400, 130);
                return
            }
            let files = self.documentsUploadToTicket.option("value");
            let fileWrappers = self.documentsUploadToTicket._files;
            if (files.length == 0) {
                return;
            }   
            

            if (lengthRequired == true) {
                if (files.length == 0) {
                    self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debe seleccionar al menos 1 archivo`, 400, 130);
                    return;
                }    
            }
            if (fileWrappers.length > 0) {
                for(let i =0; i<fileWrappers.length; i++) {
                    let fileValidation = fileWrappers[i];
                    if (fileValidation.isValid() == false) {
                        self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Un archivo no cumple con las reglas`, 400, 130);
                        return;
                    } 
                }
            }
            
            let formData = new FormData();

            let ExtraVars = {
                ClaveEmp: localStorage.getItem('EMP_CLV_EMPRESA'),
                //EmpresaHost: parseInt(localStorage.getItem('EMP_CSC_EMPRESA_HOST')),
                //TypeCon: localStorage.getItem('Type'),
                //ClaveDoc: "TICKET",
                idEmpleadoProvider: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                //cscEmpleado: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                newIdTicket: self.Frm_Ticket_Servicio_Instance.getEditor("TIC_NEWID").option("value"),
                //OrigenCrea: self.TipoOrigenCreacion
            };
            formData.append('extra', JSON.stringify(ExtraVars));

            if (files.length > 0) {
                for(let i =0; i<files.length; i++) {
                    let file = files[i];
                    formData.append('fileToUpload', file);
                }    
            }

            $.ajax({
                xhr: function() {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        //self.uploadProgressBar.option("visible", true);
                        let percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        //self.uploadProgressBar.option("value", percentComplete);
                        console.log(percentComplete);
                    }
                    }, false);
                    return xhr;
                },
                type: 'POST',
                url: `${getJSON(DeveloperType).Bot_Internal_Storage_Anam.url}uploadDocumentToTicket/${self.Frm_Ticket_Servicio_Instance.getEditor("CAM_CSC_SERVICIO_SOLICITA").option("value")}`,
                //url: `http://localhost:3003/uploadDocumentToTicket`,
                data: formData,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                headers: {
                    //"access-token": getJSON(DeveloperType).ApiSuraCrmColombia.token
                }
            }).done(function(data) {
                if (data.success == true) {
                    //self.uploadProgressBar.option("visible", false)
                    self.documentsUploadToTicket.reset();
                    DevExpress.ui.notify({message: `Archivo(s) cargado(s) correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                    self.Get_Ticket_Documentos(false);
                } else {
                }
            }).fail( function(e) {
                console.log(e);
                DevExpress.ui.notify({message: `Error de comunicación con servidor`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            });
        }

        $("#Form_Btn_Agregar_Mensaje").dxForm({
            showColonAfterLabel: true,
            showValidationSummary: false,
            labelMode: 'static',
            labelLocation: 'top',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
            },
            items: [{
                itemType: "group",
                colSpan: 1,
                colCount: 1,
                items:[{
                    colSpan:1,
                    itemType: "button",
                    location: 'before',
                    locateInMenu: 'auto',
                    buttonOptions: {
                        text: "Agregar Respuesta",
                        icon: 'add',
                        type: "success",
                        width: '100%', 
                        visible:true,
                        disabled: false,
                        onInitialized: function(e) {  
                            $_Btn_Agregar_Respuesta = e.component;
                        },
                        onClick() {
                            if ( self.DataTicketOpen.TIC_CERRADO == true) {
                                DevExpress.ui.notify({message: `LA SOLICITUD YA SE ENCUENTRA CERRADO.`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            } else {
                                $("#Pop_CrearVerRespuesta").dxPopup("show");
                            }
                        }
                    }
                },{
                    colSpan:9,
                    template:" "
                }]
            }]
        });

        $("#Form_Btn_Alta_Ticket_Ot").dxForm({
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: false,
            labelMode: 'static',
            labelLocation: 'top',
            colCount:1,
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
              },
            items: [{
                itemType: "group",
                colSpan: 1,
                colCount: 1,
                items:[{
                    colSpan:1,
                    itemType: "button",
                    location: 'before',
                    locateInMenu: 'auto',
                    buttonOptions: {
                        text: "Agregar Orden de trabajo",
                        icon: 'add',
                        type: "success",
                        width: '100%', 
                        visible:true,
                        onInitialized: function(e) {  
                            $_btn_Alta_Ticket_Ot = e.component;
                        },
                        onClick() {
                            if ( self.DataTicketOpen.TIC_CERRADO == true) {
                                DevExpress.ui.notify({message: `LA SOLICITUD YA SE ENCUENTRA CERRADO.`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            } else {
                                Abrir_Pop_Ots_Ticket('ALTA', null, self.DataTicketOpen.TIC_CSCTICKET)
                            }
                        }
                    }
                },{
                    colSpan:9,
                    template:" "
                }]
            }]
        });

        self.Frm_Autoriza_Instance = $("#Form_Btn_Alta_Autorizacion").dxForm({
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: 'Form_Btn_Alta_Autorizacion',
            labelMode: 'static',
            labelLocation: 'top',
            colCount:4,
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
            },
            items: [{
                itemType: "group",
                colSpan: 4,
                colCount: 4,
                items:[{
                    colSpan:4,
                    dataField: "TIPO_AREA_CSC_RESPONSABLE",
                    editorType: "dxSelectBox",
                    label: {
                        text: "Area"
                    },
                    editorOptions: {
                        searchEnabled:true,
                        displayExpr: "TIPO_AREA_IDIOMA1",
                        valueExpr: "TIPO_AREA_CSC",
                        dataSource: new DevExpress.data.DataSource({
                            store: new DevExpress.data.CustomStore({
                                key: _keyTpoAreaCsc,
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    var _ary = {Tbl:"SAMT_CAT_EMPLEADO_AREA"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            return jslinq( all_data.JsonData ).where(function(el){return el.CAM_CSC_MESA == obj_DatosEmpleado.CAM_CSC_MESA;}).orderBy(function(el){return el.TIPO_AREA_IDIOMA1;}).toList();
                                            //return jslinq( all_data.JsonData ).orderBy(function(el){return el.TIPO_AREA_IDIOMA1;}).toList();;
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                            })
                        }),
                        onOpened: function(e) {
                            e.component.getDataSource().load().done(function(data) {
                                self.TIPO_AREA_CSC = data;
                                var __ActiveCat = jslinq(data).where(function(el) {
                                    return el.TIPO_AREA_ACTIVO == 1;
                                }).toList();
                                e.component.option('dataSource', __ActiveCat);
                            });
                        },
                        onClosed: function(e) {
                            if (e.component.getDataSource().items() !== self.TIPO_AREA_CSC) {
                                e.component.option('dataSource', self.TIPO_AREA_CSC);
                            }
                        },
                        onValueChanged: function (e) {
                            var newValue = e.value;
                            var componente1 = self.Frm_Autoriza_Instance.getEditor('CAT_DEPTO_CSC_RESPONSABLE');
                            componente1.option('value', null);
                            var _ary = {Tbl:"SAMT_CAT_EMPLEADO_DEPARTAMENTO",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_AREA_CSC = " + newValue };
                            __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                if (all_data.success == true){
                                    componente1.option('dataSource', all_data.JsonData);
                                }
                                else {
                                    componente1.option('dataSource', []);
                                }
                            });

                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "requerido"
                    }]
                },{
                    colSpan:4,
                    dataField: "CAT_DEPTO_CSC_RESPONSABLE",
                    editorType: "dxSelectBox",
                    label: {
                        text: "Departamento"
                    },
                    editorOptions: {
                        searchEnabled:true,
                        displayExpr: "SAMT_TIPO_DEPARTAMENTO_IDIOMA1",
                        valueExpr: "EMPLEADO_DEPARTAMENTO_CSC",
                        onValueChanged: function (e) {
                            var newValue = e.value;
                            var componente3 = self.Frm_Autoriza_Instance.getEditor('EMPLEADO_CSC_EMPLEADO');
                            var data_obj_Empleado = {
                                ...ReturnDefaultData_Init(),
                                ...ReturnProcSubProcEstatus(),
                                TIPO_CONSULTA: 'AVANZADO',
                                INFO: "ALLEMP",
                                CAT_DEPARTAMENTO_CSC: newValue
                            };    
                            __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'GetEmpleado','GET',data_obj_Empleado,getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                                if (in_emp.success == true) {      
                                    var selectedRowsData = in_emp.JsonData;
                                    componente3.option('dataSource', selectedRowsData);
                                    loadPanel.hide();
                                } else{
                                    loadPanel.hide();
                                }
                            }).catch(function(e){
                                DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                                loadPanel.hide();
                            });
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "requerido"
                    }]
                },{
                    colSpan:4,
                    dataField: "EMPLEADO_CSC_EMPLEADO",
                    editorType: "dxSelectBox",
                    label: {
                        text: "Empleado Asignado"
                    },
                    editorOptions: {
                        searchEnabled:true,
                        displayExpr: "NOMBRE",
                        valueExpr: "EMPLEADO_CSC_EMPLEADO",
                        deferRendering: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "requerido"
                    }]
                },{
                    colSpan:4,
                    itemType: "button",
                    location: 'before',
                    locateInMenu: 'auto',
                    buttonOptions: {
                        text: "Solicitar autorización",
                        icon: 'add',
                        type: "success",
                        width: '100%', 
                        visible:true,
                        onInitialized: function(e) {  
                            $btn_Alta_Ticket_Autorizacion = e.component;
                        },
                        onClick() {
                            if ( self.DataTicketOpen.TIC_CERRADO == true) {
                                DevExpress.ui.notify({message: `LA SOLICITUD YA SE ENCUENTRA CERRADO.`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            } else {
                                if (self.Frm_Autoriza_Instance.validate().isValid === true) {
                                    loadPanel.show();

                                    var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');

                                    var Obj_Data_Insert_Ticket_Autorizacion = GetInsertData(self.Frm_Autoriza_Instance.option('formData'),self.Frm_Autoriza_Instance);
                                    Obj_Data_Insert_Ticket_Autorizacion.AUDITORIA_USU_ALTA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                    Obj_Data_Insert_Ticket_Autorizacion.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                    Obj_Data_Insert_Ticket_Autorizacion.AUDITORIA_FEC_ALTA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                    Obj_Data_Insert_Ticket_Autorizacion.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                    Obj_Data_Insert_Ticket_Autorizacion.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                                    Obj_Data_Insert_Ticket_Autorizacion.AUTORIZACIONES_TIC_NEWID = Form_Data_Ticket_servicio.TIC_NEWID;
                                    Obj_Data_Insert_Ticket_Autorizacion.CAM_MESA_CSC = Form_Data_Ticket_servicio.CAM_MESA_CSC;
                                    Obj_Data_Insert_Ticket_Autorizacion.SAMT_TIPO_RESPUESTA_AUTORIZA_CSC = 2;
                                    Obj_Data_Insert_Ticket_Autorizacion.AUTORIZACIONES_NEWID = createUUID(36);
                                    Obj_Data_Insert_Ticket_Autorizacion.AUTORIZADO_ACTIVO = 1;

                                    delete Obj_Data_Insert_Ticket_Autorizacion['CAT_DEPTO_CSC_RESPONSABLE'];
                                    delete Obj_Data_Insert_Ticket_Autorizacion['TIPO_AREA_CSC_RESPONSABLE'];

                                    var objInsert = {
                                        ...ReturnDefaultData_Init(),
                                        DATA_INSERT: Obj_Data_Insert_Ticket_Autorizacion
                                    };
                                    
                                    __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Autoriza_Ticket','POST',JSON.stringify(objInsert),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                                        if (in_emp.success == true) {
                                            self.Frm_Autoriza_Instance.resetValues();
                                            DevExpress.ui.notify({message: `Solicitud de autorización agregada correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                            self.Get_Autorizaciones_Ticket(Form_Data_Ticket_servicio.TIC_NEWID);

                                            var falt = null;
                                            if(Form_Data_Ticket_servicio.TIC_FECHA_ALTA){
                                                falt = ConvertDatetimeToStringBD(Form_Data_Ticket_servicio.TIC_FECHA_ALTA);
                                            }

                                            var fprom = null;
                                            if(Form_Data_Ticket_servicio.TIC_FECHA_PROMESA){
                                                fprom = ConvertDatetimeToStringBD(Form_Data_Ticket_servicio.TIC_FECHA_PROMESA);
                                            }

                                            var fprog = null;
                                            if(Form_Data_Ticket_servicio.TIC_FECHA_SOLICITA){
                                                fprog = ConvertDatetimeToStringBD(Form_Data_Ticket_servicio.TIC_FECHA_SOLICITA);
                                            }
                                            loadPanel.hide();
                                        }
                                        else {
                                            loadPanel.hide();
                                        }
                                        return in_emp;
                                    }).catch(function(e){
                                        console.log(e);
                                        loadPanel.hide();
                                        DevExpress.ui.notify({message: `ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                    });

                                }
                            }
                            
                        }
                    }
                },{
                    colSpan:9,
                    template:" "
                }]
            }]
        }).dxForm("instance");
        
        self.Frm_Ticket_Servicio_Instance = $('#__Frm_Ticket_Servicio').dxForm({
            onContentReady: function(){
                setTimeout(() => {
                    /* FUNCIONES DE INICIALIZACION*/
                    if (getUrlParam('TIPO') == 'EDITAR') {
                        var __Oj_Dts_Busqueda = {
                            ...ReturnDefaultData_Init(),
                            TIC_NEWID: getUrlParam('TK_ID'),
                            CAM_CSC_SERVICIO: parseInt(getUrlParam('CSC_MESA')),
                        }
                        self.Get_Tickets(__Oj_Dts_Busqueda,false,null);
                    } else if (getUrlParam('TIPO') == 'ALTA') {
                        try {
                            self.ClickAlta();
                        } catch (error) {
                            console.log(error);
                        }
                       
                        $('#__Frm_Ticket_Servicio').dxForm('instance').getEditor("CAM_MESA_CSC").option("value",getUrlParam('CSC_MESA'));
                        //$('#__Frm_Ticket_Servicio').dxForm('instance').getEditor("SFP_SOLICITUD_PAIS").option("value",1);
                        
                    } else if (getUrlParam('TIPO') == 'LECTURA') {
                        var __Oj_Dts_Busqueda = {
                            ...ReturnDefaultData_Init(),
                            TIC_NEWID: getUrlParam('TK_ID'),
                            CAM_CSC_SERVICIO: parseInt(getUrlParam('CSC_MESA')),
                        }
                        self.Get_Tickets(__Oj_Dts_Busqueda,false,null);
                        $('#___Tb_Tickets').dxToolbar('instance').option('visible',false);
                        
                    }
                    /* FUNCIONES DE INICIALIZACION*/
                    $("#splashscreen").fadeOut(1000);
                }, 1000);
            },
            readOnly: true,
            height: '100%',
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: '__Frm_Ticket_Servicio_Validation',
            labelMode: 'outside',
            labelLocation: 'top',
            screenByWidth(width) {return (width < 700) ? 'sm' : 'lg';},
            items: [
            /** INICIO: NO VISIBLES */
                {
                    itemType: "group",
                    cssClass:"hidden_box",
                    colCount: 6,
                    items:[
                        {
                            colSpan:6,
                            dataField: "TIC_TIEMPO_RECEPCION",
                            label: {
                                text: "TRECEPCION"
                            },
                            editorOptions: {
                                readOnly:true,
                                disabled: false
                            }	
                        },     
                        {
                            colSpan:6,
                            dataField: "TIC_TIEMPO_EJECUCION",
                            label: {
                                text: "TEJECUTA"
                            },
                            editorOptions: {
                                readOnly:true,
                                disabled: false
                            }	
                        },{
                            colSpan:6,
                            dataField: "TIC_TIEMPO_CONFIRMACION",
                            label: {
                                text: "TCONFIRMA"
                            },
                            editorOptions: {
                                readOnly:true,
                                disabled: false
                            }	
                        },
                        {
                            colSpan:6,
                            dataField: "TIC_NEWID",
                            label: {
                                text: "UUID"
                            },
                            editorOptions: {
                                readOnly:true,
                                disabled: false
                            }
                        },
                    ]
                },
            /** FIN: NO VISIBLES */
            {
                itemType: "group",
                colCount: 6,
                items:[
                    
                    {
                        colSpan:2,
                        dataField: "TIC_FECHA_ALTA",
                        editorType: "dxDateBox",
                        label: { 
                                text: "Fecha de alta"
                        },
                        editorOptions: {
                            type: 'datetime',
                            //disabled: true,
                            readOnly: true,
                            width:'100%',
                            placeholder: "DD/MM/AAAA HH:mm:ss",
                            useMaskBehavior: true,
                            displayFormat: "dd/MM/yyyy HH:mm:ss",
                            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                            onValueChanged: function (e) {
                                
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },
                    {
                        colSpan:2,
                        dataField: "TIC_CSCTICKET",
                        label: {
                            text: `${Globalize.formatMessage("ticketNumber")}`
                        },
                        editorOptions: {
                            readOnly:true,
                            disabled: false
                        }	
                    },{
                        colSpan:2,
                        dataField: "TIC_CERRADO",
                        editorType: "dxSwitch",
                        label: {
                            text: "Abierto/Cerrado",
                        },
                        editorOptions: {
                            readOnly: true,
                            switchedOffText:"Abierto",
                            switchedOnText:"Cerrado",
                            width:"100%",
                            onValueChanged: function(e){
                                /*var form = $("#__Frm_Ticket_Servicio").dxForm("instance");
                                form.itemOption("TIC_DESCRIPCION_SOLUCION", 'isRequired', e.value);*/
                            }
                        }
                    },{
                        colSpan:2,
                        dataField: "CAM_MESA_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: `${Globalize.formatMessage("lblMesaCsc")}`
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "CAM_MESA_IDIOMA1",
                            valueExpr: "CAM_MESA_CSC",
                            dataSource: self._CMB_SAMT_CAM_MESA_DE_AYUDA_OBJDATA,
                            readOnly: true,
                            onOpened: function(e) {
                                e.component.getDataSource().load().done(function(data) {
                                    self.CAM_MESA_CSC = data;
                                    var __ActiveCat = jslinq(data).where(function(el) {
                                        return el.CAM_MESA_ACTIVO == 1;
                                    }).toList();
                                    e.component.option('dataSource', __ActiveCat);
                                });
                            },
                            onClosed: function(e) {
                                if (e.component.getDataSource().items() !== self.CAM_MESA_CSC) {
                                    e.component.option('dataSource', self.CAM_MESA_CSC);
                                }
                            },
                            onValueChanged: function (e) {
                                var newValue = e.value;
                                // // if (newValue == 2) {
                                // //     $("#Dg_Plantillas_Respuestas").dxDataGrid("instance").option("dataSource", []);
                                // // } else {
                                // //     self.Get_PlantillasRespuesta();
                                // // }
                                // self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC').option('value', null);
                                // //self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_ATIENDE').option('value', null);
                                // if(self.DataTicketOpen == null || self.DataTicketOpen == undefined){
                                //     self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC').option('value', null);
                                // }
                                // var _ary_Estatus = {Tbl:"SAMT_ESTATUS_TICKET",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST')};
                                // __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Estatus,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                //     var __cmb_component = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                                //     if (all_data.success == true){
                                //         __cmb_component.option('dataSource', all_data.JsonData);
                                //         if (self.setDefaultValues == true) {
                                //             var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                //                 return el.ESTATUS_TICKET_DEFAULT == 1;
                                //             }).toList(); 
                                //             __cmb_component.option('value', __Defualt_Data[0].ESTATUS_TICKET_CSC);   
                                //         }
                                //     }
                                //     else {
                                //         __cmb_component.option('dataSource', []);
                                //     }
                                // });
    
                                // if(self.DataTicketOpen == null || self.DataTicketOpen == undefined){
                                //     self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_PRIORIDAD_CSC').option('value', null);
                                // }
                                
                                // var _ary_Prioridad = {Tbl:"SAMT_TIPO_PRIORIDAD_TICKET",WHR:"TIPO_PRIORIDAD_ACTIVO = 1 AND  CAM_MESA_CSC = " + newValue };
                                // __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Prioridad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                //     var __cmb_component = self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_PRIORIDAD_CSC');
                                //     if (all_data.success == true){
                                //         __cmb_component.option('dataSource', all_data.JsonData);
                                //         if (self.setDefaultValues == true) {
                                //             var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                //                 return el.TIPO_PRIORIDAD_DEFAULT == 1;
                                //             }).toList(); 
                                //             __cmb_component.option('value', __Defualt_Data[0].TIPO_PRIORIDAD_CSC);
                                //         }
                                //     }
                                //     else {
                                //         __cmb_component.option('dataSource', []);
                                //     }
                                // });
    
    
                                // if(self.DataTicketOpen == null || self.DataTicketOpen == undefined){
                                //     self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_TICKET_CSC').option('value', null);
                                // }
                                
    
                                // var _ary_Tipo_Ticket = {Tbl:"SAMT_TIPO_TICKET",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_TICKET_ACTIVO = 1 AND  CAM_MESA_CSC = " + newValue };
                                // __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Tipo_Ticket,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                //     var __cmb_component = self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_TICKET_CSC');
                                //     if (all_data.success == true){
                                //         __cmb_component.option('dataSource', all_data.JsonData);
                                //         if (self.setDefaultValues == true) {
                                //             var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                //                 return el.TIPO_TICKET_DEFAULT == 1;
                                //             }).toList(); 
                                //             __cmb_component.option('value', __Defualt_Data[0].TIPO_TICKET_CSC);
                                //         }
                                        
                                //     }
                                //     else {
                                //         __cmb_component.option('dataSource', []);
                                //     }
                                // });
    
                                // var _ary_Tipo_Canal = {Tbl:"SAMT_CAM_TIPO_SERVICIO",NACTIVE:"TIPO_SERVICIO_ACTIVO"};
                                // __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary_Tipo_Canal,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                //     var __cmb_component = self.Frm_Ticket_Servicio_Instance.getEditor('SAMT_CAM_TIPO_SERVICIO_CSC');
                                //     if (all_data.success == true){
                                //         __cmb_component.option('dataSource', all_data.JsonData);
                                //         if (self.setDefaultValues == true) {
                                //             var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                //                 return el.TIPO_SERVICIO_DEFAULT == 1;
                                //             }).toList(); 
                                //             __cmb_component.option('value', __Defualt_Data[0].SAMT_CAM_TIPO_SERVICIO_CSC);
                                //         }
                                //     }
                                //     else {
                                //         __cmb_component.option('dataSource', []);
                                //     }
                                // });

                                // if(self.DataTicketOpen == null || self.DataTicketOpen == undefined){
                                //     self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_SEVERIDAD_CSC').option('value', null);
                                // }

                                // var _ary_Severidad = {Tbl:"SAMT_TIPO_SEVERIDAD",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_SEVERIDAD_TICKET_ACTIVO = 1 AND  CAM_MESA_CSC = " + newValue };
                                // __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Severidad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                //     var __cmb_component = self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_SEVERIDAD_CSC');
                                //     if (all_data.success == true){
                                //         __cmb_component.option('dataSource', all_data.JsonData);
                                //         if (self.setDefaultValues == true) {
                                //             var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                //                 return el.TIPO_SEVERIDAD_TICKET_DEFAULT == 1;
                                //             }).toList(); 
                                //             __cmb_component.option('value', __Defualt_Data[0].TIPO_SEVERIDAD_CSC);
                                //         }
                                //     }
                                //     else {
                                //         __cmb_component.option('dataSource', []);
                                //     }
                                // });
    
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },
                    {
                        colSpan:2,
                        dataField: "CLIENTE_CSC_SOLICITA",
                        editorType: "dxSelectBox",
                        
                        label: {
                            text: Globalize.formatMessage(`Etiquetas_${localStorage.getItem('EMP_CLV_EMPRESA')}_ticketCliente`)
                        },
                        editorOptions: {
                            readOnly: true,
                            searchEnabled:true,
                            displayExpr: "CLIENTE_NOMBRE",
                            valueExpr: "CLIENTE_CSC",
                            deferRendering: false,
                            dataSource: self._CMB_SAMT_CLIENTES_OBJDATA,
                            onOpened: function(e) {
                                e.component.getDataSource().load().done(function(data) {
                                    self.CLIENTE_CSC = data;
                                    var __ActiveCat = jslinq(data).where(function(el) {
                                        return el.TIPO_ESTATUS_CLIENTE_CSC == 1;
                                    }).toList();
                                    e.component.option('dataSource', __ActiveCat);
                                });
                            },
                            onClosed: function(e) {
                                if (e.component.getDataSource().items() !== self.CLIENTE_CSC) {
                                    e.component.option('dataSource', self.CLIENTE_CSC);
                                }
                            },
    
                            onValueChanged: function (e) {
                                var newValue = e.value;
    
                                self.Frm_Ticket_Servicio_Instance.getEditor('PM_CSC_PROYECTO_SOLICITA').option('value', null);
    
                                // var _ary = {Tbl:"SAMT_PROYECTOS",WHR:"PM_CERRADO_ABIERTO = 1"};
                                // __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                //     if (all_data.success == true){
                                //         self.Frm_Ticket_Servicio_Instance.getEditor('PM_CSC_PROYECTO_SOLICITA').option('dataSource', all_data.JsonData);
                                //     }
                                //     else {
                                //         self.Frm_Ticket_Servicio_Instance.getEditor('PM_CSC_PROYECTO_SOLICITA').option('dataSource', []);
                                //     }
                                // });
    
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                },
                
                {
                    colSpan:2,
                    dataField: "PM_CSC_PROYECTO_SOLICITA",
                    editorType: "dxSelectBox",
                    
                    label: {
                        text: Globalize.formatMessage(`Etiquetas_${localStorage.getItem('EMP_CLV_EMPRESA')}_ticketCampania`)
                    },
                    editorOptions: {
                        searchEnabled:true,
                        displayExpr: "PM_NOMBRE",
                        valueExpr: "PM_CSC_PROYECTO",
                        dataSource: self._CMB_SAMT_PROYECTOS_OBJDATA,
                        onOpened: function(e) {
                            e.component.getDataSource().load().done(function(data) {
                                self.PM_CSC_PROYECTO_SOLICITA = data;
                                let __ActiveCat = {};
                                if (self.Frm_Ticket_Servicio_Instance.getEditor('CAM_MESA_CSC').option('value') == 4) {
                                    __ActiveCat = jslinq(data).where(function(el) {
                                        return el.TIPO_ESTATUS_PROYECTO_CSC == 1 && el.PM_CSC_PROYECTO == 7;
                                    }).toList();
                                } else{
                                    __ActiveCat = jslinq(data).where(function(el) {
                                        return el.TIPO_ESTATUS_PROYECTO_CSC == 1 && el.CLIENTE_CSC == self.Frm_Ticket_Servicio_Instance.getEditor('CLIENTE_CSC_SOLICITA').option('value') && el.PM_CSC_PROYECTO != 9;
                                    }).toList();
                                }
                                
                                e.component.option('dataSource', __ActiveCat);
                            });
                        },
                        onClosed: function(e) {
                            if (e.component.getDataSource().items() !== self.PM_CSC_PROYECTO_SOLICITA) {
                                e.component.option('dataSource', self.PM_CSC_PROYECTO_SOLICITA);
                            }
                        },
                        onValueChanged: function (e) {
                            let newValue = e.value;
                            var item = e.component.option('selectedItem');
                            if (item == null) {

                            } else{
                                let __firstData = jslinq(self._CMB_SAMT_CAM_SERVICIO_OBJDATA._array).where(function(el) {return el.CAM_CSC_SERVICIO == newValue;}).toList();
                                self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value', __firstData[0].CAM_CSC_SERVICIO);
                            }

                            
                            
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "requerido"
                    }]
                },{ 
                    colSpan:2,
                    dataField: "CAM_CSC_SERVICIO_SOLICITA",
                    editorType: "dxSelectBox",
                    
                    label: {
                        text: Globalize.formatMessage(`Etiquetas_${localStorage.getItem('EMP_CLV_EMPRESA')}_ticketSubCampania`)
                    },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "CAM_SERVICIO_NOMBRE",
                            valueExpr: "CAM_CSC_SERVICIO",
                            dataSource: self._CMB_SAMT_CAM_SERVICIO_OBJDATA,
                            onOpened: function(e) {
                                e.component.getDataSource().load().done(function(data) {
                                    self.CAM_CSC_SERVICIO_SOLICITA = data;


                                    var __ActiveCat = jslinq(data).where(function(el) {
                                        return el.TIPO_ESTATUS_CAM_CSC == 1 && el.PM_CSC_PROYECTO == self.Frm_Ticket_Servicio_Instance.getEditor('PM_CSC_PROYECTO_SOLICITA').option('value');
                                    }).toList();
                                    
                                    e.component.option('dataSource', __ActiveCat);
                                });
                            },
                            onClosed: function(e) {
                                if (e.component.getDataSource().items() !== self.CAM_CSC_SERVICIO_SOLICITA) {
                                    e.component.option('dataSource', self.CAM_CSC_SERVICIO_SOLICITA);
                                }
                            },
                            onValueChanged: function (e) {
                                var newValue = e.value;
                                if (self.setDefaultValues == true) {
                                    let __defaultEstatus = jslinq(self._CMB_SAMT_ESTATUS_TICKET_OBJDATA._array).where(function(el) {return el.CAM_CSC_SERVICIO == newValue && el.ESTATUS_TICKET_CLAVE == "DEFAULT";}).toList();
                                    self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC').option('value', __defaultEstatus[0].ESTATUS_TICKET_CSC)

                                    let __defaultTipoTicket = jslinq(self._CMB_SAMT_TIPO_TICKET_OBJDATA._array).where(function(el) {return el.CAM_CSC_SERVICIO == newValue && el.TIPO_TICKET_DEFAULT == 1;}).toList();
                                    self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_TICKET_CSC').option('value', __defaultTipoTicket[0].TIPO_TICKET_CSC)

                                    let __defaultPrioridad = jslinq(self._CMB_SAMT_TIPO_PRIORIDAD_TICKET_OBJDATA._array).where(function(el) {return el.CAM_CSC_SERVICIO == newValue && el.TIPO_PRIORIDAD_DEFAULT == 1;}).toList();
                                    self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_PRIORIDAD_CSC').option('value', __defaultPrioridad[0].TIPO_PRIORIDAD_CSC)

                                    let __defaultSeveridad = jslinq(self._CMB_SAMT_TIPO_SEVERIDAD_OBJDATA._array).where(function(el) {return el.CAM_CSC_SERVICIO == newValue && el.TIPO_SEVERIDAD_TICKET_DEFAULT == 1;}).toList();
                                    self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_SEVERIDAD_CSC').option('value', __defaultSeveridad[0].TIPO_SEVERIDAD_CSC)

                                    let __defaultCanal = jslinq(self._CMB_SAMT_CAM_TIPO_SERVICIO_OBJDATA._array).where(function(el) {return el.TIPO_SERVICIO_DEFAULT == 1;}).toList();
                                    self.Frm_Ticket_Servicio_Instance.getEditor('SAMT_CAM_TIPO_SERVICIO_CSC').option('value', __defaultCanal[0].SAMT_CAM_TIPO_SERVICIO_CSC);
                                    
                                    //var item = e.component.option('selectedItem');
                                    //self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('value', item.CAM_SERVICIO_NOMBRE);
                                }
                                var _ary_RequisProveedor = {Tbl:"SAMT_REQUISICION_PROVEEDORES",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND CAM_CSC_SERVICIO = " + newValue };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_RequisProveedor,getJSON(DeveloperType).ApiGeneral.token).then((dataResponse)=>{
                                    if (dataResponse.success === true) {
                                        let _T_SAMT_REQUISICIONES = jslinq(dataResponse.JsonData).toList();
                                        _T_SAMT_REQUISICIONES.forEach(function(item) {self._CMB_SAMT_REQUISICIONES_OBJDATA.insert(item);});
                                        self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('dataSource', dataResponse.JsonData)
                                    }
                                })
                            }
                        }
                    },
                    {
                        colSpan:2,
                        dataField: "ESTATUS_TICKET_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Estado"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "ESTATUS_TICKET_IDIOMA1",
                            valueExpr: "ESTATUS_TICKET_CSC",
                            dataSource: self._CMB_SAMT_ESTATUS_TICKET_OBJDATA,
                            onOpened: function(e) {
                                e.component.getDataSource().load().done(function(data) {

                                    var itemCurrent = e.component.option('selectedItem');
                                    
                                    self.ESTATUS_TICKET_CSC = data;
                                    let __ActiveCat = {};
                                    if (getUrlParam('AUTORIZADOR') == "true") {
                                        __ActiveCat = jslinq(data).where(function(el) {
                                            return el.ESTATUS_TICKET_CLAVE == "AUTORIZA" && el.ESTATUS_TICKET_ACTIVO == 1 && el.CAM_CSC_SERVICIO == self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value');
                                        }).toList();
                                    } else{
                                        if (self.DataTicketOpen.ESTATUS_TICKET_CSC == 147) {
                                            __ActiveCat = jslinq(data).where(function(el) {
                                                return el.ESTATUS_TICKET_IDIOMA1 == "Abierto" && el.ESTATUS_TICKET_ACTIVO == 1 && el.CAM_CSC_SERVICIO == self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value');
                                            }).toList();
                                        } else {
                                            __ActiveCat = jslinq(data).where(function(el) {
                                                return el.ESTATUS_TICKET_CLAVE != "AUTORIZA" && el.ESTATUS_TICKET_ACTIVO == 1 && el.CAM_CSC_SERVICIO == self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value');
                                            }).toList();    
                                        }
                                        
                                    }
                                    e.component.option('dataSource', __ActiveCat);
                                });
                            },
                            onClosed: function(e) {
                                if (e.component.getDataSource().items() !== self.ESTATUS_TICKET_CSC) {
                                    e.component.option('dataSource', self.ESTATUS_TICKET_CSC);
                                }
                            },
                            onValueChanged: function (e) {
                                var newValue = e.value;
                                var item = e.component.option('selectedItem');
                                if (item == null) {
                                    
                                } else {
                                    console.log(item);
                                    
                                    if (self.editandoForma == true) {

                                        if (item.ESTATUS_TICKET_PAUSAR == 1) {
                                            self.pauseTicket = true;    
                                        }
                                        //self.cierraTicket = false;

                                        //console.log(item.ESTATUS_TICKET_CERRAR);
                                    }
                                    
                                    
                                    if (item.ESTATUS_TICKET_CLAVE == 'AUTORIZA' && item.ESTATUS_TICKET_CERRAR == 1) {
                                        if (self._Datagrid_Ot_Ticket == undefined || self._DataGrid_Autorizacion == undefined) {
                                                var __ComponentCalif  = self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_CALIFICACION_CSC');
                                                var __DataSetCalif = __ComponentCalif.option('dataSource');
                                                var _ary_Dataset_Calif =  jslinq( __DataSetCalif.items() ).where(function(el) { return el.TIPO_CALIFICACION_CLAVE == "NA"  ;}).toList();
                                                __ComponentCalif.option('value', _ary_Dataset_Calif[0].TIPO_CALIFICACION_CSC);
                                                self.Frm_Ticket_Servicio_Instance.getEditor("TIC_CERRADO").option('value', true);                                                
                                                self.Frm_Ticket_Servicio_Instance.itemOption("TIC_DESCRIPCION_SOLUCION", 'isRequired', true);
                                        } else {
                                            if (self._DataGrid_Autorizacion.getDataSource() == null || self._Datagrid_Ot_Ticket.getDataSource() == null) {
                                                //self.Frm_Ticket_Servicio_Instance.getEditor("TIC_CERRADO").option('value', true);
                                            } else{
                                                var allRows = self._DataGrid_Autorizacion.getVisibleRows();
                                                var arrValida = []
                                                $.each(allRows, function(index, row){
                                                    var dataSource = self._DataGrid_Autorizacion.columnOption("SAMT_TIPO_RESPUESTA_AUTORIZA_CSC", "lookup.dataSource");
                                                    var ki = jslinq(dataSource.store.__rawData).where(function(el) { return el.SAMT_TIPO_RESPUESTA_AUTORIZA_CSC == row.data.SAMT_TIPO_RESPUESTA_AUTORIZA_CSC}).toList();
                                                    arrValida.push(ki[0].TIPO_RESPUESTA_AUTORIZA_CLAVE === 'PEND' ? true : false);
                                                });
                                                
                                                var hasTrue = arrValida.some(function(value) {return value === true;});

                                                var selected__DG_Ticket_Ot = self._Datagrid_Ot_Ticket.getDataSource().items();
                                                var __OT_Abierta  = jslinq( selected__DG_Ticket_Ot ).where(function(el) { return el.OTR_CERRADA == false}).toList();

                                                if (__OT_Abierta.length >= 1 || hasTrue == true ) {
                                                    DevExpress.ui.notify({message: `AUN HAY OTS ABIERTAS O AUTORIZACIONES PENDIENTES, NO ES POSIBLE REALIZAR MODIFICACION`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                                                    e.component.option('value',e.previousValue);
                                                    return
                                                }

                                                var __ComponentCalif  = self.Frm_Ticket_Servicio_Instance.getEditor('TIPO_CALIFICACION_CSC');
                                                var __DataSetCalif = __ComponentCalif.option('dataSource');
                                                var _ary_Dataset_Calif =  jslinq( __DataSetCalif.items() ).where(function(el) { return el.TIPO_CALIFICACION_CLAVE == "NA"  ;}).toList();
                                                __ComponentCalif.option('value', _ary_Dataset_Calif[0].TIPO_CALIFICACION_CSC);    
                                                
                                            }
                                        } 
                                    } else if(item.ESTATUS_TICKET_CERRAR == 1) {
                                        self.Frm_Ticket_Servicio_Instance.itemOption("TIC_DESCRIPCION_SOLUCION", 'isRequired', true);
                                    } else {
                                        self.Frm_Ticket_Servicio_Instance.getEditor("TIC_CERRADO").option('value', false);
                                        self.Frm_Ticket_Servicio_Instance.itemOption("TIC_DESCRIPCION_SOLUCION", 'isRequired', false);
                                    }


                                    if (item.ESTATUS_TICKET_CLAVE != 'NUEVO') {
                                        var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
                                        if (Form_Data_Ticket_servicio.EMPLEADO_CSC_ATIENDE == null) {
                                            console.log('SE BUSCA QUE NO ESTE ASIGNADO Y SE ASIGNA AL QUE MODIFICA');
                                            
                                            if (getUrlParam('TPO_USUARIO') == 'GENERA') {
                                                
                                            } else {
                                                if (item.ESTATUS_TICKET_CLAVE == 'AUTORIZA') {
                                                    
                                                } else {
                                                    self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_ATIENDE').option('value', obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO);
                                                    self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('value', obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO);    
                                                }
                                                
                                                
                                            }
                                            
                                        } else {
                                            console.log('YA ESTA ASIGNADO');
                                        }
                                    } else {
                                        console.log('NO SE BUSCA A NADIE');
                                    }
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:2,
                        dataField: "TIPO_TICKET_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: `${Globalize.formatMessage("lblTipoCsc")}`
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_TICKET_IDIOMA1",
                            valueExpr: "TIPO_TICKET_CSC",
                            dataSource: self._CMB_SAMT_TIPO_TICKET_OBJDATA,

                            onOpened: function(e) {
                                e.component.getDataSource().load().done(function(data) {
                                    self.TIPO_TICKET_CSC = data;
                                    var __ActiveCat = jslinq(data).where(function(el) {
                                        return el.TIPO_TICKET_ACTIVO == 1 && el.CAM_CSC_SERVICIO == self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value');
                                    }).toList();
                                    e.component.option('dataSource', __ActiveCat);
                                });
                            },
                            onClosed: function(e) {
                                if (e.component.getDataSource().items() !== self.TIPO_TICKET_CSC) {
                                    e.component.option('dataSource', self.TIPO_TICKET_CSC);
                                }
                            },

                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },
                    {
                        colSpan:2,
                        dataField: "TIPO_PRIORIDAD_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Prioridad"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_PRIORIDAD_IDIOMA1",
                            valueExpr: "TIPO_PRIORIDAD_CSC",
                            dataSource: self._CMB_SAMT_TIPO_PRIORIDAD_TICKET_OBJDATA,
                            onOpened: function(e) {
                                e.component.getDataSource().load().done(function(data) {
                                    self.TIPO_PRIORIDAD_CSC = data;
                                    var __ActiveCat = jslinq(data).where(function(el) {
                                        return el.TIPO_PRIORIDAD_ACTIVO == 1 && el.CAM_CSC_SERVICIO == self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value');;
                                    }).toList();
                                    e.component.option('dataSource', __ActiveCat);
                                });
                            },
                            onClosed: function(e) {
                                if (e.component.getDataSource().items() !== self.TIPO_PRIORIDAD_CSC) {
                                    e.component.option('dataSource', self.TIPO_PRIORIDAD_CSC);
                                }
                            },
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        }
                    },
                    {
                    colSpan:2,
                    dataField: "SAMT_CAM_TIPO_SERVICIO_CSC",
                    editorType: "dxSelectBox",
                    
                    label: {
                        text: "Canal"
                    },
                    editorOptions: {
                        searchEnabled:true,
                        displayExpr: "TIPO_SERVICIO_IDIOMA1",
                        valueExpr: "SAMT_CAM_TIPO_SERVICIO_CSC",
                        dataSource: self._CMB_SAMT_CAM_TIPO_SERVICIO_OBJDATA,
                        onOpened: function(e) {
                            e.component.getDataSource().load().done(function(data) {
                                self.SAMT_CAM_TIPO_SERVICIO_CSC = data;
                                var __ActiveCat = jslinq(data).where(function(el) {
                                    return el.TIPO_SERVICIO_ACTIVO == 1;
                                }).toList();
                                e.component.option('dataSource', __ActiveCat);
                            });
                        },
                        onClosed: function(e) {
                            if (e.component.getDataSource().items() !== self.SAMT_CAM_TIPO_SERVICIO_CSC) {
                                e.component.option('dataSource', self.SAMT_CAM_TIPO_SERVICIO_CSC);
                            }
                        },
                        onValueChanged: function (e) {
                            var newValue = e.value;
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "requerido"
                    }]
                },{
                    colSpan:2,
                    dataField: "TIPO_SEVERIDAD_CSC",
                    editorType: "dxSelectBox",
                    
                    label: {
                        text: "Severidad"
                    },
                    editorOptions: {
                        searchEnabled:true,
                        displayExpr: "TIPO_SEVERIDAD_TICKET_IDIOMA1",
                        valueExpr: "TIPO_SEVERIDAD_CSC",
                        dataSource: self._CMB_SAMT_TIPO_SEVERIDAD_OBJDATA,
                        onOpened: function(e) {
                            e.component.getDataSource().load().done(function(data) {
                                self.TIPO_SEVERIDAD_CSC = data;
                                var __ActiveCat = jslinq(data).where(function(el) {
                                    return el.TIPO_SEVERIDAD_TICKET_ACTIVO == 1 && el.CAM_CSC_SERVICIO == self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value');;
                                }).toList();
                                e.component.option('dataSource', __ActiveCat);
                            });
                        },
                        onClosed: function(e) {
                            if (e.component.getDataSource().items() !== self.TIPO_SEVERIDAD_CSC) {
                                e.component.option('dataSource', self.TIPO_SEVERIDAD_CSC);
                            }
                        },
                        onValueChanged: function (e) {
                            var newValue = e.value;
                        }
                    }
                },
                
                {
                    colSpan: 6,
                    template: "<div class='heading_InnerFrm'><h2>Solicitante</h2></div>",
                },
                
                {
                    colSpan:2,
                    dataField: "EMPLEADO_CSC_SOLICITA",
                    editorType: "dxTextBox",
                    
                    label: {
                        text: 'Id Solicitante'
                    },
                    editorOptions: {
                        readOnly: true,
                    }
                },
                {
                    colSpan:2,
                    dataField: "TIC_SOLICITA",
                    editorType: "dxTextBox",
                    
                    label: {
                        text: 'Nombre Solicitante'
                    },
                    editorOptions: {
                        buttons: [{
                            name: 'btn_BuscarEmpleado',
                            location: 'after',
                            options: {
                                stylingMode: 'Contained',
                                icon: 'search',
                                type: 'normal',
                                onClick(e) {
                                    self.BusquedaEmpleado('Solicita','single');
                                }
                            }
                        }]
                    }
                },
                {
                    colSpan:2,
                    dataField: "TIC_EMAIL_SOLICITANTE",
                    editorType: "dxTextBox",
                    label: {
                        text: 'Correo electrónico'
                    },
                    editorOptions: {
                        mode: 'email',
                        valueChangeEvent: "keyup",
                        onValueChanged: function (e) {
                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toLowerCase());}
                        }
                    },
                    validationRules: [{
                        type: "required",
                        message: "requerido"
                    },{
                        type: "email",
                        message:"Formato de correo incorrecto."
                    }]
                },
                {
                    colSpan:2,
                    dataField: "TIC_TELEFONO_SOLICITANTE",
                    editorType: "dxTextBox",
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
                    },{
                        type: "stringLength",
                        max: 10,
                        message: "Maximo 10 caractres"
                    },{
                        type: "stringLength",
                        min: 10,
                        message: "Minimo 10 caractres"
                    }]
                },

                
                 {
                        colSpan: 2,
                        dataField: "REQ_CSCREQUISICION",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Ubicación/Aduana/Almacen"
                        },
                        editorOptions: {
                            searchEnabled: true,
                            displayExpr: "REQUISICION_PROVEEDORES_NOMBRE",
                            valueExpr: "SAMT_REQUISICION_PROVEEDORES_CSC",
                            dataSource: self._CMB_SAMT_REQUISICIONES_OBJDATA,
                            itemTemplate(data) {
                                return `${data.REQUISICION_PROVEEDORES_ID_EXTERNO} - ${data.REQUISICION_PROVEEDORES_NOMBRE}`;
                            },
                            onOpened: function (e) {
                                e.component.getDataSource().load().done(function(data) {
                                    self.REQ_CSCREQUISICION = data;

                                    let __cmbSelectedItemUbicacion = self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('selectedItem');

                                    if (__cmbSelectedItemUbicacion == null) {
                                        self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debes seleccionar el servicio`, 400, 130)
                                        e.component.option('dataSource', []);
                                        return;
                                    }
                                    
                                    var __ActiveCat = jslinq(data).where(function(el) {
                                        return el.REQUISICION_PROVEEDORES_ACTIVO == 1 && el.CAM_CSC_SERVICIO == self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('value');
                                    }).toList();
                                    e.component.option('dataSource', __ActiveCat);
                                });
                            },
                            onClosed: function (e) {
                                if (e.component.getDataSource().items() !== self.REQ_CSCREQUISICION) {
                                    e.component.option('dataSource', self.REQ_CSCREQUISICION);
                                }
                            },
                            onValueChanged: function (e) { 
                                //let __cmbSelectedItemUbicacion = self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('selectedItem');
                                //self.Frm_Ticket_Servicio_Instance.getEditor('TIC_SEGMENTACION_INM_DES').option('value', `${__cmbSelectedItemUbicacion.REQUISICION_PROVEEDORES_ID_EXTERNO} - ${__cmbSelectedItemUbicacion.REQUISICION_PROVEEDORES_NOMBRE}`);                            
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    }, {
                colSpan:2,
                dataField: "TIC_SEGMENTACION_INM_DES",
                editorType: "dxTextBox",
                
                label: {
                    text: 'Ubicación/Punto tactico'
                },
                editorOptions: {
                    valueChangeEvent: "keyup",
                    onValueChanged: function (e) {
                        if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                    }
                }
            }]
            },
            {
                colSpan: 6,
                template: "<div class='heading_InnerFrm'><h2>Detalle de solicitud</h2></div>",
            },
            {
                itemType: "group",
                colCount: 6,
                items:[
                    {
                        itemType: "group",
                        colSpan: 2,
                        colCount: 2,
                        items:[
                            {
                                colSpan: 2,
                                template: "<div class='heading_InnerFrm'><h2>Categorización</h2></div>",
                            },
                            {
                                colSpan:2,
                                dataField: "TIPIFICA_CSC_PARENT_PARENT",
                                editorType: "dxSelectBox",
                                label: {
                                    text: "Categoría"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "Tipificación requerida"
                                }],
                                editorOptions: {
                                    searchEnabled:true,
                                    displayExpr: "TIPIFICA_IDIOMA1",
                                    valueExpr: "TIPIFICA_CSC",
                                    dataSource: self._CMB_SAMT_CAM_TIPIFICACIONES_OBJDATA,
                                    onOpened: function(e) {
                                        e.component.getDataSource().load().done(function(data) {
                                            self.TIPIFICA_CSC_PARENT_PARENT = data;

                                            let __cmbSelectedItemUbicacion = self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('selectedItem');

                                            if (__cmbSelectedItemUbicacion == null) {
                                                self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debes seleccionar Ubicación/Aduana/Almacen`, 400, 130)
                                                e.component.option('dataSource', []);
                                                return;
                                            }
                                            
                                            let __ActiveCat = jslinq(data).where(function(el) {
                                                let __cmbSelectedItem = self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('selectedItem');
                                                return el.TIPIFCA_ACTIVO == 1 && el.TIPIFICA_PARENT == null && el.CAT_TIPO_TIPIFICA_CSC == __cmbSelectedItem.TIPIFICA_CSC;
                                            }).toList();
                                            e.component.option('dataSource', __ActiveCat);
                                        });
                                    },
                                    onClosed: function(e) {
                                        if (e.component.getDataSource().items() !== self.TIPIFICA_CSC_PARENT_PARENT) {
                                            e.component.option('dataSource', self.TIPIFICA_CSC_PARENT_PARENT);
                                        }
                                    },
                                    onValueChanged: function (e) {
                                        // var newValue = e.value;
                                        // console.log(newValue);
                                        
                                        // if (newValue == null) {
                                        //     return;
                                        // }
                                        // loadPanel.show();
                                        // setTimeout(() => {
                                        //     e.component.getDataSource().load().done(function(data) {
                                                
                                        //         const cmp_TIPIFICA_TIPO_CSC = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT');
                                        //         cmp_TIPIFICA_TIPO_CSC.option('disabled', true);
                
                                        //         const cmp_TIPIFICA_CSC = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC');
                                        //         cmp_TIPIFICA_CSC.option('disabled', true);
                                        //         var CargaTodo = setInterval(() => {
                                        //             if (self.TipificacionesFull == null) {
                                                        
                                        //             } else {
                                                        
                
                                        //                 var __TipiParent =jslinq(self.TipificacionesFull).where(function(el) {
                                        //                     return el.TIPIFICA_PARENT == newValue;
                                        //                 }).toList();
                                        //                 cmp_TIPIFICA_TIPO_CSC.option('dataSource', __TipiParent);
                                                        
                                        //                 setTimeout(() => {
                                        //                     cmp_TIPIFICA_TIPO_CSC.option('disabled', false);
                                        //                     loadPanel.hide()
                                        //                 }, 300);
                                        //                 //self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT').option('dataSource', __TipiParent);
                
                                        //                 clearInterval(CargaTodo)
                                        //                 return;
                                        //             } 
                                        //         }, 1000);
                                        //     })
                                        // },1000)
                                        
                                        
                                    }
                                }
                            },{
                                colSpan: 2,
                                dataField: "TIPIFICA_CSC_PARENT",
                                editorType: "dxSelectBox",
                                label: { 
                                    text: "Categoría nivel 2"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "Tipificación requerida"
                                }],
                                editorOptions: {
                                    searchEnabled:true,
                                    displayExpr: "TIPIFICA_IDIOMA1",
                                    valueExpr: "TIPIFICA_CSC",
                                    dataSource: self._CMB_SAMT_CAM_TIPIFICACIONES_OBJDATA,
                                    onOpened: function(e) {
                                        e.component.getDataSource().load().done(function(data) {
                                            self.TIPIFICA_CSC_PARENT = data;

                                            let __cmbSelectedItemCatNiv1 = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT_PARENT').option('selectedItem');
                                            
                                            if (__cmbSelectedItemCatNiv1 == null) {
                                                self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debes seleccionar la primer categoria`, 400, 130)
                                                e.component.option('dataSource', []);
                                                return;
                                            }

                                            let __cmbSelectedItemUbicacion = self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('selectedItem');

                                            if (__cmbSelectedItemUbicacion == null) {
                                                self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debes seleccionar la primer categoria`, 400, 130)
                                                e.component.option('dataSource', []);
                                                return;
                                            }

                                            var __ActiveCat = jslinq(data).where(function(el) {
                                                let __cmbSelectedItem = self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('selectedItem');
                                                return el.TIPIFCA_ACTIVO == 1 && el.TIPIFICA_PARENT == self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT_PARENT').option('value') && el.CAT_TIPO_TIPIFICA_CSC == __cmbSelectedItem.TIPIFICA_CSC && el.TIPIFICA_REGISTRO_CLAVE == __cmbSelectedItemUbicacion.REQUISICION_PROVEEDORES_UBIC_SLA;
                                            }).toList();
                                            e.component.option('dataSource', __ActiveCat);
                                        });
                                    },
                                    onClosed: function(e) {
                                        if (e.component.getDataSource().items() !== self.TIPIFICA_CSC_PARENT) {
                                            e.component.option('dataSource', self.TIPIFICA_CSC_PARENT);
                                        }
                                    },
                                    onValueChanged: function (e) {
                                        // var newValue = e.value;
                                        // if (newValue == null) {
                                        //     return;
                                        // }
                                        // loadPanel.show()
                                        // setTimeout(() => {
                                        //     e.component.getDataSource().load().done(function(data) {
                                        //         const cmp_TIPIFICA_CSC = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC');
                                        //         cmp_TIPIFICA_CSC.option('disabled', true);
                                                
                                        //         var CargaTodo = setInterval(() => {
                                        //             if (self.TipificacionesFull == null) {
                                                        
                                        //             } else {
                                        //                 var __TipiParent =jslinq(self.TipificacionesFull).where(function(el) {
                                        //                     return el.TIPIFICA_PARENT == newValue;
                                        //                 }).toList();
                                        //                 cmp_TIPIFICA_CSC.option('dataSource', __TipiParent);
                                        //                 clearInterval(CargaTodo)
                                        //                 setTimeout(() => {
                                        //                     loadPanel.hide()
                                        //                     cmp_TIPIFICA_CSC.option('disabled', false);
                                        //                 }, 300);
                                        //                 return;
                                        //             } 
                                        //         }, 1000);
                                        //     })
                                        // },1000)
                                    }
                                }	
                            },
                            {
                                colSpan: 2,
                                dataField: "TIPIFICA_CSC",
                                editorType: "dxSelectBox",
                                label: { 
                                    text: "Categoría nivel 3"
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "Tipificación requerida"
                                }],
                                editorOptions: {
                                    searchEnabled:true,
                                    displayExpr: "TIPIFICA_IDIOMA1",
                                    valueExpr: "TIPIFICA_CSC",
                                    dataSource: self._CMB_SAMT_CAM_TIPIFICACIONES_OBJDATA,
                                    onOpened: function(e) {
                                        e.component.getDataSource().load().done(function(data) {
                                            self.TIPIFICA_CSC = data;

                                            let __cmbSelectedItemCatNiv2= self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT').option('selectedItem');

                                            if (__cmbSelectedItemCatNiv2 == null) {
                                                self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debes seleccionar la categoría de nivel 2`, 400, 130)
                                                e.component.option('dataSource', []);
                                                return;
                                            }

                                            let __cmbSelectedItemUbicacion = self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('selectedItem');

                                            if (__cmbSelectedItemUbicacion == null) {
                                                self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `Debes seleccionar la primer categoria`, 400, 130)
                                                e.component.option('dataSource', []);
                                                return;
                                            }

                                            var __ActiveCat = jslinq(data).where(function(el) {
                                                let __cmbSelectedItem = self.Frm_Ticket_Servicio_Instance.getEditor('CAM_CSC_SERVICIO_SOLICITA').option('selectedItem');
                                                return el.TIPIFCA_ACTIVO == 1 && el.TIPIFICA_PARENT == self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT').option('value') && el.CAT_TIPO_TIPIFICA_CSC == __cmbSelectedItem.TIPIFICA_CSC && el.TIPIFICA_REGISTRO_CLAVE == __cmbSelectedItemUbicacion.REQUISICION_PROVEEDORES_UBIC_SLA;
                                            }).toList();
                                            e.component.option('dataSource', __ActiveCat);
                                        });
                                    },
                                    onClosed: function(e) {
                                        if (e.component.getDataSource().items() !== self.TIPIFICA_CSC) {
                                            e.component.option('dataSource', self.TIPIFICA_CSC);
                                        }
                                        var itemSelected = e.component.option('selectedItem');

                                        if (itemSelected == null) {
                                            return;
                                        }
                                        var newValue = e.value;
                                        const cmp_TEJEC = self.Frm_Ticket_Servicio_Instance.getEditor('TIC_TIEMPO_EJECUCION');
                                        const cmp_TRECEPCION = self.Frm_Ticket_Servicio_Instance.getEditor('TIC_TIEMPO_RECEPCION');
                                        const cmp_TCONFIRMA = self.Frm_Ticket_Servicio_Instance.getEditor('TIC_TIEMPO_CONFIRMACION');
                                        let calcTiempo = (itemSelected.TIPIFICA_TIEMPO_EJECUCION == 0) ? self.TimeDefault : itemSelected.TIPIFICA_TIEMPO_EJECUCION;
                                        cmp_TEJEC.option('value', calcTiempo);
                                        cmp_TRECEPCION.option('value', itemSelected.TIPIFICA_TIEMPO_RECEPCION);
                                        cmp_TCONFIRMA.option('value', itemSelected.TIPIFICA_TIEMPO_CONFIRMACION);                                        
                                    },
                                    onValueChanged: function (e) {
                                        var itemSelected = e.component.option('selectedItem');
                                        if (itemSelected.TIPIFICA_CLAVE_EXTERNA == "INSTALACIÓN DE SO Y PUESTA EN MARCHA") {
                                            self.Frm_Ticket_Servicio_Instance.itemOption("TAG_COMPONENTE", 'isRequired', false);
                                        } else {
                                            self.Frm_Ticket_Servicio_Instance.itemOption("TAG_COMPONENTE", 'isRequired', true);
                                        }
                                        
                                    }
                                }
                            },
                            {
                                colSpan:2,
                                dataField: "TAG_COMPONENTE",
                                editorType: "dxTextBox",
                                
                                label: {
                                    text: 'NO. DE SERIE'
                                },
                                validationRules: [
                                    {
                                        type: "stringLength",
                                        max: 8,
                                        message: "Maximo 8 caractres"
                                    }
                                ]
                            },
                        ]
                    },

                    {
                        dataField: 'TIC_DESCRIPCION',
                        editorType: "dxTextArea",
                        colSpan:4,
                        label: { 
                            text: "Descripción/Observaciones"
                        },
                        editorOptions: {
                            readOnly: true,
                            height: 205,
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                //if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },                    
                    {
                        colSpan: 6,
                        template: "<div class='heading_InnerFrm'><h2>Detalle de atención</h2></div>",
                    },
                
                    {
                        itemType: "group",
                        colSpan: 2,
                        colCount: 2,
                        items:[
                            {
                                colSpan:2,
                                dataField: "TIC_ATIENDE",
                                editorType: "dxTextBox",
                                
                                label: {
                                    text: 'Empleado Atiende'
                                },
                                editorOptions: {
                                    buttons: [{
                                        name: 'btn_BuscarEmpleado',
                                        location: 'after',
                                        options: {
                                            stylingMode: 'Contained',
                                            icon: 'search',
                                            type: 'normal',
                                            onClick(e) {
                                                self.BusquedaEmpleado('Atiende','single');
                                            }
                                        }
                                    }]
                                }
                            },
                            {
                                colSpan:2,
                                dataField: "TIC_AUXS2",
                                editorType: "dxTextBox",
                                label: {
                                    text: 'Técnico asignado'
                                },
                                validationRules: [{
                                    type: "stringLength",
                                    max: 50,
                                    message: "Maximo 50 caractres"
                                }]
                            },

                            
                            {
                                colSpan:2,
                                template: "<div class='heading_InnerFrm'><h2>Calendario</h2></div>",
                            },
                            // {
                            //     colSpan:2,
                            //     dataField: "TIC_FECHA_PROMESA",
                            //     label: { 
                            //             text: "Fecha promesa"
                            //     },
                            //     editorType: "dxDateBox",
                            //     editorOptions: {
                            //         type: 'datetime',
                            //         disabled: false,
                            //         width:'100%',
                            //         placeholder: "DD/MM/AAAA HH:mm:ss",
                            //         useMaskBehavior: true,
                            //         displayFormat: "dd/MM/yyyy HH:mm:ss",
                            //         dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                            //         onValueChanged: function (e) {
                                        
                            //         }
                            //     }
                            // },
                            {
                                colSpan:2,
                                dataField: "TIC_FECHA_CIERRE",
                                label: { 
                                        text: "Fecha Cierre"
                                },
                                editorType: "dxDateBox",
                                editorOptions: {
                                    readOnly: true,
                                    type: 'datetime',
                                    disabled: false,
                                    width:'100%',
                                    placeholder: "DD/MM/AAAA HH:mm:ss",
                                    useMaskBehavior: true,
                                    displayFormat: "dd/MM/yyyy HH:mm:ss",
                                    dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                                    onValueChanged: function (e) {
                                        
                                    }
                                },
                            },
                            {
                                colSpan:2,
                                dataField: "TIPO_CALIFICACION_CSC",
                                editorType: "dxSelectBox",
                                label: {
                                    text: "Calificación"
                                },
                                editorOptions: {
                                    searchEnabled:true,
                                    readOnly: true,
                                    displayExpr: "TIPO_CALIFICACION_IDIOMA1",
                                    valueExpr: "TIPO_CALIFICACION_CSC",
                                    deferRendering: false,
                                    dataSource: new DevExpress.data.DataSource({
                                        loadMode: "raw", paginate: false,    
                                        load: async function () {
                                            try {
                                                var _ary_Severidad = {Tbl:"SAMT_TIPO_CALIFICACION",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_CALIFICACION_ACTIVO = 1 " };
                                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Severidad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
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
                                        }
                                    }),
                                    onOpened: function(e) {
                                        e.component.getDataSource().load().done(function(data) {
                                            self.TIPO_CALIFICACION_CSC = data;
                                            var __ActiveCat = jslinq(data).where(function(el) {
                                                return el.TIPO_CALIFICACION_ACTIVO == 1;
                                            }).toList();
                                            e.component.option('dataSource', __ActiveCat);
                                        });
                                    },
                                    onClosed: function(e) {
                                        if (e.component.getDataSource().items() !== self.TIPO_CALIFICACION_CSC) {
                                            e.component.option('dataSource', self.TIPO_CALIFICACION_CSC);
                                        }
                                    },
                                    onValueChanged: function (e) {
                                        var newValue = e.value;
                                        var item = e.component.option('selectedItem')
                                        if (item == null) {
                                            //self.Frm_Ticket_Servicio_Instance.getEditor("TIC_MOTIVO_RECHAZO").option('visible', false);
                                        } else {
                                            // if (item.TIPO_CALIFICACION_CLAVE == 'RECHAZO') {
                                            //     self.Frm_Ticket_Servicio_Instance.getEditor("TIC_CERRADO").option('value', false);
                                            //     self.CalificadoRechazado = true;
                                            //     var __ComponentEstatus  = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                                            //     var __DataSetEstatus = __ComponentEstatus.option('dataSource');
                                                
                                            //     var _ary_Dataset_Estatus =  jslinq( __DataSetEstatus ).where(function(el) { return el.ESTATUS_TICKET_CLAVE == "RECHAZO"  ;}).toList();
                                            //     __ComponentEstatus.option('value', _ary_Dataset_Estatus[0].ESTATUS_TICKET_CSC);
                                            //     self.Frm_Ticket_Servicio_Instance.getEditor("TIC_MOTIVO_RECHAZO").option('visible', true);
                                            // } else if (item.TIPO_CALIFICACION_CLAVE == 'NA') {
                                            //     self.Frm_Ticket_Servicio_Instance.getEditor("TIC_CERRADO").option('value', false);
                                            //     self.CalificadoRechazado = false;
                                                
                                            //     //self.Frm_Ticket_Servicio_Instance.getEditor("TIC_MOTIVO_RECHAZO").option('visible', false);
        
                                            // } else {
                                            //     setTimeout(() => {
                                            //         self.Frm_Ticket_Servicio_Instance.getEditor("TIC_CERRADO").option('value', true);
                                            //         self.CalificadoRechazado = false;
                                            //         var __ComponentEstatus  = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                                            //         var __DataSetEstatus = __ComponentEstatus.option('dataSource');
                                            //         console.log(__DataSetEstatus);
                                            //         var _ary_Dataset_Estatus =  jslinq( __DataSetEstatus ).where(function(el) { return el.ESTATUS_TICKET_CLAVE == "CERRADO"  || el.ESTATUS_TICKET_CLAVE == "RESUELTO";}).toList();
                                            //         __ComponentEstatus.option('value', _ary_Dataset_Estatus[0].ESTATUS_TICKET_CSC);
                                            //         //self.Frm_Ticket_Servicio_Instance.getEditor("TIC_MOTIVO_RECHAZO").option('visible', false);
                                            //     }, 2000);
                                                
                                            // }
                                        }
                                    },
                                    
                                }
                            },
                            {
                                colSpan:2,
                                cssClass:"hidden_box",
                                dataField: "EMPLEADO_CSC_ATIENDE",
                                editorType: "dxTextBox",
                                label: {
                                    text: "Id Empleado Atiende"
                                },
                                editorOptions: {
                                    readOnly:true,
                                }
                            },
                        ]
                    },
                    {
                        itemType: "group",
                        colSpan: 4,
                        colCount: 1,
                        items:[
                            {
                                dataField: 'TIC_DESCRIPCION_SOLUCION',
                                editorType: "dxTextArea",
                                label: { 
                                    text: "Detalle de solución"
                                },
                                editorOptions: {
                                    height:205,
                                    valueChangeEvent: "keyup",
                                    onValueChanged: function (e) {
                                        //if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                    },
                                    buttons: [{
                                        name: 'ObtenPortapapel',location: 'after',options: {stylingMode: 'Contained',icon: 'pasteplaintext',type: 'normal',onClick(e) {self.ObtenClipboard("__Frm_Ticket_Servicio",'TIC_DESCRIPCION_SOLUCION');}}
                                    }]
                                }
                            },
                        ]
                    }
                ]
            },
            
        ]
    }).dxForm("instance");

        self.Frm_Ticket_Empleado_Solita_Instance = $('#__Frm_Ticket_Empleado_Solicita').dxForm({
            readOnly: true,
            height: '100%',
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: '__Frm_Ticket_Empleado_Solicita_Validation',
            labelMode: 'outside',
            labelLocation: 'top',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
            },
            items: [
                {
                    colSpan: 6,
                    template: "<div class='heading_InnerFrm'><h2>Informacion General del Empleado que Solicita</h2></div>",
                },
                {
                    itemType: "group",
                    colCount: 6,
                    items: [
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_CSC_EMPLEADO",
                            label: {
                                text: "Id Empleado"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_ID_EXTERNO",
                            label: {
                                text: "No. Empleado"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "REQ_CSCREQUISICION",
                            editorType: "dxSelectBox",
                            label: {
                                text: "Site Labora"
                            },
                            editorOptions: {
                                searchEnabled: true,
                                displayExpr: "REQ_NOMBREAREA",
                                valueExpr: "REQ_CSCREQUISICION",
                                dataSource: new DevExpress.data.DataSource({
                                    loadMode: "raw", paginate: false,
                                    load: async function (e) {
                                        try {
                                            let _ary = { Tbl: "SAMT_REQUISICIONES" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                                            let _ary = { Tbl: "SAMT_REQUISICIONES" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_NOMBREEMPLEADO",
                            label: {
                                text: "Nombre"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_APATERNOEMPLEADO",
                            label: {
                                text: "Apellido Paterno"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_AMATERNOEMPLEADO",
                            label: {
                                text: "Apellido Materno"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_TELEFONO1",
                            label: {
                                text: "Telefono Casa"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_CELULAR",
                            label: {
                                text: "Telefono Celular"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "EMPLEADO_EMAILLABORAL",
                            label: {
                                text: "Correo Laboral"
                            },
                            editorOptions: {
                                readOnly: true,
                                disabled: false
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "CAT_PUESTO_CSCEMPLEADO",
                            editorType: "dxSelectBox",
                            label: {
                                text: "Puesto"
                            },
                            editorOptions: {
                                searchEnabled: true,
                                displayExpr: "TIPO_PUESTO_IDIOMA1",
                                valueExpr: "TIPO_PUESTO_CSCEMPLEADO",
                                dataSource: new DevExpress.data.DataSource({
                                    loadMode: "raw", paginate: false,
                                    load: async function (e) {
                                        try {
                                            let _ary = { Tbl: "SAMT_TIPO_PUESTO_EMPLEADO" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                                            let _ary = { Tbl: "SAMT_TIPO_PUESTO_EMPLEADO" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                            }
                        },
                        {
                            colSpan: 2,
                            dataField: "CAT_AREA_CSC",
                            editorType: "dxSelectBox",
                            label: {
                                text: "Area"
                            },
                            editorOptions: {
                                searchEnabled: true,
                                displayExpr: "TIPO_AREA_IDIOMA1",
                                valueExpr: "TIPO_AREA_CSC",
                                dataSource: new DevExpress.data.DataSource({
                                    loadMode: "raw", paginate: false,
                                    load: async function (e) {
                                        try {
                                            let _ary = { Tbl: "SAMT_CAT_EMPLEADO_AREA" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                                            let _ary = { Tbl: "SAMT_CAT_EMPLEADO_AREA" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                            }
                        }, {
                            colSpan: 2,
                            dataField: "CAT_DEPARTAMENTO_CSC",
                            editorType: "dxSelectBox",
                            label: {
                                text: "Departamento"
                            },
                            editorOptions: {
                                searchEnabled: true,
                                displayExpr: "SAMT_TIPO_DEPARTAMENTO_IDIOMA1",
                                valueExpr: "EMPLEADO_DEPARTAMENTO_CSC",
                                dataSource: new DevExpress.data.DataSource({
                                    loadMode: "raw", paginate: false,
                                    load: async function (e) {
                                        try {
                                            let _ary = { Tbl: "SAMT_CAT_EMPLEADO_DEPARTAMENTO" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                                            let _ary = { Tbl: "SAMT_CAT_EMPLEADO_DEPARTAMENTO" };
                                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Full', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                                if (all_data.success == true) {
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
                            }
                        }]
                }
            ]
        }).dxForm("instance");


    self.ObtenSelectBoxFrm=(_InstanciaFormulario)=>{
        self._SelectBox_OriginalDts = []
        let a = _InstanciaFormulario.option('formData')
        Object.entries(a).forEach(([key, value]) => {
            var EditoType = null;
            var EditoLabel = null;
            var ElementEditor = _InstanciaFormulario.itemOption(key);
            if (ElementEditor != undefined) {
                EditoType = ElementEditor.editorType;
                EditoLabel = ElementEditor.label.text;    
                if (EditoType == "dxSelectBox") {
                    var __cmb_component = _InstanciaFormulario.getEditor(key);
                    self._SelectBox_OriginalDts.push({
                        [key]: __cmb_component.option("text"),
                        Label: EditoLabel
                    })
                } else if(EditoType == "dxTextBox"  || EditoType == "dxNumberBox" || EditoType == "dxTextArea" || EditoType == "dxDateBox"){
                    var __cmb_component = _InstanciaFormulario.getEditor(key);
                    self._SelectBox_OriginalDts.push({
                        [key]: __cmb_component.option("text"),
                        Label: EditoLabel
                    })
                } else if(EditoType == "dxHtmlEditor"){
                    var __cmb_component = _InstanciaFormulario.getEditor(key);
                    self._SelectBox_OriginalDts.push({
                        [key]: __cmb_component.option("value"),
                        Label: EditoLabel
                    })   
                }
            } else{
                ElementEditor = _InstanciaFormulario.itemOption('__Detalle_Edificio.'+key);
                if (ElementEditor != undefined) {
                    EditoType = ElementEditor.editorType;
                    EditoLabel = ElementEditor.label.text;    
                    if (EditoType == "dxSelectBox") {
                        var __cmb_component = _InstanciaFormulario.getEditor(key);
                        self._SelectBox_OriginalDts.push({
                            [key]: __cmb_component.option("text"),
                            Label: EditoLabel
                        })
                    } else if(EditoType == "dxTextBox"  || EditoType == "dxNumberBox" || EditoType == "dxTextArea" || EditoType == "dxDateBox"){
                        var __cmb_component = _InstanciaFormulario.getEditor(key);
                        self._SelectBox_OriginalDts.push({
                            [key]: __cmb_component.option("text"),
                            Label: EditoLabel
                        })
                    } 
                } 
            }
        });
    }

    function BitacoraCambios(_InstanciaFormulario){
        let _AryConCambios = []
        let a = _InstanciaFormulario.option('formData')
        Object.entries(a).forEach(([key, value]) => {
            var EditoType = null;
            var EditoLabel = null;
            var ElementEditor = _InstanciaFormulario.itemOption(key);
            if (ElementEditor != undefined) {
                EditoType = ElementEditor.editorType;
                EditoLabel = ElementEditor.label.text;    
                if (EditoType == "dxSelectBox") {
                    var __cmb_component = _InstanciaFormulario.getEditor(key);
                    _AryConCambios.push({
                        [key]: __cmb_component.option("text"),
                        Label: EditoLabel
                    })   
                } else if(EditoType == "dxTextBox"  || EditoType == "dxNumberBox" || EditoType == "dxTextArea" || EditoType == "dxDateBox"){
                    var __cmb_component = _InstanciaFormulario.getEditor(key);
                    _AryConCambios.push({
                        [key]: __cmb_component.option("text"),
                        Label: EditoLabel
                    })   
                } else if(EditoType == "dxHtmlEditor"){
                    var __cmb_component = _InstanciaFormulario.getEditor(key);
                    _AryConCambios.push({
                        [key]: __cmb_component.option("value"),
                        Label: EditoLabel
                    })   
                }
            } else{
                ElementEditor = _InstanciaFormulario.itemOption('__Detalle_Edificio.'+key);
                if (ElementEditor != undefined) {
                    EditoType = ElementEditor.editorType;
                    EditoLabel = ElementEditor.label.text;    
                    if (EditoType == "dxSelectBox") {
                        var __cmb_component = _InstanciaFormulario.getEditor(key);
                        _AryConCambios.push({
                            [key]: __cmb_component.option("text"),
                            Label: EditoLabel
                        })
                    } else if(EditoType == "dxTextBox"  || EditoType == "dxNumberBox" || EditoType == "dxTextArea" || EditoType == "dxDateBox"){
                        var __cmb_component = _InstanciaFormulario.getEditor(key);
                        _AryConCambios.push({
                            [key]: __cmb_component.option("text"),
                            Label: EditoLabel
                        })   
                    }
                }
            }
        });
        var Diferencias = compararObjetos(self._SelectBox_OriginalDts,_AryConCambios,_InstanciaFormulario);

        console.log(Diferencias);
    }

    function compararObjetos(objetoA, objetoB, _InstanciaFormulario) {
        const TipoBitacora = 1;
        const SubTipoBitacora = 3;
        const _InstanciaFrm = _InstanciaFormulario.option('formData');
        const diferencias = {};
        for (const i in objetoA) {
          const clave = Object.keys(objetoA[i])[0];
          if (objetoB[i] && objetoB[i][clave] !== objetoA[i][clave]) {
            let _ObjetoInsertaBitacora = {
                EMP_CSC_EMPRESA_HOST : ReturnDefaultData_Init().EMP_CSC_EMPRESA_HOST,
                AUDITORIA_USU_ALTA :  (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO,
                AUDITORIA_USU_ULT_MOD: (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO,
                AUDITORIA_FEC_ALTA: moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                AUDITORIA_FEC_ULT_MOD:  moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                TIC_CSCTICKET: _InstanciaFrm.TIC_CSCTICKET,
                ESTATUS_TICKET_CSC: _InstanciaFrm.ESTATUS_TICKET_CSC,
                TIB_NOMBRE: obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO,
                TIB_FECHAHORA: moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                SAMT_TICKET_TIPO_BITACORA_CSC: TipoBitacora,
                SAMT_TICKET_SUBTIPO_BITACORA_CSC: SubTipoBitacora,
                TIB_DESCRIPCION: `${objetoA[i].Label}: Cambio de '${objetoA[i][clave]}' a '${objetoB[i][clave]}'`,
                EMPLEADO_CSC_EMPLEADO: (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO
            }
            var objInsert = {
                ...ReturnDefaultData_Init(),
                DATA_INSERT: _ObjetoInsertaBitacora
            }; 
            self.TestBitacoraInsert(objInsert);
         }         
        }
        // for (const i in objetoA) {
        //   const clave = Object.keys(objetoA[i])[0];
        //   if (objetoB[i] && objetoB[i][clave] !== objetoA[i][clave]) {
        //     diferencias[clave] = {
        //         Label: objetoA[i].Label,
        //         valorAnterior: objetoA[i][clave],
        //         valorNuevo: objetoB[i][clave],
        //     };
        //   }
        // }
      
        return diferencias;
      }

      self.TestBitacoraInsert=(ObjetoCambio)=>{
        console.log(ObjetoCambio);
        return new Promise((resolve, reject) => {
            try {
                __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Bitacora_Ticket','POST',JSON.stringify(ObjetoCambio),getJSON(DeveloperType).ApiGeneral.token).then((dataResponse)=>{
                if (dataResponse.success === true) {
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

        self.InsertaBitacoraManual = function(InfoForm,DescripcionCambio,ValidaRechazo, TipoBitacora, SubTipoBitacora){
            loadPanel.show();
            if (ValidaRechazo == true) {
                var __DataSet_Grid_Bitacoras = $("#Dg_Bitacora_Ticket").dxDataGrid("instance");
                var selected__DataSet_Grid_Bitacoras = __DataSet_Grid_Bitacoras.getDataSource().items();
                var ProveedorTomoServicio  = jslinq( selected__DataSet_Grid_Bitacoras ).where(function(el) { return el.SAMT_TICKET_SUBTIPO_BITACORA_CSC == 5}).toList();
                if (ProveedorTomoServicio.length >= 2) {
                    self.Generar_Orden_Trabajo_Rechazo();                  
                } else {
                    console.log('NO SE GENERARA OT');
                }
            }             
            
            var dataObj = {
                EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                Type : localStorage.getItem('Type'),
                DATA_INSERT:{
                    EMP_CSC_EMPRESA_HOST :  localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    AUDITORIA_USU_ALTA :  (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO,
                    AUDITORIA_USU_ULT_MOD: (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO,
                    AUDITORIA_FEC_ALTA: moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    TIC_CSCTICKET: InfoForm.TIC_CSCTICKET,
                    ESTATUS_TICKET_CSC: InfoForm.ESTATUS_TICKET_CSC,
                    TIB_NOMBRE: obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO,
                    TIB_DESCRIPCION: DescripcionCambio,
                    TIB_FECHAHORA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    SAMT_TICKET_TIPO_BITACORA_CSC: TipoBitacora,
                    SAMT_TICKET_SUBTIPO_BITACORA_CSC: SubTipoBitacora,
                    EMPLEADO_CSC_EMPLEADO: (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO
                }                
            };

            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Bitacora_Ticket','POST',JSON.stringify(dataObj),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    loadPanel.show();
                    setTimeout(() => {
                        $('#Pop_Insertar_BitacoraManual').dxPopup("hide");    
                        loadPanel.hide();
                    }, 1000);
                    
                    DevExpress.ui.notify({message: `BITACORA AGREGADA CORRECTAMENTE`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                }
                else {
                    loadPanel.hide();
                }
                return in_emp;
            }).catch(function(e){
                loadPanel.hide();
                DevExpress.ui.notify({message: `ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            });
        }


        $("#Dg_RepFoto_Ticket").dxDataGrid({
            headerFilter: { visible: false },
            keyExpr: "TICKET_FOTO_CSC",
            selection: {
                mode: "single"
            },
            scrolling: {
               // mode: "standard" // or "virtual" | "infinite"
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // onHover or "onClick" | "always" | "never"
            },
            groupPanel: { visible: false },
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
                    caption: "IdI",
                    dataField: "TICKET_FOTO_CSC",
                    alignment: "left",
                    sortIndex: 1, sortOrder: "desc",
                    visible: false
                },
                {
                    caption: "IMAGEN",
                    dataField: "TICKET_DESCRIPCION",
                    alignment: "left",
                    allowSorting: false,
                },{
                    caption: "FECHA DE ALTA",
                    dataField: "TICKET_FECHA_ALTA",
                    alignment: "left",
                    dataType: 'date',
                    calculateCellValue: function(data) {
                        return moment(data.TICKET_FECHA_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                    },
                    allowSorting: false,
                },{
                    caption: "GENERADO POR",
                    dataField: "TICKET_ORIGEN_CREACION",
                    alignment: "left",
                    cellTemplate(container, options) {
                        if (options.value == 2) {
                            $('<div>').append($('<div">Operador</div>'),).appendTo(container);
                        } else {
                            $('<div>').append($('<div">Cliente</div>'),).appendTo(container);
                        } 
                    },
                    allowSorting: false,
                }
                
            ],
                onRowDblClick: function (e) {
                    console.log(e.data);
                    var objSig = {
                        ClaveEmpresa: localStorage.getItem('EMP_CLV_EMPRESA'),
                        newIdTicket: e.data.TIC_NEWID,
                        idImagen: e.data.TICKET_FOTO_CSC
                    }
                    __Reques_ajax(`${getJSON(DeveloperType).Bot_Internal_Storage_Anam.url}getImageTicketById/${self.DataTicketOpen.SAMT_CAM_TIPO_SERVICIO_CSC}`,'GET',objSig,getJSON(DeveloperType).ApiGeneral.token).then((result)=>{
                        if (result.success == true) {    
                            loadPanel.hide();
                            console.log(result);
                            var UrlPop = result.urlTemporal;
                            const popupContentTemplate = function (container) {
                                return $('<div style="height:100%;">').append(
                                    '<iframe src='+UrlPop+' width="100%" height="100%" scrolling="auto" frameBorder="0" style=" flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;"></iframe>'
                                );
                            };
                            $("#Pop_Notificacion_Success").dxPopup("instance").option("height",'85%');
                            $("#Pop_Notificacion_Success").dxPopup("instance").option("width",'90%');
                            $("#Pop_Notificacion_Success").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                            $('#Pop_Notificacion_Success').dxPopup("show");

                        } else {
                            self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `${result.message}`, 400, 130)
                                        
                            loadPanel.hide();
                        }
                    });
                } 
        });


        $("#Dg_Documento_Ticket").dxDataGrid({
            headerFilter: { visible: false },
            keyExpr: "TICKET_FILE_CSC",
            selection: {
                mode: "single"
            },
            scrolling: {
               // mode: "standard" // or "virtual" | "infinite"
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // onHover or "onClick" | "always" | "never"
            },
            groupPanel: { visible: false },
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
                    caption: "Id",
                    dataField: "TICKET_FILE_CSC",
                    alignment: "left",
                    sortIndex: 1, sortOrder: "desc",
                    visible: false
                },
                {
                    caption: "DOCUMENTO",
                    dataField: "TICKET_FILE_DESCRIPCION",
                    alignment: "left",
                    allowSorting: false,
                },{
                    caption: "FECHA DE ALTA",
                    dataField: "TICKET_FILE_FECHA_ALTA",
                    alignment: "left",
                    dataType: 'date',
                    allowSorting: false,
                    calculateCellValue: function(data) {
                        return moment(data.TICKET_FILE_FECHA_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                    }


                },{
                    caption: "GENERADO POR",
                    dataField: "TICKET_FILE_ORIGEN_CREACION",
                    alignment: "left",
                    allowSorting: false,
                    cellTemplate(container, options) {
                        if (options.value == 2) {
                            $('<div>').append($('<div">Operador</div>'),).appendTo(container);
                        } else {
                            $('<div>').append($('<div">Cliente</div>'),).appendTo(container);
                        }
                        
                    },
                }
                
            ],
                onRowDblClick: function (e) {
                    console.log(e.data);
                    var objSig = {
                        ClaveEmpresa: localStorage.getItem('EMP_CLV_EMPRESA'),
                        newIdTicket: e.data.TIC_NEWID,
                        idDocumento: e.data.TICKET_FILE_CSC
                    }
                    __Reques_ajax(`${getJSON(DeveloperType).Bot_Internal_Storage_Anam.url}getDocumentTicketById/${self.DataTicketOpen.SAMT_CAM_TIPO_SERVICIO_CSC}`,'GET',objSig,getJSON(DeveloperType).ApiGeneral.token).then((result)=>{
                        if (result.success == true) {    
                            loadPanel.hide();
                            console.log(result);
                            var UrlPop = result.urlTemporal;
                            const popupContentTemplate = function (container) {
                                return $('<div style="height:100%;">').append(
                                    '<iframe src='+UrlPop+' width="100%" height="100%" scrolling="auto" frameBorder="0" style=" flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;"></iframe>'
                                );
                            };
                            $("#Pop_Notificacion_Success").dxPopup("instance").option("height",'85%');
                            $("#Pop_Notificacion_Success").dxPopup("instance").option("width",'90%');
                            $("#Pop_Notificacion_Success").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                            $('#Pop_Notificacion_Success').dxPopup("show");

                        } else {
                            self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `${result.message}`, 400, 130)
                                        
                            loadPanel.hide();
                        }
                    });
                }
                
        });

        $("#Dg_Bitacora_Ticket").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            keyExpr: "TIB_CSCTICKETBITACORA",
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: "single"
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            columns: [{
                caption: "NOMBRE",
                dataField: "TIB_NOMBRE",
                
            },{
                caption: "DESCRIPCION",
                dataField: "TIB_DESCRIPCION",
                
            },{
                caption: "FECHA DE CAMBIO",
                dataField: "TIB_FECHAHORA",
                dataType: 'date',
                format:"dd-MM-yyyy HH:mm:ss",
                sortIndex: 1, sortOrder: "desc",
                calculateCellValue: function(data) {
                    return moment(data.TIB_FECHAHORA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')

                    if(data.TIB_FECHAHORA != null){
                        return ConvertStringToObjDateLong(data.TIB_FECHAHORA)
                    }
                    else{
                        return null;
                    }
                }
                
            }],
            onRowDblClick: function (e) {
                const popupContentTemplate = function () {
                    return $('<div>').append(
                        $("<div class='popup-property-details'>").append(
                            $('<div class="Nice-Shadow-1" style="padding: 9px;">Detalle de Bitacora</div>'),
                            $('<div style="padding: 9px; background: #FFFFFF; color: #000000;">').append(
                                $('<div style="flex-grow: 1; font-size: 12px; font-weight: bold; text-align:left;">FECHA DE ALTA: <span style="font-weight: normal;">'+moment(e.data.TIB_FECHAHORA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')+'</span></div>'),        
                                $('<div style="flex-grow: 1; font-size: 12px; font-weight: bold; text-align:left;">GENERADO POR: <span style="font-weight: normal;">'+e.data.TIB_NOMBRE+'</span></div>'),
                                $('<div style="flex-grow: 1; font-size: 12px; font-weight: bold; text-align:left;">DETALLE: <span style="font-weight: normal;">'+e.data.TIB_DESCRIPCION+'</span></div>'),
                            )
                        )
                    );
                };
                $("#Pop_Notificacion_Success").dxPopup("instance").option("height",420);
                $("#Pop_Notificacion_Success").dxPopup("instance").option("width",420);
                $("#Pop_Notificacion_Success").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                $('#Pop_Notificacion_Success').dxPopup("show");
                
            }
        });

        self.Dg_MensajesClienteOperador = $("#Dg_MensajesClienteOperador").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            keyExpr: "CSC_RESPUESTA",
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: "single"
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: false,
            showRowLines: false,
            showColumnLines: false,
            rowAlternationEnabled: false,
            columnAutoWidth: false,
            columns: [
                {
                    dataField: 'DETALLE',
                    allowFiltering: false,
                    allowSorting: false,
                    cellTemplate(container, item) {
                        const { data } = item;
                        var _valLeidoCliente = null; data.RESPUESTA_LEIDO_CLIENTE === 1 ? _valLeidoCliente = 'Si' : _valLeidoCliente = 'No';
                        var _valLeidoOperador = null; data.RESPUESTA_LEIDO_OPERADOR === 1 ? _valLeidoOperador = 'Si' : _valLeidoOperador = 'No';
                        $('<div class="FlexContainer-Column MensajesRespuestaContent-'+data.RESPUESTA_CLAVE+'">')
                        .append(
                            $('<span style="width: 100%; font-weight: bold;">').text( `${data.RESPUESTA_NOMBRE} - ${data.RESPUESTA_CLAVE}`)
                        )
                        .append(
                            $('<span  style="width: 100%; font-style: italic;">').text( `${moment(data.RESPUESTA_FECHAHORA_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')}`)
                        )
                        .append(
                            $('<span style="width: 100%; font-weight: bold;">').text( `Asunto: ${data.RESPUESTA_ASUNTO}`)
                        )
                        .append(
                            $('<span  style="width: 100%; font-size: 9px; font-weight: bold;">').text( `Leido Cliente - ${_valLeidoCliente} / Fecha - ${moment(data.RESPUESTA_FEC_LEIDO_CLIENTE).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')}`)
                        )
                        .append(
                            $('<span  style="width: 100%; font-size: 9px; font-weight: bold;">').text( `Leido Operador - ${_valLeidoOperador} / Fecha - ${moment(data.RESPUESTA_FEC_LEIDO_OPERADOR).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')}`)
                        )
                        .appendTo(container);
                    },
                }
        ],
        onRowDblClick: function (e) {
            var FechaLecturaOp_origen = e.data.RESPUESTA_FEC_LEIDO_OPERADOR;
            var FechaLecturaCli_origen = e.data.RESPUESTA_FEC_LEIDO_CLIENTE;
            
            var FechaLecturaOp = moment(FechaLecturaOp_origen).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss') || null
            var FechaLecturaCli = moment(FechaLecturaCli_origen).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss') || null
            var FechaAlta = moment(e.data.AUDITORIA_FEC_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss') || null

            FechaLecturaOp = (FechaLecturaOp == 'Invalid date') ? 'S/D' : FechaLecturaOp;
            FechaLecturaCli = (FechaLecturaCli == 'Invalid date') ? 'S/D' : FechaLecturaCli;
            if (getUrlParam('TPO_USUARIO') == 'GENERA') {
                if (e.data.RESPUESTA_LEIDO_CLIENTE == null) {
                    self.ActualizaRespuestaLectura(e.data.CSC_RESPUESTA, e.data.TIC_CSCTICKET);
                }                                     
            } else {
                if (e.data.RESPUESTA_LEIDO_OPERADOR == null) {
                    self.ActualizaRespuestaLectura(e.data.CSC_RESPUESTA, e.data.TIC_CSCTICKET);
                }   
            }
            const popupContentTemplate = function () {
                return $('<div>').append(
                    $("<div class='popup-property-details'>").append(
                        $('<div class="Nice-Shadow-1" style="padding: 9px;">Detalle de Mensaje/Respuesta</div>'),
                        $('<div  class="FlexContainer-Row" style="padding: 3px; background: #FFFFFF; color: #000000;">').append(
                            $('<div class="FlexContainer-Column" style="padding: 9px; background: #FFFFFF; color: #000000; position: relative;flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;">').append(
                                $('<div class="FlexContainer-Row" style="padding: 9px; background: #FFFFFF; color: #000000;font-size: 11px;">').append(
                                    $('<div style="position: relative;flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;font-weight: bold;">ASUNTO: <span style="font-weight: normal;">'+e.data.RESPUESTA_ASUNTO+'</span></div>'),
                                    $('<div style="position: relative;flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;font-weight: bold; text-align: right;">FECHA DE ALTA: <span style="font-weight: normal;">'+FechaAlta+'</span></br></div>'),
                                ),
                                
                                $('<div id="contentAdjuntos" class="FlexContainer-Row" style="font-weight: bold; text-align:left;font-size: 9px;"></div>'),
                                $('<div style="flex-grow: 1; overflow: scroll; height: 300px; padding: 3px; margin:5px; border: solid gray 1px;">'+e.data.RESPUESTA_DESCRIPCION+'</div>'),
                                $('<div class="FlexContainer-Row" style="padding: 9px; background: #FFFFFF; color: #000000;font-size: 11px;">').append(
                                    $('<div style="position: relative;flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;font-weight: bold;">GENERADO POR: <span style="font-weight: normal;">'+e.data.RESPUESTA_CLAVE+'</span></br></div>'),
                                    $('<div style="position: relative;flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;font-weight: bold;">LECTURA POR CLIENTE: <span style="font-weight: normal;">'+FechaLecturaCli+'</span></br></div>'),
                                    $('<div style="position: relative;flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;font-weight: bold;">LECTURA POR OPERADOR:<span style="font-weight: normal;">'+FechaLecturaOp+'</span></br></div>')
                                )
                            )
                            
                        )
                    )
                );
            };
            $("#Pop_Notificacion_Success").dxPopup("instance").option("height",'510');
            $("#Pop_Notificacion_Success").dxPopup("instance").option("width",'90%');
            $("#Pop_Notificacion_Success").dxPopup('instance').option('contentTemplate', popupContentTemplate);
            $('#Pop_Notificacion_Success').dxPopup("show");

            self.Get_Mensaje_Files(e.data.TICKET_MENSAJE_NEWID);
        }
        });

        self.Get_Mensaje_Files=function(__AryDatos){
            var jsonBusqueda = {
                ...ReturnDefaultData_Init(),
                TICKET_MENSAJE_NEWID: __AryDatos
            };
            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Respuesta_Mensaje_Files','GET',jsonBusqueda,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    let data = in_emp.JsonData;
                    const contenedor = document.getElementById("contentAdjuntos");
                    data.forEach(item => {
                        const div = document.createElement("div");
                        div.style.width = "260px";
                        div.style.height = "24px";
                        div.style.padding = "3px";
                        div.style.borderRadius = "5px";
                        div.style.border = "solid #1f5e26 1px";
                        div.style.margin = "3px";
                        div.style.cursor = "pointer";
                        // Crea la imagen del icono por mimetype
                        const mimetype = item.TICKET_MENSAJE_FILE_MIMETYPE_SISTEMA;
                        const icono = document.createElement("img");
                        icono.src = self.getIconoPorMimetype(mimetype);
                        icono.alt = "Icono";
                        icono.style.float = "left"; // Agrega la propiedad float a la imagen
                        icono.width = 16; // Establece el tamaño del icono si es necesario
                        div.appendChild(icono);
    
                        // Crea la descripción del archivo
                        const descripcion = document.createElement("p");
                        descripcion.textContent = item.TICKET_MENSAJE_FILE_DESCRIPCION;
                        descripcion.style.lineHeight = "2";
                        div.appendChild(descripcion);
    
                        // Agrega el evento onclick al div
                        div.onclick = function() {
                            // Llama a la función y envía el objeto 'item'
                            self.obtenDocumentoMensaje(item);
                        };
    
    
                        // Agrega el div al contenedor principal
                        contenedor.appendChild(div);
                    });
                } else{
                    //self.Dg_Devengos_Equipamiento.refresh();
                }
            }).catch(function(e){
                console.log(e);
                DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                //self.Dg_Devengos_Equipamiento.refresh();
            });
        }

        // Función para obtener el icono según el mimetype
        self.getIconoPorMimetype=(mimetype)=>{
            const iconosPorMimetype = {
            "jpg": "../../../images/Icons/IconMimeType/48px/jpg.png",
            "png": "../../../images/Icons/IconMimeType/48px/png.png",
            "pdf": "../../../images/Icons/IconMimeType/48px/pdf.png", // Asegúrate de tener el icono adecuado para pdf
            "xlsx": "../../../images/Icons/IconMimeType/48px/xlsx.png", // Asegúrate de tener el icono adecuado para pdf
            "xls": "../../../images/Icons/IconMimeType/48px/xls.png", // Asegúrate de tener el icono adecuado para pdf
            // Agrega más extensiones y sus correspondientes iconos aquí si lo necesitas
            };
        
            return iconosPorMimetype[mimetype] || "../../../images/Icons/IconMimeType/48px/_blank.png";
        }

        self.obtenDocumentoMensaje=(item)=>{
            console.log(item);
            var objSig = {
                clveEmpresa: localStorage.getItem('EMP_CLV_EMPRESA'),
                TypeCon: localStorage.getItem('Type'),
                imageKey: `TICKET_MENSAJE/${item.TIC_NEWID}/${item.TICKET_MENSAJE_NEWID}/${item.TICKET_MENSAJE_FILE_RUTA}.${item.TICKET_MENSAJE_FILE_MIMETYPE_SISTEMA}`,
                contentType: item.TICKET_MENSAJE_FILE_MIMETYPE_ORIGINAL,
                filename: item.TICKET_MENSAJE_FILE_DESCRIPCION
            }
            console.log(objSig);
            
            __Reques_ajax(`${getJSON(DeveloperType).Bot_Internal_Storage_Anam.url}getImageTicketById`,'GET',objSig,getJSON(DeveloperType).ApiGeneral.token).then((result)=>{
                if (result.success == true) {    
                    loadPanel.hide();
                    var UrlPop = result.urlTemporal;
                    console.log(UrlPop);
    
                    window.open(UrlPop);
    
                } else {
                    loadPanel.hide();
                }
            });
            //console.log("Se hizo clic en el div con el siguiente item:", item);
        }

        self.Dg_Empleados_Ticket = $("#Dg_Empleados_Ticket").dxDataGrid({
            deferRendering:true,
            dataSource: self._Obj_Agrega_Emp_Ticket,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            //keyExpr: "EMPLEADO_CSC_EMPLEADO",
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: 'multiple'
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            columns: [{
                caption: "NO. EMPLEADO",
                dataField: "EMPLEADO_ID_EXTERNO",
                width: 90,
            },{
                caption: "NOMBRE",
                dataField: "NOMBRE"
            }
        ],toolbar: {
            items: [{
                location: 'after',
                widget: 'dxButton',
                options: {
                    text: 'Agregar Empleado(s)',
                    icon: 'add',
                    disabled: false,
                    onClick() {
                        self.BusquedaEmpleado('AsignaTicket','multiple');
                    },
                },
            },{
                location: 'after',
                widget: 'dxButton',
                options: {
                    text: 'Quitar empleados seleccionados',
                    icon: 'trash',
                    disabled: true,
                    onClick() {
                        self.Dg_Empleados_Ticket.getSelectedRowKeys().forEach((key) => {
                            self._Obj_Agrega_Emp_Ticket.remove(key);
                        });
                        self.Dg_Empleados_Ticket.refresh();
                    },
                },
            }]
        },
        onSelectionChanged(data) {
            if (getUrlParam('TIPO') == 'EDITAR' || getUrlParam('TIPO') == 'LECTURA') {
                return;
            }
            //self.Dg_Empleados_Ticket.option('toolbar.items[1].options.disabled', !data.selectedRowsData.length);
        },
        }).dxDataGrid("instance");

        self._DataGrid_Autorizacion = $("#Dg_Ticket_Autorizaciones").dxDataGrid({
            deferRendering:true,
            headerFilter: { visible: false },
            dataSource: self._Obj_Autorizaciones_Grid,
            keyExpr: "SAMT_TICKET_AUTORIZACIONES_CSC",
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: "single"
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            height:165,
            width: 280,
            columns: [{
                caption: "ID",
                dataField: "SAMT_TICKET_AUTORIZACIONES_CSC",
                width: 100
            },{
                caption: "ESTATUS",
                dataField: "SAMT_TIPO_RESPUESTA_AUTORIZA_CSC",
                width: 150,
                lookup: {
                    displayExpr: "TIPO_RESPUESTA_AUTORIZA_IDIOMA1",
                    valueExpr: "SAMT_TIPO_RESPUESTA_AUTORIZA_CSC",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_TIPO_RESPUESTA_AUTORIZA"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        })
                    }
                }
            },{
                caption: "RESPONSABLE",
                dataField: "NOMBRE",
                width: 180,
            },{
                caption: "FECHA ALTA",
                dataField: "AUDITORIA_FEC_ALTA",
                alignment: "center",
                dataType : "date",
                width: 150, 
                calculateCellValue: function(data) {
                    return moment(data.AUDITORIA_FEC_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                }
            },{
                caption: "COMENTARIOS",
                dataField: "AUTORIZADO_COMENTARIOS",
                width: 200,
            },{
                caption: "FECHA ACTUALIZACION",
                dataField: "AUDITORIA_FEC_ULT_MOD",
                alignment: "center",
                dataType : "date",
                width: 150, 
                calculateCellValue: function(data) {
                    return moment(data.AUDITORIA_FEC_ULT_MOD).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                }
            }
        ],
            onRowDblClick: function (e) {
                console.log(e.data);
            }
        }).dxDataGrid('instance');

        self._Datagrid_Ot_Ticket = $("#Dg_Ot_Ticket_rel").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            dataSource: self._Obj_Ot_Ticket_Grid,
            keyExpr: "OTR_CSCORDENTRABAJO",
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: "single"
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            columns: [{
                caption: "OT",
                dataField: "OTR_CSCORDENTRABAJO",
                
            },{
                caption: "ESTATUS",
                dataField: "ESTATUS_ORDEN_CSC",
                lookup: {
                    displayExpr: "ESTATUS_ORDEN_IDIOMA1",
                    valueExpr: "ESTATUS_ORDEN_CSC",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_ESTATUS_ORDEN_TRABAJO"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        })
                    }
                }
            },{
                caption: "AREA",
                dataField: "TIPO_AREA_CSC_RESPONSABLE",
                lookup: {
                    displayExpr: "TIPO_AREA_IDIOMA1",
                    valueExpr: "TIPO_AREA_CSC",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_CAT_EMPLEADO_AREA"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        })
                    }
                }
                
            },{
                caption: "DEPARTAMENTO",
                dataField: "CAT_DEPTO_CSC_RESPONSABLE",
                lookup: {
                    displayExpr: "SAMT_TIPO_DEPARTAMENTO_IDIOMA1",
                    valueExpr: "EMPLEADO_DEPARTAMENTO_CSC",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_CAT_EMPLEADO_DEPARTAMENTO"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        })
                    }
                }
                
            },{
                caption: "RESPONSABLE",
                dataField: "EMPLEADO_CSC_RESPONSABLE"
            },{
                caption: "CERRADA",
                dataField: "OTR_CERRADA",
                
            }],
            onRowDblClick: function (e) {
        
                console.log(e.data);
                //AbrirPop
                setTimeout(() => {
                    Abrir_Pop_Ots_Ticket('EDITAR',e.data.OTR_NEWID) 
                }, 1000);
            }
        }).dxDataGrid('instance');

        self._DataGrid_Ticket_Participante = $("#Dg_Ticket_Participantes").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            dataSource: self._Obj_Ticket_Participantes_Grid,
            keyExpr: "EMPLEADO_CSC_EMPLEADO",
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: 'multiple'
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            columns: [{
                caption: "NOMBRE COMPLETO",
                dataField: "NOMBRE_EMPLEADO",
                
            },{
                caption: "TIPO PARTICIPANTE",
                dataField: "TIPO_PARTICIPANTE_CSC",
                lookup: {
                    displayExpr: "TIPO_PARTICIPANTE_IDIOMA1",
                    valueExpr: "TIPO_PARTICIPANTE_CSC",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            load: async function () {
                                try {
                                    return self.jsonTiposParticipanes
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        })
                    }
                }
            },{
                caption: "CORREO",
                dataField: "EMPLEADO_EMAIL_NOTIFICA",
                
            }],toolbar: {
                items: [{
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        text: 'Agregar Participante(s)',
                        icon: 'add',
                        disabled: false,
                        onClick() {
                            self.BusquedaEmpleado('AgregarParticipante','multiple');
                        },
                    },
                },{
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        text: 'Quitar participante(s) seleccionado(s)',
                        icon: 'trash',
                        disabled: true,
                        onClick() {
                            self._DataGrid_Ticket_Participante.getSelectedRowKeys().forEach((key) => {
                                self._Obj_Ticket_Participantes_Grid.remove(key);
                            });
                            self._DataGrid_Ticket_Participante.refresh();
                        },
                    },
                }]
            },
            onSelectionChanged(data) {
                if (getUrlParam('TIPO') == 'LECTURA') {
                    return;
                }
                self._DataGrid_Ticket_Participante.option('toolbar.items[1].options.disabled', !data.selectedRowsData.length);
            },
        }).dxDataGrid('instance');

        self.FileCorreoRespuesta = $("#FileCorreoRespuesta").dxFileUploader({
            multiple: true,
            allowedFileExtensions: [".jpg", ".jpeg", ".gif", ".png", ".pdf", ".doc", ".docx", ".xlsx", ".wav", ".mp3",".xls", ".pptx"],
            uploadMode: "useButtons",
            visible: true,
            disabled: true,
            onValueChanged: function (e) {  
                var values = e.component.option("values");  
                $.each(values, function (index, value) {  
                    e.element.find(".dx-fileuploader-upload-button").hide();  
                });  
                e.element.find(".dx-fileuploader-upload-button").hide();  
            },  
        }).dxFileUploader("instance");

    }

    

    
    self.ClickAlta = function(){
        $_Btn_Agregar_Respuesta.option('disabled', true);
        $_Btn_Agregar_Bitacora.option('disabled', true);
        //$_Btn_Cargar_Imagen_Sistema.option('disabled', true);
        //$_Btn_Agregar_Documento.option('disabled', true);
        //$_btn_Alta_Ticket_Ot.option('disabled', true);
        
        $Btn_Alta_Ticket.option('visible',false);
        $btn_Modificar_Ticket.option('visible',false);
        $btn_Cancelar_Alta_Ticket.option('visible',true);
        $btn_Salvar_Alta_Ticket.option('visible',true);
        self.Frm_Ticket_Servicio_Instance.resetValues();
        self.Frm_Ticket_Servicio_Instance.option('readOnly', false);
        self.setDefaultValues = true;
        self.LoadCatFull = false;
        self.editandoForma = false;
        var NombreEmpleado = obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO;
        switch (getUrlParam('TPO_USUARIO')) {
            case 'GENERA':
                self.Frm_Ticket_Servicio_Instance.itemOption("TIC_ATIENDE", 'isRequired', false);
                self.Frm_Ticket_Servicio_Instance.itemOption("TIC_SOLICITA", 'isRequired', true);
                self.Frm_Ticket_Servicio_Instance.getEditor("CAM_MESA_CSC").option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.getEditor("CAM_CSC_SERVICIO_SOLICITA").option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.itemOption("CAM_CSC_SERVICIO_SOLICITA", 'isRequired', false);
                self.Frm_Ticket_Servicio_Instance.getEditor("TIC_DESCRIPCION_SOLUCION").option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.getEditor("ESTATUS_TICKET_CSC").option('readOnly', true);

                self.Frm_Ticket_Servicio_Instance.getEditor("TIPO_TICKET_CSC").option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.getEditor("TIPO_PRIORIDAD_CSC").option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.getEditor("SAMT_CAM_TIPO_SERVICIO_CSC").option('readOnly', true);
                
                self.Frm_Ticket_Servicio_Instance.getEditor("REQ_CSCREQUISICION").option('readOnly', false);
                self.Frm_Ticket_Servicio_Instance.getEditor("EMPLEADO_CSC_SOLICITA").option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.getEditor("TIC_DESCRIPCION").option('readOnly', false);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_SOLICITA').option('readOnly', false);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_SOLICITA').option('value', NombreEmpleado);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_EMAIL_SOLICITANTE').option('value', obj_DatosEmpleado.EMPLEADO_EMAILLABORAL);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_TELEFONO_SOLICITANTE').option('value', obj_DatosEmpleado.EMPLEADO_TELEFONO1);

                self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_SOLICITA').option('value', obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO);
                self.Frm_Ticket_Servicio_Instance.getEditor('CLIENTE_CSC_SOLICITA').option('value', obj_DatosEmpleado.CLIENTE_CSC);

                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_AUXS2').option('readOnly', true);
            break;
            default:
                self.Frm_Ticket_Servicio_Instance.getEditor('CLIENTE_CSC_SOLICITA').option('value', obj_DatosEmpleado.CLIENTE_CSC);
                self.Frm_Ticket_Servicio_Instance.itemOption("TIC_ATIENDE", 'isRequired', true);
                self.Frm_Ticket_Servicio_Instance.itemOption("TIC_SOLICITA", 'isRequired', true);
                self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_ATIENDE').option('value', obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO);
                self.Frm_Ticket_Servicio_Instance.getEditor("TIC_DESCRIPCION").option('readOnly', false);
                self.Frm_Ticket_Servicio_Instance.getEditor("REQ_CSCREQUISICION").option('readOnly', false);
                self.Frm_Ticket_Servicio_Instance.getEditor("EMPLEADO_CSC_SOLICITA").option('readOnly', true);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('value', NombreEmpleado);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('readOnly', false);
                self.Frm_Ticket_Servicio_Instance.itemOption("CAM_CSC_SERVICIO_SOLICITA", 'isRequired', true);
                //self.Frm_Ticket_Servicio_Instance.itemOption("TIC_DESCRIPCION_SOLUCION", 'isRequired', false);
                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_AUXS2').option('readOnly', false);
            break;
        }
        
        setTimeout(() => {
            //self.FileCorreoRespuesta.option('disabled', false);
            self.Frm_Ticket_Servicio_Instance.getEditor('TIC_NEWID').option('value', createUUID(36));
            self.Frm_Ticket_Servicio_Instance.getEditor('TIC_FECHA_ALTA').option('value', moment().tz(self.TimeZoneEmpleado).format('YYYY-MM-DD HH:mm:ss'));
            self.Frm_Ticket_Servicio_Instance.getEditor('CAM_MESA_CSC').option('value', parseInt(getUrlParam('CSC_MESA')));
            //self.Frm_Ticket_Servicio_Instance.getEditor('TIC_FECHA_SOLICITA').option('value', moment().tz(self.TimeZoneEmpleado).format('YYYY-MM-DD HH:mm:ss'));
            
            //!Asigna Sitio por tipo de empleado
            switch (obj_SessionInfo.USU_CODESQUEMASEG) {
                case 1: //Master
                    //self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('value', obj_DatosEmpleado.REQ_CSCREQUISICION);
                    break;
                case 2: //Inmueble 
                    break;
                case 3: //Menu
                    //self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('value', obj_DatosEmpleado.REQ_CSCREQUISICION);
                    break;
                default:
                    //self.Frm_Ticket_Servicio_Instance.getEditor('REQ_CSCREQUISICION').option('value', obj_DatosEmpleado.REQ_CSCREQUISICION);
            }
        }, 1000);
    }
    
    self.Generar_Alta_Ticket=function(){
        var __Frm_Ticket_Servicio_servicio = self.Frm_Ticket_Servicio_Instance;
        var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
        var __Cmb_Tipifica = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC');
        var __ItemsCmb_Tipifica = __Cmb_Tipifica.option('selectedItem');

        var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
        var FechaActualSistemaProvider = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DDTHH:mm:ss');
        if (__Frm_Ticket_Servicio_servicio.validate().isValid === true) {
            var Obj_Data_Insert_Ticket = GetInsertData(Form_Data_Ticket_servicio,__Frm_Ticket_Servicio_servicio);
            Obj_Data_Insert_Ticket.AUDITORIA_USU_ALTA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            Obj_Data_Insert_Ticket.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            Obj_Data_Insert_Ticket.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
            //if(Obj_Data_Insert_Ticket.TIC_FECHA_ALTA){
                Obj_Data_Insert_Ticket.TIC_FECHA_ALTA = FechaActualSistema;
                Obj_Data_Insert_Ticket.TIC_FECHA_ALTA_SOLA = FechaActualSistema;
                Obj_Data_Insert_Ticket.TIC_FECHA_ALTA_HORA_COMPLETA = FechaActualSistema;
                Obj_Data_Insert_Ticket.AUDITORIA_FEC_ALTA = FechaActualSistema;
                Obj_Data_Insert_Ticket.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                Obj_Data_Insert_Ticket.TIC_DURACION_RECEPCION = 0; 
            //}
            if(Obj_Data_Insert_Ticket.TIC_FECHA_PROMESA){
                Obj_Data_Insert_Ticket.TIC_FECHA_PROMESA = moment(Obj_Data_Insert_Ticket.TIC_FECHA_PROMESA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
            } else {
                if (__ItemsCmb_Tipifica.TIPIFICA_TIEMPO_EJECUCION == 0) {
                    Obj_Data_Insert_Ticket.TIC_FECHA_PROMESA = moment(FechaActualSistema).add(self.TimeDefault,'seconds').format('YYYY-MM-DD HH:mm:ss');
                } else {
                    Obj_Data_Insert_Ticket.TIC_FECHA_PROMESA = moment(FechaActualSistema).add(__ItemsCmb_Tipifica.TIPIFICA_TIEMPO_EJECUCION,'seconds').format('YYYY-MM-DD HH:mm:ss');
                }
            }
            if(Obj_Data_Insert_Ticket.TIC_FECHA_SOLICITA){
                Obj_Data_Insert_Ticket.TIC_FECHA_SOLICITA = moment(Obj_Data_Insert_Ticket.TIC_FECHA_SOLICITA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
            } else {
                Obj_Data_Insert_Ticket.TIC_FECHA_SOLICITA = moment(FechaActualSistema).add(self.TimeDefault,'seconds').format('YYYY-MM-DD HH:mm:ss');
            }


            if (Obj_Data_Insert_Ticket.TIC_CSCTICKET == '') {
                delete Obj_Data_Insert_Ticket['TIC_CSCTICKET'];
            }
            
            if (Obj_Data_Insert_Ticket.TIC_CERRADO == true) {
                Obj_Data_Insert_Ticket.TIC_FECHA_CIERRE = FechaActualSistema;
                Obj_Data_Insert_Ticket.TIC_FECHA_CIERRE_SOLA = FechaActualSistema;
                Obj_Data_Insert_Ticket.TIC_FECHA_CIERRE_HORA_COMPLETA = FechaActualSistema;
                var now  = FechaActualSistema;
                var then = Obj_Data_Insert_Ticket.TIC_FECHA_ALTA;
                var m1 = moment(now);
                var m2 = moment(then);
                var m3 = m1.diff(m2,'seconds');
                Obj_Data_Insert_Ticket.TIC_DURACION_EJECUCION = m3;
            }

            Obj_Data_Insert_Ticket.TIC_TIEMPO_RECEPCION = __ItemsCmb_Tipifica.TIPIFICA_TIEMPO_RECEPCION;
            Obj_Data_Insert_Ticket.TIC_TIEMPO_EJECUCION = (__ItemsCmb_Tipifica.TIPIFICA_TIEMPO_EJECUCION == 0) ? self.TimeDefault : __ItemsCmb_Tipifica.TIPIFICA_TIEMPO_EJECUCION;
            Obj_Data_Insert_Ticket.TIC_TIEMPO_CONFIRMACION = __ItemsCmb_Tipifica.TIPIFICA_TIEMPO_CONFIRMACION;
            Obj_Data_Insert_Ticket.TIC_NOTIFICA_OPERACION = 1;
            Obj_Data_Insert_Ticket.TIC_ESTATUS_SLA_ENUM = 'pause';
            Obj_Data_Insert_Ticket.TIC_REQ_AUTORIZACION = 1;

            let categoriaNivel1 = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT_PARENT').option('selectedItem');

            var objInsert = {
                ...ReturnDefaultData_Init(),
                DATA_INSERT: Obj_Data_Insert_Ticket
            };
            if (categoriaNivel1.TIPIFICA_IDIOMA1 == "REQUERIMIENTO DE SERVICIO") {
                let files = self.documentsUploadToTicket.option("value");
                let fileWrappers = self.documentsUploadToTicket._files;

                if (files.length <= 1) {
                    self.notificaPantalla("Alerta!", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `La categoria de ticket de tipo ${categoriaNivel1.TIPIFICA_IDIOMA1} requiere oficio de solicitud y formato de requerimientos. Agréguelos en "Documentos"`, 400, 150);
                    loadPanel.hide();
                    return;
                }
            }

            if (categoriaNivel1.TIPIFICA_IDIOMA1 == "INCIDENTE") {
                let files = self.imageUploadToTicket.option("value");
                let fileWrappers = self.imageUploadToTicket._files;

                if (files.length == 0) {
                    self.notificaPantalla("Alerta!", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `La categoria de ticket de tipo ${categoriaNivel1.TIPIFICA_IDIOMA1} requiere al menos una evidencia fotográfica o video. Agréguelos en "ADJUNTAR EVIDENCIA"`, 400, 150);
                    loadPanel.hide();
                    return;
                }
            }
            

            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Ticket_Servicio','POST',JSON.stringify(objInsert),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    DevExpress.ui.notify({message: `Solicitud generada correctamente`,minWidth: 150,type: 'success',displayTime: 10000},{position: "bottom right",direction: "up-push"});
                    $Btn_Alta_Ticket.option('visible',true);
                    $btn_Modificar_Ticket.option('visible',true);
                    $btn_Cancelar_Alta_Ticket.option('visible',false);
                    $btn_Salvar_Alta_Ticket.option('visible',false);
                    self.Frm_Ticket_Servicio_Instance.option('readOnly', true);
                    var __Oj_Dts_Busqueda = {
                        ...ReturnDefaultData_Init(),
                        TIC_NEWID: Form_Data_Ticket_servicio.TIC_NEWID,
                        CAM_CSC_SERVICIO: Form_Data_Ticket_servicio.CAM_CSC_SERVICIO,
                    }
                    let __cmb_component_Estatus = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                    let __ValidaEnvio = __cmb_component_Estatus.option('selectedItem');
                    //let __cmb_component_Sub_Estatus = self.Frm_Ticket_Servicio_Instance.getEditor('SUB_ESTATUS_TICKET_CSC');
                    //let __ValidaEnvio_Sub_Estatus = __cmb_component_Sub_Estatus.option('selectedItem');
                    var obj_BitacoraSend = {}
                    obj_BitacoraSend.TIC_CSCTICKET = in_emp.JsonData.idTicketInsert;
                    obj_BitacoraSend.ESTATUS_TICKET_CSC = __ValidaEnvio.ESTATUS_TICKET_CSC;
                    loadPanel.show();
                    self.InsertaBitacoraManual(obj_BitacoraSend,Globalize.formatMessage("txtBitaInfoAltaProceso")+": "+ __ValidaEnvio.ESTATUS_TICKET_IDIOMA1, false, 1,2);
                    self.uploadImageToTicket(false);
                    self.uploadFileToTicket(false);
                    //self._InsertaEmpleadosTicket();
                    setTimeout(() => {
                        loadPanel.show();
                        setTimeout(() => {
                            self.Get_Tickets(__Oj_Dts_Busqueda,true,null);
                        }, 3000);
                    }, 2000);
                    
                    $_Btn_Agregar_Respuesta.option('disabled', false);
                    $_Btn_Agregar_Bitacora.option('disabled', false);
                    //$_Btn_Cargar_Imagen_Sistema.option('disabled', false);
                    //$_Btn_Agregar_Documento.option('disabled', false);


                }
                else {
                    loadPanel.hide();
                }
                return in_emp;
            }).catch(function(e){
                console.log(e);
                loadPanel.hide();
                DevExpress.ui.notify({message: `ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            });
        }
        else {
            DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
        }
    }

    self.InsertTicketProviderTesteo=function(dataProvider){
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IkFMRVgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsb3Blel9hbGVqYW5kcm9AbGl2ZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJBTEVKQU5EUk8gTMOTUEVaIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQURPUiIsImV4cCI6MTc1NjQyMDQxMCwiaXNzIjoiaHR0cHM6Ly93d3cuc29wb3J0ZWNhcmdhLm14L2Rlc2tfcnQ0IiwiYXVkIjoiaHR0cHM6Ly93d3cuc29wb3J0ZWNhcmdhLm14L2Rlc2tfcnQ0In0.t9_uOYu_AQtVVkfyQDWaByUIx2zguOLCT18Cvr3aQCM"
        __Reques_ajax_Providers('https://www.soportecarga.mx/Apicoveca1/Servicios','POST',JSON.stringify(dataProvider),token).then((in_emp)=>{
            console.log(in_emp);
            
        }).catch(function(e){
            console.log(e);
            loadPanel.hide();
            DevExpress.ui.notify({message: `ERRO DE COMUNICACIÓN CON PROVEEDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
        });
    }

    self.Get_Tickets=function(__AryDatos,PopAlert,DgRefresh){
        loadPanel.show();
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Servicio','GET',__AryDatos,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                loadPanel.hide();
                var CargaFrm = in_emp.JsonData[0];
                //!Formateo de Fechas
                if (CargaFrm.TIC_FECHA_PROMESA != null) {
                    CargaFrm.TIC_FECHA_PROMESA = moment(CargaFrm.TIC_FECHA_PROMESA).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss')
                }
                
                if (CargaFrm.TIC_FECHA_ALTA != null) {
                    CargaFrm.TIC_FECHA_ALTA = moment(CargaFrm.TIC_FECHA_ALTA).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss')
                }

                if (CargaFrm.TIC_FECHA_CIERRE != null) {
                    CargaFrm.TIC_FECHA_CIERRE = moment(CargaFrm.TIC_FECHA_CIERRE).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss')
                }

                if (CargaFrm.TIC_FECHA_SOLICITA != null) {
                    CargaFrm.TIC_FECHA_SOLICITA = moment(CargaFrm.TIC_FECHA_SOLICITA).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss')
                }
                switch (getUrlParam('TPO_USUARIO')) {
                    case 'GENERA':
                        self.Frm_Ticket_Servicio_Instance.getEditor("CAM_CSC_SERVICIO_SOLICITA").option('readOnly', true);
                        $btnCalificaAtencion.option('visible',true);
                        $btn_Modificar_Ticket.option('visible',false);
                    break;
                    default:
                        self.Frm_Ticket_Servicio_Instance.itemOption("CAM_CSC_SERVICIO_SOLICITA", 'isRequired', true);
                        
                        if (CargaFrm.EMPLEADO_CSC_ATIENDE == null) {
                            console.log("No se tiene empleados asignado");
                            /*setTimeout(() => {
                                var __cmb_component = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                                console.log(__cmb_component.option('dataSource'));    
                            }, 2000);*/

                            if (getUrlParam('TPO_USUARIO') == 'GENERA') {
                                
                            } else {

                                if (getUrlParam('AUTORIZADOR') == "true") {
                                    console.log("No Asigna empleado");
                                } else{
                                    CargaFrm.EMPLEADO_CSC_ATIENDE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;

                                    var Obj_Data_Update_Ticket = {};
                                    Obj_Data_Update_Ticket.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                    Obj_Data_Update_Ticket.EMPLEADO_CSC_ATIENDE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                    Obj_Data_Update_Ticket.TIC_ATIENDE = obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO;
                                    Obj_Data_Update_Ticket.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                    
                                    var __Obj_Update = {
                                        ...ReturnDefaultData_Init(),
                                        DATA_UPDATE: Obj_Data_Update_Ticket,
                                        DATA_WHERE:{
                                            "TIC_CSCTICKET":CargaFrm.TIC_CSCTICKET,
                                            "TIC_NEWID":CargaFrm.TIC_NEWID,
                                            "EMP_CSC_EMPRESA_HOST":localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                        }
                                    };
                                    __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Update_Ticket_Servicio','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                                        if (in_emp.success == true) {
                                            DevExpress.ui.notify( 'Empleado Asignado correctamente', 'success', 3000);
                                            self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('value', obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO);
                                        }}
                                    ).catch(function(e){
                                        DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                                    });
    
                                    let empleadoAsignado = obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO;
                                    var DetalleTicket = {}
                                    DetalleTicket.TIC_CSCTICKET = CargaFrm.TIC_CSCTICKET;
                                    DetalleTicket.ESTATUS_TICKET_CSC = CargaFrm.ESTATUS_TICKET_CSC;
    
                                    self.InsertaBitacoraManual(DetalleTicket,'Ticket asignado a: ' + empleadoAsignado, false, 1,2);
                                    console.log('Ticket asignado a: ' + empleadoAsignado);
                                }
                                
                            }
                        } else {
                            DevExpress.ui.notify( 'Ya se esta atendiendo por un operador', 'warning', 3000);
                            console.log("Ya se tiene empleado asignado");
                        }
                    break;
                }

                var StringInfoForm = JSON.stringify(CargaFrm);
                self.DataTicketOpen = JSON.parse(StringInfoForm);
                self.Frm_Ticket_Servicio_Instance.updateData( self.DataTicketOpen );
                setTimeout(() => {
                    self.ObtenSelectBoxFrm(self.Frm_Ticket_Servicio_Instance)
                    // self.Get_Bitacora_tickets(self.DataTicketOpen.TIC_CSCTICKET);
                    // self.Get_Ticket_Foto(self.DataTicketOpen.TIC_CSCTICKET);   
                    self.Get_Ticket_Documentos(false);
                    // self.Get_Respuesta_Mensaje(self.DataTicketOpen.TIC_CSCTICKET);
                    // self.Get_Emp_Ticket(self.DataTicketOpen.TIC_NEWID);
                    // self.Get_DevengosSPF(self.DataTicketOpen.TIC_NEWID);
                    // self.Previous_TxtParentParent = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT_PARENT').option('text');
                    // self.Previous_TxtParent = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC_PARENT').option('text');
                    // self.Previous_TxtTipifica = self.Frm_Ticket_Servicio_Instance.getEditor('TIPIFICA_CSC').option('text');
                    self.Previous_TxtEstatus = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC').option('text');
                    if (getUrlParam('TPO_USUARIO') == 'GENERA') {
                        return;
                    }
                    // self.Get_Linkeo_ticket_ot(self.DataTicketOpen.TIC_CSCTICKET); 
                    // self.Get_Autorizaciones_Ticket(self.DataTicketOpen.TIC_NEWID);
                }, 3000);
                
                if (PopAlert == true) {
                    const popupContentTemplate = function () {
                        return $('<div>').append(
                            $("<div class='popup-property-details'>").append(
                                $('<div class="Nice-Shadow-1" style="padding: 9px;">TICKET GENERADO</div>'),
                                $('<div class="content">').append(
                                    $('<img style=" width: 200px; height: 150px;" src="../../../images/Icons/success_ticket.gif" alt="">'),
                                    $('<div style="flex-grow: 1; font-size: 20px; font-weight: bold;">No. ticket: '+in_emp.JsonData[0].TIC_CSCTICKET+'</div>'),
                                    $('<div style="flex-grow: 1; font-size: 12px;">GUARDE SU NUMERO DE TICKET PARA FUTURAS CONSULTAS</div>'),
                                )
                            )
                        );
                    };
                    $("#Pop_Notificacion_Success").dxPopup("instance").option("height",300);
                    $("#Pop_Notificacion_Success").dxPopup("instance").option("width",360);
                    $("#Pop_Notificacion_Success").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                    $('#Pop_Notificacion_Success').dxPopup("show");
                    var __cmb_component_Estatus = self.Frm_Ticket_Servicio_Instance.getEditor('ESTATUS_TICKET_CSC');
                    var __ValidaEnvio = __cmb_component_Estatus.option('selectedItem');
                    var MensajeNewId = null;
                    //var MensajeNewId = createUUID(36);
                    let infoMensaje = `<b>Estatus:</b> ${__ValidaEnvio.ESTATUS_TICKET_IDIOMA1} <br><br> Cordial saludo, queremos informarte que su ticket fue generado con éxito, a partir de este momento empezamos el estudio correspondiente para darte una respuesta con la mayor oportunidad posible.`;
                    self.EnviaRespuesta("Nuevo ticket No. - " + self.DataTicketOpen.TIC_CSCTICKET, self.DataTicketOpen.TIC_NEWID, infoMensaje,MensajeNewId)

                } else {
                    
                }
            } else {
                loadPanel.hide();
                if (PopAlert == true) {
                    DevExpress.ui.notify("TICKET NO LOCALIZADO", "error", 3000);
                } else{
                    DevExpress.ui.notify("TICKETS NO LOCALIZADO", "error", 3000);
                }
            }
            return in_emp;
        }).catch(function(e){
            loadPanel.hide();
            console.log(e);
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
        });
    }

    self.Get_Bitacora_tickets=function(__AryDatos){
        if ($("#Dg_Bitacora_Ticket").length) {
            var jsonBusqueda = {
                ...ReturnDefaultData_Init(),
                TIC_CSCTICKET: __AryDatos
            };
            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Bitacora','GET',jsonBusqueda,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    $("#Dg_Bitacora_Ticket").dxDataGrid("instance").option("dataSource", in_emp.JsonData);
                } else{
                    $("#Dg_Bitacora_Ticket").dxDataGrid("instance").option("dataSource", []);
                }
            }).catch(function(e){
                DevExpress.ui.notify({message: `ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                $("#Dg_Bitacora_Ticket").dxDataGrid("instance").option("dataSource", []);
            });
        }
    }

    self.Get_Ticket_Foto=function() {
        if ($("#Dg_RepFoto_Ticket").length) {
            var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
            var jsonDataBd = {
                ...ReturnDefaultData_Init(),
                TIC_NEWID: Form_Data_Ticket_servicio.TIC_NEWID,
                TICKET_ACTIVO: 1
            };
            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Foto','GET',jsonDataBd,getJSON(DeveloperType).ApiTickets_v2.token).then((result)=>{
                if (result.success == true) {    
                    $("#Dg_RepFoto_Ticket").dxDataGrid("instance").option("dataSource",  result.JsonData);
                } else {
                    $("#Dg_RepFoto_Ticket").dxDataGrid("instance").option("dataSource",  []);
                    loadPanel.hide();
                }
            });   
        }
    }

    self.Get_Ticket_Documentos=function(CargaSolicitud) {
        if ( $("#Dg_Documento_Ticket").length) {
            var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
            var jsonDataBd = {
                ...ReturnDefaultData_Init(),
                TIC_NEWID: Form_Data_Ticket_servicio.TIC_NEWID,
                TICKET_FILE_ACTIVO: 1
            };
            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Documentos','GET',jsonDataBd,getJSON(DeveloperType).ApiTickets_v2.token).then((result)=>{
                if (result.success == true) {  
                    var __Obj_Solicitud = jslinq( result.JsonData ).where(
                        function(el) {return (el.TICKET_FILE_DESCRIPCION).trim() == 'Solicitud_Servicio_Sistema.pdf';}
                    ).toList();

                    if (CargaSolicitud == true) {
                        if (__Obj_Solicitud.length > 0) {
                            self.ObtenSolicitudFormal(__Obj_Solicitud[0].TIC_NEWID,__Obj_Solicitud[0].TICKET_FILE_RUTA)    
                        }    
                    }
                    $("#Dg_Documento_Ticket").dxDataGrid("instance").option("dataSource",  result.JsonData);
                } else {
                    $("#Dg_Documento_Ticket").dxDataGrid("instance").option("dataSource",  []);
                    loadPanel.hide();
                }
            });    
        }
    }


    

    self.Get_Linkeo_ticket_ot=function(__AryDatos){
        self._Obj_Ot_Ticket_Grid.clear()
        if (obj_DatosEmpleado.CAT_AREA_CSC == 58 && obj_DatosEmpleado.CAT_DEPARTAMENTO_CSC == 112) {

        } else {
            var jsonBusqueda = {
                ...ReturnDefaultData_Init(),
                TIC_CSCTICKET: __AryDatos,
                MS: "BASE"
            };
            __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Get_Linkeo_ticket_ot','GET',jsonBusqueda,getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    var selectedRowsData = in_emp.JsonData;
                    selectedRowsData.forEach(function(item) {
                        self._Obj_Ot_Ticket_Grid.insert(item);
                    });
                    self._Datagrid_Ot_Ticket.refresh();
                } else{
                    self._Datagrid_Ot_Ticket.refresh()
                }
            }).catch(function(e){
                DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                self._Datagrid_Ot_Ticket.refresh()
            });
        }
        
    }

    self.Get_Ticket_Participantes=function(__AryDatos){
        if ( $("#Dg_Ticket_Participantes").length) {
            self._Obj_Ticket_Participantes_Grid.clear();
            var jsonBusqueda = {
                ...ReturnDefaultData_Init(),
                TIC_NEWID : __AryDatos,
                TIPO_PARTICIPANTE_CSC_IN: "1,2,3"
            };
            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Part','GET',jsonBusqueda,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    var selectedRowsData = in_emp.JsonData;
                    console.log(selectedRowsData);
                    selectedRowsData.forEach(function(item) {
                        self._Obj_Ticket_Participantes_Grid.insert(item);
                    });
                    self._DataGrid_Ticket_Participante.refresh();
                } else{
                    self._DataGrid_Ticket_Participante.refresh();
                }
            }).catch(function(e){
                DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                self._DataGrid_Ticket_Participante.refresh();
            });
        }
    }


    self.EnviaCorreo = function(params) {
        LoadEnvioCorreo.show();
        LoadEnvioCorreo.message = Globalize.formatMessage("msjTicketSendMail");
        var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
        /*var dts_FrmSura = self.__Frm_Sura_Crm.option('formData');
        var NombreMandaCorreo = "";
        var CorreoEnviar = "";

        if (getUrlParam('TIPO') == 'ALTA') {
            if (dts_FrmSura.TIPO_CRM_DOCUMENTO_CSC == 3) {
                NombreMandaCorreo = dts_FrmSura.CRM_NOMBRE_INSTITUCION;
            } else {
                NombreMandaCorreo = dts_FrmSura.CRM_NOMBRE + " " + dts_FrmSura.CRM_APELLIDOS;
            }
            CorreoEnviar = dts_FrmSura.CRM_CORREO
        } else {
            NombreMandaCorreo = Form_Data_Ticket_servicio.TIC_SOLICITA;
            CorreoEnviar = Form_Data_Ticket_servicio.TIC_EMAIL_SOLICITANTE
        }*/

        var __ListaDistribucion_last = [
            {
               mail: CorreoEnviar,
               Nombre: NombreMandaCorreo,
               Proceso: 'Actualización de Solicitud',
               Solicitud: Form_Data_Ticket_servicio.TIC_DESCRIPCION_SOLUCION
            }
        ]

        var htmlTest = `<p>Cordial saludo,</p>
        <p></p>
        <p>
          Te informamos que la solicitud a nombre de XXXXXX, con documento No. XXXX, se
          encuentra en estado &quot;PENDIENTE POR REQUISITOS&quot; para poder hacer
          efectiva esta solicitud debes adjuntar:
        </p>
        <p></p>
        <p>XXXXX (especificar lo que se requiera)</p>
        <p></p>
        <p>
          Es importante tener en cuenta que el tiempo de respuesta inicia, una vez la
          solicitud tenga los requisitos completos.
        </p>
        <p></p>
        <p>Muchas gracias por su comprensión y colaboración.</p>`;
        var Datos_Mail = null;
            for (const property in __ListaDistribucion_last) {
                Datos_Mail = {
                    "CLAVE_SMTP": "DNA.ORACLE",
                    "Template":"Noti_Generica",
                    "emailto":__ListaDistribucion_last[property].mail,
                    "subject":"Notificaciones tickets",
                    "bcc": dts_FrmSura.EMAIL_RESPUESTA_CCO,
                    //"ATTACHDOC": true,
                    "TEMPLATE_PARAMETROS":{
                        "emailAddress": __ListaDistribucion_last[property].mail,
                        "titulosolicitud": NombreMandaCorreo,
                        "lblproceso":__ListaDistribucion_last[property].Proceso,
                        //"lbltiposolicitud":__ListaDistribucion_last[property].Solicitud,
                        "lbltiposolicitud":htmlTest,
                        "lbltipotitulosoli": "Por favor, NO respondas a este mensaje, este es un medio informativo automático. Si requieres más información sobre el contenido haz click aquí: ",
                        "lblnombresoli":'Enviado por: BOT DNASYSTEM'
                    }
                }
                
                //__Reques_ajax(getJSON(DeveloperType).ApiNotificaciones.url+'Send_Mail','POST',JSON.stringify(Datos_Mail),getJSON(DeveloperType).ApiNotificaciones.token).then((result)=>{
                    __Reques_ajax(getJSON(DeveloperType).ApiSuraCrmColombia.url+'Send_Mail_Dinamico','POST',JSON.stringify(Datos_Mail),getJSON(DeveloperType).ApiSuraCrmColombia.token).then((result)=>{
                    
                        if (result.success == true) {    
                            DevExpress.ui.notify({message: `E-Mail Enviado`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                            LoadEnvioCorreo.hide();
                        } else {
                            LoadEnvioCorreo.hide();
                        }
                    }).catch(function(e){
                        LoadEnvioCorreo.hide();
                        DevExpress.ui.notify({message: `ERROR EN COMUNICACION CON EL SERVIDOR INTENTE NUEVAMENTE`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                        console.log(e);
                    });
            }
    }


    self.utf8Encode = function(unicodeString) {
        if (typeof unicodeString != 'string') throw new TypeError('parameter ‘unicodeString’ is not a string');
        const utf8String = unicodeString.replace(
            /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
        ).replace(
            /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
        );
        return utf8String;
    }

    self.EnviaRespuesta = function(Subject_Data, TicNewid,TextoRespuesta,MensajeNewId) {
        LoadEnvioCorreo.show();
        LoadEnvioCorreo.message = Globalize.formatMessage("msjTicketSendMail");
        let Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
        let NombreMandaCorreo = "";
        let CorreoEnviar = "";    
        NombreMandaCorreo = Form_Data_Ticket_servicio.TIC_SOLICITA;
        CorreoEnviar = Form_Data_Ticket_servicio.TIC_EMAIL_SOLICITANTE;

        const dataTemplateCorreo = {
            "_ClientData": {
                "EMP_CLV_EMPRESA": ReturnDefaultData_Init().EMP_CLV_EMPRESA,
                "Type": ReturnDefaultData_Init().Type,
                "EMP_CSC_EMPRESA_HOST": ReturnDefaultData_Init().EMP_CSC_EMPRESA_HOST,
            }, 
            "MailDataConfig": {
                "emailto": CorreoEnviar,
                "subject": `${Subject_Data} ###${Form_Data_Ticket_servicio.TIC_CSCTICKET}###${TicNewid}`,
                "template": {
                    "templateLayout": "Noti_Dna_Default",
                    "templateData": {
                            "lbl_id_ticket": "No. de ticket",
                            "val_id_ticket":Form_Data_Ticket_servicio.TIC_CSCTICKET,
                            "lbl_f_alta": "Fecha de alta",
                            "val_f_alta": Form_Data_Ticket_servicio.TIC_FECHA_ALTA,
                            "lbl_tipo": "Tipo",
                            "val_tipo": self.Frm_Ticket_Servicio_Instance.getEditor("TIPO_TICKET_CSC").option('text'),
                            "lbl_prio": "Prioridad",
                            "val_prio": self.Frm_Ticket_Servicio_Instance.getEditor("TIPO_PRIORIDAD_CSC").option('text'),
                            "lbl_head_info": "Información de solictud",
                            "lbl_mesa": "Mesa de ayuda",
                            "val_mesa": self.Frm_Ticket_Servicio_Instance.getEditor("CAM_MESA_CSC").option('text'),
                            "lbl_estatus": "Estatus",
                            "val_estatus": self.Frm_Ticket_Servicio_Instance.getEditor("ESTATUS_TICKET_CSC").option('text'),
                            "txt_body_mail": TextoRespuesta,
                            "lbl_footer": "<b>INFORMACIÓN CONFIDENCIAL</b> Este comunicado es para ser utilizado por el receptor y contiene información que puede ser privilegiada, confidencial, de propiedad intelectual y/o que contenga datos personales, de acuerdo con las leyes aplicables. Si usted no es el receptor interesado, por el presente se le notifica formalmente que cualquier uso, copia o distribución de este correo electrónico, en todo o en parte, está estrictamente prohibido. Por favor notifique al remitente regresándole este correo electrónico y bórrelo de su sistema. Este correo electrónico no constituye un consentimiento para el uso de la información del remitente, para propósitos directos de mercadotecnia o para transmisiones de información a terceros.",
                            "fechaEnvio": moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            "EMPLEADO_CSC_EMPLEADO": obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            "TIC_NEWID": TicNewid,
                            "MensajeNewId": MensajeNewId
                    }	
                }
            }
        }

        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    // self.uploadProgressBar.option("visible", true);
                    // var percentComplete = evt.loaded / evt.total;
                    // percentComplete = parseInt(percentComplete * 100);
                    // self.uploadProgressBar.option("value", percentComplete);
                }
                }, false);
                return xhr;
            },
            type: 'POST',
            url: `${getJSON(DeveloperType).Bot_Internal_Storage_Anam.url}apiNotify/mailsystem/SendMail`,
            //url: self.UrlEnvioCorreos+"/apiNotify/mailsystem/SendMail",
            cache: false,
            processData: false,
            data: JSON.stringify(dataTemplateCorreo),
            contentType: 'application/json',
            headers: {
                //"access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNTgxNzQzMzQ3LCJleHAiOjE1ODE3NDQ3ODd9.41a1b18e-403d-42a3-981c-bee4049631dc"
            }
        }).done(function(data) {
            if (data.success == true) {
                DevExpress.ui.notify({message: `E-Mail Enviado`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                LoadEnvioCorreo.hide();
            } else {
                LoadEnvioCorreo.hide();
            }
        }).fail( function(e) {
            console.log(e);
            DevExpress.ui.notify({message: `Error en el envio de correo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            LoadEnvioCorreo.hide();
        });
    }

    self.Generar_Orden_Trabajo_Rechazo = function(){
        var Area = 58;
        var Departamento = 107;

        var __Ary_Procesos = JSON.parse( sessionStorage.getItem("Cat_Proceso_Empleados") );
        var __Ary_SubProceso = JSON.parse( sessionStorage.getItem("Cat_Sub_Proceso_Empleados") );
        var __Ary_Estatus_Empleado = JSON.parse( sessionStorage.getItem("Cat_Estatus_Empleados") );
        
        var __Obj_Activo = jslinq( __Ary_Procesos ).where(
            function(el) {return (el.CAT_PROCESO_EMP_CLAVE).trim() == 'ACTIVO';}
        ).toList();

        var __Obj_Piso = jslinq( __Ary_SubProceso ).where(
            function(el) {return (el.CAT_SUBPROCESO_EMP_CLAVE).trim() == 'OPER';}
        ).toList();

        var __Obj_Estatus_emp = jslinq( __Ary_Estatus_Empleado ).where(
            function(el) {return (el.CAT_ESTATUS_PROCESO_EMP_CLAVE).trim() == 'ACT';}
        ).toList();
        var Id_Proceso_Empleado_Activo = __Obj_Activo[0].CAT_PROCESO_EMP_CSC;
        var Id_Proceso_Empleado_EnPiso = __Obj_Piso[0].CAT_SUBPROCESO_EMP_CSC;
        var Id_Estatus_Empleado = __Obj_Estatus_emp[0].CAT_ESTATUS_PROCESO_EMP_CSC;

        var __Ary_Get_Ot_Conteo_Empleado= {
            ...ReturnDefaultData_Init(),
            CAT_PROCESO_EMP_CSC: Id_Proceso_Empleado_Activo,
            CAT_SUBPROCESO_EMP_CSC: Id_Proceso_Empleado_EnPiso,
            CAT_AREA_CSC:Area,
            CAT_DEPARTAMENTO_CSC:Departamento,
            OTR_CERRADA: 0
        };
        
        __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Get_Ot_Conteo_Empleado','GET',__Ary_Get_Ot_Conteo_Empleado,getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((all_data)=>{
            if (all_data.success == true){
                loadPanel.hide();
                var _DataResult = all_data.JsonData;
                
                var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
                var __Concatena = "Detalle solicitud: " + Form_Data_Ticket_servicio.TIC_DESCRIPCION + " Detalle de rechazo: " +Form_Data_Ticket_servicio.TIC_MOTIVO_RECHAZO;

                var _OtrNewidGenerado =  createUUID(36);

                var Datos_Ot_Generica = {
                    "EMP_CLV_EMPRESA":localStorage.getItem('EMP_CLV_EMPRESA'),
                    "Type": localStorage.getItem('Type'),
                    "EMP_CSC_EMPRESA_HOST": localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    "DATA_INSERT":{
                    "OTR_FECHA_ALTA": moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    "OTR_NEWID": _OtrNewidGenerado,
                    "REQ_CSCREQUISICION": obj_DatosEmpleado.REQ_CSCREQUISICION,
                    "ESTATUS_ORDEN_CSC":1,
                    "CAT_PROVEEDOR_INFRA_CSC":12,
                    "TIPO_PRIORIDAD_CSC":3,
                    "TIPO_ORDEN_CSC":63,
                    "SUB_TIPO_CSC":351,
                    "TIPO_DISCIPLINA_OT_CSC":3,
                    "TIPO_ESPECIALIDAD_OT_CSC":48,
                    "TIPO_OT_TRAMITE_CSC":1,
                    "TIPO_CALIFICACION_CSC":1,
                    "EMPLEADO_CSC_SOLICITA":obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                    "EMPLEADO_CSC_RESPONSABLE": _DataResult[0].EMPLEADO_CSC_EMPLEADO,
                    "TIPO_AREA_CSC_SOLICITUD":obj_DatosEmpleado.CAT_AREA_CSC,
                    "CAT_DEPTO_CSC_SOLICITUD":obj_DatosEmpleado.CAT_DEPARTAMENTO_CSC,
                    "TIPO_AREA_CSC_RESPONSABLE":Area,
                    "CAT_DEPTO_CSC_RESPONSABLE":Departamento,
                    "EMPLEADO_CSC_ALTA":obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                    "MDA_CVEMONEDA":1,
                    "OTR_COSTO":0,
                    "OTR_DESCRIPCION": __Concatena,
                    "OTR_SOLUCION":"",
                    "OTR_CANCELACION":"",
                    "OTR_FECHA_PROGRAMADA": moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    "OTR_FECHA_PROMESA": moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    "OTR_CERRADA":false,
                    "MDA_CVEMONEDA_TOTAL":1,
                    "OTR_COSTO_TOTAL":0,
                    "SAMT_CSC_CENTRO_COSTOS":null,
                    "AUDITORIA_USU_ALTA":obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                    "AUDITORIA_USU_ULT_MOD":obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                    "AUDITORIA_FEC_ALTA":moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    "AUDITORIA_FEC_ULT_MOD":moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    "OTR_FECHA_ALTA_CORTA":moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    "OTR_FECHA_ALTA_HORA_COMPLETA":moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    "EMP_CSC_EMPRESA_HOST": localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    "CLIENTE_CSC":obj_DatosEmpleado.CLIENTE_CSC,
                    "PM_CSC_PROYECTO":obj_DatosEmpleado.PM_CSC_PROYECTO,
                    "CAM_CSC_SERVICIO":obj_DatosEmpleado.CAM_CSC_SERVICIO
                    }
                };

                __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Insert_Orden_Trabajo','POST',JSON.stringify(Datos_Ot_Generica),getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
                    if (in_emp.success == true) {
                        loadPanel.hide();
                        DevExpress.ui.notify( 'Ot insertada correctamente', 'success', 4000);

                        var __Obj_Consulta_Ots = {
                            OTR_NEWID: _OtrNewidGenerado
                        }
                        self.Consulta_Ordenes_Trabajo(__Obj_Consulta_Ots,true);
                    }
                    else {
                        loadPanel.hide();
                    }
                    return in_emp;
                }).catch(function(e){
                    loadPanel.hide();
                    DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                });
                
            }
            else{
                loadPanel.hide();
                DevExpress.ui.notify("No se localizo ninguna empleado", "success", 3000);
            }
        })
        .catch(function(e){
            console.log(e);
            loadPanel.hide();
            DevExpress.ui.notify("Error de de busqueda vueva a intentar nuevamente", "error", 3000); 
        });

    }

    self.Consulta_Ordenes_Trabajo = function(__Obj_Consulta_Ots,Inserta){
        var __Obj_Data_Ots = {
            ...ReturnDefaultData_Init(),
        };
        var UnionObj = Object.assign(__Obj_Data_Ots,__Obj_Consulta_Ots);

        loadPanel.show();

        __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Get_Orden_Trabajo','GET',UnionObj,getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((all_data)=>{
            if (all_data.success == true){
                loadPanel.hide();
                var _DataResult = all_data.JsonData;

                if (Inserta == true) {
                    var __Obj_Insert_Ot_Tik = {
                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                        TIC_CSCTICKET:self.DataTicketOpen.TIC_CSCTICKET,
                        OTR_CSCORDENTRABAJO:_DataResult[0].OTR_CSCORDENTRABAJO,
                        AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                        AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                        AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                        AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                        
                    }
                    self.Inserta_Interseccion_Ot_Ticket(__Obj_Insert_Ot_Tik)
                } else {
                    
                }
            }
            else{
                loadPanel.hide();
                DevExpress.ui.notify("No se localizo ninguna Ot", "success", 3000);
            }
        })
        .catch(function(e){
            console.log(e);
            loadPanel.hide();
            DevExpress.ui.notify("Error de de busqueda vueva a intentar nuevamente", "error", 3000); 
        });

    }


    self.Inserta_Interseccion_Ot_Ticket=function(Obj_Data_Insert_Ticket){
        var objInsert = {
            ...ReturnDefaultData_Init(),
            DATA_INSERT: Obj_Data_Insert_Ticket
        };

        __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Insert_Inter_Ot_Ticket','POST',JSON.stringify(objInsert),getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                loadPanel.hide();
            }
            else {
                loadPanel.hide();
            }
            return in_emp;
        }).catch(function(e){
            console.log(e);
            loadPanel.hide();
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
        });

    }


    self.Get_Autorizaciones_Ticket=function(__AryDatos){
        self._Obj_Autorizaciones_Grid.clear();
        var jsonBusqueda = {
            ...ReturnDefaultData_Init(),
            AUTORIZACIONES_TIC_NEWID: __AryDatos
        };
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Autoriza_Ticket','GET',jsonBusqueda,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                var selectedRowsData = in_emp.JsonData;
                selectedRowsData.forEach(function(item) {
                    self._Obj_Autorizaciones_Grid.insert(item);
                });
                self._DataGrid_Autorizacion.refresh();
            } else{
                self._DataGrid_Autorizacion.refresh();
            }
        }).catch(function(e){
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
            self._DataGrid_Autorizacion.refresh();
        });
    }

    self.Get_Respuesta_Mensaje=function(__AryDatos){
        if ($("#Dg_MensajesClienteOperador").length) {
            var jsonBusqueda = {
                ...ReturnDefaultData_Init(),
                TIC_CSCTICKET: __AryDatos
            };
            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Respuesta_Mensaje','GET',jsonBusqueda,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    $("#Dg_MensajesClienteOperador").dxDataGrid("instance").option("dataSource", in_emp.JsonData);
                } else{
                    $("#Dg_MensajesClienteOperador").dxDataGrid("instance").option("dataSource", []);
                }
            }).catch(function(e){
                DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
                $("#Dg_MensajesClienteOperador").dxDataGrid("instance").option("dataSource", []);
            });
        }
    }

    self.ActualizaRespuestaLectura=function(idRespuesta,IdTicket){
        var Obj_RespuestaUpdate = {};
        if (getUrlParam('TPO_USUARIO') == 'GENERA') {
            Obj_RespuestaUpdate.RESPUESTA_LEIDO_CLIENTE = 1;
            Obj_RespuestaUpdate.RESPUESTA_FEC_LEIDO_CLIENTE = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
        } else {
            Obj_RespuestaUpdate.RESPUESTA_LEIDO_OPERADOR = 1;
            Obj_RespuestaUpdate.RESPUESTA_FEC_LEIDO_OPERADOR = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
        }
        
        var __Obj_Update = {
            ...ReturnDefaultData_Init(),
            DATA_UPDATE: Obj_RespuestaUpdate,
            DATA_WHERE:{
                "TIC_CSCTICKET": IdTicket,
                "CSC_RESPUESTA": idRespuesta,
                "EMP_CSC_EMPRESA_HOST":localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            }

        };

        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Update_Respuesta_Mensaje','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                DevExpress.ui.notify( 'Respuesta actualizada', 'success', 3000);
            }}
        ).catch(function(e){
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
        });
    }

    self.CopiarClipboar=function(texto){
        navigator.clipboard
        .writeText(texto)
        .then(() => {
            DevExpress.ui.notify( 'Copiado correctamente', 'success', 4000);
        })
        .catch(() => {
            DevExpress.ui.notify( 'Ticket insertado correctamente', 'danger', 4000);
        });
    }

    self.ObtenClipboard=function(idFrm,Editor){
        
        navigator.clipboard.readText()
        .then(texto => {
            $('#'+idFrm).dxForm('instance').getEditor(Editor).option('value', texto);
        })
        .catch(error => {
            // Por si el usuario no da permiso u ocurre un error
        });
    }

    //! Componente para busqueda de empleados
    self.BusquedaEmpleado = function (CamposLlena,selMode) {
        const  popupContentTemplate = function () {
            return $('<div>').append(
                $("<div class='popup-property-details'>").append(
                    $('<div class="Nice-Shadow-1" style="padding: 9px;">Buscar empleado</div>'),
                    $("<div style='margin: 9px;'/>").attr("id", "DataGridEmpleadosBusqueda").dxDataGrid({
                        headerFilter: { visible: false },
                        keyExpr: "EMPLEADO_CSC_EMPLEADO",
                        dataSource: self._Obj_Empleados_Grid,
                        selection: {
                            mode: selMode
                        },
                        height: 300,
                        filterRow: {
                            visible: true,
                            applyFilter: 'auto',
                        },
                        scrolling: {
                           // mode: "standard" // or "virtual" | "infinite"
                            useNative: false,
                            scrollByContent: true,
                            scrollByThumb: true,
                            showScrollbar: "always" // onHover or "onClick" | "always" | "never"
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
                                caption: "Proceso",
                                dataField: "CAT_PROCESO_EMP_CSC",
                                alignment: "left",
                                groupIndex: 0,
                                lookup: {
                                    displayExpr: "CAT_PROCESO_EMP_IDIOMA1",
                                    valueExpr: "CAT_PROCESO_EMP_CSC",
                                    dataSource: {
                                        store: new DevExpress.data.CustomStore({
                                            load: async function () {
                                                try {
                                                    return JSON.parse(sessionStorage.getItem('Cat_Proceso_Empleados'))
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }
                                        })
                                    }
                                }
                            },
                            {
                                dataField: "ACCIONES",
                                type: 'buttons',
                                width: 110,
                                buttons: [{
                                    text: 'Seleccionar',
                                    onClick(e) {
                                        switch (CamposLlena) {
                                            case 'Solicita':
                                                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_SOLICITA').option('value', e.row.data.NOMBRE);
                                                self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_SOLICITA').option('value', e.row.data.EMPLEADO_CSC_EMPLEADO);
                                                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_EMAIL_SOLICITANTE').option('value', e.row.data.EMPLEADO_EMAILLABORAL);
                                                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_TELEFONO_SOLICITANTE').option('value', e.row.data.EMPLEADO_TELEFONO1);
                                                $('#Pop_Notificacion_Success').dxPopup("hide");
                                            break;
                                            case 'Atiende':
                                                self.Frm_Ticket_Servicio_Instance.getEditor('TIC_ATIENDE').option('value', e.row.data.NOMBRE);
                                                self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_ATIENDE').option('value', e.row.data.EMPLEADO_CSC_EMPLEADO);
                                                $('#Pop_Notificacion_Success').dxPopup("hide");
                                            break;
                                            case 'AsignaTicket':
                                                
                                            break;
                                            case 'AgregarParticipante':
                                                console.log(e.row.data);
                                            break;
                                        }
                                    },
                                }],
                            },
                        ]  
                    }),
                    $('<div class="Nice-Shadow-1" style="margin: auto; margin-bottom: 10px;"/>').attr("id", "btnAsgEmpleados").dxButton({
                        stylingMode: 'contained',
                        text: 'Agregar',
                        icon: 'add',
                        type: 'success',
                        width: 200,
                        visible: false,
                        onClick() {
                            let dataGridEmpleadoBusqueda = $("#DataGridEmpleadosBusqueda").dxDataGrid("instance");
                            let selectedDataGridEmpleadoBusqueda = dataGridEmpleadoBusqueda.getSelectedRowsData();
                            let itemsGridParticipantes = null;
                            let objetoInsertaEmpleado = {};
                            let FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                    
                            if (selectedDataGridEmpleadoBusqueda.length == 0) {
                                DevExpress.ui.notify({message: `Seleccione al menos a un usuario`,minWidth: 150,type: 'info',displayTime: 8000},{position: "bottom right",direction: "up-push"});
                                return;
                            }
                            if (self._DataGrid_Ticket_Participante.getDataSource() != null) {
                                itemsGridParticipantes = self._DataGrid_Ticket_Participante.getDataSource().items();
                                selectedDataGridEmpleadoBusqueda.forEach(function(item) {
                                    let idEmpleadoAtiende = self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_ATIENDE').option('value');
                                    let idEmpleadoSolicita = self.Frm_Ticket_Servicio_Instance.getEditor('EMPLEADO_CSC_SOLICITA').option('value');
                                    if (idEmpleadoAtiende == item.EMPLEADO_CSC_EMPLEADO || idEmpleadoSolicita == item.EMPLEADO_CSC_EMPLEADO) {
                                        self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `${item.NOMBRE}; ${Globalize.formatMessage("msjUserAtnSol")}`, 400, 130)
                                        return;
                                    } 
                                    let correoNotifica = null;
                                    if (item.EMPLEADO_EMAILLABORAL == null || item.EMPLEADO_EMAILLABORAL == "") {
                                        if (item.SOLICITUD_EMPLEADO_EMAIL_PERSONAL == null || item.SOLICITUD_EMPLEADO_EMAIL_PERSONAL == "") {
                                            self.notificaPantalla("Alerta", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `${item.NOMBRE}; ${Globalize.formatMessage("msjEmail")}`, 400, 130)
                                        } else {
                                            correoNotifica = item.SOLICITUD_EMPLEADO_EMAIL_PERSONAL
                                        }
                                    } else {
                                        correoNotifica = item.EMPLEADO_EMAILLABORAL
                                    }
                                    let validaExistencia = (itemsGridParticipantes == null) ? undefined : itemsGridParticipantes.find(obj => obj.EMPLEADO_CSC_EMPLEADO === item.EMPLEADO_CSC_EMPLEADO);
                                    if (validaExistencia == undefined) {
                                        if (correoNotifica == null) {
                                            
                                        } else {
                                            objetoInsertaEmpleado = {
                                                ...ReturnDefaultData_Init(),
                                                DATA_INSERT: {
                                                    "EMP_CSC_EMPRESA_HOST" : ReturnDefaultData_Init().EMP_CSC_EMPRESA_HOST,
                                                    "TIC_NEWID" : self.Frm_Ticket_Servicio_Instance.option('formData').TIC_NEWID,
                                                    "EMPLEADO_CSC_EMPLEADO" : item.EMPLEADO_CSC_EMPLEADO,
                                                    "TIPO_PARTICIPANTE_CSC" : 1,
                                                    "EMPLEADO_TELEFONO_NOTIFICA" : item.EMPLEADO_CELULAR,
                                                    "EMPLEADO_EMAIL_NOTIFICA" : correoNotifica,
                                                    "AUDITORIA_USU_ALTA" : obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                    "AUDITORIA_USU_ULT_MOD" : obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                                    "AUDITORIA_FEC_ALTA" : FechaActualSistema,
                                                    "AUDITORIA_FEC_ULT_MOD" : FechaActualSistema
                                                }
                                            }
                                            console.log(objetoInsertaEmpleado);
                                        }
                                        
                                    } else{
                                        self.notificaPantalla("Información", moment().tz(self.TimeZoneEmpleado).format(' DD/MM/YYYY HH:mm'), `${item.NOMBRE}; ${Globalize.formatMessage("msjUserListPart")}`, 400, 130)
                                    }
                                })
                            } 
                        },
                    }),
                )
            );
        };
        $("#Pop_Notificacion_Success").dxPopup("instance").option("height",'450');
        $("#Pop_Notificacion_Success").dxPopup("instance").option("width",'600');
        $("#Pop_Notificacion_Success").dxPopup('instance').option('contentTemplate', popupContentTemplate);
        $('#Pop_Notificacion_Success').dxPopup("show");
        loadPanel.show();
        self._Obj_Empleados_Grid.clear()
        let _BusquedaEmpleados ={};
        let _UrlApi = null;
        let _FnName = null;
        if (CamposLlena == 'AsignaTicket') {
            $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").columnOption("ACCIONES", "visible", false);
            $("#btnAsgEmpleados").dxButton("instance").option('visible',true);
            _BusquedaEmpleados = {
                ...ReturnDefaultData_Init(),
                ESTATUS_PROCESO_EMP_CSC: ReturnProcSubProcEstatus().ESTATUS_PROCESO_EMP_CSC,
                EMPLEADO_CSC_EMPLEADO_PADRE: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO
            };
            _UrlApi = 'ApiRecursosHumanos';
            _FnName = 'GetSupervisionEmpl';
        } else if(CamposLlena == 'Atiende'){
            _BusquedaEmpleados = {
                ...ReturnDefaultData_Init(),
                ...ReturnProcSubProcEstatus(),
                TPO_USUARIO: "EMP_ADMIN_MESA",
                CAM_MESA_CSC: self.Frm_Ticket_Servicio_Instance.getEditor('CAM_MESA_CSC').option('value')
            };
            _UrlApi = 'ApiTickets_v2';
            _FnName = 'Get_Mesa_Empleado';
        } else if(CamposLlena == 'Solicita'){
            _BusquedaEmpleados = {
                ...ReturnDefaultData_Init(),
                ...ReturnProcSubProcEstatus(),
                TIPO_CONSULTA: "AVANZADO",
                INFO: "ALLEMP"
            };
            _UrlApi = 'ApiRecursosHumanos';
            _FnName = 'GetEmpleado';
        } else if (CamposLlena == 'AgregarParticipante') {
            $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").columnOption("ACCIONES", "visible", false);
            $("#btnAsgEmpleados").dxButton("instance").option('visible',true);
            _BusquedaEmpleados = {
                ...ReturnDefaultData_Init(),
                ...ReturnProcSubProcEstatus(),
                TPO_USUARIO: "EMP_ADMIN_MESA",
                CAM_MESA_CSC: self.Frm_Ticket_Servicio_Instance.getEditor('CAM_MESA_CSC').option('value')
            };
            _UrlApi = 'ApiTickets_v2';
            _FnName = 'Get_Mesa_Empleado';
        }
        
        self.CargaEmpleadosBy(_BusquedaEmpleados,_UrlApi,_FnName);
    }

    self.CargaEmpleadosBy=(_Parametros,apiData,fnname)=>{
        __Reques_ajax(getJSON(DeveloperType)[apiData].url+fnname,'GET',_Parametros,getJSON(DeveloperType)[apiData].token).then((in_emp)=>{
            if (in_emp.success == true) {      
                var selectedRowsData = in_emp.JsonData;
                selectedRowsData.forEach(function(item) {
                    self._Obj_Empleados_Grid.insert(item);
                });
                $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").refresh();
                loadPanel.hide();
            } else{
                $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").refresh();
                loadPanel.hide();
            }
        }).catch(function(e){
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
            $("#DataGridEmpleadosBusqueda").dxDataGrid("instance").refresh();
            loadPanel.hide();
        });
    }
    //! Componente para busqueda de empleados

    self._InsertaEmpleadosTicket = ()=>{
        var selected__DataSet_Grid_Bitacoras = null;
        var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
        var Form_Data_Ticket_servicio = self.Frm_Ticket_Servicio_Instance.option('formData');
        if (self.Dg_Empleados_Ticket.getDataSource() != null) {
            selected__DataSet_Grid_Bitacoras = self.Dg_Empleados_Ticket.getDataSource().items();
            
            if (selected__DataSet_Grid_Bitacoras.length == 0) {
                return; 
            }
            var promises = selected__DataSet_Grid_Bitacoras.map( (fileKey) => {
                var _objInsertaEmTicket = {};
                _objInsertaEmTicket.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                _objInsertaEmTicket.EMPLEADO_CSC_EMPLEADO = fileKey.EMPLEADO_CSC_EMPLEADO;
                _objInsertaEmTicket.AUDITORIA_FEC_ALTA = FechaActualSistema;
                _objInsertaEmTicket.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                _objInsertaEmTicket.AUDITORIA_USU_ALTA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                _objInsertaEmTicket.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                _objInsertaEmTicket.TIC_NEWID = Form_Data_Ticket_servicio.TIC_NEWID;
                var objInsert = {
                    ...ReturnDefaultData_Init(),
                    DATA_INSERT: _objInsertaEmTicket
                };
                return self._EjecPromise(objInsert);
            });

            Promise.all(promises).then( (_Result) => {
                //console.log(_Result);
                DevExpress.ui.notify({message: `Empleados asignados correctamente`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            }).catch(function (err) {
                console.error('Ha ocurrido un error:', err);
            });
        }
    }

    self._EjecPromise = (Objeto) => {
        return new Promise((resolve, reject) => {
            try {
                __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Emp_Ticket','POST',JSON.stringify(Objeto),getJSON(DeveloperType).ApiGeneral.token).then((dataResponse)=>{
                if (dataResponse.success === true) {
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

    self.Get_Emp_Ticket=function(__AryDatos){
        self._Obj_Agrega_Emp_Ticket.clear();
        var jsonBusqueda = {
            ...ReturnDefaultData_Init(),
            TIC_NEWID: __AryDatos
        };
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Emp_Ticket','GET',jsonBusqueda,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {      
                var selectedRowsData = in_emp.JsonData;
                selectedRowsData.forEach(function(item) {
                    self._Obj_Agrega_Emp_Ticket.insert(item);
                });
                self.Dg_Empleados_Ticket.refresh();
            } else{
                self.Dg_Empleados_Ticket.refresh();
            }
        }).catch(function(e){
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
            self.Dg_Empleados_Ticket.refresh();
        });
    }

    self.Get_Datos_Empleado_Solicita = function(__DatosIdEmpleado){
        let __Oj_Dts_Busqueda = {
            ...ReturnDefaultData_Init(),
            TIPO_CONSULTA:'AVANZADO',
            EMPLEADO_CSC_EMPLEADO: __DatosIdEmpleado
        };

        return __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'GetEmpleado','GET',__Oj_Dts_Busqueda,getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
            if (in_emp.success == true) {
                let ConteoEmpleado = in_emp.JsonData.length;
                let CargaFrm = null;                      
                if (ConteoEmpleado >= 2) {
                  var __Reciente = jslinq(in_emp.JsonData).orderByDescending(function(el) {
                      return el.AUDITORIA_FEC_ALTA;
                  }).toList();
                  CargaFrm = __Reciente[0];
                } else {
                  CargaFrm = in_emp.JsonData[0];
                }

                let StringInfoForm = JSON.stringify(CargaFrm);
                self.DatosEmpleadosGet = JSON.parse(StringInfoForm);
                self.Frm_Ticket_Empleado_Solita_Instance.updateData(self.DatosEmpleadosGet);
                self.ObtenSelectBoxFrm(self.Frm_Ticket_Empleado_Solita_Instance);
            }
            else
            {
              self.DatosEmpleadosGet = null;
              self.Frm_Ticket_Empleado_Solita_Instance.updateData( {} );
              DevExpress.ui.notify({message: `No se localizo el empleado que realizo la solicitud`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
            }
        }).catch(function(e){
          console.log(e);
          DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
        });
    }

    self.notificaPantalla = function(Titulo = "Notificación",TituloDos = "Aviso", Mensaje = "", wP = 350, hP = 100){
        DevExpress.ui.notify({
            height: hP,
            width: wP,
            minWidth: 300,
            type: "default",
            displayTime: 15000,
            animation: {
              show: {
                type: 'fade', duration: 400, from: 0, to: 1,
              },
              hide: { type: 'fade', duration: 40, to: 0 },
            },
            closeOnClick: true,
            contentTemplate: (element) => {
                element.append(`
                    <div class="toast-dna">
                        <div class="toast-header-dna">
                            <img src="../../../images/asistente_virtual/AsisVritual_Info.svg" class="rounded me-2" alt="...">
                            <strong class="me-auto-dna">${Titulo}</strong>
                            <small class="text-muted-dna">${TituloDos}</small>
                            <img src="../../../images/Icons/CancelIcon.png" class="rounded2 me-2" alt="...">
                        </div>
                        <div class="toast-body-dna">${Mensaje}</div>
                    </div>`
                );
            },
          },
          {
            position: "bottom right",
            direction: "up-stack"
        });
    }
    self.convertirSegundosADHHMMSS= function(totalSegundos) {
        const horasPorDia = 10; // 10 horas hábiles en un día
        const segundosPorHora = 3600; // 60 minutos * 60 segundos
        const segundosPorDia = horasPorDia * segundosPorHora; // Total de segundos en un día
    
        // Calculamos los días
        const dias = Math.floor(totalSegundos / segundosPorDia);
        totalSegundos %= segundosPorDia; // Restamos los segundos utilizados para días
    
        // Calculamos las horas restantes
        const horas = Math.floor(totalSegundos / segundosPorHora);
        totalSegundos %= segundosPorHora; // Restamos los segundos utilizados para horas
    
        // Calculamos los minutos
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60; // Los segundos restantes
    
        return {
            dias,
            horas,
            minutos,
            segundos,
        };
    }

    self.Get_Inmuebles_Empleados= async function(){
        let jsonBusqueda = {
            ...ReturnDefaultData_Init(),
            USU_CSC_USUARIO: obj_SessionInfo.USU_CSC_USUARIO
        };
        try {
        let in_emp  = await  __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url + 'Get_Requisicion_Empleados_Inmuebles', 'GET', jsonBusqueda, getJSON(DeveloperType).ApiTickets_v2.token)
            if (in_emp.success == true) {
                let Datos = (Array.isArray(in_emp.JsonData) ? in_emp.JsonData : []);
                let idsConcatenados = Datos.map(item => item.REQ_CSCREQUISICION).join(',');
                self.REQ_CSCREQUISICION_IN = idsConcatenados;
            } else {
                self.REQ_CSCREQUISICION_IN = "";
            }
        } catch (e) {
            DevExpress.ui.notify('ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
            self.REQ_CSCREQUISICION_IN = "";
        }
        return self.REQ_CSCREQUISICION_IN;
    }

    self.Run = function(){
        const _ObjetoPreConsulta = [
            {Tbl:"SAMT_TIPO_REQ_USO"}, // 0
            {Tbl:"SAMT_TIPO_TICKET_PARTICIPANTE"}, // 1
            {Tbl:"SAMT_CAT_EMPLEADO_AREA"}, // 2
            {Tbl:"SAMT_CAT_EMPLEADO_DEPARTAMENTO"}, // 3
            {Tbl:"SAMT_CAM_MESA_DE_AYUDA"}, // 4
            {Tbl:"SAMT_ESTATUS_TICKET"}, // 5
            {Tbl:"SAMT_TIPO_PRIORIDAD_TICKET"}, // 6
            {Tbl:"SAMT_TIPO_TICKET"}, // 7
            {Tbl:"SAMT_CAM_TIPO_SERVICIO"}, // 8
            {Tbl:"SAMT_TIPO_SEVERIDAD"}, // 9
            {Tbl:"SAMT_CLIENTES"}, // 10
            {Tbl:"SAMT_PROYECTOS"}, // 11
            {Tbl:"SAMT_CAM_SERVICIO"}, // 12
            //{Tbl:"SAMT_REQUISICION_PROVEEDORES"}, // 13
            {Tbl:"SAMT_TIPO_CALIFICACION"}, // 13
            {Tbl:"SAMT_TIPO_PUESTO_EMPLEADO"}, // 14
            {Tbl:"SAMT_TIPO_RESPUESTA_AUTORIZA"}, // 15
            {Tbl:"SAMT_ESTATUS_ORDEN_TRABAJO"}, // 16
            {Tbl:"SAMT_CAM_TIPIFICACIONES"}, // 17
        ];

        let cookieTickets = sessionStorage.getItem("catsTickets");
        if (cookieTickets == '' || cookieTickets == null) {
            let promises = _ObjetoPreConsulta.map( (fileKey) => {return self.CargaCatalogosPromise(fileKey, "Get_Cat_Full");});
            Promise.all(promises).then( (_Result) => {
                self.CatalogosPantalla = _Result;
                self.armaCatalogosVista(_ObjetoPreConsulta)
            }).catch(function (err) {
                console.log('Ha ocurrido un error:', err);
            });
        } else {
            self.CatalogosPantalla = JSON.parse(cookieTickets);
            self.armaCatalogosVista(_ObjetoPreConsulta)
            
        }
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

    self.armaCatalogosVista = (_ObjetoPreConsulta) => {

        
        let _T_SAMT_TIPO_REQ_USO = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[0].Tbl)).toList();
        _T_SAMT_TIPO_REQ_USO.forEach(function(item) {self._CMB_SAMT_TIPO_REQ_USO_OBJDATA.insert(item);});

        let _T_SAMT_TIPO_TICKET_PARTICIPANTE = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[1].Tbl)).toList();
        _T_SAMT_TIPO_TICKET_PARTICIPANTE.forEach(function(item) {self._CMB_SAMT_TIPO_TICKET_PARTICIPANTE_OBJDATA.insert(item);});

        let _T_SAMT_CAT_EMPLEADO_AREA = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[2].Tbl)).toList();
        _T_SAMT_CAT_EMPLEADO_AREA.forEach(function(item) {self._CMB_SAMT_CAT_EMPLEADO_AREA_OBJDATA.insert(item);});

        let _T_SAMT_CAT_EMPLEADO_DEPARTAMENTO = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[3].Tbl)).toList();
        _T_SAMT_CAT_EMPLEADO_DEPARTAMENTO.forEach(function(item) {self._CMB_SAMT_CAT_EMPLEADO_DEPARTAMENTO_OBJDATA.insert(item);});

        let _T_SAMT_CAM_MESA_DE_AYUDA = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[4].Tbl)).toList();
        _T_SAMT_CAM_MESA_DE_AYUDA.forEach(function(item) {self._CMB_SAMT_CAM_MESA_DE_AYUDA_OBJDATA.insert(item);});

        let _T_SAMT_ESTATUS_TICKET = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[5].Tbl)).toList();
        _T_SAMT_ESTATUS_TICKET.forEach(function(item) {self._CMB_SAMT_ESTATUS_TICKET_OBJDATA.insert(item);});

        let _T_SAMT_TIPO_PRIORIDAD_TICKET = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[6].Tbl)).toList();
        _T_SAMT_TIPO_PRIORIDAD_TICKET.forEach(function(item) {self._CMB_SAMT_TIPO_PRIORIDAD_TICKET_OBJDATA.insert(item);});

        let _T_SAMT_TIPO_TICKET = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[7].Tbl)).toList();
        _T_SAMT_TIPO_TICKET.forEach(function(item) {self._CMB_SAMT_TIPO_TICKET_OBJDATA.insert(item);});

        let _T_SAMT_CAM_TIPO_SERVICIO = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[8].Tbl)).toList();
        _T_SAMT_CAM_TIPO_SERVICIO.forEach(function(item) {self._CMB_SAMT_CAM_TIPO_SERVICIO_OBJDATA.insert(item);});

        let _T_SAMT_TIPO_SEVERIDAD = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[9].Tbl)).toList();
        _T_SAMT_TIPO_SEVERIDAD.forEach(function(item) {self._CMB_SAMT_TIPO_SEVERIDAD_OBJDATA.insert(item);});

        let _T_SAMT_CLIENTES = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[10].Tbl)).toList();
        _T_SAMT_CLIENTES.forEach(function(item) {self._CMB_SAMT_CLIENTES_OBJDATA.insert(item);});

        let _T_SAMT_PROYECTOS = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[11].Tbl)).toList();
        _T_SAMT_PROYECTOS.forEach(function(item) {self._CMB_SAMT_PROYECTOS_OBJDATA.insert(item);});

        let _T_SAMT_CAM_SERVICIO = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[12].Tbl)).toList();
        _T_SAMT_CAM_SERVICIO.forEach(function(item) {self._CMB_SAMT_CAM_SERVICIO_OBJDATA.insert(item);});

        // let _T_SAMT_REQUISICIONES = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[13].Tbl)).toList();
        // _T_SAMT_REQUISICIONES.forEach(function(item) {self._CMB_SAMT_REQUISICIONES_OBJDATA.insert(item);});

        let _T_SAMT_TIPO_CALIFICACION = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[13].Tbl)).toList();
        _T_SAMT_TIPO_CALIFICACION.forEach(function(item) {self._CMB_SAMT_TIPO_CALIFICACION_OBJDATA.insert(item);});

        let _T_SAMT_TIPO_PUESTO_EMPLEADO = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[14].Tbl)).toList();
        _T_SAMT_TIPO_PUESTO_EMPLEADO.forEach(function(item) {self._CMB_SAMT_TIPO_PUESTO_EMPLEADO_OBJDATA.insert(item);});

        let _T_SAMT_TIPO_RESPUESTA_AUTORIZA = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[15].Tbl)).toList();
        _T_SAMT_TIPO_RESPUESTA_AUTORIZA.forEach(function(item) {self._CMB_SAMT_TIPO_RESPUESTA_AUTORIZA_OBJDATA.insert(item);});

        let _T_SAMT_ESTATUS_ORDEN_TRABAJO = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[16].Tbl)).toList();
        _T_SAMT_ESTATUS_ORDEN_TRABAJO.forEach(function(item) {self._CMB_SAMT_ESTATUS_ORDEN_TRABAJO_OBJDATA.insert(item);});

        let _T_SAMT_CAM_TIPIFICACIONES = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta[17].Tbl)).toList();
        _T_SAMT_CAM_TIPIFICACIONES.forEach(function(item) {self._CMB_SAMT_CAM_TIPIFICACIONES_OBJDATA.insert(item);});

        setTimeout(() => {
            try {
                sessionStorage.setItem("catsTickets", JSON.stringify(self.CatalogosPantalla));
            } catch (error) {
                console.log(error);
            }
            self.init();    
        }, 1000);
    }
    
    // setTimeout(() => {
    //     self.Run();
    //     /* FUNCIONES DE INICIALIZACION*/
    //     if (getUrlParam('TIPO') == 'EDITAR') {
    //         var __Oj_Dts_Busqueda = {
    //             ...ReturnDefaultData_Init(),
    //             TIC_NEWID: getUrlParam('TK_ID'),
    //             CAM_CSC_SERVICIO: parseInt(getUrlParam('CSC_MESA')),
    //         }
    //         self.Get_Tickets(__Oj_Dts_Busqueda,false,null);
    //         //self.Dg_Empleados_Ticket.option('toolbar.items[0].options.disabled', true);
    //     } else if (getUrlParam('TIPO') == 'ALTA') {
    //         self.ClickAlta();
    //         $('#__Frm_Ticket_Servicio').dxForm('instance').getEditor("CAM_MESA_CSC").option("value",getUrlParam('CSC_MESA'));
    //     } else if (getUrlParam('TIPO') == 'LECTURA') {
    //         var __Oj_Dts_Busqueda = {
    //             ...ReturnDefaultData_Init(),
    //             TIC_NEWID: getUrlParam('TK_ID'),
    //             CAM_CSC_SERVICIO: parseInt(getUrlParam('CSC_MESA')),
    //         }
    //         self.Get_Tickets(__Oj_Dts_Busqueda,false,null);
    //         $('#___Tb_Tickets').dxToolbar('instance').option('visible',false);
    //         //self.Dg_Empleados_Ticket.option('toolbar.items[0].options.disabled', true);
    //     }
    //     /* FUNCIONES DE INICIALIZACION*/
    //     $("#splashscreen").fadeOut(1000);
    // }, 500);
    
}
setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.Run();
}, 1000);