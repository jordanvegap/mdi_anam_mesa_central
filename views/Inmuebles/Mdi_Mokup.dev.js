SalesDashboard.dashboardModel = function() {
    var self = this;
    this.Nombre,this.Apellido,this.Estatus = null;
    var gallery = [
        "./images/img/build1.png",
        "./images/img/bglogin.jpg",
        "./images/img/swiper_2.jpg"
    ];

    var _cscEmpKey = 'EMPLEADO_CSC_EMPLEADO';

    self.init = function() {
        
        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es-mx";}
        /** SIEMPRE AGREGAR ESTA LINEA */

        /*TOOLBAR */
        $("#Toolbar_Prueba").dxToolbar({
            items: [
                /** Busqueda por Numero Externo */
                {
                        location: 'before',
                        template: function() {
                            return $("<div class='toolbar-label'><b>" + Globalize.formatMessage("Pais") + "</div>");
                        }
                },{
                    location: 'before',
                    widget: 'dxTextBox'              
                },{
                    location: 'before',
                    template: function() {
                        return $("<div class='toolbar-label'><b>" + Globalize.formatMessage("Region") + "</div>");
                    }
            },{
                location: 'before',
                widget: 'dxTextBox'              
            },
            {
                location: 'before',
                template: function() {
                    return $("<div class='toolbar-label'><b>" + Globalize.formatMessage("Estado") + "</div>");
                }
        },{
            location: 'before',
            widget: 'dxTextBox'              
        },
        {   
            location: 'before',
            template: function() {
                return $("<div class='toolbar-label'><b>" + Globalize.formatMessage("Inmueble") + "</div>");
            }
        },{
        dataField: "CAT_PROVEEDOR_INFRA_CSC",
        location: 'before',
        widget: 'dxSelectBox',
        Options: {
            dataSource: new DevExpress.data.DataSource({
                    loadMode: "raw", paginate: false,   
                    load: async function () {
                        try {
                            var allServicios = {Tbl:"SAMT_CAT_PROVEEDORES_INFRA",NACTIVE:"CAT_PROVEEDOR_INFRA_ACTIVO",NDEFAULT:"CAT_PROVEEDOR_INFRA_ACTIVO"};
                            return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
            }),
            displayExpr: "CAT_PROVEEDOR_INFRA_RAZONSOCIALNOMBRE",
            valueExpr: "CAT_PROVEEDOR_INFRA_CSC",
            readOnly: false,
            onValueChanged: function (e) {
                var newValue = e.value;
                      
            }
        },              
    },{
        location: 'before',
        widget: 'dxButton',
        options: {
            text: Globalize.formatMessage("ButtonAceptar"),
            onClick: function(e) {
                console.log('Apretaste el boton de aceptar');
            }
        }
    },{
        location: 'before',
        widget: 'dxButton',
        options: {
            text: Globalize.formatMessage("ButtonCancelar"),
            onClick: function(e) {
                console.log('Apretaste el boton de cancelar');
            }
        }
    },
                /** Busqueda por Numero Externo */
            ]
        });
        /*TOOLBAR*/

        /*TOOLBAR FORMULARIO*/
        $("#TOOLBAR_FORMULARIO").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:10,
            cssClass: "frmCls",
            items:[{
                    editorType: "dxTextBox",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("Pais")
                }
                },{
                    editorType: "dxTextBox",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("Region")
                    }
                },{
                    editorType: "dxTextBox",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("Estado")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "INM_CSCINMUEBLE",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_INMUEBLES",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "INM_CLVE_INMUEBLE",
                        valueExpr: "INM_CSCINMUEBLE",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("Inmueble")
                    },
                },
                {
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonAceptar"),
                        useSubmitBehavior: true,
                        onClick: function(e) {
                            console.log('Apretaste el Boton alta');
                        }
                    },
                    colSpan:1
                    },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    colSpan: 1,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonCancelar"),
                        onClick: function(e) {
                            console.log('Se modifico con exito la informacion general');
                        }
                    }
                    }]
        });
        /*TOOLBAR FORMULARIO*/

        /** Formulario PRUEBA */
        $("#FORMULARIO_PRUEBA").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:6,
            cssClass: "frmCls",
            items:[{
                    colSpan: 6,
                    template: "<div class='heading_InnerFrm'><h2>" + Globalize.formatMessage("PruebaHeader") + "</h2></div>",
                },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonAlta"),
                        useSubmitBehavior: true,
                        icon: "./images/Icons/Folder-Accept128.png",
                        onClick: function(e) {
                            console.log('Apretaste el Boton alta');
                        }
                    },
                    colSpan:1
                    },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    disabled: true,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonAceptar"),
                        onClick: function(e) {
                            console.log('Apretaste el Boton alta');
                        }
                    },
                    colSpan:1
                    },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    colSpan: 2,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonModificar"),
                        icon: "./images/Icons/order256.png",
                        onClick: function(e) {
                            console.log('Se modifico con exito la informacion general');
                        }
                    }
                    },{
                        itemType: "button",
                        horizontalAlignment: "right",
                        colSpan: 3,
                        buttonOptions: {
                            text: Globalize.formatMessage("ButtonEliminar"),
                            icon: "./images/Icons/CancelIcon.png",
                            onClick: function(e) {
                                console.log('Se eliminó con exito la informacion general');
                            }
                        }
                    },{
                        itemType: "button",
                        horizontalAlignment: "left",
                        disabled: true,
                        buttonOptions: {
                            text: Globalize.formatMessage("ButtonCancelar"),
                            useSubmitBehavior: true,
                            onClick: function(e) {
                                console.log('Apretaste el Boton alta');
                            }
                        },
                        colSpan:1
                        },{
                    editorType: "dxSelectBox",
                    dataField: "INM_CLVE_INMUEBLE",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_INMUEBLES",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "INM_CLVE_INMUEBLE",
                        valueExpr: "INM_CSCINMUEBLE",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    colSpan:2,
                    label:{
                        text:  "_ " + Globalize.formatMessage("SelectClave")
                    },
                },{
                    editorType: "dxTextBox",
                    dataField: "???",
                    colSpan:1,
                    label:{
                        text: Globalize.formatMessage("TextNota")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "INM_ESTATUS_CSC",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_ESTATUS_INMUEBLES",NACTIVE:"ESTATUS_INMUEBLES_ACTIVO",NDEFAULT:"ESTATUS_INMUEBLES_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "ESTATUS_INMUEBLES_IDIOMA1",
                        valueExpr: "INM_ESTATUS_CSC",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectStatus")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "INM_TIPO_ESTATUS_FECHA",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_INMUEBLES",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "INM_TIPO_ESTATUS_FECHA",
                        valueExpr: "INM_CSCINMUEBLE",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectStatusDate")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "INM_TIPO_ESTATUS_CSC",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_ESTATUS_INMUEBLE",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_ESTATUS_INMUEBLES_IDIOMA1",
                        valueExpr: "INM_TIPO_ESTATUS_CSC",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectOperativo")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TCT_CSCTIPOCONTRATA",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_CONTRATO_INMUEBLE",NACTIVE:"TIPO_CONTRATO_ACTIVO",NDEFAULT:"TIPO_CONTRATO_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_CONTRATO_IDIOMA1",
                        valueExpr: "TCT_CSCTIPOCONTRATA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectContratacion")
                    },
                },{
                    editorType: "dxSelectBox",
                    dataField: "CSC_TIPO_IMPORTANCIA",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_IMPORTANCIA_INMUEBLE",NACTIVE:"TIPO_IMPORTANCIA_ACTIVO",NDEFAULT:"TIPO_IMPORTANCIA_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_IMPORTANCIA_IDIOMA1",
                        valueExpr: "CSC_TIPO_IMPORTANCIA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectImporancia")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TMU_CSCTIPOINMUEBLE",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_INMUEBLE",NACTIVE:"TIPO_INMUEBLE_ACTIVO ",NDEFAULT:"TIPO_INMUEBLE_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_INMUEBLE_IDIOMA1",
                        valueExpr: "TMU_CSCTIPOINMUEBLE",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectInmueble")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TAC_CSCTIPOACCESO",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_INMUEBLE",NACTIVE:"TIPO_INMUEBLE_ACTIVO ",NDEFAULT:"TIPO_INMUEBLE_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_INMUEBLE_IDIOMA1",
                        valueExpr: "TAC_CSCTIPOACCESO",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectAccessType")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TUSO_CSC_TIPO_USOSUELO",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_USO_SUELO_INMUEBLE",NACTIVE:"TIPO_USO_SUELO_ACTIVO",NDEFAULT:"TIPO_USO_SUELO_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_USO_SUELO_IDIOMA1",
                        valueExpr: "TUSO_CSC_TIPO_USOSUELO",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectUsoSuelo")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_DESCRIPCION_USO_SUELO",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("TextUsoSuelo")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "???",
                    colSpan:3,
                    editorOptions: { 
                        items: [],
                        searchEnabled: true,
                        value: ""
                    },
                    label:{
                        text: Globalize.formatMessage("SelectAplicacion")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "INM_TIPO_NIVEL_SERVICIO_CSC",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_NIVEL_SERVICIO",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_NIVEL_SERV_IDIOMA1",
                        valueExpr: "INM_TIPO_NIVEL_SERVICIO_CSC",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("SelectNivelServ")
                    }
            }]
        });

        /** Formulario PRUEBA */

        /*ESPACIO*/

        /*Segundo formulario*/
        
        $("#SegundoFormulario").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:1,
            items:[{
                itemType: "group",
                colCount:6,
                cssClass: "frmCls",
                items: [{
                    colSpan: 6,
                    template: "<div class='heading_InnerFrm'><h2></h2></div>",
                },{
                    editorType: "dxSelectBox",
                    colSpan:3,
                    dataField: "PAI_CSCPAIS",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_PAISES",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "PAI_DESCPAIS",
                        valueExpr: "PAI_CSCPAIS",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label: { 
                        text: Globalize.formatMessage("Pais")
                    },
                },{
                    editorType: "dxSelectBox",
                    colSpan: 3,
                    dataField: "EDO_CSCESTADO",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_ESTADOS",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "EDO_DESCESTADO",
                        valueExpr: "EDO_CSCESTADO",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label: { 
                        text: Globalize.formatMessage("Estado")
                    },
                },{
                    colSpan: 3,
                    dataField: "INM_MUNICIPIO",
                    label: { 
                        text: Globalize.formatMessage("TextMunicipio")
                    },
                },{
                    colSpan: 3,
                    dataField: "INM_COLONIA",
                    label: { 
                        text: Globalize.formatMessage("TextColonia")
                    },
                },{
                    colSpan: 3,
                    dataField: "INM_CALLENUMINMUEBLE",
                    label: { 
                        text: Globalize.formatMessage("TextCalle")
                    },
                },{
                    colSpan: 3,
                    dataField: "INM_LONGITUD",
                    label: { 
                        text: Globalize.formatMessage("TextLonguitud")
                    },
                },{
                    colSpan: 2,
                    dataField: "INM_CODIGOPOSTAL",
                    label: { 
                        text: Globalize.formatMessage("NumberCP")
                    },
                },{
                    colSpan: 1,
                    dataField: "INM_REFCIAUBICACION",
                    label: { 
                        text: Globalize.formatMessage("TextReferencias")
                    },
                },{
                    colSpan: 2,
                    dataField: "INM_LATITUD",
                    label: { 
                        text: Globalize.formatMessage("TextLatitud")
                    },
                },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonCoordenadas"),
                        useSubmitBehavior: true,
                        icon: "./images/Icons/Ubicacion.png",
                        onClick: function(e) {
                            console.log('Se encontró la ubicacion?');
                        },
                    colSpan:1
                    }
                },]
            }]
        });
        /*Segundo formulario*/

        /*GALERIA*/
        $("#gallery").dxGallery({
            dataSource: gallery,
            height: 300,
            loop: true,
            slideshowDelay: 3000,
            showNavButtons: true,
            showIndicator: true
        }).dxGallery("instance");
        /*GALERIA*/

        /*Tab prueba*/
        $("#Mod_GD_TabPrincipal").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            dataSource: [
                { title: Globalize.formatMessage("TabZonificacion"), template: "tab1" },
                { title: Globalize.formatMessage("TabTerreno"), template: "tab2" },
                { title: Globalize.formatMessage("TabConstruccion"), template: "tab3"},
                { title: Globalize.formatMessage("TabPoblacion"), template: "tab4" },
                { title: Globalize.formatMessage("TabInfraCivil"), template: "tab5" },
                { title: Globalize.formatMessage("TabInfraTec"), template: "tab6" },
                { title: Globalize.formatMessage("TabEspecialidades"), template: "tab7" },
                { title: Globalize.formatMessage("TabDueño"), template: "tab8" },
            ],
            
        }); 
        /*Tab prueba*/

        /*FORMULARIO ZONIFICACION*/
        $("#FormularioZonificacion").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:9,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                colSpan: 2,
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton Modificar en Zonificacion');
                    }
                }
            },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    disabled: true,
                    colSpan: 2,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonAceptar"),
                        onClick: function(e) {
                            console.log('Apretaste el Boton alta');
                        }
                    },
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        useSubmitBehavior: true,
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Apretaste el Boton Eliminar en Zonificacion');
                        }
                    },
                    colSpan:2
                },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    disabled: true,
                    colSpan: 3,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonCancelar"),
                        onClick: function(e) {
                            console.log('Apretaste el Boton alta');
                        }
                    }
                },
                {
                    editorType: "dxSelectBox",
                    dataField: "SAM_CSCZONIFICA_INMUEBLE",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_ZONIFICA_INMUEBLE",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "ZONIFICA_INMUE_IDIOMA1",
                        valueExpr: "SAM_CSCZONIFICA_INMUEBLE",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text:Globalize.formatMessage("TabZonificacion")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "IMP_CSC_VISUAL",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_IMPACTO_VISUAL_INMUEBLE",NACTIVE:"EMP_CSC_EMPRESA_HOST" ,NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "IMPACTO_VISUAL_IDIOMA1",
                        valueExpr: "IMP_CSC_VISUAL",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("ImpactoVisual")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_CONSTR_DOMINANTE_EN_CALLE",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("ConsDominante")
                    }
                },{
                    editorType: "dxSelectBox",
                    colSpan:3,
                    dataField: "TCL_CSCTIPOCLIMA",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_CLIMA_INMUEBLE",NACTIVE:"TIPO_CLIMA_INMUE_ACTIVO",NDEFAULT:"TIPO_CLIMA_INMUE_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_CLIMA_INMUE_IDIOMA1",
                        valueExpr: "TCL_CSCTIPOCLIMA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("Clima")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_INDICE_DE_SATURACION_EN_LA_ZONA",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("SaturacionZona")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_DECINDAD_DE_POBLACION",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("DensidadPoblacion")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TMZ_CSC_TIPOS_MANZANA",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_MANZANA_INMUEBLE",NACTIVE:"TIPO_MANZANA_ACTIVO",NDEFAULT:"TIPO_MANZANA_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_MANZANA_IDIOMA1",
                        valueExpr: "TMZ_CSC_TIPOS_MANZANA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("Manzana")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_CONTAMINACION_AMBIENTAL",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("ContaminacionAmb")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_SERVICIOS_PUBLICOS",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("ServiciosPublicos")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TAMT_CSC_TAMANIO_INMU",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_TAMANIO_INMUE_ZONA",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TAM_ZONA_INM_IDIOMA1",
                        valueExpr: "TAMT_CSC_TAMANIO_INMU",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("Tamaño")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_EQUIPAMIENTO_URBANO",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("Equipamiento")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "???",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("ClasZona")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TSEG_CSC_TSEGURIDAD",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_SEGURIDAD_INMUEBLE",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_SEG_INMU_IDIOMA1",
                        valueExpr: "TSEG_CSC_TSEGURIDAD",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("Seguridad")
                    }
            },{
                editorType: "dxTextBox",
                dataField: "INM_IMPORTANCIA_Y_COND_AVENIDA",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("ImportanciaAv")
                }
            },{
                editorType: "dxSelectBox",
                dataField: "TVA_CSCTIPOS_VIAS_DE_ACCESO",
                colSpan:3,
                editorOptions: {
                    dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_TIPO_VIAS_DE_ACESO",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                    }),
                    displayExpr: "VIAS_DE_ACCESO_IDIOMA1",
                    valueExpr: "TVA_CSCTIPOS_VIAS_DE_ACCESO",
                    readOnly: false,
                    onValueChanged: function (e) {
                        var newValue = e.value;
                              
                    }
                },
                label:{
                    text: Globalize.formatMessage("ViasAcceso") 
                }
        }]
        });
        /*FORMULARIO ZONIFICACION*/

        /*ESPACIO*/

        /*FORMUARIO TERRENO*/
        $("#FORMULARIO_TERRENO").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:9,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton Modificar en Terreno');
                    }
                },
                colSpan:2
                },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    disabled: true,
                    colSpan: 2,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonCancelar"),
                        onClick: function(e) {
                            console.log('Apretaste el Boton alta');
                        }
                    }
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        useSubmitBehavior: true,
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Apretaste el Boton Eliminar en Terreno');
                        }
                    },
                    colSpan:2
                },{
                    itemType: "button",
                    horizontalAlignment: "left",
                    disabled: true,
                    colSpan: 3,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonCancelar"),
                        onClick: function(e) {
                            console.log('Apretaste el Boton alta');
                        }
                    }
                },
                {
                    editorType: "dxNumberBox",
                    dataField: "IM_DIMENCION",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("SupTerreno")
                    }
                },{
                    editorType: "dxSelectBox",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "UME_SIMBOLO",
                        valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    colSpan:1,
                },{
                    editorType: "dxNumberBox",
                    dataField: "INM_NUMERO_DE_FRENTES",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("#Frentes")
                    },
                },{
                    editorType: "dxNumberBox",
                    dataField: "UME_CSCUMDE_LATERAL_IZQUIERDO/IM_LATERAL_IZQUIERDO",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("LatIzquierdo")
                    },
                },{
                    editorType: "dxSelectBox",
                    colSpan:1,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:" UME_CSC_UM_INTERNACIONALES",NDEFAULT:" UME_CSC_UM_INTERNACIONALES"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "UME_SIMBOLO",
                        valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                },{
                    editorType: "dxSelectBox",
                    dataField: "PTE_CSCTIPO_PEN_TERRENO",
                    colSpan:3, 
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_PENDIENTE_INMUE",NACTIVE:"TIPO_PENDIENTE_ACTIVO",NDEFAULT:"TIPO_PENDIENTE_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_PENDIENTE_IDIOMA1",
                        valueExpr: "PTE_CSCTIPO_PEN_TERRENO",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("Pendiente")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_CARACTERISTICAS_PANORAMICAS",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("CaracPanoramicas")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "UME_CSCUMDE_FONDO/IME_FONDO",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("Fondo")
                    }
                },{
                    editorType: "dxSelectBox",
                    colSpan:1,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:" UME_CSC_UM_INTERNACIONALES",NDEFAULT:" UME_CSC_UM_INTERNACIONALES"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "UME_SIMBOLO",
                        valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                },{
                    editorType: "dxSelectBox",
                    dataField: "TFR_CSCFORMA",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_FORMA_TERRENO_IMMUE",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_FORMA_INMUE_IDIOMA1",
                        valueExpr: "TFR_CSCFORMA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text:Globalize.formatMessage("Forma")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_INTENSIDAD_DE_CONSTRUCCION",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("IntensidadCons")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "???",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("FrenteCalle")
                    }
                },{
                    editorType: "dxSelectBox",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:" UME_CSC_UM_INTERNACIONALES",NDEFAULT:" UME_CSC_UM_INTERNACIONALES"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "UME_SIMBOLO",
                        valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
            },{
                editorType: "dxSelectBox",
                dataField: "TOP_CSC_ORIPREDOM",
                colSpan:3,
                editorOptions: {
                    dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_TIPO_ORIENTACION_INMUEBLE",NACTIVE:"EMP_CSC_EMPRESA_HOST" ,NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                    }),
                    displayExpr: "TIPO_ORIENTACION_INMUE_IDIOMA1",
                    valueExpr: "TOP_CSC_ORIPREDOM",
                    readOnly: false,
                    onValueChanged: function (e) {
                        var newValue = e.value;
                              
                    }
                },
                label:{
                    text: Globalize.formatMessage("Orientacion")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_SERVIDUMBRES_Y_RESTRICCIONES",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("ServRestricciones")
                }
        },{
            editorType: "dxNumberBox",
            dataField: "UME_CSCUMDE_LATERAL_DERECHO/IM_LATERAL_DERECHO",
            colSpan:2,
            label:{
                text: Globalize.formatMessage("LatDerecho")
            }
        },{
            editorType: "dxSelectBox",
            colSpan:1,
            editorOptions: {
                dataSource: new DevExpress.data.DataSource({
                        loadMode: "raw", paginate: false,   
                        load: async function () {
                            try {
                                var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:" UME_CSC_UM_INTERNACIONALES",NDEFAULT:" UME_CSC_UM_INTERNACIONALES"};
                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                }),
                displayExpr: "UME_SIMBOLO",
                valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                readOnly: false,
                onValueChanged: function (e) {
                    var newValue = e.value;
                          
                }
            },
        },{
            editorType: "dxTextBox",
            dataField: "INM_TOPOGRAFIA_CONFIGURACION",
            colSpan:3,
            label:{
                text: Globalize.formatMessage("TopografiaConf")
            }
        },{
            editorType: "dxTextBox",
            dataField: "INM_USO_ACTUAL",
            colSpan:3,
            label:{
                text: Globalize.formatMessage("UsoActual")
            }
        },{
            editorType: "dxTextBox",
            dataField: "???",
            colSpan:3,
            editorOptions: { 
                items: [],
                searchEnabled: true,
                value: ""
            },
            label:{
                text: Globalize.formatMessage("InstruccionAcceso")
            }
        }]
    });

        /*FORMULARIO TERRENO*/ 

        /*ESPACIO*/
        
        /*FORMULARIO CONSTRUCCION*/
        
        $("#FORMULARIO_CONSTRUCCION").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:9,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton Modificar en Poblacion atendida');
                    }
                },
                colSpan:4
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        useSubmitBehavior: true,
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Apretaste el Boton Eliminar en Poblacion atendida');
                        }
                    },
                    colSpan:5
                },
                {
                    editorType: "dxNumberBox",
                    dataField: "IM_CONSTRUCCION",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("SupConstruccion")
                    }
                },{
                    editorType: "dxSelectBox",
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:" UME_CSC_UM_INTERNACIONALES",NDEFAULT:" UME_CSC_UM_INTERNACIONALES"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "UME_SIMBOLO",
                        valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    colSpan:1,
                },{
                    editorType: "dxNumberBox",
                    dataField: "INM_CAJONES_DE_ESTACIONAMIENTOS",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("CajEstacionamiento")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "LFD_CSCLOCFISDISPBLE",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_AREADISPONIBLE_INMUE",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "ARE_DISPONIBLE_INMUE_IDIOMA1",
                        valueExpr: "LFD_CSCLOCFISDISPBLE",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("AreaDisponible")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "UME_CSCUMDE_EDAD_CONSTRUCCION/IM_EDAD_CONSTRUCCION",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("EdadConstruccion")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "INM_NUMERO_DE_NIVELES",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("#Niveles")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TCN_CSC_TIPOCONST",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_CONSTRUCION_INMUE",NACTIVE:"TIPO_CONSTRUCCION_ACTIVO" ,NDEFAULT:"TIPO_CONSTRUCCION_DEFAULT"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_CONSTRUCCION_IDIOMA1",
                        valueExpr: "TCN_CSC_TIPOCONST",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("TipoConstruccion")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "UME_CSCUMDE_EDAD_ULTIMA_REMODELACION/IM_EDAD_ULTIMA_REMODELACION",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("UltimaRemodelacion")
                    }
                },{
                    editorType: "dxSelectBox",
                    colSpan:1,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOSTS"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "UME_SIMBOLO",
                        valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_UNIDADES_SUSCEPTIBLES_RENTA",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("#ARentarse")
                    }
                },{
                    editorType: "dxSelectBox",
                    dataField: "TRM_CSC_TIPO_REMODELA",
                    colSpan:3,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_TIPO_REMODELACION_INMUEBLES",NACTIVE:"TIPO_REMODELA_ACTIVO",NDEFAULT:"TIPO_REMODELA_ACTIVO"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "TIPO_REMODELA_IDIOMA1",
                        valueExpr: "TRM_CSC_TIPO_REMODELA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
                    label:{
                        text: Globalize.formatMessage("TipoRemodelacion")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "UME_CSCUMDE_VIDA_UTIL_REMANENTE",
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("VidaUtil")
                    }
                },{
                    editorType: "dxSelectBox",
                    colSpan:1,
                    editorOptions: {
                        dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    try {
                                        var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOSTS"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                        }),
                        displayExpr: "UME_SIMBOLO",
                        valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                        readOnly: false,
                        onValueChanged: function (e) {
                            var newValue = e.value;
                                  
                        }
                    },
            },{
                editorType: "dxSelectBox",
                dataField: "TARQ_CSC_TIPO_PRYARQUITECTO",
                colSpan:3,
                editorOptions: {
                    dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_TIPO_PROYECTO_INMUEBLES",NACTIVE:"EMP_CSC_EMPRESA_HOST" ,NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                    }),
                    displayExpr: "TIPO_PROYECTO_IDIOMA1",
                    valueExpr: "TARQ_CSC_TIPO_PRYARQUITECTO",
                    readOnly: false,
                    onValueChanged: function (e) {
                        var newValue = e.value;
                              
                    }
                },
                label:{
                    text: Globalize.formatMessage("TipoProyecto")
                }
            },{
                editorType: "dxSelectBox",
                dataField: "TST_CSCTIPOESTRUC",
                colSpan:3,
                editorOptions: {
                    dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw", paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_TIPO_ESTRUCTURA_INMUEBLE",NACTIVE:"TIPO_ESTRUCTURA_INMUE_ACTIVO",NDEFAULT:"TIPO_ESTRUCTURA_INMUE_DEFAULT"};
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                    }),
                    displayExpr: "TIPO_ESTRUCTURA_INMUE_IDIOMA1",
                    valueExpr: "TST_CSCTIPOESTRUC",
                    readOnly: false,
                    onValueChanged: function (e) {
                        var newValue = e.value;
                              
                    }
                },
                label:{
                    text: Globalize.formatMessage("TipoEstructura")
                }
        },{
            editorType: "dxNumberBox",
            dataField: "UME_CSCUMDE_VIDA_TOTAL",
            colSpan:2,
            label:{
                text: Globalize.formatMessage("VidaTotal")
            }
        },{
            editorType: "dxSelectBox",
            editorOptions: {
                dataSource: new DevExpress.data.DataSource({
                        loadMode: "raw", paginate: false,   
                        load: async function () {
                            try {
                                var allServicios = {Tbl:"SAMT_UNIDADES_MEDIDAS",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOSTS"};
                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                }),
                displayExpr: "UME_SIMBOLO",
                valueExpr: "UME_CSC_UNIDADES_MEDIDA",
                readOnly: false,
                onValueChanged: function (e) {
                    var newValue = e.value;
                          
                }
            },
        },{
            editorType: "dxSelectBox",
            dataField: "INM_TIPO_ESTATUS_CSC",
            colSpan:3,
            editorOptions: {
                dataSource: new DevExpress.data.DataSource({
                        loadMode: "raw", paginate: false,   
                        load: async function () {
                            try {
                                var allServicios = {Tbl:"SAMT_TIPO_ESTATUS_INMUEBLE",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                }),
                displayExpr: "TIPO_ESTATUS_INMUEBLES_IDIOMA1",
                valueExpr: "INM_TIPO_ESTATUS_CSC",
                readOnly: false,
                onValueChanged: function (e) {
                    var newValue = e.value;
                          
                }
            },
            label:{
                text: Globalize.formatMessage("CalidadProyecto")
            }
        },{
            editorType: "dxSelectBox",
            dataField: "TCI_CONSERVA_INMUEBLE_CSC",
            colSpan:3,
            editorOptions: {
                dataSource: new DevExpress.data.DataSource({
                        loadMode: "raw", paginate: false,   
                        load: async function () {
                            try {
                                var allServicios = {Tbl:"SAMT_TIPO_ESTADO_DE_CONSERVACION_INMUEBLE",NACTIVE:"EMP_CSC_EMPRESA_HOST",NDEFAULT:"EMP_CSC_EMPRESA_HOST"};
                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',allServicios,getJSON(DeveloperType).ApiGeneral.token).then((dataInsert)=>{
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
                }),
                displayExpr: "ESTADO_CONSERVACION_IDIOMA1",
                valueExpr: "TCI_CONSERVA_INMUEBLE_CSC",
                readOnly: false,
                onValueChanged: function (e) {
                    var newValue = e.value;
                          
                }
            },
            label:{
                text: Globalize.formatMessage("EstadoConservacion")
            }
        }]
    });
        /*FORMULARIO CONSTRUCCION*/

        /*POBLACION ATENDIDA*/
        $("#BOTONES_POB").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:6,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonAlta"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/Folder-Accept128.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton alta');
                    }
                },
                colSpan:1
                },{
                itemType: "button",
                horizontalAlignment: "left",
                colSpan: 2,
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Se modifico con exito la informacion general');
                    }
                }
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    colSpan: 3,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Se eliminó con exito la informacion general');
                        }
                    }
                }]
            });
        $("#Mod_GD_PobAten").dxDataGrid({
            grouping: {
                contextMenuEnabled: true
            },
            showBorders: true,
            rowAlternationEnabled: true,
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
            showBorders: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            dataSource: {
                store: {
                    type: 'array',
                    key: _cscEmpKey,
                }
            },
            columns: [
                {
                    caption: Globalize.formatMessage("TextMunicipio"),
                    dataField: "INM_MUNICIPIO",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("TabPoblacion"),
                    dataField: "INM_DECINDAD_DE_POBLACION",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Comentarios"),
                    dataField: "INM_COMENTARIOS",
                    alignment: "center", 
                }]
        });
        /*POBLACION ATENDIDA*/

        /*INFRAESTRUCTURA CIVIL*/
        $("#BOTONES_INFRA_CIVIL").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:6,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonAlta"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/Folder-Accept128.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton alta');
                    }
                },
                colSpan:1
                },{
                itemType: "button",
                horizontalAlignment: "left",
                colSpan: 2,
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Se modifico con exito la informacion general');
                    }
                }
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    colSpan: 3,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Se eliminó con exito la informacion general');
                        }
                    }
                }]
        });
        $("#Mod_GD_InfraCivil").dxDataGrid({
            grouping: {
                contextMenuEnabled: true
            },
            showBorders: true,
            rowAlternationEnabled: true,
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
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            dataSource: {
                store: {
                    type: 'array',
                    key: _cscEmpKey,
                }
            },
            columns: [
                {
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center", 
                },{
                    dataField: "EMPLEADO_RFC",
                    alignment: "center", 
                },{
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                }]
        });
        /*INFRAESTRUCTURA CIVIL*/

        /*INFRAESTRUCTURA TECNOLOGICA*/
        $("#BOTONES_INFRA_TEC").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:6,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonAlta"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/Folder-Accept128.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton alta');
                    }
                },
                colSpan:1
                },{
                itemType: "button",
                horizontalAlignment: "left",
                colSpan: 2,
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Se modifico con exito la informacion general');
                    }
                }
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    colSpan: 3,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Se eliminó con exito la informacion general');
                        }
                    }
                }]
        });
        $("#Mod_GD_InfraTecnologica").dxDataGrid({
            grouping: {
                contextMenuEnabled: true
            },
            showBorders: true,
            rowAlternationEnabled: true,
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
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            dataSource: {
                store: {
                    type: 'array',
                    key: _cscEmpKey,
                }
            },
            columns: [
                {
                    caption: Globalize.formatMessage("TipoTec"),
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Comentarios"),
                    dataField: "EMPLEADO_RFC",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Porcentaje"),
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                }]
        });
        /*INFRAESTRUCTURA TECNOLOGICA*/

        /*FORMULARIO ESPECIALIDADES*/
        $("#BOTONES_ESPECIALIDADES1").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:6,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonAlta"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/Folder-Accept128.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton alta');
                    }
                },
                colSpan:1
                },{
                itemType: "button",
                horizontalAlignment: "left",
                colSpan: 2,
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Se modifico con exito la informacion general');
                    }
                }
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    colSpan: 3,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Se eliminó con exito la informacion general');
                        }
                    }
                }]
            });
        $("#Mod_GD_Especialidad1").dxDataGrid({
            showBorders: true,
            rowAlternationEnabled: true,
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
            allowColumnReordering: false,
            rowAlternationEnabled: true,
            showBorders: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always", // or "onScroll" | "always" | "never"
                columnRenderingMode: "virtual"
            },
            dataSource: {
                store: {
                    type: 'array',
                    key: _cscEmpKey,
                }
            },
            columns: [
                {
                    caption: Globalize.formatMessage("ServicioOfrece"),
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Comentarios"),
                    dataField: "EMPLEADO_RFC",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Porcentaje"),
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                }]
        });
        $("#BOTONES_ESPECIALIDAD2").dxForm({
            readOnly: false,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:6,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonAlta"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/Folder-Accept128.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton alta');
                    }
                },
                colSpan:1
                },{
                itemType: "button",
                horizontalAlignment: "left",
                colSpan: 2,
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Se modifico con exito la informacion general');
                    }
                }
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    colSpan: 3,
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Se eliminó con exito la informacion general');
                        }
                    }
                }]
        });
        $("#Mod_GD_Especialidad2").dxDataGrid({
            selection: {
                mode: "single"
            },
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            height: '100%',
            paging: {
                enabled: true,
                pageIndex: 0,
                pageSize: 20
            },
            headerFilter: { visible: true },
            showBorders: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            scrolling: {
                useNative: true,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always", // or "onScroll" | "always" | "never",
            },
            dataSource: {
                store: {
                    type: 'array',
                    key: _cscEmpKey,
                }
            },
            columns:[{
                caption: Globalize.formatMessage("Requisicion"),
                dataField: "EMPLEADO_ID_EXTERNO",
                alignment: "center", 
                
                },{
                    caption: Globalize.formatMessage("Lunes"),
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center",
                    
                },{
                    caption: Globalize.formatMessage("Lunes") + " " + Globalize.formatMessage("Inicia"),
                    dataField: "EMPLEADO_RFC",
                    alignment: "center", 
                    
                },{
                    caption: Globalize.formatMessage("Lunes") +  " " + Globalize.formatMessage("Finaliza"),
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                    
                },{
                    caption: Globalize.formatMessage("Martes"),
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center", 
                    
                },{
                    caption: Globalize.formatMessage("Martes") +  " " +  Globalize.formatMessage("Inicia"),
                    dataField: "EMPLEADO_RFC",
                    alignment: "center",
                     
                },{
                    caption: Globalize.formatMessage("Martes") +  " " + Globalize.formatMessage("Finaliza"),
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                    
                },{
                    caption: Globalize.formatMessage("Miercoles"),
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center",
                     
                },{
                    caption: Globalize.formatMessage("Miercoles") +  " " + Globalize.formatMessage("Inicia"),
                    dataField: "EMPLEADO_RFC",
                    alignment: "center",
                     
                },{
                    caption: Globalize.formatMessage("Miercoles") +  " " + Globalize.formatMessage("Finaliza"),
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                    
                },{
                    caption: Globalize.formatMessage("Jueves"),
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Jueves") +  " " + Globalize.formatMessage("Inicia"),
                    dataField: "EMPLEADO_RFC",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Jueves") +  " " + Globalize.formatMessage("Finaliza"),
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Viernes"),
                    dataField: "EMPLEADO_ID_EXTERNO",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Viernes") +  " " + Globalize.formatMessage("Inicia"),
                    dataField: "EMPLEADO_RFC",
                    alignment: "center", 
                },{
                    caption: Globalize.formatMessage("Viernes") +  " " + Globalize.formatMessage("Finaliza"),
                    dataField: "EMPLEADO_PEI",
                    alignment: "center", 
                }]
        });
        /*FORMULARIO ESPECIALIDADES*/

        /*DUEÑO O CONTACTO*/
        $("#Mod_TP_TabDueño").dxTabPanel({
            labelLocation: "left",
            animationEnabled: true,
            deferRendering: false,
            repaintChangesOnly: false,
            dataSource: [
                { title: Globalize.formatMessage("Propietario"), template: "tab1" },
                { title: Globalize.formatMessage("1stContact"), template: "tab2" },
                { title: Globalize.formatMessage("2ndContact"), template: "tab3"}
            ],
        });

        $("#FORMULARIO_PROPIETARIO").dxForm({
            readOnly: true,
            labelLocation: "left", // or "left" | "right"
            minColWidth: 100,
            width:'100%',
            colCount:9,
            items:[{
                itemType: "button",
                horizontalAlignment: "left",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonModificar"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/order256.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton Modificar en Poblacion atendida');
                    }
                },
                colSpan:4
                },{
                    itemType: "button",
                    horizontalAlignment: "right",
                    buttonOptions: {
                        text: Globalize.formatMessage("ButtonEliminar"),
                        useSubmitBehavior: true,
                        icon: "./images/Icons/CancelIcon.png",
                        onClick: function(e) {
                            console.log('Apretaste el Boton Eliminar en Poblacion atendida');
                        }
                    },
                    colSpan:5
                },
                {
                    editorType: "dxTextBox",
                    dataField: "INM_NOMBRE_CONTACT_A",
                    colSpan:6,
                    label:{
                        text: Globalize.formatMessage("NombreRazon")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_COMENTARIOS_CONTACT_A",
                    editorOptions: { 
                        items: [],
                        searchEnabled: true,
                        value: ""
                    },
                    colSpan:2,
                    label:{
                        text: Globalize.formatMessage("Comentarios")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "INM_CP_CONACT_A",
                    maxlenght: 5,
                    colSpan:1,
                    label:{
                        text: Globalize.formatMessage("NumberCP")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "INM_TEL1_CONTACT_A",
                    maxlenght: 10,
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("Telefono1")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "INM_TEL2_CONTACT_A",
                    maxlenght: 10,
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("Telefono2")
                    }
                },{
                    editorType: "dxNumberBox",
                    dataField: "INM_TEL3_CONTACT_A",
                    maxlenght: 10,
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("Telefono3")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_EDO_CONTACT_A",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("Estado")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_MUNICIPIO_CONTACT_A",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("TextMunicipio")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_PAIS_CONTACT_A",
                    colSpan:3,
                    label: {
                        text: Globalize.formatMessage("Pais")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_COLONIA_CONTACT_A",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("TextColonia")
                    }
                },{
                    editorType: "dxTextBox",
                    dataField: "INM_CALLE_CONTACT_A",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("TextCalle")
                    }
                },{
                    editorType: "dxTextArea",
                    dataField: "INM_REFERENCIA_CONTACT_A",
                    colSpan:3,
                    label:{
                        text: Globalize.formatMessage("TextReferencias")
                    }
                }]
    });
    /*FORMULARIO PROPIETARIO*/

    /*PRIMER CONTACTO*/
    $("#PRIMER_CONTACTO").dxForm({
        readOnly: true,
        labelLocation: "left", // or "left" | "right"
        minColWidth: 100,
        width:'100%',
        colCount:9,
        items:[{
            itemType: "button",
            horizontalAlignment: "left",
            buttonOptions: {
                text: Globalize.formatMessage("ButtonModificar"),
                useSubmitBehavior: true,
                icon: "./images/Icons/order256.png",
                onClick: function(e) {
                    console.log('Apretaste el Boton Modificar en Primer contacto');
                }
            },
            bindingOptions:{

            },
            colSpan:4
            },{
                itemType: "button",
                horizontalAlignment: "right",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonEliminar"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/CancelIcon.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton Eliminar en Poblacion atendida');
                    }
                },
                colSpan:5
            },
            {
                editorType: "dxTextBox",
                dataField: "INM_NOMBRE_CONTACT_B",
                colSpan:6,
                label:{
                    text: Globalize.formatMessage("NombreRazon")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_COMENTARIOS_CONTACT_B",
                editorOptions: { 
                    items: [],
                    searchEnabled: true,
                    value: ""
                },
                colSpan:2,
                label:{
                    text: Globalize.formatMessage("Comentarios")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_CP_CONACT_B",
                maxlenght: 5,
                colSpan:1,
                label:{
                    text: Globalize.formatMessage("NumberCP")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_TEL1_CONTACT_B",
                maxlenght: 10,
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Telefono1")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_TEL2_CONTACT_B",
                maxlenght: 10,
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Telefono2")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_TEL3_CONTACT_B",
                maxlenght: 10,
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Telefono3")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_EDO_CONTACT_B",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Estado")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_MUNICIPIO_CONTACT_B",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextMunicipio")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_PAIS_CONTACT_B",
                colSpan:3,
                label: {
                    text: Globalize.formatMessage("Pais")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_COLONIA_CONTACT_B",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextColonia")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_CALLE_CONTACT_B",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextCalle")
                }
            },{
                editorType: "dxTextArea",
                dataField: "INM_REFERENCIA_CONTACT_B",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextReferencias")
                }
            }]
});
    /*PRIMER CONTACTO*/

    /*SEGUNDO CONTACTO*/
    $("#SEGUNDO_CONTACTO").dxForm({
        readOnly: true,
        labelLocation: "left", // or "left" | "right"
        minColWidth: 100,
        width:'100%',
        colCount:9,
        items:[{
            itemType: "button",
            horizontalAlignment: "left",
            buttonOptions: {
                text: Globalize.formatMessage("ButtonModificar"),
                useSubmitBehavior: true,
                icon: "./images/Icons/order256.png",
                onClick: function(e) {
                    console.log('Apretaste el Boton Modificar en Poblacion atendida');
                }
            },
            colSpan:4
            },{
                itemType: "button",
                horizontalAlignment: "right",
                buttonOptions: {
                    text: Globalize.formatMessage("ButtonEliminar"),
                    useSubmitBehavior: true,
                    icon: "./images/Icons/CancelIcon.png",
                    onClick: function(e) {
                        console.log('Apretaste el Boton Eliminar en Poblacion atendida');
                    }
                },
                colSpan:5
            },
            {
                editorType: "dxTextBox",
                dataField: "INM_NOMBRE_CONTACT_C",
                colSpan:6,
                label:{
                    text: Globalize.formatMessage("NombreRazon")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_COMENTARIOS_CONTACT_C",
                editorOptions: { 
                    items: [],
                    searchEnabled: true,
                    value: ""
                },
                colSpan:2,
                label:{
                    text: Globalize.formatMessage("Comentarios")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_CP_CONACT_C",
                maxlenght: 5,
                colSpan:1,
                label:{
                    text: Globalize.formatMessage("NumberCP")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_TEL1_CONTACT_C",
                maxlenght: 10,
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Telefono1")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_TEL2_CONTACT_C",
                maxlenght: 10,
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Telefono2")
                }
            },{
                editorType: "dxNumberBox",
                dataField: "INM_TEL3_CONTACT_C",
                maxlenght: 10,
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Telefono3")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_EDO_CONTACT_C",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("Estado")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_MUNICIPIO_CONTACT_C",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextMunicipio")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_PAIS_CONTACT_C",
                colSpan:3,
                label: {
                    text: Globalize.formatMessage("Pais")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_COLONIA_CONTACT_C",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextColonia")
                }
            },{
                editorType: "dxTextBox",
                dataField: "INM_CALLE_CONTACT_C",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextCalle")
                }
            },{
                editorType: "dxTextArea",
                dataField: "INM_REFERENCIA_CONTACT_C",
                colSpan:3,
                label:{
                    text: Globalize.formatMessage("TextReferencias")
                }
            }]
});
    /*SEGUNDO CONTACTO*/

        /*DUEÑO O CONTACTO*/

        console.log('MOKUP DE MDI');
        self.JUANITA(1,3,4);
    }
    self.JUANITA = function(a,b,c){
        console.log(a);
        console.log(b);
        console.log(c);
    }
}
setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);