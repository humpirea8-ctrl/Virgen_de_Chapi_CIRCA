import { useState } from 'react'

export default function ResourceUploader({ aulaId, unidadId, leccionId }: { aulaId?: number | string, unidadId?: number | string, leccionId?: number | string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleUpload(e: any) {
    e.preventDefault()
    if (!file) return alert('Selecciona un archivo')
    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || '50')
    if (file.size > maxMb * 1024 * 1024) return alert(`Archivo demasiado grande. Max ${maxMb} MB`)

    setUploading(true)
    try {
      // Request presigned URL from server
      const presignRes = await fetch('/api/resources/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, fileType: file.type, fileSize: file.size, leccionId })
      })
      const presign = await presignRes.json()
      if (!presignRes.ok) throw new Error(presign.error || 'Presign failed')

      // Upload directly to S3 using PUT
      const uploadUrl = presign.uploadUrl
      const putRes = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      if (!putRes.ok) throw new Error('Upload failed')

      // Register resource in our DB
      const registerRes = await fetch('/api/resources/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leccionId, key: presign.key, type: file.type, url: presign.getUrl, meta: JSON.stringify({ size: file.size, name: file.name }) })
      })
      const registered = await registerRes.json()
      if (!registerRes.ok) throw new Error(registered.error || 'Register failed')

      alert('Recurso subido y registrado correctamente')
      setFile(null)
      setProgress(100)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Error en subida')
    }

    setUploading(false)
  }

  return (
    <form onSubmit={handleUpload} className="space-y-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 bg-primary-700 text-white rounded" disabled={uploading}>Subir recurso</button>
        {uploading && <div className="text-sm text-gray-500">Subiendo... {progress}%</div>}
      </div>
    </form>
  )
}
