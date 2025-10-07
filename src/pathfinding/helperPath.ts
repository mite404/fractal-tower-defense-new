import type { Cell, CellType, Grid } from "../type";

export function editGrid(
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
