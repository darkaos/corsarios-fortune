// ============================================================
// Corsário's Fortune — Alpha 0.1.3.3 Final
// app.js — estado do jogo, regras/mecânicas e o game loop.
// A renderização (HTML) fica em ui.js.
// ============================================================

const SAVE_KEY = 'corsarios_fortune_save_v4';

// ---------- Utilitários ----------

function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return '0';
  const sign = n < 0 ? '-' : '';
  n = Math.abs(n);
  if (n < 1000) return sign + (Number.isInteger(n) ? n : n.toFixed(1));
  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  let u = -1;
  while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
  return sign + n.toFixed(2) + units[u];
}

function canAfford(state, cost) {
  for (const k in cost) { if ((state.resources[k] || 0) < cost[k]) return false; }
  return true;
}
function payCost(state, cost) { for (const k in cost) { state.resources[k] -= cost[k]; } }

const BUILDING_BY_ID = Object.fromEntries(BUILDINGS.map(b => [b.id, b]));
function buildingDef(id) { return BUILDING_BY_ID[id]; }

function getStorageLimit(state, key) {
  if (!STORABLE_RESOURCES.includes(key)) return Infinity;
  const lvl = (state.island && state.island.buildings.warehouse) || 0;
  const factor = buildingDef('warehouse').effect(lvl);
  return Math.floor(BASE_STORAGE_LIMIT * factor);
}
function gain(state, key, amount) {
  if (!amount || amount <= 0) return;
  const limit = getStorageLimit(state, key);
  const current = state.resources[key] || 0;
  const newVal = Math.min(limit, current + amount);
  const actualGain = newVal - current;
  if (actualGain <= 0) return;
  state.resources[key] = newVal;
  const statKey = 'total_' + key + '_earned';
  state.stats[statKey] = (state.stats[statKey] || 0) + actualGain;
}

function log(state, msg) {
  state.log.unshift({ t: Date.now(), msg });
  if (state.log.length > 60) state.log.length = 60;
}
function logKey(state, key, vars) { log(state, t(state, key, vars)); }

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

// ---------- Estado inicial ----------

function freshBuildingsState() {
  return { quarters: 0, tavern: 0, mint: 0, warehouse: 0, forge: 0, plantation: 0, contract_office: 0, watchtower: 0, relic_chamber: 0 };
}
function freshMainShip() {
  const equipment = {};
  SHIP_TYPES[0].slots.forEach(s => equipment[s] = null);
  return { tier: 0, role: 'ataque', equipment };
}
function freshSupportFleet() {
  const f = {};
  SUPPORT_FLEET_TYPES.forEach(s => f[s.id] = 0);
  return f;
}
function freshFactions() {
  const f = {};
  FACTIONS.forEach(fac => f[fac.id] = 0);
  return f;
}

function newGameState() {
  const state = {
    version: '0.1.3.3',
    settings: { lang: null, theme: 'dark', reducedStoryModals: false },
    class: null,
    resources: { gold: 0, wood: 0, rum: 0, gunpowder: 0, iron: 0, cloth: 0, spices: 0, maps: 0, fame: 0 },
    crew: { total: 0, idle: 0, looters: 0, carpenters: 0, distillers: 0, combat: 0 },
    crewGrowthAccum: 0,
    mainShip: freshMainShip(),
    supportFleet: freshSupportFleet(),
    island: { buildings: freshBuildingsState(), sectorsUnlocked: 3 },
    rankIndex: 0,
    inventory: [],
    relics: [],
    map: null,
    cellIndex: 0,
    totalDistance: 0,
    combatTimer: 4,
    questPool: [],
    quests: [],
    contracts: [],
    contractCooldown: 5,
    prestige: { doubloons: 0, count: 0, trees: { general: {}, pirate: {}, corsair: {} } },
    log: [],
    stats: { totalBattlesWon: 0, totalSupportShipsBought: 0 },
    unlocked: { island: false, ship: false, crew: false, upgrades: false, exploration: false, fleet: false, quests: false, inventory: false, prestige: false, achievements: false },
    hints: {},
    castaway: { done: false, campDone: false, wood: 0, scrap: 0, woodClick: 1, scrapClick: 1, upgrades: {} },
    ui: { activeTab: null, modal: null },
    // --- v0.0.4: árvore de melhorias (reseta no Prestígio) ---
    upgradesBought: {},
    automation: { autoAssignCrew: false, autoAssignAdvanced: false },
    autoRebalanceTimer: 0,
    // --- v0.0.4: persistente através do Prestígio ---
    permaUpgrades: {},
    permaStats: { mapsCompletedTotal: 0, maxShipTierEver: 0, maxRankIndexEver: 0, totalContractsCompleted: 0, bossesDefeated: {} },
    achievements: {},
    story: { seen: {}, lastAct: 0 },
    meta: { lastSavedAt: Date.now() },
    factions: freshFactions(),
    // --- v0.0.4: evento mundial ---
    worldEvent: null,
  };
  return state;
}

function ensureQuestPool(state) {
  while (state.questPool.length < QUEST_POOL_SIZE) state.questPool.push(generateQuest(state));
}
function ensureContracts(state) {
  while (state.contracts.length < CONTRACT_SLOTS) state.contracts.push(generateContract(state));
}

// ---------- Náufrago (intro) ----------

function gatherManual(state, key) {
  if (key === 'wood') state.castaway.wood += state.castaway.woodClick;
  if (key === 'scrap') state.castaway.scrap += state.castaway.scrapClick;
}
function buyCastawayUpgrade(state, id) {
  if (state.castaway.upgrades[id]) return;
  const up = CASTAWAY_UPGRADES.find(u => u.id === id);
  if (!up) return;
  if (!canAffordCastaway(state, up.cost)) { logKey(state, 'log_not_enough'); return; }
  payCastaway(state, up.cost);
  state.castaway.upgrades[id] = true;
  if (up.effect.woodClick) state.castaway.woodClick += up.effect.woodClick;
  if (up.effect.scrapClick) state.castaway.scrapClick += up.effect.scrapClick;
}
function canAffordCastaway(state, cost) {
  for (const k in cost) { if ((state.castaway[k] || 0) < cost[k]) return false; }
  return true;
}
function payCastaway(state, cost) { for (const k in cost) { state.castaway[k] -= cost[k]; } }

function buildCamp(state) {
  if (state.castaway.campDone) return;
  if (!canAffordCastaway(state, CASTAWAY_CAMP_COST)) { logKey(state, 'log_not_enough'); return; }
  payCastaway(state, CASTAWAY_CAMP_COST);
  state.castaway.campDone = true;
  state.unlocked.island = true;
  logKey(state, 'log_camp_built');
}
function buildFirstRaft(state) {
  if (state.castaway.done) return;
  if (!state.castaway.campDone) return;
  if (!canAffordCastaway(state, CASTAWAY_RAFT_COST)) { logKey(state, 'log_not_enough'); return; }
  payCastaway(state, CASTAWAY_RAFT_COST);
  state.castaway.done = true;
  gain(state, 'wood', state.castaway.wood);
  gain(state, 'gold', state.castaway.scrap * 3);
  state.castaway.wood = 0; state.castaway.scrap = 0;
  // A jangada marca o fim do Ato I e libera apenas o que o jogador
  // realmente pode usar neste momento. A tripulação e a exploração
  // entram progressivamente conforme a história avança.
  // O próprio capitão é o primeiro membro da tripulação.
  state.crew.total = Math.max(state.crew.total || 0, 1);
  state.crew.idle = Math.max(state.crew.idle || 0, 1);
  state.unlocked.ship = true;
  state.unlocked.upgrades = true;
  state.unlocked.achievements = true;
  state.map = null;
  state.cellIndex = 0;
  state.ui.activeTab = 'ship';
  logKey(state, 'log_raft_built');
}

// ---------- Progressão guiada pela história ----------
//
// A progressão inicial é deliberadamente gradual:
// Ato I: ilha e sobrevivência
// Ato II: jangada -> navio; alojamentos -> tripulação
// Ato III: primeiro Escaler -> exploração
//
// Mantemos esta regra em um único lugar para evitar que uma feature futura
// desbloqueie acidentalmente sistemas antes da hora.

function syncProgressionUnlocks(state) {
  if (!state.unlocked) state.unlocked = {};

  // A ilha fica disponível assim que o abrigo foi construído.
  state.unlocked.island = !!state.castaway?.campDone;

  // A jangada libera o navio e a árvore de melhorias, mas não a tripulação
  // nem a exploração.
  const raftBuilt = !!state.castaway?.done;
  state.unlocked.ship = raftBuilt;
  state.unlocked.upgrades = raftBuilt;
  state.unlocked.achievements = raftBuilt;

  // O primeiro alojamento representa a fundação da futura tripulação.
  const quarters = state.island?.buildings?.quarters || 0;
  state.unlocked.crew = quarters > 0;

  // O primeiro upgrade do navio (Escaler) abre a exploração.
  const hasFirstSloop = (state.mainShip?.tier || 0) >= 1;
  state.unlocked.exploration = hasFirstSloop;
  if (hasFirstSloop && !state.map) {
    state.map = generateMap(1, !!state.worldEvent);
    state.cellIndex = 0;
  }

  // A frota, missões, inventário e prestígio continuam sendo liberados
  // pelos seus próprios sistemas/árvore de progressão.
}

// ---------- Diário de Bordo / Narrativa ----------

function storyHasSeen(state, id) { return !!(state.story && state.story.seen && state.story.seen[id]); }
function storyMarkSeen(state, id) {
  if (!state.story) state.story = { seen: {}, lastAct: 0 };
  if (!state.story.seen) state.story.seen = {};
  state.story.seen[id] = true;
}
function storyUnlock(state, id) {
  if (storyHasSeen(state, id)) return false;
  storyMarkSeen(state, id);
  return true;
}

function checkStoryTriggers(state) {
  if (!state.settings.lang) return false;
  let changed = false;
  let newAct = null;

  // Opening: the first act and its introductory entries are available from the start.
  if (state.story.lastAct < 1) {
    STORY_ENTRIES.filter(e => ['act1', 'act1_storm', 'act1_day10', 'act1_unconscious', 'day1_castaway'].includes(e.id)).forEach(e => { if (storyUnlock(state, e.id)) changed = true; });
    state.story.lastAct = 1;
    newAct = STORY_ENTRIES.find(e => e.id === 'act1');
  }

  // O primeiro Ato deve ser apresentado sozinho; os próximos só podem avançar
  // um Ato por atualização, evitando saltos como Ato II -> Ato III no mesmo frame.
  if (newAct) {
    state.ui.modal = 'story-act';
    state.ui.storyActId = newAct.id;
    return changed;
  }

  const triggers = [
    { id: 'day2_tools', ok: Object.keys(state.castaway.upgrades || {}).length > 0 },
    { id: 'day3_shelter', ok: !!state.castaway.campDone },
    { id: 'act2', ok: !!state.castaway.done, act: 2 },
    { id: 'day12_base', ok: ((state.island?.buildings?.quarters || 0) > 0) },
    { id: 'day17_survivor', ok: (state.crew?.total || 0) >= 2 },
    { id: 'day24_sloop', ok: (state.mainShip?.tier || 0) >= 1 },
    { id: 'act3', ok: !!state.unlocked.exploration, act: 3 },
    { id: 'day31_first_map', ok: (state.permaStats?.mapsCompletedTotal || 0) >= 1 || (state.totalDistance || 0) > 0 },
    { id: 'day50_rumble', ok: (state.totalDistance || 0) >= 48 },
    { id: 'day51_bubbles', ok: (state.totalDistance || 0) >= 49 },
    { id: 'day52_kraken', ok: (state.permaStats?.bossesDefeated?.kraken || 0) >= 1 },
    { id: 'act4', ok: !!state.unlocked.fleet, act: 4 },
    { id: 'day100_fleet', ok: Object.values(state.supportFleet || {}).reduce((a,b) => a + b, 0) >= 15 },
    { id: 'act5', ok: (state.prestige?.count || 0) >= 1, act: 5 },
  ];

  for (const tr of triggers) {
    if (!tr.ok || storyHasSeen(state, tr.id)) continue;
    storyMarkSeen(state, tr.id);
    changed = true;
    if (tr.act && tr.act > state.story.lastAct) {
      state.story.lastAct = tr.act;
      newAct = STORY_ENTRIES.find(e => e.id === tr.id);
      break;
    }
  }

  if (newAct) {
    // Modo História Reduzido: mantém as entradas no Diário, mas reduz a frequência
    // dos modais para os atos principais (I, III e V).
    const showModal = !state.settings.reducedStoryModals || [1, 3, 5].includes(state.story.lastAct);
    if (showModal) {
      state.ui.modal = 'story-act';
      state.ui.storyActId = newAct.id;
    }
  }
  return changed;
}

function updateAllUnlocks(state) {
  syncProgressionUnlocks(state);
  checkStoryTriggers(state);
}

// ---------- Persistência ----------

function serializeState(state) { return JSON.stringify(state); }
function deserializeState(raw) {
  const obj = JSON.parse(raw);
  if (!obj.ui) obj.ui = { activeTab: null, modal: null };
  if (!obj.stats) obj.stats = { totalBattlesWon: 0, totalSupportShipsBought: 0 };
  if (!obj.settings) obj.settings = { lang: null, theme: 'dark', reducedStoryModals: false };
  if (!obj.settings.theme) obj.settings.theme = 'dark';
  if (obj.settings.reducedStoryModals === undefined) obj.settings.reducedStoryModals = false;
  if (!obj.hints) obj.hints = {};
  if (!obj.supportFleet) obj.supportFleet = freshSupportFleet();
  if (!obj.mainShip) obj.mainShip = freshMainShip();
  if (!obj.unlocked) obj.unlocked = {};
  ['island', 'ship', 'crew', 'upgrades', 'exploration', 'fleet', 'quests', 'inventory', 'prestige'].forEach(k => { if (obj.unlocked[k] === undefined) obj.unlocked[k] = false; });
  if (!obj.castaway) obj.castaway = { done: true, campDone: true, wood: 0, scrap: 0, woodClick: 1, scrapClick: 1, upgrades: {} };
  if (!obj.questPool) obj.questPool = [];
  if (!obj.map) obj.map = null;
  if (obj.totalDistance === undefined) obj.totalDistance = 0;
  if (obj.cellIndex === undefined) obj.cellIndex = 0;
  if (!obj.upgradesBought) obj.upgradesBought = {};
  if (!obj.automation) obj.automation = { autoAssignCrew: false, autoAssignAdvanced: false };
  if (obj.autoRebalanceTimer === undefined) obj.autoRebalanceTimer = 0;
  if (!obj.permaUpgrades) obj.permaUpgrades = {};
  if (!obj.permaStats) obj.permaStats = { mapsCompletedTotal: 0, maxShipTierEver: 0, maxRankIndexEver: 0, totalContractsCompleted: 0, bossesDefeated: {} };
  if (obj.permaStats.maxShipTierEver === undefined) obj.permaStats.maxShipTierEver = obj.mainShip ? obj.mainShip.tier : 0;
  if (obj.permaStats.maxRankIndexEver === undefined) obj.permaStats.maxRankIndexEver = obj.rankIndex || 0;
  if (obj.permaStats.totalContractsCompleted === undefined) obj.permaStats.totalContractsCompleted = 0;
  if (!obj.permaStats.bossesDefeated) obj.permaStats.bossesDefeated = {};
  if (!obj.achievements) obj.achievements = {};
  if (!obj.story) obj.story = { seen: {}, lastAct: 0 };
  if (!obj.story.seen) obj.story.seen = {};
  if (obj.story.lastAct === undefined) obj.story.lastAct = 0;
  if (obj.unlocked.achievements === undefined) obj.unlocked.achievements = false;
  if (!obj.factions) obj.factions = freshFactions();
  if (obj.worldEvent === undefined) obj.worldEvent = null;
  if (!obj.meta) obj.meta = {};
  if (!obj.meta.lastSavedAt) obj.meta.lastSavedAt = Date.now();

  // Corrige saves criados pela versão anterior do Diário de Bordo, que
  // desbloqueava exploração e tripulação imediatamente ao construir a jangada.
  updateAllUnlocks(obj);
  return obj;
}

function saveGame(state) {
  try {
    if (!state.meta) state.meta = {};
    state.meta.lastSavedAt = Date.now();
    localStorage.setItem(SAVE_KEY, serializeState(state));
  }
  catch (e) { console.error('Erro ao salvar', e); }
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return deserializeState(raw);
  } catch (e) { console.error('Erro ao carregar save', e); return null; }
}

function exportSave(state) {
  const data = serializeState(state);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'corsarios-fortune-save.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function importSaveFromText(text) {
  const obj = deserializeState(text);
  STATE = obj;
  saveGame(STATE);
  fullRender(STATE);
}
function hardReset() {
  if (confirm(t(STATE, 'btn_reset') + '?')) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
}

// ---------- Facções ----------

function adjustFaction(state, id, amount) {
  if (state.factions[id] === undefined) return;
  // v0.1.0: Piratas perdem reputação mais facilmente que o normal.
  if (state.class === 'pirate' && amount < 0) amount *= 1.5;
  state.factions[id] = clamp(state.factions[id] + amount, -100, 100);
}
function factionBonus(state, id, maxBonusAtMaxRep) {
  const rep = state.factions[id] || 0;
  return (rep / 100) * maxBonusAtMaxRep;
}

// ---------- Conquistas ----------

const ACHIEVEMENT_CONDITIONS = {
  first_steps: state => state.castaway.done,
  first_blood: state => (state.stats.totalBattlesWon || 0) >= 1,
  shipwright: state => state.permaStats.maxShipTierEver >= 5,
  armada: state => state.permaStats.maxShipTierEver >= SHIP_TYPES.length - 1,
  treasure_hunter: state => state.relics.length >= 1,
  relic_master: state => state.relics.length >= RELICS.length,
  captain_rank: state => state.permaStats.maxRankIndexEver >= RANKS.findIndex(r => r.name === 'Capitão'),
  legend_rank: state => state.permaStats.maxRankIndexEver >= RANKS.length - 1,
  merchant_friend: state => (state.permaStats.totalContractsCompleted || 0) >= 20,
  boss_slayer: state => BOSSES.every(b => state.permaStats.bossesDefeated[b.id]),
  prestige_veteran: state => state.prestige.count >= 5,
  map_wanderer: state => (state.permaStats.mapsCompletedTotal || 0) >= 50,
};
function checkAchievements(state) {
  ACHIEVEMENTS.forEach(a => {
    if (state.achievements[a.id]) return;
    const cond = ACHIEVEMENT_CONDITIONS[a.id];
    if (cond && cond(state)) {
      state.achievements[a.id] = true;
      logKey(state, 'log_achievement_unlocked', { name: L(state, a, 'name') });
    }
  });
}
function achievementBonusTotal(state, effectType) {
  let total = 0;
  ACHIEVEMENTS.forEach(a => {
    if (state.achievements[a.id] && a.effect.type === effectType) total += a.effect.value;
  });
  return total;
}

// ---------- Efeitos de prestígio / relíquias ----------

function getTreeEffect(state, treeName, effectKey) {
  const tree = PRESTIGE_TREES[treeName];
  let total = 0;
  tree.forEach(node => {
    if (node.effect === effectKey) {
      const lvl = (state.prestige.trees[treeName] && state.prestige.trees[treeName][node.id]) || 0;
      total += lvl * node.perLevel;
    }
  });
  return total;
}
function getRelicEffect(state, key) {
  let total = 0;
  state.relics.forEach(rid => {
    const relic = RELICS.find(r => r.id === rid);
    if (relic && relic.effect[key]) total += relic.effect[key];
  });
  return total;
}
function nodeCost(node, level) { return Math.ceil(node.baseCost * Math.pow(node.costMult, level)); }

function buyPrestigeNode(state, treeName, nodeId) {
  const tree = PRESTIGE_TREES[treeName];
  const node = tree.find(n => n.id === nodeId);
  if (!node) return;
  const level = state.prestige.trees[treeName][nodeId] || 0;
  if (level >= node.max) { logKey(state, 'log_max_level'); return; }
  const cost = nodeCost(node, level);
  if (state.prestige.doubloons < cost) { logKey(state, 'log_not_enough_doubloons'); return; }
  state.prestige.doubloons -= cost;
  state.prestige.trees[treeName][nodeId] = level + 1;
}

// ---------- Árvore de Melhorias (compra única, com pré-requisitos) ----------

function isNodeBought(state, id) { return !!state.upgradesBought[id] || !!state.permaUpgrades[id]; }
function nodePrereqMet(state, node) { return node.prereq.every(id => isNodeBought(state, id)); }
function nodeDepth(id, memo) {
  memo = memo || {};
  if (memo[id] !== undefined) return memo[id];
  const node = UPGRADE_TREE.find(n => n.id === id);
  if (!node || !node.prereq.length) return (memo[id] = 0);
  const d = 1 + Math.max(...node.prereq.map(p => nodeDepth(p, memo)));
  memo[id] = d;
  return d;
}
function treeNodeEffectTotal(state, effectType, resource) {
  let total = 0;
  UPGRADE_TREE.forEach(node => {
    if (!isNodeBought(state, node.id)) return;
    if (node.effect.type !== effectType) return;
    if (resource && node.effect.resource !== resource) return;
    total += node.effect.value || 0;
  });
  return total;
}
function buyUpgradeNode(state, id) {
  const node = UPGRADE_TREE.find(n => n.id === id);
  if (!node) return;
  if (isNodeBought(state, id)) return;
  if (!nodePrereqMet(state, node)) return;
  if (!canAfford(state, node.cost)) { logKey(state, 'log_not_enough'); return; }
  payCost(state, node.cost);
  if (node.permanent) state.permaUpgrades[id] = true;
  else state.upgradesBought[id] = true;
  applyNodeUnlockEffects(state, node);
  logKey(state, 'log_node_bought', { name: L(state, node, 'name') });
}
function applyNodeUnlockEffects(state, node) {
  if (node.effect.type === 'unlockTabs') {
    node.effect.tabs.forEach(tabId => { state.unlocked[tabId] = true; });
    if (!state.quests.length && (node.effect.tabs.includes('quests'))) { ensureQuestPool(state); ensureContracts(state); }
  }
  if (node.effect.type === 'unlockPrestige') {
    state.unlocked.prestige = true;
  }
  if (node.effect.type === 'automation') {
    if (node.effect.key === 'autoAssignCrew') {
      state.automation.autoAssignCrew = true;
      const idle = state.crew.idle;
      state.crew.idle = 0;
      autoDistributeCrew(state, idle);
    }
    if (node.effect.key === 'autoAssignAdvanced') state.automation.autoAssignAdvanced = true;
  }
}

// ---------- Patentes ----------

function rankName(state, idx) {
  const r = RANKS[idx];
  if (idx >= RANKS.length - 2 && state.class === 'corsair' && r.nameCorsair) return L(state, r, 'nameCorsair');
  return L(state, r, 'name');
}
function checkRankUp(state) {
  while (state.rankIndex < RANKS.length - 1 && state.resources.fame >= RANKS[state.rankIndex + 1].fame) {
    state.rankIndex++;
    state.permaStats.maxRankIndexEver = Math.max(state.permaStats.maxRankIndexEver, state.rankIndex);
    logKey(state, 'log_promotion', { rank: rankName(state, state.rankIndex) });
  }
}

// ---------- Ilha-base ----------

function buildingDisplayName(state, id) {
  const b = buildingDef(id);
  if (state.class === 'corsair' && b.nameCorsair) return L(state, b, 'nameCorsair');
  return L(state, b, 'name');
}
function islandBaseName(state) {
  if (state.class === 'corsair') return state.settings.lang === 'en' ? 'Crown Harbor' : 'Porto da Coroa';
  return state.settings.lang === 'en' ? "Outlaws' Cove" : 'Enseada dos Foragidos';
}
function buildingCostFor(state, id) {
  const b = buildingDef(id);
  const lvl = state.island.buildings[id] || 0;
  const reduction = Math.max(0.4, 1 - getTreeEffect(state, 'corsair', 'buildingCostReduction'));
  const cost = {};
  for (const k in b.baseCost) cost[k] = Math.ceil(b.baseCost[k] * Math.pow(b.costMult, lvl) * reduction);
  return cost;
}
function upgradeBuilding(state, id) {
  const idx = BUILDINGS.findIndex(x => x.id === id);
  if (idx >= state.island.sectorsUnlocked) return;
  const cost = buildingCostFor(state, id);
  if (!canAfford(state, cost)) { logKey(state, 'log_not_enough'); return; }
  payCost(state, cost);
  state.island.buildings[id] = (state.island.buildings[id] || 0) + 1;
  logKey(state, 'log_building_upgraded', { name: buildingDisplayName(state, id), level: state.island.buildings[id] });
}
function upgradeBuildingBulk(state, id, amount) {
  const idx = BUILDINGS.findIndex(x => x.id === id);
  if (idx < 0 || idx >= state.island.sectorsUnlocked) return 0;
  let bought = 0;
  const target = amount === 'max' ? Infinity : Math.max(0, Number(amount) || 0);
  while (bought < target) {
    const cost = buildingCostFor(state, id);
    if (!canAfford(state, cost)) break;
    payCost(state, cost);
    state.island.buildings[id] = (state.island.buildings[id] || 0) + 1;
    bought++;
  }
  if (bought > 0) {
    logKey(state, 'log_building_upgraded', { name: buildingDisplayName(state, id), level: state.island.buildings[id] });
  } else {
    logKey(state, 'log_not_enough');
  }
  return bought;
}

function islandExpandCost(state) {
  const n = state.island.sectorsUnlocked - 3;
  return { gold: Math.ceil(300 * Math.pow(1.8, n)), wood: Math.ceil(150 * Math.pow(1.8, n)) };
}
function expandIsland(state) {
  if (state.island.sectorsUnlocked >= BUILDINGS.length) return;
  const cost = islandExpandCost(state);
  if (!canAfford(state, cost)) { logKey(state, 'log_not_enough'); return; }
  payCost(state, cost);
  state.island.sectorsUnlocked++;
  logKey(state, 'log_island_expanded');
}

// ---------- Tripulação ----------

function calcCapacity(state) {
  let cap = 5 + SHIP_TYPES[state.mainShip.tier].capacity;
  cap += buildingDef('quarters').effect(state.island.buildings.quarters);
  cap *= (1 + getTreeEffect(state, 'general', 'crewCapacity') + treeNodeEffectTotal(state, 'capacity'));
  return Math.floor(cap);
}
function assignCrew(state, job, delta) {
  if (delta > 0) {
    const amt = Math.min(delta, state.crew.idle);
    if (amt <= 0) return;
    state.crew.idle -= amt; state.crew[job] += amt;
  } else {
    const amt = Math.min(-delta, state.crew[job]);
    if (amt <= 0) return;
    state.crew[job] -= amt; state.crew.idle += amt;
  }
}

// Automação (v0.0.4): distribui tripulantes pelas tarefas mais "necessárias"
// (recurso mais escasso), em vez de deixá-los ociosos.
function crewJobWeights(state) {
  const w = {};
  w.looters = 1 / (state.resources.gold + 1);
  w.carpenters = 1 / (state.resources.wood + 1);
  w.distillers = 1 / (state.resources.rum + 1);
  w.combat = (w.looters + w.carpenters + w.distillers) / 3;
  return w;
}
function autoDistributeCrew(state, count) {
  if (count <= 0) return;
  if (!state.automation.autoAssignCrew) { state.crew.idle += count; return; }
  const jobs = ['looters', 'carpenters', 'distillers', 'combat'];
  let remaining = count;
  // Garante ao menos 1 tripulante em cada tarefa antes de distribuir o resto —
  // evita que uma tarefa fique travada em 0 pra sempre (ex: 0 Saqueadores = Ouro nunca produz).
  jobs.forEach(j => {
    if (remaining > 0 && state.crew[j] === 0) { state.crew[j]++; remaining--; }
  });
  if (remaining <= 0) return;
  const w = crewJobWeights(state);
  const total = jobs.reduce((a, j) => a + w[j], 0) || 1;
  const startRemaining = remaining;
  jobs.forEach((j, i) => {
    const isLast = i === jobs.length - 1;
    const share = isLast ? remaining : Math.round(startRemaining * (w[j] / total));
    const amt = Math.min(remaining, share);
    state.crew[j] += amt; remaining -= amt;
  });
}
function processAutoRebalance(state, dt) {
  if (!state.automation.autoAssignAdvanced) return;
  state.autoRebalanceTimer += dt;
  if (state.autoRebalanceTimer < 4) return;
  state.autoRebalanceTimer = 0;
  const w = crewJobWeights(state);
  const jobs = ['looters', 'carpenters', 'distillers', 'combat'];
  let maxJob = jobs[0], minJob = jobs[0];
  jobs.forEach(j => { if (w[j] > w[maxJob]) maxJob = j; if (w[j] < w[minJob]) minJob = j; });
  const ratio = w[minJob] > 0 ? w[maxJob] / w[minJob] : Infinity;
  // Só rebalanceia se o desequilíbrio for significativo — evita ficar
  // "tremendo" a tripulação de um lado pro outro por diferenças pequenas.
  if (maxJob !== minJob && ratio > 2.2 && state.crew[minJob] > 1) {
    state.crew[minJob]--; state.crew[maxJob]++;
  }
}

function processCrewGrowth(state, dt) {
  if (!state.castaway.done || !state.unlocked.crew) return;
  const cap = calcCapacity(state);
  if (state.crew.total >= cap) return;
  const rum = state.resources.rum;
  const growthBase = 0.15;
  const rumBonus = Math.min(2, rum * 0.01);
  const treeBonus = getTreeEffect(state, 'general', 'crewGrowth') + treeNodeEffectTotal(state, 'growth');
  const relicBonus = getRelicEffect(state, 'crewGrowth');
  const rate = growthBase * (1 + rumBonus) * (1 + treeBonus + relicBonus);
  state.crewGrowthAccum += rate * dt;
  if (state.crewGrowthAccum >= 1) {
    const whole = Math.floor(state.crewGrowthAccum);
    state.crewGrowthAccum -= whole;
    const actual = Math.min(whole, cap - state.crew.total);
    if (actual > 0) {
      state.crew.total += actual;
      autoDistributeCrew(state, actual);
      state.resources.rum = Math.max(0, state.resources.rum - actual * 0.5);
    }
  }
}

function clickPowerMult(state) {
  return 1 + getTreeEffect(state, 'general', 'clickPower') + treeNodeEffectTotal(state, 'clickPower') + achievementBonusTotal(state, 'clickPower');
}
function collectManualResources(state) {
  if (!state.castaway.done) return;
  const mult = clickPowerMult(state) * (1 + RANKS[state.rankIndex].bonus);
  gain(state, 'gold', MANUAL_WORK_BASE.gold * mult);
  gain(state, 'wood', MANUAL_WORK_BASE.wood * mult);
  const jackpotNode = UPGRADE_TREE.find(n => n.effect.type === 'clickJackpot');
  if (jackpotNode && isNodeBought(state, jackpotNode.id) && Math.random() < jackpotNode.effect.chance) {
    const jackpotGold = MANUAL_WORK_BASE.gold * mult * jackpotNode.effect.mult;
    gain(state, 'gold', jackpotGold);
    logKey(state, 'log_jackpot', { gold: fmt(jackpotGold) });
  }
}

function workTheDeck(state) {
  collectManualResources(state);
}
function reinforceAttack(state) {
  if (!state.unlocked.exploration) return;
  const mult = clickPowerMult(state);
  state.combatTimer = Math.max(0, state.combatTimer - REINFORCE_TIMER_REDUCTION * mult);
}

// ---------- Eventos Mundiais ----------

function worldEventEffect(state, key) {
  if (!state.worldEvent) return null;
  const def = WORLD_EVENTS.find(e => e.id === state.worldEvent.id);
  return def && def.effect[key] !== undefined ? def.effect[key] : null;
}
function processWorldEvent(state, dt) {
  if (state.worldEvent) {
    state.worldEvent.remaining -= dt;
    if (state.worldEvent.remaining <= 0) {
      const def = WORLD_EVENTS.find(e => e.id === state.worldEvent.id);
      logKey(state, 'log_world_event_end', { name: L(state, def, 'name') });
      state.worldEvent = null;
    }
    return;
  }
  if (!state.castaway.done) return;
  if (Math.random() < WORLD_EVENT_CHANCE_PER_SEC * dt) {
    const def = WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];
    state.worldEvent = { id: def.id, remaining: def.duration };
    logKey(state, 'log_world_event_start', { name: L(state, def, 'name'), desc: L(state, def, 'desc') });
  }
}

// ---------- Produção de recursos ----------

function calcProductionRates(state) {
  if (!state.castaway.done) return { gold: 0, wood: 0, rum: 0, iron: 0, gunpowder: 0, spices: 0, cloth: 0 };
  const b = state.island.buildings;
  const globalProdBonus = 1 + getTreeEffect(state, 'general', 'resourceProd') + getRelicEffect(state, 'resourceProd') + achievementBonusTotal(state, 'resourceProd');
  const rankMult = 1 + RANKS[state.rankIndex].bonus;
  const worldMult = worldEventEffect(state, 'prodMult') || 1;
  const mult = globalProdBonus * rankMult * worldMult;
  const mintFactor = buildingDef('mint').effect(b.mint);
  const forgeLvl = buildingDef('forge').effect(b.forge);
  const plantLvl = buildingDef('plantation').effect(b.plantation);
  const tavernLvl = buildingDef('tavern').effect(b.tavern);
  const tradeBonus = 1 + getTreeEffect(state, 'corsair', 'tradeBonus');
  const idleGoldPerCrew = getTreeEffect(state, 'pirate', 'idleGold');
  const supportProdBonus = 1 + (state.supportFleet.traders || 0) * SUPPORT_FLEET_TYPES.find(s => s.id === 'traders').prodBonusPerUnit;
  const lootersBonus = 1 + treeNodeEffectTotal(state, 'prodMult', 'gold') + permaMapBonus(state, 'gold');
  const carpentersBonus = 1 + treeNodeEffectTotal(state, 'prodMult', 'wood');
  const distillersBonus = 1 + treeNodeEffectTotal(state, 'prodMult', 'rum');
  // v0.1.0: diferenciação de classe — Pirata ganha ouro absurdo, Corsário ganha menos ouro (mas mais Dobrões no Prestígio).
  const classGoldMult = state.class === 'pirate' ? 1.25 : (state.class === 'corsair' ? 0.85 : 1);
  return {
    gold: state.crew.looters * 1.2 * mintFactor * mult * lootersBonus * supportProdBonus * classGoldMult + state.crew.idle * idleGoldPerCrew,
    wood: state.crew.carpenters * 1.0 * mult * carpentersBonus * supportProdBonus,
    rum: state.crew.distillers * 0.9 * (1 + tavernLvl * 0.08) * mult * distillersBonus * supportProdBonus,
    iron: forgeLvl * 0.6 * mult * supportProdBonus,
    gunpowder: forgeLvl * 0.3 * mult * supportProdBonus,
    spices: plantLvl * 0.5 * mult * tradeBonus * supportProdBonus,
    cloth: plantLvl * 0.4 * mult * tradeBonus * supportProdBonus,
  };
}
// Bônus quirky "Registro de Rotas": cresce permanentemente a cada mapa concluído.
// Curva de retornos decrescentes (v0.0.5): evita que o bônus "permanente" do
// Registro de Rotas exploda com muitos mapas completados. Os primeiros 100
// mapas valem a taxa cheia, os próximos 400 valem metade, e dali em diante
// valem 1/5 — continua recompensando, mas sem destruir o balanceamento.
function tieredMapBonus(mapsCompleted, rate) {
  const tier1 = Math.min(mapsCompleted, 100) * rate;
  const tier2 = Math.min(Math.max(mapsCompleted - 100, 0), 400) * (rate * 0.5);
  const tier3 = Math.min(Math.max(mapsCompleted - 500, 0), 1500) * (rate * 0.2);
  const tier4 = Math.max(mapsCompleted - 2000, 0) * (rate * 0.05);
  return tier1 + tier2 + tier3 + tier4;
}
function permaMapBonus(state, resource) {
  let total = 0;
  UPGRADE_TREE.forEach(node => {
    if (node.effect.type === 'permaMapBonus' && node.effect.resource === resource && state.permaUpgrades[node.id]) {
      total += tieredMapBonus(state.permaStats.mapsCompletedTotal, node.effect.value);
    }
  });
  return total;
}

// ---------- Navio Principal ----------

function shipUpgradeCost(state) {
  const nextTier = state.mainShip.tier + 1;
  if (nextTier >= SHIP_TYPES.length) return null;
  return Object.assign({}, SHIP_TYPES[nextTier].buildCost);
}
function upgradeMainShip(state) {
  const cost = shipUpgradeCost(state);
  if (!cost) return;
  if (!canAfford(state, cost)) { logKey(state, 'log_not_enough'); return; }
  payCost(state, cost);
  state.mainShip.tier++;
  state.permaStats.maxShipTierEver = Math.max(state.permaStats.maxShipTierEver, state.mainShip.tier);
  SHIP_TYPES[state.mainShip.tier].slots.forEach(s => { if (!(s in state.mainShip.equipment)) state.mainShip.equipment[s] = null; });
  logKey(state, 'log_ship_upgraded', { type: L(state, SHIP_TYPES[state.mainShip.tier], 'name') });
}
function slotUnlockedByTier(state, slot) { return SHIP_TYPES[state.mainShip.tier].slots.includes(slot); }
function slotUnlockedByDistance(state, slot) { return state.totalDistance >= (SLOT_UNLOCK_DISTANCE[slot] || 0); }
function slotUsable(state, slot) { return slotUnlockedByTier(state, slot) && slotUnlockedByDistance(state, slot); }

function buySupportShip(state, id) {
  const type = SUPPORT_FLEET_TYPES.find(s => s.id === id);
  if (!type) return;
  const owned = state.supportFleet[id] || 0;
  const cost = {};
  for (const k in type.buildCost) cost[k] = Math.ceil(type.buildCost[k] * Math.pow(type.costMult, owned));
  if (!canAfford(state, cost)) { logKey(state, 'log_not_enough'); return; }
  payCost(state, cost);
  state.supportFleet[id] = owned + 1;
  state.stats.totalSupportShipsBought = (state.stats.totalSupportShipsBought || 0) + 1;
}

function calcMainShipPower(state, ignoreDefense) {
  const type = SHIP_TYPES[state.mainShip.tier];
  let base = type.power;
  let atk = 0, def = 0, lootB = 0;
  for (const slot in state.mainShip.equipment) {
    const item = state.mainShip.equipment[slot];
    if (!item || !slotUsable(state, slot)) continue;
    if (slot === 'cannon') atk += item.value;
    else if (slot === 'hull') def += item.value;
    else if (slot === 'bow') lootB += item.value;
    else base += item.value * 0.3;
  }
  let power = base + atk + (ignoreDefense ? 0 : def * 0.5);
  if (state.mainShip.role === 'ataque') power *= 1.25;
  if (state.mainShip.role === 'producao') power *= 0.75;
  if (state.mainShip.role === 'exploracao') power *= 0.9;
  return { power, loot: lootB };
}
function calcSupportFleetPower(state) {
  const raiders = state.supportFleet.raiders || 0;
  const scouts = state.supportFleet.scouts || 0;
  const raidType = SUPPORT_FLEET_TYPES.find(s => s.id === 'raiders');
  const scoutType = SUPPORT_FLEET_TYPES.find(s => s.id === 'scouts');
  return { power: raiders * raidType.power, itemBonus: scouts * scoutType.itemBonusPerUnit };
}
function calcFleetPower(state, ignoreDefense) {
  const main = calcMainShipPower(state, ignoreDefense);
  const support = calcSupportFleetPower(state);
  return { power: main.power + support.power, loot: main.loot, explorationBonus: support.itemBonus };
}

// ---------- Exploração ----------

function currentCell(state) {
  if (!state.map) return null;
  return state.map.cells[state.cellIndex];
}
function watchtowerPeek(state) {
  return Math.max(0, Math.floor((buildingDef('watchtower').effect(state.island.buildings.watchtower) - 1) / 0.08));
}
function isBattleCellType(type) { return type === 'enemy' || type === 'boss'; }
function isEventCellType(type) { return MAP_EVENT_TYPES.includes(type); }

function processExploration(state, dt) {
  if (!state.unlocked.exploration || !state.map) return;
  const cell = currentCell(state);
  if (!cell) return;
  const currentBoss = cell.type === 'boss' ? BOSSES.find(b => b.id === cell.bossId) : null;
  const ignoreDefense = !!(currentBoss && currentBoss.ignoreDefense);
  const fleetCalc = calcFleetPower(state, ignoreDefense);
  const combatCrewPower = state.crew.combat * 2.5;
  const pirateAtk = getTreeEffect(state, 'pirate', 'attackBonus');
  const relicCombat = getRelicEffect(state, 'combatPower') + achievementBonusTotal(state, 'combatPower');
  const totalPower = (fleetCalc.power + combatCrewPower) * (1 + pirateAtk) * (1 + relicCombat);
  const watchtowerFactor = buildingDef('watchtower').effect(state.island.buildings.watchtower);
  const worldExplMult = worldEventEffect(state, 'explorationMult') || 1;
  // Kraken (v0.1.0): reduz a velocidade de exploração enquanto estiver vivo.
  const krakenSlow = (currentBoss && currentBoss.speedReduction) ? (1 - currentBoss.speedReduction) : 1;
  const speedBonus = (watchtowerFactor + getRelicEffect(state, 'explorationSpeed') + achievementBonusTotal(state, 'explorationSpeed')) * worldExplMult * krakenSlow;
  state.combatTimer -= dt * speedBonus;
  if (state.combatTimer <= 0) {
    state.combatTimer = 4;
    resolveCell(state, cell, fleetCalc, totalPower);
  }
}

function resolveCell(state, cell, fleetCalc, totalPower) {
  if (cell.type === 'empty') {
    const data = getCellData(state.totalDistance, cell.type);
    gain(state, 'fame', Math.max(1, Math.round(data.rewards.fame * 0.3)));
    advanceCell(state);
    return;
  }
  if (cell.type === 'loot') {
    const data = getCellData(state.totalDistance, cell.type);
    grantLoot(state, data, 1);
    advanceCell(state);
    return;
  }
  if (isEventCellType(cell.type)) { resolveMapEvent(state, cell.type); advanceCell(state); return; }
  // enemy ou boss
  const data = getCellData(state.totalDistance, cell.type, cell.bossId);
  let enemyPower = data.enemyPower;
  if (data.boss && data.boss.classPowerMod && state.class && data.boss.classPowerMod[state.class]) {
    enemyPower = Math.round(enemyPower * (1 + data.boss.classPowerMod[state.class]));
  }
  const winChance = totalPower <= 0 ? 0.05 : totalPower / (totalPower + enemyPower);
  const chance = clamp(winChance, 0.05, 0.97);
  if (Math.random() < chance) resolveVictory(state, data, fleetCalc, cell.type === 'boss');
  else {
    // Rainha Pirata (v0.1.0): rouba parte do seu Ouro a cada derrota contra ela.
    if (data.boss && data.boss.goldStealOnLoss) {
      const stolen = Math.round(state.resources.gold * data.boss.goldStealOnLoss);
      if (stolen > 0) { state.resources.gold -= stolen; logKey(state, 'boss_goldsteal'); }
    }
    logKey(state, 'log_defeat');
  }
}

function grantLoot(state, data, mult) {
  const lootBonus = (1 + getRelicEffect(state, 'lootBonus') + getTreeEffect(state, 'pirate', 'lootBonus') + treeNodeEffectTotal(state, 'lootBonus') + achievementBonusTotal(state, 'lootBonus')) * mult;
  gain(state, 'gold', data.rewards.gold * lootBonus);
  gain(state, 'wood', data.rewards.wood * lootBonus);
  const itemChance = data.rewards.itemChance + getRelicEffect(state, 'itemChance') + treeNodeEffectTotal(state, 'itemChance') + achievementBonusTotal(state, 'itemChance');
  if (Math.random() < itemChance) {
    const item = rollItem(state.totalDistance);
    state.inventory.push(item);
    logKey(state, 'log_item_found', { name: itemName(state, item), rarity: L(state, RARITY[item.rarity], 'name') });
  }
}

// ---------- Eventos de Mapa ----------

function resolveMapEvent(state, type) {
  const scale = Math.pow(1.15, state.totalDistance);
  if (type === 'storm') {
    const lost = Math.round(state.resources.wood * 0.1);
    state.resources.wood = Math.max(0, state.resources.wood - lost);
    gain(state, 'fame', Math.max(1, Math.round(2 * scale)));
    logKey(state, 'event_storm_result');
  } else if (type === 'abandoned_island') {
    gain(state, 'gold', Math.round(20 * scale));
    gain(state, 'wood', Math.round(15 * scale));
    if (Math.random() < 0.3) {
      const item = rollItem(state.totalDistance);
      state.inventory.push(item);
      logKey(state, 'log_item_found', { name: itemName(state, item), rarity: L(state, RARITY[item.rarity], 'name') });
    }
    logKey(state, 'event_abandoned_island_result');
  } else if (type === 'merchant') {
    if (state.class === 'pirate') {
      const stolen = Math.round(60 * scale);
      gain(state, 'gold', stolen);
      adjustFaction(state, 'merchants', -8);
      adjustFaction(state, 'pirates_f', 2);
      logKey(state, 'event_merchant_pirate_result');
    } else if (state.class === 'corsair') {
      gain(state, 'gold', Math.round(15 * scale));
      gain(state, 'fame', Math.max(1, Math.round(4 * scale)));
      adjustFaction(state, 'merchants', 3);
      adjustFaction(state, 'navy', 1);
      logKey(state, 'event_merchant_corsair_result');
    } else {
      const woodSpent = Math.min(state.resources.wood, Math.round(20 * scale));
      state.resources.wood -= woodSpent;
      gain(state, 'gold', woodSpent * 2.5);
      adjustFaction(state, 'merchants', 2);
      logKey(state, 'event_merchant_result');
    }
  } else if (type === 'mutiny') {
    const affected = Math.min(state.crew.looters + state.crew.carpenters + state.crew.distillers, Math.ceil(state.crew.total * 0.15));
    let remaining = affected;
    ['looters', 'carpenters', 'distillers'].forEach(job => {
      if (remaining <= 0) return;
      const amt = Math.min(state.crew[job], remaining);
      state.crew[job] -= amt; state.crew.idle += amt; remaining -= amt;
    });
    gain(state, 'fame', 0);
    logKey(state, 'event_mutiny_result');
  } else if (type === 'ghost_ship') {
    const item = rollItem(state.totalDistance + 5);
    state.inventory.push(item);
    adjustFaction(state, 'smugglers', 2);
    logKey(state, 'event_ghost_ship_result');
    logKey(state, 'log_item_found', { name: itemName(state, item), rarity: L(state, RARITY[item.rarity], 'name') });
  } else if (type === 'buried_treasure') {
    gain(state, 'gold', Math.round(45 * scale));
    gain(state, 'maps', 1);
    adjustFaction(state, 'smugglers', 2);
    if (Math.random() < 0.05) {
      const notOwned = RELICS.filter(r => !state.relics.includes(r.id));
      if (notOwned.length) {
        const relic = notOwned[Math.floor(Math.random() * notOwned.length)];
        state.relics.push(relic.id);
        logKey(state, 'log_relic_found', { name: L(state, relic, 'name') });
      }
    }
    logKey(state, 'event_buried_treasure_result');
  }
}

function resolveVictory(state, data, fleetCalc, isBoss) {
  state.stats.totalBattlesWon = (state.stats.totalBattlesWon || 0) + 1;
  grantLoot(state, data, 1 + fleetCalc.loot * 0.01);
  gain(state, 'fame', data.rewards.fame * (1 + getRelicEffect(state, 'fameGain')));
  checkRankUp(state);
  if (Math.random() < data.rewards.mapsChance) gain(state, 'maps', 1);
  if (isBoss) {
    if (data.boss) state.permaStats.bossesDefeated[data.boss.id] = true;
    if (Math.random() < data.rewards.relicChance) {
      const notOwned = RELICS.filter(r => !state.relics.includes(r.id));
      if (notOwned.length) {
        const relic = notOwned[Math.floor(Math.random() * notOwned.length)];
        state.relics.push(relic.id);
        logKey(state, 'log_relic_found', { name: L(state, relic, 'name') });
      }
    }
    if (data.boss && data.boss.factionEffect) {
      for (const fid in data.boss.factionEffect) adjustFaction(state, fid, data.boss.factionEffect[fid]);
    }
    const echoNode = UPGRADE_TREE.find(n => n.effect.type === 'bossChainChance');
    if (echoNode && isNodeBought(state, echoNode.id) && Math.random() < echoNode.effect.value) {
      grantLoot(state, data, 2);
      gain(state, 'fame', data.rewards.fame * 2);
      logKey(state, 'log_boss_chain');
    }
  }
  logKey(state, 'log_victory', { gold: fmt(data.rewards.gold), fame: fmt(data.rewards.fame) });
  advanceCell(state);
}

function advanceCell(state) {
  state.totalDistance++;
  state.cellIndex++;
  if (state.cellIndex >= state.map.cells.length) {
    logKey(state, 'log_map_complete');
    state.permaStats.mapsCompletedTotal = (state.permaStats.mapsCompletedTotal || 0) + 1;
    state.map = generateMap(state.map.number + 1, !!state.worldEvent);
    state.cellIndex = 0;
  }
}

// ---------- Itens / inventário ----------

function pickRarity(distanceIndex, state) {
  const legendaryMult = (state && worldEventEffect(state, 'legendaryMult')) || 1;
  const table = [
    ['common', Math.max(12, 78 - distanceIndex * 0.9)],
    ['uncommon', Math.min(30, 14 + distanceIndex * 0.25)],
    ['rare', Math.min(22, 4 + distanceIndex * 0.18)],
    ['elite', Math.min(14, 1.2 + distanceIndex * 0.10)],
    ['legendary', Math.min(8, 0.5 + distanceIndex * 0.05) * legendaryMult],
    ['ultra', Math.min(4, 0.1 + distanceIndex * 0.02) * legendaryMult],
  ];
  const total = table.reduce((a, tt) => a + tt[1], 0);
  let r = Math.random() * total;
  for (const [k, w] of table) { if (r < w) return k; r -= w; }
  return 'common';
}
function rollItem(distanceIndex) {
  const usableSlots = Object.keys(SLOT_INFO).filter(s => distanceIndex >= (SLOT_UNLOCK_DISTANCE[s] || 0));
  const pool = usableSlots.length ? usableSlots : ['hull'];
  const slot = pool[Math.floor(Math.random() * pool.length)];
  const gs = typeof STATE !== 'undefined' ? STATE : null;
  const rarity = pickRarity(distanceIndex, gs);
  const info = RARITY[rarity];
  const baseValue = 2 + distanceIndex * 0.6;
  let value = Math.round(baseValue * info.mult * (0.85 + Math.random() * 0.3) * 10) / 10;
  // v0.1.0: diferenciação de classe — Pirata acha itens ofensivos melhores, Corsário acha itens defensivos melhores.
  if (gs && gs.class === 'pirate' && (slot === 'cannon' || slot === 'bow')) value = Math.round(value * 1.15 * 10) / 10;
  if (gs && gs.class === 'corsair' && (slot === 'hull' || slot === 'charm')) value = Math.round(value * 1.15 * 10) / 10;
  const adjectives = ['do Terror', 'Amaldiçoado(a)', 'Sombrio(a)', 'da Fortuna', 'do Kraken', 'Real', 'Ancestral', 'da Tempestade', 'do Naufrágio'];
  const adjectivesEn = ['of Terror', 'Cursed', 'Shadowy', 'of Fortune', 'of the Kraken', 'Royal', 'Ancestral', 'of the Storm', 'of the Wreck'];
  const idx = Math.floor(Math.random() * adjectives.length);
  return { uid: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 100000), slot, rarity, value, name: `${SLOT_INFO[slot].name} ${adjectives[idx]}`, name_en: `${SLOT_INFO[slot].name_en} ${adjectivesEn[idx]}` };
}
function itemName(state, item) { return L(state, item, 'name'); }

function equipItem(state, itemUid) {
  const idx = state.inventory.findIndex(i => i.uid === itemUid);
  if (idx === -1) return;
  const item = state.inventory[idx];
  if (!(item.slot in state.mainShip.equipment)) { logKey(state, 'log_need_slot', { slot: L(state, SLOT_INFO[item.slot], 'name') }); return; }
  if (!slotUsable(state, item.slot)) { logKey(state, 'log_slot_is_locked'); return; }
  const current = state.mainShip.equipment[item.slot];
  state.inventory.splice(idx, 1);
  if (current) state.inventory.push(current);
  state.mainShip.equipment[item.slot] = item;
}
function unequipItem(state, slot) {
  const item = state.mainShip.equipment[slot];
  if (!item) return;
  state.mainShip.equipment[slot] = null;
  state.inventory.push(item);
}
function autoEquip(state, itemUid) { equipItem(state, itemUid); }
function scrapItem(state, itemUid) {
  const idx = state.inventory.findIndex(i => i.uid === itemUid);
  if (idx === -1) return;
  const item = state.inventory[idx];
  state.inventory.splice(idx, 1);
  gain(state, 'gold', Math.round(item.value * 10));
}

// ---------- Missões ----------

function generateQuest(state) {
  const tpl = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
  const scale = 1 + state.rankIndex * 0.6 + state.prestige.count * 0.3;
  const amount = Math.ceil(tpl.baseAmount * scale * (0.85 + Math.random() * 0.3));
  return { id: 'q_' + Date.now() + '_' + Math.floor(Math.random() * 100000), tpl, amount, startValue: 0, reward: generateQuestReward(tpl.rewardType, scale) };
}
function generateQuestReward(type, scale) {
  if (type === 'fame') return { fame: Math.ceil(10 * scale) };
  if (type === 'gold') return { gold: Math.ceil(80 * scale) };
  if (type === 'item') return { item: true };
  return { gold: Math.ceil(50 * scale) };
}
function questProgressValue(state, tpl) {
  if (tpl.type === 'deliver') return state.stats['total_' + tpl.resource + '_earned'] || 0;
  if (tpl.type === 'battles') return state.stats.totalBattlesWon || 0;
  if (tpl.type === 'recruit') return state.crew.total;
  if (tpl.type === 'supportships') return state.stats.totalSupportShipsBought || 0;
  return 0;
}
function checkQuest(state, q) { return questProgressValue(state, q.tpl) - q.startValue >= q.amount; }
function acceptQuest(state, id) {
  if (state.quests.length >= QUEST_SLOTS) return;
  const idx = state.questPool.findIndex(q => q.id === id);
  if (idx === -1) return;
  const q = state.questPool[idx];
  q.startValue = questProgressValue(state, q.tpl);
  state.questPool.splice(idx, 1);
  state.quests.push(q);
  ensureQuestPool(state);
}
function claimQuest(state, id) {
  const idx = state.quests.findIndex(q => q.id === id);
  if (idx === -1) return;
  const q = state.quests[idx];
  if (!checkQuest(state, q)) return;
  for (const k in q.reward) {
    if (k === 'item') { const item = rollItem(state.totalDistance + 3); state.inventory.push(item); logKey(state, 'log_item_found', { name: itemName(state, item), rarity: L(state, RARITY[item.rarity], 'name') }); }
    else gain(state, k, q.reward[k]);
  }
  checkRankUp(state);
  logKey(state, 'log_quest_complete', { label: questLabel(state, q) });
  state.quests.splice(idx, 1);
}

// ---------- Contratos ----------

function generateContract(state) {
  const origin = state.class === 'pirate' ? 'pirate' : (state.class === 'corsair' ? 'corsair' : 'geral');
  const pool = [...CONTRACT_TEMPLATES.geral,
    ...(state.class === 'pirate' ? CONTRACT_TEMPLATES.pirate : []),
    ...(state.class === 'corsair' ? CONTRACT_TEMPLATES.corsair : [])];
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  const isPirateTpl = CONTRACT_TEMPLATES.pirate.includes(tpl);
  const isCorsairTpl = CONTRACT_TEMPLATES.corsair.includes(tpl);
  const scale = 1 + state.prestige.count * 0.4 + state.rankIndex * 0.3;
  const cost = {}; for (const k in tpl.cost) cost[k] = Math.ceil(tpl.cost[k] * scale);
  const reward = {}; for (const k in tpl.reward) reward[k] = Math.ceil(tpl.reward[k] * scale);
  const officeBonus = buildingDef('contract_office').effect(state.island.buildings.contract_office) * 0.03;
  const merchantDiscount = factionBonus(state, 'merchants', 0.15);
  const escortBonus = getTreeEffect(state, 'corsair', 'contractReward') + officeBonus + achievementBonusTotal(state, 'contractReward');
  if (escortBonus) for (const k in reward) reward[k] = Math.ceil(reward[k] * (1 + escortBonus));
  if (merchantDiscount > 0) for (const k in cost) cost[k] = Math.max(1, Math.ceil(cost[k] * (1 - merchantDiscount)));
  return { id: 'c_' + Date.now() + '_' + Math.floor(Math.random() * 100000), tpl, cost, reward, contractType: isPirateTpl ? 'pirate' : (isCorsairTpl ? 'corsair' : 'geral') };
}
function completeContract(state, id) {
  const idx = state.contracts.findIndex(c => c.id === id);
  if (idx === -1) return;
  const c = state.contracts[idx];
  if (!canAfford(state, c.cost)) { logKey(state, 'log_not_enough'); return; }
  payCost(state, c.cost);
  for (const k in c.reward) gain(state, k, c.reward[k]);
  checkRankUp(state);
  state.permaStats.totalContractsCompleted = (state.permaStats.totalContractsCompleted || 0) + 1;
  if (c.contractType === 'pirate') { adjustFaction(state, 'pirates_f', 3); adjustFaction(state, 'navy', -2); }
  else if (c.contractType === 'corsair') { adjustFaction(state, 'navy', 3); adjustFaction(state, 'corsairs_f', 2); adjustFaction(state, 'pirates_f', -2); }
  else adjustFaction(state, 'merchants', 2);
  state.contracts.splice(idx, 1);
  logKey(state, 'log_contract_complete', { name: L(state, c.tpl, 'name') });
  ensureContracts(state);
}
function processContracts(state, dt) {
  if (!state.unlocked.quests) return;
  state.contractCooldown -= dt;
  if (state.contracts.length < CONTRACT_SLOTS && state.contractCooldown <= 0) {
    state.contracts.push(generateContract(state));
    state.contractCooldown = 20;
  }
}

// ---------- Prestígio ----------

function canPrestige(state) { return state.mainShip.tier >= 3 && isNodeBought(state, 'imperial_ambitions'); }
function calcDoubloonGain(state) {
  const shipScore = SHIP_TYPES[state.mainShip.tier].power;
  const base = Math.sqrt(shipScore + state.resources.fame * 2) * 1.2;
  const classBonus = state.class === 'corsair' ? 0.15 : 0;
  const bonus = getTreeEffect(state, 'general', 'doubloonGain') + getTreeEffect(state, 'corsair', 'doubloonGain') + factionBonus(state, 'corsairs_f', 0.10) + achievementBonusTotal(state, 'doubloonGain') + classBonus;
  const relicB = getRelicEffect(state, 'doubloonGain');
  return Math.max(1, Math.floor(base * (1 + bonus + relicB)));
}
function doPrestige(state, chosenClass) {
  const gained = calcDoubloonGain(state);
  state.prestige.doubloons += gained;
  state.prestige.count += 1;
  state.class = chosenClass;
  if (chosenClass === 'pirate') { adjustFaction(state, 'pirates_f', 10); adjustFaction(state, 'navy', -5); adjustFaction(state, 'merchants', -3); }
  else { adjustFaction(state, 'navy', 8); adjustFaction(state, 'corsairs_f', 10); adjustFaction(state, 'pirates_f', -5); }
  state.resources = { gold: 50, wood: 30, rum: 0, gunpowder: 0, iron: 0, cloth: 0, spices: 0, maps: 0, fame: 0 };
  state.resources.gold += getTreeEffect(state, 'general', 'startGold');
  state.crew = { total: 3, idle: 3, looters: 0, carpenters: 0, distillers: 0, combat: 0 };
  state.crewGrowthAccum = 0;
  state.mainShip = freshMainShip();
  state.supportFleet = freshSupportFleet();
  state.island = { buildings: freshBuildingsState(), sectorsUnlocked: 3 };
  state.rankIndex = 0;
  state.inventory = [];
  state.totalDistance = 0;
  state.map = generateMap(1, !!state.worldEvent);
  state.cellIndex = 0;
  state.combatTimer = 4;
  state.questPool = [];
  state.quests = [];
  state.contracts = [];
  state.contractCooldown = 5;
  state.unlocked.fleet = false;
  state.unlocked.quests = false;
  state.unlocked.inventory = false;
  // After the first Prestige, the Prestige page remains available so the player can spend Doubloons.
  state.unlocked.prestige = state.prestige.count > 0;
  state.upgradesBought = {};
  state.automation = { autoAssignCrew: false, autoAssignAdvanced: false };
  state.autoRebalanceTimer = 0;
  state.worldEvent = null;
  ensureQuestPool(state);
  ensureContracts(state);
  logKey(state, 'log_prestige_done', { gained, cls: chosenClass === 'pirate' ? t(state, 'class_pirate') : t(state, 'class_corsair') });
  saveGame(state);
}

// ---------- Loop principal ----------

function tick(state, dt) {
  if (!state.settings.lang) return;
  const rates = calcProductionRates(state);
  for (const k in rates) gain(state, k, rates[k] * dt);
  processCrewGrowth(state, dt);
  processAutoRebalance(state, dt);
  processExploration(state, dt);
  processContracts(state, dt);
  processWorldEvent(state, dt);
  checkAchievements(state);
}

let STATE = null;
let lastFrame = Date.now();
let saveTimer = 0;
let lastUnlockCheck = 0;

function gameLoop() {
  const now = Date.now();
  const dt = Math.min(2, (now - lastFrame) / 1000);
  lastFrame = now;
  tick(STATE, dt);
  if (now - lastUnlockCheck > 500) {
    lastUnlockCheck = now;
    updateAllUnlocks(STATE);
  }
  saveTimer += dt;
  if (saveTimer >= 10) { saveTimer = 0; saveGame(STATE); }
  renderFrame(STATE);
}

function applyOfflineProgress(state) {
  if (!state || !state.meta || !state.meta.lastSavedAt || !state.settings.lang) return 0;
  const elapsed = Math.max(0, Math.min(8 * 60 * 60, (Date.now() - state.meta.lastSavedAt) / 1000));
  if (elapsed < 2) return 0;
  tick(state, elapsed);
  logKey(state, 'log_offline_progress', { time: fmt(elapsed) });
  return elapsed;
}

function initGame() {
  const loaded = loadGame();
  STATE = loaded || newGameState();
  if (loaded) applyOfflineProgress(STATE);
  if (STATE.settings.lang) {
    updateAllUnlocks(STATE);
    ensureQuestPool(STATE);
    ensureContracts(STATE);
  }
  bindEvents();
  fullRender(STATE);
  setInterval(gameLoop, 200);
}

document.addEventListener('DOMContentLoaded', initGame);
