# 🕶️ VisionTech

Provador virtual de óculos para feira de tecnologia escolar. O visitante escolhe
um modelo no catálogo e o experimenta em **tempo real pela webcam**, com os
óculos posicionados sobre o rosto via **detecção facial (MediaPipe)**.

🔗 **Demo:** https://visiontech-8b.vercel.app

Construído com **React + Vite + TailwindCSS**.

## ✨ Funcionalidades

- **Landing page responsiva** (hero, "como funciona", catálogo).
- **Catálogo** com 6 modelos de óculos.
- **Provador virtual (try-on)** com webcam + **MediaPipe Face Landmarker**:
  detecta o rosto, ajusta escala/rotação pela distância entre os olhos,
  acompanha a inclinação e a perspectiva da cabeça, com suavização de
  movimento. Lentes em estilo óculos de sol (escuras, porém deixam o rosto
  visível).
- **Captura de foto** do resultado (vídeo + óculos) com **download**.
- **QR Code** na landing apontando para a URL do site (configurável).

## 🚀 Como executar

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

Outros comandos:

```bash
npm run build    # build de produção em /dist
npm run preview  # serve o build localmente
```

> O try-on pede acesso à câmera — navegadores exigem `localhost` ou HTTPS
> (o `npm run dev` e a Vercel atendem isso).

## ⚙️ Configuração

A URL apontada pelo **QR Code** vem de [`src/config.js`](src/config.js):

```js
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://visiontech-8b.vercel.app/'
```

Para usar outro domínio, defina a variável de ambiente **`VITE_SITE_URL`**
(no painel da Vercel ou em um `.env`). Ela é lida em *build time* — refaça o
deploy após alterar.

## ☁️ Deploy (Vercel)

Importe o repositório na Vercel — o preset **Vite** é detectado automaticamente
(build `npm run build`, saída `dist`). Cada push na branch `main` dispara um novo
deploy. Defina `VITE_SITE_URL` nas *Environment Variables* se quiser sobrescrever
a URL do QR Code.

## 🗂️ Estrutura do projeto

```
visiontech/
├── index.html
├── vite.config.js · tailwind.config.js · postcss.config.js
└── src/
    ├── main.jsx                # entrada: Router + GlassesProvider
    ├── App.jsx                 # layout + rotas (/ e /try-on)
    ├── config.js               # SITE_URL (QR Code) / VITE_SITE_URL
    ├── index.css               # Tailwind + estilos base
    ├── assets/                 # imagens (ver README interno)
    ├── context/
    │   └── GlassesContext.jsx  # estado global do óculos selecionado
    ├── data/
    │   └── glasses.js          # catálogo (6 modelos) + encaixe por modelo
    ├── hooks/
    │   └── useFaceLandmarker.js# carrega o MediaPipe Face Landmarker
    ├── utils/
    │   ├── glassesSvg.js        # gera a arte SVG dos óculos (overlay)
    │   └── drawGlasses.js       # posiciona/escala/rotaciona no canvas
    ├── components/
    │   ├── Button.jsx · Navbar.jsx · Hero.jsx · HowItWorks.jsx
    │   ├── Catalog.jsx · GlassesCard.jsx · Footer.jsx
    │   ├── QrCode.jsx           # QR Code reutilizável (qrcode.react)
    │   └── WebcamView.jsx       # webcam + detecção + captura
    └── pages/
        ├── Home.jsx            # "/"  (hero, como funciona, catálogo, QR)
        └── TryOn.jsx           # "/try-on" (provador virtual)
```

## 🧠 Fluxo

1. **Home (`/`)** — hero, catálogo de 6 modelos e seção com QR Code.
2. **Selecionar** — grava o modelo no `GlassesContext` e navega para `/try-on`.
3. **Try-On (`/try-on`)** — ativa a webcam, sobrepõe os óculos no rosto em tempo
   real e permite capturar/baixar a foto.

## 🧰 Stack

React 18 · Vite 5 · TailwindCSS 3 · React Router 6 ·
`@mediapipe/tasks-vision` (Face Landmarker) · `qrcode.react`.

---

Projeto fictício, criado para fins educacionais. 💙
