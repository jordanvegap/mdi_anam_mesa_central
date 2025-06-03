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
    self.__DataSource_Tickets_Grid_Admin = new DevExpress.data.ArrayStore({
        key: "TICKET",
        data: []
    });

    let _keyCatMesCsc = 'CAT_MES_CLAVE';

    self.REPORTE_ID_SERVICIO = null;
    self.REPORTE_FECHA_INICIO = null;
    self.REPORTE_FECHA_FIN = null;



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
       
        self.Frm_Busqueda_filtros = $('#__Frm_busqueda_Filtro').dxForm({
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: '__Frm_Busqueda_Filtro',
            labelMode: 'outside',
            labelLocation: 'left',
            colCount: 10, // Ajusta según la cantidad de controles
            minColWidth: 200,
            items: [
        
                {
                    colSpan: 2,
                    dataField: "SAMT_REPORTE_SERVICIO_CSC",
                    editorType: "dxSelectBox",
                    label: { text: "Servicio" },
                    editorOptions: {
                        searchEnabled: true,
                        displayExpr: "REPORTE_SERVICIO_NOMBRE",
                        valueExpr: "SAMT_REPORTE_SERVICIO_CSC",
                        dataSource: new DevExpress.data.DataSource({
                            store: new DevExpress.data.CustomStore({
                                key: _keyCatMesCsc,
                                loadMode: "raw", paginate: false,
                                load: async function () {
                                    let _ary = { Tbl: "SAMT_REPORTE_SERVICIO", NACTIVE: "REPORTE_SERVICIO_ACTIVO" };
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                        if (all_data.success === true) {
                                            return jslinq(all_data.JsonData).orderBy(el => el.CAT_MES_CSC).toList();
                                        } else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                            })
                        }),
                        onValueChanged: function (e) {
                            let newValue = e.value;
                            //Inicializa variables consulta
                            self.REPORTE_ID_SERVICIO = newValue;
                            self.REPORTE_FECHA_INICIO = null;
                            self.REPORTE_FECHA_FIN = null;

                            let CMP_SAMT_REPORTE_PERIODO_CSC = self.Frm_Busqueda_filtros.getEditor('SAMT_REPORTE_PERIODO_CSC');
                            CMP_SAMT_REPORTE_PERIODO_CSC.option('value', null);
                            let _ary = {
                                Tbl: "SAMT_REPORTE_PERIODO",
                                WHR: "EMP_CSC_EMPRESA_HOST=" + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +
                                    " AND SAMT_REPORTE_SERVICIO_CSC=" + newValue
                            };
                            __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Whr', 'GET', _ary, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                                CMP_SAMT_REPORTE_PERIODO_CSC.option('dataSource', all_data.success ? all_data.JsonData : []);
                            });
                        }
                    },
                    validationRules: [{ type: "required", message: "requerido" }]
                },
        
                {
                    colSpan: 2,
                    dataField: "SAMT_REPORTE_PERIODO_CSC",
                    editorType: "dxSelectBox",
                    label: { text: "Periodo" },
                    editorOptions: {
                        searchEnabled: false,
                        displayExpr: "REPORTE_PERIODO_NOMBRE",
                        valueExpr: "SAMT_REPORTE_PERIODO_CSC",
                        onValueChanged: function (e) {
                            let newValue = e.value;
                            console.debug("VALOR SELECCIOANDO " + newValue );

                            let editor = self.Frm_Busqueda_filtros.getEditor('SAMT_REPORTE_PERIODO_CSC');
                            if (editor._dataSource && editor._dataSource._items) {
                                let items = editor._dataSource._items;
                                let match = items.find(item => item.SAMT_REPORTE_PERIODO_CSC === newValue);
                                if (match) {
                                    self.REPORTE_FECHA_INICIO = match.REPORTE_PERIODO_FECHA_INICIO;
                                    self.REPORTE_FECHA_FIN = match.REPORTE_PERIODO_FECHA_FIN;
                                    let formData = self.Frm_Busqueda_filtros.option('formData');
                                    Object.assign(formData, {
                                        REPORTE_FECHA_INICIO: match.REPORTE_PERIODO_FECHA_INICIO,
                                        SAMT_CAL_CATORCREPORTE_FECHA_FINENA_F2: match.REPORTE_PERIODO_FECHA_FIN
                                    });
                                    self.Frm_Busqueda_filtros.option('formData', formData);
                                }
                            }

                            console.debug("CONSULTA FECHA INICIO" + self.REPORTE_FECHA_INICIO);
                            console.debug("CONSULTA FECHA FIN" + self.REPORTE_FECHA_FIN);



                        }
                    },
                    validationRules: [{ type: "required", message: "requerido" }]
                },
        
                {
                    itemType: "button",
                    colSpan: 1,
                    buttonOptions: {
                        text: "Consultar",
                        icon: 'refresh',
                        type: "success",
                        width: '100%',
                        onClick() {
                            if( self.Frm_Busqueda_filtros.validate().isValid === true){
                                self.ConsultarReporte();
                            }
                            else{
                                loadPanel.hide();
                                DevExpress.ui.notify('LLENE LOS CAMPOS EN ROJO');
                            }
                        }
                    }
                },
        
                {
                    itemType: "button",
                    colSpan: 1,
                    buttonOptions: {
                        text: "Exportar a Excel",
                        icon: 'export',
                        type: "success",
                        onClick() {
                            const dataSource = self.DataGridReporte.getDataSource();
                            dataSource.load().then(data => {
                                if (!data || data.length === 0) {
                                    DevExpress.ui.notify("No hay registros para exportar.", "warning", 3000);
                                    return;
                                }
                
                                self.DataGridReporte.exportToExcel(true);
                            });
                        }
                    }
                }
            ]
        }).dxForm("instance");
        

        $("#Mod_Tab_Reporte_Ticket").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            dataSource: [
                { title: "Reporte General", template: "tab_gridGeneral", icon: "./images/Icons/Todos.png" }
            ],
            itemTitleTemplate: function(itemData, itemIndex, itemElement) {
                itemElement.addClass("custom-tab-title");
                const iconHtml = `<img src="${itemData.icon}" style="height: 20px; vertical-align: middle; margin-right: 8px;" />`;
                const textHtml = `<span style="vertical-align: middle;">${itemData.title}</span>`;
            
                itemElement.append(iconHtml + textHtml);
            }
        }); 

        self.DataGridReporte = $("#Data_Grid_Reporte").dxDataGrid({
            dataSource: self.__DataSource_Tickets_Grid_Admin,
            deferRendering: true,
            allowColumnResizing: true,
            height: "100%",
            filterRow: { visible: false },
            filterPanel: { visible: true },
            headerFilter: { visible: false },
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
            showRowLines: false,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: true,
            export: {
                enabled: false
            }, onExporting: function (e) {

                e.cancel = true;

                fetch('/mdi/views/Reporte_Tickets_DGMEIA/Plantilla/American.xlsx')
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => {
                        const workbook = new ExcelJS.Workbook();
                        return workbook.xlsx.load(arrayBuffer);
                    })
                    .then(workbook => {
                        const worksheet = workbook.getWorksheet('Reporte');
                        if (!worksheet) throw new Error("La hoja 'Reporte' no existe.");

                        const dataGrid = e.component;

                        return dataGrid.getDataSource().load().then(data => {
                            const columns = dataGrid.getVisibleColumns();

                            let currentRowIndex = 3; // Aquí empieza la exportación real

                            data.forEach((dataRow, rowIndex) => {
                                columns.forEach((column, colIndex) => {
                                    const cell = worksheet.getCell(currentRowIndex + rowIndex, colIndex + 1);
                                    const value = column.calculateCellValue
                                        ? column.calculateCellValue(dataRow)
                                        : dataRow[column.dataField];

                                    cell.value = value;
                                    cell.font = { name: 'Montserrat', size: 11 };
                                    cell.alignment = { horizontal: 'center' };
                                });
                            });

                            return workbook;
                        });
                    })
                    .then(workbook => workbook.xlsx.writeBuffer())
                    .then(buffer => {
                        saveAs(
                            new Blob([buffer], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            }),
                            'ReporteBitacoras_' + moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH-mm-ss') + '.xlsx'
                        );
                    })
                    .catch(error => {
                        console.error('Error al exportar con plantilla:', error);
                        alert('Error al generar el archivo. Revisa la plantilla o consulta a soporte.');
                    });




            },
            columns: [
                {
                    caption: "No",
                    dataField: "NUMERO",
                    fixed: true,
                    fixedPosition: "left",
                    alignment: "center"
                },
                {
                    caption: "No. Reporte AS&E",
                    dataField: "NO_REPORTE",
                    alignment: "center",
                    fixed: true,
                    fixedPosition: "left",
                },
                {
                    caption: "Aduana",
                    dataField: "ADUANA",
                    alignment: "left",
                }, {
                    caption: "No. de serie del equipo",
                    dataField: "NO_SERIE_EQUIPO",
                    alignment: "center",
                }, {
                    caption: "Descripción del Falla",
                    dataField: "DESCRIPCION_FALLA",
                    alignment: "left",
                    width: 180
                },
                {
                    caption: "Inicio de la falla",
                    alignment: "center",
                    columns: [
                        {
                            caption: "Fecha",
                            dataField: "INICIO_FALLA_FECHA",
                            alignment: "center",
                            dataType: "datetime",
                            format: "dd/MM/yyyy"
                        }, {
                            caption: "Hora",
                            dataField: "INICIO_FALLA_HORA",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        }
                    ]
                },
                {
                    caption: "Indicador 1 Tiempo de atención telefónica (2 horas)",
                    alignment: "center",
                    columns: [
                        {
                            caption: "Fecha",
                            dataField: "TIEMPO_ATENCION_TELEFONICA_FECHA",
                            alignment: "center",
                            dataType: "datetime",
                            format: "dd/MM/yyyy",
                        },
                        {
                            caption: "Hora",
                            dataField: "TIEMPO_ATENCION_TELEFONICA_HORA",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        },
                        {
                            caption: "Tiempo de atención",
                            dataField: "TIEMPO_ATENCION",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        },
                        {
                            caption: "Días de deductiva",
                            dataField: "TIEMPO_ATENCION_DIAS_DEDUCTIVA",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        }

                    ]
                },
                {
                    caption: "Ventana de tiempo (Tiempo no contabilizado por causas ajenas al proveedor no  fue posible realizar la reparación)",
                    alignment: "center",
                    columns: [
                        {
                            caption: "De (Fecha)",
                            dataField: "VENTA_TIEMPO_DEFECHA",
                            alignment: "center",
                            dataType: "datetime",
                            format: "dd/MM/yyyy",
                        }, {
                            caption: "Hora",
                            dataField: "VENTA_TIEMPO_DEHORA",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        }, {
                            caption: "A (fecha)",
                            dataField: "VENTA_TIEMPO_AFECHA",
                            alignment: "center",
                            dataType: "datetime",
                            format: "dd/MM/yyyy",
                        },
                        {
                            caption: "Hora",
                            dataField: "VENTA_TIEMPO_AHORA",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        }, {
                            caption: "Tiempo no considerado",
                            dataField: "TIEMPO_NO_CONSIDERADO",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        }

                    ]
                },
                {
                    caption: "Indicador 2 Tiempo de reparación de la falla (96 horas)",
                    alignment: "center",
                    columns: [
                        {
                            caption: "Fecha",
                            dataField: "TIEMPO_REPARACION_FALLA_FECHA",
                            alignment: "center",
                            dataType: "datetime",
                            format: "dd/MM/yyyy"
                        },
                        {
                            caption: "Hora",
                            dataField: "TIEMPO_REPARACION_FALLA_HORA",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        },
                        {
                            caption: "Tiempo de reparación",
                            dataField: "TIEMPO_REPARACION",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        },

                        {
                            caption: "Días de deductiva",
                            dataField: "REPARACION_DIAS_DEDUCTIVA",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        }
                    ]
                },
                {
                    caption: "Indicador 3 Fallas recurrentes",
                    alignment: "center",
                    columns: [
                        {
                            caption: "Tiempo de reparación",
                            dataField: "FALLAS_RECURRENTES_TIEMPO_REPARACION",
                            alignment: "center",
                            dataType: "time",
                            format: "HH:mm:ss"
                        },
                        {
                            caption: "Días de deductiva",
                            dataField: "FALLAS_RECURRENTES_DIAS_DEDUCTIVA",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        }
                    ]
                },
                {
                    caption: "Días de inoperatividad",
                    alignment: "center",
                    columns: [
                        {
                            caption: "Días ",
                            dataField: "INOPERATIVIDAD_DIAS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Horas",
                            dataField: "INOPERATIVIDAD_HORAS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Min.",
                            dataField: "INOPERATIVIDAD_MINUTOS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "%",
                            dataField: "INOPERATIVIDAD_PORCENTAJE",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                formatter: function (value) {
                                    if (value == null) return "";
                                    const percentage = value * 100;
                                    return (percentage % 1 === 0)
                                        ? `${percentage}%`
                                        : `${percentage.toFixed(2)}%`;
                                }
                            }
                        }
                    ]
                },
                {
                    caption: "Días que el equipo opero",
                    alignment: "center",
                    columns: [
                        {
                            caption: "Días",
                            dataField: "EQUIPO_OPERO_DIAS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Hrs.",
                            dataField: "EQUIPO_OPERO_HORAS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Min.",
                            dataField: "EQUIPO_OPERO_MINUTOS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "%",
                            dataField: "EQUIPO_OPERO_PORCENTAJE",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                formatter: function (value) {
                                    if (value == null) return "";
                                    const percentage = value * 100;
                                    return (percentage % 1 === 0)
                                        ? `${percentage}%`
                                        : `${percentage.toFixed(2)}%`;
                                }
                            }
                        }
                    ]
                },
                {
                    caption: "Indicador 4\nOperatividad\npor equipo del 95%",
                    alignment: "center",
                    columns: [
                        {
                            caption: "%",
                            dataField: "OPERATIVIDAD_EQUIPO_PORCENTAJE",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                formatter: function (value) {
                                    if (value == null) return "";
                                    const percentage = value * 100;
                                    return (percentage % 1 === 0)
                                        ? `${percentage}%`
                                        : `${percentage.toFixed(2)}%`;
                                }
                            }
                        },
                        {
                            caption: "Formula para Días de deductiva",
                            dataField: "FORMULA_DIAS_DEDUCTIVA",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Días",
                            dataField: "OPERATIVIDAD_EQUIPO_DIAS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Hrs.",
                            dataField: "OPERATIVIDAD_EQUIPO_HORAS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Min.",
                            dataField: "OPERATIVIDAD_EQUIPO_MINUTOS",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            caption: "Deductivas por inoperatividad",
                            dataField: "OPERATIVIDAD_EQUIPO_DEDUCTIVA",
                            alignment: "center",
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        }


                    ]
                }
            ],
            summary: {
                totalItems: [{
                    name: "Total",
                    showInColumn: "NUMERO",
                    displayFormat: "Total: {0}",
                    summaryType: "count"
                }
                ]
            },
            onRowDblClick: function (e) {
                console.log(e.data);
            }
        }).dxDataGrid('instance');

        loadPanel.hide();
    };

    self.run = function (){
       
        loadPanel.hide();
    }

    self.ConsultarReporte = function(itemData){
        self.__DataSource_Tickets_Grid_Admin.clear();
        let DefaultData = {...ReturnDefaultData_Init()};

        if (!self.REPORTE_ID_SERVICIO || !self.REPORTE_FECHA_INICIO || !self.REPORTE_FECHA_FIN) {
            DevExpress.ui.notify("Debe seleccionar el servicio y un periodo álido.", "error", 3000);
            return;
        }


        let addDataPermisos = {
            ID_MESA_SERVICIO: self.REPORTE_ID_SERVICIO,
            FECHA_INICIAL: self.REPORTE_FECHA_INICIO,
            FECHA_FINAL: self.REPORTE_FECHA_FIN
        }

        let SearchTicket = Object.assign(DefaultData,itemData, addDataPermisos);
        loadPanel.show();
        
        __Reques_ajax(getJSON(DeveloperType).ApiTickets_v2.url+'Get_Reporte_dgmeia','GET',SearchTicket,getJSON(DeveloperType).ApiTickets_v2.token).then((all_data)=>{
            if (all_data.success == true){
                let selectedRowsData = all_data.JsonData;
                selectedRowsData.forEach(function(item) {
                    self.__DataSource_Tickets_Grid_Admin.insert(item);
                });
                self.DataGridReporte.refresh();
                loadPanel.hide();
            }
            else{
                self.__DataSource_Tickets_Grid_Admin.clear();
                self.DataGridReporte.refresh();
                loadPanel.hide();
            }
        })
        .catch(function(e){
            self.__DataSource_Tickets_Grid_Admin.clear();
            self.DataGridReporte.refresh();
            loadPanel.hide();
            DevExpress.ui.notify("Eror de de busqueda vueva a intentar nuevamente", "error", 3000); 
        });
	};



}



setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
    SalesDashboard.currentModel.run();
}, 1000);