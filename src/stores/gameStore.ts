import { create } from 'zustand';
import type { Cell } from '../types/gameBoard.types';

interface GameState {
  gameBoard: Cell[][];
  initializeBoard: () => void;
  placeTower: (row: number, col: number, roatation: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameBoard: Array(10).fill(null).map(() => Array(10).fill(null)),

  initializeBoard: () => {
    set({ gameBoard: Array(10).fill(null).map(() => Array(10).fill(null)) })
  },

  placeTower: (row, col, rotation) => {
    set((State) => {
      const newBoard = State.gameBoard.map(row => [...row])
      newBoard[row][col] = { type: 'tower', rotation }
      return { gameBoard: newBoard }
    })
  }
}))