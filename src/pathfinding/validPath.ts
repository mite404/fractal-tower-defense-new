import type { Cell, Grid,  } from "../type.ts";
import { printGrid } from "./helperPath.ts";


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


export function hasValidPath(grid : Grid, entrance: Cell, exit: Cell): boolean {
	console.log("Validating Path In:")
	printGrid(grid);

	let visted = new Set<Cell>();

	function dfs(node : Cell): boolean {
		visted.add(node) //does not add duplicates
		

		//get neighbors
		//call dfs on neighbers

	}
}