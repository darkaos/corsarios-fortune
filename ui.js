// ============================================================
// Corsário's Fortune — Alpha 0.1.3.3 Final
// ui.js — construção do HTML a partir do estado (STATE) e
// ligação de eventos.
//
// ARQUITETURA DE RENDER (não mexer sem necessidade — resolve os
// bugs de "dropdown fecha sozinho" e "preciso clicar várias vezes"):
//   - fullRender(state): reconstrói TUDO. Só é chamado após uma
//     ação do jogador (clique) ou ao trocar de aba/idioma/tema.
//   - renderFrame(state): chamado a cada 200ms pelo game loop.
//     Atualiza só TEXTO/atributos de elementos que já existem (via
//     id), nunca substitui o HTML de painéis com <select>.
// ============================================================

const TAB_ORDER = ['ship', 'crew', 'upgrades', 'island', 'exploration', 'fleet', 'quests', 'inventory', 'prestige', 'achievements', 'journal'];

function el(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

// ---------- Render completo (estrutural) ----------

function fullRender(state) {
  if (!state.settings.lang) { renderLanguageGate(state); return; }
  document.getElementById('modal-container').classList.remove('gate');
  document.body.dataset.theme = state.settings.theme || 'dark';
  document.getElementById('game-title').textContent = '🏴‍☠️ ' + t(state, 'app_title');
  document.getElementById('game-subtitle').textContent = t(state, 'app_subtitle');
  renderTopBar(state);
  renderWorldEventBanner(state);
  renderTabsNav(state);
  renderMainArea(state);
  renderLog(state);
  renderModal(state);
  state._lastUnlockedSnapshot = JSON.stringify(state.unlocked);
}

function hintBanner(state, key) {
  if (state.hints[key]) return '';
  return `
    <div class="hint-banner" id="hint-${key}">
      <div class="hint-text"><strong>${t(state, 'hint_' + key + '_title')}</strong><br>${t(state, 'hint_' + key + '_text')}</div>
      <button class="btn tiny" data-action="dismiss-hint" data-key="${key}">${t(state, 'btn_got_it')}</button>
    </div>`;
}

function renderMainArea(state) {
  const root = document.getElementById('tab-content');
  if (!state.castaway.done && state.ui.activeTab !== 'settings' && state.ui.activeTab !== 'journal') {
    root.innerHTML = renderCastawayScreen(state);
    return;
  }
  if (!state.ui.activeTab || (!state.unlocked[state.ui.activeTab] && state.ui.activeTab !== 'settings')) {
    state.ui.activeTab = TAB_ORDER.find(id => state.unlocked[id]) || 'settings';
  }
  switch (state.ui.activeTab) {
    case 'ship': root.innerHTML = hintBanner(state, 'ship') + renderShipTab(state); break;
    case 'crew': root.innerHTML = hintBanner(state, 'crew') + renderCrewTab(state); break;
    case 'upgrades': root.innerHTML = hintBanner(state, 'upgrades') + renderUpgradesTab(state); break;
    case 'island': root.innerHTML = hintBanner(state, 'island') + renderIslandTab(state); break;
    case 'exploration': root.innerHTML = hintBanner(state, 'exploration') + renderExplorationTab(state); break;
    case 'fleet': root.innerHTML = hintBanner(state, 'fleet') + renderFleetTab(state); break;
    case 'quests': root.innerHTML = hintBanner(state, 'quests') + renderQuestsTab(state); break;
    case 'inventory': root.innerHTML = renderInventoryTab(state); break;
    case 'prestige': root.innerHTML = hintBanner(state, 'prestige') + renderPrestigeTab(state); break;
    case 'achievements': root.innerHTML = hintBanner(state, 'achievements') + renderAchievementsTab(state); break;
    case 'journal': root.innerHTML = renderJournalTab(state); break;
    case 'settings': root.innerHTML = renderSettingsTab(state); break;
  }
}

// ---------- Render leve (a cada tick) ----------

function renderFrame(state) {
  if (!state.settings.lang) return;
  if (JSON.stringify(state.unlocked) !== state._lastUnlockedSnapshot) { fullRender(state); return; }
  updateTopBarNumbers(state);
  updateCrewRankNumbers(state);
  updateWorldEventBanner(state);
  if (!state.castaway.done) { updateCastawayNumbers(state); return; }
  const tab = state.ui.activeTab;
  if (tab === 'exploration') { document.getElementById('tab-content').innerHTML = hintBanner(state, 'exploration') + renderExplorationTab(state); }
  else if (tab === 'ship') { updateShipLiveState(state); }
  else if (tab === 'crew') { updateCrewLiveState(state); }
  else if (tab === 'fleet') { updateSupportFleetLiveState(state); }
  else if (tab === 'quests') { updateQuestsLiveState(state); }
  else if (tab === 'upgrades') { updateUpgradesLiveState(state); }
}

// ---------- Barra de topo + Evento Mundial ----------

const RESOURCE_ORDER = ['gold', 'wood', 'rum', 'gunpowder', 'iron', 'cloth', 'spices', 'maps', 'fame'];

function renderTopBar(state) {
  const bar = document.getElementById('resource-bar');
  if (!state.castaway.done) { bar.innerHTML = ''; bar.style.display = 'none'; }
  else {
    bar.style.display = '';
    bar.innerHTML = RESOURCE_ORDER.map(k => `
      <div class="res-chip" id="res-chip-${k}" title="${L(state, RESOURCE_INFO[k], 'name')}">
        <span class="res-icon">${RESOURCE_INFO[k].icon}</span>
        <span class="res-val" id="res-val-${k}">${fmt(state.resources[k])}</span>
      </div>
    `).join('') + `
      <div class="res-chip res-doubloon" title="${t(state, 'prestige_current')}">
        <span class="res-icon">💰</span>
        <span class="res-val" id="res-val-doubloons">${fmt(state.prestige.doubloons)}</span>
      </div>
    `;
  }
  updateTopBarNumbers(state);
  updateCrewRankNumbers(state);
}

function updateTopBarNumbers(state) {
  if (!state.castaway.done) return;
  const rates = calcProductionRates(state);
  RESOURCE_ORDER.forEach(k => {
    const valEl = document.getElementById('res-val-' + k);
    if (!valEl) return;
    valEl.textContent = fmt(state.resources[k]);
    const chip = document.getElementById('res-chip-' + k);
    if (chip && rates[k] !== undefined) {
      const rate = rates[k];
      const sign = rate >= 0 ? '+' : '';
      chip.title = `${L(state, RESOURCE_INFO[k], 'name')}: ${t(state, 'per_sec', { sign, val: fmt(rate) })}`;
    }
  });
  const doubloonsEl = document.getElementById('res-val-doubloons');
  if (doubloonsEl) doubloonsEl.textContent = fmt(state.prestige.doubloons);
}

function renderWorldEventBanner(state) {
  const el2 = document.getElementById('world-event-banner');
  if (!el2) return;
  if (!state.worldEvent) { el2.innerHTML = ''; el2.style.display = 'none'; return; }
  el2.style.display = '';
  const def = WORLD_EVENTS.find(e => e.id === state.worldEvent.id);
  el2.innerHTML = `<span class="we-icon">${def.icon}</span> <strong>${L(state, def, 'name')}</strong> — ${L(state, def, 'desc')} <span class="we-timer" id="we-timer">${Math.ceil(state.worldEvent.remaining)}s</span>`;
}
function updateWorldEventBanner(state) {
  if (!state.worldEvent) { const el2 = document.getElementById('world-event-banner'); if (el2 && el2.innerHTML) renderWorldEventBanner(state); return; }
  const timerEl = document.getElementById('we-timer');
  if (timerEl) timerEl.textContent = Math.ceil(state.worldEvent.remaining) + 's';
  else renderWorldEventBanner(state);
}

function updateCrewRankNumbers(state) {
  const crewEl = document.getElementById('crew-summary');
  if (crewEl) {
    const cap = state.castaway.done ? calcCapacity(state) : 0;
    crewEl.innerHTML = state.castaway.done ? t(state, 'crew_summary', { total: state.crew.total, cap, idle: state.crew.idle }) : '';
  }
  const rankEl = document.getElementById('rank-summary');
  if (rankEl) {
    if (!state.castaway.done) { rankEl.innerHTML = ''; }
    else {
      const rank = rankName(state, state.rankIndex);
      const clsKey = state.class === 'corsair' ? 'class_corsair' : (state.class === 'pirate' ? 'class_pirate' : 'class_none');
      const clsCss = state.class || 'none';
      rankEl.innerHTML = `<button class="rank-chip" data-action="open-rank-modal">${rank}</button> <span class="class-tag class-${clsCss}">${t(state, clsKey)}</span> — ${islandBaseName(state)}`;
    }
  }
}

// ---------- Náufrago ----------

function renderCastawayScreen(state) {
  const c = state.castaway;
  const upgrades = CASTAWAY_UPGRADES.map(u => {
    const bought = !!c.upgrades[u.id];
    const afford = canAffordCastaway(state, u.cost);
    const costStr = Object.keys(u.cost).map(k => `${k === 'wood' ? '🪵' : '🔩'}${u.cost[k]}`).join(' ');
    return `
      <button class="btn small castaway-upgrade" data-action="castaway-upgrade" data-id="${u.id}" ${bought || !afford ? 'disabled' : ''}>
        ${bought ? '✅ ' : ''}${L(state, u, 'name')} <span class="muted">(${costStr})</span>
      </button>`;
  }).join('');

  const campAfford = canAffordCastaway(state, CASTAWAY_CAMP_COST);
  const raftAfford = c.campDone && canAffordCastaway(state, CASTAWAY_RAFT_COST);

  return `
    <div class="panel castaway-panel">
      <h2>${t(state, 'castaway_title')}</h2>
      <p>${t(state, 'castaway_text')}</p>
      <div class="castaway-resources">
        <div class="castaway-res">🪵 <span id="castaway-wood">${fmt(c.wood)}</span></div>
        <div class="castaway-res">🔩 <span id="castaway-scrap">${fmt(c.scrap)}</span></div>
      </div>
      <div class="castaway-gather-row">
        <button class="btn castaway-gather" data-action="gather" data-key="wood">🪵 ${t(state, 'gather_wood')} (+<span id="castaway-woodclick">${c.woodClick}</span>)</button>
        <button class="btn castaway-gather" data-action="gather" data-key="scrap">🔩 ${t(state, 'gather_scrap')} (+<span id="castaway-scrapclick">${c.scrapClick}</span>)</button>
      </div>
      <div class="castaway-upgrades">${upgrades}</div>
      <hr class="castaway-divider">
      ${!c.campDone
        ? `<p class="muted">${t(state, 'castaway_camp_hint')} (🪵${CASTAWAY_CAMP_COST.wood} 🔩${CASTAWAY_CAMP_COST.scrap})</p>
           <button class="btn" data-action="build-camp" ${!campAfford ? 'disabled' : ''}>${t(state, 'btn_camp')}</button>`
        : `<p class="muted">${t(state, 'castaway_raft_hint')} (🪵${CASTAWAY_RAFT_COST.wood} 🔩${CASTAWAY_RAFT_COST.scrap})</p>
           <button class="btn" data-action="build-raft" ${!raftAfford ? 'disabled' : ''}>${t(state, 'btn_raft')}</button>`}
    </div>
  `;
}

function updateCastawayNumbers(state) {
  const c = state.castaway;
  const woodEl = document.getElementById('castaway-wood');
  const scrapEl = document.getElementById('castaway-scrap');
  if (woodEl) woodEl.textContent = fmt(c.wood);
  if (scrapEl) scrapEl.textContent = fmt(c.scrap);
  document.querySelectorAll('[data-action="castaway-upgrade"]').forEach(btn => {
    const up = CASTAWAY_UPGRADES.find(u => u.id === btn.dataset.id);
    if (!up) return;
    if (!c.upgrades[up.id]) btn.disabled = !canAffordCastaway(state, up.cost);
  });
  const campBtn = document.querySelector('[data-action="build-camp"]');
  if (campBtn) campBtn.disabled = !canAffordCastaway(state, CASTAWAY_CAMP_COST);
  const raftBtn = document.querySelector('[data-action="build-raft"]');
  if (raftBtn) raftBtn.disabled = !canAffordCastaway(state, CASTAWAY_RAFT_COST);
}

// ---------- Gate de idioma ----------

function renderLanguageGate(state) {
  const container = document.getElementById('modal-container');
  container.classList.add('visible', 'gate');
  container.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-box">
        <h2>🌍 Language / Idioma</h2>
        <p>Choose your language / Escolha seu idioma</p>
        <div class="lang-choice-grid">
          <button class="btn" data-action="pick-lang" data-lang="pt">🇧🇷 Português (Brasil)</button>
          <button class="btn" data-action="pick-lang" data-lang="en">🇺🇸 English</button>
        </div>
      </div>
    </div>`;
  document.getElementById('resource-bar').innerHTML = '';
  document.getElementById('tab-nav').innerHTML = '';
  document.getElementById('tab-content').innerHTML = '';
  document.getElementById('log-box').innerHTML = '';
}

// ---------- Abas (nav) ----------

function tabUnlockReqKey(tabId) {
  return { ship: 'req_ship', crew: 'req_crew', upgrades: 'req_upgrades', island: 'req_island', exploration: 'req_exploration', fleet: 'req_fleet', quests: 'req_quests', inventory: 'req_inventory', prestige: 'req_prestige', achievements: 'req_achievements' }[tabId];
}

function renderTabsNav(state) {
  const nav = document.getElementById('tab-nav');
  const buttons = TAB_ORDER.filter(id => state.unlocked[id]).map(id => {
    const active = state.ui.activeTab === id;
    const label = t(state, 'tab_' + id);
    return `<button class="tab-btn ${active ? 'active' : ''}" data-action="switch-tab" data-tab="${id}">${label}</button>`;
  }).join('');
  const settingsActive = state.ui.activeTab === 'settings';
  nav.innerHTML = buttons + `<button class="tab-btn settings-btn ${settingsActive ? 'active' : ''}" data-action="switch-tab" data-tab="settings">${t(state, 'tab_settings')}</button>`;
}

// ---------- Navio Principal ----------

function renderShipTab(state) {
  const type = SHIP_TYPES[state.mainShip.tier];
  const nextCost = shipUpgradeCost(state);
  const nextType = SHIP_TYPES[state.mainShip.tier + 1];
  const afford = nextCost && canAfford(state, nextCost);
  const costStr = nextCost ? Object.keys(nextCost).map(k => `${RESOURCE_INFO[k].icon}${fmt(nextCost[k])}`).join(' ') : '';

  const slots = Object.keys(SLOT_INFO).filter(s => slotUnlockedByTier(state, s)).map(slot => {
    const info = SLOT_INFO[slot];
    const usable = slotUsable(state, slot);
    if (!usable) {
      return `<div class="slot locked" id="slot-row-${slot}"><span>${info.icon} ${L(state, info, 'name')}</span><span class="muted">${t(state, 'slot_locked', { n: SLOT_UNLOCK_DISTANCE[slot] })}</span></div>`;
    }
    const item = state.mainShip.equipment[slot];
    if (item) {
      return `<div class="slot filled" id="slot-row-${slot}" style="border-color:${RARITY[item.rarity].color}">
        <span>${info.icon} ${itemName(state, item)}</span>
        <button class="btn tiny" data-action="unequip" data-slot="${slot}">${t(state, 'btn_unequip')}</button>
      </div>`;
    }
    return `<div class="slot empty" id="slot-row-${slot}"><span>${info.icon} ${L(state, info, 'name')}</span></div>`;
  }).join('');

  const power = calcMainShipPower(state);

  return `
    <div class="panel">
      <h2>${t(state, 'ship_title')}</h2>
      <p><strong>${L(state, type, 'name')}</strong> — ${t(state, 'ship_power')}: <strong id="ship-power-text">${fmt(power.power)}</strong></p>
      <select data-action="set-role" class="role-select">
        <option value="ataque" ${state.mainShip.role === 'ataque' ? 'selected' : ''}>${t(state, 'role_ataque')}</option>
        <option value="producao" ${state.mainShip.role === 'producao' ? 'selected' : ''}>${t(state, 'role_producao')}</option>
        <option value="exploracao" ${state.mainShip.role === 'exploracao' ? 'selected' : ''}>${t(state, 'role_exploracao')}</option>
      </select>
      <div class="ship-slots">${slots}</div>
      <hr class="castaway-divider">
      ${nextType
        ? `<p class="muted">${t(state, 'btn_upgrade_ship')}: <strong>${L(state, nextType, 'name')}</strong> — ${costStr}</p>
           <button class="btn" id="ship-upgrade-btn" data-action="upgrade-ship" ${!afford ? 'disabled' : ''}>${t(state, 'btn_upgrade_ship')}</button>`
        : `<p class="muted">★ Max</p>`}
    </div>
  `;
}

function updateShipLiveState(state) {
  const power = calcMainShipPower(state);
  const powerEl = document.getElementById('ship-power-text');
  if (powerEl) powerEl.textContent = fmt(power.power);
  const upBtn = document.getElementById('ship-upgrade-btn');
  if (upBtn) {
    const cost = shipUpgradeCost(state);
    upBtn.disabled = !cost || !canAfford(state, cost);
  }
  Object.keys(SLOT_INFO).forEach(slot => {
    const row = document.getElementById('slot-row-' + slot);
    if (!row) return;
    if (row.classList.contains('locked') && slotUsable(state, slot)) fullRender(state);
  });
}

// ---------- Tripulação ----------

function renderCrewTab(state) {
  let automationNote = '';
  if (state.automation.autoAssignCrew) automationNote += `<p class="muted automation-note">${t(state, 'automation_active')}</p>`;
  if (state.automation.autoAssignAdvanced) automationNote += `<p class="muted automation-note">${t(state, 'automation_advanced')}</p>`;
  return `
    <div class="panel">
      <h2>${t(state, 'crew_title')}</h2>
      ${automationNote}
      <h3>${t(state, 'crew_assign_title')}</h3>
      ${renderCrewAssignRow(state, 'looters', t(state, 'job_looters'), RESOURCE_INFO.gold.icon)}
      ${renderCrewAssignRow(state, 'carpenters', t(state, 'job_carpenters'), RESOURCE_INFO.wood.icon)}
      ${renderCrewAssignRow(state, 'distillers', t(state, 'job_distillers'), RESOURCE_INFO.rum.icon)}
      ${renderCrewAssignRow(state, 'combat', t(state, 'job_combat'), '⚔️')}
      <hr class="castaway-divider">
      <button class="btn" data-action="collect-resources">🧺 ${t(state, 'collect_resources_btn')}</button>
      <p class="muted">${t(state, 'collect_resources_hint')}</p>
      <button class="btn" data-action="work-deck">${t(state, 'work_deck_btn')}</button>
      <p class="muted">${t(state, 'work_deck_hint')}</p>
    </div>
  `;
}

function renderCrewAssignRow(state, job, label, icon) {
  return `
    <div class="crew-row">
      <div class="crew-label">${label} <span class="muted">(${icon})</span></div>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="-5">-5</button>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="-1">-1</button>
      <span class="crew-count" id="crew-count-${job}">${state.crew[job]}</span>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="1">+1</button>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="5">+5</button>
    </div>`;
}

function updateCrewLiveState(state) {
  ['looters', 'carpenters', 'distillers', 'combat'].forEach(job => {
    const elc = document.getElementById('crew-count-' + job);
    if (elc) elc.textContent = state.crew[job];
  });
}

// ---------- Árvore de Melhorias ----------

function nodeMissingPrereqNames(state, node) {
  return node.prereq.filter(id => !isNodeBought(state, id)).map(id => {
    const n = UPGRADE_TREE.find(x => x.id === id);
    return n ? L(state, n, 'name') : id;
  });
}

function renderUpgradesTab(state) {
  const memo = {};
  const sorted = UPGRADE_TREE.slice().sort((a, b) => nodeDepth(a.id, memo) - nodeDepth(b.id, memo));
  const cols = {};
  sorted.forEach(n => { const d = nodeDepth(n.id, memo); (cols[d] = cols[d] || []).push(n); });
  const colsHtml = Object.keys(cols).sort((a, b) => a - b).map(depth => {
    const nodesHtml = cols[depth].map(node => {
      const bought = isNodeBought(state, node.id);
      const prereqOk = nodePrereqMet(state, node);
      const afford = canAfford(state, node.cost);
      const costStr = Object.keys(node.cost).map(k => `${RESOURCE_INFO[k].icon}${fmt(node.cost[k])}`).join(' ');
      let statusHtml;
      if (bought) statusHtml = `<div class="node-status bought">${t(state, 'node_bought')}</div>`;
      else if (!prereqOk) statusHtml = `<div class="node-status locked">${t(state, 'node_locked', { req: nodeMissingPrereqNames(state, node).join(', ') })}</div>`;
      else statusHtml = `<div class="cost">${costStr}</div><button class="btn small" id="node-buy-${node.id}" data-action="buy-node2" data-id="${node.id}" ${!afford ? 'disabled' : ''}>${t(state, 'btn_buy')}</button>`;
      return `
        <div class="upgrade-node ${bought ? 'bought' : (!prereqOk ? 'locked' : '')} ${node.permanent ? 'perma' : ''}">
          <div class="upgrade-node-head">${node.icon} <strong>${L(state, node, 'name')}</strong> ${node.permanent ? `<span class="perma-tag">${t(state, 'permanent_tag')}</span>` : ''}</div>
          <div class="upgrade-node-desc">${L(state, node, 'desc')}</div>
          ${statusHtml}
        </div>`;
    }).join('');
    return `<div class="upgrade-col">${nodesHtml}</div>`;
  }).join('');

  return `
    <div class="panel">
      <h2>${t(state, 'upgrades_title')}</h2>
      <p class="muted">${t(state, 'upgrades_desc')}</p>
      <div class="upgrade-tree">${colsHtml}</div>
    </div>
  `;
}
function updateUpgradesLiveState(state) {
  UPGRADE_TREE.forEach(node => {
    const btn = document.getElementById('node-buy-' + node.id);
    if (btn) btn.disabled = !canAfford(state, node.cost);
  });
}

// ---------- Ilha ----------

function renderIslandTab(state) {
  const rows = BUILDINGS.map((b, idx) => {
    const unlocked = idx < state.island.sectorsUnlocked;
    const lvl = state.island.buildings[b.id] || 0;
    const cost = buildingCostFor(state, b.id);
    const afford = canAfford(state, cost);
    const costStr = Object.keys(cost).map(k => `${RESOURCE_INFO[k].icon}${fmt(cost[k])}`).join(' ');
    return `
      <div class="building-row ${!unlocked ? 'locked' : ''}">
        <div class="building-icon">${b.icon}</div>
        <div class="building-info">
          <div class="building-name">${buildingDisplayName(state, b.id)} <span class="muted">Nv. ${lvl}</span></div>
          <div class="building-desc">${L(state, b, 'desc')}</div>
        </div>
        <div class="building-action">
          ${unlocked
            ? `<div class="cost">${costStr}</div>
               <div class="building-buy-controls">
                 <button class="btn tiny" data-action="upgrade-building-bulk" data-id="${b.id}" data-amount="1">+1</button>
                 <button class="btn tiny" data-action="upgrade-building-bulk" data-id="${b.id}" data-amount="10">+10</button>
                 <button class="btn tiny" data-action="upgrade-building-bulk" data-id="${b.id}" data-amount="25">+25</button>
                 <button class="btn tiny" data-action="upgrade-building-bulk" data-id="${b.id}" data-amount="100">+100</button>
                 <button class="btn tiny" data-action="upgrade-building-bulk" data-id="${b.id}" data-amount="max">${t(state, 'btn_max')}</button>
               </div>`
            : `<span class="muted">🔒</span>`}
        </div>
      </div>`;
  }).join('');

  const expandCost = islandExpandCost(state);
  const canExpand = state.island.sectorsUnlocked < BUILDINGS.length;
  const expandCostStr = Object.keys(expandCost).map(k => `${RESOURCE_INFO[k].icon}${fmt(expandCost[k])}`).join(' ');

  return `
    <div class="panel">
      <h2>${islandBaseName(state)}</h2>
      <p class="muted">${t(state, 'island_sectors')}: ${state.island.sectorsUnlocked}/${BUILDINGS.length}</p>
      ${(() => {
        const warehouseLvl = state.island.buildings.warehouse || 0;
        const currentCap = getStorageLimit(state, 'gold');
        const nextCap = Math.floor(BASE_STORAGE_LIMIT * buildingDef('warehouse').effect(warehouseLvl + 1));
        const capBonus = Math.round((buildingDef('warehouse').effect(warehouseLvl) - 1) * 100);
        const nextBonus = Math.round((buildingDef('warehouse').effect(warehouseLvl + 1) - 1) * 100);
        return `<div class="warehouse-summary" title="${t(state, 'warehouse_tooltip', { level: warehouseLvl, current: fmt(currentCap), next: fmt(nextCap), bonus: capBonus, nextBonus: nextBonus })}">
          <strong>📦 ${t(state, 'warehouse_capacity')}</strong>
          <span>${fmt(currentCap)} ${t(state, 'warehouse_capacity_of')} ${fmt(nextCap)}</span>
          <span class="muted">+${capBonus}% ${t(state, 'warehouse_bonus')} · ${t(state, 'warehouse_next')}: +${nextBonus}%</span>
        </div>`;
      })()}
      ${!state.unlocked.crew ? `<button class="btn" data-action="collect-resources">🧺 ${t(state, 'collect_resources_btn')}</button><p class="muted">${t(state, 'collect_resources_hint')}</p>` : ''}
      ${canExpand
        ? `<button class="btn" data-action="expand-island" ${!canAfford(state, expandCost) ? 'disabled' : ''}>${t(state, 'btn_expand_island')} — ${expandCostStr}</button>`
        : `<p class="muted">${t(state, 'island_fully_expanded')}</p>`}
    </div>
    <div class="panel">
      <h2>${t(state, 'buildings_title')}</h2>
      <div class="building-list">${rows}</div>
    </div>
  `;
}

// ---------- Exploração (mapa) ----------

function renderExplorationTab(state) {
  if (!state.map) return '';
  const power = calcFleetPower(state);
  const combatCrewPower = state.crew.combat * 2.5;
  const totalPower = power.power + combatCrewPower;
  const pct = Math.max(0, Math.min(100, 100 - (state.combatTimer / 4) * 100));
  const peek = watchtowerPeek(state);

  const cellIcons = Object.assign({ empty: '🌊', enemy: '⚔️', loot: '🎁', boss: '💀', unknown: '❔' },
    Object.fromEntries(MAP_EVENT_TYPES.map(k => [k, EVENT_INFO[k].icon])));

  const cellsHtml = state.map.cells.map((cell, i) => {
    let shown = 'unknown';
    let cls = 'unknown';
    if (i < state.cellIndex) { shown = cell.type; cls = 'done ' + cell.type; }
    else if (i === state.cellIndex) { shown = cell.type; cls = 'current ' + cell.type; }
    else if (i <= state.cellIndex + peek) { shown = cell.type; cls = 'peek ' + cell.type; }
    return `<div class="map-cell ${cls}">${cellIcons[shown]}</div>`;
  }).join('');

  const cell = currentCell(state);
  const data = cell ? getCellData(state.totalDistance, cell.type, cell.bossId) : null;
  const isBattleCell = cell && isBattleCellType(cell.type);
  const isEventCell = cell && isEventCellType(cell.type);
  let extraInfo = '';
  if (cell && cell.type === 'boss' && data.boss) {
    extraInfo = `<div class="boss-banner"><span class="boss-icon">${data.boss.icon}</span> <strong>${L(state, data.boss, 'name')}</strong><br><span class="muted">${L(state, data.boss, 'desc')}</span></div>`;
  } else if (isEventCell) {
    extraInfo = `<div class="event-banner">${EVENT_INFO[cell.type].icon} <strong>${L(state, EVENT_INFO[cell.type], 'name')}</strong></div>`;
  }
  const winChance = data && !(data.boss && data.boss.hidePower) ? Math.round(clamp(totalPower / (totalPower + data.enemyPower), 0.05, 0.97) * 100) : null;

  return `
    <div class="panel">
      <h2>${t(state, 'exploration_title')}</h2>
      <p class="muted">${t(state, 'map_label', { n: state.map.number })} — ${t(state, 'cell_label', { cur: state.cellIndex + 1, total: state.map.length })}</p>
      <div class="map-track">${cellsHtml}</div>
      ${extraInfo}
      <div class="island-card ${cell && cell.type === 'boss' ? 'boss' : ''}">
        ${isBattleCell ? `
          <div class="island-stats">
            <div>${t(state, 'enemy_power')}: <strong>${(data.boss && data.boss.hidePower) ? '???' : fmt(data.enemyPower)}</strong></div>
            <div>${t(state, 'your_power')}: <strong>${fmt(totalPower)}</strong></div>
            <div>${t(state, 'win_chance')}: <strong>${winChance === null ? '???' : winChance + '%'}</strong></div>
          </div>` : (isEventCell ? '' : `<p class="muted">${cell ? (cell.type === 'loot' ? '🎁' : '🌊') : ''}</p>`)}
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <button class="btn" data-action="reinforce">${t(state, 'reinforce_btn')}</button>
      <p class="muted">${t(state, 'reinforce_hint')}</p>
    </div>
  `;
}

// ---------- Frota de Apoio ----------

function renderFleetTab(state) {
  const rows = SUPPORT_FLEET_TYPES.map(type => {
    const owned = state.supportFleet[type.id] || 0;
    const cost = {};
    for (const k in type.buildCost) cost[k] = Math.ceil(type.buildCost[k] * Math.pow(type.costMult, owned));
    const afford = canAfford(state, cost);
    const costStr = Object.keys(cost).map(k => `${RESOURCE_INFO[k].icon}${fmt(cost[k])}`).join(' ');
    let bonusText = '';
    if (type.power) bonusText = `⚔️ +${type.power}`;
    else if (type.prodBonusPerUnit) bonusText = `+${Math.round(type.prodBonusPerUnit * 100)}% ${t(state, 'job_looters')}/${t(state, 'job_carpenters')}...`;
    else if (type.itemBonusPerUnit) bonusText = `+${Math.round(type.itemBonusPerUnit * 100)}% 🎁`;
    return `
      <div class="ship-type-row" id="support-row-${type.id}">
        <div class="ship-type-name">${type.icon} ${L(state, type, 'name')} <span class="muted">(${owned})</span></div>
        <div class="ship-type-stats">${bonusText}</div>
        <div class="ship-type-cost">${costStr}</div>
        <button class="btn small" id="support-buy-${type.id}" data-action="buy-support" data-id="${type.id}" ${!afford ? 'disabled' : ''}>${t(state, 'btn_buy')}</button>
      </div>`;
  }).join('');

  return `
    <div class="panel">
      <h2>${t(state, 'fleet_title')}</h2>
      <p class="muted">${t(state, 'fleet_desc')}</p>
      <div class="ship-type-list">${rows}</div>
    </div>
  `;
}
function updateSupportFleetLiveState(state) {
  SUPPORT_FLEET_TYPES.forEach(type => {
    const btn = document.getElementById('support-buy-' + type.id);
    if (!btn) return;
    const owned = state.supportFleet[type.id] || 0;
    const cost = {};
    for (const k in type.buildCost) cost[k] = Math.ceil(type.buildCost[k] * Math.pow(type.costMult, owned));
    btn.disabled = !canAfford(state, cost);
  });
}

// ---------- Missões / Contratos ----------

function renderQuestsTab(state) {
  const active = state.quests.map(q => {
    const done = checkQuest(state, q);
    const rewardStr = Object.keys(q.reward).map(k => k === 'item' ? '🎁' : `${RESOURCE_INFO[k].icon}${fmt(q.reward[k])}`).join(' ');
    return `
      <div class="quest-row ${done ? 'done' : ''}">
        <div class="quest-desc">${questLabel(state, q)}</div>
        <div class="quest-reward">${rewardStr}</div>
        <button class="btn small" data-action="claim-quest" data-id="${q.id}" id="quest-claim-${q.id}" ${!done ? 'disabled' : ''}>${done ? t(state, 'btn_claim') : '…'}</button>
      </div>`;
  }).join('');

  const pool = state.questPool.map(q => {
    const rewardStr = Object.keys(q.reward).map(k => k === 'item' ? '🎁' : `${RESOURCE_INFO[k].icon}${fmt(q.reward[k])}`).join(' ');
    const full = state.quests.length >= QUEST_SLOTS;
    return `
      <div class="quest-row pool">
        <div class="quest-desc">${questLabel(state, q)}</div>
        <div class="quest-reward">${rewardStr}</div>
        <button class="btn small" data-action="accept-quest" data-id="${q.id}" ${full ? 'disabled' : ''}>${t(state, 'btn_accept')}</button>
      </div>`;
  }).join('');

  const contracts = state.contracts.map(c => {
    const costStr = Object.keys(c.cost).map(k => `${RESOURCE_INFO[k].icon}${fmt(c.cost[k])}`).join(' ');
    const rewardStr = Object.keys(c.reward).map(k => `${RESOURCE_INFO[k].icon}${fmt(c.reward[k])}`).join(' ');
    const afford = canAfford(state, c.cost);
    return `
      <div class="quest-row">
        <div class="quest-desc"><strong>${L(state, c.tpl, 'name')}</strong><br><span class="muted">${costStr}</span></div>
        <div class="quest-reward">${rewardStr}</div>
        <button class="btn small" data-action="complete-contract" data-id="${c.id}" id="contract-complete-${c.id}" ${!afford ? 'disabled' : ''}>${t(state, 'btn_complete')}</button>
      </div>`;
  }).join('');

  return `
    <div class="panel">
      <h2>${t(state, 'quests_active')} (${state.quests.length}/${QUEST_SLOTS})</h2>
      <div class="quest-list">${active || '<p class="muted">—</p>'}</div>
    </div>
    <div class="panel">
      <h2>${t(state, 'quests_title')}</h2>
      <div class="quest-list">${pool}</div>
    </div>
    <div class="panel">
      <h2>${t(state, 'contracts_title')} (${state.contracts.length}/${CONTRACT_SLOTS})</h2>
      <div class="quest-list">${contracts}</div>
    </div>
    ${renderFactionsPanel(state)}
  `;
}

function updateQuestsLiveState(state) {
  state.quests.forEach(q => {
    const btn = document.getElementById('quest-claim-' + q.id);
    if (!btn) return;
    const done = checkQuest(state, q);
    btn.disabled = !done;
    btn.textContent = done ? t(state, 'btn_claim') : '…';
    btn.closest('.quest-row').classList.toggle('done', done);
  });
  state.contracts.forEach(c => {
    const btn = document.getElementById('contract-complete-' + c.id);
    if (btn) btn.disabled = !canAfford(state, c.cost);
  });
}

// ---------- Inventário ----------

function renderInventoryTab(state) {
  if (!state.inventory.length) {
    return `<div class="panel"><h2>${t(state, 'inventory_title')}</h2><p class="muted">${t(state, 'inventory_empty')}</p></div>`;
  }
  const items = state.inventory.slice().sort((a, b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity)).map(item => `
    <div class="item-card" style="border-color:${RARITY[item.rarity].color}">
      <div class="item-name" style="color:${RARITY[item.rarity].color}">${SLOT_INFO[item.slot].icon} ${itemName(state, item)}</div>
      <div class="item-meta">${L(state, RARITY[item.rarity], 'name')} · ${fmt(item.value)}</div>
      <div class="item-actions">
        <button class="btn tiny" data-action="equip" data-item="${item.uid}">${t(state, 'btn_equip')}</button>
        <button class="btn tiny ghost" data-action="scrap" data-item="${item.uid}">${t(state, 'btn_scrap')}</button>
      </div>
    </div>`).join('');
  return `<div class="panel"><h2>${t(state, 'inventory_title')}</h2><div class="item-grid">${items}</div></div>`;
}

// ---------- Prestígio ----------

function renderPrestigeTab(state) {
  const eligible = canPrestige(state);
  const projected = calcDoubloonGain(state);

  const relicsGrid = RELICS.map(r => {
    const owned = state.relics.includes(r.id);
    return `
      <div class="relic-card ${owned ? 'owned' : 'locked'}">
        <div class="relic-icon">${owned ? r.icon : '❔'}</div>
        <div class="relic-name">${owned ? L(state, r, 'name') : '???'}</div>
        <div class="relic-desc">${owned ? L(state, r, 'desc') : ''}</div>
      </div>`;
  }).join('');

  const treesHtml = ['general', 'pirate', 'corsair'].map(treeName => {
    const label = treeName === 'general' ? t(state, 'trees_title') : (treeName === 'pirate' ? '🏴‍☠️' : '⚜️');
    const locked = treeName !== 'general' && state.class !== treeName;
    const nodes = PRESTIGE_TREES[treeName].map(node => {
      const lvl = (state.prestige.trees[treeName] && state.prestige.trees[treeName][node.id]) || 0;
      const maxed = lvl >= node.max;
      const cost = nodeCost(node, lvl);
      const affordNode = state.prestige.doubloons >= cost;
      return `
        <div class="node-row">
          <div class="node-info">
            <div class="node-name">${L(state, node, 'name')} <span class="muted">${lvl}/${node.max}</span></div>
            <div class="node-desc">${L(state, node, 'desc')}</div>
          </div>
          <button class="btn tiny" data-action="buy-node" data-tree="${treeName}" data-node="${node.id}" ${maxed || !affordNode ? 'disabled' : ''}>${maxed ? '★' : `💰${cost}`}</button>
        </div>`;
    }).join('');
    return `
      <div class="tree-panel ${locked ? 'locked' : ''}">
        <h3>${label}</h3>
        ${locked ? '' : nodes}
      </div>`;
  }).join('');

  return `
    <div class="panel">
      <h2>${t(state, 'prestige_title')}</h2>
      <p class="muted">${t(state, 'prestige_desc')}</p>
      <p>${t(state, 'prestige_current')}: <strong>${fmt(state.prestige.doubloons)}</strong> &nbsp;·&nbsp; ${t(state, 'prestige_projected')}: <strong>+${fmt(projected)}</strong></p>
      <button class="btn" data-action="open-prestige-modal" ${!eligible ? 'disabled' : ''}>${eligible ? t(state, 'btn_prestige') : t(state, 'locked_prefix') + t(state, 'req_prestige')}</button>
    </div>
    <div class="panel">
      <h2>${t(state, 'trees_title')}</h2>
      <div class="trees-grid">${treesHtml}</div>
    </div>
    <div class="panel">
      <h2>${t(state, 'relics_title')} (${state.relics.length}/${RELICS.length})</h2>
      <div class="relic-grid">${relicsGrid}</div>
    </div>
  `;
}

// Painel de Facções — mora na aba Missões (é lá que a reputação começa a
// mudar de verdade, pelos contratos, bem antes do Prestígio destravar).
function renderFactionsPanel(state) {
  const factionsHtml = FACTIONS.map(f => {
    const rep = state.factions[f.id] || 0;
    const standing = factionStanding(rep);
    const pct = ((rep + 100) / 200) * 100;
    return `
      <div class="faction-row">
        <div class="faction-label">${f.icon} ${L(state, f, 'name')} <span class="muted">(${L(state, standing, 'label')})</span></div>
        <div class="faction-bar"><div class="faction-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');
  return `
    <div class="panel">
      <h2>${t(state, 'factions_title')}</h2>
      <p class="muted">${t(state, 'factions_desc')}</p>
      <div class="faction-list">${factionsHtml}</div>
    </div>
  `;
}

// ---------- Conquistas ----------

function renderAchievementsTab(state) {
  const unlockedCount = ACHIEVEMENTS.filter(a => state.achievements[a.id]).length;
  const cards = ACHIEVEMENTS.map(a => {
    const done = !!state.achievements[a.id];
    const bonusText = `+${Math.round(a.effect.value * 100)}% ${t(state, 'effect_' + a.effect.type)}`;
    return `
      <div class="achievement-card ${done ? 'done' : 'locked'}">
        <div class="achievement-icon">${done ? a.icon : '❔'}</div>
        <div class="achievement-name">${done ? L(state, a, 'name') : '???'}</div>
        <div class="achievement-desc">${done ? L(state, a, 'desc') : ''}</div>
        ${done ? `<div class="achievement-bonus">${bonusText}</div>` : ''}
      </div>`;
  }).join('');
  return `
    <div class="panel">
      <h2>${t(state, 'achievements_title')} (${unlockedCount}/${ACHIEVEMENTS.length})</h2>
      <p class="muted">${t(state, 'achievements_desc')}</p>
      <div class="achievement-grid">${cards}</div>
    </div>
  `;
}

// ---------- Diário de Bordo ----------

function renderJournalTab(state) {
  const entries = STORY_ENTRIES.filter(e => storyHasSeen(state, e.id));
  const grouped = [];
  for (const entry of entries) {
    let group = grouped.find(g => g.act === entry.act);
    if (!group) { group = { act: entry.act, entries: [] }; grouped.push(group); }
    group.entries.push(entry);
  }
  const html = grouped.map(group => {
    const actEntry = STORY_ENTRIES.find(e => e.id === ['act1','act2','act3','act4','act5'][group.act - 1]);
    const title = actEntry ? L(state, actEntry, 'title') : `${t(state, 'journal_act')} ${group.act}`;
    return `<section class="journal-act"><h3>${title}</h3>${group.entries.map(entry => {
      const text = L(state, entry, 'text').replace(/\n\n/g, '<br><br>');
      return `<article class="journal-entry"><div class="journal-entry-title">${L(state, entry, 'title')}</div><p>${text}</p></article>`;
    }).join('')}</section>`;
  }).join('');
  return `<div class="panel journal-panel"><h2>${t(state, 'journal_title')}</h2><p class="muted">${t(state, 'journal_desc')}</p>${html || `<p class="muted">${t(state, 'journal_empty')}</p>`}</div>`;
}

// ---------- Configurações ----------

function renderSettingsTab(state) {
  const lang = state.settings.lang;
  const theme = state.settings.theme || 'dark';
  const changelogHtml = CHANGELOG_ENTRIES.map(entry => {
    const items = (state.settings.lang === 'en' ? entry.en : entry.pt).map(line => `<li>${line}</li>`).join('');
    return `<div class="changelog-entry"><h4>v${entry.version} <span class="muted">(${entry.date})</span></h4><ul>${items}</ul></div>`;
  }).join('');

  return `
    <div class="panel">
      <h2>${t(state, 'settings_title')}</h2>
      <h3>${t(state, 'settings_lang')}</h3>
      <button class="btn small ${lang === 'pt' ? 'active-choice' : ''}" data-action="pick-lang" data-lang="pt">🇧🇷 Português</button>
      <button class="btn small ${lang === 'en' ? 'active-choice' : ''}" data-action="pick-lang" data-lang="en">🇺🇸 English</button>
    </div>
    <div class="panel">
      <h3>${t(state, 'settings_theme')}</h3>
      <button class="btn small ${theme === 'dark' ? 'active-choice' : ''}" data-action="pick-theme" data-theme="dark">${t(state, 'theme_dark')}</button>
      <button class="btn small ${theme === 'light' ? 'active-choice' : ''}" data-action="pick-theme" data-theme="light">${t(state, 'theme_light')}</button>
      <button class="btn small ${theme === 'sepia' ? 'active-choice' : ''}" data-action="pick-theme" data-theme="sepia">${t(state, 'theme_sepia')}</button>
      <button class="btn small ${theme === 'white' ? 'active-choice' : ''}" data-action="pick-theme" data-theme="white">${t(state, 'theme_white')}</button>
    </div>
    <div class="panel">
      <h3>${t(state, 'settings_story_mode')}</h3>
      <label class="toggle-row">
        <input type="checkbox" data-action="toggle-reduced-story" ${state.settings.reducedStoryModals ? 'checked' : ''}>
        <span><strong>${t(state, 'settings_reduced_story')}</strong><br><span class="muted">${t(state, 'settings_reduced_story_desc')}</span></span>
      </label>
    </div>
    <div class="panel">
      <h3>${t(state, 'settings_save')}</h3>
      <button class="btn small" data-action="export-save">${t(state, 'btn_export')}</button>
      <label class="btn small ghost" style="cursor:pointer;">${t(state, 'btn_import')}<input type="file" id="import-file-input" accept=".json" style="display:none"></label>
      <button class="btn small danger" data-action="hard-reset">${t(state, 'btn_reset')}</button>
    </div>
    <div class="panel">
      <h3>${t(state, 'settings_community')}</h3>
      <div class="community-links">
        <a class="community-link" href="https://patreon.com/darkaos?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink" target="_blank" rel="noopener noreferrer" title="Patreon">🅿️ <span>Patreon</span></a>
        <a class="community-link" href="https://discord.gg/CfSeap8Dt" target="_blank" rel="noopener noreferrer" title="Discord">💬 <span>Discord</span></a>
      </div>
    </div>
    <div class="panel">
      <h3>${t(state, 'settings_changelog')}</h3>
      <div class="changelog-list">${changelogHtml}</div>
    </div>
  `;
}

// ---------- Log ----------

function renderLog(state) {
  const box = document.getElementById('log-box');
  box.innerHTML = state.log.map(e => `<div class="log-line">${e.msg}</div>`).join('');
}

// ---------- Modais ----------

function renderModal(state) {
  const container = document.getElementById('modal-container');
  container.classList.remove('gate');
  if (!state.ui.modal) { container.innerHTML = ''; container.classList.remove('visible'); return; }
  container.classList.add('visible');
  if (state.ui.modal === 'story-act') {
    const entry = STORY_ENTRIES.find(e => e.id === state.ui.storyActId);
    if (!entry) { state.ui.modal = null; container.innerHTML = ''; container.classList.remove('visible'); return; }
    const text = L(state, entry, 'text').split('\n\n')[0];
    container.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal-box story-act-modal" data-stop-close>
          <div class="story-act-kicker">${t(state, 'journal_new_act')}</div>
          <h2>${L(state, entry, 'title')}</h2>
          <p class="story-act-quote">${text}</p>
          <p class="muted">📖 ${t(state, 'journal_new_entry')}</p>
          <div class="story-act-actions">
            <button class="btn" data-action="open-journal-later">📖 ${t(state, 'btn_read_journal')}</button>
            <button class="btn ghost" data-action="close-modal">${t(state, 'btn_read_later')}</button>
          </div>
        </div>
      </div>`;
  } else if (state.ui.modal === 'prestige-choice') {
    container.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal-box" data-stop-close>
          <h2>${t(state, 'modal_class_title')}</h2>
          <p class="muted">${t(state, 'modal_class_desc')}</p>
          <div class="class-choice-grid">
            <div class="class-choice">
              <h3>🏴‍☠️ ${t(state, 'class_pirate')}</h3>
              <p>${t(state, 'class_pirate_desc')}</p>
              <button class="btn" data-action="confirm-prestige" data-class="pirate">${t(state, 'btn_flag_pirate')}</button>
            </div>
            <div class="class-choice">
              <h3>⚜️ ${t(state, 'class_corsair')}</h3>
              <p>${t(state, 'class_corsair_desc')}</p>
              <button class="btn" data-action="confirm-prestige" data-class="corsair">${t(state, 'btn_flag_corsair')}</button>
            </div>
          </div>
          <button class="btn ghost small" data-action="close-modal">${t(state, 'btn_cancel')}</button>
        </div>
      </div>`;
  } else if (state.ui.modal === 'rank') {
    const rows = RANKS.map((r, i) => {
      const name = i >= RANKS.length - 2 && state.class === 'corsair' && r.nameCorsair ? L(state, r, 'nameCorsair') : L(state, r, 'name');
      const cur = i === state.rankIndex;
      const done = i <= state.rankIndex;
      return `<div class="rank-row ${cur ? 'current' : ''} ${done ? 'done' : ''}">
        <span class="rank-name">${done ? '⭐' : '☆'} ${name}</span>
        <span class="muted">${fmt(r.fame)} ${RESOURCE_INFO.fame.icon} · +${Math.round(r.bonus * 100)}%</span>
      </div>`;
    }).join('');
    container.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal-box" data-stop-close>
          <h2>${t(state, 'rank_modal_title')}</h2>
          <div class="rank-list">${rows}</div>
          <button class="btn ghost small" data-action="close-modal">${t(state, 'btn_close')}</button>
        </div>
      </div>`;
  }
}

// ---------- Eventos ----------

function bindEvents() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) {
      if (e.target.closest('.modal-backdrop') && !e.target.closest('[data-stop-close]')) {
        STATE.ui.modal = null; fullRender(STATE);
      }
      return;
    }
    const action = btn.dataset.action;
    switch (action) {
      case 'pick-lang': STATE.settings.lang = btn.dataset.lang; STATE.unlocked.journal = true; ensureQuestPool(STATE); ensureContracts(STATE); if (!STATE.log.length) logKey(STATE, 'log_welcome'); fullRender(STATE); break;
      case 'pick-theme': STATE.settings.theme = btn.dataset.theme; fullRender(STATE); break;
      case 'dismiss-hint': STATE.hints[btn.dataset.key] = true; fullRender(STATE); break;
      case 'gather': gatherManual(STATE, btn.dataset.key); updateCastawayNumbers(STATE); return;
      case 'castaway-upgrade': buyCastawayUpgrade(STATE, btn.dataset.id); fullRender(STATE); break;
      case 'build-camp': buildCamp(STATE); fullRender(STATE); break;
      case 'build-raft': buildFirstRaft(STATE); fullRender(STATE); break;
      case 'switch-tab': STATE.ui.activeTab = btn.dataset.tab; fullRender(STATE); break;
      case 'upgrade-ship': upgradeMainShip(STATE); fullRender(STATE); break;
      case 'assign': assignCrew(STATE, btn.dataset.job, parseInt(btn.dataset.delta, 10)); updateCrewLiveState(STATE); break;
      case 'collect-resources': collectManualResources(STATE); return;
      case 'work-deck': workTheDeck(STATE); return;
      case 'reinforce': reinforceAttack(STATE); return;
      case 'upgrade-building': upgradeBuilding(STATE, btn.dataset.id); fullRender(STATE); break;
      case 'upgrade-building-bulk': upgradeBuildingBulk(STATE, btn.dataset.id, btn.dataset.amount); fullRender(STATE); break;
      case 'expand-island': expandIsland(STATE); fullRender(STATE); break;
      case 'buy-support': buySupportShip(STATE, btn.dataset.id); fullRender(STATE); break;
      case 'buy-node2': buyUpgradeNode(STATE, btn.dataset.id); fullRender(STATE); break;
      case 'equip': autoEquip(STATE, btn.dataset.item); fullRender(STATE); break;
      case 'unequip': unequipItem(STATE, btn.dataset.slot); fullRender(STATE); break;
      case 'scrap': scrapItem(STATE, btn.dataset.item); fullRender(STATE); break;
      case 'accept-quest': acceptQuest(STATE, btn.dataset.id); fullRender(STATE); break;
      case 'claim-quest': claimQuest(STATE, btn.dataset.id); fullRender(STATE); break;
      case 'complete-contract': completeContract(STATE, btn.dataset.id); fullRender(STATE); break;
      case 'buy-node': buyPrestigeNode(STATE, btn.dataset.tree, btn.dataset.node); fullRender(STATE); break;
      case 'open-prestige-modal': if (canPrestige(STATE)) { STATE.ui.modal = 'prestige-choice'; fullRender(STATE); } break;
      case 'confirm-prestige': doPrestige(STATE, btn.dataset.class); STATE.ui.modal = null; fullRender(STATE); break;
      case 'open-rank-modal': STATE.ui.modal = 'rank'; fullRender(STATE); break;
      case 'open-journal-later': STATE.ui.modal = null; STATE.ui.storyActId = null; STATE.ui.activeTab = 'journal'; fullRender(STATE); break;
      case 'close-modal': STATE.ui.modal = null; STATE.ui.storyActId = null; fullRender(STATE); break;
      case 'export-save': exportSave(STATE); break;
      case 'hard-reset': hardReset(); return;
    }
    saveGame(STATE);
  });

  document.body.addEventListener('change', (e) => {
    if (e.target.matches('[data-action="toggle-reduced-story"]')) {
      STATE.settings.reducedStoryModals = !!e.target.checked;
      saveGame(STATE);
      return;
    }
    if (e.target.matches('[data-action="set-role"]')) {
      STATE.mainShip.role = e.target.value;
      saveGame(STATE);
    }
    if (e.target.id === 'import-file-input') {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { try { importSaveFromText(reader.result); } catch (err) { alert('Invalid save file / Arquivo de save inválido.'); } };
      reader.readAsText(file);
    }
  });
}
