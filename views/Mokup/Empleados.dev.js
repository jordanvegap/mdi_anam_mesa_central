SalesDashboard.dashboardModel = function() {
    var self = this;
    var obj_DatosEmpleado = null;
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

    
    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es";}
        /** SIEMPRE AGREGAR ESTA LINEA */

        /** LABELS  PANTALLA*/
        $('#adm_title_ms').html(Globalize.formatMessage("adm_title_ms"));
        /** LABELS  PANTALLA*/

        /** TODO: Obtiene los datos encriptados de los local storage */
        var originalData = decrypt(localStorage.getItem('DatosEncriptados'));
        obj_DatosEmpleado = JSON.parse(originalData);

    }
}



setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);