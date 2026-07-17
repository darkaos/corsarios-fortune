# 🏴‍☠️ Corsário's Fortune — Alpha 0.1.3.3 Final

Um jogo **idle/incremental** de piratas e corsários, inspirado em [Trimps](https://trimps.github.io/).
Você começa **náufrago, sozinho numa praia** — cata recursos à mão, monta um
acampamento, constrói sua primeira jangada e, a partir daí, recruta
tripulação, constrói uma frota, expande sua ilha-base, explora um mapa em
combate automático, coleciona relíquias lendárias e faz Prestígio para
recomeçar mais forte — escolhendo a cada ciclo se navega como **Pirata** ou
**Corsário**. Disponível em **Português (Brasil)** e **English**.

100% HTML/CSS/JS puro (sem build step, sem dependências externas de runtime).
O progresso é salvo automaticamente no navegador (`localStorage`).

> 📋 Veja o `CHANGELOG.md` para a lista detalhada do que mudou em cada versão.

## ▶️ Como jogar localmente

Não precisa de instalação. Duas opções:

1. **Abrir direto:** dê duplo clique em `index.html`.
2. **Servidor local (recomendado)**, para evitar qualquer bloqueio de `file://` no seu navegador:

```bash
   cd corsarios-fortune
   python3 -m http.server 8000
   # depois abra http://localhost:8000
   ```

## 📁 Estrutura do projeto

```
corsarios-fortune/
├── index.html        # estrutura da página
├── style.css          # tema visual (pirata / pergaminho / latão)
├── data.js             # todo o balanceamento + textos PT/EN: navios, patentes, construções, itens, relíquias, árvores de prestígio
├── app.js               # estado do jogo, regras/mecânicas, save/load, game loop
├── ui.js                  # renderização do HTML e eventos de clique
├── GAME\_DESIGN.md          # documento de game design (acompanha a evolução do projeto)
└── CHANGELOG.md             # o que mudou em cada versão
```

> ⚠️ \*\*Importante:\*\* todos os arquivos precisam ficar \*\*na mesma pasta\*\*
> (sem subpastas `css/` ou `js/`), exatamente como estão aqui. Se você baixar
> os arquivos um por um pelo chat, confira se todos caíram juntos na mesma
> pasta antes de abrir `index.html` — se `style.css`, `data.js`, `app.js` ou
> `ui.js` ficarem em outro lugar, a página abre em branco (só o título
> aparece). Se tiver dúvida, use o `.zip` do projeto: baixe, extraia tudo
> junto numa pasta, e abra o `index.html` de dentro dela.

## 💾 Salvamento

* Salvamento automático a cada \~10 segundos no `localStorage` do navegador.
* Na aba **Configurações** há botões para **Exportar Save** (baixa um `.json`),
**Importar Save** e **Apagar Tudo** — úteis para fazer backup ou mover seu
progresso entre navegadores/dispositivos.
* ⚠️ A chave de save muda a cada versão que tem mudanças estruturais grandes
(já mudou em 0.01 → 0.0.2 → 0.0.3 → 0.0.4); um save de uma versão anterior não é
carregado automaticamente pela mais nova (o jogo simplesmente começa um novo
náufrago). Use Exportar/Importar se quiser levar progresso entre versões
compatíveis.

## 🔧 Próximos passos

Veja `GAME\_DESIGN.md` → seção "Roteiro / Próximas Versões" para a lista de melhorias planejadas.
Este é um projeto vivo: peça para o Claude ajustar balanceamento, adicionar mecânicas,
melhorar a interface ou implementar qualquer item do roteiro quando quiser evoluir a Alpha.

\---

*Versão atual: Alpha 0.1.3.3*



### Alpha 0.1.3.3 Final

Versão de fechamento desta etapa da Alpha, com balanceamento do Armazém, Modo História Reduzido, progresso offline e otimização da checagem de desbloqueios.

