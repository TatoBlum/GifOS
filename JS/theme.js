// THEME (LIGHT / DARK) 
// check for saved 'darkMode' in localStorage

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
// start things off with it on
if (darkMode === 'enabled') {
    enableDarkMode();
}

if (lightMode === 'enabled') {
    enableLightMode();
}

let botonRecording = document.getElementById('boton-recording');
let botonCamara = document.getElementById('boton-camara');

botonRecording.style.display = 'none';

var botonRec = document.getElementById("rec");
botonRec.addEventListener('click', function () {
    botonCamara.style.display = 'none';
    botonRecording.style.display = 'flex';    
})

var botonStop = document.getElementById("stop");
botonStop.addEventListener('click', function () {
    botonRecording.style.display = 'none';
})


function imgSegunTheme() {

    let logo = document.getElementById('logo');
    let camara = document.getElementById('img-camara');
    let theme = document.body.getAttribute('class');

    let imgLogo = `./Img/gifOF_logo_${theme}.png`;
    let imgCamara = `./Img/gifOF_camera_${theme}.svg`;
    let imgLupa = `./Img/lupa_${theme}.svg`;

    let urls = [imgLogo,imgCamara,imgLupa];

    Promise.all(urls.map(u=>fetch(u))).then(responses =>
        Promise.all(responses.map(res => res.blob()))
    ).then(result => {
        var objectURLLogo = URL.createObjectURL(result[0]);
        logo.src = objectURLLogo;
        var objectURLCamara = URL.createObjectURL(result[1]);
        camara.src = objectURLCamara;

    })    
}

imgSegunTheme();

// function getRecordImg() {
//     let camara = document.getElementById('img-camara');
//     let theme = document.body.getAttribute('class');
//     console.log(theme);

//     fetch(`./Img/recording_${theme}.svg`)
//     .then(function(response) {
//         if(!response.ok){
//             throw new Error('HTTP error, status = ' + response.status);
//         }
//     return response.blob();
//         })
//     .then(function(miBlob) {
//         console.log(miBlob)
//     var objectURL = URL.createObjectURL(miBlob);
//     camara.src = objectURL;
//         })
//     .catch(  error => {
//         console.log(error.message);
//     });   
// }


