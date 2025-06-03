SalesDashboard.dashboardModel = function() {
    var self = this;
    var obj_DatosEmpleado = null;

    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.6)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: false
    }).dxLoadPanel("instance");

    self.IdEmpleado = null;
    self.TpoUsuario = null;
    self.IdUsuario = null;

    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();

    self.Campanias_Acceso = [];


    self.init = async function() {

        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */
        var originalData = decrypt(localStorage.getItem('DatosEncriptados'));
        self.obj_DatosEmpleado = JSON.parse(originalData);

        self.IdEmpleado = getUrlParam('idemp');
        self.TpoUsuario = getUrlParam('TpoUsuario');
        self.IdUsuario = getUrlParam('idusu');

        await new Promise( (resolve,reject)=>{
            var objRequest = {
                Type:localStorage.getItem('Type'),
                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                EMPLEADO_CSC_EMPLEADO:self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                SERVICIO_ACTIVO:1
            };
            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Cam_Servicios_Empleado',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(dataRequest){
                if (dataRequest.success == true) {
                    self.Campanias_Acceso = dataRequest.JsonData;
                }
                else{
                    self.Campanias_Acceso = [];
                }
                resolve("resolve");
            }).catch(function(err){
                self.Campanias_Acceso = [];
                console.log(err);
                reject(err);
            });

        }).catch(function(err){
            loadPanel.hide();
            console.log(err);
            reject(err);
        });


        $("#__Pop_Camapania_Edit").dxPopup({
            hideOnOutsideClick:false,
            showCloseButton:true,
            title: "Edita Campania",
            height: 240 ,
            width: 550,  
            position: {  
                my: 'center',  
                at: 'center',  
                of: window  
            }, 
            onShowing: function (e) {
            },
            onHiding: function (e){
                $("#__Form_Edita_Campanias").dxForm("instance").option("formData",{});
            },
            contentTemplate: function (e) {
                e.attr({"style": "display: flex; flex-direction: column;"});
                e.append(
                    $("<div />").attr({"id": "__Form_Edita_Campanias","style": "border: solid red 0px; padding: 5px; margin-bottom: 5px;"}).dxForm({
                        readOnly: false,
                        showColonAfterLabel: true,
                        showValidationSummary: false,
                        validationGroup: '__Form_Edita_Campanias_Validate',
                        labelMode: 'static',
                        labelLocation: 'top',
                        width: "100%",
                        colCount:4,
                        items: [{
                            colSpan:4,
                            colCount:4,
                            itemType: 'group',
                            items:[{
                                colSpan: 2,
                                dataField: "CAM_CSC_SERVICIO",
                                editorType: "dxSelectBox",
                                label: { text: "Campaña" },
                                validationRules: [{ type: "required", message: "requerida" }],
                                editorOptions: {
                                    readOnly:true,
                                    valueExpr: "CAM_CSC_SERVICIO",
                                    displayExpr: "CAM_SERVICIO_NOMBRE",
                                    dataSource: new DevExpress.data.DataSource({
                                        loadMode: "raw", paginate: false,   
                                        load: async function () {
                                            try {
                                                var allServicios = {Tbl:"SAMT_CAM_SERVICIO"};
                                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                                                    if (dataInsert.success == true) { return dataInsert.JsonData; } else { console.log(dataInsert.message); }
                                                });
                                            }catch (error) {
                                                console.log(error);
                                            }
                                        }
                                    })
                                }
                            },{
                                colSpan:1,
                                editorType: "dxDateBox",
                                dataField: "SERVICIO_FECHA_INICIO",
                                label: { text: "Fecha Inicio" },
                                editorOptions: {
                                    readOnly:true,
                                    width:'100%',
                                    type: 'date',
                                    placeholder: "DD/MM/AAAA",
                                    useMaskBehavior: true,
                                    displayFormat: "dd/MM/yyyy",
                                    dateSerializationFormat: "yyyy-MM-dd"
                                },
                                validationRules: [{type: 'required',message: 'Requerido'}]
                            },{
                                colSpan:1,
                                editorType: "dxDateBox",
                                dataField: "SERVICIO_FECHA_FIN",
                                label: { text: "Fecha Fin" },
                                editorOptions: {
                                    readOnly:false,
                                    width:'100%',
                                    type: 'date',
                                    placeholder: "DD/MM/AAAA",
                                    useMaskBehavior: true,
                                    displayFormat: "dd/MM/yyyy",
                                    dateSerializationFormat: "yyyy-MM-dd"
                                },
                                validationRules: [{type: 'required',message: 'Requerido'}]
                            }]

                        },{
                            colSpan:4,
                            colCount:4,
                            itemType: 'group',
                            items:[{
                                dataField: "SERVICIO_ACTIVO",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "Activo"
                                }
                            },{
                                dataField: "TEL",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "TEL"
                                }
                            },{
                                dataField: "CHAT",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "CHAT"
                                }
                            },{
                                dataField: "REDES_SOCIALES",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "SOCIAL"
                                }
                            },{
                                dataField: "MAIL",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "MAIL"
                                }
                            },{
                                dataField: "DNA",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "DNA"
                                }
                            },{
                                dataField: "TEL_OUT",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "TEL OUT"
                                }
                            },{
                                dataField: "SMS",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "SMS"
                                }
                            },{
                                dataField: "VIDEO_CONFERENCIA",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "VIDEO"
                                }
                            },{
                                dataField: "NOTIFICACIONES",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "NOTIFICACIONES"
                                }
                            },{
                                dataField: "ACD",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "ACD"
                                }
                            },{
                                dataField: "ACTIVO_BARCONTACT",
                                editorType: "dxCheckBox",
                                label: { 
                                    location: "left",
                                    alignment: "right",
                                    text: "BARCONTACT"
                                }
                            }]
                        },{
                            colSpan:4,
                            colCount:1,
                            itemType: 'group',
                            items:[{
                                itemType: "button",
                                location: 'before',
                                locateInMenu: 'auto',
                                buttonOptions: {
                                    stylingMode: "contained",
                                    type: "default",
                                    width:'100%',
                                    icon: 'fa fa-check',
                                    text: "Guardar",
                                    onInitialized: function(e) {  
                                        $Btn_Guardar_Campania = e.component;
                                    },
                                    onClick: function () {
                                        loadPanel.show();

                                        var New_Data_Campania = $("#__Form_Edita_Campanias").dxForm("instance").option("formData");
                                        var Update_Segment = GetUpdateData(self.Respaldo_Servicio_Edit,New_Data_Campania);

                                        Update_Segment.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                        Update_Segment.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            
                                        var Object_Data_Update ={
                                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                            Type:localStorage.getItem('Type'),
                                            DATA_UPDATE:Update_Segment,
                                            DATA_WHERE:{
                                                EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                SERVICIOS_EMP_UNIQUE:self.Respaldo_Servicio_Edit.SERVICIOS_EMP_UNIQUE,
                                                CAM_CSC_SERVICIO:self.Respaldo_Servicio_Edit.CAM_CSC_SERVICIO,
                                                EMPLEADO_CSC_EMPLEADO:self.Respaldo_Servicio_Edit.EMPLEADO_CSC_EMPLEADO
                                            }
                                        };

                                        __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Cam_Servicio_Empleados','POST',JSON.stringify(Object_Data_Update),getJSON(DeveloperType).ApiRecursosHumanos.token).then(async (DataResponse)=>{
                                            if (DataResponse.success == true) {
                                                $("#__Pop_Camapania_Edit").dxPopup("hide");
                                                $("#dxDataGridCampanias").dxDataGrid("instance").refresh().done(function(){
                                                    loadPanel.hide();
                                                }).fail(function(error) {
                                                    loadPanel.hide();
                                                    console.log(error);
                                                });
                                            }
                                            else{
                                                loadPanel.hide();
                                                DevExpress.ui.notify("NO SE ACTUALIZO INFORMACION VALIDA E INTENTE NUEVAMENTE", "error", 5000);
                                            }
                                        }).catch(function(e){
                                            console.log(e);
                                            loadPanel.hide();
                                            DevExpress.ui.notify("ERROR AL ACTUALIZAR VALIDE LA INFORMACION E INTENTE NUEVAMENTE", "error", 5000); 
                                        });
                                    }
                                }
                            }]
                        }]
                    })
                )

            }
        });

        
        $("#dxTreeMenuCampanias").dxTreeList({
            keyExpr: "ID_ITEM",
            parentIdExpr: 'ID_ITEM_PARENT',
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            autoExpandAll:true,
            selection: {
                mode: 'multiple',
                recursive: true,
            },
            height: '100%',
            columns: [{
                  caption: "Servicio",
                  dataField: "DESCRIPCION_ITEM",
                  alignment: "left"
            }],
            onSelectionChanged:async function(e) {
                loadPanel.show();
                const TreeListSelectedData = e.component.getSelectedRowsData('leavesOnly');
                //const TreeListSelectedKeys = e.component.getSelectedRowKeys("leavesOnly");
                //console.log(TreeListSelectedData);
                //console.log(TreeListSelectedKeys);

                await new Promise( (resolve,reject)=>{
                    var DataGrid_Campanias_Asignada = $("#dxDataGridCampanias").dxDataGrid('instance').option("dataSource").items();
                    console.log(DataGrid_Campanias_Asignada);
                    TreeListSelectedData.forEach(async function(itemList) {
                        var Filter_Servicio = jslinq( DataGrid_Campanias_Asignada ).where(function(el) {
                            return  el.CAM_CSC_SERVICIO == itemList.ID_ITEM ;
                        }).toList();
                        console.log(Filter_Servicio);
                        if(Filter_Servicio.length == 0){
                            console.log("Campania No Existe");
                            await new Promise( (resolve,reject)=>{
                                var _Obj_Insert_Servicio_Empleado = {
                                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                    Type:localStorage.getItem('Type'),
                                    DATA_INSERT:{
                                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                        EMPLEADO_CSC_EMPLEADO:self.IdEmpleado,
                                        CAM_CSC_SERVICIO:itemList.ID_ITEM,
                                        SERVICIOS_EMP_UNIQUE:createUUID(36),
                                        TEL:0,
                                        CHAT:0,
                                        REDES_SOCIALES:0,
                                        MAIL:0,
                                        DNA:0,
                                        TEL_OUT:0,
                                        SMS:0,
                                        VIDEO_CONFERENCIA:0,
                                        NOTIFICACIONES:0,
                                        ACD:0,
                                        ACTIVO_BARCONTACT:0,
                                        SERVICIO_PRINCIPAL:0,
                                        SERVICIO_ACTIVO:1,
                                        SERVICIO_FECHA_INICIO:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD'),
                                        SERVICIO_FECHA_FIN:moment().add(1,'years').tz(self.TimeZoneServidor).format('YYYY-MM-DD'),
                                        AUDITORIA_USU_ALTA:self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                        AUDITORIA_USU_ULT_MOD:self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                                        AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                                        AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                                    }
                                };

                                __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Cam_Servicio_Empleados',"POST", JSON.stringify(_Obj_Insert_Servicio_Empleado), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(DataInsert){
                                    if (DataInsert.success == true){
                                        console.log("Registro Insertado");
                                        resolve("resolve");
                                    }
                                    else{
                                        console.log("Registro no Insertado");
                                        reject("reject")
                                    }
                                }).catch(function(err){
                                    console.log(err);
                                    console.log("Registro no Insertado por error de servidor");
                                    reject(err);
                                });
                            }).catch(function(err){
                                reject(err);
                            });
                        }
                        else{
                            console.log("Campania Existe");
                        }
                    });

                    $("#dxDataGridCampanias").dxDataGrid("instance").refresh().done(function(){
                        loadPanel.hide();
                    }).fail(function(error) {
                        loadPanel.hide();
                        console.log(error);
                    });

                    resolve("resolve");
                });

                

            },
            onInitialized: async function(e){
                loadPanel.show();
                new Promise( (resolve,reject)=>{
                    if(self.TpoUsuario == "ADMIN"){
                        var Function_Request = "Get_Campania_Llega";
                        var DataRequest = {
                            Type:localStorage.getItem('Type'),
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST')
                        };
                    }
                    else{
                        var Function_Request = "Get_Campanias_Tree_Select";
                        var Campanias_Permisos = new Array();
                        self.Campanias_Acceso.map(function(item){
                            Campanias_Permisos.push(item.CAM_CSC_SERVICIO);
                        });
                        if(Campanias_Permisos.length == 0){
                            var String_Campanias = "-1";
                        }
                        else{
                            var String_Campanias = Campanias_Permisos.join(',');
                        }
                        var DataRequest = {
                            Type:localStorage.getItem('Type'),
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            CAM_CSC_SERVICIO_SELECT:String_Campanias
                        };
                    }
                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+ Function_Request ,"GET", DataRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(dataRequest){
                        if (dataRequest.success == true){
                            e.component.option("dataSource",  dataRequest.JsonData);  
                            loadPanel.hide();
                        }
                        else {
                            e.component.option("dataSource",  []);
                            loadPanel.hide();
                        }
                        resolve('resolve');
                    }).catch(function(err){
                        loadPanel.hide();
                        console.log(err);
                        reject(err);
                    });

                }).catch(function(err){
                    loadPanel.hide();
                    console.log(err);
                    reject(err);
                });
            }
        });


        $("#dxDataGridCampanias").dxDataGrid({
            selection: {
                mode: "none"
            },
            height: "100%",
            scrolling: { mode: 'virtual' },       
            hoverStateEnabled: true,
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            columnWidth: 100,
            dataSource: new DevExpress.data.DataSource({
                loadMode:'raw',
                load: async function () {
                    try {
                        var objRequest = {
                            Type:localStorage.getItem('Type'),
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            EMPLEADO_CSC_EMPLEADO:self.IdEmpleado
                        };
                        return __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Cam_Servicios_Empleado',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(dataRequest){
                            if (dataRequest.success == true) {
                                return dataRequest.JsonData;
                            }
                            else{
                                console.log(dataRequest.message );
                                return [];
                            }
                        }); 
                    }
                    catch (error) { console.log(error); }
                }
            }),
            onContentReady:function(e){
                var Campanias_Empleado = e.component.option("dataSource").items();
                var List_Campania = new Array();
                Campanias_Empleado.map(function(Campa){
                    List_Campania.push(Campa.CAM_CSC_SERVICIO);
                });
                console.log([].concat(List_Campania));
                $("#dxTreeMenuCampanias").dxTreeList("instance").option("selectedRowKeys",List_Campania);
            },
            columns: [{
                width: 110,
                fixed: true,
                type: 'buttons',
                buttons: [{
                    text: 'Eliminar',
                    onClick(e) {
                        loadPanel.show();
                        var servItem = e.row.data;
                        var jsonDatDel = {
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            EMP_CSC_EMPRESA_HOST: Number(localStorage.getItem('EMP_CSC_EMPRESA_HOST')),
                            Type:localStorage.getItem('Type'),
                            SERVICIOS_EMP_UNIQUE: servItem.SERVICIOS_EMP_UNIQUE,
                            EMPLEADO_CSC_EMPLEADO: servItem.EMPLEADO_CSC_EMPLEADO,
                            CAM_CSC_SERVICIO: servItem.CAM_CSC_SERVICIO
                        };
                        __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Delete_Cam_Servicio_Empleados','POST',JSON.stringify(jsonDatDel),getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                            if(in_emp.success == true) {
                                $("#dxDataGridCampanias").dxDataGrid("instance").refresh().done(function(){
                                    loadPanel.hide();
                                }).fail(function(error) {
                                    loadPanel.hide();
                                    console.log(error);
                                });

                                DevExpress.ui.notify({message: `Campaña retirado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                          }
                          else {
                          }
                        }).catch(function(e){
                            DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                        });
                    }
                },{
                    text: 'Configurar',
                    onClick(e) {
                        var servItemAuxiliar = Object.assign({},e.row.data);
                        self.Respaldo_Servicio_Edit = Object.assign({},e.row.data);
                        $("#__Pop_Camapania_Edit").dxPopup('show');
                        $("#__Form_Edita_Campanias").dxForm("instance").option("formData",servItemAuxiliar);
                    }
                }]
            },{
                width: 60,
                caption: "Activo",
                dataType:"boolean",
                dataField: "SERVICIO_ACTIVO",
                calculateCellValue(data) {
                    return Boolean(data.SERVICIO_ACTIVO);
                }
            },{
                width: 250,
                caption: "Servicio",
                dataField: "CAM_CSC_SERVICIO",
                alignment: "left",
                lookup: {
                    valueExpr: "CAM_CSC_SERVICIO",
                    displayExpr: "CAM_SERVICIO_NOMBRE",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            loadMode: "raw",
                            paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_CAM_SERVICIO"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
                                        if (dataInsert.success == true) {    
                                            return dataInsert.JsonData;
                                        }
                                        else {
                                            console.log(dataInsert.message);
                                            return [];
                                        }
                                    }); 
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            }
                        })
                    }
                }
            },{
                caption: "Fecha Inicio",
                dataField: "SERVICIO_FECHA_INICIO",
                alignment: "center"
            },{
                caption: "Fecha Fin",
                dataField: "SERVICIO_FECHA_FIN",
                alignment: "center"
            },{
                width: 60,
                caption: "TEL",
                dataType:"boolean",
                dataField: "TEL",
                calculateCellValue(data) {
                    return Boolean(data.TEL);
                }
            },{
                width: 60,
                caption: "CHAT",
                dataType:"boolean",
                dataField: "CHAT",
                calculateCellValue(data) {
                    return Boolean(data.CHAT);
                }
            },{
                width: 150,
                caption: "REDES SOCIALES",
                dataType:"boolean",
                dataField: "REDES_SOCIALES",
                calculateCellValue(data) {
                    return Boolean(data.REDES_SOCIALES);
                }
            },{
                width: 60,
                caption: "MAIL",
                dataType:"boolean",
                dataField: "MAIL",
                calculateCellValue(data) {
                    return Boolean(data.MAIL);
                }
            },{
                width: 60,
                caption: "DNA",
                dataType:"boolean",
                dataField: "DNA",
                calculateCellValue(data) {
                    return Boolean(data.DNA);
                }
            },{
                width: 60,
                caption: "TEL OUT",
                dataType:"boolean",
                dataField: "TEL_OUT",
                calculateCellValue(data) {
                    return Boolean(data.TEL_OUT);
                }
            },{
                width: 60,
                caption: "SMS",
                dataType:"boolean",
                dataField: "SMS",
                calculateCellValue(data) {
                    return Boolean(data.SMS);
                }
            },{
                width: 60,
                caption: "VIDEO",
                dataType:"boolean",
                dataField: "VIDEO_CONFERENCIA",
                calculateCellValue(data) {
                    return Boolean(data.VIDEO_CONFERENCIA);
                }
            },{
                width: 150,
                caption: "NOTIFICACIONES",
                dataType:"boolean",
                dataField: "NOTIFICACIONES",
                calculateCellValue(data) {
                    return Boolean(data.NOTIFICACIONES);
                }
            },{
                width: 60,
                caption: "ACD",
                dataType:"boolean",
                dataField: "ACD",
                calculateCellValue(data) {
                    return Boolean(data.ACD);
                }
            },{
                width: 100,
                caption: "BARCONTACT",
                dataType:"boolean",
                dataField: "ACTIVO_BARCONTACT",
                calculateCellValue(data) {
                    return Boolean(data.ACTIVO_BARCONTACT);
                }
            }]
        });

    }


}


setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);