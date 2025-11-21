export function initMinesweeperGame(
  canvas: HTMLCanvasElement,
  state: MinesweeperState,
) {
  const ctx = canvas.getContext("2d")!;
  
  // Detect mobile vs desktop
  const isMobile = window.innerWidth <= 768;
  let tileSize = isMobile ? 25 : 50;
  let rows = isMobile ? 10 : 15;
  let cols = isMobile ? 10 : 15;

  const cleanupFns: (() => void)[] = [];

  function resizeCanvas() {
    tileSize = window.innerWidth <= 800 ? 35 : 50;
    rows = window.innerWidth <= 800 ? 10 : 15;
    cols = window.innerWidth <= 800 ? 10 : 15;
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
    draw();
  }

  window.addEventListener("resize", resizeCanvas);
  cleanupFns.push(() => window.removeEventListener("resize", resizeCanvas));

  function resetGame() {
    state.rows = rows;
    state.cols = cols;
    state.gameOver = false;
    state.gameWon = false;

    // Initialize cells
    state.cells = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({
        x,
        y,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );

    // Random mines between 15–25
    const mineCount = Math.floor(Math.random() * (25 - 15 + 1)) + 15;

    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const rx = Math.floor(Math.random() * cols);
      const ry = Math.floor(Math.random() * rows);
      if (!state.cells[ry][rx].isMine) {
        state.cells[ry][rx].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!state.cells[y][x].isMine) {
          state.cells[y][x].adjacentMines = countAdjacentMines(x, y);
        }
      }
    }

    draw();
  }

  function countAdjacentMines(x: number, y: number) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && state.cells[ny][nx].isMine) {
          count++;
        }
      }
    }
    return count;
  }

  function revealCell(x: number, y: number) {
    const cell = state.cells[y][x];
    if (cell.isRevealed || cell.isFlagged || state.gameOver) return;

    cell.isRevealed = true;
    if (cell.isMine) return triggerGameOver();

    if (cell.adjacentMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            revealCell(nx, ny);
          }
        }
      }
    }
    checkWin();
  }

  function toggleFlag(x: number, y: number) {
    const cell = state.cells[y][x];
    if (cell.isRevealed || state.gameOver) return;
    cell.isFlagged = !cell.isFlagged;
    draw();
  }

  function triggerGameOver() {
    state.gameOver = true;
    draw();
  }

  function checkWin() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!state.cells[y][x].isMine && !state.cells[y][x].isRevealed) return;
      }
    }
    state.gameWon = true;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setLineDash([5, 3]);
    ctx.lineWidth = 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = state.cells[y][x];
        ctx.strokeStyle = "#999";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

        if (cell.isRevealed) {
          ctx.fillStyle = cell.isMine ? "#d65d0e" : "#f9f6d7";
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

          if (!cell.isMine && cell.adjacentMines > 0) {
            ctx.fillStyle = "#458588";
            ctx.font = `bold ${Math.floor(tileSize * 0.4)}px JetBrains Mono`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(cell.adjacentMines.toString(), x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
          }
        } else if (cell.isFlagged) {
          ctx.fillStyle = "#d65d0e";
          ctx.font = `bold ${Math.floor(tileSize * 0.4)}px JetBrains Mono`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("@", x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
        }
      }
    }
  }

  const clickHandler = (e: MouseEvent) => {
    if (state.gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);
    revealCell(x, y);
    draw();
  };

  const contextHandler = (e: MouseEvent) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);
    toggleFlag(x, y);
  };

  canvas.addEventListener("click", clickHandler);
  canvas.addEventListener("contextmenu", contextHandler);
  cleanupFns.push(() => canvas.removeEventListener("click", clickHandler));
  cleanupFns.push(() => canvas.removeEventListener("contextmenu", contextHandler));

  resetGame();
  resizeCanvas();

  return () => cleanupFns.forEach(fn => fn());
}

