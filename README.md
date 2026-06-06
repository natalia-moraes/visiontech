# 🕶️ VisionTech

Landing page de uma ótica fictícia para feira de tecnologia escolar. O
visitante escolhe um modelo de óculos no catálogo e é levado a uma página de
**try-on virtual** (experimentação com a webcam), já preparada para integração
futura com o **MediaPipe**.

Construído com **React + Vite + TailwindCSS**.

## 🚀 Como executar

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (normalmente http://localhost:5173).

Outros comandos:

```bash
npm run build     # gera a versão de produção em /dist
npm run preview   # serve o build de produção localmente
```

> A página de try-on pede acesso à câmera. Em navegadores, isso exige
> `localhost` ou HTTPS — o `npm run dev` já atende esse requisito.

## 🗂️ Estrutura do projeto

```
visiontech/
├── index.html              # HTML raiz + fontes
├── package.json            # dependências e scripts
├── vite.config.js          # configuração do Vite
├── tailwind.config.js      # tema, cores da marca e animações
├── postcss.config.js       # Tailwind + Autoprefixer
└── src/
    ├── main.jsx            # ponto de entrada: Router + Provider global
    ├── App.jsx             # layout + definição das rotas
    ├── index.css           # diretivas Tailwind e estilos base
    ├── assets/             # imagens locais (ver README interno)
    ├── context/
    │   └── GlassesContext.jsx   # Context API: óculos selecionado (estado global)
    ├── data/
    │   └── glasses.js           # dados mockados do catálogo (6 modelos)
    ├── components/         # componentes reutilizáveis
    │   ├── Button.jsx           # botão com variações (primary/secondary/ghost)
    │   ├── Navbar.jsx           # cabeçalho fixo
    │   ├── Hero.jsx             # seção hero (título, subtítulo, CTA)
    │   ├── HowItWorks.jsx       # passo a passo
    │   ├── Catalog.jsx          # grade do catálogo
    │   ├── GlassesCard.jsx      # card de cada óculos + botão "Selecionar"
    │   ├── WebcamView.jsx       # área de webcam + captura de foto
    │   └── Footer.jsx           # rodapé
    └── pages/
        ├── Home.jsx             # rota "/"  (Hero + Como funciona + Catálogo)
        └── TryOn.jsx            # rota "/try-on" (experimentação virtual)
```

## 🧠 Como funciona o fluxo

1. **Home (`/`)** — o usuário vê o hero com o botão **"Experimentar Agora"** e
   o catálogo com 6 modelos.
2. **Selecionar** — ao clicar em "Selecionar" num card, o modelo é salvo no
   **Context API** (`GlassesContext`) e o app navega para `/try-on`.
3. **Try-On (`/try-on`)** — o modelo escolhido aparece no topo; a área central
   ativa a webcam e permite **capturar uma foto** (com download).

## 🔌 Integração futura com MediaPipe

O componente [`WebcamView.jsx`](src/components/WebcamView.jsx) já expõe:

- `videoRef` — o elemento `<video>` com o stream da câmera (entrada do detector);
- `overlayRef` — um `<canvas>` sobreposto, pronto para desenhar os óculos.

Passos para conectar o **Face Mesh / Face Landmarker**:

```bash
npm install @mediapipe/tasks-vision
```

1. Crie um `FaceLandmarker` a partir do modelo.
2. Em um loop `requestAnimationFrame`, chame
   `faceLandmarker.detectForVideo(videoRef.current, timestamp)`.
3. Use os landmarks dos olhos para posicionar/escalar o PNG do óculos
   (de `src/assets`) no `overlayRef`.

A captura de foto já combina vídeo + overlay, então a imagem final sairá com os
óculos sobrepostos automaticamente.

---

Projeto fictício, criado para fins educacionais. 💙
