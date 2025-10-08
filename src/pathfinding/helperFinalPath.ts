import type { Cell, Grid } from "../type";
import { getNeighbors, } from "./helperPath";

// check if there exists *some* path to exit, used for highlighting
export function hasPathToExit(grid: Grid, start: Cell, exit: Cell): boolean {
	const stack: Cell[] = [start];
	const visited = new Set<string>();

	while (stack.length > 0) {
		const cell = stack.pop()!;
		const key = `${cell.x},${cell.y}`;
		if (visited.has(key)) continue;
		visited.add(key);

		if (cell.x === exit.x && cell.y === exit.y) return true;

		const neighbors = getNeighbors(grid, cell).filter(
			(n) => n.type === "path"
		);

		for (const n of neighbors) stack.push(n);
	}
	return false;
}
