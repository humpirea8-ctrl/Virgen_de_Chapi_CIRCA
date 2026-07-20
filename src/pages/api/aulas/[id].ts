import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const aulaId = Number(id)
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    const aula = await prisma.aulaVirtual.findUnique({ where: { id: aulaId }, include: { units: { include: { lessons: { include: { resources: true } } } }, teacher: true } })
    if (!aula) return res.status(404).json({ error: 'Aula no encontrada' })
    return res.json(aula)
  }

  if (!session || (session as any).role !== 'DOCENTE' && (session as any).role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

  if (req.method === 'PUT') {
    const body = req.body
    const updated = await prisma.aulaVirtual.update({ where: { id: aulaId }, data: { title: body.title, description: body.description, color: body.color, imageUrl: body.imageUrl } })
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.aulaVirtual.delete({ where: { id: aulaId } })
    return res.json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
