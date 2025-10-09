import type { Application, Container, FederatedPointerEvent } from "pixi.js";
import type { GameState, Piece } from "../type";
import { canPlacePiece, pickupPiece, placePiece } from "../gameEngine/gameLogic";
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


  function moveToParent(obj: Container, newParent: Container) {
    const globalPos = obj.toGlobal({ x: 0, y: 0 });
    newParent.addChild(obj);
    const localPos = newParent.toLocal(globalPos);
    obj.position.set(localPos.x, localPos.y);
  }


  const revert = () => {
    if (!originParent) return;
    moveToParent(piece, originParent);
    piece.position.copyFrom(originPos);
    piece.alpha = 1;
  };

  function snapToGrid() {
    const pieceBounds = piece.getBounds(true);
    const centerX = pieceBounds.x + pieceBounds.width / 2;
    const centerY = pieceBounds.y + pieceBounds.height / 2;


    //pixels to grid
    let gridIdxX = Math.floor((centerX - 20) / CELL);
    let gridIdxY = Math.floor((centerY - 20) / CELL);

    //keep clamp to grid
    gridIdxX = Math.max(0, Math.min(BOARD_CELLS - 1, gridIdxX));
    gridIdxY = Math.max(0, Math.min(BOARD_CELLS - 1, gridIdxY));

    //grid back to pixels
    return { gridIdxX, gridIdxY, local: { x: gridIdxX * CELL, y: gridIdxY * CELL } };
  }

  piece.eventMode = "static";
  piece.cursor = "pointer";


  piece.on("pointerdown", (e: FederatedPointerEvent) => {

    dragging = true;
    originParent = piece.parent!;
    originPos = { x: piece.x, y: piece.y };

    moveToParent(piece, app.stage);

    const placedPiece = gameState.pieces.filter(p=>pieceData.id===p.pieceId)[0] ?? null

    if (placedPiece) pickupPiece(gameState, pieceData, placedPiece.position.x, placedPiece.position.y)


    
    const stagePosition = app.stage.toLocal(e.global);
    dragOffset = { x: stagePosition.x - piece.x, y: stagePosition.y - piece.y };


    piece.alpha = 0.7;
  });

  piece.on("globalpointermove", (e: FederatedPointerEvent) => {
    if (!dragging) return;
    const p = app.stage.toLocal(e.global);
    piece.position.set(p.x - dragOffset.x, p.y - dragOffset.y);
  });

  const handleClickUp = (e: FederatedPointerEvent) => {
    if (!dragging) return;
    dragging = false;

    const snap = snapToGrid();
    if (!snap) return revert();

    moveToParent(piece, board)

    const { gridIdxX, gridIdxY, local } = snap;
    const valid = canPlacePiece(gameState, pieceData, gridIdxX, gridIdxY);
    if (!valid) return revert();

    console.log(gameState)

    placePiece(gameState, pieceData, gridIdxX, gridIdxY)



    piece.position.copyFrom(local);
    piece.alpha = 1;
  };

  piece.on("pointerup", handleClickUp);
  piece.on("pointerupoutside", handleClickUp);
}
