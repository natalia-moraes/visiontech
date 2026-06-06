/**
 * Configurações do projeto.
 *
 * SITE_URL: usada pelo QR Code da landing page.
 * - Padrão: a URL de produção na Vercel (abaixo).
 * - Para sobrescrever (ex.: outro domínio), defina a env VITE_SITE_URL
 *   no painel da Vercel, ex.: VITE_SITE_URL=https://visiontech-8b.vercel.app
 *   (lida em build time — refaça o deploy após alterar).
 */
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://visiontech-8b.vercel.app/'

/**
 * Textos da imagem de lembrança (souvenir) gerada após "Capturar foto".
 * Edite livremente — são usados pelo Canvas em src/utils/buildSouvenir.js.
 */
export const SOUVENIR = {
  fairName: 'Feira de Tecnologia 2026',
  group: 'Grupo Vision Tech',
  phrase: 'Obrigado por participar da experiência',
}

/**
 * Cloudinary (upload unsigned da lembrança → URL pública para o QR Code).
 * - cloudName: nome do cloud (dashboard do Cloudinary). Defina VITE_CLOUDINARY_CLOUD_NAME.
 * - uploadPreset: preset UNSIGNED (default: 'feira-2026').
 * Ambos são seguros para ficar no cliente (preset unsigned é feito p/ isso).
 */
export const CLOUDINARY = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? 'feira-2026',
}
