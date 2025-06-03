SalesDashboard.dashboardModel = function () {
    let self = this;
    let obj_DatosEmpleado;
    self.DataOtOpen = null;
    self.setDefaultValues_Ots = false;
    self.Ids_TipoUso_Requi_Ots = 9;

    self.Frm_Ot_Instance = null;
    let loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");

    self.init = function () {
        /** SIEMPRE AGREGAR ESTA LINEA */
        obj_DatosEmpleado = JSON.parse(localStorage.getItem('obj_DatosEmpleado'));
        loadPanel.hide();
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary); let locale = getLocale(); Globalize.locale(locale); DevExpress.localization.locale(locale); function getLocale() { let locale = sessionStorage.getItem("locale"); return locale != null ? locale : "es-mx"; }
        /** SIEMPRE AGREGAR ESTA LINEA */
        self.patname = window.location.pathname;
        $("#Pop_Busqueda_Fecha_Ot").dxPopup({
            hideOnOutsideClick: false,
            title: "PARAMETROS",
            height: 120,
            width: 400,
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            onShowing: function (e) {

            },
            contentTemplate: function (e) {
                e.attr({ "style": "display: flex; flex-direction: column;" });

                e.append(
                    $("<div />").attr({ "id": "Form_Busqueda_Fecha", "style": "border: solid red 0px; margin-bottom: 5px; " }).dxForm({
                        readOnly: false,
                        showColonAfterLabel: true,
                        showValidationSummary: false,
                        validationGroup: 'Form_Busqueda_Fecha_Validation',
                        labelMode: 'static',
                        labelLocation: 'top',
                        items: [{
                            itemType: "group",
                            colCount: 2,
                            items: [{
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
                                validationRules: [{ type: 'required', message: 'Fecha requerida' }]
                            }, {
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
                                validationRules: [{ type: 'required', message: 'Fecha requerida' }]
                            }, {
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Cancelar",
                                    icon: 'remove',
                                    type: "danger",
                                    width: '100%',
                                    visible: true,
                                    onInitialized: function (e) {

                                    },
                                    onClick() {
                                        $("#Form_Busqueda_Fecha").dxForm('instance').resetValues();
                                        $("#Form_Busqueda_Fecha").dxForm('instance').option('formData', {});
                                        $("#Pop_Busqueda_Fecha_Ot").dxPopup("hide");
                                    }
                                }
                            }, {
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Buscar",
                                    icon: 'search',
                                    type: "default",
                                    width: '100%',
                                    visible: true,
                                    onInitialized: function (e) {

                                    },
                                    onClick() {
                                        let FormBusqueda = $("#Form_Busqueda_Fecha").dxForm('instance');
                                        if (FormBusqueda.validate().isValid) {
                                            let DataForm = FormBusqueda.option('formData');
                                            self.Consulta_Ordenes_Trabajo(DataForm);
                                            $("#Pop_Busqueda_Fecha_Ot").dxPopup("hide");
                                        }
                                        else {
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

        $("#Mod_Tab_Reporte_OT").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            dataSource: [
                { title: "Grid General", template: "tab_gridGeneral", icon: "./images/Icons/Todos.png" },
                { title: "Cubos de información", template: "tab_cubo", icon: "./images/Icons/3d.png" }
            ]
        });

        $("#__tree_Ot_ADmin").dxTreeView({
            dataSource: [],
            height: '100%',
            showScrollbar: 'always',
            dataStructure: "plain",
            selectionMode: "single",
            activeStateEnabled: false,
            hoverStateEnabled: false,
            focusStateEnabled: false,
            selectByClick: false,
            searchEnabled: false,
            expandEvent: "click",
            keyExpr: "ID",
            displayExpr: "DESCRIPCION",
            parentIdExpr: "Task_Parent_ID",
            autoExpandAll: false,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                let icon = document.createElement("span");
                icon.className = "menu_item " + itemData.ICON;
                itemElement.append(icon);
                let text = document.createElement("span");
                text.className = "item-text";
                text.innerText = itemData.DESCRIPCION;
                itemElement.append(text);
            },
            onItemClick: function (itemSelect) {
                let itemData = itemSelect.itemData;

                if (itemData.CLAVE_ITEM == "ASIGNADA" || itemData.CLAVE_ITEM == "ABIERTA" || itemData.CLAVE_ITEM == "SINASIGNACION") {
                    self.Consulta_Ordenes_Trabajo(itemData);
                }
                else if (itemData.CLAVE_ITEM == "NO_OT") {
                    $("#Pop_Busqueda_No_Ot").dxPopup("show");
                    setTimeout(function () {
                        $("#Frm_Busqueda_No_Ots").dxForm('instance').resetValues();
                        $("#Frm_Busqueda_No_Ots").dxForm('instance').option('formData', {});
                        $("#Frm_Busqueda_No_Ots").dxForm('instance').option('formData', itemData);
                    }, 500);
                }
                else if (itemData.CLAVE_ITEM == "TODAS" || itemData.CLAVE_ITEM == "CERRADA" || itemData.NODO_TAG == "AREA" || itemData.NODO_TAG == "DEPARTAMENTO") {
                    $("#Pop_Busqueda_Fecha_Ot").dxPopup("show");
                    setTimeout(function () {
                        $("#Form_Busqueda_Fecha").dxForm('instance').resetValues();
                        $("#Form_Busqueda_Fecha").dxForm('instance').option('formData', {});
                        $("#Form_Busqueda_Fecha").dxForm('instance').option('formData', itemData);
                    }, 500);

                }
                else if (itemData.CLAVE_ITEM == "OTVENC" || itemData.CLAVE_ITEM == "OTVENCHOY" || itemData.CLAVE_ITEM == "OTVENCP") {
                    self.Consulta_Ordenes_Trabajo(itemData);
                }

                if (itemData.NODO_TAG == "ESTATUS" || itemData.NODO_TAG == "OTPRIORIDAD") {
                    self.Consulta_Ordenes_Trabajo(itemData);
                }

                if (itemData.CLAVE_ITEM == "ABIERTAS" || itemData.CLAVE_ITEM == "ESTATUS" || itemData.CLAVE_ITEM == "ITEMSEVERIDAD" || itemData.CLAVE_ITEM == "ITEMPRIORIDAD") {
                    self.Consulta_Ordenes_Trabajo(itemData);
                }
                else if (itemData.CLAVE_ITEM == "CERRADAS" || itemData.CLAVE_ITEM == "TODAS") {
                    $("#Pop_Busqueda_Fecha_Ot").dxPopup("show");
                    setTimeout(function () {
                        $("#Form_Busqueda_Fecha").dxForm('instance').resetValues();
                        $("#Form_Busqueda_Fecha").dxForm('instance').option('formData', {});
                        $("#Form_Busqueda_Fecha").dxForm('instance').option('formData', itemData);
                    }, 500);

                }
            }
        });

        $("#Pop_Busqueda_No_Ot").dxPopup({
            hideOnOutsideClick: false,
            title: "BUSQUEDA DE ORDEN DE TRABAJO",
            height: 120,
            width: 400,
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            onShowing: function (e) {

            },
            contentTemplate: function (e) {
                e.attr({ "style": "display: flex; flex-direction: column;" });

                e.append(
                    $("<div />").attr({ "id": "Frm_Busqueda_No_Ots", "style": "border: solid red 0px; margin-bottom: 5px; " }).dxForm({
                        readOnly: false,
                        showColonAfterLabel: true,
                        showValidationSummary: false,
                        validationGroup: 'Frm_Busqueda_No_Ots_Validation',
                        labelMode: 'static',
                        labelLocation: 'top',
                        items: [{
                            itemType: "group",
                            colCount: 2,
                            items: [{
                                colSpan: 2,
                                editorType: "dxNumberBox",
                                dataField: "OTR_CSCORDENTRABAJO",
                                label: {
                                    text: "No. de Orden de trabajo"
                                },
                                editorOptions: {
                                    disabled: false
                                },
                                validationRules: [{ type: 'required', message: 'Fecha requerida' }]
                            }, {
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Cancelar",
                                    icon: 'remove',
                                    type: "danger",
                                    width: '100%',
                                    visible: true,
                                    onInitialized: function (e) {

                                    },
                                    onClick() {
                                        $("#Frm_Busqueda_No_Ots").dxForm('instance').resetValues();
                                        $("#Frm_Busqueda_No_Ots").dxForm('instance').option('formData', {});
                                        $("#Pop_Busqueda_No_Ot").dxPopup("hide");
                                    }
                                }
                            }, {
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    text: "Buscar",
                                    icon: 'search',
                                    type: "default",
                                    width: '100%',
                                    visible: true,
                                    onInitialized: function (e) {

                                    },
                                    onClick() {
                                        let FormBusqueda = $("#Frm_Busqueda_No_Ots").dxForm('instance');
                                        if (FormBusqueda.validate().isValid) {
                                            let DataForm = FormBusqueda.option('formData');
                                            self.Consulta_Ordenes_Trabajo(DataForm);
                                            $("#Pop_Busqueda_No_Ot").dxPopup("hide");
                                        }
                                        else {
                                            DevExpress.ui.notify("LLENE LOS CAMPOS EN ROJO", "error", 3000);
                                        }
                                    }
                                }
                            }]
                        }]
                    })
                );

            }
        });

        $("#Pop_Open_Ot").dxPopup({
            hideOnOutsideClick: false,
            title: "Orden de trabajo",
            height: '100%',
            width: '500',
            position: {
                my: 'center',
                at: 'center',
                of: window
            },
            onHiding: function (e) {
                document.getElementById("Mod_Embebed_Ot").src = "";
            },
            onShowing: function (e) {

            },
            onShown: function (e) {
                //!ddocument.getElementById("Mod_Embebed_Ot").src = "../MonitoreoVideoLlamada/?roomName="+NewIdCallMonit;
            }
        });

        function Abrir_Pop_Ots(TIPO, OT_NEWID) {
            let extraVars = "TIPO=" + TIPO
                + "&OT_ID=" + OT_NEWID;
            $("#Pop_Open_Ot").dxPopup("show");
            let UrlPop = "/" + self.patname.split('/')[1] + "/views/Vistas_Ordenes_Trabajo/frm_ots/frm_ots.html?" + extraVars;
            document.getElementById("Mod_Embebed_Ot").src = UrlPop;
        }

        function customizeExcelCell(options) {
            let excelCell = options;
            excelCell.font = {
                name: 'Arial', size: 12
            };
            excelCell.alignment = {
                horizontal: 'left'
            };
        }

        function writeBufferHandler(buffer) {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'REPORTE_OT_' + moment().tz(localStorage.getItem('tmzEmpleado')).format('YYYYMMDD_HH') + '.xlsx');
        }

        $("#Data_Grid_Ot_Admin").dxDataGrid({
            deferRendering: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            rowAlternationEnabled: true,
            allowHeaderFiltering: true,
            height: "100%",
            keyExpr: "OTR_CSCORDENTRABAJO",
            headerFilter: {
                visible: true
            },
            filterRow: {
                visible: true
            },
            filterPanel: {
                visible: true
            },
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            columnFixing: {
                enabled: true
            },
            columnChooser: {
                enabled: true
            },
            selection: {
                mode: "single"
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: {
                visible: true
            },
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
            columnAutoWidth: true,
            export: {
                enabled: true
            },
            onExporting: function (e) {
                let workbook = new ExcelJS.Workbook();
                let worksheet = workbook.addWorksheet('OT');
                DevExpress.excelExporter.exportDataGrid({
                    worksheet: worksheet,
                    component: e.component,
                    customizeCell: customizeExcelCell
                }).then(function () {
                    workbook.xlsx.writeBuffer().then(writeBufferHandler);
                });
                e.cancel = true;
            },
            columns: [
                {
                    caption: "No. OT",
                    dataField: "OTR_CSCORDENTRABAJO",
                    fixed: true,
                    fixedPosition: "left",
                    alignment: "center",
                    width: 85,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "Proceso",
                    dataField: "ESTATUS_ORDEN",
                    alignment: "center",
                    dataType: "string",
                }, {
                    caption: "Titulo",
                    dataField: "OTR_TITULO",
                    alignment: "center",
                    dataType: "string",
                    width: 200
                }, {
                    caption: "Tipo de Orden",
                    dataField: "TIPO_ORDEN",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Sub Tipo",
                    dataField: "SUB_TIPO",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Especialidad",
                    dataField: "TIPO_ESPECIALIDAD_OT",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Centro de Costos",
                    dataField: "CENTRO_COSTOS",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Prioridad",
                    dataField: "TIPO_PRIORIDAD",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Cerrada",
                    dataField: "OTR_CERRADA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Fecha Alta",
                    dataField: "OTR_FECHA_ALTA",
                    alignment: "center",
                    dataType: "date",
                    format: "yyyy-MM-dd HH:mm:ss"
                }, {
                    caption: "Fecha Cierre",
                    dataField: "OTR_FECHA_CIERRE",
                    alignment: "center",
                    dataType: "date",
                    format: "yyyy-MM-dd HH:mm:ss"
                }, {
                    caption: "Fecha Programada Inicio",
                    dataField: "OTR_FECHA_PROGRAMADA_INICIO",
                    alignment: "center",
                    dataType: "date",
                    format: "yyyy-MM-dd HH:mm:ss"
                }, {
                    caption: "Fecha Programada Fin",
                    dataField: "OTR_FECHA_PROGRAMADA_FIN",
                    alignment: "center",
                    dataType: "date",
                    format: "yyyy-MM-dd HH:mm:ss"
                }, {
                    caption: "Fecha Real Inicio",
                    dataField: "OTR_FECHA_REAL_INICIO",
                    alignment: "center",
                    dataType: "date",
                    format: "yyyy-MM-dd HH:mm:ss"
                }, {
                    caption: "Fecha Real Fin",
                    dataField: "OTR_FECHA_REAL_FIN",
                    alignment: "center",
                    dataType: "date",
                    format: "yyyy-MM-dd HH:mm:ss"
                }, {
                    caption: "Tiempo Programado",
                    dataField: "OTR_TIEMPO_PROGRAMADO",
                    alignment: "center",
                    dataType: "time",
                    format: "HH:mm:ss"
                }, {
                    caption: "Tiempo Real",
                    dataField: "OTR_TIEMPO_REAL",
                    alignment: "center",
                    dataType: "time",
                    format: "HH:mm:ss"
                }, {
                    caption: "Area Solicita",
                    dataField: "AREA_SOLICITA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Departamento Solicita",
                    dataField: "DEPARTAMENTO_SOLICITA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Area Responsable",
                    dataField: "AREA_RESPONSABLE",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Despartamento Responsable",
                    dataField: "DEPARTAMENTO_RESPONSABLE",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Calificacion",
                    dataField: "TIPO_CALIFICACION",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Ubicacion",
                    dataField: "OTR_UBICACION",
                    alignment: "center",
                    dataType: "string",
                    visible: false
                }, {
                    caption: "Proveedor",
                    dataField: "CAT_PROVEEDOR_INFRA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Cliente",
                    dataField: "CLIENTE",
                    alignment: "center",
                    dataType: "string",
                    visible: false
                }, {
                    caption: "Campaña",
                    dataField: "CAMPANIA",
                    alignment: "center",
                    dataType: "string",
                    visible: false
                }, {
                    caption: "Sub Campaña",
                    dataField: "SUBCAMPANIA",
                    alignment: "center",
                    dataType: "string",
                    visible: false
                }, {
                    caption: "Solicita",
                    dataField: "EMPLEADO_SOLICITA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Responsable",
                    dataField: "EMPLEADO_RESPONSABLE",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Empleado Alta",
                    dataField: "EMPLEADO_ALTA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Site",
                    dataField: "REQ_NOMBREAREA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Inmueble",
                    dataField: "INM_CLVE_INMUEBLE",
                    alignment: "center",
                    dataType: "string",
                    visible: false
                }, {
                    caption: "Autorizacion",
                    dataField: "CAT_OT_AUTORIZACION",
                    alignment: "center",
                    dataType: "string",
                    visible: false
                }, {
                    caption: "Tipo Tramite",
                    dataField: "TIPO_OT_TRAMITE",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Duracion Años",
                    dataField: "OTR_FECHA_DURACION_ANIOS",
                    alignment: "center",
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    },
                    visible: false
                }, {
                    caption: "Duracion Dias ",
                    dataField: "OTR_FECHA_DURACION_DIAS",
                    alignment: "center",
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    },
                    visible: false
                }, {
                    caption: "Duracion Horas",
                    dataField: "OTR_FECHA_DURACION_HORAS",
                    alignment: "center",
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    },
                    visible: false
                }, {
                    caption: "Duracion Minutos",
                    dataField: "OTR_FECHA_DURACION_MIMUTOS",
                    alignment: "center",
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    },
                    visible: false
                }, {
                    caption: "Moneda",
                    dataField: "MDA_CVEMONEDA",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Costo",
                    dataField: "OTR_COSTO",
                    alignment: "center",
                    dataType: "number",
                    format: {
                        type: "currency",
                        precision: 2,
                        currency: "MXN"
                    }
                }, {
                    caption: "Esfuerzo Requerido",
                    dataField: "OTR_ESFUERZO_REQUERIDO",
                    alignment: "center",
                    dataType: "time",
                    format: "HH:mm:ss"
                }, {
                    caption: "Moneda Total",
                    dataField: "MDA_CVEMONEDA_TOTAL",
                    alignment: "center",
                    dataType: "string"
                }, {
                    caption: "Costo Total",
                    dataField: "OTR_COSTO_TOTAL",
                    alignment: "center",
                    dataType: "number",
                    format: {
                        type: "currency",
                        precision: 2,
                        currency: "MXN"
                    }
                }, {
                    caption: "Estado",
                    dataField: "ESTATUS_OT",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    dataType: "string",
                    cellTemplate(container, options) {
                        if (options.value == "Cerrado") {
                            $('<div>')
                                .css("color", "#FFF")
                                .css("background-color", "#07B40A")
                                .css("border-radius", "0px")
                                .css("border", "double 2px #07B40A")
                                .css("margin", "-4px")
                                .css("padding", "1px")
                                .css("font-weight", "700")
                                .css("text-align", "center")
                                .append(options.data.ESTATUS_OT)
                                .appendTo(container);
                        }
                        else if (options.value == "Con Retrazo") {
                            $('<div>')
                                .css("color", "#FFF")
                                .css("background-color", "#F20000")
                                .css("border-radius", "0px")
                                .css("border", "double 2px #F20000")
                                .css("margin", "-4px")
                                .css("padding", "1px")
                                .css("font-weight", "700")
                                .css("text-align", "center")
                                .append(options.data.ESTATUS_OT)
                                .appendTo(container);
                        }
                        else if (options.value == "En Tiempo") {
                            $('<div>')
                                .css("color", "#FFF")
                                .css("background-color", "#dad901")
                                .css("border-radius", "2px")
                                .css("border", "double 2px #dad901")
                                .css("margin", "-4px")
                                .css("padding", "1px")
                                .css("font-weight", "700")
                                .css("text-align", "center")
                                .append(options.data.ESTATUS_OT)
                                .appendTo(container);
                        }
                    }
                }, {
                    caption: "RTSO_I",
                    dataField: "RTSO_I",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    visible: false,
                    width: 84,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "RTSO_F",
                    dataField: "RTSO_F",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    visible: false,
                    width: 87,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "DP",
                    dataField: "DURACION_PROGRAMADA",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    visible: false,
                    width: 63,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "DR",
                    dataField: "DURACION_REAL",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    visible: false,
                    width: 63,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "Retrazo",
                    dataField: "RETRAZO",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    visible: true,
                    width: 87,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "Al Dia de Hoy",
                    dataField: "ALA_FECHA",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    visible: true,
                    width: 120,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "DC",
                    dataField: "DC",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    visible: false,
                    width: 63,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }, {
                    caption: "AUTH",
                    dataField: "AUTH",
                    fixed: true,
                    fixedPosition: "right",
                    alignment: "center",
                    width: 78,
                    dataType: "number",
                    format: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }
            ],

            summary: {
                totalItems: [{
                    name: "Total",
                    showInColumn: "OTR_CSCORDENTRABAJO",
                    displayFormat: "Total: {0}",
                    summaryType: "count"
                }
                ]
            },
            onRowDblClick: function (e) {
                console.log(e.data);
                //AbrirPop
                setTimeout(() => {
                    Abrir_Pop_Ots('EDITAR', e.data.OTR_NEWID)
                }, 1000);
            }

        });

        $("#PivotDG_Orden_Admin").dxPivotGrid({
            allowSortingBySummary: true,
            allowSorting: true,
            allowFiltering: true,
            showColumnGrandTotals: false,
            showColumnTotals: false,
            showRowGrandTotals: true,
            showRowTotals: false,
            scrolling: {
                mode: 'horizontal'
            },
            height: "100%",
            showBorders: true,
            fieldPanel: {
                showColumnFields: true,
                showDataFields: true,
                showFilterFields: true,
                showRowFields: true,
                allowFieldDragging: true,
                visible: true,
            },
            fieldChooser: {
                height: 500,
            },
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'dx-widget-gallery-pivotgrid-admin-orden-trabajo',
            },
            export: {
                enabled: true
            }, onExporting: function (e) {
                let workbook = new ExcelJS.Workbook();
                let worksheet = workbook.addWorksheet('Orden Trabajo');
                DevExpress.excelExporter.exportPivotGrid({
                    worksheet: worksheet,
                    component: e.component,
                    customizeCell: customizeExcelCell
                }).then(function () {
                    workbook.xlsx.writeBuffer().then(writeBufferHandler);
                });
                e.cancel = true;
            },
            dataSource: {
                fields: [
                    {
                        caption: 'Fecha de Alta',
                        dataField: 'OTR_FECHA_ALTA',
                        icon: "",
                        dataType: 'date',
                        format: 'yyyy-MMM-dd',
                        alignment: 'center',
                        area: 'filter',
                    },
                    {
                        caption: 'Fecha Programa Fin',
                        dataField: 'OTR_FECHA_PROGRAMADA_FIN',
                        dataType: 'date',
                        format: 'shortDate',
                        alignment: 'center',
                        area: 'filter'
                    },
                    {
                        caption: 'Fecha de Cierre',
                        dataField: 'OTR_FECHA_CIERRE',
                        dataType: 'date',
                        format: 'shortDate',
                        alignment: 'center',
                        area: 'filter'
                    },
                    {
                        caption: 'Proceso',
                        dataField: 'ESTATUS_ORDEN',
                        alignment: 'center',
                        area: 'column',
                    },
                    {
                        caption: 'Tipo de Orden',
                        dataField: 'TIPO_ORDEN',
                        alignment: 'center',
                        area: 'row'
                    },
                    {
                        caption: 'Sub Tipo',
                        dataField: 'SUB_TIPO',
                        alignment: 'center',
                        area: 'row'
                    },
                    {
                        caption: 'Especialidad',
                        dataField: 'TIPO_ESPECIALIDAD_OT',
                        alignment: 'center',
                        width: 150,
                        area: 'row',
                    },
                    {
                        caption: 'Conteo',
                        dataField: 'OTR_CSCORDENTRABAJO',
                        dataType: 'number',
                        summaryType: 'count',
                        alignment: 'center',
                        area: 'data',
                    },
                    {
                        caption: 'Duracion',
                        dataField: 'OTR_TIEMPO_REAL',
                        alignment: 'center',
                        dataType: 'time',
                        summaryType: 'sum',
                        area: 'data',
                        cellClass: 'custom-cell'
                    },
                    {
                        caption: '%',
                        dataField: 'OTR_CSCORDENTRABAJO',
                        dataType: 'number',
                        summaryType: 'count',
                        summaryDisplayMode: 'percentOfColumnGrandTotal',
                        area: 'data',
                    }],
            },
        }).dxPivotGrid('instance');

        self.cargaArbolTicket();
    }

    self.cargaArbolTicket = function () {

        let ArbolPrincipal = [{
            "ID": 1,
            "CLAVE_ITEM": "INICIAL",
            "NODO_TAG": "INICIAL",
            "DESCRIPCION": obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_AMATERNOEMPLEADO,
            "Task_Parent_ID": 0,
            "ICON": "MYUSER"
        }, {
            "ID": 2,
            "NODO_TAG": "Asignadas",
            "CLAVE_ITEM": "ASIGNADA",
            "DESCRIPCION": "Ots Asignadas",
            "Task_Parent_ID": 1,
            "ICON": "USER"
        }, {
            "ID": 3,
            "NODO_TAG": "INTORDEN",
            "CLAVE_ITEM": "INTORDEN",
            "DESCRIPCION": "Ordenes de trabajo",
            "Task_Parent_ID": 0,
            "ICON": "FOLDER"
        }, {
            "ID": 4,
            "NODO_TAG": "TODAS",
            "CLAVE_ITEM": "TODAS",
            "DESCRIPCION": "Todas",
            "Task_Parent_ID": 3,
            "ICON": "TODAS"
        }, {
            "ID": 5,
            "NODO_TAG": "NO_OT",
            "CLAVE_ITEM": "NO_OT",
            "DESCRIPCION": "No. OT",
            "Task_Parent_ID": 3,
            "ICON": "SEARCH"
        }, {
            "ID": 6,
            "NODO_TAG": "ABIERTA",
            "CLAVE_ITEM": "ABIERTA",
            "DESCRIPCION": "Abiertas",
            "Task_Parent_ID": 3,
            "ICON": "ABIERTAS"
        }, {
            "ID": 7,
            "NODO_TAG": "CERRADA",
            "CLAVE_ITEM": "CERRADA",
            "DESCRIPCION": "Cerradas",
            "Task_Parent_ID": 3,
            "ICON": "CERRADAS"
        }, {
            "ID": 8,
            "NODO_TAG": "SINASIGNACION",
            "CLAVE_ITEM": "SINASIGNACION",
            "DESCRIPCION": "No Asignadas",
            "Task_Parent_ID": 3,
            "ICON": "SINASIG"
        }, {
            "ID": 9,
            "NODO_TAG": "VENC",
            "CLAVE_ITEM": "VENC",
            "DESCRIPCION": "Vencimiento",
            "Task_Parent_ID": 0,
            "ICON": "VENCIMIENTO"
        }, {
            "ID": 10,
            "NODO_TAG": "OTVENC",
            "CLAVE_ITEM": "OTVENC",
            "DESCRIPCION": "Vencidas",
            "Task_Parent_ID": 9,
            "ICON": "VENCIDAS"
        }, {
            "ID": 11,
            "NODO_TAG": "OTVENCHOY",
            "CLAVE_ITEM": "OTVENCHOY",
            "DESCRIPCION": "Vencen Hoy",
            "Task_Parent_ID": 9,
            "ICON": "VENCENHOY"
        }, {
            "ID": 12,
            "NODO_TAG": "OTVENCP",
            "CLAVE_ITEM": "OTVENCP",
            "DESCRIPCION": "Proximas a Vencer",
            "Task_Parent_ID": 9,
            "ICON": "PROXIMASVENCER"
        }];

        let IdAutronicrement = 13;
        $("#__tree_Ot_ADmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);


        let _ary_Estatus = { Tbl: "SAMT_ESTATUS_ORDEN_TRABAJO", WHR: "EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') + " AND ESTATUS_ORDEN_ACTIVO = 1" };
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Whr', 'GET', _ary_Estatus, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
            if (all_data.success == true) {
                let DataEstatus = all_data.JsonData
                //Alta de parent Estatus
                ArbolPrincipal.push({
                    "ID": IdAutronicrement,
                    "CLAVE_ITEM": "ESTATUS",
                    "NODO_TAG": "ESTATUS",
                    "DESCRIPCION": "Estatus",
                    "Task_Parent_ID": 0,
                    "ICON": "ESTATUS_OT",
                });
                let Id_Parent = parseInt(IdAutronicrement + "");
                IdAutronicrement++;

                //?Set Catalogo estatus activo
                for (const element of DataEstatus) {
                    ArbolPrincipal.push({
                        "ID": IdAutronicrement,
                        "CLAVE_ITEM": element.ESTATUS_ORDEN_CSC,
                        "NODO_TAG": "ESTATUS",
                        "DESCRIPCION": element.ESTATUS_ORDEN_IDIOMA1,
                        "Task_Parent_ID": Id_Parent,
                        "ICON": "ESTATUS_OT",
                    });
                    IdAutronicrement++;
                }

                $("#__tree_Ot_ADmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);

                loadPanel.hide();
            }
        });

        //Alta arbol para el catalogo de prioridad
        let _ary_Prioridad = { Tbl: "SAMT_TIPO_PRIORIDAD_OT", WHR: "EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') + " AND TIPO_PRIORIDAD_ACTIVO = 1" };
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Whr', 'GET', _ary_Prioridad, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
            if (all_data.success == true) {
                let DataPrioridad = all_data.JsonData
                //Alta de parent Prioridad
                ArbolPrincipal.push({
                    "ID": IdAutronicrement,
                    "CLAVE_ITEM": "OTPRIORIDAD",
                    "NODO_TAG": "OTPRIORIDAD",
                    "DESCRIPCION": "Prioridad",
                    "Task_Parent_ID": 0,
                    "ICON": "PRIORIDAD_PARENT",
                });
                let Id_Parent = parseInt(IdAutronicrement + "");
                IdAutronicrement++;

                //Set Catalogo estatus activo
                for (const element of DataPrioridad) {
                    ArbolPrincipal.push({
                        "ID": IdAutronicrement,
                        "CLAVE_ITEM": element.TIPO_PRIORIDAD_CSC,
                        "NODO_TAG": "OTPRIORIDAD",
                        "DESCRIPCION": element.TIPO_PRIORIDAD_IDIOMA1,
                        "Task_Parent_ID": Id_Parent,
                        "ICON": "PRIORIDAD",
                    });
                    IdAutronicrement++;
                }

                $("#__tree_Ot_ADmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);

                loadPanel.hide();
            }
        });


        //Alta arbol para el catalogo de Area
        let _ary_Area = { Tbl: "SAMT_CAT_EMPLEADO_DEPARTAMENTO", WHR: "EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') + " AND SAMT_TIPO_DEPARTAMENTO_ACTIVO = 1" };
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Whr', 'GET', _ary_Area, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
            if (all_data.success == true) {
                let DataArea = all_data.JsonData
                //Alta de parent Area
                ArbolPrincipal.push({
                    "ID": IdAutronicrement,
                    "CLAVE_ITEM": "OTAREA",
                    "NODO_TAG": "OTAREA",
                    "DESCRIPCION": "Area",
                    "Task_Parent_ID": 0,
                    "ICON": "AREA_PARENT",
                });
                let Id_Parent = parseInt(IdAutronicrement + "");
                IdAutronicrement++;

                //Set Area estatus activo
                for (const element of DataArea) {
                    ArbolPrincipal.push({
                        "ID": IdAutronicrement,
                        "CLAVE_ITEM": element.EMPLEADO_DEPARTAMENTO_CSC,
                        "NODO_TAG": "AREA",
                        "DESCRIPCION": element.SAMT_TIPO_DEPARTAMENTO_IDIOMA1,
                        "Task_Parent_ID": Id_Parent,
                        "ICON": "AREA_DEPARTAMENTO",
                    });

                    let Id_Parent_Hijo = parseInt(IdAutronicrement + "");
                    IdAutronicrement++;





                    //?Alta arbol para el catalogo de departamento Operaciones
                    let _ary_CatDepartamento = { Tbl: "SAMT_CAT_EMPLEADO_DEPARTAMENTO", WHR: "EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') + " AND SAMT_TIPO_DEPARTAMENTO_ACTIVO = 1 AND TIPO_AREA_CSC = " + element.EMPLEADO_DEPARTAMENTO_CSC };
                    __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url + 'Get_Cat_Whr', 'GET', _ary_CatDepartamento, getJSON(DeveloperType).ApiGeneral.token).then((all_data) => {
                        if (all_data.success == true) {
                            let DataDepartamento = all_data.JsonData
                            //Set Catalogo departamento activo
                            for (const element of DataDepartamento) {
                                ArbolPrincipal.push({
                                    "ID": IdAutronicrement,
                                    "CLAVE_ITEM": element.EMPLEADO_DEPARTAMENTO_CSC,
                                    "NODO_TAG": "DEPARTAMENTO",
                                    "DESCRIPCION": element.SAMT_TIPO_DEPARTAMENTO_IDIOMA1,
                                    "Task_Parent_ID": Id_Parent_Hijo,
                                    "ICON": "AREA_OPERACION",
                                });
                                IdAutronicrement++;
                            }

                            $("#__tree_Ot_ADmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);

                            loadPanel.hide();
                        }



                    });

                }

                $("#__tree_Ot_ADmin").dxTreeView("instance").option("dataSource", ArbolPrincipal);

                loadPanel.hide();
            }
        });

    };

    self.Consulta_Ordenes_Trabajo = function (itemData) {
        $("#Data_Grid_Ot_Admin").dxDataGrid("instance").option("dataSource", []);
        $('#PivotDG_Orden_Admin').dxPivotGrid('instance').option('dataSource', {
            store: []
        });

        let __Obj_Data_Ots = {
            ...ReturnDefaultData_Init(),
        };

        switch (itemData.CLAVE_ITEM) {
            case "ASIGNADA":
                __Obj_Data_Ots.OTR_CERRADA = 0;
                __Obj_Data_Ots.EMPLEADO_CSC_RESPONSABLE = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                break;
            case "TODAS":
                __Obj_Data_Ots.TIC_FECHA_INICIAL = itemData.TIC_FECHA_INICIAL + " 00:00:00";
                __Obj_Data_Ots.TIC_FECHA_FINAL = itemData.TIC_FECHA_FINAL + " 23:59:59";
                break;
            case "NO_OT":
                __Obj_Data_Ots.OTR_CSCORDENTRABAJO = itemData.OTR_CSCORDENTRABAJO;
                break;
            case "ABIERTA":
                __Obj_Data_Ots.OTR_CERRADA = 0;
                break;
            case "CERRADA":
                __Obj_Data_Ots.OTR_CERRADA = 1;
                __Obj_Data_Ots.TIC_FECHA_INICIAL = itemData.TIC_FECHA_INICIAL + " 00:00:00";
                __Obj_Data_Ots.TIC_FECHA_FINAL = itemData.TIC_FECHA_FINAL + " 23:59:59";
                break;
            case "SINASIGNACION":
                __Obj_Data_Ots.OTR_CERRADA = 0;
                __Obj_Data_Ots.EMPLEADO_CSC_RESPONSABLE = 0;
                break;
            case "OTVENC":
                __Obj_Data_Ots.OTR_CERRADA = 0;
                break;
            case "OTVENCHOY":
                __Obj_Data_Ots.OTR_CERRADA = 0;
                break;
            case "OTVENCP":
                __Obj_Data_Ots.OTR_CERRADA = 0;
                break;
        }


        switch (itemData.NODO_TAG) {
            case "ESTATUS":
                __Obj_Data_Ots.ESTATUS_ORDEN_CSC = itemData.CLAVE_ITEM;
                break;
            case "OTPRIORIDAD":
                __Obj_Data_Ots.TIPO_PRIORIDAD_CSC = itemData.CLAVE_ITEM;
                break;
            case "AREA":
                __Obj_Data_Ots.TIPO_AREA_CSC_RESPONSABLE = itemData.CLAVE_ITEM;
                __Obj_Data_Ots.TIC_FECHA_INICIAL = itemData.TIC_FECHA_INICIAL + " 00:00:00";
                __Obj_Data_Ots.TIC_FECHA_FINAL = itemData.TIC_FECHA_FINAL + " 23:59:59";
                break;
            case "DEPARTAMENTO":
                __Obj_Data_Ots.CAT_DEPTO_CSC_RESPONSABLE = itemData.CLAVE_ITEM;
                __Obj_Data_Ots.TIC_FECHA_INICIAL = itemData.TIC_FECHA_INICIAL + " 00:00:00";
                __Obj_Data_Ots.TIC_FECHA_FINAL = itemData.TIC_FECHA_FINAL + " 23:59:59";
                break;
        }

        __Obj_Data_Ots.CLAVE_ITEM = itemData.CLAVE_ITEM;
        __Obj_Data_Ots.NODO_TAG = itemData.NODO_TAG;

        loadPanel.show();

        __Request_Http_Mode(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url + 'Get_Vista_Orden_Trabajo', 'GET', __Obj_Data_Ots, getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((all_data) => {
            if (all_data.success == true) {
                $("#Data_Grid_Ot_Admin").dxDataGrid("instance").option("dataSource", all_data.JsonData);
                $('#PivotDG_Orden_Admin').dxPivotGrid('instance').option('dataSource', {
                    store: all_data.JsonData
                });
                loadPanel.hide();
            }
            else {
                $("#Data_Grid_Ot_Admin").dxDataGrid("instance").option("dataSource", []);
                $('#PivotDG_Orden_Admin').dxPivotGrid('instance').option('dataSource', {
                    store: []
                });
                loadPanel.hide();
                DevExpress.ui.notify("No se localizo ninguna Ot", "success", 3000);
            }
        })
            .catch(function (e) {
                $("#Data_Grid_Ot_Admin").dxDataGrid("instance").option("dataSource", []);
                $('#PivotDG_Orden_Admin').dxPivotGrid('instance').option('dataSource', {
                    store: []
                });
                loadPanel.hide();
                DevExpress.ui.notify("Error de de busqueda vueva a intentar nuevamente", "error", 3000);
            });

    };
}

setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);