SalesDashboard.dashboardModel = function() {
    var self = this;
    var obj_DatosEmpleado;
    var __obj_Cat_Tpo_Foto;
    self.DataOtOpen = null;
    self.setDefaultValues_Ots = false;
    self.Ids_TipoUso_Requi_Ots = 9;

    self.Frm_Ot_Instance = null;
    var loadPanel = $("#loadPanel").dxLoadPanel({
        hideOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        showIndicator: true,
        showPane: true,
        shading: true,
        visible: true
    }).dxLoadPanel("instance");
   
    const syncTreeViewSelection = function (treeViewInstance, value) {
        if (!value) {
            treeViewInstance.unselectAll();
        } else {
            treeViewInstance.selectItem(value);
        }
    };
    var _keyAsync = 'ID';
    var _keyCscEmpleado = 'EMPLEADO_CSC_EMPLEADO';
    var _keyEstOrdenCsc = 'ESTATUS_ORDEN_CSC';
    var _keyTpoAreaCsc = 'TIPO_AREA_CSC';
    var _keyReqCsc = 'REQ_CSCREQUISICION';
    var _keyDisiplinaCsc = 'TIPO_DISCIPLINA_OT_CSC';
    var _keyTpoOtTramite = 'TIPO_OT_TRAMITE_CSC';
    const makeAsyncDataSource = function (jsonFile) {
        return new DevExpress.data.CustomStore({
            loadMode: 'raw',
            key: _keyAsync,
            load() {
                return $.getJSON(`data/${jsonFile}`);
            },
        });
    };

    self.init = function() {
        /** SIEMPRE AGREGAR ESTA LINEA */
        obj_DatosEmpleado = JSON.parse( localStorage.getItem('obj_DatosEmpleado'));
        loadPanel.hide();
        $("#splashscreen").fadeOut(1000);
        Globalize.loadMessages(dictionary);var locale = getLocale();Globalize.locale(locale);DevExpress.localization.locale(locale);function getLocale() {var locale = sessionStorage.getItem("locale");return locale != null ? locale : "es-mx";}
        /** SIEMPRE AGREGAR ESTA LINEA */

        /*var __obj_Consulta_Tipo_Requ = {Tbl:"SAMT_TIPO_REQ_USO",NACTIVE:"TIPO_USO_DE_REQ_ACTIVO"};
        __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',__obj_Consulta_Tipo_Requ,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
            if (all_data.success == true){
                var EstatusFilter = jslinq( all_data.JsonData ).where(function(el) { return (el.TIPO_USO_DE_REQ_CLAVE).trim() == "MTZ"; }).toList();
                var finalData = jslinq(EstatusFilter).select(function(el){return el.TIPO_USO_DE_REQ_CSC;}).toList();
                self.Ids_TipoUso_Requi_Ots = finalData.join(",");
                console.log(self.Ids_TipoUso_Requi_Ots);
            }
            else {
                __cmb_component.option('dataSource', []);
            }
        });*/

        if (getUrlParam('TIPO') == 'EDITAR') {
            var __Oj_Dts_Busqueda = {
                OTR_NEWID: getUrlParam('OT_ID')
            }
            self.Get_OrdenTrabajos(__Oj_Dts_Busqueda,false,null,false);
        } else  if (getUrlParam('TIPO') == 'ALTA') {
            console.log(getUrlParam('TICKET_ID'));
        }
        __obj_Cat_Tpo_Foto = JSON.parse( sessionStorage.getItem('cat_origen_foto'));
        __obj_Cat_Tpo_Foto = jslinq(__obj_Cat_Tpo_Foto).where(function(el) { return el.TIPO_ORIGEN_CLAVE == 'OT'; }).toList();
        
        self.uploadProgressBar = $("#upload-progress").dxProgressBar({
            min: 0,
            max: 100,
            width: "100%",
            showStatus: false,
            visible: false
        }).dxProgressBar("instance");
        $('#Pop_Notificacion').dxPopup({
            width: 20,
            height: 20,
            visible: false,
            showTitle: false,
            title: 'Information',
            hideOnOutsideClick: false,
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                options: {
                  text: 'Cerrar',
                  onClick() {
                    $('#Pop_Notificacion').dxPopup("hide");
                  },
                },
            }]
        }).dxPopup('instance');

        $("#Tab_Panel_OrdenTrabajo_Detalle").dxTabPanel({
            animationEnabled: false,
            deferRendering: false,
            repaintChangesOnly: false,
            //itemTitleTemplate: titleTemplate,
            height: '200',
            elementAttr: {"id": "Tab-OrdenTrabajoDetalle"},
            dataSource: [
                //{ title: "Activos Fijos", template: "tab-ActivosFijos"},
                //{ title: "Insumos", template: "tab-Insumos"},
                //{ title: "Tareas", template: "tab-Tareas"},
                { title: "Bitacora", template: "tab-Bitacora"},
                //{ title: "Autorizacion", template: "tab-Autorizacion"},
                //{ title: "Documentos", template: "tab-Documentos"},
                { title: "Fotos", template: "tab-Fotos"},
                //{ title: "Empleado", template: "tab-Empleado"},
                //{ title: "Herramientas", template: "tab-Herramientas"},
                //{ title: "Servicios", template: "tab-Servicios"},
            ]
        }); 

        $("#File_Upload_Archivos_OrdenTrabajo").dxFileUploader({
            dialogTrigger: "#dropzone-id-frente",
            dropZone: "#dropzone-id-frente",
            multiple: false,
            allowedFileExtensions: [".jpg", ".jpeg", ".gif", ".png"],
            uploadMode: "useButtons",
            visible: false,
            onDropZoneEnter: function(e) {
                if(e.dropZoneElement.id === "dropzone-id-frente")
                    toggleDropZoneActive(e.dropZoneElement, true);
            },
            onDropZoneLeave: function(e) {
                if(e.dropZoneElement.id === "dropzone-id-frente")
                    toggleDropZoneActive(e.dropZoneElement, false);
            },
            onValueChanged: function(e) {
              var files = e.value;
              if (files && files[0]) {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                      //const dropZoneText = document.getElementById("dropzone-text-id-frente");
                      //dropZoneText.style.display = "none";
                      //$('#dropzone-image-id-frente').attr('src', e.target.result)
                      //$('#dropzone-image-id-frente').attr('src','./img/icons/upload.png')
                  };
                  reader.readAsDataURL(files[0]);
                  UploadDoc(files[0],'frente',files[0].type);
              }
            }
        }).dxFileUploader("instance");

        

        $('#___Tb_Ot').dxToolbar({
            onContentReady: function(){
                $Btn_Alta_OrdenTrabajo.option('visible',true);
                $btn_Modificar_OrdenTrabajo.option('visible',true);
                $btn_Salvar_Alta_OrdenTrabajo.option('visible',false);
                $btn_Salvar_Modifica_OrdenTrabajo.option('visible',false);
                $btn_Cancelar_Alta_OrdenTrabajo.option('visible',false);
                $btn_Cancelar_Modificar_OrdenTrabajo.option('visible',false);
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
                            $Btn_Alta_OrdenTrabajo = e.component;
                        },
                        onClick() {
                            $Btn_Alta_OrdenTrabajo.option('visible',false);
                            $btn_Modificar_OrdenTrabajo.option('visible',false);
                            $btn_Cancelar_Alta_OrdenTrabajo.option('visible',true);
                            $btn_Salvar_Alta_OrdenTrabajo.option('visible',true);
                            self.Frm_Ot_Instance.option('readOnly', false);
                            self.Frm_Ot_Instance.resetValues();
                            self.setDefaultValues_Ots = true;
                            setTimeout(() => {
                                self.Frm_Ot_Instance.getEditor('OTR_NEWID').option('value', createUUID(36));
                                self.Frm_Ot_Instance.getEditor('OTR_FECHA_ALTA').option('value', new Date());
                                self.Frm_Ot_Instance.getEditor('EMPLEADO_CSC_ALTA').option('value', obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO);
                                self.Frm_Ot_Instance.getEditor('EMPLEADO_CSC_SOLICITA').option('value', obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO);
                                self.Frm_Ot_Instance.getEditor('TIPO_AREA_CSC_SOLICITUD').option('value', obj_DatosEmpleado.CAT_AREA_CSC);
                                self.Frm_Ot_Instance.getEditor('CAT_DEPTO_CSC_SOLICITUD').option('value', obj_DatosEmpleado.CAT_DEPARTAMENTO_CSC);                                
                                self.Frm_Ot_Instance.getEditor('REQ_CSCREQUISICION').option('value', obj_DatosEmpleado.REQ_CSCREQUISICION);

                                /** AUTOLOAD DATASOURCE */
                                self.Frm_Ot_Instance.getEditor('TIPO_PRIORIDAD_CSC').getDataSource().reload();  
                                self.Frm_Ot_Instance.getEditor('TIPO_OT_TRAMITE_CSC').getDataSource().reload();  
                                self.Frm_Ot_Instance.getEditor('TIPO_CALIFICACION_CSC').getDataSource().reload();  
                                
                                
                            }, 1000);
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
                            $btn_Salvar_Alta_OrdenTrabajo = e.component;
                        },
                        onClick() {
                            loadPanel.show();
                            if( self.Frm_Ot_Instance.validate().isValid == true){
                                self.Generar_Alta_OrdenTrabajo();
                            }
                            else{
                                loadPanel.hide();
                                DevExpress.ui.notify('LLENE LOS CAMPOS EN ROJO');
                            }
                            
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
                            $btn_Cancelar_Alta_OrdenTrabajo = e.component;
                        },
                        onClick() {
                            $Btn_Alta_OrdenTrabajo.option('visible',true);
                            $btn_Modificar_OrdenTrabajo.option('visible',true);
                            $btn_Cancelar_Alta_OrdenTrabajo.option('visible',false);
                            $btn_Salvar_Alta_OrdenTrabajo.option('visible',false);
                            self.Frm_Ot_Instance.option('readOnly', true);
                            self.Frm_Ot_Instance.resetValues();
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
                          $btn_Modificar_OrdenTrabajo = e.component;
                      },
                      onClick() {
                        if (self.Frm_Ot_Instance.getEditor("OTR_NEWID").option("value") == "") {
                            DevExpress.ui.notify('No hay elemento a modificar');
                        }
                        else {
                            self.setDefaultValues_Ots = false;
                            $btn_Modificar_OrdenTrabajo.option('visible',false);
                            $Btn_Alta_OrdenTrabajo.option('visible',false);
                            $btn_Salvar_Modifica_OrdenTrabajo.option('visible',true);
                            $btn_Cancelar_Modificar_OrdenTrabajo.option('visible',true);
                            self.Frm_Ot_Instance.option('readOnly', false);

                            /*self.Frm_Ot_Instance.getEditor("TIPIFICA_CSC").option('readOnly', true);

                            switch (obj_DatosEmpleado.TIPO_EMPLEADO_EMPLEADO_CSC) {
                                case 11:
                                    self.Frm_Ot_Instance.getEditor("ESTATUS_OrdenTrabajo_CSC").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIPO_OrdenTrabajo_CSC").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("OTR_FECHA_PROGRAMADA").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIC_DESCRIPCION_SOLUCION").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("REQ_CSCREQUISICION").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("EMPLEADO_CSC_SOLICITA").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIPO_PRIORIDAD_CSC").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("OTR_FECHA_PROMESA").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIC_CERRADO").option('readOnly', true);
                                    
                                break;
                            
                                default:
                                    self.Frm_Ot_Instance.getEditor("TIC_DESCRIPCION").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIPO_CALIFICACION_CSC").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("REQ_CSCREQUISICION").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("EMPLEADO_CSC_SOLICITA").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIC_VIN").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIC_MODELO").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIC_ANIO_MODELO").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIC_PEDIDO_PARAGON").option('readOnly', true);
                                    self.Frm_Ot_Instance.getEditor("TIC_NUMPARTE").option('readOnly', true);
                                    
                                break;
                            }*/
                        }
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
                            $btn_Salvar_Modifica_OrdenTrabajo = e.component;
                        },
                        onClick() {
                            var StringInfoForm = JSON.stringify(self.DataOtOpen);
                            self.DataOtOpen = JSON.parse(StringInfoForm);

                            var Form_Data_OrdenTrabajo_servicio = self.Frm_Ot_Instance.option('formData');
                            var Obj_Data_Update_OrdenTrabajo = GetUpdateData(self.DataOtOpen, Form_Data_OrdenTrabajo_servicio);
                            var __ValidaCambios = Object.keys(Obj_Data_Update_OrdenTrabajo).length === 0;
                            if( self.Frm_Ot_Instance.validate().isValid == true){
                                if (__ValidaCambios == true) {
                                
                                } else {
                                    BitacoraCambios(
                                        self.DataOtOpen, //INFORMACION ORIGINAL DEL FORMULARIO
                                        Form_Data_OrdenTrabajo_servicio, //INFORMACION DEL FORMULARIO ACTUAL MODIFICADA
                                        self.Frm_Ot_Instance,//INSATNACIA DEL FORMULARIO
                                        343174  //ID DE LA SOLISITUD
                                    );
                                    Obj_Data_Update_OrdenTrabajo.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
                                    Obj_Data_Update_OrdenTrabajo.AUDITORIA_FEC_ULT_MOD = "GETDATE()";
                                    Obj_Data_Update_OrdenTrabajo.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
    
                                    if(Obj_Data_Update_OrdenTrabajo.OTR_FECHA_ALTA){
                                        Obj_Data_Update_OrdenTrabajo.OTR_FECHA_ALTA = ConvertDatetimeToStringBD(Obj_Data_Update_OrdenTrabajo.OTR_FECHA_ALTA);
                                    }
                                    if(Obj_Data_Update_OrdenTrabajo.OTR_FECHA_PROMESA){
                                        Obj_Data_Update_OrdenTrabajo.OTR_FECHA_PROMESA = ConvertDatetimeToStringBD(Obj_Data_Update_OrdenTrabajo.OTR_FECHA_PROMESA);
                                    }
                                    if(Obj_Data_Update_OrdenTrabajo.OTR_FECHA_PROGRAMADA){
                                        Obj_Data_Update_OrdenTrabajo.OTR_FECHA_PROGRAMADA = ConvertDatetimeToStringBD(Obj_Data_Update_OrdenTrabajo.OTR_FECHA_PROGRAMADA);
                                    }

                                    if (Obj_Data_Update_OrdenTrabajo.OTR_CERRADA == true) {
                                        Obj_Data_Update_OrdenTrabajo.OTR_FECHA_CIERRE = 'GETDATE()';
                                    }
                                    var __Obj_Update = {
                                        EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                                        Type: localStorage.getItem('Type'),
                                        EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                        DATA_UPDATE: Obj_Data_Update_OrdenTrabajo,
                                        DATA_WHERE:{
                                            "OTR_CSCORDENTRABAJO":self.DataOtOpen.OTR_CSCORDENTRABAJO,
                                            "OTR_NEWID":self.DataOtOpen.OTR_NEWID,
                                            "EMP_CSC_EMPRESA_HOST":localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                                        }
    
                                    };
                                    
                                    loadPanel.show();
                                    __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Update_Orden_Trabajo','POST',JSON.stringify(__Obj_Update),getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
                                        if (in_emp.success == true) {
                                            var StringInfoForm = JSON.stringify(in_emp.JsonData[0]);
                                            var InfoForm = JSON.parse(StringInfoForm);

                                            if (InfoForm.OTR_FECHA_CIERRE) {
                                                InfoForm.OTR_FECHA_CIERRE = ConvertStringToObjDateLong(InfoForm.OTR_FECHA_CIERRE);    
                                            }
                                            if (InfoForm.OTR_FECHA_PROMESA) {
                                                InfoForm.OTR_FECHA_PROMESA = ConvertStringToObjDateLong(InfoForm.OTR_FECHA_PROMESA);    
                                            }
                                            if (InfoForm.OTR_FECHA_ALTA) {
                                                InfoForm.OTR_FECHA_ALTA = ConvertStringToObjDateLong(InfoForm.OTR_FECHA_ALTA);    
                                            }
                                            if (InfoForm.OTR_FECHA_PROGRAMADA) {
                                                InfoForm.OTR_FECHA_PROGRAMADA = ConvertStringToObjDateLong(InfoForm.OTR_FECHA_PROGRAMADA);    
                                            }

                                            self.DataOtOpen = JSON.parse(StringInfoForm);

                                            self.Frm_Ot_Instance.updateData(InfoForm);
                                            
                                            loadPanel.hide();
                                            DevExpress.ui.notify( 'OT actualizada correctamente', 'success', 4000);
    
                                            $btn_Modificar_OrdenTrabajo.option('visible',true);
                                            $Btn_Alta_OrdenTrabajo.option('visible',true);
                                            $btn_Salvar_Modifica_OrdenTrabajo.option('visible',false);
                                            $btn_Cancelar_Modificar_OrdenTrabajo.option('visible',false);
                                            self.Frm_Ot_Instance.option('readOnly', true);
                                            setTimeout(() => {
                                                self.Get_Bitacora_OrdenTrabajos(InfoForm.OTR_CSCORDENTRABAJO)
                                                self.Get_Archivos_BD(InfoForm.OTR_CSCORDENTRABAJO);
                                            }, 3000);
                                            
                                        }
                                        else {
                                            loadPanel.hide();
                                        }
                                        return in_emp;
                                    })
                                    .catch(function(err){
                                        console.log(err);
                                        loadPanel.hide();
                                        DevExpress.ui.notify('Error al actualizar ticket intentelo nuevamente','error',10000);
                                    });
                                }
                            } else{
                                loadPanel.hide();
                                DevExpress.ui.notify('LLENE LOS CAMPOS EN ROJO');
                            }
                            
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
                            $btn_Cancelar_Modificar_OrdenTrabajo = e.component;
                        },
                        onClick() {
                            $btn_Modificar_OrdenTrabajo.option('visible',true);
                            $Btn_Alta_OrdenTrabajo.option('visible',true);
                            $btn_Salvar_Modifica_OrdenTrabajo.option('visible',false);
                            $btn_Cancelar_Modificar_OrdenTrabajo.option('visible',false);
                            self.Frm_Ot_Instance.option('readOnly', true);

                            var StringInfoForm = JSON.stringify(self.DataOtOpen);
                            self.DataOtOpen = JSON.parse(StringInfoForm);
                            self.Frm_Ot_Instance.updateData(self.DataOtOpen);

                        },
                    },
                  }
                /** //BOTONERA MODIFICAR */
                
            ],
        }).dxToolbar('instance');
        
        self.Frm_Ot_Instance = $('#__Frm_Orden_Trabajo').dxForm({
            readOnly: true,
            showColonAfterLabel: true,
            showValidationSummary: false,
            validationGroup: '__Frm_Orden_Trabajo_Validation',
            labelMode: 'static',
            labelLocation: 'top',
            screenByWidth(width) {
                return (width < 700) ? 'sm' : 'lg';
              },
            items: [
            /** NO VISIBLES */
            {
                itemType: "group",
                colCount: 4,
                cssClass:"hidden_box",
                items:[{
                    colSpan:4,
                    dataField: "OTR_NEWID",
                    label: {
                        text: "UUID"
                    },
                    editorOptions: {
                        readOnly:true,
                        disabled: false
                    }	
                },]
            }/** NO VISIBLES */
            ,{
                itemType: "group",
                colCount: 6,
                items:[
                    {
                        colSpan:6,
                        template: "<div class='heading_InnerFrm'><h2>Detalles de orden de trabajo</h2></div>",
                    },
                    {
                        colSpan:2,
                        dataField: "OTR_CSCORDENTRABAJO",
                        label: {
                            text: "No. de OT"
                        },
                        editorOptions: {
                            readOnly:true,
                            disabled: false
                        }	
                    },{
                        colSpan:2,
                        dataField: "OTR_CSCORDENTRABAJO",
                        label: {
                            text: "No. de Ticket"
                        },
                        editorOptions: {
                            readOnly:true,
                            disabled: false
                        }	
                    },{
                        colSpan:2,
                        dataField: "OTR_CERRADA",
                        editorType: "dxSwitch",
                        label: {
                            location: "left",
                            text: "Estatus",
                        },
                        editorOptions: {
                            switchedOffText:"Abierta",
                            switchedOnText:"Cerrada",
                            width:"100%",
                            onValueChanged: function(e){
                                console.log(e.value);
                                /*var form = $("#__Frm_Orden_Trabajo").dxForm("instance");
                                form.itemOption("TIC_DESCRIPCION_SOLUCION", 'isRequired', e.value);*/
                            }
                        }
                    },{
                        colSpan:3,
                        dataField: "EMPLEADO_CSC_ALTA",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Empleado Alta"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "NOMBRE",
                            valueExpr: "EMPLEADO_CSC_EMPLEADO",
                            deferRendering: false,
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.CustomStore({
                                    key: _keyCscEmpleado,
                                    loadMode: "raw", paginate: false,   
                                    load: async function () {
                                        return JSON.parse( sessionStorage.getItem("all_emp_host"));
                                    }
                                })
                            }),
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "ESTATUS_ORDEN_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Proceso"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "ESTATUS_ORDEN_IDIOMA1",
                            valueExpr: "ESTATUS_ORDEN_CSC",
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.CustomStore({
                                    key: _keyEstOrdenCsc,
                                    loadMode: "raw", paginate: false,   
                                    load: async function () {
                                        var _ary = {Tbl:"SAMT_ESTATUS_ORDEN_TRABAJO",NACTIVE:"ESTATUS_ORDEN_ACTIVO"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                            if (all_data.success == true){
                                                return all_data.JsonData;
                                            }
                                            else {
                                                console.log(all_data.message);
                                            }
                                        });
                                    }
                                })
                            }),
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "TIPO_AREA_CSC_SOLICITUD",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Area Solicita"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_AREA_IDIOMA1",
                            valueExpr: "TIPO_AREA_CSC",
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.CustomStore({
                                    key: _keyTpoAreaCsc,
                                    loadMode: "raw", paginate: false,   
                                    load: async function () {
                                        var _ary = {Tbl:"SAMT_CAT_EMPLEADO_AREA",NACTIVE:"TIPO_AREA_ACTIVO"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                            if (all_data.success == true){
                                                return jslinq( all_data.JsonData ).orderBy(function(el){return el.TIPO_AREA_IDIOMA1;}).toList();;
                                            }
                                            else {
                                                console.log(all_data.message);
                                            }
                                        });
                                    }
                                })
                            }),
                            onValueChanged: function (e) {
                                var newValue = e.value;
                                var componente1 = self.Frm_Ot_Instance.getEditor('CAT_DEPTO_CSC_SOLICITUD');
                                componente1.option('value', null);
                                var _ary = {Tbl:"SAMT_CAT_EMPLEADO_DEPARTAMENTO",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_AREA_CSC = " + newValue };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                    if (all_data.success == true){
                                        componente1.option('dataSource', all_data.JsonData);
                                    }
                                    else {
                                        componente1.option('dataSource', []);
                                    }
                                });
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "TIPO_AREA_CSC_RESPONSABLE",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Area Ejecuta"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_AREA_IDIOMA1",
                            valueExpr: "TIPO_AREA_CSC",
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.CustomStore({
                                    key: _keyTpoAreaCsc,
                                    loadMode: "raw", paginate: false,   
                                    load: async function () {
                                        var _ary = {Tbl:"SAMT_CAT_EMPLEADO_AREA",NACTIVE:"TIPO_AREA_ACTIVO"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                            if (all_data.success == true){
                                                return jslinq( all_data.JsonData ).where(function(el){return el.CAM_CSC_SERVICIO == obj_DatosEmpleado.CAM_CSC_SERVICIO;}).orderBy(function(el){return el.TIPO_AREA_IDIOMA1;}).toList();
                                                //return jslinq( all_data.JsonData ).orderBy(function(el){return el.TIPO_AREA_IDIOMA1;}).toList();;
                                            }
                                            else {
                                                console.log(all_data.message);
                                            }
                                        });
                                    }
                                })
                            }),
                            onValueChanged: function (e) {
                                var newValue = e.value;
                                var componente1 = self.Frm_Ot_Instance.getEditor('CAT_DEPTO_CSC_RESPONSABLE');
                                componente1.option('value', null);
                                var _ary = {Tbl:"SAMT_CAT_EMPLEADO_DEPARTAMENTO",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_AREA_CSC = " + newValue };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                    if (all_data.success == true){
                                        componente1.option('dataSource', all_data.JsonData);
                                    }
                                    else {
                                        componente1.option('dataSource', []);
                                    }
                                });
    
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "CAT_DEPTO_CSC_SOLICITUD",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Dep. Solicita"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "SAMT_TIPO_DEPARTAMENTO_IDIOMA1",
                            valueExpr: "EMPLEADO_DEPARTAMENTO_CSC",
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "CAT_DEPTO_CSC_RESPONSABLE",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Dep. Ejecuta"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "SAMT_TIPO_DEPARTAMENTO_IDIOMA1",
                            valueExpr: "EMPLEADO_DEPARTAMENTO_CSC",
                            onValueChanged: function (e) {

                                

                                if(self.DataOtOpen == null || self.DataOtOpen == undefined){
                                    self.Frm_Ot_Instance.getEditor('TIPO_ORDEN_CSC').option('value', null);
                                    self.Frm_Ot_Instance.getEditor('TIPO_ESPECIALIDAD_OT_CSC').option('value', null);
                                }

                                var newValue = e.value;
                                var componente1 = self.Frm_Ot_Instance.getEditor('TIPO_ORDEN_CSC');
                                var _ary = {Tbl:"SAMT_TIPO_ORDEN_TRABAJO",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND EMPLEADO_DEPARTAMENTO_CSC = " + newValue };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                    if (all_data.success == true){
                                        componente1.option('dataSource', all_data.JsonData);
                                    }
                                    else {
                                        componente1.option('dataSource', []);
                                    }
                                });
                                var componente2 = self.Frm_Ot_Instance.getEditor('TIPO_ESPECIALIDAD_OT_CSC');
                                var _ary = {Tbl:"SAMT_TIPO_ESPECIALIDAD_OT",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND EMPLEADO_DEPARTAMENTO_CSC = " + newValue };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                    if (all_data.success == true){
                                        componente2.option('dataSource', all_data.JsonData);
                                    }
                                    else {
                                        componente2.option('dataSource', []);
                                    }
                                });


                                var componente3 = self.Frm_Ot_Instance.getEditor('EMPLEADO_CSC_RESPONSABLE');
                               
                                var ObEmp = jslinq(JSON.parse(sessionStorage.getItem("all_emp_host"))).where(function(el) {
                                    return el.CAT_DEPARTAMENTO_CSC == newValue;
                                }).toList();
                                            
                                componente3.option('dataSource', ObEmp);

                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "EMPLEADO_CSC_SOLICITA",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Solicita"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "NOMBRE",
                            valueExpr: "EMPLEADO_CSC_EMPLEADO",
                            deferRendering: false,
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.CustomStore({
                                    key: _keyCscEmpleado,
                                    loadMode: "raw", paginate: false,   
                                    load: async function () {
                                        return JSON.parse( sessionStorage.getItem("all_emp_host"));
                                    }
                                })
                            }),
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "TIPO_ORDEN_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Tipo Orden"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_ORDEN_IDIOMA1",
                            valueExpr: "TIPO_ORDEN_CSC",
                            onValueChanged: function (e) {
                                var newValue = e.value;
                                var componente1 = self.Frm_Ot_Instance.getEditor('SUB_TIPO_CSC');
                                var _ary = {Tbl:"SAMT_TIPO_SUB_TIPO_OT",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_ORDEN_CSC = " + newValue };
                                __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                    if (all_data.success == true){
                                        componente1.option('dataSource', all_data.JsonData);
                                    }
                                    else {
                                        componente1.option('dataSource', []);
                                    }
                                });
                                
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "TIPO_PRIORIDAD_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Prioridad"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_PRIORIDAD_IDIOMA1",
                            valueExpr: "TIPO_PRIORIDAD_CSC",
                            dataSource: new DevExpress.data.DataSource({
                                loadMode: "raw", paginate: false,   
                                load: async function () {
                                    var _ary = {Tbl:"SAMT_TIPO_PRIORIDAD_OT",NACTIVE:"TIPO_PRIORIDAD_ACTIVO"};
                                    var componente1 = self.Frm_Ot_Instance.getEditor('TIPO_PRIORIDAD_CSC');
                                    return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                        if (all_data.success == true){
                                            if (self.setDefaultValues_Ots == true) {
                                                var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                                    return el.TIPO_PRIORIDAD_DEFAULT == 1;
                                                }).toList(); 
                                                componente1.option('value', __Defualt_Data[0].TIPO_PRIORIDAD_CSC);   
                                                console.log(__Defualt_Data[0].TIPO_PRIORIDAD_CSC);
                                            }
                                            return jslinq( all_data.JsonData ).orderBy(function(el){return el.TIPO_PRIORIDAD_ORDEN;}).toList();
                                        }
                                        else {
                                            console.log(all_data.message);
                                        }
                                    });
                                }
                            }),
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "SUB_TIPO_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Sub Tipo Orden"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "SUB_TIPO_OT_IDIOMA1",
                            valueExpr: "SUB_TIPO_CSC",
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "REQ_CSCREQUISICION",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Ubicación"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.CustomStore({
                                    key: _keyReqCsc,
                                    loadMode: "raw", paginate: false,   
                                    load: async function () {
                                        
                                        var _ary_Severidad = {Tbl:"SAMT_REQUISICIONES",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND ESTATUS_REQUISICION_CSC=1" };
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Severidad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                            if (all_data.success == true){
                                                return jslinq( all_data.JsonData ).orderBy(function(el){return el.REQ_NOMBREAREA;}).toList();
                                            }
                                            else {
                                                console.log(all_data.message);
                                            }
                                        });
                                    }
                                })
                            }),
                            displayExpr: "REQ_NOMBREAREA",
                            valueExpr: "REQ_CSCREQUISICION",
                            onValueChanged: function (e) {
                                var newValue = e.value;
                                /*var data = JSON.parse( sessionStorage.getItem("all_emp_host"));
                                var DatoViejo =  jslinq( data )
                                .where(function(el) { 
                                    return el.REQ_CSCREQUISICION == newValue  ;
                                })
                                .toList();
                                
                                self.Frm_Ot_Instance.getEditor('EMPLEADO_CSC_SOLICITA').option('dataSource', DatoViejo);*/
                            }
                        },
                        validationRules: [{
                            type: "required",
                            message: "requerido"
                        }]
                    },{
                        colSpan:3,
                        dataField: "TIPO_ESPECIALIDAD_OT_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Especialidad"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_ESPECIALIDAD_OT_IDIOMA1",
                            valueExpr: "TIPO_ESPECIALIDAD_OT_CSC",
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        }
                    },{
                        itemType: "empty",
                        colSpan:3,
                    },{
                        colSpan:3,
                        dataField: "TIPO_DISCIPLINA_OT_CSC",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Disciplina"
                        },
                        editorOptions: {
                            searchEnabled:true,
                            displayExpr: "TIPO_DISCIPLINA_OT_IDIOMA1",
                            valueExpr: "TIPO_DISCIPLINA_OT_CSC",
                            dataSource: new DevExpress.data.DataSource({
                                store: new DevExpress.data.CustomStore({
                                    key: _keyDisiplinaCsc,
                                    loadMode: "raw", paginate: false,   
                                    load: async function () {
                                        var _ary = {Tbl:"SAMT_TIPO_DISCIPLINA_OT",NACTIVE:"TIPO_DISCIPLINA_OT_ACTIVO"};
                                        return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                            if (all_data.success == true){
                                                return jslinq( all_data.JsonData ).orderBy(function(el){return el.TIPO_DISCIPLINA_OT_IDIOMA1;}).toList();;
                                            }
                                            else {
                                                console.log(all_data.message);
                                            }
                                        });
                                    }
                                })
                            }),
                            onValueChanged: function (e) {
                                var newValue = e.value;
                            }
                        }
                    },{
                        colSpan:6,
                        template: "<div class='heading_InnerFrm'><h2>Calendario</h2></div>",
                    },

                    {
                        itemType: "group",
                        colCount: 1,
                        colSpan:3,
                        items:[
                            {
                                colSpan:3,
                                dataField: "EMPLEADO_CSC_RESPONSABLE",
                                editorType: "dxSelectBox",
                                label: {
                                    text: "Empleado Asignado"
                                },
                                editorOptions: {
                                    searchEnabled:true,
                                    displayExpr: "NOMBRE",
                                    valueExpr: "EMPLEADO_CSC_EMPLEADO",
                                    deferRendering: false,
                                    onValueChanged: function (e) {
                                        var newValue = e.value;
                                    }
                                }
                            },
                            {
                                dataField: "OTR_FECHA_ALTA",
                                label: { 
                                    text: "Fecha de alta"
                                },
                                editorType: "dxDateBox",
                                editorOptions: {
                                    value:new Date(),
                                    type: "datetime",
                                    disabled: true,
                                    displayFormat: "dd/MM/yyyy hh:mm:ss",
                                    dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss"
                                }
                            },{
                                dataField: "OTR_FECHA_PROGRAMADA",
                                editorType: "dxDateBox",
                                label: { 
                                        text: "Fecha programada"
                                },
                                editorOptions: {
                                    type: 'datetime',
                                    disabled: false,
                                    width:'100%',
                                    placeholder: "DD/MM/AAAA HH:mm:ss",
                                    useMaskBehavior: true,
                                    displayFormat: "dd/MM/yyyy HH:mm:ss",
                                    dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                                    onValueChanged: function (e) {
                                        
                                    }
                                }
                            },{
                                dataField: "OTR_FECHA_PROMESA",
                                label: {
                                        text: "Fecha promesa"
                                },
                                editorType: "dxDateBox",
                                editorOptions: {
                                    type: 'datetime',
                                    disabled: false,
                                    width:'100%',
                                    placeholder: "DD/MM/AAAA HH:mm:ss",
                                    useMaskBehavior: true,
                                    displayFormat: "dd/MM/yyyy HH:mm:ss",
                                    dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                                    onValueChanged: function (e) {
                                        
                                    }
                                }
                            },{
                                dataField: "OTR_FECHA_CIERRE",
                                label: { 
                                        text: "Fecha Cierre"
                                },
                                editorType: "dxDateBox",
                                editorOptions: {
                                    readOnly: true,
                                    type: 'datetime',
                                    disabled: false,
                                    width:'100%',
                                    placeholder: "DD/MM/AAAA HH:mm:ss",
                                    useMaskBehavior: true,
                                    displayFormat: "dd/MM/yyyy HH:mm:ss",
                                    dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
                                    onValueChanged: function (e) {
                                        
                                    }
                                },
                            }
                        ]
                    },
                    {
                        itemType: "group",
                        colCount: 2,
                        colSpan:3,
                        items:[
                            {
                                colSpan:2,
                                dataField: "TIPO_OT_TRAMITE_CSC",
                                editorType: "dxSelectBox",
                                label: {
                                    text: "Tramite"
                                },
                                editorOptions: {
                                    searchEnabled:true,
                                    displayExpr: "TIPO_OT_TRAMITE_IDIOMA1",
                                    valueExpr: "TIPO_OT_TRAMITE_CSC",
                                    dataSource: new DevExpress.data.DataSource({
                                        store: new DevExpress.data.CustomStore({
                                            key: _keyTpoOtTramite,
                                            loadMode: "raw", paginate: false,   
                                            load: async function () {
                                                var _ary = {Tbl:"SAMT_TIPO_OT_TRAMITE",NACTIVE:"TIPO_OT_TRAMITE_ACTIVO"};
                                                var componente1 = self.Frm_Ot_Instance.getEditor('TIPO_OT_TRAMITE_CSC');
                                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat','GET',_ary,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                                    if (all_data.success == true){
                                                        if (self.setDefaultValues_Ots == true) {
                                                            var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                                                return el.TIPO_OT_TRAMITE_DEFAULT == 1;
                                                            }).toList(); 
                                                            componente1.option('value', __Defualt_Data[0].TIPO_OT_TRAMITE_CSC);
                                                        }
                                                        return jslinq( all_data.JsonData ).orderBy(function(el){return el.TIPO_OT_TRAMITE_ORDEN;}).toList();;
                                                    }
                                                    else {
                                                        console.log(all_data.message);
                                                    }
                                                });
                                            }
                                        })
                                    }),
                                    onValueChanged: function (e) {
                                        var newValue = e.value;
                                    }
                                },
                                validationRules: [{
                                    type: "required",
                                    message: "requerido"
                                }]
                            },
                            {
                                colSpan:2,
                                dataField: "TIPO_CALIFICACION_CSC",
                                editorType: "dxSelectBox",
                                label: {
                                    text: "Calificacion"
                                },
                                editorOptions: {
                                    searchEnabled:true,
                                    displayExpr: "TIPO_CALIFICACION_IDIOMA1",
                                    valueExpr: "TIPO_CALIFICACION_CSC",
                                    dataSource: new DevExpress.data.DataSource({
                                        loadMode: "raw", paginate: false,    
                                        load: async function () {
                                            try {
                                                var _ary_Severidad = {Tbl:"SAMT_TIPO_CALIFICACION",WHR:"EMP_CSC_EMPRESA_HOST = " + localStorage.getItem('EMP_CSC_EMPRESA_HOST') +" AND TIPO_CALIFICACION_ACTIVO = 1 " };
                                                var componente1 = self.Frm_Ot_Instance.getEditor('TIPO_CALIFICACION_CSC');
                                                return __Get_catalogos(getJSON(DeveloperType).ApiGeneral.url+'Get_Cat_Whr','GET',_ary_Severidad,getJSON(DeveloperType).ApiGeneral.token).then((all_data)=>{
                                                    if (all_data.success == true){
                                                        if (self.setDefaultValues_Ots == true) {
                                                            var __Defualt_Data =jslinq(all_data.JsonData).where(function(el) {
                                                                return el.TIPO_CALIFICACION_DEFAULT == 1;
                                                            }).toList(); 
                                                            componente1.option('value', __Defualt_Data[0].TIPO_CALIFICACION_CSC);
                                                        }
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
                                        var newValue = e.value;
                                    }
                                }
                            },
                        ]
                    },{
                        dataField: 'OTR_DESCRIPCION',
                        editorType: "dxTextArea",
                        colSpan:2,
                        label: { 
                            text: "Descripción"
                        },
                        editorOptions: {
                            height:58,
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        }
                    },{
                        dataField: 'OTR_SOLUCION',
                        editorType: "dxTextArea",
                        colSpan:2,
                        label: { 
                            text: "Detalle de solución"
                        },
                        editorOptions: {
                            height:58,
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        }
                    },{
                        dataField: 'OTR_CANCELACION',
                        editorType: "dxTextArea",
                        colSpan:2,
                        label: { 
                            text: "Detalle de cancelación"
                        },
                        editorOptions: {
                            height:58,
                            valueChangeEvent: "keyup",
                            onValueChanged: function (e) {
                                if (e.value == null || e.value == '') {} else{e.component.option("value", e.value.toUpperCase());}
                            }
                        }
                    }     
                ]
            },
            
        ]
        
        }).dxForm("instance");

        setTimeout(() => {
            self.Run();
        }, 3000);

        function BitacoraCambios(InfoOriginal, InfoForm,InstanceFormForm,idSolicitiud){

            var p = $.when();
            Object.entries(InfoForm).forEach(([key, value]) => {
        
                if( InfoForm[key] != InfoOriginal[key]){
                    var ElementEditor = InstanceFormForm.itemOption(key);
                    var EditoType = ElementEditor.editorType;
                    var EditoLabel = ElementEditor.label.text;
                    var DescripcionCambio = " '"+EditoLabel+"' cambio de  ";
        
                    if(EditoType == "dxTextBox" ){
                        DescripcionCambio += "'" + InfoOriginal[key] + "' a '" + InfoForm[key] + "'";
                    }
                    else if(EditoType == "dxCheckBox" ){
                        DescripcionCambio += "'" + InfoOriginal[key] + "' a '" + InfoForm[key] + "'";
                    }
                    else if(EditoType == "dxDateBox" ){
                        DescripcionCambio += "'" + InfoOriginal[key] + "' a '" + InfoForm[key] + "'";
                    }
                    else if(EditoType == "dxRadioGroup" || EditoType == "dxSelectBox" ){
                        var DataSoruce_Arry = null;
                        var DataSoruce = null;
                        var __cmb_component = InstanceFormForm.getEditor(key);
                        DataSoruce_Arry = __cmb_component.option('dataSource');
                        var __ValidaTipoDeDatos = Array.isArray( DataSoruce_Arry );
                        
                        if (__ValidaTipoDeDatos == true) {
                            DataSoruce = DataSoruce_Arry;
                        } else{
                            DataSoruce = DataSoruce_Arry.store().__rawData;
                        }
                        
                        if( DataSoruce == undefined){
                            DataSoruce = ElementEditor.editorOptions.dataSource;
                        }
                        var DatoViejo =  jslinq( DataSoruce )
                        .where(function(el) { 
                            return el[ElementEditor.editorOptions.valueExpr] == InfoOriginal[key]  ;
                        })
                        .toList();
        
                        var DatoNuevo =  jslinq( DataSoruce )
                        .where(function(el) { 
                            return el[ElementEditor.editorOptions.valueExpr] == InfoForm[key]  ;
                        })
                        .toList();
                        if(DatoViejo.length > 0){
                            DescripcionCambio += DatoViejo[0][ElementEditor.editorOptions.displayExpr] + " a ";
                        }
                        else{
                            DescripcionCambio += InfoOriginal[key] + " a ";
                        }
        
                        if(DatoNuevo.length > 0){
                            DescripcionCambio += DatoNuevo[0][ElementEditor.editorOptions.displayExpr];
                        }
                        else{
                            DescripcionCambio += InfoOriginal[key] 
                        }
        
                    }
                    else{
                        DescripcionCambio += "'" + InfoOriginal[key] + "' a '" + InfoForm[key] + "'";
                    }
                    var dataObj = {
                        EMP_CLV_EMPRESA :localStorage.getItem('EMP_CLV_EMPRESA'),
                        Type : localStorage.getItem('Type'),
                        DATA_INSERT:{
                            EMP_CSC_EMPRESA_HOST :  localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            AUDITORIA_USU_ALTA :  (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_USU_ULT_MOD: (JSON.parse(localStorage.getItem('obj_DatosEmpleado'))).EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_FEC_ALTA:"GETDATE()",
                            AUDITORIA_FEC_ULT_MOD:"GETDATE()",
                            OTR_CSCORDENTRABAJO: InfoForm.OTR_CSCORDENTRABAJO,
                            ESTATUS_ORDEN_CSC: InfoForm.ESTATUS_ORDEN_CSC,
                            OTB_NOMBRE: obj_DatosEmpleado.EMPLEADO_NOMBREEMPLEADO + ' ' + obj_DatosEmpleado.EMPLEADO_APATERNOEMPLEADO,
                            OTB_DESCRIPCION: DescripcionCambio,
                            OTB_FECHAHORA:"GETDATE()",
                        }
                        
                    };
                    p = p.then(function() { 
                        return __Reques_ajax_BitaoraDato( getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Insert_Bitacora_Ot', 'POST', JSON.stringify(dataObj), getJSON(DeveloperType).ApiOrdenTrabajo_v2.token )
                    }).catch(function() {
                        return false;
                    });
                }
                else{
                    p = p.then(function() { 
                        return false
                    });
                }
            });
        }


        $("#Dg_Documentos_OrdenTrabajo").dxDataGrid({
            headerFilter: { visible: false },
            keyExpr: "FOTO_GENERAL_CSC",
            selection: {
                mode: "single"
            },
            scrolling: {
               // mode: "standard" // or "virtual" | "infinite"
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // onHover or "onClick" | "always" | "never"
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            hoverStateEnabled: true,
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            columns: [
                {
                    caption: "DOCUMENTO",
                    dataField: "FOTO_DESCRIPCION",
                    alignment: "left",
                    
                },{
                    caption: "FECHA DE ALTA",
                    dataField: "FOTO_FECHA_ALTA",
                    alignment: "left",
                    cellTemplate: function (container, options) {
                        $("<div>")
                            .append( ConvertToDateSting(options.value,"ddmmyyyyhhmmss") )
                            .appendTo(container);
                    }
                    
                }],
                onRowDblClick: function (e) {
                    console.log(e.data);

                    window.open(e.data.FOTO_IMAGEN_RUTA);

                }
                
        })
        $("#Dg_Bitacota_OrdenTrabajo").dxDataGrid({
            deferRendering:true,
            allowColumnResizing: true,
            headerFilter: { visible: false },
            keyExpr: "OTB_CSCOTBITACORA",
            remoteOperations: false,
            searchPanel: {
                visible: false,
                highlightCaseSensitive: true
            },
            selection: {
                mode: "single"
            },
            scrolling: {
                mode: "virtual",
                showScrollbar: "always",
                useNative: true,
            },
            groupPanel: { visible: false },
            grouping: {
                autoExpandAll: true
            },
            paging: {
                enabled: false,
                pageIndex: 0,
                pageSize: 20
            },        
            showBorders: true,
            showRowLines: true,
            showColumnLines: true,
            rowAlternationEnabled: true,
            columnAutoWidth: false,
            columns: [{
                caption: "NOMBRE",
                dataField: "OTB_NOMBRE",
                
            },{
                caption: "DESCRIPCION",
                dataField: "OTB_DESCRIPCION",
                
            },{
                caption: "FECHA DE CAMBIO",
                dataField: "OTB_FECHAHORA",
                dataType: 'date',
                format:"dd-MM-yyyy HH:mm:ss",
                sortIndex: 1, sortOrder: "desc",
                calculateCellValue: function(data) {
                    if(data.OTB_FECHAHORA != null){
                        return ConvertStringToObjDateLong(data.OTB_FECHAHORA)
                    }
                    else{
                        return null;
                    }
                }
                
            }],
            onRowDblClick: function (e) {
        
                
            }
        });

    }

    self.Run = function(){
        
    }

    self.Generar_Alta_OrdenTrabajo=function(){
        var __Frm_Orden_Trabajo_servicio = self.Frm_Ot_Instance;
        var Form_Data_OrdenTrabajo_servicio = self.Frm_Ot_Instance.option('formData');
        if (__Frm_Orden_Trabajo_servicio.validate().isValid === true) {
            var Obj_Data_Insert_OrdenTrabajo = GetInsertData(Form_Data_OrdenTrabajo_servicio,__Frm_Orden_Trabajo_servicio);
            Obj_Data_Insert_OrdenTrabajo.AUDITORIA_USU_ALTA = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            Obj_Data_Insert_OrdenTrabajo.AUDITORIA_USU_ULT_MOD = obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO;
            Obj_Data_Insert_OrdenTrabajo.AUDITORIA_FEC_ALTA = "GETDATE()";
            Obj_Data_Insert_OrdenTrabajo.AUDITORIA_FEC_ULT_MOD = "GETDATE()";
            Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_ALTA_CORTA = "GETDATE()";
            Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_ALTA_HORA_COMPLETA = "GETDATE()";
            Obj_Data_Insert_OrdenTrabajo.EMP_CSC_EMPRESA_HOST = localStorage.getItem('EMP_CSC_EMPRESA_HOST');
            Obj_Data_Insert_OrdenTrabajo.CLIENTE_CSC = obj_DatosEmpleado.CLIENTE_CSC;
            Obj_Data_Insert_OrdenTrabajo.PM_CSC_PROYECTO = obj_DatosEmpleado.PM_CSC_PROYECTO;
            Obj_Data_Insert_OrdenTrabajo.CAM_CSC_SERVICIO = obj_DatosEmpleado.CAM_CSC_SERVICIO;

            if(Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_ALTA){
                Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_ALTA = ConvertDatetimeToStringBD(Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_ALTA);
            }
            if(Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_PROMESA){
                Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_PROMESA = ConvertDatetimeToStringBD(Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_PROMESA);
            }
            if(Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_PROGRAMADA){
                Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_PROGRAMADA = ConvertDatetimeToStringBD(Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_PROGRAMADA);
            }

            if (Obj_Data_Insert_OrdenTrabajo.OTR_CSCORDENTRABAJO == '') {
                delete Obj_Data_Insert_OrdenTrabajo['OTR_CSCORDENTRABAJO'];
            }

            if (Obj_Data_Insert_OrdenTrabajo.TIC_CERRADO == true) {
                Obj_Data_Insert_OrdenTrabajo.OTR_FECHA_CIERRE = 'GETDATE()';
            }
            
            var objInsert = {
                EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
                Type: localStorage.getItem('Type'),
                EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                DATA_INSERT: Obj_Data_Insert_OrdenTrabajo
            };
            __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Insert_Orden_Trabajo','POST',JSON.stringify(objInsert),getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
                if (in_emp.success == true) {
                    loadPanel.hide();
                    DevExpress.ui.notify( 'Ticket insertado correctamente', 'success', 4000);
                    $Btn_Alta_OrdenTrabajo.option('visible',true);
                    $btn_Modificar_OrdenTrabajo.option('visible',true);
                    $btn_Cancelar_Alta_OrdenTrabajo.option('visible',false);
                    $btn_Salvar_Alta_OrdenTrabajo.option('visible',false);
                    self.Frm_Ot_Instance.option('readOnly', true);
                    var __Oj_Dts_Busqueda = {
                        OTR_NEWID: Form_Data_OrdenTrabajo_servicio.OTR_NEWID,
                    }
                    self.Get_OrdenTrabajos(__Oj_Dts_Busqueda,true,null,true);
                }
                else {
                    loadPanel.hide();
                }
                return in_emp;
            }).catch(function(e){
                loadPanel.hide();
                DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
            });
        }
        else {
            DevExpress.ui.notify({ message: 'Llene los campos en rojo', position: { my: 'bottom center',  at: 'bottom center'}},'error',10000);
        }
    }

    self.Get_OrdenTrabajos=function(__AryDatos,PopAlert,DgRefresh,Ligado){
        loadPanel.show();
        var jsonBusqueda = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
        };
        var UnionObj = Object.assign(jsonBusqueda,__AryDatos);
        __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Get_Orden_Trabajo','GET',UnionObj,getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                loadPanel.hide();
                var CargaFrm = in_emp.JsonData[0];
                if (CargaFrm.OTR_FECHA_CIERRE) {
                    CargaFrm.OTR_FECHA_CIERRE = ConvertStringToObjDateLong(CargaFrm.OTR_FECHA_CIERRE);    
                }
                if (CargaFrm.OTR_FECHA_PROMESA) {
                    CargaFrm.OTR_FECHA_PROMESA = ConvertStringToObjDateLong(CargaFrm.OTR_FECHA_PROMESA);    
                }
                if (CargaFrm.OTR_FECHA_ALTA) {
                    CargaFrm.OTR_FECHA_ALTA = ConvertStringToObjDateLong(CargaFrm.OTR_FECHA_ALTA);    
                }
                if (CargaFrm.OTR_FECHA_PROGRAMADA) {
                    CargaFrm.OTR_FECHA_PROGRAMADA = ConvertStringToObjDateLong(CargaFrm.OTR_FECHA_PROGRAMADA);    
                }

                var StringInfoForm = JSON.stringify(CargaFrm);
                self.DataOtOpen = JSON.parse(StringInfoForm);
                
                self.Frm_Ot_Instance.updateData( self.DataOtOpen );
                
                setTimeout(() => {
                    self.Get_Bitacora_OrdenTrabajos(CargaFrm.OTR_CSCORDENTRABAJO);
                    self.Get_Archivos_BD(CargaFrm.OTR_CSCORDENTRABAJO);  
                    console.log(Ligado);
                    if (Ligado == true) {
                        var __Obj_Insert_Ot_Tik_ots = {
                            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                            TIC_CSCTICKET: getUrlParam('TICKET_ID'),
                            OTR_CSCORDENTRABAJO: self.DataOtOpen.OTR_CSCORDENTRABAJO,
                            AUDITORIA_USU_ALTA:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_USU_ULT_MOD:obj_DatosEmpleado.EMPLEADO_CSC_EMPLEADO,
                            AUDITORIA_FEC_ALTA:"GETDATE()",
                            AUDITORIA_FEC_ULT_MOD:"GETDATE()"
                            
                        }
                        self.Inserta_Interseccion_Ot_Ticket_Ots(__Obj_Insert_Ot_Tik_ots)
                    } 
                }, 3000);
                
                if (PopAlert == true) {
                    const popupContentTemplate = function () {
                        return $('<div>').append(
                            $("<div class='popup-property-details'>").append(
                                $('<div class="Nice-Shadow-1" style="padding: 9px;">ORDEN DE TRABAJO GENERADA</div>'),
                                $('<div class="content">').append(
                                    $('<img style=" width: 200px; height: 150px;" src="images/Icons/success_ticket.gif" alt="">'),
                                    $('<div style="flex-grow: 1; font-size: 20px; font-weight: bold;">No. Ot: '+in_emp.JsonData[0].OTR_CSCORDENTRABAJO+'</div>'),
                                    $('<div style="flex-grow: 1; font-size: 12px;">GUARDE SU NUMERO DE OT PARA FUTURAS CONSULTAS</div>'),
                                )
                            )
                        );
                    };
                    $("#Pop_Notificacion").dxPopup("instance").option("height",300);
                    $("#Pop_Notificacion").dxPopup("instance").option("width",360);
                    $("#Pop_Notificacion").dxPopup('instance').option('contentTemplate', popupContentTemplate);
                    $('#Pop_Notificacion').dxPopup("show");
                } else {
                    
                }
            } else {
                loadPanel.hide();
                if (PopAlert == true) {
                    DevExpress.ui.notify("OT NO LOCALIZADO", "error", 3000);
                } else{
                    DevExpress.ui.notify("OT NO LOCALIZADO", "error", 3000);
                }
            }
            return in_emp;
        }).catch(function(e){
            loadPanel.hide();
            console.log(e);
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
        });
    }

    self.Get_Bitacora_OrdenTrabajos=function(__AryDatos){
        var jsonBusqueda = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            EMP_CSC_EMPRESA_HOST:localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            Type:localStorage.getItem('Type'),
            OTR_CSCORDENTRABAJO: __AryDatos
        };
        __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Get_Ot_Bitacora','GET',jsonBusqueda,getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                console.log(in_emp.JsonData);
                $("#Dg_Bitacota_OrdenTrabajo").dxDataGrid("instance").option("dataSource", in_emp.JsonData);
            } else{
                $("#Dg_Bitacota_OrdenTrabajo").dxDataGrid("instance").option("dataSource", []);
            }
        }).catch(function(e){
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
            $("#Dg_Bitacota_OrdenTrabajo").dxDataGrid("instance").option("dataSource", []);
        });
    }

    self.Get_Archivos_BD=function() {
        var Form_Data_OrdenTrabajo_servicio = self.Frm_Ot_Instance.option('formData');
        var jsonDataBd = {
            EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
            Type: localStorage.getItem('Type'),
            EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            TIPO_ORIGEN_CSC: __obj_Cat_Tpo_Foto[0].TIPO_ORIGEN_CSC,
            FOTO_CSC_EXTERNO: Form_Data_OrdenTrabajo_servicio.OTR_CSCORDENTRABAJO
        };
        __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'Get_Archivos_General','GET',jsonDataBd,getJSON(DeveloperType).ApiGeneral.token).then((result)=>{
            if (result.success == true) {    
                
                $("#Dg_Documentos_OrdenTrabajo").dxDataGrid("instance").option("dataSource",  result.JsonData);
                
                /*var JSonData = result.JsonData;
                var ImagenesCarrusel = document.getElementById("ImagenesCarrusel");

                for (let i = 0; i < JSonData.length; i++) {
                    var Div_Container=document.createElement("div");
                        Div_Container.style.width = "80px";
                        Div_Container.style.height = "80px";
                        Div_Container.style.float = "left";
                        Div_Container.style.position = "relative";
                        Div_Container.style.margin = "5px";
                        //Div_Container.className = "chat-"+this._MessageCreated;
                        ImagenesCarrusel.appendChild(Div_Container);
                    var data_fancy = document.createElement("a");
                        data_fancy.setAttribute('href', JSonData[i].FOTO_IMAGEN_URL);
                        data_fancy.setAttribute("data-fancybox", "images");
                        data_fancy.setAttribute("data-caption", JSonData[i].FOTO_DESCRIPCION);
                        data_fancy.style.width = "80px";
                        data_fancy.style.height = "80px";
                        Div_Container.appendChild(data_fancy);
                    var Image_Message = document.createElement("img");
                        Image_Message.setAttribute("src", JSonData[i].FOTO_IMAGEN_URL);
                        Image_Message.setAttribute("height","100%");
                        Image_Message.setAttribute("width","auto");
                        Image_Message.style.maxWidth = "100%";
                        Image_Message.style.maxHeight = "100%";
                        Image_Message.style.objectFit = "contain";
                        data_fancy.appendChild(Image_Message);                        
                    var Ahref=document.createElement("a");
                        Ahref.setAttribute("href",JSonData[i].FOTO_IMAGEN_RUTA);
                        Ahref.setAttribute("data-lightbox", "gallery-2");
                        Ahref.setAttribute("data-category", JSonData[i]);
                        Ahref.className = "show-gallery filtr-item";
                        ImagenesCarrusel.appendChild(Ahref);
                }*/
            } else {
                console.log(result);
                loadPanel.hide();
            }
        });
    }

    function toggleDropZoneActive(dropZone, isActive) {
        /*if(isActive) {
            dropZone.classList.add("dx-theme-accent-as-border-color");
            dropZone.classList.remove("dx-theme-border-color");
            dropZone.classList.add("dropzone-active");
        } else {
            dropZone.classList.remove("dx-theme-accent-as-border-color");
            dropZone.classList.add("dx-theme-border-color");
            dropZone.classList.remove("dropzone-active");
        }*/
    }
    function UploadDoc(file,tpoimg,filetype){
        loadPanel.show();
        loadPanel.option("message", 'Cargando archivo...');
        //document.getElementById('crop_button').addEventListener('click', function(){
          console.log(file);
          var Data_File = file;
          var tipo = Data_File.type.split("/");
          var slashType = tipo[tipo.length-2];
          var extArch = tipo[tipo.length-1];
          var NombreArchivo = Data_File.name;
          var FilenameArry = Data_File.name.split(".");
          var FormatFile = FilenameArry[FilenameArry.length-1];     
          var FORM = new FormData()
          FORM.append('FileUpload', Data_File,getNewidArchivo()+"."+FormatFile);
          FORM.append('proyecto', localStorage.getItem('EMP_CLV_EMPRESA')+'/'+localStorage.getItem('EMP_CSC_EMPRESA_HOST')+'/'+__obj_Cat_Tpo_Foto[0].TIPO_ORIGEN_CLAVE+'/'+self.DataOtOpen.OTR_CSCORDENTRABAJO);
              $.ajax({
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        self.uploadProgressBar.option("visible", true);
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        self.uploadProgressBar.option("value", percentComplete);
                    }
                    }, false);
                    return xhr;
                },
                type: 'POST',
                url: 'https://cdn.dnasystem.io:2020/api/PageUpload',
                data: FORM,
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                headers: {
                    "access-token": '9E21547C-9511-4B2E-9139-2AF549CBA698'
                }
            }).done(function(data) {
                if (data.Estatus == 'Exito') {
                    console.log(data);
                    self.uploadProgressBar.option("visible", false);
                    const dropZoneText = document.getElementById("dropzone-text-id-"+tpoimg);
                    dropZoneText.innerHTML = '<span style="text-align: center;">Archivo cargado correctamente</span>';
                    $('#File_Upload_Archivos_OrdenTrabajo').dxFileUploader('instance').reset();  
                    console.log(filetype);
  
                    var DescDocto=null;
                    switch (filetype) {
                      case 'image/jpeg':
                        $('#dropzone-image-id-'+tpoimg).attr('src',data.filename);
                      break;
  
                      case 'image/png':
                        $('#dropzone-image-id-'+tpoimg).attr('src',data.filename);
                      break;
  
                      case 'application/pdf':
                        $('#dropzone-image-id-'+tpoimg).attr('src','./img/icons/upload.png');
                      break;
                    
                      default:
                        $('#dropzone-image-id-'+tpoimg).attr('src','./img/icons/upload.png');
                      break;
                    }
                    
                    var Form_Data_OrdenTrabajo_servicio = self.Frm_Ot_Instance.option('formData');

                    var jsonDataBd = {
                      EMP_CLV_EMPRESA:localStorage.getItem('EMP_CLV_EMPRESA'),
                      Type: localStorage.getItem('Type'),
                      EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
                      REQ_CSCREQUISICION: 0,
                      INM_CSCINMUEBLE:0,
                      FOTO_CSC_EXTERNO: Form_Data_OrdenTrabajo_servicio.OTR_CSCORDENTRABAJO,
                      TIPO_ORIGEN_CSC: __obj_Cat_Tpo_Foto[0].TIPO_ORIGEN_CSC,
                      FOTO_IMAGEN_RUTA: data.filename,
                      FOTO_IMAGEN_URL: data.filename,
                      FOTO_NUMERO_FOTO: DescDocto,
                      FOTO_DESCRIPCION: 'Documento: ' + NombreArchivo,
                      FOTO_ACTIVO: 1
                  };
                    Put_Archivos_BD(jsonDataBd);
                    loadPanel.hide();
                } else {
                   loadPanel.hide();
                }
            });
        //})
      } 

      function Put_Archivos_BD(objdata) {
        loadPanel.show();
        __Reques_ajax(getJSON(DeveloperType).ApiGeneral.url+'Put_Archivos_General','POST',JSON.stringify(objdata),getJSON(DeveloperType).ApiGeneral.token).then((result)=>{
            if (result.success == true) {    
                loadPanel.hide();
                self.Get_Archivos_BD();
            } else {
                console.log(result);
                loadPanel.hide();
            }
        });
      }

      function getNewidArchivo() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

    self.Inserta_Interseccion_Ot_Ticket_Ots=function(Obj_Data_Insert_Ticket){
        var objInsert = {
            EMP_CLV_EMPRESA: localStorage.getItem('EMP_CLV_EMPRESA'),
            Type: localStorage.getItem('Type'),
            EMP_CSC_EMPRESA_HOST: localStorage.getItem('EMP_CSC_EMPRESA_HOST'),
            DATA_INSERT: Obj_Data_Insert_Ticket
        };

        __Reques_ajax(getJSON(DeveloperType).ApiOrdenTrabajo_v2.url+'Insert_Inter_Ot_Ticket','POST',JSON.stringify(objInsert),getJSON(DeveloperType).ApiOrdenTrabajo_v2.token).then((in_emp)=>{
            if (in_emp.success == true) {
                loadPanel.hide();
            }
            else {
                loadPanel.hide();
            }
            return in_emp;
        }).catch(function(e){
            console.log(e);
            loadPanel.hide();
            DevExpress.ui.notify( 'ERROR EN COMUNICACION AL SERVIDOR, INTENTELO NUEVAMENTE', 'error', 3000);
        });

    }

}


 

setTimeout(() => {
    SalesDashboard.currentModel = new SalesDashboard.dashboardModel();
    SalesDashboard.currentModel.init();
}, 1000);