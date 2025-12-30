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

interface Food {
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
  let foods: Food[] = [];
  let direction = { x: 1, y: 0 };
  let loop: number | null = null;
  let speed = initialSpeed;
  let foodSpawner: number | null = null;

  function resizeCanvas() {
    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;
    
    // Calculate grid dimensions
    cols = Math.floor(clientWidth / tileSize);
    rows = Math.floor(clientHeight / tileSize);
    
    // Set canvas size to exactly fit the grid (no leftover pixels)
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function resetGame() {
    snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    direction = { x: 1, y: 0 };
    foods = [];

    spawnFood();

    state.gameOver = false;
    updateHeadState();
    speed = initialSpeed;

    if (loop) cancelAnimationFrame(loop);
    loop = requestAnimationFrame(gameLoop);

    // Restart food spawner
    if (foodSpawner) clearInterval(foodSpawner);
    foodSpawner = setInterval(spawnFood, 3000); // every 3 seconds
  }

  function updateHeadState() {
    state.headX = snake[0]?.x ?? 0;
    state.headY = snake[0]?.y ?? 0;
    state.length = snake.length;

    // Update speed every 5 length
    speed = Math.min(initialSpeed + Math.floor(snake.length / 5), 15);
  }

  function spawnFood() {
    if (foods.length >= 5) return; // max 5 food

    foods.push({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    });
  }

  function handleKey(e: KeyboardEvent) {
    const key = e.key.toLowerCase();

    if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
      e.preventDefault(); // Stop page scroll
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
    const newHead = { x: head!.x + direction.x, y: head!.y + direction.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
      return triggerGameOver();
    }

    // Self collision
    for (const seg of snake)
      if (seg.x === newHead.x && seg.y === newHead.y) return triggerGameOver();

    snake.unshift(newHead);

    // Check if snake ate any existing food
    const eatenIndex = foods.findIndex(f => f.x === newHead.x && f.y === newHead.y);

    if (eatenIndex !== -1) {
      foods.splice(eatenIndex, 1);
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
    for (const seg of snake)
      ctx.fillRect(seg.x * tileSize, seg.y * tileSize, tileSize, tileSize);

    // Food
    ctx.fillStyle = "#d65d0e";
    for (const f of foods)
      ctx.fillRect(f.x * tileSize, f.y * tileSize, tileSize, tileSize);
  }

  resetGame();

  return () => {
    cancelAnimationFrame(loop!);
    if (foodSpawner) clearInterval(foodSpawner);
    window.removeEventListener("keydown", handleKey);
    window.removeEventListener("resize", resizeCanvas);
  };
}

