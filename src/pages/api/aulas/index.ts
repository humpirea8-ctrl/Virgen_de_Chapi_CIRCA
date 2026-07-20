import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    // If student, return aulas they are enrolled in (simple demo: return all)
    const aulas = await prisma.aulaVirtual.findMany({ include: { teacher: true, units: true } })
    return res.json(aulas)
  }

  if (!session || (session as any).role !== 'DOCENTE' && (session as any).role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

  if (req.method === 'POST') {
    const body = req.body
    const created = await prisma.aulaVirtual.create({ data: { title: body.title, grade: body.grade, section: body.section, teacherId: (session as any).user?.id ? Number((session as any).user.id) : undefined, color: body.color, description: body.description } })
    return res.status(201).json(created)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
