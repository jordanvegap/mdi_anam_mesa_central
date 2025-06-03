SalesDashboard.dashboardModel = function() {
    var self = this;
    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");
    self.patname = window.location.pathname;
    /** TODO: Formatos y fechas
     * self.TimeZoneServidor: Se utilizara para los INSERT y UPDATE de la BD
     * self.TimeZoneEmpleado: Se utiliza para saber la fecha y hora de la plataforma del empleado
     * self.TiempoUTCEmpleado: Segun el tipo de dato se sumara o restara esas horas a las 
     *                         fechas se trae en los campos de fecha de la BD
    */
    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();

    self.IdEmpleado = null;
    self.TpoUsuario = null;
    self.DatosUsuariosPsw = null;
    self.obj_DatosEmpleado = null;
    self.init = function() {
        /** 
         * ! SIEMPRE AGREGAR ESTA LINEA 
        */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** 
         * ! SIEMPRE AGREGAR ESTA LINEA 
         */
        /** 
         * TODO: Obtiene los datos encriptados de los local storage 
         * */
        var originalData = decrypt(localStorage.getItem('DatosEncriptados'));
        self.obj_DatosEmpleado = JSON.parse(originalData);

        $("#strength-indicator").dxLinearGauge({
            scale: {
              startValue: 0,
              endValue: 100,
              tickInterval: 25
            },
            title: {
                text: 'Fortaleza de contraseña',
                font: { size: 11 },
            },
            rangeContainer: {
              palette: "pastel",
              width: 4,
              ranges: [
                { startValue: 0, endValue: 25, color: "#f44336" },
                { startValue: 25, endValue: 50, color: "#FF853A" },
                { startValue: 50, endValue: 75, color: "#EDE100" },
                { startValue: 75, endValue: 100, color: "#00AA13" }
              ]
            }
          });

        loadPanel.hide();
        self.IdEmpleado = getUrlParam('idemp');
        self.TpoUsuario = getUrlParam('TpoUsuario');
        self.BarraUsuarios = $("#Barra_Usuarios").dxToolbar({
            onContentReady: function(){
                $btn_Alta_Usuario.option('visible',true);
                $btn_Modificar_Usuario.option('visible',true);
                $btn_Salvar_Alta_Usuario.option('visible',false);
                $btn_Salvar_Modifica_Usuario.option('visible',false);
                $btn_Cancelar_Alta_Usuario.option('visible',false);
                $btn_Cancelar_Modificar_Usuario.option('visible',false);
            },
            items: [
                /** BOTONERA ALTA */
                {
                    location: 'before',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'plus',
                        text: 'Alta',
                        type: 'default',
                        onInitialized: function(e) {  
                            $btn_Alta_Usuario = e.component;
                        },
                        onClick() {
                          $btn_Alta_Usuario.option('visible',false);
                          $btn_Modificar_Usuario.option('visible',false);
                          $btn_Cancelar_Alta_Usuario.option('visible',true);
                          $btn_Salvar_Alta_Usuario.option('visible',true);
                          self.__Frm_Usuario_Psw.resetValues();
                          self.__Frm_Usuario_Psw.option('readOnly', false);
                          self.__Frm_Usuario_Psw.getEditor('NEWID').option('value', createUUID(36));
                          self.__Frm_Usuario_Psw.getEditor('EMPLEADO_CSC_EMPLEADO').option('value', self.IdEmpleado);
                        },
                    },
                },{
                    location: 'before',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'save',
                        text: 'Salvar Alta',
                        type: 'success',
                        onInitialized: function(e) {  
                            $btn_Salvar_Alta_Usuario = e.component;
                        },
                        onClick() {
                         self.onClickAlta_Usuario();
                        },
                    },
                },{
                    location: 'after',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'clear',
                        text: 'Cancelar Alta',
                        type: 'danger',
                        onInitialized: function(e) {  
                            $btn_Cancelar_Alta_Usuario = e.component;
                        },
                        onClick() {
                            $btn_Alta_Usuario.option('visible',true);
                            $btn_Modificar_Usuario.option('visible',true);
                            $btn_Cancelar_Alta_Usuario.option('visible',false);
                            $btn_Salvar_Alta_Usuario.option('visible',false);
                            self.__Frm_Usuario_Psw.resetValues();
                            self.__Frm_Usuario_Psw.option('readOnly', true);
                        },
                    },
                  },
                /** //BOTONERA ALTA */
  
                /** BOTONERA MODIFICAR */
                {
                    location: 'after',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                      icon: 'edit',
                      text: 'Modificar',
                      type: 'normal',
                      onInitialized: function(e) {  
                          $btn_Modificar_Usuario = e.component;
                      },
                      onClick() {
  
                        if (self.DatosUsuariosPsw == null) {
                          DevExpress.ui.notify({message: `No ha seleccionado un Usuario`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                          return;
                        } 
                        
                        $btn_Modificar_Usuario.option('visible',false);
                        $btn_Alta_Usuario.option('visible',false);
                        $btn_Salvar_Modifica_Usuario.option('visible',true);
                        $btn_Cancelar_Modificar_Usuario.option('visible',true);
                        self.__Frm_Usuario_Psw.option('readOnly', false);
                      },
                    },
                },{
                    location: 'before',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'save',
                        text: 'Salvar Modifica',
                        type: 'success',
                        onInitialized: function(e) {  
                            $btn_Salvar_Modifica_Usuario = e.component;
                        },
                        onClick() {
                          self.ActualizaDatosUsuario();
                        },
                    },
                  },{
                    location: 'after',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'clear',
                        text: 'Cancelar Modificar',
                        type: 'danger',
                        onInitialized: function(e) {  
                            $btn_Cancelar_Modificar_Usuario = e.component;
                        },
                        onClick() {
                            $btn_Modificar_Usuario.option('visible',true);
                            //$btn_Alta_Usuario.option('visible',true);
                            $btn_Salvar_Modifica_Usuario.option('visible',false);
                            $btn_Cancelar_Modificar_Usuario.option('visible',false);
                            self.__Frm_Usuario_Psw.resetValues();
                            var StringInfoForm = JSON.stringify(self.DatosUsuariosPsw);
                            self.DatosUsuariosPsw = JSON.parse(StringInfoForm);
                            self.__Frm_Usuario_Psw.updateData(self.DatosUsuariosPsw);
                            self.__Frm_Usuario_Psw.option('readOnly', true);
                            if (self.DatosUsuariosPsw != null) {
                                $btn_Alta_Usuario.option('visible',false);
                            } else {
                                
                            }
                        },
                    },
                  }
                /** //BOTONERA MODIFICAR */
                
            ],
          }).dxToolbar('instance');

          self.__Frm_Usuario_Psw = $("#__Frm_Usuario").dxForm(
            {
              "readOnly": true,
              "showColonAfterLabel": true,
              "showValidationSummary": false,
              "validationGroup": "Validacion_Frm_Usuario",
              colCount: 'auto',
              "labelLocation": "top",
              colCountByScreen: {
                md: 6,
              },
              screenByWidth(width) {
                return width < 720 ? 'md' : 'md';
              },
              "items": [
                {
                  "dataField": "NEWID",
                  "label": {
                    "text": "NEWID"
                  },
                  "cssClass":"hidden_box",
                  "editorType": "dxTextBox",
                  "colSpan": 2,
                  "editorOptions": {
                    "valueChangeEvent": "keyup"
                  },
                  "validationRules": [
                    {
                      "type": "stringLength",
                      "min": 1,
                      "message": "Minimo 1 caracteres"
                    },
                    {
                      "type": "required",
                      "message": "requerido"
                    },
                    {
                      "type": "stringLength",
                      "max": 36,
                      "message": "Maximo 36 caractres"
                    }
                  ]
                },
                {
                  "dataField": "USU_CSC_USUARIO",
                  "label": {
                    "text": "Id. Usuario"
                  },
                  "cssClass":"hidden_box",
                  "editorType": "dxTextBox",
                  "colSpan": 2
                },
                {
                  "dataField": "EMPLEADO_CSC_EMPLEADO",
                  "label": {
                    "text": "Id. Empleado"
                  },
                  "cssClass":"hidden_box",
                  "editorType": "dxTextBox",
                  "colSpan": 2,
                  "validationRules": [
                    {
                      "type": "stringLength",
                      "min": 1,
                      "message": "Minimo 1 caracteres"
                    },
                    {
                      "type": "required",
                      "message": "requerido"
                    },
                    {
                      "type": "stringLength",
                      "max": 36,
                      "message": "Maximo 36 caractres"
                    }
                  ]
                },
                // {
                //   "dataField": "USU_CSCSYSUSER",
                //   "label": {
                //     "text": "USU CSCSYSUSER"
                //   },
                //   "editorType": "dxSelectBox",
                //   "colSpan": 2
                // },
                {
                  "dataField": "USU_LOGIN",
                  "label": {
                    "text": "Usuario"
                  },
                  "editorType": "dxTextBox",
                  "colSpan": 4,
                  "editorOptions": {
                    "valueChangeEvent": "keyup",
                  },
                  "validationRules": [
                    {
                      "type": "stringLength",
                      "min": 8,
                      "message": "Minimo 8 caracteres"
                    },
                    {
                      "type": "required",
                      "message": "requerido"
                    },
                    {
                      "type": "stringLength",
                      "max": 100,
                      "message": "Maximo 100 caractres"
                    }
                  ]
                },
                {
                  "dataField": "USU_INDICAACTIVO",
                  "label": {
                    "text": "Activo"
                  },
                  "editorType": "dxSwitch",
                  "colSpan": 2,
                  "editorOptions": {
                    "switchedOffText": "Inactivo",
                    "switchedOnText": "Activo",
                    "width": "100%"
                  }
                },
                {
                  "dataField": "USU_PASSWORD",
                  "label": {
                    "text": "Contraseña"
                  },
                  "editorType": "dxTextBox",
                  "colSpan": 6,
                  "editorOptions": {
                    "valueChangeEvent": "keyup",
                    onValueChanged: function(e) {
                        var password = e.value;
                        var strengthIndicator = $("#strength-indicator").dxLinearGauge("instance");
                        if (password.length === 0) {
                            strengthIndicator.value(0);
                        } else if (validatePassword(password)) {
                            strengthIndicator.value(100);
                        } else {
                            var strength = 0;
                            if (password.length >= 8) {
                            strength += 25;
                            }
                            if (/[A-Z]/.test(password)) {
                            strength += 25;
                            }
                            if (/\d/.test(password)) {
                            strength += 25;
                            }
                            if (/[@$!%*#?&]/.test(password)) {
                            strength += 25;
                            }
                            strengthIndicator.value(strength);
                        }
                        },
                    mode: 'password',
                  },
                  "validationRules": [
                    {
                        type: "custom",
                        validationCallback: function(options) {
                          if (!validatePassword(options.value)) {
                            return false;
                          }
                          return true;
                        },
                        message: "La contraseña debe tener al menos una letra mayúscula, un número y un símbolo, sin espacios y con un mínimo de 8 dígitos."
                      }
                    // {
                    //   "type": "stringLength",
                    //   "min": 8,
                    //   "message": "Minimo 8 caracteres"
                    // },
                    // {
                    //   "type": "required",
                    //   "message": "requerido"
                    // },
                    // {
                    //   "type": "stringLength",
                    //   "max": 30,
                    //   "message": "Maximo 30 caractres"
                    // }
                  ]
                },
                {
                  "dataField": "USU_PASSWORD_CONFIRMA",
                  "label": {
                    "text": "Confirmar contraseña"
                  },
                  "editorType": "dxTextBox",
                  "colSpan": 6,
                  "editorOptions": {
                   
                    mode: 'password',
                    valueChangeEvent: "change",
                    onValueChanged: function(e) {
                        loadPanel.show();
                        if (e.value == null || e.value == "") {
                            return
                        } 
                        var _ary = {USU_PASSWORD: e.value};
                        __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'CodificaPsw','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((resutl)=>{
                            if (resutl.success == true ) {
                              const password = $('#__Frm_Usuario').dxForm('instance').getEditor('USU_PASSWORD_CRYPTO');
                              password.option('value', resutl.JsonData);
                            } else {
                              DevExpress.ui.notify({message: `Error en comunicación con codificadores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                            }
                            loadPanel.hide();
                        }).catch(function(e){
                            loadPanel.hide();
                            DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                        });
                        }
                    },
                  "validationRules": [
                    {
                      type: 'compare',
                      comparisonTarget() {
                        const password = $('#__Frm_Usuario').dxForm('instance').getEditor('USU_PASSWORD');
                        if (password) {
                          return password.option('value');
                        }
                        return null;
                      },
                      message: "'Contraseña' y 'Confirmar contraseña' no coinciden.",
                    },
                    {
                      "type": "stringLength",
                      "min": 8,
                      "message": "Minimo 8 caracteres"
                    },
                    {
                      "type": "required",
                      "message": "requerido"
                    },
                    {
                      "type": "stringLength",
                      "max": 30,
                      "message": "Maximo 30 caractres"
                    }
                  ]
                },
                {
                  "dataField": "USU_PASSWORD_CRYPTO",
                  "label": {
                    "text": "Crypto"
                  },
                  "cssClass":"hidden_box",
                  "editorType": "dxTextBox",
                  "colSpan": 6,
                  "editorOptions": {
                    "valueChangeEvent": "keyup",
                    mode: 'password',
                  },
                  "validationRules": [
                    {
                      "type": "stringLength",
                      "min": 4,
                      "message": "Minimo 8 caracteres"
                    },
                    {
                      "type": "required",
                      "message": "requerido"
                    },
                  ]
                },
                // {
                //   "dataField": "USU_CODESQUEMASEG",
                //   "label": {
                //     "text": "Perfil"
                //   },
                //   "editorType": "dxSelectBox",
                //   "colSpan": 6,
                //   editorOptions: {
                //     searchEnabled:false,
                //     displayExpr: "TIPO_ESQUEMA_SEG_IDIOMA1",
                //     valueExpr: "TIPO_ESQUEMA_SEG_CSC",
                //     dataSource: new DevExpress.data.DataSource({
                //         loadMode: "raw", paginate: false,    
                //         load: async function (e) {
                //             try {
                //                 var _ary = {Tbl:"SAMT_TIPO_ESQUEMA_SEG"};
                //                 return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                //                     if (all_data.success == true){
                //                         return all_data.JsonData;
                //                     }
                //                     else {
                //                         console.log(all_data.message);
                //                     }
                //                 });
                //             }
                //             catch (error) {
                //                 console.log(error);
                //             }
                //         },
                //         onError: async function (e) {
                //           try {
                //               var _ary = {Tbl:"SAMT_TIPO_ESQUEMA_SEG"};
                //               return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Full','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                //                   if (all_data.success == true){
                //                       return all_data.JsonData;
                //                   }
                //                   else {
                //                       console.log(all_data.message);
                //                   }
                //               });
                //           }
                //           catch (error) {
                //               console.log(error);
                //           }
                //       },
                //     })
                //   },
                //   "validationRules": [
                //     {
                //       "type": "required",
                //       "message": "requerido"
                //     },
                //   ]
                // },
                {
                  "dataField": "USU_FECHA_EXPIRA",
                  "label": {
                    "text": "Fecha de expiración"
                  },
                  "editorType": "dxDateBox",
                  "colSpan": 6,
                  "editorOptions": {
                    "type": "datetime",
                    "placeholder": "DD/MM/AAAA HH:mm:ss",
                    "useMaskBehavior": true,
                    "displayFormat": "dd/MM/yyyy HH:mm:ss"
                  },
                  "validationRules": [
                    {
                      "type": "required",
                      "message": "requerido"
                    },
                  ]
                },
                // {
                //     "dataField": "USU_AUTENTIFICA_REMOTO",
                //     "label": {
                //     "text": "Autentificación remota"
                //     },
                //     "editorType": "dxSwitch",
                //     "colSpan": 3,
                //     "editorOptions": {
                //         "switchedOffText": "No",
                //         "switchedOnText": "Si",
                //         "width": "100%"
                //     }
                // },
                
                // {
                //   "dataField": "USU_ACCESO_SITEMA",
                //   "label": {
                //     "text": "USU ACCESO SITEMA"
                //   },
                //   "editorType": "dxSwitch",
                //   "colSpan": 2,
                //   "editorOptions": {
                //     "switchedOffText": "False",
                //     "switchedOnText": "True",
                //     "width": "100%"
                //   }
                // },
                // {
                //   "dataField": "USU_FECHA_EXPIRA_LOGIN",
                //   "label": {
                //     "text": "USU FECHA EXPIRA LOGIN"
                //   },
                //   "editorType": "dxDateBox",
                //   "colSpan": 2,
                //   "editorOptions": {
                //     "type": "datetime",
                //     "placeholder": "DD/MM/AAAA HH:mm:ss",
                //     "useMaskBehavior": true,
                //     "displayFormat": "dd/MM/yyyy HH:mm:ss"
                //   }
                // },
            ]
            }).dxForm('instance');

            
            var data_obj_Usuario = {
                EMPLEADO_CSC_EMPLEADO: self.IdEmpleado
            };   
            self.ValidaUsuario(data_obj_Usuario)
    }

    self.ValidaUsuario = function(_aryFiltroBusqueda){
        var _ObjDefault = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type')
        };
        const ObjetoMergeBus = {..._ObjDefault, ..._aryFiltroBusqueda};
        
        __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Usuario','GET',ObjetoMergeBus,getJSON(DeveloperType).ApiRecursosHumanos.token).then((resutl)=>{
            if (resutl.success == true ) {
                var CargaFrm = resutl.JsonData[0];
                if(CargaFrm.USU_FECHA_EXPIRA){ //! Toma la fecha del servidor y le agrega o resta el UTC del Usuario
                    CargaFrm.USU_FECHA_EXPIRA = moment(CargaFrm.USU_FECHA_EXPIRA).add(DiferencieTimeZones(),'hours').format('YYYY-MM-DD HH:mm:ss');
                }
                var StringInfoForm = JSON.stringify(CargaFrm);
                self.DatosUsuariosPsw = JSON.parse(StringInfoForm);
                self.__Frm_Usuario_Psw.updateData(self.DatosUsuariosPsw);
                $btn_Alta_Usuario.option('visible',false);
            }
        })
    }

    self.onClickAlta_Usuario = function(){
        loadPanel.show();
        //TODO: Se obtiene la fecha actual del servidor para las fechas que lo requieran 
        var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

        //! Valida Formularios 
        if (self.__Frm_Usuario_Psw.validate().isValid === true) {
            /**
             * TODO: Se obtienen los datos del formulario y se recorren para detectar valores NULL
             * ! Obligatorio
             */
            var valuesNotNull = {};
            var _Obj_Datos_Fomrulario = self.__Frm_Usuario_Psw.option('formData');
            for(var key in _Obj_Datos_Fomrulario){
                if(_Obj_Datos_Fomrulario[key]){
                    valuesNotNull[key] = _Obj_Datos_Fomrulario[key];
                }
            }

            var _Obj_Insert_Data_Formulario = valuesNotNull;
            // TODO: Agregar campos de auditoria
            _Obj_Insert_Data_Formulario.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            _Obj_Insert_Data_Formulario.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            _Obj_Insert_Data_Formulario.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
            _Obj_Insert_Data_Formulario.AUDITORIA_FEC_ALTA = FechaActualSistema;
            _Obj_Insert_Data_Formulario.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
            _Obj_Insert_Data_Formulario.USU_CODESQUEMASEG = 3;
            _Obj_Insert_Data_Formulario.USU_AUTENTIFICA_REMOTO = 1;

            //* Si hay campos que se ingresan manualmente se tiene que formatear la fecha 
            if(_Obj_Insert_Data_Formulario.USU_FECHA_EXPIRA){ //Se detecta si la fecha viene llena
            _Obj_Insert_Data_Formulario.USU_FECHA_EXPIRA = moment(_Obj_Insert_Data_Formulario.USU_FECHA_EXPIRA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
            }

            //! Eliminar Objetos que no pertenecen a BD
            delete _Obj_Insert_Data_Formulario['USU_PASSWORD_CONFIRMA'];
            delete _Obj_Insert_Data_Formulario['USU_PASSWORD_CRYPTO'];
            delete _Obj_Insert_Data_Formulario['USU_PASSWORD'];

            _Obj_Insert_Data_Formulario.USU_PASSWORD = _Obj_Datos_Fomrulario.USU_PASSWORD_CRYPTO;
            //! Objeto que se enviara al llamado del API
            var _Objeto_Inserta_Api = {
                EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                Type: localStorage.getItem('Type'),
                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                DATA_INSERT: _Obj_Insert_Data_Formulario
            };

            __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Usuario','POST',JSON.stringify(_Objeto_Inserta_Api),getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    loadPanel.hide();
                    DevExpress.ui.notify({message: `Empleado insertado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});            

                    $btn_Alta_Usuario.option('visible',true);
                    $btn_Modificar_Usuario.option('visible',true);
                    $btn_Salvar_Alta_Usuario.option('visible',false);
                    $btn_Salvar_Modifica_Usuario.option('visible',false);
                    $btn_Cancelar_Alta_Usuario.option('visible',false);
                    $btn_Cancelar_Modificar_Usuario.option('visible',false);
                    self.__Frm_Usuario_Psw.option('readOnly', true);

                    var data_obj_Usuario = {
                        EMPLEADO_CSC_EMPLEADO: self.IdEmpleado
                    };   
                    self.ValidaUsuario(data_obj_Usuario)
                }
                else {
                    loadPanel.hide();
                }
            }).catch(function(e){
                loadPanel.hide();
                DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
            });
            
            } else {
                loadPanel.hide();
                DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
            }
        }

        self.ActualizaDatosUsuario = function(){
            var StringInfoForm = JSON.stringify(self.DatosUsuariosPsw);
            self.DatosUsuariosPsw = JSON.parse(StringInfoForm);

            var Form_Data_Usuarios = self.__Frm_Usuario_Psw.option('formData');
            var _Obj_Data_Update_Frm = GetUpdateData(self.DatosUsuariosPsw, Form_Data_Usuarios);
            var __ValidaCambios = Object.keys(_Obj_Data_Update_Frm).length === 0;
            var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');

            if( self.__Frm_Usuario_Psw.validate().isValid == true){
                if (__ValidaCambios == true) {
                    DevExpress.ui.notify({message: `No se detecto ningun cambio`,minWidth: 150,type: 'info',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                } else {
                //* Si hay campos que se ingresan manualmente se tiene que formatear la fecha 
                if(_Obj_Data_Update_Frm.USU_FECHA_EXPIRA){ //Se detecta si la fecha viene llena
                    _Obj_Data_Update_Frm.USU_FECHA_EXPIRA = moment(_Obj_Data_Update_Frm.USU_FECHA_EXPIRA).add(CalculaTimeposInsertUpdate(),'hours').format('YYYY-MM-DD HH:mm:ss'); 
                }

                _Obj_Data_Update_Frm.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                _Obj_Data_Update_Frm.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;

                //! Eliminar Objetos que no pertenecen a BD
                delete _Obj_Data_Update_Frm['USU_PASSWORD'];
                delete _Obj_Data_Update_Frm['USU_PASSWORD_CONFIRMA'];
                delete _Obj_Data_Update_Frm['USU_PASSWORD_CRYPTO'];
                _Obj_Data_Update_Frm.USU_PASSWORD = Form_Data_Usuarios.USU_PASSWORD_CRYPTO;

                var __Obj_Update = {
                    EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                    Type: localStorage.getItem('Type'),
                    EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                    DATA_UPDATE: _Obj_Data_Update_Frm,
                    DATA_WHERE:{
                        "EMPLEADO_CSC_EMPLEADO": self.DatosUsuariosPsw.EMPLEADO_CSC_EMPLEADO,
                        "NEWID": self.DatosUsuariosPsw.NEWID,
                        "USU_CSC_USUARIO": self.DatosUsuariosPsw.USU_CSC_USUARIO,
                        "EMP_CSC_EMPRESA_HOST": self.DatosUsuariosPsw.EMP_CSC_EMPRESA_HOST
                    }
                };

                console.log(__Obj_Update);
                __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Update_Usuario','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                    if (in_emp.success == true) {
                        loadPanel.hide();
                        DevExpress.ui.notify({message: `Usuario actualizado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});            

                        $btn_Alta_Usuario.option('visible',true);
                        $btn_Modificar_Usuario.option('visible',true);
                        $btn_Salvar_Alta_Usuario.option('visible',false);
                        $btn_Salvar_Modifica_Usuario.option('visible',false);
                        $btn_Cancelar_Alta_Usuario.option('visible',false);
                        $btn_Cancelar_Modificar_Usuario.option('visible',false);
                        self.__Frm_Usuario_Psw.option('readOnly', true);

                        var data_obj_Usuario = {
                            EMPLEADO_CSC_EMPLEADO: self.IdEmpleado
                        };   
                        self.ValidaUsuario(data_obj_Usuario)
                    }
                    else {
                        loadPanel.hide();
                    }
                }).catch(function(e){
                    loadPanel.hide();
                    DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                });

                }
            } else {
                DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});
            }
        }

}

setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);