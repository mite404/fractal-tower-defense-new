import type { GameState, Piece } from "../type";

export function canPlacePiece(gameState: GameState, piece: Piece, topLeftX: number, topLeftY: number): boolean {

  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      const pieceCell = piece.shape[r][c];
      if (pieceCell.type === "empty") continue;

      const gx = topLeftX + c;
      const gy = topLeftY + r;

      if (gy < 0 || gx < 0 || gy >= gameState.grid.length || gx >= gameState.grid[0].length) return false;
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
      if (piece.shape[r][c].type == 'empty') continue
      gameState.grid[gy][gx].type = piece.shape[r][c].type
      gameState.grid[gy][gx].occupiedBy = piece.id
    }
  }

  gameState.player.hand = gameState.player.hand.filter(p=>p.id != piece.id)

  piece.isPlaced = true

  gameState.towers.push(piece.tower)

  gameState.pieces.push(piece)
  gameState.player.piecePickedUp = null
}


export function pickupPiece(gameState:GameState, topLeftX: number, topLeftY: number):void{
  const picked = gameState.pieces.find(piece=>gameState.grid[topLeftX][topLeftY].occupiedBy===piece.id)!
	gameState.pieces = gameState.pieces.filter(piece=>gameState.grid[topLeftX][topLeftY].occupiedBy!==piece.id)
	gameState.player.hand.push(picked)
	gameState.player.piecePickedUp = picked.id
  picked.isPlaced = false
  gameState.towers = gameState.towers.filter(tower=>tower.pieceId!=picked.id)
  gameState.grid.forEach((row,rowidx)=>{
    row.forEach((col, colidx) => {
      if(gameState.grid[colidx][rowidx].occupiedBy===picked.id) gameState.grid[colidx][rowidx].type= 'empty'
    });
  })
}


