SalesDashboard.dashboardModel = function() {
    let self = this;
    let obj_DatosEmpleado = null;
    this.Nombre,this.Apellido,this.Estatus = null;
    let ServiciosActivosTickets = Array();
    let textJoinSend = null;
    self.MisServiciosActivosTickets = Array();
    self.FechaPromesaDefecto = 86400;
    self.__Temp_Ult_Consulta = {};
    let loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");
    self.TipoUsuario = "ADMIN";
    /** TODO: Formatos y fechas
     * self.TimeZoneServidor: Se utilizara para los INSERT y UPDATE de la BD
     * self.TimeZoneEmpleado: Se utiliza para saber la fecha y hora de la plataforma del empleado
     * self.TiempoUTCEmpleado: Segun el tipo de dato se sumara o restara esas horas a las 
     *                         fechas se trae en los campos de fecha de la BD
    */
    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();
    self.__DataSource_Tickets_Grid_Admin = new DevExpress.data.ArrayStore({data: []});
    self.__DataSource_Tipificaiones = new DevExpress.data.ArrayStore({data: []});
    self._ClienteProyectoCampania_ObjData = new DevExpress.data.ArrayStore({data: []});
    self.idServiciosUsuario = {}
    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);let locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {let locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */

        /** LABELS  PANTALLA*/
        $('#adm_title_ms').html(Globalize.formatMessage("adm_title_ms"));
        $('#adm_title_grid').html(Globalize.formatMessage("adm_title_grid"));
        /** LABELS  PANTALLA*/
        self.patname = window.location.pathname;
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        $("#Mod_Tab_Reporte_Sura").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            dataSource: [
                { title: "Grid General", template: "tab_gridGeneral", icon: "./images/Icons/Todos.png" }
            ],
            
        }); 

        $("#treeTicketAdmin").dxTreeView({
            dataSource: [],
            height: '100%',
            showScrollbar: 'always',
            dataStructure: "plain",
            selectionMode: "single",
            activeStateEnabled: false,
            hoverStateEnabled: false,
            focusStateEnabled:false,
            selectByClick: false,
            searchEnabled: false,
            expandEvent: "click",
            keyExpr: "ID",
            displayExpr: "DESCRIPCION",
            parentIdExpr: "Task_Parent_ID",
            autoExpandAll: false,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                let icon = document.createElement("span");
                icon.className = "menu_item "+itemData.ICON;
                itemElement.append(icon);

                let text = document.createElement("span");
                text.className = "item-text";
                text.innerText = itemData.DESCRIPCION;
                itemElement.append(text);
            },
            onItemClick:function(itemSelect){
                self.__Temp_Ult_Consulta = {};
                let itemData = itemSelect.itemData;
                textJoinSend = self.MisServiciosActivosTickets.join(",");
                if (itemData.CAM_MESA_CSC == 0) {
                    switch (itemData.CLAVE_ITEM) {
                        /** Mis tickets asignados */
                        case "MTA_TODO":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_ATIENDE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;
                        case "MTA_NO_TK":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_ATIENDE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            $("#Dialog_Busqueda_No_Ticket").dxPopup("show");
                        break;
                        case "MTA_ABIERTAS":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_ATIENDE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 0;
                            self.ConsultaTickets(self.__Temp_Ult_Consulta);	
                        break;
                        case "MTA_CERRADAS":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_ATIENDE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 1;
                            self.__Temp_Ult_Consulta.BYFC = true;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;

                        /** Mis tickets creados */
                        case "MTC_TODO":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_SOLICITA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;
                        case "MTC_NO_TK":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_SOLICITA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            $("#Dialog_Busqueda_No_Ticket").dxPopup("show");
                        break;
                        case "MTC_ABIERTAS":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_SOLICITA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 0;
                            self.ConsultaTickets(self.__Temp_Ult_Consulta);	
                        break;
                        case "MTC_CERRADAS":
                            self.__Temp_Ult_Consulta.EMPLEADO_CSC_SOLICITA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 1;
                            self.__Temp_Ult_Consulta.BYFC = true;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;

                        /** Tickets Todas las mesas de ayuda asignadas */
                        case "MSA_ABIERTAS":
                            if (textJoinSend == "" || textJoinSend == null) {
                                DevExpress.ui.notify("No tiene niguna mesa de ayuda administrable", "info", 3000);
                                return;    
                            } 
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 0;
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = textJoinSend;
                            self.ConsultaTickets(self.__Temp_Ult_Consulta);
                        break;

                        case "MSA_CERRADAS":
                            if (textJoinSend == "" || textJoinSend == null) {
                                DevExpress.ui.notify("No tiene niguna mesa de ayuda administrable", "info", 3000);
                                return;    
                            } 
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 1;
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = textJoinSend;
                            self.__Temp_Ult_Consulta.BYFC = true;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;

                        case "MSA_TODO":
                            if (textJoinSend == "" || textJoinSend == null) {
                                DevExpress.ui.notify("No tiene niguna mesa de ayuda administrable", "info", 3000);
                                return;    
                            } 
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = textJoinSend;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;

                        case "MSA_NO_TK":
                            if (textJoinSend == "" || textJoinSend == null) {
                                DevExpress.ui.notify("No tiene niguna mesa de ayuda administrable", "info", 3000);
                                return;    
                            } 
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = textJoinSend;
                            $("#Dialog_Busqueda_No_Ticket").dxPopup("show");
                        break;

                    }
                } 
                else if (itemData.CAM_MESA_CSC != 0) {
                    self.__Temp_Ult_Consulta = {};
                    let itemData = itemSelect.itemData;
                    switch (itemData.CLAVE_ITEM) {
                        case "ALTATICKET":
                            if (itemData.IFRAMEWEB == null) {
                                DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 3000);
                                return
                            } else {
                                self.__Temp_Ult_Consulta.TIC_CERRADO = 0;
                                self.__Temp_Ult_Consulta.CAM_MESA_CSC = itemData.CAM_MESA_CSC;
                                AbrirPopMesaAyuda('ALTA', itemData.CAM_MESA_CSC, null);
                            }
                        break;
                        case "TODAS":
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC = itemData.CAM_MESA_CSC;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;
                        case "ABIERTAS":
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 0;
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC = itemData.CAM_MESA_CSC;
                            self.ConsultaTickets(self.__Temp_Ult_Consulta);
                        break;
                        case "CERRADAS":
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 1;
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC = itemData.CAM_MESA_CSC;
                            self.__Temp_Ult_Consulta.BYFC = true;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;

                        case "ESTATUS":
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC = itemData.CAM_MESA_CSC;
                            self.__Temp_Ult_Consulta.ESTATUS_CSC = itemData.ESTATUS_CSC;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;
                        case "ITEMSEVERIDAD":
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC = itemData.CAM_MESA_CSC;
                            self.__Temp_Ult_Consulta.SEVERIDAD_CSC = itemData.SEVERIDAD_CSC;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;
                        case "ITEMPRIORIDAD":
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC = itemData.CAM_MESA_CSC;
                            self.__Temp_Ult_Consulta.PRIORIDAD_CSC = itemData.PRIORIDAD_CSC;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;
                    }
                } else {
                    
                }     
                
            }
            
        });

        $("#Pop_Mesa_Ayuda_Config").dxPopup({
            hideOnOutsideClick:false,
            title: "Detalles",
            height: '90%',  
            width: '70%',
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onHiding: function (e) {
                e.component.content().empty();
                self.ConsultaTickets(self.__Temp_Ult_Consulta);
            },
            onShowing: function(e) {
                
            },
            onShown: function (e) {
            }
        });
        self.DataGridTicketsAdmin = $("#Data_Grid_Ticket_Admin").dxDataGrid({
            dataSource: self.__DataSource_Tickets_Grid_Admin,
            deferRendering:true,
            allowColumnResizing: true,
            height: "100%",
            filterRow: { visible: false },
            filterPanel: { visible: true },
            headerFilter: { visible: true },
            keyExpr: "TIC_CSCTICKET",
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
            groupPanel: { visible: true },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: true,
            showRowLines: false,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: true,
            export: {
                enabled: true,
            },onExporting: function(e) { 
                let workbook = new ExcelJS.Workbook(); 
                let worksheet = workbook.addWorksheet('Hoja1'); 
                DevExpress.excelExporter.exportDataGrid({ 
                    worksheet: worksheet, 
                    component: e.component,
                    customizeCell: function(options) {
                        let excelCell = options;
                        excelCell.font = { name: 'Arial', size: 12 };
                        excelCell.alignment = { horizontal: 'left' };
                    } 
                }).then(function() {
                    workbook.xlsx.writeBuffer().then(function(buffer) { 
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Tickets_'+moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')+'.xlsx'); 
                    }); 
                }); 
                e.cancel = true; 
            },
            columns: [
                {
                    caption: "TICKET",
                    dataField: "TIC_CSCTICKET",
                    fixed:true,
                    fixedPosition:"left",
                    alignment: "center",
                    sortOrder: 'desc',
                    width: 130,
                },
                {
                    caption: "FOLIO PROVEEDOR",
                    dataField: "TIC_ID_EXTERNO_PROVEEDOR",
                    fixed:true,
                    fixedPosition:"left",
                    alignment: "center",
                    width: 180,
                },
                {
                    caption: "INICIATIVA",
                    dataField: "PM_CSC_PROYECTO_SOLICITA",
                    alignment: "left",
                    width: 230,
                    lookup: {
                        displayExpr: "PM_NOMBRE",
                        valueExpr: "PM_CSC_PROYECTO",
                        dataSource: {
                            store: new DevExpress.data.CustomStore({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        let allServicios = {Tbl:"SAMT_PROYECTOS"};
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
                },
                {
                    caption: "FECHA ALTA",
                    dataField: "fecha_alta_timezone",
                    alignment: "center",
                    dataType : "datetime",
                    format : "dd/MM/yyyy HH:mm:ss",
                    width: 130,
                },
                {
                    caption: "COMENTARIOS DE SOLICITUD",
                    dataField: "TIC_DESCRIPCION",
                    alignment: "left",
                    width: 380,
                },
            ],
       
            summary: {
                totalItems: [{
                        name: "Total",
                        showInColumn: "TIC_CSCTICKET",
                        displayFormat: "Total: {0}",
                        summaryType: "count"
                    }
                ]
            },
            onRowDblClick: function (e) {
                //setTimeout(() => {
                    AbrirPopMesaAyuda('EDITAR',e.data.CAM_MESA_CSC,e.data.TIC_NEWID) 
                //}, 1000);
            }
             
        }).dxDataGrid('instance');

        $("#Dialog_Busqueda_Fecha").dxPopup({
            hideOnOutsideClick:false,
            title: "PARAMETROS",
            height: function() {  
                return 160  
            },  
            width: function() {  
                return 400
            },  
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onShowing: function (e) {

            },
            contentTemplate: function (e) {
                e.attr({"style": "display: flex; flex-direction: column;"});
                
                e.append(
                    $("<div/>").append(
                        'Selecciona un rango de fechas.'
                    ).attr({"style": "font-size: 12px; margin-bottom: 5px; "}),
                    $("<div/>").append(
                        '**Se recomienda realizar busquedas en bloques no mayores a 3 meses.'
                    ).attr({"style": "font-size: 10px; margin-bottom: 5px; color:red;"}),
                    $("<div />").attr({"id": "Form_Busqueda_Fecha","style": "border: solid red 0px; margin-bottom: 5px; "}).dxForm({
                        readOnly: false,
                        showColonAfterLabel: true,
                        showValidationSummary: false,
                        validationGroup: 'Form_Busqueda_Fecha_Validation',
                        labelMode: 'static',
                        labelLocation: 'top',
                        items: [{
                            itemType: "group",
                            colCount: 2,
                            items:[{
                                dataField: "TIC_FECHA_INICIAL", 
                                label: { 
                                    text: "Fecha Inicial"
                                },
                                editorType: "dxDateBox",
                                editorOptions: {
                                    type: "date",
                                    disabled: false,
                                    dateSerializationFormat: "yyyy-MM-dd",
                                    displayFormat: "dd/MM/yyyy",
                                    max: new Date(),
                                },
                                validationRules: [{type: 'required',message: 'Fecha requerida'}]
                            },{
                                dataField: "TIC_FECHA_FINAL",
                                label: { 
                                    text: "Fecha Final"
                                },
                                editorType: "dxDateBox",
                                editorOptions: {
                                    type: "date",
                                    disabled: false,
                                    dateSerializationFormat: "yyyy-MM-dd",
                                    displayFormat: "dd/MM/yyyy",
                                    max: new Date(),
                                },
                                validationRules: [{type: 'required',message: 'Fecha requerida'}]
                            },{
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Cancelar",
                                    icon: 'remove',
                                    type: "danger",
                                    width: '100%', 
                                    visible:true,
                                    onInitialized: function(e) {  
                                        
                                    },
                                    onClick() {
                                        $("#Form_Busqueda_Fecha").dxForm('instance').resetValues();
                                        $("#Form_Busqueda_Fecha").dxForm('instance').option('formData', {});
                                        $("#Dialog_Busqueda_Fecha").dxPopup("hide");
                                    }
                                }
                            },{
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Buscar",
                                    icon: 'search',
                                    type: "default",
                                    width: '100%', 
                                    visible:true,
                                    onInitialized: function(e) {  
                                        
                                    },
                                    onClick() {
                                        let FormBusqueda = $("#Form_Busqueda_Fecha").dxForm('instance');
                                        if(FormBusqueda.validate().isValid){
                                            let DataForm = FormBusqueda.option('formData');
                                            self.__Temp_Ult_Consulta.TIC_FECHA_INICIAL = DataForm.TIC_FECHA_INICIAL + " 00:00:00";
                                            self.__Temp_Ult_Consulta.TIC_FECHA_FINAL = DataForm.TIC_FECHA_FINAL + " 23:59:59";
                                            //self.__Temp_Ult_Consulta.UTC = self.TiempoUTCEmpleado;
                                            self.ConsultaTickets(self.__Temp_Ult_Consulta);
                                            $("#Dialog_Busqueda_Fecha").dxPopup("hide");
                                        }
                                        else{
                                            DevExpress.ui.notify("LLENE LOS CAMPOS EN ROJO", "error", 300); 
                                        }
                                    }
                                }
                            }]
                        }]
                    })
                );

            }
        });


        $("#Dialog_Busqueda_No_Ticket").dxPopup({
            hideOnOutsideClick:false,
            title: "BUSQUEDA DE TICKET",
            height: function() {  
                return 120  
            },  
            width: function() {  
                return 400
            },  
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onShowing: function (e) {

            },
            contentTemplate: function (e) {
                e.attr({"style": "display: flex; flex-direction: column;"});

                e.append(
                    $("<div />").attr({"id": "Form_Busqueda_No_Ticket","style": "border: solid red 0px; margin-bottom: 5px; "}).dxForm({
                        readOnly: false,
                        showColonAfterLabel: true,
                        showValidationSummary: false,
                        validationGroup: 'Form_Busqueda_No_Ticket_Validation',
                        labelMode: 'static',
                        labelLocation: 'top',
                        items: [{
                            itemType: "group",
                            colCount: 2,
                            items:[{
                                colSpan:2,
                                editorType: "dxNumberBox",
                                dataField: "TIC_CSCTICKET", 
                                label: { 
                                    text: "No. Ticket"
                                },
                                editorOptions: {
                                    disabled: false
                                },
                                validationRules: [{type: 'required',message: 'Fecha requerida'}]
                            },{
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Cancelar",
                                    icon: 'remove',
                                    type: "danger",
                                    width: '100%', 
                                    visible:true,
                                    onInitialized: function(e) {  
                                        
                                    },
                                    onClick() {
                                        $("#Form_Busqueda_No_Ticket").dxForm('instance').resetValues();
                                        $("#Form_Busqueda_No_Ticket").dxForm('instance').option('formData', {});
                                        $("#Dialog_Busqueda_No_Ticket").dxPopup("hide");
                                    }
                                }
                            },{
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Buscar",
                                    icon: 'search',
                                    type: "default",
                                    width: '100%', 
                                    visible:true,
                                    onInitialized: function(e) {  
                                        
                                    },
                                    onClick() {
                                        let FormBusqueda = $("#Form_Busqueda_No_Ticket").dxForm('instance');
                                        if(FormBusqueda.validate().isValid){
                                            let DataForm = FormBusqueda.option('formData');
                                            self.__Temp_Ult_Consulta.TIC_CSCTICKET = DataForm.TIC_CSCTICKET;
                                            self.ConsultaTickets(self.__Temp_Ult_Consulta);
                                            $("#Dialog_Busqueda_No_Ticket").dxPopup("hide");
                                        }
                                        else{
                                            DevExpress.ui.notify("LLENE LOS CAMPOS EN ROJO", "error", 300); 
                                        }
                                    }
                                }
                            }]
                        }]
                    })
                );

            }
        });

        
        let _Ary_Search_Servicios= {Tbl:"SAMT_CAM_SERVICIO",WHR: " EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+" "};
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_Ary_Search_Servicios,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
            if (all_data.success == true){
                let servicios =  all_data.JsonData;
                for(let r = 0; r < servicios.length; r++){
                    ServiciosActivosTickets.push(servicios[r].CAM_MESA_CSC)
                }
            }
        });
        
        self.cargaArbolTicket();
    };

    self.cargaArbolTicket = function () {
        let ArbolPrincipal = [];

        ArbolPrincipal.push({
            "ID": 1,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM": "INICIAL",
            "DESCRIPCION": obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO,
            "Task_Parent_ID": 0,
            "ICON":"MYUSER"
        });

        ArbolPrincipal.push({
            "ID": 12,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM": "ALLTICKETSMS",
            "DESCRIPCION": Globalize.formatMessage("adm_tk_tree"),
            "Task_Parent_ID": 0,
            "ICON":"FOLDER"
        },{
            "ID": 13,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MSA_TODO",
            "DESCRIPCION": Globalize.formatMessage("adm_tk_all"),
            "Task_Parent_ID": 12,
            "ICON":"TODAS"
        },{
            "ID": 14,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MSA_NO_TK",
            "DESCRIPCION": "No. Ticket",
            "Task_Parent_ID": 12,
            "ICON":"SEARCH"
        },{
            "ID": 15,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MSA_ABIERTAS",
            "DESCRIPCION": "Abiertas",
            "Task_Parent_ID": 12,
            "ICON":"ABIERTAS"
        },{
            "ID": 16,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MSA_CERRADAS",
            "DESCRIPCION": "Cerradas",
            "Task_Parent_ID": 12,
            "ICON":"CERRADAS"
        });

        ArbolPrincipal.push({
            "ID": 2,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM": "INIT_MTC",
            "DESCRIPCION": "Mis ticket's generados",
            "Task_Parent_ID": 1,
            "ICON":"MTG"
        },{
            "ID": 3,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MTC_TODO",
            "DESCRIPCION": "Todas",
            "Task_Parent_ID": 2,
            "ICON":"TODAS"
        },{
            "ID": 4,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MTC_NO_TK",
            "DESCRIPCION": "No. Ticket",
            "Task_Parent_ID": 2,
            "ICON":"SEARCH"
        },{
            "ID": 5,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MTC_ABIERTAS",
            "DESCRIPCION": "Abiertas",
            "Task_Parent_ID": 2,
            "ICON":"ABIERTAS"
        },{
            "ID": 6,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MTC_CERRADAS",
            "DESCRIPCION": "Cerradas",
            "Task_Parent_ID": 2,
            "ICON":"CERRADAS"
        });

        let IdAutronicrement = 18;

        let jsonServEmpl = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
            EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
            TPO_USUARIO: self.TipoUsuario
        };
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Mesa_Empleado','GET',jsonServEmpl,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                let DataServicios = in_emp.JsonData;
                let _ary_Estatus = {Tbl:"SAMT_ESTATUS_TICKET",WHR:"EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+"" };
                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Estatus,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                    if (all_data.success == true){
                        let DataEstatus = all_data.JsonData

                        let _ary_Severidad = {Tbl:"SAMT_TIPO_SEVERIDAD",WHR:"EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+" AND TIPO_SEVERIDAD_TICKET_ACTIVO = 1 " };
                        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Severidad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                            if (all_data.success == true){
                                let DataSeveridad = all_data.JsonData

                                let _ary_Prioridad = {Tbl:"SAMT_TIPO_PRIORIDAD_TICKET",WHR:"EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+" AND TIPO_PRIORIDAD_ACTIVO = 1 " };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Prioridad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                    if (all_data.success == true){
                                        let DataPrioridad = all_data.JsonData
                                        
                                        for(let s = 0; s < DataServicios.length; s++){

                                            self.MisServiciosActivosTickets.push(DataServicios[s].CAM_MESA_CSC);

                                            let Id_Parent = parseInt( IdAutronicrement + "" );

                                            ArbolPrincipal.push({
                                                "ID": Id_Parent,
                                                "CLAVE_ITEM":"SERVICIO",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "DESCRIPCION": DataServicios[s].CAM_MESA_IDIOMA1,
                                                "Task_Parent_ID": 0,
                                                "ICON":"SERVICIO",
                                            });
                                            if (DataServicios[s].CAM_MESA_CSC != 4) {
                                                IdAutronicrement++;

                                                ArbolPrincipal.push({
                                                    "ID": IdAutronicrement,
                                                    "CLAVE_ITEM": "ALTATICKET",
                                                    "DESCRIPCION": "Generar nuevo ticket",
                                                    "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                    "Task_Parent_ID": Id_Parent,
                                                    "ICON":"ADD",
                                                    "IFRAMEWEB": DataServicios[s].CAM_MESA_IFRAMEWEB
                                                });    
                                            }

                                            
                                            IdAutronicrement++;

                                            ArbolPrincipal.push({
                                                "ID": IdAutronicrement,
                                                "CLAVE_ITEM": "TODAS",
                                                "DESCRIPCION": "Todas",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"TODAS",
                                            });

                                            IdAutronicrement++;


                                            ArbolPrincipal.push({
                                                "ID": IdAutronicrement,
                                                "CLAVE_ITEM": "ABIERTAS",
                                                "DESCRIPCION": "Abiertas",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"ABIERTAS",
                                            });

                                            IdAutronicrement++;

                                            ArbolPrincipal.push({
                                                "ID": IdAutronicrement,
                                                "CLAVE_ITEM": "CERRADAS",
                                                "DESCRIPCION": "Cerradas",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"CERRADAS",
                                            });

                                            IdAutronicrement++;

                                            let EstatusId = parseInt(IdAutronicrement + ""); 

                                            ArbolPrincipal.push({
                                                "ID": EstatusId,
                                                "CLAVE_ITEM": "PROCESO",
                                                "DESCRIPCION": "Proceso",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"PROCESO",
                                            });
                                            
                                            IdAutronicrement++;

                                            let EstatusFilter = jslinq( DataEstatus ).where(function(el) { return el.CAM_MESA_CSC == DataServicios[s].CAM_MESA_CSC; }).toList();

                                            for(let e = 0; e < EstatusFilter.length; e++){

                                                ArbolPrincipal.push({
                                                    "ID": IdAutronicrement,
                                                    "CLAVE_ITEM": "ESTATUS",
                                                    "DESCRIPCION": EstatusFilter[e].ESTATUS_TICKET_IDIOMA1,
                                                    "ESTATUS_CSC":	EstatusFilter[e].ESTATUS_TICKET_CSC,
                                                    "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                    "Task_Parent_ID": EstatusId,
                                                    "ICON":"ESTATUS",
                                                });
                                                IdAutronicrement++;
                                            }
                                            

                                            IdAutronicrement++;

                                            let SeveridadId= parseInt(IdAutronicrement + ""); 

                                            ArbolPrincipal.push({
                                                "ID": SeveridadId,
                                                "CLAVE_ITEM": "SEVERIDAD",
                                                "DESCRIPCION": "Severidad",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"SEVERIDAD",
                                            });

                                            IdAutronicrement++;

                                            let SeveridadFilter = jslinq( DataSeveridad ).where(function(el) { return el.CAM_MESA_CSC == DataServicios[s].CAM_MESA_CSC; }).toList();

                                            for(let sv = 0; sv < SeveridadFilter.length; sv++){

                                                ArbolPrincipal.push({
                                                    "ID": IdAutronicrement,
                                                    "CLAVE_ITEM": "ITEMSEVERIDAD",
                                                    "DESCRIPCION": SeveridadFilter[sv].TIPO_SEVERIDAD_TICKET_IDIOMA1,
                                                    "SEVERIDAD_CSC":	SeveridadFilter[sv].TIPO_SEVERIDAD_CSC,
                                                    "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                    "Task_Parent_ID": SeveridadId,
                                                    "ICON":"ITEMSEVERIDAD",
                                                });
                                                
                                                IdAutronicrement++;
                                            }

                                            IdAutronicrement++;

                                            let PrioridadId= parseInt(IdAutronicrement + ""); 

                                            ArbolPrincipal.push({
                                                "ID": PrioridadId,
                                                "CLAVE_ITEM": "PRIORIDAD",
                                                "DESCRIPCION": "Prioridad",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"PRIORIDAD"
                                            });

                                            IdAutronicrement++;

                                            let PrioridadFilter = jslinq( DataPrioridad ).where(function(el) { return el.CAM_MESA_CSC == DataServicios[s].CAM_MESA_CSC; }).toList();
                                            for(let p = 0; p < PrioridadFilter.length; p++){
                                                ArbolPrincipal.push({
                                                    "ID": IdAutronicrement,
                                                    "CLAVE_ITEM": "ITEMPRIORIDAD",
                                                    "DESCRIPCION": PrioridadFilter[p].TIPO_PRIORIDAD_IDIOMA1,
                                                    "PRIORIDAD_CSC": PrioridadFilter[p].TIPO_PRIORIDAD_CSC,
                                                    "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                    "Task_Parent_ID": PrioridadId,
                                                    "ICON":"ITEMPRIORIDAD",
                                                });
                                                
                                                IdAutronicrement++;
                                            }

                                            IdAutronicrement++;

                                        }
                        
                                        ArbolPrincipal.push({
                                            "ID": 7,
                                            "CAM_MESA_CSC":	0,
                                            "CLAVE_ITEM": "INIT_MTA",
                                            "DESCRIPCION":"Mis ticket's asignados",
                                            "Task_Parent_ID": 1,
                                            "ICON":"MTA"
                                        },{
                                            "ID": 8,
                                            "CAM_MESA_CSC":	0,
                                            "CLAVE_ITEM":	"MTA_TODO",
                                            "DESCRIPCION": "Todas",
                                            "Task_Parent_ID": 7,
                                            "ICON":"TODAS"
                                        },{
                                            "ID": 9,
                                            "CAM_MESA_CSC":	0,
                                            "CLAVE_ITEM":	"MTA_NO_TK",
                                            "DESCRIPCION": "No. Ticket",
                                            "Task_Parent_ID": 7,
                                            "ICON":"SEARCH"
                                        },{
                                            "ID": 10,
                                            "CAM_MESA_CSC":	0,
                                            "CLAVE_ITEM":	"MTA_ABIERTAS",
                                            "DESCRIPCION": "Abiertas",
                                            "Task_Parent_ID": 7,
                                            "ICON":"ABIERTAS"
                                        },{
                                            "ID": 11,
                                            "CAM_MESA_CSC":	0,
                                            "CLAVE_ITEM":	"MTA_CERRADAS",
                                            "DESCRIPCION": "Cerradas",
                                            "Task_Parent_ID": 7,
                                            "ICON":"CERRADAS"
                                        });
                                        
                                        $("#treeTicketAdmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);

                                        loadPanel.hide();

                                    }
                                    else {
                                        
                                    }
                                });

                                
                            }
                            else {
                            }
                        });

                    }
                    else {
                        
                    }
                });

                

                
            } 
            else {
                $("#treeTicketAdmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);
                loadPanel.hide();
            }
        });

        loadPanel.hide();
        setTimeout(() => {
            let PreLoad = {
                EMPLEADO_CSC_ATIENDE: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                TIC_CERRADO: 0
            }
            self.__Temp_Ult_Consulta = PreLoad;
            self.ConsultaTickets(PreLoad);
        }, 1000);
	};

    self.ConsultaTickets = function(itemData){
        self.__DataSource_Tickets_Grid_Admin.clear();
        let DefaultData = {...ReturnDefaultData_Init()};
        let addDataPermisos = {
            CAM_CSC_SERVICIO_SOLICITA_IN: self.idServiciosUsuario,
            TIC_REQ_AUTORIZACION: 0
        }

        let SearchTicket = Object.assign(DefaultData,itemData, addDataPermisos);
        loadPanel.show();
        
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Servicio','GET',SearchTicket,getJSON(DeveloperType).ApiTickets_v2.token).then((all_data)=>{
            if (all_data.success == true){
                let selectedRowsData = all_data.JsonData;
                selectedRowsData.forEach(function(item) {
                    self.__DataSource_Tickets_Grid_Admin.insert(item);
                });
                self.DataGridTicketsAdmin.refresh();
                loadPanel.hide();
            }
            else{
                self.__DataSource_Tickets_Grid_Admin.clear();
                self.DataGridTicketsAdmin.refresh();
                loadPanel.hide();
            }
        })
        .catch(function(e){
            self.__DataSource_Tickets_Grid_Admin.clear();
            self.DataGridTicketsAdmin.refresh();
            loadPanel.hide();
            DevExpress.ui.notify("Eror de de busqueda vueva a intentar nuevamente", "error", 3000); 
        });
	};
    function AbrirPopMesaAyuda(TIPO,CSC_MESA,TICKET_NEW_ID) {
        loadPanel.show();
        let jsonServEmpl = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
            CAM_MESA_CSC: CSC_MESA
        };
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ensamble_Mesa_Ayuda','GET',jsonServEmpl,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                let DataMesa = in_emp.JsonData[0];
                if (DataMesa.CAM_MESA_IFRAMEWEB == null) {
                    DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 3000);
                    return
                } else {
                        let extraVars = "TIPO="+TIPO
                        +"&CSC_MESA="+CSC_MESA
                        +"&TK_ID="+TICKET_NEW_ID
                        +"&TPO_USUARIO="+self.TipoUsuario;
                        let UrlPop = "/"+self.patname.split('/')[1]+"/views/Vistas_Mesas_Ayuda/"+DataMesa.CAM_MESA_IFRAMEWEB+"/"+DataMesa.CAM_MESA_IFRAMEWEB+".html?"+extraVars;
                        const popupContentTemplate = function (container) {
                            return $('<div style="height:100%;">').append(
                                '<iframe src='+UrlPop+' width="100%" height="100%" scrolling="auto" frameBorder="0" style=" flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;"></iframe>'
                            );
                        };
                        $("#Pop_Mesa_Ayuda_Config").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                        $('#Pop_Mesa_Ayuda_Config').dxPopup("show");
                        loadPanel.hide();
                }
            }
            else{
                DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 10000);
            }
        }).catch(function(e){
            DevExpress.ui.notify("Error mesa de ayuda no localizada intente nuevamnete", "error", 10000);
        });
    }

    self.run = function (){
        self.getPermisosEmpleadoServicios()    
    }

    self.getPermisosEmpleadoServicios= async function(){
        let obj_DatosEmpleadoF = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        let jsonBusqueda = {
            ...ReturnDefaultData_Init(),
            EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleadoF.EMPLEADO_CSC_EMPLEADO
        };
        try {
        let in_emp  = await  __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url + 'getTreeCliProyCamp', 'GET', jsonBusqueda, getJSON(DeveloperType).ApiGeneral.token)
            if (in_emp.success == true) {
                let _T_Documento = jslinq(in_emp.JsonData).toList();
                _T_Documento.forEach(function(item) {self._ClienteProyectoCampania_ObjData.insert(item);});
                var finalData = jslinq(in_emp.JsonData).select(function(el){return el.CAM_CSC_SERVICIO;}).toList();
                self.idServiciosUsuario = finalData.join(",")
                self.init()
            }
        } catch (e) {
            DevExpress.ui.notify('ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
        }
        return true;
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
    
        return ('0' + dias).slice(-2) + 'd ' +  ('0' + horas).slice(-2) + ':' + ('0' + minutos).slice(-2)  + ':' + ('0' + segundos).slice(-2);   
        
        //return {dias,horas,minutos,segundos,};
    }

    function calcularDuracionEnSegundos(fechaInicio, fechaFin, returnType = null, diasExcluidos = []) {
        var currentDate = moment(fechaInicio);
        var fechaFinal = moment(fechaFin);
    
        if (!currentDate.isValid() || !fechaFinal.isValid()) {
            return 'Fechas inválidas';
        }
    
        // Convertir las fechas a excluir en un Set de strings 'YYYY-MM-DD' para búsqueda rápida
        var diasExcluidosSet = new Set(diasExcluidos.map(d => moment(d).format('YYYY-MM-DD')));
    
        var segundosTotales = 0;
    
        if (currentDate.isSame(fechaFinal, 'day')) {
            if (currentDate.isoWeekday() != 6 && currentDate.isoWeekday() != 7 &&
                !diasExcluidosSet.has(currentDate.format('YYYY-MM-DD'))) {
                segundosTotales += fechaFinal.diff(currentDate, 'seconds');
            }
        } else {
            if (currentDate.isoWeekday() != 6 && currentDate.isoWeekday() != 7 &&
                !diasExcluidosSet.has(currentDate.format('YYYY-MM-DD'))) {
                segundosTotales += currentDate.clone().endOf('day').diff(currentDate, 'seconds');
            }
    
            if (fechaFinal.isoWeekday() != 6 && fechaFinal.isoWeekday() != 7 &&
                !diasExcluidosSet.has(fechaFinal.format('YYYY-MM-DD'))) {
                segundosTotales += fechaFinal.diff(fechaFinal.clone().startOf('day'), 'seconds');
            }
    
            var diasTotales = fechaFinal.diff(currentDate, 'days');
    
            for (var i = 1; i < diasTotales; i++) {
                var fechaActual = currentDate.clone().add(i, 'days');
                if (fechaActual.isoWeekday() != 6 && fechaActual.isoWeekday() != 7 &&
                    !diasExcluidosSet.has(fechaActual.format('YYYY-MM-DD'))) {
                    segundosTotales += 86400;
                }
            }
        }
    
        var duracion = moment.duration(segundosTotales, 'seconds');
    
        if (returnType == 'VencimientoSemaforo') {
            return segundosTotales;
        } else {
            return ('0' + duracion.days()).slice(-2) + ' d ' +
                ('0' + duracion.hours()).slice(-2) + ':' +
                ('0' + duracion.minutes()).slice(-2) + ':' +
                ('0' + duracion.seconds()).slice(-2);
        }
    } 
}



setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.run();
}, 1000);