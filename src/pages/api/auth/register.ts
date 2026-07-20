import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  inviteCode: z.string().min(3)
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const parse = bodySchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'Datos inválidos', details: parse.error.format() })
  const { email, password, name, inviteCode } = parse.data

  // Check existing user
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(400).json({ error: 'Ya existe una cuenta con ese correo' })

  // Find invitation code
  const code = await prisma.invitationCode.findUnique({ where: { code: inviteCode }, include: { role: true } })
  if (!code) return res.status(400).json({ error: 'Código institucional inválido' })
  if (code.expiresAt && code.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: 'El código ha expirado' })

  // Create user
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, passwordHash, name, roleId: code.roleId } })

  // If single use, delete or mark
  if (code.singleUse) {
    await prisma.invitationCode.delete({ where: { id: code.id } })
  }

  // Audit log
  await prisma.auditLog.create({ data: { userId: user.id, action: 'REGISTER', meta: `register via code ${inviteCode}` } })

  return res.status(201).json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
}
