import { Graphics, Container, Application } from "pixi.js";
import type { GameState } from "../type";

const inventory = new Container()

export function renderInventory(app: Application, gameState: GameState): Application {


  // Sidebar background generation
  const sidebarBg = new Graphics()
  sidebarBg.rect(750, 0, 240, 1080)
  sidebarBg.fill(0x1a1a1a);
  sidebarBg.stroke({ width: 2, color: 0x333333 })

  inventory.addChild(sidebarBg)

  let endY = 10

  gameState.player.hand.forEach((piece,idx)=> {
    const piecePaddingY = 10
    const piecePaddingX = 10

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

        cellGraphics.rect(750 + colIdx * 60 + piecePaddingX, rowidx * 60 + endY,60,60),
        cellGraphics.fill(color)
        cellGraphics.stroke({ width: 1, color: 0x333333 })

        inventory.addChild(cellGraphics)

      })

    })

    const nonEmptyRows = piece.shape.filter(row=>row.some(cell=> cell.type != 'empty')).length
    endY += nonEmptyRows * 60 + piecePaddingY

  });
  app.stage.addChild(inventory)
  return app
}


