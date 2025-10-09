import type { Enemy, Cell } from "./type";


export function moveEnemyTowardTarget(enemy: Enemy, finalPath: Cell[]): void {
  const target = enemy.to
  const index = finalPath.findIndex(node => node.x === target.x && node.y === target.y)
  console.log('Current index:', index, 'Target:', target, 'Next target:', finalPath[index + 1])

  if (!target)
    throw new Error('Enemy sprite should be destroyed')

  if (!target.x || !target.y) {
    throw new Error('Enemy has no valid target cell')
  }

  // add check for 

  if (target) {
    // Move right
    if (enemy.currentPosition.x < target.x) enemy.currentPosition.x += 1

    // Move down
    if (enemy.currentPosition.y < target.y) enemy.currentPosition.y += 1

    // Move left
    if (enemy.currentPosition.y > target.x) enemy.currentPosition.x -= 1

    // Move up
    if (enemy.currentPosition.y > target.y) enemy.currentPosition.y -= 1


    // update to next waypoint
    if (enemy.currentPosition.x == target.x && enemy.currentPosition.y == target.y) {
      if (index + 1 < finalPath.length) {
        enemy.to = finalPath[index + 1]
      } else {
        enemy.to = null
      }
    }

  }
}
