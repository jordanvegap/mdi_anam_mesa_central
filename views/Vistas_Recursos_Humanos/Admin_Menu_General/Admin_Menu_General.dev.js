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
    self.IdUsuario = null;
    self.DatosUsuariosPsw = null;
    self.obj_DatosEmpleado = null;
    self.dxTreeMenuGeneral = null;
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

        loadPanel.hide();
        self.IdEmpleado = getUrlParam('idemp');
        self.TpoUsuario = getUrlParam('TpoUsuario');
        self.IdUsuario = getUrlParam('idusu');

        $("#btn_asignar").dxButton({
          text: "Asignar",
          width: "100%",
          icon: "add",
          type: 'default',
          onClick: function() {
            const selectedData = self.dxTreeMenuGeneral.getSelectedRowsData('leavesOnly');
            var selected__DataSet_Grid_Bitacoras = null;
            if (self.dxDataGridMenuGeneral.getDataSource() != null) {
              selected__DataSet_Grid_Bitacoras = self.dxDataGridMenuGeneral.getDataSource().items();
            }
            var FechaActualSistema = moment().tz(self.TimeZoneServidor).format('YYYY-MM-DD HH:mm:ss');
            selectedData.forEach(function(item) {
              var ObjetoNuevo = (selected__DataSet_Grid_Bitacoras == null) ? undefined : selected__DataSet_Grid_Bitacoras.find(obj => obj.MNU_CSC_MENU === item.MNU_CSC_MENU);
              if (!ObjetoNuevo) {
                var _Obj_Insert_Menu_Empelado = {};
                // TODO: Agregar campos de auditoria
                _Obj_Insert_Menu_Empelado.AUDITORIA_USU_ALTA = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                _Obj_Insert_Menu_Empelado.AUDITORIA_USU_ULT_MOD = self.obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                _Obj_Insert_Menu_Empelado.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
                _Obj_Insert_Menu_Empelado.AUDITORIA_FEC_ALTA = FechaActualSistema;
                _Obj_Insert_Menu_Empelado.AUDITORIA_FEC_ULT_MOD = FechaActualSistema;
                _Obj_Insert_Menu_Empelado.USU_CSC_USUARIO = self.IdUsuario;
                _Obj_Insert_Menu_Empelado.MNU_CSC_MENU = item.MNU_CSC_MENU;

                //! Objeto que se enviara al llamado del API
                var _Objeto_Inserta_Api = {
                  EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                  Type: localStorage.getItem('Type'),
                  EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                  DATA_INSERT: _Obj_Insert_Menu_Empelado
                };
                
                __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'Insert_Mnu_Sis_Emp','POST',JSON.stringify(_Objeto_Inserta_Api),getJSON(DeveloperType).ApiGeneral.token).then((in_emp)=>{
                  loadPanel.show();
                  if (in_emp.success == true) {
                      DevExpress.ui.notify({message: `Menu asignado correctamente`,minWidth: 150,type: 'success',displayTime: 5000},{position: "bottom right",direction: "up-push"});
                  }
                  else {
                  }
                }).catch(function(e){
                  DevExpress.ui.notify({message: `Error en comunicación con servidores`,minWidth: 150,type: 'error',displayTime: 5000},{position: "bottom right",direction: "up-push"});            
                });
              }
            });

            setTimeout(() => {
              var jSonMnuEmpActivo = {
                EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                Type:localStorage.getItem('Type'),
                USU_CODESQUEMASEG: 'SEGMENU',
                USU_CSC_USUARIO: self.IdUsuario
              };
              self.GetMenuWebUsuario(jSonMnuEmpActivo); 
            }, 3000);

          }
        });
        
        self.dxTreeMenuGeneral = $("#dxTreeMenuGeneral").dxTreeList({
          keyExpr: "MNU_CSC_MENU",
          parentIdExpr: 'MNU_CSC_MENU_PADRE',
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          selection: {
            mode: 'multiple',
            recursive: true,
          },
          height: 400,
          columns: [
            {
                caption: "Servicio",
                dataField: "MNU_DESCRIPCION1",
                alignment: "left"
            }
          ],
          onSelectionChanged() {
            const selectedData = self.dxTreeMenuGeneral.getSelectedRowsData('leavesOnly');
          },
      }).dxTreeList("instance");

      self.dxDataGridMenuGeneral = $("#dxDataGridMenuGeneral").dxDataGrid({
          keyExpr: "MNU_CSC_MENU",
          selection: {
              mode: "single"
          },
          height: 432,
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
                  dataField: "MNU_CSC_MENU",
                  alignment: "left",
                  width: 50
              },
              {
                  caption: "Menú",
                  dataField: "MNU_DESCRIPCION1",
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
                        USU_CSC_USUARIO: Number(self.IdUsuario),
                        MNU_CSC_MENU: Number(e.row.data.MNU_CSC_MENU)
                      }

                      __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'Del_Mnu_Sis_Emp','POST',JSON.stringify(jsonDatDel),getJSON(DeveloperType).ApiGeneral.token).then((in_emp)=>{
                        loadPanel.show();
                          if (in_emp.success == true) {
                            var jsonServEmpl = {
                              EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                              EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                              Type:localStorage.getItem('Type'),
                              USU_CODESQUEMASEG: 'SEGMENU',
                              USU_CSC_USUARIO: self.IdUsuario
                          };
                          self.GetMenuWebUsuario(jsonServEmpl)
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
      }).dxDataGrid('instance');
      
      var jsonServEmpl = {
          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
          EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
          Type:localStorage.getItem('Type'),
          MNU_ACTIVO_WEB: 1
      };
      self.GetMnuSistema(jsonServEmpl);

      var jSonMnuEmpActivo = {
          EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
          EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
          Type:localStorage.getItem('Type'),
          USU_CODESQUEMASEG: 'SEGMENU',
          USU_CSC_USUARIO: self.IdUsuario
      };
      self.GetMenuWebUsuario(jSonMnuEmpActivo);
    }

    self.GetMnuSistema = function(params){
      __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'GetMnuSistema','GET',params,getJSON(DeveloperType).ApiGeneral.token).then((in_emp)=>{
        loadPanel.show()
        if (in_emp.success == true) {
          var DataServicios = in_emp.JsonData;
          self.dxTreeMenuGeneral.option("dataSource",  DataServicios);
          loadPanel.hide()
        }
        else{
          console.log('Sin Servicios Asignados');
          loadPanel.hide()
        }
      })
    }

    self.GetMenuWebUsuario = function(params){
      __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'GetMenuWebUsuario','GET',params,getJSON(DeveloperType).ApiGeneral.token).then((in_emp)=>{
        loadPanel.show()
        if (in_emp.success == true) {
          var DataServicios = in_emp.JsonData;
          self.dxDataGridMenuGeneral.option("dataSource",  DataServicios);
          var result = jslinq(DataServicios).select(function(el){return el.MNU_CSC_MENU;}).toList();
          self.dxTreeMenuGeneral.option("selectedRowKeys",  result);
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