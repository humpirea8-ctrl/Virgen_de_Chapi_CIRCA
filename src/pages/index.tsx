export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-inter">
      <header className="py-6 px-4 border-b bg-gradient-to-r from-celeste to-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">Escudo</div>
            <div>
              <h1 className="text-2xl font-semibold">Virgen de Chapi CIRCA</h1>
              <p className="text-sm text-gray-600">Educación, fe y servicio para transformar vidas</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a className="text-sm text-primary-900" href="#">Conócenos</a>
            <a className="text-sm text-primary-900" href="#">Noticias</a>
            <a className="btn bg-primary-700 text-white px-4 py-2 rounded" href="/auth/login">Ingresar al aula virtual</a>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Bienvenidos al Colegio Virgen de Chapi CIRCA</h2>
            <p className="mb-4 text-gray-700">Plataforma educativa institucional para estudiantes, docentes, apoderados y equipo administrativo. Accede a tus cursos, tareas, calificaciones y comunicados.</p>
            <div className="flex gap-3">
              <a className="btn bg-primary-700 text-white px-4 py-2 rounded" href="#">Conoce nuestra propuesta</a>
              <a className="btn border border-primary-700 text-primary-700 px-4 py-2 rounded" href="/auth/login">Ingresar</a>
            </div>
          </div>
          <div className="bg-gray-50 rounded shadow p-4">
            <div className="h-64 bg-gray-200 rounded">Imagen de estudiantes (placeholder)</div>
          </div>
        </div>

        <section className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Noticias y comunicados</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded shadow-sm">Comunicado demo 1</div>
            <div className="p-4 border rounded shadow-sm">Comunicado demo 2</div>
            <div className="p-4 border rounded shadow-sm">Comunicado demo 3</div>
          </div>
        </section>
      </section>

      <footer className="border-t py-6 mt-12 bg-white">
        <div className="max-w-6xl mx-auto text-sm text-gray-600">Dirección • Teléfono • Correo • Redes sociales • Políticas • Libro de reclamaciones</div>
      </footer>
    </main>
  )
}
