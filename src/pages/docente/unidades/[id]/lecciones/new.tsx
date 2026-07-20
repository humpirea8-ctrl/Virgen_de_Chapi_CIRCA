import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function NewLeccion() {
  const router = useRouter()
  const { id, uid } = router.query // ruta: /docente/unidades/[id]/lecciones/new or similar. We'll expect unidadId as id param.
  const unidadId = id || null
  const [title, setTitle] = useState('')
  const [orden, setOrden] = useState(1)
  const [content, setContent] = useState('')
  const [blocked, setBlocked] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/lecciones', { unidadId: Number(unidadId), title, orden, content, blocked })
      // redirect back to aula view if query contains aula id
      if (typeof uid === 'string') router.push(`/aulas/${uid}`)
      else router.push('/docente/aulas')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Agregar lección</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Orden" type="number" value={orden} onChange={(e) => setOrden(Number(e.target.value))} />
        <textarea className="w-full p-2 border rounded" placeholder="Contenido breve" value={content} onChange={(e) => setContent(e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={blocked} onChange={(e) => setBlocked(e.target.checked)} /> Bloqueada (requiere completar previas)</label>
        <button className="px-4 py-2 bg-primary-700 text-white rounded" disabled={loading}>Crear lección</button>
      </form>
    </div>
  )
}
