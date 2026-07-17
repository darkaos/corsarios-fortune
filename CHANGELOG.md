# Alpha 0.1.3.3 — Robustez de progressão, UI do Armazém e Diário opcional

### 🐛 Correções e progressão
- O Capitão agora começa com **1 membro na tripulação** (`1 total / 1 ocioso`) assim que a primeira Jangada é construída.
- A progressão de desbloqueios foi centralizada em `updateAllUnlocks(state)`, reduzindo o risco de sistemas serem liberados fora de ordem.
- O Diário de Bordo avança no máximo **um Ato por atualização**, evitando saltos como Ato II → Ato III no mesmo processamento.
- A descrição dos requisitos de Tripulação e Exploração foi alinhada com a progressão real do jogo.

### 📦 Armazém
- A aba Ilha agora mostra claramente a **capacidade atual do Armazém**, o bônus de capacidade e a projeção do próximo nível.
- O tooltip detalha capacidade atual, próxima capacidade e bônus atual/próximo.

### 📖 Diário de Bordo
- O pop-up de novo Ato agora oferece **Ler Diário** ou **Ler mais tarde**.
- Escolher **Ler Diário** abre diretamente a aba do Diário de Bordo sem forçar a leitura do texto naquele momento.

### ⚙️ Código e performance
- Adicionado cache dos prédios por ID (`BUILDING_BY_ID`) para evitar buscas repetidas com `BUILDINGS.find(...)` em caminhos frequentes.
- Mantidas as compras múltiplas de construções (+1, +10, +25, +100 e Máx.) e a coleta manual da versão anterior.

# Alpha 0.1.3.2 — Coleta manual e compras múltiplas de construções

### 🧺 Coleta manual após a Jangada
- Adicionado o botão **Coletar Recursos** na aba da Ilha depois da construção da primeira Jangada.
- Quando a aba **Tripulação** é desbloqueada, a ação de coleta passa a aparecer na aba Tripulação.
- A coleta manual usa os mesmos bônus de clique/trabalho manual e respeita o limite do Armazém.
- O botão permite que o jogador continue progredindo mesmo antes de possuir uma tripulação.

### 🏗️ Compras múltiplas de construções
- Adicionados botões **+1, +10, +25, +100 e Máx.** para as construções da Ilha.
- **Máx.** compra automaticamente o maior número de níveis possível com os recursos disponíveis.
- Compras em lote calculam o custo de cada nível individualmente, respeitando a progressão de custos e o limite de recursos.

### 🐛 Correções / Qualidade de vida
- A versão agora é identificada como **Alpha 0.1.3.2**.
- Mantida a progressão narrativa gradual após a Jangada, sem liberar Exploração prematuramente.

# Alpha 0.1.3.1 — Correção de progressão da história e desbloqueios

### 🐛 Correções
- Corrigido o bug em que a construção da primeira Jangada podia fazer a progressão narrativa avançar diretamente para o Ato III — ou até pular atos quando vários gatilhos eram satisfeitos na mesma verificação.
- A progressão agora é sequencial: **Jangada → Ato II → Primeiro Alojamento → Tripulação → Primeiro Escaler → Exploração → Ato III**.
- Corrigida a sincronização de saves antigos: Tripulação e Exploração não permanecem liberadas antes dos marcos necessários.
- A Tripulação só é liberada após a construção da primeira Jangada e do primeiro nível de Alojamentos.
- A Exploração só é liberada após a primeira Jangada, o primeiro Alojamento e a evolução do Navio Principal para o primeiro Escaler.
- O sistema de Diário de Bordo agora não permite que um save avance vários Atos de uma só vez.

### 📝 Nota
- Esta versão é a **Alpha 0.1.3.1**, uma atualização corretiva da Alpha 0.1.3.

# Alpha 0.1.3 — Correção da progressão narrativa

- Corrigido o desbloqueio prematuro de Tripulação e Exploração ao construir a Jangada.
- A Jangada agora libera apenas Navio, Melhorias e Conquistas.
- Tripulação é liberada ao construir o primeiro nível de Alojamentos.
- O crescimento automático da tripulação só começa após a liberação da aba Tripulação.
- Exploração é liberada apenas após o primeiro upgrade do navio, o Escaler.
- A geração do mapa inicial foi movida para o desbloqueio da Exploração.
- Saves antigos são sincronizados com a progressão correta para evitar que a Exploração ou a Tripulação apareçam antes da hora.

# Changelog — Corsário's Fortune

## [Alpha 0.1.2] — 2026-07-16

### 📦 Armazém (novo prédio da ilha)
- Novo prédio, disponível logo depois da 1ª expansão da ilha: limita quanto de **Ouro, Madeira, Rum, Ferro, Pólvora, Tecido e Especiarias** você consegue guardar de uma vez. Produção além do limite é perdida — clássico mecanismo de "silo cheio" de jogos incrementais.
- Fama, Mapas do Tesouro e Dobrões **não têm limite** (são progressão, não estoque).
- Cada nível do Armazém multiplica o limite em ×1,15. Limite base: 5.000 por recurso.
- Existe pra dar uma resposta estrutural a números que só cresciam sem parar: agora tem uma razão real pra gastar em vez de só acumular esperando o próximo Prestígio.

### 🤖 Automação avançada mais estável
- O Contramestre-Chefe (realocação avançada de tripulação) agora só age quando o desequilíbrio entre tarefas é realmente significativo (proporção de necessidade acima de 2,2×), em vez de ficar reorganizando a tripulação por diferenças pequenas.

### ⚖️ Ajustes de balanceamento
- Custo dos tiers 1-4 do Navio Principal aumentado mais um pouco.
- Registro de Rotas ganhou um 4º patamar de retorno (bem mais baixo, além de 2000 mapas concluídos), reforçando a curva de retornos decrescentes introduzida na v0.0.5.

### 🗂️ Nota sobre estrutura de arquivos
- O projeto continua **sem subpastas** (tudo num nível só). Já tivemos um bug real na v0.01 causado justamente por arquivos em `css/`/`js/` se perdendo ao baixar — manter tudo junto evita que isso aconteça de novo.

---

## [Alpha 0.1.0] — 2026-07-15

Marco: a partir desta versão o foco passa a ser **balanceamento e estética**
por um tempo, em vez de novos sistemas grandes.

### 🎨 Tema Branco legível
- Trocada a fonte decorativa (Pirata One), que ficava muito difícil de ler em fundo branco, por uma sans-serif limpa (Segoe UI / system-ui) só nesse tema. O título grande do topo mantém um pouco do estilo, mais grosso e legível.

### ⚔️ Classes mais diferentes (não só números)
- **Pirata**: +25% de produção de Ouro; itens ofensivos (Canhão/Proa) encontrados são ~15% melhores; pode **atacar** o evento de mapa "Mercador" (mais Ouro, mas irrita bastante os Mercadores); perde reputação de facção **50% mais rápido** que o normal quando a perde.
- **Corsário**: -15% de produção de Ouro, compensado com **+15% de Dobrões** ganhos no Prestígio; itens defensivos (Casco/Amuleto) encontrados são ~15% melhores; o evento "Mercador" vira uma **negociação diplomática** (Fama + reputação com Marinha/Mercadores em vez de recursos); novo contrato exclusivo "Missão Diplomática".
- Novo contrato exclusivo de Pirata: "Resgate por Reféns".

### 👑 Chefes com mecânicas próprias
- **Kraken**: reduz sua velocidade de exploração em 30% enquanto estiver vivo.
- **Rainha Pirata**: rouba 8% do seu Ouro atual a cada derrota contra ela.
- **Holandês Voador**: agora só pode aparecer como chefe durante um Evento Mundial ativo — o resto do tempo, nunca aparece.
- **Capitão Fantasma**: ignora completamente o Casco do seu navio nessa luta (a defesa não conta).
- Descrições de cada chefe atualizadas para explicar a mecânica na hora do combate.

---

## [Alpha 0.0.5] — 2026-07-14

### 🐛 Correções
- **"Apagar Tudo" não funcionava.** Causa: depois de remover o save e pedir o recarregamento da página, o código continuava executando e salvava o estado antigo de volta no `localStorage` um instante antes do reload acontecer de fato, desfazendo o reset. Corrigido.
- **Automação podia travar recursos.** Se nenhum tripulante fosse atribuído a uma tarefa (ex: 0 Saqueadores), aquele recurso podia ficar em 0 pra sempre mesmo com o Contramestre Automático ligado. Agora a automação sempre garante pelo menos 1 tripulante em cada tarefa antes de distribuir o resto por necessidade — e a realocação avançada (Contramestre-Chefe) nunca zera uma tarefa que só tem 1 pessoa.
- **Abas apareciam antes de serem liberadas** (mostradas desabilitadas com cadeado). Agora ficam completamente escondidas da barra de abas até serem desbloqueadas de verdade.
- **Facções não apareciam em lugar nenhum.** O painel estava dentro da aba Prestígio, que só desbloqueia bem tarde. Movido para a aba Missões, onde a reputação já começa a mudar desde os primeiros contratos.
- Corrigido um segundo vazamento de texto em inglês: o bônus das novas Conquistas mostrava a chave interna crua (ex: "clickPower") em vez de um rótulo traduzido.
- Corrigido um bug em que comprar "Ambições Imperiais" não desbloqueava de fato a aba Prestígio (só a lógica interna reconhecia).

### ⚖️ Registro de Rotas: retornos decrescentes
- Curva ajustada pra não explodir a economia com muitos mapas completados: **+0,1% nos primeiros 100 mapas**, **+0,05% nos próximos 400**, **+0,02% dali em diante**. Continua sendo um bônus permanente que nunca reseta, só que agora sustentável em vez de crescer linear e infinitamente.

### 🏆 Conquistas (novidade desta versão)
- Nova aba, com 12 conquistas permanentes (nunca resetam, nem no Prestígio), cada uma com um pequeno bônus fixo para sempre: Primeiros Passos, Primeiro Sangue, Mestre Naval, Armada Lendária, Caçador de Tesouros, Mestre das Relíquias, Capitão, Lenda dos Mares, Amigo dos Mercadores, Caçador de Lendas (derrotar os 5 chefes únicos), Veterano do Prestígio, Andarilho dos Mares.

### 📝 Nota
- Ideias de classes mais diferenciadas (conteúdo exclusivo por Pirata/Corsário, não só números) e chefes com mecânicas próprias (Kraken reduzindo velocidade, Rainha Pirata roubando ouro, etc.) foram registradas no roteiro para a próxima versão — ficaram de fora desta por serem features grandes, e esta versão foi combinada para ser só correções + Conquistas.

---

## [Alpha 0.0.4] — 2026-07-13

### 🔧 Árvore de Melhorias (substitui upgrades recompráveis)
- As antigas melhorias de tripulação (recompráveis infinitamente) viraram uma **Árvore de Melhorias de compra única** (aba "Melhorias"): cada nó é comprado uma vez só e fica marcado como concluído para sempre naquele ciclo. Vários nós exigem outros nós antes (pré-requisitos), formando colunas de profundidade crescente.
- Corrigido bug onde a descrição de um upgrade aparecia com o nome da variável interna em inglês (ex: `lootersBonus`) em vez de um texto traduzido de verdade.

### 🤖 Automação
- **Contramestre Automático**: novos tripulantes passam a ser atribuídos automaticamente à tarefa mais escassa (baseado no recurso mais em falta), em vez de ficarem ociosos esperando atribuição manual.
- **Contramestre-Chefe**: automação avançada — também realoca aos poucos a tripulação que já está trabalhando, conforme a necessidade muda.

### 🔓 Abas desbloqueadas via Árvore de Melhorias
- **Missões + Inventário**: agora exigem comprar o nó "Contatos no Porto".
- **Frota de Apoio**: exige comprar "Estaleiro Aliado".
- **Prestígio**: exige possuir uma Escuna **e** comprar "Ambições Imperiais" (antes bastava vencer 1 batalha ou possuir uma Escuna).
- A Árvore de Melhorias **reseta a cada Prestígio**, junto com o resto da run — isso é de propósito: segura bastante o ritmo entre ciclos, já que missões/frota/prestígio precisam ser reconquistados a cada vez.

### 🐌 Freio de ritmo (chegava no 1º Prestígio rápido demais)
- Custos de evolução do Navio Principal aumentados, principalmente tiers 1-4 (os que definem "quando dá pra prestigiar").
- Curva de recompensa da exploração (`rewardScale`) reduzida de 1.18 para 1.15 por casco de distância.
- Combinado com o novo gate da Árvore de Melhorias, o primeiro Prestígio deixa de ser questão de poucos minutos.

### 🎲 Bônus "quebrados" / inusitados
- **Registro de Rotas** (permanente — nunca reseta, nem no Prestígio): cada mapa concluído aumenta a produção de Ouro em 0,1% para sempre.
- **Cracas da Sorte**: a cada clique em "Trabalhar no Convés", 0,5% de chance de achar uma moeda antiga rara (bônus de Ouro bem maior que o normal).
- **Eco de Batalha**: chefes derrotados têm 4% de chance de um segundo chefe aparecer imediatamente na sequência, com recompensas dobradas.

### 🌍 Facções
- Cinco facções — Marinha, Mercadores, Piratas, Corsários, Contrabandistas — cada uma com reputação de -100 (hostil) a +100 (aliado), **persistente através do Prestígio** (é a sua lenda pelo mundo, não algo que reseta).
- Reputação muda com a escolha de classe no Prestígio, o tipo de contrato cumprido, e alguns eventos de mapa.
- Reputação alta com Mercadores barateia contratos; reputação alta com Corsários aumenta os Dobrões ganhos no Prestígio.
- Painel de Facções visível na aba Prestígio.

### 🗺️ Eventos de Mapa
- Além de vazio/inimigo/saque/chefe, cascos agora podem sortear: 🌩️ Tempestade, 🏝️ Ilha Abandonada, ⚖️ Mercador, 😠 Tripulação Amotinada, 👻 Navio Fantasma, 💎 Tesouro Enterrado — cada um com um efeito próprio e curto, pra deixar o próximo casco sempre uma surpresa.

### 👑 Chefes Únicos
- O casco final de cada mapa agora sorteia um chefe nomeado em vez de "só um inimigo mais forte": 🐙 Kraken (+50% poder, recompensa dobrada), ⛴️ Holandês Voador (poder oculto, derrota sem penalidade extra), 👑 Rainha Pirata (mais fácil pra Piratas, mais difícil pra Corsários), 💀 Capitão Fantasma (chance de relíquia dobrada), 🚩 Navio da Companhia das Índias (mais Ouro, mas irrita os Mercadores).

### 🎉 Eventos Mundiais
- Disparam aleatoriamente enquanto o jogo está aberto, duram 3 minutos: 🌩️ Tempestade Global (produção pela metade), 🎉 Festival dos Piratas (chance de itens Lendários/Ultra dobrada), 🌊 Mares Calmos (+50% velocidade de exploração), 📈 Boom Comercial (+30% produção).
- ⚠️ Limitação conhecida: só ocorrem enquanto o jogo está aberto — ainda não há simulação de progresso/eventos offline (isso exigiria um sistema separado de cálculo de tempo decorrido, que pode ser uma próxima feature).

### 🎨 Outros
- Novo tema visual **Branco**, além de Escuro/Claro/Sépia.
- Chave de save mudou de versão (`corsarios_fortune_save_v4`).

---

## [Alpha 0.0.3] — 2026-07-12

### 🚢 Navio Principal separado da Frota de Apoio
- Seu antigo "navio único com slots" agora é o **Navio Principal** (aba própria), que evolui de tier em tier e é o único lugar com slots de equipamento/itens.
- Nova aba **Frota** (desbloqueada depois de explorar 12 cascos do mapa): embarcações de apoio compradas em quantidade (Barca de Ataque, Barca de Carga, Escuna de Exploração) — sem slots próprios, só somam poder/bônus.
- Isso também elimina qualquer risco futuro de bug de dropdown por navio: só existe um seletor de papel agora (o do Navio Principal), e a Frota de Apoio não usa dropdown nenhum.

### 🔓 Slots de equipamento liberados pela exploração
- Além do tier do navio determinar quais slots existem, cada slot agora também exige uma certa distância explorada no mapa antes de ficar utilizável (ex: Canhão aos 10 cascos, Bandeira aos 18, Proa aos 28...).

### 👥 Nova aba Tripulação
- Atribuição de tarefas (Saqueadores/Carpinteiros/Destiladores/Combatentes) — antes ficava na Frota — agora mora aqui, junto com **melhorias recompráveis** (Treinamento de Saqueadores, Rações Extras, Disciplina de Bordo, Fôlego de Convés, etc.), dando a camada de decisão incremental que faltava.

### 💪 Clique ativo relevante o jogo todo
- **Trabalhar no Convés** (aba Tripulação): clique manual dá uma pequena quantidade de Ouro/Madeira na hora.
- **Reforçar Ataque** (aba Exploração): clique manual acelera o combate atual.
- Ambos escalam com a melhoria de Tripulação "Fôlego de Convés" e com o novo nó de Prestígio **Mãos Calejadas** — pra quem quer jogar ativamente, não só esperar os números subirem, o clique continua valendo a pena mesmo depois de várias runs de Prestígio.

### 🐛 Corrigido: missões repetidas / vindo prontas na hora
- A causa: para missões do tipo "tenha N tripulantes" ou "construa N navios", o progresso era comparado com um valor absoluto capturado na hora em que a missão era **gerada** (não aceita) — se você já tivesse passado daquele número, ela vinha pronta instantaneamente, e podia se repetir.
- Correção: toda missão agora captura sua contagem de partida no momento em que é **aceita**, e todo progresso é relativo a partir dali — igual já funcionava para as de recurso/batalhas.

### ⚖️ Raridade de itens rebalanceada
- Comum agora domina bem mais no início (antes Raro/Elite saíam cedo demais); as raridades altas (Lendário, Ultra Lendário) ficam bem mais raras e só aumentam de chance conforme você explora muita distância.

### 💡 Dicas de tutorial
- Ao desbloquear cada aba/sistema novo (Ilha, Navio, Tripulação, Exploração, Frota, Missões, Prestígio), aparece uma faixa explicando o que é aquilo, com um botão "Entendi" — some depois de lida e não volta.

### 🎨 Configurações: temas + changelog no jogo
- 3 temas visuais: Escuro (padrão), Claro e Sépia.
- Histórico de versões (changelog) agora pode ser lido dentro do próprio jogo, na aba Configurações.

### 🔧 Outras correções
- Texto do papel do navio (Ataque/Produção/Exploração) de volta ao dropdown — na v0.0.2 só tinha emoji.
- Chave de save mudou de versão (`corsarios_fortune_save_v3`); saves da v0.0.2 não são compatíveis automaticamente.

### 📝 Notas / limitações conhecidas desta versão
- O ritmo geral de progressão (curva de custos/recompensas por distância explorada) ainda usa a mesma fórmula exponencial das versões anteriores; as novas camadas de decisão (Tripulação, slots por distância, Frota tardia) ajudam a segurar o ritmo, mas um ajuste fino de números ainda está pendente de mais playtesting.
- Ainda sem UI de arrastar-e-soltar para equipar itens — o clique em "Equipar" tenta o Navio Principal diretamente (que agora é o único navio com slots, então ficou mais direto que antes).

---

## [Alpha 0.0.2] — 2026-07-11

### 🐛 Correções críticas
- **Corrigido: dropdown de papel do navio fechava sozinho.** A causa era que a tela inteira era redesenhada a cada 200ms, mesmo com um `<select>` aberto. Agora a renderização é separada em duas camadas: uma reconstrução completa (só acontece após uma ação do jogador, nunca num timer sozinho) e uma atualização leve de números/textos a cada tick, que nunca recria elementos interativos.
- **Corrigido: era preciso clicar várias vezes nas abas para trocar.** Mesma causa raiz do bug acima — o botão era recriado bem no meio do clique, e o navegador cancelava o clique. Testado com automação de navegador (Playwright): clique único agora troca de aba imediatamente, e 40+ cliques rápidos seguidos em outros botões não perdem nenhum clique.

### 🌍 Internacionalização
- Novo seletor de idioma na primeira vez que o jogo abre (**Português (Brasil)** ou **English**).
- Praticamente toda a interface, itens, navios, construções, patentes, relíquias e mensagens de log agora existem nos dois idiomas.
- Idioma pode ser trocado a qualquer momento na nova aba **Configurações**.

### ⚙️ Nova aba Configurações
- Trocar idioma.
- Exportar Save / Importar Save (antes ficavam na aba Prestígio).
- Apagar Tudo.

### 🏝️ Início totalmente reformulado (Náufrago)
- O jogo agora começa com você **náufrago, sozinho, sem nada** — antes de qualquer tripulação, navio ou ilha administrável.
- Duas ações manuais de clique: **Catar Madeira** e **Catar Destroços**.
- 4 upgrades manuais compráveis com os próprios recursos catados (aumentam quanto você ganha por clique).
- Ao juntar o suficiente, você **monta um acampamento** (desbloqueia a aba Ilha) e depois **constrói sua primeira jangada** (desbloqueia Frota e Exploração, e te dá seu primeiro tripulante — você mesmo).
- As demais abas (Missões, Inventário, Prestígio) permanecem bloqueadas, com o requisito exato exibido ao passar o mouse no cadeado, até serem cumpridas naturalmente jogando.

### ⭐ Patente visível
- A patente atual agora aparece como um link clicável na barra de status; clicar abre um painel com a lista completa de patentes, o que já foi alcançado, e quanto falta para a próxima.

### 📊 Tooltips de produção
- Passar o mouse em qualquer recurso na barra do topo mostra quanto você está ganhando por segundo daquele recurso.

### 📜 Missões e Contratos reformulados
- Missões agora funcionam por **escolha**: existe um conjunto de missões disponíveis, e você aceita até 3 por vez (as demais continuam na lista de disponíveis).
- Contratos agora são sempre **exatamente 3 por vez** (antes a quantidade crescia com a Sede de Contratos — esse prédio agora aumenta a recompensa dos contratos em vez da quantidade).

### 🗺️ Exploração: Mapa (estilo Trimps)
- Trocado o sistema de "uma ilha por vez" por um **Mapa** dividido em cascos (tiles), que vai sendo revelado conforme sua frota avança.
- Cada casco pode ser: 🌊 vazio, ⚔️ inimigo, 🎁 saque garantido, ou 💀 chefe (sempre o último do mapa).
- Cascos futuros aparecem como "❔" (névoa de guerra) até você chegar perto — o nível da Torre de Vigia/Sinalização revela cascos extras à frente.
- Ao terminar um mapa, um novo mapa maior e mais recompensador é gerado automaticamente.

### 🔧 Outras mudanças
- `.gitignore`/estrutura de arquivos mantidos simples (tudo numa pasta só, sem subpastas — ver v0.01).
- Chave de save mudou de versão (`corsarios_fortune_save_v2`); saves da v0.01 não são compatíveis automaticamente (jogo detecta ausência e começa um novo náufrago).

### 📝 Notas / limitações conhecidas desta versão
- A tradução cobre toda a interface e mensagens principais; alguns nomes de itens gerados aleatoriamente usam uma lista de adjetivos separada em PT/EN, mas combinações muito específicas podem não soar 100% naturais em inglês.
- Para proteger contra os bugs de clique corrigidos nesta versão, as abas Ilha, Missões, Inventário e Prestígio só se atualizam sozinhas quando você faz alguma ação nelas ou troca de aba — não em tempo real enquanto você olha para elas parado. Isso é intencional (é a própria correção do bug), mas significa que, por exemplo, uma missão que ficou pronta enquanto você olhava outra aba só vai aparecer como "pronta para resgatar" a próxima vez que a aba for redesenhada.
- Balanceamento do início (náufrago → jangada → primeiras batalhas) é uma primeira passada; pode precisar de ajuste fino depois de mais testes.

---

## [Alpha 0.01] — 2026-07-09
Primeira versão jogável. Ver `GAME_DESIGN.md` para o design completo desta versão
(recursos, frota com slots, ilha com construções, patentes, exploração/combate
automático por ilhas sequenciais, itens com 6 raridades, relíquias, missões e
contratos automáticos, prestígio com escolha de classe e 3 árvores).
