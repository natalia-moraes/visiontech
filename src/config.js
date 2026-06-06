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
