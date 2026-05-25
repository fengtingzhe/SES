const KEY_TO_ACTION = new Map([
  ['w', 'up'],
  ['arrowup', 'up'],
  ['s', 'down'],
  ['arrowdown', 'down'],
  ['a', 'left'],
  ['arrowleft', 'left'],
  ['d', 'right'],
  ['arrowright', 'right'],
  [' ', 'action'],
  ['spacebar', 'action'],
  ['r', 'reset']
]);

export class InputManager {
  constructor(target) {
    this.target = target;
    this.down = new Set();
    this.pressed = new Set();
    this.onKeyDown = event => this.handleKeyDown(event);
    this.onKeyUp = event => this.handleKeyUp(event);
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
  }

  handleKeyDown(event) {
    const action = KEY_TO_ACTION.get(event.key.toLowerCase());
    if (!action) return;
    event.preventDefault();
    if (!event.repeat) this.pressed.add(action);
    this.down.add(action);
  }

  handleKeyUp(event) {
    const action = KEY_TO_ACTION.get(event.key.toLowerCase());
    if (!action) return;
    event.preventDefault();
    this.down.delete(action);
  }

  getMoveVector() {
    const x = (this.down.has('right') ? 1 : 0) - (this.down.has('left') ? 1 : 0);
    const y = (this.down.has('down') ? 1 : 0) - (this.down.has('up') ? 1 : 0);
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  }

  consumePress(action) {
    const hasPress = this.pressed.has(action);
    this.pressed.delete(action);
    return hasPress;
  }

  endFrame() {
    this.pressed.clear();
  }

  dispose() {
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
  }
}
