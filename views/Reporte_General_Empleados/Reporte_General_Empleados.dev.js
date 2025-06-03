SalesDashboard.dashboardModel = function() {

    var self = this;
    var obj_DatosEmpleado = null;

    self.Content_Full_Catalogs = null;
    
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


    var Primer_Nivel_General = [{
        ID_ITEM:"1",
        DESCRIPCION_ITEM:"Estatus",
        CLAVE:"ESTATUS",
        ICON:"images/Icons/semaforo_icon.png",
        SUBCLAVE:"ALLESTATUS"
    },{
        ID_ITEM:"2",
        DESCRIPCION_ITEM:"Proceso",
        CLAVE:"PROCESO",
        ICON:"images/Icons/proceso_icon.png",
        SUBCLAVE:"ALLPROCESO"
    },{
        ID_ITEM:"3",
        DESCRIPCION_ITEM:"Area/Departamento",
        CLAVE:"AREA",
        ICON:"images/Icons/area_emp_icon.png",
        SUBCLAVE:"ALLAREA"
    },{
        ID_ITEM:"4",
        DESCRIPCION_ITEM:"Puesto",
        CLAVE:"PUESTO",
        ICON:"images/Icons/puesto_emp_padre.png",
        SUBCLAVE:"ALLPUESTO"
    },{
        ID_ITEM:"5",
        DESCRIPCION_ITEM:"Teletrabajo",
        CLAVE:"TELET",
        ICON:"images/Icons/teletrabajo_emp_icon.png",
        SUBCLAVE:"ALLTELET"
    },{
        ID_ITEM:"6",
        DESCRIPCION_ITEM:"Ubicación",
        CLAVE:"UBICA",
        ICON:"images/Icons/ubicacion_emp_icon.png",
        SUBCLAVE:"ALLUBICA"
    }];


    var Primer_Nivel_Clientes = [{
        ID_ITEM:"1",
        DESCRIPCION_ITEM:"Clientes",
        CLAVE:"ALLCLIENTES",
        ICON:"images/Icons/estado_contratados.png"
    }];
    

    var Clave_Anterior = null;

    self.init = async function() {

        await self.Load_Full_Catalogs();

        self.patname = window.location.pathname;
        
        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */
        /** LABELS  PANTALLA*/
        //$('#adm_title_ms').html(Globalize.formatMessage("adm_title_ms"));
        /** LABELS  PANTALLA*/
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));


        $("#Context_Menu_Grid_Empleados").dxContextMenu({
            dataSource:[{ 
                TEXT: 'Sumatoria',
                CLAVE:"SUMMARY",
                ICON:"images/Icons/Pivot_32x32.png", 
            },{ 
                TEXT: 'Auto Filtros',
                CLAVE:"AUFILTRO",
                ICON:"images/Icons/Filter_32x32.png", 
            },{ 
                TEXT: 'Filtros',
                CLAVE:"FILTRO",
                ICON:"images/Icons/MasterFilter_32x32.png", 
            },{ 
                TEXT: 'Agrupador',
                CLAVE:"AGRUPA",
                ICON:"images/Icons/Group_32x32.png", 
            },{ 
                TEXT: 'Selector De Columnas',
                CLAVE:"SELECTCOLUM",
                ICON:"images/Icons/ShowDetail_32x32.png", 
            },{ 
                TEXT: 'Exportar',
                CLAVE:"EXPORT",
                ICON:"images/Icons/IndentIncrease_32x32.png", 
            }],
            width: 150,
            target: "#DataGrid_Reporte_Empleados",
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

                switch(e.itemData.CLAVE){
                    case 'SUMMARY':
                        var Prppiedad_Summary = $DataGrid_Reporte_Empleados.option("summary");
                        if(Prppiedad_Summary.totalItems.length == 0){
                            $DataGrid_Reporte_Empleados.option("summary.totalItems",[{
                                column: 'EMPLEADO_CSC_EMPLEADO',
                                summaryType: 'count',
                            }]);
                        }
                        else{
                            $DataGrid_Reporte_Empleados.option("summary.totalItems",[]);
                        }
                    break;

                    case 'AUFILTRO':
                        var Propiedad_Filtros = $DataGrid_Reporte_Empleados.option("filterRow");
                        if(Propiedad_Filtros.visible == true){
                            $DataGrid_Reporte_Empleados.option("filterRow.visible",false);
                        }
                        else{
                            $DataGrid_Reporte_Empleados.option("filterRow.visible",true);
                        }
                        
                    break;

                    case 'FILTRO':
                        var Propiedad_Panel_Filtros = $DataGrid_Reporte_Empleados.option("filterPanel");
                        if(Propiedad_Panel_Filtros.visible == true){
                            $DataGrid_Reporte_Empleados.option("filterPanel.visible",false);
                        }
                        else{
                            $DataGrid_Reporte_Empleados.option("filterPanel.visible",true);
                        }
                    break;

                    case 'AGRUPA':
                        var Propiedad_GrupPanel = $DataGrid_Reporte_Empleados.option("groupPanel");
                        if(Propiedad_GrupPanel.visible == true){
                            $DataGrid_Reporte_Empleados.option("groupPanel.visible",false);
                        }
                        else{
                            $DataGrid_Reporte_Empleados.option("groupPanel.visible",true);
                        }
                    break;

                    case 'SELECTCOLUM':
                        var Propiedad_Colum_Choser = $DataGrid_Reporte_Empleados.option("columnChooser");
                        if(Propiedad_Colum_Choser.enabled == true){
                            $DataGrid_Reporte_Empleados.option("columnChooser.enabled",false);
                        }
                        else{
                            $DataGrid_Reporte_Empleados.option("columnChooser.enabled",true);
                        }
                    break;

                    case 'EXPORT':
                        let workbook = new ExcelJS.Workbook(); 
                        let worksheet = workbook.addWorksheet('Hoja1'); 
                        DevExpress.excelExporter.exportDataGrid({ 
                            worksheet: worksheet, 
                            component: $DataGrid_Reporte_Empleados,
                            customizeCell: function(options) {
                                let excelCell = options;
                                excelCell.font = { name: 'Arial', size: 12 };
                                excelCell.alignment = { horizontal: 'left' };
                            } 
                        }).then(function() {
                            workbook.xlsx.writeBuffer().then(function(buffer) { 
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reporte_empleados_'+moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')+'.xlsx'); 
                            }); 
                        });

                    break;
                }
            }
        });


        $("#__Tab_Parametros_Busqueda").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            showNavButtons: true,
            itemTitleTemplate: function(itemData, itemIndex, itemElement) {
                itemElement
                .append($('<img src="'+itemData.icon+'" class="tabicon" alt="Icon"/>'))
                .append($('<span style="font-size: 12px; padding-top: 4px; ">').text(itemData.title));
            } ,
            height: '100%',
            elementAttr: {"id": "Tab-dg-bitacora"},
            dataSource: [
                { title: "General", template: "tab_parametros_generales", icon:"images/Icons/credencial_general.png" },
                { title: "Clientes / Proyecto", template: "tab_clientes_proyecto", icon:"images/Icons/gerarquia_icon.png"}
            ],
            onContentReady(e) {  
                setTimeout(() => {  
                    var widthOfOneTab = 100 / e.component.option("items").length;  
                },3000);  
            }
        });


        $("#__Tab_Reporte_Cubo").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            showNavButtons: true,
            itemTitleTemplate: function(itemData, itemIndex, itemElement) {
                itemElement
                .append($('<img src="'+itemData.icon+'" class="tabicon" alt="Icon"/>'))
                .append($('<span style="font-size: 12px; padding-top: 4px; ">').text(itemData.title));
            } ,
            height: '100%',
            elementAttr: {"id": "Tab-dg-bitacora"},
            dataSource: [
                { title: "Reporte", template: "tab_reporte", icon:"images/Icons/reporte_icon.png" },
                { title: "Cubo", template: "tab_cubo", icon:"images/Icons/cubo_icon.png"}
            ],
            onContentReady(e) {  
                setTimeout(() => {  
                    var widthOfOneTab = 100 / e.component.option("items").length;  
                },3000);  
            }
        });


        $("#TagBox_TreeView_General").dxTagBox({
            height:26,
            showSelectionControls:true,
            applyValueMode: 'useButtons',
            placeholder:"Seleccione la Empresa Laboral",
            valueExpr: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").KEYID,
            displayExpr: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").TEXT,
            dataSource: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").DATA,
            onInitialized:function(e){
                $TagBox_TreeView_General = e.component;
            },
            buttons: [{
                name: 'Btn_Buscar_Empleados',
                location: 'after',
                options: {
                    width:40,
                    stylingMode: 'contained',
                    icon: 'images/Icons/refreh_emp_icon.png',
                    type: 'normal',
                    readOnly: false,
                    onClick(e) {
                        //console.log(Clave_Anterior);
                        loadPanel.show();
                        var Select_Tagbox_Emp_labora = $TagBox_TreeView_General.option("value");

                        if(Select_Tagbox_Emp_labora.length > 0){
                            var New_Array_Nodes_Song = new Array()
                            var Nodos_Generales_Seleccionados = $TreeView_General.getSelectedNodes();
                            Nodos_Generales_Seleccionados.map(function(item){
                                if(item.children.length == 0 && item.itemData.CLAVE == Clave_Anterior){
                                    New_Array_Nodes_Song.push(item.itemData);
                                };
                            });

                            if(New_Array_Nodes_Song.length == 0){
                                DevExpress.ui.notify({
                                    message: `Sea mas especifico con los parametros de busqueda`,
                                    minWidth: 150,
                                    type: 'error',
                                    displayTime: 5000
                                },{
                                    position: "bottom center",
                                    direction: "up-push"
                                });
                                loadPanel.hide();
                            }
                            else{
                                var Object_Query_Parameters = {
                                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                    Type:localStorage.getItem('Type'),
                                };

                                if(Clave_Anterior == "ESTATUS"){
                                    var Post_Array_Id = new Array();
                                    New_Array_Nodes_Song.map(function(item){
                                        Post_Array_Id.push(item.ID_REQUEST);
                                    });
                                    Object_Query_Parameters.TIPO_QUERY = "" + Clave_Anterior;
                                    Object_Query_Parameters.CAT_ESTATUS_PROCESO_EMP_CSC = Post_Array_Id.join(',');
                                }
                                else if(Clave_Anterior == "CONTRATADOS"){
                                    
                                    Object_Query_Parameters.TIPO_QUERY = "" + Clave_Anterior;

                                    var Estatus_Emp = jslinq( self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").DATA  ).where(function(el) {
                                        return  el.CAT_ESTATUS_PROCESO_EMP_CLAVE == "ACT" ;
                                    }).toList();

                                    var Post_Array_Estaus_Id = new Array();
                                    Estatus_Emp.map(function(item){
                                        Post_Array_Estaus_Id.push(item.CAT_ESTATUS_PROCESO_EMP_CSC);
                                    });

                                    /*
                                    var Proceso_Emp = jslinq( self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS").DATA  ).where(function(el) {
                                        return  el.CAT_PROCESO_EMP_CLAVE == "ACTIVO" ;
                                    }).toList();

                                    var Post_Array_Proceso_Id = new Array();
                                    Proceso_Emp.map(function(item){
                                        Post_Array_Proceso_Id.push(item.CAT_PROCESO_EMP_CSC);
                                    });
                                    */

                                    /*
                                    var Sub_Proceso_Emp = jslinq( self.Get_Config_Cat_local("SAMT_CAT_SUBPROCESO_EMPLEADOS").DATA  ).where(function(el) {
                                        return  el.CAT_SUBPROCESO_EMP_CLAVE != "BAJA" && Post_Array_Proceso_Id.includes(el.CAT_PROCESO_EMP_CSC );
                                    }).toList();

                                    var Post_Array_Sub_Proceso_Id = new Array();
                                    Sub_Proceso_Emp.map(function(item){
                                        Post_Array_Sub_Proceso_Id.push(item.CAT_SUBPROCESO_EMP_CSC);
                                    });
                                    */

                                    Object_Query_Parameters.CAT_ESTATUS_PROCESO_EMP_CSC = Post_Array_Estaus_Id.join(',');
                                    //Object_Query_Parameters.CAT_PROCESO_EMP_CSC = Post_Array_Proceso_Id;
                                    //Object_Query_Parameters.CAT_SUBPROCESO_EMP_CSC = Post_Array_Sub_Proceso_Id;
            
                                }
                                else if(Clave_Anterior == "PROCESO"){
                                    Object_Query_Parameters.TIPO_QUERY = "" + Clave_Anterior;

                                    var Proceso_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "PROCESO" ;
                                    }).toList();

                                    var Post_Array_Proceso_Id = new Array();
                                    Proceso_Emp_Select.map(function(item){
                                        Post_Array_Proceso_Id.push(item.ID_REQUEST);
                                    });

                                    var Sub_Proceso_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "SUBPROCESO" ;
                                    }).toList();
                                    
                                    var Post_Array_Sub_Proceso_Id = new Array();
                                    Sub_Proceso_Emp_Select.map(function(item){
                                        Post_Array_Sub_Proceso_Id.push(item.ID_REQUEST);
                                    });

                                    if(Post_Array_Proceso_Id.length > 0){
                                        Object_Query_Parameters.CAT_PROCESO_EMP_CSC = Post_Array_Proceso_Id.join(',');
                                    }
                                    if(Post_Array_Sub_Proceso_Id.length > 0){
                                        Object_Query_Parameters.CAT_SUBPROCESO_EMP_CSC = Post_Array_Sub_Proceso_Id.join(',');
                                    }

                                }
                                else if(Clave_Anterior == "AREA"){
                                    Object_Query_Parameters.TIPO_QUERY = "" + Clave_Anterior;

                                    var Area_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "AREA" ;
                                    }).toList();

                                    var Post_Array_Area_Id = new Array();
                                    Area_Emp_Select.map(function(item){
                                        Post_Array_Area_Id.push(item.ID_REQUEST);
                                    });

                                    var Departamento_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "DEPARTAMENTO" ;
                                    }).toList();

                                    var Post_Array_Departamento_Id = new Array();
                                    Departamento_Emp_Select.map(function(item){
                                        Post_Array_Departamento_Id.push(item.ID_REQUEST);
                                    });

                                    if(Post_Array_Area_Id.length > 0){
                                        Object_Query_Parameters.TIPO_AREA_CSC = Post_Array_Area_Id.join(',');
                                    }
                                    if(Post_Array_Departamento_Id.length > 0){
                                        Object_Query_Parameters.EMPLEADO_DEPARTAMENTO_CSC = Post_Array_Departamento_Id.join(',');
                                    }
                                }
                                else if(Clave_Anterior == "PUESTO"){
                                    Object_Query_Parameters.TIPO_QUERY = "" + Clave_Anterior;
                                    
                                    var Cat_Puesto_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "CATPUESTO" ;
                                    }).toList();

                                    var Post_Array_Cat_Puesto_Id = new Array();
                                    Cat_Puesto_Emp_Select.map(function(item){
                                        Post_Array_Cat_Puesto_Id.push(item.ID_REQUEST);
                                    });

                                    var Puesto_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "PUESTO" ;
                                    }).toList();

                                    var Post_Array_Puesto_Id = new Array();
                                    Puesto_Emp_Select.map(function(item){
                                        Post_Array_Puesto_Id.push(item.ID_REQUEST);
                                    });

                                    if(Post_Array_Cat_Puesto_Id.length > 0){
                                        Object_Query_Parameters.CAT_CATEGORIA_PUESTO_CSC = Post_Array_Cat_Puesto_Id.join(',');
                                    }
                                    if(Post_Array_Puesto_Id.length > 0){
                                        Object_Query_Parameters.TIPO_PUESTO_CSCEMPLEADO = Post_Array_Puesto_Id.join(',');
                                    }
                                }
                                else if(Clave_Anterior == "TELET"){
                                    Object_Query_Parameters.TIPO_QUERY = "ULABORAL";

                                    var Ubi_Labora_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "ULABORAL" ;
                                    }).toList();

                                    var Post_Array_Ubi_Labora_Id = new Array();
                                    Ubi_Labora_Emp_Select.map(function(item){
                                        Post_Array_Ubi_Labora_Id.push(item.ID_REQUEST);
                                    });

                                    if(Post_Array_Ubi_Labora_Id.length > 0){
                                        Object_Query_Parameters.TIPO_UBICACION_LABORAL_CSC = Post_Array_Ubi_Labora_Id.join(',');
                                    }

                                }
                                else if(Clave_Anterior == "UBICA"){
                                    Object_Query_Parameters.TIPO_QUERY = "REQUISICION";

                                    var Requicicion_Emp_Select = jslinq( New_Array_Nodes_Song  ).where(function(el) {
                                        return  el.SUBCLAVE == "REQUISICION" ;
                                    }).toList();

                                    var Post_Array_Requisicion_Id = new Array();
                                    Requicicion_Emp_Select.map(function(item){
                                        Post_Array_Requisicion_Id.push(item.ID_REQUEST);
                                    });

                                    if(Post_Array_Requisicion_Id.length > 0){
                                        Object_Query_Parameters.REQ_CSCREQUISICION = Post_Array_Requisicion_Id.join(',');
                                    }
                                    
                                }

                                
                                if(Select_Tagbox_Emp_labora.length > 0){
                                    Object_Query_Parameters.EMPRESA_LABORAL_CSC = Select_Tagbox_Emp_labora.join(',');
                                }

                                self.Consulta_Reporte_Empleados(Object_Query_Parameters);

                                
                            }
                        }
                        else{
                            DevExpress.ui.notify({
                                message: `Indique la Empresa Laboral por la que se consultara`,
                                minWidth: 150,
                                type: 'error',
                                displayTime: 5000
                            },{
                                position: "bottom center",
                                direction: "up-push"
                            });
                            loadPanel.hide();
                        }

                        
                    }
                }
            }]
        })


        $("#TreeView_General").dxTreeView({
            dataSource:[],
            width:'100%',
            height:'100%',
            dataStructure: 'plain',
            parentIdExpr: 'ID_ITEM_PARENT',
            keyExpr: 'ID_ITEM',
            displayExpr:'DESCRIPCION_ITEM',
            showCheckBoxesMode: 'normal',
            selection: {
                mode: 'multiple',
                recursive: true,
            },
            itemTemplate(item) {
                var nodo = $("<div>")
                .append($('<img src="'+item.ICON+'" class="listicon" alt="Icon"/>'))
                .append($('<span style="font-size: 10px; padding-top: 4px; margin-top: 1px; display: inline-block; ">').text(item.DESCRIPCION_ITEM));

                return nodo;
            },
            onInitialized: async function(e){
                loadPanel.show();
                var New_List_Generate = new Array();
                $TreeView_General = e.component;

                new Promise( (resolve,reject)=>{

                    Primer_Nivel_General.map(function(item){
                        //INSERTA LOS PRIMEROS NODOS DE CADA ARBOL
                        New_List_Generate.push({
                            ID_ITEM:item.ID_ITEM,
                            ID_ITEM_PARENT:null,
                            DESCRIPCION_ITEM:item.DESCRIPCION_ITEM,
                            CLAVE:item.CLAVE,
                            ICON:item.ICON,
                            ID_REQUEST:null,
                            SUBCLAVE:item.SUBCLAVE
                        });
    
                        switch(item.CLAVE){
                            case "ESTATUS":
                                var Estatus_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").DATA  ).where(function(el) {
                                    return  el[self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").ACTIVE] == true ;
                                }).toList();
                                
                                //console.log(Estatus_Emp_Activos);
                                Estatus_Emp_Activos.map(function(Estatus){

                                    if(Estatus.CAT_ESTATUS_PROCESO_EMP_CLAVE == "NACT"){
                                        var Estatus_Icon = "images/Icons/estatus_no_activo.png";
                                    }
                                    else{
                                        var Estatus_Icon = "images/Icons/estatus_activo.png";
                                    }

                                    New_List_Generate.push({
                                        ID_ITEM:item.ID_ITEM +"_"+ Estatus.CAT_ESTATUS_PROCESO_EMP_CSC,
                                        ID_ITEM_PARENT:item.ID_ITEM,
                                        DESCRIPCION_ITEM:Estatus.CAT_ESTATUS_PROCESO_EMP_IDIOMA1,
                                        CLAVE:item.CLAVE,
                                        ICON:Estatus_Icon,
                                        ID_REQUEST:Estatus.CAT_ESTATUS_PROCESO_EMP_CSC,
                                        SUBCLAVE:"ESTATUS"
                                    });
                                });

                                New_List_Generate.push({
                                    ID_ITEM:item.ID_ITEM +"_0_0",
                                    ID_ITEM_PARENT:item.ID_ITEM,
                                    DESCRIPCION_ITEM:"Contratados",
                                    CLAVE:"CONTRATADOS",
                                    ICON:"images/Icons/estado_contratados.png",
                                    ID_REQUEST:null,
                                    SUBCLAVE:"CONTRATADOS"
                                });
                            break;

                            case "PROCESO":
                                var Proceso_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS").DATA  ).where(function(el) {
                                    return  el[self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS").ACTIVE] == true ;
                                }).toList();

                                Proceso_Emp_Activos.map(function(Proceso){

                                    New_List_Generate.push({
                                        ID_ITEM:item.ID_ITEM +"_"+ Proceso.CAT_PROCESO_EMP_CSC,
                                        ID_ITEM_PARENT:item.ID_ITEM,
                                        DESCRIPCION_ITEM:Proceso.CAT_PROCESO_EMP_IDIOMA1,
                                        CLAVE:item.CLAVE,
                                        ICON:"images/Icons/proceso_emp_icon.png",
                                        ID_REQUEST:Proceso.CAT_PROCESO_EMP_CSC,
                                        SUBCLAVE:"PROCESO"
                                    });


                                    var Sub_Proceso_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_CAT_SUBPROCESO_EMPLEADOS").DATA  ).where(function(el) {
                                        return  ( el[self.Get_Config_Cat_local("SAMT_CAT_SUBPROCESO_EMPLEADOS").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_CAT_SUBPROCESO_EMPLEADOS").ACTIVE] == true ) && el.CAT_PROCESO_EMP_CSC == Proceso.CAT_PROCESO_EMP_CSC && (el.CAT_SUBPROCESO_EMP_VISIBLE_DESK == 1 &&  el.CAT_SUBPROCESO_EMP_VISIBLE_DESK == true) ;
                                    }).toList();

                                    Sub_Proceso_Emp_Activos.map(function(subproceso){

                                        if(subproceso.CAT_SUBPROCESO_EMP_CLAVE == "BAJA"){
                                            var Subproceso_Icon = "images/Icons/sub_proceso_baja.png";
                                        }
                                        else{
                                            var Subproceso_Icon = "images/Icons/sub_proceso_bien.png";
                                        }

                                        New_List_Generate.push({
                                            ID_ITEM:item.ID_ITEM +"_"+ Proceso.CAT_PROCESO_EMP_CSC+"_"+subproceso.CAT_SUBPROCESO_EMP_CSC,
                                            ID_ITEM_PARENT:item.ID_ITEM +"_"+ Proceso.CAT_PROCESO_EMP_CSC,
                                            DESCRIPCION_ITEM:subproceso.CAT_SUBPROCESO_EMP_IDIOMA1,
                                            CLAVE:item.CLAVE,
                                            ICON:Subproceso_Icon,
                                            ID_REQUEST:subproceso.CAT_SUBPROCESO_EMP_CSC,
                                            SUBCLAVE:"SUBPROCESO"
                                        });

                                    });
                                });
                            break;

                            case "AREA":
                                var Area_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_AREA").DATA  ).where(function(el) {
                                    return  el[self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_AREA").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_AREA").ACTIVE] == true ;
                                }).toList();

                                Area_Emp_Activos.map(function(Area){

                                    New_List_Generate.push({
                                        ID_ITEM:item.ID_ITEM +"_"+ Area.TIPO_AREA_CSC,
                                        ID_ITEM_PARENT:item.ID_ITEM,
                                        DESCRIPCION_ITEM:Area.TIPO_AREA_IDIOMA1,
                                        CLAVE:item.CLAVE,
                                        ICON:"images/Icons/area_emp_icon.png",
                                        ID_REQUEST:Area.TIPO_AREA_CSC,
                                        SUBCLAVE:"AREA"
                                    });

                                    var Departamento_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_DEPARTAMENTO").DATA  ).where(function(el) {
                                        return  ( el[self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_DEPARTAMENTO").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_DEPARTAMENTO").ACTIVE] == true ) && el.TIPO_AREA_CSC == Area.TIPO_AREA_CSC ;
                                    }).toList();

                                    Departamento_Emp_Activos.map(function(Departamento){

                                        New_List_Generate.push({
                                            ID_ITEM:item.ID_ITEM +"_"+ Area.TIPO_AREA_CSC+"_"+Departamento.EMPLEADO_DEPARTAMENTO_CSC,
                                            ID_ITEM_PARENT:item.ID_ITEM +"_"+ Area.TIPO_AREA_CSC,
                                            DESCRIPCION_ITEM:Departamento.SAMT_TIPO_DEPARTAMENTO_IDIOMA1,
                                            CLAVE:item.CLAVE,
                                            ICON:"images/Icons/departamento_emp_icon.png",
                                            ID_REQUEST:Departamento.EMPLEADO_DEPARTAMENTO_CSC,
                                            SUBCLAVE:"DEPARTAMENTO"
                                        });
                                    });
                                })
                            break;

                            case "PUESTO":
                                var Categoria_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_CAT_CATEGORIA_PUESTO").DATA  ).where(function(el) {
                                    return  el[self.Get_Config_Cat_local("SAMT_CAT_CATEGORIA_PUESTO").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_CAT_CATEGORIA_PUESTO").ACTIVE] == true ;
                                }).orderBy(function(el) {
                                    return el.CAT_CATEGORIA_PUESTO_IDIOMA1;
                                }).toList();

                                Categoria_Emp_Activos.map(function(Cat_Puesto){

                                    New_List_Generate.push({
                                        ID_ITEM:item.ID_ITEM +"_"+ Cat_Puesto.CAT_CATEGORIA_PUESTO_CSC,
                                        ID_ITEM_PARENT:item.ID_ITEM,
                                        DESCRIPCION_ITEM:Cat_Puesto.CAT_CATEGORIA_PUESTO_IDIOMA1,
                                        CLAVE:item.CLAVE,
                                        ICON:"images/Icons/puesto_emp_icon.png",
                                        ID_REQUEST:Cat_Puesto.CAT_CATEGORIA_PUESTO_CSC,
                                        SUBCLAVE:"CATPUESTO"
                                    });

                                    var Tipo_Puesto_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_TIPO_PUESTO_EMPLEADO").DATA  ).where(function(el) {
                                        //return ( el[self.Get_Config_Cat_local("SAMT_TIPO_PUESTO_EMPLEADO").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_PUESTO_EMPLEADO").ACTIVE] == true ) && el.CAT_CATEGORIA_PUESTO_CSC == Cat_Puesto.CAT_CATEGORIA_PUESTO_CSC ;
                                        return el.CAT_CATEGORIA_PUESTO_CSC == Cat_Puesto.CAT_CATEGORIA_PUESTO_CSC ;
                                    }).orderBy(function(el) {
                                        return el.TIPO_PUESTO_IDIOMA1;
                                    }).toList();

                                    Tipo_Puesto_Emp_Activos.map(function(Tipo_Puesto){
                                        New_List_Generate.push({
                                            ID_ITEM:item.ID_ITEM +"_"+ Cat_Puesto.CAT_CATEGORIA_PUESTO_CSC+"_"+Tipo_Puesto.TIPO_PUESTO_CSCEMPLEADO,
                                            ID_ITEM_PARENT:item.ID_ITEM +"_"+ Cat_Puesto.CAT_CATEGORIA_PUESTO_CSC,
                                            DESCRIPCION_ITEM:Tipo_Puesto.TIPO_PUESTO_IDIOMA1,
                                            CLAVE:item.CLAVE,
                                            ICON:"images/Icons/tipo_puesto_emp_icon.png",
                                            ID_REQUEST:Tipo_Puesto.TIPO_PUESTO_CSCEMPLEADO,
                                            SUBCLAVE:"PUESTO"
                                        });
                                    });
                                });
                            break;

                            case "TELET":
                                var Tipo_Ubicacion_Emp_Activos = jslinq( self.Get_Config_Cat_local("SAMT_TIPO_UBICACION_LABORAL").DATA  ).where(function(el) {
                                    return  el[self.Get_Config_Cat_local("SAMT_TIPO_UBICACION_LABORAL").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_UBICACION_LABORAL").ACTIVE] == true ;
                                }).toList();

                                Tipo_Ubicacion_Emp_Activos.map(function(Ubicacion_Laboral){

                                    New_List_Generate.push({
                                        ID_ITEM:item.ID_ITEM +"_"+ Ubicacion_Laboral.TIPO_UBICACION_LABORAL_CSC,
                                        ID_ITEM_PARENT:item.ID_ITEM,
                                        DESCRIPCION_ITEM:Ubicacion_Laboral.TIPO_UBICACION_IDIOMA1,
                                        CLAVE:item.CLAVE,
                                        ICON:"images/Icons/ubicacion_emp_laboral.png",
                                        ID_REQUEST:Ubicacion_Laboral.TIPO_UBICACION_LABORAL_CSC,
                                        SUBCLAVE:"ULABORAL"
                                    });
                                });
                            break;

                            case "UBICA":
                                var Requicicion_Emp_Activos = Object.assign([],self.Get_Config_Cat_local("SAMT_REQUISICIONES").DATA);
                                
                                Requicicion_Emp_Activos.map(function(Requicion){
                                    New_List_Generate.push({
                                        ID_ITEM:item.ID_ITEM +"_"+ Requicion.REQ_CSCREQUISICION,
                                        ID_ITEM_PARENT:item.ID_ITEM,
                                        DESCRIPCION_ITEM:Requicion.REQ_NOMBREAREA,
                                        CLAVE:item.CLAVE,
                                        ICON:"images/Icons/ubicacion_emp_icon.png",
                                        ID_REQUEST:Requicion.REQ_CSCREQUISICION,
                                        SUBCLAVE:"REQUISICION"
                                    });
                                });
                            break;
                        };
                    });

                    //console.log(New_List_Generate);
                    setTimeout(function(){
                        $TreeView_General.option("dataSource", New_List_Generate);
                        loadPanel.hide();
                        resolve("resolve");
                    });
                    
                });

            },
            onItemSelectionChanged:async function(e) {
            
                var Item_Seleccionado = Object.assign({}, e.itemData);
                var Node_Seleccionado = Object.assign({}, e.node);
                //console.log(Item_Seleccionado);
                //console.log(Node_Seleccionado);

                if(Item_Seleccionado.selected == true){

                    if(Item_Seleccionado.CLAVE == "ESTATUS"){
                        if(Node_Seleccionado.children.length > 0){
                            var Array_Children = Node_Seleccionado.children;
                            var chil_contratado = Array_Children.find(function(item){
                                return item.itemData.CLAVE == "CONTRATADOS";
                            });
                            //console.log(chil_contratado);
                            $TreeView_General.unselectAll();
                            $TreeView_General.selectItem(chil_contratado.key);
                        }
                        else{
                            if(Item_Seleccionado.CLAVE != Clave_Anterior){
                                Clave_Anterior = "" + Item_Seleccionado.CLAVE;
                                var Nodos_Generales_Seleccionados = $TreeView_General.getSelectedNodes();
                                Nodos_Generales_Seleccionados.map(function(item){
                                    if(item.itemData.CLAVE != Item_Seleccionado.CLAVE){
                                        $TreeView_General.unselectItem(item.itemData.ID_ITEM);
                                    }
                                });
                            }
                        }
                    }
                    else if(Item_Seleccionado.CLAVE == "CONTRATADOS"){

                        if(Item_Seleccionado.CLAVE != Clave_Anterior){

                            Clave_Anterior = "" + Item_Seleccionado.CLAVE;
                            var Nodos_keys_Generales_Seleccionados = $TreeView_General.getSelectedNodeKeys();
                            Nodos_keys_Generales_Seleccionados.map(function(item){
                                if(item != Item_Seleccionado.ID_ITEM){
                                    if(item != Item_Seleccionado.ID_ITEM_PARENT){
                                        $TreeView_General.unselectItem(item);
                                    }
                                }
                            });
                        }
                    }
                    else if(Item_Seleccionado.CLAVE == "PROCESO"){
                        if(Item_Seleccionado.CLAVE != Clave_Anterior){
                            Clave_Anterior = "" + Item_Seleccionado.CLAVE;
                            var Nodos_Generales_Seleccionados = $TreeView_General.getSelectedNodes();
                            Nodos_Generales_Seleccionados.map(function(item){
                                if(item.itemData.CLAVE != Item_Seleccionado.CLAVE){
                                    $TreeView_General.unselectItem(item.itemData.ID_ITEM);
                                }
                            });
                        }
                    }
                    else if(Item_Seleccionado.CLAVE == "AREA"){
                        if(Item_Seleccionado.CLAVE != Clave_Anterior){
                            Clave_Anterior = "" + Item_Seleccionado.CLAVE;
                            var Nodos_Generales_Seleccionados = $TreeView_General.getSelectedNodes();
                            Nodos_Generales_Seleccionados.map(function(item){
                                if(item.itemData.CLAVE != Item_Seleccionado.CLAVE){
                                    $TreeView_General.unselectItem(item.itemData.ID_ITEM);
                                }
                            });
                        }
                    }
                    else if(Item_Seleccionado.CLAVE == "PUESTO"){
                        if(Item_Seleccionado.CLAVE != Clave_Anterior){
                            Clave_Anterior = "" + Item_Seleccionado.CLAVE;
                            var Nodos_Generales_Seleccionados = $TreeView_General.getSelectedNodes();
                            Nodos_Generales_Seleccionados.map(function(item){
                                if(item.itemData.CLAVE != Item_Seleccionado.CLAVE){
                                    $TreeView_General.unselectItem(item.itemData.ID_ITEM);
                                }
                            });
                        }
                    }
                    else if(Item_Seleccionado.CLAVE == "TELET"){
                        if(Item_Seleccionado.CLAVE != Clave_Anterior){
                            Clave_Anterior = "" + Item_Seleccionado.CLAVE;
                            var Nodos_Generales_Seleccionados = $TreeView_General.getSelectedNodes();
                            Nodos_Generales_Seleccionados.map(function(item){
                                if(item.itemData.CLAVE != Item_Seleccionado.CLAVE){
                                    $TreeView_General.unselectItem(item.itemData.ID_ITEM);
                                }
                            });
                        }
                    }
                    else if(Item_Seleccionado.CLAVE == "UBICA"){
                        if(Item_Seleccionado.CLAVE != Clave_Anterior){
                            Clave_Anterior = "" + Item_Seleccionado.CLAVE;
                            var Nodos_Generales_Seleccionados = $TreeView_General.getSelectedNodes();
                            Nodos_Generales_Seleccionados.map(function(item){
                                if(item.itemData.CLAVE != Item_Seleccionado.CLAVE){
                                    $TreeView_General.unselectItem(item.itemData.ID_ITEM);
                                }
                            });
                        }
                    }
                }
                
            }

        });


        $("#TagBox_TreeView_Clientes").dxTagBox({
            height:26,
            showSelectionControls:true,
            applyValueMode: 'useButtons',
            placeholder:"Seleccione la Empresa Laboral",
            valueExpr: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").KEYID,
            displayExpr: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").TEXT,
            dataSource: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").DATA,
            onInitialized:function(e){
                $TagBox_TreeView_Clientes = e.component;
            },
            buttons: [{
                name: 'Btn_Buscar_Empleados',
                location: 'after',
                options: {
                    width:40,
                    stylingMode: 'contained',
                    icon: 'images/Icons/refreh_emp_icon.png',
                    type: 'normal',
                    readOnly: false,
                    onClick(e) {
                        loadPanel.show();

                        var Select_Tagbox_Emp_labora = $TagBox_TreeView_Clientes.option("value");

                        if(Select_Tagbox_Emp_labora.length > 0){
                            var New_Array_Nodes_Song = new Array()
                            var Nodos_Clientes_Seleccionados = $TreeView_Clientes.getSelectedNodes();
                            Nodos_Clientes_Seleccionados.map(function(item){
                                if(item.children.length == 0){
                                    New_Array_Nodes_Song.push(item.itemData);
                                };
                            });

                            if(New_Array_Nodes_Song.length == 0){
                                DevExpress.ui.notify({
                                    message: `Sea mas especifico con los parametros de busqueda`,
                                    minWidth: 150,
                                    type: 'error',
                                    displayTime: 5000
                                },{
                                    position: "bottom center",
                                    direction: "up-push"
                                });
                                loadPanel.hide();
                            }
                            else{
                                var Object_Query_Parameters = {
                                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                    Type:localStorage.getItem('Type'),
                                    TIPO_QUERY:"CLIENTE_PROYECTO_CAMPANIA"
                                };

                                var Clientes_Emp_Select = jslinq( New_Array_Nodes_Song ).where(function(el) {
                                    return  el.CLAVE == "CLIENTE" ;
                                }).toList();

                                var Post_Array_Clientes_Id = new Array();
                                Clientes_Emp_Select.map(function(item){
                                    Post_Array_Clientes_Id.push(item.ID_REQUEST);
                                });

                                var Proyectos_Emp_Select = jslinq( New_Array_Nodes_Song ).where(function(el) {
                                    return  el.CLAVE == "PROYECTO" ;
                                }).toList();

                                var Post_Array_Proyectos_Id = new Array();
                                Proyectos_Emp_Select.map(function(item){
                                    Post_Array_Proyectos_Id.push(item.ID_REQUEST);
                                });

                                var Servicios_Emp_Select = jslinq( New_Array_Nodes_Song ).where(function(el) {
                                    return  el.CLAVE == "SERVICIO" ;
                                }).toList();

                                var Post_Array_Servicios_Id = new Array();
                                Servicios_Emp_Select.map(function(item){
                                    Post_Array_Servicios_Id.push(item.ID_REQUEST);
                                });


                                if(Post_Array_Clientes_Id.length > 0){
                                    Object_Query_Parameters.CLIENTE_CSC = Post_Array_Clientes_Id.join(',');
                                }

                                if(Post_Array_Proyectos_Id.length > 0){
                                    Object_Query_Parameters.PM_CSC_PROYECTO = Post_Array_Proyectos_Id.join(',');
                                }

                                if(Post_Array_Servicios_Id.length > 0){
                                    Object_Query_Parameters.CAM_CSC_SERVICIO = Post_Array_Servicios_Id.join(',');
                                }


                                var Estatus_Emp = jslinq( self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").DATA  ).where(function(el) {
                                    return  el.CAT_ESTATUS_PROCESO_EMP_CLAVE == "ACT" ;
                                }).toList();

                                var Post_Array_Estaus_Id = new Array();
                                Estatus_Emp.map(function(item){
                                    Post_Array_Estaus_Id.push(item.CAT_ESTATUS_PROCESO_EMP_CSC);
                                });

                                Object_Query_Parameters.CAT_ESTATUS_PROCESO_EMP_CSC = Post_Array_Estaus_Id.join(',');
                                

                                if(Select_Tagbox_Emp_labora.length > 0){
                                    Object_Query_Parameters.EMPRESA_LABORAL_CSC = Select_Tagbox_Emp_labora.join(',');
                                }

                                self.Consulta_Reporte_Empleados(Object_Query_Parameters);

                            }

                        }
                        else{
                            DevExpress.ui.notify({
                                message: `Indique la Empresa Laboral por la que se consultara`,
                                minWidth: 150,
                                type: 'error',
                                displayTime: 5000
                            },{
                                position: "bottom center",
                                direction: "up-push"
                            });
                            loadPanel.hide();
                        }


                        
                    }
                }
            }]
        });


        $("#TreeView_Clientes").dxTreeView({
            dataSource:[],
            width:'100%',
            height:'100%',
            dataStructure: 'plain',
            parentIdExpr: 'ID_ITEM_PARENT',
            keyExpr: 'ID_ITEM',
            displayExpr:'DESCRIPCION_ITEM',
            showCheckBoxesMode: 'normal',
            selection: {
                mode: 'multiple',
                recursive: true,
            },
            itemTemplate(item) {
                var nodo = $("<div>")
                .append($('<img src="'+item.ICON+'" class="listicon" alt="Icon"/>'))
                .append($('<span style="font-size: 11px; padding-top: 4px; ">').text(item.DESCRIPCION_ITEM));

                return nodo;
            },
            onInitialized: async function(e){
                loadPanel.show();
                var New_List_Clientes = new Array();

                $TreeView_Clientes = e.component;

                new Promise( (resolve,reject)=>{

                    Primer_Nivel_Clientes.map(function(item){
                        //INSERTA LOS PRIMEROS NODOS DE CADA ARBOL
                        New_List_Clientes.push({
                            ID_ITEM:item.ID_ITEM,
                            ID_ITEM_PARENT:null,
                            DESCRIPCION_ITEM:item.DESCRIPCION_ITEM,
                            CLAVE:item.CLAVE,
                            ICON:item.ICON,
                            ID_REQUEST:null,
                            expanded: true
                        });

                        switch(item.CLAVE){
                            
                            case "ALLCLIENTES":
                                var Clientes_Emp = jslinq( self.Get_Config_Cat_local("SAMT_CLIENTES").DATA  )
                                .orderBy(function(el) {
                                    return el.CLIENTE_NOMBRE;
                                }).toList();

                                Clientes_Emp.map(function(Cliente){

                                    New_List_Clientes.push({
                                        ID_ITEM:item.ID_ITEM +"_"+ Cliente.CLIENTE_CSC,
                                        ID_ITEM_PARENT:item.ID_ITEM,
                                        DESCRIPCION_ITEM:Cliente.CLIENTE_NOMBRE,
                                        CLAVE:"CLIENTE",
                                        ICON:"images/Icons/puesto_emp_icon.png",
                                        ID_REQUEST:Cliente.CLIENTE_CSC
                                    });

                                    var Proyecto_Cliente_Emp = jslinq( self.Get_Config_Cat_local("SAMT_PROYECTOS").DATA  ).where(function(el) {
                                        return el.CLIENTE_CSC == Cliente.CLIENTE_CSC ;
                                    }).orderBy(function(el) {
                                        return el.PM_NOMBRE;
                                    }).toList();

                                    Proyecto_Cliente_Emp.map(function(Proyecto){
                                        New_List_Clientes.push({
                                            ID_ITEM:item.ID_ITEM +"_"+ Cliente.CLIENTE_CSC+"_"+Proyecto.PM_CSC_PROYECTO,
                                            ID_ITEM_PARENT:item.ID_ITEM +"_"+ Cliente.CLIENTE_CSC,
                                            DESCRIPCION_ITEM:Proyecto.PM_NOMBRE,
                                            CLAVE:"PROYECTO",
                                            ICON:"images/Icons/puesto_emp_icon.png",
                                            ID_REQUEST:Proyecto.PM_CSC_PROYECTO,
                                        });


                                        var Servicios_Proyecto_Emp = jslinq( self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").DATA  ).where(function(el) {
                                            return el.PM_CSC_PROYECTO == Proyecto.PM_CSC_PROYECTO ;
                                        }).orderBy(function(el) {
                                            return el.CAM_SERVICIO_NOMBRE;
                                        }).toList();

                                        Servicios_Proyecto_Emp.map(function(Servicio){
                                            New_List_Clientes.push({
                                                ID_ITEM:item.ID_ITEM +"_"+ Cliente.CLIENTE_CSC+"_"+Proyecto.PM_CSC_PROYECTO+"_"+Servicio.CAM_CSC_SERVICIO,
                                                ID_ITEM_PARENT:item.ID_ITEM +"_"+ Cliente.CLIENTE_CSC+"_"+Proyecto.PM_CSC_PROYECTO,
                                                DESCRIPCION_ITEM:Servicio.CAM_SERVICIO_NOMBRE,
                                                CLAVE:"SERVICIO",
                                                ICON:"images/Icons/tipo_puesto_emp_icon.png",
                                                ID_REQUEST:Servicio.CAM_CSC_SERVICIO,
                                            });

                                        });

                                    });

                                });

                            break;

                        };
    
                        
                    });

                    //console.log(New_List_Clientes);
                    setTimeout(function(){
                        $TreeView_Clientes.option("dataSource", New_List_Clientes);
                        loadPanel.hide();
                        resolve("resolve")
                    });
                    

                });
                
                
                
            }

        });


        $("#DataGrid_Reporte_Empleados").dxDataGrid({
            dataSource: [],
            selection: { mode: "single" },
            height: "100%",
            deferRendering:true,
            rowAlternationEnabled: true,
            allowColumnResizing: true,
            columnResizingMode:'widget',
            showRowLines: true,
            showColumnLines: true,
            showBorders: true,
            groupPanel: { visible: false },
            grouping: { autoExpandAll: true },
            allowColumnReordering: true,
            filterRow: { visible: false, applyFilter: 'auto' },
            filterPanel:{visible:false},
            headerFilter: { visible: true },
            searchPanel: { visible: false },
            scrolling: { mode: 'virtual' },
            keyExpr: "EMPLEADO_CSC_EMPLEADO",
            columnMinWidth: 100,
            columnWidth: 120,
            onInitialized:function(e){
                $DataGrid_Reporte_Empleados = e.component;
            },
            summary:{
                totalItems: [],
                texts:{
                    count:"Empleados  {0}",
                }
            },
            export: {
                enabled: false
            },
            columnChooser: {
                enabled: false,
                search: {
                    enabled:true
                },
                height:500
            },
            columnFixing: {
                enabled: true,
                texts: {
                    fix:"Fijar",
                    leftPosition:"A la Izquierda",
                    rightPosition:"A la Derecha",
                    unfix:"Sin Fijar"
                },
            },
            onExporting: function(e) { 
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
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Reporte_empleados_'+moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')+'.xlsx'); 
                    }); 
                }); 
                e.cancel = true; 
            },
            columns: [{
                caption: "ID",
                dataField: "EMPLEADO_CSC_EMPLEADO",
                alignment: "center",
                width:120
            },{
                caption: "Vacante Cubierta",
                dataField: "VACANTE_CUBIERTA",
                alignment: "center",
                width:150,
                calculateCellValue: function(rowData) {
                    if(rowData.TIPO_VACANTE_CSC == null || rowData.TIPO_VACANTE_CSC == 0){
                        return 0;
                    }
                    else{
                        return 1;
                    }
                },
                cellTemplate:function(container, options){
                    if(options.data.TIPO_VACANTE_CSC == null || options.data.TIPO_VACANTE_CSC == 0){
                        container.append(
                            $('<div />')
                            .append(
                                $('<img />').attr({"src":"images/Icons/cancel_icon.png","style":" height: 14px; margin-top: -2px; margin-right: 15px;"})
                            )
                            .append(
                                $('<span />').attr({"style":" height: 14px;"}).append("0")
                            )
                        );
                    }
                    else{
                        container.append(
                            $('<div />')
                            .append(
                                $('<img />').attr({"src":"images/Icons/success-icon.png","style":" height: 14px; margin-top: -2px; margin-right: 15px;"})
                            )
                            .append(
                                $('<span />').attr({"style":" height: 14px;"}).append("1")
                            )
                        );
                    }
                }
            },{
                caption: "Nomina",
                dataField: "EMPLEADO_ID_EXTERNO",
                alignment: "center"
            },{
                caption: "Nombre Completo",
                dataField: "NOMBRE_EMPLEADO",
                alignment: "center",
                width:300
            },{
                caption: "Estado Civil",
                dataField: "EMPLEADO_ESTADO_CIVIL_CSC",
                alignment: "center",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_ESTADO_CIVIL").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_ESTADO_CIVIL").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_ESTADO_CIVIL").KEYID
                }
            },{
                caption: "Genero",
                dataField: "TIPO_SEXO_CSC",
                alignment: "center",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_SEXO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_SEXO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_SEXO").KEYID
                }
            },{
                caption: "Site",
                dataField: "REQ_CSCREQUISICION",
                alignment: "center",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_REQUISICIONES").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_REQUISICIONES").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_REQUISICIONES").KEYID
                }
            },{
                caption: "RFC",
                dataField: "EMPLEADO_RFC",
                alignment: "center"
            },{
                caption: "CURP",
                dataField: "EMPLEADO_CURP",
                alignment: "center",
                width:150
            },{
                caption: "Categoria Puesto",
                dataField: "CAT_CATEGORIA_PUESTO_CSC",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_CATEGORIA_PUESTO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_CATEGORIA_PUESTO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_CATEGORIA_PUESTO").KEYID
                }
            },{
                caption: "Puesto",
                dataField: "CAT_PUESTO_CSCEMPLEADO",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_PUESTO_EMPLEADO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_PUESTO_EMPLEADO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_PUESTO_EMPLEADO").KEYID
                }
            },{
                caption: "Turno",
                dataField: "TIPO_TURNO_CSCTURNO",
                alignment: "center",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_TURNO_EMPLEADOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_TURNO_EMPLEADOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_TURNO_EMPLEADOS").KEYID
                }
            },{
                caption: "Proceso",
                dataField: "CAT_PROCESO_EMP_CSC",
                alignment: "center",
                width:150,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS").KEYID
                }
            },{
                caption: "Sub Proceso",
                dataField: "CAT_SUBPROCESO_EMP_CSC",
                alignment: "center",
                width:150,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_SUBPROCESO_EMPLEADOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_SUBPROCESO_EMPLEADOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_SUBPROCESO_EMPLEADOS").KEYID
                }
            },{
                caption: "Estatus",
                dataField: "ESTATUS_PROCESO_EMP_CSC",
                alignment: "center",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_ESTATUS_PROCESO_MPLEADOS").KEYID
                }
            },{
                caption: "Area",
                dataField: "CAT_AREA_CSC",
                alignment: "center",
                width:150,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_AREA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_AREA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_AREA").KEYID
                }
            },{
                caption: "Departamento",
                dataField: "CAT_DEPARTAMENTO_CSC",
                alignment: "center",
                width:150,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_DEPARTAMENTO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_DEPARTAMENTO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_EMPLEADO_DEPARTAMENTO").KEYID
                }
            },{
                caption: "Empresa Laboral",
                dataField: "EMPRESA_LABORAL_CSC",
                alignment: "center",
                width:150,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_EMPRESA_LABORAL").KEYID
                }
            },{
                caption: "Fecha Ingreso",
                dataField: 'EMPLEADO_FECH_INGRESOEMP',
                alignment: "center",
                width:150,
                dataType: 'date',
                format: 'dd/MM/yyyy'
            },{
                caption: "Fecha Firma Contrato",
                dataField: 'EMPLEADO_FECH_FIRMACONTRATO',
                alignment: "center",
                width:180,
                dataType: 'date',
                format: 'dd/MM/yyyy'
            },{
                caption: "Fecha Capacitación",
                dataField: 'EMPLEADO_FECH_CAPACITACION',
                alignment: "center",
                width:150,
                dataType: 'date',
                format: 'dd/MM/yyyy'
            },{
                caption: "Fecha Inicia Operación",
                dataField: 'EMPLEADO_FECH_INICIAOPERACION',
                alignment: "center",
                width:180,
                dataType: 'date',
                format: 'dd/MM/yyyy'
            },{
                caption: "Fecha Baja",
                dataField: 'EMPLEADO_FECH_BAJAEMPLEADO',
                alignment: "center",
                width:180,
                dataType: 'date',
                format: 'dd/MM/yyyy'
            },{
                caption: "Tipo Empleado",
                dataField: "TIPO_EMPLEADO_EMPLEADO_CSC",
                alignment: "center",
                width:180,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO").KEYID
                }
            },{
                caption: "Pagadora",
                dataField: "CAT_PROVEEDOR_CSC",
                alignment: "center",
                width:180,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_PROVEEDORES_INFRA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_PROVEEDORES_INFRA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_PROVEEDORES_INFRA").KEYID
                }
            },{
                caption: "Cliente",
                dataField: "CLIENTE_CSC",
                alignment: "center",
                width:180,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CLIENTES").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CLIENTES").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CLIENTES").KEYID
                }
            },{
                caption: "Campaña",
                dataField: "PM_CSC_PROYECTO",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_PROYECTOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_PROYECTOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_PROYECTOS").KEYID
                }
            },{
                caption: "Sub Campaña",
                dataField: "CAM_CSC_SERVICIO",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").KEYID
                }
            },{
                caption: "% Avance Documentación",
                dataField: "GD_ESTRUCTURA_AVANCE",
                alignment: "center",
                width:200
            },{
                caption: "Cuenta",
                dataField: "EMPLEADO_CUENTA",
                alignment: "center",
                width:150
            },{
                caption: "Banco",
                dataField: "EMPLEADO_BANCO_CSC",
                alignment: "center",
                width:180,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_BANCOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_BANCOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_BANCOS").KEYID
                }
            },{
                caption: "SPEI",
                dataField: "EMPLEADO_SPEI",
                alignment: "center",
                width:180
            },{
                caption: "Sueldo",
                dataField: "EMPLEADO_SUELDO_TOTAL",
                alignment: "center",
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_SUELDO_TOTAL == null){
                        return null;
                    }
                    else{
                        return "$ " + parseFloat(rowData.EMPLEADO_SUELDO_TOTAL).toLocaleString('en',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })  ;
                    }
                    
                }
            },{
                caption: "Sueldo Descripción",
                dataField: "EMPLEADO_SUELDO_TOTAL_DESCRIPCION",
                alignment: "center",
                width:300,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_SUELDO_TOTAL == null){
                        return null;
                    }
                    else{
                        return ( self.Calcual_Cantidad_En_Letras(parseInt(rowData.EMPLEADO_SUELDO_TOTAL)) + " PESOS 00/100 M.N.") .toUpperCase();
                    }
                    
                }
            },{
                caption: "Tipo Baja",
                dataField: "TIPOBAJA",
                alignment: "center",
                width:180,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").KEYID
                }
            },{
                caption: "Motivo Baja",
                dataField: "CAT_EMP_TREE_BAJA_CSC",
                alignment: "center",
                width:300,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").KEYID
                }
            },{
                caption: "Causa Baja",
                dataField: "CAUSABAJA",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_EMP_TREE_BAJA").KEYID
                }
            },
            //Campos no visibles por default
            {
                caption: "Apellido Materno",
                dataField: "EMPLEADO_AMATERNOEMPLEADO",
                alignment: "center",
                width:200,
                visible:false
            },{
                caption: "Apellido Paterno",
                dataField: "EMPLEADO_APATERNOEMPLEADO",
                alignment: "center",
                width:200,
                visible:false
            },{
                caption: "Nombre",
                dataField: "EMPLEADO_NOMBREEMPLEADO",
                alignment: "center",
                width:200,
                visible:false
            },{
                caption: "Antiguedad Contrato(Dias)",
                dataField: "PERIODO_CONTRATO",
                alignment: "center",
                visible:false
            },{
                caption: "Antiguedad Ingreso(Dias)",
                dataField: "PERIODO_INGRESO",
                alignment: "center",
                visible:false
            },{
                caption: "Año Baja",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_BAJAEMPLEADO == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_BAJAEMPLEADO).year();
                    }
                    
                }
            },{
                caption: "Año Ingreso",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_INGRESOEMP == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_INGRESOEMP).year();
                    }
                    
                }
            },{
                caption: "Año Inicia Operación",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_INICIAOPERACION == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_INICIAOPERACION).year();
                    }
                    
                }
            },{
                caption: "Aviso de Datos",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_AVISO_DATOS == true || rowData.EMPLEADO_AVISO_DATOS == 1 ){
                        return "Si";
                    }
                    else{
                        return  "No";
                    }
                }
            },{
                caption: "Calle",
                dataField: "EMPLEADO_DIRECCION_CALLE",
                alignment: "center",
                visible:false
            },{
                caption: "Cambio De Proceso",
                alignment: "center",
                width:180,
                dataType: 'date',
                format: 'dd/MM/yyyy',
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_CAMBIO_PROCESO == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_CAMBIO_PROCESO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD')
                    }
                }
            },{
                caption: "Campaña Reclutamiento",
                dataField: "TIPO_CAMPANIA_SOLICITA",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAM_SERVICIO").KEYID
                }
            },{
                caption: "Capacitador",
                dataField: "EMPLEADO_CAPACITADOR",
                alignment: "center",
                visible:false
            },{
                caption: "Celular",
                dataField: "EMPLEADO_CELULAR",
                alignment: "center",
                visible:false
            },{
                caption: "Clave Centro de Costos",
                dataField: "CLVE_CENTRO_COSTO",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_CAT_CENTRO_DE_COSTO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_CAT_CENTRO_DE_COSTO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_CAT_CENTRO_DE_COSTO").KEYID
                }
            },{
                caption: "Colonia",
                dataField: "EMPLEADO_DIRECCION_COLONIA",
                alignment: "center",
                visible:false
            },{
                caption: "Compartido",
                dataField: "TIPO_EMPLEADO_COMPARTIDO_CSC",
                alignment: "center",
                width:200,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_EMPLEADO_TIPO_COMPARTIDO").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_EMPLEADO_TIPO_COMPARTIDO").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_EMPLEADO_TIPO_COMPARTIDO").KEYID
                }
            },{
                caption: "CP",
                dataField: "EMPLEADO_DIRECCION_CODIGOPOSTAL",
                alignment: "center",
                visible:false
            },{
                caption: "Codigo Postal Fiscal",
                dataField: "EMPLEADO_CH_AUX1",
                alignment: "center",
                visible:false
            },{
                caption: "Dia Baja",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_BAJAEMPLEADO == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_BAJAEMPLEADO).date();
                    }
                    
                }
            },{
                caption: "Dia Ingreso",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_INGRESOEMP == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_INGRESOEMP).date();
                    }
                    
                }
            },{
                caption: "Dia Inicia Operación",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_INICIAOPERACION == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_INICIAOPERACION).date();
                    }
                    
                }
            },{
                caption: "Duracion Capacitacion(Dias)",
                dataField: "DURACION_CAPACITACION",
                alignment: "center",
                visible:false
            },{
                caption: "Duración Operación(Dias)",
                dataField: "DURACION_OPERACION",
                alignment: "center",
                visible:false
            },{
                caption: "Email Laboral",
                dataField: "EMPLEADO_EMAILLABORAL",
                alignment: "center",
                visible:false
            },{
                caption: "Email Personal",
                dataField: "SOLICITUD_EMPLEADO_EMAIL_PERSONAL",
                alignment: "center",
                visible:false
            },{
                caption: "Estado",
                dataField: "ESTADO_DESCRIPCION",
                alignment: "center",
                visible:false
            },{
                caption: "Estado Nacimiento",
                dataField: "EMPLEADO_LUGAR_NACIMIENTO_CSCESTADO",
                alignment: "center",
                width:200,
                visible:false,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_ESTADOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_ESTADOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_ESTADOS").KEYID
                }
            },{
                caption: "Ext.",
                dataField: "EMPLEADO_EXTENSION",
                alignment: "center",
                visible:false
            },{
                caption: "Fecha Alta",
                alignment: "center",
                dataType: 'date',
                format: 'dd/MM/yyyy',
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.AUDITORIA_FEC_ALTA == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.AUDITORIA_FEC_ALTA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD')
                    }
                }
            },{
                caption: "Fecha Cita",
                dataField:"FECHA_CITA",
                alignment: "center",
                dataType: 'date',
                format: 'dd/MM/yyyy',
                visible:false
            },{
                caption: "Fecha Nacimiento",
                dataField:"EMPLEADO_FECHA_NACIMIENTO",
                dataType: 'date',
                format: 'dd/MM/yyyy',
                visible:false
            },{
                caption: "Fecha Reclutamiento",
                dataField: "EMPLEADO_FECH_RECLUTAMIENTO",
                alignment: "center",
                dataType: 'date',
                format: 'dd/MM/yyyy',
                visible:false
            },{
                caption: "Fecha Modificación",
                dataField: "AUDITORIA_FEC_ALTA",
                alignment: "center",
                dataType: 'date',
                format: 'dd/MM/yyyy',
                visible:false
            },{
                caption: "Fecha Reingreso",
                dataField: "EMPLEADO_FECH_REINGRESO",
                alignment: "center",
                dataType: 'date',
                format: 'dd/MM/yyyy',
                visible:false
            },{
                caption: "Frecuencia Pago",
                dataField: "TIPO_FRECUENCIA_CSC",
                alignment: "center",
                width:200,
                visible:false,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_FRECUENCIA_PAGOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_FRECUENCIA_PAGOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_FRECUENCIA_PAGOS").KEYID
                }
            },{
                caption: "ID Vacante",
                dataField: "TIPO_VACANTE_CSC",
                alignment: "center",
                visible:false
            },{
                caption: "IMSS",
                dataField: "EMPLEADO_IMSS",
                alignment: "center",
                visible:false
            },{
                caption: "Int.",
                dataField: "EMPLEADO_DIRECCION_NUMERO_INT",
                alignment: "center",
                visible:false
            },{
                caption: "Jefe Inmediato",
                dataField: "NOMBRE_JEFE_INMEDIATO",
                alignment: "center",
                visible:false
            },{
                caption: "Jornada",
                dataField: "CAT_JORNADA_DESCRIPCION",
                alignment: "center",
                visible:false
            },{
                caption: "Lugar de Nacimiento",
                dataField: "EMPLEADO_LUGAR_NACIMIENTO",
                alignment: "center",
                visible:false
            },{
                caption: "Mes Baja",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_BAJAEMPLEADO == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_BAJAEMPLEADO).month();
                    }
                    
                }
            },{
                caption: "Mes Ingreso",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_INGRESOEMP == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_INGRESOEMP).month();
                    }
                    
                }
            },{
                caption: "Mes Inicia Operación",
                alignment: "center",
                visible:false,
                calculateCellValue: function(rowData) {
                    if(rowData.EMPLEADO_FECH_INICIAOPERACION == null){
                        return null;
                    }
                    else{
                        return  moment(rowData.EMPLEADO_FECH_INICIAOPERACION).month();
                    }
                    
                }
            },{
                caption: "Municipio",
                dataField: "EMPLEADO_DIRECCION_MUNICIPIO",
                alignment: "center",
                visible:false
            },{
                caption: "Nomina Jefe Directo",
                dataField: "NOMINA_JEFE_DIRECTO",
                alignment: "center",
                visible:false
            },{
                caption: "Nomina Referido",
                dataField: "EMPLEADO_CH_AUX2",
                alignment: "center",
                visible:false
            },{
                caption: "Pais",
                dataField: "EMPLEADO_DIRECCION_PAIS_CSCPAIS",
                alignment: "center",
                width:200,
                visible:false,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_PAISES").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_PAISES").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_PAISES").KEYID
                }
            },{
                caption: "Pais Nacimiento",
                dataField: "EMPLEADO_LUGAR_NACIMIENTO_CSCPAIS",
                alignment: "center",
                width:200,
                visible:false,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_PAISES").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_PAISES").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_PAISES").KEYID
                }
            },{
                caption: "PIN",
                dataField: "EMPLEADO_PIN",
                alignment: "center",
                visible:false
            },{
                caption: "Telefono Casa",
                dataField: "EMPLEADO_TELEFONO1",
                alignment: "center",
                visible:false
            },{
                caption: "Telefono Emergencia",
                dataField: "EMPLEADO_TELEMERGENCIAEMPLEADO",
                alignment: "center",
                visible:false
            },{
                caption: "Telefono Oficina",
                dataField: "EMPLEADO_TELEFONO2",
                alignment: "center",
                visible:false
            },{
                caption: "Tipo Centro De Costos",
                dataField: "CAT_CENTRO_COSTOS_CSC",
                alignment: "center",
                width:200,
                visible:false,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_CENTRO_COSTOS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_CENTRO_COSTOS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_CENTRO_COSTOS").KEYID
                }
            },{
                caption: "Ubiación Laboral",
                dataField: "TIPO_UBICACION_LABORAL_CSC",
                alignment: "center",
                width:200,
                visible:false,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_UBICACION_LABORAL").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_UBICACION_LABORAL").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_UBICACION_LABORAL").KEYID
                }
            },{
                caption: "WS",
                dataField: "TIPO_EMPLEADO_WS_CSC",
                alignment: "center",
                width:200,
                visible:false,
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_EMPLEADO_TIPO_WS").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_EMPLEADO_TIPO_WS").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_EMPLEADO_TIPO_WS").KEYID
                }
            }]  
        });


        $("#PivotGrid_Reporte_Empleados").dxPivotGrid({
            onInitialized:function(e){
                $PivotGrid_Reporte_Empleados = e.component;
            },
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
                enabled: true,
            },
            fieldChooser: {
                enabled: true,
                applyChangesMode: 'instantly',
                allowSearch: true
            },
            onExporting(e) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('empleados');
          
                DevExpress.excelExporter.exportPivotGrid({
                    component: e.component,
                    worksheet,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'privot_grit_'+moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')+'.xlsx');
                    });
                });
                e.cancel = true; 
            },
            dataSource:{
                fields:[
                //CAMPOS CALCULADORES
                {
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
                    area: 'filter',
                    summaryDisplayMode: 'percentOfColumnGrandTotal',
                },{
                    caption: '% Fila',
                    dataField: 'EMP_CSC_EMPRESA_HOST',
                    dataType: 'number',
                    summaryType: 'sum',
                    area: 'filter',
                    summaryDisplayMode: 'percentOfRowGrandTotal',
                },

                //CAMPO PARA FILTROS DEFAULT
                {
                    caption: 'Cliente',
                    dataField: 'CLIENTE_CSC',
                    width: 150,
                    area: 'row',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CLIENTES");
                    },
                    expanded: true
                },{
                    caption: 'Inmueble',
                    dataField: 'REQ_CSCREQUISICION',
                    area: 'column',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_REQUISICIONES");
                    },
                    expanded: true
                },
                
                //CAMPO PARA HACER FILTROS VISIBLES
                {
                    caption: 'ID Empleado',
                    dataField: 'EMPLEADO_CSC_EMPLEADO',
                    area: 'filter',
                    expanded: true
                },{
                    caption: '# Nomina',
                    dataField: 'EMPLEADO_ID_EXTERNO',
                    area: 'filter',
                    expanded: true
                },{
                    caption: 'Activos/No Activos',
                    dataField: 'ESTATUS_PROCESO_EMP_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_ESTATUS_PROCESO_MPLEADOS");
                    },
                    expanded: true
                },{
                    caption: 'Genero',
                    dataField: 'TIPO_SEXO_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_SEXO");
                    },
                    expanded: true
                },{
                    caption: 'Tipo Centro de Costos',
                    dataField: 'CAT_CENTRO_COSTOS_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_CENTRO_COSTOS");
                    },
                    expanded: true
                },{
                    caption: 'Ubicación Laboral',
                    dataField: 'TIPO_UBICACION_LABORAL_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_UBICACION_LABORAL");
                    },
                    expanded: true
                },{
                    caption: 'Fecha Cita',
                    dataField: 'FECHA_CITA',
                    dataType: 'date',
                    area: 'filter',
                    expanded: true
                },{
                    caption: 'Fecha Cita Año',
                    groupName: 'FECHA_CITA',
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
                    caption: 'Fecha Cita Trimestre',
                    groupName: 'FECHA_CITA',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Fecha Cita Mes',
                    groupName: 'FECHA_CITA',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Fecha Cita Dia',
                    groupName: 'FECHA_CITA',
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
                    caption: 'Fecha Baja',
                    dataField: 'EMPLEADO_FECH_BAJAEMPLEADO',
                    dataType: 'date',
                    area: 'filter',
                    expanded: true
                },{
                    caption: 'Fecha Baja Año',
                    groupName: 'EMPLEADO_FECH_BAJAEMPLEADO',
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
                    caption: 'Fecha Baja Cuatrimestre',
                    groupName: 'EMPLEADO_FECH_BAJAEMPLEADO',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Fecha Baja Mes',
                    groupName: 'EMPLEADO_FECH_BAJAEMPLEADO',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Fecha Baja Dia',
                    groupName: 'EMPLEADO_FECH_BAJAEMPLEADO',
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
                    caption: 'Fecha de Ingreso',
                    dataField: 'EMPLEADO_FECH_INGRESOEMP',
                    dataType: 'date',
                    area: 'filter',
                    expanded: true
                },{
                    caption: 'Fecha de Ingreso Año',
                    groupName: 'EMPLEADO_FECH_INGRESOEMP',
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
                    caption: 'Fecha de Ingreso Cuatrimestre',
                    groupName: 'EMPLEADO_FECH_INGRESOEMP',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Fecha de Ingreso Mes',
                    groupName: 'EMPLEADO_FECH_INGRESOEMP',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Fecha de Ingreso Dia',
                    groupName: 'EMPLEADO_FECH_INGRESOEMP',
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
                    caption: 'Dias En La Compañia',
                    dataField: 'PERIODO_INGRESO',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return cellInfo.value + " Dias"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Periodo En La Compañia',
                    area: 'filter',
                    summaryType: "custom",
                    selector: function(data) {
                        if(data.PERIODO_INGRESO == null || data.PERIODO_INGRESO == 0){
                            return 0;
                        }
                        else{
                            const daysInMonth = 30.44;  // Promedio de días por mes
                            const months = data.PERIODO_INGRESO / daysInMonth;
                            return Math.floor(months);
                        }
                    },
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "0 Meses"
                        }
                        else{
                            return cellInfo.value + " Meses"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Proceso',
                    dataField: 'CAT_PROCESO_EMP_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_PROCESO_EMPLEADOS");
                    },
                    expanded: true
                },{
                    caption: 'Sub Proceso',
                    dataField: 'CAT_SUBPROCESO_EMP_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_SUBPROCESO_EMPLEADOS");
                    },
                    expanded: true
                },{
                    caption: 'Empresa Laboral',
                    dataField: 'EMPRESA_LABORAL_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_EMPRESA_LABORAL");
                    },
                    expanded: true
                },{
                    caption: 'Vacante Cubierta',
                    area: 'filter',
                    summaryType: "custom",  
                    selector: function(data) {
                        if(data.TIPO_VACANTE_CSC == null || data.TIPO_VACANTE_CSC == 0){
                            return "No Cubierta";
                        }
                        else{
                            return "Cubierta"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Nombre Completo',
                    dataField: 'NOMBRE_EMPLEADO',
                    area: 'filter',
                    width: 250,
                    expanded: true
                },{
                    caption: 'WS',
                    dataField: 'TIPO_EMPLEADO_WS_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_EMPLEADO_TIPO_WS");
                    },
                    expanded: true
                },{
                    caption: 'Categoria Puesto',
                    dataField: 'CAT_CATEGORIA_PUESTO_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_CATEGORIA_PUESTO");
                    },
                    expanded: true
                },{
                    caption: 'Puesto',
                    dataField: 'CAT_PUESTO_CSCEMPLEADO',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_PUESTO_EMPLEADO");
                    },
                    expanded: true
                },{
                    caption: 'Area',
                    dataField: 'CAT_AREA_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_EMPLEADO_AREA");
                    },
                    expanded: true
                },{
                    caption: 'Departamento',
                    dataField: 'CAT_DEPARTAMENTO_CSC',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_EMPLEADO_DEPARTAMENTO");
                    },
                    expanded: true
                },{
                    caption: 'Jornada Completa',
                    dataField: 'CAT_JORNADA_DESCRIPCION',
                    area: 'filter',
                    width: 300,
                    expanded: true
                },{
                    caption: 'Campaña',
                    dataField: 'PM_CSC_PROYECTO',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_PROYECTOS");
                    },
                    expanded: true
                },{
                    caption: 'Sub Campaña',
                    dataField: 'CAM_CSC_SERVICIO',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAM_SERVICIO");
                    },
                    expanded: true
                },{
                    caption: 'Clave Centro de Costos',
                    dataField: 'CLVE_CENTRO_COSTO',
                    area: 'filter',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_CENTRO_DE_COSTO");
                    },
                    expanded: true
                },

                //CAMPOS NO VISIBLES / SELECCIONABLES
                {
                    caption: 'ID Jefe Inmediato',
                    dataField: 'EMPLEADO_CSC_EMPLEADO_PADRE',
                    expanded: true
                },{
                    caption: 'A Quien Reporta',
                    dataField: 'NOMBRE_JEFE_INMEDIATO',
                    expanded: true
                },{
                    caption: 'Apellido Paterno',
                    dataField: 'EMPLEADO_APATERNOEMPLEADO',
                    expanded: true
                },{
                    caption: 'Apellido Materno',
                    dataField: 'EMPLEADO_AMATERNOEMPLEADO',
                    expanded: true
                },{
                    caption: 'Nombre',
                    dataField: 'EMPLEADO_NOMBREEMPLEADO',
                    expanded: true
                },{
                    caption: 'Acepta Aviso',
                    summaryType: "custom",  
                    selector: function(data) {
                        if(data.EMPLEADO_ACEPTA_AVISO == true || data.EMPLEADO_ACEPTA_AVISO == 1){
                            return "Si";
                        }
                        else{
                            return "No"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Antiguedad Contrato (Dias)',
                    dataField: 'PERIODO_CONTRATO',
                    expanded: true
                },{
                    caption: 'Antiguedad Ingreso (Dias)',
                    dataField: 'PERIODO_INGRESO',
                    expanded: true
                },{
                    caption: 'Fecha de Alta',
                    dataField: 'AUDITORIA_FEC_ALTA',
                    dataType: 'date',
                    expanded: true
                },{
                    caption: 'Año de Alta',
                    groupName: 'AUDITORIA_FEC_ALTA',
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
                    groupName: 'AUDITORIA_FEC_ALTA',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes de Alta',
                    groupName: 'AUDITORIA_FEC_ALTA',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia de Alta',
                    groupName: 'AUDITORIA_FEC_ALTA',
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
                    caption: 'Fecha Inicia Operación',
                    dataField: 'EMPLEADO_FECH_INICIAOPERACION',
                    dataType: 'date',
                    expanded: true
                },{
                    caption: 'Año Inicia Operación',
                    groupName: 'EMPLEADO_FECH_INICIAOPERACION',
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
                    caption: 'Cuatrimestre Inicia Operación',
                    groupName: 'EMPLEADO_FECH_INICIAOPERACION',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Inicia Operación',
                    groupName: 'EMPLEADO_FECH_INICIAOPERACION',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Inicia Operación',
                    groupName: 'EMPLEADO_FECH_INICIAOPERACION',
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
                    caption: 'Fecha Reclutamiento',
                    dataField: 'EMPLEADO_FECH_RECLUTAMIENTO',
                    dataType: 'date',
                    expanded: true
                },{
                    caption: 'Año Reclutamiento',
                    groupName: 'EMPLEADO_FECH_RECLUTAMIENTO',
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
                    caption: 'Cuatrimestre Reclutamiento',
                    groupName: 'EMPLEADO_FECH_RECLUTAMIENTO',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Reclutamiento',
                    groupName: 'EMPLEADO_FECH_RECLUTAMIENTO',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Reclutamiento',
                    groupName: 'EMPLEADO_FECH_RECLUTAMIENTO',
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
                    caption: 'Banco',
                    dataField: 'EMPLEADO_BANCO_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_BANCOS");
                    },
                    expanded: true
                },{
                    caption: 'Campaña Reclutamiento',
                    dataField: 'TIPO_CAMPANIA_SOLICITA',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAM_SERVICIO");
                    },
                    expanded: true
                },{
                    caption: 'Capacitador',
                    dataField: 'NOMBRE_CAPACITADOR',
                    width: 250,
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return cellInfo.value
                        }
                    },
                    expanded: true
                },{
                    caption: 'Causa Baja',
                    dataField: 'CAUSABAJA',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_EMP_TREE_BAJA");
                    },
                    expanded: true
                },{
                    caption: 'Celular',
                    dataField: 'EMPLEADO_CELULAR',
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return cellInfo.value
                        }
                    },
                    expanded: true
                },{
                    caption: 'Colonia',
                    dataField: 'EMPLEADO_DIRECCION_COLONIA',
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return cellInfo.value
                        }
                    },
                    expanded: true
                },{
                    caption: 'Compartido',
                    dataField: 'TIPO_EMPLEADO_COMPARTIDO_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_EMPLEADO_TIPO_COMPARTIDO");
                    },
                    expanded: true
                },{
                    caption: 'CURP',
                    dataField: 'EMPLEADO_CURP',
                    expanded: true
                },{
                    caption: 'Depto BC',
                    dataField: 'TIPO_DEPTO_BC_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_DEPARTAMENTO_BC");
                    },
                    expanded: true
                },{
                    caption: 'Discapacitado',
                    summaryType: "custom",  
                    selector: function(data) {
                        if(data.EMPLEADO_DISCAPACITADO == true || data.EMPLEADO_DISCAPACITADO == 1){
                            return "Si";
                        }
                        else{
                            return "No"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Duracion Capacitacion(Dias)',
                    dataField: 'DURACION_CAPACITACION',
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return cellInfo.value + " Dias"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Duracion Operación(Dias)',
                    dataField: 'DURACION_OPERACION',
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return cellInfo.value + " Dias"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Empleado PEI',
                    dataField: 'EMPLEADO_PEI',
                    customizeText: function (cellInfo) {
                        if(cellInfo.value == null){
                            return "Sin Dato"
                        }
                        else{
                            return cellInfo.value;
                        }
                    },
                    expanded: true
                },{
                    caption: 'Empresa Reclutadora',
                    dataField: 'TIPO_EMPRESA_RECLUTA_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_EMPRESA_RECLUTA");
                    },
                    expanded: true
                },{
                    caption: 'Entrevistador',
                    dataField: 'NOMBRE_ENTREVISTADOR',
                    expanded: true
                },{
                    caption: 'Estado',
                    dataField: 'ESTADO_DESCRIPCION',
                    expanded: true
                },{
                    caption: 'Estado Civil',
                    dataField: 'EMPLEADO_ESTADO_CIVIL_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_EMPLEADO_ESTADO_CIVIL");
                    },
                    expanded: true
                },{
                    caption: 'Fecha Cambio de Proceso',
                    dataField: 'EMPLEADO_FECH_CAMBIO_PROCESO',
                    dataType: 'date',
                    expanded: true,
                    selector: function(data) {
                        if(data.EMPLEADO_FECH_CAMBIO_PROCESO == null){
                            return null;
                        }
                        else{
                            return moment(rowData.EMPLEADO_FECH_CAMBIO_PROCESO).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD')
                        }
                    },
                },{
                    caption: 'Año Cambio de Proceso',
                    groupName: 'EMPLEADO_FECH_CAMBIO_PROCESO',
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
                    caption: 'Cuatrimestre Cambio de Proceso',
                    groupName: 'EMPLEADO_FECH_CAMBIO_PROCESO',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Cambio de Proceso',
                    groupName: 'EMPLEADO_FECH_CAMBIO_PROCESO',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Cambio de Proceso',
                    groupName: 'EMPLEADO_FECH_CAMBIO_PROCESO',
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
                    caption: 'Fecha Capacitación',
                    dataField: 'EMPLEADO_FECH_CAPACITACION',
                    dataType: 'date',
                    expanded: true
                },{
                    caption: 'Año Capacitación',
                    groupName: 'EMPLEADO_FECH_CAPACITACION',
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
                    caption: 'Cuatrimestre Capacitación',
                    groupName: 'EMPLEADO_FECH_CAPACITACION',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Capacitación',
                    groupName: 'EMPLEADO_FECH_CAPACITACION',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Capacitación',
                    groupName: 'EMPLEADO_FECH_CAPACITACION',
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
                    caption: 'Fecha Nacimiento',
                    dataField: 'EMPLEADO_FECHA_NACIMIENTO',
                    dataType: 'date',
                    expanded: true
                },{
                    caption: 'Año Nacimiento',
                    groupName: 'EMPLEADO_FECHA_NACIMIENTO',
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
                    caption: 'Cuatrimestre Nacimiento',
                    groupName: 'EMPLEADO_FECHA_NACIMIENTO',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Nacimiento',
                    groupName: 'EMPLEADO_FECHA_NACIMIENTO',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Nacimiento',
                    groupName: 'EMPLEADO_FECHA_NACIMIENTO',
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
                    caption: 'Fecha Reingreso',
                    dataField: 'EMPLEADO_FECH_REINGRESO',
                    dataType: 'date',
                    expanded: true
                },{
                    caption: 'Año Reingreso',
                    groupName: 'EMPLEADO_FECH_REINGRESO',
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
                    caption: 'Cuatrimestre Reingreso',
                    groupName: 'EMPLEADO_FECH_REINGRESO',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Reingreso',
                    groupName: 'EMPLEADO_FECH_REINGRESO',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Reingreso',
                    groupName: 'EMPLEADO_FECH_REINGRESO',
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
                    caption: 'Fecha Firma Contrato',
                    dataField: 'EMPLEADO_FECH_FIRMACONTRATO',
                    dataType: 'date',
                    expanded: true
                },{
                    caption: 'Año Firma Contrato',
                    groupName: 'EMPLEADO_FECH_FIRMACONTRATO',
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
                    caption: 'Cuatrimestre Firma Contrato',
                    groupName: 'EMPLEADO_FECH_FIRMACONTRATO',
                    groupInterval: 'quarter',
                    expanded: false,
                    visible:false
                },{
                    caption: 'Mes Firma Contrato',
                    groupName: 'EMPLEADO_FECH_FIRMACONTRATO',
                    groupInterval: 'month',
                    expanded: false,
                },{
                    caption: 'Dia Firma Contrato',
                    groupName: 'EMPLEADO_FECH_FIRMACONTRATO',
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
                    caption: 'Forma de Pago',
                    dataField: 'EMPLEADO_FORMA_PAGO_CSC',
                    expanded: true
                    
                },{
                    caption: 'ID Vacante',
                    dataField: 'TIPO_VACANTE_CSC',
                    expanded: true
                },{
                    caption: 'Motivo de Baja',
                    dataField: 'CAT_EMP_TREE_BAJA_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_EMP_TREE_BAJA");
                    },
                    expanded: true
                },{
                    caption: 'Municipio',
                    dataField: 'EMPLEADO_DIRECCION_MUNICIPIO',
                    expanded: true
                },{
                    caption: 'Pagadora',
                    dataField: 'CAT_PROVEEDOR_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_CAT_PROVEEDORES_INFRA");
                    },
                    expanded: true
                },{
                    caption: 'Pais',
                    dataField: 'EMPLEADO_DIRECCION_PAIS_CSCPAIS',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_PAISES");
                    },
                    expanded: true
                },{
                    caption: 'Pensión Alimentaria',
                    summaryType: "custom",  
                    selector: function(data) {
                        if(data.EMPLEADO_PENSION_ALIM == true || data.EMPLEADO_PENSION_ALIM == 1){
                            return "Si";
                        }
                        else{
                            return "No"
                        }
                    },
                    expanded: true
                },{
                    caption: 'Perfil',
                    dataField: 'TIPO_PERFIL_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_EMPLEADO_PERFIL");
                    },
                    expanded: true
                },{
                    caption: 'Reclutador',
                    dataField: 'NOMBRE_RECLUTADOR',
                    expanded: true
                },{
                    caption: 'RFC',
                    dataField: 'EMPLEADO_RFC',
                    expanded: true
                },{
                    caption: 'Site',
                    dataField: 'EMPLEADO_SITE_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_REQUISICIONES");
                    },
                    expanded: true
                },{
                    caption: 'Sueldo Bruto',
                    dataField: 'EMPLEADO_SUELDO_BRUTO',
                    dataType: 'number',
                    format: 'currency',
                    expanded: true
                },{
                    caption: 'Sueldo Neto',
                    dataField: 'EMPLEADO_SUELDO_NETO',
                    dataType: 'number',
                    format: 'currency',
                    expanded: true
                },{
                    caption: 'Sueldo Total',
                    dataField: 'EMPLEADO_SUELDO_TOTAL',
                    dataType: 'number',
                    format: 'currency',
                    expanded: true
                },{
                    caption: 'Tipo Baja',
                    dataField: 'TIPOBAJA',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_EMP_TREE_BAJA");
                    },
                    expanded: true
                },{
                    caption: 'Tipo Contrato',
                    dataField: 'TIPO_CONTRATO_CSCCONTRATO',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_CONTRATO_EMPLEADOS");
                    },
                    expanded: true
                },{
                    caption: 'Tipo Empleado',
                    dataField: 'TIPO_EMPLEADO_EMPLEADO_CSC',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_EMPLEADO");
                    },
                    expanded: true
                },{
                    caption: 'Turno',
                    dataField: 'TIPO_TURNO_CSCTURNO',
                    customizeText: function (cellInfo) {
                        return self.Calcule_Label_Colum_Pivot(cellInfo.value,"SAMT_TIPO_TURNO_EMPLEADOS");
                    },
                    expanded: true
                },
                
            
                //CAMPOS QUE NO SE DEBEN VER
                {
                    dataField: 'SOLICITUD_EMPLEADO_EMAIL_PERSONAL',
                    visible:false
                },{
                    dataField: 'EMPLEADO_COMENTARIOS',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CVEESTATUS',
                    visible:false
                },{
                    dataField: 'EMPLEADO_UNIQUE_ID',
                    visible:false
                },{
                    dataField: 'EMPLEADO_LAT',
                    visible:false
                },{
                    dataField: 'EMPLEADO_LONG',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DIRECCION_CODIGOPOSTAL',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DIRECCION_NUMERO_EXT',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DIRECCION_NUMERO_INT',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DIRECCION_CALLE',
                    visible:false
                },{
                    dataField: 'EMPLEADO_NOMBREEMPLEADO_SEGUNDO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_IMSS',
                    visible:false
                },{
                    dataField: 'EMPLEADO_TELEFONO1',
                    visible:false
                },{
                    dataField: 'EMPLEADO_TELEFONO2',
                    visible:false
                },{
                    dataField: 'EMPLEADO_EXTENSION',
                    visible:false
                },{
                    dataField: 'EMPLEADO_TELEMERGENCIAEMPLEADO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_FAXEMPLEADO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_EMAILLABORAL',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CONTACTO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_AVISO_DATOS',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CAPACITADOR_CSC',
                    visible:false
                },{
                    dataField: 'TIPO_DOCUMENTO_CSC',
                    visible:false
                },{
                    dataField: 'GD_ESTRUCTURA_AVANCE',
                    visible:false
                },{
                    dataField: 'EMPLEADO_IN_AUX1',
                    visible:false
                },{
                    dataField: 'EMPLEADO_IN_AUX2',
                    visible:false
                },{
                    dataField: 'EMPLEADO_IN_AUX3',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CH_AUX1',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CH_AUX2',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CH_AUX3',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DT_AUX1',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DT_AUX2',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DEC_AUX1',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DEC_AUX2',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DEC_AUX3',
                    visible:false
                },{
                    dataField: 'EMPLEADO_ZONA_HORARIA_CLAVE',
                    visible:false
                },{
                    dataField: 'EMPLEADO_ZONA_HORARIA_TIEMPO',
                    visible:false
                },{
                    dataField: 'CAT_ZONA_HORARIA_CSC',
                    visible:false
                },{
                    dataField: 'EMPLEADO_ENROLADO_BIOMETRICO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CSC_EMPLEADO_ENROLADOR',
                    visible:false
                },{
                    dataField: 'EMPLEADO_ENTREVISTADOR_CSC',
                    visible:false
                },{
                    dataField: 'TIPO_ESPECIALIDAD_ESCOLAR_CSC',
                    visible:false
                },{
                    dataField: 'TIPO_GRADO_ESTUDIO_CSC',
                    visible:false
                },{
                    dataField: 'EMPLEADO_LUGAR_TRABAJO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_LUGAR_NACIMIENTO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_PENSION_ALIM',
                    visible:false
                },{
                    dataField: 'EMPLEADO_RECLUTADOR_CSC',
                    visible:false
                },{
                    dataField: 'TIPO_EMPRESA_CSC',
                    visible:false
                },{
                    dataField: 'CAT_DECRIPCION_REPORTE1',
                    visible:false
                },{
                    dataField: 'CAT_DECRIPCION_REPORTE2',
                    visible:false
                },{
                    dataField: 'EMPLEADO_CVEEMPLEADO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DEPARTAMENTO_BCONN_CSC',
                    visible:false
                },{
                    dataField: 'EMPLEADO_DIRECCION_EDO_CSCESTADO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_HUELLA_FECHA_ALTA',
                    visible:false
                },{
                    dataField: 'EMPLEADO_HUELLA_FECHA_MODIFICA',
                    visible:false
                },{
                    dataField: 'EMPLEADO_LUGAR_NACIMIENTO_CSCESTADO',
                    visible:false
                },{
                    dataField: 'EMPLEADO_LUGAR_NACIMIENTO_CSCPAIS',
                    visible:false
                },{
                    dataField: 'EMPLEADO_OBSERVACIONES',
                    visible:false
                },{
                    dataField: 'EMPLEADO_RES_PATRONAL',
                    visible:false
                },{
                    dataField: 'EMPLEADO_SKILL1',
                    visible:false
                },{
                    dataField: 'EMPLEADO_SKILL2',
                    visible:false
                },{
                    dataField: 'EMPLEADO_SKILL3',
                    visible:false
                },{
                    dataField: 'EMPLEADO_ZONA_SALARIAL',
                    visible:false
                },{
                    dataField: 'TIPO_ACTIVIDAD_EMPLEADO_CSC',
                    visible:false
                },{
                    dataField: 'TIPO_CALCULO_NOMINA_CSC',
                    visible:false
                },{
                    dataField: 'TIPO_EMPLEADO_BAJA_CSC',
                    visible:false
                },{
                    dataField: 'TIPO_FUNCION_CSC',
                    visible:false
                },{
                    dataField: 'SAMT_PF_TIPO_ACTUALIZA_EMPLEADO_CSC',
                    visible:false
                }],
                store: []
            }
        });

    }


    /**LEE TODOS LOS CATALOGOS NECESARIOS PARA LA SOLICITUD**/
    self.Load_Full_Catalogs = async function() {

        self.Content_Full_Catalogs = {
            "SAMT_EMPRESA_LABORAL":{
                DATA:[],
                KEYID:"EMPRESA_LABORAL_CSC",
                TEXT:"EMPRESA_LABORAL_RAZONSOCIALNOMBRE",
                ACTIVE:"EMPRESA_LABORAL_ACTIVO"
            },
            "SAMT_CAT_ESTATUS_PROCESO_MPLEADOS":{
                DATA:[],
                KEYID:"CAT_ESTATUS_PROCESO_EMP_CSC",
                TEXT:"CAT_ESTATUS_PROCESO_EMP_IDIOMA1",
                ACTIVE:"CAT_ESTATUS_PROCESO_EMP_ACTIVO"
            },
            "SAMT_CAT_PROCESO_EMPLEADOS":{
                DATA:[],
                KEYID:"CAT_PROCESO_EMP_CSC",
                TEXT:"CAT_PROCESO_EMP_IDIOMA1",
                ACTIVE:"CAT_PROCESO_EMP_ACTIVO"
            },
            "SAMT_CAT_SUBPROCESO_EMPLEADOS":{
                DATA:[],
                KEYID:"CAT_SUBPROCESO_EMP_CSC",
                TEXT:"CAT_SUBPROCESO_EMP_IDIOMA1",
                ACTIVE:"CAT_SUBPROCESO_EMP_ACTIVO"
            },
            "SAMT_CAT_EMPLEADO_AREA":{
                DATA:[],
                KEYID:"TIPO_AREA_CSC",
                TEXT:"TIPO_AREA_IDIOMA1",
                ACTIVE:"TIPO_AREA_ACTIVO"
            },
            "SAMT_CAT_EMPLEADO_DEPARTAMENTO":{
                DATA:[],
                KEYID:"EMPLEADO_DEPARTAMENTO_CSC",
                TEXT:"SAMT_TIPO_DEPARTAMENTO_IDIOMA1",
                ACTIVE:"SAMT_TIPO_DEPARTAMENTO_ACTIVO"
            },
            "SAMT_CAT_CATEGORIA_PUESTO":{
                DATA:[],
                KEYID:"CAT_CATEGORIA_PUESTO_CSC",
                TEXT:"CAT_CATEGORIA_PUESTO_IDIOMA1",
                ACTIVE:"CAT_CATEGORIA_PUESTO_ACTIVO"
            },
            "SAMT_TIPO_PUESTO_EMPLEADO":{
                DATA:[],
                KEYID:"TIPO_PUESTO_CSCEMPLEADO",
                TEXT:"TIPO_PUESTO_IDIOMA1",
                ACTIVE:"TIPO_PUESTO_ACTIVO"
            },
            "SAMT_TIPO_UBICACION_LABORAL":{
                DATA:[],
                KEYID:"TIPO_UBICACION_LABORAL_CSC",
                TEXT:"TIPO_UBICACION_IDIOMA1",
                ACTIVE:"TIPO_UBICACION_ACTIVO"
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
            "SAMT_TIPO_EMPLEADO_ESTADO_CIVIL":{
                DATA:[],
                KEYID:"EMPLEADO__ESTADO_CIVIL_CSC",
                TEXT:"SAMT_TIPO_ESTADO_CIVIL_IDIOMA1",
                ACTIVE:"SAMT_TIPO_ESTADO_CIVIL_ACTIVO"
            },
            "SAMT_TIPO_SEXO":{
                DATA:[],
                KEYID:"TIPO_SEXO_CSC",
                TEXT:"TIPO_SEXO_IDIOMA1",
                ACTIVE:"TIPO_SEXO_ACTIVO"
            },
            "SAMT_TIPO_TURNO_EMPLEADOS":{
                DATA:[],
                KEYID:"TIPO_TURNO_CSCTURNO",
                TEXT:"TIPO_TURNO_IDIOMA1",
                ACTIVE:"TIPO_TURNO_ACTIVO"
            },
            "SAMT_TIPO_EMPLEADO":{
                DATA:[],
                KEYID:"TIPO_EMPLEADO_CSCEMPLEADO",
                TEXT:"TIPO_EMPLEADO_IDIOMA1",
                ACTIVE:"TIPO_EMPLEADO_ACTIVO"
            },
            "SAMT_CAT_PROVEEDORES_INFRA":{
                DATA:[],
                KEYID:"CAT_PROVEEDOR_INFRA_CSC",
                TEXT:"CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE",
                ACTIVE:"TIPO_EMPLEADO_ACTIVO"
            },
            "SAMT_CAT_BANCOS":{
                DATA:[],
                KEYID:"TIPO_BANCO_CSC",
                TEXT:"TTIPO_BANCO_IDIOMA1",
                ACTIVE:"TIPO_BANCO_ACTIVO"
            },
            "SAMT_EMP_TREE_BAJA":{
                DATA:[],
                KEYID:"EMP_TREE_BAJA_CSC",
                TEXT:"EMP_TREE_IDIOMA1",
                ACTIVE:"EMP_TREE_ACTIVO"
            },
            "SAMT_TIPO_CENTRO_COSTOS":{
                DATA:[],
                KEYID:"SAMT_CSC_CENTRO_COSTOS ",
                TEXT:"SAMT_TIPO_CENTRO_IDIOMA1",
                ACTIVE:"SAMT_TIPO_CENTRO_ACTIVO"
            },
            "SAMT_EMPLEADO_TIPO_WS":{
                DATA:[],
                KEYID:"EMPLEADO_WS_CSC",
                TEXT:"EMPLEADO_WS_IDIOMA1",
                ACTIVE:"EMPLEADO_WS_ACTIVO"
            },
            "SAMT_EMPLEADO_TIPO_COMPARTIDO":{
                DATA:[],
                KEYID:"EMPLEADO_COMPARTIDO_CSC",
                TEXT:"EMPLEADO_COMPARTIDO_IDIOMA1",
                ACTIVE:"EMPLEADO_COMPARTIDO_ACTIVO"
            },
            "SAMT_TIPO_DEPARTAMENTO_BC":{
                DATA:[],
                KEYID:"TIPO_DEPTO_BC_CSC",
                TEXT:"TIPO_DEPTO_IDIOMA1",
                ACTIVE:"TIPO_DEPTO_ACTIVO"
            },
            "SAMT_TIPO_EMPRESA_RECLUTA":{
                DATA:[],
                KEYID:"TIPO_EMPRESA_RECLUTA_CSC",
                TEXT:"TIPO_EMPRESA_RECLUTA_IDIOMA1",
                ACTIVE:"TIPO_EMPRESA_RECLUTA_ACTIVO"
            },
            "SAMT_PAISES":{
                DATA:[],
                KEYID:"PAI_CSCPAIS",
                TEXT:"PAI_DESCPAIS",
                ACTIVE:""
            },
            "SAMT_TIPO_EMPLEADO_PERFIL":{
                DATA:[],
                KEYID:"SAMT_CSC_PERFIL",
                TEXT:"SAMT_TIPO_PERFIL_IDIOMA1",
                ACTIVE:"SAMT_TIPO_PERFIL_ACTIVO"
            },
            "SAMT_TIPO_CONTRATO_EMPLEADOS":{
                DATA:[],
                KEYID:"TIPO_CONTRATO_CSCCONTRATO ",
                TEXT:"TIPO_CONTRATO_IDIOMA1",
                ACTIVE:"TIPO_CONTRATO_ACTIVO"
            },
            "SAMT_ESTADOS":{
                DATA:[],
                KEYID:"EDO_CSCESTADO",
                TEXT:"EDO_DESCESTADO",
                ACTIVE:""
            },
            "SAMT_TIPO_FRECUENCIA_PAGOS":{
                DATA:[],
                KEYID:"TIPO_FRECUENCIA_CSC",
                TEXT:"TIPO_FRECUENCIA_IDIOMA1",
                ACTIVE:"TIPO_FRECUENCIA_ACTIVO"
            }
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


    self.Consulta_Reporte_Empleados = function(Object_Query_Parameters){

        __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Reporte_General_Empleados',"GET", Object_Query_Parameters, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(dataRequest){
            if (dataRequest.success == true) {
                $DataGrid_Reporte_Empleados.option("dataSource",dataRequest.JsonData)
                $PivotGrid_Reporte_Empleados.option("dataSource.store",dataRequest.JsonData)
            }
            else{
                $DataGrid_Reporte_Empleados.option("dataSource",[]);
                $PivotGrid_Reporte_Empleados.option("dataSource.store",[])
            }
            loadPanel.hide();
        }).catch(function(err){
            $DataGrid_Reporte_Empleados.option("dataSource",[]);
            $PivotGrid_Reporte_Empleados.option("dataSource.store",[])
            DevExpress.ui.notify({
                message: `Error al consultar intentelo nuevamente`,
                minWidth: 150,
                type: 'error',
                displayTime: 5000
            },{
                position: "bottom center",
                direction: "up-push"
            });
            console.log(err);
            loadPanel.hide();
        });
    }


    self.Calcual_Cantidad_En_Letras = function(cantidad) {
        if (isNaN(cantidad)) return 'No es un número válido';
        if (cantidad < 0 || cantidad >= 1000000000) return 'Número fuera de rango';
    
        const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        const especiales = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
        const miles = ['', 'mil', 'millón', 'mil millones'];
    
        let letraCantidad = '';
    
        if (cantidad === 0) return 'cero';
    
        // Función para convertir números menores a 1000
        function convertirMenorATresCifras(num) {
            let letraNum = '';
            if (num >= 100) {
                letraNum += centenas[Math.floor(num / 100)] + ' ';
                num %= 100;
            }
            if (num >= 20) {
                letraNum += decenas[Math.floor(num / 10)] + ' ';
                num %= 10;
                if (num > 0) letraNum += 'y ';
            } else if (num >= 10) {
                letraNum += especiales[num - 10] + ' ';
                num = 0;
            }
            if (num > 0) {
                letraNum += unidades[num] + ' ';
            }
            return letraNum.trim();
        }
    
        // Dividir la cantidad en grupos de tres dígitos
        const grupos = [];
        while (cantidad > 0) {
            grupos.push(cantidad % 1000);
            cantidad = Math.floor(cantidad / 1000);
        }
    
        // Convertir cada grupo y agregar la unidad correspondiente
        for (let i = 0; i < grupos.length; i++) {
            if (grupos[i] > 0) {
                letraCantidad = convertirMenorATresCifras(grupos[i]) + ' ' + miles[i] + ' ' + letraCantidad;
            }
        }
    
        return letraCantidad.trim();
    }


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