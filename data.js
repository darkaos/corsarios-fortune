// ============================================================
// Corsário's Fortune — Alpha 0.01
// data.js — toda a configuração/balanceamento do jogo vive aqui.
// Ajustar números aqui é a forma mais rápida de rebalancear o jogo.
// ============================================================

const RESOURCE_INFO = {
  gold:      { name: 'Ouro',             icon: '🪙' },
  wood:      { name: 'Madeira',          icon: '🪵' },
  rum:       { name: 'Rum',              icon: '🍺' },
  gunpowder: { name: 'Pólvora',          icon: '💥' },
  iron:      { name: 'Ferro',            icon: '⚙️' },
  cloth:     { name: 'Tecido',           icon: '🧵' },
  spices:    { name: 'Especiarias',      icon: '🌶️' },
  maps:      { name: 'Mapas do Tesouro', icon: '🗺️' },
  fame:      { name: 'Fama',             icon: '⭐' },
};

const RARITY = {
  common:    { id: 'common',    name: 'Comum',           color: '#9fa8ac', mult: 1.0 },
  uncommon:  { id: 'uncommon',  name: 'Incomum',         color: '#5fbf6b', mult: 1.5 },
  rare:      { id: 'rare',      name: 'Raro',            color: '#4f9dff', mult: 2.2 },
  elite:     { id: 'elite',     name: 'Elite',           color: '#b465e8', mult: 3.2 },
  legendary: { id: 'legendary', name: 'Lendário',        color: '#e8ab3b', mult: 4.6 },
  ultra:     { id: 'ultra',     name: 'Ultra Lendário',  color: '#ff5d5d', mult: 6.5 },
};

const SLOT_INFO = {
  hull:    { name: 'Casco',    icon: '🛡️' },
  sail:    { name: 'Vela',     icon: '⛵' },
  cannon:  { name: 'Canhão',   icon: '💣' },
  flag:    { name: 'Bandeira', icon: '🏴' },
  bow:     { name: 'Proa',     icon: '🗿' },
  charm:   { name: 'Amuleto',  icon: '🧿' },
  special: { name: 'Especial', icon: '🔮' },
};

const SHIP_TYPES = [
  { id: 0, name: 'Bote Furado',     capacity: 2,   power: 1,   buildCost: { gold: 10,     wood: 5 },                                       slots: ['hull'] },
  { id: 1, name: 'Escaler',         capacity: 4,   power: 2,   buildCost: { gold: 40,     wood: 25 },                                      slots: ['hull', 'sail'] },
  { id: 2, name: 'Chalupa',         capacity: 6,   power: 4,   buildCost: { gold: 120,    wood: 80,   iron: 10 },                           slots: ['hull', 'sail', 'cannon'] },
  { id: 3, name: 'Escuna',          capacity: 10,  power: 8,   buildCost: { gold: 350,    wood: 220,  iron: 40 },                           slots: ['hull', 'sail', 'cannon'] },
  { id: 4, name: 'Brigue',          capacity: 16,  power: 15,  buildCost: { gold: 900,    wood: 550,  iron: 120, gunpowder: 30 },           slots: ['hull', 'sail', 'cannon', 'flag'] },
  { id: 5, name: 'Fragata',         capacity: 26,  power: 28,  buildCost: { gold: 2400,   wood: 1400, iron: 320, gunpowder: 90 },           slots: ['hull', 'sail', 'cannon', 'flag', 'bow'] },
  { id: 6, name: 'Galeão',          capacity: 42,  power: 52,  buildCost: { gold: 6200,   wood: 3600, iron: 850, gunpowder: 250 },          slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm'] },
  { id: 7, name: 'Navio de Linha',  capacity: 68,  power: 95,  buildCost: { gold: 16000,  wood: 9000, iron: 2200, gunpowder: 700 },         slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm'] },
  { id: 8, name: 'Nau de Guerra',   capacity: 110, power: 170, buildCost: { gold: 42000,  wood: 23000, iron: 5800, gunpowder: 2000 },       slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm', 'special'] },
  { id: 9, name: 'Armada Lendária', capacity: 180, power: 310, buildCost: { gold: 110000, wood: 60000, iron: 15000, gunpowder: 5500 },      slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm', 'special'] },
];

const SHIP_NAME_PARTS = {
  adjectives: ['Sortuda', 'Fúria do Mar', 'Serpente Negra', 'Punho de Ferro', 'Rainha da Tempestade', 'Coração de Kraken', 'Trovão Real', 'Fantasma dos Sete Mares', 'Vento Leve', 'Sombra da Maré', 'Lâmina Salgada', 'Beijo da Sereia'],
};
function randomShipName() {
  const list = SHIP_NAME_PARTS.adjectives;
  return list[Math.floor(Math.random() * list.length)];
}

// Patentes: título pessoal do capitão. As duas últimas mudam de nome conforme a classe.
const RANKS = [
  { name: 'Grumete',          fame: 0,      bonus: 0.00 },
  { name: 'Marujo',           fame: 50,     bonus: 0.03 },
  { name: 'Marinheiro',       fame: 150,    bonus: 0.06 },
  { name: 'Artilheiro',       fame: 400,    bonus: 0.10 },
  { name: 'Timoneiro',        fame: 900,    bonus: 0.15 },
  { name: 'Contramestre',     fame: 2000,   bonus: 0.21 },
  { name: 'Imediato',         fame: 4200,   bonus: 0.28 },
  { name: 'Capitão',          fame: 8500,   bonus: 0.36 },
  { name: 'Comodoro',         fame: 17000,  bonus: 0.45 },
  { name: 'Vice-Almirante',   fame: 32000,  bonus: 0.55 },
  { name: 'Lorde Pirata',     nameCorsair: 'Almirante Corsário',        fame: 60000,  bonus: 0.68 },
  { name: 'Rei dos Piratas',  nameCorsair: 'Almirante-Mor da Coroa',    fame: 110000, bonus: 0.85 },
];

// Construções da Ilha-Base. `nameCorsair` é usado quando a classe escolhida é Corsário.
const BUILDINGS = [
  { id: 'quarters',        name: 'Alojamentos',           nameCorsair: 'Quartéis',              icon: '🛏️', desc: 'Aumenta a capacidade máxima de tripulação.',                    baseCost: { wood: 20,  gold: 10 }, costMult: 1.16, effect: lvl => lvl * 8 },
  { id: 'tavern',          name: 'Taverna Clandestina',   nameCorsair: 'Taverna do Porto',       icon: '🍻', desc: 'Melhora a produção de Rum e o crescimento da tripulação.',      baseCost: { gold: 30,  wood: 15 }, costMult: 1.17, effect: lvl => lvl },
  { id: 'mint',            name: 'Esconderijo do Ouro',   nameCorsair: 'Casa da Moeda',          icon: '🏦', desc: 'Multiplica a produção de Ouro dos saqueadores.',                baseCost: { gold: 50,  wood: 20 }, costMult: 1.18, effect: lvl => 1 + lvl * 0.12 },
  { id: 'forge',           name: 'Forja Pirata',          nameCorsair: 'Forja Real',             icon: '🔨', desc: 'Produz Ferro e Pólvora automaticamente.',                       baseCost: { gold: 80,  wood: 40 }, costMult: 1.19, effect: lvl => lvl },
  { id: 'plantation',      name: 'Roça Escondida',        nameCorsair: 'Plantação da Coroa',     icon: '🌴', desc: 'Produz Especiarias e Tecido automaticamente.',                  baseCost: { gold: 100, wood: 60 }, costMult: 1.19, effect: lvl => lvl },
  { id: 'contract_office', name: 'Mural de Recompensas',  nameCorsair: 'Sede de Contratos',      icon: '📜', desc: 'Mais contratos disponíveis ao mesmo tempo.',                    baseCost: { gold: 150, cloth: 10 }, costMult: 1.2,  effect: lvl => lvl },
  { id: 'watchtower',      name: 'Posto de Vigia',        nameCorsair: 'Torre de Sinalização',   icon: '🗼', desc: 'Acelera a exploração e o combate naval.',                       baseCost: { gold: 200, wood: 100, iron: 20 }, costMult: 1.21, effect: lvl => 1 + lvl * 0.08 },
  { id: 'relic_chamber',   name: 'Câmara do Butim',       nameCorsair: 'Câmara das Relíquias',   icon: '🏺', desc: 'Bônus global extra para cada Relíquia guardada aqui.',          baseCost: { gold: 500, iron: 60, spices: 20 }, costMult: 1.25, effect: lvl => lvl },
];

const ISLAND_NAMES = ['Ilha da Caveira', 'Baía Tormenta', 'Recife Amaldiçoado', 'Enseada do Kraken', 'Ilhota Fantasma', 'Costa Esquecida', 'Atol do Naufrágio', 'Ilha das Serpentes', 'Baía Sangrenta', 'Rochedo do Silêncio', 'Ilha do Governador', 'Arquipélago Perdido', 'Costa da Névoa', 'Ilha do Tesouro', 'Baía do Motim'];
const LAP_SUFFIX = ['', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function getIslandData(index) {
  const isBoss = (index + 1) % 5 === 0;
  const baseName = ISLAND_NAMES[index % ISLAND_NAMES.length];
  const lap = Math.floor(index / ISLAND_NAMES.length);
  const suffix = lap > 0 ? ` ${LAP_SUFFIX[lap] || ('+' + lap)}` : '';
  const name = baseName + suffix + (isBoss ? ' 💀' : '');
  const enemyPower = Math.round(8 * Math.pow(1.28, index));
  const rewardScale = Math.pow(1.22, index);
  return {
    index, name, isBoss, enemyPower,
    rewards: {
      gold: Math.round(15 * rewardScale),
      wood: Math.round(8 * rewardScale),
      fame: Math.round(3 * rewardScale) + (isBoss ? 10 : 0),
      mapsChance: isBoss ? 0.15 : 0.03,
      itemChance: isBoss ? 0.55 : 0.22,
      relicChance: isBoss ? 0.025 : 0,
    },
  };
}

const RELICS = [
  { id: 'sail_blackbeard', name: 'Vela Lendária de Barba Negra',    icon: '⛵', desc: '+15% velocidade de exploração e temporizadores.', effect: { explorationSpeed: 0.15 } },
  { id: 'kraken_cannon',   name: 'Canhão do Kraken',                icon: '💥', desc: '+25% poder de combate da frota.',                 effect: { combatPower: 0.25 } },
  { id: 'cursed_bow',      name: 'Proa Amaldiçoada',                icon: '🗿', desc: '+20% de saque (recursos) em combate.',            effect: { lootBonus: 0.20 } },
  { id: 'compass_end',     name: 'Bússola do Fim do Mundo',         icon: '🧭', desc: '+10% chance de encontrar itens em batalhas.',     effect: { itemChance: 0.10 } },
  { id: 'sunken_crown',    name: 'Coroa Afundada',                  icon: '👑', desc: '+15% de Dobrões ganhos ao fazer prestígio.',      effect: { doubloonGain: 0.15 } },
  { id: 'ghost_wheel',     name: 'Leme Fantasma',                   icon: '☠️', desc: '+20% de crescimento de tripulação.',              effect: { crewGrowth: 0.20 } },
  { id: 'siren_pearl',     name: 'Pérola da Sereia',                icon: '🦪', desc: '+18% de produção de todos os recursos.',          effect: { resourceProd: 0.18 } },
  { id: 'admiral_seal',    name: 'Selo do Almirante Perdido',       icon: '🩸', desc: '+30% de Fama ganha em combate.',                  effect: { fameGain: 0.30 } },
];

// Árvores de prestígio. Custo em Dobrões: baseCost * costMult^nível atual.
const PRESTIGE_TREES = {
  general: [
    { id: 'g_prod',          name: 'Rotas Comerciais',     desc: '+4% de produção global de recursos por nível.',            baseCost: 5,  costMult: 1.35, max: 20, effect: 'resourceProd',  perLevel: 0.04 },
    { id: 'g_capacity',      name: 'Cascos Reforçados',    desc: '+4% de capacidade de tripulação por nível.',                baseCost: 5,  costMult: 1.35, max: 20, effect: 'crewCapacity',  perLevel: 0.04 },
    { id: 'g_start_gold',    name: 'Baú Enterrado',        desc: 'Comece cada ciclo com mais Ouro.',                          baseCost: 4,  costMult: 1.30, max: 15, effect: 'startGold',     perLevel: 50 },
    { id: 'g_growth',        name: 'Recrutamento Rápido',  desc: '+5% de velocidade de crescimento da tripulação por nível.', baseCost: 6,  costMult: 1.35, max: 15, effect: 'crewGrowth',    perLevel: 0.05 },
    { id: 'g_contract_slot', name: 'Rede de Contatos',     desc: '+1 contrato disponível ao mesmo tempo (máx. 3 níveis).',    baseCost: 20, costMult: 2.20, max: 3,  effect: 'contractSlot',  perLevel: 1 },
  ],
  pirate: [
    { id: 'p_loot',         name: 'Fome de Saque',       desc: '+6% de saque em combate por nível.',                       baseCost: 5,  costMult: 1.35, max: 20, effect: 'lootBonus',      perLevel: 0.06 },
    { id: 'p_attack',       name: 'Fúria Sanguinária',   desc: '+6% de poder de ataque da frota por nível.',               baseCost: 5,  costMult: 1.35, max: 20, effect: 'attackBonus',    perLevel: 0.06 },
    { id: 'p_intimidation', name: 'Bandeira Negra',      desc: 'Reduz a penalidade de reputação em portos.',               baseCost: 8,  costMult: 1.40, max: 10, effect: 'portPenaltyRed', perLevel: 0.10 },
    { id: 'p_mutiny',       name: 'Motim Lucrativo',     desc: 'Cada tripulante ocioso gera Ouro passivo por nível.',      baseCost: 10, costMult: 1.40, max: 15, effect: 'idleGold',       perLevel: 0.3 },
  ],
  corsair: [
    { id: 'c_doubloon',  name: 'Carta Real',          desc: '+6% de Dobrões ganhos ao fazer prestígio por nível.', baseCost: 5, costMult: 1.35, max: 20, effect: 'doubloonGain',          perLevel: 0.06 },
    { id: 'c_trade',     name: 'Rotas Oficiais',      desc: '+5% de produção de Especiarias/Tecido por nível.',    baseCost: 5, costMult: 1.35, max: 20, effect: 'tradeBonus',            perLevel: 0.05 },
    { id: 'c_diplomacy', name: 'Diplomacia da Coroa', desc: '-4% de custo de construções da ilha por nível.',      baseCost: 8, costMult: 1.40, max: 15, effect: 'buildingCostReduction', perLevel: 0.04 },
    { id: 'c_escort',    name: 'Escolta Real',        desc: '+8% de recompensa de contratos por nível.',           baseCost: 8, costMult: 1.40, max: 15, effect: 'contractReward',        perLevel: 0.08 },
  ],
};

const QUEST_TEMPLATES = [
  { type: 'deliver', resource: 'gold',  label: n => `Acumule ${fmt(n)} de Ouro (total ganho)`,       baseAmount: 300, rewardType: 'fame' },
  { type: 'deliver', resource: 'wood',  label: n => `Junte ${fmt(n)} de Madeira (total ganho)`,       baseAmount: 200, rewardType: 'gold' },
  { type: 'deliver', resource: 'rum',   label: n => `Destile ${fmt(n)} de Rum (total ganho)`,         baseAmount: 100, rewardType: 'gold' },
  { type: 'battles', label: n => `Vença ${n} batalhas navais`,                                        baseAmount: 3,   rewardType: 'gold' },
  { type: 'recruit', label: n => `Alcance ${n} tripulantes a bordo`,                                  baseAmount: 10,  rewardType: 'fame' },
  { type: 'ships',   label: n => `Construa ${n} navios na frota`,                                     baseAmount: 2,   rewardType: 'item' },
];

const CONTRACT_TEMPLATES = {
  geral: [
    { name: 'Fornecimento de Madeira',   cost: { wood: 200 },              reward: { gold: 150, fame: 10 } },
    { name: 'Transporte de Especiarias', cost: { spices: 30, gold: 50 },   reward: { gold: 300 } },
    { name: 'Reparo de Frota',           cost: { wood: 100, iron: 20 },    reward: { gold: 200, fame: 8 } },
  ],
  pirate: [
    { name: 'Contrato de Saque',   cost: { gunpowder: 20 },          reward: { gold: 400, fame: 15 } },
    { name: 'Abordagem Relâmpago', cost: { gunpowder: 10, rum: 20 }, reward: { gold: 250, maps: 1 } },
  ],
  corsair: [
    { name: 'Escolta Real',      cost: { cloth: 20, gold: 100 }, reward: { fame: 25, gold: 100 } },
    { name: 'Patrulha Oficial',  cost: { gunpowder: 15 },        reward: { gold: 350, fame: 20 } },
  ],
};
