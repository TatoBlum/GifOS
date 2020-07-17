var startTime, stopClock;

    let start = document.getElementById('rec').onclick = function () {
        startTime = new Date();
        outPutReloj();
    };
    
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
    };

    const outPutReloj = () => {
        const el = document.getElementById('clock');

        const timerUpdate = setInterval( () => {
            let tiempo = reloj(startTime);
            el.innerHTML = 
            `${tiempo.horas}h:${tiempo.minutos}m:${tiempo.segundos}s`;
        }, 1000);

        stopClock = document.getElementById('stop').onclick = function () {
            clearInterval(timerUpdate);
        }
    };