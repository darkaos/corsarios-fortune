# 🏴‍☠️ Corsário's Fortune — Alpha 0.01

Um jogo **idle/incremental** de piratas e corsários, inspirado em [Trimps](https://trimps.github.io/).
Recrute tripulação, construa uma frota, expanda sua ilha-base, explore os mares,
colecione relíquias lendárias e faça Prestígio para recomeçar mais forte — escolhendo
a cada ciclo se você navega como **Pirata** ou **Corsário**.

100% HTML/CSS/JS puro (sem build step, sem dependências externas de runtime).
O progresso é salvo automaticamente no navegador (`localStorage`).

## ▶️ Como jogar localmente

Não precisa de instalação. Duas opções:

1. **Abrir direto:** dê duplo clique em `index.html`.
2. **Servidor local (recomendado)**, para evitar qualquer bloqueio de `file://` no seu navegador:
   ```bash
   cd corsarios-fortune
   python3 -m http.server 8000
   # depois abra http://localhost:8000
   ```

## 🌐 Como hospedar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `corsarios-fortune`).
2. Suba estes arquivos para a branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Alpha 0.01"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/corsarios-fortune.git
   git push -u origin main
   ```
3. No repositório, vá em **Settings → Pages**.
4. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
5. Salve. Em alguns minutos o jogo estará em:
   `https://SEU_USUARIO.github.io/corsarios-fortune/`

## 📁 Estrutura do projeto

```
corsarios-fortune/
├── index.html          # estrutura da página
├── css/
│   └── style.css        # tema visual (pirata / pergaminho / latão)
├── js/
│   ├── data.js           # todo o balanceamento: navios, patentes, construções, itens, relíquias, árvores de prestígio
│   ├── app.js             # estado do jogo, regras/mecânicas, save/load, game loop
│   └── ui.js               # renderização do HTML e eventos de clique
└── GAME_DESIGN.md        # documento de game design (acompanha a evolução do projeto)
```

## 💾 Salvamento

- Salvamento automático a cada ~10 segundos no `localStorage` do navegador.
- Na aba **Prestígio** há botões para **Exportar Save** (baixa um `.json`) e **Importar Save**,
  úteis para fazer backup ou mover seu progresso entre navegadores/dispositivos.
- **Apagar Tudo** reinicia o jogo do zero (irreversível).

## 🔧 Próximos passos

Veja `GAME_DESIGN.md` → seção "Roteiro / Próximas Versões" para a lista de melhorias planejadas.
Este é um projeto vivo: peça para o Claude ajustar balanceamento, adicionar mecânicas,
melhorar a interface ou implementar qualquer item do roteiro quando quiser evoluir a Alpha.

---
*Versão atual: Alpha 0.01*
