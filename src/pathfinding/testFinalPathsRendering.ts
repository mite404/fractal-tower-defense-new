import {
	type GameState,
	type Cell,
	initialPlayer,
	type Grid,
} from "../type.ts";
import { createTestGrid, setCell, printGrid } from "./helperPath.ts";

//bunx ts-node src/pathfinding/testFinalPathsRendering.ts
export function createEmptyGameState(
	grid: Grid,
	spawn: Cell,
	exit: Cell
): GameState {
	return {
		player: { ...initialPlayer },
		phase: "InitiateFinalPath",
		grid,
		spawn,
		exit,
		wave: 1,
		enemies: [],
		towers: [],
		pieces: [],
		finalPath: [],
		selectingFinalPath: false,
		validFinalPath: false,
		winlose: "Playing",
	};
}

const initialGrid = createTestGrid();

const spawn1: Cell = { x: 5, y: 0, type: "spawn" };
const exit1: Cell = { x: 5, y: 9, type: "exit" };

const spawn2: Cell = { x: 0, y: 0, type: "spawn" };

// ------- 1 -------
let testGrid1 = initialGrid;
for (let y = 0; y < 10; y++) testGrid1 = setCell(testGrid1, 5, y, "path");
const testState1: GameState = createEmptyGameState(testGrid1, spawn1, exit1);

//-------- 2--------
let testGrid2 = testGrid1;
for (let y = 0; y < 10; y++) testGrid2 = setCell(testGrid2, 4, y, "path");
const testState2: GameState = createEmptyGameState(testGrid2, spawn1, exit1);

//-------- 3--------
let testGrid3 = testGrid1;
for (let x = 0; x < 10; x++) testGrid3 = setCell(testGrid3, x, 3, "path");
const testState3: GameState = createEmptyGameState(testGrid3, spawn1, exit1);

//-------- 4--------
let testGrid4 = testGrid3;
for (let x = 0; x < 10; x++) testGrid4 = setCell(testGrid4, x, 7, "path");
for (let y = 0; y < 10; y++) testGrid4 = setCell(testGrid4, 2, y, "path");
for (let y = 0; y < 10; y++) testGrid4 = setCell(testGrid4, 8, y, "path");
const testState4: GameState = createEmptyGameState(testGrid4, spawn1, exit1);

//testState5 SHOULD fail
const testGrid5 = testGrid4;

const testState5: GameState = createEmptyGameState(testGrid5, spawn2, exit1);

//testState5 SHOULD fail
export const testFinalPathGameStates: GameState[] = [
	testState1,
	testState2,
	testState3,
	testState4,
	testState5,
];

console.log("Creating final path test states");
testFinalPathGameStates.forEach((state, i) => {
	//console.log(`====== Grid ${i + 1} ======`);
});
printGrid(
	testFinalPathGameStates[3].grid,
	testFinalPathGameStates[3].spawn,
	testFinalPathGameStates[3].exit
);
console.log(testFinalPathGameStates[3].grid)
