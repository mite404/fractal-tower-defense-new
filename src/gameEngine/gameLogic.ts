import type { GameState, Grid, Piece } from "../type";

export function canPlacePiece(gameState: GameState, piece: Piece, topLeftX: number, topLeftY: number): boolean {
  const transformed = piece.shape;
  const currentGrid = gameState.grid

  for (let r = 0; r < transformed.length; r++) {
    for (let c = 0; c < transformed[r].length; c++) {
      const pieceCell = transformed[r][c];
      if (pieceCell.type === "empty") continue;

      const gx = topLeftX + c;
      const gy = topLeftY + r;

      if (gy < 0 || gx < 0 || gy >= currentGrid.length || gx >= currentGrid[0].length) return false;
      if  (gameState.grid[gy][gx].type!=='empty') return false
    }
  }

  return true;
}

export function placePiece(gameState: GameState, piece: Piece, topLeftX: number, topLeftY: number): void {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      const gx = topLeftX + c
      const gy = topLeftY + r
      gameState.grid[gy][gx].type = piece.shape[r][c].type
    }
  }

  const i = gameState.player.hand.findIndex(p => p.id === piece.id);
  if (i !== -1) gameState.player.hand.splice(i, 1);
  piece.isPlaced = true

  gameState.pieces.push({
    id: crypto.randomUUID(),
    pieceId: piece.id,
    position: { x: topLeftX, y: topLeftY },
  });
  gameState.player.piecePickedUp = null
}


export function pickupPiece(gameState:GameState,piece:Piece, topLeftX: number, topLeftY: number):void{
  console.log('pickup at ', topLeftX, topLeftY)
  if (!piece.isPlaced) return
  piece.isPlaced = false
}
