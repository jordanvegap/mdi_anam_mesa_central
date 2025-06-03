window.ChatSystemDNA=new ChatSystemDNA;

function ChatSystemDNA(){
    console.log('Iniciado');
    
};

function getUrlParam(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

ChatSystemDNA.chatSystemDNAModel = function() {
    let self = this;
    self.chatDNAUrl = window.location.href;
    
    self.init = function() {
        self.loadResource(`${self.chatDNAUrl}views/domi_chat/domi_chat.css`);
        
        // Crear el botón
        var button = document.createElement("button");
        button.innerHTML = "Mostrar/Ocultar Chat e Imagen";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#007bff";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.fontSize = "16px";

        // Crear la pantalla con la imagen y el chat (inicialmente oculta)
        var screen = document.createElement("div");
        screen.style.position = "fixed";
        screen.style.top = "0";
        screen.style.left = "0";
        screen.style.width = "100%";
        screen.style.height = "100%";
        screen.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Fondo semitransparente oscuro
        screen.style.display = "none"; // Está oculta al principio
        screen.style.justifyContent = "center";
        screen.style.alignItems = "center";
        screen.style.zIndex = "9999"; // Asegurarse de que se muestre encima de todo
        screen.style.flexDirection = "column"; // Alinear los elementos en columna

        // // Crear la imagen dentro de la pantalla
        // var image = document.createElement("img");
        // image.src = "https://via.placeholder.com/800x600"; // Cambia esta URL por la de tu imagen
        // image.style.maxWidth = "90%";
        // image.style.maxHeight = "60%";
        // image.style.border = "5px solid white"; // Opcional, solo para darle un borde a la imagen

        // Crear el área de chat
        var chatBox = document.createElement("div");
        chatBox.style.width = "90%";
        chatBox.style.maxWidth = "500px";
        chatBox.style.height = "200px";
        chatBox.style.backgroundColor = "white";
        chatBox.style.marginTop = "20px";
        chatBox.style.padding = "10px";
        chatBox.style.overflowY = "scroll";
        chatBox.style.borderRadius = "10px";
        chatBox.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        chatBox.style.display = "flex";
        chatBox.style.flexDirection = "column-reverse"; // Muestra los mensajes más recientes abajo

        // Crear el campo de entrada para el mensaje
        var inputContainer = document.createElement("div");
        inputContainer.style.display = "flex";
        inputContainer.style.marginTop = "10px";

        // Crear el campo de texto para escribir mensajes
        var inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Escribe un mensaje...";
        inputField.style.width = "80%";
        inputField.style.padding = "10px";
        inputField.style.borderRadius = "5px";
        inputField.style.border = "1px solid #ddd";

        // Crear el botón de enviar
        var sendButton = document.createElement("button");
        sendButton.innerHTML = "Enviar";
        sendButton.style.width = "20%";
        sendButton.style.padding = "10px";
        sendButton.style.backgroundColor = "#28a745";
        sendButton.style.color = "white";
        sendButton.style.border = "none";
        sendButton.style.borderRadius = "5px";

        // Agregar el campo de entrada y el botón de enviar al contenedor
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(sendButton);

        // Agregar la imagen, el chat y el input al div principal
        //screen.appendChild(image);
        screen.appendChild(chatBox);
        screen.appendChild(inputContainer);

        // Agregar la pantalla al body (inicialmente oculta)
        document.body.appendChild(screen);

        // Agregar el botón al body
        document.body.appendChild(button);

        // Función para alternar la visibilidad de la pantalla
        button.addEventListener("click", function() {
            if (screen.style.display === "none") {
                screen.style.display = "flex"; // Mostrar la pantalla
            } else {
                screen.style.display = "none"; // Ocultar la pantalla
            }
        });

        // Función para enviar el mensaje en el chat
        sendButton.addEventListener("click", function() {
            var message = inputField.value.trim(); // Obtener el texto del input
            if (message !== "") {
                var newMessage = document.createElement("div");
                newMessage.style.padding = "8px";
                newMessage.style.marginBottom = "5px";
                newMessage.style.backgroundColor = "#f1f1f1";
                newMessage.style.borderRadius = "5px";
                newMessage.style.fontSize = "14px";
                newMessage.innerHTML = message;

                chatBox.appendChild(newMessage); // Agregar el mensaje al chat
                inputField.value = ""; // Limpiar el campo de entrada
                chatBox.scrollTop = chatBox.scrollHeight; // Desplazar hacia abajo
            }
        });
        
    }

    self.loadResource = function(e, t=!1, i=!1, s=!1) {
        let a = document.createElement(t ? "script" : "link"); // Create either a <script> or <link> element based on the 't' parameter
        if (e) {
            if (t) {
                a.src = e; // If loading a script, set its 'src' attribute to the provided URL
            } else {
                a.href = e; // If loading a stylesheet, set its 'href' attribute to the provided URL
            }
            a.type = t ? "text/javascript" : "text/css"; // Set the type attribute based on whether it's a script or stylesheet
        } else {
            a.innerHTML = s; // If no URL provided, set innerHTML with the provided content (useful for inline styles/scripts)
        }
        
        if (i) {
            a.onload = function() {
                i(); // If a callback function 'i' is provided, execute it when the resource has finished loading
            }
        }

        if (!t) {
            a.rel = "stylesheet"; // If loading a stylesheet, set its 'rel' attribute to "stylesheet"
        }

        document.head.appendChild(a); // Append the created element to the <head> of the document
    }
    
}

ChatSystemDNA.currentChatModel = new ChatSystemDNA.chatSystemDNAModel();
ChatSystemDNA.currentChatModel.init();