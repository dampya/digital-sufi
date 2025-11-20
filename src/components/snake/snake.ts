export interface SnakeState {
  headX: number;
  headY: number;
  length: number;
  gameOver: boolean;
}

interface Segment {
  x: number;
  y: number;
}

export function initSnakeGame(
  canvas: HTMLCanvasElement,
  state: SnakeState,
  initialSpeed: number
) {
  const ctx = canvas.getContext("2d")!;
  const tileSize = 20;
  let cols = 0;
  let rows = 0;

  let snake: Segment[] = [];
  let food = { x: 5, y: 5 };
  let direction = { x: 1, y: 0 };
  let loop: number | null = null;
  let speed = initialSpeed;

  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    cols = Math.floor(canvas.width / tileSize);
    rows = Math.floor(canvas.height / tileSize);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function resetGame() {
    snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    direction = { x: 1, y: 0 };
    placeFood();
    state.gameOver = false;
    updateHeadState();
    speed = initialSpeed;

    if (loop) cancelAnimationFrame(loop);
    loop = requestAnimationFrame(gameLoop);
  }

  function updateHeadState() {
    state.headX = snake[0].x;
    state.headY = snake[0].y;
    state.length = snake.length;

    // Update speed every 5 length
    speed = Math.min(initialSpeed + Math.floor(snake.length / 5), 15);
  }

  function placeFood() {
    food.x = Math.floor(Math.random() * cols);
    food.y = Math.floor(Math.random() * rows);
  }

  function handleKey(e: KeyboardEvent) {
    const key = e.key.toLowerCase();

    if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
      e.preventDefault();
    }

    if (key === "arrowup" && direction.y !== 1) direction = { x: 0, y: -1 };
    if (key === "arrowdown" && direction.y !== -1) direction = { x: 0, y: 1 };
    if (key === "arrowleft" && direction.x !== 1) direction = { x: -1, y: 0 };
    if (key === "arrowright" && direction.x !== -1) direction = { x: 1, y: 0 };
  }

  window.addEventListener("keydown", handleKey);

  let lastTime = 0;

  function gameLoop(timestamp: number) {
    if (!loop || state.gameOver) return;

    const interval = 1000 / speed;
    const delta = timestamp - lastTime;

    if (delta >= interval) {
      lastTime = timestamp;
      update();
      draw();
    }

    loop = requestAnimationFrame(gameLoop);
  }

  function update() {
    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
      return triggerGameOver();
    }

    // Self collision
    for (const seg of snake) if (seg.x === newHead.x && seg.y === newHead.y) return triggerGameOver();

    snake.unshift(newHead);

    // Food
    if (newHead.x === food.x && newHead.y === food.y) {
      placeFood();
    } else {
      snake.pop();
    }

    updateHeadState();
  }

  function triggerGameOver() {
    state.gameOver = true;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Snake
    ctx.fillStyle = "#458588";
    for (const seg of snake) ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);

    // Food
    ctx.fillStyle = "#d65d0e";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
  }

  resetGame();

  return () => {
    cancelAnimationFrame(loop!);
    window.removeEventListener("keydown", handleKey);
    window.removeEventListener("resize", resizeCanvas);
  };
}

