import type { Application, Container, FederatedPointerEvent } from "pixi.js";
import type { GameState, Piece } from "../type";
import { canPlacePiece } from "../gameEngine/gameLogic";
import { board } from "./renderer";

export function setupDragAndDrop(
  app: Application,
  piece: Container,
  gameState: GameState,
  pieceData: Piece
) {
  const CELL = 60;
  const BOARD_CELLS = 10;

  let dragging = false;
  let originParent: Container | null = null;
  let originPos = { x: 0, y: 0 };
  let dragOffset = { x: 0, y: 0 };

  // --- helpers ---
  function reparentPreservePos(obj: Container, newParent: Container) {
    const globalBefore = obj.parent?.toGlobal(obj.position);
    console.log('[RE-PARENT TARGET]', newParent?.label ?? 'null', newParent);
    console.log('[RE-PARENT]', obj.name ?? obj.label, 'global before:', globalBefore, 'old parent:', obj.parent?.label);
    if (!globalBefore) return;
    newParent.addChild(obj);
    const localAfter = newParent.toLocal(globalBefore);
    obj.position.set(localAfter.x, localAfter.y);
    console.log('[RE-PARENT]', 'global after:', obj.toGlobal({ x: 0, y: 0 }), 'parent now:', obj.parent?.label);
  }


  const revert = () => {
    if (!originParent) return;
    reparentPreservePos(piece, originParent);
    piece.position.copyFrom(originPos);
    piece.alpha = 1;
  };

  const snapToGrid = () => {
    const gb = piece.getBounds(true);
    const boardRef = board ?? app.stage;

    // top-left in board-local
    const topLeftBoard = boardRef.toLocal({ x: gb.x, y: gb.y });
    let gx = Math.round(topLeftBoard.x / CELL);
    let gy = Math.round(topLeftBoard.y / CELL);

    // clamp inside board
    const wCells = Math.max(1, Math.round(gb.width / CELL));
    const hCells = Math.max(1, Math.round(gb.height / CELL));
    gx = Math.max(0, Math.min(BOARD_CELLS - wCells, gx));
    gy = Math.max(0, Math.min(BOARD_CELLS - hCells, gy));

    // world coordinate of that grid cell
    const cellTLWorld = boardRef.toGlobal({ x: gx * CELL, y: gy * CELL });
    const pieceOriginWorld = piece.toGlobal({ x: 0, y: 0 });
    const offset = { dx: gb.x - pieceOriginWorld.x, dy: gb.y - pieceOriginWorld.y };
    const desiredOriginWorld = {
      x: cellTLWorld.x - offset.dx,
      y: cellTLWorld.y - offset.dy,
    };
    const local = (originParent ?? app.stage).toLocal(desiredOriginWorld);

    return { gx, gy, local };
  };

  // --- pointer events ---
  piece.eventMode = "static";
  piece.cursor = "pointer";

  //console.log("pointerdown parent:", piece.parent?.label);

  piece.on("pointerdown", (e: FederatedPointerEvent) => {
    console.log('--- MOVE ---')
    console.log('piece.id:', pieceData.id)
    console.log('global pointer:', e.global)
    console.log('piece.position (local):', piece.position)
    console.log('piece.toGlobal(0,0):', piece.toGlobal({ x: 0, y: 0 }))
    console.log('dragOffset:', dragOffset)
    console.log('parent:', piece.parent?.name)
    dragging = true;
    originParent = piece.parent!;
    originPos = { x: piece.x, y: piece.y };

    console.log('[BEFORE RE-PARENT]', { parent: piece.parent?.label });

    reparentPreservePos(piece, app.stage);
    const stagePt = app.stage.toLocal(e.global);
    dragOffset = { x: stagePt.x - piece.x, y: stagePt.y - piece.y };

    const newGlobal = piece.parent?.toGlobal(piece.position);
    console.log('[AFTER RE-PARENT]', { newGlobal, parent: piece.parent?.label });

    piece.alpha = 0.8;
  });

  piece.on("globalpointermove", (e: FederatedPointerEvent) => {
    if (!dragging) return;
    const p = app.stage.toLocal(e.global);
    piece.position.set(p.x - dragOffset.x, p.y - dragOffset.y);
  });

  const handleUp = (e: FederatedPointerEvent) => {
    if (!dragging) return;
    dragging = false;

    const snap = snapToGrid();
    if (!snap) return revert();

    const { gx, gy, local } = snap;
    const valid = canPlacePiece(gameState.grid, pieceData, gx, gy);
    if (!valid) return revert();

    piece.position.copyFrom(local);
    piece.alpha = 1;
  };

  piece.on("pointerup", handleUp);
  piece.on("pointerupoutside", handleUp);
}
