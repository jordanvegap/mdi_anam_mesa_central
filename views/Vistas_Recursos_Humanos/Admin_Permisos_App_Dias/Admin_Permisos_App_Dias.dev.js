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


        $("#__Form_Edita_Permisos_App").dxForm({
            readOnly: false,
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: '__Form_Edita_Permisos_App_Validate',
            labelMode: 'outside',
            width: "100%",
            colCount:1,
            items: [{
                dataField: "EMPLEADO_DIA_LUNES",
                editorType: "dxCheckBox",
                label: { 
                    location: "left",
                    alignment: "left",
                    text: "Lunes",
                    width:400
                },
                editorOptions:{
                    onOptionChanged:function(e){
                        loadPanel.show();
                        self.If_Insert_Or_Update(e.component.option("name"),e.value);
                    }
                }
            },{
                dataField: "EMPLEADO_DIA_MARTES",
                editorType: "dxCheckBox",
                label: { 
                    location: "left",
                    alignment: "left",
                    text: "Martes"
                },
                editorOptions:{
                    onOptionChanged:function(e){
                        loadPanel.show();
                        self.If_Insert_Or_Update(e.component.option("name"),e.value);
                    }
                }
            },{
                dataField: "EMPLEADO_DIA_MIERCOLES",
                editorType: "dxCheckBox",
                label: { 
                    location: "left",
                    alignment: "left",
                    text: "Miercoles"
                },
                editorOptions:{
                    onOptionChanged:function(e){
                        loadPanel.show();
                        self.If_Insert_Or_Update(e.component.option("name"),e.value);
                    }
                }
            },{
                dataField: "EMPLEADO_DIA_JUEVES",
                editorType: "dxCheckBox",
                label: { 
                    location: "left",
                    alignment: "left",
                    text: "Jueves"
                },
                editorOptions:{
                    onOptionChanged:function(e){
                        loadPanel.show();
                        self.If_Insert_Or_Update(e.component.option("name"),e.value);
                    }
                }
            },{
                dataField: "EMPLEADO_DIA_VIERNES",
                editorType: "dxCheckBox",
                label: { 
                    location: "left",
                    alignment: "left",
                    text: "Viernes"
                },
                editorOptions:{
                    onOptionChanged:function(e){
                        loadPanel.show();
                        self.If_Insert_Or_Update(e.component.option("name"),e.value);
                    }
                }
            },{
                dataField: "EMPLEADO_DIA_SABADO",
                editorType: "dxCheckBox",
                label: { 
                    location: "left",
                    alignment: "left",
                    text: "Sabado"
                },
                editorOptions:{
                    onOptionChanged:function(e){
                        loadPanel.show();
                        self.If_Insert_Or_Update(e.component.option("name"),e.value);
                    }
                }
            },{
                dataField: "EMPLEADO_DIA_DOMINGO",
                editorType: "dxCheckBox",
                label: { 
                    location: "left",
                    alignment: "left",
                    text: "Domingo"
                },
                editorOptions:{
                    onOptionChanged:function(e){
                        loadPanel.show();
                        self.If_Insert_Or_Update(e.component.option("name"),e.value);
                    }
                }
            }],
            onInitialized: async function(e){
                loadPanel.show();
                await self.Refresh_Form();
                loadPanel.hide();
            }
        });

    }



    self.Refresh_Form = async function(){

        return await new Promise( (resolve,reject)=>{
            var objRequest = {
                Type:localStorage.getItem('Type'),
                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                EMPLEADO_CSC_EMPLEADO:self.IdEmpleado,
                EMPLEADO_DIA_ACTIVO:1
            };
            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Empleado_Horario_App',"GET", objRequest, getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(dataRequest){
                if (dataRequest.success == true) {
                    self.Empleado_Permisos_App = dataRequest.JsonData[0];
                    $("#__Form_Edita_Permisos_App").dxForm("instance").option("formData",Object.assign({},self.Empleado_Permisos_App));
                }
                resolve("resolve");
            }).catch(function(err){
                console.log(err);
                reject(err);
            });

        }).catch(function(err){
            console.log(err);
            reject(err);
        });

    }


    self.If_Insert_Or_Update = function(ItemName, ItemValue){
        var ParseItemValue = ItemValue ? 1 : 0; 

        if(self.Empleado_Permisos_App == null){
            var Oject_Insert_Permisos = {
                EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                Type: localStorage.getItem('Type'),
                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                DATA_INSERT:{
                    EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    EMPLEADO_CSC_EMPLEADO:self.IdEmpleado,
                    EMPLEADO_DIA_DOMINGO:0,
                    EMPLEADO_DIA_LUNES:0,
                    EMPLEADO_DIA_MARTES:0,
                    EMPLEADO_DIA_MIERCOLES:0,
                    EMPLEADO_DIA_JUEVES:0,
                    EMPLEADO_DIA_VIERNES:0,
                    EMPLEADO_DIA_SABADO:0,
                    EMPLEADO_DIA_ACTIVO:1,
                    AUDITORIA_USU_ALTA:self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                    AUDITORIA_USU_ULT_MOD:self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                    AUDITORIA_FEC_ALTA:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss'),
                    AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                }
            };
            Oject_Insert_Permisos.DATA_INSERT[ItemName] = ParseItemValue;
            
            __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Empleado_Horario_App',"POST", JSON.stringify(Oject_Insert_Permisos), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(DataInsert){
                if (DataInsert.success == true){
                    console.log("Registro Insertado");
                }
                else{
                    console.log("Registro no Insertado");
                }
                await self.Refresh_Form();
                loadPanel.hide();
            }).catch(async function(err){
                console.log(err);
                console.log("Registro no Insertado por error de servidor");
                await self.Refresh_Form();
                loadPanel.hide();
            });
        }
        else{
            if(self.Empleado_Permisos_App[ItemName] == ParseItemValue){
                loadPanel.hide();
            }
            else{
                //console.log(ItemName);
                //console.log(ParseItemValue);
                var Oject_Update_Permisos = {
                    EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                    Type: localStorage.getItem('Type'),
                    EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    DATA_UPDATE:{
                        AUDITORIA_USU_ULT_MOD:self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                        AUDITORIA_FEC_ULT_MOD:moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss')
                    },
                    DATA_WHERE:{
                        EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                        EMPLEADO_CSC_EMPLEADO:self.IdEmpleado,
                        EMPLEADO_DIA_ACTIVO:1
                    }
                }
                Oject_Update_Permisos.DATA_UPDATE[ItemName] = ParseItemValue;
    
                __Reques_ajax( getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Empleado_Horario_App',"POST", JSON.stringify(Oject_Update_Permisos), getJSON(DeveloperType).ApiRecursosHumanos.token ).then(async function(DataInsert){
                    if (DataInsert.success == true){
                        console.log("Registro Actualizado");
                    }
                    else{
                        console.log("Registro no Actualizado");
                    }
                    await self.Refresh_Form();
                    loadPanel.hide();
                }).catch(async function(err){
                    console.log(err);
                    console.log("Registro no Actualizado por error de servidor");
                    await self.Refresh_Form();
                    loadPanel.hide();
                });
            }

        }


    }

}


setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);