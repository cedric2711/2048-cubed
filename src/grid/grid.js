import _ from 'lodash';

export default class Grid {

  constructor(size) {
    const [width, height, depth] = size;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.cells = this.buildEmpty();
  }

  buildEmpty() {
    const { width, height, depth } = this;
    return _.range(width * height * depth).map(() => null);
  };

  randomAvailableCell() {
    return _.sample(this.availableCells());
  };

  availableCells() {
    var cells = [];
    this.eachCell((x, y, z, item) => {
      !item && cells.push({ x, y, z });
    });
    return cells;
  };

  positionToCoordinates(position) {
    const { width, height, depth } = this;
    const doubleSize = width * height;
    const x = position % width;
    const y = ((position - x) / width) % height;
    const z = ((position - x - (y * height)) / doubleSize) % doubleSize;
    return { x, y, z };
  };

  coordinatesToPosition({ x, y, z }) {
    const { width, height, depth } = this;
    return x + (y * height) + (z * width * height);
  };

  eachCell(cb) {
    this.cells.forEach((cell, position) => {
      const { x, y, z } = this.positionToCoordinates(position);
      cb(x, y, z, cell);
    });
    return this;
  };

  occupiedCells() {
    return _.compact(this.cells);
  };

  cellsAvailable() {
    return !!this.availableCells().length;
  };

  cellAvailable(cell) {
    return !this.cellOccupied(cell);
  }

  cellOccupied(cell) {
    return !!this.cellContent(cell);
  }

  cellContent(cell) {
    return this.withinBounds(cell) && this.cells[this.coordinatesToPosition(cell)];
  }

  insert(item) {
    const position = this.coordinatesToPosition(item);
    this.cells[position] = item;
    return this;
  }

  remove(item) {
    const position = this.coordinatesToPosition(item);
    this.cells[position] = null;
    return this;
  }

  withinBounds(position) {
    const { x, y, z } = position;
    const { width, height, depth } = this;
    return _.inRange(x, 0, width) && _.inRange(y, 0, height) && _.inRange(z, 0, depth);
  }
}

