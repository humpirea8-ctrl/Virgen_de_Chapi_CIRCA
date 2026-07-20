import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'POST') {
    if (!session || ((session as any).role !== 'DOCENTE' && (session as any).role !== 'ADMIN')) return res.status(403).json({ error: 'Forbidden' })
    const { aulaId, title, orden, description } = req.body
    const created = await prisma.unidad.create({ data: { aulaId: Number(aulaId), title, orden: Number(orden || 1), description } })
    return res.status(201).json(created)
  }

  if (req.method === 'PUT') {
    if (!session || ((session as any).role !== 'DOCENTE' && (session as any).role !== 'ADMIN')) return res.status(403).json({ error: 'Forbidden' })
    const { id, title, orden, description } = req.body
    const updated = await prisma.unidad.update({ where: { id: Number(id) }, data: { title, orden: Number(orden), description } })
    return res.json(updated)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
