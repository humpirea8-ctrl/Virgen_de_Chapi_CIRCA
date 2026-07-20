import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function NewUnidad() {
  const router = useRouter()
  const { id } = router.query // aula id
  const [title, setTitle] = useState('')
  const [orden, setOrden] = useState(1)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/unidades', { aulaId: Number(id), title, orden, description })
      router.push(`/aulas/${id}`)
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Agregar unidad</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Orden" type="number" value={orden} onChange={(e) => setOrden(Number(e.target.value))} />
        <textarea className="w-full p-2 border rounded" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="px-4 py-2 bg-primary-700 text-white rounded" disabled={loading}>Crear unidad</button>
      </form>
    </div>
  )
}
