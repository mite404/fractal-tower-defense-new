import type { Application, Container, FederatedPointerEvent } from "pixi.js";
import type { GameState, Piece } from "../type";
import { canPlacePiece } from "../gameEngine/gameLogic";

export function setupDragAndDrop(app: Application, piece: Container, gameState:GameState, pieceData:Piece): void {
  const CELL = 60;
  const BOARD_CELLS = 10;
  const BIAS = 0.33 * CELL; // 2% of a cell: nudges ties up/left (remove/adjust to taste)

  let dragging = false;
  let originParent: Container | null = null;
  let originPos = { x: 0, y: 0 };
  let dragOffsetStage = { x: 0, y: 0 };

  function preserveWorldAndReparent(obj: Container, newParent: Container) {
    const world = obj.parent!.toGlobal(obj.position);
    newParent.addChild(obj);
    obj.position.copyFrom(newParent.toLocal(world));
  }

  piece.eventMode = "static";
  piece.cursor = "pointer";

  piece.on("pointerdown", (e: FederatedPointerEvent) => {
    // guard: only start if actually inside
    const b = piece.getBounds();
    if (e.global.x < b.left || e.global.x > b.right || e.global.y < b.top || e.global.y > b.bottom) return;

    dragging = true;
    originParent = piece.parent!;
    originPos = { x: piece.x, y: piece.y };

    preserveWorldAndReparent(piece, app.stage);

    const stagePt = app.stage.toLocal(e.global);
    dragOffsetStage.x = stagePt.x - piece.x;
    dragOffsetStage.y = stagePt.y - piece.y;

    piece.alpha = 0.8;
    piece.zIndex = 10_000;
  });

  piece.on("globalpointermove", (e: FederatedPointerEvent) => {
    if (!dragging) return;
    const p = app.stage.toLocal(e.global);
    piece.position.set(p.x - dragOffsetStage.x, p.y - dragOffsetStage.y);
  });

  function revert() {
    if (!originParent) return;
    preserveWorldAndReparent(piece, originParent);
    piece.position.set(originPos.x, originPos.y);
    piece.alpha = 1;
  }

  function handleUp(_e: FederatedPointerEvent) {
    if (!dragging) return;
    dragging = false;

    // use local bounds to get visual top-left (handles any internal offset)
    const lb = piece.getLocalBounds();
    const topLeftWorld = piece.toGlobal({ x: lb.x, y: lb.y });

    // prefer integer cell footprint over raw px (avoids 0.5px stroke jitter)
    const cellsW = (piece as any)._cellsW ?? Math.max(1, Math.round(lb.width / CELL));
    const cellsH = (piece as any)._cellsH ?? Math.max(1, Math.round(lb.height / CELL));
    const wPx = cellsW * CELL;
    const hPx = cellsH * CELL;

    // majority snap using center, with a small up/left bias
    const centerX = topLeftWorld.x + wPx / 2 - BIAS;
    const centerY = topLeftWorld.y + hPx / 2 - BIAS;
    let gx = Math.floor(centerX / CELL);
    let gy = Math.floor(centerY / CELL);

    //GameState validation
    if (!canPlacePiece(gameState.grid, pieceData, gx, gy)) {
    return revert();
  }



    const maxX = BOARD_CELLS - cellsW;
    const maxY = BOARD_CELLS - cellsH;
    if (gx < 0 || gy < 0 || gx > maxX || gy > maxY) return revert();

    // snap: place so that the visual top-left (lb.x/lb.y) lands on the grid
    const snapX = gx * CELL;
    const snapY = gy * CELL;
    piece.position.set(snapX - lb.x, snapY - lb.y);
    piece.alpha = 1;
  }

  

  piece.on("pointerup", handleUp);
  piece.on("pointerupoutside", handleUp);
}


