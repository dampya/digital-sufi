export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export interface MinesweeperState {
  cells: Cell[][];
  gameOver: boolean;
  gameWon: boolean;
  rows: number;
  cols: number;
}

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

    // Random mines: mobile 10-15, desktop 20-25
    const isMobileSize = window.innerWidth <= 800;
    const minMines = isMobileSize ? 10 : 20;
    const maxMines = isMobileSize ? 15 : 25;
    const mineCount = Math.floor(Math.random() * (maxMines - minMines + 1)) + minMines;

    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const rx = Math.floor(Math.random() * cols);
      const ry = Math.floor(Math.random() * rows);
      if (!state.cells[ry]![rx]!.isMine) {
        state.cells[ry]![rx]!.isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!state.cells[y]![x]!.isMine) {
          state.cells[y]![x]!.adjacentMines = countAdjacentMines(x, y);
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
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && state.cells[ny]![nx]!.isMine) {
          count++;
        }
      }
    }
    return count;
  }

  function revealCell(x: number, y: number) {
    const cell = state.cells[y]![x]!;
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
    const cell = state.cells[y]![x]!;
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
        if (!state.cells[y]![x]!.isMine && !state.cells[y]![x]!.isRevealed) return;
      }
    }
    state.gameWon = true;
    draw();
  }

  function drawMine(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size * 0.25;
    
    // Draw mine body (orange circle)
    ctx.fillStyle = "#d65d0e";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw spikes around the mine
    ctx.strokeStyle = "#d65d0e";
    ctx.lineWidth = size * 0.04;
    ctx.lineCap = "round";
    
    const spikeCount = 8;
    const spikeLength = size * 0.15;
    
    for (let i = 0; i < spikeCount; i++) {
      const angle = (Math.PI * 2 * i) / spikeCount;
      const startX = centerX + Math.cos(angle) * radius;
      const startY = centerY + Math.sin(angle) * radius;
      const endX = centerX + Math.cos(angle) * (radius + spikeLength);
      const endY = centerY + Math.sin(angle) * (radius + spikeLength);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Draw center highlight (small white circle)
    ctx.fillStyle = "#ebdbb2";
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Don't draw if cells aren't initialized yet
    if (!state.cells || state.cells.length === 0) return;
    
    ctx.lineWidth = 1;

    // First pass: Draw all revealed cells (content and dashed borders)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = state.cells[y]?.[x];
        if (!cell || !cell.isRevealed) continue;
        
        // Draw dashed blue border for revealed cells
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#458588";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

        if (cell.isMine) {
          // Draw revealed cell background
          ctx.fillStyle = "#fbf1c7";
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          // Draw mine icon
          drawMine(ctx, x * tileSize, y * tileSize, tileSize);
        } else {
          ctx.fillStyle = "#fbf1c7";
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

          if (cell.adjacentMines > 0) {
            ctx.fillStyle = "#458588";
            ctx.font = `bold ${Math.floor(tileSize * 0.4)}px JetBrains Mono`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(cell.adjacentMines.toString(), x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
          }
        }
      }
    }

    // Second pass: Draw all unopened cells (solid orange borders on top)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = state.cells[y]?.[x];
        if (!cell || cell.isRevealed) continue;
        
        // Draw solid border for unopened cells (on top)
        ctx.setLineDash([]);
        ctx.strokeStyle = "#999";
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

        if (cell.isFlagged) {
          ctx.fillStyle = "#d65d0e";
          ctx.font = `bold ${Math.floor(tileSize * 0.4)}px JetBrains Mono`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("@", x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
        }
      }
    }
    
    // Draw outer border segments based on edge cell states
    ctx.lineWidth = 2;
    
    // First pass: Draw revealed edge segments (dashed blue)
    // Top border - revealed cells
    for (let x = 0; x < cols; x++) {
      const cell = state.cells[0]?.[x];
      if (cell?.isRevealed) {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#458588";
        ctx.beginPath();
        ctx.moveTo(x * tileSize, 0);
        ctx.lineTo((x + 1) * tileSize, 0);
        ctx.stroke();
      }
    }
    
    // Bottom border - revealed cells
    for (let x = 0; x < cols; x++) {
      const cell = state.cells[rows - 1]?.[x];
      if (cell?.isRevealed) {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#458588";
        ctx.beginPath();
        ctx.moveTo(x * tileSize, canvas.height);
        ctx.lineTo((x + 1) * tileSize, canvas.height);
        ctx.stroke();
      }
    }
    
    // Left border - revealed cells
    for (let y = 0; y < rows; y++) {
      const cell = state.cells[y]?.[0];
      if (cell?.isRevealed) {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#458588";
        ctx.beginPath();
        ctx.moveTo(0, y * tileSize);
        ctx.lineTo(0, (y + 1) * tileSize);
        ctx.stroke();
      }
    }
    
    // Right border - revealed cells
    for (let y = 0; y < rows; y++) {
      const cell = state.cells[y]?.[cols - 1];
      if (cell?.isRevealed) {
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#458588";
        ctx.beginPath();
        ctx.moveTo(canvas.width, y * tileSize);
        ctx.lineTo(canvas.width, (y + 1) * tileSize);
        ctx.stroke();
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

