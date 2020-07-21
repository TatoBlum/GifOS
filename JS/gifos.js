// TRAER GIFS DE API 

let form = document.getElementById('form-busqueda');
let inputDeBusqueda = document.getElementById('input-busqueda');
let contenedorDeGifs = document.getElementById('contenedor-gifs');
let contenedorSugerencias = document.getElementById('contenedor-de-sugerencias-div');
let contenedorBotonesSugeridosDeQuery = document.getElementById('botones-de-query');
let contenedorDeSugarencias = document.getElementById('contenedor-de-sugerencias');
let botonesVerMas;
let inputTendencia = document.getElementById('input-tendencias');
let inputSugeridos = document.getElementById('input-sugeridos');
let botonContenedorLupa = document.getElementById('btn-busqueda');   



form.addEventListener('submit', function (event) {
    event.preventDefault();
    let query = inputDeBusqueda.value;
    valorDeInputsBarraBusqueda(query);
    if (query != '') {
        getGifs(query);
    }
})

// Get gif de API Search ===> busqueda realizada desde input en barra de busqueda

function getGifs(query) {
    const apiKey = 'f63OA264yWE8KJ61Ss6iaXUh84uGBnyA';
    const url =  `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=24&offset=0&rating=G&lang=en`;
    fetch(url)
        .then( response=> {
            return response.json();
        })
        .then( result => {
            //console.log(result);
            let resultHtml = '';
            result.data.forEach( function(element){
                let gifUrl = element.images.original.url;
                let gifAlt = element.title;
                let filtroDePalabras = element.title.split(" ", 3);

                resultHtml += 
                `<div class="itemflex-tendencias">
                    <div>
                        <img src="${gifUrl}" class="gifImg gif-tendencias gif-img-tendencias" alt="${gifAlt}" id="gifs">
                        <h2 class="gradiente-tendencias-gifs">${filtroDePalabras}</h2>
                    </div> 
                 </div>`  
            });
            contenedorDeGifs.innerHTML = resultHtml;   
            randomGridStyle(result); 
            gradienteDeGifs();
        })
        .catch(  error => {
            console.log(error.message)
        })    
}

// Funcion Gradiente Gifs

function gradienteDeGifs() {
    let imagenGif = document.querySelectorAll('.gif-img-tendencias');

    imagenGif.forEach( items =>{
        items.addEventListener('mouseover', event => {
            let img= items;
            let gradiente = img.nextElementSibling;
            gradiente.style.display = 'flex';    
        },false);
    });

    imagenGif.forEach( items =>{
        items.addEventListener('mouseleave', event => {
            let img= items;
            let gradiente = img.nextElementSibling;
            gradiente.style.display = 'none';    
        },true);
    });
}


//Random width de grid function
function randomGridStyle(resultado) {
    let imagen = document.getElementsByClassName('itemflex-tendencias');
    // console.log(imagen);
    for (let i = 0; i < imagen.length; i++) {
         const element = imagen[i];
            if( i > 0 && i % 5 == 0 ) {
                //console.log(element);
                element.classList.add('span2');
            }            
    }    
};

/*************** INPUT QUERY ****************/
// Pasar query por input 
inputDeBusqueda.addEventListener('input', function (event) {
    contenedorSugerencias.style.visibility = 'visible';
    contenedorSeccionDeSugerencias.style.top ='20px'
    const getSearch = inputDeBusqueda.value;
     if (getSearch != '') {
        buscarGifs(getSearch)
    } 
})

//INPUT BUSQUEDA
function buscarGifs(getSearch) {
    //console.log(getSearch); //ingreso datos a input
    const apiKey = 'f63OA264yWE8KJ61Ss6iaXUh84uGBnyA';
    const url = `https://api.giphy.com/v1/tags/related/${getSearch}?key=${apiKey}`;

    fetch(url)
        .then(response =>{
            return response.json();     
        })
        .then(result =>{
            //console.log(result);
            if(getSearch.length === 0){
                result.data = [];
                contenedorSugerencias.innerHTML = '';
            }
            //console.log(result.data);    
            filtrarResultadoDeBusquedasRepetidas(result.data); 
            botonesResultadoDeBusquedaPorInput(); 
            })
        .catch( error => {
            console.log(error.message) 
        })    
}

function filtrarResultadoDeBusquedasRepetidas(resultado) {
    let uniqueArray = [];
    let count = 0;
    var found = false;
    try{
        for (let i = 0; i < resultado.length; i++) {
            for (let y = 0; y < uniqueArray.length; y++) {
                if(resultado[i].name == uniqueArray[y]){
                    found = true;
                }            
            }
            count++;
            if (count == 1 && found == false){
                uniqueArray.push(resultado[i].name)
            }
            count = 0;
            found = false;        
        }
        //console.log(uniqueArray); 
        outputBusquedaPorInput(uniqueArray);
        outputBotonesDeBusquedaSugeridos (uniqueArray);
    }
    catch (error){
        console.log(error)
    }
}

function filtrarSearchGifsPorCantidad(resultado, size) {
    try {
        var items = resultado.slice(0, size).map(i => {
            return i
        });
        return items;
    }
    catch (error) {
        console.log(error)
    }
}

function outputBusquedaPorInput(items) {
    try{
        //console.log(items);
        let nuevosItems  =  filtrarSearchGifsPorCantidad(items, 3);
        //console.log(nuevosItems);
        if (nuevosItems.length > 0) {     
            const innerHtml = nuevosItems.map( match => `
                    <button type="submit" value="${match}" class="btn-output btn-sugerido-input">${match}</button>  
            `).join('');
            contenedorSugerencias.innerHTML = innerHtml; 
        }
        if(nuevosItems.length === 0 || inputDeBusqueda.value === '' ) {
            nuevosItems = [];
            contenedorSugerencias.innerHTML = '';
        }
        
        outputBotonesSugeridosStyle();

    }
    catch (error) {
        console.log(error)
    }
}

function outputBotonesSugeridosStyle() {
    let botones = document.querySelectorAll('.btn-sugerido-input');
    botones.forEach( items=> {
        items.addEventListener('mouseover', function (event) {
           items.style.background = '#B4B4B4';
        });
    })
    botones.forEach( items=> {
        items.addEventListener('mouseleave', function (event) {
           items.style.background = '#E6E6E6'; 
        });
    })
}

function outputBotonesDeBusquedaSugeridos (items) {
    try{
        //console.log(items);
        let nuevosItems  =  filtrarSearchGifsPorCantidad(items, 6);
        //console.log(nuevosItems);
        if (nuevosItems.length > 0) {     
            const innerHtml = nuevosItems.map( match => `
                    <button type="submit" value="${match}" class="boton-azul btn-output botones-sugeridos">${match}</button>  
            `).join('');
            contenedorBotonesSugeridosDeQuery.innerHTML =  innerHtml;
        }
        if(nuevosItems.length === 0 || inputDeBusqueda.value === '' ) {
            nuevosItems = [];
            contenedorSugerencias.innerHTML = '';
        }
    }
    catch (error) {
        console.log(error)
    };
}

/********addListener Botones resultado de query via input */
let contenedorSeccionDeSugerencias = document.getElementById('contenedor-seccion-de-sugarencias');

function botonesResultadoDeBusquedaPorInput() {     
    document.querySelectorAll('.btn-output').forEach(item => {
        item.addEventListener('click', event => {
            let q = item.value;
            item.style.width = '15%';
            contenedorSugerencias.style.justifyContent = 'flex-start';
            contenedorSeccionDeSugerencias.style.top ='20px'
            contenedorSugerencias.style.visibility = 'hidden';
            getGifs(q); 
            valorDeInputsBotonesBusqueda(q);     
        })
    })  
}

botonesResultadoDeBusquedaPorInput();

//Get gifS SUGERIDOS 

function gifSugerencias() {
    const apiKey = 'f63OA264yWE8KJ61Ss6iaXUh84uGBnyA';
    const url1 = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=&rating=g`;
    const url2 = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=&rating=g`;
    const url3 = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=&rating=g`;
    const url4 = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=&rating=g`;
    let urls = [url1,url2,url3,url4];

    Promise.all(urls.map(u=>fetch(u))).then(responses =>
        Promise.all(responses.map(res => res.json()))
    ).then(result => {
        let resultHtml = '';
        result.map( function(element){
            let gifUrl = element.data.images.original.url;
            let gifAlt = element.data.title;
            let filtroDePalabras = element.data.title.split(" ", 3);
            resultHtml += 
                `<div class="itemflex-sugerencias">
                    <div>
                        <h2 class="gradiente-de-gif">${filtroDePalabras} 
                            <img src="./Img/button3.svg" alt="boton-cerrar-ventana">
                        </h2>
                        <img src="${gifUrl}" class="gifImg" alt="${gifAlt}" id="gifs">
                        <button type="button" value="${gifAlt}" class="btn-sugerencias boton-azul boton-ver-mas"><div class="hidden-ver-mas">Ver más...</div></button>     
                    </div>
                </div>`  
        }).join('');
        contenedorDeSugarencias.innerHTML = resultHtml;  

        let itemsGifsSugeridos = document.querySelectorAll('.boton-ver-mas');
        let hiddenBorder = document.querySelectorAll('.hidden-ver-mas');

        hiddenBorder.forEach( element=> {
            let padre = element.parentElement;
            padre.addEventListener('click', function () {
                element.style.border = '1px solid #110038';
            })
        })        

        hiddenBorder.forEach( element=> {
            let padre = element.parentElement;
            padre.addEventListener('mouseleave', function () {
                element.style.border = 'none';
            })
        })       
   
        itemsGifsSugeridos.forEach( items=> {
            items.style.zIndex = '1000';
            items.addEventListener('click', event => {
                let q = items.value;
                getGifs(q);
                valorDeInputSugeridos(q);
            });

        });
    })
    .catch(  error => {
        console.log(error.message)
    });    
}

gifSugerencias();

// GIF TENDENCIAS
function gifTenencias() {
    const apiKey = 'f63OA264yWE8KJ61Ss6iaXUh84uGBnyA';
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=24&rating=G`;
    fetch(url)
        .then( response=> {
            return response.json();
        })
        .then( result => {
            let resultHtml = '';
        
            result.data.forEach( function(element){
                let gifUrl = element.images.original.url;
                let gifAlt = element.title;
                let filtroDePalabras = element.title.split(" ", 3);

                resultHtml += 
                `<div class="itemflex-tendencias">
                    <div>
                        <img src="${gifUrl}" class="gifImg gif-tendencias gif-img-tendencias" alt="${gifAlt}" id="gifs">
                        <h2 class="gradiente-tendencias-gifs">${filtroDePalabras}</h2>
                    </div> 
                </div>`  
            });
            contenedorDeGifs.innerHTML = resultHtml; 
            randomGridStyle(result); 
            gradienteDeGifs();
        }) 
    .catch(  error => {
        console.log(error.message)
    });      
}

gifTenencias();

// MENU THEMES & BUTONS (DARK/LIGHT) 

var botonTheme = document.getElementById('btn-elegir');
var contenedorTheme = document.getElementById('menu-oculto');
 
botonTheme.addEventListener( 'click', (e) => {
    try{
        if(contenedorTheme.style.display === "none") {
            contenedorTheme.style.display = "flex";
        } else {
            contenedorTheme.style.display = "none";
        }
    }
    catch (error){
        console.log(error);
    }

})
// THEME (LIGHT / DARK) 

let darkMode = localStorage.getItem('darkmode'); 
let lightMode = localStorage.getItem('lightmode');

const darkModeToggle = document.querySelector('#dark-mode-toggle');
//console.log(darkModeToggle);

const lightModeToggle = document.querySelector('#light-mode-toggle');
//console.log(darkModeToggle);

//darkMode
const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'enabled');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.removeItem('darkmode');
}  

//lightMode
const enableLightMode = () => {
    document.body.classList.add('lightmode');
    localStorage.setItem('lightmode', 'enabled');
}

const disableLightMode = () => {
    document.body.classList.remove('lightmode');
    localStorage.removeItem('lightmode');
} 

// If the user already visited and enabled darkMode/lightMode

if (darkMode === 'enabled') {
    enableDarkMode();
}

if (lightMode === 'enabled') {
    enableLightMode();
}

if (document.body.classList.value === '') {
    enableLightMode();
} 

//darkmode event
darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkmode');     
    if (darkMode !== 'enabled') {  
        disableLightMode();
        enableDarkMode();
        imgSegunTheme();
    }       
})

//lightmode event
lightModeToggle.addEventListener('click', () => {
    lightMode = localStorage.getItem('lightmode');     
    if (lightMode !== 'enabled') {
        disableDarkMode();         
        enableLightMode();
        imgSegunTheme();
    } 
})

function getLupaActive () {
    let lupa = document.getElementById('img-lupa');
    fetch(`./Img/lupa_active.svg`)
    .then(function(response) {
        if(!response.ok){
            throw new Error('HTTP error, status = ' + response.status);
        }
    return response.blob();
    })
    .then(function(miBlob) {
        let botonContenedorLupa = document.getElementById('btn-busqueda');   
        
        botonContenedorLupa.addEventListener('click', function () {
            botonContenedorLupa.style.background = '#F7C9F3';
            let lupa = botonContenedorLupa.firstChild;
            var objectURL = URL.createObjectURL(miBlob);
            lupa.src = objectURL;        
        });
        botonContenedorLupa.addEventListener('mouseleave', imgSegunTheme); 
        botonContenedorLupa.addEventListener('mouseleave', function () {
            botonContenedorLupa.style.background = 'var(--clr-background-box-gris)';            
        });

        inputDeBusqueda.addEventListener('input', function (e) {
            if (e.target.value.length >= 1) {
                botonContenedorLupa.style.background = '#F7C9F3';  
                let lupa = botonContenedorLupa.firstChild;
                var objectURL = URL.createObjectURL(miBlob);
                lupa.src = objectURL; 
            } else {
                botonContenedorLupa.style.background = 'var(--clr-background-box-gris)';
                imgSegunTheme();
            }

        });
          
    })
    .catch(  error => {
        console.log(error.message);
    });   
}

getLupaActive();


function imgSegunTheme() {
    let theme = document.body.getAttribute('class');
    let logo = document.getElementById('logo');
    let lupa = document.getElementById('img-lupa');

    let imgLogo = `./Img/gifOF_logo_${theme}.png`;
    let imgCamara = `./Img/gifOF_camera_${theme}.svg`;
    let imgLupa = `./Img/lupa_${theme}.svg`;

    let urls = [imgLogo,imgCamara,imgLupa];

    Promise.all(urls.map(u=>fetch(u))).then(responses =>
        Promise.all(responses.map(res => res.blob()))
    ).then(result => {
        var objectURLLogo = URL.createObjectURL(result[0]);
        logo.src = objectURLLogo;
        var objectURLLupa = URL.createObjectURL(result[2]);
        lupa.src = objectURLLupa;
    })
    .catch(  error => {
        console.log(error.message)
    });       
}

imgSegunTheme();

inputTendencia.readOnly = true;
inputTendencia.style.color = 'grey';
inputTendencia.style.zIndex = '-10';

inputSugeridos.readOnly = true;
inputSugeridos.style.color = 'grey';
inputSugeridos.style.zIndex = '-10';


function valorDeInputSugeridos(query) {
    if (query !== undefined) {
        inputSugeridos.value = query;
    };   
};

function valorDeInputsBarraBusqueda(query) {
    if (query !== undefined) {
        inputTendencia.value = query;
    };   
};

valorDeInputsBarraBusqueda();

function valorDeInputsBotonesBusqueda(query) {
    if (query !== undefined) {
        inputTendencia.value = query;
    };   
}

valorDeInputsBotonesBusqueda();

let linkMisGifs = document.getElementById('boton-mis-gifs');

linkMisGifs.addEventListener('click', function () {
    document.location.href ='video.html?a=1';
})