function css(cssFilesArr){
    for(let x = 0; x < cssFilesArr.length; x++) {
        let fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", cssFilesArr[x]+'?v='+Math.random().toString(36).substr(2, 9));
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}


function js(jsFilesArr) {
    for(let x = 0; x < jsFilesArr.length; x++) {
        let fileref=document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", jsFilesArr[x]+'?v='+Math.random().toString(36).substr(2, 9));
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}

function jsModule(jsFilesArr) {
    for(let x = 0; x < jsFilesArr.length; x++) {
        let fileref=document.createElement("script");
        fileref.setAttribute("type", "module");
        fileref.setAttribute("src", jsFilesArr[x]+'?v='+Math.random().toString(36).substr(2, 9));
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}