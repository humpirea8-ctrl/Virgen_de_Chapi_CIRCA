import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function AulasList() {
  const [aulas, setAulas] = useState<any[]>([])

  useEffect(() => { fetchAulas() }, [])

  async function fetchAulas() {
    const res = await axios.get('/api/aulas')
    setAulas(res.data)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Aulas virtuales</h1>
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
              <Link href={`/aulas/${a.id}`} className="text-primary-700">Abrir aula</Link>
              <div className="text-sm text-gray-500">Docente: {a.teacher?.name || '—'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
