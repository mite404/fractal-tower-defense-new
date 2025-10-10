import { Graphics, Container, Application, type PointData, Sprite } from "pixi.js";
import type { GameState, Piece } from "../type";
import { addInput } from "../input";

let inventory: Container;
let mousePos: PointData;
let xOffset = 750
let yStart = 50
let spacing = 70
let maxOffSetx = 0
const pieceSet = new Map<string, Container>();

export function renderInventory(app: Application, gameState: GameState): void {
  if (!inventory) {
    inventory = new Container();
    inventory.label = "inventory";
    app.stage.addChild(inventory);
    app.stage.addEventListener("globalpointermove", (e) => {
      mousePos = e.global;
    });
  }

  renderAllPieces(app, gameState, gameState.player.hand);
}

function renderAllPieces(
  app: Application,
  gameState: GameState,
  pieces: Piece[]
): void {

  for (const piece of pieces) {


    if (!pieceSet.has(piece.id)) {
      if (yStart >= 600) {
        yStart = 50
        xOffset = maxOffSetx
      }
      const pieceContainer = createPieceContainer(pieces.indexOf(piece), xOffset, yStart, spacing)
      maxOffSetx = Math.max(pieceContainer.width, maxOffSetx)
      yStart = pieceContainer.height + yStart + spacing
      
      inventory.addChild(pieceContainer);
      pieceContainer.label = `piece-${piece.id}`;

      piece.shape.forEach((row, rowidx) => {
        row.forEach((cell, colIdx) => {
          if (cell.type === "empty") return;

          const cellGraphics = new Graphics();

          let color;
          if (cell.type === "tower") {
            color = 0x4a90e2; // Blue
          } else if (cell.type === "path") {
            color = 0x8b6f47; // Brown
          } else {
            color = 0x666666;
          }

          cellGraphics.rect(colIdx * 60, rowidx * 60, 60, 60);
          cellGraphics.fill(color);
          cellGraphics.stroke({ width: 1, color: 0x333333 });


          pieceContainer.addChild(cellGraphics);



          pieceSet.set(piece.id, pieceContainer)
        });
      });
      pieceContainer.eventMode = "static";
      pieceContainer.cursor = "grab";

      pieceContainer.on("pointerdown", (e) => {
        addInput({
          inputType: "piecePickedUp",
          pieceId: piece.id,
        });
      });


    }

    const pieceContainer = pieceSet.get(piece.id)!
    if (gameState.player.piecePickedUp === piece.id) {

      pieceContainer.alpha = 0.7;

      const localPositionOfMouse = app.stage.toLocal(mousePos);
      pieceContainer.position.set(
        localPositionOfMouse.x,
        localPositionOfMouse.y
      );
    }

  }
}

export function createPieceContainer(
  //texture: Sprite,
  index: number,
  xOffset = 750,
  yStart = 50,
  spacing = 70
): Container {
  const pieceContainer = new Container();
  //const sprite = new Sprite(texture);

  //pieceContainer.addChild(sprite);

  // simple vertical stacking to the right of the board
  pieceContainer.x = xOffset;
  pieceContainer.y = yStart + index * spacing;

  return pieceContainer;
}