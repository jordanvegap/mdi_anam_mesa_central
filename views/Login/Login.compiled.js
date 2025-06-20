$(function () {
    function q() { } window.DnaMdi = new q; localStorage.setItem("__isLogin", !1); q.loginModel = function () {
        var b = this, t = new Date, e = $("#loadPanel").dxLoadPanel({ hideOnOutsideClick: !1, shadingColor: "rgba(0,0,0,0.4)", showIndicator: !0, showPane: !0, shading: !0, visible: !1 }).dxLoadPanel("instance"); b.__Clave_Empresa = ""; b.__Logotipo_Empresa = ""; b.subdomain = window.location.host.split(".")[1] ? window.location.host.split(".")[0] : !1; b.TimeZoneServidor = "Etc/GMT"; b.TimeZoneEmpleado = "Etc/GMT"; b.init = function () {
            Globalize.loadMessages(dictionary);
            var f = function () { var d = sessionStorage.getItem("locale"); return null != d ? d : "es" }(); Globalize.locale(f); DevExpress.localization.locale(f); b.subdomain ? subdomains_config.hasOwnProperty(b.subdomain) && (b.__Logotipo_Empresa = subdomains_config[b.subdomain].__Logotipo_Empresa, b.__Clave_Empresa = subdomains_config[b.subdomain].__Clave_Empresa) : (b.__Clave_Empresa = "ANAM", b.__Logotipo_Empresa = "DNA"); setTimeout(() => { b._RunLogin(locales, f) }, 1E3); ErrorDB.abrirDB().then(function (d) { console.log(d) }).catch(function (d) { console.error(d) });
            $("#popup_Actualizar_password").dxPopup({
                hideOnOutsideClick: !1, showCloseButton: !1, title: "Cambio de Contrase\u00f1a ", height: 320, width: 600, shadingColor: "#2a2a2ae6", position: { my: "center", at: "center", of: window }, onShowing: function (d) {
                    $("#__Form_Actualiza_Password").dxForm({
                        showColonAfterLabel: !0, showValidationSummary: !1, validationGroup: "__Form_Actualiza_Password_Validate", labelMode: "static", labelLocation: "top", width: "100%", colCount: 5, items: [{
                            colSpan: 2, itemType: "group", items: [{
                                template: $("<div>").attr({
                                    id: "logotipo_cliente",
                                    style: "\n                            width: 100%;\n                            height: 80px;\n                            background-size: contain;\n                            background-repeat: no-repeat;\n                            background-position: center;"
                                })
                            }, {
                                template: $("<div>").attr({ style: "\n                                text-align: center;\n                                font-size: 11px;\n                                font-family: 'Roboto';\n                                padding-top: 12px;\n                                font-weight: 700;" }).append($("<div>").attr({ style: "display: inline-block; padding: 0px 5px;" }).text("Usuario:"),
                                    $("<div>").attr({ id: "user_name_label", style: "font-weight: bold; display: inline-block; padding: 0px 5px;" }).text(" "), $("<div>").attr({ style: "font-weight: bold; display: inline-block; padding: 0px 5px; color: red" }).text("Han pasado varios d\u00edas desde tu \u00faltimo cambio de contrase\u00f1a. Por favor, c\u00e1mbiala para mantener tu cuenta segura."))
                            }]
                        }, {
                            colSpan: 3, itemType: "group", items: [{ colSpan: 3, itemType: "group", items: [{ template: $("<div>").attr({ style: "\n                                font-size: 10px;\n                                font-weight: 700;\n                                font-family: 'Roboto';" }).text("La contrase\u00f1a debe tener al menos una letra may\u00fascula, un n\u00famero y un s\u00edmbolo (@$!%*#?&), sin espacios y con un m\u00ednimo de 8 caracteres.") }] },
                            {
                                colCount: 2, itemType: "group", items: [{ template: $("<div>").attr({ style: "\n                                font-size: 12px;\n                                padding-top: 5px;\n                                font-weight: 700;\n                                font-family: 'Roboto';" }).text("Nuevo Password") }, {
                                    colSpan: 1, editorType: "dxTextBox", dataField: "PASSWORD_NUEVO", label: { text: " " }, editorOptions: {
                                        mode: "password", width: "100%", valueChangeEvent: "keyup", onValueChanged: function (a) {
                                            a = a.value; var c = $("#indicador_seguridad").dxLinearGauge("instance");
                                            if (0 === a.length) c.value(0); else if (validatePassword(a)) c.value(100); else { var h = 0; 8 <= a.length && (h += 25); /[A-Z]/.test(a) && (h += 25); /\d/.test(a) && (h += 25); /[@$!%*#?&]/.test(a) && (h += 25); c.value(h) }
                                        }, onFocusOut: function (a) {
                                            e.show(); a = { USU_PASSWORD: a.component.option("value") }; __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url + "CodificaPsw", "GET", a, getJSON(DeveloperType).ApiGeneral.token).then(c => {
                                                1 == c.success ? (localStorage.getItem("temp_segurity_cripto_pass") === c.JsonData ? (DevExpress.ui.notify({
                                                    message: "La constrase\u00f1a nueva no puede ser igual a la actual",
                                                    minWidth: 150, type: "error", displayTime: 5E3
                                                }, { position: "bottom right", direction: "up-push" }), $("#__Form_Actualiza_Password").dxForm("instance").getEditor("USU_PASSWORD_CRYPTO").option("value", null)) : $("#__Form_Actualiza_Password").dxForm("instance").getEditor("USU_PASSWORD_CRYPTO").option("value", c.JsonData), e.hide()) : (e.hide(), DevExpress.ui.notify({ message: "Error en comunicaci\u00f3n con codificadores", minWidth: 150, type: "error", displayTime: 5E3 }, { position: "bottom right", direction: "up-push" }))
                                            }).catch(function (c) {
                                                e.hide();
                                                DevExpress.ui.notify({ message: "Error en comunicaci\u00f3n con servidores", minWidth: 150, type: "error", displayTime: 5E3 }, { position: "bottom right", direction: "up-push" })
                                            })
                                        }
                                    }, validationRules: [{ type: "required", message: "requerido" }, { type: "custom", validationCallback: function (a) { return validatePassword(a.value) ? !0 : !1 }, message: "La contrase\u00f1a debe tener al menos una letra may\u00fascula, un n\u00famero y un s\u00edmbolo (@$!%*#?&), sin espacios y con un m\u00ednimo de 8 caracteres." }]
                                }]
                            }, {
                                itemType: "group",
                                items: [{ template: $("<div>").attr({ id: "indicador_seguridad" }) }]
                            }, {
                                colCount: 2, itemType: "group", items: [{ template: $("<div>").attr({ style: "\n                                font-size: 12px;\n                                padding-top: 5px;\n                                font-weight: 700;\n                                font-family: 'Roboto';" }).text("Confirmar Password") }, {
                                    colSpan: 1, editorType: "dxTextBox", dataField: "PASSWORD_CONFIRMAR", label: { text: " " }, editorOptions: {
                                        width: "100%", mode: "password", valueChangeEvent: "change",
                                        onValueChanged: function (a) { }
                                    }, validationRules: [{ type: "compare", comparisonTarget() { const a = $("#__Form_Actualiza_Password").dxForm("instance").getEditor("PASSWORD_NUEVO"); return a ? a.option("value") : null }, message: "'Contrase\u00f1a' y 'Confirmar contrase\u00f1a' no coinciden." }, { type: "stringLength", min: 8, message: "Minimo 8 caracteres" }, { type: "required", message: "requerido" }, { type: "stringLength", max: 30, message: "Maximo 30 caractres" }]
                                }]
                            }, {
                                itemType: "group", items: [{
                                    cssClass: "hidden_box", editorType: "dxTextBox",
                                    dataField: "USU_PASSWORD_CRYPTO", label: { text: "Crypto" }, editorOptions: { mode: "password" }, validationRules: [{ type: "required", message: "requerido" }]
                                }]
                            }, {
                                colCount: 2, itemType: "group", items: [{
                                    itemType: "button", horizontalAlignment: "center", buttonOptions: {
                                        text: Globalize.formatMessage("cam_confirm"), type: "normal", width: "100%", icon: "views/Login/Icons/Apply_32x32.png", onClick() {
                                            e.show(); var a = $("#__Form_Actualiza_Password").dxForm("instance"); if (!0 === a.validate().isValid) {
                                                let h = JSON.parse(localStorage.getItem("obj_SessionInfo"));
                                                var c = {}; a = a.option("formData"); c.USU_PASSWORD = a.USU_PASSWORD_CRYPTO; c.USU_FECHA_EXPIRA = moment().add(30, "days").format("YYYY-MM-DD HH:mm:ss"); c.AUDITORIA_FEC_ULT_MOD = "GETDATE()"; c.AUDITORIA_USU_ULT_MOD = h.EMPLEADO_CSC_EMPLEADO; c = {
                                                    EMP_CLV_EMPRESA: localStorage.getItem("EMP_CLV_EMPRESA"), Type: localStorage.getItem("Type"), EMP_CSC_EMPRESA_HOST: localStorage.getItem("EMP_CSC_EMPRESA_HOST"), DATA_UPDATE: c, DATA_WHERE: {
                                                        EMPLEADO_CSC_EMPLEADO: h.EMPLEADO_CSC_EMPLEADO, NEWID: h.NEWID, USU_CSC_USUARIO: h.USU_CSC_USUARIO,
                                                        EMP_CSC_EMPRESA_HOST: h.EMP_CSC_EMPRESA_HOST
                                                    }
                                                }; __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url + "Update_Usuario", "POST", JSON.stringify(c), getJSON(DeveloperType).ApiRecursosHumanos.token).then(m => {
                                                    1 == m.success ? (DevExpress.ui.notify({ message: "Usuario actualizado correctamente", minWidth: 150, type: "success", displayTime: 5E3 }, { position: "bottom right", direction: "up-push" }), $("#popup_Actualizar_password").dxPopup("hide")) : DevExpress.ui.notify({
                                                        message: "Error al actualizar el usuario solicite soporte para validar la configuracion del usuario",
                                                        minWidth: 150, type: "error", displayTime: 5E3
                                                    }, { position: "bottom right", direction: "up-push" }); e.hide()
                                                }).catch(function (m) { e.hide(); DevExpress.ui.notify({ message: "Error en comunicaci\u00f3n con servidores", minWidth: 150, type: "error", displayTime: 5E3 }, { position: "bottom right", direction: "up-push" }) })
                                            } else e.hide(), DevExpress.ui.notify({ message: "Llene valide la informacion antes de continuar", minWidth: 150, type: "error", displayTime: 5E3 }, { position: "bottom right", direction: "up-push" })
                                        }
                                    }
                                }, {
                                    itemType: "button", horizontalAlignment: "center",
                                    buttonOptions: { text: Globalize.formatMessage("cam_cancel"), type: "normal", width: "100%", icon: "views/Login/Icons/Cancel_32x32.png", onClick() { $("#popup_Actualizar_password").dxPopup("hide") } }
                                }]
                            }]
                        }]
                    }); $("#indicador_seguridad").dxLinearGauge({
                        size: { height: 80, width: 273 }, animation: { duration: 1E3, easing: "easeOutCubic", enabled: !0 }, containerBackgroundColor: "none", margin: { bottom: 0, left: 0, right: 0, top: 0 }, scale: { startValue: 0, endValue: 100, tickInterval: 25 }, title: {
                            margin: { bottom: 0, left: 10, right: 10, top: 0 }, text: "Fortaleza de contrase\u00f1a",
                            font: { size: 10 }
                        }, rangeContainer: { ranges: [{ startValue: 0, endValue: 25, color: "#f44336" }, { startValue: 25, endValue: 50, color: "#FF853A" }, { startValue: 50, endValue: 75, color: "#EDE100" }, { startValue: 75, endValue: 100, color: "#00AA13" }] }
                    })
                }, onHiding: function (d) { }, contentTemplate: function (d) { d.attr({ style: "display: flex; flex-direction: column;" }); d.append($("<div />").attr({ id: "__Form_Actualiza_Password", style: "border: solid red 0px; padding: 5px; margin-bottom: 5px;" })) }
            }); $("#popup_Cambiar_password").dxPopup({
                hideOnOutsideClick: !1,
                showCloseButton: !1, title: "Cambio de Contrase\u00f1a", height: 390, width: 350, shadingColor: "#2a2a2ae6", position: { my: "center", at: "center", of: window }, onShowing: function (d) {
                    $("#__Form_Cambio_Password").dxForm({
                        showColonAfterLabel: !0, showValidationSummary: !1, validationGroup: "__Form_Cambio_Password_Validate", labelMode: "static", labelLocation: "top", width: "100%", items: [{
                            colCount: 3, itemType: "group", items: [{ template: " " }, { template: $("<div>").attr({ id: "logotipo_cliente_2", style: "\n                            width: 100%;\n                            height: 60px;\n                            background-size: contain;\n                            background-repeat: no-repeat;\n                            background-position: center;" }) },
                            { template: " " }]
                        }, {
                            colCount: 2, itemType: "group", items: [{ colSpan: 2, dataField: "EMP_CLV_EMPRESA", label: { text: Globalize.formatMessage("EmpresaNombre") }, editorOptions: { value: b.__Clave_Empresa, readOnly: !0 } }, { colSpan: 2, dataField: "USU_LOGIN", label: { text: Globalize.formatMessage("Usuario") }, editorOptions: { readOnly: !1 }, validationRules: [{ type: "required", message: "Usuario requerido" }] }, {
                                colSpan: 2, colCount: 2, itemType: "group", items: [{
                                    itemType: "button", horizontalAlignment: "center", buttonOptions: {
                                        text: Globalize.formatMessage("cam_confirm"),
                                        type: "normal", width: "100%", icon: "views/Login/Icons/Apply_32x32.png", onClick() {
                                            e.show(); var a = $("#__Form_Cambio_Password").dxForm("instance"); if (!0 === a.validate().isValid) {
                                                var c = a.option("formData"); c.Type = getJSON(DeveloperType).ApiGeneral.Type; var h = getJSON(DeveloperType).ApiGeneral.url, m = getJSON(DeveloperType).ApiGeneral.token, n = null; __Reques_ajax(h + "GetInfoEmpresa", "GET", c, m).then(l => {
                                                    !0 === l.success ? (n = l.JsonData[0], c.EMP_CSC_EMPRESA_HOST = n.EMP_CSC_EMPRESA_HOST, __Reques_ajax(h + "reqChangePswd", "POST",
                                                        JSON.stringify(c), m).then(g => { console.log(g); !0 === g.success ? DevExpress.ui.notify("Si los datos son correctos llegara un mensaje al correo electronico registrado", "success", 15E3) : DevExpress.ui.notify(Globalize.formatMessage("ErrorLogin"), "error", 3E3); e.hide() }).catch(function (g) {
                                                            console.log(g); e.hide(); g = { fecha: moment().tz(b.TimeZoneServidor).format("DD-MM-YYYY HH:mm:ss"), fechaUsuario: moment().tz(b.TimeZoneEmpleado).format("DD-MM-YYYY HH:mm:ss"), mensaje: g, pantalla: "Login", tipo: "Consumo de API" }; ErrorDB.agregarError(g).catch(function (p) { console.error(p) });
                                                            DevExpress.ui.notify("ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE", "error", 3E3)
                                                        })) : (DevExpress.ui.notify("EMPRESA NO LOCALIZADA", "error", 3E3), e.hide())
                                                }).catch(function (l) {
                                                    console.log(l); e.hide(); l = { fecha: moment().tz(b.TimeZoneServidor).format("DD-MM-YYYY HH:mm:ss"), fechaUsuario: moment().tz(b.TimeZoneEmpleado).format("DD-MM-YYYY HH:mm:ss"), mensaje: l, pantalla: "Login", tipo: "Consumo de API" }; ErrorDB.agregarError(l).catch(function (g) { console.error(g) }); DevExpress.ui.notify("ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE",
                                                        "error", 3E3)
                                                })
                                            } else e.hide(), DevExpress.ui.notify({ message: "Llene valide la informacion antes de continuar", minWidth: 150, type: "error", displayTime: 5E3 }, { position: "bottom right", direction: "up-push" })
                                        }
                                    }
                                }, {
                                    itemType: "button", horizontalAlignment: "center", buttonOptions: {
                                        text: Globalize.formatMessage("cam_cancel"), type: "normal", width: "100%", icon: "views/Login/Icons/Cancel_32x32.png", onClick() {
                                            $("#popup_Cambiar_password").dxPopup("hide"); $("#__Form_Cambio_Password").dxForm("instance").option("formData", {});
                                            $("#__Form_Cambio_Password").dxForm("instance").resetValues(); $("#__Form_Cambio_Password").dxForm("instance").option("formData", { EMP_CLV_EMPRESA: b.__Clave_Empresa })
                                        }
                                    }
                                }]
                            }]
                        }]
                    }); $("#indicador_Seguridad_Cambio").dxLinearGauge({
                        size: { height: 80, width: 330 }, animation: { duration: 1E3, easing: "easeOutCubic", enabled: !0 }, containerBackgroundColor: "none", margin: { bottom: 0, left: 0, right: 0, top: 0 }, scale: { startValue: 0, endValue: 100, tickInterval: 25 }, title: {
                            margin: { bottom: 0, left: 10, right: 10, top: 0 }, text: "Fortaleza de contrase\u00f1a",
                            font: { size: 10 }
                        }, rangeContainer: { ranges: [{ startValue: 0, endValue: 25, color: "#f44336" }, { startValue: 25, endValue: 50, color: "#FF853A" }, { startValue: 50, endValue: 75, color: "#EDE100" }, { startValue: 75, endValue: 100, color: "#00AA13" }] }
                    })
                }, onHiding: function (d) { }, contentTemplate: function (d) { d.attr({ style: "display: flex; flex-direction: column;" }); d.append($("<div />").attr({ id: "__Form_Cambio_Password", style: "border: solid red 0px; padding: 5px; margin-bottom: 5px;" })) }
            })
        }; b.convertDate = function (f) {
            function d(a) {
                return 10 >
                    a ? "0" + a : a
            } f = new Date(f); return [d(f.getDate()), d(f.getMonth() + 1), f.getFullYear()].join("/")
        }; b._RunLogin = function (f, d) {
            moment.tz.zonesForCountry("MX"); sessionStorage.setItem("locale", d); f = {
                inputAttr: { id: "selectInput" }, dataSource: f, displayExpr: "name", valueExpr: "value", value: d, fieldTemplate: function (a, c) { var h = $("<div class='custom-item'><img src='" + (a ? a.ImageSrc : "") + "' /><div class='product-name'></div></div>"); h.find(".product-name").dxTextBox({ value: a && a.name, readOnly: !0 }); c.append(h) }, itemTemplate: function (a) {
                    return "<div class='custom-item'><img src='" +
                        a.ImageSrc + "' /><div class='product-name'>" + a.name + "</div></div>"
                }, onValueChanged: function (a) { sessionStorage.setItem("locale", a.value); document.location.reload(!0) }
            }; $("#selectBox").dxSelectBox(f); $("#VersionCodeLogin").html("VERSI\u00d3N: " + getJSON(DeveloperType).VersionCode); document.getElementById("Logo_Des").style.backgroundImage = "url('images/Logotipos/" + b.__Logotipo_Empresa + "/logo.svg')"; $("#Fecha").html(b.convertDate(t)); $("#txt_EstatusSession_new").html(Globalize.formatMessage("LoadText"));
            e.hide(); $("#Frm_Login").dxForm({
                showColonAfterLabel: !1, items: [{
                    itemType: "group", cssClass: "login-group", colCount: 1, items: [{
                        itemType: "group", items: [{ dataField: "EMP_CLV_EMPRESA", label: { text: Globalize.formatMessage("EmpresaNombre") }, editorOptions: { value: b.__Clave_Empresa, readOnly: !0 } }, { dataField: "USU_LOGIN", label: { text: Globalize.formatMessage("Usuario") }, editorOptions: { readOnly: !1 }, validationRules: [{ type: "required", message: "Usuario requerido" }] }, {
                            dataField: "USU_PASSWORD", label: { text: Globalize.formatMessage("Psw") },
                            editorOptions: { mode: "password", readOnly: !1 }, validationRules: [{ type: "required", message: "Contrase\u00f1a requerida" }]
                        }, {
                            itemType: "group", colCountByScreen: { xs: 4, sm: 4, md: 4, lg: 4 }, items: [{
                                colSpan: 2, itemType: "button", horizontalAlignment: "left", buttonOptions: {
                                    text: Globalize.formatMessage("lab_reset_pass"), type: "default", width: "144px", onClick() {
                                        $("#popup_Cambiar_password").dxPopup("show"); document.getElementById("logotipo_cliente_2").style.backgroundImage = "url('images/Logotipos/" + b.__Logotipo_Empresa + "/logo.svg')";
                                        $("#__Form_Cambio_Password").dxForm("instance").option("formData", {}); $("#__Form_Cambio_Password").dxForm("instance").resetValues(); $("#__Form_Cambio_Password").dxForm("instance").option("formData", { EMP_CLV_EMPRESA: b.__Clave_Empresa })
                                    }
                                }
                            }, { colSpan: 2, itemType: "button", horizontalAlignment: "right", buttonOptions: { text: Globalize.formatMessage("LogIn"), type: "success", useSubmitBehavior: !0, width: "100%" } }]
                        }]
                    }]
                }]
            }).dxForm("instance"); $("#form-login").on("submit", function (a) {
                e.show(); var c = $("#Frm_Login").dxForm("instance").option("formData");
                c.Type = getJSON(DeveloperType).ApiGeneral.Type; var h = getJSON(DeveloperType).ApiGeneral.url, m = getJSON(DeveloperType).ApiGeneral.token, n = null; __Reques_ajax(h + "GetInfoEmpresa", "GET", c, m).then(l => {
                    !0 === l.success ? (n = l.JsonData[0], localStorage.setItem("EMP_CSC_EMPRESA_HOST", n.EMP_CSC_EMPRESA_HOST), localStorage.setItem("EMP_CLV_EMPRESA", c.EMP_CLV_EMPRESA), localStorage.setItem("Type", c.Type), c.EMP_CSC_EMPRESA_HOST = n.EMP_CSC_EMPRESA_HOST, __Reques_ajax(h + "Login", "GET", c, m).then(g => {
                        if (!0 === g.success) {
                            c.EMPLEADO_CSC_EMPLEADO = g.JsonData[0].EMPLEADO_CSC_EMPLEADO; 
                            localStorage.setItem("obj_SessionInfo", JSON.stringify(g.JsonData[0])); 
                            let p = JSON.parse(localStorage.getItem("obj_SessionInfo")); 
                            const r = moment(p.USU_FECHA_EXPIRA, "YYYY-MM-DD HH:mm:ss"); 
                            console.log(r); 
                            r.isAfter(moment()) ? (setCookie(`${b.subdomain}_authCookie`, g.JsonData[0]), __Reques_ajax(h + "Get_Empleado", "GET", c, m).then(k => {
                                !0 === k.success ? (localStorage.setItem("__isLogin", !0), localStorage.setItem("obj_DatosEmpleado", JSON.stringify(k.JsonData[0])), localStorage.setItem("SkinWeb",
                                    b.__Logotipo_Empresa), "ANAM" == localStorage.getItem("EMP_CLV_EMPRESA") ? (localStorage.setItem("tmzEmpleado", "America/Bogota"), localStorage.setItem("tmzServidor", "America/Bogota")) : (localStorage.setItem("tmzEmpleado", k.JsonData[0].EMPLEADO_ZONA_HORARIA_CLAVE), localStorage.setItem("tmzServidor", "Etc/GMT")), k = JSON.stringify(k.JsonData[0]), k = encrypt(k), localStorage.setItem("DatosEncriptados", k), setTimeout(() => { location.href = "mdi.html" }, 2E3)) : (DevExpress.ui.notify("Datos de empleado no obtenidos",
                                        "error", 3E3), e.hide())
                            }).catch(function (k) { e.hide(); k = { fecha: moment().tz(b.TimeZoneServidor).format("DD-MM-YYYY HH:mm:ss"), fechaUsuario: moment().tz(b.TimeZoneEmpleado).format("DD-MM-YYYY HH:mm:ss"), mensaje: k, pantalla: "Login", tipo: "Consumo de API" }; ErrorDB.agregarError(k).catch(function (u) { console.error(u) }); DevExpress.ui.notify("ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE", "error", 3E3) })) : (g = { USU_PASSWORD: $("#Frm_Login").dxForm("instance").option("formData").USU_PASSWORD }, __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url +
                                "CodificaPsw", "GET", g, getJSON(DeveloperType).ApiGeneral.token).then(k => {
                                    1 == k.success ? (localStorage.setItem("temp_segurity_cripto_pass", k.JsonData), $("#popup_Actualizar_password").dxPopup("show"), document.getElementById("logotipo_cliente").style.backgroundImage = "url('images/Logotipos/" + b.__Logotipo_Empresa + "/logo.svg')", document.getElementById("user_name_label").innerText = p.USU_LOGIN, e.hide()) : DevExpress.ui.notify({ message: "Error en comunicaci\u00f3n con codificadores", minWidth: 150, type: "error", displayTime: 5E3 },
                                        { position: "bottom right", direction: "up-push" }); e.hide()
                                }).catch(function (k) { e.hide(); DevExpress.ui.notify({ message: "Error en comunicaci\u00f3n con servidores", minWidth: 150, type: "error", displayTime: 5E3 }, { position: "bottom right", direction: "up-push" }) }))
                        } else console.log("ERROR GET EMPLEADO"), DevExpress.ui.notify(Globalize.formatMessage("ErrorLogin"), "error", 3E3), e.hide()
                    }).catch(function (g) {
                        e.hide(); g = {
                            fecha: moment().tz(b.TimeZoneServidor).format("DD-MM-YYYY HH:mm:ss"), fechaUsuario: moment().tz(b.TimeZoneEmpleado).format("DD-MM-YYYY HH:mm:ss"),
                            mensaje: g, pantalla: "Login", tipo: "Consumo de API"
                        }; ErrorDB.agregarError(g).catch(function (p) { console.error(p) }); DevExpress.ui.notify("ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE", "error", 3E3)
                    })) : (console.log("EMPRESA NO LOCALIZADA"), DevExpress.ui.notify("EMPRESA NO LOCALIZADA", "error", 3E3), e.hide())
                }).catch(function (l) {
                    e.hide(); l = {
                        fecha: moment().tz(b.TimeZoneServidor).format("DD-MM-YYYY HH:mm:ss"), fechaUsuario: moment().tz(b.TimeZoneEmpleado).format("DD-MM-YYYY HH:mm:ss"), mensaje: l, pantalla: "Login",
                        tipo: "Consumo de API"
                    }; ErrorDB.agregarError(l).catch(function (g) { console.error(g) }); DevExpress.ui.notify("ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE", "error", 3E3)
                }); a.preventDefault()
            }); setTimeout(function () { $("#splashscreen").fadeOut(1E3) }, 2E3)
        }; b.InsertaFirmasystem = function () {
            var f = JSON.parse(localStorage.getItem("obj_DatosEmpleado")); let d = createUUID(36); f = {
                ...ReturnDefaultData_Init(), DATA_INSERT: {
                    EMP_CSC_EMPRESA_HOST: ReturnDefaultData_Init().EMP_CSC_EMPRESA_HOST, FIRMA_SESSION_ID: d,
                    EMPLEADO_CSC_EMPLEADO: f.EMPLEADO_CSC_EMPLEADO, FIRMA_FIRMADO: !0, FIRMA_DIRECCION_IP: "0.0.0.0", FIRMA_INICIO_FECHA_COMPLETA: "GETDATE()", FIRMA_NICIO_FECHA_CORTA: "GETDATE()", FIRMA_NICIO_HORA_COMPLETA: "GETDATE()", SAMT_TIPO_VERSION_SISTEMA: 13, FIRMA_VERSION_SISTEMA: getJSON(DeveloperType).VersionCode, FIRMA_FIN_FECHA_COMPLETA: "GETDATE()", FRIMA_FIN_FECHA_CORTA: "GETDATE()", FIRMA_FIN_HORA_COMPLETA: "GETDATE()", AUDITORIA_USU_ALTA: f.EMPLEADO_CSC_EMPLEADO, AUDITORIA_USU_ULT_MOD: f.EMPLEADO_CSC_EMPLEADO, AUDITORIA_FEC_ALTA: "GETDATE()",
                    AUDITORIA_FEC_ULT_MOD: "GETDATE()"
                }
            }; reqFirmaEmpleado(`${getJSON(DeveloperType).Bot_Presencia_Acd_Anam.url}Inserta_Firma_Sistema_Empleado`, "POST", JSON.stringify(f), getJSON(DeveloperType).Bot_Presencia_Acd_Anam.token).then(a => {
                1 == a.success ? (DevExpress.ui.notify(Globalize.formatMessage("SuccessLogin"), "success", 3E3), sessionStorage.setItem("SESSION_SYSTEM_ID", d), setTimeout(() => { location.href = "mdi.html" }, 2E3)) : (console.log("Error this"), DevExpress.ui.notify(Globalize.formatMessage("ErrorLogin"), "error",
                    3E3), e.hide())
            }).catch(function (a) { e.hide(); a = { fecha: moment().tz(b.TimeZoneServidor).format("DD-MM-YYYY HH:mm:ss"), fechaUsuario: moment().tz(b.TimeZoneEmpleado).format("DD-MM-YYYY HH:mm:ss"), mensaje: a, pantalla: "Login", tipo: "Consumo de API" }; ErrorDB.agregarError(a).catch(function (c) { console.error(c) }); DevExpress.ui.notify("ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE", "error", 3E3) })
        }; b.CloseFirmasystem = function () {
            e.show(); var f = JSON.parse(localStorage.getItem("obj_DatosEmpleado")); f = {
                ...ReturnDefaultData_Init(),
                DATA_UPDATE: { FIRMA_FIRMADO: !1, AUDITORIA_USU_ULT_MOD: f.EMPLEADO_CSC_EMPLEADO, AUDITORIA_FEC_ULT_MOD: "GETDATE()", FIRMA_FIN_FECHA_COMPLETA: "GETDATE()", FRIMA_FIN_FECHA_CORTA: "GETDATE()", FIRMA_FIN_HORA_COMPLETA: "GETDATE()" }, DATA_WHERE: { SAMT_TIPO_VERSION_SISTEMA: 13, EMPLEADO_CSC_EMPLEADO: f.EMPLEADO_CSC_EMPLEADO, FIRMA_FIRMADO: 1, EMP_CSC_EMPRESA_HOST: localStorage.getItem("EMP_CSC_EMPRESA_HOST") }
            }; reqFirmaEmpleado(`${getJSON(DeveloperType).Bot_Presencia_Acd_Anam.url}Update_Firma_Sistema_Empleado`, "POST", JSON.stringify(f),
                getJSON(DeveloperType).Bot_Presencia_Acd_Anam.token).then(d => { b.InsertaFirmasystem() }).catch(function (d) { e.hide(); d = { fecha: moment().tz(b.TimeZoneServidor).format("DD-MM-YYYY HH:mm:ss"), fechaUsuario: moment().tz(b.TimeZoneEmpleado).format("DD-MM-YYYY HH:mm:ss"), mensaje: d, pantalla: "Login", tipo: "Consumo de API" }; ErrorDB.agregarError(d).catch(function (a) { console.error(a) }); DevExpress.ui.notify("ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE", "error", 3E3) })
        }
    }; q.currentModel = new q.loginModel; q.currentModel.init()
});
