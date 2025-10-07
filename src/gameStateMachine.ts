import { getInputs } from "./input";
import type { GameState } from "./type";
import type { CellClick } from "./input";
import type { InputEvent } from "./input";

export function loop(gameState: GameState): GameState {
  const inputs = getInputs()
  if (inputs.length > 0) {
    console.log("got inputs!", inputs)
  }
  const newGameState = updateGridWithClicks(inputs, gameState)
  newGameState.wave += 1
  return newGameState
}

function updateGridWithClicks(inputs: InputEvent[], gameState: GameState): GameState {
  const newGameState = structuredClone(gameState)
  for (const event of inputs) {
    if (event.inputType === 'cellClick') {
      const cellClickEvent = event as CellClick
      newGameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type = 'path'
      console.log(`updated [${cellClickEvent.cellX}][${cellClickEvent.cellY}]:`,
        newGameState.grid[cellClickEvent.cellX][cellClickEvent.cellY].type)
    }
  }

  return newGameState
}