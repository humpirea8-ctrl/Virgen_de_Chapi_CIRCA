import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'POST') {
    // mark complete
    if (!session) return res.status(403).json({ error: 'Forbidden' })
    const { leccionId } = req.body
    const userId = Number((session as any).user?.id)
    const existing = await prisma.lessonProgress.upsert({ where: { userId_leccionId: { userId, leccionId: Number(leccionId) } }, update: { completed: true, completedAt: new Date() }, create: { userId, leccionId: Number(leccionId), completed: true, completedAt: new Date() } })
    return res.json(existing)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
