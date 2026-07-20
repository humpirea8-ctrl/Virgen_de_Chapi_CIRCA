import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

function ResourceItem({ r }: { r: any }) {
  return (
    <div className="p-2 border rounded">
      <div className="font-medium">{r.type}</div>
      <div className="text-sm text-gray-600"><a href={r.url} target="_blank" rel="noreferrer">Abrir recurso</a></div>
    </div>
  )
}

export default function LessonPage() {
  const router = useRouter()
  const { id, uid, lid } = router.query
  const [unidad, setUnidad] = useState<any>(null)
  const [leccion, setLeccion] = useState<any>(null)

  useEffect(() => { if (lid) fetchLesson() }, [lid])

  async function fetchLesson() {
    const res = await axios.get(`/api/aulas/${id}`)
    const aula = res.data
    const unidadId = Number(uid)
    const u = aula.units.find((x: any) => x.id === unidadId)
    setUnidad(u)
    const l = u.lessons.find((x: any) => x.id === Number(lid))
    setLeccion(l)
  }

  async function markComplete() {
    await axios.post('/api/progreso', { leccionId: Number(lid) })
    alert('Lección marcada como completada')
  }

  if (!leccion) return <div className="p-6">Cargando lección...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">{leccion.title}</h1>
      <div className="mt-4 text-gray-700">{leccion.content}</div>

      <section className="mt-6">
        <h2 className="text-lg font-medium mb-2">Recursos</h2>
        <div className="grid gap-2">
          {leccion.resources.map((r: any) => <ResourceItem key={r.id} r={r} />)}
        </div>
      </section>

      <div className="mt-6">
        <button onClick={markComplete} className="px-4 py-2 bg-primary-700 text-white rounded">Marcar como completada</button>
      </div>
    </div>
  )
}
