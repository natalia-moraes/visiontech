/**
 * Configurações do projeto.
 *
 * SITE_URL: usada pelo QR Code da landing page.
 * - Em dev/feira: usa localhost por padrão.
 * - Em produção (Vercel): defina a env VITE_SITE_URL no painel da Vercel,
 *   ex.: VITE_SITE_URL=https://visiontech.vercel.app
 */
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://visiontech-8b.vercel.app/'
