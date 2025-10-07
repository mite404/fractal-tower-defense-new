import type { Grid, Cell } from "../type";



function createTestGrid() : Grid {
	const newGrid: Grid = [];
	for(let rowIndex = 0; rowIndex <= 9; rowIndex++) {
		newGrid.push([])
		for(let colIndex = 0; colIndex <= 9; colIndex++) {
			const newCell : Cell = {
				x: rowIndex,
				y: colIndex,
				type: 'path',
			}
			newGrid[rowIndex][colIndex] = newCell;
		}
	}
	return newGrid;
}

function printGrid(grid: Grid) {
  for (const row of grid) {
    console.log(row.map(c => (c.type === 'path' ? '🟩' : '⬜')).join(''));
  }
}


const testGrid = createTestGrid();
printGrid(testGrid);

//To test independently 
// bun add -D ts-node typescript 
// bunx ts-node src/pathfinding/testPath.ts

