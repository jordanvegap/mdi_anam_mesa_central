SalesDashboard.dashboardModel = function() {
    const self = this;
    self.LoadCatFull = true;
    self.CatalogosPantalla = [];
    const loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");

    /** TODO: Formatos y fechas
     * self.TimeZoneServidor: Se utilizara para los INSERT y UPDATE de la BD
     * self.TimeZoneEmpleado: Se utiliza para saber la fecha y hora de la plataforma del empleado
     * self.TiempoUTCEmpleado: Segun el tipo de dato se sumara o restara esas horas a las 
     *                         fechas se trae en los campos de fecha de la BD
    */
    self.TimeZoneServidor = localStorage.getItem('tmzServidor');
    self.TimeZoneEmpleado = localStorage.getItem('tmzEmpleado');
    self.TiempoUTCEmpleado = DiferencieTimeZones();

    /** Se utiliza en caso de generar Api Extras a DNA en la ruta "utils/Apis_Extras" se tiene qye agregar al HTML */
    self.datosApiExtras = null;

    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        loadPanel.hide();
        
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es-mx";}
        /** SIEMPRE AGREGAR ESTA LINEA */

        $("#splashscreen").fadeOut(1000);
    }


    /**
     * 
     * Permite cargar catalogos al abrir la pantalla
     * const _ObjetoPreConsulta = [{Tbl:"SAMT_AMBUASIS_TIPO_PRIORIDAD"}];
     * 
     * let _T_Regional = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta.Tbl[0])).toList();
     * _T_Regional.forEach(function(item) {self._Cmb_TipoRegional_ObjData.insert(item);});
     */
    self._LoadCatalogos = () =>{
        const _ObjetoPreConsulta = [{Tbl:"SAMT_AMBUASIS_TIPO_REGIONAL"}];
        let promises = _ObjetoPreConsulta.map( (fileKey) => {return self.CargaCatalogosPromise(fileKey, "Get_Cat_Full");});

        Promise.all(promises).then( (_Result) => {
            self.CatalogosPantalla = _Result;
            
            let _T_Regional = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,_ObjetoPreConsulta.Tbl[0])).toList();
            _T_Regional.forEach(function(item) {self._Cmb_TipoRegional_ObjData.insert(item);});

        }).catch(function (err) {
            console.log('Ha ocurrido un error:', err);
        });
    }
    self.CargaCatalogosPromise = (Objeto,EndPointRoute) => {
        return new Promise((resolve, reject) => {
            try {
                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+EndPointRoute,'GET',Objeto,getJSON(DeveloperType).ApiGeneral.token).then((dataResponse)=>{
                if (dataResponse.success === true) {
                    dataResponse.CatName = Objeto.Tbl;
                    resolve(dataResponse);
                } else{
                    resolve(dataResponse);
                }
            })
            } catch (error) {
                reject(error);
            }
        });
    }

    self._LoadCatEspecializados = () =>{
        const _ObjetoPreConsulta = [
            {Tbl:"Get_Country_Code"}
        ];
        var promises = _ObjetoPreConsulta.map( (fileKey) => {
            return self.CargaCatalogosEspecialPromise(fileKey);
        });

        Promise.all(promises).then( (_Result) => {
            self.CatalogosPantalla = _Result;
            var Country = jslinq(ObtenCatalogoPantalla(self.CatalogosPantalla,'Get_Country_Code')).toList();
            Country.forEach(function(item) {
              self._CountryCodes_ObjData.insert(item);
            });
        }).catch(function (err) {
            console.log('Ha ocurrido un error:', err);
        });
        
    }
    self.CargaCatalogosEspecialPromise = (Objeto) => {
        return new Promise((resolve, reject) => {
            try {
                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+Objeto.Tbl,'GET',Objeto,getJSON(DeveloperType).ApiGeneral.token).then((dataResponse)=>{
                if (dataResponse.success === true) {
                    dataResponse.CatName = Objeto.Tbl;
                    resolve(dataResponse);
                } else{
                    resolve(dataResponse);
                }
            })
            } catch (error) {
                reject(error);
            }
        });
    }

    self.notificaPantalla = function(Titulo = "Notificación",TituloDos = "Aviso", Mensaje = "", wP = 350, hP = 100){
        DevExpress.ui.notify({
            height: hP,
            width: wP,
            minWidth: 300,
            type: "default",
            displayTime: 15000,
            animation: {
              show: {
                type: 'fade', duration: 400, from: 0, to: 1,
              },
              hide: { type: 'fade', duration: 40, to: 0 },
            },
            closeOnClick: true,
            contentTemplate: (element) => {
                element.append(`
                    <div class="toast-dna">
                        <div class="toast-header-dna">
                            <img src="../../../images/asistente_virtual/AsisVritual_Info.svg" class="rounded me-2" alt="...">
                            <strong class="me-auto-dna">${Titulo}</strong>
                            <small class="text-muted-dna">${TituloDos}</small>
                            <img src="../../../images/Icons/CancelIcon.png" class="rounded2 me-2" alt="...">
                        </div>
                        <div class="toast-body-dna">${Mensaje}</div>
                    </div>`
                );
            },
          },
          {
            position: "bottom right",
            direction: "up-stack"
        });
    }
    
}
setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);