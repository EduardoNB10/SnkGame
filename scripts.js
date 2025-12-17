const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");

const box = 20;
let score = 0;
let d;
let isPaused = false;
let snake = [{ x: 9 * box, y: 10 * box }];
let gameSpeed = 100;
let gameLoop;

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

// --- MOTOR DE SONIDO ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// Funciones específicas de sonidos
const soundMove = () => playSound(150, 'triangle', 0.05);
const soundEat = () => {
    playSound(523.25, 'sine', 0.1); // Nota Do
    setTimeout(() => playSound(659.25, 'sine', 0.1), 50); // Nota Mi
};
const soundDie = () => {
    playSound(200, 'sawtooth', 0.2);
    setTimeout(() => playSound(100, 'sawtooth', 0.4), 100);
};

// --- CONTROLES ---
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") togglePause();
    if (!isPaused) {
        let oldD = d;
        if(event.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
        else if(event.key === "ArrowUp" && d !== "DOWN") d = "UP";
        else if(event.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
        else if(event.key === "ArrowDown" && d !== "UP") d = "DOWN";
        
        if (oldD !== d) soundMove(); // Sonido al cambiar dirección
    }
});

function changeDir(newDir) {
    if (isPaused) return;
    let oldD = d;
    if (newDir === "LEFT" && d !== "RIGHT") d = "LEFT";
    else if (newDir === "UP" && d !== "DOWN") d = "UP";
    else if (newDir === "RIGHT" && d !== "LEFT") d = "RIGHT";
    else if (newDir === "DOWN" && d !== "UP") d = "DOWN";
    
    if (oldD !== d) soundMove();
}

function togglePause() {
    isPaused = !isPaused;
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

pauseBtn.addEventListener("click", togglePause);

// --- LÓGICA ---
function draw() {
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isPaused) {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSA", canvas.width / 2, canvas.height / 2);
        return;
    }

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#000000" : "#222222"; 
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#2ecc71"; 
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d === "LEFT") snakeX -= box;
    if( d === "UP") snakeY -= box;
    if( d === "RIGHT") snakeX += box;
    if( d === "DOWN") snakeY += box;

    if(snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = score;
        soundEat(); // SONIDO COMER
        
        if (gameSpeed > 40) {
            gameSpeed -= 2; 
            restartTimer();
        }

        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameLoop);
        soundDie(); // SONIDO MORIR
        setTimeout(() => {
            alert("¡Game Over! Puntos: " + score);
            location.reload();
        }, 500);
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function restartTimer() {
    clearInterval(gameLoop);
    gameLoop = setInterval(draw, gameSpeed);
}

gameLoop = setInterval(draw, gameSpeed);