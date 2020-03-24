import {Path, Point} from "paper";

interface IMaskParam {
  tileRatio: number;
  topTab: number;
  rightTab: number;
  bottomTab: number;
  leftTab: number;
  tileWidth: number;
}

const row1 = [0, 0, 35, 15, 37, 5];
const row2 = [37, 5, 40, 0, 38, -5];
const row3 = [38, -5, 20, -20, 50, -20];
const row4 = [50, -20, 80, -20, 62, -5];
const row5 = [62, -5, 60, 0, 63, 5];
const row6 = [63, 5, 65, 15, 100, 0];

const curvyCoords = row1.concat(row2, row3, row4, row5, row6);

// 获取曲线蒙版
export default function getMask({
  tileRatio,
  topTab,
  rightTab,
  bottomTab,
  leftTab,
  tileWidth
}: IMaskParam) {
  const mask = new Path();

  const topLeftEdge = new Point(-4, 4);

  mask.moveTo(topLeftEdge);

  //Top
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = topLeftEdge.add(
      new Point(
        curvyCoords[i * 6 + 0] * tileRatio,
        topTab * curvyCoords[i * 6 + 1] * tileRatio
      )
    );
    const p2 = topLeftEdge.add(
      new Point(
        curvyCoords[i * 6 + 2] * tileRatio,
        topTab * curvyCoords[i * 6 + 3] * tileRatio
      )
    );
    const p3 = topLeftEdge.add(
      new Point(
        curvyCoords[i * 6 + 4] * tileRatio,
        topTab * curvyCoords[i * 6 + 5] * tileRatio
      )
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Right
  const topRightEdge = topLeftEdge.add(new Point(tileWidth, 0));
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = topRightEdge.add(
      new Point(
        -rightTab * curvyCoords[i * 6 + 1] * tileRatio,
        curvyCoords[i * 6 + 0] * tileRatio
      )
    );
    const p2 = topRightEdge.add(
      new Point(
        -rightTab * curvyCoords[i * 6 + 3] * tileRatio,
        curvyCoords[i * 6 + 2] * tileRatio
      )
    );
    const p3 = topRightEdge.add(
      new Point(
        -rightTab * curvyCoords[i * 6 + 5] * tileRatio,
        curvyCoords[i * 6 + 4] * tileRatio
      )
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Bottom
  const bottomRightEdge = topRightEdge.add(new Point(0, tileWidth));
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = bottomRightEdge.subtract(
      new Point(
        curvyCoords[i * 6 + 0] * tileRatio,
        bottomTab * curvyCoords[i * 6 + 1] * tileRatio
      )
    );
    const p2 = bottomRightEdge.subtract(
      new Point(
        curvyCoords[i * 6 + 2] * tileRatio,
        bottomTab * curvyCoords[i * 6 + 3] * tileRatio
      )
    );
    const p3 = bottomRightEdge.subtract(
      new Point(
        curvyCoords[i * 6 + 4] * tileRatio,
        bottomTab * curvyCoords[i * 6 + 5] * tileRatio
      )
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  //Left
  const bottomLeftEdge = bottomRightEdge.subtract(new Point(tileWidth, 0));
  for (let i = 0; i < curvyCoords.length / 6; i++) {
    const p1 = bottomLeftEdge.subtract(
      new Point(
        -leftTab * curvyCoords[i * 6 + 1] * tileRatio,
        curvyCoords[i * 6 + 0] * tileRatio
      )
    );
    const p2 = bottomLeftEdge.subtract(
      new Point(
        -leftTab * curvyCoords[i * 6 + 3] * tileRatio,
        curvyCoords[i * 6 + 2] * tileRatio
      )
    );
    const p3 = bottomLeftEdge.subtract(
      new Point(
        -leftTab * curvyCoords[i * 6 + 5] * tileRatio,
        curvyCoords[i * 6 + 4] * tileRatio
      )
    );

    mask.cubicCurveTo(p1, p2, p3);
  }

  return mask;
}
