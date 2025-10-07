import type { GameState, Piece } from "../type";

export function placePiece ( state: GameState, piece: Piece, x:number, y: number): {success: boolean, newState:GameStatate} {
    if (!isValidPlacement(state,piece, x, y)) return {sucdess=false, state}



}

function isValidPlacement (checkState:GameState, piece:Piece, x:number, y:number):boolean { 
    const height = piece.shape.length
    const length = piece.shape[0].length
    for(let i = y; i <=height + y; i++) {
        for(let j = x; j <= length + x; j++) {
            if (checkState.grid[i][j] === 'empty'){} 

        }
    }
            
        }