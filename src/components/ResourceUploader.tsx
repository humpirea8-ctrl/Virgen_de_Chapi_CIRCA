import { useState } from 'react'

export default function ResourceUploader({ aulaId, unidadId, leccionId }: { aulaId?: number | string, unidadId?: number | string, leccionId?: number | string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: any) {
    e.preventDefault()
    if (!file) return alert('Selecciona un archivo')
    setUploading(true)
    try {
      // Currently presign not configured. In future this will call /api/resources/presign
      alert('Subida no habilitada en demo. Configure S3 en variables de entorno para activar.')
    } catch (err) {
      console.error(err)
      alert('Error')
    }
    setUploading(false)
  }

  return (
    <form onSubmit={handleUpload} className="space-y-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="px-3 py-1 bg-primary-700 text-white rounded" disabled={uploading}>Subir recurso</button>
    </form>
  )
}
