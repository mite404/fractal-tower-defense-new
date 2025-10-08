import type { Cell } from "../type.ts";
import { createTestGrid, setCell } from "./helperPath.ts";
import { hasValidPath } from "./validpath.ts";

// To test independently install ts-node locally if you have not:
// 		bun add -D ts-node typescript
// To run the tests:
// 		bunx ts-node src/pathfinding/testPath.ts


const entrance: Cell = {
	x: 0,
	y: 0,
	type: "empty",
};

const exit: Cell = {
	x: 9,
	y: 9,
	type: "empty",
};

let testGrid1 = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
	testGrid1 = setCell(testGrid1, rowIndex, 5, "path");
}

hasValidPath(testGrid1, entrance, exit);

let testGrid2 = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 1; rowIndex <= 9; rowIndex++) {
	testGrid2 = setCell(testGrid2, rowIndex, 5, "path");
}

hasValidPath(testGrid2, entrance, exit);

let testGrid3 = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 8; rowIndex++) {
	testGrid3 = setCell(testGrid3, rowIndex, 5, "path");
}

hasValidPath(testGrid3, entrance, exit);

let testGrid4 = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
	for (let colIndex = 0; colIndex <= 9; colIndex++) {
		testGrid4 = setCell(testGrid4, rowIndex, colIndex, "path");
	}
}

hasValidPath(testGrid4, entrance, exit);

let testGrid5 = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
	for (let colIndex = 0; colIndex <= 9; colIndex++) {
		testGrid5 = setCell(testGrid5, rowIndex, colIndex, "path");
	}
}

for (let colIndex = 1; colIndex <= 9; colIndex++) {
	testGrid5 = setCell(testGrid5, 1, colIndex, "empty");
}


hasValidPath(testGrid5, entrance, exit);


let testGrid6 = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
	for (let colIndex = 0; colIndex <= 9; colIndex++) {
		testGrid6 = setCell(testGrid6, rowIndex, colIndex, "path");
	}
}

for (let colIndex = 0; colIndex <= 9; colIndex++) {
	testGrid6 = setCell(testGrid6, 5, colIndex, "empty");
}


hasValidPath(testGrid6, entrance, exit);
