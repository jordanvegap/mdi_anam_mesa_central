
"use strict";

//import sha256 from '../../node_modules/CryptoJS-js/CryptoJS-js/sha256.js';

$(function () {
    window.DnaMdiPswd = new DnaMdiPswd();
    function DnaMdiPswd() {};
    localStorage.setItem('__isLogin', false);
    DnaMdiPswd.changePasswordModel = function() {
    var self = this;
    var now = new Date();
    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: false
    }).dxLoadPanel("instance");

    self.__Clave_Empresa = '';
    self.__Logotipo_Empresa = '';
    self.subdomain =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;

    self.TimeZoneServidor = 'Etc/GMT';
    self.TimeZoneEmpleado = 'Etc/GMT';
    
    self.tokenSystem = '';

    self.init = function () {
        /** SIEMPRE AGREGAR ESTA LINEA */
        Globalize.loadMessages(dictionary);
        var locale = getLocale();
        Globalize.locale(locale);
        DevExpress.localization.locale(locale);
        function getLocale() {
            var locale = sessionStorage.getItem("locale");
            return locale != null ? locale : "es";
        }
        self.__Logotipo_Empresa = subdomains_config[self.subdomain].__Logotipo_Empresa;
        self.__Clave_Empresa = subdomains_config[self.subdomain].__Clave_Empresa;

        setTimeout(() => {
            self._RunLogin(locales,locale);
        }, 1000);

        ErrorDB.abrirDB()
        .then(function(message) {
            console.log(message);
        })
        .catch(function(error) {
            console.error(error);
        });
    }

    self.convertDate = function (inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }

    self._RunLogin = function(locales,locale){
        var zones = moment.tz.zonesForCountry('MX'); 
        setLocale(locale)
        
        function changeLocale(data) {
            setLocale(data.value);
            document.location.reload(true);
        }
        function setLocale(locale) {
            sessionStorage.setItem("locale", locale);
        }
        /** SIEMPRE AGREGAR ESTA LINEA */
        $('#VersionCodeLogin').html('VERSIÓN: ' + getJSON(DeveloperType).VersionCode);
        document.getElementById("Logo_Des").style.backgroundImage = "url('images/Logotipos/"+self.__Logotipo_Empresa+"/logo.svg')";
        
        $('#Fecha').html( self.convertDate(now) );
        $('#txt_EstatusSession_new').html(Globalize.formatMessage("LoadText"));
        
        loadPanel.hide();

        self.BarraUsuarios = $("#Barra_Usuarios").dxToolbar({
            onContentReady: function(){
                self.btn_Salvar_Modifica_Usuario.option('visible',true);
            },
            items: [
  
                /** BOTONERA MODIFICAR */{
                    location: 'center',
                    widget: 'dxButton',
                    locateInMenu: 'auto',
                    options: {
                        icon: 'save',
                        text: 'Cambiar contraseña',
                        type: 'success',
                        onInitialized: function(e) {  
                            self.btn_Salvar_Modifica_Usuario = e.component;
                        },
                        onClick() {
                          self.ActualizaDatosUsuario();
                        },
                    },
                  }
                /** //BOTONERA MODIFICAR */
                
            ],
          }).dxToolbar('instance');
          
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

          

        self.__Frm_Usuario_Psw = $("#__Frm_Usuario").dxForm(
            {
              "readOnly": false,
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
                
            ]
            }).dxForm('instance');
        
            self.ActualizaDatosUsuario = function(){
                loadPanel.show();
                var _Obj_Data_Update_Frm = {};
                var Form_Data_Usuarios = self.__Frm_Usuario_Psw.option('formData');
                var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
    
                if( self.__Frm_Usuario_Psw.validate().isValid == true){
                    
                    delete Form_Data_Usuarios['USU_PASSWORD'];
                    delete Form_Data_Usuarios['USU_PASSWORD_CONFIRMA'];
    
                    _Obj_Data_Update_Frm.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                    _Obj_Data_Update_Frm.USU_PASSWORD = Form_Data_Usuarios.USU_PASSWORD_CRYPTO;
    
                    var __Obj_Update = {
                        EMP_CLV_EMPRESA: 'ANAM',
                        Type: 'Pru',
                        EMP_CSC_EMPRESA_HOST: 1,
                        TokenSystem: getUrlParam('idTokenSystem'),
                        DATA_UPDATE: _Obj_Data_Update_Frm
                    };

                    __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'updateChangePswd','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiGeneral.token).then((in_emp)=>{
                        if (in_emp.success == true) {
                            loadPanel.hide();
                            DevExpress.ui.notify({message: `Contraseña cambiada correctamente, puede cerrar esta ventana`,minWidth: 150,type: 'success',displayTime: 15000},{position: "bottom right",direction: "up-push"});            
                            self.btn_Salvar_Modifica_Usuario.option('visible',false);
                        }
                        else {
                            loadPanel.hide();
                        }
                    }).catch(function(e){
                        loadPanel.hide();
                        DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 10000},{position: "bottom right",direction: "up-push"});            
                    });
    
                    //}
                } else {
                    loadPanel.hide();
                    DevExpress.ui.notify({message: `Llene los campos en rojo`,minWidth: 150,type: 'error',displayTime: 10000},{position: "bottom right",direction: "up-push"});
                }
            }
        setTimeout(function() {
            $("#splashscreen").fadeOut(1000);
        }, 2000);
    }

}

    DnaMdiPswd.currentModel = new DnaMdiPswd.changePasswordModel();
    DnaMdiPswd.currentModel.init();
});
