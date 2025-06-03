let Connection_Type_Server_Sockets = 'Srv_Local';
let __obj_Conectividad = {};

function Gestor_Sockets_io() {
  let subdomain =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
switch (Connection_Type_Server_Sockets) {
  case "Srv_Local":
    switch (subdomain) {
      case 'bentoint':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'http://localhost:8889',
        }
        return __obj_Conectividad;
      break;
      case 'agenciab12':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'http://localhost:8889',
        }
        return __obj_Conectividad;
      break;
      case 'dna':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'http://localhost:8889',
        }
        return __obj_Conectividad;
      break;
      case 'konecta':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'http://localhost:8889',
        }
        return __obj_Conectividad;
      break;
      case 'mercedesbenz':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'http://localhost:8889',
        }
        return __obj_Conectividad;
      break;
    
      default:
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'http://localhost:8889',
          
        }
        return __obj_Conectividad;
      break;
    }
  break;

  case "Srv_Nube":
    switch (subdomain) {
      case 'bentoint':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'https://cdn.dnasystem.io:2022',
        }
        return __obj_Conectividad;
      break;
      case 'agenciab12':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'https://cdn.dnasystem.io:2022',
        }
        return __obj_Conectividad;
      break;
      case 'dna':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'https://cdn.dnasystem.io:2022',
        }
        return __obj_Conectividad;
      break;
      case 'konecta':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'https://cdn.dnasystem.io:2022',
        }
        return __obj_Conectividad;
      break;
      case 'mercedesbenz':
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'https://cdn.dnasystem.io:2022',
        }
        return __obj_Conectividad;
      break;
    
      default:
        __obj_Conectividad = {
          __Socket_RealTime_Connection: 'https://cdn.dnasystem.io:2022',
          
        }
        return __obj_Conectividad;
      break;
    }
  break;

  default:
  break;
}

  
}