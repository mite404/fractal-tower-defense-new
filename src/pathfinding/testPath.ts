import type { Grid,} from "../type.ts";
import { editGrid, } from "./helperPath.ts";
import { hasValidPath } from "./validpath.ts";

// To test independently install ts-node locally if you have not:
// 		bun add -D ts-node typescript 
// To run the tests:
// 		bunx ts-node src/pathfinding/testPath.ts


function createTestGrid(): Grid {
	let newGrid: Grid = [];
	for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
		newGrid.push([]);
		for (let colIndex = 0; colIndex <= 9; colIndex++) {
			newGrid = editGrid(newGrid, rowIndex, colIndex, 'empty')
		}
	}
	return newGrid;
}

let testGrid1 = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
	testGrid1 = editGrid(testGrid1, rowIndex, 5, 'path');
}

//printGrid(testGrid1);

hasValidPath(testGrid1);


