import { GameLoop } from '../engine/loop/GameLoop.js';
import { InputManager } from '../engine/input/InputManager.js';
import { CanvasRenderer } from '../engine/render/CanvasRenderer.js';
import { GameState } from '../game/state/GameState.js';
import { PlayerSystem } from '../game/systems/PlayerSystem.js';
import { InteractionSystem } from '../game/systems/InteractionSystem.js';
import { WorkerSystem } from '../game/systems/WorkerSystem.js';
import { DayNightSystem } from '../game/systems/DayNightSystem.js';
import { CampSystem } from '../game/systems/CampSystem.js';
import { ResourceSystem } from '../game/systems/ResourceSystem.js';
import { MonsterSystem } from '../game/systems/MonsterSystem.js';
import { TileRenderer } from '../presentation/renderers/TileRenderer.js';
import { UnitRenderer } from '../presentation/renderers/UnitRenderer.js';
import { HudRenderer } from '../presentation/renderers/HudRenderer.js';

export class GameApp {
  constructor({ root }) {
    this.root = root;
    this.state = GameState.createNew();
    this.input = new InputManager(window);
    this.canvasRenderer = new CanvasRenderer(root);
    this.loop = new GameLoop();

    this.campSystem = new CampSystem();
    this.resourceSystem = new ResourceSystem();
    this.workerSystem = new WorkerSystem(this.campSystem, this.resourceSystem);
    this.monsterSystem = new MonsterSystem(this.workerSystem);
    this.playerSystem = new PlayerSystem();
    this.interactionSystem = new InteractionSystem(this.workerSystem, this.resourceSystem);
    this.dayNightSystem = new DayNightSystem();

    this.tileRenderer = new TileRenderer(this.canvasRenderer);
    this.unitRenderer = new UnitRenderer(this.canvasRenderer);
    this.hudRenderer = new HudRenderer(this.canvasRenderer);
  }

  start() {
    this.configurePage();
    this.canvasRenderer.resize();
    this.loop.start(
      dt => this.update(dt),
      () => this.render()
    );

    window.__khqWebDemo = {
      app: this,
      state: this.state
    };
  }

  configurePage() {
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#0b1416';
    document.body.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }

  reset() {
    this.state = GameState.createNew();
    window.__khqWebDemo.state = this.state;
  }

  update(dt) {
    if (this.input.consumePress('reset')) {
      this.reset();
    }

    this.dayNightSystem.update(this.state, dt);
    this.playerSystem.update(this.state, this.input, dt);
    this.resourceSystem.update(this.state, dt);
    this.workerSystem.update(this.state, dt);
    this.monsterSystem.update(this.state, dt);
    this.interactionSystem.update(this.state);

    if (this.input.consumePress('action')) {
      this.interactionSystem.handleAction(this.state);
    }

    this.state.updateMessage(dt);
    this.state.camera.x += (this.state.player.x - this.state.camera.x) * Math.min(1, dt * 7);
    this.state.camera.y += (this.state.player.y - this.state.camera.y) * Math.min(1, dt * 7);
    this.input.endFrame();
  }

  render() {
    const { ctx } = this.canvasRenderer;
    this.canvasRenderer.clear('#0b1416');
    this.tileRenderer.draw(this.state);
    this.unitRenderer.draw(this.state);
    this.dayNightSystem.drawOverlay(this.state, ctx, this.canvasRenderer);
    this.hudRenderer.draw(this.state);
  }
}
