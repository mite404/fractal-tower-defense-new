import type { Enemy, PathNode } from "./type";


export function moveEnemyTowardTarget(enemy: Enemy, longestPath: PathNode[]): void {
  const target = enemy.to
  const index = longestPath.findIndex(node => node.x === target.x && node.y === target.y)

  if (target) {
    if (enemy.currentPosition.x < target.x) {
      enemy.currentPosition.x += 1

    }

    if (enemy.currentPosition.y < target.y) {
      enemy.currentPosition.y += 1

    }
    // update to next waypoint
    if (enemy.currentPosition.x == target.x && enemy.currentPosition.y == target.y) {
      enemy.to = longestPath[index + 1]
    }
  }
}
