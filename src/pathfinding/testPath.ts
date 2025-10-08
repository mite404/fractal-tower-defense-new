import type { Cell } from "../type.ts";
import { createTestGrid, setCell } from "./helperPath.ts";
import { hasValidPath } from "./validPath.ts";

//bunx ts-node src/pathfinding/testPath.ts

const entrance: Cell = { x: 5, y: 0, type: "path" }; //path is irrelevant 
const exit: Cell = { x: 9, y: 9, type: "path" }; 

console.log(`Testing on entrance: ${JSON.stringify(entrance)}, exit: ${JSON.stringify(exit)}`)

// test 1 – straight vertical path at column 5
let testGrid1 = createTestGrid();
for (let y = 0; y < 10; y++) {
	testGrid1 = setCell(testGrid1, 5, y, "path");
}
hasValidPath(testGrid1, entrance, exit);

// test 2 – missing top cell
let testGrid2 = createTestGrid();
for (let y = 1; y < 10; y++) {
	testGrid2 = setCell(testGrid2, 5, y, "path");
}
hasValidPath(testGrid2, entrance, exit);

// test 3 – missing bottom cell
let testGrid3 = createTestGrid();
for (let y = 0; y < 9; y++) {
	testGrid3 = setCell(testGrid3, 5, y, "path");
}
hasValidPath(testGrid3, entrance, exit);

// test 4 – fully connected path grid
let testGrid4 = createTestGrid();
for (let y = 0; y < 10; y++) {
	for (let x = 0; x < 10; x++) {
		testGrid4 = setCell(testGrid4, x, y, "path");
	}
}
hasValidPath(testGrid4, entrance, exit);

// test 5 – blocked second row
let testGrid5 = createTestGrid();
for (let y = 0; y < 10; y++) {
	for (let x = 0; x < 10; x++) {
		testGrid5 = setCell(testGrid5, x, y, "path");
	}
}
for (let x = 1; x < 10; x++) {
	testGrid5 = setCell(testGrid5, x, 1, "empty");
}
hasValidPath(testGrid5, entrance, exit);

// test 6 – horizontal wall in middle
let testGrid6 = createTestGrid();
for (let y = 0; y < 10; y++) {
	for (let x = 0; x < 10; x++) {
		testGrid6 = setCell(testGrid6, x, y, "path");
	}
}
for (let x = 0; x < 10; x++) {
	testGrid6 = setCell(testGrid6, x, 5, "empty");
}
hasValidPath(testGrid6, entrance, exit);
