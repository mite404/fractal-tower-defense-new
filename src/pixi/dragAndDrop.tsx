import { Application, Container, FederatedPointerEvent } from "pixi.js";

export function setupDragAndDrop(
  app: Application,
  pieceContainer: Container,
  boardContainer: Container,
  inventoryContainer: Container
) {
  const CELL = 60;
  const BOARD_CELLS = 10;

  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let originContainer: Container | null = null;
  let originalPosition = { x: 0, y: 0 };

  function preserveWorldAndReparent(newParent: Container) {
    const global = pieceContainer.toGlobal({ x: 0, y: 0 });
    newParent.addChild(pieceContainer);
    pieceContainer.position = newParent.toLocal(global);
  }

  function revertToOrigin() {
    preserveWorldAndReparent(originContainer!);
    pieceContainer.x = originalPosition.x;
    pieceContainer.y = originalPosition.y;
  }

  pieceContainer.on("pointerdown", (event: FederatedPointerEvent) => {
    isDragging = true;
    originContainer = pieceContainer.parent!;
    originalPosition = { x: pieceContainer.x, y: pieceContainer.y };

    preserveWorldAndReparent(app.stage);

    const stagePt = app.stage.toLocal(event.global);
    dragOffset = {
      x: stagePt.x - pieceContainer.x,
      y: stagePt.y - pieceContainer.y,
    };

    pieceContainer.alpha = 0.7;
    pieceContainer.zIndex = 9999;
  });

  pieceContainer.on("globalpointermove", (event: FederatedPointerEvent) => {
    if (!isDragging) return;
    const stagePt = app.stage.toLocal(event.global);
    pieceContainer.x = stagePt.x - dragOffset.x;
    pieceContainer.y = stagePt.y - dragOffset.y;
  });

  const handleUp = (event: FederatedPointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    pieceContainer.alpha = 1;

    const boardPt = boardContainer.toLocal(event.global);

    // piece size in grid cells
    const cellsW =
      (pieceContainer as any)._cellsW ??
      Math.max(1, Math.round(pieceContainer.width / CELL));
    const cellsH =
      (pieceContainer as any)._cellsH ??
      Math.max(1, Math.round(pieceContainer.height / CELL));

    // compute "majority overlap" by centering the anchor point
    const offsetX = (cellsW * CELL) / 2 - CELL / 2;
    const offsetY = (cellsH * CELL) / 2 - CELL / 2;

    // where the piece's center sits relative to the board
    const adjustedPt = {
      x: boardPt.x - dragOffset.x + offsetX,
      y: boardPt.y - dragOffset.y + offsetY,
    };

    // derive grid cell index from that adjusted center
    const anchorX = Math.floor(adjustedPt.x / CELL);
    const anchorY = Math.floor(adjustedPt.y / CELL);

    const maxX = BOARD_CELLS - cellsW;
    const maxY = BOARD_CELLS - cellsH;

    // bounds check
    if (anchorX < 0 || anchorY < 0 || anchorX > maxX || anchorY > maxY) {
      revertToOrigin();
      return;
    }

    // snap top-left corner to correct grid cell
    preserveWorldAndReparent(boardContainer);
    pieceContainer.x = anchorX * CELL;
    pieceContainer.y = anchorY * CELL;
  };

  pieceContainer.on("pointerup", handleUp);
  pieceContainer.on("pointerupoutside", handleUp);
}
