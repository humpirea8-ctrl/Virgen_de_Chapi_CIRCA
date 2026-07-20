import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function AulaDetail() {
  const router = useRouter()
  const { id } = router.query
  const [aula, setAula] = useState<any>(null)

  useEffect(() => { if (id) fetchAula() }, [id])

  async function fetchAula() {
    const res = await axios.get(`/api/aulas/${id}`)
    setAula(res.data)
  }

  if (!aula) return <div className="p-6">Cargando...</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{aula.title}</h1>
          <div className="text-sm text-gray-500">{aula.description}</div>
        </div>
        <div className="text-sm">Docente: {aula.teacher?.name || '—'}</div>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Unidades</h2>
        {aula.units.length === 0 && <div className="p-4 border rounded">No hay unidades aún.</div>}
        <div className="grid gap-3">
          {aula.units.map((u: any) => (
            <div key={u.id} className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{u.title}</div>
                  <div className="text-sm text-gray-500">{u.description}</div>
                </div>
                <div>
                  <Link href={`/aulas/${aula.id}/unidad/${u.id}`} className="text-primary-700">Ver lecciones</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
