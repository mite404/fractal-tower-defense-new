import { moveEnemyTowardTarget } from "./enemyMovement";
import type { CellClick, InputEvent, MouseUp, PiecePickedUp } from "./input";
import {
	type GameState,
	createEmptyGrid,
	initialPlayer,
	type Cell,
} from "./type";
import { defaultTower } from "./types/pieces";
import { placePiece } from "./gameEngine/gameLogic";


// export type Cell = {
//   x: number | null; //col horizontal
//   y: number | null; //row vertical
//   // Grid[y][x] refers to the correct cell
//   type: CellType;
//   selectionState?: CellSelectionState; //used during final path selection
//   occupiedBy?: string;
//   terrain?: string //potential different effects later
// }

// this will need to be translated somehow to work w/ path logic of Type Cell
const mockPath: Cell[] = [
	{ type: "path", x: 3, y: 0 },
	{ type: "path", x: 4, y: 3 },
	{ type: "path", x: 5, y: 3 },
	{ type: "path", x: 6, y: 4 },
	{ type: "path", x: 6, y: 5 },
	{ type: "path", x: 6, y: 3 },
	{ type: "path", x: 6, y: 6 },
	{ type: "path", x: 7, y: 6 },
	{ type: "path", x: 8, y: 6 },
	{ type: "path", x: 3, y: 9 },
];

export const initialGameState: GameState = {
	player: initialPlayer,
	phase: "Build",
	grid: createEmptyGrid(),
	wave: 0,
	enemies: [
		{
			id: "enemy-1",
			type: "basic",
			currentHealth: 100,
			maxHealth: 100,
			speed: 1, // cells per second
			to: mockPath[1],
			currentPosition: mockPath[0],
			gold: 20,
		},
	],
	towers: [],
	pieces: [],
	longestPath: [],
	validPath: false,
	winlose: "Playing",
	time: 0,
};

export function loop(inputs: InputEvent[], gameState: GameState): GameState {
	const newGameState = structuredClone(gameState);
	if (gameState.phase === "Build") {
		buildPhase(inputs, newGameState);
	}
	if (gameState.phase === "ConfirmPath") {
		//console.log("Confirm Path Phase");
		//gameState = testFinalPathGameStates[5];
	}

	//FIXME Everything below here should not be here. Needs to be moved.
	// set wave state
	gameState.wave += 1;

	// Safety check before accessing enemy
	if (newGameState.wave % 30 === 0 && newGameState.enemies.length > 0) {
		const enemy = newGameState.enemies[0];
		const enemyCellCol = enemy.currentPosition.x;
		const enemyCellRow = enemy.currentPosition.y;

		moveEnemyTowardTarget(newGameState.enemies[0], mockPath);
		//console.log('Enemy moved to cell:', enemyCellCol, enemyCellRow)
	}

	return newGameState;
}

function buildPhase(inputs: InputEvent[], gameState: GameState) {
	inputs.forEach((input) => {
		if (input.inputType == "cellClick") {
			updateGridWithClicks(gameState, input);
		} else if (input.inputType == "piecePickedUp") {
			handlePiecePickedUp(gameState, input);
		} else if (input.inputType == "mouseup") {
			handleMouseUp(input, gameState);
		} else {
			throw new Error(
				"WHAT TYPE IS THIS??? NOT HANDLED!!! BLAME YOUR TEAMMATES!!"
			);
		}
	});
}

function handleMouseUp(event: MouseUp, gameState: GameState) {
  console.log('attempting to drop')
	const pickedUpId = gameState.player.piecePickedUp;
	if (!pickedUpId) {
		return;
	}

	if (event.gridCoordinates) {
		const piece = gameState.player.hand.find((p) => p.id == pickedUpId);
		if (!piece) {
			throw new Error(
				"picked up non-existent piece??? YELL AT TEAMMATES"
			);
		}
		// TODO canPlacePiece
		placePiece(
			gameState,
			piece,
			event.gridCoordinates.x,
			event.gridCoordinates.y
		);
		gameState.player.piecePickedUp = null;
	}
}

function updateGridWithClicks(
	gameState: GameState,
	cellClickEvent: CellClick
): void {
	if (
		gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type ==
		"path"
	) {
		gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type =
			"tower";
		const newTower = defaultTower(`test-${Math.random() * 1000}`);
		newTower.position = {
			x: cellClickEvent.cellX,
			y: cellClickEvent.cellY,
		};
		gameState.towers.push(newTower);
		console.log("create tower");
	} else if (
		gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type ==
		"empty"
	) {
		gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type =
			"path";
		console.log("create path");
	} else if (
		gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type ==
		"tower"
	) {
		gameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type =
			"empty";
		console.log("reset to empty");
	}
}

function handlePiecePickedUp(gameState: GameState, input: PiecePickedUp) {
	if (gameState.player.piecePickedUp) {
		console.log(
			"trying to piece up a piece while already having one in hand!",
			input
		);
		return;
	}
	gameState.player.piecePickedUp = input.pieceId;
}
