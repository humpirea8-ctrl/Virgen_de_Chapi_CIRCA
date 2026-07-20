import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function EditAula() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [aula, setAula] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('#1E90FF')
  const [description, setDescription] = useState('')

  useEffect(() => { if (id) loadAula() }, [id])

  async function loadAula() {
    const res = await axios.get(`/api/aulas/${id}`)
    setAula(res.data)
    setTitle(res.data.title)
    setColor(res.data.color || '#1E90FF')
    setDescription(res.data.description || '')
  }

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`/api/aulas/${id}`, { title, color, description })
      alert('Aula actualizada')
      router.push('/docente/aulas')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error')
    }
    setLoading(false)
  }

  if (!aula) return <div className="p-6">Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Editar aula</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <textarea className="w-full p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary-700 text-white rounded" disabled={loading}>Guardar</button>
        </div>
      </form>
    </div>
  )
}
