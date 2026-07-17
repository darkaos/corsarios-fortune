// ============================================================
// Corsário's Fortune — Alpha 0.1.3.3 Final
// data.js — toda a configuração/balanceamento do jogo vive aqui.
// ============================================================

// ---------- Internacionalização (PT-BR / EN) ----------

const STRINGS = {
  pt: {
    app_title: "Corsário's Fortune",
    app_subtitle: 'Alpha 0.1.3.3 Final Final — um idle/incremental de piratas e corsários',
    tab_ship: '🚢 Navio', tab_crew: '👥 Tripulação', tab_upgrades: '🔧 Melhorias', tab_island: '🏝️ Ilha', tab_exploration: '🧭 Exploração', tab_journal: '📖 Diário de Bordo',
    tab_fleet: '⛵ Frota', tab_quests: '📜 Missões', tab_inventory: '🎒 Inventário', tab_prestige: '👑 Prestígio', tab_achievements: '🏆 Conquistas', tab_settings: '⚙️ Config.',
    locked_prefix: '🔒 Bloqueado — ',
    req_island: 'monte seu acampamento',
    req_ship: 'construa sua primeira jangada',
    req_crew: 'construa sua primeira jangada',
    req_upgrades: 'construa sua primeira jangada',
    req_exploration: 'tenha ao menos 1 navio',
    req_fleet: 'compre "Estaleiro Aliado" na aba Melhorias',
    req_quests: 'compre "Contatos no Porto" na aba Melhorias',
    req_inventory: 'compre "Contatos no Porto" na aba Melhorias',
    req_prestige: 'tenha uma Escuna e compre "Ambições Imperiais" na aba Melhorias',
    req_achievements: 'construa sua primeira jangada',
    crew_summary: 'Tripulação: {total}/{cap} · Ocioso: {idle}',
    rank_prefix: 'Patente',
    class_none: 'Sem Bandeira', class_pirate: 'Pirata', class_corsair: 'Corsário',
    per_sec: '{sign}{val}/seg',
    btn_build: 'Construir', btn_upgrade_ship: 'Evoluir Navio', btn_upgrade: 'Melhorar', btn_max: 'Máx.', collect_resources_btn: 'Coletar Recursos', collect_resources_hint: 'Reúna recursos manualmente para manter sua jornada avançando.', btn_equip: 'Equipar', btn_unequip: 'Retirar',
    btn_scrap: 'Sucatear', btn_claim: 'Resgatar', btn_accept: 'Aceitar', btn_complete: 'Cumprir',
    btn_export: '⬇️ Exportar Save', btn_import: '⬆️ Importar Save', btn_reset: '🗑️ Apagar Tudo',
    btn_confirm: 'Confirmar', btn_cancel: 'Cancelar', btn_expand_island: '🏝️ Expandir Ilha',
    btn_prestige: 'Zarpar Rumo à Lenda', btn_close: 'Fechar', btn_camp: '🏕️ Montar Acampamento',
    btn_raft: '🛶 Construir Primeira Jangada', btn_got_it: 'Entendi', btn_buy: 'Comprar',
    role_ataque: '⚔️ Ataque', role_producao: '🏗️ Produção', role_exploracao: '🧭 Exploração',
    gather_wood: 'Catar Madeira', gather_scrap: 'Catar Destroços',
    castaway_title: '🏝️ Náufrago',
    castaway_text: 'Seu navio afundou numa tempestade. Você acorda sozinho numa praia desconhecida, sem nada além da roupa do corpo. Precisa se virar antes de sonhar com frotas e impérios.',
    castaway_camp_hint: 'Junte recursos suficientes para montar um acampamento.',
    castaway_raft_hint: 'Com o acampamento de pé, junte mais recursos para construir sua primeira embarcação.',
    ship_title: 'Seu Navio Principal', ship_power: 'Poder de combate do navio principal',
    slot_locked: '🔒 libera aos {n} cascos explorados',
    crew_title: 'Tripulação', crew_assign_title: 'Atribuir Tarefas',
    work_deck_btn: '💪 Trabalhar no Convés', work_deck_hint: 'Clique para uma pequena ajuda manual de recursos.',
    automation_active: '🤖 Contramestre Automático ativo: novos tripulantes vão para onde são mais necessários.',
    automation_advanced: '🤖 Automação avançada ativa: tripulação já ocupada também é realocada aos poucos.',
    job_looters: 'Saqueadores', job_carpenters: 'Carpinteiros', job_distillers: 'Destiladores', job_combat: 'Combatentes',
    island_sectors: 'Setores desbloqueados', island_fully_expanded: 'Ilha totalmente expandida.',
    buildings_title: 'Construções',
    exploration_title: 'Exploração Naval', map_label: 'Mapa #{n}', cell_label: 'Casco {cur}/{total}',
    enemy_power: 'Poder inimigo', your_power: 'Seu poder', win_chance: 'Chance de vitória',
    reinforce_btn: '⚔️ Reforçar Ataque', reinforce_hint: 'Clique para acelerar o combate atual.',
    fleet_title: 'Frota de Apoio', fleet_desc: 'Embarcações de apoio, compradas em quantidade. Não têm slots de equipamento, mas somam poder e bônus à sua expedição.',
    quests_title: 'Missões Disponíveis', quests_active: 'Missões Ativas', contracts_title: 'Contratos',
    inventory_title: 'Inventário', inventory_empty: 'Vazio. Vença batalhas ou complete missões para encontrar itens.',
    prestige_title: '👑 Prestígio — Zarpar Rumo à Lenda',
    prestige_desc: 'Reinicia navio, frota, ilha, tripulação, patente e a Árvore de Melhorias — mas concede Dobrões permanentes e mantém Relíquias e melhorias de Prestígio.',
    prestige_current: 'Dobrões atuais', prestige_projected: 'Ganho projetado agora',
    trees_title: 'Árvores de Prestígio', relics_title: 'Relíquias',
    settings_title: '⚙️ Configurações', settings_lang: 'Idioma', settings_theme: 'Tema Visual', settings_story_mode: 'Modo História', settings_reduced_story: 'Modo História Reduzido', settings_reduced_story_desc: 'Reduz a frequência dos pop-ups narrativos. As entradas continuam sendo desbloqueadas no Diário de Bordo.', settings_save: 'Salvamento', settings_community: 'Comunidade', settings_changelog: 'Histórico de Versões (Changelog)',
    journal_title: '📖 Diário de Bordo', journal_desc: 'Registros da sua jornada, desbloqueados conforme sua história avança.', journal_empty: 'Ainda não há registros no diário.', journal_act: 'Ato', journal_new_act: 'NOVO ATO', journal_new_entry: 'Nova entrada adicionada ao Diário de Bordo.', btn_read_journal: 'Ler Diário', btn_read_later: 'Ler mais tarde', warehouse_capacity: 'Capacidade do Armazém', warehouse_capacity_of: 'de', warehouse_bonus: 'capacidade', warehouse_next: 'próximo nível', warehouse_tooltip: 'Armazém Nível {level} — Capacidade: {current} recursos | Próximo nível: {next} | Bônus atual: +{bonus}% | Próximo bônus: +{nextBonus}%', btn_continue: 'Continuar',
    theme_dark: '🌑 Escuro', theme_light: '☀️ Claro', theme_sepia: '📜 Sépia', theme_white: '⬜ Branco',
    rank_modal_title: '⭐ Patentes', rank_modal_next: 'Próxima patente em',
    modal_class_title: 'Escolha sua bandeira',
    modal_class_desc: 'Essa escolha define sua árvore de prestígio e a identidade da sua ilha para este ciclo. Você pode trocar de classe no próximo Prestígio.',
    class_pirate_desc: 'Fora da lei. Bônus de saque e ataque agressivo. Portos amigos ficam mais hostis.',
    class_corsair_desc: 'Sob carta de corso. Bônus de Dobrões e comércio. Combate levemente mais fraco.',
    btn_flag_pirate: 'Zarpar como Pirata', btn_flag_corsair: 'Zarpar como Corsário',
    upgrades_title: '🔧 Árvore de Melhorias', upgrades_desc: 'Cada melhoria é comprada uma única vez. Algumas exigem melhorias anteriores primeiro, e algumas destravam abas novas ou automações.',
    node_bought: '✅ Concluído', node_locked: '🔒 Requer: {req}',
    log_welcome: 'Seu navio naufragou. Você está sozinho, mas vivo. Sobreviva.',
    log_offline_progress: '⏱️ Enquanto você esteve fora, sua tripulação continuou trabalhando por {time}.',
    log_camp_built: '🏕️ Acampamento montado! A aba Ilha foi desbloqueada.',
    log_raft_built: '🛶 Sua primeira jangada está pronta! As abas Navio, Tripulação, Melhorias e Exploração foram desbloqueadas.',
    log_promotion: '⭐ Promoção! Você agora é {rank}.',
    log_ship_upgraded: '⚓ Seu navio evoluiu para {type}!',
    log_building_upgraded: '{name} melhorada para o nível {level}.',
    log_island_expanded: '🏝️ Sua ilha se expandiu! Uma nova construção está disponível.',
    log_victory: '✅ Vitória! +{gold} ouro, +{fame} fama.',
    log_defeat: '⚔️ Sua frota foi repelida. Fortaleça seu navio e tente de novo.',
    log_item_found: '🎁 Encontrado: {name} ({rarity})!',
    log_relic_found: '🏺 RELÍQUIA ENCONTRADA: {name}! Este item é permanente.',
    log_map_complete: '🗺️ Mapa concluído! Gerando novo mapa, mais perigoso e recompensador.',
    log_quest_complete: '✅ Missão concluída: {label}',
    log_contract_complete: '📜 Contrato cumprido: {name}!',
    log_prestige_done: '🎉 Prestígio! Você zarpou rumo à lenda e ganhou {gained} Dobrões. Nova jornada como {cls}!',
    log_node_bought: '🔧 Melhoria concluída: {name}!',
    log_tab_unlocked_by_node: '🔓 Nova aba desbloqueada: {tab}',
    log_not_enough: 'Recursos insuficientes.',
    log_need_slot: 'Este navio não possui slot de {slot}.',
    log_slot_is_locked: 'Esse slot ainda está bloqueado.',
    log_max_level: 'Nível máximo desta melhoria já foi atingido.',
    log_not_enough_doubloons: 'Dobrões insuficientes para essa melhoria.',
    hint_island_title: '🏝️ Sua Ilha', hint_island_text: 'Aqui você constrói e melhora edifícios que produzem recursos automaticamente. Expanda a ilha para liberar mais construções.',
    hint_ship_title: '🚢 Seu Navio Principal', hint_ship_text: 'Este é o seu navio, com slots de equipamento. Evolua para tipos maiores e equipe itens encontrados em batalha. Alguns slots só liberam conforme você avança na Exploração.',
    hint_crew_title: '👥 Tripulação', hint_crew_text: 'Atribua tarefas aos seus tripulantes. Use "Trabalhar no Convés" para um empurrão manual de recursos. Melhorias de tripulação agora ficam na aba Melhorias.',
    hint_upgrades_title: '🔧 Árvore de Melhorias', hint_upgrades_text: 'Compre melhorias permanentes (uma vez cada). Algumas destravam Missões, Frota e até o Prestígio — fique de olho nos pré-requisitos.',
    hint_exploration_title: '🧭 Exploração', hint_exploration_text: 'Seu navio avança automaticamente por um mapa de cascos. Use "Reforçar Ataque" para acelerar batalhas manualmente.',
    hint_fleet_title: '⛵ Frota de Apoio', hint_fleet_text: 'Compre embarcações de apoio em quantidade — elas somam poder e bônus, mas não têm equipamento próprio.',
    hint_quests_title: '📜 Missões e Contratos', hint_quests_text: 'Aceite até 3 missões por vez de uma lista de opções, e cumpra contratos por recompensas maiores.',
    hint_prestige_title: '👑 Prestígio', hint_prestige_text: 'Reinicie sua jornada em troca de Dobrões permanentes, e escolha ser Pirata ou Corsário.',
    hint_achievements_title: '🏆 Conquistas', hint_achievements_text: 'Marcos permanentes que nunca resetam, nem no Prestígio. Cada um dá um pequeno bônus para sempre.',
    achievements_title: '🏆 Conquistas', achievements_desc: 'Permanentes — nunca resetam, mesmo com o Prestígio. Cada uma dá um pequeno bônus para sempre.',
    log_achievement_unlocked: '🏆 Conquista desbloqueada: {name}!',
    effect_clickPower: 'Trabalho Manual', effect_lootBonus: 'Saque', effect_resourceProd: 'Produção de Recursos',
    effect_itemChance: 'Chance de Item', effect_doubloonGain: 'Ganho de Dobrões', effect_combatPower: 'Poder de Combate',
    effect_contractReward: 'Recompensa de Contratos', effect_explorationSpeed: 'Velocidade de Exploração',
    factions_title: '🌍 Reputação com Facções', factions_desc: 'Sua fama pelo mundo — persiste mesmo depois do Prestígio.',
    world_event_active: 'Evento Mundial ativo', world_event_ends_in: 'termina em',
    permanent_tag: 'PERMANENTE', node_prereq_label: 'Requer',
    log_world_event_start: '🌍 Evento Mundial: {name}! {desc}',
    log_world_event_end: '🌍 O evento "{name}" terminou.',
    log_boss_chain: '🔁 Eco de Batalha! Outro chefe apareceu na sequência — recompensas dobradas novamente!',
    log_jackpot: '🍀 Cracas da Sorte! Você achou uma moeda antiga rara: +{gold} Ouro!',
    event_storm_result: '🌩️ Uma tempestade atrasou sua travessia, mas a tripulação se recuperou com um pouco de Fama.',
    event_abandoned_island_result: '🏝️ Vocês saquearam uma ilha abandonada!',
    event_merchant_result: '⚖️ Um mercador trocou parte da sua Madeira por Ouro.',
    event_merchant_pirate_result: '🏴‍☠️ Seus piratas atacaram o navio mercador! Muito mais Ouro, mas os Mercadores não vão esquecer.',
    event_merchant_corsair_result: '⚜️ Negociação diplomática com o mercador — bom para a Fama e a reputação com a Coroa.',
    boss_goldsteal: '👑 A Rainha Pirata roubou parte do seu Ouro antes de fugir!',
    event_mutiny_result: '😠 Parte da tripulação se amotinou brevemente — alguns voltaram a ficar ociosos.',
    event_ghost_ship_result: '👻 Um Navio Fantasma! Item garantido, mas nada de recursos.',
    event_buried_treasure_result: '💎 Tesouro Enterrado desenterrado!',
  },
  en: {
    app_title: "Corsário's Fortune",
    app_subtitle: 'Alpha 0.1.3.3 Final — a pirate & privateer idle/incremental game',
    tab_ship: '🚢 Ship', tab_crew: '👥 Crew', tab_upgrades: '🔧 Upgrades', tab_island: '🏝️ Island', tab_exploration: '🧭 Exploration',
    tab_fleet: '⛵ Fleet', tab_quests: '📜 Quests', tab_inventory: '🎒 Inventory', tab_prestige: '👑 Prestige', tab_achievements: '🏆 Achievements', tab_journal: "📖 Captain's Log", tab_settings: '⚙️ Settings',
    locked_prefix: '🔒 Locked — ',
    req_island: 'set up your camp',
    req_ship: 'build your first raft',
    req_crew: 'build your first Quarters',
    req_upgrades: 'build your first raft',
    req_exploration: 'upgrade your ship to a Sloop',
    req_fleet: 'buy "Allied Shipyard" in the Upgrades tab',
    req_quests: 'buy "Port Contacts" in the Upgrades tab',
    req_inventory: 'buy "Port Contacts" in the Upgrades tab',
    req_prestige: 'own a Sloop and buy "Imperial Ambitions" in the Upgrades tab',
    req_achievements: 'build your first raft',
    crew_summary: 'Crew: {total}/{cap} · Idle: {idle}',
    rank_prefix: 'Rank',
    class_none: 'No Flag', class_pirate: 'Pirate', class_corsair: 'Privateer',
    per_sec: '{sign}{val}/sec',
    btn_build: 'Build', btn_upgrade_ship: 'Upgrade Ship', btn_upgrade: 'Upgrade', btn_max: 'Max', collect_resources_btn: 'Collect Resources', collect_resources_hint: 'Gather resources manually to keep your journey moving forward.', btn_equip: 'Equip', btn_unequip: 'Unequip',
    btn_scrap: 'Scrap', btn_claim: 'Claim', btn_accept: 'Accept', btn_complete: 'Fulfill',
    btn_export: '⬇️ Export Save', btn_import: '⬆️ Import Save', btn_reset: '🗑️ Delete Everything',
    btn_confirm: 'Confirm', btn_cancel: 'Cancel', btn_expand_island: '🏝️ Expand Island',
    btn_prestige: 'Sail Into Legend', btn_close: 'Close', btn_camp: '🏕️ Set Up Camp',
    btn_raft: '🛶 Build First Raft', btn_got_it: 'Got it', btn_buy: 'Buy',
    role_ataque: '⚔️ Attack', role_producao: '🏗️ Production', role_exploracao: '🧭 Exploration',
    gather_wood: 'Gather Wood', gather_scrap: 'Gather Scrap',
    castaway_title: '🏝️ Castaway',
    castaway_text: 'Your ship sank in a storm. You wake up alone on an unknown beach, with nothing but the clothes on your back. You need to survive before dreaming of fleets and empires.',
    castaway_camp_hint: 'Gather enough resources to set up a camp.',
    castaway_raft_hint: 'With camp established, gather more resources to build your first vessel.',
    ship_title: 'Your Main Ship', ship_power: 'Main ship combat power',
    slot_locked: '🔒 unlocks at {n} tiles explored',
    crew_title: 'Crew', crew_assign_title: 'Assign Tasks',
    work_deck_btn: '💪 Work the Deck', work_deck_hint: 'Click for a small manual boost of resources.',
    automation_active: '🤖 Auto-Boatswain active: new crew members go where they are most needed.',
    automation_advanced: '🤖 Advanced automation active: already-working crew is also gradually rebalanced.',
    job_looters: 'Looters', job_carpenters: 'Carpenters', job_distillers: 'Distillers', job_combat: 'Fighters',
    island_sectors: 'Sectors unlocked', island_fully_expanded: 'Island fully expanded.',
    buildings_title: 'Buildings',
    exploration_title: 'Naval Exploration', map_label: 'Map #{n}', cell_label: 'Tile {cur}/{total}',
    enemy_power: 'Enemy power', your_power: 'Your power', win_chance: 'Win chance',
    reinforce_btn: '⚔️ Reinforce Attack', reinforce_hint: 'Click to speed up the current battle.',
    fleet_title: 'Support Fleet', fleet_desc: 'Support vessels, bought in bulk. No equipment slots, but they add power and bonuses to your expedition.',
    quests_title: 'Available Quests', quests_active: 'Active Quests', contracts_title: 'Contracts',
    inventory_title: 'Inventory', inventory_empty: 'Empty. Win battles or complete quests to find items.',
    prestige_title: '👑 Prestige — Sail Into Legend',
    prestige_desc: 'Resets ship, fleet, island, crew, rank and the Upgrade Tree — but grants permanent Doubloons and keeps Relics and Prestige upgrades.',
    prestige_current: 'Current Doubloons', prestige_projected: 'Projected gain now',
    trees_title: 'Prestige Trees', relics_title: 'Relics',
    settings_title: '⚙️ Settings', settings_lang: 'Language', settings_theme: 'Visual Theme', settings_story_mode: 'Story Mode', settings_reduced_story: 'Reduced Story Mode', settings_reduced_story_desc: 'Reduces the frequency of story pop-ups. Entries are still unlocked in the Captain\'s Log.', settings_save: 'Save Data', settings_community: 'Community', settings_changelog: 'Version History (Changelog)',
    journal_title: "📖 Captain's Log", journal_desc: 'Records of your journey, unlocked as your story unfolds.', journal_empty: 'There are no entries in the log yet.', journal_act: 'Act', journal_new_act: 'NEW ACT', journal_new_entry: "A new entry has been added to the Captain's Log.", btn_read_journal: 'Read Log', btn_read_later: 'Read Later', warehouse_capacity: 'Warehouse Capacity', warehouse_capacity_of: 'of', warehouse_bonus: 'capacity', warehouse_next: 'next level', warehouse_tooltip: 'Warehouse Level {level} — Capacity: {current} resources | Next level: {next} | Current bonus: +{bonus}% | Next bonus: +{nextBonus}%', btn_continue: 'Continue',
    theme_dark: '🌑 Dark', theme_light: '☀️ Light', theme_sepia: '📜 Sepia', theme_white: '⬜ White',
    rank_modal_title: '⭐ Ranks', rank_modal_next: 'Next rank at',
    modal_class_title: 'Choose your flag',
    modal_class_desc: 'This choice defines your prestige tree and your island identity for this cycle. You can switch class on your next Prestige.',
    class_pirate_desc: 'Outside the law. Loot and aggressive attack bonuses. Friendly ports turn hostile.',
    class_corsair_desc: 'Under a letter of marque. Doubloon and trade bonuses. Slightly weaker combat.',
    btn_flag_pirate: 'Sail as a Pirate', btn_flag_corsair: 'Sail as a Privateer',
    upgrades_title: '🔧 Upgrade Tree', upgrades_desc: 'Each upgrade is bought only once. Some require earlier upgrades first, and some unlock new tabs or automations.',
    node_bought: '✅ Done', node_locked: '🔒 Requires: {req}',
    log_welcome: 'Your ship sank. You are alone, but alive. Survive.',
    log_offline_progress: '⏱️ While you were away, your crew kept working for {time}.',
    log_camp_built: '🏕️ Camp set up! The Island tab is now unlocked.',
    log_raft_built: '🛶 Your first raft is ready! The Ship, Crew, Upgrades and Exploration tabs are now unlocked.',
    log_promotion: '⭐ Promotion! You are now {rank}.',
    log_ship_upgraded: '⚓ Your ship upgraded to {type}!',
    log_building_upgraded: '{name} upgraded to level {level}.',
    log_island_expanded: '🏝️ Your island expanded! A new building is available.',
    log_victory: '✅ Victory! +{gold} gold, +{fame} fame.',
    log_defeat: '⚔️ Your fleet was repelled. Strengthen your ship and try again.',
    log_item_found: '🎁 Found: {name} ({rarity})!',
    log_relic_found: '🏺 RELIC FOUND: {name}! This item is permanent.',
    log_map_complete: '🗺️ Map complete! Generating a new, more dangerous and rewarding map.',
    log_quest_complete: '✅ Quest complete: {label}',
    log_contract_complete: '📜 Contract fulfilled: {name}!',
    log_prestige_done: '🎉 Prestige! You sailed into legend and gained {gained} Doubloons. New journey as a {cls}!',
    log_node_bought: '🔧 Upgrade completed: {name}!',
    log_tab_unlocked_by_node: '🔓 New tab unlocked: {tab}',
    log_not_enough: 'Not enough resources.',
    log_need_slot: 'This ship has no {slot} slot.',
    log_slot_is_locked: 'This slot is still locked.',
    log_max_level: 'This upgrade is already at max level.',
    log_not_enough_doubloons: 'Not enough Doubloons for this upgrade.',
    hint_island_title: '🏝️ Your Island', hint_island_text: 'Here you build and upgrade buildings that automatically produce resources. Expand the island to unlock more buildings.',
    hint_ship_title: '🚢 Your Main Ship', hint_ship_text: 'This is your ship, with equipment slots. Upgrade to bigger types and equip items found in battle. Some slots only unlock as you explore further.',
    hint_crew_title: '👥 Crew', hint_crew_text: 'Assign tasks to your crew. Use "Work the Deck" for a manual push of resources. Crew upgrades now live in the Upgrades tab.',
    hint_upgrades_title: '🔧 Upgrade Tree', hint_upgrades_text: 'Buy permanent upgrades (once each). Some unlock Quests, Fleet, and even Prestige — keep an eye on the prerequisites.',
    hint_exploration_title: '🧭 Exploration', hint_exploration_text: 'Your ship automatically advances through a map of tiles. Use "Reinforce Attack" to manually speed up battles.',
    hint_fleet_title: '⛵ Support Fleet', hint_fleet_text: 'Buy support vessels in bulk — they add power and bonuses, but have no equipment of their own.',
    hint_quests_title: '📜 Quests and Contracts', hint_quests_text: 'Accept up to 3 quests at a time from a list of options, and fulfill contracts for bigger rewards.',
    hint_prestige_title: '👑 Prestige', hint_prestige_text: 'Restart your journey in exchange for permanent Doubloons, and choose to be a Pirate or a Privateer.',
    hint_achievements_title: '🏆 Achievements', hint_achievements_text: 'Permanent milestones that never reset, even through Prestige. Each one gives a small bonus forever.',
    achievements_title: '🏆 Achievements', achievements_desc: 'Permanent — never reset, even with Prestige. Each one gives a small bonus forever.',
    log_achievement_unlocked: '🏆 Achievement unlocked: {name}!',
    effect_clickPower: 'Manual Work', effect_lootBonus: 'Loot', effect_resourceProd: 'Resource Production',
    effect_itemChance: 'Item Chance', effect_doubloonGain: 'Doubloon Gain', effect_combatPower: 'Combat Power',
    effect_contractReward: 'Contract Reward', effect_explorationSpeed: 'Exploration Speed',
    factions_title: '🌍 Faction Reputation', factions_desc: 'Your reputation across the world — persists even through Prestige.',
    world_event_active: 'World Event active', world_event_ends_in: 'ends in',
    permanent_tag: 'PERMANENT', node_prereq_label: 'Requires',
    log_world_event_start: '🌍 World Event: {name}! {desc}',
    log_world_event_end: '🌍 The "{name}" event has ended.',
    log_boss_chain: '🔁 Battle Echo! Another boss appeared right after — rewards doubled again!',
    log_jackpot: '🍀 Lucky Barnacles! You found a rare old coin: +{gold} Gold!',
    event_storm_result: '🌩️ A storm delayed your crossing, but the crew recovered a bit of Fame.',
    event_abandoned_island_result: '🏝️ You looted an abandoned island!',
    event_merchant_result: '⚖️ A merchant traded some of your Wood for Gold.',
    event_merchant_pirate_result: "🏴‍☠️ Your pirates attacked the merchant ship! Much more Gold, but the Merchants won't forget.",
    event_merchant_corsair_result: '⚜️ Diplomatic dealings with the merchant — good for Fame and standing with the Crown.',
    boss_goldsteal: '👑 The Pirate Queen stole part of your Gold before fleeing!',
    event_mutiny_result: '😠 Part of the crew briefly mutinied — some went back to idle.',
    event_ghost_ship_result: '👻 A Ghost Ship! Guaranteed item, but no resources.',
    event_buried_treasure_result: '💎 Buried Treasure dug up!',
  },
};

function t(state, key, vars) {
  const lang = (state && state.settings && state.settings.lang) || 'pt';
  let str = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.pt[key] || key;
  if (vars) for (const k in vars) str = str.split('{' + k + '}').join(vars[k]);
  return str;
}
function L(state, obj, field) {
  const lang = (state && state.settings && state.settings.lang) || 'pt';
  if (lang === 'en' && obj[field + '_en']) return obj[field + '_en'];
  return obj[field];
}

// ---------- Diário de Bordo ----------
// The story is intentionally data-driven: entries can be expanded later without changing the UI.
const STORY_ENTRIES = [
  { id: 'act1', act: 1, title: 'Ato I — O Náufrago', title_en: 'Act I — The Castaway', text: 'Recebi uma proposta que poderia mudar minha vida. A Coroa precisava de um capitão experiente para uma missão secreta em mares pouco explorados. Eu fui o escolhido. O pagamento era alto demais para recusar.', text_en: 'I received an offer that could change my life. The Crown needed an experienced captain for a secret mission in uncharted waters. I was chosen. The pay was far too good to refuse.' },
  { id: 'act1_storm', act: 1, title: 'Ato I — O Náufrago', title_en: 'Act I — The Castaway', text: 'Durante a travessia, uma tempestade se aproximou. O mar se revoltou de uma maneira que eu nunca havia visto.', text_en: 'During the crossing, a storm approached. The sea turned violent in a way I had never seen before.' },
  { id: 'act1_day10', act: 1, title: 'Dia 10', title_en: 'Day 10', text: 'No décimo dia de viagem, o vento mudou de direção sem aviso. O céu escureceu rapidamente. O dia virou noite em poucos minutos. Marinheiros veteranos juravam nunca ter visto o mar se comportar daquela forma.', text_en: 'On the tenth day of the voyage, the wind changed direction without warning. The sky darkened rapidly. Day turned into night within minutes. Veteran sailors swore they had never seen the sea behave that way.' },
  { id: 'act1_unconscious', act: 1, title: 'Depois da Tempestade', title_en: 'After the Storm', text: 'Não sei quanto tempo fiquei inconsciente.', text_en: 'I do not know how long I was unconscious.' },
  { id: 'day1_castaway', act: 1, title: 'Dia 1', title_en: 'Day 1', text: 'Abro os olhos com a luz do sol queimando meu rosto. O navio desapareceu. Não vejo nenhum companheiro. Apenas destroços espalhados pela praia. Se eu quiser sobreviver, precisarei transformar esses restos em um novo começo.', text_en: 'I open my eyes with the sunlight burning my face. The ship is gone. I see none of my companions. Only wreckage is scattered across the beach. If I want to survive, I will have to turn these remains into a new beginning.' },
  { id: 'day2_tools', act: 1, title: 'Dia 2', title_en: 'Day 2', text: 'Com madeira e sucata, consegui improvisar minhas primeiras ferramentas. São rudimentares, mas cada golpe é mais eficiente do que minhas próprias mãos.', text_en: 'With wood and scrap, I managed to improvise my first tools. They are crude, but every strike is more effective than my bare hands.' },
  { id: 'day3_shelter', act: 1, title: 'Dia 3', title_en: 'Day 3', text: 'As paredes ainda deixam o vento passar, mas pela primeira vez desde o naufrágio consegui dormir sem olhar constantemente para o horizonte. Talvez eu realmente consiga sobreviver.', text_en: 'The walls still let the wind through, but for the first time since the shipwreck I managed to sleep without constantly watching the horizon. Maybe I really can survive.' },
  { id: 'act2', act: 2, title: 'Ato II — O Capitão', title_en: 'Act II — The Captain', text: 'Ao sentir novamente as ondas empurrando uma embarcação, algo desperta dentro de mim. Não nasci para morrer preso em uma ilha. Sou um capitão. E o mar ainda guarda meu destino.', text_en: 'As I feel the waves pushing a vessel once again, something awakens inside me. I was not born to die stranded on an island. I am a captain. And the sea still holds my destiny.' },
  { id: 'day12_base', act: 2, title: 'Dia 12', title_en: 'Day 12', text: 'Esta ilha deixou de ser apenas o lugar onde fui arrastado pelo mar. Ela agora será a base de um capitão. Enquanto eu exploro novos mares, alguém precisará manter este lugar funcionando.', text_en: 'This island is no longer just the place where the sea washed me ashore. It will now be a captain’s base. While I explore new waters, someone will have to keep this place running.' },
  { id: 'day17_survivor', act: 2, title: 'Dia 17', title_en: 'Day 17', text: 'Hoje encontrei outro sobrevivente à deriva. Durante dias pensei ser o único homem vivo nestas águas. Mas será que haverá outros? Os mares nunca foram conquistados por um único capitão.', text_en: 'Today I found another survivor adrift. For days I thought I was the only living man in these waters. But could there be others? The seas have never been conquered by a single captain.' },
  { id: 'day24_sloop', act: 2, title: 'Dia 24', title_en: 'Day 24', text: 'Não fui o único a naufragar. Em cada nova ilha encontro sobreviventes da mesma tempestade. Alguns dizem que ela aparece sempre no mesmo lugar... e que ninguém jamais descobriu sua origem.', text_en: 'I was not the only one to be shipwrecked. On every new island, I find survivors of the same storm. Some say it always appears in the same place... and that no one has ever discovered its origin.' },
  { id: 'act3', act: 3, title: 'Ato III — Explorador dos Mares', title_en: 'Act III — Explorer of the Seas', text: 'Já não estou sozinho. Outros sobreviventes se juntaram à minha tripulação e, com eles, posso finalmente explorar as ilhas que cercam este lugar. Talvez entre elas exista alguma resposta para o mistério da tempestade.', text_en: 'I am no longer alone. Other survivors have joined my crew, and with them I can finally explore the islands surrounding this place. Perhaps among them lies an answer to the mystery of the storm.' },
  { id: 'day31_first_map', act: 3, title: 'Dia 31', title_en: 'Day 31', text: 'As águas ao redor desta ilha escondem muito mais mistérios do que eu imaginava. Algumas rotas só aparecem em mapas antigos; outras são conhecidas apenas pelos marinheiros mais experientes.', text_en: 'The waters around this island hide far more mysteries than I imagined. Some routes appear only on ancient maps; others are known only to the most experienced sailors.' },
  { id: 'day50_rumble', act: 3, title: 'Dia 50', title_en: 'Day 50', text: 'Alguns marinheiros juram ter ouvido um rugido vindo através da névoa...', text_en: 'Some sailors swear they heard a roar coming through the fog...' },
  { id: 'day51_bubbles', act: 3, title: 'Dia 51', title_en: 'Day 51', text: 'A água ao nosso redor começa a borbulhar. O movimento do mar já não parece causado apenas pelas ondas. Será possível que exista algo abaixo de nós?', text_en: 'The water around us begins to bubble. The movement of the sea no longer seems to be caused by the waves alone. Could something be beneath us?' },
  { id: 'day52_kraken', act: 3, title: 'Dia 52', title_en: 'Day 52', text: 'O dia corria tranquilo até então. De repente, sinto o navio desacelerar. Ao olhar para o convés, vejo algo enrolado ao redor do casco.\n\n— São tentáculos! Enormes tentáculos! — grita um dos marinheiros.\n\nO que antes era apenas um mito agora se agarra ao nosso navio. O Kraken existe.', text_en: 'The day had been peaceful until then. Suddenly, I feel the ship slow down. When I look toward the deck, I see something wrapped around the hull.\n\n— Tentacles! Huge tentacles! — one of the sailors cries.\n\nWhat was once only a myth is now clinging to our ship. The Kraken is real.' },
  { id: 'act4', act: 4, title: 'Ato IV — A Lenda', title_en: 'Act IV — The Legend', text: 'Depois de enfrentar tantos perigos, finalmente compreendi: um único navio jamais será suficiente para desvendar os segredos que encontrei. Se quero descobrir a verdade sobre a tempestade, precisarei de uma frota.', text_en: 'After facing so many dangers, I finally understood: a single ship will never be enough to uncover the secrets I have found. If I want to discover the truth about the storm, I will need a fleet.' },
  { id: 'day100_fleet', act: 4, title: 'Dia 100', title_en: 'Day 100', text: 'Agora que nossa frota está pronta, partiremos em direção ao lugar que ainda causa pesadelos em muitos desses homens: a tempestade.', text_en: 'Now that our fleet is ready, we will sail toward the place that still haunts the nightmares of many of these men: the storm.' },
  { id: 'act5', act: 5, title: 'Ato V — O Legado', title_en: 'Act V — The Legacy', text: 'Ainda parece impossível acreditar. Quando finalmente encontramos a tempestade, fomos lançados de volta aos nossos piores pesadelos. Mais uma vez, estou sozinho em uma ilha desconhecida.\n\nMas desta vez é diferente.\n\nEu já estive aqui antes.\n\nNão sou mais o homem que abriu os olhos naquela praia. O mar pode ter levado minha frota, mas não levou o que aprendi.', text_en: 'It still seems impossible to believe. When we finally found the storm, we were thrown back into our worst nightmares. Once again, I am alone on an unknown island.\n\nBut this time is different.\n\nI have been here before.\n\nI am no longer the man who opened his eyes on that beach. The sea may have taken my fleet, but it did not take what I learned.' },
];

// ---------- Recursos ----------

const RESOURCE_INFO = {
  gold:      { name: 'Ouro',             name_en: 'Gold',           icon: '🪙' },
  wood:      { name: 'Madeira',          name_en: 'Wood',           icon: '🪵' },
  rum:       { name: 'Rum',              name_en: 'Rum',            icon: '🍺' },
  gunpowder: { name: 'Pólvora',          name_en: 'Gunpowder',      icon: '💥' },
  iron:      { name: 'Ferro',            name_en: 'Iron',           icon: '⚙️' },
  cloth:     { name: 'Tecido',           name_en: 'Cloth',          icon: '🧵' },
  spices:    { name: 'Especiarias',      name_en: 'Spices',         icon: '🌶️' },
  maps:      { name: 'Mapas do Tesouro', name_en: 'Treasure Maps',  icon: '🗺️' },
  fame:      { name: 'Fama',             name_en: 'Fame',           icon: '⭐' },
};

// ---------- Limite de Armazenamento (v0.1.3.3 Final) ----------
// Protege contra números explodindo sem controle: Ouro/Madeira/Rum/Ferro/
// Pólvora/Tecido/Especiarias têm um teto que só cresce melhorando o Armazém.
// Fama, Mapas e Dobrões NÃO têm limite (são progressão, não estoque).
const STORABLE_RESOURCES = ['gold', 'wood', 'rum', 'gunpowder', 'iron', 'cloth', 'spices'];
const BASE_STORAGE_LIMIT = 800;

const RARITY = {
  common:    { id: 'common',    name: 'Comum',           name_en: 'Common',          color: '#9fa8ac', mult: 1.0 },
  uncommon:  { id: 'uncommon',  name: 'Incomum',         name_en: 'Uncommon',        color: '#5fbf6b', mult: 1.5 },
  rare:      { id: 'rare',      name: 'Raro',            name_en: 'Rare',            color: '#4f9dff', mult: 2.2 },
  elite:     { id: 'elite',     name: 'Elite',           name_en: 'Elite',           color: '#b465e8', mult: 3.2 },
  legendary: { id: 'legendary', name: 'Lendário',        name_en: 'Legendary',       color: '#e8ab3b', mult: 4.6 },
  ultra:     { id: 'ultra',     name: 'Ultra Lendário',  name_en: 'Ultra Legendary', color: '#ff5d5d', mult: 6.5 },
};
const RARITY_ORDER = ['common', 'uncommon', 'rare', 'elite', 'legendary', 'ultra'];

const SLOT_INFO = {
  hull:    { name: 'Casco',    name_en: 'Hull',    icon: '🛡️' },
  sail:    { name: 'Vela',     name_en: 'Sail',     icon: '⛵' },
  cannon:  { name: 'Canhão',   name_en: 'Cannon',   icon: '💣' },
  flag:    { name: 'Bandeira', name_en: 'Flag',     icon: '🏴' },
  bow:     { name: 'Proa',     name_en: 'Bow',      icon: '🗿' },
  charm:   { name: 'Amuleto',  name_en: 'Charm',    icon: '🧿' },
  special: { name: 'Especial', name_en: 'Special',  icon: '🔮' },
};

const SLOT_UNLOCK_DISTANCE = { hull: 0, sail: 5, cannon: 10, flag: 18, bow: 28, charm: 40, special: 60 };

// ---------- Náufrago (intro) ----------

const CASTAWAY_CAMP_COST = { wood: 15, scrap: 5 };
const CASTAWAY_RAFT_COST = { wood: 30, scrap: 12 };

const CASTAWAY_UPGRADES = [
  { id: 'sharp_stick', name: 'Graveto Afiado', name_en: 'Sharp Stick', cost: { wood: 10 }, effect: { woodClick: 1 } },
  { id: 'salvaged_knife', name: 'Faca Recuperada', name_en: 'Salvaged Knife', cost: { scrap: 8 }, effect: { scrapClick: 1 } },
  { id: 'makeshift_axe', name: 'Machado Improvisado', name_en: 'Makeshift Axe', cost: { wood: 25, scrap: 5 }, effect: { woodClick: 2 } },
  { id: 'sturdy_pry_bar', name: 'Pé de Cabra Reforçado', name_en: 'Sturdy Pry Bar', cost: { wood: 15, scrap: 15 }, effect: { scrapClick: 2 } },
];

// ---------- Navio Principal (tiers) ----------
// Custos aumentados na v0.0.4 (principalmente tiers 1-4) para segurar o ritmo
// até o primeiro Prestígio, que antes chegava rápido demais.

const SHIP_TYPES = [
  { id: 0, name: 'Bote Furado',     name_en: 'Leaky Rowboat',  capacity: 2,   power: 1,   buildCost: { gold: 10,     wood: 5 },                                        slots: ['hull'] },
  { id: 1, name: 'Escaler',         name_en: 'Jolly Boat',     capacity: 4,   power: 2,   buildCost: { gold: 85,     wood: 55 },                                       slots: ['hull', 'sail'] },
  { id: 2, name: 'Chalupa',         name_en: 'Sloop Boat',     capacity: 6,   power: 4,   buildCost: { gold: 260,    wood: 175,  iron: 22 },                           slots: ['hull', 'sail', 'cannon'] },
  { id: 3, name: 'Escuna',          name_en: 'Sloop',          capacity: 10,  power: 8,   buildCost: { gold: 760,    wood: 470,  iron: 90 },                           slots: ['hull', 'sail', 'cannon'] },
  { id: 4, name: 'Brigue',          name_en: 'Brig',           capacity: 16,  power: 15,  buildCost: { gold: 1900,   wood: 1200, iron: 260, gunpowder: 65 },           slots: ['hull', 'sail', 'cannon', 'flag'] },
  { id: 5, name: 'Fragata',         name_en: 'Frigate',        capacity: 26,  power: 28,  buildCost: { gold: 3600,   wood: 2100, iron: 480, gunpowder: 135 },          slots: ['hull', 'sail', 'cannon', 'flag', 'bow'] },
  { id: 6, name: 'Galeão',          name_en: 'Galleon',        capacity: 42,  power: 52,  buildCost: { gold: 8500,   wood: 5000, iron: 1150, gunpowder: 340 },         slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm'] },
  { id: 7, name: 'Navio de Linha',  name_en: 'Ship of the Line', capacity: 68, power: 95, buildCost: { gold: 20000,  wood: 11500, iron: 2800, gunpowder: 900 },       slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm'] },
  { id: 8, name: 'Nau de Guerra',   name_en: 'Man-of-War',     capacity: 110, power: 170, buildCost: { gold: 50000,  wood: 28000, iron: 7000, gunpowder: 2400 },      slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm', 'special'] },
  { id: 9, name: 'Armada Lendária', name_en: 'Legendary Armada', capacity: 180, power: 310, buildCost: { gold: 130000, wood: 72000, iron: 18000, gunpowder: 6600 },   slots: ['hull', 'sail', 'cannon', 'flag', 'bow', 'charm', 'special'] },
];

// ---------- Frota de Apoio (compra em quantidade, sem slots) ----------

const SUPPORT_FLEET_TYPES = [
  { id: 'raiders', name: 'Barca de Ataque', name_en: 'Raiding Barque', icon: '⚔️', role: 'ataque', power: 4, buildCost: { gold: 60, wood: 30 }, costMult: 1.14 },
  { id: 'traders', name: 'Barca de Carga', name_en: 'Cargo Barque', icon: '🏗️', role: 'producao', prodBonusPerUnit: 0.02, buildCost: { gold: 90, wood: 45 }, costMult: 1.16 },
  { id: 'scouts', name: 'Escuna de Exploração', name_en: 'Scouting Sloop', icon: '🧭', role: 'exploracao', itemBonusPerUnit: 0.01, buildCost: { gold: 80, wood: 35, iron: 5 }, costMult: 1.15 },
];

// ---------- Trabalho manual / clique ativo ----------

const MANUAL_WORK_BASE = { gold: 3, wood: 2 };
const REINFORCE_TIMER_REDUCTION = 0.8;

// ---------- Patentes ----------

const RANKS = [
  { name: 'Grumete',          name_en: 'Cabin Boy',        fame: 0,      bonus: 0.00 },
  { name: 'Marujo',           name_en: 'Sailor',            fame: 50,     bonus: 0.03 },
  { name: 'Marinheiro',       name_en: 'Seaman',            fame: 150,    bonus: 0.06 },
  { name: 'Artilheiro',       name_en: 'Gunner',            fame: 400,    bonus: 0.10 },
  { name: 'Timoneiro',        name_en: 'Helmsman',          fame: 900,    bonus: 0.15 },
  { name: 'Contramestre',     name_en: 'Boatswain',         fame: 2000,   bonus: 0.21 },
  { name: 'Imediato',         name_en: 'First Mate',        fame: 4200,   bonus: 0.28 },
  { name: 'Capitão',          name_en: 'Captain',           fame: 8500,   bonus: 0.36 },
  { name: 'Comodoro',         name_en: 'Commodore',         fame: 17000,  bonus: 0.45 },
  { name: 'Vice-Almirante',   name_en: 'Vice Admiral',      fame: 32000,  bonus: 0.55 },
  { name: 'Lorde Pirata',     name_en: 'Pirate Lord',       nameCorsair: 'Almirante Corsário', nameCorsair_en: 'Privateer Admiral', fame: 60000,  bonus: 0.68 },
  { name: 'Rei dos Piratas',  name_en: 'Pirate King',       nameCorsair: 'Almirante-Mor da Coroa', nameCorsair_en: 'Grand Admiral of the Crown', fame: 110000, bonus: 0.85 },
];

// ---------- Construções da Ilha ----------

const BUILDINGS = [
  { id: 'quarters',        name: 'Alojamentos',           name_en: 'Quarters',            nameCorsair: 'Quartéis', nameCorsair_en: 'Barracks',              icon: '🛏️', desc: 'Aumenta a capacidade máxima de tripulação.', desc_en: 'Increases max crew capacity.',                    baseCost: { wood: 20,  gold: 10 }, costMult: 1.16, effect: lvl => lvl * 8 },
  { id: 'tavern',          name: 'Taverna Clandestina',   name_en: 'Hidden Tavern',        nameCorsair: 'Taverna do Porto', nameCorsair_en: 'Harbor Tavern', icon: '🍻', desc: 'Melhora a produção de Rum e o crescimento da tripulação.', desc_en: 'Improves Rum production and crew growth.', baseCost: { gold: 30,  wood: 15 }, costMult: 1.17, effect: lvl => lvl },
  { id: 'mint',            name: 'Esconderijo do Ouro',   name_en: 'Gold Stash',           nameCorsair: 'Casa da Moeda', nameCorsair_en: 'Royal Mint',        icon: '🏦', desc: 'Multiplica a produção de Ouro dos saqueadores.', desc_en: 'Multiplies Gold production from looters.',            baseCost: { gold: 50,  wood: 20 }, costMult: 1.18, effect: lvl => 1 + lvl * 0.12 },
  { id: 'warehouse',       name: 'Armazém',               name_en: 'Warehouse',           nameCorsair: 'Depósito Real', nameCorsair_en: 'Royal Depot',        icon: '📦', desc: 'Aumenta o limite de armazenamento de Ouro, Madeira, Rum, Ferro, Pólvora, Tecido e Especiarias (excedente é perdido).', desc_en: 'Increases the storage limit for Gold, Wood, Rum, Iron, Gunpowder, Cloth and Spices (overflow is lost).', baseCost: { gold: 200, wood: 120 }, costMult: 1.20, effect: lvl => Math.pow(1.15, lvl) },
  { id: 'forge',           name: 'Forja Pirata',          name_en: 'Pirate Forge',         nameCorsair: 'Forja Real', nameCorsair_en: 'Royal Forge',        icon: '🔨', desc: 'Produz Ferro e Pólvora automaticamente.', desc_en: 'Automatically produces Iron and Gunpowder.',             baseCost: { gold: 80,  wood: 40 }, costMult: 1.19, effect: lvl => lvl },
  { id: 'plantation',      name: 'Roça Escondida',        name_en: 'Hidden Farm',          nameCorsair: 'Plantação da Coroa', nameCorsair_en: 'Crown Plantation', icon: '🌴', desc: 'Produz Especiarias e Tecido automaticamente.', desc_en: 'Automatically produces Spices and Cloth.',       baseCost: { gold: 100, wood: 60 }, costMult: 1.19, effect: lvl => lvl },
  { id: 'contract_office', name: 'Mural de Recompensas',  name_en: 'Bounty Board',         nameCorsair: 'Sede de Contratos', nameCorsair_en: 'Contract Office',  icon: '📜', desc: 'Melhora as recompensas dos contratos.', desc_en: 'Improves contract rewards.',                     baseCost: { gold: 150, cloth: 10 }, costMult: 1.2,  effect: lvl => lvl },
  { id: 'watchtower',      name: 'Posto de Vigia',        name_en: 'Watch Post',           nameCorsair: 'Torre de Sinalização', nameCorsair_en: 'Signal Tower', icon: '🗼', desc: 'Acelera a exploração e revela mais casco do mapa à frente.', desc_en: 'Speeds up exploration and reveals more of the map ahead.', baseCost: { gold: 200, wood: 100, iron: 20 }, costMult: 1.21, effect: lvl => 1 + lvl * 0.08 },
  { id: 'relic_chamber',   name: 'Câmara do Butim',       name_en: 'Chamber of Loot',      nameCorsair: 'Câmara das Relíquias', nameCorsair_en: 'Chamber of Relics', icon: '🏺', desc: 'Bônus global extra para cada Relíquia guardada aqui.', desc_en: 'Extra global bonus per Relic stored here.',   baseCost: { gold: 500, iron: 60, spices: 20 }, costMult: 1.25, effect: lvl => lvl },
];

// ---------- Mapa de Exploração ----------
// rewardScale reduzido de 1.18 para 1.15 na v0.0.4 pra segurar um pouco a
// explosão de recursos/Dobrões em distâncias médias/altas.

const MAP_BASE_LENGTH = 10;
const MAP_LENGTH_GROWTH = 2;

function mapLength(mapNumber) {
  return Math.min(30, MAP_BASE_LENGTH + (mapNumber - 1) * MAP_LENGTH_GROWTH);
}

function generateMap(mapNumber, worldEventActive) {
  const len = mapLength(mapNumber);
  const cells = [];
  for (let i = 0; i < len - 1; i++) {
    const roll = Math.random();
    let type = 'empty';
    if (roll < 0.38) type = 'enemy';
    else if (roll < 0.60) type = 'loot';
    else if (roll < 0.85) type = 'empty';
    else type = MAP_EVENT_TYPES[Math.floor(Math.random() * MAP_EVENT_TYPES.length)];
    cells.push({ type });
  }
  cells.push({ type: 'boss', bossId: pickBoss(worldEventActive).id });
  return { number: mapNumber, cells, length: len };
}

function getCellData(distanceIndex, type, bossId) {
  const isBoss = type === 'boss';
  const boss = isBoss ? BOSSES.find(b => b.id === bossId) : null;
  let enemyPower = Math.round(8 * Math.pow(1.24, distanceIndex));
  const rewardScale = Math.pow(1.15, distanceIndex);
  let goldMult = 1, relicMult = 1;
  if (boss) {
    if (boss.powerMult) enemyPower = Math.round(enemyPower * boss.powerMult);
    if (boss.goldMult) goldMult = boss.goldMult;
    if (boss.relicMult) relicMult = boss.relicMult;
  }
  return {
    type, isBoss, enemyPower, boss,
    rewards: {
      gold: Math.round((isBoss ? 34 : 15) * rewardScale * goldMult),
      wood: Math.round((isBoss ? 18 : 8) * rewardScale),
      fame: Math.round((isBoss ? 13 : 3) * rewardScale),
      mapsChance: isBoss ? 0.15 : 0.03,
      itemChance: isBoss ? 0.55 : (type === 'loot' ? 0.35 : 0.18),
      relicChance: (isBoss ? 0.025 : 0) * relicMult,
    },
  };
}

// ---------- Relíquias ----------

const RELICS = [
  { id: 'sail_blackbeard', name: 'Vela Lendária de Barba Negra', name_en: "Blackbeard's Legendary Sail", icon: '⛵', desc: '+15% velocidade de exploração.', desc_en: '+15% exploration speed.', effect: { explorationSpeed: 0.15 } },
  { id: 'kraken_cannon',   name: 'Canhão do Kraken',                name_en: 'Kraken Cannon',                 icon: '💥', desc: '+25% poder de combate.', desc_en: '+25% combat power.', effect: { combatPower: 0.25 } },
  { id: 'cursed_bow',      name: 'Proa Amaldiçoada',                name_en: 'Cursed Bow',                    icon: '🗿', desc: '+20% de saque em combate.', desc_en: '+20% combat loot.', effect: { lootBonus: 0.20 } },
  { id: 'compass_end',     name: 'Bússola do Fim do Mundo',         name_en: "Compass of World's End",       icon: '🧭', desc: '+10% chance de itens em batalhas.', desc_en: '+10% item chance in battles.', effect: { itemChance: 0.10 } },
  { id: 'sunken_crown',    name: 'Coroa Afundada',                  name_en: 'Sunken Crown',                  icon: '👑', desc: '+15% de Dobrões ganhos no Prestígio.', desc_en: '+15% Doubloons gained on Prestige.', effect: { doubloonGain: 0.15 } },
  { id: 'ghost_wheel',     name: 'Leme Fantasma',                   name_en: 'Ghost Wheel',                   icon: '☠️', desc: '+20% de crescimento de tripulação.', desc_en: '+20% crew growth.', effect: { crewGrowth: 0.20 } },
  { id: 'siren_pearl',     name: 'Pérola da Sereia',                name_en: "Siren's Pearl",                icon: '🦪', desc: '+18% de produção de recursos.', desc_en: '+18% resource production.', effect: { resourceProd: 0.18 } },
  { id: 'admiral_seal',    name: 'Selo do Almirante Perdido',       name_en: "Lost Admiral's Seal",          icon: '🩸', desc: '+30% de Fama ganha em combate.', desc_en: '+30% Fame gained in combat.', effect: { fameGain: 0.30 } },
];

// ---------- Árvores de Prestígio (permanentes, compradas com Dobrões) ----------

const PRESTIGE_TREES = {
  general: [
    { id: 'g_prod',          name: 'Rotas Comerciais',     name_en: 'Trade Routes',      desc: '+4% de produção global de recursos por nível.', desc_en: '+4% global resource production per level.', baseCost: 5,  costMult: 1.35, max: 20, effect: 'resourceProd',  perLevel: 0.04 },
    { id: 'g_capacity',      name: 'Cascos Reforçados',    name_en: 'Reinforced Hulls',  desc: '+4% de capacidade de tripulação por nível.', desc_en: '+4% crew capacity per level.',                 baseCost: 5,  costMult: 1.35, max: 20, effect: 'crewCapacity',  perLevel: 0.04 },
    { id: 'g_start_gold',    name: 'Baú Enterrado',        name_en: 'Buried Chest',      desc: 'Comece cada ciclo com mais Ouro.', desc_en: 'Start each cycle with more Gold.',                       baseCost: 4,  costMult: 1.30, max: 15, effect: 'startGold',     perLevel: 50 },
    { id: 'g_growth',        name: 'Recrutamento Rápido',  name_en: 'Fast Recruiting',   desc: '+5% de velocidade de crescimento da tripulação por nível.', desc_en: '+5% crew growth speed per level.', baseCost: 6,  costMult: 1.35, max: 15, effect: 'crewGrowth',    perLevel: 0.05 },
    { id: 'g_contract_slot', name: 'Rede de Contatos',     name_en: 'Network of Contacts', desc: '+1 contrato disponível ao mesmo tempo (máx. 2 níveis).', desc_en: '+1 available contract at a time (max 2 levels).', baseCost: 20, costMult: 2.20, max: 2,  effect: 'contractSlot',  perLevel: 1 },
    { id: 'g_calloused',     name: 'Mãos Calejadas',       name_en: 'Calloused Hands',   desc: '+8% de rendimento do trabalho manual (clique) por nível.', desc_en: '+8% manual work (click) yield per level.', baseCost: 6,  costMult: 1.32, max: 20, effect: 'clickPower',    perLevel: 0.08 },
  ],
  pirate: [
    { id: 'p_loot',         name: 'Fome de Saque',       name_en: 'Hunger for Loot',   desc: '+6% de saque em combate por nível.', desc_en: '+6% combat loot per level.',                       baseCost: 5,  costMult: 1.35, max: 20, effect: 'lootBonus',      perLevel: 0.06 },
    { id: 'p_attack',       name: 'Fúria Sanguinária',   name_en: 'Bloody Fury',       desc: '+6% de poder de ataque por nível.', desc_en: '+6% attack power per level.',        baseCost: 5,  costMult: 1.35, max: 20, effect: 'attackBonus',    perLevel: 0.06 },
    { id: 'p_intimidation', name: 'Bandeira Negra',      name_en: 'Black Flag',       desc: 'Reduz a penalidade de reputação em portos.', desc_en: 'Reduces port reputation penalty.',         baseCost: 8,  costMult: 1.40, max: 10, effect: 'portPenaltyRed', perLevel: 0.10 },
    { id: 'p_mutiny',       name: 'Motim Lucrativo',     name_en: 'Profitable Mutiny', desc: 'Cada tripulante ocioso gera Ouro passivo por nível.', desc_en: 'Each idle crew member generates passive Gold per level.', baseCost: 10, costMult: 1.40, max: 15, effect: 'idleGold', perLevel: 0.3 },
  ],
  corsair: [
    { id: 'c_doubloon',  name: 'Carta Real',          name_en: 'Royal Charter',    desc: '+6% de Dobrões ganhos no Prestígio por nível.', desc_en: '+6% Doubloons gained on Prestige per level.', baseCost: 5, costMult: 1.35, max: 20, effect: 'doubloonGain',          perLevel: 0.06 },
    { id: 'c_trade',     name: 'Rotas Oficiais',      name_en: 'Official Routes',  desc: '+5% de produção de Especiarias/Tecido por nível.', desc_en: '+5% Spices/Cloth production per level.',   baseCost: 5, costMult: 1.35, max: 20, effect: 'tradeBonus',            perLevel: 0.05 },
    { id: 'c_diplomacy', name: 'Diplomacia da Coroa', name_en: 'Crown Diplomacy',  desc: '-4% de custo de construções da ilha por nível.', desc_en: '-4% island building cost per level.',         baseCost: 8, costMult: 1.40, max: 15, effect: 'buildingCostReduction', perLevel: 0.04 },
    { id: 'c_escort',    name: 'Escolta Real',        name_en: 'Royal Escort',     desc: '+8% de recompensa de contratos por nível.', desc_en: '+8% contract reward per level.',              baseCost: 8, costMult: 1.40, max: 15, effect: 'contractReward',        perLevel: 0.08 },
  ],
};

// ---------- Árvore de Melhorias de compra única (reseta a cada Prestígio) ----------
// Cada nó: id, name/name_en, desc/desc_en, icon, cost (recursos), prereq (ids),
// effect: {type, ...}. Tipos de effect:
//  - prodMult   { resource, value }  -> % produção daquele recurso
//  - capacity   { value }            -> % capacidade de tripulação
//  - growth     { value }            -> % velocidade de crescimento de tripulação
//  - clickPower { value }            -> % rendimento do clique manual
//  - itemChance { value }            -> % chance de item em combate
//  - lootBonus  { value }            -> % saque em combate
//  - unlockTabs { tabs: [...] }      -> desbloqueia as abas listadas
//  - unlockPrestige {}               -> combinado com tier do navio, libera Prestígio
//  - automation { key }              -> liga uma automação ('autoAssignCrew' | 'autoAssignAdvanced')

const UPGRADE_TREE = [
  { id: 'trade_basics', name: 'Comércio Básico', name_en: 'Basic Trade', icon: '🪙', desc: '+10% de produção de Ouro dos Saqueadores.', desc_en: '+10% Gold production from Looters.', cost: { gold: 80, wood: 40 }, prereq: [], effect: { type: 'prodMult', resource: 'gold', value: 0.10 } },
  { id: 'carpentry_basics', name: 'Carpintaria Básica', name_en: 'Basic Carpentry', icon: '🪵', desc: '+10% de produção de Madeira dos Carpinteiros.', desc_en: '+10% Wood production from Carpenters.', cost: { gold: 80, wood: 40 }, prereq: [], effect: { type: 'prodMult', resource: 'wood', value: 0.10 } },
  { id: 'distillery_basics', name: 'Destilaria Básica', name_en: 'Basic Distillery', icon: '🍺', desc: '+10% de produção de Rum dos Destiladores.', desc_en: '+10% Rum production from Distillers.', cost: { gold: 80, wood: 40 }, prereq: [], effect: { type: 'prodMult', resource: 'rum', value: 0.10 } },
  { id: 'autopilot_crew', name: 'Contramestre Automático', name_en: 'Auto-Boatswain', icon: '🤖', desc: 'Novos tripulantes são atribuídos automaticamente para onde são mais necessários, em vez de ficarem ociosos.', desc_en: 'New crew members are automatically assigned where they are most needed, instead of sitting idle.', cost: { gold: 200, wood: 100 }, prereq: [], effect: { type: 'automation', key: 'autoAssignCrew' } },
  { id: 'port_contacts', name: 'Contatos no Porto', name_en: 'Port Contacts', icon: '📜', desc: 'Desbloqueia as abas Missões e Inventário.', desc_en: 'Unlocks the Quests and Inventory tabs.', cost: { gold: 250, wood: 120 }, prereq: [], effect: { type: 'unlockTabs', tabs: ['quests', 'inventory'] } },

  { id: 'trade_advanced', name: 'Comércio Avançado', name_en: 'Advanced Trade', icon: '🪙', desc: '+15% adicional de produção de Ouro.', desc_en: '+15% additional Gold production.', cost: { gold: 600, wood: 300 }, prereq: ['trade_basics'], effect: { type: 'prodMult', resource: 'gold', value: 0.15 } },
  { id: 'carpentry_advanced', name: 'Carpintaria Avançada', name_en: 'Advanced Carpentry', icon: '🪵', desc: '+15% adicional de produção de Madeira.', desc_en: '+15% additional Wood production.', cost: { gold: 600, wood: 300 }, prereq: ['carpentry_basics'], effect: { type: 'prodMult', resource: 'wood', value: 0.15 } },
  { id: 'distillery_advanced', name: 'Destilaria Avançada', name_en: 'Advanced Distillery', icon: '🍺', desc: '+15% adicional de produção de Rum.', desc_en: '+15% additional Rum production.', cost: { gold: 600, wood: 300, rum: 40 }, prereq: ['distillery_basics'], effect: { type: 'prodMult', resource: 'rum', value: 0.15 } },
  { id: 'rations', name: 'Rações Extras', name_en: 'Extra Rations', icon: '🍖', desc: '+10% de capacidade máxima de tripulação.', desc_en: '+10% max crew capacity.', cost: { gold: 500, wood: 250 }, prereq: ['port_contacts'], effect: { type: 'capacity', value: 0.10 } },
  { id: 'discipline', name: 'Disciplina de Bordo', name_en: 'Shipboard Discipline', icon: '📯', desc: '+12% de velocidade de crescimento da tripulação.', desc_en: '+12% crew growth speed.', cost: { gold: 500, rum: 60 }, prereq: ['port_contacts'], effect: { type: 'growth', value: 0.12 } },
  { id: 'deck_stamina', name: 'Fôlego de Convés', name_en: 'Deck Stamina', icon: '💪', desc: '+20% de rendimento do trabalho manual (clique).', desc_en: '+20% manual work (click) yield.', cost: { gold: 400, wood: 200 }, prereq: ['autopilot_crew'], effect: { type: 'clickPower', value: 0.20 } },
  { id: 'shipyard_ally', name: 'Estaleiro Aliado', name_en: 'Allied Shipyard', icon: '⛵', desc: 'Desbloqueia a aba Frota de Apoio.', desc_en: 'Unlocks the Support Fleet tab.', cost: { gold: 1500, wood: 900, iron: 100 }, prereq: ['port_contacts', 'trade_advanced'], effect: { type: 'unlockTabs', tabs: ['fleet'] } },

  { id: 'smart_navigator', name: 'Navegador Habilidoso', name_en: 'Smart Navigator', icon: '🧭', desc: '+25% adicional de rendimento do trabalho manual.', desc_en: '+25% additional manual work yield.', cost: { gold: 1200, wood: 600 }, prereq: ['deck_stamina'], effect: { type: 'clickPower', value: 0.25 } },
  { id: 'quartermaster_ai', name: 'Contramestre-Chefe', name_en: 'Quartermaster AI', icon: '🤖', desc: 'Automação avançada: tripulação já ocupada também é realocada aos poucos conforme a necessidade muda.', desc_en: 'Advanced automation: already-working crew is also gradually rebalanced as needs change.', cost: { gold: 1800, wood: 900 }, prereq: ['autopilot_crew', 'rations'], effect: { type: 'automation', key: 'autoAssignAdvanced' } },
  { id: 'lookout_training', name: 'Treinamento de Vigia', name_en: 'Lookout Training', icon: '🔭', desc: '+5% de chance de encontrar itens em combate.', desc_en: '+5% chance to find items in combat.', cost: { gold: 800, wood: 400, iron: 50 }, prereq: ['rations'], effect: { type: 'itemChance', value: 0.05 } },
  { id: 'loot_appraisal', name: 'Avaliação de Butim', name_en: 'Loot Appraisal', icon: '💰', desc: '+8% de saque (recursos) em combate.', desc_en: '+8% combat loot (resources).', cost: { gold: 800, rum: 100 }, prereq: ['discipline'], effect: { type: 'lootBonus', value: 0.08 } },

  { id: 'imperial_ambitions', name: 'Ambições Imperiais', name_en: 'Imperial Ambitions', icon: '👑', desc: 'Desbloqueia o Prestígio (também exige possuir uma Escuna).', desc_en: 'Unlocks Prestige (also requires owning a Sloop).', cost: { gold: 5000, wood: 3000, iron: 500, gunpowder: 100 }, prereq: ['shipyard_ally', 'smart_navigator', 'lookout_training', 'loot_appraisal'], effect: { type: 'unlockPrestige' } },

  { id: 'route_log', name: 'Registro de Rotas', name_en: 'Route Log', icon: '🗺️', desc: 'Cada mapa concluído aumenta PERMANENTEMENTE a produção de Ouro — para sempre, mesmo em futuros Prestígios. +0,1% nos 100 primeiros mapas, +0,05% nos próximos 400, +0,02% nos próximos 1500, +0,005% dali em diante (retornos bem decrescentes).', desc_en: 'Each completed map PERMANENTLY increases Gold production — forever, even through future Prestiges. +0.1% for the first 100 maps, +0.05% for the next 400, +0.02% for the next 1500, +0.005% beyond that (strongly diminishing returns).', cost: { gold: 1000, wood: 500 }, prereq: ['trade_advanced'], effect: { type: 'permaMapBonus', resource: 'gold', value: 0.001 }, permanent: true },
  { id: 'lucky_barnacles', name: 'Cracas da Sorte', name_en: 'Lucky Barnacles', icon: '🍀', desc: 'A cada "Trabalhar no Convés", 0,5% de chance de achar uma moeda antiga rara — um bônus de Ouro bem maior que o normal.', desc_en: 'Each "Work the Deck" click has a 0.5% chance to find a rare old coin — a much bigger Gold bonus than usual.', cost: { gold: 300, wood: 150 }, prereq: ['deck_stamina'], effect: { type: 'clickJackpot', chance: 0.005, mult: 40 } },
  { id: 'boss_echo', name: 'Eco de Batalha', name_en: 'Battle Echo', icon: '🔁', desc: 'Chefes derrotados têm 4% de chance de que outro chefe apareça imediatamente na sequência, com recompensas dobradas.', desc_en: 'Defeated bosses have a 4% chance for another boss to immediately appear right after, with doubled rewards.', cost: { gold: 2000, wood: 1000, iron: 200 }, prereq: ['lookout_training'], effect: { type: 'bossChainChance', value: 0.04 } },
];

// ---------- Facções ----------
// Reputação persiste através do Prestígio (é a sua "lenda" pelo mundo, não
// algo que reinicia a cada ciclo). Vai de -100 (hostil) a +100 (aliado).

const FACTIONS = [
  { id: 'navy',       name: 'Marinha',        name_en: 'Navy',       icon: '⚓' },
  { id: 'merchants',  name: 'Mercadores',     name_en: 'Merchants',  icon: '💰' },
  { id: 'pirates_f',  name: 'Piratas',        name_en: 'Pirates',    icon: '🏴‍☠️' },
  { id: 'corsairs_f', name: 'Corsários',      name_en: 'Corsairs',   icon: '⚜️' },
  { id: 'smugglers',  name: 'Contrabandistas', name_en: 'Smugglers', icon: '🕵️' },
];
function factionStanding(rep) {
  if (rep >= 60) return { label: 'Aliado', label_en: 'Allied' };
  if (rep >= 20) return { label: 'Amigável', label_en: 'Friendly' };
  if (rep > -20) return { label: 'Neutro', label_en: 'Neutral' };
  if (rep > -60) return { label: 'Desconfiado', label_en: 'Distrustful' };
  return { label: 'Hostil', label_en: 'Hostile' };
}

// ---------- Eventos do Mapa (tiles especiais) ----------
// Além de vazio/inimigo/saque/chefe, o mapa agora sorteia estes eventos —
// cada um com um efeito próprio, pra deixar o próximo casco sempre uma surpresa.

const MAP_EVENT_TYPES = ['storm', 'abandoned_island', 'merchant', 'mutiny', 'ghost_ship', 'buried_treasure'];
const EVENT_INFO = {
  storm:             { name: 'Tempestade',           name_en: 'Storm',            icon: '🌩️' },
  abandoned_island:  { name: 'Ilha Abandonada',      name_en: 'Abandoned Island', icon: '🏝️' },
  merchant:          { name: 'Mercador',             name_en: 'Merchant',         icon: '⚖️' },
  mutiny:            { name: 'Tripulação Amotinada', name_en: 'Mutinous Crew',    icon: '😠' },
  ghost_ship:        { name: 'Navio Fantasma',       name_en: 'Ghost Ship',       icon: '👻' },
  buried_treasure:   { name: 'Tesouro Enterrado',    name_en: 'Buried Treasure',  icon: '💎' },
};

// ---------- Chefes Únicos ----------
// O casco final de cada mapa sorteia um destes chefes nomeados, cada um com
// uma mecânica própria simples, em vez de só "um inimigo mais forte".

const BOSSES = [
  { id: 'kraken',        name: 'Kraken',                              name_en: 'Kraken',                     icon: '🐙', desc: '+50% de poder e reduz sua velocidade de exploração em 30% enquanto estiver vivo. Recompensas dobradas se você vencer.', desc_en: '+50% power and reduces your exploration speed by 30% while alive. Rewards doubled if you win.', powerMult: 1.5, rewardMult: 2, speedReduction: 0.3 },
  { id: 'flying_dutchman', name: 'Holandês Voador',                   name_en: 'Flying Dutchman',             icon: '⛴️', desc: 'Só aparece durante Eventos Mundiais. Poder desconhecido até o combate — e a derrota não custa nada extra.', desc_en: 'Only appears during World Events. Unknown power until battle — and defeat costs nothing extra.', hidePower: true, eventOnly: true },
  { id: 'pirate_queen',  name: 'Rainha Pirata',                       name_en: 'Pirate Queen',                icon: '👑', desc: 'Mais branda com Piratas (cortesia profissional); mais dura com Corsários. Rouba parte do seu Ouro a cada derrota.', desc_en: 'Easier on Pirates (professional courtesy); harder on Privateers. Steals part of your Gold on every defeat.', classPowerMod: { pirate: -0.2, corsair: 0.2 }, goldStealOnLoss: 0.08 },
  { id: 'ghost_captain', name: 'Capitão Fantasma',                    name_en: 'Ghost Captain',               icon: '💀', desc: 'Ignora o Casco do seu navio (defesa não conta nessa luta). Chance de Relíquia dobrada.', desc_en: "Ignores your ship's Hull (defense doesn't count in this fight). Doubled Relic chance.", relicMult: 2, ignoreDefense: true },
  { id: 'east_india',    name: 'Navio da Companhia das Índias',       name_en: 'East India Company Ship',     icon: '🚩', desc: 'Recompensa em Ouro bem maior, mas irrita os Mercadores.', desc_en: 'Much bigger Gold reward, but angers the Merchants.', goldMult: 1.6, factionEffect: { merchants: -10 } },
];
// O Holandês Voador só pode aparecer se houver um Evento Mundial ativo no
// momento em que o mapa é gerado (v0.1.0) — o resto sorteia normalmente.
function pickBoss(worldEventActive) {
  const pool = worldEventActive ? BOSSES : BOSSES.filter(b => !b.eventOnly);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Eventos Mundiais ----------
// Globais, temporários, disparam aleatoriamente enquanto o jogo está aberto.

const WORLD_EVENTS = [
  { id: 'storm_global',    name: 'Tempestade Global',   name_en: 'Global Storm',   icon: '🌩️', duration: 180, desc: 'Toda produção de recursos reduzida pela metade.', desc_en: 'All resource production halved.', effect: { prodMult: 0.5 } },
  { id: 'pirate_festival', name: 'Festival dos Piratas', name_en: 'Pirate Festival', icon: '🎉', duration: 180, desc: 'Chance de itens Lendários/Ultra Lendários dobrada.', desc_en: 'Legendary/Ultra Legendary item chance doubled.', effect: { legendaryMult: 2 } },
  { id: 'calm_seas',       name: 'Mares Calmos',        name_en: 'Calm Seas',      icon: '🌊', duration: 180, desc: '+50% de velocidade de exploração.', desc_en: '+50% exploration speed.', effect: { explorationMult: 1.5 } },
  { id: 'trade_boom',      name: 'Boom Comercial',      name_en: 'Trade Boom',     icon: '📈', duration: 180, desc: '+30% de produção de recursos.', desc_en: '+30% resource production.', effect: { prodMult: 1.3 } },
];
const WORLD_EVENT_CHANCE_PER_SEC = 0.0006; // média de ~1 evento a cada ~28 minutos jogando

// ---------- Conquistas ----------
// Permanentes (nunca resetam, nem no Prestígio), cada uma com um bônus
// pequeno e fixo. `effect.type` reaproveita as mesmas chaves de bônus já
// usadas em relíquias/árvore de melhorias, então basta somar no cálculo.

const ACHIEVEMENTS = [
  { id: 'first_steps', name: 'Primeiros Passos', name_en: 'First Steps', icon: '🏕️', desc: 'Construa sua primeira jangada.', desc_en: 'Build your first raft.', effect: { type: 'clickPower', value: 0.02 } },
  { id: 'first_blood', name: 'Primeiro Sangue', name_en: 'First Blood', icon: '⚔️', desc: 'Vença sua primeira batalha.', desc_en: 'Win your first battle.', effect: { type: 'lootBonus', value: 0.02 } },
  { id: 'shipwright', name: 'Mestre Naval', name_en: 'Shipwright', icon: '⛵', desc: 'Alcance o tier Fragata em algum momento.', desc_en: 'Reach Frigate tier at some point.', effect: { type: 'resourceProd', value: 0.03 } },
  { id: 'armada', name: 'Armada Lendária', name_en: 'Legendary Armada', icon: '🚢', desc: 'Alcance o tier máximo de navio.', desc_en: 'Reach the maximum ship tier.', effect: { type: 'resourceProd', value: 0.05 } },
  { id: 'treasure_hunter', name: 'Caçador de Tesouros', name_en: 'Treasure Hunter', icon: '🏺', desc: 'Encontre sua primeira Relíquia.', desc_en: 'Find your first Relic.', effect: { type: 'itemChance', value: 0.03 } },
  { id: 'relic_master', name: 'Mestre das Relíquias', name_en: 'Relic Master', icon: '👑', desc: 'Colecione todas as 8 Relíquias.', desc_en: 'Collect all 8 Relics.', effect: { type: 'doubloonGain', value: 0.10 } },
  { id: 'captain_rank', name: 'Capitão', name_en: 'Captain', icon: '🎖️', desc: 'Alcance a patente de Capitão.', desc_en: 'Reach the rank of Captain.', effect: { type: 'resourceProd', value: 0.03 } },
  { id: 'legend_rank', name: 'Lenda dos Mares', name_en: 'Legend of the Seas', icon: '🌟', desc: 'Alcance a patente máxima.', desc_en: 'Reach the maximum rank.', effect: { type: 'resourceProd', value: 0.05 } },
  { id: 'merchant_friend', name: 'Amigo dos Mercadores', name_en: 'Friend of Merchants', icon: '🤝', desc: 'Cumpra 20 contratos.', desc_en: 'Fulfill 20 contracts.', effect: { type: 'contractReward', value: 0.05 } },
  { id: 'boss_slayer', name: 'Caçador de Lendas', name_en: 'Legend Hunter', icon: '💀', desc: 'Derrote todos os 5 chefes únicos ao menos uma vez.', desc_en: 'Defeat all 5 unique bosses at least once.', effect: { type: 'combatPower', value: 0.05 } },
  { id: 'prestige_veteran', name: 'Veterano do Prestígio', name_en: 'Prestige Veteran', icon: '🔁', desc: 'Faça Prestígio 5 vezes.', desc_en: 'Prestige 5 times.', effect: { type: 'doubloonGain', value: 0.05 } },
  { id: 'map_wanderer', name: 'Andarilho dos Mares', name_en: 'Sea Wanderer', icon: '🗺️', desc: 'Complete 50 mapas no total.', desc_en: 'Complete 50 maps in total.', effect: { type: 'explorationSpeed', value: 0.03 } },
];

const QUEST_SLOTS = 3;
const QUEST_POOL_SIZE = 5;

const QUEST_TEMPLATES = [
  { type: 'deliver', resource: 'gold',  label: 'quest_gold',  labelEn: 'quest_gold_en',  baseAmount: 300, rewardType: 'fame' },
  { type: 'deliver', resource: 'wood',  label: 'quest_wood',  labelEn: 'quest_wood_en',  baseAmount: 200, rewardType: 'gold' },
  { type: 'deliver', resource: 'rum',   label: 'quest_rum',   labelEn: 'quest_rum_en',   baseAmount: 100, rewardType: 'gold' },
  { type: 'battles', label: 'quest_battles', labelEn: 'quest_battles_en',                baseAmount: 3,   rewardType: 'gold' },
  { type: 'recruit', label: 'quest_recruit', labelEn: 'quest_recruit_en',                baseAmount: 5,   rewardType: 'fame' },
  { type: 'supportships', label: 'quest_ships', labelEn: 'quest_ships_en',               baseAmount: 2,   rewardType: 'item' },
];
function questLabel(state, q) {
  const lang = (state && state.settings && state.settings.lang) || 'pt';
  const templates = {
    quest_gold: n => `Acumule ${fmt(n)} de Ouro (a partir de agora)`,
    quest_gold_en: n => `Accumulate ${fmt(n)} Gold (from now on)`,
    quest_wood: n => `Junte ${fmt(n)} de Madeira (a partir de agora)`,
    quest_wood_en: n => `Gather ${fmt(n)} Wood (from now on)`,
    quest_rum: n => `Destile ${fmt(n)} de Rum (a partir de agora)`,
    quest_rum_en: n => `Distill ${fmt(n)} Rum (from now on)`,
    quest_battles: n => `Vença ${n} batalhas navais`,
    quest_battles_en: n => `Win ${n} naval battles`,
    quest_recruit: n => `Recrute ${n} novos tripulantes`,
    quest_recruit_en: n => `Recruit ${n} new crew members`,
    quest_ships: n => `Compre ${n} navios de apoio`,
    quest_ships_en: n => `Buy ${n} support ships`,
  };
  const key = lang === 'en' ? q.tpl.labelEn : q.tpl.label;
  return templates[key](q.amount);
}

// ---------- Contratos ----------

const CONTRACT_SLOTS = 3;

const CONTRACT_TEMPLATES = {
  geral: [
    { name: 'Fornecimento de Madeira',   name_en: 'Wood Supply',        cost: { wood: 200 },              reward: { gold: 150, fame: 10 } },
    { name: 'Transporte de Especiarias', name_en: 'Spice Transport',    cost: { spices: 30, gold: 50 },   reward: { gold: 300 } },
    { name: 'Reparo de Frota',           name_en: 'Fleet Repair',       cost: { wood: 100, iron: 20 },    reward: { gold: 200, fame: 8 } },
  ],
  pirate: [
    { name: 'Contrato de Saque',   name_en: 'Looting Contract',   cost: { gunpowder: 20 },          reward: { gold: 400, fame: 15 } },
    { name: 'Abordagem Relâmpago', name_en: 'Lightning Boarding',  cost: { gunpowder: 10, rum: 20 }, reward: { gold: 250, maps: 1 } },
    { name: 'Resgate por Reféns',  name_en: 'Ransom Hostages',     cost: { rum: 30, gunpowder: 15 }, reward: { gold: 550 } },
  ],
  corsair: [
    { name: 'Escolta Real',      name_en: 'Royal Escort',    cost: { cloth: 20, gold: 100 }, reward: { fame: 25, gold: 100 } },
    { name: 'Patrulha Oficial',  name_en: 'Official Patrol', cost: { gunpowder: 15 },        reward: { gold: 350, fame: 20 } },
    { name: 'Missão Diplomática', name_en: 'Diplomatic Mission', cost: { cloth: 30, spices: 15 }, reward: { fame: 35 } },
  ],
};

// ---------- Temas visuais ----------

const THEMES = ['dark', 'light', 'sepia', 'white'];

// ---------- Changelog embutido (exibido nas Configurações) ----------

const CHANGELOG_ENTRIES = [
  {
    version: '0.1.3.3 Final',
    date: '2026-07-16',
    pt: [
      'Final: versão 0.1.3.3 preparada para feedback da Alpha.',
      'Balanceamento: capacidade base do Armazém ajustada para 800 recursos.',
      'Novo: Modo História Reduzido, que diminui a frequência dos modais narrativos sem bloquear entradas do Diário de Bordo.',
      'Novo: progresso offline baseado no timestamp do último salvamento, limitado a 8 horas por sessão.',
      'Melhoria: checagem de desbloqueios centralizada e limitada a uma verificação a cada 500 ms.',
      'Melhoria: tooltip do Armazém agora informa claramente o nível e a capacidade atual.',
    ],
    en: [
      'Final: Alpha 0.1.3.3 Final prepared for feedback.',
      'Balance: base Warehouse capacity adjusted to 800 resources.',
      'New: Reduced Story Mode lowers the frequency of story pop-ups without blocking Captain\'s Log entries.',
      'New: offline progress based on the last save timestamp, capped at 8 hours per session.',
      'Improvement: unlock checks are centralized and throttled to once every 500 ms.',
      'Improvement: the Warehouse tooltip now clearly shows its level and current capacity.',
    ],
  },
  {
    version: '0.1.2',
    date: '2026-07-16',
    pt: [
      'Novo: Armazém (construção da ilha) — limita o quanto de Ouro/Madeira/Rum/Ferro/Pólvora/Tecido/Especiarias você consegue guardar; o excedente é perdido até você melhorar o Armazém. Fama, Mapas e Dobrões não têm limite.',
      'Isso é uma proteção contra os números explodirem sem controle — agora vale a pena gastar em vez de só acumular',
      'Automação avançada (Contramestre-Chefe) mais estável: só realoca tripulação quando o desequilíbrio entre tarefas é realmente significativo, evitando ficar mexendo à toa',
      'Custo dos tiers 1-4 do Navio Principal aumentado mais um pouco',
      'Registro de Rotas: adicionado um 4º patamar de retorno bem mais baixo além de 2000 mapas concluídos, reforçando a curva de retornos decrescentes',
      'Versionamento pulou direto pra 0.1.2 (nomeação combinada com o pedido do jogador)',
    ],
    en: [
      'New: Warehouse (island building) — limits how much Gold/Wood/Rum/Iron/Gunpowder/Cloth/Spices you can store; overflow is lost until you upgrade the Warehouse. Fame, Maps and Doubloons have no limit.',
      'This protects against numbers exploding out of control — now it pays off to spend instead of just hoarding',
      'Advanced automation (Quartermaster AI) more stable: only rebalances crew when the imbalance between tasks is genuinely significant, avoiding needless shuffling',
      'Main Ship tier 1-4 costs increased a bit further',
      'Route Log: added a 4th, much lower return tier beyond 2000 completed maps, reinforcing the diminishing-returns curve',
      'Versioning jumped straight to 0.1.2 (naming combined per the player\'s request)',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-07-15',
    pt: [
      'Tema Branco: trocada a fonte decorativa (difícil de ler) por uma sans-serif limpa',
      'Classes mais diferentes: Pirata ganha +25% de Ouro mas perde reputação 50% mais rápido e pode atacar mercadores; Corsário ganha -15% de Ouro mas +15% de Dobrões, tem contratos e eventos diplomáticos exclusivos',
      'Piratas encontram itens ofensivos (Canhão/Proa) melhores; Corsários encontram itens defensivos (Casco/Amuleto) melhores',
      'Chefes com mecânicas próprias: Kraken reduz sua velocidade de exploração enquanto vivo; Rainha Pirata rouba Ouro a cada derrota; Holandês Voador só aparece durante Eventos Mundiais; Capitão Fantasma ignora o Casco do seu navio',
      'Novo contrato exclusivo de Pirata (Resgate por Reféns) e de Corsário (Missão Diplomática)',
      'Marco: a partir desta versão, o foco passa a ser balanceamento e estética por um tempo',
    ],
    en: [
      'White theme: swapped the decorative (hard to read) font for a clean sans-serif',
      'More different classes: Pirates gain +25% Gold but lose reputation 50% faster and can attack merchants; Privateers gain -15% Gold but +15% Doubloons, with exclusive contracts and diplomatic events',
      'Pirates find better offensive items (Cannon/Bow); Privateers find better defensive items (Hull/Charm)',
      'Bosses with their own mechanics: Kraken slows your exploration speed while alive; Pirate Queen steals Gold on every defeat; Flying Dutchman only appears during World Events; Ghost Captain ignores your ship\'s Hull',
      'New exclusive contract for Pirates (Ransom Hostages) and Privateers (Diplomatic Mission)',
      'Milestone: starting from this version, the focus shifts to balancing and visual polish for a while',
    ],
  },
  {
    version: '0.0.5',
    date: '2026-07-14',
    pt: [
      'Corrigido: "Apagar Tudo" não funcionava de verdade (o save antigo era regravado por cima do reset)',
      'Corrigido: automação podia travar um recurso em 0 se nenhum tripulante fosse atribuído àquela tarefa',
      'Corrigido: abas apareciam desabilitadas antes de serem liberadas — agora ficam escondidas até desbloquear de verdade',
      'Corrigido: painel de Facções estava "perdido" dentro da aba Prestígio (que libera tarde) — movido para a aba Missões',
      'Corrigido: bônus das Conquistas mostrava a chave interna em inglês em vez de um texto traduzido',
      'Corrigido: comprar "Ambições Imperiais" não desbloqueava de fato a aba Prestígio',
      'Registro de Rotas agora tem retornos decrescentes (+0,1% nos 100 primeiros mapas, +0,05% nos próximos 400, +0,02% dali em diante) em vez de crescer sem limite',
      'Novidade: aba Conquistas — 12 marcos permanentes com pequenos bônus fixos para sempre',
    ],
    en: [
      'Fixed: "Delete Everything" wasn\'t actually working (the old save was written back over the reset)',
      'Fixed: automation could lock a resource at 0 if no crew was ever assigned to that task',
      'Fixed: tabs appeared disabled before being unlocked — now they stay hidden until truly unlocked',
      'Fixed: the Factions panel was "lost" inside the Prestige tab (which unlocks late) — moved to the Quests tab',
      'Fixed: Achievement bonuses showed the raw internal English key instead of a translated label',
      'Fixed: buying "Imperial Ambitions" wasn\'t actually unlocking the Prestige tab',
      'Route Log now has diminishing returns (+0.1% for the first 100 maps, +0.05% for the next 400, +0.02% beyond that) instead of growing without limit',
      'New: Achievements tab — 12 permanent milestones with small fixed bonuses forever',
    ],
  },
  {
    version: '0.0.4',
    date: '2026-07-13',
    pt: [
      'Substituídas as melhorias de tripulação recompráveis por uma Árvore de Melhorias de compra única, com pré-requisitos entre nós (aba "Melhorias")',
      'Corrigido bug de descrições de upgrade aparecendo com o nome interno em inglês',
      'Automação: "Contramestre Automático" atribui novos tripulantes para a tarefa mais necessária; "Contramestre-Chefe" também realoca tripulação já ocupada aos poucos',
      'Abas Missões/Inventário, Frota e Prestígio agora são desbloqueadas comprando nós específicos da Árvore de Melhorias, em vez de gatilhos automáticos',
      'A Árvore de Melhorias reseta a cada Prestígio, junto com o resto da run — segurando bem o ritmo entre ciclos',
      'Custos de evolução do Navio Principal aumentados (principalmente tiers 1-4) e recompensas de exploração levemente reduzidas, pra não chegar no primeiro Prestígio em poucos minutos',
      'Bônus "quebrados"/inusitados na Árvore de Melhorias: Registro de Rotas (bônus permanente que cresce a cada mapa, nunca reseta), Cracas da Sorte (chance de jackpot no clique manual), Eco de Batalha (chance de chefe em cadeia)',
      'Novas Facções (Marinha, Mercadores, Piratas, Corsários, Contrabandistas) com reputação persistente que reage às suas escolhas de classe, contratos e eventos',
      'Novos eventos de mapa: Tempestade, Ilha Abandonada, Mercador, Tripulação Amotinada, Navio Fantasma e Tesouro Enterrado — cada casco vira uma surpresa',
      'Chefes únicos nomeados no fim de cada mapa (Kraken, Holandês Voador, Rainha Pirata, Capitão Fantasma, Navio da Companhia das Índias), cada um com uma mecânica própria',
      'Eventos Mundiais aleatórios e temporários (Tempestade Global, Festival dos Piratas, Mares Calmos, Boom Comercial)',
      'Novo tema visual Branco, além de Escuro/Claro/Sépia',
    ],
    en: [
      'Replaced repeatable crew upgrades with a one-time Upgrade Tree, with prerequisites between nodes ("Upgrades" tab)',
      'Fixed bug where upgrade descriptions showed the internal English key name',
      'Automation: "Auto-Boatswain" assigns new crew to the most needed task; "Quartermaster AI" also gradually rebalances already-working crew',
      'Quests/Inventory, Fleet and Prestige tabs are now unlocked by buying specific Upgrade Tree nodes, instead of automatic triggers',
      'The Upgrade Tree resets every Prestige, along with the rest of the run — holding the pace steady between cycles',
      'Main Ship upgrade costs increased (mainly tiers 1-4) and exploration rewards slightly reduced, so the first Prestige no longer arrives within a few minutes',
      '"Broken"/quirky bonuses in the Upgrade Tree: Route Log (permanent bonus that grows with each map, never resets), Lucky Barnacles (jackpot chance on manual click), Battle Echo (chained boss chance)',
      'New Factions (Navy, Merchants, Pirates, Corsairs, Smugglers) with persistent reputation that reacts to your class choice, contracts and events',
      'New map events: Storm, Abandoned Island, Merchant, Mutinous Crew, Ghost Ship and Buried Treasure — every tile becomes a surprise',
      'Unique named bosses at the end of each map (Kraken, Flying Dutchman, Pirate Queen, Ghost Captain, East India Company Ship), each with its own mechanic',
      'Random, temporary World Events (Global Storm, Pirate Festival, Calm Seas, Trade Boom)',
      'New White visual theme, in addition to Dark/Light/Sepia',
    ],
  },
  {
    version: '0.0.3',
    date: '2026-07-12',
    pt: [
      'Navio Principal (com slots/itens) separado da nova Frota de Apoio (compra em quantidade, sem itens, liberada após explorar o mapa)',
      'Slots de equipamento agora também exigem distância explorada no mapa, além do tier do navio',
      'Nova aba Tripulação: atribuição de tarefas + melhorias recompráveis para cada função',
      'Novo "Trabalhar no Convés" (Tripulação) e "Reforçar Ataque" (Exploração): clique manual continua relevante',
      'Corrigido bug de missões repetidas (progresso agora sempre conta a partir do momento em que a missão é aceita)',
      'Chances de raridade de itens rebalanceadas: Comum domina bastante no início, raridades altas ficam realmente raras',
      'Dicas de tutorial ao desbloquear cada aba/sistema novo',
      'Texto do papel do navio de volta ao dropdown (antes só emoji)',
      'Temas visuais: Escuro, Claro e Sépia',
      'Changelog agora acessível dentro do próprio jogo (aba Configurações)',
    ],
    en: [
      'Main Ship (with slots/items) split from the new Support Fleet (bought in bulk, no items, unlocked after exploring the map)',
      'Equipment slots now also require map exploration distance, in addition to ship tier',
      'New Crew tab: task assignment + repeatable upgrades for each role',
      'New "Work the Deck" (Crew) and "Reinforce Attack" (Exploration): manual clicking stays relevant',
      'Fixed repeated-quest bug (progress now always counts from the moment the quest is accepted)',
      'Rebalanced item rarity odds: Common dominates early on, higher rarities are genuinely rare',
      'Tutorial hints when unlocking each new tab/system',
      'Ship role text is back in the dropdown (was emoji-only)',
      'Visual themes: Dark, Light and Sepia',
      'Changelog now viewable in-game (Settings tab)',
    ],
  },
  {
    version: '0.0.2',
    date: '2026-07-11',
    pt: [
      'Corrigido bug do dropdown de papel do navio fechando sozinho, e de precisar clicar várias vezes nas abas (arquitetura de render separada)',
      'Idioma PT/EN selecionável, com aba Configurações (Exportar/Importar/Apagar Save)',
      'Início reformulado: Náufrago catando recursos manualmente até montar acampamento e construir a primeira jangada',
      'Painel de patente clicável com lista completa e progresso',
      'Tooltips de produção por segundo na barra de recursos',
      'Missões por escolha (pool + até 3 ativas) e contratos fixos em 3',
      'Exploração reformulada em Mapa com cascos e névoa de guerra',
    ],
    en: [
      'Fixed ship-role dropdown closing itself, and tabs needing multiple clicks (separated render architecture)',
      'Selectable PT/EN language, with Settings tab (Export/Import/Delete Save)',
      'Reworked start: Castaway gathering resources by hand until camp + first raft',
      'Clickable rank panel with full list and progress',
      'Production-per-second tooltips on the resource bar',
      'Quests by choice (pool + up to 3 active) and contracts fixed at 3',
      'Exploration reworked into a Map with tiles and fog of war',
    ],
  },
  {
    version: '0.01',
    date: '2026-07-09',
    pt: ['Primeira versão jogável: recursos, frota com slots, ilha com construções, patentes, exploração/combate automático, itens com 6 raridades, relíquias, missões e contratos, prestígio com escolha de classe e 3 árvores.'],
    en: ['First playable version: resources, fleet with slots, island with buildings, ranks, automatic exploration/combat, items with 6 rarities, relics, quests and contracts, prestige with class choice and 3 trees.'],
  },
];
