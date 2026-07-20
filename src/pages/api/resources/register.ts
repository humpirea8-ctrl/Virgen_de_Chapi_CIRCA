import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).json({ error: 'Forbidden' })

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { leccionId, key, type, url, meta, visibility } = req.body
  if (!leccionId || !key || !type || !url) return res.status(400).json({ error: 'Missing fields' })

  try {
    const created = await prisma.recurso.create({ data: { leccionId: Number(leccionId), type, url, meta: meta || '', visibility: visibility || 'PRIVATE' } })
    return res.status(201).json(created)
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: 'Could not register resource' })
  }
}
