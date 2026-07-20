import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function DocenteAulas() {
  const [aulas, setAulas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchAulas() }, [])

  async function fetchAulas() {
    setLoading(true)
    try {
      const res = await axios.get('/api/aulas')
      setAulas(res.data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Panel docente - Aulas</h1>
        <Link href="/docente/aulas/new" className="px-4 py-2 bg-primary-700 text-white rounded">Crear aula nueva</Link>
      </div>

      {loading && <div>Cargando aulas...</div>}

      <div className="grid md:grid-cols-3 gap-4">
        {aulas.map((a) => (
          <div key={a.id} className="p-4 bg-white rounded shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded" style={{ background: a.color || '#e5e7eb' }} />
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-gray-500">{a.description}</div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">Docente: {a.teacher?.name || '—'}</div>
              <div className="flex gap-2">
                <Link href={`/docente/aulas/${a.id}/edit`} className="text-primary-700">Editar</Link>
                <Link href={`/aulas/${a.id}`} className="text-primary-700">Ver aula</Link>
                <Link href={`/docente/aulas/${a.id}/unidades/new`} className="text-primary-700">Agregar unidad</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
