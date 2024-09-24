const canvas = document.getElementById('raceCanvas');
const context = canvas.getContext('2d');

const trackImg = new Image();
trackImg.src = 'img/cicruitlong.png';

const car1Img = new Image();
car1Img.src = 'img/car1.png';

const car2Img = new Image();
car2Img.src = 'img/car2.png';

const cars = [
{ 
x: 1100, 
y: 140, 
img: car1Img, 
message: 'LE JOUEUR 1 GAGNE LA PARTIE !', 
color: 'red',
font: '50px Arial',
textAlign: 'center',
textBaseline: 'middle',
messageX: canvas.width / 2, 
messageY: canvas.height / 2 - 100,

},
{ 
x: 1100, 
y: 335, 
img: car2Img, 
message: 'LE JOUEUR 2 GAGNE LA PARTIE !', 
color: 'blue',
font: '50px Arial',
textAlign: 'center',
textBaseline: 'middle',
messageX: canvas.width / 2, 
messageY: canvas.height / 2 + 100,

}
];


const startLineX = 1100; // Position X de la ligne de départ
const finishLineX = 75; // Position X de la ligne d'arrivée
let isRaceRunning = false; // État de la course
let isPaused = false; // État de la pause

function drawTrack() {
    context.drawImage(trackImg, 0, 0, canvas.width, canvas.height);

    // Dessiner la ligne de départ
    context.strokeStyle = 'transparent';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(startLineX, 0);
    context.lineTo(startLineX, canvas.height);
    context.stroke();

    // Dessiner la ligne d'arrivée
    context.beginPath();
    context.moveTo(finishLineX, 0);
    context.lineTo(finishLineX, canvas.height);
    context.stroke();
}

function drawCars() {
    const carWidth = 250; // Largeur agrandie des voitures
    const carHeight = 125; // Hauteur agrandie des voitures
    cars.forEach(car => {
        context.drawImage(car.img, car.x, car.y, carWidth, carHeight);
    });
}

function drawCountdown(seconds) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawCars();
    context.fillStyle = 'yellow';
    context.font = '150px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(seconds, canvas.width / 2, canvas.height / 2);
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
    drawTrack();
    drawCars();
}

function resetCars() {
    cars.forEach(car => {
        car.x = startLineX;
    });
    update();
}

let intervalId;
let countdownInterval;

function startRace() {
    if (!isRaceRunning && !isPaused) {
        isRaceRunning = true;
        let countdown = 3;

        countdownInterval = setInterval(function() {
            drawCountdown(countdown);
            countdown -= 1;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                startMovingCars();
            }
        }, 1000);
    } else if (isPaused) {
        isPaused = false;
        startMovingCars();
    }
}

function drawWinnerMessage(car) {
    console.log('Drawing winner message for:', car.message); // Log de diagnostic
    context.fillStyle = car.color; // Utiliser la couleur spécifiée pour chaque voiture
    context.font = '50px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(car.message, car.messageX, car.messageY); // Utiliser les coordonnées spécifiées pour chaque voiture
}

function startMovingCars() {
    intervalId = setInterval(function() {
        let anyCarFinished = false;

        cars.forEach(car => {
            if (car.x > finishLineX) {
                car.x -= Math.random() * 15;
            } else {
                car.x = finishLineX;
                if (!anyCarFinished) {
                    anyCarFinished = true;
                    stopRace();
                    setTimeout(() => {
                        drawWinnerMessage(car);
                    }, 50); // Délai pour s'assurer que le canvas est mis à jour
                }
            }
        });

        update();
    }, 20);
}

function stopRace() {
    clearInterval(intervalId);
    clearInterval(countdownInterval);
    isRaceRunning = false;
    isPaused = true;
    document.getElementById('stopButton').textContent = 'Play!';
}

function resetRace() {
    stopRace();
    resetCars();
    isRaceRunning = false;
    isPaused = false;
    document.getElementById('stopButton').textContent = 'Stop!';
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawCars();
}

function allImagesLoaded() {
    if (trackImg.complete && car1Img.complete && car2Img.complete) {
        resetCars();
    }
}

trackImg.onload = allImagesLoaded;
car1Img.onload = allImagesLoaded;
car2Img.onload = allImagesLoaded;

document.getElementById('goButton').addEventListener('click', startRace);
document.getElementById('stopButton').addEventListener('click', function() {
    if (isPaused) {
        startRace();
        document.getElementById('stopButton').textContent = 'Stop!';
    } else {
        stopRace();
    }
});
document.getElementById('resetButton').addEventListener('click', resetRace);