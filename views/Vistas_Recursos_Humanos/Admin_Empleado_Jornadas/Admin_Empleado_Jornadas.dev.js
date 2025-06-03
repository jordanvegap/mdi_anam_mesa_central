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
    self.Url_Loguin_Token = "https://srv1.dnasystem.io/public/v1/cctime/api/login/tokens";
    self.Key_Token = "B1183C0A-26D3-4F18-80ED-3C4A716CD3AC";
    self.Url_app_Ptrograma = "https://srv1.dnasystem.io/public/v1/cctime/api/programaTrabajo/ProgramaEmpleado";
    


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



        $("#Pop_Fecha_Api_Jornada").dxPopup({
            width:350,
            height: 110,
            position: {
                at: "center",
                offset: "0 -80"
            },
            showTitle: true,
            title:"SELECCIONAR FECHA",
            visible:false,
            dragEnabled: false,
            hideOnOutsideClick: false,
            shadingColor:"#000000bf",
            onHiding: function (e) {
                $("#Form_Fecha_Api_Jornada").dxForm("instance").option("formData",{});
            },
            onShowing: function(e) {
            },
            onShown: function (e) {
            },
            contentTemplate: function (e) {
                e.append(
                    $("<div />").attr({"style":"padding: 0px; height: 100%;"})
                    .append(
                        $("<div />").attr({"style":"padding: 10px 10px; height: 100%; border-radius: 5px; border: solid 1px #2045666e;"})
                        .append(
                            $("<div />").attr({"id":"Form_Fecha_Api_Jornada","style":"margin-top: 0px;"}).dxForm({
                                showColonAfterLabel: true,
                                showValidationSummary: false,
                                labelMode: 'static',
                                labelLocation: 'top',
                                colCount:3,
                                onInitialized:function(e){
                                    $Form_Fecha_Api_Jornada = e.component;
                                },
                                items: [{
                                    colSpan:2,
                                    dataField: "FECHA_PROGRMA_TRABAJO",
                                    editorType: "dxDateBox",
                                    label: { text: "Fecha de Apicación"},
                                    editorOptions: {
                                        type: "date",
                                        showClearButton: true,
                                        useMaskBehavior: true,
                                        placeholder: "DD-MM-AAAA",
                                        displayFormat: "dd-MM-yyyy",
                                        dateSerializationFormat: "yyyy-MM-dd",
                                        value:moment().format("YYYY-MM-DD")
                                    },
                                    validationRules: [{
                                        type: "required",
                                        message: "Indique la fecha"
                                    }]
                                },{
                                    itemType: "button",
                                    cssClass:"padddin_top",
                                    buttonOptions: {
                                        width: "100%",
                                        type: "success",
                                        text: "Aceptar",
                                        icon: 'fa fa-check',
                                        onInitialized: function(e) {  
                                            $Boton_Aceptar_Progrma_Trabajo = e.component;
                                        },
                                        onClick: function () {
                                            $Boton_Aceptar_Progrma_Trabajo.option("disabled",true);
                                            loadPanel.show();
                                            if($Form_Fecha_Api_Jornada.validate().isValid){
                                                var Data_Form_Fecha_Api_Jornada = $Form_Fecha_Api_Jornada.option("formData");
                                                var Date_Programa = Data_Form_Fecha_Api_Jornada.FECHA_PROGRMA_TRABAJO;
                                                try {
                                                    var Type_Bd_Quest = null;
                                                    if(localStorage.getItem('Type') === "Pro"){
                                                        Type_Bd_Quest = "Prod"
                                                    }
                                                    else if(localStorage.getItem('Type') === "Pru"){
                                                        Type_Bd_Quest = "QA"
                                                    }

                                                    $.ajax({
                                                        type: "POST",
                                                        url: self.Url_Loguin_Token,
                                                        contentType: "application/JSON; charset=utf-8",
                                                        headers: {
                                                            "Accept": "application/json",
                                                            "Content-Type": "application/json",
                                                            "x-api-key": self.Key_Token
                                                        },
                                                        data: JSON.stringify({
                                                            idCompany: "1",
                                                            userName:"admin",
                                                            password:"yXkgHy9ZUF#DvEH9",
                                                            Type:Type_Bd_Quest,
                                                        }),
                                                        dataType: "json",
                                                        async: !0,
                                                        retryCount: 0,
                                                        retryLimit: 6,
                                                        retryTimeout: 2e4,
                                                        timeout: 3e4,
                                                        created: Date.now(),
                                                        success: function(objectToken) {
                                                            $.ajax({
                                                                type: "POST",
                                                                url: self.Url_app_Ptrograma,
                                                                contentType: "application/JSON; charset=utf-8",
                                                                headers: {
                                                                    "Accept": "application/json",
                                                                    "Content-Type": "application/json",
                                                                    "Authorization": `Bearer ${objectToken.access_token}`
                                                                },
                                                                data: JSON.stringify({
                                                                    IdEmpresa: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                                                    ClaveEmpresa:localStorage.getItem('EMP_CLV_EMPRESA'),
                                                                    Type:Type_Bd_Quest,
                                                                    IdEmpleado:self.IdEmpleado,
                                                                    FechaInicio:Date_Programa
                                                                }),
                                                                dataType: "json",
                                                                async: !0,
                                                                retryCount: 0,
                                                                retryLimit: 6,
                                                                retryTimeout: 2e4,
                                                                timeout: 3e4,
                                                                created: Date.now(),
                                                                success: function(ProgramaSuccess) {
                                                                    if(ProgramaSuccess.transaction_state == "Completed"){
                                                                        $Boton_Aceptar_Progrma_Trabajo.option("disabled",false);
                                                                        DevExpress.ui.notify('PROGRAMA DE TRABAJO CREADO', 'success', 3000);
                                                                        $("#Pop_Fecha_Api_Jornada").dxPopup("hide");
                                                                        loadPanel.hide();
                                                                    }
                                                                    else{
                                                                        loadPanel.hide();
                                                                        $Boton_Aceptar_Progrma_Trabajo.option("disabled",false);
                                                                        DevExpress.ui.notify('ERROR AL REALIZAR EL PROGRMA DE TRABAJO, CONTACTE A SOPORTE TECNICO', 'error', 3000);
                                                                    }
                                                                },
                                                                error: function(xhr, textStatus, errorThrown) {
                                                                    console.log(xhr);
                                                                    this.retryCount++
                                                                    if (this.retryCount <= this.retryLimit) {
                                                                        console.log("Retrying: " + this.retryCount + " " + this.retryLimit);
                                                                        setTimeout(() => {
                                                                        $.ajax(this);
                                                                        }, 5000);
                                                                        return;  
                                                                    }
                                                                    else{
                                                                        loadPanel.hide();
                                                                        $Boton_Aceptar_Progrma_Trabajo.option("disabled",false);
                                                                        DevExpress.ui.notify('ERROR AL REALIZAR EL PROGRMA DE TRABAJO', 'error', 3000);
                                                                    }
                                                                }
                                                            })
                                                        },
                                                        error: function(xhr, textStatus, errorThrown) {
                                                            console.log(xhr);
                                                            this.retryCount++
                                                            if (this.retryCount <= this.retryLimit) {
                                                                console.log("Retrying: " + this.retryCount + " " + this.retryLimit);
                                                                setTimeout(() => {
                                                                  $.ajax(this);
                                                                }, 5000);
                                                                return;  
                                                            }
                                                            else{
                                                                loadPanel.hide();
                                                                $Boton_Aceptar_Progrma_Trabajo.option("disabled",false);
                                                                DevExpress.ui.notify('ERROR AL REALIZAR EL PROGRMA DE TRABAJO', 'error', 3000);
                                                            }
                                                        }
                                                    })
                                                }
                                                catch (error) {
                                                    console.log(error);
                                                    loadPanel.hide();
                                                    $Boton_Aceptar_Progrma_Trabajo.option("disabled",false);
                                                    DevExpress.ui.notify('ERROR AL REALIZAR EL PROGRMA DE TRABAJO', 'error', 3000);
                                                }
                                            }
                                            else{
                                                loadPanel.hide();
                                                $Boton_Aceptar_Progrma_Trabajo.option("disabled",false);
                                                DevExpress.ui.notify('VALIDE LA INFORMACIÓN ANTES DE CONTINUAR', 'error', 3000);
                                            }

                                        }
                                    }
                                }]
                            })
                        )
                        
                    )
                )
            }
        });


        $('#__ToolBar_Acciones_Form_Jornada').dxToolbar({
            items:[{
                location: "before",
                locateInMenu: "never",
                widget: "dxButton",
                options: {
                    visible:true,
                    height:20,
                    text: "Alta",
                    icon: 'Icons/add.png',
                    onInitialized: function(e) {  
                        $Boton_Alta_Empleado_Jornada = e.component;
                    },
                    onClick() {
                        $Boton_Alta_Empleado_Jornada.option("disabled",true);
                        $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",false);
                        $Boton_Cancel_Empleado_Jornada.option("visible",true);
                        $Boton_Cancel_Empleado_Jornada.option("disabled",false);
                        $__Form_Empleado_Jornada.option("formData",{});
                        $__Form_Empleado_Jornada.option("readOnly",false);
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
                        $Boton_Modificar_Empleado_Jornada = e.component;
                    },
                    onClick() {
                        $Boton_Modificar_Empleado_Jornada.option("disabled",true);
                        $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",false);
                        $Boton_Cancel_Empleado_Jornada.option("visible",true);
                        $Boton_Cancel_Empleado_Jornada.option("disabled",false);
                        $__Form_Empleado_Jornada.option("readOnly",false);
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
                        $Boton_Guardar_Alta_Empleado_Jornada = e.component;
                    },
                    onClick() {
                        $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",true);
                        loadPanel.show();
                        if($__Form_Empleado_Jornada.validate().isValid){

                            var Info_Form_Jornada = $__Form_Empleado_Jornada.option("formData");
                            Info_Form_Jornada.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                            Info_Form_Jornada.EMPLEADO_CSC_EMPLEADO = self.IdEmpleado;
                            Info_Form_Jornada.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            Info_Form_Jornada.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            Info_Form_Jornada.AUDITORIA_FEC_ALTA = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            Info_Form_Jornada.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
                            
                            var Data_Insert_Jornada = {
                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type:localStorage.getItem('Type'),
                                DATA_INSERT:Info_Form_Jornada
                            };

                            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Jornada',"POST", JSON.stringify(Data_Insert_Jornada), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(function(result){
                                if(result.success === true){
                                    loadPanel.hide();
                                    $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",false);
                                    DevExpress.ui.notify('INFORMACIÓN INSERTADA CORRECTAMENTE', 'success', 3000);
                                    self.Load_Jornada_Empleado();
                                    $("#Pop_Fecha_Api_Jornada").dxPopup("show");
                                }
                                else{
                                    loadPanel.hide();
                                    $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",false);
                                    DevExpress.ui.notify('ERROR AN INSERTAR INFORMACIÓN VALIDA E INTENTA NUEVAMENTE', 'error', 3000);
                                }
                            }).catch(function(err){
                                console.log(err);
                                $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",false);
                                loadPanel.hide();
                                DevExpress.ui.notify('ERROR DE COMUNICACIÓN INTENTELO NUEVAMENTE DESPUES', 'error', 3000);
                            });

                        }
                        else{
                            loadPanel.hide();
                            $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",false);
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
                        $Boton_Guardar_Modificar_Empleado_Jornada = e.component;
                    },
                    onClick() {
                        $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",true);
                        loadPanel.show();
                        if($__Form_Empleado_Jornada.validate().isValid){
                            var Form_Data_New = $__Form_Empleado_Jornada.option("formData");
                            Data_To_Update = GetUpdateData(self.Respaldo_Empleado_Jornada,Form_Data_New);
                            var Data_To_Update_Jornada = Object.assign({},Data_To_Update);

                            Data_To_Update_Jornada.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                            Data_To_Update_Jornada.AUDITORIA_FEC_ULT_MOD = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

                            var Update_Empleado_Jornada = {
                                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                                Type:localStorage.getItem('Type'),
                                DATA_UPDATE:Data_To_Update_Jornada,
                                DATA_WHERE:{
                                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                    EMPLEADO_CSC_EMPLEADO:self.Respaldo_Empleado_Jornada.EMPLEADO_CSC_EMPLEADO
                                }
                            };

                            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado_Jornada', 'POST', JSON.stringify(Update_Empleado_Jornada), getJSON(DeveloperType).ApiRecursosHumanos.token ).then((resultdata)=>{
                                if(resultdata.success === true){
                                    loadPanel.hide();
                                    $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",false);
                                    DevExpress.ui.notify('INFORMACIÓN ACTUALIZADA CORRECTAMENTE', 'success', 3000);
                                    self.Load_Jornada_Empleado();
                                    $("#Pop_Fecha_Api_Jornada").dxPopup("show");
                                }
                                else{
                                    loadPanel.hide();
                                    $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",false);
                                    DevExpress.ui.notify('ERROR AL ACTUALIZAR INFORMACIÓN VALIDA E INTENTA NUEVAMENTE', 'error', 3000);
                                }
                            }).catch(function(err){
                                console.log(err);
                                $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",false);
                                loadPanel.hide();
                                DevExpress.ui.notify('ERROR DE COMUNICACIÓN INTENTELO NUEVAMENTE DESPUES', 'error', 3000);
                            });
                        }
                        else{
                            loadPanel.hide();
                            $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",false);
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
                        $Boton_Cancel_Empleado_Jornada = e.component;
                    },
                    onClick() {
                        self.Load_Jornada_Empleado();
                    }
                }
            }]
        });


        $("#__Form_Empleado_Jornada").dxForm({
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: '__Form_Empleado_Jornada_Validate',
            labelMode: 'static',
            labelLocation: 'top',
            width: "100%",
            onInitialized: async function(e){
                $__Form_Empleado_Jornada = e.component;
                self.Load_Jornada_Empleado();
            },
            items: [{
                itemType: "group",
                colCount:5,
                items:[{
                    colSpan:3,
                    dataField: "CAT_JORNADAS_CSC",
                    editorType: "dxSelectBox",
                    label: {text: "Jornada"},
                    editorOptions: {
                        elementAttr:{
                            id:"select_jornada_empleado"
                        },
                        placeholder: 'Jornada',
                        valueExpr:"CAT_JORNADAS_CSC",
                        displayExpr: "CAT_JORNADA_IDIOMA1",
                        dataSource: new DevExpress.data.DataSource({
                            loadMode: "raw",
                            paginate: false,   
                            load: async function () {
                                try {
                                    var allServicios = {Tbl:"SAMT_CAT_JORNADAS_EMPLEADOS"};
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
                                    return [];
                                }
                            }
                        }),
                        onOpened: function(e){
                            
                        },
                        onClosed: function(e){
                            
                        },
                        onSelectionChanged:function(e){
                            if(e.selectedItem != null){
                                var NewOption = Object.assign({},e.selectedItem);

                                $__Form_Empleado_Jornada.getEditor("EMP_MINUTOS_TOLERANCIA").option("value",NewOption.CAT_MINUTOS_TOLERANCIA );
                                $__Form_Empleado_Jornada.getEditor("EMP_MINUTOS_AUXILIARES").option("value",NewOption.CAT_MINUTOS_AUXILIARES );

                                $__Form_Empleado_Jornada.getEditor("EMPLEADO_DIA_LUNES").option("value",NewOption.CAT_LUNES );
                                $__Form_Empleado_Jornada.getEditor("EMP_ENTRADA_LUNES").option("value",NewOption.CAT_ENTRADA_LUNES );
                                $__Form_Empleado_Jornada.getEditor("EMP_SALIDA_LUNES").option("value",NewOption.CAT_SALIDA_LUNES  );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_INICIA_LUNES").option("value",NewOption.CAT_COMIDA_INICIA_LUNES );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_SALIDA_LUNES").option("value",NewOption.CAT_COMIDA_FIN_LUNES );
                                
                                $__Form_Empleado_Jornada.getEditor("EMPLEADO_DIA_MARTES").option("value",NewOption.CAT_MARTES );
                                $__Form_Empleado_Jornada.getEditor("EMP_ENTRADA_MARTES").option("value",NewOption.CAT_ENTRADA_MARTES );
                                $__Form_Empleado_Jornada.getEditor("EMP_SALIDA_MARTES").option("value",NewOption.CAT_SALIDA_MARTES  );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_INICIA_MARTES").option("value",NewOption.CAT_COMIDA_INICIA_MARTES );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_SALIDA_MARTES").option("value",NewOption.CAT_COMIDA_FIN_MARTES );

                                $__Form_Empleado_Jornada.getEditor("EMPLEADO_DIA_MIERCOLES").option("value",NewOption.CAT_MIERCOLES );
                                $__Form_Empleado_Jornada.getEditor("EMP_ENTRADA_MIERCOLES").option("value",NewOption.CAT_ENTRADA_MIERCOLES );
                                $__Form_Empleado_Jornada.getEditor("EMP_SALIDA_MIERCOLES").option("value",NewOption.CAT_SALIDA_MIERCOLES  );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_INICIA_MIERCOLES").option("value",NewOption.CAT_COMIDA_INICIA_MIERCOLES );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_SALIDA_MIERCOLES").option("value",NewOption.CAT_COMIDA_FIN_MIERCOLES );

                                $__Form_Empleado_Jornada.getEditor("EMPLEADO_DIA_JUEVES").option("value",NewOption.CAT_JUEVES );
                                $__Form_Empleado_Jornada.getEditor("EMP_ENTRADA_JUEVES").option("value",NewOption.CAT_ENTRADA_JUEVES );
                                $__Form_Empleado_Jornada.getEditor("EMP_SALIDA_JUEVES").option("value",NewOption.CAT_SALIDA_JUEVES  );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_INICIA_JUEVES").option("value",NewOption.CAT_COMIDA_INICIA_JUEVES );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_SALIDA_JUEVES").option("value",NewOption.CAT_COMIDA_FIN_JUEVES );

                                $__Form_Empleado_Jornada.getEditor("EMPLEADO_DIA_VIERNES").option("value",NewOption.CAT_VIERNES );
                                $__Form_Empleado_Jornada.getEditor("EMP_ENTRADA_VIERNES").option("value",NewOption.CAT_ENTRADA_VIERNES );
                                $__Form_Empleado_Jornada.getEditor("EMP_SALIDA_VIERNES").option("value",NewOption.CAT_SALIDA_VIERNES  );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_INICIA_VIERNES").option("value",NewOption.CAT_COMIDA_INICIA_VIERNES );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_SALIDA_VIERNES").option("value",NewOption.CAT_COMIDA_FIN_VIERNES );

                                $__Form_Empleado_Jornada.getEditor("EMPLEADO_DIA_SABADO").option("value",NewOption.CAT_SABADO );
                                $__Form_Empleado_Jornada.getEditor("EMP_ENTRADA_SABADO").option("value",NewOption.CAT_ENTRADA_SABADO );
                                $__Form_Empleado_Jornada.getEditor("EMP_SALIDA_SABADO").option("value",NewOption.CAT_SALIDA_SABADO  );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_INICIA_SABADO").option("value",NewOption.CAT_COMIDA_INICIA_SABADO );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_SALIDA_SABADO").option("value",NewOption.CAT_COMIDA_FIN_SABADO );

                                $__Form_Empleado_Jornada.getEditor("EMPLEADO_DIA_DOMINGO").option("value",NewOption.CAT_DOMINGO );
                                $__Form_Empleado_Jornada.getEditor("EMP_ENTRADA_DOMINGO").option("value",NewOption.CAT_ENTRADA_DOMINGO );
                                $__Form_Empleado_Jornada.getEditor("EMP_SALIDA_DOMINGO").option("value",NewOption.CAT_SALIDA_DOMINGO  );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_INICIA_DOMINGO").option("value",NewOption.CAT_COMIDA_INICIA_DOMINGO );
                                $__Form_Empleado_Jornada.getEditor("EMP_COMIDA_SALIDA_DOMINGO").option("value",NewOption.CAT_COMIDA_FIN_DOMINGO );

                            }
                            
                        }
                    },
                    validationRules: [{
                        type: "required",message: "Requerido"
                    }]
                },{
                    dataField: "EMP_MINUTOS_TOLERANCIA",
                    editorType: "dxNumberBox",
                    label: {text: "Tolerancia"},
                    editorOptions: {
                        readOnly:true,
                        valueChangeEvent: "keyup",
                        placeholder: 'Tolerancia',
                        min:0,
                        value:""
                    }
                },{
                    dataField: "EMP_MINUTOS_AUXILIARES",
                    editorType: "dxNumberBox",
                    label: {text: "Auxiliares"},
                    editorOptions: {
                        readOnly:true,
                        valueChangeEvent: "keyup",
                        placeholder: 'Auxiliares',
                        min:0,
                        value:""
                    }
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    template:"Dia",
                },{
                    template:"Entrada",
                },{
                    template:"Salida",
                },{
                    colSpan:2,
                    template:"Comida",
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    dataField: "EMPLEADO_DIA_LUNES",
                    editorType: "dxCheckBox",
                    label: { 
                        location: "left",
                        alignment: "right",
                        text: "Lunes"
                    },
                    editorOptions: {
                        readOnly:true
                    }
                },{
                    dataField: "EMP_ENTRADA_LUNES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_SALIDA_LUNES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_INICIA_LUNES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_SALIDA_LUNES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    dataField: "EMPLEADO_DIA_MARTES",
                    editorType: "dxCheckBox",
                    label: { 
                        location: "left",
                        alignment: "right",
                        text: "Martes"
                    },
                    editorOptions: {
                        readOnly:true
                    }
                },{
                    dataField: "EMP_ENTRADA_MARTES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_SALIDA_MARTES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_INICIA_MARTES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_SALIDA_MARTES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    dataField: "EMPLEADO_DIA_MIERCOLES",
                    editorType: "dxCheckBox",
                    label: { 
                        location: "left",
                        alignment: "right",
                        text: "Miercoles"
                    },
                    editorOptions: {
                        readOnly:true
                    }
                },{
                    dataField: "EMP_ENTRADA_MIERCOLES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_SALIDA_MIERCOLES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_INICIA_MIERCOLES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_SALIDA_MIERCOLES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    dataField: "EMPLEADO_DIA_JUEVES",
                    editorType: "dxCheckBox",
                    label: { 
                        location: "left",
                        alignment: "right",
                        text: "Jueves"
                    },
                    editorOptions: {
                        readOnly:true
                    }
                },{
                    dataField: "EMP_ENTRADA_JUEVES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_SALIDA_JUEVES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_INICIA_JUEVES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_SALIDA_JUEVES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    dataField: "EMPLEADO_DIA_VIERNES",
                    editorType: "dxCheckBox",
                    label: { 
                        location: "left",
                        alignment: "right",
                        text: "Viernes"
                    },
                    editorOptions: {
                        readOnly:true
                    }
                },{
                    dataField: "EMP_ENTRADA_VIERNES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_SALIDA_VIERNES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_INICIA_VIERNES",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_SALIDA_VIERNES",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    dataField: "EMPLEADO_DIA_SABADO",
                    editorType: "dxCheckBox",
                    label: { 
                        location: "left",
                        alignment: "right",
                        text: "Sabado"
                    },
                    editorOptions: {
                        readOnly:true
                    }
                },{
                    dataField: "EMP_ENTRADA_SABADO",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_SALIDA_SABADO",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_INICIA_SABADO",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_SALIDA_SABADO",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                }]
            },{
                itemType: "group",
                colCount:5,
                items:[{
                    dataField: "EMPLEADO_DIA_DOMINGO",
                    editorType: "dxCheckBox",
                    label: { 
                        location: "left",
                        alignment: "right",
                        text: "Domingo"
                    },
                    editorOptions: {
                        readOnly:true
                    }
                },{
                    dataField: "EMP_ENTRADA_DOMINGO",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_SALIDA_DOMINGO",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_INICIA_DOMINGO",
                    editorType: "dxDateBox",
                    label: {text: "De"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                },{
                    dataField: "EMP_COMIDA_SALIDA_DOMINGO",
                    editorType: "dxDateBox",
                    label: {text: "A"},
                    editorOptions: {
                        readOnly:true,
                        type: "time",
                        useMaskBehavior: true,
                        placeholder: "HH:MM:SS",
                        displayFormat: "HH:mm:ss",
                        dateSerializationFormat: "HH:mm:ss"
                    }
                }]
            }]
        });




        $('#tooltip_select_jornada_empleado').dxTooltip({
            target: '#select_jornada_empleado',
            showEvent: 'mouseenter',
            hideEvent: 'mouseleave',
            hideOnOutsideClick: false
        });

    }



    self.Load_Jornada_Empleado = function(){
        loadPanel.hide();
        var GetEmpleadoSol = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            Type:localStorage.getItem('Type'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            EMPLEADO_CSC_EMPLEADO:self.IdEmpleado
        };

        __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Empleado_Jornada',"GET",GetEmpleadoSol,getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(result){
            if(result.success == true){

                $Boton_Alta_Empleado_Jornada.option("visible",false);
                $Boton_Alta_Empleado_Jornada.option("disabled",true);
                $Boton_Guardar_Alta_Empleado_Jornada.option("visible",false);
                $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",true);

                $Boton_Modificar_Empleado_Jornada.option("visible",true);
                $Boton_Modificar_Empleado_Jornada.option("disabled",false);
                $Boton_Guardar_Modificar_Empleado_Jornada.option("visible",true);
                $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",true);

                $Boton_Cancel_Empleado_Jornada.option("visible",false);
                $Boton_Cancel_Empleado_Jornada.option("disabled",true);

                var Empledo_Jornada_Aux = result.JsonData[0];
                self.Respaldo_Empleado_Jornada = Object.assign({},Empledo_Jornada_Aux);
                $__Form_Empleado_Jornada.option("formData",Object.assign({},Empledo_Jornada_Aux) );
            }
            else{
                $Boton_Alta_Empleado_Jornada.option("visible",true);
                $Boton_Alta_Empleado_Jornada.option("disabled",false);
                $Boton_Guardar_Alta_Empleado_Jornada.option("visible",true);
                $Boton_Guardar_Alta_Empleado_Jornada.option("disabled",true);

                $Boton_Modificar_Empleado_Jornada.option("visible",false);
                $Boton_Modificar_Empleado_Jornada.option("disabled",true);
                $Boton_Guardar_Modificar_Empleado_Jornada.option("visible",false);
                $Boton_Guardar_Modificar_Empleado_Jornada.option("disabled",true);

                $Boton_Cancel_Empleado_Jornada.option("visible",false);
                $Boton_Cancel_Empleado_Jornada.option("disabled",true);

                $__Form_Empleado_Jornada.option("formData",{});
            }
            $__Form_Empleado_Jornada.option("readOnly",true);

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