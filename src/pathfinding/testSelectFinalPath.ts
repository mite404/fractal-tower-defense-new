



//bunx ts-node src/pathfinding/testSelectFinalPath.ts

import type { GameState, Grid, Cell } from "../type.ts";
import { initialPlayer } from "../type.ts";
import {
  startFinalPathSelection,
  finalPathCellClick,
  submitFinalPath,
} from "./selectFinalPath.ts";
import { createTestGrid, setCell } from "./helperPath.ts";

// --- Helper to create a fully typed GameState ---
function createGameState(grid: Grid, spawn: Cell, exit: Cell): GameState {
  return {
    player: { ...initialPlayer },
    phase: "Build",
    grid,
    spawn,
    exit,
    wave: 1,
    enemies: [],
    towers: [],
    pieces: [],
    finalPath: [],
    selectingFinalPath: false,
    validFinalPath: false,
    winlose: "Playing",
  };
}

// --- Helper to click only highlighted cells in sequence ---
function clickPath(state: GameState, path: Cell[]): GameState {
  for (const cell of path) {
    if (cell.selectionState !== "highlighted") {
      console.log(`Cell not highlighted, skipping click: (${cell.x},${cell.y})`);
      continue;
    }
    const result = finalPathCellClick(state, cell);
    if (!result) {
      console.log(`Click failed at cell (${cell.x},${cell.y})`);
      break;
    }
    state = result;
  }
  return state;
}

// --- TEST CASES ---

// 1. Straight vertical path
console.log("=== Test 1: Straight vertical path ===");
let grid1 = createTestGrid();
for (let y = 0; y < 10; y++) grid1 = setCell(grid1, 5, y, "path");
let spawn: Cell = { x: 5, y: 0, type: "spawn" };
let exit: Cell = { x: 5, y: 9, type: "exit" };
let state: GameState | null = createGameState(grid1, spawn, exit);

state = startFinalPathSelection(state);
if (state) {
  const pathCells: Cell[] = [];
  // Only need to click the first highlighted neighbor; auto-advance handles the rest
  pathCells.push(state.grid[1][5]);
  state = clickPath(state, pathCells);
  state = submitFinalPath(state)!;
  console.log("Valid path reached:", state.validFinalPath);
} else {
  console.log("Failed to start path selection.");
}

// 2. Missing top cell (spawn not connected)
console.log("\n=== Test 2: Missing top cell ===");
let grid2 = createTestGrid();
for (let y = 1; y < 10; y++) grid2 = setCell(grid2, 5, y, "path");
spawn = { x: 5, y: 0, type: "spawn" };
exit = { x: 5, y: 9, type: "exit" };
let state2: GameState | null = createGameState(grid2, spawn, exit);

state2 = startFinalPathSelection(state2);
console.log("Start selection should fail:", state2); // expect null

// 3. Blocked row in middle
console.log("\n=== Test 3: Blocked row ===");
let grid3 = createTestGrid();
for (let y = 0; y < 10; y++)
  for (let x = 0; x < 10; x++) grid3 = setCell(grid3, x, y, "path");
for (let x = 0; x < 10; x++) grid3 = setCell(grid3, x, 5, "empty"); // block row
spawn = { x: 5, y: 0, type: "spawn" };
exit = { x: 5, y: 9, type: "exit" };
state = createGameState(grid3, spawn, exit);

state = startFinalPathSelection(state);
if (state) {
  const pathCells: Cell[] = [];
  pathCells.push(state.grid[1][5]); // first highlighted neighbor
  state = clickPath(state, pathCells);
  console.log("Blocked path validFinalPath:", state.validFinalPath); // expect false
} else {
  console.log("Start selection failed (blocked row).");
}

// 4. Single cell path (spawn is exit)
console.log("\n=== Test 4: Spawn is exit ===");
const grid4 = createTestGrid();
spawn = { x: 0, y: 0, type: "spawn" };
exit = { x: 0, y: 0, type: "exit" };
state = createGameState(grid4, spawn, exit);

state = startFinalPathSelection(state);
if (state) {
  console.log("Immediate validFinalPath (spawn=exit):", state.validFinalPath); // expect true
} else {
  console.log("Start selection failed for spawn=exit.");
}

// 5. Branching path
console.log("\n=== Test 5: Branching path ===");
let grid5 = createTestGrid();
for (let y = 0; y < 3; y++) grid5 = setCell(grid5, 1, y, "path"); // vertical
grid5 = setCell(grid5, 0, 2, "path"); // branch left
grid5 = setCell(grid5, 2, 2, "path"); // branch right
spawn = { x: 1, y: 0, type: "spawn" };
exit = { x: 0, y: 2, type: "exit" };
state = createGameState(grid5, spawn, exit);

state = startFinalPathSelection(state);
if (state) {
  // Only click the first highlighted neighbor (1,1)
  const firstStep = state.grid[1][1];
  state = finalPathCellClick(state, firstStep);

  if (state) {
    // Now the auto-advance should have stopped at the branch
    // Pick the branch manually if highlighted
    const nextCell = state.grid[2][0]; // left branch
    if (nextCell.selectionState === "highlighted") {
      state = finalPathCellClick(state, nextCell);
    }
    if (state) {
      state = submitFinalPath(state)!;
      console.log("Branching path validFinalPath:", state.validFinalPath); // expect true
    } else {
      console.log("Could not complete branch path.");
    }
  } else {
    console.log("Auto-advance failed after first step.");
  }
} else {
  console.log("Start selection failed for branching path.");
}


// 6. Edge case: no path at all
console.log("\n=== Test 6: No path ===");
const grid6 = createTestGrid();
spawn = { x: 0, y: 0, type: "spawn" };
exit = { x: 9, y: 9, type: "exit" };
let state6: GameState | null = createGameState(grid6, spawn, exit);

state6 = startFinalPathSelection(state6);
console.log("No path possible:", state6); // expect null


// --- 7. Multiple branching paths ---
console.log("\n=== Test 7: Multiple branching paths ===");

let grid7 = createTestGrid();

// Create vertical stem
for (let y = 0; y < 3; y++) grid7 = setCell(grid7, 2, y, "path");

// Branch left and right at y = 2
grid7 = setCell(grid7, 1, 2, "path"); // left branch
grid7 = setCell(grid7, 3, 2, "path"); // right branch

// Extend both branches to exit
grid7 = setCell(grid7, 1, 3, "path");
grid7 = setCell(grid7, 3, 3, "path");

const spawn7: Cell = { x: 2, y: 0, type: "spawn" };
const exit7: Cell = { x: 1, y: 3, type: "exit" }; // choose left branch as exit

let state7: GameState | null = createGameState(grid7, spawn7, exit7);

// Start path selection
state7 = startFinalPathSelection(state7);
if (!state7) {
  console.log("Failed to start path selection on branching grid");
} else {
  // Path stem
  const pathStem: Cell[] = [state7.grid[1][2], state7.grid[2][2]]; 
  state7 = clickPath(state7, pathStem);

  // Now branch left
  const leftBranch: Cell[] = [state7.grid[2][1], state7.grid[3][1]];
  state7 = clickPath(state7, leftBranch);

  // Submit
  state7 = submitFinalPath(state7)!;
  console.log("Multiple branching paths validFinalPath:", state7.validFinalPath);

  // Check that only left branch cells were selected
  console.log("Final path coordinates:", state7.finalPath.map(c => `(${c.x},${c.y})`));
}



console.log("\n=== All tests completed ===");
