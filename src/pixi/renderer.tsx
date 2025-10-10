import {
	Application,
	Container,
	Sprite,
	Graphics
} from "pixi.js";
import { type GameState, createEmptyGrid } from "../type";
import { enemyDummyTexture, bgTileTexture, tower01Texture } from "./textures";
import { loadTextures } from "./textures.ts";
import { renderInventory } from "./inventoryRender.tsx";
import { addInput } from "../input.ts";
import { initUI, updateUI } from "./renderUI.ts";

let app: Application;
let displayGrid: Graphics[][];
let displayBgTileSprite: Sprite;
let displayEnemy: Container;
export let board: Container;
const enemySprites = new Map<string, Sprite>();
const towerSprites = new Map<string, Sprite>()
let displayTower: Container

export async function initApp(canvas: HTMLCanvasElement): Promise<Application> {
	// TODO: pull out any init stuff from the render function and put it in here.

	// also: call this function over in the GameCanvas whenever it mounts (via useEffect)
	// Create a new application
	app = new Application();

	// Initialize the application
	await app.init({
		background: "#4C4C4C",
		canvas,
		resizeTo: window,
	});

	await loadTextures();

  await initUI(app)

	// Create and add a container to the stage
	board = new Container();
	displayEnemy = new Container();
	displayTower = new Container();

	// Create the background tileset
	displayBgTileSprite = new Sprite(bgTileTexture);
	displayBgTileSprite.width = 600;
	displayBgTileSprite.height = 600;
	displayBgTileSprite.x = 0;
	displayBgTileSprite.y = 0;

	app.stage.addChild(displayBgTileSprite, board, displayEnemy, displayTower);
	// app.stage.addChild(drawGrid);

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
					cellX: colIndex,
					cellY: rowIndex,
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
	// render the board
	renderBoard(gameState);
	if (gameState.phase === "Build") renderInventory(app, gameState);
	// TODO render piece sidebar

	renderTowers(gameState)
	renderEnemies(gameState)
	// render projectiles

	return app;
}

export function renderBoard(gameState: GameState): void {
	gameState.grid.forEach((row, rowIdx) => {
		row.forEach((cell, colIdx) => {
			const square = displayGrid[rowIdx][colIdx];
			if (cell.type === "path") {
				square.tint = 0xff0000;
			} else if (cell.type === "tower") {
				square.tint = 0x00fff;
			} else if (cell.type === "empty") {
				square.tint = 0xffffff;
			}
		});
	});
}

export function renderEnemies(gameState: GameState) {
	//console.log('renderEnemies called, enemies:', gameState.enemies)
	//console.log('enemySprites Map size:', enemySprites.size)

	gameState.enemies.forEach((enemy) => {
		//console.log('Processing enemy:', enemy.id)

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
			sprite.destroy(); // clean up GPU resources
			enemySprites.delete(id); // remove from Map
		}
	});
}

export function renderTowers(gameState: GameState) {
	gameState.towers.forEach((tower) => {
		// check if sprite already exists
		if (!towerSprites.has(tower.id)) {
			// create sprite once
			const sprite = new Sprite(tower01Texture)

			towerSprites.set(tower.id, sprite)
			displayTower.addChild(sprite)
		}
		// update existing sprite position
		const sprite = towerSprites.get(tower.id)!
		sprite.x = tower.position.x * 60
		sprite.y = tower.position.y * 60

		console.log('Positioning tower at:', sprite.x, sprite.y)
	})

	// compares sprite cache to what's in current gameState
	const currentTowerIds = new Set(gameState.towers.map(tower => tower.id))

	// despawn destroyed towers
	towerSprites.forEach((sprite, id) => {
		// if tower sprite no longer in gameState
		if (!currentTowerIds.has(id)) {
			sprite.destroy()  // clean up GPU resources
			towerSprites.delete(id)  // remove from Map
		}
	})
}

// write export updateSelectionState() that checks all path cells within gameState grid if changed render different color
// look in gameState for all cells that have: selected = green, highlighted path = yellow,
// so we can update game board
// if neither the cell goes back to what it was before empty = grey, path = brown
