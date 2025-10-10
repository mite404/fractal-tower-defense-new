import { Graphics, Container, Application, type PointData, Sprite } from "pixi.js";
import type { GameState, Piece } from "../type";
import { addInput } from "../input";

let inventory: Container;
let mousePos: PointData;
let xOffset = 750
let yStart = 20
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
      if (yStart >= 300) {
        yStart = -250
        xOffset = maxOffSetx
      }
      const pieceContainer = createPieceContainer(pieces.indexOf(piece), xOffset, yStart, spacing)
      maxOffSetx = Math.max(pieceContainer.width + maxOffSetx, maxOffSetx) + 250
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
        console.log('attempting to drag')
        addInput({
          inputType: "piecePickedUp",
          pieceId: piece.id,
        });


        //store original position for failed drag snapback
        pieceContainer.userData = pieceContainer.userData || {}
        pieceContainer.userData.originGlobal = pieceContainer.parent.toGlobal(pieceContainer.position);

        //disable events for grid event passthrough
        pieceContainer.eventMode = "none"
      });
    }

    //Outside of checking for set to animate drag
    const pieceContainer = pieceSet.get(piece.id)!
    if (gameState.player.piecePickedUp === piece.id) {
      pieceContainer.alpha = 0.7;

      const localPositionOfMouse = app.stage.toLocal(mousePos);
      pieceContainer.position.set(
        localPositionOfMouse.x,
        localPositionOfMouse.y
      );

        if (mousePos.x > app.screen.width - 50) {
    gameState.player.piecePickedUp = null; // stops drag
  }
    } // === snapback ===
    else if (gameState.player.piecePickedUp === null && pieceContainer.userData?.originGlobal) {
      const originLocal = pieceContainer.parent.toLocal(pieceContainer.userData.originGlobal);
      if (originLocal.x < 600) originLocal.x = 750

      // move piececontainer back to origin
      pieceContainer.x += (originLocal.x - pieceContainer.x) * 0.25;
      pieceContainer.y += (originLocal.y - pieceContainer.y) * 0.25;

      // stop when close
      if (
        Math.abs(pieceContainer.x - originLocal.x) < 0.5 &&
        Math.abs(pieceContainer.y - originLocal.y) < 0.5
      ) {
        pieceContainer.position.copyFrom(originLocal);
        pieceContainer.alpha = 1;
      }

      pieceContainer.eventMode = 'static'
    }
  }
     //make piece container invisible once placed
    gameState.pieces.forEach(piece => {
      if (piece && gameState.player.piecePickedUp !== piece.id) {
      const placedPieceContainer = pieceSet.get(piece.id)!
      placedPieceContainer.alpha = 0
      placedPieceContainer.eventMode='static'
  }})
}

function createPieceContainer(
  //Add texture: Sprite,
  index: number,
  xOffset = 750,
  yStart = 50,
  spacing = 70
): Container {
  const pieceContainer = new Container();
  //Add Sprite here
  pieceContainer.x = xOffset;
  pieceContainer.y = yStart + index * spacing;

  return pieceContainer;
}