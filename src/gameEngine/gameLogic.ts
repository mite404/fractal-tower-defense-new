import type { Container } from "pixi.js";
import type { GameState, Grid, Piece, PlacedPiece } from "../type";

export function canPlacePiece(grid: Grid, piece: Piece, topLeftX: number, topLeftY: number): boolean {
    const transformed = piece.shape/*flipShape(rotateShape(piece.shape, piece.rotation), piece.flipped)*/ ;

    console.log( piece, topLeftX, topLeftY)


    for (let r = 0; r < transformed.length; r++) {
        for (let c = 0; c < transformed[r].length; c++) {
            const pieceCell = transformed[r][c];
            if (pieceCell.type === "empty") continue;

            const gx = topLeftX + c;
            const gy = topLeftY + r;

            console.log(gx,gy)
            console.log(grid[gy][gx])

            if (gy < 0 || gx < 0 || gy >= grid.length || gx >= grid[0].length) return false;
        }
    }

    return true;
}

export function applyPiecePlacement(gameState: GameState, piece: Piece, topLeftX: number, topLeftY: number): GameState {

  const { valid, occupied } = canPlacePiece(gameState.grid, piece, topLeftX, topLeftY);
  if (!valid) return gameState; // no change

  // mark piece placed
  piece.isPlaced = true;

  // mark cells
  occupied.forEach(({ x, y, type }) => {
    gameState.grid[y][x].type = type;
    gameState.grid[y][x].occupiedBy = piece.id;
  });

  // remove from hand
  gameState.player.hand = gameState.player.hand.filter(p => p.id !== piece.id);

  // create PlacedPiece
  const placedPiece: PlacedPiece = {
    id: crypto.randomUUID(),
    pieceId: piece.id,
    position: { x: topLeftX, y: topLeftY },
  };
  gameState.pieces.push(placedPiece);

  // optional: add to towers if relevant
  if (piece.tower) {
    gameState.towers.push({
      ...piece.tower,
      pieceId: piece.id,
      position: { x: topLeftX, y: topLeftY },
    });
  }

  return gameState;
}

// helper for your game logic
export function rotateAroundTopLeft(piece: Container, deg: number) {
  const before = piece.getBounds();
  piece.rotation = (piece.rotation + (deg * Math.PI) / 180) % (2 * Math.PI);
  const after = piece.getBounds();
  piece.position.x += before.x - after.x;
  piece.position.y += before.y - after.y;
}

export function flipAroundCenter(piece: Container) {
  const before = piece.getBounds();
  piece.pivot.x = piece.width / 2;
  piece.position.x += piece.width / 2;
  piece.scale.x *= -1;
  const after = piece.getBounds();
  piece.position.x += before.x - after.x;
  piece.position.y += before.y - after.y;
}
