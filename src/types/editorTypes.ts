export type GridType = 'square' | 'hex';

export interface Cell {
  x: number;
  y: number;
  color: string;
}

export interface CellSize {
  width: number;
  height: number;
}

export interface Layer {
  id: string;
  name: string;
  cells: Record<string, Cell>;
  visible: boolean;
}

export interface EditorState {
  gridType: GridType;
  gridSize: { width: number; height: number };
  cellSize: CellSize;
  gridConfig: any;
  layers: Layer[];
  activeLayerId: string | null;

}

export abstract class Grid {
  constructor(
    public width: number,
    public height: number,
    public cellSize: CellSize
  ) {}

  getAllCoordinates(): {x: number, y: number}[] {
    const coords = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        coords.push({ x, y });
      }
    }
    return coords;
  }

  abstract getCellPosition(x: number, y: number): {x: number, y: number};

  getCellStyle() {
    return {
      spacing: 0,
      borderColor: '#cccccc',
      borderWidth: 1,
      showBorder: true,
      cellPadding: 0
    };
  }
}

export class SquareGrid extends Grid {
  constructor(
    width: number,
    height: number,
    cellSize: CellSize
  ) {
    super(width, height, cellSize);
  }

  getCellPosition(x: number, y: number): {x: number, y: number} {
    return {
      x: x * this.cellSize.width,
      y: y * this.cellSize.height
    };
  }

  getCellStyle() {
    return {
      ...super.getCellStyle(),
    };
  }
}

export class HexGrid extends Grid {
  constructor(
    width: number,
    height: number,
    cellSize: CellSize
  ) {
    super(width, height, cellSize);
  }

  getCellPosition(x: number, y: number): {x: number, y: number} {

    return (y % 2 === 0) ?
    {
      x: x * this.cellSize.width,
      y: y * this.cellSize.height
    } :
    {
      x: x * this.cellSize.width + this.cellSize.width / 2,
      y: y * this.cellSize.height
    }
  }

  getCellStyle() {
    return {
      ...super.getCellStyle(),
    };
  }
}