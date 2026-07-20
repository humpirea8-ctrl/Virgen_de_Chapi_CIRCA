import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminInvitations() {
  const [codes, setCodes] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [roleId, setRoleId] = useState<number | null>(null)
  const [singleUse, setSingleUse] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCodes()
    fetchRoles()
  }, [])

  async function fetchCodes() {
    const res = await axios.get('/api/invitations')
    setCodes(res.data)
  }
  async function fetchRoles() {
    const res = await axios.get('/api/roles')
    setRoles(res.data)
  }

  async function createCode(e: any) {
    e.preventDefault()
    if (!roleId) return alert('Selecciona rol')
    setLoading(true)
    try {
      const res = await axios.post('/api/invitations', { roleId, singleUse, expiresAt: expiresAt || undefined })
      setCodes((c) => [res.data, ...c])
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error')
    }
    setLoading(false)
  }

  async function del(id: number) {
    if (!confirm('Eliminar código?')) return
    await axios.delete(`/api/invitations/${id}`)
    setCodes((c) => c.filter((x) => x.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Gestión de códigos de invitación</h1>
      <form onSubmit={createCode} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <select className="p-2 border" onChange={(e) => setRoleId(Number(e.target.value))} value={roleId ?? ''}>
          <option value="">Seleccionar rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <input type="datetime-local" className="p-2 border" onChange={(e) => setExpiresAt(e.target.value)} value={expiresAt} />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={singleUse} onChange={(e) => setSingleUse(e.target.checked)} /> Solo uso
          </label>
          <button className="ml-auto px-4 py-2 bg-primary-700 text-white rounded" disabled={loading}>
            Crear
          </button>
        </div>
      </form>

      <div className="grid gap-3">
        {codes.map((c) => (
          <div key={c.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{c.code}</div>
              <div className="text-sm text-gray-600">Rol: {c.role?.name} • Single: {c.singleUse ? 'Sí' : 'No'} • Expira: {c.expiresAt ? new Date(c.expiresAt).toLocaleString() : '—'}</div>
            </div>
            <div>
              <button className="px-3 py-1 text-red-600" onClick={() => del(c.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
