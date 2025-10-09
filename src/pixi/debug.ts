// dndDebug.ts
import { Application, Container, FederatedPointerEvent, Matrix, Point } from "pixi.js";

const fmt = (n: number) => Math.round(n * 1000) / 1000;
const m2o = (m: Matrix) => ({ a: fmt(m.a), b: fmt(m.b), c: fmt(m.c), d: fmt(m.d), tx: fmt(m.tx), ty: fmt(m.ty) });

/**
 * Logs world + board-local diagnostics for a piece.
 * - board: pass your boardContainer; if you don't have one, use app.stage (but then say so).
 * - CELL: your cell size.
 */
export function logDndState(
  tag: string,
  app: Application,
  piece: Container,
  board: Container,
  CELL: number,
  evt?: FederatedPointerEvent
) {
  // force fresh bounds
  const pieceBoundsW = piece.getBounds(); // world-space AABB
  const pieceLocal = piece.getLocalBounds(); // local AABB (for pivot sanity checks)
  const pieceOriginW = piece.toGlobal(new Point(0, 0)); // world position of piece's (0,0)
  console.log('board.parent?', board.parent?.constructor.name, 'board.worldTransform?', !!board.worldTransform);
  const boardOriginW = board.toGlobal(new Point(0, 0));
  const boardBoundsW = board.getBounds();

  // piece center in world
  const cxW = pieceBoundsW.x + pieceBoundsW.width / 2;
  const cyW = pieceBoundsW.y + pieceBoundsW.height / 2;

  // project into board-local
  const centerB = board.toLocal(new Point(cxW, cyW));
  const originB = board.toLocal(pieceOriginW);

  const pointerW = evt?.global ?? null;
  const pointerB = pointerW ? board.toLocal(pointerW) : null;

  // which grid cell are we “choosing” by center?
  const gx = Math.floor(centerB.x / CELL);
  const gy = Math.floor(centerB.y / CELL);

  // world rect of that grid cell’s top-left and bottom-right
  const cellTLW = board.toGlobal(new Point(gx * CELL, gy * CELL));
  const cellBRW = board.toGlobal(new Point((gx + 1) * CELL, (gy + 1) * CELL));

  // offset from piece origin to its world top-left (bounds)
  const offOriginToTL = {
    dx: fmt(pieceBoundsW.x - pieceOriginW.x),
    dy: fmt(pieceBoundsW.y - pieceOriginW.y),
  };

  // how close are we to cell edges (board-local fractional position)?
  const frac = (v: number) => {
    const f = (v / CELL) % 1;
    return f < 0 ? f + 1 : f;
  };

  console.group(`🧩 ${tag}`);
  console.log("— constants —");
  console.log({ CELL });

  console.log("— transforms —");
  console.log("piece.worldTransform:", m2o(piece.worldTransform));
  console.log("board.worldTransform:", m2o(board.worldTransform));

  console.log("— board (world) —");
  console.log("boardOriginW:", { x: fmt(boardOriginW.x), y: fmt(boardOriginW.y) });
  console.log("boardBoundsW:", {
    x: fmt(boardBoundsW.x), y: fmt(boardBoundsW.y),
    w: fmt(boardBoundsW.width), h: fmt(boardBoundsW.height),
  });

  console.log("— piece (world) —");
  console.log("pieceOriginW (toGlobal(0,0)):", { x: fmt(pieceOriginW.x), y: fmt(pieceOriginW.y) });
  console.log("pieceBoundsW:", {
    x: fmt(pieceBoundsW.x), y: fmt(pieceBoundsW.y),
    w: fmt(pieceBoundsW.width), h: fmt(pieceBoundsW.height),
  });
  console.log("origin→topLeft offset (world):", offOriginToTL);
  console.log("rotation(deg):", fmt((piece.rotation * 180) / Math.PI), "scale:", { x: fmt(piece.scale.x), y: fmt(piece.scale.y) }, "pivot:", { x: fmt(piece.pivot.x), y: fmt(piece.pivot.y) });

  console.log("— projections into board-local —");
  console.log("centerB:", { x: fmt(centerB.x), y: fmt(centerB.y) }, "frac:", { fx: fmt(frac(centerB.x)), fy: fmt(frac(centerB.y)) });
  console.log("originB:", { x: fmt(originB.x), y: fmt(originB.y) });

  if (pointerW && pointerB) {
    console.log("pointerW:", { x: fmt(pointerW.x), y: fmt(pointerW.y) });
    console.log("pointerB:", { x: fmt(pointerB.x), y: fmt(pointerB.y) }, "frac:", { fx: fmt(frac(pointerB.x)), fy: fmt(frac(pointerB.y)) });
  }

  console.log("— chosen grid cell (by center) —");
  console.log("gx,gy:", { gx, gy });
  console.log("cell world TL:", { x: fmt(cellTLW.x), y: fmt(cellTLW.y) }, "BR:", { x: fmt(cellBRW.x), y: fmt(cellBRW.y) });

  // where would we put the piece’s ORIGIN so that its world top-left = cell TL?
  const desiredTopLeftW = cellTLW;
  const desiredOriginW = {
    x: desiredTopLeftW.x - offOriginToTL.dx,
    y: desiredTopLeftW.y - offOriginToTL.dy,
  };
  const desiredOriginParentLocal = piece.parent!.toLocal(new Point(desiredOriginW.x, desiredOriginW.y));
  console.log("— snap preview —");
  console.log("desiredOriginW:", { x: fmt(desiredOriginW.x), y: fmt(desiredOriginW.y) });
  console.log("desiredOrigin in parent local:", { x: fmt(desiredOriginParentLocal.x), y: fmt(desiredOriginParentLocal.y) });

  console.groupEnd();
}
