SalesDashboard.dashboardModel = function () {
    let self = this;
    let obj_DatosEmpleado = null;
    let loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");

    /**TODOs: Formatos y fechas
     * self.TimeZoneServidor: Se utilizara para los INSERT y UPDATE de la BD
     * self.TimeZoneEmpleado: Se utiliza para saber la fecha y hora de la plataforma del empleado
     * self.TiempoUTCEmpleado: Segun el tipo de dato se sumara o restara esas horas a las 
     *                         fechas se trae en los campos de fecha de la BD
    */
    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();
    self.__DataSource_Inventario_Grid = new DevExpress.data.ArrayStore({ data: [] });

    self.init = function () {
        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary); let locale = getLocale(); Globalize.locale(locale); DevExpress.localization.locale(locale); function getLocale() { let locale = sessionStorage.getItem("locale"); return locale != null ? locale : "es"; }
        /** SIEMPRE AGREGAR ESTA LINEA */

        /** LABELS  PANTALLA*/
        $('#adm_title').html(Globalize.formatMessage("adm_title"));
        $('#adm_title_grid').html(Globalize.formatMessage("adm_title_grid"));
        /** LABELS  PANTALLA*/

        self.patname = window.location.pathname;
        obj_DatosEmpleado = JSON.parse(localStorage.getItem('obj_DatosEmpleado'));

        $("#Mod_Tab_Reporte").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            dataSource: [
                { title: "Grid General", template: "tab_gridGeneral", icon: "./images/Icons/Todos.png" }
            ],

        });

        $("#treeViewAdmin").dxTreeView({
            dataSource: [],
            height: '100%',
            showScrollbar: 'always',
            dataStructure: "plain",
            selectionMode: "single",
            activeStateEnabled: false,
            hoverStateEnabled: false,
            focusStateEnabled: false,
            selectByClick: true,
            searchEnabled: false,
            expandEvent: "click",
            keyExpr: "ID",
            displayExpr: "ITEM_DESCRIPCION",
            parentIdExpr: "ITEM_PARENT_ID",
            autoExpandAll: false,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                let img = document.createElement("img");
                img.src = itemData.ICON;
                img.classList.add("icon");
                img.classList.add("size-24x24");
                itemElement.append(img);

                let text = document.createElement("span");
                text.className = "item-text";
                text.innerText = " " + itemData.ITEM_DESCRIPCION;
                itemElement.append(text);
            },
            onItemClick: function (e) {
                let ConsultaInventario = {};
                let selectData = e.itemData;

                switch (selectData.ITEM_CATEGORIA) {
                    case "SISTEMA":
                        ConsultaInventario = {
                            CAT_SISTEMA_CSC: selectData.ITEM_CSC,
                            CAT_SUB_SISTEMA_CSC: 0,
                            PRODC_SERV_CSC: 0,
                            TIPO_ESTATUS_EQUIPO: "'1'",
                            REQ_CSCREQUISICION: 0
                        };
                        self.consultaInventario(ConsultaInventario);
                        console.log("id Sistema: " + selectData.ITEM_CSC);
                        break;
                    case "SUBSISTEMA":
                        ConsultaInventario = { 
                            CAT_SISTEMA_CSC: selectData.ITEM_SISTEMA_ID,
                            CAT_SUB_SISTEMA_CSC: selectData.ITEM_CSC,
                            PRODC_SERV_CSC: 0,
                            TIPO_ESTATUS_EQUIPO: "'1'",
                            REQ_CSCREQUISICION: 0
                        };
                        self.consultaInventario(ConsultaInventario);
                        console.log("ID SISTEMA: " + selectData.ITEM_SISTEMA_ID + " id Sub Sistema" + selectData.ITEM_CSC);
                        break;
                    case "PROD_SERV":
                        ConsultaInventario = { 
                            CAT_SISTEMA_CSC: selectData.ITEM_SISTEMA_ID,
                            CAT_SUB_SISTEMA_CSC: selectData.ITEM_SUBSISTEMA_ID,
                            PRODC_SERV_CSC: selectData.ITEM_CSC,
                            TIPO_ESTATUS_EQUIPO: "'1'",
                            REQ_CSCREQUISICION: 0
                        };
                        self.consultaInventario(ConsultaInventario);
                        console.log("ID SISTEMA: " + selectData.ITEM_SISTEMA_ID + " ID SUBSISTEMA: " + selectData.ITEM_SUBSISTEMA_ID + " id Producto Servicio" + selectData.ITEM_CSC);

                        break;
                    default:
                        DevExpress.ui.notify("No se selecciono un dato", "error", 3000);
                        console.log("No se selecciono un dato");
                }
            }

        });

        self.DataGridInventario = $("#Data_Grid_Inventario").dxDataGrid({
            dataSource: self.__DataSource_Inventario_Grid,
            deferRendering: true,
            allowColumnResizing: true,
            height: "100%",
            headerFilter: { visible: true },
            filterRow: { visible: false },
            filterPanel: { visible: true },
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
            }, onExporting: function (e) {
                let workbook = new ExcelJS.Workbook();
                let worksheet = workbook.addWorksheet('Reporte');
                DevExpress.excelExporter.exportDataGrid({
                    worksheet: worksheet,
                    component: e.component,
                    customizeCell: function (options) {
                        let excelCell = options;
                        excelCell.font = { name: 'Arial', size: 11 };
                        excelCell.alignment = { horizontal: 'left' };
                    }
                }).then(function () {
                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'REPORTE_INVENTARIO_' + moment().tz(self.TimeZoneEmpleado).format('YYYYMMDD_HH') + '.xlsx');
                    });
                });
                e.cancel = true;
            },
            columns: [
                {
                    caption: "Clase",
                    dataField: "TIPO_CLASE_IDIOMA1",
                    fixed: true,
                    fixedPosition: "left",
                    alignment: "center"
                }, {
                    caption: "Descripcion Equipo",
                    dataField: "PRODC_SERV_NOMBRE",
                    fixed: true,
                    fixedPosition: "left",
                    alignment: "center"
                }, {
                    caption: "Marca Producto",
                    dataField: "CAT_MARCA_DECRIPCION",
                    fixed: true,
                    fixedPosition: "left",
                    alignment: "center"
                }, {
                    caption: "Modelo",
                    dataField: "EQUIPAMIENTO_MODELO",
                    fixed: true,
                    fixedPosition: "left",
                    alignment: "center"
                }, {
                    caption: "Estatus",
                    dataField: "TIPO_ESTATUS_IDIOMA1",
                    alignment: "center"
                }, {
                    caption: "Ruta WBS",
                    dataField: "SEG_CSC_SEGMENTACION_INM_WBS",
                    alignment: "center"
                },
                {
                    caption: "Tipo De Adquisicion",
                    dataField: "TIPO_EQUIPO_IDIOMA1",
                    alignment: "center"
                }, {
                    caption: "Inicio de Operacion",
                    dataField: "EQUIPAMIENTO_INICIO_OPERACIO",
                    alignment: "center",
                    dataType: "datetime",
                    format: "yyyy/MM/dd"
                }, {
                    caption: "Proveedor",
                    dataField: "CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE",
                    alignment: "center"
                }, {
                    caption: "Codigo de Barras",
                    dataField: "EQUIPAMIENTO_CODBARRAS",
                    alignment: "center"
                }, {
                    caption: "No Serie",
                    dataField: "EQUIPAMIENTO_NO_SERIE",
                    alignment: "center"
                }, {
                    caption: "Presentacion",
                    dataField: "UME_DESCRIPCION_INTERNACIONALES",
                    alignment: "center"
                }, {
                    caption: "UM",
                    dataField: "UME_DESCRIPCION",
                    alignment: "center"
                },
                {
                    caption: "Cantidad",
                    dataField: "EQUIPAMIENTO_CANTIDAD",
                    alignment: "center"
                },
                {
                    caption: "Consumo",
                    dataField: "EQUIPAMIENTO_CONSUMIDO",
                    alignment: "center"
                }, {
                    caption: "Existencia",
                    dataField: "EQUIPAMIENTO_EXISTENCIA",
                    alignment: "center"
                }, {
                    caption: "Comentarios",
                    dataField: "PRODC_SERV_DESCRIPCION",
                    alignment: "left"
                }
            ],
            summary: {
                totalItems: [{
                    name: "Total",
                    showInColumn: "TIPO_CLASE_IDIOMA1",
                    displayFormat: "Total: {0}",
                    summaryType: "count"
                }
                ]
            },
            onRowDblClick: function (e) {
                setTimeout(() => {
                    console.log("Llamar pantalla equipamiento");
                }, 1000);
            }

        }).dxDataGrid('instance');

        self.cargaTreeView();
    };

    self.cargaTreeView = function () {
        let ArbolPrincipal = [];
        let IdAutronicrement = 1;

        let jsonProductoServicio = {
            EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type: localStorage.getItem('Type'),
            CAT_SISTEMAS_CLAVE: "'EQ','MOV','SW','ICIVIL','KIT','INS','HTAS'"
        };

        //__Request_Http_Mode(getJSON(DeveloperType).ApiEquipamiento.url + 'Get_Sistema_Producto_Serv', 'GET', jsonProductoServicio, getJSON(DeveloperType).ApiEquipamiento.token).then((all_data) => {
        __Reques_ajax(getJSON(DeveloperType).ApiEquipamiento.url+'Get_Sistema_Producto_Serv','GET',jsonProductoServicio,getJSON(DeveloperType).ApiEquipamiento.token).then((all_data)=>{    
            if (all_data.success == true) {
                let DataEstatus = all_data.JsonData

                let _ary_Subsistema = { Tbl: "SAMT_CAT_SUBSISTEMA_PRODCT_SER", WHR: "EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') + "" };
                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Whr', 'GET', _ary_Subsistema, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                    if (all_data.success == true) {
                        let DataSubSistema = all_data.JsonData;

                        let _ary_producto_serv = { Tbl: "SAMT_PRODUCTOS_SERVICIOS", WHR: "EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') + "" };
                        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Whr', 'GET', _ary_producto_serv, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                            if (all_data.success == true) {
                                let DataProductoServ = all_data.JsonData;

                                for (const element of DataEstatus) {
                                    let Id_Parent = parseInt(IdAutronicrement + "");
                                    ArbolPrincipal.push({
                                        "ID": IdAutronicrement,
                                        "ITEM_CATEGORIA": "SISTEMA",
                                        "ITEM_CLAVE": element.CAT_SISTEMAS_CLAVE,
                                        "ITEM_CSC": element.CAT_SISTEMA_CSC,
                                        "ITEM_DESCRIPCION": element.CAT_SISTEMA_IDIOMA1,
                                        "ITEM_PARENT_ID": 0,
                                        "ICON": element.CAT_SISTEMA_IMAGE?.data ? "data:image/png;base64," + toBase64(element.CAT_SISTEMA_IMAGE.data) : null
                                    });

                                    IdAutronicrement++;

                                    let SubSistemaFilter = jslinq(DataSubSistema).where(function (el) {
                                        return el.CAT_SISTEMA_CSC == element.CAT_SISTEMA_CSC;
                                    }).toList();

                                    for (const elementSub of SubSistemaFilter) {
                                        let Id_Parent_Hijo = parseInt(IdAutronicrement + "");
                                        ArbolPrincipal.push({
                                            "ID": IdAutronicrement,
                                            "ITEM_CATEGORIA": "SUBSISTEMA",
                                            "ITEM_CLAVE": elementSub.CAT_SUBSISTEMA_CLAVE,
                                            "ITEM_CSC": elementSub.CAT_SUB_SISTEMA_CSC,
                                            "ITEM_DESCRIPCION": elementSub.CAT_SUBSISTEMA_IDIOMA1,
                                            "ITEM_PARENT_ID": Id_Parent,
                                            "ITEM_SISTEMA_ID": element.CAT_SISTEMA_CSC,
                                            "ICON": elementSub.CAT_SUBSISTEMA_IMAGE?.data ? "data:image/png;base64," + toBase64(elementSub.CAT_SUBSISTEMA_IMAGE.data) : null
                                        });
                                        IdAutronicrement++;

                                        let productoServFilter = jslinq(DataProductoServ).where(function (el) {
                                            return el.CAT_SUP_SISTEMA_CSC == elementSub.CAT_SUB_SISTEMA_CSC;
                                        }).toList();

                                        for (const elementProd of productoServFilter) {
                                            ArbolPrincipal.push({
                                                "ID": IdAutronicrement,
                                                "ITEM_CATEGORIA": "PROD_SERV",
                                                "ITEM_CLAVE": elementProd.CAT_CLAVE,
                                                "ITEM_CSC": elementProd.PRODC_SERV_CSC,
                                                "ITEM_DESCRIPCION": elementProd.PRODC_SERV_NOMBRE + " (0)",
                                                "ITEM_PARENT_ID": Id_Parent_Hijo,
                                                "ITEM_SISTEMA_ID": element.CAT_SISTEMA_CSC,
                                                "ITEM_SUBSISTEMA_ID": elementSub.CAT_SUB_SISTEMA_CSC,
                                                "ICON": elementProd.PRODC_SERV_IMAGEN?.data ? "data:image/png;base64," + toBase64(elementProd.PRODC_SERV_IMAGEN.data) : null
                                            });
                                            IdAutronicrement++;
                                        }
                                    }
                                    $("#treeViewAdmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);
                                    loadPanel.hide();
                                }
                            }
                        });
                    }
                });
            }
            else {
                $("#treeViewAdmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);
                loadPanel.hide();
            }
        });
    };

    self.consultaInventario = function (itemData) {
        self.__DataSource_Inventario_Grid.clear();
        let DefaultData = { ...ReturnDefaultData_Init() };
        let Search = Object.assign(DefaultData, itemData);
        loadPanel.show();
     
        __Request_Http_Mode(getJSON(DeveloperType).ApiEquipamiento.url + 'Get_Inventario', 'GET', Search, getJSON(DeveloperType).ApiEquipamiento.token).then((all_data) => {
            if (all_data.success == true) {
                let selectedRowsData = all_data.JsonData;
                selectedRowsData.forEach(function (item) {
                    self.__DataSource_Inventario_Grid.insert(item);
                });
                self.DataGridInventario.refresh();
                loadPanel.hide();
            }
            else {
                self.__DataSource_Inventario_Grid.clear();
                self.DataGridInventario.refresh();
                loadPanel.hide();
                DevExpress.ui.notify("No se encontraron registros en la busqueda.","info", 3000);
            }
        })
            .catch(function (e) {
                self.__DataSource_Inventario_Grid.clear();
                self.DataGridInventario.refresh();
                loadPanel.hide();
                DevExpress.ui.notify("Eror en la busqueda, vuelva a intentar nuevamente", "error", 3000);
            });
    };

   
}

setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);