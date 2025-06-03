SalesDashboard.dashboardModel = function() {
    var self = this;
    var obj_DatosEmpleado = null;
    this.Nombre,this.Apellido,this.Estatus = null;
    var ServiciosActivosTickets = Array();
    self.MisServiciosActivosTickets = Array();

    self.__Temp_Ult_Consulta = {};
    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");
    self.TodoEmpleados = null;
    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */

        /** LABELS  PANTALLA*/
        $('#adm_title_ms').html(Globalize.formatMessage("adm_title_ms"));
        /** LABELS  PANTALLA*/

        self.patname = window.location.pathname;

        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        self.TodoEmpleados = JSON.parse( sessionStorage.getItem('all_emp_host'));

        var Config_Btn_Add_Ot = {
            icon: '../../images/Icons/add.png',
            text: 'Agregar Orden de Trabajo',
            visible: true,
            disabled:false,
            onClick() {
                $("#Dialog_Orden_Trabajo").dxPopup("show");
            }
        };

        var Config_Btn_Add_Bitacora = {
            icon: '../../images/Icons/add.png',
            text: 'Agregar Bitacora',
            visible: true,
            disabled:false,
            onClick() {
                
            }
        };

        var Config_Btn_Add_Empleados = {
            icon: '../../images/Icons/add.png',
            text: 'Agregar Empleado',
            visible: true,
            disabled:false,
            onClick() {
                
            }
        };

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
                var icon = document.createElement("span");
                icon.className = "menu_item "+itemData.ICON;
                itemElement.append(icon);

                var text = document.createElement("span");
                text.className = "item-text";
                text.innerText = itemData.DESCRIPCION;
                itemElement.append(text);
            },
            onItemClick:function(itemSelect){
                self.__Temp_Ult_Consulta = {};
                var itemData = itemSelect.itemData;
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
                            var text = self.MisServiciosActivosTickets.join(",");
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 0;
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = text;
                            self.ConsultaTickets(self.__Temp_Ult_Consulta);
                        break;

                        case "MSA_CERRADAS":
                            var text = self.MisServiciosActivosTickets.join(",");
                            self.__Temp_Ult_Consulta.TIC_CERRADO = 1;
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = text;
                            self.__Temp_Ult_Consulta.BYFC = true;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;

                        case "MSA_TODO":
                            var text = self.MisServiciosActivosTickets.join(",");
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = text;
                            $("#Dialog_Busqueda_Fecha").dxPopup("show");
                        break;

                        case "MSA_NO_TK":
                            var text = self.MisServiciosActivosTickets.join(",");
                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = text;
                            $("#Dialog_Busqueda_No_Ticket").dxPopup("show");
                        break;

                    }
                } 
                else if (itemData.CAM_MESA_CSC != 0) {
                    self.__Temp_Ult_Consulta = {};
                    var itemData = itemSelect.itemData;
                    switch (itemData.CLAVE_ITEM) {
                        case "ALTATICKET":
                            if (itemData.IFRAMEWEB == null) {
                                DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 3000);
                                return
                            } else {
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
            title: "Detalle Solicitud",
            height: '90%',  
            width: '800',  
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onHiding: function (e) {
                self.ConsultaTickets(self.__Temp_Ult_Consulta);
                //document.getElementById("Mod_Embebed_Mesa").src = "";
            },
            onShowing: function(e) {
                
            },
            onShown: function (e) {
                //document.getElementById("Mod_Embebed_Mesa").src = "../MonitoreoVideoLlamada/?roomName="+NewIdCallMonit;  
            },
            /*contentTemplate: function (container) {  
                $("<iframe>").appendTo(container).attr("src", "a.html");  
            } */
            /*contentTemplate() {
                const scrollView = $('<div style="flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;border: solid red 1px;" />');
          
                scrollView.append($('<iframe id="Mod_Embebed_Mesa" width="100%" height="100%" frameBorder="0" style="border: solid blue 1px; width: 100%;height: 100%;"></iframe>'));
                
                scrollView.dxScrollView({
                  width: '100%',
                  height: '100%',
                });
          
                return scrollView;
              },*/
        });

        $("#Pop_Select_Empleado_Reasigna").dxPopup({
            hideOnOutsideClick:false,
            title: "EMPLEADO A ASIGNAR",
            height: function() {  
                return 150  
            },  
            width: function() {  
                return 350
            },  
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onShowing: function (e) {
                
            }, 
            onHiding: function (e){
                $("#Frm_Empleado_Reasigna_Ticket").dxForm("instance").resetValues();
            },
            contentTemplate: function (e) {
                e.attr({"style": "display: flex; flex-direction: column;"});

                e.append(
                    $("<div />").attr({"id": "Frm_Empleado_Reasigna_Ticket","style": "border: solid red 0px; margin-bottom: 5px; "}).dxForm({
                        readOnly: false,
                        showColonAfterLabel: true,
                        showValidationSummary: false,
                        labelMode: 'static',
                        labelLocation: 'top',
                        validationGroup: 'Frm_Empleado_Reasigna_Ticket_Validation',
                        colCount:1,
                        items: [{
                            colSpan:1,
                            dataField: 'EMPLEADO_CSC_ATIENDE',
                            editorType: "dxSelectBox",
                            label: { 
                                text: "Empleado a Reasignar "
                            },
                            editorOptions: {
                                searchEnabled:true,
                                dataSource: self.TodoEmpleados,
                                displayExpr: "NOMBRE",
                                valueExpr: "EMPLEADO_CSC_EMPLEADO",
                                onValueChanged: function (e) {
                                    var newValue = e.value;
                                }                    
                            },
                            validationRules: [{
                                type: "required",
                                message: "requerido"
                            }]
                        },{
                            itemType: "button",
                            location: 'before',
                            locateInMenu: 'auto',
                            buttonOptions: {
                                width: "100%",
                                type: "success",
                                text: "REASIGNAR",
                                icon: "save",
                                onInitialized: function(e) {  
                                    
                                    $btn_SalvarAsegurado = e.component;
                                },
                                onClick: function () {
                                    var FormReasigna = $('#Frm_Empleado_Reasigna_Ticket').dxForm('instance');

                                    if( FormReasigna.validate().isValid){

                                        var DataEmpReasigna = FormReasigna.option("formData");
                                        var selectItemDataGrid = $("#Data_Grid_Ticket_Admin").dxDataGrid("instance").getSelectedRowsData();
        

                                        loadPanel.show();
                                        var p = $.when();

                                        selectItemDataGrid.forEach((element) => {

                                            var objUpdate = {
                                                EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                                                Type: localStorage.getItem('Type'),
                                                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                DATA_UPDATE: {
                                                    EMPLEADO_CSC_ATIENDE: DataEmpReasigna.EMPLEADO_CSC_ATIENDE,
                                                    AUDITORIA_FEC_ULT_MOD: moment().tz(localStorage.getItem('tmzServidor')).format('YYYY-MM-DD HH:mm:ss'),
                                                    AUDITORIA_USU_ULT_MOD: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO
                                                },
                                                DATA_WHERE:{
                                                    "TIC_CSCTICKET":element.TIC_CSCTICKET,
                                                    //"EMPLEADO_CSC_ATIENDE": element.EMPLEADO_CSC_ATIENDE,
                                                    "EMP_CSC_EMPRESA_HOST":localStorage.getItem('EMP_CSC_EMPRESA_HOST')
                                                }
                                            };

                                            p = p.then(function() {
                                                var obj_BitacoraSend = {}
                                                obj_BitacoraSend.TIC_CSCTICKET = element.TIC_CSCTICKET;
                                                obj_BitacoraSend.ESTATUS_TICKET_CSC = 0;
                                                loadPanel.show();
                                                console.log(obj_BitacoraSend);
                                                self.InsertaBitacoraManual(obj_BitacoraSend,'Se reasigna usuario: de ' + element.EMPLEADO_NOMBREEMPLEADO + ' a ' , false, 1,3);

                                                return __Reques_ajax_BitaoraDato( getJSON(DeveloperType).ApiTickets_v2.url+'Update_Ticket_Servicio', 'POST', JSON.stringify(objUpdate), getJSON(DeveloperType).ApiTickets_v2.token )
                                            }).catch(function() {
                                                return false;
                                            });
                                            
                                        });

                                        p.then(function(e){
                                            console.log(e);
                                            self.ConsultaTickets(self.__Temp_Ult_Consulta);	
                                            $("#Pop_Select_Empleado_Reasigna").dxPopup("hide");
                                            loadPanel.hide();
                                        });
                                        

                                    } 
                                    else{
                                        DevExpress.ui.notify('LLENE LOS CAMPOS EN ROJO');
                                    }


                                }
                            }
                        }]
                    })
                )

            }
        });

        var contextMenuItems = [
            { text: 'REASIGNAR SOLICITUDES', icon: 'refresh', clave: 'REASIGNAR' }
        ];

        $("#context_menu_asignacion").dxContextMenu({
            items: contextMenuItems,
            /*dataSource:[{ 
                CAT_SUBPROCESO_EMP_IDIOMA1: 'REASIGNAR CASO',
                CAT_SUBPROCESO_EMP_CLAVE:"REASIGNAR" 
            }],*/
            width: 200,
            target: "#Data_Grid_Ticket_Admin",
            valueExpr:"clave",
            displayExpr: "text",
            /*itemTemplate(itemData) {
                const template = $('<div />');
                template.append( $('<div style="border: solid red 1px; width: 32px; height: 32px; " />').css("background-image", "url('../../images/Icons/add.png')") );
                template.append(itemData.CAT_SUBPROCESO_EMP_IDIOMA1);
                return template;
            },*/
            onItemClick: function(e){
                //console.log(e);
                if (!e.itemData.items) {
                    
                    switch(e.itemData.clave){

                        case 'REASIGNAR' :

                            var selectItemDataGrid = $("#Data_Grid_Ticket_Admin").dxDataGrid("instance").getSelectedRowsData();

                            if(selectItemDataGrid.length > 0){
                                $("#Pop_Select_Empleado_Reasigna").dxPopup("show");
                            }
                            else{
                                DevExpress.ui.notify("SELECCIONE UNO O MAS REGISTROS A REASIGNAR", "error", 5000); 
                            }

                        break;

                        
                    }

                }
            }
        });

        $("#Data_Grid_Ticket_Admin").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            height: "100%",
            filterRow: {
                visible: true,
                applyFilter: 'auto',
            },
            headerFilter: { visible: true },
            keyExpr: "TIC_CSCTICKET",
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: 'multiple',
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
            
            columns: [
                {
                    caption: "No. solicitud",
                    dataField: "TIC_CSCTICKET",
                    alignment: "center",
                    sortOrder: 'desc',
                    width: 130,
                },{
                    caption: "Fecha de ingreso",
                    dataField: "FINGRESO",
                    width: 130,
                },{
                    caption: "Hora de ingreso",
                    dataField: "HINGRESO",
                    width: 130,
                },{
                    caption: "Fecha de gestión inicial",
                    dataField: "FGESTIONINICIAL",
                    width: 130,
                },{
                    caption: "Hora de gestión inicial",
                    dataField: "HGESTIONINICIAL",
                    width: 130,
                },{
                    caption: "Tipo de documento",
                    dataField: "DOCUMENTO_DESCRIPCION1",
                    width: 200,
                },{
                    caption: "Número de documento",
                    dataField: "CRM_NUMERO_DOCUMENTO",
                    width: 230,
                },{
                    caption: "Nombre",
                    dataField: "CRM_NOMBRE",
                    width: 250,
                },{
                    caption: "Apellidos",
                    dataField: "CRM_APELLIDOS",
                    width: 250,
                },{
                    caption: "Nombre Institución",
                    dataField: "CRM_NOMBRE_INSTITUCION",
                    width: 250,
                },{
                    caption: "Teléfono celular",
                    dataField: "CRM_TELEFONO_CEL",
                    width: 250,
                },{
                    caption: "Teléfono fijo",
                    dataField: "CRM_TELEFONO_FIJO",
                    width: 250,
                },{
                    caption: "Correo electronico",
                    dataField: "CRM_CORREO",
                    width: 350,
                },{
                    caption: "Departamento",
                    dataField: "DEPARTAMENTO",
                    width: 250,
                },{
                    caption: "Ciudad",
                    dataField: "CIUDAD",
                    width: 250,
                },{
                    caption: "Tipo de servicio",
                    dataField: "SERVICIO",
                    width: 200,
                },{
                    caption: "Tipo de solicitud",
                    dataField: "SOLICITUD",
                    width: 350,
                },{
                    caption: "Estado",
                    dataField: "ESTATUS",
                    width: 150,
                },{
                    caption: "Fecha gestion final",
                    dataField: "FECHACIERRE",
                    width: 130,
                },{
                    caption: "Hora gestion final",
                    dataField: "TIC_FECHA_CIERRE_HORA_COMPLETA",
                    width: 130,
                },{
                    caption: "Usuario Asignado",
                    dataField: "EMPLEADO_NOMBREEMPLEADO",
                    width: 250,
                    fixed:true,
                    fixedPosition:"right",
                }                
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
            /*onRowDblClick: function (e) {
                //AbrirPop
                setTimeout(() => {
                    AbrirPopMesaAyuda('EDITAR',e.data.CAM_MESA_CSC,e.data.TIC_NEWID) 
                }, 1000);
            }*/
             
        });

        /*$("#Form_Btn_Alta_Ticket").dxForm({
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: false,
            labelMode: 'static',
            labelLocation: 'top',
            colCount:18,
            items: [{
                itemType: "group",
                colSpan: 18,
                colCount: 18,
                items:[{
                    colSpan:3,
                    itemType: "button",
                    location: 'before',
                    locateInMenu: 'auto',
                    buttonOptions: {
                        text: "Alta Ticket",
                        icon: 'add',
                        type: "success",
                        width: '100%', 
                        visible:true,
                        onInitialized: function(e) {  
                            $btn_Alta_Ticket = e.component;
                        },
                        onClick() {
                            self.DataTicketOpen = null;
                            AbrirPopMesaAyuda('ALTA', 775, null)
                        }
                    }
                },{
                    colSpan:9,
                    template:" "
                }]
            }]
        });*/

        $("#Dialog_Busqueda_Fecha").dxPopup({
            hideOnOutsideClick:false,
            title: "PARAMETROS",
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
                                },
                                validationRules: [{type: 'required',message: 'Fecha requerida'}]
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
                                        var FormBusqueda = $("#Form_Busqueda_Fecha").dxForm('instance');
                                        if(FormBusqueda.validate().isValid){
                                            var DataForm = FormBusqueda.option('formData');
                                            self.__Temp_Ult_Consulta.TIC_FECHA_INICIAL = DataForm.TIC_FECHA_INICIAL + " 00:00:00";
                                            self.__Temp_Ult_Consulta.TIC_FECHA_FINAL = DataForm.TIC_FECHA_FINAL + " 23:59:59";
                                            self.ConsultaTickets(self.__Temp_Ult_Consulta);
                                            $("#Dialog_Busqueda_Fecha").dxPopup("hide");
                                        }
                                        else{
                                            DevExpress.ui.notify("LLENE LOS CAMPOS EN ROJO", "error", 300); 
                                        }
                                    }
                                }
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
                            }]
                        }]
                    })
                );

            }
        });


        $("#Dialog_Busqueda_No_Ticket").dxPopup({
            hideOnOutsideClick:false,
            title: "BUSQUEDA DE SOLICITUD",
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
                                    text: "No. Solicitud"
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
                                    text: "Buscar",
                                    icon: 'search',
                                    type: "default",
                                    width: '100%', 
                                    visible:true,
                                    onInitialized: function(e) {  
                                        
                                    },
                                    onClick() {
                                        var FormBusqueda = $("#Form_Busqueda_No_Ticket").dxForm('instance');
                                        if(FormBusqueda.validate().isValid){
                                            var DataForm = FormBusqueda.option('formData');
                                            self.__Temp_Ult_Consulta.TIC_CSCTICKET = DataForm.TIC_CSCTICKET
                                            self.ConsultaTickets(self.__Temp_Ult_Consulta);
                                            $("#Dialog_Busqueda_No_Ticket").dxPopup("hide");
                                        }
                                        else{
                                            DevExpress.ui.notify("LLENE LOS CAMPOS EN ROJO", "error", 300); 
                                        }
                                    }
                                }
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
                            }]
                        }]
                    })
                );

            }
        });

        
        var _Ary_Search_Servicios= {Tbl:"SAMT_CAM_SERVICIO",WHR: " EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+" "};
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_Ary_Search_Servicios,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
            if (all_data.success == true){
                var servicios =  all_data.JsonData;
                for(var r = 0; r < servicios.length; r++){
                    ServiciosActivosTickets.push(servicios[r].CAM_MESA_CSC)
                }
            }
        });
        
        self.cargaArbolTicket();
    };

    self.cargaArbolTicket = function () {
        var ArbolPrincipal = [];

        /*ArbolPrincipal.push({
            "ID": 1,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM": "INICIAL",
            "DESCRIPCION": obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO,
            "Task_Parent_ID": 0,
            "ICON":"MYUSER"
        });*/

        ArbolPrincipal.push({
            "ID": 12,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM": "ALLTICKETSMS",
            "DESCRIPCION": "Solicitud's",
            "Task_Parent_ID": 0,
            "ICON":"FOLDER"
        },{
            "ID": 13,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MSA_TODO",
            "DESCRIPCION": "Todas",
            "Task_Parent_ID": 12,
            "ICON":"TODAS"
        },{
            "ID": 14,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MSA_NO_TK",
            "DESCRIPCION": "No. Solicitud",
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
        },{
            "ID": 17,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM":	"MSA_NOASIG",
            "DESCRIPCION": "No asignadas",
            "Task_Parent_ID": 12,
            "ICON":"SINASIG"
        });

        /*ArbolPrincipal.push({
            "ID": 2,
            "CAM_MESA_CSC":	0,
            "CLAVE_ITEM": "INIT_MTC",
            "DESCRIPCION": "Mis Solicitudes's generadas",
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
            "DESCRIPCION": "No. Solicitud",
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
        });*/

        var IdAutronicrement = 18;

        var jsonServEmpl = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
            EMPLEADO_CSC_EMPLEADO: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
            TPO_USUARIO: "ADMIN"
        };
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Mesa_Empleado','GET',jsonServEmpl,getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            loadPanel.show()
            if (in_emp.success == true) {
                var DataServicios = in_emp.JsonData;

                var _ary_Estatus = {Tbl:"SAMT_ESTATUS_TICKET",WHR:"EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+"" };
                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Estatus,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                    if (all_data.success == true){
                        var DataEstatus = all_data.JsonData

                        var _ary_Severidad = {Tbl:"SAMT_TIPO_SEVERIDAD",WHR:"EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+" AND TIPO_SEVERIDAD_TICKET_ACTIVO = 1 " };
                        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Severidad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                            if (all_data.success == true){
                                var DataSeveridad = all_data.JsonData

                                var _ary_Prioridad = {Tbl:"SAMT_TIPO_PRIORIDAD_TICKET",WHR:"EMP_CSC_EMPRESA_HOST = "+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+" AND TIPO_PRIORIDAD_ACTIVO = 1 " };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Prioridad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                    if (all_data.success == true){
                                        var DataPrioridad = all_data.JsonData
                                        
                                        for(var s = 0; s < DataServicios.length; s++){

                                            self.MisServiciosActivosTickets.push(DataServicios[s].CAM_MESA_CSC);

                                            var Id_Parent = parseInt( IdAutronicrement + "" );

                                            ArbolPrincipal.push({
                                                "ID": Id_Parent,
                                                "CLAVE_ITEM":"SERVICIO",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "DESCRIPCION": DataServicios[s].CAM_MESA_IDIOMA1,
                                                "Task_Parent_ID": 0,
                                                "ICON":"SERVICIO",
                                            });

                                            IdAutronicrement++;

                                            ArbolPrincipal.push({
                                                "ID": IdAutronicrement,
                                                "CLAVE_ITEM": "ALTATICKET",
                                                "DESCRIPCION": "Generar nueva solicitud",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"ADD",
                                                "IFRAMEWEB": DataServicios[s].CAM_MESA_IFRAMEWEB
                                            });

                                            
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

                                            var EstatusId = parseInt(IdAutronicrement + ""); 

                                            ArbolPrincipal.push({
                                                "ID": EstatusId,
                                                "CLAVE_ITEM": "PROCESO",
                                                "DESCRIPCION": "Proceso",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"PROCESO",
                                            });
                                            
                                            IdAutronicrement++;

                                            var EstatusFilter = jslinq( DataEstatus ).where(function(el) { return el.CAM_MESA_CSC == DataServicios[s].CAM_MESA_CSC; }).toList();

                                            for(var e = 0; e < EstatusFilter.length; e++){

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

                                            var SeveridadId= parseInt(IdAutronicrement + ""); 

                                            ArbolPrincipal.push({
                                                "ID": SeveridadId,
                                                "CLAVE_ITEM": "SEVERIDAD",
                                                "DESCRIPCION": "Severidad",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"SEVERIDAD",
                                            });

                                            IdAutronicrement++;

                                            var SeveridadFilter = jslinq( DataSeveridad ).where(function(el) { return el.CAM_MESA_CSC == DataServicios[s].CAM_MESA_CSC; }).toList();

                                            for(var sv = 0; sv < SeveridadFilter.length; sv++){

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

                                            var PrioridadId= parseInt(IdAutronicrement + ""); 

                                            ArbolPrincipal.push({
                                                "ID": PrioridadId,
                                                "CLAVE_ITEM": "PRIORIDAD",
                                                "DESCRIPCION": "Prioridad",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"PRIORIDAD"
                                            });

                                            IdAutronicrement++;

                                            var PrioridadFilter = jslinq( DataPrioridad ).where(function(el) { return el.CAM_MESA_CSC == DataServicios[s].CAM_MESA_CSC; }).toList();

                                            for(var p = 0; p < PrioridadFilter.length; p++){

                                                ArbolPrincipal.push({
                                                    "ID": IdAutronicrement,
                                                    "CLAVE_ITEM": "ITEMPRIORIDAD",
                                                    "DESCRIPCION": DataPrioridad[p].TIPO_PRIORIDAD_IDIOMA1,
                                                    "PRIORIDAD_CSC": DataPrioridad[p].TIPO_PRIORIDAD_CSC,
                                                    "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                    "Task_Parent_ID": PrioridadId,
                                                    "ICON":"ITEMPRIORIDAD",
                                                });
                                                
                                                IdAutronicrement++;
                                            }

                                            ArbolPrincipal.push({
                                                "ID": IdAutronicrement++,
                                                "CLAVE_ITEM": "NOASIG",
                                                "DESCRIPCION": "No Asignadas",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"SINASIG",
                                                "IFRAMEWEB": DataServicios[s].CAM_MESA_IFRAMEWEB
                                            },{
                                                "ID": IdAutronicrement++,
                                                "CLAVE_ITEM": "PORAUT",
                                                "DESCRIPCION": "Por Autorizar",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"XAUT",
                                                "IFRAMEWEB": DataServicios[s].CAM_MESA_IFRAMEWEB
                                            },{
                                                "ID": IdAutronicrement++,
                                                "CLAVE_ITEM": "AUTCANCEL",
                                                "DESCRIPCION": "Autorizadas o canceladas",
                                                "CAM_MESA_CSC":	DataServicios[s].CAM_MESA_CSC,
                                                "Task_Parent_ID": Id_Parent,
                                                "ICON":"CANCAUTO",
                                                "IFRAMEWEB": DataServicios[s].CAM_MESA_IFRAMEWEB
                                            });

                                            IdAutronicrement++;

                                        }
                        
                                        ArbolPrincipal.push({
                                            "ID": 7,
                                            "CAM_MESA_CSC":	0,
                                            "CLAVE_ITEM": "INIT_MTA",
                                            "DESCRIPCION":"Mis Solicitudes's asignadas",
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
                                            "DESCRIPCION": "No. Solicitud",
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

                                        var text = self.MisServiciosActivosTickets.join(",");
                                            self.__Temp_Ult_Consulta.TIC_CERRADO = 0;
                                            self.__Temp_Ult_Consulta.CAM_MESA_CSC_IN = text;
                                            self.ConsultaTickets(self.__Temp_Ult_Consulta);

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

        //$("#treeTicketAdmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);

        loadPanel.hide();
        setTimeout(() => {
            /*var PreLoad = {
                EMPLEADO_CSC_ATIENDE: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                TIC_CERRADO: 0
            }*/
            
        }, 1000);
	};

    self.InsertaBitacoraManual = function(InfoForm,DescripcionCambio,ValidaRechazo, TipoBitacora, SubTipoBitacora){

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
                AUDITORIA_FEC_ALTA:moment().tz(localStorage.getItem('tmzServidor')).format('YYYY-MM-DD HH:mm:ss'),
                AUDITORIA_FEC_ULT_MOD:moment().tz(localStorage.getItem('tmzServidor')).format('YYYY-MM-DD HH:mm:ss'),
                TIC_CSCTICKET: InfoForm.TIC_CSCTICKET,
                ESTATUS_TICKET_CSC: InfoForm.ESTATUS_TICKET_CSC,
                TIB_NOMBRE: obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO,
                TIB_DESCRIPCION: DescripcionCambio,
                TIB_FECHAHORA:moment().tz(localStorage.getItem('tmzServidor')).format('YYYY-MM-DD HH:mm:ss'),
                SAMT_TICKET_TIPO_BITACORA_CSC: TipoBitacora,
                SAMT_TICKET_SUBTIPO_BITACORA_CSC: SubTipoBitacora
            }                
        };

        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Bitacora_Ticket','POST',JSON.stringify(dataObj),getJSON(DeveloperType).ApiTickets_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                DevExpress.ui.notify( 'BITACORA AGREGADA CORRECTAMENTE', 'success', 5000);
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

    self.ConsultaTickets = function(itemData){
        $("#Data_Grid_Ticket_Admin").dxDataGrid("instance").option("dataSource", []);
        var DefaultData = {
            EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
            Type: localStorage.getItem('Type'),
            EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST')
        };
        
        var SearchTicket = Object.assign(DefaultData,itemData);

        loadPanel.show();
        __Reques_ajax(getJSON(DeveloperType).ApiSuraCrmColombia.url+'Get_Ticket_Reporte','GET',SearchTicket,getJSON(DeveloperType).ApiSuraCrmColombia.token).then((all_data)=>{
            if (all_data.success == true){
                $("#Data_Grid_Ticket_Admin").dxDataGrid("instance").option("dataSource", all_data.JsonData);
                loadPanel.hide();
            }
            else{
                $("#Data_Grid_Ticket_Admin").dxDataGrid("instance").option("dataSource", []);
                loadPanel.hide();
            }
        })
        .catch(function(e){
            $("#Data_Grid_Ticket_Admin").dxDataGrid("instance").option("dataSource", []);
            loadPanel.hide();
            DevExpress.ui.notify("Eror de de busqueda vueva a intentar nuevamente", "error", 3000); 
        });

	};

    function AbrirPopMesaAyuda(TIPO,CSC_MESA,TICKET_NEW_ID) {

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
                    var extraVars = "TIPO="+TIPO
                    +"&CSC_MESA="+CSC_MESA
                    +"&TK_ID="+TICKET_NEW_ID;
                    //$("#Pop_Mesa_Ayuda_Config").dxPopup("show");
                    var UrlPop = "/"+self.patname.split('/')[1]+"/views/Vistas_Mesas_Ayuda/"+DataMesa.CAM_MESA_IFRAMEWEB+"/"+DataMesa.CAM_MESA_IFRAMEWEB+".html?"+extraVars;
                    const popupContentTemplate = function (container) {
                        //return $("<iframe>").append(container).attr("src", UrlPop); 
                        return $('<div style="height:100%;">').append(
                            '<iframe src='+UrlPop+' width="100%" height="100%" scrolling="auto" frameBorder="0" style=" flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;"></iframe>'
                        );
                    };
                    //$("#Pop_Mesa_Ayuda_Config").dxPopup("instance").option("height",300);
                    //$("#Pop_Mesa_Ayuda_Config").dxPopup("instance").option("width",360);
                    $("#Pop_Mesa_Ayuda_Config").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                    $('#Pop_Mesa_Ayuda_Config').dxPopup("show");

                }
            }
            else{
                DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 3000); 
            }
        }).catch(function(e){
            //$("#Data_Grid_Ticket_Admin").dxDataGrid("instance").option("dataSource", []);
            //loadPanel.hide();
            DevExpress.ui.notify("Error mesa de ayuda no localizada intente nuevamnete", "error", 3000); 
        });

        
    }

}



setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);