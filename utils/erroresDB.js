// errorDB.js

let ErrorDB = (function() {
    let db;
    
    // Función para abrir la base de datos
    function abrirDB() {
      return new Promise(function(resolve, reject) {
        let request = indexedDB.open('erroresDB', 1);
  
        request.onerror = function(event) {
          reject('Error al abrir la base de datos: ' + event.target.errorCode);
        };
  
        request.onsuccess = function(event) {
          db = event.target.result;
          resolve('Base de datos abierta con éxito');
        };
  
        request.onupgradeneeded = function(event) {
          db = event.target.result;
          let objectStore = db.createObjectStore('errores', { autoIncrement: true });
            objectStore.createIndex('fecha', 'fecha', { unique: false });
            objectStore.createIndex('fechaUsuario', 'fechaUsuario', { unique: false });
            objectStore.createIndex('mensaje', 'mensaje', { unique: false });
            objectStore.createIndex('pantalla', 'pantalla', { unique: false });
            objectStore.createIndex('tipo', 'tipo', { unique: false });
          console.log('Almacenamiento de objetos creado');
        };
      });
    }
  
    // Función para agregar un error a la base de datos
    function agregarError(error) {
      let transaction = db.transaction(['errores'], 'readwrite');
      let objectStore = transaction.objectStore('errores');
      let request = objectStore.add(error);
      
      return new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
          resolve('Error agregado a la base de datos');
        };
  
        request.onerror = function(event) {
          reject('Error al agregar el error: ' + event.target.errorCode);
        };
      });
    }
  
    // Función para obtener todos los errores de la base de datos
    function obtenerErrores() {
      let transaction = db.transaction(['errores'], 'readonly');
      let objectStore = transaction.objectStore('errores');
      let errores = [];
  
      return new Promise(function(resolve, reject) {
        objectStore.openCursor().onsuccess = function(event) {
          let cursor = event.target.result;
          if (cursor) {
            errores.push(cursor.value);
            cursor.continue();
          } else {
            resolve(errores);
          }
        };
      });
    }
  
    // Función para limpiar todos los errores de la base de datos
    function limpiarErrores() {
      let transaction = db.transaction(['errores'], 'readwrite');
      let objectStore = transaction.objectStore('errores');
      let request = objectStore.clear();
      
      return new Promise(function(resolve, reject) {
        request.onsuccess = function(event) {
          resolve('Errores eliminados de la base de datos');
        };
  
        request.onerror = function(event) {
          reject('Error al eliminar errores: ' + event.target.errorCode);
        };
      });
    }

    /**
     * 
     * ErrorDB.abrirDB()
            .then(function(message) {
                console.log(message);
                let errorIndex = {
                    fecha: moment().tz(self.TimeZoneServidor).format('DD-MM-YYYY HH:mm:ss'),
                    fechaUsuario: moment().tz(self.TimeZoneEmpleado).format('DD-MM-YYYY HH:mm:ss'),
                    mensaje: "Error inesperado",
                    pantalla: "mdi",
                    tipo: "Error crítico"
                  };
                return ErrorDB.agregarError(errorIndex);
            })
            .catch(function(error) {
                console.error(error);
            });
     * **/
  
    // Devolver las funciones públicas
    return {
      abrirDB: abrirDB,
      agregarError: agregarError,
      obtenerErrores: obtenerErrores,
      limpiarErrores: limpiarErrores
    };
  })();
  