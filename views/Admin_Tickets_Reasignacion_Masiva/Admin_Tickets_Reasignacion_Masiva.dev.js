SalesDashboard.dashboardModel = function() {

    var self = this;
    var obj_DatosEmpleado = null;

    self.Content_Full_Catalogs = null;
    self.Content_Full_Tipificaciones = null;
    self.Mesa_Seleccionada = null;

    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: false
    }).dxLoadPanel("instance");

    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();

    self.init = async function() {

        await self.Load_Full_Catalogs();
        await self.Get_Cat_Tipificaciones();

        self.TipoUsuario = "ADMIN";

        self.patname = window.location.pathname;

        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */

        $('#label_title_mesas').html(Globalize.formatMessage("lblmesasplus"));
        $('#label_title_tickets').html(Globalize.formatMessage("lblasignacion"));
        
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));


        $("#Context_Menu_Asignacion_Tikets").dxContextMenu({
            dataSource:[],
            onShowing:function(e){
                var TIckets_Seleccionadas = $__DataGrid_Asignacion_Tikets.getSelectedRowsData();
                
                if (TIckets_Seleccionadas.length === 0) {
                    e.cancel = true;
                }
                else{
                    e.component.option("items", [{ 
                        TEXT: 'REASIGNAR TICKET',
                        CLAVE:"ASIGTICKET",
                        ICON:"images/Icons/2206354.png", 
                    },{ 
                        TEXT: 'VER TICKET',
                        CLAVE:"VERTICKET",
                        ICON:"images/Icons/Zoom_32x32.png", 
                    }] );
                        
                }
            },
            width: 200,
            target: "#__DataGrid_Asignacion_Tikets",
            valueExpr:"CLAVE",
            displayExpr: "TEXT",
            itemTemplate(itemData) {
                
                const template = $('<div />').attr({
                    "style":`padding: 2px; display: inline-block;`,
                    "class":"item_context_menu"
                });
                template.append(
                    $("<div />").attr({
                        "style":`width: 30px; display: table-cell; background-size: 20px; background-position: center center; background-repeat: no-repeat; background-image:url(${itemData.ICON})`
                    })
                    ,
                    $("<div />").attr({
                        "style":`padding: 5px; font-weight: 700; width: auto; display: table-cell;`
                    })
                    .append(itemData.TEXT)

                );
                return template;
            },
            onItemClick: function(e){
                //console.log(e);
                var Tickets_Seleccionadas = $__DataGrid_Asignacion_Tikets.getSelectedRowsData();
                if(Tickets_Seleccionadas.length == 0){
                    DevExpress.ui.notify("SELECCIONE AL MENOS UN REGISTRO", 'error', 3000);
                }
                else{
                    if(e.itemData.CLAVE == 'ASIGTICKET'){
                        $("#Popup_Reasignar_Ticket").dxPopup("show");
                    }
                    else if(e.itemData.CLAVE == 'VERTICKET'){
                        if(Tickets_Seleccionadas.length == 1){

                            var Mesa_Ayuda = jslinq( self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").DATA ).where(function(el) {
                                return el.CAM_MESA_CSC == Tickets_Seleccionadas[0].CAM_MESA_CSC ;
                            }).toList(); 
    
                            if(Mesa_Ayuda.length > 0 ){
                                var Mesa_Select = Mesa_Ayuda[0];
                                $("#Pop_Mesa_Ayuda_Config").dxPopup("show");
                                let extraVars = `TIPO=EDITAR&CSC_MESA=${Tickets_Seleccionadas[0].CAM_MESA_CSC}&TK_ID=${Tickets_Seleccionadas[0].TIC_NEWID}&TPO_USUARIO=${self.TipoUsuario}`;
                                let UrlPop = "/"+self.patname.split('/')[1]+"/views/Vistas_Mesas_Ayuda/"+Mesa_Select.CAM_MESA_IFRAMEWEB+"/"+Mesa_Select.CAM_MESA_IFRAMEWEB+".html?"+extraVars;
    
                                const popupContentTemplate = function (container) {
                                    return $('<div style="height:100%;">').append(
                                        '<iframe src='+UrlPop+' width="100%" height="100%" scrolling="auto" frameBorder="0" style=" flex-shrink: 1;flex-basis: auto;flex: 1; flex-grow: 1;"></iframe>'
                                    );
                                };
    
                                $("#Pop_Mesa_Ayuda_Config").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                                $('#Pop_Mesa_Ayuda_Config').dxPopup("show");
                            }
                            else{
                                DevExpress.ui.notify("Error no se identifico mesa de ayuda", "error", 3000); 
                            }
                        }
                        else{
                            DevExpress.ui.notify("SELECCIONE SOLO UN REGISTRO A VER", 'info', 3000);
                        }
                    }
                }
            }
        });

        /**POPUP PARA REASIGNAR SOLICITUDES**/
        $("#Popup_Reasignar_Ticket").dxPopup({
            hideOnOutsideClick:false,
            title: "Reasignar",
            height: 150,  
            width: 350,
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onShowing: function (e) {
            },
            onHiding: function (e) {
                $__Form_Reasigna_Tickets.option("formData",{});
            },
            contentTemplate: function (e) {
                e.attr({"style": "display: flex; flex-direction: column;"});
                e.append(
                    $("<div />").attr({"id": "__Form_Reasigna_Tickets","style": "border: solid red 0px; padding: 5px; margin-bottom: 5px;"}).dxForm({
                        readOnly: false,
                        showColonAfterLabel: true,
                        showValidationSummary: false,
                        validationGroup: '__Form_Reasigna_Tickets_Validate',
                        colCount:1,
                        labelMode: 'static',
                        labelLocation: 'top',
                        width: "100%",
                        onInitialized:function(e){
                            $__Form_Reasigna_Tickets = e.component;
                        },
                        items: [{
                            colSpan: 1,
                            editorType: "dxSelectBox",
                            dataField: "EMPLEADO_CSC_EMPLEADO_ASIGNADO",
                            label: { text: "Empleado al que se Reasignara"},
                            editorOptions: {
                                searchEnabled:true,
                                valueExpr: "EMPLEADO_CSC_EMPLEADO",
                                displayExpr: "NOMBRE",
                                onOpened: function(e){
                                    e.component.getDataSource().reload();
                                },
                                dataSource: new DevExpress.data.DataSource({
                                    loadMode:'raw',
                                    key: "EMPLEADO_CSC_EMPLEADO", 
                                    load: async function () {
                                        try {
                                            var _BusquedaEmpleados = {
                                                ...ReturnDefaultData_Init(),
                                                ...ReturnProcSubProcEstatus(),
                                                TPO_USUARIO: "EMP_ADMIN_MESA",
                                                CAM_MESA_CSC: self.Mesa_Seleccionada
                                            };
                                            return __Reques_ajax( getJSON(DeveloperType).ApiTickets_v2.url+'Get_Mesa_Empleado',"GET", _BusquedaEmpleados, getJSON(DeveloperType).ApiTickets_v2.token ).then(function(dataRequest){
                                                if (dataRequest.success == true) { return dataRequest.JsonData; } else { console.log(dataRequest.message ); }
                                            }); 
                                        }
                                        catch (error) { console.log(error); }
                                    }
                                })
                            },
                            validationRules: [{type: 'required',message: 'Requerido'}]
                        },{
                            itemType: "button",
                            location: 'before',
                            locateInMenu: 'auto',
                            buttonOptions: {
                                stylingMode: "contained",
                                type: "success",
                                width:'100%',
                                icon: 'fa fa-floppy-o',
                                text: "REASIGNAR",
                                onInitialized: function(e) {  
                                    $Btn_Reasignar_Folio_ = e.component;
                                },
                                onClick: async function () {
                                    loadPanel.show();
                                    
                                    if ( $__Form_Reasigna_Tickets.validate().isValid === true) {

                                        var Empleado_Seleccionado = $__Form_Reasigna_Tickets.getEditor("EMPLEADO_CSC_EMPLEADO_ASIGNADO").option("selectedItem");
                                        var Tickets_Seleccionados = $__DataGrid_Asignacion_Tikets.getSelectedRowsData();
                                    
                                        for(var i = 0; i < Tickets_Seleccionados.length; i++){
                                            await self.Update_Asignacion_Empleado(Tickets_Seleccionados[i], Empleado_Seleccionado);
                                        }

                                        $__DataGrid_Asignacion_Tikets.option("dataSource",[]);

                                        $("#Popup_Reasignar_Ticket").dxPopup("hide");
                                        await self.Refresh_Panel_Asignacion();

                                        DevExpress.ui.notify("ASIGNACIÓN ACTUALIZADA", "success", 5000);
                                        loadPanel.hide();
                                    }
                                    else{
                                        loadPanel.hide();
                                        DevExpress.ui.notify("VALIDA LA INFORMACION E INTENTA NUEVAMENTE", "error", 5000);
                                    }
                                }
                            }
                        }]
                    })
                );
            }
        });


        $("#Pop_Mesa_Ayuda_Config").dxPopup({
            hideOnOutsideClick:false,
            title: "Detalles",
            height: '90%',  
            width: '80%',
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onHiding: function (e) {
                self.Refresh_Panel_Asignacion();
            },
            onShowing: function(e) {
                
            },
            onShown: function (e) {
            }
        });

        $("#__TreeView_Mesas_De_Ayuda").dxTreeView({
            dataSource:[],
            width:'100%',
            height:'100%',
            dataStructure: 'plain',
            parentIdExpr: 'ID_MESA_PARENT',
            keyExpr: 'ID_MESA',
            displayExpr:'DESCRIPCION_ITEM',
            selection: {
                mode: 'single',
                recursive: true,
            },
            itemTemplate(item) {
                var nodo = $("<div>").attr({"style":"padding-bottom: 5px; "})
                .append($('<img src="'+item.ICON+'" class="listicon" alt="Icon"/>'))
                .append($('<span style="font-size: 10px; padding-top: 4px; margin-top: 1px; display: inline-block; ">').text(item.DESCRIPCION_ITEM));

                return nodo;
            },
            onInitialized: async function(e){
                loadPanel.show();
                var New_List_Generate = new Array();
                $__TreeView_Mesas_De_Ayuda = e.component;

                new Promise( (resolve,reject)=>{
                    var Axiliares_Mesas = self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").DATA
                    Axiliares_Mesas.map(function(item){
                        New_List_Generate.push({
                            ID_MESA:item.CAM_MESA_CSC,
                            ID_MESA_PARENT:null,
                            DESCRIPCION_ITEM:item.CAM_MESA_IDIOMA1,
                            CLAVE:"MESA",
                            ICON:"../../images/Icons/Card-file-icon64.png",
                        });
                    });

                    setTimeout(function(){
                        $__TreeView_Mesas_De_Ayuda.option("dataSource", New_List_Generate);
                        loadPanel.hide();
                        resolve("resolve");
                    });
                });

            },
            onItemClick:function(itemSelect){
                loadPanel.show();
                var itemData = itemSelect.itemData;
                self.Mesa_Seleccionada = itemData.ID_MESA;
                self.Get_Asignacion_Casos(itemData.ID_MESA);
            }

        });

        /**DATAGRID DE CASOS ASIGNADOS**/
        $("#__DataGrid_Asignacion_Tikets").dxDataGrid({
            selection: { mode: "multiple" },
            deferRendering:true,
            rowAlternationEnabled: true,
            allowColumnResizing: true,
            columnResizingMode:'widget',
            showRowLines: true,
            showColumnLines: true,
            showBorders: true,
            groupPanel: { visible: true },
            grouping: { autoExpandAll: true },
            allowColumnReordering: true,
            filterRow: { visible: true, applyFilter: 'auto' },
            filterPanel: {visible:true},
            headerFilter: { visible: true },
            searchPanel: { visible: false },
            scrolling: { mode: 'virtual' },
            keyExpr: "TIC_CSCTICKET",
            columnWidth: 160,
            sortByGroupSummaryInfo: [{
                summaryItem: 'count',
            }],
            onInitialized:function(e){
                $__DataGrid_Asignacion_Tikets = e.component;
            },
            toolbar: {
                items: ["groupPanel",{
                    location: "after",
                    locateInMenu: "never",
                    widget: "dxButton",
                    options: {
                        width:250,
                        type: "default",
                        text: "REFRESCAR TABLERO",
                        icon: '../../images/Icons/order256.png',
                        onInitialized:function(e){
                            $__Refrescar_Tablero_Control = e.component;
                        },
                        onClick() {
                            self.Refresh_Panel_Asignacion();
                        }
                    }
                }]
            },
            summary: {
                groupItems: [{
                  column: 'TIC_CSCTICKET',
                  summaryType: 'count',
                  displayFormat: '{0} ' +  Globalize.formatMessage("TotalCount"),
                }],
                totalItems: [{
                    column: 'TIC_CSCTICKET',
                    summaryType: 'count',
                }]
            },
            columns: [{
                width: 100,
                caption: Globalize.formatMessage("lblidticket"),
                dataField: "TIC_CSCTICKET",
                fixed:true,
                fixedPosition:"left",
                alignment: "left",
                sortOrder: 'asc',
                sortIndex:2,
            },{
                caption: Globalize.formatMessage("lblasignacion"),
                dataField: "ASIGNACION_TICKET_GRID",
                width: 150,
                fixed:true,
                alignment: "left",
                sortOrder: 'desc',
                sortIndex:1,
                cellTemplate: function(container, cellInfo) {
                    const valueDiv = $("<div>").text(cellInfo.value);
                    if (cellInfo.value == 'ASIGNADO') {
                        $('<div>')
                        .css("height", "16px")
                        .css("width", "16px")
                        .css("background-color", "#23A521")
                        .css("border-radius", "50%")
                        .css("border", "double 3px #23A521")
                        .css("float", "left")
                        .css("margin-right", "5px")
                        .appendTo(container);
                    } else{
                        $('<div>')
                        .css("height", "16px")
                        .css("width", "16px")
                        .css("background-color", "#1E5799")
                        .css("border-radius", "50%")
                        .css("border", "double 3px #1E5799")
                        .css("float", "left")
                        .css("margin-right", "5px")
                        .appendTo(container);
                    }
                    return valueDiv;
                },
                calculateCellValue: function(rowData) {
                    if (rowData.EMPLEADO_CSC_ATIENDE == null) {
                        return "SIN ASIGNAR";
                    } else {
                        return "ASIGNADO";
                    }
                }
            },{
                width:150,
                caption: Globalize.formatMessage("lblmesa"),
                dataField: "CAM_MESA_CSC",
                alignment: "left",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").KEYID
                }
            },{
                width:150,
                caption: Globalize.formatMessage("lblproceso"),
                dataField: "ESTATUS_TICKET_CSC",
                alignment: "left",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_ESTATUS_TICKET").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_ESTATUS_TICKET").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_ESTATUS_TICKET").KEYID
                }
            },{
                width:150,
                caption: Globalize.formatMessage("lblclstipifica"),
                dataField: "TIPIFICA_CSC_PARENT_PARENT",
                alignment: "left",
                lookup: {
                    dataSource: (new Array()).concat(self.Content_Full_Tipificaciones),
                    displayExpr: "TIPIFICA_IDIOMA1",
                    valueExpr: "TIPIFICA_CSC",
                }
            },{
                width:150,
                caption: Globalize.formatMessage("lbltipotipifica"),
                dataField: "TIPIFICA_CSC_PARENT",
                alignment: "left",
                lookup: {
                    dataSource: (new Array()).concat(self.Content_Full_Tipificaciones),
                    displayExpr: "TIPIFICA_IDIOMA1",
                    valueExpr: "TIPIFICA_CSC",
                }
            },{
                width:150,
                caption: Globalize.formatMessage("lbltipificacion"),
                dataField: "TIPIFICA_CSC",
                alignment: "left",
                lookup: {
                    dataSource: (new Array()).concat(self.Content_Full_Tipificaciones),
                    displayExpr: "TIPIFICA_IDIOMA1",
                    valueExpr: "TIPIFICA_CSC",
                }
            },{
                width:150,
                caption: Globalize.formatMessage("lblprioridad"),
                dataField: "TIPO_PRIORIDAD_CSC",
                alignment: "left",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_PRIORIDAD_TICKET").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_PRIORIDAD_TICKET").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_PRIORIDAD_TICKET").KEYID
                }
            },{
                caption: Globalize.formatMessage("lblempsolicita"),
                dataField: "TIC_SOLICITA",
                alignment: "left",
            },{
                caption: Globalize.formatMessage("lblempatiende"),
                dataField: "NOM_EMP_ATN",
                alignment: "left"
            },{
                width:150,
                caption: Globalize.formatMessage("lblubicacion"),
                dataField: "REQ_CSCREQUISICION",
                alignment: "left",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_REQUISICIONES").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_REQUISICIONES").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_REQUISICIONES").KEYID
                }
            },{
                caption: Globalize.formatMessage("lblclientes"),
                dataField: "NOM_EMP_SOL",
                alignment: "left"
            },{
                width:150,
                caption: Globalize.formatMessage("lblproyecto"),
                dataField: "PM_CSC_PROYECTO_SOLICITA",
                alignment: "left",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_PROYECTOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_PROYECTOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_PROYECTOS").KEYID
                }
            },{
                width:150,
                caption: Globalize.formatMessage("lblcampania"),
                dataField: "CAM_CSC_SERVICIO_SOLICITA",
                alignment: "left",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").KEYID
                }
            },{
                caption: Globalize.formatMessage("lblfechaalta"),
                dataField: "fecha_alta_timezone",
                alignment: "center",
            },{
                caption: Globalize.formatMessage("lblfechasolicita"),
                dataField: "fecha_solicita_timezone",
                alignment: "center",
                dataType : "datetime",
                format : "dd/MM/yyyy HH:mm:ss",
            },{
                caption: Globalize.formatMessage("lblfechapromesa"),
                dataField: "fecha_promesa_timezone",
                alignment: "center",
                dataType : "datetime",
                format : "dd/MM/yyyy HH:mm:ss",
            },{
                caption: Globalize.formatMessage("lblsla"),
                width: 150,
                alignment: "center",
                calculateCellValue: function(rowData) {
                    if (rowData.TIC_TIEMPO_EJECUCION == 0) {
                        var d = moment.duration(self.FechaPromesaDefecto, 'seconds');
                        if (d._isValid == false) {
                            return 'Sin Gestionar';
                        } else {
                            return ('0' + d.days()).slice(-2) + 'd ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                        }
                    } else {
                        var d = moment.duration(rowData.TIC_TIEMPO_EJECUCION, 'seconds');
                        if (d._isValid == false) {
                            return 'Sin Gestionar';
                        } else {
                            return ('0' + d.days()).slice(-2) + 'd ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                        }
                    }
                    
                }
            },{
                caption: Globalize.formatMessage("lblcumplesla"),
                dataField: "CAMP_CUMPLE_SLA",
                width: 150,
                alignment: "center",
                cellTemplate: function(container, cellInfo) {
                    const valueDiv = $("<div>").text(cellInfo.value);
                    if (cellInfo.value == 'Vencido') {
                        $('<div>')
                        .css("height", "16px")
                        .css("width", "16px")
                        .css("background-color", "red")
                        .css("border-radius", "50%")
                        .css("border", "double 3px red")
                        .css("float", "left")
                        .appendTo(container);
                    } else{
                        $('<div>')
                        .css("height", "16px")
                        .css("width", "16px")
                        .css("background-color", "#299A0B")
                        .css("border-radius", "50%")
                        .css("border", "double 3px #299A0B")
                        .css("float", "left")
                        .appendTo(container);
                    }
                    return valueDiv;
                },
                calculateCellValue: function(rowData) {
                    if (rowData.TIC_CERRADO == 1) {
                        var now  = rowData.TIC_FECHA_CIERRE;
                        var then = rowData.TIC_FECHA_ALTA;
                        var m1 = moment(then);
                        var m2 = moment(now);
                        var m3 = m2.diff(m1,'seconds');
                        var tejec = rowData.TIC_TIEMPO_EJECUCION;
                        if (tejec == 0) {
                            if (m3 > self.FechaPromesaDefecto) {
                                return "Resuelto fuera de SLA";//tejec + ' / ' + m3
                            } else {
                                return "Resuelto en tiempo";//tejec + ' / ' + m3
                            }
                        } else {
                            if (m3 > tejec) {
                                return "Resuelto fuera de SLA";//tejec + ' / ' + m3
                            } else {
                                return "Resuelto en tiempo";//tejec + ' / ' + m3
                            }
                        }
                    } else {
                        var now  = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                        var then = rowData.TIC_FECHA_ALTA;
                        var m1 = moment(then);
                        var m2 = moment(now);

                        var m3 = m2.diff(m1,'seconds');
                        var tejec = rowData.TIC_TIEMPO_EJECUCION;
                        if (m3 > tejec) {
                            return "Vencido"
                        } else {
                            return "En Tiempo"
                        }                            
                    }
                }
            },{
                caption: Globalize.formatMessage("lbltranscurrido"),
                dataField: "TRANSCURRIDOS",
                alignment: "center",
                width: 150,
                calculateCellValue: function(rowData) {
                    if (rowData.TIC_CERRADO == 1) {
                        var now  = rowData.TIC_FECHA_CIERRE;
                        var then = rowData.TIC_FECHA_ALTA;
                        var m1 = moment(then);
                        var m2 = moment(now);
                        var m3 = m2.diff(m1,'miliseconds');
                        var d = moment.duration(m3);
                        if (d._isValid == false) {
                            return 'Sin Gestionar';
                        } else {
                            return ('0' + d.days()).slice(-2) + ' d ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                        }
                    }
                    else {
                        var now  = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                        var then = rowData.TIC_FECHA_ALTA;
                        var m1 = moment(then);
                        var m2 = moment(now);
                        var m3 = m2.diff(m1,'miliseconds');
                        var d = moment.duration(m3);
                        if (d._isValid == false) {
                            return 'Sin Gestionar';
                        } else {
                            return ('0' + d.days()).slice(-2) + ' d ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                        }
                    }
                }
            },{
                caption: Globalize.formatMessage("lblstado"),
                dataField: "ESTADO_TICKET_GRIG",
                width: 130,
                fixed:true,
                fixedPosition:"right",
                alignment: "left",
                sortOrder: 'desc',
                sortIndex:0,
                calculateCellValue: function(rowData) {
                    if (rowData.TIC_CERRADO == 1) {
                        return "CERRADO";
                    } else {
                        var m1 = moment().format('YYYY-MM-DD HH:mm:ss');
                        var m2 = moment(rowData.TIC_FECHA_PROMESA).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                        var fecha1 = new Date(m1);
                        var fecha2 = new Date(m2);
                        if (fecha1 > fecha2) {
                            return "VENCIDA"
                        } else if (fecha1 < fecha2) {
                            return "EN TIEMPO"
                        } else {
                            return "EN TIEMPO"
                        }                    
                    }
                },
                cellTemplate: function(container, cellInfo) {
                    const valueDiv = $("<div>").text(cellInfo.value);
                    if (cellInfo.value == 'VENCIDA') {
                        valueDiv.css({"color":"white", "background-color":"red","text-align":"center"});
                    } else{
                        valueDiv.css({"color":"white", "background-color":"green","text-align":"center"});
                    }
                    return valueDiv;
                }
            }]
        });

        self.Refresh_Panel_Asignacion();
    };



    /**LEE TODOS LOS CATALOGOS NECESARIOS PARA LA SOLICITUD**/
    self.Load_Full_Catalogs = async function() {

        self.Content_Full_Catalogs = {
            "SAMT_CLIENTES":{
                DATA:[],
                KEYID:"CLIENTE_CSC",
                TEXT:"CLIENTE_NOMBRE",
                ACTIVE:""
            },
            "SAMT_PROYECTOS":{
                DATA:[],
                KEYID:"PM_CSC_PROYECTO",
                TEXT:"PM_NOMBRE",
                ACTIVE:"PM_CERRADO_ABIERTO"
            },
            "SAMT_CAM_SERVICIO":{
                DATA:[],
                KEYID:"CAM_CSC_SERVICIO",
                TEXT:"CAM_SERVICIO_NOMBRE",
                ACTIVE:"CAM_ACTIVA"
            },
            "SAMT_CAM_MESA_DE_AYUDA":{
                DATA:[],
                KEYID:"CAM_MESA_CSC",
                TEXT:"CAM_MESA_IDIOMA1",
                ACTIVE:"CAM_MESA_ACTIVO"
            },
            "SAMT_ESTATUS_TICKET":{
                DATA:[],
                KEYID:"ESTATUS_TICKET_CSC",
                TEXT:"ESTATUS_TICKET_IDIOMA1",
                ACTIVE:"ESTATUS_TICKET_ACTIVO"
            },
            "SAMT_TIPO_PRIORIDAD_TICKET":{
                DATA:[],
                KEYID:"TIPO_PRIORIDAD_CSC",
                TEXT:"TIPO_PRIORIDAD_IDIOMA1",
                ACTIVE:"TIPO_PRIORIDAD_ACTIVO"
            },
            "SAMT_REQUISICIONES":{
                DATA:[],
                KEYID:"REQ_CSCREQUISICION",
                TEXT:"REQ_NOMBREAREA",
                ACTIVE:"REQ_INDICADIRCREADO"
            }
        };

        for (const key in self.Content_Full_Catalogs) {
            await new Promise( async resolve  => {
                await self.Get_Cat_DataBase(key)
                .then(function(data){ console.log(data.success); resolve('resolved'); })
                .catch(function(err){ DevExpress.ui.notify('ERROR AL OBTENER CATALOGO');  resolve('resolved'); });
            });
        }
    };


    /**LEE DESDE BASE UNO POR UNO LOS CATALOGOS PARA ALMACENARLOS EN UNS VARIBLE**/
    self.Get_Cat_DataBase = function(TBL){
        return new Promise( (resolve,reject)=>{
            var DataGetCatalog = {Tbl:TBL};
            __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',DataGetCatalog,getJSON(DeveloperType).ApiGeneral.token).then((DataResponse)=>{
                if (DataResponse.success == true) { self.Content_Full_Catalogs[TBL].DATA =  (new Array()).concat(DataResponse.JsonData); } else { self.Content_Full_Catalogs[TBL].DATA =  new Array(); }
                resolve(DataResponse);
            }).catch(function(e){
                reject({success:false});
            });
        });
    }


    /**RECUPERA LOS CATALOGOS DESDE LA VARIABLE**/
    self.Get_Config_Cat_local = function(TBL){
        var Cat_Confi = Object.assign({}, self.Content_Full_Catalogs[TBL] );
        return Cat_Confi;
    }


    /**LEE DESDE BASE ES CATALOGO DE PAISES**/
    self.Get_Cat_Tipificaciones = function(){
        return new Promise( (resolve,reject)=>{
            var DataGetCatalog = {
                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                Type: localStorage.getItem('Type')
            };
            __Get_catalogos(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Simple_Tipificaciones','GET',DataGetCatalog,getJSON(DeveloperType).ApiTickets_v2.token).then((DataResponse)=>{
                if (DataResponse.success == true) { 
                    self.Content_Full_Tipificaciones =  DataResponse.JsonData;
                }
                else {
                    self.Content_Full_Tipificaciones = new Array();
                }
                resolve(DataResponse);
            }).catch(function(e){
                reject({success:false});
            });
        });
    };

    /**CARGA LA INFORMACIO DE LA SOLICITUDES ASIGNADA AL EMPLEAO **/
    self.Get_Asignacion_Casos = function(ID_MESA){
        var SearchTicket = {
            ...ReturnDefaultData_Init(),
            CAM_MESA_CSC:ID_MESA,
            TIC_CERRADO:0
        };

        return new Promise( (resolve,reject)=>{
            __Request_Http_Mode(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Servicio','GET',SearchTicket,getJSON(DeveloperType).ApiTickets_v2.token).then((all_data)=>{
                if (all_data.success == true) {
                    $__DataGrid_Asignacion_Tikets.option("dataSource",all_data.JsonData);
                }
                else{
                    $__DataGrid_Asignacion_Tikets.option("dataSource",[]);
                }
                loadPanel.hide();
                resolve(all_data);
            }).catch(function(e){
                $__DataGrid_Asignacion_Tikets.option("dataSource",[]);
                reject({success:false});
            });
        });
    };


    /**FUNCION PARA REFRESCAR TODOS LOS DATA GRIDS DE LA ASIGNACION*/
    self.Refresh_Panel_Asignacion = async function(){
        loadPanel.show();
        if(self.Mesa_Seleccionada != null){
            await self.Get_Asignacion_Casos(self.Mesa_Seleccionada);
        }
        else{
            loadPanel.hide();
        }
        loadPanel.hide();
        //await self.Get_Escalaciones_Empleado();
    }


    self.Update_Asignacion_Empleado = async function(Ticket_Seleccionado,Empleado_Seleccionado){
        return new Promise((resolve, reject) => {
            var Obj_Update_Ticket = {
                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                Type:localStorage.getItem('Type'),
                DATA_UPDATE:{
                    AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                    AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    EMPLEADO_CSC_ATIENDE:Empleado_Seleccionado.EMPLEADO_CSC_EMPLEADO
                },
                DATA_WHERE:{
                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    TIC_CSCTICKET:Ticket_Seleccionado.TIC_CSCTICKET,
                    TIC_NEWID:Ticket_Seleccionado.TIC_NEWID
                }
            }

            __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Update_Ticket_Servicio','POST',JSON.stringify(Obj_Update_Ticket),getJSON(DeveloperType).ApiTickets_v2.token).then(async (DataResponse)=>{
                if (DataResponse.success == true) {

                    var Object_Bitacora_Insert = {
                        ...ReturnDefaultData_Init(),
                        EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                        Type:localStorage.getItem('Type'),
                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                        DATA_INSERT:{
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            ESTATUS_TICKET_CSC:Ticket_Seleccionado.ESTATUS_TICKET_CSC,
                            SAMT_TICKET_SUBTIPO_BITACORA_CSC:3,
                            TIB_DESCRIPCION:`Empleado Atiende: Cambio de '${Ticket_Seleccionado.NOM_EMP_ATN}' a '${Empleado_Seleccionado.NOMBRE}' `,
                            TIB_FECHAHORA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            TIB_NOMBRE:obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO,
                            TIC_CSCTICKET:Ticket_Seleccionado.TIC_CSCTICKET,
                            EMPLEADO_CSC_EMPLEADO:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                            AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                        }
                    };
                    __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Insert_Bitacora_Ticket','POST',JSON.stringify(Object_Bitacora_Insert),getJSON(DeveloperType).ApiTickets_v2.token).then(async (DataResponse)=>{
                        if (DataResponse.success == true) {
                            resolve(DataResponse);
                        }
                        else{
                            DevExpress.ui.notify("NO SE PUDO ACTUALIZAR TICKET", 'error', 3000);
                            reject(DataResponse) 
                        }
                    }).catch(function(err){
                        DevExpress.ui.notify("NO SE PUDO INSRTAR BITACORA VALIDE SU CONEXION", 'error', 3000);
                        reject(err) 
                    });
                }
                else{
                    DevExpress.ui.notify("NO SE PUDO ACTUALIZAR TICKET", 'error', 3000);
                    reject(DataResponse) 
                }
            }).catch(function(err){
                DevExpress.ui.notify("NO SE PUDO ACTUALIZAR TICKET VALIDE SU CONEXION", 'error', 3000);
                reject(err) 
            });
        });
    };
};


setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);