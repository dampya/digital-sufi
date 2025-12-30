export interface Cell {
  x: number;
  y: number;
  isPainted: boolean;
}

export interface WhiteboardState {
  cells: Cell[][];
  rows: number;
  cols: number;
  cellSize: number;
}

export function initWhiteboard(
  canvas: HTMLCanvasElement,
  state: WhiteboardState,
) {
  const ctx = canvas.getContext("2d")!;

  const isMobile = window.innerWidth <= 800;
  let cellSize = isMobile ? 8 : 12;

  const cleanupFns: (() => void)[] = [];
  let isMouseDown = false;
  let currentButton: number | null = null;
  let isTouchActive = false;
  let isEraseMode = false;

  function resizeCanvas() {
    cellSize = window.innerWidth <= 800 ? 8 : 12;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);

    state.cellSize = cellSize;
    state.cols = cols;
    state.rows = rows;

    if (!state.cells || state.cells.length === 0) {
      state.cells = Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => ({
          x,
          y,
          isPainted: false,
        }))
      );
    } else {
      const newCells: Cell[][] = Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => {
          if (y < state.cells.length && x < state.cells[y]!.length) {
            return state.cells[y]![x]!;
          }
          return {
            x,
            y,
            isPainted: false,
          };
        })
      );
      state.cells = newCells;
    }

    draw();
  }

  function getCellFromEvent(e: MouseEvent | TouchEvent): { x: number; y: number } | null {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if ('touches' in e || 'changedTouches' in e) {
      const touchEvent = e as TouchEvent;
      if (touchEvent.touches && touchEvent.touches.length > 0) {
        clientX = touchEvent.touches[0]!.clientX;
        clientY = touchEvent.touches[0]!.clientY;
      } else if (touchEvent.changedTouches && touchEvent.changedTouches.length > 0) {
        clientX = touchEvent.changedTouches[0]!.clientX;
        clientY = touchEvent.changedTouches[0]!.clientY;
      } else {
        return null;
      }
    } else {
      const mouseEvent = e as MouseEvent;
      clientX = mouseEvent.clientX;
      clientY = mouseEvent.clientY;
    }

    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;
    const x = Math.floor(canvasX / cellSize);
    const y = Math.floor(canvasY / cellSize);

    if (x >= 0 && x < state.cols && y >= 0 && y < state.rows) {
      return { x, y };
    }
    return null;
  }

  function paintCell(x: number, y: number, paint: boolean) {
    if (x >= 0 && x < state.cols && y >= 0 && y < state.rows) {
      const cell = state.cells[y]?.[x];
      if (cell) {
        cell.isPainted = paint;
        draw();
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.cells || state.cells.length === 0) return;

    ctx.fillStyle = "#fbf1c7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < state.rows; y++) {
      for (let x = 0; x < state.cols; x++) {
        const cell = state.cells[y]?.[x];
        if (cell && cell.isPainted) {
          ctx.fillStyle = "#458588";
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    ctx.strokeStyle = "#3c3836";
    ctx.lineWidth = 0.1;
    ctx.setLineDash([]);

    for (let x = 0; x <= state.cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= state.rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvas.width, y * cellSize);
      ctx.stroke();
    }
  }

  const mouseDownHandler = (e: MouseEvent) => {
    isMouseDown = true;
    currentButton = e.button;

    const cell = getCellFromEvent(e);
    if (cell) {
      paintCell(cell.x, cell.y, currentButton === 0);
    }
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (isMouseDown && currentButton !== null) {
      const cell = getCellFromEvent(e);
      if (cell) {
        paintCell(cell.x, cell.y, currentButton === 0);
      }
    }
  };

  const mouseUpHandler = () => {
    isMouseDown = false;
    currentButton = null;
  };

  const contextMenuHandler = (e: MouseEvent) => {
    e.preventDefault();
  };

  const mouseLeaveHandler = () => {
    isMouseDown = false;
    currentButton = null;
  };

  const touchStartHandler = (e: TouchEvent) => {
    e.preventDefault();

    const touchCount = Math.max(e.touches.length, e.changedTouches.length);
    isEraseMode = touchCount >= 2;
    isTouchActive = true;

    const cell = getCellFromEvent(e);
    if (cell) {
      paintCell(cell.x, cell.y, !isEraseMode);
    }
  };

  const touchMoveHandler = (e: TouchEvent) => {
    e.preventDefault();
    if (isTouchActive) {
      const touchCount = e.touches.length;
      const shouldErase = touchCount >= 2;

      isEraseMode = shouldErase;

      const cell = getCellFromEvent(e);
      if (cell) {
        paintCell(cell.x, cell.y, !isEraseMode);
      }
    }
  };

  const touchEndHandler = (e: TouchEvent) => {
    e.preventDefault();
    isTouchActive = false;
    isEraseMode = false;
  };

  const touchCancelHandler = () => {
    isTouchActive = false;
    isEraseMode = false;
  };

  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
  canvas.addEventListener("mouseleave", mouseLeaveHandler);
  canvas.addEventListener("contextmenu", contextMenuHandler);

  canvas.addEventListener("touchstart", touchStartHandler, { passive: false });
  canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
  canvas.addEventListener("touchend", touchEndHandler, { passive: false });
  canvas.addEventListener("touchcancel", touchCancelHandler);

  cleanupFns.push(() => canvas.removeEventListener("mousedown", mouseDownHandler));
  cleanupFns.push(() => canvas.removeEventListener("mousemove", mouseMoveHandler));
  cleanupFns.push(() => canvas.removeEventListener("mouseup", mouseUpHandler));
  cleanupFns.push(() => canvas.removeEventListener("mouseleave", mouseLeaveHandler));
  cleanupFns.push(() => canvas.removeEventListener("contextmenu", contextMenuHandler));
  cleanupFns.push(() => canvas.removeEventListener("touchstart", touchStartHandler));
  cleanupFns.push(() => canvas.removeEventListener("touchmove", touchMoveHandler));
  cleanupFns.push(() => canvas.removeEventListener("touchend", touchEndHandler));
  cleanupFns.push(() => canvas.removeEventListener("touchcancel", touchCancelHandler));

  window.addEventListener("resize", resizeCanvas);
  cleanupFns.push(() => window.removeEventListener("resize", resizeCanvas));

  resizeCanvas();

  return () => cleanupFns.forEach(fn => fn());
}

