SalesDashboard.dashboardModel = function() {
    var self = this;
    this.infoEmpleado = [];
    this.servEmpleado = [];
    this.onlyVideoService = [];
    this.EstatusEquipo = [];
    var EstatusSolicitud ={};
    var EstatusLlamada = {};
    
    var CampaMonitorea = null;

    var porcentaje_sla=null;
    var porcentaje_abandono=null;
    var porcentaje_contestada=null;
    var ioRealTimeAgentes = "https://realtime.dnasystem.io";
    //var ioRealTimeAgentes = "https://localhost:2090";
    
    var socketRealTimeAgentes = io.connect(ioRealTimeAgentes, { 'forceNew': true });

    var datosOb = [];

    
    var chartAba =  Highcharts.chart('agts-container-rpm', {
        chart: {type: 'solidgauge'},
        credits: {enabled: false},
        title: false,
        exporting: false,
        tooltip: false,
        pane: {startAngle: 0,endAngle: 360,background: [{outerRadius: '112%',innerRadius: '88%',backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),borderWidth: 0}]},
        yAxis: {min: 0,max: 100,lineWidth: 0,tickPositions: []},
        plotOptions: {
            solidgauge: {
                dataLabels: {y: -10,borderWidth: 0,format: '<div style="text-align:center"><span style="font-size:14px;color: black">{point.y}%</span></div>'},
                linecap: 'round',
                stickyTracking: true,
                rounded: true
            }
        },
    
        series: [{
            name: '%OCC',
            data: [{
                color: {
                    radialGradient: {
                        cx: 0.5,
                        cy: 0.3,
                        r: 0.7
                    },
                    stops: [
                      [0, '#FFD54C'],
                      [1, '#FF630A']
                    ]
                  },
                radius: '112%',
                innerRadius: '88%',
                y: 0
            }]
        }]
    });

    var chartSLA=  Highcharts.chart('agts-container-sla', {
        chart: {type: 'solidgauge'},
        credits: {enabled: false},
        title: false,
        exporting: false,
        tooltip: false,
        pane: {startAngle: 0,endAngle: 360,background: [{outerRadius: '112%',innerRadius: '88%',backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),borderWidth: 0}]},
        yAxis: {min: 0,max: 100,lineWidth: 0,tickPositions: []},
        plotOptions: {
            solidgauge: {
                dataLabels: {y: -10,borderWidth: 0,format: '<div style="text-align:center"><span style="font-size:14px;color: black">{point.y}%</span></div>'},
                linecap: 'round',
                stickyTracking: true,
                rounded: true
            }
        },
    
        series: [{
            name: '%OCC',
            data: [{
                color: {
                    radialGradient: {
                        cx: 0.5,
                        cy: 0.3,
                        r: 0.7
                    },
                    stops: [
                      [0, '#FFD54C'],
                      [1, '#FF630A']
                    ]
                  },
                radius: '112%',
                innerRadius: '88%',
                y: 0
            }]
        }]
    });

    var chartCont=  Highcharts.chart('agts-container-cont', {
        chart: {type: 'solidgauge'},
        credits: {enabled: false},
        title: false,
        exporting: false,
        tooltip: false,
        pane: {startAngle: 0,endAngle: 360,background: [{outerRadius: '112%',innerRadius: '88%',backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),borderWidth: 0}]},
        yAxis: {min: 0,max: 100,lineWidth: 0,tickPositions: []},
        plotOptions: {
            solidgauge: {
                dataLabels: {y: -10,borderWidth: 0,format: '<div style="text-align:center"><span style="font-size:14px;color: black">{point.y}%</span></div>'},
                linecap: 'round',
                stickyTracking: true,
                rounded: true
            }
        },
    
        series: [{
            name: '%OCC',
            data: [{
                color: {
                    radialGradient: {
                        cx: 0.5,
                        cy: 0.3,
                        r: 0.7
                    },
                    stops: [
                      [0, '#FFD54C'],
                      [1, '#FF630A']
                    ]
                  },
                radius: '112%',
                innerRadius: '88%',
                y: 0
            }]
        }]
    });

    self.removeByKey = function(array, params){
        array.some(function(item, index) {
            return (array[index][params.CAM_CSC_SERVICIO] === params.CAM_CSC_SERVICIO) ? !!(array.splice(index, 1)) : false;
        });
        return array;
    }
    
    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es-mx";}
        /** SIEMPRE AGREGAR ESTA LINEA */
        
        this.infoEmpleado = JSON.parse(localStorage.getItem('obj_DatosEmpleado'));
        this.servEmpleado = JSON.parse( sessionStorage.getItem("serv_empl"));
        this.onlyVideoService = jslinq(this.servEmpleado).where(function(el){return el.TIPO_SERVICIO_CAM_CSC == 3;}).toList();

        try {
            var asllServicios = {Tbl:"SAMT_CAM_ESTATUS_PRESENCIA_SOLICITUD",NACTIVE:"ESTATUS_SOLICITUD_ACTIVO",NDEFAULT:"ESTATUS_SOLICITUD_DEFAULT"};
            __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',asllServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                if (dataInsert.success == true) { 
                    EstatusSolicitud = dataInsert.JsonData;
                    return dataInsert.JsonData;
                } else {
                    console.log(dataInsert.message);
                }
            }); 
        } catch (error) {
            console.log(error);
        }


        try {
            var estatus_operacion = {Tbl:"SAMT_CAM_TIPO_ESTATUS_OPERACION",NACTIVE:"TIPO_ESTATUS_ACTIVO",NDEFAULT:"TIPO_ESTATUS_DEFAULT"};
            __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',estatus_operacion,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                if (dataInsert.success == true) { 
                    EstatusLlamada = dataInsert.JsonData;
                    return dataInsert.JsonData;
                } else {
                    console.log(dataInsert.message);
                }
            }); 
        } catch (error) {
            console.log(error);
        }        
        

        /*porcentaje_sla = new Highcharts.Chart({
            chart: {type: 'solidgauge',renderTo: 'porcentaje_sla'},
            credits: {enabled: false},
            title: false,
            exporting: false,
            tooltip: false,
            pane: {startAngle: 0,endAngle: 360,background: [{outerRadius: '112%',innerRadius: '88%',backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),borderWidth: 0}]},
            yAxis: {min: 0,max: 100,lineWidth: 0,tickPositions: []},
            plotOptions: {solidgauge: {
                dataLabels: {y: -10,borderWidth: 0,format: '<div style="text-align:center"><span style="font-size:14px;color: black">{point.y}%</span></div>'},
                linecap: 'round',
                stickyTracking: true,
                rounded: true
            }},
            series: []
        });

        porcentaje_abandono = new Highcharts.Chart({
            chart: {type: 'solidgauge',renderTo: 'porcentaje_abandono'},
            credits: {enabled: false},
            title: false,
            exporting: false,
            tooltip: false,
            pane: {startAngle: 0,endAngle: 360,background: [{outerRadius: '112%',innerRadius: '88%',backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),borderWidth: 0}]},
            yAxis: {min: 0,max: 100,lineWidth: 0,tickPositions: []},
            plotOptions: {solidgauge: {
                dataLabels: {y: -10,borderWidth: 0,format: '<div style="text-align:center"><span style="font-size:14px;color: black">{point.y}%</span></div>'},
                linecap: 'round',
                stickyTracking: true,
                rounded: true
            }},
            series: []
        });

        porcentaje_contestada= new Highcharts.Chart({
            chart: {type: 'solidgauge',renderTo: 'porcentaje_contestada'},
            credits: {enabled: false},
            title: false,
            exporting: false,
            tooltip: false,
            pane: {startAngle: 0,endAngle: 360,background: [{outerRadius: '112%',innerRadius: '88%',backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),borderWidth: 0}]},
            yAxis: {min: 0,max: 100,lineWidth: 0,tickPositions: []},
            plotOptions: {solidgauge: {
                dataLabels: {y: -10,borderWidth: 0,format: '<div style="text-align:center"><span style="font-size:14px;color: black">{point.y}%</span></div>'},
                linecap: 'round',
                stickyTracking: true,
                rounded: true
            }},
            series: []
        });*/

        /*Highcharts.chart('ventas-chart', {
            chart: {zoomType: 'xy'},
            title: null,
            credits: {enabled: false},
            exporting: false,
            xAxis: [{
                categories: ['09','10','11','12','13','14','15','16','17','18','19','20','21','22'],
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Llamadas',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                opposite: true
        
            }],
            tooltip: {
                shared: true
            },
            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 55,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || // theme
                    'rgba(255,255,255,0.25)'
            },
            series: [{
                name: 'TOTAL LLAMADAS',
                type: 'column',
                data: [8,7,12,8,0,8,8,8,8,8,4,0,8],
                color: {
                    linearGradient: {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1
                      },
                    stops: [
                      [0, '#FF630A'],
                      [1, '#FFD54C']
                    ]
                  },
                           
            },{
                name: 'ABANDONADAS',
                type: 'line',
                yAxis: 0,
                data: [0,0,0,1,0,0,0,0,0,0,1,0,0],
                marker: {
                    enabled: true
                },
                
        
            }, {
                name: 'CONTESTADAS',
                type: 'line',
                yAxis: 0,
                data: [8,7,12,7,0,8,8,8,8,8,3,0,8],
                marker: {
                    enabled: true
                },
                
        
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            floating: false,
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 0
                        },
                        yAxis: [{
                            labels: {
                                align: 'right',
                                x: 0,
                                y: -6
                            },
                            showLastLabel: false
                        }, {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -6
                            },
                            showLastLabel: false
                        }, {
                            visible: false
                        }]
                    }
                }]
            }
        });*/


            /*Highcharts.chart('porcentaje_sla', {
                chart: {type: 'solidgauge',},
                credits: {enabled: false},
                title: false,
                exporting: false,
                tooltip: false,
                pane: {startAngle: 0,endAngle: 360,background: [{outerRadius: '112%',innerRadius: '88%',backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),borderWidth: 0}]},
                yAxis: {min: 0,max: 100,lineWidth: 0,tickPositions: []},
                plotOptions: {solidgauge: {
                    dataLabels: {y: -10,borderWidth: 0,format: '<div style="text-align:center"><span style="font-size:14px;color: black">{point.y}%</span></div>'},
                    linecap: 'round',
                    stickyTracking: true,
                    rounded: true
                }},
                series: [{
                name: '%ADH Hrs',
                data: [{
                        color: {
                            radialGradient: {
                                cx: 0.5,
                                cy: 0.3,
                                r: 0.7
                            },
                            stops: [
                                [0, '#FFD54C'],
                                [1, '#FF630A']
                            ]
                            },
                        radius: '112%',
                        innerRadius: '88%',
                        y: 98.96
                    }]}]
                });*/
      
    
                $("#Mod_Agte_BarraFiltro").dxToolbar({
                    items: [
                        /** Busqueda por Numero Externo */
                        {
                            template: function() {
                                return $("<div class='toolbar-label' style='margin-left:5px;'><b> Campañas:</div>");
                            }
                        },{
                            widget: 'dxSelectBox',
                            options: {
                                dataSource: this.onlyVideoService,
                                displayExpr: "CAM_SERVICIO_NOMBRE",
                                valueExpr: "CAM_CSC_SERVICIO",
                                onContentReady(e) {  
                                    let items = e.component.getDataSource().items();  
                                    
                                    if (items.length >= 1) {  
                                       e.component.option("value", items[0].CAM_CSC_SERVICIO);  
                                       console.log(items[0].CAM_CSC_SERVICIO);
                                    }  
                                 },
                                deferRendering: false,
                                readOnly: false,
                                label: { 
                                    text: "Estatus de Documento",
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "Seleccione campaña"
                                }],
                                onValueChanged: function (e) {
                                    var previousValue = e.previousValue;
                                    var newValue = e.value;
                                    CampaMonitorea = newValue;
                                    // Event handling commands go here
                                }
                            }
                            
                        },
                        /** Busqueda por Numero Externo */
                    ]
                });
                
      $("#gridFilaEspera").dxDataGrid({
        selection: {
            mode: "single"
        },
        height: '100%',
        paging: {
            enabled: false,
            pageIndex: 0,
            pageSize: 20
        },
        headerFilter: { visible: true },
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        showBorders: true,
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        repaintChangesOnly: true,
        highlightChanges: true,
        loadPanel:{
            enabled: false,
        },
        columns: [
          {
            caption: "FILA DE ESPERA",
            dataField: "ESTATUS_SOLICITUD_IDIOMA1",
            cellTemplate: function (container, options) {
                var Valor = options.data.ESTATUS_SOLICITUD_CLAVE;
                var Testa = options.data.TESTATUS;
                var Orig = options.data.PRESENCIA_SOLICITUD_ORIGEN;
                    $("<div>")
                    .append($("<img>", { "src": "images/Icons/"+Valor+".gif" }).css({ "height": "32px", "width": "32px", "float":"left", "margin-right":"2px" }))
                    .append("<div>"+options.value+ ' ' + Testa +"</div>").css({ "font-size": "10px"})
                    .append("<div>"+Orig+"</div>").css({ "font-size": "9px"})
                    .appendTo(container);
            },
        }]
    });

    $("#GridEqDesconectados").dxDataGrid({
        selection: {
            mode: "single"
        },
        height: '100%',
        paging: {
            enabled: false,
            pageIndex: 0,
            pageSize: 20
        },
        headerFilter: { visible: true },
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        showBorders: true,
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        repaintChangesOnly: true,
        highlightChanges: true,
        loadPanel:{
            enabled: false,
        },
        columns: [
          {
            caption: "EQUIPOS DESCONECTADOS",
            dataField: "REQ_NOMBREAREA",
            cellTemplate: function (container, options) {
                var Valor = options.data.TIPO_DISPOSITIVO_CLAVE;
                    $("<div>")
                    .append($("<img>", { "src": "images/Icons/"+Valor+".png" }).css({ "height": "24px", "width": "24px", "float":"left", "margin-right":"2px" }))
                    .append("<div>"+options.value+"</div>").css({ "line-height": "2"})
                    .appendTo(container);
            },
        }]
    });

    
    
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
        /*if (e.data.ESTATUS_SOLICITUD_CLAVE == "CONECT") {
            $("#PopVideoLlamada").dxPopup("show");
        } else {
            DevExpress.ui.notify("NO ES POSIBLE MONITORER, LLAMADA AUN NO CONECTADA, ESTATUS: "+ e.data.ESTATUS_SOLICITUD_IDIOMA1, "info", 5000);   
        } */       
      },
      columns: [
        {
            caption: "ID",
            dataField: "CAM_CSC_SERVICIO",
        },
        {
            caption: "AGENTE",
            dataField: "EMPLEADO_NOMBREEMPLEADO",
            cellTemplate: function (container, options) {
              var Valor = options.data.EMPLEADO_NOMBREEMPLEADO + ' '+ options.data.EMPLEADO_APATERNOEMPLEADO + ' '+ options.data.EMPLEADO_AMATERNOEMPLEADO;
                  $("<div>")
                  //.append($("<img>", { "src": "images/Icons/"+Valor+".gif" }).css({ "height": "34px", "width": "34px", "float":"left", "margin-right":"2px" }))
                  .append("<div>"+Valor+"</div>")
                  .appendTo(container);
          },
        },{
            caption: "TIEMPO TOTAL FIRMADO",
            dataField: "TFIRMADO",
                cellTemplate: function (container, options) {
                    var Valor = options.data.ESTATUS_SOLICITUD_CLAVE;
                        $("<div>")
                        //.append($("<img>", { "src": "images/Icons/"+Valor+".gif" }).css({ "height": "34px", "width": "34px", "float":"left", "margin-right":"2px" }))
                        .append("<div>"+options.value+"</div>")
                        .appendTo(container);
                },
        }, {
            caption: "CAMPAÑA",
            groupIndex: 1,
            dataField: "CAM_CSC_SERVICIO",
            width: 200,
            lookup: {
                dataSource: this.onlyVideoService,
                displayExpr: "CAM_SERVICIO_NOMBRE",
                valueExpr: "CAM_CSC_SERVICIO",
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
            dataField: "TULTIMOSTATUS",
                cellTemplate: function (container, options) {
                    var Valor = options.data.ESTATUS_SOLICITUD_CLAVE;
                        $("<div>")
                        //.append($("<img>", { "src": "images/Icons/"+Valor+".gif" }).css({ "height": "34px", "width": "34px", "float":"left", "margin-right":"2px" }))
                        .append("<div>"+options.value+"</div>")
                        .appendTo(container);
                },
        },
        
        /*{
          caption: "ESTATUS",
          dataField: "ESTATUS_SOLICITUD_IDIOMA1",
          cellTemplate: function (container, options) {
            var Valor = options.data.ESTATUS_SOLICITUD_CLAVE;
                $("<div>")
                .append($("<img>", { "src": "images/Icons/"+Valor+".gif" }).css({ "height": "34px", "width": "34px", "float":"left", "margin-right":"2px" }))
                .append("<div>"+options.value+"</div>").css({ "line-height": "2.5"})
                .appendTo(container);
        },
      },{
        caption: "ORIGEN",
        dataField: "PRESENCIA_SOLICITUD_ORIGEN",
        cellTemplate: function (container, options) {
            var Valor = options.data.ESTATUS_SOLICITUD_CLAVE;
                $("<div>")
                //.append($("<img>", { "src": "images/Icons/"+Valor+".gif" }).css({ "height": "34px", "width": "34px", "float":"left", "margin-right":"2px" }))
                .append("<div>"+options.value+"</div>").css({ "line-height": "2.5"})
                .appendTo(container);
        },
    }*/]
  });

    $("#PopVideoLlamada").dxPopup({
        hideOnOutsideClick:true,
        title: "Video Llamada",
        height: function() {  
            return 550//$(window).height() * 0.90  
        },  
        width: function() {  
            return 500//$(window).width() * 0.90 
        },
        position: {  
            my: 'center',  
            at: 'center',  
            of: window  
        }, 
        onHiding: function (e) {
            document.getElementById("Mod_Embebed_VideoRealTime").src = "";
        },
        onShowing: function(e) {
            
        },
        onShown: function (e) {
            var dataGrid = $("#gridAgentes").dxDataGrid("instance");
            var selectedRowsData = dataGrid.getSelectedRowsData();
            console.log(selectedRowsData[0]);
            document.getElementById("Mod_Embebed_VideoRealTime").src = "../MonitoreoVideoLlamada/?roomName="+selectedRowsData[0].PRESENCIA_SOLICITUD_NEWID;  
        }
    });


    

      
    socketRealTimeAgentes.on(localStorage.getItem('EMP_CLV_EMPRESA')+"_SOLICITUDES", function(data) {
        var __Ended = EstatusSolicitud.find( Ary_Data => Ary_Data.ESTATUS_SOLICITUD_CLAVE == "HANGUP" );
        var __EndedStatus = __Ended.ESTATUS_CAM_SOLICITUD_CSC;
        var SoldatosOb = data.JsonData;
        SoldatosOb = jslinq(SoldatosOb).where(function(el){return el.CAM_CSC_SERVICIO == CampaMonitorea;}).toList();
        var filtro = jslinq(SoldatosOb).where(function(el){return el.ESTATUS_CAM_SOLICITUD_CSC != __EndedStatus;}).toList();
        var __QueueAgentes = EstatusSolicitud.find( Ary_Data => Ary_Data.ESTATUS_SOLICITUD_CLAVE == "FILA" );
        var __QueueAgentesStatus = __QueueAgentes.ESTATUS_CAM_SOLICITUD_CSC;
        var __FillQueueAgentes = jslinq(SoldatosOb).where(function(el){return el.ESTATUS_CAM_SOLICITUD_CSC == __QueueAgentesStatus;}).toList();
        $('#QueueAgentes').html(__FillQueueAgentes.length);
        $("#gridFilaEspera").dxDataGrid("instance").option("dataSource", __FillQueueAgentes);

        var __InCallAgentes = EstatusSolicitud.find( Ary_Data => Ary_Data.ESTATUS_SOLICITUD_CLAVE == "CONECT" );
        var __InCallAgentesStatus = __InCallAgentes.ESTATUS_CAM_SOLICITUD_CSC;
        var __FillInCallAgentes = jslinq(SoldatosOb).where(function(el){return el.ESTATUS_CAM_SOLICITUD_CSC == __InCallAgentesStatus;}).toList();
        $('#InCallAgentes').html(__FillInCallAgentes.length);

    });
    
    /**
    785
    786
    787
    788
     */
    socketRealTimeAgentes.on(localStorage.getItem('EMP_CLV_EMPRESA')+"_AGENTES", function(data) {
        var Campa = jslinq(data.JsonData).where(function(el){return el.CAM_CSC_SERVICIO == 785 || el.CAM_CSC_SERVICIO == 786 || el.CAM_CSC_SERVICIO == 787 || el.CAM_CSC_SERVICIO == 788;}).toList();
        $("#gridAgentes").dxDataGrid("instance").option("dataSource", Campa);
    });

    socketRealTimeAgentes.on(localStorage.getItem('EMP_CLV_EMPRESA')+"_CDR", function(data) {
        var dts = data.JsonData
        var result = jslinq(dts).groupBy(function(el){return el.SAMT_CAM_TIPO_SERVICIO_CSC;}).toList();
        var Campa = result;//jslinq(result).where(function(el){return el.key == CampaMonitorea;}).toList();

        if (Campa.length == 0) {
            $('#TotalLlamadasAgentes').html(0);
            $('#TotalAbandonoAgentes').html(0);
            $('#TotalContestadasAgentes').html(0);
            $('#ahtAgente').html(0);
            $('#AsaAgente').html(0);
            $('#PorcentajeAbaAgentes').html("-");
            $('#PorcentajeSLAAgentes').html("-");
            $('#PorcentajeContestadasAgentes').html("-");
        } else {
            $('#TotalLlamadasAgentes').html(Campa[0].count);

            var __EstatusAbandono = EstatusLlamada.find( Ary_Data => Ary_Data.TIPO_ESTATUS_CLAVE == "ABA" );
            var __Abandonos = jslinq(Campa[0].elements).where(function(el){return el.CDR_ESTATUS_OPERACION == __EstatusAbandono.SAMT_CAM_TIPO_ESTATUS_CSC;}).toList();
            $('#TotalAbandonoAgentes').html(__Abandonos.length);

            var __EstatusContestado = EstatusLlamada.find( Ary_Data => Ary_Data.TIPO_ESTATUS_CLAVE == "NCH" );
            var __Contestadas = jslinq(Campa[0].elements).where(function(el){return el.CDR_ESTATUS_OPERACION == __EstatusContestado.SAMT_CAM_TIPO_ESTATUS_CSC;}).toList();
            $('#TotalContestadasAgentes').html(__Contestadas.length);

            var AHT = jslinq(__Contestadas).average(function(x) { 
                return x.CDR_TIEMPO_DE_LLAMADA; 
            });

            var ASA = jslinq(__Contestadas).sum(function(el){
                return el.CDR_TIEMPO_FILA_ESPERA;
            });

            var TSF = jslinq(__Contestadas).where(function(el){return el.CDR_TIEMPO_FILA_ESPERA <= 20;}).toList();
            $('#ahtAgente').html( self.secondsToString(AHT));
            $('#AsaAgente').html( self.secondsToString(ASA));
            
            var dtSla =TSF.length/Campa[0].count * 100;
            var dtAba = __Abandonos.length/Campa[0].count * 100;
            var dtCont = __Contestadas.length/Campa[0].count * 100;

            //Aba
            pointAba = chartAba.series[0].points[0];
            incAba =  parseFloat(dtAba.toFixed(2)) ;
            newValAba = incAba;
            pointAba.update(newValAba);
            //SLA
            pointSLA = chartSLA.series[0].points[0];
            incSLA =  parseFloat(dtSla.toFixed(2)) ;
            newValSLA = incSLA;
            pointSLA.update(newValSLA);
            //SLA
            pointCont = chartCont.series[0].points[0];
            incCont =  parseFloat(dtCont.toFixed(2)) ;
            newValCont = incCont;
            pointCont.update(newValCont);
        }
    });
     

      setTimeout(() => {
        self.Run();
      }, 500);
    }

    self.secondsToString = function(seconds) {
        var hour = Math.floor(seconds / 3600);
        hour = (hour < 10)? '0' + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = (minute < 10)? '0' + minute : minute;
        var second = Math.trunc(seconds) % 60;
        second = (second < 10)? '0' + second : second;
        return hour + ':' + minute + ':' + second;
      }

      
    
    self.Run = function(){
     
    }
}
setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);