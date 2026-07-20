import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function NewAula() {
  const [title, setTitle] = useState('')
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')
  const [color, setColor] = useState('#1E90FF')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/aulas', { title, grade, section, color, description })
      router.push(`/docente/aulas/${res.data.id}/unidades/new`)
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error al crear aula')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Crear nueva aula</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Título (ej. Matemática - 1er grado)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className="p-2 border rounded" placeholder="Grado" value={grade} onChange={(e) => setGrade(e.target.value)} />
          <input className="p-2 border rounded" placeholder="Sección" value={section} onChange={(e) => setSection(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Color identificador</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-20 h-10" />
        </div>
        <textarea className="w-full p-2 border rounded" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary-700 text-white rounded" disabled={loading}>Crear aula</button>
        </div>
      </form>
    </div>
  )
}
