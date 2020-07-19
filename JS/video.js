
var recorder = null;
var botonStop = document.getElementById("stop");
var botonRec = document.getElementById("rec");
var tiempo = document.getElementById('tiempo');
var videoPreview = document.getElementById('preview');
var video = document.getElementById('video');
var blob = null;
var progressBar = document.getElementById('upload-progress');
var contenedorGifCreadoExitosamente = document.getElementById('contenedor-gifo-creado-exitosamente');
var output = document.getElementById('output-subida-api');
var botonDescargarGif = document.getElementById('descargar-gif');
var botonEnlaceUrl = document.getElementById('boton-copiar-enlace');
var gifSubido;
var idGifSubido;
var contenedorMisGifs = document.getElementById('contenedor-mis-gifs');
var formMisGifs = document.getElementById('form-gif-creados');
var hd = document.getElementById('header');
var botonCancelarUpload = document.getElementById('cancelar');
var contenedorBotonCancelar = document.getElementById('contenedor-de-boton-cancelar');
botonCancelarUpload.style.display= 'none';
contenedorBotonCancelar.style.display = 'none';

if(window.location.search == "?a=0") {
    document.getElementById('contenedor-seccion-video-general').classList.remove('contenedor-seccion-video-hide');
    hd.style.marginBottom = '0px';
}

if(window.location.search == "?a=1") {
    hd.style.marginBottom = '30px';
}

botonStop.onclick = function () {
    recorder.stopRecording();
    blob = recorder.getBlob();
    var url = URL.createObjectURL(blob);
    document.getElementById('preview').src =  url;
    document.getElementById('preview-subido-exitosamente').src = url;
}

let contenedorDeBotonesDeVideo = document.getElementById('contenedor-de-botones-para-video');
let contenedorDeGifSubidos = document.getElementById('contenedor-subidos');

// SUBIR GIF A GIPHY + BARRA DE UPLOAD **********************

function upLoad () {
    let xhr = new XMLHttpRequest();
    let form = new FormData();
    form.append('file', blob, 'file.gif');

    xhr.upload.onloadstart = function (e) {
        contenedorDeGifSubidos.style.display = "flex";
        progressBar.style.display = "flex";
        progressBar.value = 0;
        progressBar.max = e.total;
        videoPreview.style.display = 'none';
        contenedorDeBotonesDeVideo.style.display = 'none';
        contenedorBotonCancelar.style.display = 'flex';
        botonCancelarUpload.style.display = 'flex';
    };

    xhr.upload.onprogress = function (e) {
        progressBar.value = e.loaded;
        progressBar.max = e.total;
    };

    xhr.upload.onloadend = function (e) {
        setTimeout(() => {
            contenedorBotonCancelar.style.display = 'none';
            contenedorGifCreadoExitosamente.style.display = 'flex';
            contenedorDeGifSubidos.style.display = "none";
        }, 3500);
    };

    botonCancelarUpload.addEventListener('click', function () {
        xhr.abort();
        document.location.href ='video.html';
    });
    
    xhr.responseType = 'json';

    xhr.onload = function () {

        gifSubido = xhr.response;
        idGifSubido = gifSubido.data.id;
        //console.log(gifSubido);
        let array = [];
        let items = localStorage.getItem("mis_gifs");
        if (items != null) {
            array = JSON.parse(items);
        }
        array.push(gifSubido);
        localStorage.setItem('mis_gifs', JSON.stringify(array));


        let status = xhr.status;
        console.log(status);
        if (status == 200) {
            output.innerHTML += "Se ha subido exitosamente!<br />";
        } else {
            output.innerHTML += "Error " + status + " occurred uploading your file.<br />";
        };  
    };

    try {    
        const apiKey = 'f63OA264yWE8KJ61Ss6iaXUh84uGBnyA';
        xhr.open('POST', `https://upload.giphy.com/v1/gifs?api_key=${apiKey}`);
        xhr.send(form);
    }
    catch (error){
        console.log(error);
    }
}

function startRecording () {
    recorder.startRecording();
}

//MEDIA DEVICE ********************
function ComenzarGif() {

    navigator.mediaDevices.getUserMedia(
        {
        audio: false,
        video: true
        }
    ).then(function(mediaStreamObj) {
                
        recorder = RecordRTC(mediaStreamObj, {
            type: 'gif',
            quality: 10,
            width: 320,
            height: 240,
            hidden: 180,
            quality: 10,
            frameRate: 1,
        });
    
        botonRec.removeAttribute('disabled'); //habilita cuando tiene permisod de navegador
        // botonRec.onclick = startRecording;
            
        //connect the media stream to the first video element
        video.srcObject = mediaStreamObj;
            
        //arranca video
        video.play();
        })
    .catch(function(err) { 
        console.log(err.name, err.message); 
    });            
}
    
// Event Handlers

let botonCancelar = document.getElementById("boton-cancelar-gif");
let botonComenzar = document.getElementById('boton-comenzar-gif');
let contenedorIntroCrearGif = document.getElementById('intro-gifos');
let contenedorDeVideo = document.getElementById('contenedor-de-video');
let imgCamara = document.getElementById('img-camara');
let botonRepetir = document.getElementById('repetir');
let botonSubir = document.getElementById('subir');
let botonMini = document.getElementById('boton-camara');

botonComenzar.addEventListener('click', handlerComenzar);
function handlerComenzar () {
    contenedorIntroCrearGif.style.display = 'none';    
    contenedorGifCreadoExitosamente.style.display ='none';
    formMisGifs.style.display = 'none';
    contenedorMisGifs.style.display = 'none';
    timer.style.display = 'none';
    botonRepetir.style.display = 'none';
    botonSubir.style.display = 'none';
    videoPreview.style.display = 'none';
    contenedorDeVideo.style.display = 'flex';
    botonStop.style.display = 'none'; // botonStop Para frenar la captura   
    ComenzarGif();
}

botonCancelar.addEventListener("click", handlerCancelar);
function handlerCancelar() {
    document.location.href ='index.html';
}

botonRec.addEventListener('click', handlerRecor);
function handlerRecor() {
    startRecording ();
    botonStop.style.display = 'flex';
    botonStop.style.background = '#FF6161';
    botonMini.style.background = '#FF6161';
    timer.style.display = 'flex';
    botonRec.style.display = 'none';
    imgCamara.style.display = 'none';
}

botonStop.addEventListener('click', handlerStop);
function handlerStop() {
    video.style.display = 'none';
    botonStop.style.display = 'none';
    botonMini.style.display = 'none';
    //getRecordImg();
    videoPreview.style.display = 'flex';
    botonRepetir.style.display = 'flex';
    botonSubir.style.display = 'flex';    
}

botonRepetir.addEventListener("click", handlerRepetir);
function handlerRepetir() {
    document.location.href ='video.html';
}

botonSubir.addEventListener('click', upLoad);

botonDescargarGif.onclick = function () {
    invokeSaveAsDialog(blob);
}

// ***************************************
let inputUrl = document.getElementById('url-gif-subido');
let mensajeDeCopiado = document.getElementById('mensaje-copiado');
let urlValue;

function getGifSubido() {
    const apiKey = 'f63OA264yWE8KJ61Ss6iaXUh84uGBnyA';
    let gifIdStringi = JSON.stringify(idGifSubido);
    let gifId = gifIdStringi.replace(/\"/g, "");
    fetch(`https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`)
    .then( response => {
        return response.json();
    })
    .then( result => {
        //console.log(result);
        urlValue = result.data.embed_url;
        inputUrl.value = urlValue;
        //console.log(urlValue);
    }) 
    .catch(  error => {
        console.log(error.message)
    });       
}

//inputUrl.value = urlValue;
mensajeDeCopiado.style.display = "none";

botonEnlaceUrl.onclick = function () {
    getGifSubido();
    //inputUrl.value = urlValue;
    
    inputUrl.focus();
    document.execCommand('selectAll');
    document.execCommand('copy');
    
    mensajeDeCopiado.style.display = "flex";
    mensajeDeCopiado.innerHTML = "Copiado al portapapeles";
    setTimeout( ()=> mensajeDeCopiado.innerHTML = "", 2000);
}


// ********** TIMER *****************

var startTime;

    let start = botonRec.addEventListener ('click', function () {
        // console.log(start)
        startTime = new Date();
        outPutReloj();
    })
    
    function reloj() {
        let endTime = new Date();
        var tiempoTotal = (endTime - startTime)/1000, 
        segundos = ('0' + Math.floor(tiempoTotal % 60)).slice(-2),
        minutos = ('0' + Math.floor(tiempoTotal / 60 % 60)).slice(-2),
        horas = ('0' + Math.floor(tiempoTotal / 3600 % 24)).slice(-2);
        return {
            segundos,
            minutos,
            horas,
            tiempoTotal,
        }
    }

    let  timer = document.getElementById('clock'); 

    const outPutReloj = () => {
        const timerUpdate = setInterval( () => {
            let tiempo = reloj(startTime);
            timer.innerHTML = 
            `${tiempo.horas}h:${tiempo.minutos}m:${tiempo.segundos}s`;
        }, 1000);

        let stopClock = botonStop.addEventListener ( 'click', function () {
            clearInterval(timerUpdate);
        });
    }

/*********************************************** */

function getMisGuifos() {
    
    let getLocalStoraGifs = JSON.parse(localStorage.getItem('mis_gifs'));
    let array = [];
    getLocalStoraGifs.forEach(element => {
        let idsGif = element.data.id;
        //console.log(idsGif);
        array.push(idsGif);
    });
    let arrayDeIdsStringi = JSON.stringify(array);
    let ararrayIdsGif = arrayDeIdsStringi.replace(/\"/g, "");
    let arrayIdGifPuro = ararrayIdsGif.substring(1, ararrayIdsGif.length-1);
    //console.log(arrayIdGifPuro);

    const apikey = 'f63OA264yWE8KJ61Ss6iaXUh84uGBnyA';
    fetch(`https://api.giphy.com/v1/gifs?api_key=${apikey}&ids=${arrayIdGifPuro}`)
    .then( response => {
        //console.log(response);
        return response.json();
    })
    .then (result =>{
        //console.log(result);
        let resultHtml = '';
    
        result.data.forEach( function(element){
            let gifUrl = element.images.original.url;
            let gifAlt = element.title;

            resultHtml += 
            `<div class="itemflex-tendencias">
                <div>
                    <img src="${gifUrl}" class="gifImg" alt="${gifAlt}" id="gifs">
                </div> 
                
            </div>`  
        });
        contenedorMisGifs.innerHTML = resultHtml; 
    })
    .catch ( error => {
       console.log(error.message); 
    });

}

let botonGifListo = document.getElementById('boton-gif-creado-listo');

botonGifListo.addEventListener('click',gifCreadoListo);

function initMisGifs() {
      if (localStorage.getItem('mis_gifs')) {
        getMisGuifos();
      };
}

initMisGifs();

function gifCreadoListo() {
    getMisGuifos();
    document.location.href ='video.html';
    contenedorGifCreadoExitosamente.style.display ='flex';
}

