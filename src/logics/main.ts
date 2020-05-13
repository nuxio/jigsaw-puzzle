import Paper, {
  Raster,
  Color,
  Rectangle,
  Point,
  Group,
  view,
  Tool,
  project
} from "paper";

import getMask from "./mask";
import getRandomShapes, {IShape} from "./shape";

interface IJigsawPuzzleParams {
  tileSize: number; // 拼图块的大小
  image: HTMLImageElement; // 原图片
}

interface ITile extends paper.Group {
  shape?: IShape;
  imagePosition?: paper.Point;
}

export default class JigsawPuzzle {
  private tileSize: number; // 拼图块的尺寸
  private puzzleImage: paper.Raster;
  private tilesColCount: number; // 拼图列数
  private tilesRowCount: number; // 行数
  private tileMarginWidth: number; // 拼图块的边框宽度
  private tiles: ITile[];
  private tool: paper.Tool;
  private selectedTile: any | null;

  private zoom = 1;
  private zoomScaleOnDrag = 1.25;
  private selectedTileIndex = -1;
  private selectionGroup = null;

  constructor({tileSize = 64, image}: IJigsawPuzzleParams) {
    this.tileSize = tileSize;
    this.puzzleImage = new Raster(image);
    this.tilesColCount = Math.ceil(image.width / tileSize);
    this.tilesRowCount = Math.ceil(image.height / tileSize);
    this.tileMarginWidth = tileSize * 0.203125;
    this.tiles = this.createTiles();
    this.tool = new Tool();

    this.tool.onMouseDown = this.handleMouseDown.bind(this);
    this.tool.onMouseMove = this.handleMouseMove.bind(this);
    this.tool.onMouseDrag = this.handleMouseDrag.bind(this);
    this.tool.onMouseUp = this.handleMouseUp.bind(this);

    this.selectedTile = null;
  }

  createTiles(): ITile[] {
    const tiles: ITile[] = [];
    const indexes = [];
    const ratio = this.tileSize / 100;
    const shapes = getRandomShapes(this.tilesColCount, this.tilesRowCount);
    const cloneImage = this.puzzleImage.clone() as paper.Raster;

    for (let y = 0; y < this.tilesRowCount; y++) {
      for (let x = 0; x < this.tilesColCount; x++) {
        const shape = shapes[y * this.tilesColCount + x];
        const img = this.getTileRaster(
          cloneImage,
          new Point(this.tileSize * x, this.tileSize * y)
        );
        const mask = getMask({
          tileRatio: ratio,
          ...shape,
          tileWidth: this.tileSize
        });

        mask.opacity = 0.25;
        mask.strokeColor = new Color("#fff");

        const border = mask.clone();
        border.strokeColor = new Color("#ccc");
        border.strokeWidth = 5;

        const tile: ITile = new Group([mask, border, img, border]);
        tile.clipped = true; // 蒙版效果，将mask应用于小方块，显示出曲型边框
        tile.opacity = 1;

        tile.shape = shape;
        tile.imagePosition = new Point(x, y);

        tiles.push(tile);
        indexes.push(indexes.length);
      }
    }

    for (let y = 0; y < this.tilesRowCount; y++) {
      for (let x = 0; x < this.tilesColCount; x++) {
        const index1 = Math.floor(Math.random() * indexes.length);
        const index2 = indexes[index1];
        const tile = tiles[index2];

        indexes.splice(index1, 1);

        const position = view.center
          .subtract(new Point(this.tileSize, this.tileSize / 2))
          .add(new Point(this.tileSize * (x * 2 + (y % 2)), this.tileSize * y))
          .subtract(
            new Point(
              this.puzzleImage.size.width,
              this.puzzleImage.size.height / 2
            )
          );
        const cellPosition = new Point(
          Math.round(position.x / this.tileSize) + 1,
          Math.round(position.y / this.tileSize) + 1
        );

        tile.position = cellPosition.multiply(this.tileSize);
        // @ts-ignore
        tile.cellPosition = cellPosition;
      }
    }

    return tiles;
  }

  getTileRaster(image: paper.Raster, offset: paper.Point) {
    // const result = new Raster("empty");
    const realSize = this.tileSize + this.tileMarginWidth * 2;
    const result = image.getSubRaster(
      new Rectangle(
        offset.x - this.tileMarginWidth,
        offset.y - this.tileMarginWidth,
        realSize,
        realSize
      )
    );
    result.position = new Point(this.tileSize / 2, this.tileSize / 2); // TODO
    return result;
  }

  handleMouseDown(event: paper.MouseEvent) {
    const hitResult = project.hitTest(event.point, {
      fill: true,
      stroke: false,
      segments: false
    });
    if (hitResult && hitResult.item) {
      this.selectedTile = hitResult.item.parent;
    }
  }

  handleMouseMove(event: paper.ToolEvent) {
    project.activeLayer.selected = false;
    if (event.item) event.item.selected = true;
    // if (!this.selectedTile) {
    //   return;
    // }
    // this.selectedTile.position.add(event.delta);
  }

  handleMouseDrag(event: paper.ToolEvent) {
    console.log(this.selectedTile);
    if (this.selectedTile) {
      this.selectedTile.position = this.selectedTile.position.add(event.delta);
    }
  }

  handleMouseUp(event: any) {
    if (!this.selectedTile) {
      return;
    }

    this.selectedTile = null;
  }
}
