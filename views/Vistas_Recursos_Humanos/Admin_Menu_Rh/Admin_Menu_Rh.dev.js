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

        $("#TagMesas").dxTagBox({
          showSelectionControls: true,
          applyValueMode: 'useButtons',
          displayExpr: "EMPLEADO_MNU_DESCRIPCION1",
          valueExpr: "EMPLEADO_MNU_CSC_MENU",
          dataSource: new DevExpress.data.DataSource({
            loadMode: "raw", paginate: false,    
            load: async function () {
                try {
                    var _ary = {Tbl:"SAMT_EMPLEADOS_MENU_DLL",NACTIVE:"EMPLEADO_MNU_ACTIVO"};
                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                        if (all_data.success == true){
                            return all_data.JsonData;
                        }
                        else {
                            console.log(all_data.message);
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
          }),
          onValueChanged: function (e) {
            var array_MesasPreasigna = e.value;
            var __DataSet_Grid_Bitacoras = $("#DataGridMenuRh").dxDataGrid("instance");
            var selected__DataSet_Grid_Bitacoras = null;
            if (__DataSet_Grid_Bitacoras.getDataSource() != null) {
              selected__DataSet_Grid_Bitacoras = __DataSet_Grid_Bitacoras.getDataSource().items();
            } 
            var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
            var Em = self.IdEmpleado;
            array_MesasPreasigna.forEach(function(item) {
              var ObjetoNuevo = (selected__DataSet_Grid_Bitacoras == null) ? undefined : selected__DataSet_Grid_Bitacoras.find(obj => obj.EMPLEADO_MENU_CSC_MENU === item);
              if (ObjetoNuevo == undefined) {
                var _Obj_Insert_Mesa_Empelado = {};
                // TODO: Agregar campos de auditoria
                _Obj_Insert_Mesa_Empelado.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                _Obj_Insert_Mesa_Empelado.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                _Obj_Insert_Mesa_Empelado.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                _Obj_Insert_Mesa_Empelado.AUDITORIA_FEC_ALTA = FechaActualSistema;
                _Obj_Insert_Mesa_Empelado.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                _Obj_Insert_Mesa_Empelado.EMPLEADO_CSC_EMPLEADO = Em;
                _Obj_Insert_Mesa_Empelado.EMPLEADO_MENU_CSC_MENU = item;

                //! Objeto que se enviara al llamado del API
                var _Objeto_Inserta_Api = {
                  EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                  Type: localStorage.getItem('Type'),
                  EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                  DATA_INSERT: _Obj_Insert_Mesa_Empelado
                };
                
                __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Insert_Rh_Menu_Empleado','POST',JSON.stringify(_Objeto_Inserta_Api),getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                  loadPanel.show();
                  if (in_emp.success == true) {
                      DevExpress.ui.notify({message: `Servicio asignado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                  }
                  else {
                  }
                }).catch(function(e){
                  DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                });
              }
            });

            setTimeout(() => {
              var jsonServEmpl = {
                  EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                  EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                  Type:localStorage.getItem('Type'),
                  EMPLEADO_CSC_EMPLEADO: self.IdEmpleado,
                  TPO_USUARIO: self.TpoUsuario 
              };
              self.Get_Rh_Menu_Empleado(jsonServEmpl);  
              loadPanel.hide();
            }, 3000);
            
          }
        });

        loadPanel.hide();
        self.IdEmpleado = getUrlParam('idemp');
        self.TpoUsuario = getUrlParam('TpoUsuario');
        
        $("#DataGridMenuRh").dxDataGrid({
          keyExpr: "EMPLEADO_MENU_CSC_MENU",
          selection: {
              mode: "single"
          },
          height: 390,
          scrolling: {
             // mode: "standard" // or "virtual" | "infinite"
              useNative: false,
              scrollByContent: true,
              scrollByThumb: true,
              showScrollbar: "always" // onHover or "onClick" | "always" | "never"
          },       
          hoverStateEnabled: true,
          showBorders: true,
          showRowLines: true,
          showColumnLines: true,
          rowAlternationEnabled: true,
          columnAutoWidth: false,
          columns: [
              {
                  caption: "Id",
                  dataField: "EMPLEADO_MENU_CSC_MENU",
                  alignment: "left",
                  width: 50
              },
              {
                  caption: "Menú",
                  dataField: "EMPLEADO_MNU_DESCRIPCION1",
                  alignment: "left"
              },
              {
                  type: 'buttons',
                  width: 110,
                  buttons: [{
                    text: 'Eliminar',
                    onClick(e) {
                      var jsonDatDel = {
                        EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                        EMP_CSC_EMPRESA_HOST: Number(localStorage.getItem('EMP_CSC_EMPRESA_HOST')),
                        Type:localStorage.getItem('Type'),
                        EMPLEADO_CSC_EMPLEADO: Number(self.IdEmpleado),
                        EMPLEADO_MENU_CSC_MENU: Number(e.row.data.EMPLEADO_MENU_CSC_MENU)
                      }

                      __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Del_Rh_Menu_Empleado','POST',JSON.stringify(jsonDatDel),getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
                        loadPanel.show();
                          if (in_emp.success == true) {
                            var jsonServEmpl = {
                              EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                              Type:localStorage.getItem('Type'),
                              EMPLEADO_CSC_EMPLEADO: self.IdEmpleado,
                              USU_CODESQUEMASEG: 3
                          };
                          self.Get_Rh_Menu_Empleado(jsonServEmpl)
                            DevExpress.ui.notify({message: `Menú retirado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                        }
                        else {
                        }
                      }).catch(function(e){
                        DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                      });
                    },
                  }],
              },
          ]
      });
      
      var jsonServEmpl = {
          EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
          EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
          Type:localStorage.getItem('Type'),
          EMPLEADO_CSC_EMPLEADO: self.IdEmpleado,
          USU_CODESQUEMASEG: 3
      };
        self.Get_Rh_Menu_Empleado(jsonServEmpl)
    }

    self.Get_Rh_Menu_Empleado = function(params){
      __Reques_ajax(getJSON(DeveloperType).ApiRecursosHumanos.url+'Get_Rh_Menu_Empleado','GET',params,getJSON(DeveloperType).ApiRecursosHumanos.token).then((in_emp)=>{
        loadPanel.show()
        if (in_emp.success == true) {
          var DataServicios = in_emp.JsonData;
          $("#DataGridMenuRh").dxDataGrid("instance").option("dataSource",  DataServicios);
          loadPanel.hide()
        }
        else{
          console.log('Sin Servicios Asignados');
          loadPanel.hide()
        }
      })
    }
}

setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);