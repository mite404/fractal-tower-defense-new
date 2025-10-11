import { Graphics, Container, Application, type PointData, Sprite, path } from "pixi.js";
import type { GameState, Piece } from "../type";
import { addInput } from "../input";
import { pathTexture, towerTexture } from "./textures";

let inventory: Container;
let path: Container
let tower: Container
let mousePos: PointData;
let xOffset = 750
let yStart = 20
let spacing = 70
let maxOffSetx = 0
const pieceSet = new Map<string, Container>();
const towerSprites = new Map<string, Sprite>();
const pathSprites = new Map<string, Sprite>();

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
      const pieceContainer = createPieceContainer(piece, pieces.indexOf(piece), xOffset, yStart, spacing)
      maxOffSetx = Math.max(pieceContainer.width + maxOffSetx, maxOffSetx) + 250
      yStart = pieceContainer.height + yStart + spacing

      inventory.addChild(pieceContainer);
      pieceContainer.label = `piece-${piece.id}`;

      piece.shape.forEach((row, rowidx) => {
        row.forEach((cell, colIdx) => {
          if (cell.type === "empty") return;

          if (cell.type === "tower") {
            if (!pathSprites.get(`${piece.id}-${colIdx}-${rowidx}`)) {
            const pathSprite = new Sprite({ texture: pathTexture, height: 60, width: 60 })
            pathSprite.position.x = colIdx * 60
            pathSprite.position.y = rowidx * 60
            pathSprite.eventMode = 'passive'
            pieceContainer.addChild(pathSprite)
            pathSprites.set(`${piece.id}-${colIdx}-${rowidx}`, pathSprite)
          }
          if (!towerSprites.get(`${piece.id}-${colIdx}-${rowidx}`)) {
            const towerSprite = new Sprite({ texture: towerTexture, height: 60, width: 60 })
            towerSprite.position.x = colIdx * 60
            towerSprite.position.y = rowidx * 60
            towerSprite.eventMode = 'passive'
            pieceContainer.addChild(towerSprite)
            towerSprites.set(`${piece.id}-${colIdx}-${rowidx}`, towerSprite)
          }
          } else if (cell.type === "path") {
                        if (!pathSprites.get(`${piece.id}-${colIdx}-${rowidx}`)) {
            const pathSprite = new Sprite({ texture: pathTexture, height: 60, width: 60 })
            pathSprite.position.x = colIdx * 60
            pathSprite.position.y = rowidx * 60
            pathSprite.eventMode = 'passive'
            pieceContainer.addChild(pathSprite)
            pathSprites.set(`${piece.id}-${colIdx}-${rowidx}`, pathSprite)
          }
          } 

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
  piece:Piece,
  index: number,
  xOffset = 750,
  yStart = 50,
  spacing = 70
): Container {
  const pieceContainer = new Container();
  pieceContainer.x = xOffset;
  pieceContainer.y = yStart + index * spacing;

  return pieceContainer;
}