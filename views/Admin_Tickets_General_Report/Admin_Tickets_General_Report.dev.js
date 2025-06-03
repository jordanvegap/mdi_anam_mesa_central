SalesDashboard.dashboardModel = function() {
    let self = this;
    let obj_DatosEmpleado = null;
    this.Estatus = null;
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

    self.init = async function() {

        await self.Load_Full_Catalogs();
        await self.Get_Cat_Tipificaciones();

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
                { title: "Grid General", template: "tab_gridGeneral", icon: "./images/Icons/Todos.png" },
                { title: "Cubos de información", template: "tab_cubo", icon: "./images/Icons/3d.png" }
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
                                let PreLoad = {
                                    EMPLEADO_CSC_ATIENDE: obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                    TIC_CERRADO: 0
                                }
                                self.__Temp_Ult_Consulta = PreLoad;
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
                enabled: true
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
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Solicitudes_'+moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')+'.xlsx'); 
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
                },{
                    caption: "MESA DE AYUDA",
                    dataField: "CAM_MESA_CSC",
                    alignment: "left",
                    lookup: {
                        dataSource: self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").DATA,
                        displayExpr: self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").TEXT,
                        valueExpr: self.Get_Config_Cat_local("SAMT_CAM_MESA_DE_AYUDA").KEYID
                    }
                },{
                    caption: "PROCESO",
                    dataField: "ESTATUS_TICKET_CSC",
                    alignment: "left",
                    lookup: {
                        dataSource: self.Get_Config_Cat_local("SAMT_ESTATUS_TICKET").DATA,
                        displayExpr: self.Get_Config_Cat_local("SAMT_ESTATUS_TICKET").TEXT,
                        valueExpr: self.Get_Config_Cat_local("SAMT_ESTATUS_TICKET").KEYID
                    }
                },{
                    caption: "CLASE TIPIFICACION",
                    dataField: "TIPIFICA_CSC_PARENT_PARENT",
                    alignment: "left",
                    lookup: {
                        dataSource: (new Array()).concat(self.Content_Full_Tipificaciones),
                        displayExpr: "TIPIFICA_IDIOMA1",
                        valueExpr: "TIPIFICA_CSC",
                    }
                },{
                    caption: "TIPO TIPIFICACION",
                    dataField: "TIPIFICA_CSC_PARENT",
                    alignment: "left",
                    lookup: {
                        dataSource: (new Array()).concat(self.Content_Full_Tipificaciones),
                        displayExpr: "TIPIFICA_IDIOMA1",
                        valueExpr: "TIPIFICA_CSC",
                    }
                },{
                    caption: "TIPIFICACION",
                    dataField: "TIPIFICA_CSC",
                    alignment: "left",
                    lookup: {
                        dataSource: (new Array()).concat(self.Content_Full_Tipificaciones),
                        displayExpr: "TIPIFICA_IDIOMA1",
                        valueExpr: "TIPIFICA_CSC",
                    }
                },{
                    caption: "CLIENTE SOLICITA",
                    dataField: "CLIENTE_CSC_SOLICITA",
                    alignment: "left",
                    lookup: {
                        dataSource: self.Get_Config_Cat_local("SAMT_CLIENTES").DATA,
                        displayExpr: self.Get_Config_Cat_local("SAMT_CLIENTES").TEXT,
                        valueExpr: self.Get_Config_Cat_local("SAMT_CLIENTES").KEYID
                    }
                },{
                    caption: "SERVICIO",
                    dataField: "PM_CSC_PROYECTO_SOLICITA",
                    alignment: "left",
                    lookup: {
                        dataSource: self.Get_Config_Cat_local("SAMT_PROYECTOS").DATA,
                        displayExpr: self.Get_Config_Cat_local("SAMT_PROYECTOS").TEXT,
                        valueExpr: self.Get_Config_Cat_local("SAMT_PROYECTOS").KEYID
                    }
                },{
                    caption: "PROVEEDOR",
                    dataField: "CAM_CSC_SERVICIO_SOLICITA",
                    alignment: "left",
                    lookup: {
                        dataSource: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").DATA,
                        displayExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").TEXT,
                        valueExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").KEYID
                    }
                },{
                    caption: "PRIORIDAD",
                    dataField: "TIPO_PRIORIDAD_CSC",
                    alignment: "left",
                    lookup: {
                        dataSource: self.Get_Config_Cat_local("SAMT_TIPO_PRIORIDAD_TICKET").DATA,
                        displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_PRIORIDAD_TICKET").TEXT,
                        valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_PRIORIDAD_TICKET").KEYID
                    }
                },{
                    caption: "SOLICITA",
                    dataField: "TIC_SOLICITA",
                    alignment: "left",
                },
                // {
                //     caption: "ATIENDE",
                //     dataField: "NOM_EMP_ATN",
                //     alignment: "left"
                // },
                {
                    caption: "UBICACIÓN",
                    dataField: "REQ_CSCREQUISICION",
                    alignment: "left",
                    lookup: {
                        dataSource: self.Get_Config_Cat_local("SAMT_REQUISICIONES").DATA,
                        displayExpr: self.Get_Config_Cat_local("SAMT_REQUISICIONES").TEXT,
                        valueExpr: self.Get_Config_Cat_local("SAMT_REQUISICIONES").KEYID
                    }
                },{
                    caption: "RUTA",
                    dataField: "TIC_SEGMENTACION_INM_DES",
                    alignment: "left",
    
                },{
                    caption: "FECHA ALTA",
                    dataField: "fecha_alta_timezone",
                    alignment: "center",
                    dataType : "datetime",
                    format : "dd/MM/yyyy HH:mm:ss",
                    // calculateCellValue: function(data) {
                    //     return moment(data.TIC_FECHA_ALTA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                    // }
                },{
                    caption: "FECHA SOLICITA",
                    dataField: "fecha_solicita_timezone",
                    alignment: "center",
                    dataType : "datetime",
                    format : "dd/MM/yyyy HH:mm:ss",
                    // calculateCellValue: function(rowData) {
                    //     let tm = (rowData.TIC_FECHA_SOLICITA != null) ? moment(rowData.TIC_FECHA_SOLICITA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss'): rowData.TIC_FECHA_PROMESA;
                    //     return tm;
                    // }
                },{
                    caption: "FECHA PROMESA",
                    dataField: "fecha_promesa_timezone",
                    alignment: "center",
                    dataType : "datetime",
                    format : "dd/MM/yyyy HH:mm:ss",
                    // calculateCellValue: function(rowData) {
                    //     if (rowData.TIC_FECHA_PROMESA == null) {
                    //         return moment(rowData.TIC_FECHA_ALTA).add(self.FechaPromesaDefecto,'seconds').format('DD/MM/YYYY HH:mm:ss') + ' (s)';
                    //     } else {
                    //         return moment(rowData.TIC_FECHA_PROMESA).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss');
                    //     }
                    // }
                },
                {
                    caption: "FECHA DE CIERRE",
                    dataField: "fecha_cierre_timezone",
                    alignment: "center",
                    dataType : "datetime",
                    format : "dd/MM/yyyy HH:mm:ss",
                    // calculateCellValue: function(data) {
                    //     if (data.TIC_FECHA_CIERRE) {
                    //         return moment(data.TIC_FECHA_CIERRE).add(self.TiempoUTCEmpleado,'hours').format('DD/MM/YYYY HH:mm:ss')
                    //     } else {
                    //         return '';
                    //     }
                        
                    // }
                },{
                    caption: "EDO. FECH. PROMESA",
                    width: 150,
                    alignment: "left",
                    calculateCellValue: function(rowData) {
                        if (rowData.TIC_CERRADO == 1 || rowData.TIC_FECHA_CIERRE != null) {
                            let now  = rowData.TIC_FECHA_CIERRE;
                            let then = null;
                            if (rowData.TIC_FECHA_PROMESA == null) {
                                then = moment(rowData.TIC_FECHA_ALTA).add(self.FechaPromesaDefecto,'seconds').format('YYYY-MM-DD HH:mm:ss');
                            } else {
                                then = rowData.TIC_FECHA_PROMESA;
                            }

                            let m1 = moment(then);
                            let m2 = moment(now);
                            if (m1 >= m2 ) {
                                return "CUMPLIDA"
                            } else {
                                return "NO CUMPLIDA"
                            }   
                        }
                    }
                },{
                    caption: "T. PROMESA/CIERRE",
                      dataField: "ttranfp",
                      alignment: "center",
                      width: 170,
                      calculateCellValue: function(rowData) {
  
                          if (rowData.TIC_CERRADO == 1 || rowData.TIC_FECHA_CIERRE != null) {
                              let now  = moment(rowData.TIC_FECHA_CIERRE).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                              let then = null;
  
                              if (rowData.TIC_FECHA_PROMESA == null) {
                                  then = moment(rowData.TIC_FECHA_ALTA).add(self.FechaPromesaDefecto,'seconds').format('YYYY-MM-DD HH:mm:ss');
                              } else {
                                  then = rowData.TIC_FECHA_PROMESA;
                              }
                              
                              let m1 = moment(now);
                              let m2 = moment(then);
                              let m3 = null;  
                              if (m1 <= m2) {
                                  m3 = m2.diff(m1,'miliseconds');
                                  let d = moment.duration(m3);
                                  if (d._isValid == false) {
                                      return 'Sin Gestionar';
                                  } else {
                                      return ('0' + d.days()).slice(-2) + ' d ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2) + ' (a)';    
                                  }
                              } else {
                                  m3 = m1.diff(m2,'miliseconds');
                                  let d = moment.duration(m3);
                                  if (d._isValid == false) {
                                      return 'Sin Gestionar';
                                  } else {
                                      return ('0' + d.days()).slice(-2) + ' d ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                                  }
                              }
                          }
                      }
                  },{
                    caption: "SLA",
                    width: 150,
                    alignment: "center",
                    calculateCellValue: function(rowData) {
                        if (rowData.TIC_TIEMPO_EJECUCION == 0) {
                            let d = moment.duration(self.FechaPromesaDefecto, 'seconds');
                            if (d._isValid == false) {
                                return 'Sin Gestionar';
                            } else {
                                return ('0' + d.days()).slice(-2) + 'd ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                            }
                        } else {
                            let d = moment.duration(rowData.TIC_TIEMPO_EJECUCION, 'seconds');
                            if (d._isValid == false) {
                                return 'Sin Gestionar';
                            } else {
                                return ('0' + d.days()).slice(-2) + 'd ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                            }
                        }
                        
                    }
                },{
                    caption: "CUMPLIMIENTO SLA",
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
                            let now  = rowData.TIC_FECHA_CIERRE;
                            let then = rowData.TIC_FECHA_ALTA;
                            let m1 = moment(then);
                            let m2 = moment(now);
                            let m3 = m2.diff(m1,'seconds');
                            let tejec = rowData.TIC_TIEMPO_EJECUCION;
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
                            let now  = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            let then = rowData.TIC_FECHA_ALTA;
                            let m1 = moment(then);
                            let m2 = moment(now);

                            let m3 = m2.diff(m1,'seconds');
                            let tejec = rowData.TIC_TIEMPO_EJECUCION;
                            if (m3 > tejec) {
                                return "Vencido"
                            } else {
                                return "En Tiempo"
                            }                            
                        }
                    }
                },{
                    caption: "T. TRANSCURRIDO",
                    dataField: "TRANSCURRIDOS",
                    alignment: "center",
                    width: 150,
                    calculateCellValue: function(rowData) {

                        if (rowData.TIC_CERRADO == 1) {
                            let now  = rowData.TIC_FECHA_CIERRE;
                            let then = rowData.TIC_FECHA_ALTA;
                            let m1 = moment(then);
                            let m2 = moment(now);
                            let m3 = m2.diff(m1,'miliseconds');
                            let d = moment.duration(m3);
                            if (d._isValid == false) {
                                return 'Sin Gestionar';
                            } else {
                                return ('0' + d.days()).slice(-2) + ' d ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                            }
                        } else {
                            let now  = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            let then = rowData.TIC_FECHA_ALTA;
                            let m1 = moment(then);
                            let m2 = moment(now);
                            let m3 = m2.diff(m1,'miliseconds');
                            let d = moment.duration(m3);
                            if (d._isValid == false) {
                                return 'Sin Gestionar';
                            } else {
                                return ('0' + d.days()).slice(-2) + ' d ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);    
                            }
                        }
                    }
                },
                
                {
                    caption: "ESTADO",
                    width: 170,
                    alignment: "center",
                    calculateCellValue: function(rowData) {

                        if (rowData.TIC_CERRADO == 1) {
                            return "CERRADO";
                        } 
                        else if (rowData.TIC_FECHA_CIERRE != null) {
                            return "ESPERA DE CALIFICACIÓN";
                        } 
                        else {
                            let m1 = moment().format('YYYY-MM-DD HH:mm:ss');
                            let m2 = moment(rowData.TIC_FECHA_PROMESA).add(self.TiempoUTCEmpleado,'hours').format('YYYY-MM-DD HH:mm:ss');
                            let fecha1 = new Date(m1);
                            let fecha2 = new Date(m2);
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
                            valueDiv.css({"color":"white", "background-color":"red"});
                        } else{
                            valueDiv.css({"color":"white", "background-color":"green"});
                        }
                        return valueDiv;
                    }
                },
                {
                    caption: "ASIGNACION",
                    width: 160,
                    fixed:true,
                    alignment: "center",
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
                            .appendTo(container);
                        } else{
                            $('<div>')
                            .css("height", "16px")
                            .css("width", "16px")
                            .css("background-color", "#1E5799")
                            .css("border-radius", "50%")
                            .css("border", "double 3px #1E5799")
                            .css("float", "left")
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
                setTimeout(() => {
                    AbrirPopMesaAyuda('EDITAR',e.data.CAM_MESA_CSC,e.data.TIC_NEWID) 
                }, 1000);
            }
             
        }).dxDataGrid('instance');


        self.PivotDataGridTickets = $("#PivotDG_Ticket_Admin").dxPivotGrid({
            allowSortingBySummary: true,
            allowSorting: true,
            allowFiltering: true,
            height: '100%',
            showBorders: true,
            fieldPanel: {
                showColumnFields: true,
                showDataFields: true,
                showFilterFields: true,
                showRowFields: true,
                allowFieldDragging: true,
                visible: true,
            },
            export: {
                enabled: true
            },
            fieldChooser: {
                enabled: true,
                applyChangesMode: 'instantly',
                allowSearch: true
            },
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'pivot_datagrid_report',
            },
            onExporting: function(e) { 
                let workbook = new ExcelJS.Workbook(); 
                let worksheet = workbook.addWorksheet('Hoja1'); 
                DevExpress.excelExporter.exportPivotGrid({ 
                    worksheet: worksheet, 
                    component: e.component,
                    customizeCell: function(options) {
                        let excelCell = options;
                        excelCell.font = { name: 'Arial', size: 12 };
                        excelCell.alignment = { horizontal: 'left' };
                    } 
                }).then(function() {
                    workbook.xlsx.writeBuffer().then(function(buffer) { 
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Solicitudes_'+moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')+'.xlsx'); 
                    }); 
                }); 
                e.cancel = true; 
            },
            dataSource: {
                fields: [{
                    caption: 'Conteo',
                    dataField: 'EMP_CSC_EMPRESA_HOST',
                    dataType: 'number',
                    summaryType: 'count',
                    area: 'data'
                },{
                    caption: '% Columna',
                    dataField: 'EMP_CSC_EMPRESA_HOST',
                    dataType: 'number',
                    summaryType: 'sum',
                    area: 'data',
                    summaryDisplayMode: 'percentOfColumnGrandTotal',
                },{
                    caption: '% Fila',
                    dataField: 'EMP_CSC_EMPRESA_HOST',
                    dataType: 'number',
                    summaryType: 'sum',
                    area: 'filter',
                    summaryDisplayMode: 'percentOfRowGrandTotal',
                },

                {
                    caption: 'Mesa',
                    dataField: 'CAM_MESA_CSC',
                    width: 150,
                    area: 'row',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAM_MESA_DE_AYUDA");
                    },
                    expanded: true
                },{
                    caption: 'Fecha Alta (Dia/Mes/Año)',
                    area: 'row',
                    expanded: false,
                    selector: function(data) {
                        if(data.fecha_alta_timezone == null){
                            return null;
                        }
                        else{
                            return moment(data.fecha_alta_timezone).format("DD/MM/YYYY")
                        }
                    },
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            return cellInfo.value;
                        }
                    }
                },{
                    caption: 'Tipo De Ticket',
                    dataField: 'TIPO_TICKET_CSC',
                    area: 'column',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_TICKET");
                    },
                    expanded: true
                },

            
                {
                    caption: 'Fecha de Cierre (Desconcatenado)',
                    dataField: 'fecha_cierre_timezone',
                    dataType: 'date',
                    area: 'filter',
                    expanded: false
                },{
                    caption: 'Año de Cierre',
                    groupName: 'fecha_cierre_timezone',
                    groupInterval: 'year',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Año " +cellInfo.value
                        }
                    }
                },{
                    caption: 'Cuatrimestre de Cierre ',
                    groupName: 'fecha_cierre_timezone',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes de Cierre',
                    groupName: 'fecha_cierre_timezone',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia de Cierre',
                    groupName: 'fecha_cierre_timezone',
                    groupInterval: 'day',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Dia " +cellInfo.value
                        }
                    }
                },{
                    caption: 'Atiende',
                    dataField: 'NOM_EMP_ATN',
                    area: 'filter',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            return cellInfo.value;
                        }
                    }
                },{
                    caption: 'Atiende',
                    dataField: 'NOM_EMP_ATN',
                    area: 'filter',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            return cellInfo.value;
                        }
                    }
                },{
                    caption: 'Clase Tipificación',
                    dataField: 'TIPIFICA_CSC_PARENT_PARENT',
                    area: 'filter',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            var columDataArray = jslinq( self.Content_Full_Tipificaciones  ).where(function(el) {
                                return  el.TIPIFICA_CSC == cellInfo.value ;
                            }).toList();
                    
                            if(columDataArray.length == 0){
                                return cellInfo.value;
                            }
                            else{
                                return columDataArray[0].TIPIFICA_IDIOMA1;
                            }
                        }
                    }
                },{
                    caption: 'Tipo Tipificación',
                    dataField: 'TIPIFICA_CSC_PARENT',
                    area: 'filter',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            var columDataArray = jslinq( self.Content_Full_Tipificaciones  ).where(function(el) {
                                return  el.TIPIFICA_CSC == cellInfo.value ;
                            }).toList();
                    
                            if(columDataArray.length == 0){
                                return cellInfo.value;
                            }
                            else{
                                return columDataArray[0].TIPIFICA_IDIOMA1;
                            }
                        }
                    }
                },{
                    caption: 'Tipificación',
                    dataField: 'TIPIFICA_CSC',
                    area: 'filter',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            var columDataArray = jslinq( self.Content_Full_Tipificaciones  ).where(function(el) {
                                return  el.TIPIFICA_CSC == cellInfo.value ;
                            }).toList();
                    
                            if(columDataArray.length == 0){
                                return cellInfo.value;
                            }
                            else{
                                return columDataArray[0].TIPIFICA_IDIOMA1;
                            }
                        }
                    }
                },{
                    caption: 'Cliente',
                    dataField: 'CLIENTE_CSC_SOLICITA',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CLIENTES");
                    },
                    expanded: true
                },{
                    caption: 'Servicio',
                    dataField: 'PM_CSC_PROYECTO_SOLICITA',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_PROYECTOS");
                    },
                    expanded: true
                },{
                    caption: 'Proveedor',
                    dataField: 'CAM_CSC_SERVICIO_SOLICITA',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAM_SERVICIO");
                    },
                    expanded: true
                },{
                    caption: 'Inmueble',
                    dataField: 'REQ_CSCREQUISICION',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_REQUISICIONES");
                    },
                    expanded: true
                },{
                    caption: 'Canal',
                    dataField: 'SAMT_CAM_TIPO_SERVICIO_CSC',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAM_TIPO_SERVICIO");
                    },
                    expanded: true
                },{
                    caption: 'Solicita',
                    dataField: 'TIC_SOLICITA',
                    area: 'filter',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            return cellInfo.value;
                        }
                    }
                },{
                    caption: 'Severidad',
                    dataField: 'TIPO_SEVERIDAD_CSC',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_SEVERIDAD");
                    },
                    expanded: true
                },{
                    caption: 'Prioridad',
                    dataField: 'TIPO_PRIORIDAD_CSC',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_PRIORIDAD_TICKET");
                    },
                    expanded: true
                },{
                    caption: 'A/C Estatus',
                    dataField: 'TIC_CERRADO',
                    area: 'filter',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            if(cellInfo.value == true || cellInfo.value == 1){
                                return "Cerrado";
                            }
                            else{
                                return "Abierto";
                            }
                        }
                    }
                },{
                    caption: 'Calificacíon',
                    dataField: 'TIPO_CALIFICACION_CSC',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_CALIFICACION");
                    },
                    expanded: true
                },{
                    caption: 'Proceso',
                    dataField: 'ESTATUS_TICKET_CSC',
                    width: 150,
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_ESTATUS_TICKET");
                    },
                    expanded: true
                },
                {
                    caption: 'Fecha de Alta (Desconcatenado)',
                    dataField: 'fecha_alta_timezone',
                    dataType: 'date',
                    area: 'filter',
                    expanded: false
                },{
                    caption: 'Año de Alta',
                    groupName: 'fecha_alta_timezone',
                    groupInterval: 'year',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Año " +cellInfo.value
                        }
                    }
                },{
                    caption: 'Cuatrimestre de Alta ',
                    groupName: 'fecha_alta_timezone',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes de Alta',
                    groupName: 'fecha_alta_timezone',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia de Alta',
                    groupName: 'fecha_alta_timezone',
                    groupInterval: 'day',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Dia " +cellInfo.value
                        }
                    }
                },
                {
                    caption: 'Hora de Alta',
                    area: 'filter',
                    expanded: false,
                    selector: function(data) {
                        if(data.fecha_alta_timezone == null){
                            return null;
                        }
                        else{
                            return parseInt( moment(data.fecha_alta_timezone).format("HH") )
                        }
                    },
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            return cellInfo.value + " Horas";
                        }
                    }
                },{
                    caption: 'Fecha De Cierre (Dia/Mes/Año)',
                    area: 'filter',
                    expanded: false,
                    selector: function(data) {
                        if(data.fecha_cierre_timezone == null){
                            return null;
                        }
                        else{
                            return moment(data.fecha_cierre_timezone).format("DD/MM/YYYY")
                        }
                    },
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            return cellInfo.value;
                        }
                    }
                },{
                    caption: 'Hora de Cierre',
                    area: 'filter',
                    expanded: false,
                    selector: function(data) {
                        if(data.fecha_cierre_timezone == null){
                            return null;
                        }
                        else{
                            return parseInt( moment(data.fecha_cierre_timezone).format("HH") )
                        }
                    },
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato";
                        }
                        else{
                            return cellInfo.value + " Horas";
                        }
                    }
                },
                {
                    caption: 'Fecha Promesa (Desconcatenado)',
                    dataField: 'fecha_promesa_timezone',
                    dataType: 'date',
                    expanded: false
                },{
                    caption: 'Año Promesa',
                    groupName: 'fecha_promesa_timezone',
                    groupInterval: 'year',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Año " +cellInfo.value
                        }
                    }
                },{
                    caption: 'Cuatrimestre Promesa ',
                    groupName: 'fecha_promesa_timezone',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Promesa',
                    groupName: 'fecha_promesa_timezone',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Promesa',
                    groupName: 'fecha_promesa_timezone',
                    groupInterval: 'day',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Dia " +cellInfo.value
                        }
                    }
                },                {
                    caption: 'Fecha Solicita (Desconcatenado)',
                    dataField: 'fecha_solicita_timezone',
                    dataType: 'date',
                    expanded: false
                },{
                    caption: 'Año Solicita',
                    groupName: 'fecha_solicita_timezone',
                    groupInterval: 'year',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Año " +cellInfo.value
                        }
                    }
                },{
                    caption: 'Cuatrimestre Solicita ',
                    groupName: 'fecha_solicita_timezone',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Solicita',
                    groupName: 'fecha_solicita_timezone',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Solicita',
                    groupName: 'fecha_solicita_timezone',
                    groupInterval: 'day',
                    expanded: false,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return "Dia " +cellInfo.value
                        }
                    }
                },{
                    caption: 'Tiempo Ejecusión',
                    dataField: 'TIC_TIEMPO_EJECUCION',
                    expanded: true
                },{
                    caption: 'Tiempo Recepción',
                    dataField: 'TIC_TIEMPO_RECEPCION',
                    expanded: true
                },{
                    caption: 'Nombre Empleado Solicita',
                    dataField: 'NOM_EMP_SOL',
                    expanded: true
                },

                {
                    dataField: 'AUDITORIA_FEC_ALTA',
                    visible:false
                },{
                    dataField: 'AUDITORIA_FEC_ULT_MOD',
                    visible:false
                },{
                    dataField: 'AUDITORIA_USU_ALTA',
                    visible:false
                },{
                    dataField: 'AUDITORIA_USU_ULT_MOD',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CSC_ATIENDE',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CSC_SOLICITA',
                    visible:false
                },{
                    dataField: 'INM_CSCINMUEBLE',
                    visible:false
                },{
                    dataField: 'SAMT_TICKET_TIPO_ACTUALIZA_CSC',
                    visible:false
                },{
                    dataField: 'SEG_CSC_SEGMENTACION_INM',
                    visible:false
                },{
                    dataField: 'SUB_ESTATUS_TICKET_CSC',
                    visible:false
                },{
                    dataField: 'TIC_ASUNTO_ORIGEN',
                    visible:false
                },{
                    dataField: 'TIC_AUXS1',
                    visible:false
                },{
                    dataField: 'TIC_AUXI1',
                    visible:false
                },{
                    dataField: 'TIC_AUXD1',
                    visible:false
                },{
                    dataField: 'TIC_AUXS2',
                    visible:false
                },{
                    dataField: 'TIC_AUXI2',
                    visible:false
                },{
                    dataField: 'TIC_AUXD2',
                    visible:false
                },{
                    dataField: 'TIC_AUXS3',
                    visible:false
                },{
                    dataField: 'TIC_AUXI3',
                    visible:false
                },{
                    dataField: 'TIC_AUXD3',
                    visible:false
                },{
                    dataField: 'TIC_AVANCE',
                    visible:false
                },{
                    dataField: 'TIC_CALIFICACION_COMENTARIO',
                    visible:false
                },{
                    dataField: 'TIC_CALIFICADO',
                    visible:false
                },{
                    dataField: 'TIC_CONSECUTIVO_MESA',
                    visible:false
                },{
                    dataField: 'TIC_CRM',
                    visible:false
                },{
                    dataField: 'TIC_CSCTICKET',
                    visible:false
                },{
                    dataField: 'TIC_DESCRIPCION',
                    visible:false
                },{
                    dataField: 'TIC_DESCRIPCION_SOLUCION',
                    visible:false
                },{
                    dataField: 'TIC_DESCRIPCION_CANCELACION',
                    visible:false
                },{
                    dataField: 'TIC_DURACION_CONFIRMACION',
                    visible:false
                },{
                    dataField: 'TIC_DURACION_EJECUCION',
                    visible:false
                },{
                    dataField: 'TIC_DURACION_RECEPCION',
                    visible:false
                },{
                    dataField: 'TIC_EMAIL_NOTIFICA_1',
                    visible:false
                },{
                    dataField: 'TIC_EMAIL_NOTIFICA_2',
                    visible:false
                },{
                    dataField: 'TIC_TELEFONO_SOLICITANTE',
                    visible:false
                },{
                    dataField: 'TIC_ESFUERZO_REQUERIDO',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_ALTA',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_ALTA_HORA_COMPLETA',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_ALTA_SOLA',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_CIERRE',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_CIERRE_SOLA',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_CIERRE_HORA_COMPLETA',
                    visible:false
                },{
                    dataField: 'TIC_NEWID',
                    visible:false
                },{
                    dataField: 'TIC_NOTIFICA_OPERACION',
                    visible:false
                },{
                    dataField: 'TIC_EMAIL_SOLICITANTE',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_PROMESA',
                    visible:false
                },{
                    dataField: 'TIC_FECHA_SOLICITA',
                    visible:false
                },{
                    dataField: 'TIC_PORC_PENALIZACION_RECEPCION',
                    visible:false
                },{
                    dataField: 'TIC_PORC_PENALIZACION_EJECUCION',
                    visible:false
                },{
                    dataField: 'TIC_PORC_PENALIZACION_CONFIRMACION',
                    visible:false
                },{
                    dataField: 'TIC_SEGMENTACION_INM_DES',
                    visible:false
                },{
                    dataField: 'TIC_TIEMPO_CONFIRMACION',
                    visible:false
                }
            

                

                
                ]
            },
        }).dxPivotGrid('instance');


        $("#Dialog_Busqueda_Fecha").dxPopup({
            hideOnOutsideClick:false,
            title: "PARAMETROS",
            height: 160 ,  
            width: 400 ,  
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
            height: 120,
            width: 400 ,  
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
	};

    self.ConsultaTickets = function(itemData){
        self.__DataSource_Tickets_Grid_Admin.clear();
        let DefaultData = {...ReturnDefaultData_Init()};
        let SearchTicket = Object.assign(DefaultData,itemData);
        loadPanel.show();
        
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Ticket_Servicio','GET',SearchTicket,getJSON(DeveloperType).ApiTickets_v2.token).then((all_data)=>{
            if (all_data.success == true){
                let selectedRowsData = all_data.JsonData;
                selectedRowsData.forEach(function(item) {
                    self.__DataSource_Tickets_Grid_Admin.insert(item);
                });
                self.DataGridTicketsAdmin.refresh();
                self.PivotDataGridTickets.option("dataSource.store",selectedRowsData)

                loadPanel.hide();
            }
            else{
                self.__DataSource_Tickets_Grid_Admin.clear();
                self.DataGridTicketsAdmin.refresh();
                self.PivotDataGridTickets.option("dataSource.store",[]);
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
                    setTimeout(() => {
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


    self.Load_Full_Catalogs = async function() {

        self.Content_Full_Catalogs = {
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
                ACTIVE:""
            },
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
            "SAMT_TIPO_TICKET":{
                DATA:[],
                KEYID:"TIPO_TICKET_CSC",
                TEXT:"TIPO_TICKET_IDIOMA1",
                ACTIVE:"TIPO_TICKET_ACTIVO"
            },
            "SAMT_CAM_TIPO_SERVICIO":{
                DATA:[],
                KEYID:"SAMT_CAM_TIPO_SERVICIO_CSC",
                TEXT:"TIPO_SERVICIO_IDIOMA1",
                ACTIVE:"TIPO_SERVICIO_ACTIVO"
            },
            "SAMT_TIPO_SEVERIDAD":{
                DATA:[],
                KEYID:"TIPO_SEVERIDAD_CSC",
                TEXT:"TIPO_SEVERIDAD_TICKET_IDIOMA1",
                ACTIVE:"TIPO_SEVERIDAD_TICKET_ACTIVO"
            },
            "SAMT_TIPO_CALIFICACION":{
                DATA:[],
                KEYID:"TIPO_CALIFICACION_CSC",
                TEXT:"TIPO_CALIFICACION_IDIOMA1",
                ACTIVE:"TIPO_CALIFICACION_ACTIVO"
            },
        };

        for (const key in self.Content_Full_Catalogs) {
            await new Promise( async resolve  => {
                await self.Get_Cat_DataBase(key)
                .then(function(data){ console.log(data.success); resolve('resolved'); })
                .catch(function(err){ DevExpress.ui.notify('ERROR AL OBTENER CATALOGO');  resolve('resolved'); });
            });
        }
    }

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


    self.Calcule_Label_Colum_Pivot = function(valueid , StrinCatalogo){
        if(valueid  == null){
            return "Sin Dato";
        }
        else{
            var columDataArray = jslinq( self.Get_Config_Cat_local(StrinCatalogo).DATA  ).where(function(el) {
                return  el[self.Get_Config_Cat_local(StrinCatalogo).KEYID] == valueid ;
            }).toList();
    
            if(columDataArray.length == 0){
                return valueid;
            }
            else{
                return columDataArray[0][self.Get_Config_Cat_local(StrinCatalogo).TEXT];
            }
        }
    }

}



setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);