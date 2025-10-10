import type { Tower,Enemy } from "../type";

function findTargetinRange(tower:Tower, enemies:Enemy) {
    const rangeSq = tower.range * tower.range
    return enemies.find(enemy=> {
        const dx = enemy.position.x - tower.position.x
        const dy = enemy.position.y = tower.position.y
        return dx*dx + dy*dy <= rangeSq
    })

}