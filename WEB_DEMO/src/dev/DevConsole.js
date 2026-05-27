import { runDevAction } from './DevActions.js';
import { getDevSummary } from './DevSelectors.js';

const TABS = [
  { id: 'overview', label: '总览' },
  { id: 'resources', label: '资源' },
  { id: 'timeWeather', label: '时间天气' },
  { id: 'units', label: '单位' },
  { id: 'events', label: '事件' }
];

export class DevConsole {
  constructor(rootElement, contextProvider) {
    this.rootElement = rootElement;
    this.contextProvider = contextProvider;
    this.open = false;
    this.activeTab = 'overview';
    this.lastAutoRefresh = 0;
    this.handleClick = this.handleClick.bind(this);
  }

  attach() {
    this.rootElement.addEventListener('click', this.handleClick);
    this.render();
  }

  toggle() {
    this.open = !this.open;
    this.render();
  }

  render() {
    this.lastAutoRefresh = now();
    const context = this.contextProvider();
    if (!this.open || !context?.state) {
      this.rootElement.className = 'dev-console is-hidden';
      this.rootElement.innerHTML = '';
      return;
    }

    const summary = getDevSummary(context.state);
    this.rootElement.className = 'dev-console';
    this.rootElement.innerHTML = `
      <header class="dev-console__header">
        <div>
          <div class="dev-console__eyebrow">开发 / 策划测试台</div>
          <h2>Dev Console</h2>
        </div>
        <button class="dev-console__icon-button" type="button" data-dev-close aria-label="关闭 Dev Console">×</button>
      </header>
      ${this.renderOverview(summary)}
      <nav class="dev-console__tabs" aria-label="Dev Console tabs">
        ${TABS.map(tab => `
          <button
            class="dev-console__tab"
            type="button"
            data-dev-tab="${tab.id}"
            aria-selected="${tab.id === this.activeTab ? 'true' : 'false'}"
          >${tab.label}</button>
        `).join('')}
      </nav>
      <div class="dev-console__body">
        ${this.renderActiveTab(summary)}
      </div>
    `;
  }

  refresh() {
    if (!this.open) return;
    const current = now();
    if (current - this.lastAutoRefresh < 1000) return;
    if (this.rootElement.matches(':hover') || this.rootElement.contains(document.activeElement)) return;
    this.render();
  }

  handleClick(event) {
    const closeButton = event.target.closest('[data-dev-close]');
    if (closeButton) {
      this.open = false;
      this.render();
      return;
    }

    const tabButton = event.target.closest('[data-dev-tab]');
    if (tabButton) {
      this.activeTab = tabButton.dataset.devTab;
      this.render();
      return;
    }

    const actionButton = event.target.closest('[data-dev-action]');
    if (!actionButton) return;

    runDevAction(actionButton.dataset.devAction, this.contextProvider());
    this.render();
  }

  renderOverview(summary) {
    return `
      <div class="dev-console__overview">
        ${metric('版本', summary.overview.version)}
        ${metric('状态', summary.overview.status)}
        ${metric('天数 / 阶段', `第 ${summary.overview.day} 天 / ${summary.overview.phase}`)}
        ${metric('天气', `${summary.weather.current}${summary.weather.remaining ? ` ${summary.weather.remaining}s` : ''}`)}
        ${metric('位置', summary.overview.position)}
      </div>
    `;
  }

  renderActiveTab(summary) {
    if (this.activeTab === 'overview') return this.renderOverviewTab(summary);
    if (this.activeTab === 'timeWeather') return this.renderTimeWeather(summary);
    if (this.activeTab === 'units') return this.renderUnits(summary);
    if (this.activeTab === 'events') return this.renderEvents(summary);
    return this.renderResources(summary);
  }

  renderOverviewTab(summary) {
    return `
      <div class="dev-console__stats">
        ${metric('辉石', summary.resources.stone)}
        ${metric('工人', `${summary.units.idleWorkers}/${summary.units.workers} 空闲`)}
        ${metric('待复工 / lost 工人', `${summary.units.waitingResumeWorkers} / ${summary.units.lostWorkers}`)}
        ${metric('流民 / 待转职', `${summary.units.refugees} / ${summary.units.unassigned}`)}
        ${metric('弓箭手 / 黑影', `${summary.units.archers} / ${summary.units.monsters}`)}
        ${metric('营地', summary.units.homes)}
        ${metric('围墙', `${summary.events.walls.total} 个，${summary.events.walls.damaged} 个受损`)}
        ${metric('最近天气事件', summary.weather.lastEvent)}
        ${metric('狐狸成亲', summary.events.foxWedding)}
      </div>
    `;
  }

  renderResources(summary) {
    return `
      <div class="dev-console__stats">
        ${metric('库存辉石', summary.resources.stone)}
        ${metric('地图辉石', summary.resources.mapStones)}
        ${metric('临时辉石', summary.resources.temporaryStones)}
      </div>
      ${buttonGroup([
        ['辉石 +1', 'resources:addStone1'],
        ['辉石 +5', 'resources:addStone5'],
        ['辉石 -1', 'resources:removeStone1'],
        ['清零辉石', 'resources:clearStone'],
        ['生成自然辉石', 'resources:spawnNaturalStone'],
        ['生成临时辉石', 'resources:spawnPlacedStone']
      ])}
    `;
  }

  renderTimeWeather(summary) {
    return `
      <div class="dev-console__stats">
        ${metric('累计时间', `${summary.time.elapsed}s`)}
        ${metric('当前阶段', summary.time.phase)}
        ${metric('当前天气', summary.weather.current)}
        ${metric('最近天气事件', summary.weather.lastEvent)}
      </div>
      <h3>时间</h3>
      ${buttonGroup([
        ['设为白天', 'time:setDay'],
        ['设为黄昏', 'time:setDusk'],
        ['设为黑夜', 'time:setNight'],
        ['推进下一天', 'time:nextDay']
      ])}
      <h3>天气</h3>
      ${buttonGroup([
        ['设为雨', 'weather:rain'],
        ['设为雪', 'weather:snow'],
        ['设为大风', 'weather:wind'],
        ['清除天气', 'weather:clear'],
        ['立即判定天气事件', 'weather:checkEventNow']
      ])}
    `;
  }

  renderUnits(summary) {
    return `
      <div class="dev-console__stats">
        ${metric('工人', `${summary.units.idleWorkers}/${summary.units.workers} 空闲`)}
        ${metric('采矿 / 撤退 / 待复工', `${summary.units.miningWorkers} / ${summary.units.fleeingWorkers} / ${summary.units.waitingResumeWorkers}`)}
        ${metric('弓箭手', summary.units.archers)}
        ${metric('黑影', summary.units.monsters)}
        ${metric('返程流民', summary.units.refugees)}
        ${metric('待转职人口', summary.units.unassigned)}
      </div>
      ${buttonGroup([
        ['生成工人', 'units:spawnWorker'],
        ['待转职人口 +1', 'units:addUnassigned'],
        ['生成弓箭手', 'units:spawnArcher'],
        ['生成黑影', 'units:spawnMonster'],
        ['清除黑影', 'units:clearMonsters'],
        ['召回工人', 'units:returnWorkers']
      ])}
      <h3>工人状态</h3>
      ${workerList(summary.units.workerRows)}
    `;
  }

  renderEvents(summary) {
    return `
      <div class="dev-console__stats">
        ${metric('狐狸成亲', summary.events.foxWedding)}
        ${metric('流民火堆', `${summary.events.refugeeFires.available} 可招 / ${summary.events.refugeeFires.cooling} 冷却`)}
        ${metric('雾门 / 矿山', `${summary.events.fogGates} / ${summary.events.mines}`)}
        ${metric('颠倒森林格', summary.events.invertedForestTiles)}
        ${metric('围墙', `${summary.events.walls.total} 个，${summary.events.walls.damaged} 个受损`)}
      </div>
      ${buttonGroup([
        ['生成流民火堆', 'events:spawnRefugeeFire'],
        ['开始狐狸成亲', 'events:startFoxWedding'],
        ['完成狐狸成亲', 'events:completeFoxWedding'],
        ['失败狐狸成亲', 'events:failFoxWedding'],
        ['生成雾门', 'events:spawnFog'],
        ['生成矿山', 'events:spawnMine'],
        ['生成颠倒森林', 'events:spawnInvertedForest'],
        ['直接完成目标', 'events:completeGoal'],
        ['重置游戏', 'events:resetGame']
      ])}
    `;
  }
}

function metric(label, value) {
  return `
    <div class="dev-console__metric">
      <span>${escapeHtml(label)}</span>
      <b>${escapeHtml(String(value))}</b>
    </div>
  `;
}

function buttonGroup(buttons) {
  return `
    <div class="dev-console__button-grid">
      ${buttons.map(([label, action]) => `
        <button class="dev-console__button" type="button" data-dev-action="${action}">
          ${escapeHtml(label)}
        </button>
      `).join('')}
    </div>
  `;
}

function workerList(rows) {
  if (!rows.length) return '<div class="dev-console__empty">当前没有工人。</div>';

  return `
    <div class="dev-console__worker-list">
      ${rows.map(worker => `
        <div class="dev-console__worker-row">
          <b>#${worker.id} ${escapeHtml(worker.state)}</b>
          <span>job：${escapeHtml(worker.job)}</span>
          <span>lost：${escapeHtml(worker.lost)}</span>
          <span>home：${escapeHtml(worker.homeId)}</span>
          <span>interrupted：${escapeHtml(worker.interruptedJob)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function now() {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}
