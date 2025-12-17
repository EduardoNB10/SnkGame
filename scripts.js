const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");

const box = 20;
let score = 0;
let d;
let isPaused = false;
let snake = [{ x: 9 * box, y: 10 * box }];

// Control de velocidad
let gameSpeed = 100; // Velocidad inicial (milisegundos)
let gameLoop;

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

// --- CONTROLES DE TECLADO ---
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") togglePause();
    
    if (!isPaused) {
        if(event.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
        else if(event.key === "ArrowUp" && d !== "DOWN") d = "UP";
        else if(event.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
        else if(event.key === "ArrowDown" && d !== "UP") d = "DOWN";
    }
});

// --- CONTROLES TÁCTILES / BOTONES ---
function changeDir(newDir) {
    if (isPaused) return;
    if (newDir === "LEFT" && d !== "RIGHT") d = "LEFT";
    else if (newDir === "UP" && d !== "DOWN") d = "UP";
    else if (newDir === "RIGHT" && d !== "LEFT") d = "RIGHT";
    else if (newDir === "DOWN" && d !== "UP") d = "DOWN";
}

function togglePause() {
    isPaused = !isPaused;
}

pauseBtn.addEventListener("click", togglePause);

// --- LÓGICA DEL JUEGO ---

function draw() {
    // Dibujar fondo verde
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

    // Dibujar Serpiente Negra
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#000000" : "#222222"; 
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#2ecc71"; 
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar Manzana Roja
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d === "LEFT") snakeX -= box;
    if( d === "UP") snakeY -= box;
    if( d === "RIGHT") snakeX += box;
    if( d === "DOWN") snakeY += box;

    // Comer manzana
    if(snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = score;
        
        // Aumentar velocidad (reducir el tiempo entre frames)
        if (gameSpeed > 40) { // Límite de velocidad máxima para que sea jugable
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

    // Colisiones
    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameLoop);
        alert("¡Game Over! Puntos: " + score);
        location.reload();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

// Función para reiniciar el temporizador con la nueva velocidad
function restartTimer() {
    clearInterval(gameLoop);
    gameLoop = setInterval(draw, gameSpeed);
}

// Iniciar el juego
gameLoop = setInterval(draw, gameSpeed);