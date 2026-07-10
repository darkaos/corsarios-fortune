// ============================================================
// Corsário's Fortune — Alpha 0.01
// ui.js — construção do HTML a partir do estado (STATE) e
// ligação de eventos. Nenhuma regra de jogo mora aqui.
// ============================================================

const TABS = [
  { id: 'fleet', label: '⚓ Frota' },
  { id: 'island', label: '🏝️ Ilha' },
  { id: 'exploration', label: '🧭 Exploração' },
  { id: 'quests', label: '📜 Missões' },
  { id: 'inventory', label: '🎒 Inventário' },
  { id: 'prestige', label: '👑 Prestígio' },
];

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function renderAll(state) {
  renderTopBar(state);
  renderTabs(state);
  renderActiveTab(state);
  renderLog(state);
  renderModal(state);
}

function renderTopBar(state) {
  const bar = document.getElementById('resource-bar');
  const order = ['gold', 'wood', 'rum', 'gunpowder', 'iron', 'cloth', 'spices', 'maps', 'fame'];
  bar.innerHTML = order.map(k => `
    <div class="res-chip" title="${RESOURCE_INFO[k].name}">
      <span class="res-icon">${RESOURCE_INFO[k].icon}</span>
      <span class="res-val">${fmt(state.resources[k])}</span>
    </div>
  `).join('') + `
    <div class="res-chip res-doubloon" title="Dobrões (moeda de Prestígio, permanente)">
      <span class="res-icon">💰</span>
      <span class="res-val">${fmt(state.prestige.doubloons)}</span>
    </div>
  `;

  const cap = calcCapacity(state);
  document.getElementById('crew-summary').innerHTML =
    `👥 Tripulação: <strong>${state.crew.total}/${cap}</strong> &nbsp;·&nbsp; Ocioso: <strong>${state.crew.idle}</strong>`;

  const rank = rankName(state, state.rankIndex);
  const className = state.class === 'corsair' ? 'Corsário' : (state.class === 'pirate' ? 'Pirata' : 'Sem Bandeira');
  document.getElementById('rank-summary').innerHTML =
    `${rank} <span class="class-tag class-${state.class || 'none'}">${className}</span> — ${islandBaseName(state)}`;
}

function renderTabs(state) {
  const nav = document.getElementById('tab-nav');
  nav.innerHTML = TABS.map(t => `<button class="tab-btn ${state.ui.activeTab === t.id ? 'active' : ''}" data-action="switch-tab" data-tab="${t.id}">${t.label}</button>`).join('');
}

function renderActiveTab(state) {
  const root = document.getElementById('tab-content');
  switch (state.ui.activeTab) {
    case 'fleet': root.innerHTML = renderFleetTab(state); break;
    case 'island': root.innerHTML = renderIslandTab(state); break;
    case 'exploration': root.innerHTML = renderExplorationTab(state); break;
    case 'quests': root.innerHTML = renderQuestsTab(state); break;
    case 'inventory': root.innerHTML = renderInventoryTab(state); break;
    case 'prestige': root.innerHTML = renderPrestigeTab(state); break;
  }
}

// ---------- Frota ----------

function renderFleetTab(state) {
  const buildRows = SHIP_TYPES.map(type => {
    const owned = state.fleet.filter(s => s.typeId === type.id).length;
    const buildable = canBuildType(state, type.id);
    const cost = shipCost(state, type.id);
    const afford = canAfford(state, cost);
    const costStr = Object.keys(cost).map(k => `${RESOURCE_INFO[k].icon}${fmt(cost[k])}`).join(' ');
    return `
      <div class="ship-type-row ${!buildable ? 'locked' : ''}">
        <div class="ship-type-name">${type.name} <span class="muted">(possui: ${owned})</span></div>
        <div class="ship-type-stats">⚔️ ${type.power} &nbsp; 👥 +${type.capacity}</div>
        <div class="ship-type-cost">${buildable ? costStr : '🔒 requer navio anterior'}</div>
        <button class="btn small" data-action="build-ship" data-type="${type.id}" ${!buildable || !afford ? 'disabled' : ''}>Construir</button>
      </div>`;
  }).join('');

  const fleetRows = state.fleet.map(ship => {
    const type = SHIP_TYPES[ship.typeId];
    const slots = type.slots.map(slot => {
      const item = ship.equipment[slot];
      const info = SLOT_INFO[slot];
      if (item) {
        return `<div class="slot filled" style="border-color:${RARITY[item.rarity].color}">
          <span>${info.icon} ${item.name}</span>
          <button class="btn tiny" data-action="unequip" data-ship="${ship.uid}" data-slot="${slot}">Retirar</button>
        </div>`;
      }
      return `<div class="slot empty"><span>${info.icon} ${info.name} vazio</span></div>`;
    }).join('');
    return `
      <div class="ship-card">
        <div class="ship-card-head">
          <strong>${type.name}</strong> "${ship.name}"
          <select data-action="set-role" data-ship="${ship.uid}" class="role-select">
            <option value="ataque" ${ship.role === 'ataque' ? 'selected' : ''}>⚔️ Ataque</option>
            <option value="producao" ${ship.role === 'producao' ? 'selected' : ''}>🏗️ Produção</option>
            <option value="exploracao" ${ship.role === 'exploracao' ? 'selected' : ''}>🧭 Exploração</option>
          </select>
        </div>
        <div class="ship-slots">${slots}</div>
      </div>`;
  }).join('');

  const power = calcFleetPower(state);

  return `
    <div class="panel">
      <h2>Sua Frota</h2>
      <p class="muted">Poder total de combate da frota: <strong>${fmt(power.power)}</strong> (mais ${state.crew.combat} tripulantes em combate)</p>
      <div class="fleet-grid">${fleetRows || '<p class="muted">Nenhum navio ainda.</p>'}</div>
    </div>
    <div class="panel">
      <h2>Estaleiro — Construir Navios</h2>
      <div class="ship-type-list">${buildRows}</div>
    </div>
    <div class="panel">
      <h2>Atribuir Tripulação</h2>
      ${renderCrewAssignRow(state, 'looters', 'Saqueadores', '🪙 Ouro')}
      ${renderCrewAssignRow(state, 'carpenters', 'Carpinteiros', '🪵 Madeira')}
      ${renderCrewAssignRow(state, 'distillers', 'Destiladores', '🍺 Rum')}
      ${renderCrewAssignRow(state, 'combat', 'Combatentes', '⚔️ Poder de combate')}
    </div>
  `;
}

function renderCrewAssignRow(state, job, label, produces) {
  return `
    <div class="crew-row">
      <div class="crew-label">${label} <span class="muted">(${produces})</span></div>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="-5">-5</button>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="-1">-1</button>
      <span class="crew-count">${state.crew[job]}</span>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="1">+1</button>
      <button class="btn tiny" data-action="assign" data-job="${job}" data-delta="5">+5</button>
    </div>`;
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
          <div class="building-desc">${b.desc}</div>
        </div>
        <div class="building-action">
          ${unlocked
            ? `<div class="cost">${costStr}</div><button class="btn small" data-action="upgrade-building" data-id="${b.id}" ${!afford ? 'disabled' : ''}>Melhorar</button>`
            : `<span class="muted">🔒 expandir ilha</span>`}
        </div>
      </div>`;
  }).join('');

  const expandCost = islandExpandCost(state);
  const canExpand = state.island.sectorsUnlocked < BUILDINGS.length;
  const expandCostStr = Object.keys(expandCost).map(k => `${RESOURCE_INFO[k].icon}${fmt(expandCost[k])}`).join(' ');

  return `
    <div class="panel">
      <h2>${islandBaseName(state)}</h2>
      <p class="muted">Setores desbloqueados: ${state.island.sectorsUnlocked}/${BUILDINGS.length}</p>
      ${canExpand
        ? `<button class="btn" data-action="expand-island" ${!canAfford(state, expandCost) ? 'disabled' : ''}>🏝️ Expandir Ilha — ${expandCostStr}</button>`
        : `<p class="muted">Ilha totalmente expandida.</p>`}
    </div>
    <div class="panel">
      <h2>Construções</h2>
      <div class="building-list">${rows}</div>
    </div>
  `;
}

// ---------- Exploração ----------

function renderExplorationTab(state) {
  const island = getIslandData(state.currentIsland);
  const power = calcFleetPower(state);
  const combatCrewPower = state.crew.combat * 2.5;
  const totalPower = power.power + combatCrewPower;
  const pct = Math.max(0, Math.min(100, 100 - (state.combatTimer / 4) * 100));
  const winChance = Math.round(Math.max(0.05, Math.min(0.97, totalPower / (totalPower + island.enemyPower))) * 100);

  return `
    <div class="panel">
      <h2>Exploração Naval</h2>
      <div class="island-card ${island.isBoss ? 'boss' : ''}">
        <div class="island-name">${island.isBoss ? '💀 Ilha Chefe: ' : ''}${island.name}</div>
        <div class="island-stats">
          <div>Poder inimigo: <strong>${fmt(island.enemyPower)}</strong></div>
          <div>Seu poder: <strong>${fmt(totalPower)}</strong></div>
          <div>Chance de vitória: <strong>${winChance}%</strong></div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <p class="muted">Recompensas: ${RESOURCE_INFO.gold.icon}${fmt(island.rewards.gold)} · ${RESOURCE_INFO.wood.icon}${fmt(island.rewards.wood)} · ${RESOURCE_INFO.fame.icon}${fmt(island.rewards.fame)} · chance de item ${Math.round(island.rewards.itemChance * 100)}%${island.isBoss ? ' · chance de relíquia ' + Math.round(island.rewards.relicChance * 100) + '%' : ''}</p>
      </div>
      <p class="muted">Ilhas conquistadas até agora: ${state.currentIsland} &nbsp;·&nbsp; Batalhas vencidas: ${state.stats.totalBattlesWon || 0}</p>
    </div>
  `;
}

// ---------- Missões ----------

function renderQuestsTab(state) {
  const quests = state.quests.map(q => {
    const done = checkQuest(state, q);
    const rewardStr = Object.keys(q.reward).map(k => k === 'item' ? '🎁 item' : `${RESOURCE_INFO[k].icon}${fmt(q.reward[k])}`).join(' ');
    return `
      <div class="quest-row ${done ? 'done' : ''}">
        <div class="quest-desc">${q.tpl.label(q.amount)}</div>
        <div class="quest-reward">Recompensa: ${rewardStr}</div>
        <button class="btn small" data-action="claim-quest" data-id="${q.id}" ${!done ? 'disabled' : ''}>${done ? 'Resgatar' : 'Em progresso...'}</button>
      </div>`;
  }).join('');

  const maxSlots = maxContractSlots(state);
  const contracts = state.contracts.map(c => {
    const costStr = Object.keys(c.cost).map(k => `${RESOURCE_INFO[k].icon}${fmt(c.cost[k])}`).join(' ');
    const rewardStr = Object.keys(c.reward).map(k => `${RESOURCE_INFO[k].icon}${fmt(c.reward[k])}`).join(' ');
    const afford = canAfford(state, c.cost);
    return `
      <div class="quest-row">
        <div class="quest-desc"><strong>${c.name}</strong><br><span class="muted">Custo: ${costStr}</span></div>
        <div class="quest-reward">Recompensa: ${rewardStr}</div>
        <button class="btn small" data-action="complete-contract" data-id="${c.id}" ${!afford ? 'disabled' : ''}>Cumprir</button>
      </div>`;
  }).join('');

  return `
    <div class="panel">
      <h2>Missões</h2>
      <div class="quest-list">${quests}</div>
    </div>
    <div class="panel">
      <h2>Contratos <span class="muted">(${state.contracts.length}/${maxSlots})</span></h2>
      <div class="quest-list">${contracts || '<p class="muted">Nenhum contrato disponível no momento.</p>'}</div>
    </div>
  `;
}

// ---------- Inventário ----------

function renderInventoryTab(state) {
  if (!state.inventory.length) {
    return `<div class="panel"><h2>Inventário</h2><p class="muted">Vazio. Vença batalhas ou complete missões para encontrar itens.</p></div>`;
  }
  const items = state.inventory.slice().sort((a, b) => RARITY_ORDER_VAL(b.rarity) - RARITY_ORDER_VAL(a.rarity)).map(item => `
    <div class="item-card" style="border-color:${RARITY[item.rarity].color}">
      <div class="item-name" style="color:${RARITY[item.rarity].color}">${SLOT_INFO[item.slot].icon} ${item.name}</div>
      <div class="item-meta">${RARITY[item.rarity].name} · valor ${fmt(item.value)}</div>
      <div class="item-actions">
        <button class="btn tiny" data-action="equip" data-item="${item.uid}">Equipar</button>
        <button class="btn tiny ghost" data-action="scrap" data-item="${item.uid}">Sucatear</button>
      </div>
    </div>`).join('');
  return `<div class="panel"><h2>Inventário</h2><div class="item-grid">${items}</div></div>`;
}
function RARITY_ORDER_VAL(r) { return ['common', 'uncommon', 'rare', 'elite', 'legendary', 'ultra'].indexOf(r); }

// ---------- Prestígio ----------

function renderPrestigeTab(state) {
  const eligible = canPrestige(state);
  const projected = calcDoubloonGain(state);

  const relicsGrid = RELICS.map(r => {
    const owned = state.relics.includes(r.id);
    return `
      <div class="relic-card ${owned ? 'owned' : 'locked'}">
        <div class="relic-icon">${owned ? r.icon : '❔'}</div>
        <div class="relic-name">${owned ? r.name : '???'}</div>
        <div class="relic-desc">${owned ? r.desc : 'Ainda não descoberta'}</div>
      </div>`;
  }).join('');

  const treesHtml = ['general', 'pirate', 'corsair'].map(treeName => {
    const label = treeName === 'general' ? 'Geral' : (treeName === 'pirate' ? '🏴‍☠️ Pirata' : '⚜️ Corsário');
    const locked = treeName !== 'general' && state.class !== treeName;
    const nodes = PRESTIGE_TREES[treeName].map(node => {
      const lvl = (state.prestige.trees[treeName] && state.prestige.trees[treeName][node.id]) || 0;
      const maxed = lvl >= node.max;
      const cost = nodeCost(node, lvl);
      const affordNode = state.prestige.doubloons >= cost;
      return `
        <div class="node-row">
          <div class="node-info">
            <div class="node-name">${node.name} <span class="muted">Nv. ${lvl}/${node.max}</span></div>
            <div class="node-desc">${node.desc}</div>
          </div>
          <button class="btn tiny" data-action="buy-node" data-tree="${treeName}" data-node="${node.id}" ${maxed || !affordNode ? 'disabled' : ''}>${maxed ? 'Máx' : `💰${cost}`}</button>
        </div>`;
    }).join('');
    return `
      <div class="tree-panel ${locked ? 'locked' : ''}">
        <h3>${label}</h3>
        ${locked ? '<p class="muted">Escolha esta classe em um Prestígio para desbloquear.</p>' : nodes}
      </div>`;
  }).join('');

  return `
    <div class="panel">
      <h2>👑 Prestígio — Zarpar Rumo à Lenda</h2>
      <p class="muted">Reinicia frota, ilha, tripulação e patente — mas concede <strong>Dobrões</strong> permanentes e mantém Relíquias e melhorias de Prestígio.</p>
      <p>Dobrões atuais: <strong>${fmt(state.prestige.doubloons)}</strong> &nbsp;·&nbsp; Ganho projetado agora: <strong>+${fmt(projected)}</strong></p>
      <button class="btn" data-action="open-prestige-modal" ${!eligible ? 'disabled' : ''}>${eligible ? 'Zarpar Rumo à Lenda' : '🔒 Alcance ao menos uma Escuna para prestigiar'}</button>
    </div>
    <div class="panel">
      <h2>Árvores de Melhorias</h2>
      <div class="trees-grid">${treesHtml}</div>
    </div>
    <div class="panel">
      <h2>Relíquias <span class="muted">(${state.relics.length}/${RELICS.length})</span></h2>
      <div class="relic-grid">${relicsGrid}</div>
    </div>
    <div class="panel">
      <h2>Salvamento</h2>
      <button class="btn small" data-action="export-save">⬇️ Exportar Save</button>
      <label class="btn small ghost" style="cursor:pointer;">⬆️ Importar Save<input type="file" id="import-file-input" accept=".json" style="display:none"></label>
      <button class="btn small danger" data-action="hard-reset">🗑️ Apagar Tudo</button>
    </div>
  `;
}

// ---------- Log ----------

function renderLog(state) {
  const box = document.getElementById('log-box');
  box.innerHTML = state.log.map(e => `<div class="log-line">${e.msg}</div>`).join('');
}

// ---------- Modal (escolha de classe no prestígio) ----------

function renderModal(state) {
  const container = document.getElementById('modal-container');
  if (!state.ui.modal) { container.innerHTML = ''; container.classList.remove('visible'); return; }
  if (state.ui.modal === 'prestige-choice') {
    container.classList.add('visible');
    container.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal-box" data-stop-close>
          <h2>Escolha sua bandeira</h2>
          <p class="muted">Essa escolha define sua árvore de prestígio e a identidade da sua ilha para este ciclo. Você pode trocar de classe no próximo Prestígio.</p>
          <div class="class-choice-grid">
            <div class="class-choice">
              <h3>🏴‍☠️ Pirata</h3>
              <p>Fora da lei. Bônus de saque e ataque agressivo. Portos amigos ficam mais hostis.</p>
              <button class="btn" data-action="confirm-prestige" data-class="pirate">Zarpar como Pirata</button>
            </div>
            <div class="class-choice">
              <h3>⚜️ Corsário</h3>
              <p>Sob carta de corso. Bônus de Dobrões e comércio. Combate levemente mais fraco.</p>
              <button class="btn" data-action="confirm-prestige" data-class="corsair">Zarpar como Corsário</button>
            </div>
          </div>
          <button class="btn ghost small" data-action="close-modal">Cancelar</button>
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
        STATE.ui.modal = null; renderModal(STATE);
      }
      return;
    }
    const action = btn.dataset.action;
    switch (action) {
      case 'switch-tab': STATE.ui.activeTab = btn.dataset.tab; renderAll(STATE); break;
      case 'build-ship': buildShip(STATE, parseInt(btn.dataset.type, 10)); renderAll(STATE); break;
      case 'assign': assignCrew(STATE, btn.dataset.job, parseInt(btn.dataset.delta, 10)); renderAll(STATE); break;
      case 'upgrade-building': upgradeBuilding(STATE, btn.dataset.id); renderAll(STATE); break;
      case 'expand-island': expandIsland(STATE); renderAll(STATE); break;
      case 'equip': autoEquip(STATE, btn.dataset.item); renderAll(STATE); break;
      case 'unequip': unequipItem(STATE, btn.dataset.ship, btn.dataset.slot); renderAll(STATE); break;
      case 'scrap': scrapItem(STATE, btn.dataset.item); renderAll(STATE); break;
      case 'claim-quest': claimQuest(STATE, btn.dataset.id); renderAll(STATE); break;
      case 'complete-contract': completeContract(STATE, btn.dataset.id); renderAll(STATE); break;
      case 'buy-node': buyPrestigeNode(STATE, btn.dataset.tree, btn.dataset.node); renderAll(STATE); break;
      case 'open-prestige-modal': if (canPrestige(STATE)) { STATE.ui.modal = 'prestige-choice'; renderAll(STATE); } break;
      case 'confirm-prestige': doPrestige(STATE, btn.dataset.class); STATE.ui.modal = null; renderAll(STATE); break;
      case 'close-modal': STATE.ui.modal = null; renderAll(STATE); break;
      case 'export-save': exportSave(STATE); break;
      case 'hard-reset': hardReset(); break;
    }
    saveGame(STATE);
  });

  document.body.addEventListener('change', (e) => {
    if (e.target.matches('[data-action="set-role"]')) {
      setShipRole(STATE, e.target.dataset.ship, e.target.value);
      renderAll(STATE);
      saveGame(STATE);
    }
    if (e.target.id === 'import-file-input') {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { try { importSaveFromText(reader.result); } catch (err) { alert('Arquivo de save inválido.'); } };
      reader.readAsText(file);
    }
  });
}
