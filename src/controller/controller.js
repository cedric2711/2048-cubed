export default class Controller {

  static keyMaps = {
    38: 'up',
    39: 'right',
    40: 'down',
    37: 'left',
    190: 'backward',
    191: 'forward'
  };

  constructor() {
    this.events = {};
    this.listen();
  }

  on(e, cb) {
    if (!this.events[e]) {
      this.events[e] = [];
    }
    this.events[e].push(cb);
    return this;
  }

  emit(e, data) {
    var cbs = this.events[e];
    cbs && cbs.forEach(cb => cb(data));
    return this;
  }

  listen() {
    document.addEventListener('keydown', e => {
      var mapped = Controller.keyMaps[e.which];
      if (mapped) {
        e.preventDefault();
        this.emit('move', mapped);
        this.emit('rotate', rotateMapped);
      }
    });
    return this;
  }
}
