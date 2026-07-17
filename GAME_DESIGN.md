# 📜 Corsário's Fortune — Documento de Game Design

**Versão do documento:** referente à Alpha 0.1.3.3 Final (ver `CHANGELOG.md` para o histórico exato de mudanças)
**Gênero:** Idle / Incremental
**Inspiração direta:** [Trimps](https://trimps.github.io/)
**Tema:** Piratas e Corsários, era de vela (séc. XVI–XVIII)
**Plataforma:** Navegador (HTML/CSS/JS puro, sem backend)
**Idiomas:** Português (Brasil) e English, com troca a qualquer momento pela aba Configurações

---

## 1. Visão Geral

Você é o capitão de uma frota nascente. Recruta tripulação, atribui funções,
constrói navios cada vez maiores, expande uma ilha-base com construções que
produzem recursos, explora ilhas em combate automático, cumpre missões e
contratos, encontra itens e relíquias, e periodicamente faz **Prestígio**:
reinicia a maior parte do progresso em troca de **Dobrões**, uma moeda
permanente usada em três árvores de melhorias. A cada Prestígio, o jogador
escolhe se será **Pirata** (fora da lei, agressivo, saqueador) ou **Corsário**
(sob carta de corso, diplomático, focado em Dobrões e comércio).

### Pilares de design
1. **Progressão em múltiplas camadas** — navio, patente, ilha, itens, relíquias,
   prestígio — sempre há "mais uma coisa" para melhorar.
2. **Prestígio flexível** — não é preciso chegar ao fim para reiniciar com proveito;
   quanto mais longe, mais Dobrões, mas sempre vale a pena.
3. **Identidade de classe** — Pirata e Corsário mudam nomes, visual da ilha,
   contratos disponíveis e uma árvore de melhorias inteira.
4. **Números crescem exponencialmente** (como em Trimps), com formatação
   compacta (K/M/B/T...) para manter a leitura confortável no late game.
5. **Início suave e narrativo** (desde a v0.0.2) — o jogo não abre com tudo
   disponível; você começa náufrago e vai desbloqueando cada sistema (Ilha,
   Frota, Exploração, Missões/Inventário, Prestígio) conforme cumpre um
   requisito claro e visível, nunca de forma abrupta.

---

## 2. Loop Principal

```
NÁUFRAGO (só na primeira vez de cada save):
  Catar Madeira/Destroços manualmente → Montar Acampamento (desbloqueia Ilha)
        → Catar mais → Construir 1ª Jangada (o Capitão entra na Tripulação)
        → Construir Alojamentos → Tripulação → Evoluir para Escaler → Exploração

LOOP PRINCIPAL (depois de ter a jangada):
Atribuir tripulação → Produzir recursos → Construir navios / melhorar a ilha
        ↑                                              ↓
   Recrutar mais tripulação  ←  Explorar o Mapa (combate automático por casco)
                                              ↓
                    (1ª vitória desbloqueia Missões e Inventário)
                                              ↓
                     Aceitar missões (até 3) e cumprir contratos (sempre 3)
                                              ↓
                     Encontrar itens (equipar na frota) e relíquias (permanentes)
                                              ↓
              (1ª Escuna desbloqueia Prestígio)
                        Prestígio: escolher Pirata/Corsário, ganhar Dobrões,
                        investir em 3 árvores de melhorias permanentes, recomeçar
```

---

## 3. Recursos

| Recurso | Ícone | Como se obtém | Uso principal |
|---|---|---|---|
| Ouro | 🪙 | Tripulação (Saqueadores) × Casa da Moeda | Moeda principal: navios, construções |
| Madeira | 🪵 | Tripulação (Carpinteiros) | Construção de cascos e construções |
| Rum | 🍺 | Tripulação (Destiladores) | Acelera crescimento de tripulação |
| Ferro | ⚙️ | Forja (passivo, por nível) | Navios avançados, construções |
| Pólvora | 💥 | Forja (passivo, por nível) | Navios avançados (canhões) |
| Especiarias | 🌶️ | Plantação (passivo, por nível) | Contratos, construções |
| Tecido | 🧵 | Plantação (passivo, por nível) | Contratos, construções |
| Mapas do Tesouro | 🗺️ | Drop raro em combate | Recurso de contrato/evento raro |
| Fama | ⭐ | Vitórias em combate, missões | Progressão de Patente |
| Dobrões 💰 | — | Prestígio | Moeda permanente das árvores de melhorias |

> **Nota de design:** Ferro/Pólvora/Especiarias/Tecido são produzidos
> passivamente pelas construções (Forja e Plantação), não por um cargo de
> tripulação dedicado. Isso foi uma simplificação deliberada para a Alpha
> 0.01 — ver seção 13 (Simplificações Conhecidas).

> **Limite de armazenamento (desde a v0.1.2):** Ouro, Madeira, Rum, Ferro,
> Pólvora, Tecido e Especiarias têm um teto de estoque (5.000 de base,
> ×1,15 por nível do prédio **Armazém**). Produção além do limite é
> perdida. Fama, Mapas do Tesouro e Dobrões não têm limite. A aba Ilha exibe a
> capacidade atual, o bônus do nível atual e a projeção do próximo nível.

---

## 4. Tripulação

**Progressão inicial:** ao construir a primeira Jangada, o próprio Capitão conta como
o primeiro membro da tripulação (**1 total / 1 ocioso**). A aba de Tripulação só é
liberada após o primeiro nível de Alojamentos, e o crescimento automático começa
a partir daí.

*(Reformulado na v0.0.3 — ganhou aba própria e uma camada de upgrades
recompráveis, para dar mais decisão incremental ao jogador.)*

- Tripulação total cresce automaticamente ao longo do tempo, limitada pela
  **capacidade** (base + tier do Navio Principal + Alojamentos + bônus de
  prestígio/upgrades). A velocidade de crescimento aumenta com o estoque de
  Rum.
- Tripulantes ociosos podem ser atribuídos a 4 tarefas, todas na aba
  **Tripulação**:
  - **Saqueadores** → Ouro
  - **Carpinteiros** → Madeira
  - **Destiladores** → Rum
  - **Combatentes** → poder de combate na Exploração
- Reatribuição é livre e instantânea (+1/+5 e -1/-5 por clique).
- **Melhorias de Tripulação** (recompráveis, custo crescente): Treinamento de
  Saqueadores/Carpinteiros/Destiladores (produção da respectiva tarefa),
  Rações Extras (capacidade de tripulação), Disciplina de Bordo (velocidade de
  crescimento) e Fôlego de Convés (rendimento do trabalho manual — ver
  seção 4-A).

## 4-A. Clique Ativo — desde a v0.0.3

Para quem prefere jogar ativamente em vez de só esperar os números subirem:

- **💪 Trabalhar no Convés** (aba Tripulação): cada clique dá uma pequena
  quantidade imediata de Ouro e Madeira.
- **⚔️ Reforçar Ataque** (aba Exploração): cada clique reduz o temporizador do
  combate atual, acelerando a exploração manualmente.
- Ambos escalam com a melhoria de Tripulação "Fôlego de Convés" **e** com o
  nó de Prestígio "Mãos Calejadas" (árvore Geral) — ou seja, o clique
  continua compensando cada vez mais conforme o jogador investe nisso,
  mesmo depois de vários ciclos de Prestígio, para quem quer um caminho
  ativo viável lado a lado com o idle passivo.

---

## 5. Navio Principal e Frota de Apoio

*(Reformulado na v0.0.3 — antes era uma única "frota" de vários navios
individuais; agora são dois sistemas distintos.)*

### Navio Principal (aba "Navio")

É o SEU navio, único, que evolui de tier em tier. Só ele tem **slots de
equipamento** (itens/relíquias de combate ficam aqui):

| # | Navio | Poder base | Capacidade | Slots (por tier) |
|---|---|---|---|---|
| 0 | Bote Furado | 1 | +2 | Casco |
| 1 | Escaler | 2 | +4 | + Vela |
| 2 | Chalupa | 4 | +6 | + Canhão |
| 3 | Escuna | 8 | +10 | (mesmos) |
| 4 | Brigue | 15 | +16 | + Bandeira |
| 5 | Fragata | 28 | +26 | + Proa |
| 6 | Galeão | 52 | +42 | + Amuleto |
| 7 | Navio de Linha | 95 | +68 | (mesmos) |
| 8 | Nau de Guerra | 170 | +110 | + Especial |
| 9 | Armada Lendária | 310 | +180 | (mesmos) |

- Evoluir para o próximo tier custa recursos crescentes (igual à tabela de
  custo de navio das versões anteriores), mas agora é **um upgrade só**, não
  uma compra repetida — você tem exatamente 1 Navio Principal.
- Um slot só fica **utilizável** quando DUAS condições são satisfeitas: (1) o
  tier atual do navio já desbloqueou aquele tipo de slot, e (2) você já
  explorou uma certa distância no Mapa (`SLOT_UNLOCK_DISTANCE` em `data.js`:
  Casco imediato, Vela aos 5 cascos, Canhão aos 10, Bandeira aos 18, Proa aos
  28, Amuleto aos 40, Especial aos 60). Isso garante progressão mesmo se o
  jogador conseguir subir de tier rápido cedo.
- **Papel** (único seletor, sem risco de bug de dropdown): Ataque (+25%
  poder), Produção (-25% poder) ou Exploração (leve redução de poder, mais
  chance de item).

### Frota de Apoio (aba "Frota", desbloqueada depois de explorar 12 cascos)

Embarcações **compradas em quantidade**, sem slots de equipamento próprios —
cada tipo tem uma função fixa:
- ⚔️ **Barca de Ataque** — soma poder de combate flat por unidade.
- 🏗️ **Barca de Carga** — bônus percentual à produção geral de recursos por
  unidade.
- 🧭 **Escuna de Exploração** — bônus percentual à chance de encontrar itens
  por unidade.

Custo de cada tipo escala em 1.14~1.16^(quantidade já possuída), como as
construções da ilha.

---

## 6. Ilha-Base

Cada classe tem sua própria identidade de ilha:
- 🏴‍☠️ **Pirata** → *Enseada dos Foragidos*
- ⚜️ **Corsário** → *Porto da Coroa*

A ilha começa com 3 setores desbloqueados (Alojamentos, Taverna, Casa da
Moeda/Esconderijo) e pode ser **expandida** (custo crescente em Ouro+Madeira),
liberando uma nova construção por expansão, na ordem:

1. Alojamentos / Quartéis — capacidade de tripulação
2. Taverna — Rum + crescimento de tripulação
3. Casa da Moeda / Esconderijo do Ouro — multiplica produção de Ouro
4. Forja — produz Ferro e Pólvora
5. Plantação — produz Especiarias e Tecido
6. Sede de Contratos — mais contratos simultâneos
7. Torre de Vigia — acelera exploração/combate
8. Câmara das Relíquias — bônus por relíquia possuída

Cada construção tem custo crescente por nível (`baseCost × costMult^nível`).

---

## 7. Patentes

Progressão pessoal do capitão, baseada em Fama acumulada (12 níveis, de
Grumete a Rei dos Piratas/Almirante-Mor da Coroa). Cada patente dá um bônus
percentual passivo de produção de recursos. As duas últimas patentes mudam de
nome conforme a classe escolhida.

---

## 8. Exploração e Combate — Mapa

*(Reformulado na v0.0.2 para um formato de mapa em cascos, como no Trimps —
antes era uma sequência simples de "ilhas".)*

- Cada ciclo (desde o Prestígio, ou desde a 1ª jangada) tem um **Mapa**
  numerado, dividido em **cascos** (tiles) em sequência: 10 cascos no Mapa #1,
  +2 a cada mapa seguinte (até um teto de 30).
- Cada casco é um de: 🌊 **vazio** (só uma pequena Fama, avança sozinho),
  🎁 **saque** (recursos garantidos + chance de item, sem risco de combate),
  ⚔️ **inimigo** (batalha automática) ou 💀 **chefe** (sempre o último casco
  do mapa — batalha mais dura, com chance de Relíquia).
- **Névoa de guerra:** só os cascos já percorridos e o casco atual mostram seu
  tipo verdadeiro; os futuros aparecem como "❔" até você chegar perto. A Torre
  de Vigia/Sinalização revela cascos extras à frente por nível.
- O combate é **automático**: a cada ciclo (~4s, acelerado por Torre de Vigia
  e relíquias), o poder total da frota + combatentes é comparado ao poder do
  inimigo daquele casco; a chance de vitória é `poder / (poder + inimigo)`.
- Vitória em casco de combate: recompensas de Ouro/Madeira/Fama, chance de
  Mapa (item), chance de item de equipamento, e (só no chefe) chance de
  Relíquia. A 1ª vitória da partida desbloqueia as abas Missões e Inventário,
  e também abre a possibilidade de Prestígio assim que uma Escuna for
  construída.
- Derrota num casco de combate: nenhuma penalidade além de não avançar —
  incentiva fortalecer a frota e tentar de novo, sem punir experimentação.
- Ao vencer o casco-chefe (último do mapa), um **novo mapa maior e mais
  recompensador** é gerado automaticamente, e a "distância total" percorrida
  (que escala poder inimigo e recompensas) continua acumulando — ela só volta
  a zero num Prestígio.

---

## 9. Itens, Raridade e Inventário

7 tipos de slot (Casco, Vela, Canhão, Bandeira, Proa, Amuleto, Especial) no
**Navio Principal**, cada um desbloqueado progressivamente pelo tier do navio
E por uma distância mínima explorada no mapa (ver seção 5). 6 raridades:

**Comum → Incomum → Raro → Elite → Lendário → Ultra Lendário**

cada uma com uma cor própria e um multiplicador de valor (1.0× a 6.5×).
*(Rebalanceado na v0.0.3: Comum domina bastante no início — raridades altas
saíam com frequência excessiva antes disso — e as raridades altas só se
tornam realmente comuns em distâncias grandes do mapa.)* Itens caem de
combates (mais chance em cascos-chefe) e recompensas de missão, e só sorteiam
entre os slots já desbloqueados pela distância percorrida até aquele ponto.
O Inventário lista tudo que não está equipado; o botão **Equipar** tenta
equipar direto no Navio Principal (substitui o item daquele slot se o novo
for melhor). **Sucatear** converte um item em Ouro.

---

## 10. Diário de Bordo e Narrativa

O sistema narrativo é baseado em entradas data-driven desbloqueadas por marcos de
progressão. A história é dividida em Atos e eventos menores, com suporte a
Português (Brasil) e English.

- O pop-up de um novo Ato apresenta apenas uma introdução curta.
- O jogador pode **Ler Diário** imediatamente ou escolher **Ler mais tarde**.
- O Diário de Bordo mantém as entradas desbloqueadas organizadas por Ato.
- A progressão narrativa avança no máximo um Ato por atualização, evitando saltos
  causados por vários gatilhos satisfeitos simultaneamente.

**Alpha 0.1.3.2 — principais features:** o Armazém passou a limitar o estoque de
recursos armazenáveis, enquanto o Sistema Narrativo introduziu Atos, Diário de
Bordo, entradas desbloqueáveis e pop-ups de progressão.

## 10. Relíquias

8 relíquias únicas, permanentes — **sobrevivem ao Prestígio**, diferente de
equipamento normal. Encontradas raramente ao vencer cascos-chefe. Cada uma dá
um bônus global fixo (velocidade de exploração, poder de combate, saque,
chance de item, Dobrões ganhos, crescimento de tripulação, produção geral,
ganho de Fama). A aba Prestígio mostra todas as 8 como silhuetas até serem
descobertas.

---

## 11. Missões e Contratos

*(Reformulado na v0.0.2 — antes missões eram automáticas e contratos cresciam
com prédio; agora ambos funcionam de forma mais deliberada.)*

- **Missões:** existe um **pool de até 5 missões disponíveis** para escolher,
  geradas aleatoriamente entre 6 modelos (acumular recurso, vencer N
  batalhas, recrutar N tripulantes, comprar N navios de apoio). O jogador
  **aceita** até **3 missões ativas** por vez; ao aceitar, uma nova candidata
  é gerada para repor o pool. Ao completar uma missão ativa, ela é resgatada
  manualmente (botão "Resgatar") e libera um slot para aceitar outra.
  *(Corrigido na v0.0.3: toda missão captura sua contagem de partida no
  momento em que é ACEITA — não quando é gerada — e todo progresso é sempre
  relativo a partir dali. Antes disso, missões do tipo "tenha N tripulantes"
  podiam vir prontas instantaneamente ou se repetir.)*
- **Contratos:** sempre **exatamente 3 disponíveis** ao mesmo tempo (antes a
  quantidade crescia com a Sede de Contratos — esse prédio agora aumenta a
  **recompensa** dos contratos em vez da quantidade). Existem contratos
  gerais (disponíveis para todos) e contratos exclusivos de classe (Saque
  para Piratas, Escolta/Patrulha para Corsários).
- Ambas as abas (junto com Inventário) só ficam disponíveis depois da
  **primeira vitória em combate** da partida.

---

## 11-A. Náufrago (Onboarding) — desde a v0.0.2

O jogo não começa mais com tudo disponível. A primeira experiência é:

1. Você acorda **sozinho, sem nada**, numa praia. Duas ações manuais de
   clique: **Catar Madeira** e **Catar Destroços**.
2. 4 upgrades compráveis com os próprios recursos catados, que aumentam
   quanto você ganha por clique (ex: Graveto Afiado, Machado Improvisado).
3. Ao juntar 15 Madeira + 5 Destroços: **Montar Acampamento** → desbloqueia a
   aba **Ilha**.
4. Ao juntar mais 30 Madeira + 12 Destroços: **Construir Primeira Jangada** →
   converte o que sobrou em recursos normais, cria seu primeiro navio (Bote) e
   seu primeiro tripulante (você mesmo), e desbloqueia as abas **Frota** e
   **Exploração**.
5. As abas **Missões**, **Inventário** e **Prestígio** continuam bloqueadas
   (com cadeado + tooltip explicando o requisito exato) até serem cumpridas
   naturalmente jogando (1ª vitória / 1ª Escuna).

A aba **Configurações** é a única sempre acessível, mesmo durante o náufrago,
para permitir trocar de idioma a qualquer momento.

---

## 11-B. Patente e Tooltips de Produção — desde a v0.0.2

- A patente atual aparece na barra de status como um link clicável; clicar
  abre um painel modal com a lista completa das 12 patentes, o que já foi
  alcançado (⭐) e o que falta (☆), incluindo Fama necessária e bônus de cada
  uma.
- Passar o mouse sobre qualquer recurso na barra do topo mostra um tooltip
  com a produção por segundo daquele recurso (`+X/seg`).

---


## 12. Prestígio

- Disponível a partir do momento em que o Navio Principal atinge tier 3
  (**Escuna**) — não é preciso chegar ao fim do jogo.
- Ao prestigiar, o jogador **escolhe a classe** (Pirata ou Corsário) em um
  modal dedicado. Isso pode mudar a cada ciclo.
- Ganha **Dobrões** (baseado no poder do Navio Principal + Fama acumulada).
- **Reinicia:** recursos, tripulação (+ upgrades de Tripulação), Navio
  Principal (volta ao tier 0), Frota de Apoio, ilha/construções, patente,
  inventário, mapa/distância de exploração atual. A aba Frota de Apoio volta
  a ficar bloqueada até explorar a distância necessária de novo.
- **Mantém:** Dobrões, níveis das árvores de prestígio, Relíquias, estatísticas
  históricas (total de batalhas vencidas, etc.).

### Três árvores de melhorias (compradas com Dobrões)
1. **Geral** — sempre disponível: produção global, capacidade de tripulação,
   ouro inicial, velocidade de crescimento, slot extra de contrato, e (desde
   a v0.0.3) **Mãos Calejadas** — rendimento do clique manual (Trabalhar no
   Convés / Reforçar Ataque).
2. **Pirata** 🏴‍☠️ — desbloqueada ao escolher Pirata: saque, ataque, redução de
   penalidade de reputação em porto, ouro passivo de tripulação ociosa.
3. **Corsário** ⚜️ — desbloqueada ao escolher Corsário: Dobrões, comércio
   (Especiarias/Tecido), redução de custo de construção, recompensa de
   contrato.

Pontos já investidos em uma árvore de classe **permanecem guardados** mesmo
trocando de classe no ciclo seguinte — o jogador pode ir alternando e
eventualmente ter as duas árvores de classe bem desenvolvidas.

---

## 13. Simplificações Conhecidas (atualizado na Alpha 0.0.3)

Documentado aqui de propósito, para orientar as próximas versões:

- **Ferro/Pólvora/Especiarias/Tecido** vêm de construções passivas, não de
  cargos de tripulação dedicados. Uma versão futura poderia adicionar
  "Ferreiros" e "Fazendeiros" como novos cargos.
- **Papel "Produção" do Navio Principal** ainda não tem efeito próprio de
  produção de recursos (só reduz poder de combate) — reservado para uma
  mecânica futura de comércio.
- **Penalidade de reputação em porto** (mencionada no node "Bandeira Negra") é
  só um placeholder narrativo — não existe ainda um sistema de reputação de
  porto implementado.
- **Contratos** são resolvidos instantaneamente (pagar custo → receber
  recompensa), sem temporizador de viagem/risco de falha.
- **Combate** é uma única rolagem de probabilidade por casco, sem
  visualização de "batalha" nem tipos de inimigo variados (todo inimigo de um
  casco é abstraído em um único valor de "poder").
- **Atualização em tempo real das abas Ilha/Missões/Inventário/Prestígio:**
  por design (para proteger contra os bugs de clique corrigidos na v0.0.2),
  essas abas só se redesenham quando o jogador faz uma ação nelas ou troca de
  aba — não continuamente enquanto ele olha parado para a tela. As abas
  Navio, Tripulação, Frota de Apoio e Exploração têm atualização ao vivo
  (números/mapa), assim como a barra de recursos do topo.
- A curva de custos/recompensas por distância explorada ainda usa a mesma
  fórmula exponencial das versões anteriores. As novas camadas de decisão
  (Tripulação com upgrades, slots por distância, Frota de Apoio tardia)
  ajudam a segurar o ritmo, mas o balanceamento fino de números ainda é uma
  área aberta — depende de mais playtesting real.

---

## 14. Roteiro / Próximas Versões (sugestões)

- [ ] Sistema de reputação de porto (afetado pela escolha de classe)
- [ ] Cargos de tripulação dedicados a Ferro/Pólvora/Especiarias/Tecido
- [ ] Efeitos visuais/animações de combate (não só barra de progresso)
- [ ] Mais relíquias e itens (imagens/ícones customizados em vez de emoji)
- [ ] Conquistas (achievements) com bônus pequenos
- [ ] Sons e música ambiente
- [ ] Eventos aleatórios (tempestades, motins, naufrágios) durante exploração
- [ ] Balanceamento fino de custos/produção com base em playtesting real —
      área prioritária para a próxima versão
- [ ] Estatísticas detalhadas de partida (aba própria)
- [ ] Atualização ao vivo (não só por ação) das abas Ilha/Missões/Inventário/
      Prestígio, com uma técnica de DOM diffing mais granular em vez de
      recriação completa
- [x] ~~Navio Principal separado de uma Frota de Apoio comprada em quantidade~~ — feito na v0.0.3
- [x] ~~Slots de equipamento liberados pela distância explorada~~ — feito na v0.0.3
- [x] ~~Aba de Tripulação com upgrades recompráveis~~ — feito na v0.0.3
- [x] ~~Clique manual relevante o jogo todo (upgrades + nó de Prestígio)~~ — feito na v0.0.3
- [x] ~~Corrigir bug de missões repetidas~~ — feito na v0.0.3
- [x] ~~Rebalancear chances de raridade de itens~~ — feito na v0.0.3
- [x] ~~Dicas de tutorial ao desbloquear abas~~ — feito na v0.0.3
- [x] ~~Temas visuais (claro/escuro/sépia)~~ — feito na v0.0.3
- [x] ~~Changelog acessível dentro do jogo~~ — feito na v0.0.3
- [x] ~~Seletor de idioma PT/EN~~ — feito na v0.0.2
- [x] ~~Início suave com náufrago e desbloqueio gradual de abas~~ — feito na v0.0.2
- [x] ~~Mapa de exploração com névoa de guerra~~ — feito na v0.0.2
- [x] ~~Missões por escolha + contratos fixos em 3~~ — feito na v0.0.2
- [x] ~~Painel de patente visível~~ — feito na v0.0.2
- [x] ~~Tooltip de produção por segundo~~ — feito na v0.0.2

---

## 4-B. Árvore de Melhorias, Automação, Facções e Eventos — desde a v0.0.4

*(Ver `CHANGELOG.md` para a lista completa; aqui só um resumo de referência.)*

- **Árvore de Melhorias** (aba "Melhorias", nova): substituiu as melhorias de
  tripulação recompráveis por ~20 nós de **compra única**, organizados em
  colunas por profundidade de pré-requisito. Alguns nós desbloqueiam abas
  inteiras em vez de bônus numéricos: "Contatos no Porto" → Missões +
  Inventário; "Estaleiro Aliado" → Frota de Apoio; "Ambições Imperiais" →
  Prestígio (combinado com possuir uma Escuna). **Toda a árvore reseta a cada
  Prestígio** — é o principal freio de ritmo do jogo agora.
- **Bônus permanentes/quirky:** alguns nós fogem do "+X%" padrão —
  "Registro de Rotas" (permanente, nunca reseta: cada mapa concluído aumenta
  a produção de Ouro em 0,1% para sempre), "Cracas da Sorte" (chance de
  jackpot no clique manual) e "Eco de Batalha" (chance de chefe encadeado
  com recompensa dobrada).
- **Automação:** "Contramestre Automático" atribui novos tripulantes à
  tarefa mais escassa em vez de deixá-los ociosos; "Contramestre-Chefe" além
  disso realoca aos poucos a tripulação já ocupada.
- **Facções** (Marinha, Mercadores, Piratas, Corsários, Contrabandistas):
  reputação de -100 a +100, **persiste através do Prestígio**. Muda com a
  escolha de classe, o tipo de contrato cumprido e certos eventos de mapa.
  Reputação alta com Mercadores barateia contratos; com Corsários aumenta
  Dobrões ganhos no Prestígio.
- **Eventos de Mapa:** além de vazio/inimigo/saque/chefe, cascos podem ser
  Tempestade, Ilha Abandonada, Mercador, Tripulação Amotinada, Navio Fantasma
  ou Tesouro Enterrado — cada um com um efeito próprio e curto.
- **Chefes Únicos:** o casco final de cada mapa sorteia um chefe nomeado
  (Kraken, Holandês Voador, Rainha Pirata, Capitão Fantasma, Navio da
  Companhia das Índias), cada um com uma mecânica simples própria (mais
  poder mas recompensa dobrada, poder oculto, mais fácil/difícil por classe,
  chance de relíquia dobrada, etc.).
- **Eventos Mundiais:** temporários (3 minutos), disparam aleatoriamente
  enquanto o jogo está aberto (Tempestade Global, Festival dos Piratas,
  Mares Calmos, Boom Comercial). *Limitação conhecida: só ocorrem com o jogo
  aberto — não há ainda simulação de progresso offline.*

---

## 15. Histórico de Versões

- **Alpha 0.1.2** (atual) — ver `CHANGELOG.md` para detalhes. Resumo: novo
  prédio **Armazém** limitando o estoque de 7 recursos (proteção estrutural
  contra números explodindo sem controle); automação avançada mais estável
  (só rebalanceia com desequilíbrio significativo); custo dos tiers 1-4 do
  navio aumentado mais um pouco; Registro de Rotas ganhou um 4º patamar de
  retorno bem mais baixo.

- **Alpha 0.1.0** (atual) — ver `CHANGELOG.md` para detalhes. Marco: a partir
  daqui o foco passa a ser balanceamento e estética por um tempo. Resumo:
  fonte do tema Branco corrigida (era decorativa e difícil de ler); classes
  Pirata/Corsário agora diferem em conteúdo, não só números (produção de
  Ouro vs. Dobrões, itens ofensivos vs. defensivos, evento de mercador com
  resolução própria, contratos exclusivos, perda de reputação); os 5 chefes
  únicos ganharam mecânicas de combate próprias (Kraken desacelera, Rainha
  Pirata rouba Ouro, Holandês Voador só em Evento Mundial, Capitão Fantasma
  ignora defesa).

- **Alpha 0.0.5** (atual) — ver `CHANGELOG.md` para detalhes. Resumo: rodada
  de correções (Apagar Tudo, automação travando recursos, abas aparecendo
  antes de liberadas, painel de Facções "perdido", vazamento de texto em
  inglês nas Conquistas, desbloqueio de Prestígio via nó) + curva de
  retornos decrescentes no Registro de Rotas + nova aba **Conquistas** (12
  marcos permanentes com pequenos bônus fixos).

- **Alpha 0.0.4** (atual) — ver `CHANGELOG.md` e a seção 4-B acima para
  detalhes. Resumo: Árvore de Melhorias de compra única com pré-requisitos
  (substitui upgrades recompráveis), automação de tripulação, Facções
  persistentes, Eventos de Mapa, Chefes Únicos nomeados, Eventos Mundiais
  temporários, bônus permanentes/quirky, tema Branco, e freio de ritmo geral
  (custos de navio maiores + desbloqueio de abas via compra de nós em vez de
  gatilhos automáticos).

- **Alpha 0.0.3** (atual) — ver `CHANGELOG.md` para a lista completa e
  detalhada. Resumo: Navio Principal (com itens) separado da nova Frota de
  Apoio (compra em quantidade, sem itens); slots de equipamento agora também
  exigem distância explorada; nova aba Tripulação com upgrades recompráveis;
  clique manual ativo relevante o jogo todo (Trabalhar no Convés + Reforçar
  Ataque, escaláveis por upgrades e um novo nó de Prestígio); corrigido bug
  de missões repetidas; raridade de itens rebalanceada; dicas de tutorial;
  temas visuais; changelog no próprio jogo.
- **Alpha 0.0.2** — corrigidos os bugs de clique/dropdown (arquitetura de
  render separada em completa vs. leve); idioma PT/EN selecionável com aba
  Configurações; início reformulado com náufrago + desbloqueio gradual de
  abas; painel de patente clicável; tooltips de produção por segundo; missões
  por escolha (pool + até 3 ativas); contratos fixos em 3; exploração
  reformulada em Mapa com cascos e névoa de guerra.
- **Alpha 0.01** — primeira versão jogável completa: todos os
  sistemas descritos acima implementados de ponta a ponta (recursos,
  tripulação, frota com slots, ilha com construções e expansão, patentes,
  exploração/combate automático, itens com 6 raridades, relíquias, missões,
  contratos, prestígio com escolha de classe e 3 árvores). Corrigido bug de
  bloqueio circular (Forja exigia Ferro para construir, mas era a única fonte
  de Ferro).


## Alpha 0.1.3.3 Final

- Capacidade base do Armazém: 800 recursos.
- Modo História Reduzido para diminuir a frequência de modais.
- Progresso offline baseado no timestamp do último save, limitado a 8 horas.
- Checagem centralizada de desbloqueios a cada 500 ms.
- Tooltip do Armazém com nível e capacidade atual.
