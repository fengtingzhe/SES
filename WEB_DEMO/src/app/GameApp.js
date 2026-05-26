import { GameConfig } from '../game/config/GameConfig.js';
import { createInitialState } from '../game/state/createInitialState.js';
import { InputManager } from '../game/systems/InputManager.js';
import { InteractionSystem } from '../game/systems/InteractionSystem.js';
import { PlayerSystem } from '../game/systems/PlayerSystem.js';
import { ResourceSystem } from '../game/systems/ResourceSystem.js';
import { VisionSystem } from '../game/systems/VisionSystem.js';
import { CanvasRenderer } from '../presentation/renderers/CanvasRenderer.js';
import { HudRenderer } from '../presentation/renderers/HudRenderer.js';

export class GameApp {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.lastFrame = 0;
    this.animationFrame = null;
    this.showMessage = this.showMessage.bind(this);
    this.reset = this.reset.bind(this);
    this.loop = this.loop.bind(this);
  }

  start() {
    this.rootElement.innerHTML = `
      <div class="game-shell">
        <canvas class="world-canvas" aria-label="WEB_DEMO game canvas"></canvas>
        <section class="hud" aria-live="polite"></section>
        <div class="toast" aria-live="polite"></div>
      </div>
    `;

    this.canvasRenderer = new CanvasRenderer(this.rootElement.querySelector('.world-canvas'));
    this.hudRenderer = new HudRenderer(
      this.rootElement.querySelector('.hud'),
      this.rootElement.querySelector('.toast')
    );
    this.inputManager = new InputManager({
      onInteract: () => this.interactionSystem.interact(this.state),
      onReset: this.reset
    });
    this.playerSystem = new PlayerSystem(this.inputManager);
    this.visionSystem = new VisionSystem();
    this.resourceSystem = new ResourceSystem(this.showMessage);
    this.interactionSystem = new InteractionSystem(this.resourceSystem, this.showMessage);

    this.canvasRenderer.attach();
    this.inputManager.attach();
    this.reset();

    this.lastFrame = performance.now();
    this.animationFrame = requestAnimationFrame(this.loop);
  }

  reset() {
    this.state = createInitialState();
    this.visionSystem.reveal(this.state);
    this.state.hover = this.interactionSystem.findInteract(this.state, false);
  }

  showMessage(text) {
    this.state.message = {
      text,
      ttl: GameConfig.messageSeconds
    };
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.update(dt);
    this.canvasRenderer.render(this.state);
    this.hudRenderer.render(this.state);
    this.animationFrame = requestAnimationFrame(this.loop);
  }

  update(dt) {
    const moved = this.playerSystem.update(this.state, dt);
    if (moved) {
      this.visionSystem.reveal(this.state);
    }

    this.resourceSystem.update(this.state, dt);
    this.state.hover = this.interactionSystem.findInteract(this.state, false);

    if (this.state.message.ttl > 0) {
      this.state.message.ttl = Math.max(0, this.state.message.ttl - dt);
    }
  }
}
