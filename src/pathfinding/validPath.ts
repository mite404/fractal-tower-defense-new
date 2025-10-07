import type { Cell, Grid } from "../type.ts";
import { createTestGrid, getNeighbors, printGrid } from "./helperPath.ts";

/*
DFS Pathfinding :

- The grid is treated as a graph where each 'path' cell is a node.
- Edges exist between nodes that are directly adjacent (up/down/left/right).
- The search starts at the entrance cell (root) and aims to reach the exit cell (goal).

Algorithm (Depth-First Search with Backtracking):
1. Start at the entrance and mark the current cell as visited.
2. Recursively explore each unvisited neighboring 'path' cell.
3. If a neighbor is the exit, return success (valid path found).
4. If a dead end is reached (all neighbors visited or not a 'path'), backtrack to the previous cell.
5. If the recursion fully unwinds to the entrance without finding the exit, no valid path exists.

Notes:
- Visited tracking prevents cycles and infinite loops.
- DFS explores one path deeply before checking other branches.
- This setup also naturally supports extension to finding the longest path later via backtracking.
*/

export function hasValidPath(grid: Grid, entrance: Cell, exit: Cell): boolean {
	console.log("Validating Path In:");
	printGrid(grid);

	const entranceCell = grid[entrance.x][entrance.y];
	const exitCell = grid[exit.x][exit.y];

	if (entranceCell.type !== "path" || exitCell.type !== "path") {
		console.log("Entrance or exit is not a path cell.");
		return false;
	}

	const visited = new Set<string>(); //string that can be compared for uniqueness
	const path: Cell[] = []; // track current path for debugging

	function dfs(node: Cell): boolean {
		path.push(node);
		visited.add(`${node.x},${node.y}`);

		// DEBUGGING
		// console.log(
		// 	`Visiting: (${node.x},${node.y}) | Current path: ${path
		// 		.map((c) => `(${c.x},${c.y})`)
		// 		.join(" -> ")}`
		// );

		if (node.x === exit.x && node.y === exit.y) {
			console.log("Exit reached! Valid path found:");
			console.log(path.map((c) => `(${c.x},${c.y})`).join(" -> "));

			const validPathGrid = createTestGrid();
			//make path down colIndex 5

			for (const coord of path) {
				validPathGrid[coord.x][coord.y] = { ...coord, type: "path" };
			}

			printGrid(validPathGrid)

			return true;
		}

		for (const neighbor of getNeighbors(grid, node)) {
			if (
				neighbor.type === "path" &&
				!visited.has(`${neighbor.x},${neighbor.y}`)
			) {
				if (dfs(neighbor)) return true; //recurse through neighbors looking for exit
			}
		}

		//deadend
		path.pop();
		return false;
	}

	return dfs(entrance);
}
