// ============================================================
// Corsário's Fortune — Alpha 0.01
// app.js — estado do jogo, regras/mecânicas e o game loop.
// A renderização (HTML) fica em ui.js.
// ============================================================

const SAVE_KEY = 'corsarios_fortune_save_v1';

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

function gain(state, key, amount) {
  if (!amount || amount <= 0) return;
  state.resources[key] = (state.resources[key] || 0) + amount;
  const statKey = 'total_' + key + '_earned';
  state.stats[statKey] = (state.stats[statKey] || 0) + amount;
}

function log(state, msg) {
  state.log.unshift({ t: Date.now(), msg });
  if (state.log.length > 40) state.log.length = 40;
}

// ---------- Estado inicial ----------

function freshBuildingsState() {
  return { quarters: 0, tavern: 0, mint: 0, forge: 0, plantation: 0, contract_office: 0, watchtower: 0, relic_chamber: 0 };
}

function makeShip(typeId, uidCounterRef) {
  const type = SHIP_TYPES[typeId];
  const equipment = {};
  type.slots.forEach(s => equipment[s] = null);
  return { uid: 'ship_' + (uidCounterRef.n++), typeId, name: randomShipName(), role: 'ataque', equipment };
}

function newGameState() {
  const uidRef = { n: 1 };
  const state = {
    version: '0.01',
    class: null, // 'pirate' | 'corsair' — escolhido no primeiro prestígio
    resources: { gold: 50, wood: 30, rum: 0, gunpowder: 0, iron: 0, cloth: 0, spices: 0, maps: 0, fame: 0 },
    crew: { total: 3, idle: 3, looters: 0, carpenters: 0, distillers: 0, combat: 0 },
    crewGrowthAccum: 0,
    fleet: [],
    shipUidRef: uidRef,
    island: { buildings: freshBuildingsState(), sectorsUnlocked: 3 },
    rankIndex: 0,
    inventory: [],
    relics: [],
    currentIsland: 0,
    combatTimer: 4,
    quests: [],
    contracts: [],
    contractCooldown: 5,
    prestige: { doubloons: 0, count: 0, trees: { general: {}, pirate: {}, corsair: {} } },
    log: [],
    stats: { totalBattlesWon: 0, totalShipsBuilt: 0 },
    ui: { activeTab: 'fleet', modal: null },
  };
  state.fleet.push(makeShip(0, uidRef));
  ensureQuestsContracts(state);
  log(state, 'Bem-vindo(a) a bordo, capitão! Sua jornada começa agora.');
  return state;
}

function ensureQuestsContracts(state) {
  while (state.quests.length < 4) state.quests.push(generateQuest(state));
  while (state.contracts.length < 2) state.contracts.push(generateContract(state));
}

// ---------- Persistência ----------

function serializeState(state) {
  const copy = Object.assign({}, state);
  delete copy.shipUidRef;
  copy._shipUidN = state.shipUidRef.n;
  return JSON.stringify(copy);
}
function deserializeState(raw) {
  const obj = JSON.parse(raw);
  obj.shipUidRef = { n: obj._shipUidN || 1 };
  delete obj._shipUidN;
  if (!obj.ui) obj.ui = { activeTab: 'fleet', modal: null };
  if (!obj.stats) obj.stats = { totalBattlesWon: 0, totalShipsBuilt: 0 };
  return obj;
}

function saveGame(state) {
  try { localStorage.setItem(SAVE_KEY, serializeState(state)); }
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
  renderAll(STATE);
}

function hardReset() {
  if (confirm('Isso vai apagar TODO o seu progresso, incluindo Dobrões e Relíquias. Tem certeza absoluta?')) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
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
  if (level >= node.max) { log(state, 'Nível máximo desta melhoria já foi atingido.'); return; }
  const cost = nodeCost(node, level);
  if (state.prestige.doubloons < cost) { log(state, 'Dobrões insuficientes para essa melhoria.'); return; }
  state.prestige.doubloons -= cost;
  state.prestige.trees[treeName][nodeId] = level + 1;
  log(state, `Melhoria "${node.name}" avançou para o nível ${level + 1}.`);
}

// ---------- Patentes ----------

function rankName(state, idx) {
  const r = RANKS[idx];
  if (idx >= RANKS.length - 2 && state.class === 'corsair' && r.nameCorsair) return r.nameCorsair;
  return r.name;
}
function checkRankUp(state) {
  while (state.rankIndex < RANKS.length - 1 && state.resources.fame >= RANKS[state.rankIndex + 1].fame) {
    state.rankIndex++;
    log(state, `⭐ Promoção! Você agora é ${rankName(state, state.rankIndex)}.`);
  }
}

// ---------- Ilha-base ----------

function buildingDisplayName(state, id) {
  const b = BUILDINGS.find(x => x.id === id);
  return (state.class === 'corsair' && b.nameCorsair) ? b.nameCorsair : b.name;
}
function islandBaseName(state) {
  return state.class === 'corsair' ? 'Porto da Coroa' : 'Enseada dos Foragidos';
}
function buildingCostFor(state, id) {
  const b = BUILDINGS.find(x => x.id === id);
  const lvl = state.island.buildings[id] || 0;
  const reduction = Math.max(0.4, 1 - getTreeEffect(state, 'corsair', 'buildingCostReduction'));
  const cost = {};
  for (const k in b.baseCost) cost[k] = Math.ceil(b.baseCost[k] * Math.pow(b.costMult, lvl) * reduction);
  return cost;
}
function upgradeBuilding(state, id) {
  const idx = BUILDINGS.findIndex(x => x.id === id);
  if (idx >= state.island.sectorsUnlocked) { log(state, 'Expanda a ilha para desbloquear esta construção.'); return; }
  const cost = buildingCostFor(state, id);
  if (!canAfford(state, cost)) { log(state, 'Recursos insuficientes para essa construção.'); return; }
  payCost(state, cost);
  state.island.buildings[id] = (state.island.buildings[id] || 0) + 1;
  log(state, `${buildingDisplayName(state, id)} melhorada para o nível ${state.island.buildings[id]}.`);
}
function islandExpandCost(state) {
  const n = state.island.sectorsUnlocked - 3;
  return { gold: Math.ceil(300 * Math.pow(1.8, n)), wood: Math.ceil(150 * Math.pow(1.8, n)) };
}
function expandIsland(state) {
  if (state.island.sectorsUnlocked >= BUILDINGS.length) { log(state, 'Sua ilha já está totalmente expandida.'); return; }
  const cost = islandExpandCost(state);
  if (!canAfford(state, cost)) { log(state, 'Recursos insuficientes para expandir a ilha.'); return; }
  payCost(state, cost);
  state.island.sectorsUnlocked++;
  log(state, '🏝️ Sua ilha se expandiu! Uma nova construção está disponível.');
}

// ---------- Tripulação ----------

function calcCapacity(state) {
  let cap = 5;
  state.fleet.forEach(s => cap += SHIP_TYPES[s.typeId].capacity);
  cap += BUILDINGS.find(b => b.id === 'quarters').effect(state.island.buildings.quarters);
  cap *= (1 + getTreeEffect(state, 'general', 'crewCapacity'));
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
function processCrewGrowth(state, dt) {
  const cap = calcCapacity(state);
  if (state.crew.total >= cap) return;
  const rum = state.resources.rum;
  const growthBase = 0.15;
  const rumBonus = Math.min(2, rum * 0.01);
  const treeBonus = getTreeEffect(state, 'general', 'crewGrowth');
  const relicBonus = getRelicEffect(state, 'crewGrowth');
  const rate = growthBase * (1 + rumBonus) * (1 + treeBonus + relicBonus);
  state.crewGrowthAccum += rate * dt;
  if (state.crewGrowthAccum >= 1) {
    const whole = Math.floor(state.crewGrowthAccum);
    state.crewGrowthAccum -= whole;
    const actual = Math.min(whole, cap - state.crew.total);
    if (actual > 0) {
      state.crew.total += actual; state.crew.idle += actual;
      state.resources.rum = Math.max(0, state.resources.rum - actual * 0.5);
    }
  }
}

// ---------- Produção de recursos ----------

function calcProduction(state) {
  const b = state.island.buildings;
  const globalProdBonus = 1 + getTreeEffect(state, 'general', 'resourceProd') + getRelicEffect(state, 'resourceProd');
  const rankMult = 1 + RANKS[state.rankIndex].bonus;
  const mult = globalProdBonus * rankMult;
  const mintFactor = BUILDINGS.find(x => x.id === 'mint').effect(b.mint);
  const forgeLvl = BUILDINGS.find(x => x.id === 'forge').effect(b.forge);
  const plantLvl = BUILDINGS.find(x => x.id === 'plantation').effect(b.plantation);
  const tavernLvl = BUILDINGS.find(x => x.id === 'tavern').effect(b.tavern);
  const tradeBonus = 1 + getTreeEffect(state, 'corsair', 'tradeBonus');
  const idleGoldPerCrew = getTreeEffect(state, 'pirate', 'idleGold');
  return {
    gold: state.crew.looters * 1.2 * mintFactor * mult + state.crew.idle * idleGoldPerCrew,
    wood: state.crew.carpenters * 1.0 * mult,
    rum: state.crew.distillers * 0.9 * (1 + tavernLvl * 0.08) * mult,
    iron: forgeLvl * 0.6 * mult,
    gunpowder: forgeLvl * 0.3 * mult,
    spices: plantLvl * 0.5 * mult * tradeBonus,
    cloth: plantLvl * 0.4 * mult * tradeBonus,
  };
}

// ---------- Frota / combate ----------

function shipCost(state, typeId) {
  const type = SHIP_TYPES[typeId];
  const owned = state.fleet.filter(s => s.typeId === typeId).length;
  const mult = Math.pow(1.15, owned);
  const cost = {};
  for (const k in type.buildCost) cost[k] = Math.ceil(type.buildCost[k] * mult);
  return cost;
}
function nextBuildableType(state) {
  for (let i = 0; i < SHIP_TYPES.length; i++) {
    if (i === 0) continue; // já possui pelo menos o Bote inicial normalmente
    if (!state.fleet.some(s => s.typeId === i - 1)) return i - 1 >= 0 ? i - 1 : 0;
  }
  return SHIP_TYPES.length - 1;
}
function canBuildType(state, typeId) {
  if (typeId === 0) return true;
  return state.fleet.some(s => s.typeId === typeId - 1);
}
function buildShip(state, typeId) {
  const type = SHIP_TYPES[typeId];
  if (!canBuildType(state, typeId)) { log(state, 'Construa um navio do tipo anterior primeiro.'); return; }
  const cost = shipCost(state, typeId);
  if (!canAfford(state, cost)) { log(state, 'Recursos insuficientes para construir esse navio.'); return; }
  payCost(state, cost);
  const ship = makeShip(typeId, state.shipUidRef);
  state.fleet.push(ship);
  state.stats.totalShipsBuilt = (state.stats.totalShipsBuilt || 0) + 1;
  log(state, `⚓ Novo navio construído: ${type.name} "${ship.name}"!`);
}
function setShipRole(state, shipUid, role) {
  const ship = state.fleet.find(s => s.uid === shipUid);
  if (ship) ship.role = role;
}

function calcFleetPower(state) {
  let power = 0, loot = 0, explorationBonus = 0;
  state.fleet.forEach(ship => {
    const type = SHIP_TYPES[ship.typeId];
    let base = type.power;
    let atk = 0, def = 0, lootB = 0;
    for (const slot in ship.equipment) {
      const item = ship.equipment[slot];
      if (!item) continue;
      if (slot === 'cannon') atk += item.value;
      else if (slot === 'hull') def += item.value;
      else if (slot === 'bow') lootB += item.value;
      else base += item.value * 0.3;
    }
    let shipPower = base + atk + def * 0.5;
    if (ship.role === 'ataque') shipPower *= 1.25;
    if (ship.role === 'producao') shipPower *= 0.75;
    if (ship.role === 'exploracao') { shipPower *= 0.9; explorationBonus += 0.02; }
    power += shipPower;
    loot += lootB;
  });
  return { power, loot, explorationBonus };
}

function processExploration(state, dt) {
  const island = getIslandData(state.currentIsland);
  const fleetCalc = calcFleetPower(state);
  const combatCrewPower = state.crew.combat * 2.5;
  const pirateAtk = getTreeEffect(state, 'pirate', 'attackBonus');
  const relicCombat = getRelicEffect(state, 'combatPower');
  const totalPower = (fleetCalc.power + combatCrewPower) * (1 + pirateAtk) * (1 + relicCombat);
  const watchtowerFactor = BUILDINGS.find(x => x.id === 'watchtower').effect(state.island.buildings.watchtower);
  const speedBonus = watchtowerFactor + getRelicEffect(state, 'explorationSpeed');
  state.combatTimer -= dt * speedBonus;
  if (state.combatTimer <= 0) {
    state.combatTimer = 4;
    const winChance = totalPower <= 0 ? 0.05 : totalPower / (totalPower + island.enemyPower);
    const chance = Math.max(0.05, Math.min(0.97, winChance));
    if (Math.random() < chance) resolveVictory(state, island, fleetCalc);
    else log(state, `⚔️ Sua frota foi repelida em ${island.name}. Fortaleça sua frota e tente de novo.`);
  }
}

function resolveVictory(state, island, fleetCalc) {
  state.stats.totalBattlesWon = (state.stats.totalBattlesWon || 0) + 1;
  const lootBonus = 1 + getRelicEffect(state, 'lootBonus') + getTreeEffect(state, 'pirate', 'lootBonus') + fleetCalc.loot * 0.01;
  const goldGain = island.rewards.gold * lootBonus;
  gain(state, 'gold', goldGain);
  gain(state, 'wood', island.rewards.wood * lootBonus);
  gain(state, 'fame', island.rewards.fame * (1 + getRelicEffect(state, 'fameGain')));
  checkRankUp(state);
  if (Math.random() < island.rewards.mapsChance) gain(state, 'maps', 1);
  const itemChance = island.rewards.itemChance + getRelicEffect(state, 'itemChance') + fleetCalc.explorationBonus;
  if (Math.random() < itemChance) {
    const item = rollItem(state.currentIsland);
    state.inventory.push(item);
    log(state, `🎁 Encontrado: ${item.name} (${RARITY[item.rarity].name})!`);
  }
  if (island.isBoss && Math.random() < island.rewards.relicChance) {
    const notOwned = RELICS.filter(r => !state.relics.includes(r.id));
    if (notOwned.length) {
      const relic = notOwned[Math.floor(Math.random() * notOwned.length)];
      state.relics.push(relic.id);
      log(state, `🏺 RELÍQUIA ENCONTRADA: ${relic.name}! Este item é permanente, mesmo após o Prestígio.`);
    }
  }
  log(state, `✅ Vitória em ${island.name}! +${fmt(goldGain)} ouro, +${fmt(island.rewards.fame)} fama.`);
  state.currentIsland++;
}

// ---------- Itens / inventário ----------

function pickRarity(islandIndex) {
  const table = [
    ['common', Math.max(5, 40 - islandIndex * 1.2)],
    ['uncommon', 28],
    ['rare', 16 + islandIndex * 0.3],
    ['elite', 9 + islandIndex * 0.3],
    ['legendary', 5 + islandIndex * 0.2],
    ['ultra', 2 + islandIndex * 0.15],
  ];
  const total = table.reduce((a, t) => a + t[1], 0);
  let r = Math.random() * total;
  for (const [k, w] of table) { if (r < w) return k; r -= w; }
  return 'common';
}
function rollItem(islandIndex) {
  const slots = Object.keys(SLOT_INFO);
  const slot = slots[Math.floor(Math.random() * slots.length)];
  const rarity = pickRarity(islandIndex);
  const info = RARITY[rarity];
  const baseValue = 2 + islandIndex * 0.6;
  const value = Math.round(baseValue * info.mult * (0.85 + Math.random() * 0.3) * 10) / 10;
  const adjectives = ['do Terror', 'Amaldiçoado(a)', 'Sombrio(a)', 'da Fortuna', 'do Kraken', 'Real', 'Ancestral', 'da Tempestade', 'do Naufrágio'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  return { uid: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 100000), slot, rarity, value, name: `${SLOT_INFO[slot].name} ${adj}` };
}
function equipItem(state, shipUid, itemUid) {
  const ship = state.fleet.find(s => s.uid === shipUid);
  if (!ship) { log(state, 'Navio não encontrado.'); return; }
  const idx = state.inventory.findIndex(i => i.uid === itemUid);
  if (idx === -1) return;
  const item = state.inventory[idx];
  if (!(item.slot in ship.equipment)) { log(state, `Este navio não possui slot de ${SLOT_INFO[item.slot].name}.`); return; }
  const current = ship.equipment[item.slot];
  state.inventory.splice(idx, 1);
  if (current) state.inventory.push(current);
  ship.equipment[item.slot] = item;
  log(state, `Equipado: ${item.name} em ${ship.name}.`);
}
function unequipItem(state, shipUid, slot) {
  const ship = state.fleet.find(s => s.uid === shipUid);
  if (!ship) return;
  const item = ship.equipment[slot];
  if (!item) return;
  ship.equipment[slot] = null;
  state.inventory.push(item);
}
function autoEquip(state, itemUid) {
  const item = state.inventory.find(i => i.uid === itemUid);
  if (!item) return;
  const candidates = state.fleet.filter(s => item.slot in s.equipment);
  if (!candidates.length) { log(state, 'Nenhum navio da frota possui esse tipo de slot ainda.'); return; }
  let target = candidates.find(s => !s.equipment[item.slot]);
  if (!target) {
    target = candidates.reduce((a, b) => (a.equipment[item.slot].value < b.equipment[item.slot].value ? a : b));
    if (target.equipment[item.slot].value >= item.value) { log(state, 'Seus navios já têm itens iguais ou melhores nesse slot.'); return; }
  }
  equipItem(state, target.uid, itemUid);
}
function scrapItem(state, itemUid) {
  const idx = state.inventory.findIndex(i => i.uid === itemUid);
  if (idx === -1) return;
  const item = state.inventory[idx];
  state.inventory.splice(idx, 1);
  const goldBack = Math.round(item.value * 10);
  gain(state, 'gold', goldBack);
  log(state, `Sucateado ${item.name} por ${fmt(goldBack)} de ouro.`);
}

// ---------- Missões (quests) ----------

function generateQuest(state) {
  const tpl = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
  const scale = 1 + state.rankIndex * 0.6 + state.prestige.count * 0.3;
  const amount = Math.ceil(tpl.baseAmount * scale * (0.85 + Math.random() * 0.3));
  let startValue = 0;
  if (tpl.type === 'deliver') startValue = state.stats['total_' + tpl.resource + '_earned'] || 0;
  if (tpl.type === 'battles') startValue = state.stats.totalBattlesWon || 0;
  const reward = generateQuestReward(tpl.rewardType, scale);
  return { id: 'q_' + Date.now() + '_' + Math.floor(Math.random() * 100000), tpl, amount, startValue, reward };
}
function generateQuestReward(type, scale) {
  if (type === 'fame') return { fame: Math.ceil(10 * scale) };
  if (type === 'gold') return { gold: Math.ceil(80 * scale) };
  if (type === 'item') return { item: true };
  return { gold: Math.ceil(50 * scale) };
}
function checkQuest(state, q) {
  if (q.tpl.type === 'deliver') return (state.stats['total_' + q.tpl.resource + '_earned'] || 0) - q.startValue >= q.amount;
  if (q.tpl.type === 'battles') return (state.stats.totalBattlesWon || 0) - q.startValue >= q.amount;
  if (q.tpl.type === 'recruit') return state.crew.total >= q.amount;
  if (q.tpl.type === 'ships') return state.fleet.length >= q.amount;
  return false;
}
function claimQuest(state, id) {
  const idx = state.quests.findIndex(q => q.id === id);
  if (idx === -1) return;
  const q = state.quests[idx];
  if (!checkQuest(state, q)) return;
  for (const k in q.reward) {
    if (k === 'item') { const item = rollItem(state.currentIsland + 3); state.inventory.push(item); log(state, `🎁 Missão concluída! Recebeu ${item.name}.`); }
    else gain(state, k, q.reward[k]);
  }
  checkRankUp(state);
  log(state, `✅ Missão concluída: ${q.tpl.label(q.amount)}`);
  state.quests.splice(idx, 1, generateQuest(state));
}

// ---------- Contratos ----------

function maxContractSlots(state) {
  const officeLvl = BUILDINGS.find(x => x.id === 'contract_office').effect(state.island.buildings.contract_office);
  return 2 + Math.floor(officeLvl / 2) + getTreeEffect(state, 'general', 'contractSlot');
}
function generateContract(state) {
  const pool = [...CONTRACT_TEMPLATES.geral,
    ...(state.class === 'pirate' ? CONTRACT_TEMPLATES.pirate : []),
    ...(state.class === 'corsair' ? CONTRACT_TEMPLATES.corsair : [])];
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  const scale = 1 + state.prestige.count * 0.4 + state.rankIndex * 0.3;
  const cost = {}; for (const k in tpl.cost) cost[k] = Math.ceil(tpl.cost[k] * scale);
  const reward = {}; for (const k in tpl.reward) reward[k] = Math.ceil(tpl.reward[k] * scale);
  const escortBonus = getTreeEffect(state, 'corsair', 'contractReward');
  if (escortBonus) for (const k in reward) reward[k] = Math.ceil(reward[k] * (1 + escortBonus));
  return { id: 'c_' + Date.now() + '_' + Math.floor(Math.random() * 100000), name: tpl.name, cost, reward };
}
function completeContract(state, id) {
  const idx = state.contracts.findIndex(c => c.id === id);
  if (idx === -1) return;
  const c = state.contracts[idx];
  if (!canAfford(state, c.cost)) { log(state, 'Recursos insuficientes para cumprir esse contrato.'); return; }
  payCost(state, c.cost);
  for (const k in c.reward) gain(state, k, c.reward[k]);
  checkRankUp(state);
  state.contracts.splice(idx, 1);
  log(state, `📜 Contrato cumprido: ${c.name}!`);
}
function processContracts(state, dt) {
  state.contractCooldown -= dt;
  const max = maxContractSlots(state);
  if (state.contracts.length < max && state.contractCooldown <= 0) {
    state.contracts.push(generateContract(state));
    state.contractCooldown = 20;
  }
}

// ---------- Prestígio ----------

function canPrestige(state) { return state.fleet.some(s => s.typeId >= 3); }
function calcDoubloonGain(state) {
  const shipScore = state.fleet.reduce((a, s) => a + SHIP_TYPES[s.typeId].power, 0);
  const base = Math.sqrt(shipScore + state.resources.fame * 2) * 1.2;
  const bonus = getTreeEffect(state, 'general', 'doubloonGain') + getTreeEffect(state, 'corsair', 'doubloonGain');
  const relicB = getRelicEffect(state, 'doubloonGain');
  return Math.max(1, Math.floor(base * (1 + bonus + relicB)));
}
function doPrestige(state, chosenClass) {
  const gained = calcDoubloonGain(state);
  state.prestige.doubloons += gained;
  state.prestige.count += 1;
  state.class = chosenClass;
  const uidRef = state.shipUidRef;
  state.resources = { gold: 50, wood: 30, rum: 0, gunpowder: 0, iron: 0, cloth: 0, spices: 0, maps: 0, fame: 0 };
  state.resources.gold += getTreeEffect(state, 'general', 'startGold');
  state.crew = { total: 3, idle: 3, looters: 0, carpenters: 0, distillers: 0, combat: 0 };
  state.crewGrowthAccum = 0;
  state.fleet = [makeShip(0, uidRef)];
  state.island = { buildings: freshBuildingsState(), sectorsUnlocked: 3 };
  state.rankIndex = 0;
  state.inventory = [];
  state.currentIsland = 0;
  state.combatTimer = 4;
  state.quests = [];
  state.contracts = [];
  state.contractCooldown = 5;
  ensureQuestsContracts(state);
  log(state, `🎉 Prestígio! Você zarpou rumo à lenda e ganhou ${gained} Dobrões. Nova jornada como ${chosenClass === 'pirate' ? 'Pirata' : 'Corsário'}!`);
  saveGame(state);
}

// ---------- Loop principal ----------

function tick(state, dt) {
  const prod = calcProduction(state);
  for (const k in prod) gain(state, k, prod[k] * dt);
  processCrewGrowth(state, dt);
  processExploration(state, dt);
  processContracts(state, dt);
}

let STATE = null;
let lastFrame = Date.now();
let saveTimer = 0;

function gameLoop() {
  const now = Date.now();
  const dt = Math.min(2, (now - lastFrame) / 1000);
  lastFrame = now;
  tick(STATE, dt);
  saveTimer += dt;
  if (saveTimer >= 10) { saveTimer = 0; saveGame(STATE); }
  renderAll(STATE);
}

function initGame() {
  const loaded = loadGame();
  STATE = loaded || newGameState();
  ensureQuestsContracts(STATE);
  bindEvents();
  renderAll(STATE);
  setInterval(gameLoop, 200);
}

document.addEventListener('DOMContentLoaded', initGame);
