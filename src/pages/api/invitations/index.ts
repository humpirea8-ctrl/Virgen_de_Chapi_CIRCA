import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || (session as any).role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })

  if (req.method === 'GET') {
    const codes = await prisma.invitationCode.findMany({ include: { role: true } })
    return res.json(codes)
  }

  if (req.method === 'POST') {
    const schema = z.object({ roleId: z.number(), singleUse: z.boolean().optional(), expiresAt: z.string().optional() })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid' })

    const { roleId, singleUse, expiresAt } = parsed.data
    // generate code: CODE-<ROLE>-YYYY-XXXX
    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (!role) return res.status(400).json({ error: 'Role not found' })
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
    const year = new Date().getFullYear()
    const codeStr = `CODE-${role.name}-${year}-${rand}`

    const created = await prisma.invitationCode.create({
      data: { code: codeStr, roleId, singleUse: !!singleUse, expiresAt: expiresAt ? new Date(expiresAt) : null }
    })

    await prisma.auditLog.create({ data: { action: 'INVITE_CREATE', meta: `code ${codeStr} by ${session?.user?.email}` } })

    return res.status(201).json(created)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
