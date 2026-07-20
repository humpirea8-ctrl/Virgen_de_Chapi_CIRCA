import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' },
          inviteCode: { label: 'Código institucional', type: 'text' }
        },
        async authorize(credentials) {
          if (!credentials) return null
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user) return null
          if (!user.passwordHash) return null
          const valid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!valid) return null
          return { id: user.id.toString(), email: user.email, name: user.name }
        }
      }),
      EmailProvider({
        server: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        },
        from: process.env.SMTP_FROM || 'no-reply@demo.local'
      })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
      async jwt({ token, user }) {
        if (user) token.role = (user as any).role || 'ESTUDIANTE'
        return token
      },
      async session({ session, token }) {
        (session as any).role = token.role
        return session
      }
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/login'
    },
    secret: process.env.NEXTAUTH_SECRET
  })
}
