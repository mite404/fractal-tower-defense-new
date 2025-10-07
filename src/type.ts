export type Player = {
    currentHealth: number;
    maxHealth: number;
    armor?: number;
    gold: number;
    allPieces: Piece[]; // all pieces in player library
    levelPieces: Piece[]; // pieces given to player this wave
}

export type CellType= "empty" | "path" | 'tower' | 'blocked'

export type Cell = {
    x:number;
    y:number;
    type: CellType;
    occupiedBy?: string;
    terrain?: string //potential different effects later
}

export type Grid = Cell[][]

export type Piece = {
    id: string;
    shape: CellType[][];
    isPlaced: boolean;
    rotation: 0 | 90| 180 | 270;
    flipped: boolean;
    tower: Tower;
}

export type PlacedPiece = {
    id: string;
    InitialPieceId: string; // which initial piece was placed
    position: {x: number; y: number} //top left corner of piece
}

export type Enemy = {
    id: string;
    type: string;
    currentHealth: number;
    maxHealth: number;
    armor?:number;
    speed: number; 
    to: PathNode;
    currentPosition: {x: number, y: number}
    gold: number;
}

export type PathNode = {
    id: string;
    x: number;
    y: number
} 

export type Tower = {
    id: string;
    type: string
    pieceId: string;
    position: {x: number, y: number}
    damage: number
    armorDmg?: number
    range:number
    fireRate:number
    cooldown:number
    targetId?:string
    buy?:number
    sell?:number
}

export type Phase = 'Build' | 'Defense' | 'End' | 'Shop'

export type GameState = {
    player:Player;
    phase: Phase;
    grid: Grid;
    wave: number;
    enemies: Enemy[];
    towers: Tower[];
    pieces: PlacedPiece[]
    winlose: 'Playing' | 'Win' | 'Lose'
    validPath: Boolean
    path: PathNode[]

}

export const initialPlayer : Player = {
    currentHealth: 100,
    maxHealth: 100,
    armor: 0,
    gold: 100,
    allPieces: [], 
    levelPieces: []
}

function createEmptyGrid(): Grid {
  return Array.from({ length: 10 }, (_, y) =>
    Array.from({ length: 10 }, (_, x) => ({
      x,
      y,
      type: 'empty' as CellType
    }))
  );
}

export const initialGameState : GameState = {
    player: initialPlayer,
    phase: 'Build',
    grid: createEmptyGrid(),
    wave: 1,
    enemies: [],
    towers: [],
    pieces: [],
    winlose: 'Playing',
    validPath: false,
    path: []
}
