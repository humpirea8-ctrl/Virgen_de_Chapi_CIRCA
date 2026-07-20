import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || (session as any).role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

  const { id } = req.query
  const codeId = Number(id)
  if (req.method === 'DELETE') {
    await prisma.invitationCode.delete({ where: { id: codeId } })
    await prisma.auditLog.create({ data: { action: 'INVITE_DELETE', meta: `id ${codeId} by ${session?.user?.email}` } })
    return res.json({ ok: true })
  }
  if (req.method === 'PATCH') {
    const body = req.body
    const update: any = {}
    if (body.expiresAt) update.expiresAt = new Date(body.expiresAt)
    if (typeof body.singleUse === 'boolean') update.singleUse = body.singleUse
    const updated = await prisma.invitationCode.update({ where: { id: codeId }, data: update })
    await prisma.auditLog.create({ data: { action: 'INVITE_UPDATE', meta: `id ${codeId} by ${session?.user?.email}` } })
    return res.json(updated)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
