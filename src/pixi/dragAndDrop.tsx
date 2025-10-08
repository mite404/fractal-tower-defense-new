import { Container, type Application } from "pixi.js";

export function setupDragAndDrop(app: Application, pieceContainer: Container): void {
    let isDragging = false
    let dragOffset = { x: 0, y: 0 };
    let originalPosition = { x: 0, y: 0 };
    const cellSize = 60
    const originalParent = pieceContainer.parent

    pieceContainer.on('pointerdown', (event) => {
        isDragging = true

        originalPosition.x = pieceContainer.x
        originalPosition.y = pieceContainer.y

        const stagePos = event.getLocalPosition(app.stage)

        dragOffset.x = pieceContainer.x - stagePos.x
        dragOffset.y = pieceContainer.y - stagePos.y

        pieceContainer.alpha = .7


        originalParent?.removeChild(pieceContainer)
        app.stage.addChild(pieceContainer)
    })

    pieceContainer.on('globalpointermove', (event) => {
        if (isDragging) {
            const stagePos = event.getLocalPosition(app.stage)
            pieceContainer.x = stagePos.x + dragOffset.x
            pieceContainer.y = stagePos.y + dragOffset.y
        }
    })

    function handlePointerUp(): void {
        if (isDragging) {
            const snapped = snapToGrid(pieceContainer.x, pieceContainer.y, cellSize)

            const gridPos = pixelToGrid(snapped.x, snapped.y, cellSize)


            //TODO valid position checking
            if (isValidBoardPosition(gridPos.x, gridPos.y)) {
                pieceContainer.x = snapped.x
                pieceContainer.y = snapped.y

                // TODO call back to actually update GameState
            } else {
                app.stage.removeChild(pieceContainer)
                originalParent!.addChild(pieceContainer)
                pieceContainer.x = originalPosition.x
                pieceContainer.y = originalPosition.y
            }

            pieceContainer.alpha = 1
            isDragging = false
        }
    }

    pieceContainer.on('pointerup', handlePointerUp)
    pieceContainer.on('pointerupoutside', handlePointerUp)

    function pixelToGrid(pixelX: number, pixelY: number, cellSize: number = 60): { x: number; y: number } {
        return {
            x: Math.floor(pixelX / cellSize),
            y: Math.floor(pixelY / cellSize)
        };
    }


    function snapToGrid(x: number, y: number, cellsize: number): { x: number, y: number } {
        const gridX = Math.round(x / cellsize)
        const gridY = Math.round(y / cellsize)

        return { x: gridX * cellSize, y: gridY * cellSize }
    }

    function isValidBoardPosition(gridX: number, gridY: number): boolean {
        return gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 10
    }
}