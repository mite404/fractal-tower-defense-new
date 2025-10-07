import type { Piece, Cell, Tower, CellType } from '../type';

function createShape(pattern: CellType[][]): Cell[][] {
  return pattern.map((row, y) => 
    row.map((type, x) => ({
      x,
      y,
      type
    }))
  );
}

export function defaultTower(pieceId:string): Tower {
    return {
        id: crypto.randomUUID(),
        type:'basic',
        pieceId :pieceId,
        position: {x:0, y:0},
        damage: 10,
        range:2.5,
        fireRate:1,
        cooldown:5
    }
}

const squarePieceId = crypto.randomUUID()

export const squarePiece:Piece = {
    id: squarePieceId,
    shape: createShape([['tower','path'],['path','path']]),
    isPlaced: false,
    rotation: 0,
    flipped: false,
    tower: defaultTower(squarePieceId)
}

const recPieceId = crypto.randomUUID()

export const rectPiece:Piece = {
    id: recPieceId,
    shape: createShape([['tower','path','path'],['path','path','path'],['empty','empty','empty']]),
    isPlaced: false,
    rotation: 0,
    flipped: false,
    tower: defaultTower(recPieceId)
}
const sPieceAId = crypto.randomUUID() 

export const sPieceA:Piece = {
    id: sPieceAId,
    shape: createShape([['empty','tower','path'],['path','path','empty'],['empty','empty','empty']]),
    isPlaced: false,
    rotation: 0,
    flipped: false,
    tower: defaultTower(sPieceAId)
}

const sPieceBId = crypto.randomUUID() 

export const sPieceB:Piece = {
    id: sPieceBId,
    shape: createShape([['empty','path','tower'],['path','path','empty'],['empty','empty','empty']]),
    isPlaced: false,
    rotation: 0,
    flipped: false,
    tower: defaultTower(sPieceBId)
}

export const jPieceId = crypto.randomUUID()
export const jPiece:Piece = {
    id: jPieceId,
    shape: createShape([['tower','empty','empty'],['path','path','path'],['empty','empty','empty']]),
    isPlaced: false,
    rotation: 0,
    flipped: false,
    tower: defaultTower(jPieceId)
}

export function startingHand():Piece[] {
    return [
        squarePiece, squarePiece, rectPiece, sPieceA, sPieceB, jPiece 
    ]
}



