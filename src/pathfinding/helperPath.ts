import type { Cell, CellType, Grid } from "../type";

export function setCell(
	grid: Grid,
	x: number,
	y: number,
	type: CellType
): Grid {
	if (x == null || y == null)
		throw new Error(`Invalid coordinates passed to setCell: (${x},${y})`);

	if (!grid[y]) throw new Error(`Row ${y} out of bounds`);
	if (!grid[y][x]) throw new Error(`Column ${x} out of bounds`);

	const newGrid = structuredClone(grid);
	const newCell: Cell = { x, y, type };
	newGrid[y][x] = newCell;

	return newGrid;
}

export function createTestGrid(): Grid {
	const grid: Grid = [];
	for (let y = 0; y < 10; y++) {
		const row: Cell[] = [];
		for (let x = 0; x < 10; x++) {
			row.push({ x, y, type: "empty" });
		}
		grid.push(row);
	}
	return grid;
}

export function printGrid(grid: Grid) {
	for (const row of grid) {
		console.log(row.map((c) => (c.type === "path" ? "🟩" : "⬜")).join(""));
	}
}

function isValidCoord(x: number, y: number, grid: Grid): boolean {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

export function getNeighbors(grid: Grid, cell: Cell): Cell[] {
  if (cell.x == null || cell.y == null)
    throw new Error(`Cell has null coords: (${cell.x}, ${cell.y})`);

  const deltas = [
    [0, -1], // up
    [0, 1],  // down
    [-1, 0], // left
    [1, 0],  // right
  ];

  const neighbors: Cell[] = [];

  for (const [dx, dy] of deltas) {
    const nx = cell.x + dx;
    const ny = cell.y + dy;
    if (isValidCoord(nx, ny, grid)) {
      neighbors.push(grid[ny][nx]);
    }
  }

  return neighbors;
}

