SalesDashboard.dashboardModel = function() {
    var self = this;
    var obj_DatosEmpleado;

    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");
   
    const syncTreeViewSelection = function (treeViewInstance, value) {
        if (!value) {
            treeViewInstance.unselectAll();
        } else {
            treeViewInstance.selectItem(value);
        }
    };

    var _asyncKey = 'ID';
    var _keyTpoRespAut = 'SAMT_TIPO_RESPUESTA_AUTORIZA_CSC';
    const makeAsyncDataSource = function (jsonFile) {
        return new DevExpress.data.CustomStore({
            loadMode: 'raw',
            key: _asyncKey,
            load() {
                return $.getJSON(`data/${jsonFile}`);
            },
        });
    };

    /** TODO: Formatos y fechas
     * self.TimeZoneServidor: Se utilizara para los INSERT y UPDATE de la BD
     * self.TimeZoneEmpleado: Se utiliza para saber la fecha y hora de la plataforma del empleado
     * self.TiempoUTCEmpleado: Segun el tipo de dato se sumara o restara esas horas a las 
     *                         fechas se trae en los campos de fecha de la BD
    */
    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();

    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es-mx";}
        /** SIEMPRE AGREGAR ESTA LINEA */
        self.patname = window.location.pathname;
        console.log(getUrlParam('toktik'),);

        self.__cmp_DG_Autorizaciones = $("#DG_Autorizaciones").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            keyExpr: "SAMT_TICKET_AUTORIZACIONES_CSC",
            remoteOperations: false,
            height: "100%",
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
                caption: "ID",
                dataField: "SAMT_TICKET_AUTORIZACIONES_CSC",
                
            },{
                caption: "ESTATUS",
                dataField: "SAMT_TIPO_RESPUESTA_AUTORIZA_CSC",
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
                dataField: "NOMBRE"
            },{
                caption: "EMPLEADO ALTA",
                dataField: "NOMBRE_SOLICITANTE"
            },{
                caption: "FECHA ALTA",
                dataField: "AUDITORIA_FEC_ALTA",
                alignment: "center",
                dataType : "date",
                calculateCellValue: function(data) {
                    return moment(data.AUDITORIA_FEC_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                }
            },{
                caption: "COMENTARIOS",
                dataField: "AUTORIZADO_COMENTARIOS",
                
            }],
            onRowDblClick: function (e) {
                self.Frm__Editar_Autorizacion_Resp_Instance.resetValues();
                var StringInfoForm = JSON.stringify(e.data);
                self.__DataAutorizacionLoad = JSON.parse(StringInfoForm);
                Abrir_Ticket_Autorizar('LECTURA',e.data.CAM_MESA_CSC,e.data.AUTORIZACIONES_TIC_NEWID);
                self.Frm__Editar_Autorizacion_Resp_Instance.updateData(self.__DataAutorizacionLoad);

                if (self.__DataAutorizacionLoad.AUTORIZADO_ACTIVO == false) {
                    self.Frm__Editar_Autorizacion_Resp_Instance.option('readOnly',true);
                    $btn_Actualizar_Respuesta_Autoriza.option('visible',false);
                } else {
                    $btn_Actualizar_Respuesta_Autoriza.option('visible',true);
                    self.Frm__Editar_Autorizacion_Resp_Instance.option('readOnly',false);
                }
            }
        }).dxDataGrid("instance");

        self.__cmp_DG_Autorizaciones_Finalizadas = $("#DG_Autorizaciones_Finalizadas").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            keyExpr: "SAMT_TICKET_AUTORIZACIONES_CSC",
            remoteOperations: false,
            height: "100%",
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
                caption: "ID",
                dataField: "SAMT_TICKET_AUTORIZACIONES_CSC",
                
            },{
                caption: "ESTATUS",
                dataField: "SAMT_TIPO_RESPUESTA_AUTORIZA_CSC",
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
            },{
                caption: "EMPLEADO ALTA",
                dataField: "NOMBRE_SOLICITANTE",
            },{
                caption: "FECHA ALTA",
                dataField: "AUDITORIA_FEC_ALTA",
                alignment: "center",
                dataType : "date",
                calculateCellValue: function(data) {
                    return moment(data.AUDITORIA_FEC_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                } 
            },{
                caption: "COMENTARIOS",
                dataField: "AUTORIZADO_COMENTARIOS",
                
            },{
                caption: "FECHA MODIFICACION",
                dataField: "AUDITORIA_FEC_ULT_MOD",
                alignment: "center",
                dataType : "date",
                calculateCellValue: function(data) {
                    return moment(data.AUDITORIA_FEC_ULT_MOD).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                }
            }],
            onRowDblClick: function (e) {
                self.Frm__Editar_Autorizacion_Resp_Instance.resetValues();
                var StringInfoForm = JSON.stringify(e.data);
                self.__DataAutorizacionLoad = JSON.parse(StringInfoForm);
                Abrir_Ticket_Autorizar('LECTURA',e.data.CAM_MESA_CSC,e.data.AUTORIZACIONES_TIC_NEWID);
                self.Frm__Editar_Autorizacion_Resp_Instance.updateData(self.__DataAutorizacionLoad);
        
                if (self.__DataAutorizacionLoad.AUTORIZADO_ACTIVO == false) {
                    self.Frm__Editar_Autorizacion_Resp_Instance.option('readOnly',true);
                    $btn_Actualizar_Respuesta_Autoriza.option('visible',false);
                } else {
                    $btn_Actualizar_Respuesta_Autoriza.option('visible',true);
                    self.Frm__Editar_Autorizacion_Resp_Instance.option('readOnly',false);
                }
        
                
        
            }
        }).dxDataGrid("instance");


        setTimeout(() => {
            
            self.Get_Autorizaciones_Ticket({
                EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                AUTORIZADO_ACTIVO: 1
            },'__cmp_DG_Autorizaciones'); 
            
            var d = new Date();
            var CalculaFecha = dateResta(d, 'month', 6);
            self.Get_Autorizaciones_Ticket({
                EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                AUTORIZADO_ACTIVO: 0,
                AUT_FECHA_INICIAL: ConvertToDateSting(ConvertDatetimeToStringBD(CalculaFecha),'yyyymmmddd'),
                AUT_FECHA_FINAL: ConvertToDateSting(ConvertDatetimeToStringBD(d),'yyyymmmddd')
            },'__cmp_DG_Autorizaciones_Finalizadas');

        }, 2000);
        
    }
    self.Frm_Actualizar_Datos_Instance = $("#Form_Actualizar_Datos").dxForm({
        readOnly: false,
        showColonAfterLabel: true,
        showValidationSummary: false,
        validationGroup: '__Validate_Form_Actualizar_Datos',
        labelMode: 'static',
        labelLocation: 'top',
        colCount:4,
        screenByWidth(width) {
            return (width < 700) ? 'sm' : 'lg';
          },
        items: [{
            colSpan:4,
            itemType: "button",
            location: 'before',
            locateInMenu: 'auto',
            buttonOptions: {
                text: "Actualizar",
                icon: 'refresh',
                type: "default",
                width: '50%', 
                visible:true,
                onInitialized: function(e) {  
                    $btn_Actualziar_Busqueda = e.component;
                },
                onClick() {
                    self.Get_Autorizaciones_Ticket({
                        EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                        AUTORIZADO_ACTIVO: 1
                    },'__cmp_DG_Autorizaciones'); 
                    
                    var d = new Date();
                    var CalculaFecha = dateResta(d, 'month', 6);
                    self.Get_Autorizaciones_Ticket({
                        EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                        AUTORIZADO_ACTIVO: 0,
                        AUT_FECHA_INICIAL: ConvertToDateSting(ConvertDatetimeToStringBD(CalculaFecha),'yyyymmmddd'),
                        AUT_FECHA_FINAL: ConvertToDateSting(ConvertDatetimeToStringBD(d),'yyyymmmddd')
                    },'__cmp_DG_Autorizaciones_Finalizadas');
                }
            }
        }]
    }).dxForm("instance");

    self.Frm__Editar_Autorizacion_Resp_Instance = $("#Form_Editar_Autorizacion_Resp").dxForm({
        readOnly: false,
        showColonAfterLabel: true,
        showValidationSummary: false,
        validationGroup: '__Validate_Form_Editar_Autorizacion_Resp',
        labelMode: 'static',
        labelLocation: 'top',
        colCount:4,
        screenByWidth(width) {
            return (width < 700) ? 'sm' : 'lg';
          },
        items: [
            {
                colSpan:2,
                dataField: "AUTORIZACIONES_NEWID",
                cssClass:"hidden_box",
                label: {
                    text: "UUID"
                },
                editorOptions: {
                    readOnly:true,
                    disabled: false
                }	
            },
            {
                colSpan:2,
                dataField: "AUTORIZACIONES_TIC_NEWID",
                cssClass:"hidden_box",
                label: {
                    text: "UUID ticket"
                },
                editorOptions: {
                    readOnly:true,
                    disabled: false
                }	
            },
            {
            colSpan:4,
            dataField: "SAMT_TIPO_RESPUESTA_AUTORIZA_CSC",
            editorType: "dxSelectBox",
            label: {
                text: "Estatus"
            },
            editorOptions: {
                searchEnabled:true,
                displayExpr: "TIPO_RESPUESTA_AUTORIZA_IDIOMA1",
                valueExpr: "SAMT_TIPO_RESPUESTA_AUTORIZA_CSC",
                dataSource: new DevExpress.data.DataSource({
                    store: new DevExpress.data.CustomStore({
                        key: _keyTpoRespAut,
                        loadMode: "raw", paginate: false,   
                        load: async function () {
                            var _ary = {Tbl:"SAMT_TIPO_RESPUESTA_AUTORIZA",NACTIVE:"TIPO_RESPUESTA_AUTORIZA_ACTIVO"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                if (all_data.success == true){
                                    return all_data.JsonData
                                }
                                else {
                                    console.log(all_data.message);
                                }
                            });
                        }
                    })
                }),
                onValueChanged: function (e) {
                    var newValue = e.value;
                    var item = e.component.option('selectedItem');  
                    if (item == null) {
                        
                    } else {
                        if (
                            item.TIPO_RESPUESTA_AUTORIZA_CLAVE == 'AUTO' 
                            || item.TIPO_RESPUESTA_AUTORIZA_CLAVE == 'NOAUT'
                        ) {
                            self.Frm__Editar_Autorizacion_Resp_Instance.itemOption("AUTORIZADO_COMENTARIOS", {isRequired: true});
                        } else if (
                            item.TIPO_RESPUESTA_AUTORIZA_CLAVE == 'NOAP' 
                            || item.TIPO_RESPUESTA_AUTORIZA_CLAVE == 'PEND' 
                        ) {
                            self.Frm__Editar_Autorizacion_Resp_Instance.itemOption("AUTORIZADO_COMENTARIOS", {isRequired: false});
                        }
                    }
                }
            },
            validationRules: [{
                type: "required",
                message: "requerido"
            }]
        },{
            dataField: 'AUTORIZADO_COMENTARIOS',
            editorType: "dxTextArea",
            colSpan:4,
            label: { 
                text: "Comentarios"
            },
            editorOptions: {
                height:40,
                valueChangeEvent: "keyup",
                onValueChanged: function (e) {
                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                }
            }
        },{
            colSpan:4,
            itemType: "button",
            location: 'before',
            locateInMenu: 'auto',
            buttonOptions: {
                text: "Actualizar",
                icon: 'refresh',
                type: "default",
                width: '50%', 
                visible:true,
                onInitialized: function(e) {  
                    $btn_Actualizar_Respuesta_Autoriza = e.component;
                },
                onClick() {
                    loadPanel.show();
                    if (self.Frm__Editar_Autorizacion_Resp_Instance.validate().isValid === true) {
                        var __Obj_Data_Update_Autorizacion = GetUpdateData(self.__DataAutorizacionLoad,self.Frm__Editar_Autorizacion_Resp_Instance.option('formData'));
                        var __ValidaCambios = Object.keys(__Obj_Data_Update_Autorizacion).length === 0;
                        if (__ValidaCambios == true) {
                            loadPanel.hide();
                        } else {
                            var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            var __cmb_component_Estatus = self.Frm__Editar_Autorizacion_Resp_Instance.getEditor('SAMT_TIPO_RESPUESTA_AUTORIZA_CSC');
                            var __ValidaEnvio = __cmb_component_Estatus.option('selectedItem');
                            __Obj_Data_Update_Autorizacion.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            __Obj_Data_Update_Autorizacion.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                            __Obj_Data_Update_Autorizacion.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                            __Obj_Data_Update_Autorizacion.AUTORIZADO_VIA_WEB = 1;
                            if (__ValidaEnvio.TIPO_RESPUESTA_AUTORIZA_CLAVE == "PEND") {
                                __Obj_Data_Update_Autorizacion.AUTORIZADO_ACTIVO = 1;
                            } else {
                                __Obj_Data_Update_Autorizacion.AUTORIZADO_ACTIVO = 0;
                            }
                            var __Obj_Update = {
                                EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type: localStorage.getItem('Type'),
                                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                DATA_UPDATE: __Obj_Data_Update_Autorizacion,
                                DATA_WHERE:{
                                    "AUTORIZACIONES_NEWID":self.__DataAutorizacionLoad.AUTORIZACIONES_NEWID,
                                    "AUTORIZACIONES_TIC_NEWID":self.__DataAutorizacionLoad.AUTORIZACIONES_TIC_NEWID,
                                    "EMP_CSC_EMPRESA_HOST":localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                }
                            };
                            console.log(__Obj_Update);
                            
                            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Update_Autoriza_Ticket','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
                                if (in_emp.success == true) {
                                    DevExpress.ui.notify( 'Autorización actualizada correctamente', 'success', 4000);
                                    loadPanel.hide();
                                    self.Get_Autorizaciones_Ticket({
                                        EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                        AUTORIZADO_ACTIVO: 1
                                    },'__cmp_DG_Autorizaciones'); 
                                    
                                    var d = new Date();
                                    var CalculaFecha = dateResta(d, 'month', 6);
                                    self.Get_Autorizaciones_Ticket({
                                        EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                        AUTORIZADO_ACTIVO: 0,
                                        AUT_FECHA_INICIAL: ConvertToDateSting(ConvertDatetimeToStringBD(CalculaFecha),'yyyymmmddd'),
                                        AUT_FECHA_FINAL: ConvertToDateSting(ConvertDatetimeToStringBD(d),'yyyymmmddd')
                                    },'__cmp_DG_Autorizaciones_Finalizadas');
                                }
                                else {
                                    DevExpress.ui.notify('Error al actualizar autorización intentelo nuevamente','error',10000);
                                    loadPanel.hide();
                                }
                                return in_emp;
                            })
                            .catch(function(err){
                                console.log(err);
                                loadPanel.hide();
                                DevExpress.ui.notify('Error al actualizar autorización intentelo nuevamente','error',10000);
                            });

                        }
                    } else{
                        loadPanel.hide();
                    }

                }
            }
        }]
    }).dxForm("instance");



    self.Get_Autorizaciones_Ticket=function(__AryDatos,__Grid){
        self.Frm__Editar_Autorizacion_Resp_Instance.resetValues();
        document.getElementById("Mod_Embebed_Ticket_Autoriza").src = "";
        loadPanel.show();
        var jsonBusqueda = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
        };
        var UnionObj = Object.assign(jsonBusqueda,__AryDatos);
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Autoriza_Ticket','GET',UnionObj,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                self[__Grid].option("dataSource", in_emp.JsonData);
                loadPanel.hide();
            } else{
                self[__Grid].option("dataSource", []);
                loadPanel.hide();
            }
        }).catch(function(e){
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
            self[__Grid].option("dataSource", []);
            loadPanel.hide()
        });
    }

    function Abrir_Ticket_Autorizar(TIPO,CSC_MESA,TICKET_NEW_ID) {
        loadPanel.show();
        var jsonServEmpl = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
            CAM_MESA_CSC: CSC_MESA
        };
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ensamble_Mesa_Ayuda','GET',jsonServEmpl,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                var DataMesa = in_emp.JsonData[0];
                if (DataMesa.CAM_MESA_IFRAMEWEB == null) {
                    DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 3000);
                    return
                } else {
                    setTimeout(() => {
                        var extraVars = "TIPO="+TIPO
                        +"&CSC_MESA="+CSC_MESA
                        +"&TK_ID="+TICKET_NEW_ID;
                        var UrlPop = "/"+self.patname.split('/')[1]+"/views/Vistas_Mesas_Ayuda/"+DataMesa.CAM_MESA_IFRAMEWEB+"/"+DataMesa.CAM_MESA_IFRAMEWEB+".html?"+extraVars;
                        document.getElementById("Mod_Embebed_Ticket_Autoriza").src = UrlPop; 
                        loadPanel.hide();
                    }, 3000);
                    
                }
            }
            else{
                DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 3000); 
            }
        }).catch(function(e){
            DevExpress.ui.notify("Error mesa de ayuda no localizada intente nuevamnete", "error", 3000); 
        });
    }

}


 

setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);