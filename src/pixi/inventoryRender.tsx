import { Graphics, Container, Application } from "pixi.js";
import type { GameState } from "../type";

const inventory = new Container()

export function renderInventory(app: Application, gameState: GameState): Application {


  // Sidebar background generation
  const sidebarBg = new Graphics()
  sidebarBg.rect(750, 0, 480, 1080)
  sidebarBg.fill(0x1a1a1a);
  sidebarBg.stroke({ width: 2, color: 0x333333 })

  inventory.addChild(sidebarBg)

let endY = 10; // Start at top padding
let endX = 750; // Start of sidebar
let maxX = 0;
const MAX_Y = 720; // 12 * 60 = height of grid

gameState.player.hand.forEach((piece) => {
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
      row.forEach((cell,colIdx) => {
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

        cellGraphics.rect(endX + colIdx * 60 + piecePaddingX, rowidx * 60 + endY,60,60),
        cellGraphics.fill(color)
        cellGraphics.stroke({ width: 1, color: 0x333333 })

        inventory.addChild(cellGraphics)
        maxX = Math.max(maxX, colIdx * 60 + piecePaddingX)

      })

    })

    endY += nonEmptyRows * 60 + piecePaddingY

  });
  app.stage.addChild(inventory)
  return app
}


