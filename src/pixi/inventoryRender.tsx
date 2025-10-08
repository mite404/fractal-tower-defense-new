import { Graphics, Container, Application, FederatedPointerEvent } from "pixi.js";
import type { GameState } from "../type";
import { setupDragAndDrop } from "./dragAndDrop";



const inventory = new Container()

export function renderInventory(app: Application, gameState: GameState): Application {
  app.stage.addChild(inventory)

  let endY = 10 // Start at top padding
  let endX = 750 // Start of sidebar
  let maxX = 0
  const MAX_Y = 720 // 12 * 60 = height of grid



  gameState.player.hand.forEach((piece) => {
    const pieceContainer = new Container()
    pieceContainer.x = endX;
    pieceContainer.y = endY;
    pieceContainer.eventMode = 'static';
    pieceContainer.cursor = 'pointer';
    pieceContainer.label = `piece-${piece.id}`; 
    const piecePaddingY = 10;
    const piecePaddingX = 10;

    // Count non-empty rows for this piece
    const nonEmptyRows = piece.shape.filter(row =>
      row.some(cell => cell.type !== 'empty')
    ).length;

    const pieceHeight = nonEmptyRows * 60;

    // Check if piece would overflow, move to next column if so
    if (endY + pieceHeight > MAX_Y) {
      endX += maxX + 70; // Move to next column (adjust width as needed)
      endY = 10;   // Reset to top
    }

    piece.shape.forEach((row, rowidx) => {
      row.forEach((cell, colIdx) => {
        if (cell.type === "empty") return;

        const cellGraphics = new Graphics()

        let color;
        if (cell.type === 'tower') {
          color = 0x4a90e2; // Blue
        } else if (cell.type === 'path') {
          color = 0x8b6f47; // Brown
        } else {
          color = 0x666666;
        }

        cellGraphics.rect(colIdx * 60, rowidx * 60, 60, 60),
          cellGraphics.fill(color)
        cellGraphics.stroke({ width: 1, color: 0x333333 })

        pieceContainer.x = endX + piecePaddingX
        pieceContainer.y = endY

        pieceContainer.addChild(cellGraphics)
        maxX = Math.max(maxX, colIdx * 60 + piecePaddingX)

      })
    })

    // Add to inventory
    inventory.addChild(pieceContainer)

    setupDragAndDrop(app, pieceContainer, gameState, piece)

    endY += nonEmptyRows * 60 + piecePaddingY

  }


  );


  return app
}



