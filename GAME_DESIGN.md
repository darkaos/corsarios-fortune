# 📜 Corsário's Fortune — Documento de Game Design

**Versão do documento:** referente à Alpha 0.01
**Gênero:** Idle / Incremental
**Inspiração direta:** [Trimps](https://trimps.github.io/)
**Tema:** Piratas e Corsários, era de vela (séc. XVI–XVIII)
**Plataforma:** Navegador (HTML/CSS/JS puro, sem backend)

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

---

## 2. Loop Principal

```
Atribuir tripulação → Produzir recursos → Construir navios / melhorar a ilha
        ↑                                              ↓
   Recrutar mais tripulação  ←  Explorar ilhas (combate automático)
                                              ↓
                          Cumprir missões e contratos (recursos extras)
                                              ↓
                     Encontrar itens (equipar na frota) e relíquias (permanentes)
                                              ↓
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

---

## 4. Tripulação

- Tripulação total cresce automaticamente ao longo do tempo, limitada pela
  **capacidade** (base + navios da frota + Alojamentos + bônus de prestígio).
  A velocidade de crescimento aumenta com o estoque de Rum.
- Tripulantes ociosos podem ser atribuídos a 4 funções:
  - **Saqueadores** → Ouro
  - **Carpinteiros** → Madeira
  - **Destiladores** → Rum
  - **Combatentes** → poder de combate da frota (exploração)
- Reatribuição é livre e instantânea (+1/+5 e -1/-5 por clique).

---

## 5. Frota

A frota é uma coleção de navios individuais, não um único navio. Cada navio tem
**tipo** (10 níveis), **papel** (Ataque/Produção/Exploração) e **slots de
equipamento** próprios, que variam conforme o tipo:

| # | Navio | Poder base | Capacidade | Slots |
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

- Construir um navio de tipo N exige possuir ao menos 1 navio do tipo N-1
  (progressão sequencial obrigatória na primeira vez).
- O custo de cada tipo escala em **1.15^(quantidade já possuída daquele tipo)**,
  então dá para ter vários navios do mesmo tipo, cada vez mais caros.
- **Papéis:**
  - ⚔️ **Ataque** — +25% de poder de combate
  - 🏗️ **Produção** — -25% de poder de combate (uso narrativo/futuro: navio
    dedicado a logística; hoje o efeito principal já vem das construções da ilha)
  - 🧭 **Exploração** — leve redução de poder, mas aumenta a chance de achar itens

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

## 8. Exploração e Combate

- Existe uma sequência infinita de ilhas geradas proceduralmente (nomes
  cíclicos + numeração romana em voltas seguintes). A cada 5ª ilha é uma
  **Ilha Chefe** (💀), com recompensas maiores e chance de relíquia.
- O combate é **automático**: a cada ciclo (~4s, acelerado por Torre de Vigia
  e relíquias), o poder total da frota + combatentes é comparado ao poder do
  inimigo da ilha atual; a chance de vitória é `poder / (poder + inimigo)`.
- Vitória: recompensas de Ouro/Madeira/Fama, chance de Mapa, chance de item,
  e (só em ilhas chefe) chance de relíquia. Avança para a próxima ilha.
- Derrota: nenhuma penalidade além de não avançar — incentiva fortalecer a
  frota e tentar de novo, sem punir experimentação.

---

## 9. Itens, Raridade e Inventário

7 tipos de slot (Casco, Vela, Canhão, Bandeira, Proa, Amuleto, Especial), cada
um desbloqueado progressivamente pelos tipos de navio. 6 raridades:

**Comum → Incomum → Raro → Elite → Lendário → Ultra Lendário**

cada uma com uma cor própria e um multiplicador de valor (1.0× a 6.5×). Itens
caem de combates (mais chance em ilhas chefe) e recompensas de missão.
O Inventário lista tudo que não está equipado; o botão **Equipar** encontra
automaticamente o melhor navio compatível (prioriza slot vazio, senão
substitui o item mais fraco daquele slot na frota). **Sucatear** converte um
item em Ouro.

---

## 10. Relíquias

8 relíquias únicas, permanentes — **sobrevivem ao Prestígio**, diferente de
equipamento normal. Encontradas raramente ao vencer Ilhas Chefe. Cada uma dá
um bônus global fixo (velocidade de exploração, poder de combate, saque,
chance de item, Dobrões ganhos, crescimento de tripulação, produção geral,
ganho de Fama). A aba Prestígio mostra todas as 8 como silhuetas até serem
descobertas.

---

## 11. Missões e Contratos

- **Missões:** sempre 4 ativas, geradas aleatoriamente entre 6 modelos
  (acumular recurso, vencer N batalhas, atingir N tripulantes, construir N
  navios). Ao completar, resgatam recompensa (Fama, Ouro ou item) e uma nova
  missão é gerada automaticamente.
- **Contratos:** custam recursos e dão recompensas maiores/mais rápidas.
  Existem contratos gerais (disponíveis para todos) e contratos exclusivos de
  classe (Saque para Piratas, Escolta/Patrulha para Corsários). Número máximo
  de contratos simultâneos cresce com a Sede de Contratos e a árvore Geral.

---

## 12. Prestígio

- Disponível a partir do momento em que o jogador possui ao menos uma
  **Escuna** (tipo 3) — não é preciso chegar ao fim do jogo.
- Ao prestigiar, o jogador **escolhe a classe** (Pirata ou Corsário) em um
  modal dedicado. Isso pode mudar a cada ciclo.
- Ganha **Dobrões** (baseado no poder total da frota + Fama acumulada).
- **Reinicia:** recursos, tripulação, frota, ilha/construções, patente,
  inventário, ilha atual de exploração.
- **Mantém:** Dobrões, níveis das árvores de prestígio, Relíquias, estatísticas
  históricas (total de batalhas vencidas, etc.).

### Três árvores de melhorias (compradas com Dobrões)
1. **Geral** — sempre disponível: produção global, capacidade de tripulação,
   ouro inicial, velocidade de crescimento, slot extra de contrato.
2. **Pirata** 🏴‍☠️ — desbloqueada ao escolher Pirata: saque, ataque, redução de
   penalidade de reputação em porto, ouro passivo de tripulação ociosa.
3. **Corsário** ⚜️ — desbloqueada ao escolher Corsário: Dobrões, comércio
   (Especiarias/Tecido), redução de custo de construção, recompensa de
   contrato.

Pontos já investidos em uma árvore de classe **permanecem guardados** mesmo
trocando de classe no ciclo seguinte — o jogador pode ir alternando e
eventualmente ter as duas árvores de classe bem desenvolvidas.

---

## 13. Simplificações Conhecidas (Alpha 0.01)

Documentado aqui de propósito, para orientar as próximas versões:

- **Ferro/Pólvora/Especiarias/Tecido** vêm de construções passivas, não de
  cargos de tripulação dedicados. Uma v0.02 poderia adicionar "Ferreiros" e
  "Fazendeiros" como novos cargos.
- **Papel "Produção" dos navios** ainda não tem efeito próprio de produção de
  recursos (só reduz poder de combate) — reservado para uma mecânica futura de
  navios mercantes/comércio.
- **Penalidade de reputação em porto** (mencionada no node "Bandeira Negra") é
  só um placeholder narrativo — não existe ainda um sistema de reputação de
  porto implementado.
- **Equipar itens** é automático (melhor navio compatível), não há ainda uma
  UI de arrastar-e-soltar por navio individual.
- **Contratos** são resolvidos instantaneamente (pagar custo → receber
  recompensa), sem temporizador de viagem/risco de falha.
- **Combate** é uma única rolagem de probabilidade por ciclo, sem
  visualização de "batalha" nem tipos de inimigo variados (todos os inimigos
  de uma ilha são abstraídos em um único valor de "poder").
- Balanceamento é uma primeira passada — números vão precisar de ajuste fino
  conforme o jogo for jogado de verdade.

---

## 14. Roteiro / Próximas Versões (sugestões)

- [ ] UI de equipar/trocar item por navio específico (não só automático)
- [ ] Cargos de tripulação dedicados a Ferro/Pólvora/Especiarias/Tecido
- [ ] Sistema de reputação de porto (afetado pela escolha de classe)
- [ ] Efeitos visuais/animações de combate (não só barra de progresso)
- [ ] Mais relíquias e itens (imagens/ícones customizados em vez de emoji)
- [ ] Conquistas (achievements) com bônus pequenos
- [ ] Sons e música ambiente
- [ ] Eventos aleatórios (tempestades, motins, naufrágios) durante exploração
- [ ] Balanceamento fino de custos/produção com base em playtesting real
- [ ] Estatísticas detalhadas de partida (aba própria)

---

## 15. Histórico de Versões

- **Alpha 0.01** (atual) — primeira versão jogável completa: todos os
  sistemas descritos acima implementados de ponta a ponta (recursos,
  tripulação, frota com slots, ilha com construções e expansão, patentes,
  exploração/combate automático, itens com 6 raridades, relíquias, missões,
  contratos, prestígio com escolha de classe e 3 árvores). Corrigido bug de
  bloqueio circular (Forja exigia Ferro para construir, mas era a única fonte
  de Ferro).
