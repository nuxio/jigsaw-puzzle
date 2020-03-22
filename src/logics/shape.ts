function getRandomTabValue(): number {
  return Math.pow(-1, Math.floor(Math.random() * 2));
}

export interface IShape {
  topTab: number;
  rightTab: number;
  bottomTab: number;
  leftTab: number;
}

// 随机形状列表
// 将整张拼图分割成许多等宽等高的方块
// 每一块拼图有4个边
// 每个边有三总可能的形态，1是突出，2是凹陷，3是平坦（只在边框）
// 拼图的右边和底边取随机形态，拼图的左边和上边取相邻拼图的右边和底边的负数
export default function getRandomShapes(width: number, height: number): IShape[] {
  const result = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      result.push({
        topTab: y === 0 ? 0 : undefined,
        rightTab: x === width - 1 ? 0 : undefined,
        bottomTab: y === height - 1 ? 0 : undefined,
        leftTab: x === 0 ? 0 : undefined
      });
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const shape = result[y * width + x];
      const rightShape = result[y * width + x + 1];
      const bottomShape = result[(y + 1) * width + x];

      shape.rightTab = rightShape ? getRandomTabValue() : shape.rightTab;
      shape.bottomTab = bottomShape ? getRandomTabValue() : shape.bottomTab;

      if (rightShape) {
        rightShape.leftTab = -(shape.rightTab as number);
      }

      if (bottomShape) {
        bottomShape.topTab = -(shape.bottomTab as number);
      }
    }
  }

  return result as IShape[];
}
