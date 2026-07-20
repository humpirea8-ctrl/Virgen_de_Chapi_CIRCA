import Link from 'next/link'

export default function AdminAulaStub() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Panel docente - Aulas</h1>
      <p className="text-sm text-gray-600">Aquí los docentes podrán crear y administrar aulas, unidades y lecciones. Esta UI se complementará en próximos commits.</p>
      <div className="mt-4">
        <Link href="/aulas">Ver aulas</Link>
      </div>
    </div>
  )
}
