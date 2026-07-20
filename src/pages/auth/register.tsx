import { useState } from 'react'
import axios from 'axios'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/register', { email, password, name, inviteCode })
      alert('Cuenta creada. Por favor inicia sesión.')
      window.location.href = '/auth/login'
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Registro - Ingreso con código institucional</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Correo institucional" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Código institucional" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
          <button className="w-full py-2 bg-primary-700 text-white rounded" disabled={loading} type="submit">
            Registrarme
          </button>
        </form>
        <div className="text-sm text-gray-500 mt-3">Si ya tienes cuenta, <a href="/auth/login" className="text-primary-700">ingresa aquí</a>.</div>
      </div>
    </div>
  )
}
