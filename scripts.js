const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20;
let score = 0;
let gameSpeed = 100;
let isPaused = false; // Variable para controlar el estado de pausa

let snake = [{ x: 9 * box, y: 10 * box }];
let d;

// Escuchar teclas (añadimos la lógica de pausa aquí)
document.addEventListener("keydown", (event) => {
    // Detectar tecla ESC (keyCode 27)
    if (event.keyCode === 27) {
        isPaused = !isPaused; // Cambia entre pausado y no pausado
        return;
    }

    // Solo permitir cambiar dirección si NO está pausado
    if (!isPaused) {
        if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
        else if(event.keyCode == 38 && d != "DOWN") d = "UP";
        else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
        else if(event.keyCode == 40 && d != "UP") d = "DOWN";
    }
});

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

function draw() {
    // Si el juego está pausado, dibujamos el texto de pausa y salimos de la función
if (isPaused) {
        // Fondo semitransparente para oscurecer el juego de fondo
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Configuración del texto
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";     // Centrado horizontal
        ctx.textBaseline = "middle";  // Centrado vertical
        
        // Dibujar el texto en el punto exacto del centro (200, 200 en un canvas de 400x400)
        ctx.fillText("JUEGO PAUSADO", canvas.width / 2, canvas.height / 2);
        
        return; // Detiene el avance de la lógica
    }

    // --- El resto del código se mantiene igual ---
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#2ecc71" : "#27ae60";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("¡Juego Terminado! Tu puntuación: " + score);
        location.reload();
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

let game = setInterval(draw, gameSpeed);