const MOVEMENT_KEYS = new Set([
  'w',
  'a',
  's',
  'd',
  'ArrowUp',
  'ArrowLeft',
  'ArrowDown',
  'ArrowRight'
]);

export class InputManager {
  constructor({ onInteract, onReset, onToggleMiniMap, onToggleDevConsole }) {
    this.keys = new Map();
    this.onInteract = onInteract;
    this.onReset = onReset;
    this.onToggleMiniMap = onToggleMiniMap;
    this.onToggleDevConsole = onToggleDevConsole;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (MOVEMENT_KEYS.has(key) || key === ' ') {
      event.preventDefault();
    }

    this.keys.set(key, true);

    if (key === ' ' && !event.repeat) {
      this.onInteract();
    }

    if (key === 'r' && !event.repeat) {
      this.onReset();
    }

    if ((key === 'F3' || key === 'm') && !event.repeat) {
      event.preventDefault();
      this.onToggleMiniMap();
    }

    if (key === 'F1' && !event.repeat) {
      event.preventDefault();
      this.onToggleDevConsole();
    }
  }

  handleKeyUp(event) {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    this.keys.set(key, false);
  }

  isDown(key) {
    return Boolean(this.keys.get(key));
  }

  getMovementVector() {
    return {
      x: (this.isDown('d') || this.isDown('ArrowRight') ? 1 : 0) -
        (this.isDown('a') || this.isDown('ArrowLeft') ? 1 : 0),
      y: (this.isDown('s') || this.isDown('ArrowDown') ? 1 : 0) -
        (this.isDown('w') || this.isDown('ArrowUp') ? 1 : 0)
    };
  }
}
