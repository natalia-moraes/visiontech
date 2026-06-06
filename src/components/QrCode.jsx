import { QRCodeSVG } from 'qrcode.react'
import { SITE_URL } from '../config.js'

/**
 * QR Code reutilizável (render em SVG, nítido em qualquer tamanho).
 *
 * @param {string} url   URL apontada pelo QR (default: SITE_URL de config.js)
 * @param {number} size  tamanho em px (default: 180)
 */
export default function QrCode({ url = SITE_URL, size = 180 }) {
  return (
    <div className="inline-flex rounded-2xl bg-white p-3 shadow-lg shadow-black/30">
      <QRCodeSVG value={url} size={size} level="M" />
    </div>
  )
}
