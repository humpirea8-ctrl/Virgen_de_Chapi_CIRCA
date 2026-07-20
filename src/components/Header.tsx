import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">Escudo</div>
          <div>
            <div className="text-lg font-semibold">Virgen de Chapi CIRCA</div>
            <div className="text-xs text-gray-500">Educación, fe y servicio para transformar vidas</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/">Inicio</Link>
          <Link href="/auth/login" className="px-3 py-2 bg-primary-700 text-white rounded">Ingresar</Link>
        </nav>
      </div>
    </header>
  )
}
