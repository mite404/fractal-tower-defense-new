import type { Grid,} from "../type.ts";
import { editGrid, printGrid } from "./helperPath.ts";
import { hasValidPath } from "./validpath.ts";

// To test independently
// bun add -D ts-node typescript
// bunx ts-node src/pathfinding/testPath.ts


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

let testGrid = createTestGrid();
//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
	testGrid = editGrid(testGrid, rowIndex, 5, 'path');
}

//printGrid(testGrid);

hasValidPath(testGrid);


