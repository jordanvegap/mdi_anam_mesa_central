SalesDashboard.dashboardModel = function() {
    var self = this;
    
    self.ioRealTimeSuraUrl = "";
    self.socketConnection = null;

    if (Db_Pro_Pru == "Pru") {
        self.ioRealTimeSuraUrl = "https://suraco.dnasystem.io:2003/";
    } else {
        self.ioRealTimeSuraUrl = "https://suraco.dnasystem.io:2004/";
    }
    self.socketConnection = io.connect(self.ioRealTimeSuraUrl, {  'forceNew': true });
    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEAS */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */
        /** LABELS  PANTALLA*/
        //$('#adm_title_ms').html(Globalize.formatMessage("adm_title_ms"));
        /** LABELS  PANTALLA*/
        self.patname = window.location.pathname;
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        
        $("#gridAgentes").dxDataGrid({
           
            selection: {
                mode: "single"
            },
            height: '100%',
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },
            rowAlternationEnabled: true,
            showBorders: true,
            filterRow: {
                visible: false,
                applyFilter: "auto"
            },
          repaintChangesOnly: true,
          highlightChanges: true,
          loadPanel:{
              enabled: false,
          },
          onRowDblClick: async function (e) {      
          },
          columns: [
            {
                    caption: "SOLICITANTE",
                    dataField: "EMPLEADO_CSC_EMPLEADO",
                    alignment: "left",
                    lookup: {
                        displayExpr: "NOMBRE",
                        valueExpr: "EMPLEADO_CSC_EMPLEADO",
                        dataSource: {
                            store: new DevExpress.data.CustomStore({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    return JSON.parse( sessionStorage.getItem("all_emp_host"));
                                }
                            })
                        }
                    }
                },{
                    caption: "TIEMPO TOTAL FIRMADO",
                    dataField: "PRESENCIA_FECHA_ACTUALIZACION_FIRMA",
                    calculateCellValue: function(rowData) {
                        var now  = moment().tz(localStorage.getItem('tmzServidor')).format('YYYY-MM-DD HH:mm:ss');
                        var then = rowData.PRESENCIA_FECHA_PRIMERA_FIRMA;
                        var m1 = moment(then);
                        var m2 = moment(now);
                        var m3 = m2.diff(m1,'miliseconds');
                        var d = moment.duration(m3);
                        return ('0' + d.days()).slice(-2) + 'd ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);
                    }
                }, {
                caption: "Servicio",
                dataField: "CAM_CSC_SERVICIO",
                groupIndex: 0,
                lookup: {
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_CAM_MESA_DE_AYUDA",NACTIVE:"CAM_MESA_ACTIVO",NDEFAULT:"CAM_MESA_ORDEN"};
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
                    },
                    displayExpr: "CAM_MESA_IDIOMA1",
                    valueExpr: "CAM_MESA_CSC",
                }
                
            },{
                caption: "ESTATUS",
                dataField: "ESTATUS_PRESENCIA_CSC",
                width: 200,
                lookup: {
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_CAM_ESTATUS_PRESENCIA",NACTIVE:"ESTATUS_ACTIVO",NDEFAULT:"ESTATUS_DEFAULT"};
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
                    },
                    displayExpr: "ESTATUS_IDIOMA1",
                    valueExpr: "ESTATUS_PRESENCIA_CSC",
                }
            },{
                caption: "TIEMPO EN ESTATUS",
                dataField: "PRESENCIA_FECHA_ESTATUS",
                calculateCellValue: function(rowData) {
                    var now  = moment().tz(localStorage.getItem('tmzServidor')).format('YYYY-MM-DD HH:mm:ss');
                    var then = rowData.PRESENCIA_FECHA_ESTATUS;
                    var m1 = moment(then);
                    var m2 = moment(now);
                    var m3 = m2.diff(m1,'miliseconds');
                    var d = moment.duration(m3);
                    return ('0' + d.days()).slice(-2) + 'd ' +  ('0' + d.hours()).slice(-2) + ':' + ('0' + d.minutes()).slice(-2)  + ':' + ('0' + d.seconds()).slice(-2);
                }
            }            
        ]
      });

    }

    self.socketConnection.on("Result_AgentesFirma", (arg) => {
        $("#gridAgentes").dxDataGrid("instance").option("dataSource", arg.JsonData);
    });

    self.socketConnection.on("Result_Solicitudes_Fila", (arg) => {
        console.log(arg);
    });
}

setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);