import { CLOUDINARY } from '../config.js'

/**
 * Envia a lembrança (dataURL) para o Cloudinary via UNSIGNED upload e devolve
 * a URL pública (secure_url). Sem backend — POST direto do navegador.
 *
 * @param {string} dataUrl  dataURL PNG da lembrança
 * @returns {Promise<string>} secure_url da imagem hospedada
 */
export async function uploadSouvenir(dataUrl) {
  const { cloudName, uploadPreset } = CLOUDINARY
  if (!cloudName) {
    throw new Error(
      'Cloudinary não configurado: defina VITE_CLOUDINARY_CLOUD_NAME.',
    )
  }

  // dataURL -> Blob
  const blob = await (await fetch(dataUrl)).blob()

  const form = new FormData()
  form.append('file', blob)
  form.append('upload_preset', uploadPreset)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form },
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Falha no upload (${res.status}). ${detail}`)
  }

  const data = await res.json()
  return data.secure_url
}
