import type { Grid, Cell } from "../type";
import type { CellType } from "../type";

function editGrid(
	grid: Grid,
	xCoordinate: number,
	yCoordinate: number,
	cellType: CellType
): Grid {
	const newGrid = structuredClone(grid);
	const newCell: Cell = {
		x: xCoordinate,
		y: yCoordinate,
		type: cellType,
	};
	newGrid[xCoordinate][yCoordinate] = newCell;

	return newGrid;
}

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

function printGrid(grid: Grid) {
	for (const row of grid) {
		console.log(row.map((c) => (c.type === "path" ? "🟩" : "⬜")).join(""));
	}
}



let testGrid = createTestGrid();

//make path down colIndex 5
for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
	testGrid = editGrid(testGrid, rowIndex, 5, 'path');
}

printGrid(testGrid);

//To test independently
// bun add -D ts-node typescript
// bunx ts-node src/pathfinding/testPath.ts
