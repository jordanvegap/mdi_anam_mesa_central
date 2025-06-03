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

    self.Empleado_Permisos_App = null;
    var Email_Invalidos = ['NOTIEN@HOTMAIL.COM','NOTIEN65@GMAIL.COM','NOTIENE@CORREO.COM','NOTIENE@GMAIL.COM','NOTIENE@HOTMAIL.COM','NOTIENE456@GMAIL.COM','NOTIENECORREO@GMAIL.COM','NOTIENECORREO@HOTMAIL.COM','XXX@GMAIL.COM','XXX@HOTMAIL.COM','XXXXXXX@HOTMAIL.COM'];


    self.init = async function() {

        await self.Load_Full_Catalogs();

        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */
        var originalData = decrypt(localStorage.getItem('DatosEncriptados'));
        self.obj_DatosEmpleado = JSON.parse(originalData);

        self.IdEmpleado = getUrlParam('idemp');
        self.TpoUsuario = getUrlParam('TpoUsuario');
        self.IdUsuario = getUrlParam('idusu');


        $("#Pop_Informacion_Hijos").dxPopup({
            width:600,
            height: 300,
            showTitle: true,
            title:"INFORMACION DE HIJOS",
            visible:false,
            dragEnabled: false,
            hideOnOutsideClick: false,
            shadingColor:"#000000bf",
            onHiding: function (e) {
            },
            onShowing: function(e) {

            },
            onShown: function (e) {
                $("#Form_Informacion_Hijos").dxForm("instance").option("formData",{});
                $Btn_Actualizar_Hijos.option("visible",false);
                $Btn_Salvar_Hijos.option("visible",true);                                
                //self.Get_Informacio_Hijos();
            },
            contentTemplate: function (e) {
                e.append(
                    $("<div />").attr({"style":"padding: 5px; height: 100%;"})
                    .append(
                        $("<div />").attr({"id":"Form_Informacion_Hijos","style":"margin-top: 0px;"}).dxForm({
                            showColonAfterLabel: true,
                            showValidationSummary: false,
                            labelMode: 'static',
                            labelLocation: 'top',
                            colCount:2,
                            items: [{
                                colSpan:2,
                                colCount:12,
                                itemType: "group",
                                items:[{
                                    colSpan:4,
                                    dataField: "HIJOS_NOMBRE",
                                    editorType: "dxTextBox",
                                    label: { text: "Nombre Completo" },
                                    editorOptions: {
                                        maxLength: 50,
                                        placeholder: 'Nombre Completo',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique el nombre"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    colSpan:3,
                                    dataField: "TIPO_SEXO_CSC",
                                    editorType: "dxSelectBox",
                                    label: { text: "Sexo" },
                                    editorOptions: {
                                        deferRendering: false,
                                        valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_SEXO").KEYID,
                                        displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_SEXO").TEXT,
                                        dataSource: self.Get_Config_Cat_local("SAMT_TIPO_SEXO").DATA,
                                        onOpened: function(e){
                                            var TIPO_SEXO_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_SEXO").DATA ).where(function(el) {
                                                return el[self.Get_Config_Cat_local("SAMT_TIPO_SEXO").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_SEXO").ACTIVE] == true ;
                                            }).toList(); 
                                            e.component.option('dataSource',TIPO_SEXO_ACTIVO);
                                        },
                                        onClosed: function(e){
                                            e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_SEXO").DATA );
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Campo requerido"
                                    }]
                                },{
                                    colSpan:3,
                                    dataField: "HIJOS_TIPO_EDAD",
                                    editorType: "dxSelectBox",
                                    label: { text: "Tipo Edad" },
                                    editorOptions: {
                                        deferRendering: false,
                                        showClearButton: true,  
                                        searchEnabled: true,
                                        placeholder: 'Tipo Edad',
                                        valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EDAD").KEYID,
                                        displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EDAD").TEXT,
                                        dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EDAD").DATA,
                                        onSelectionChanged:function(e){
                                            console.log(e);
                                            if(e.selectedItem != null){
                                                if(e.selectedItem.EDAD_DESCRIPCION1 == "MES(ES)"){
                                                    $("#Form_Informacion_Hijos").dxForm("instance").getEditor("HIJOS_EDAD").option("max",11);
                                                }
                                                else{
                                                    $("#Form_Informacion_Hijos").dxForm("instance").getEditor("HIJOS_EDAD").option("max",100);
                                                }
                                            }
                                        },
                                        onOpened: function(e){
                                            var HIJOS_TIPO_EDAD_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EDAD").DATA ).where(function(el) {
                                                return el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EDAD").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EDAD").ACTIVE] == true ;
                                            }).toList(); 
                                            e.component.option('dataSource',HIJOS_TIPO_EDAD_ACTIVO);
                                        },
                                        onClosed: function(e){
                                            e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EDAD").DATA );
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Campo requerido"
                                    }]
                                },{
                                    colSpan:2,
                                    dataField: "HIJOS_EDAD",
                                    editorType: "dxNumberBox",
                                    label: { text:"Edad" },
                                    editorOptions: {
                                        max:100,
                                        min:0,
                                        value:null
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Requerido"
                                    }]
                                }]
                            },{
                                itemType: "group",
                                colCount:6,
                                items:[{
                                    colSpan:6,
                                    itemType: "button",
                                    buttonOptions: {
                                        width: "100%",
                                        height:20,
                                        type: "success",
                                        text: "GUARDAR",
                                        icon: 'fa fa-check',
                                        onInitialized: function(e) {  
                                            $Btn_Salvar_Hijos = e.component;
                                        },
                                        onClick: function () {
                                            if( $("#Form_Informacion_Hijos").dxForm("instance").validate().isValid){
                                                loadPanel.show();
                                                var Data_Hijo = $("#Form_Informacion_Hijos").dxForm("instance").option("formData");
                                                Data_Hijo.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                                                Data_Hijo.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                Data_Hijo.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                Data_Hijo.AUDITORIA_FEC_ALTA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                Data_Hijo.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                Data_Hijo.EMPLEADO_CSC_EMPLEADO = self.IdEmpleado;

                                                var Data_Insert_Hijo = {
                                                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                                    Type:localStorage.getItem('Type'),
                                                    DATA_INSERT:Data_Hijo
                                                };

                                                __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Hijo', "POST", JSON.stringify(Data_Insert_Hijo), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                    console.log(result)
                                                    if(result.success === true){
                                                        $("#Form_Informacion_Hijos").dxForm("instance").option("formData",{});
                                                        DevExpress.ui.notify( 'INFORMACIÓN INSERTADA CORRECTAMENTE', 'success', 3000);
                                                        $("#Grid_Informacion_Hijos").dxDataGrid("instance").refresh().done(function(){
                                                            loadPanel.hide();
                                                        }).fail(function(error) {
                                                            loadPanel.hide();
                                                            console.log(error);
                                                        });
                                                    }
                                                    else{
                                                        DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                        $("#Grid_Informacion_Hijos").dxDataGrid("instance").refresh().done(function(){
                                                            loadPanel.hide();
                                                        }).fail(function(error) {
                                                            loadPanel.hide();
                                                            console.log(error);
                                                        });
                                                    }
                                                });
                                            }
                                            else{
                                                DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                            }
                                        }
                                    }
                                },{
                                    colSpan:6,
                                    itemType: "button",
                                    buttonOptions: {
                                        visible:false,
                                        width: "100%",
                                        height:20,
                                        type: "default",
                                        text: "ACTUALIZAR",
                                        icon: 'fa fa-floppy-o',
                                        onInitialized: function(e) {  
                                            $Btn_Actualizar_Hijos = e.component;
                                        },
                                        elementAttr:{
                                            class:"btn_down"
                                        },
                                        onClick: function () {
                                            if( $("#Form_Informacion_Hijos").dxForm("instance").validate().isValid){
                                                loadPanel.show();
                                                var Data_To_Update = __Get_Update_Difent_Data(self.Respaldo_Info_Hijo,$("#Form_Informacion_Hijos").dxForm("instance").option("formData"));
                                                Data_To_Update.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                Data_To_Update.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                
                                                var Data_Update_Hijo = {
                                                    EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                                    Type:localStorage.getItem('Type'),
                                                    DATA_UPDATE:Data_To_Update,
                                                    DATA_WHERE:{
                                                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                        EMPLEADO_CSC_EMPLEADO:EMPLEADO_CSC_EMPLEADO,
                                                        EMPLEADO_HIJOS_CSC: self.Respaldo_Info_Hijo.EMPLEADO_HIJOS_CSC
                                                    }
                                                };

                                                __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado_Hijo', "POST", JSON.stringify(Data_Update_Hijo), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                    console.log(result)
                                                    if(result.success === true){
                                                        loadPanel.hide();
                                                        $("#Form_Informacion_Hijos").dxForm("instance").option("formData",{});
                                                        $Btn_Actualizar_Hijos.option("visible",false);
                                                        $Btn_Salvar_Hijos.option("visible",true);           
                                                        self.Get_Informacio_Hijos();
                                                        DevExpress.ui.notify( 'INFORMACIÓN ACTUALIZADA CORRECTAMENTE', 'success', 3000);
                                                    }
                                                    else{
                                                        loadPanel.hide();
                                                        DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                    }
                                                });
                                            }
                                            else{
                                                DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                            }
                                        }
                                    }
                                }]
                            },{
                                itemType: "group",
                                colCount:6,
                                items:[{
                                    colSpan:6,
                                    itemType: "button",
                                    buttonOptions: {
                                        width: "100%",
                                        height:20,
                                        type: "danger",
                                        text: "CANCELAR",
                                        icon: 'fa fa-trash-o',
                                        onClick: function () {
                                            $("#Form_Informacion_Hijos").dxForm("instance").option("formData",{});
                                            $Btn_Actualizar_Hijos.option("visible",false);
                                            $Btn_Salvar_Hijos.option("visible",true); 
                                        }
                                    }
                                }]
                            }]
                        }),

                        $("<div />").attr({"id":"Grid_Informacion_Hijos","style":"margin-top: 0px;"}).dxDataGrid({
                            height: 150,
                            width:'100%',
                            allowColumnResizing: true,
                            columnResizingMode: "widget",
                            remoteOperations: { groupPaging: true },
                            grouping: { autoExpandAll: false },
                            groupPanel: { visible: false },
                            wordWrapEnabled: true,
                            showBorders: true,
                            headerFilter: { visible: true },
                            scrolling: { mode: 'virtual' },
                            filterRow: { visible: false },
                            pager: { showPageSizeSelector: false }, 
                            searchPanel: { visible: false },
                            selection: { mode: "single" },
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
                                        return __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Empleado_Hijos',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(dataRequest){
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
                            
                            columns: [{
                                width: 130,
                                caption: "ACCIONES",
                                encodeHtml:false,
                                cellTemplate(container, options) {
                                    container.append(
                                        $('<div>').dxButton({
                                            height:20,
                                            icon: 'fa fa-pencil',
                                            type: 'default',
                                            text: 'Modificar',
                                            onClick(){
                                                console.log(container);
                                                console.log(options.data);
                                                $Btn_Actualizar_Hijos.option("visible",true);
                                                $Btn_Salvar_Hijos.option("visible",false);
                                                self.Respaldo_Info_Hijo = Object.assign({},options.data);
                                                $("#Form_Informacion_Hijos").dxForm("instance").option("formData",options.data);
                                            }
                                        })
                                    )
                                }
                            },{
                                width: 250,
                                caption: "NOMBRE", 
                                dataField: "HIJOS_NOMBRE"
                            },{
                                width: 120,
                                caption: "SEXO", 
                                dataField: "TIPO_SEXO_CSC",
                                lookup: {
                                    displayExpr:"TIPO_SEXO_IDIOMA1",
                                    valueExpr:"TIPO_SEXO_CSC",
                                    dataSource: JSON.parse( localStorage.getItem('obj_CatTipoSexo') )
                                }
                            },{
                                width: 100,
                                caption: "EDAD", 
                                dataField: "HIJOS_EDAD"
                            },{
                                width: 120,
                                caption: "TIPO EDAD", 
                                dataField: "HIJOS_TIPO_EDAD",
                                lookup: {
                                    valueExpr:"HIJOS_TIPO_EDAD",
                                    displayExpr: "EDAD_DESCRIPCION1",
                                    dataSource: JSON.parse( localStorage.getItem('obj_CatTipoEdad') ),
                                }
                            }]
                        })
                    )
                )
            }
        });


        $("#Pop_Referencias_Familiares").dxPopup({
            width:350,
            height: 270,
            showTitle: true,
            title:"REFERENCIAS FAMILIARES",
            visible:false,
            dragEnabled: false,
            hideOnOutsideClick: false,
            shadingColor:"#000000bf",
            onHiding: function (e) {
                $("#Form_Referecias_Familiares").dxForm("instance").option("formData",{});
            },
            onShowing: function(e) {
            },
            onShown: function (e) {
            },
            contentTemplate: function (e) {
                e.append(
                    $("<div />").attr({"style":"padding: 0px; height: 100%;"})
                    .append(
                        $("<div />").attr({"style":"padding: 10px 10px; height: 100%; border-radius: 5px;"})
                        .append(
                            $("<div />").attr({"id":"Form_Referecias_Familiares","style":"margin-top: 0px;"}).dxForm({
                                showColonAfterLabel: true,
                                showValidationSummary: false,
                                labelMode: 'static',
                                labelLocation: 'top',
                                items: [{
                                    dataField: "TIPO_EMPLEADO_REFERENCIA_CSC",
                                    editorType: "dxSelectBox",
                                    label: { text: "Parentesco" },
                                    editorOptions: {
                                        showClearButton: true,
                                        deferRendering: false,
                                        placeholder: 'Parentesco',
                                        valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").KEYID,
                                        displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").TEXT,
                                        dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA,
                                        onOpened: function(e){
                                            var TIPO_EMPLEADO_REFERENCIA_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA ).where(function(el) {
                                                return  (el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").ACTIVE] == true ) 
                                                && el.TIPO_EMPLEADO_REFERENCIA_CLAVE == "FAM";
                                            }).toList(); 
                                            e.component.option('dataSource',TIPO_EMPLEADO_REFERENCIA_ACTIVO);
                                        },
                                        onClosed: function(e){
                                            e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA );
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Campo requerido"
                                    }]
                                },{
                                    dataField: "EMPLEADO_REFERENCIA_NOMBRE",
                                    editorType: "dxTextBox",
                                    label: { text: "Nombre Completo" },
                                    editorOptions: {
                                        maxLength: 250,
                                        placeholder: 'Nombre Completo',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique el nombre"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EMPLEADO_DIRECCION",
                                    editorType: "dxTextBox",
                                    label: { text: "Dirección" },
                                    editorOptions: {
                                        maxLength: 1500,
                                        placeholder: 'Dirección',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique la dirección"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ-'#&()+@ ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EMPLEADO_REFERENCIA_OCUAPCION",
                                    editorType: "dxTextBox",
                                    label: { text: "Ocupación" },
                                    editorOptions: {
                                        maxLength: 250,
                                        placeholder: 'Ocupación',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique la ocupación"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ-'#&()+@ ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    itemType: "group",
                                    items: [{
                                        itemType: "button",
                                        buttonOptions: {
                                            width: "100%",
                                            type: "success",
                                            text: "GUARDAR",
                                            icon: 'fa fa-check',
                                            onInitialized: function(e) {  
                                                $Btn_Agregar_Ref_Fam = e.component;
                                            },
                                            onClick: function () {
                                                if( $("#Form_Referecias_Familiares").dxForm("instance").validate().isValid){
                                                    loadPanel.show();
                                                    var Data_Referencia = $("#Form_Referecias_Familiares").dxForm("instance").option("formData");
                                                    Data_Referencia.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                                                    Data_Referencia.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_Referencia.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_Referencia.AUDITORIA_FEC_ALTA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                    Data_Referencia.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                    Data_Referencia.EMPLEADO_CSC_EMPLEADO = self.IdEmpleado ;

                                                    var Data_Referencia_Insert = {
                                                        EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                                                        Type:localStorage.getItem('Type'),
                                                        DATA_INSERT:Data_Referencia
                                                    };
                                                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Referencia', "POST", JSON.stringify(Data_Referencia_Insert), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                        console.log(result)
                                                        if(result.success === true){
                                                            DevExpress.ui.notify( 'REFERENCIA INSERTADA CORRECTAMENTE', 'success', 3000);
                                                            $("#Pop_Referencias_Familiares").dxPopup("hide");
                                                            $("#__DataGrid_Referencias_Familiares").dxDataGrid("instance").refresh().done(function(){
                                                                loadPanel.hide();
                                                            }).fail(function(error) {
                                                                loadPanel.hide();
                                                                console.log(error);
                                                            });
                                                        }
                                                        else{
                                                            DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                            loadPanel.hide();
                                                        }
            
                                                    }).catch(function(error){
                                                        console.log(error);
                                                        loadPanel.hide();
                                                        DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                    })
                                                }
                                                else{
                                                    DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                                }
                                                
                                            }
                                        }
                                    },{
                                        itemType: "button",
                                        buttonOptions: {
                                            visible:false,
                                            width: "100%",
                                            type: "default",
                                            text: "ACTUALIZAR",
                                            icon: 'fa fa-floppy-o',
                                            onInitialized: function(e) {  
                                                $Btn_Actualizar_Ref_Fam = e.component;
                                            },
                                            elementAttr:{
                                                class:"btn_down"
                                            },
                                            onClick: function () {
                                                if( $("#Form_Referecias_Familiares").dxForm("instance").validate().isValid){
                                                    loadPanel.show();
                                                    var Data_Referencia = $("#Form_Referecias_Familiares").dxForm("instance").option("formData");
                                                    
                                                    var Data_To_Update = GetUpdateData(self.Respaldo_Referencia_Familiar,Data_Referencia);
                                                    Data_To_Update.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_To_Update.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

                                                    var Data_Referencia_Update= {
                                                        EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                                                        Type:localStorage.getItem('Type'),
                                                        DATA_UPDATE:Data_To_Update,
                                                        DATA_WHERE:{
                                                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                            EMPLEADO_REFERENCIA_CSC:self.Respaldo_Referencia_Familiar.EMPLEADO_REFERENCIA_CSC
                                                        }
                                                    };
                                                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado_Referencia', "POST", JSON.stringify(Data_Referencia_Update), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                        if(result.success === true){
                                                            DevExpress.ui.notify( 'REFERENCIA ACTUALIZADA CORRECTAMENTE', 'success', 3000);
                                                            $("#Pop_Referencias_Familiares").dxPopup("hide");
                                                            $("#__DataGrid_Referencias_Familiares").dxDataGrid("instance").refresh().done(function(){
                                                                loadPanel.hide();
                                                            }).fail(function(error) {
                                                                loadPanel.hide();
                                                                console.log(error);
                                                            });
                                                        }
                                                        else{
                                                            DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                            loadPanel.hide();
                                                        }
                                                    });
                                                }
                                                else{
                                                    DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                                }
                                            }
                                        }
                                    }]
                                }]
                            })
                        )
                        
                    )
                )
            }
        });


        $("#Pop_Referencias_Personales").dxPopup({
            width:350,
            height: 320,
            showTitle: true,
            title:"REFERENCIAS PERSONALES",
            visible:false,
            dragEnabled: false,
            hideOnOutsideClick: false,
            shadingColor:"#000000bf",
            onHiding: function (e) {
                $("#Form_Referecias_Personales").dxForm("instance").option("formData",{});
            },
            onShowing: function(e) {
            },
            onShown: function (e) {
            },
            contentTemplate: function (e) {
                e.append(
                    $("<div />").attr({"style":"padding: 0px; height: 100%;"})
                    .append(
                        $("<div />").attr({"style":"padding: 10px 10px; height: 100%; border-radius: 5px;"})
                        .append(
                            $("<div />").attr({"id":"Form_Referecias_Personales","style":"margin-top: 0px;"}).dxForm({
                                showColonAfterLabel: true,
                                showValidationSummary: false,
                                labelMode: 'static',
                                labelLocation: 'top',
                                items: [{
                                    dataField: "TIPO_EMPLEADO_REFERENCIA_CSC",
                                    editorType: "dxSelectBox",
                                    label: {text: "Tipo de Refererencia" },
                                    editorOptions: {
                                        showClearButton: true,
                                        deferRendering: false,
                                        placeholder: 'Tipo de Refererencia',
                                        valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").KEYID,
                                        displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").TEXT,
                                        dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA,
                                        onOpened: function(e){
                                            var TIPO_EMPLEADO_REFERENCIA_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA ).where(function(el) {
                                                return  (el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").ACTIVE] == true ) 
                                                && el.TIPO_EMPLEADO_REFERENCIA_CLAVE == "REF";
                                            }).toList(); 
                                            e.component.option('dataSource',TIPO_EMPLEADO_REFERENCIA_ACTIVO);
                                        },
                                        onClosed: function(e){
                                            e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA );
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Campo requerido"
                                    }]
                                },{
                                    colSpan:2,
                                    dataField: "EMPLEADO_REFERENCIA_NOMBRE",
                                    editorType: "dxTextBox",
                                    label: { text: "Nombre Completo" },
                                    editorOptions: {
                                        maxLength: 250,
                                        placeholder: 'Nombre',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique el nombre"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EMPLEADO_REFERENCIA_OCUAPCION",
                                    editorType: "dxTextBox",
                                    label: { text: "Ocupación " },
                                    editorOptions: {
                                        maxLength: 250,
                                        placeholder: 'Ocupación ',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique la ocupación"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ-'#&()+@ ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EMPLEADO_REFERENCIA_EMPRESA",
                                    editorType: "dxTextBox",
                                    label: { text: "Empresa" },
                                    editorOptions: {
                                        maxLength: 250,
                                        placeholder: 'Empresa',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "pattern",
                                        pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ-'#&()+@ ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EMPLEADO_REFERENCIA_TELEFONO",
                                    editorType: "dxTextBox",
                                    label: { text: "Teléfono" },
                                    editorOptions: {
                                        mask: "000-000-0000",
                                        valueChangeEvent: "keyup"
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Télefono requerido"
                                    }]
                                },{
                                    itemType: "group",
                                    items: [{
                                        itemType: "button",
                                        buttonOptions: {
                                            width: "100%",
                                            type: "success",
                                            text: "GUARDAR",
                                            icon: 'fa fa-check',
                                            onInitialized: function(e) {  
                                                $Btn_Agregar_Ref_Per = e.component;
                                            },
                                            onClick: function () {
                                                if( $("#Form_Referecias_Personales").dxForm("instance").validate().isValid){
                                                    loadPanel.show();
                                                    var Data_Referencia = $("#Form_Referecias_Personales").dxForm("instance").option("formData");
                                                    Data_Referencia.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                                                    Data_Referencia.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_Referencia.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_Referencia.AUDITORIA_FEC_ALTA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                    Data_Referencia.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                    Data_Referencia.EMPLEADO_CSC_EMPLEADO = self.IdEmpleado ;

                                                    var Data_Referencia_Insert = {
                                                        EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                                                        Type:localStorage.getItem('Type'),
                                                        DATA_INSERT:Data_Referencia
                                                    }
                                                    
                                                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Referencia', "POST", JSON.stringify(Data_Referencia_Insert), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                        console.log(result)
                                                        if(result.success === true){
                                                            DevExpress.ui.notify( 'REFERENCIA INSERTADA CORRECTAMENTE', 'success', 3000);
                                                            $("#Pop_Referencias_Personales").dxPopup("hide");
                                                            $("#__DataGrid_Referencias_Personales").dxDataGrid("instance").refresh().done(function(){
                                                                loadPanel.hide();
                                                            }).fail(function(error) {
                                                                loadPanel.hide();
                                                                console.log(error);
                                                            });
                                                        }
                                                        else{
                                                            DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                            loadPanel.hide();
                                                        }
            
                                                    }).catch(function(error){
                                                        console.log(error);
                                                        loadPanel.hide();
                                                        DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                    })
                                                }
                                                else{
                                                    DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                                }
                                                
                                            }
                                        }
                                    },{
                                        itemType: "button",
                                        buttonOptions: {
                                            visible:false,
                                            width: "100%",
                                            type: "default",
                                            text: "ACTUALIZAR",
                                            icon: 'fa fa-floppy-o',
                                            onInitialized: function(e) {  
                                                $Btn_Actualizar_Ref_Per = e.component;
                                            },
                                            elementAttr:{
                                                class:"btn_down"
                                            },
                                            onClick: function () {
                                                if( $("#Form_Referecias_Personales").dxForm("instance").validate().isValid){
                                                    loadPanel.show();
                                                    var Data_Referencia = $("#Form_Referecias_Personales").dxForm("instance").option("formData");
                                                    
                                                    var Data_To_Update = GetUpdateData(self.Respaldo_Referencia_Personal,Data_Referencia);
                                                    Data_To_Update.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_To_Update.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

                                                    var Data_Referencia_Update= {
                                                        EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                                                        Type:localStorage.getItem('Type'),
                                                        DATA_UPDATE:Data_To_Update,
                                                        DATA_WHERE:{
                                                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                            EMPLEADO_REFERENCIA_CSC:self.Respaldo_Referencia_Personal.EMPLEADO_REFERENCIA_CSC
                                                        }
                                                    };
                                                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado_Referencia', "POST", JSON.stringify(Data_Referencia_Update), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                        if(result.success === true){
                                                            DevExpress.ui.notify( 'REFERENCIA ACTUALIZADA CORRECTAMENTE', 'success', 3000);
                                                            $("#Pop_Referencias_Personales").dxPopup("hide");
                                                            $("#__DataGrid_Referencias_Personales").dxDataGrid("instance").refresh().done(function(){
                                                                loadPanel.hide();
                                                            }).fail(function(error) {
                                                                loadPanel.hide();
                                                                console.log(error);
                                                            });
                                                        }
                                                        else{
                                                            DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                            loadPanel.hide();
                                                        }
                                                    });
                                                }
                                                else{
                                                    DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                                }
                                            }
                                        }
                                    }]
                                }]
                            })
                        )
                        
                    )
                )
            }
        });


        $("#Pop_Experiencias_Laborales").dxPopup({
            width:600,
            height: 350,
            showTitle: true,
            title:"EXPERIENCIAS LABORALES",
            visible:false,
            dragEnabled: false,
            hideOnOutsideClick: false,
            shadingColor:"#000000bf",
            onHiding: function (e) {
                $("#Form_Experiencias_Laborales").dxForm("instance").option("formData",{});
            },
            onShowing: function(e) {
            },
            onShown: function (e) {
            },
            contentTemplate: function (e) {
                e.append(
                    $("<div />").attr({"style":"padding: 0px; height: 100%;"})
                    .append(
                        $("<div />").attr({"style":"padding: 10px 10px; height: 100%; border-radius: 5px;"})
                        .append(
                            $("<div />").attr({"id":"Form_Experiencias_Laborales","style":"margin-top: 0px;"}).dxForm({
                                showColonAfterLabel: true,
                                showValidationSummary: false,
                                labelMode: 'static',
                                labelLocation: 'top',
                                colCount:2,
                                items: [{ 
                                    dataField: "TIPO_EMPLEADO_EXPERIENCIA_CSC",
                                    editorType: "dxSelectBox",
                                    label: { text: "Tipo de Experiencia" },
                                    editorOptions: {
                                        deferRendering: false,
                                        showClearButton: true,
                                        placeholder: 'Tipo de Experiencia',
                                        valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").KEYID,
                                        displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").TEXT,
                                        dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").DATA,
                                        onSelectionChanged:function(e){
                                            if(e.selectedItem != null){
                                                switch(e.selectedItem.TIPO_EXPERIENCIA_CLAVE){
                                                    case "ACT":
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("disabled", false);
                                                    break;

                                                    case "ACTUAL":
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("disabled", false);
                                                    break;
            
                                                    case "ANT":
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("disabled", false);
                                                    break;


                                                    case "ANTERIOR":
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("disabled", false);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("disabled", false);
                                                    break;
            
                                                    case "SIN":
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("disabled", true);

                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("value", null);
                                                    break;

                                                    case "SINE":
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("disabled", true);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("disabled", true);

                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_ACTIVIDADES").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_EMPRESA").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_GIRO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_INICIAL").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SUELDO_FINAL").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_JEFE_INMEDIATO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_TELEFONO").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_CAUSA_SEPARACION").option("value", null);
                                                        $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_SOLICITA_REFERENCIA").option("value", null);
                                                    break;
                                                }
                                            }
                                        },
                                        onOpened: function(e){
                                            var TIPO_EMPLEADO_EXPERIENCIA_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").DATA ).where(function(el) {
                                                return el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").ACTIVE] == true ;
                                            }).toList(); 
                                            e.component.option('dataSource',TIPO_EMPLEADO_EXPERIENCIA_ACTIVO);
                                        },
                                        onClosed: function(e){
                                            e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").DATA );
                                        }

                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Campo requerido"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_ACTIVIDADES",
                                    editorType: "dxTextBox",
                                    label: { text: "Puesto desempeñado" },
                                    editorOptions: {
                                        maxLength: 500,
                                        placeholder: 'Puesto desempeñado',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique el Puesto desempeñado"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ-'#&()+@ ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_EMPRESA",
                                    editorType: "dxTextBox",
                                    label: { text: "Empresa" },
                                    editorOptions: {
                                        maxLength: 500,
                                        placeholder: 'Empresa',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique la empresa"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ-'#&()+@ ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_GIRO",
                                    editorType: "dxTextBox",
                                    label: { text: "Giro" },
                                    editorOptions: {
                                        maxLength: 500,
                                        placeholder: 'Giro',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique el giro"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ-'#&()+@ ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_SUELDO_INICIAL",
                                    editorType: "dxNumberBox",
                                    label: { text: "Sueldo Inicial" },
                                    editorOptions: {
                                        valueChangeEvent: "keyup",
                                        placeholder: 'Sueldo Inicial',
                                        format: "$ #,##0.##",
                                        min:0,
                                        value:"",
                                        onValueChanged: function (e) {
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Campo requerido"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_SUELDO_FINAL",
                                    editorType: "dxNumberBox",
                                    label: { text: "Sueldo Final" },
                                    editorOptions: {
                                        valueChangeEvent: "keyup",
                                        placeholder: 'Sueldo Final',
                                        format: "$ #,##0.##",
                                        min:0,
                                        value:"",
                                        onValueChanged: function (e) {
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Campo requerido"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_FECHA_INGRESO",
                                    editorType: "dxDateBox",
                                    label: { text: "Fecha Ingreso"},
                                    editorOptions: {
                                        type: "date",
                                        showClearButton: true,
                                        useMaskBehavior: true,
                                        placeholder: "DD-MM-AAAA",
                                        displayFormat: "dd-MM-yyyy",
                                        dateSerializationFormat: "yyyy-MM-dd",
                                        max:new Date(),
                                        onValueChanged: function (e) {
                                            console.log(e);
                                            if(e.value != null){
                                                $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_SALIDA").option("min", e.value);
                                            }
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique la fecha"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_FECHA_SALIDA",
                                    editorType: "dxDateBox",
                                    label: { 
                                        text: "Fecha Salida"
                                    },
                                    editorOptions: {
                                        type: "date",
                                        showClearButton: true,
                                        useMaskBehavior: true,
                                        placeholder: "DD-MM-AAAA",
                                        displayFormat: "dd-MM-yyyy",
                                        dateSerializationFormat: "yyyy-MM-dd",
                                        max:new Date(),
                                        onValueChanged: function (e) {
                                            if(e.value != null){
                                                $("#Form_Experiencias_Laborales").dxForm("instance").getEditor("EXPERIENCIA_FECHA_INGRESO").option("max", e.value);
                                            }
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique la fecha"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_JEFE_INMEDIATO",
                                    editorType: "dxTextBox",
                                    label: { text: "Jefe Inmediato" },
                                    editorOptions: {
                                        maxLength: 500,
                                        placeholder: 'Jefe Inmediato',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique el Jefe Inmediato"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_TELEFONO",
                                    editorType: "dxTextBox",
                                    label: { text: "Teléfono de Jefe/Empresa" },
                                    editorOptions: {
                                        mask: "000-000-0000",
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Télefono requerido"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_CAUSA_SEPARACION",
                                    editorType: "dxTextBox",
                                    label: { text: "Motivo Separacion" },
                                    editorOptions: {
                                        maxLength: 500,
                                        placeholder: 'Motivo Separacion',
                                        valueChangeEvent: "keyup",
                                        onValueChanged: function (e) {
                                            if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                        }
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique motivo"
                                    },{
                                        type: "pattern",
                                        pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ-' ]*$/,
                                        message: "Sintaxis incorrecta verifique el valor"
                                    }]
                                },{
                                    dataField: "EXPERIENCIA_SOLICITA_REFERENCIA",
                                    colSpan:1,
                                    editorType: "dxRadioGroup",
                                    label: { text:"Autorizo a solicitar referencias" },
                                    editorOptions: {
                                        displayExpr:"text",
                                        valueExpr:"id",
                                        layout: "horizontal",
                                        dataSource: [ {id:1,text:"SÍ"}, {id:0,text:"NO"} ]
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Este campo es requerido"
                                    }]
                                },{
                                    itemType: "group",
                                    items: [{
                                        itemType: "button",
                                        buttonOptions: {
                                            width: "100%",
                                            type: "success",
                                            text: "GUARDAR",
                                            icon: 'fa fa-check',
                                            onInitialized: function(e) {  
                                                $Btn_Agregar_Experiencia_Labora = e.component;
                                            },
                                            onClick: function () {
                                                if( $("#Form_Experiencias_Laborales").dxForm("instance").validate().isValid){
                                                    loadPanel.show();
                                                    var Data_Experiencia = $("#Form_Experiencias_Laborales").dxForm("instance").option("formData");
                                                    Data_Experiencia.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                                                    Data_Experiencia.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_Experiencia.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_Experiencia.AUDITORIA_FEC_ALTA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                    Data_Experiencia.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                                                    Data_Experiencia.EMPLEADO_CSC_EMPLEADO = self.IdEmpleado ;

                                                    var Data_Experiencia_Insert = {
                                                        EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                                                        Type:localStorage.getItem('Type'),
                                                        DATA_INSERT:Data_Experiencia
                                                    }
                                                    
                                                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Experiencia_Laboral', "POST", JSON.stringify(Data_Experiencia_Insert), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                        console.log(result)
                                                        if(result.success === true){
                                                            DevExpress.ui.notify( 'EXPERIENCIA INSERTADA CORRECTAMENTE', 'success', 3000);
                                                            $("#Pop_Experiencias_Laborales").dxPopup("hide");
                                                            $("#__DataGrid_Experiencia_Laboral").dxDataGrid("instance").refresh().done(function(){
                                                                loadPanel.hide();
                                                            }).fail(function(error) {
                                                                loadPanel.hide();
                                                                console.log(error);
                                                            });
                                                        }
                                                        else{
                                                            DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                            loadPanel.hide();
                                                        }
                                                    }).catch(function(error){
                                                        console.log(error);
                                                        loadPanel.hide();
                                                        DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                    })
                                                }
                                                else{
                                                    DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                                }
                                            }
                                        }
                                    },{
                                        itemType: "button",
                                        buttonOptions: {
                                            visible:false,
                                            width: "100%",
                                            type: "default",
                                            text: "ACTUALIZAR",
                                            icon: 'fa fa-floppy-o',
                                            onInitialized: function(e) {  
                                                $Btn_Actualizar_Experiencia_Labora = e.component;
                                            },
                                            elementAttr:{
                                                class:"btn_down"
                                            },
                                            onClick: function () {
                                                if( $("#Form_Experiencias_Laborales").dxForm("instance").validate().isValid){
                                                    loadPanel.show();
                                                    var Data_Experincia = $("#Form_Experiencias_Laborales").dxForm("instance").option("formData");
                                                    
                                                    var Data_To_Update = GetUpdateData(self.Respaldo_Experiencia_Laboral,Data_Experincia);
                                                    Data_To_Update.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                                    Data_To_Update.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

                                                    var Data_Experiencia_Update= {
                                                        EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                                                        Type:localStorage.getItem('Type'),
                                                        DATA_UPDATE:Data_To_Update,
                                                        DATA_WHERE:{
                                                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                            EMPLEADO_EXPERIENCIA_CSC:self.Respaldo_Experiencia_Laboral.EMPLEADO_EXPERIENCIA_CSC
                                                        }
                                                    };
                                                    __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado_Experiencia_Laboral', "POST", JSON.stringify(Data_Experiencia_Update), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                                        if(result.success === true){
                                                            DevExpress.ui.notify( 'EXPERIENCIA ACTUALIZADA CORRECTAMENTE', 'success', 3000);
                                                            $("#Pop_Experiencias_Laborales").dxPopup("hide");
                                                            $("#__DataGrid_Experiencia_Laboral").dxDataGrid("instance").refresh().done(function(){
                                                                loadPanel.hide();
                                                            }).fail(function(error) {
                                                                loadPanel.hide();
                                                                console.log(error);
                                                            });
                                                        }
                                                        else{
                                                            DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL Y VUELVA A INTENTAR', 'error', 3000);
                                                            loadPanel.hide();
                                                        }
                                                    });
                                                }
                                                else{
                                                    DevExpress.ui.notify( 'VALIDE LA INFORMACION DEL FORMULARIO', 'error', 3000);
                                                }
                                            }
                                        }
                                    }]
                                }]
                            })
                        )
                    )
                )
            }
        });


        $("#__TabPanel_Empleado_Solicitud").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            showNavButtons: true,
            itemTitleTemplate: function(itemData, itemIndex, itemElement) {
                itemElement
                .append($('<img src="'+itemData.icon+'" class="tabicon" alt="Icon"/>'))
                .append($('<span style="font-size: 12px;">').text(itemData.title));
            } ,
            height: '100%',
            elementAttr: {"id": "tab-solicitud"},
            dataSource: [
                { title: "Solicitud", template: "tab_solicitud", icon:"Icons/Card_Bank.png" },
                { title: "Familiares", template: "tab_familiares", icon:"Icons/user-group-icon.png"},
                { title: "Referencias", template: "tab_referencias", icon:"Icons/user-group-icon.png"},
                { title: "Experiencia Laboral", template: "tab_experiencia_laboral", icon:"Icons/maletin.png"}
            ],
            onContentReady(e) {  
                setTimeout(() => {  
                    var widthOfOneTab = 100 / e.component.option("items").length;  
                },3000);  
            }
        });
        

        $('#__ToolBar_Acciones_Empleado_Solicitud').dxToolbar({
            items:[{
                location: "before",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    visible:false,
                    height:20,
                    text: "Alta",
                    icon: 'Icons/add.png',
                    onInitialized: function(e) {  
                        $Boton_Alta_Empleado_Solicitud = e.component;
                    },
                    onClick() {
                        $Boton_Alta_Empleado_Solicitud.option("disabled",true);
                        $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",false);
                        $Boton_Cancel_Empleado_Solicitud.option("visible",true);
                        $Boton_Cancel_Empleado_Solicitud.option("disabled",false);
                        $__Form_Empleado_Solicitud.option("formData",{});
                        $__Form_Empleado_Solicitud.option("readOnly",false);
                    }
                }
            },{
                location: "before",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    visible:false,
                    height:20,
                    text: "Modificar",
                    icon: 'Icons/refresh.png',
                    onInitialized: function(e) {  
                        $Boton_Modificar_Empleado_Solicitud = e.component;
                    },
                    onClick() {
                        $Boton_Modificar_Empleado_Solicitud.option("disabled",true);
                        $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",false);
                        $Boton_Cancel_Empleado_Solicitud.option("visible",true);
                        $Boton_Cancel_Empleado_Solicitud.option("disabled",false);
                        $__Form_Empleado_Solicitud.option("readOnly",false);
                    }
                }
            },{
                location: "after",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    visible:false,
                    height:20,
                    text: "Guardar",
                    icon: 'Icons/Save-icon.png',
                    onInitialized: function(e) {  
                        $Boton_Guardar_Alta_Empleado_Solicitud = e.component;
                    },
                    onClick() {
                        $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",true);
                        loadPanel.show();
                        if($__Form_Empleado_Solicitud.validate().isValid){
                            var Info_Form_Solicitud = $__Form_Empleado_Solicitud.option("formData");
                            Info_Form_Solicitud.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                            Info_Form_Solicitud.EMPLEADO_CSC_EMPLEADO = self.IdEmpleado;
                            Info_Form_Solicitud.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            Info_Form_Solicitud.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            Info_Form_Solicitud.AUDITORIA_FEC_ALTA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            Info_Form_Solicitud.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            
                            var Data_Insert_Solicitud = {
                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type:localStorage.getItem('Type'),
                                DATA_INSERT:Info_Form_Solicitud
                            };
                            //console.log(Info_Form_Solicitud);
                            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Solicitud',"POST", JSON.stringify(Data_Insert_Solicitud), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                if(result.success === true){
                                    loadPanel.hide();
                                    $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",false);
                                    DevExpress.ui.notify('INFORMACIÓN INSERTADA CORRECTAMENTE', 'success', 3000);
                                    self.Load_Solicitud();
                                }
                                else{
                                    loadPanel.hide();
                                    $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",false);
                                    DevExpress.ui.notify('ERROR AN INSERTAR INFORMACIÓN VALIDA E INTENTA NUEVAMENTE', 'error', 3000);
                                }
                            }).catch(function(err){
                                console.log(err);
                                $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",false);
                                loadPanel.hide();
                                DevExpress.ui.notify('ERROR DE COMUNICACIÓN INTENTELO NUEVAMENTE DESPUES', 'error', 3000);
                            });
                        }
                        else{
                            loadPanel.hide();
                            $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",false);
                            DevExpress.ui.notify('VALIDE LA INFORMACIÓN ANTES DE GUARDAR', 'error', 3000);
                        }
                    }
                }
            },{
                location: "after",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    visible:false,
                    height:20,
                    text: "Guardar",
                    icon: 'Icons/Save-icon.png',
                    onInitialized: function(e) {  
                        $Boton_Guardar_Modificar_Empleado_Solicitud = e.component;
                    },
                    onClick() {
                        $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",true);
                        loadPanel.show();
                        if($__Form_Empleado_Solicitud.validate().isValid){
                            var Form_Data_New = $__Form_Empleado_Solicitud.option("formData");
                            Data_To_Update = GetUpdateData(self.Respaldo_Empleado_Solicitud,Form_Data_New);
                            var Data_To_Update_Solicitud = Object.assign({},Data_To_Update);

                            Data_To_Update_Solicitud.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            Data_To_Update_Solicitud.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

                            var Update_Empleado_Solicitud = {
                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type:localStorage.getItem('Type'),
                                DATA_UPDATE:Data_To_Update_Solicitud,
                                DATA_WHERE:{
                                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                    EMPLEADO_CSC_EMPLEADO:self.Respaldo_Empleado_Solicitud.EMPLEADO_CSC_EMPLEADO
                                }
                            };
                            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado_Solicitud', 'POST', JSON.stringify(Update_Empleado_Solicitud), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((resultdata)=>{
                                if(resultdata.success === true){
                                    loadPanel.hide();
                                    $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",false);
                                    DevExpress.ui.notify('INFORMACIÓN ACTUALIZADA CORRECTAMENTE', 'success', 3000);
                                    self.Load_Solicitud();
                                }
                                else{
                                    loadPanel.hide();
                                    $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",false);
                                    DevExpress.ui.notify('ERROR AL ACTUALIZAR INFORMACIÓN VALIDA E INTENTA NUEVAMENTE', 'error', 3000);
                                }
                            }).catch(function(err){
                                console.log(err);
                                $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",false);
                                loadPanel.hide();
                                DevExpress.ui.notify('ERROR DE COMUNICACIÓN INTENTELO NUEVAMENTE DESPUES', 'error', 3000);
                            });
                        }
                        else{
                            loadPanel.hide();
                            $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",false);
                            DevExpress.ui.notify('VALIDE LA INFORMACIÓN ANTES DE GUARDAR', 'error', 3000);
                        }
                        
                    }
                }
            },{
                location: "after",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    visible:false,
                    height:20,
                    text: "Cancelar",
                    icon: 'Icons/CancelIcon.png',
                    onInitialized: function(e) {  
                        $Boton_Cancel_Empleado_Solicitud = e.component;
                    },
                    onClick() {
                        self.Load_Solicitud();
                    }
                }
            }]
        });


        $('#__Form_Empleado_Solicitud').dxForm({
            disabled: false,
            readOnly:true,
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: '__Form_Empleado_Solicitud_Validation',
            labelMode: 'static',
            labelLocation: 'top',
            onInitialized:function(e){
                $__Form_Empleado_Solicitud = e.component;
                self.Load_Solicitud();
            },
            colCount: 3,
            items:[{
                itemType: "group",
                items:[{
                    itemType: "group",
                    items: [{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿Lo refiere algún colaborador?</div>'
                        },{
                            dataField: "SOLICITUD_REFERIDO",
                            editorType: "dxRadioGroup",
                            label: {text:"   ",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [{id:1,text:"SÍ"},{id:0,text:"NO"}],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_NOMBRE_REFERIDO").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_NOMBRE_REFERIDO").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_NOMBRE_REFERIDO").option("value", "");
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_NOMBRE_REFERIDO",
                            editorType: "dxTextBox",
                            label: { text: "Nombre"},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                maxLength:150,
                                disabled:true,
                                placeholder: 'Nombre',
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        }]
                    },{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿Ha trabajado anteriormente en el grupo?</div>'
                        },{
                            dataField: "SOLICITUD_LABORO_ANTERIORMENTE",
                            editorType: "dxRadioGroup",
                            label: {text:" ",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [
                                    {id:1,text:"SÍ"},
                                    {id:0,text:"NO"}
                                ],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_LABORO_CUAL").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_LABORO_CUAL").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_LABORO_CUAL").option("value", "");
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "Este campo es requerido"
                            }]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_LABORO_CUAL",
                            editorType: "dxTextBox",
                            label: {text:"¿En cual?"},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                disabled:true,
                                placeholder: '¿Cual?',
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required", message: "Requerido"
                            }]
                        }]
                    },{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿Ha estado sindicalizado?</div>'
                        },{
                            dataField: "SOLICITUD_SINDICALIZADO",
                            editorType: "dxRadioGroup",
                            label: {text:" ",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [
                                    {id:1,text:"SÍ"},
                                    {id:0,text:"NO"}
                                ],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_SINDICALIZADO_CUAL").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_SINDICALIZADO_CUAL").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_SINDICALIZADO_CUAL").option("value", "");
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_SINDICALIZADO_CUAL",
                            editorType: "dxTextBox",
                            label: {text: "Grupo sindicalizado"},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                disabled:true,
                                maxLength:500,
                                placeholder: '¿Cual grupo?',
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        }]
                    },{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿Labora algún familiar en la empresa?</div>'
                        },{
                            dataField: "SOLICITUD_LABORO_FAMILIAR",
                            editorType: "dxRadioGroup",
                            label: {text:" ",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [
                                    {id:1,text:"SÍ"},
                                    {id:0,text:"NO"}
                                ],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_LABORO_AREA").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_LABORO_AREA").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_LABORO_AREA").option("value", "");
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Este campo es requerido"
                            }]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_LABORO_AREA",
                            editorType: "dxTextBox",
                            label: { text: "Nombre del familiar"},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                disabled:true,
                                maxLength:500,
                                placeholder: 'Nombre del familiar',
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required",
                                message: "Requerido"
                            }]
                        }]
                    },{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿Padece alguna enfermedad crónica?</div>'
                        },{
                            dataField: "SOLICITUD_ENFERMEDAD_CRONICA",
                            editorType: "dxRadioGroup",
                            label: {text:"¿Padece alguna enfermedad crónica?",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [
                                    {id:1,text:"SÍ"},
                                    {id:0,text:"NO"}
                                ],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ENFERMEDAD_CRONICA_CUAL").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ENFERMEDAD_CRONICA_CUAL").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ENFERMEDAD_CRONICA_CUAL").option("value", "");
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required", message: "Requerido"
                            }]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_ENFERMEDAD_CRONICA_CUAL",
                            editorType: "dxTextBox",
                            label: {text: "Enfermedad crónica", visible:false},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                disabled:true,
                                maxLength:500,
                                placeholder: '¿Cual enfermedad?',
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        }]
                    },{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿Ha sido intervenido quirúrgicamente?</div>'
                        },{
                            dataField: "SOLICITUD_CIRUGIA",
                            editorType: "dxRadioGroup",
                            label: {text:"¿Ha sido intervenido quirúrgicamente?",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [
                                    {id:1,text:"SÍ"},
                                    {id:0,text:"NO"}
                                ],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_CIRUGIA_CUAL").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_CIRUGIA_CUAL").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_CIRUGIA_CUAL").option("value", "");
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"}]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_CIRUGIA_CUAL",
                            editorType: "dxTextBox",
                            label: {text: "¿De que has sido intervenido?",visible:false},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                disabled:true,
                                maxLength:500,
                                placeholder: '¿De que?',
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        }]
                    },{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿tienes pensado ingresar a estudiar?</div>'
                        },{
                            dataField: "SOLICITUD_INGRESAR_ESTUDIAR",
                            editorType: "dxRadioGroup",
                            label: {text:"¿tienes pensado ingresar a estudiar?",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [
                                    {id:1,text:"SÍ"},
                                    {id:0,text:"NO"}
                                ],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ESTUDIO_TURNO").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ESTUDIO_TURNO").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ESTUDIO_TURNO").option("value", null);
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_ESTUDIO_TURNO",
                            editorType: "dxSelectBox",
                            label: {text: "¿Que tipo de turno?",visible:false},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                disabled:true,
                                showClearButton: true,
                                placeholder: 'Turno',
                                valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_TURNO_ESCOLAR").KEYID,
                                displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_TURNO_ESCOLAR").TEXT,
                                dataSource: self.Get_Config_Cat_local("SAMT_TIPO_TURNO_ESCOLAR").DATA,
                                onOpened: function(e){
                                    var SOLICITUD_ESTUDIO_TURNO_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_TURNO_ESCOLAR").DATA ).where(function(el) {
                                        return el[self.Get_Config_Cat_local("SAMT_TIPO_TURNO_ESCOLAR").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_TURNO_ESCOLAR").ACTIVE] == true ;
                                    }).toList(); 
                                    e.component.option('dataSource',SOLICITUD_ESTUDIO_TURNO_ACTIVO);
                                },
                                onClosed: function(e){
                                    e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_TURNO_ESCOLAR").DATA );
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        }]
                    },{
                        colCount:3,
                        itemType: "group",
                        items: [{
                            colSpan:3,
                            template:'<div class="label_field_no_form">¿Ha padecido algún tipo de hepatitis?</div>'
                        },{
                            dataField: "SOLICITUD_HEPATITIS",
                            editorType: "dxRadioGroup",
                            label: {text:"¿Ha padecido algún tipo de hepatitis?",visible:false},
                            cssClass:"no_padddin_top_radio",
                            editorOptions: {
                                displayExpr:"text",
                                valueExpr:"id",
                                layout: "horizontal",
                                dataSource: [
                                    {id:1,text:"SÍ"},
                                    {id:0,text:"NO"}
                                ],
                                onValueChanged:function(e){
                                    if(e.value !== null){
                                        if(e.value == 1){
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_HEPATITIS_CUAL").option("disabled", false);
                                        }
                                        else{
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_HEPATITIS_CUAL").option("disabled", true);
                                            $__Form_Empleado_Solicitud.getEditor("SOLICITUD_HEPATITIS_CUAL").option("value", "");
                                        }
                                    }
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        },{
                            colSpan:2,
                            dataField: "SOLICITUD_HEPATITIS_CUAL",
                            editorType: "dxTextBox",
                            label: {text: "¿Cual tipo de hepatitis?",visible:false},
                            cssClass:"no_padddin_top",
                            editorOptions: {
                                disabled:true,
                                maxLength:500,
                                placeholder: '¿Cual?',
                                valueChangeEvent: "keyup",
                                onValueChanged: function (e) {
                                    if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                                }
                            },
                            validationRules: [{
                                type: "required",message: "Requerido"
                            }]
                        }]
                    }]
                }]
            },{
                itemType: "group",
                items:[{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">¿Es alérgico a algún medicamento?</div>'
                    },{
                        dataField: "SOLICITUD_MEDICAMENTO",
                        editorType: "dxRadioGroup",
                        label: {text:"¿Es alérgico a algún medicamento?",visible:false},
                        cssClass:"no_padddin_top_radio",
                        editorOptions: {
                            displayExpr:"text",
                            valueExpr:"id",
                            layout: "horizontal",
                            dataSource: [
                                {id:1,text:"SÍ"},
                                {id:0,text:"NO"}
                            ],
                            onValueChanged:function(e){
                                if(e.value !== null){
                                    if(e.value == 1){
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MEDICAMENTO_CUAL").option("disabled", false);
                                    }
                                    else{
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MEDICAMENTO_CUAL").option("disabled", true);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MEDICAMENTO_CUAL").option("value", "");
                                    }
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    },{
                        colSpan:2,
                        dataField: "SOLICITUD_MEDICAMENTO_CUAL",
                        editorType: "dxTextBox",
                        label: {text: "¿Que tipo de medicamento?", visible:false},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            disabled:true,
                            maxLength:500,
                            placeholder: '¿Cual?',
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">¿Es alérgico a algo?</div>'
                    },{
                        dataField: "SOLICITUD_ALERGIAS",
                        editorType: "dxRadioGroup",
                        label: {text:"¿Es alérgico a algo?",visible:false},
                        cssClass:"no_padddin_top_radio",
                        editorOptions: {
                            displayExpr:"text",
                            valueExpr:"id",
                            layout: "horizontal",
                            dataSource: [
                                {id:1,text:"SÍ"},
                                {id:0,text:"NO"}
                            ],
                            onValueChanged:function(e){
                                if(e.value !== null){
                                    if(e.value == 1){
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ALERGIAS_CUAL").option("disabled", false);
                                    }
                                    else{
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ALERGIAS_CUAL").option("disabled", true);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_ALERGIAS_CUAL").option("value", "");
                                    }
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    },{
                        colSpan:2,
                        dataField: "SOLICITUD_ALERGIAS_CUAL",
                        editorType: "dxTextBox",
                        label: {text: "¿A que es alergico?",visible:false},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            disabled:true,
                            maxLength:500,
                            placeholder: '¿A que es alergico?',
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">¿Ha sido donador de sangre?</div>'
                    },{
                        dataField: "SOLICITUD_DONADOR",
                        editorType: "dxRadioGroup",
                        label: {text:"¿Ha sido donador de sangre?",visible:false },
                        cssClass:"no_padddin_top_radio",
                        editorOptions: {
                            displayExpr:"text",
                            valueExpr:"id",
                            layout: "horizontal",
                            dataSource: [
                                {id:1,text:"SÍ"},
                                {id:0,text:"NO"}
                            ],
                            onValueChanged:function(e){
                                if(e.value !== null){
                                    if(e.value == 1){
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_DONADOR_FECHA").option("disabled", false);
                                    }
                                    else{
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_DONADOR_FECHA").option("disabled", true);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_DONADOR_FECHA").option("value", null);
                                    }
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Este campo es requerido"
                        }]
                    },{
                        colSpan:2,
                        dataField: "SOLICITUD_DONADOR_FECHA",
                        editorType: "dxDateBox",
                        label: {text: "¿Cual fue la ultima fecha?",visible:false},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            type: "date",
                            disabled:true,
                            showClearButton: true,
                            useMaskBehavior: true,
                            placeholder: "DD-MM-AAAA",
                            displayFormat: "dd-MM-yyyy",
                            dateSerializationFormat: "yyyy-MM-dd",
                            max:new Date(),
                            onValueChanged: function (e) {
    
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">¿Cuentas con crédito Infonavit?</div>'
                    },{
                        dataField: "SOLICITUD_INFONAVIT",
                        editorType: "dxRadioGroup",
                        label: {text:"¿Cuentas con crédito Infonavit?", visible:false },
                        cssClass:"no_padddin_top_radio",
                        editorOptions: {
                            displayExpr:"text",
                            valueExpr:"id",
                            layout: "horizontal",
                            dataSource: [
                                {id:1,text:"SÍ"},
                                {id:0,text:"NO"}
                            ],
                            onValueChanged: function (e) {
                                if(e.value !== null){
                                    if(e.value == 1){
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_CUENTA_INFONAVIT").option("disabled", false);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MONTO_INFONAVIT").option("disabled", false);
                                    }
                                    else{
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_CUENTA_INFONAVIT").option("disabled", true);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MONTO_INFONAVIT").option("disabled", true);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_CUENTA_INFONAVIT").option("value", "");
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MONTO_INFONAVIT").option("value", "");
                                    }
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Este campo es requerido"
                        }]
                    },{
                        dataField: "SOLICITUD_CUENTA_INFONAVIT",
                        editorType: "dxNumberBox",
                        label: {text: "No. Cuenta",visible:false},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            disabled:true,
                            valueChangeEvent: "keyup",
                            placeholder: 'No. Cuenta',
                            min:0,
                            value:"",
                            onValueChanged: function (e) {
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    },{
                        dataField: "SOLICITUD_MONTO_INFONAVIT",
                        editorType: "dxNumberBox",
                        label: {text: "Monto",visible:false},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            disabled:true,
                            valueChangeEvent: "keyup",
                            placeholder: 'Monto',
                            format: "$ #,##0.##",
                            min:0,
                            value:"",
                            onValueChanged: function (e) {
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">¿Cuentas con crédito Fonacot?</div>'
                    },{
                        dataField: "SOLICITUD_FONACOT",
                        editorType: "dxRadioGroup",
                        label: {text:"¿Cuentas con crédito Fonacot?", visible:false},
                        cssClass:"no_padddin_top_radio",
                        editorOptions: {
                            displayExpr:"text",
                            valueExpr:"id",
                            layout: "horizontal",
                            dataSource: [
                                {id:1,text:"SÍ"},
                                {id:0,text:"NO"}
                            ],
                            onValueChanged: function (e) {
                                if(e.value !== null){
                                    if(e.value == 1){
                                        $__Form_Empleado_Solicitud.getEditor("SOLICIUTD_CUENTA_FONACOT").option("disabled", false);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MONTO_FONACOT").option("disabled", false);
                                    }
                                    else{
                                        $__Form_Empleado_Solicitud.getEditor("SOLICIUTD_CUENTA_FONACOT").option("disabled", true);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MONTO_FONACOT").option("disabled", true);
                                        $__Form_Empleado_Solicitud.getEditor("SOLICIUTD_CUENTA_FONACOT").option("value", "");
                                        $__Form_Empleado_Solicitud.getEditor("SOLICITUD_MONTO_FONACOT").option("value", "");
                                    }
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    },{
                        dataField: "SOLICIUTD_CUENTA_FONACOT",
                        editorType: "dxNumberBox",
                        label: {text: "No. Cuenta"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            disabled:true,
                            valueChangeEvent: "keyup",
                            placeholder: 'No. Cuenta',
                            min:0,
                            value:"",
                            onValueChanged: function (e) {
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    },{
                        dataField: "SOLICITUD_MONTO_FONACOT",
                        editorType: "dxNumberBox",
                        label: {text: "Monto"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            disabled:true,
                            valueChangeEvent: "keyup",
                            placeholder: 'Monto',
                            format: "$ #,##0.##",
                            min:0,
                            value:"",
                            onValueChanged: function (e) {
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">En caso de emergencia</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLICITUD_REFERENCIA_EMERGENCIA",
                        editorType: "dxTextBox",
                        label: {text: "Cominucarse Con"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            maxLength:500,
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Campo requerido "
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:3,
                        dataField: "TIPO_EMPLEADO_REFERENCIA_EMERGENCIA_CSC",
                        editorType: "dxSelectBox",
                        label: {text: "Parentesco"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            showClearButton: true,
                            placeholder: 'Parentesco',
                            valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").KEYID,
                            displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").TEXT,
                            dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA,
                            onOpened: function(e){
                                var TIPO_EMPLEADO_REFERENCIA_EMERGENCIA_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA ).where(function(el) {
                                    return el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").ACTIVE] == true ;
                                }).toList(); 
                                e.component.option('dataSource',TIPO_EMPLEADO_REFERENCIA_EMERGENCIA_ACTIVO);
                            },
                            onClosed: function(e){
                                e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA );
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLICITUD_REFERENCIA_TELEFONO",
                        editorType: "dxTextBox",
                        label: {text: "Tel. Emergencia"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            mask: "000-000-0000",
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Télefono Requerido"
                        }]
                    }]
                }]
            },{
                itemType: "group",
                items:[{
                    colCount:4,
                    itemType: "group",
                    items: [{
                        colSpan:4,
                        template:'<div class="label_field_no_form">¿Tiene hijo(s)?</div>'
                    },{
                        colSpan:2,
                        dataField: "SOLICITUD_HIJOS",
                        editorType: "dxRadioGroup",
                        label: {text:"¿Tiene hijo(s)?",visible:false},
                        cssClass:"no_padddin_top_radio",
                        editorOptions: {
                            displayExpr:"text",
                            valueExpr:"id",
                            layout: "horizontal",
                            dataSource: [
                                {id:1,text:"SÍ"},
                                {id:0,text:"NO"}
                            ],
                            onValueChanged: function (e) {
                                if(e.value != null){
                                    if(e.value == 1){
                                        $Btn_Hijos_Alta.option('visible',true);
                                    }
                                    else{
                                        $Btn_Hijos_Alta.option('visible',false);
                                    }
                                }
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    },{
                        colSpan:2,
                        itemType: "button",
                        cssClass:"no_padddin_top",
                        buttonOptions: {
                            width: "100%",
                            height:20,
                            type: "default",
                            text: "HIJOS",
                            icon: "fa fa-child",
                            horizontalAlignment:"right",
                            visible:false,
                            onInitialized: function(e) {
                                $Btn_Hijos_Alta = e.component;
                            },
                            elementAttr:{
                                class:"btn-min-function-w"
                            },
                            onClick: function () {
                                $("#Pop_Informacion_Hijos").dxPopup("show");
                            }
                        }
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLITIUD_SUELDO_DESEADO",
                        editorType: "dxNumberBox",
                        label: {text: "Sueldo Mensual Deseado"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            valueChangeEvent: "keyup",
                            placeholder: 'Sueldo deseado',
                            format: "$ #,##0.##",
                            min:0,
                            value:"",
                            onValueChanged: function (e) {
                            }
                        }
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLICITUD_TIPO_MEDIO_CSC",
                        editorType: "dxSelectBox",
                        label: {text: "Medio por el cuál se entero de la vacante"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            showClearButton: true,
                            placeholder: 'Medio por el cuál se entero',
                            valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_MEDIO_ENTERO").KEYID,
                            displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_MEDIO_ENTERO").TEXT,
                            dataSource: self.Get_Config_Cat_local("SAMT_TIPO_MEDIO_ENTERO").DATA,
                            onOpened: function(e){
                                var SOLICITUD_TIPO_MEDIO_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_MEDIO_ENTERO").DATA ).where(function(el) {
                                    return el[self.Get_Config_Cat_local("SAMT_TIPO_MEDIO_ENTERO").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_MEDIO_ENTERO").ACTIVE] == true ;
                                }).toList(); 
                                e.component.option('dataSource',SOLICITUD_TIPO_MEDIO_ACTIVO);
                            },
                            onClosed: function(e){
                                e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_MEDIO_ENTERO").DATA );
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLICITUD_DISTANCIA_TRABAJO",
                        editorType: "dxSelectBox",
                        label: {text: "Tiempo en Distancia al Trabajo"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            showClearButton: true,
                            placeholder: 'Seleccione la distancia',
                            valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_DISTANCIA_LABORAL").KEYID,
                            displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_DISTANCIA_LABORAL").TEXT,
                            dataSource: self.Get_Config_Cat_local("SAMT_TIPO_DISTANCIA_LABORAL").DATA,
                            onOpened: function(e){
                                var SOLICITUD_DISTANCIA_TRABAJO_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_DISTANCIA_LABORAL").DATA ).where(function(el) {
                                    return el[self.Get_Config_Cat_local("SAMT_TIPO_DISTANCIA_LABORAL").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_DISTANCIA_LABORAL").ACTIVE] == true ;
                                }).toList(); 
                                e.component.option('dataSource',SOLICITUD_DISTANCIA_TRABAJO_ACTIVO);
                            },
                            onClosed: function(e){
                                e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_DISTANCIA_LABORAL").DATA );
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Campo requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLICITUD_DISPONIBILIDAD",
                        editorType: "dxSelectBox",
                        label: {text: "Disponibilidad para Laboral"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            showClearButton: true,
                            placeholder: 'Disponibilidad',
                            valueExpr:self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_DISPONIBILIDAD").KEYID,
                            displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_DISPONIBILIDAD").TEXT,
                            dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_DISPONIBILIDAD").DATA,
                            onOpened: function(e){
                                var SOLICITUD_DISPONIBILIDAD_ACTIVO = jslinq(  self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_DISPONIBILIDAD").DATA ).where(function(el) {
                                    return el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_DISPONIBILIDAD").ACTIVE] == 1 || el[self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_DISPONIBILIDAD").ACTIVE] == true ;
                                }).toList(); 
                                e.component.option('dataSource',SOLICITUD_DISPONIBILIDAD_ACTIVO);
                            },
                            onClosed: function(e){
                                e.component.option('dataSource',self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_DISPONIBILIDAD").DATA );
                            }
                        },
                        validationRules: [{
                            type: "required",message: "Campo requerido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLICITUD_EMPLEADO_EMAIL_PERSONAL",
                        editorType: "dxTextBox",
                        label: { text: "Correo Electrónico Personal"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            maxLength: 50,
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "E-mail requerido "
                        },{
                            type: "email",
                            message: "Sintaxis incorrecta"
                        },{
                            type: "custom",
                            validationCallback: function(e){
                                if(Email_Invalidos.indexOf(e.value) > -1){ return false; }
                                else{ return true; }
                            },
                            message: "El E-Mail no esta permitido"
                        }]
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">Recomendado</div>'
                    },{
                        colSpan:3,
                        dataField: "SOLICITUD_RECOMENDADO_NOMBRE",
                        editorType: "dxTextBox",
                        label: {text: "Nombre"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            placeholder: 'Nombre',
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        },
                        validationRules: []
                    }]
                },{
                    colCount:3,
                    itemType: "group",
                    items: [{
                        colSpan:3,
                        template:'<div class="label_field_no_form">&nbsp;</div>'
                    },{
                        colSpan:1,
                        dataField: "SOLICITUD_RECOMENDADO_TELEFONO",
                        editorType: "dxTextBox",
                        label: {text: "Teléfono"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            mask: "000-000-0000",
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                            }
                        }
                    },{
                        colSpan:2,
                        dataField: "SOLICITUD_RECOMENDADO_MAIL",
                        editorType: "dxTextBox",
                        label: {text: "Correo"},
                        cssClass:"no_padddin_top",
                        editorOptions: {
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        },
                        validationRules: [{
                            type: "email",message: "Sintaxis incorrecta"
                        },{
                            type: "custom",
                            validationCallback: function(e){
                                if(e.value == null ||  e.value == ""){ return true;}
                                else{
                                    if(Email_Invalidos.indexOf(e.value) > -1){return false;}
                                    else{return true;}
                                }
                            },
                            message: "El E-Mail no esta permitido"
                        }]
                    }]
                }]
            }]
        });


        $('#__ToolBar_Acciones_Referencias_Familiares').dxToolbar({
            items:[{
                location: "before",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    height:20,
                    text: "Alta",
                    icon: 'Icons/add.png',
                    onInitialized: function(e) {  
                        $Boton_Alta_Referencia_Familiar = e.component;
                    },
                    onClick() {
                        $("#Pop_Referencias_Familiares").dxPopup("show");
                        $Btn_Agregar_Ref_Fam.option("visible",true);
                        $Btn_Actualizar_Ref_Fam.option("visible",false);
                        $("#Form_Referecias_Familiares").dxForm("instance").option("formData",{});
                    }
                }
            }]
        });


        $('#__DataGrid_Referencias_Familiares').dxDataGrid({
            width:'100%',
            allowColumnResizing: true,
            columnResizingMode: "widget",
           
            grouping: {autoExpandAll: false},
            groupPanel: {visible: false},
            wordWrapEnabled: true,
           
           
            remoteOperations: { groupPaging: false },
            headerFilter: {visible: true},
            scrolling: {mode: 'virtual'},
            filterRow: {visible: false},
            pager: {showPageSizeSelector: false}, 
            searchPanel: {visible: false},
            selection: {mode: "none"},
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            dataSource: new DevExpress.data.DataSource({
                loadMode:'raw',
                load: async function () {
                    try {
                        var objRequest = {
                            Type:localStorage.getItem('Type'),
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            EMPLEADO_CSC_EMPLEADO:self.IdEmpleado,
                            TIPO_EMPLEADO_REFERENCIA_CLAVE:'FAM'
                        };
                        return __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Empleado_Referencias_Por_Tipo',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(dataRequest){
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
            columns: [{
                width: 130,
                caption: "ACCIONES",
                encodeHtml:false,
                cellTemplate(container, options) {
                    container.append(
                        $('<div>').dxButton({
                            height:20,
                            icon: 'fa fa-pencil',
                            type: 'default',
                            text: 'Modificar',
                            onClick(){
                                //console.log(container);
                                //console.log(options.data);
                                $("#Pop_Referencias_Familiares").dxPopup("show");
                                $Btn_Agregar_Ref_Fam.option("visible",false);
                                $Btn_Actualizar_Ref_Fam.option("visible",true);
                                self.Respaldo_Referencia_Familiar = Object.assign({},options.data);
                                $("#Form_Referecias_Familiares").dxForm("instance").option("formData",Object.assign({},options.data));
                            }
                        })
                    )
                }
            },{
                width: 200,
                caption: "PARENTESCO", 
                dataField: "TIPO_EMPLEADO_REFERENCIA_CSC",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").KEYID
                }
            },{
                width: 250,
                caption: "NOMBRE", 
                dataField: "EMPLEADO_REFERENCIA_NOMBRE"
            },{
                width: 150,
                caption: "OCUPACIÓN", 
                dataField: "EMPLEADO_REFERENCIA_OCUAPCION"
            },{
                width: 250,
                caption: "DIRECCIÓN", 
                dataField: "EMPLEADO_DIRECCION"
            }]
        });


        $('#__ToolBar_Acciones_Referencias_Personales').dxToolbar({
            items:[{
                location: "before",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    height:20,
                    text: "Alta",
                    icon: 'Icons/add.png',
                    onInitialized: function(e) {  
                        $Boton_Alta_Referencia_Personales = e.component;
                    },
                    onClick() {
                        $("#Pop_Referencias_Personales").dxPopup("show");
                        $Btn_Agregar_Ref_Per.option("visible",true);
                        $Btn_Actualizar_Ref_Per.option("visible",false);
                        $("#Form_Referecias_Personales").dxForm("instance").option("formData",{});
                    }
                }
            }]
        });


        $('#__DataGrid_Referencias_Personales').dxDataGrid({
            width:'100%',
            allowColumnResizing: true,
            columnResizingMode: "widget",
           
            grouping: {autoExpandAll: false},
            groupPanel: {visible: false},
            wordWrapEnabled: true,
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
           
            remoteOperations: { groupPaging: false },
            headerFilter: {visible: true},
            scrolling: {mode: 'virtual'},
            filterRow: {visible: false},
            pager: {showPageSizeSelector: false}, 
            searchPanel: {visible: false},
            selection: {mode: "none"},
            dataSource: new DevExpress.data.DataSource({
                loadMode:'raw',
                load: async function () {
                    try {
                        var objRequest = {
                            Type:localStorage.getItem('Type'),
                            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            EMPLEADO_CSC_EMPLEADO:self.IdEmpleado,
                            TIPO_EMPLEADO_REFERENCIA_CLAVE:'REF'
                        };
                        return __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Empleado_Referencias_Por_Tipo',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(dataRequest){
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
            columns: [{
                width: 130,
                caption: "ACCIONES",
                encodeHtml:false,
                cellTemplate(container, options) {
                    container.append(
                        $('<div>').dxButton({
                            height:20,
                            icon: 'fa fa-pencil',
                            type: 'default',
                            text: 'Modificar',
                            onClick(){
                                //console.log(container);
                                //console.log(options.data);
                                $("#Pop_Referencias_Personales").dxPopup("show");
                                $Btn_Agregar_Ref_Per.option("visible",false);
                                $Btn_Actualizar_Ref_Per.option("visible",true);
                                self.Respaldo_Referencia_Personal = Object.assign({},options.data);
                                $("#Form_Referecias_Personales").dxForm("instance").option("formData",Object.assign({},options.data));
                            }
                        })
                    )
                }
            },{
                width: 150,
                caption: "TIPO DE REFERENCIA", 
                dataField: "TIPO_EMPLEADO_REFERENCIA_CSC",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_REFERENCIA").KEYID
                }
            },{
                width: 150,
                caption: "NOMBRE COMPLETO", 
                dataField: "EMPLEADO_REFERENCIA_NOMBRE"
            },{
                width: 150,
                caption: "OCUPACIÓN", 
                dataField: "EMPLEADO_REFERENCIA_OCUAPCION"
            },{
                width: 150,
                caption: "EMPRESA", 
                dataField: "EMPLEADO_REFERENCIA_EMPRESA"
            },{
                width: 100,
                caption: "TELÉFONO", 
                dataField: "EMPLEADO_REFERENCIA_TELEFONO"
            }]
        });


        $('#__ToolBar_Acciones_Experiencia_Laboral').dxToolbar({
            items:[{
                location: "before",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    height:20,
                    text: "Alta",
                    icon: 'Icons/add.png',
                    onInitialized: function(e) {  
                        $Boton_Alta_Experiencia_Laboral = e.component;
                    },
                    onClick() {
                        $("#Pop_Experiencias_Laborales").dxPopup("show");
                        $Btn_Agregar_Experiencia_Labora.option("visible",true);
                        $Btn_Actualizar_Experiencia_Labora.option("visible",false);
                        $("#Form_Experiencias_Laborales").dxForm("instance").option("formData",{});
                    }
                }
            }]
        });


        $('#__DataGrid_Experiencia_Laboral').dxDataGrid({
            width:'100%',
            allowColumnResizing: true,
            columnResizingMode: "widget",
           
            grouping: { autoExpandAll: false },
            groupPanel: { visible: false },
            wordWrapEnabled: true,
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
           
            remoteOperations: { groupPaging: false },
            headerFilter: { visible: false },
            scrolling: { mode: 'virtual' },
            filterRow: { visible: false },
            pager: { showPageSizeSelector: false }, 
            searchPanel: { visible: false },
            selection: { mode: "none" },
            columnMinWidth:180,
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
                        return __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Empleado_Experiencia_Laboral',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(dataRequest){
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
            columns: [{
                width: 130,
                caption: "ACCIONES",
                encodeHtml:false,
                cellTemplate(container, options) {
                    container.append(
                        $('<div>').dxButton({
                            height:20,
                            icon: 'fa fa-pencil',
                            type: 'default',
                            text: 'Modificar',
                            onClick(){
                                //console.log(container);
                                //console.log(options.data);
                                $("#Pop_Experiencias_Laborales").dxPopup("show");
                                $Btn_Agregar_Experiencia_Labora.option("visible",false);
                                $Btn_Actualizar_Experiencia_Labora.option("visible",true);
                                self.Respaldo_Experiencia_Laboral = Object.assign({},options.data);
                                $("#Form_Experiencias_Laborales").dxForm("instance").option("formData",Object.assign({},options.data));
                            }
                        })
                    )
                }
            },{
                caption: "TIPO EXPERIENCIA", 
                dataField: "TIPO_EMPLEADO_EXPERIENCIA_CSC",
                lookup: {
                    dataSource: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").DATA,
                    displayExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").TEXT,
                    valueExpr: self.Get_Config_Cat_local("SAMT_TIPO_EMPLEADO_EXPERIENCIA").KEYID
                }
            },{
                caption: "EMPRESA", 
                dataField: "EXPERIENCIA_EMPRESA"
            },{
                caption: "FECHA INGRESO", 
                dataField: "EXPERIENCIA_FECHA_INGRESO",
                dataType: "date",
                format:"yyyy-MM-dd",
                calculateCellValue: function(data) {
                    if(data.EXPERIENCIA_FECHA_INGRESO != null){
                        return moment(data.EXPERIENCIA_FECHA_INGRESO).format('YYYY-MM-DD');
                    }
                    else{
                        return null;
                    }
                }
            },{
                caption: "FECHA SALIDA", 
                dataField: "EXPERIENCIA_FECHA_SALIDA",
                dataType: "date",
                format:"yyyy-MM-dd",
                calculateCellValue: function(data) {
                    if(data.EXPERIENCIA_FECHA_SALIDA != null){
                        return moment(data.EXPERIENCIA_FECHA_SALIDA).format('YYYY-MM-DD');
                    }
                    else{
                        return null;
                    }
                }
            },{
                caption: "GIRO", 
                dataField: "EXPERIENCIA_GIRO"
            },{
                caption: "TELÉFONO", 
                dataField: "EXPERIENCIA_TELEFONO"
            },{
                caption: "JEFE INMEDIATO", 
                dataField: "EXPERIENCIA_JEFE_INMEDIATO"
            },{
                caption: "PUESTO DESEMPEÑADO", 
                dataField: "EXPERIENCIA_ACTIVIDADES"
            },{
                caption: "SUELDO INICIAL", 
                dataField: "EXPERIENCIA_SUELDO_INICIAL"
            },{
                caption: "SUELDO FINAL", 
                dataField: "EXPERIENCIA_SUELDO_FINAL"
            },{
                caption: "CAUSA DE LA SEPARACIÓN", 
                dataField: "EXPERIENCIA_CAUSA_SEPARACION"
            }]
        });

    }


    
    /**LEE TODOS LOS CATALOGOS NECESARIOS PARA LA SOLICITUD**/
    self.Load_Full_Catalogs = async function() {

        self.Content_Full_Catalogs = {
            "SAMT_TIPO_TURNO_ESCOLAR":{
                DATA:[],
                KEYID:"EMPLEADO_ESTUDIO_TURNO",
                TEXT:"TIPO_TURNO_ESTUDIO_IDIOMA1",
                ACTIVE:"TIPO_TURNO_ACTIVO"
            },
            "SAMT_TIPO_EMPLEADO_REFERENCIA":{
                DATA:[],
                KEYID:"TIPO_EMPLEADO_REFERENCIA_CSC",
                TEXT:"TIPO_EMPLEADO_REFERENCIA_IDIOMA1",
                ACTIVE:"TIPO_EMPLEADO_REFERENCIA_ACTIVO"
            },
            "SAMT_TIPO_DISTANCIA_LABORAL":{
                DATA:[],
                KEYID:"SOLICITUD_DISTANCIA_TRABAJO",
                TEXT:"TIPO_DISTANCIA_IDIOMA1",
                ACTIVE:"TIPO_DISTANCIA_ACTIVO"
            },
            "SAMT_TIPO_EMPLEADO_DISPONIBILIDAD":{
                DATA:[],
                KEYID:"SAMT_TIPO_DISPONIBILIDAD_CSC",
                TEXT:"SAMT_TIPO_DISPONIBILIDAD_IDIOMA1",
                ACTIVE:"SAMT_TIPO_DISPONIBILIDAD_ACTIVO"
            },
            "SAMT_TIPO_MEDIO_ENTERO":{
                DATA:[],
                KEYID:"SAMT_TIPO_MEDIO_CSC",
                TEXT:"SAMT_TIPO_MEDIO_IDIOMA1",
                ACTIVE:"SAMT_TIPO_MEDIO_ACTIVO"
            },
            "SAMT_TIPO_EMPLEADO_EXPERIENCIA":{
                DATA:[],
                KEYID:"TIPO_EXPERIENCIA_CSC",
                TEXT:"TIPO_EXPERIENCIA_IDIOMA1",
                ACTIVE:"TIPO_EXPERIENCIA_ACTIVO"
            },
            "SAMT_TIPO_SEXO":{
                DATA:[],
                KEYID:"TIPO_SEXO_CSC",
                TEXT:"TIPO_SEXO_IDIOMA1",
                ACTIVE:"TIPO_SEXO_ACTIVO"
            },
            "SAMT_TIPO_EMPLEADO_EDAD":{
                DATA:[],
                KEYID:"HIJOS_TIPO_EDAD",
                TEXT:"EDAD_DESCRIPCION1",
                ACTIVE:"EDAD_ACTIVO"
            }
            
        };

        for (const key in self.Content_Full_Catalogs) {
            await new Promise( async resolve  => {
                await self.Get_Cat_DataBase(key)
                .then(function(data){ console.log(data.success); resolve('resolved'); })
                .catch(function(err){ DevExpress.ui.notify('ERROR AL OBTENER CATALOGO');  resolve('resolved'); });
            });
        }

        //console.log(self.Get_Config_Cat_local("SAMT_CAT_PROCESO_EMPLEADOS"));
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

    self.Load_Solicitud = function(){
        loadPanel.hide();
        var GetEmpleadoSol = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            Type:localStorage.getItem('Type'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            TIPO_CONSULTA:"SOL_EMPLEADO",
            EMPLEADO_CSC_EMPLEADO:self.IdEmpleado
        };

        __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Busca_Reclutado',"GET",GetEmpleadoSol,getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(result){
            if(result.success == true){

                $Boton_Alta_Empleado_Solicitud.option("visible",false);
                $Boton_Alta_Empleado_Solicitud.option("disabled",true);
                $Boton_Guardar_Alta_Empleado_Solicitud.option("visible",false);
                $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",true);

                $Boton_Modificar_Empleado_Solicitud.option("visible",true);
                $Boton_Modificar_Empleado_Solicitud.option("disabled",false);
                $Boton_Guardar_Modificar_Empleado_Solicitud.option("visible",true);
                $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",true);

                $Boton_Cancel_Empleado_Solicitud.option("visible",false);
                $Boton_Cancel_Empleado_Solicitud.option("disabled",true);

                var Empledo_Solicitud_Aux = result.JsonData[0];
                self.Respaldo_Empleado_Solicitud = Object.assign({},Empledo_Solicitud_Aux);
                $__Form_Empleado_Solicitud.option("formData",Object.assign({},Empledo_Solicitud_Aux) );
            }
            else{
                $Boton_Alta_Empleado_Solicitud.option("visible",true);
                $Boton_Alta_Empleado_Solicitud.option("disabled",false);
                $Boton_Guardar_Alta_Empleado_Solicitud.option("visible",true);
                $Boton_Guardar_Alta_Empleado_Solicitud.option("disabled",true);

                $Boton_Modificar_Empleado_Solicitud.option("visible",false);
                $Boton_Modificar_Empleado_Solicitud.option("disabled",true);
                $Boton_Guardar_Modificar_Empleado_Solicitud.option("visible",false);
                $Boton_Guardar_Modificar_Empleado_Solicitud.option("disabled",true);

                $Boton_Cancel_Empleado_Solicitud.option("visible",false);
                $Boton_Cancel_Empleado_Solicitud.option("disabled",true);

                $__Form_Empleado_Solicitud.option("formData",{});
            }
            $__Form_Empleado_Solicitud.option("readOnly",true);
            loadPanel.hide();
        }).catch(function(err){
            console.log(err);
            DevExpress.ui.notify( 'ERRROR DE COMUNICACION CON EL SERVIDOR INTENTE NUEVAMANTE', 'error', 3000);
        })
        
    }
}


setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);