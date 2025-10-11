import {
  Application,
  Container,
  Sprite,
  Graphics,
  TilingSprite,
} from "pixi.js";
import { type GameState, createEmptyGrid } from "../type";
import { enemyDummyTexture, bgTileTexture,  tileTexture, towerTexture, pathTexture, treeBGTexture } from "./textures";
import { loadTextures } from "./textures.ts";
import { renderInventory } from "./inventoryRender.tsx";
import { addInput } from "../input.ts";
import { initUI, updateUI } from "./renderUI.ts";

let app: Application;
let displayGrid: Graphics[][];
let displayBgTileSprite: Sprite;
let displayEnemy: Container;
let tower: Container
let path: Container
let tree: Container
export let board: Container;
const enemySprites = new Map<string, Sprite>();
const towerSprites = new Map<string, Sprite>();
const pathSprites = new Map<string, Sprite>();
const finalSprites = new Map<string, Sprite>();
const treeSprites = new Map<string, Sprite>();

export async function initApp(canvas: HTMLCanvasElement): Promise<Application> {
  // TODO: pull out any init stuff from the render function and put it in here.

  // also: call this function over in the GameCanvas whenever it mounts (via useEffect)
  // Create a new application
  app = new Application();

  // Initialize the application
  await app.init({
    background: "#4c4c4cff",
    canvas,
    resizeTo: window,
  });

  await loadTextures();

  await initUI(app);

  // Create and add a container to the stage
  board = new Container();
  displayEnemy = new Container();
  tower = new Container()

  const tilingSprite = new TilingSprite(tileTexture)
  tilingSprite.width = 600
  tilingSprite.height = 600
  tilingSprite.tileScale = { x: .3, y: .3 }


  app.ticker.add(() => {
    tilingSprite.tilePosition.x += Math.random() * .5
    tilingSprite.tilePosition.y += Math.random() * .5
  })
  app.stage.addChild(tilingSprite)

  // Create the background tileset
  /*displayBgTileSprite = new Sprite(bgTileTexture);
  displayBgTileSprite.width = 600;
  displayBgTileSprite.height = 600;
  displayBgTileSprite.x = 0;
  displayBgTileSprite.y = 0;

  app.stage.addChild(displayBgTileSprite);*/


  // app.stage.addChild(drawGrid);
  app.stage.addChild(board);
  app.stage.addChild(displayEnemy);
  app.stage.eventMode = "static";
  // Make sure the whole canvas area is interactive, not just the circle.
  app.stage.hitArea = app.screen;

  displayGrid = createEmptyGrid().map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const square = new Graphics()
        .rect(colIndex * 60, rowIndex * 60, 60, 60)
        .fill({ color: 0xaaaaaa, alpha: 200 })
        .stroke(0x00ff00);
      square.eventMode = "static";

      square.on("pointerdown", (event) => {
        // do we want to standardize this to the 2D array defaults?? e.g.
        // cellX: colIndex  // column = x
        // cellY: rowIndex  // row = y
        addInput({
          inputType: "cellClick",
          cellX: rowIndex,
          cellY: colIndex,
        });
        console.log("adding to input queue");
      });
      square.on("pointerup", (e) => {
        console.log("pointer up!", colIndex, rowIndex);
        addInput({
          inputType: "mouseup",
          gridCoordinates: { x: colIndex, y: rowIndex },
        });
      });
      board.addChild(square);
      return square;
    });
  });

  return app;
}

export function render(gameState: GameState) {
  updateUI(gameState);
  // render the board
  renderBoard(gameState);
  if (gameState.phase === "Build") renderInventory(app, gameState);
  updateUI(gameState)
  // TODO render piece sidebar

  // render enemies
  renderEnemies(gameState)
  // render projectiles

  return app;
}

export function renderBoard(gameState: GameState): void {

  gameState.grid.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const square = displayGrid[rowIdx][colIdx];
      if (gameState.finalPath?.includes(cell)) {
        square.tint = 0xffff00;
      } else if (cell.type === "path") {
        if (!pathSprites.get(`${colIdx}-${rowIdx}`)) {
          path = new Container()
          const pathSprite = new Sprite({ texture: pathTexture, height: 60, width: 60 })
          pathSprite.position.x = colIdx * 60
          pathSprite.position.y = rowIdx * 60
          pathSprite.eventMode = 'none'
          app.stage.addChild(pathSprite)
          pathSprites.set(`${colIdx}-${rowIdx}`, pathSprite)
        }
      } else if (cell.type === "tower") {
        if (!pathSprites.get(`${colIdx}-${rowIdx}`)) {
          path = new Container()
          const pathSprite = new Sprite({ texture: pathTexture, height: 60, width: 60 })
          pathSprite.position.x = colIdx * 60
          pathSprite.position.y = rowIdx * 60
          pathSprite.eventMode = 'none'
          app.stage.addChild(pathSprite)
          pathSprites.set(`${colIdx}-${rowIdx}`, pathSprite)
        }
        if (!towerSprites.get(`${colIdx}-${rowIdx}`)) {
          tower = new Container()
          const towerSprite = new Sprite({ texture: towerTexture, height: 60, width: 60 })
          towerSprite.position.x = colIdx * 60
          towerSprite.position.y = rowIdx * 60
          towerSprite.eventMode = 'none'
          app.stage.addChild(towerSprite)
          towerSprites.set(`${colIdx}-${rowIdx}`, towerSprite)
        }
      } else if (cell.type === "empty") {
        const towerSprite = towerSprites.get(`${colIdx}-${rowIdx}`)
        if (towerSprite) {
          towerSprite.destroy()
          towerSprites.delete(`${colIdx}-${rowIdx}`)
        }
        const pathSprite = pathSprites.get(`${colIdx}-${rowIdx}`)
        if (pathSprite) {
          pathSprite.destroy()
          pathSprites.delete(`${colIdx}-${rowIdx}`)
        }

      }
    });
  });
}

export function renderEnemies(gameState: GameState) {
  //console.log('renderEnemies called, enemies:', gameState.enemies)
  //console.log('enemySprites Map size:', enemySprites.size)

  gameState.enemies.forEach((enemy) => {
    console.log('Processing enemy:', enemy.id)

    if (!enemySprites.has(enemy.id)) {
      //console.log('Creating new sprite for:', enemy.id)
      const sprite = new Sprite(enemyDummyTexture);
      enemySprites.set(enemy.id, sprite);
      displayEnemy.addChild(sprite);
    }

    const sprite = enemySprites.get(enemy.id)!;
    sprite.x = enemy.currentPosition.x * 60;
    sprite.y = enemy.currentPosition.y * 60;
  });

  // compares sprite cache to what's in current gameState
  const currentEnemyIds = new Set(gameState.enemies.map((e) => e.id));

  enemySprites.forEach((sprite, id) => {
    // if enemy sprite no longer in gameState
    if (!currentEnemyIds.has(id)) {
      sprite.destroy(); // Clean up GPU resources
      enemySprites.delete(id); // remove from Map
    }
  });
}

// write export updateSelectionState() that checks all path cells within gameState grid if changed render different color
// look in gameState for all cells that have: selected = green, highlighted path = yellow,
// so we can update game board
// if neither the cell goes back to what it was before empty = grey, path = brown
