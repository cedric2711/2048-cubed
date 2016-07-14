import _ from 'lodash';
import Grid from '../grid/grid';
import Cube from '../cube/cube';

export default class Manager {

  static getVector(direction) {
    return {
      up: { x: 0, y: -1, z: 0 },
      right: { x: 1, y: 0, z: 0 },
      down: { x: 0, y: 1, z: 0 },
      left: { x: -1, y: 0, z: 0 },
      backward: { x: 0, y: 0, z: 1 },
      forward: { x: 0, y: 0, z: -1 }
    }[direction];
  };

  static positionsEqual(first, second) {
    return first.x === second.x &&
      first.y === second.y &&
      first.z === second.z;
  };

  static normalizeSize(size) {
    const normalizedSize = _.isArray(size) ? size : [size, size, size];
    (normalizedSize.length === 2) && normalizedSize.push(1);
    return normalizedSize;
  };

  constructor(size, Controller, Actuator, options) {
    this.size = Manager.normalizeSize(size);

    this.options = _.assign({}, {
      startCubes: 2,
      animation: {
        duration: 300,
        easing: TWEEN.Easing.Cubic.InOut
      }
    }, options);

    const { animation } = this.options;
    this.controller = new Controller();
    this.actuator = new Actuator(this.size, animation);

    this.controller.on('move', _.throttle(this.move, animation.duration));
    this.setup();
  }

  addRandomCube = () => {
    if (this.grid.cellsAvailable()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const cube = new Cube(this.grid.randomAvailableCell(), value);
      this.grid.insert(cube);
    }
    return this;
  };

  move = (direction) => {
    let moved = false;
    const vector = Manager.getVector(direction);
    const traversals = this.buildTraversals(vector);

    this.prepareCubes();

    traversals.z.forEach(z => {
      traversals.y.forEach(y => {
        traversals.x.forEach(x => {
          const position = { x, y, z };
          const cube = this.grid.cellContent(position);
          if (!cube) return;

          const positions = this.findFarthestPosition(position, vector);
          const next = this.grid.cellContent(positions.next);

          if (next && next.value === cube.value && !next.mergedFrom) {
            const merged = new Cube(next, cube.value * 2);
            merged.mergedFrom = [cube, next];
            this.grid.insert(merged);
            this.grid.remove(cube);
            cube.updatePosition(next);
          }
          else {
            this.moveCube(cube, positions.furthest);
          }

          if (!Manager.positionsEqual(position, cube)) {
            moved = true;
          }
        });
      });
    });

    if (moved) {
      this.addRandomCube();
      this.actuate();
    }
  };

  setup() {
    this.grid = new Grid(this.size);
    return this.addStartCubes().actuate();
  }

  addStartCubes() {
    _.times(this.options.startCubes, this.addRandomCube);
    return this;
  }

  actuate() {
    this.actuator.actuate(this.grid.occupiedCells());
    return this;
  }

  prepareCubes() {
    this.grid.occupiedCells().forEach(cube => {
      cube.mergedFrom = null;
      cube.savePosition();
    });
    return this;
  }

  moveCube(cube, position) {
    this.grid.remove(cube);
    cube.updatePosition(position);
    this.grid.insert(cube);
    return this;
  }

  buildTraversals(vector) {
    const traversals = { x: [], y: [], z: [] };

    const [width, height, depth] = this.size;
    _.times(width, pos => traversals.x.push(pos));
    _.times(height, pos => traversals.y.push(pos));
    _.times(depth, pos => traversals.z.push(pos));

    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    if (vector.z === 1) traversals.z = traversals.z.reverse();

    return traversals;
  }

  findFarthestPosition(position, vector) {
    let furthest;
    let next = position;

    do {
      furthest = next;
      next = {
        x: furthest.x + vector.x,
        y: furthest.y + vector.y,
        z: furthest.z + vector.z
      };
    } while (this.grid.withinBounds(next) && this.grid.cellAvailable(next));

    return { furthest, next };
  }
}
