const objetosApi = (function() {
    // Objeto que contiene los datos de la API para diferentes entornos
    const datosApi = {
        "Produccion": { 
          "NombreAPINube":{
            "url":"https://suraco.dnasystem.io:2001/api/Api_SuraAcomp",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9............",
            "Type": ''
           }
         },
        "Localhost": {
          "NombreAPILocalhost":{
            "url":"http://localhost:1001/api/Api_SuraAcomp",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9............",
            "Type": ''
           },
        }
    };

    // Función para obtener los datos de la API según el tipo de entorno
    function obtenerDatosApi(developerType, DeveloperTypeBD) {
      // Asegurarse de que el tipo de entorno es válido
      if (!(developerType in datosApi)) {
          throw new Error("Tipo de entorno inválido");
      }

      // Inyectar el valor de DeveloperTypeBD en los datos de la API
      datosApi[developerType].ApiSuraAcompanamiento.Type = DeveloperTypeBD;

      // Devolver los datos correspondientes al tipo de entorno
      return datosApi[developerType];
    }

    function aaaa(){
      return "aa"
    }


    // Devolver las funciones públicas
    return {
        obtenerDatosApi: obtenerDatosApi,
        aaaa: aaaa,
    };
  })();
  