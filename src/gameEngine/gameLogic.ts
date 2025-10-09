import type { Grid, Piece } from "../type";

export function canPlacePiece(grid: Grid, piece: Piece, topLeftX: number, topLeftY: number): boolean {
    const transformed = piece.shape;

    for (let r = 0; r < transformed.length; r++) {
        for (let c = 0; c < transformed[r].length; c++) {
            const pieceCell = transformed[r][c];
            if (pieceCell.type === "empty") continue;

            const gx = topLeftX + c;
            const gy = topLeftY + r;


            if (gy < 0 || gx < 0 || gy >= grid.length || gx >= grid[0].length) return false;
        }
    }

    return true;
}

export function placePiece(grid: Grid, piece: Piece, topLeftX: number, topLeftY: number): boolean {

}