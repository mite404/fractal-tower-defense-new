import type { Cell, CellType, Grid } from "../type";

export function insertCell(
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

export function printGrid(grid: Grid) {
	for (const row of grid) {
		console.log(row.map((c) => (c.type === "path" ? "🟩" : "⬜")).join(""));
	}
}

function isValidCoord(x: number, y: number, grid: Grid): boolean {
  return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
}

export function getNeighbors(grid: Grid, cell: Cell): Cell[] {
  const neighbors: Cell[] = [];
  const deltas = [
    [-1, 0], // left
    [1, 0],  // right
    [0, -1], // up
    [0, 1],  // down
  ];

  for (const [dx, dy] of deltas) {
    const nx = cell.x + dx;
    const ny = cell.y + dy;
    if (isValidCoord(nx, ny, grid)) {
      neighbors.push(grid[nx][ny]);
    }
  }

  return neighbors;
}
