import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // Roles
  const adminRole = await prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN' } })
  const teacherRole = await prisma.role.upsert({ where: { name: 'DOCENTE' }, update: {}, create: { name: 'DOCENTE' } })
  const studentRole = await prisma.role.upsert({ where: { name: 'ESTUDIANTE' }, update: {}, create: { name: 'ESTUDIANTE' } })
  const parentRole = await prisma.role.upsert({ where: { name: 'APODERADO' }, update: {}, create: { name: 'APODERADO' } })

  // Users
  const adminPass = await bcrypt.hash('PasswordDemo123!', 10)
  const teacherPass = await bcrypt.hash('TeacherDemo123!', 10)
  const studentPass = await bcrypt.hash('StudentDemo123!', 10)
  const parentPass = await bcrypt.hash('ParentDemo123!', 10)

  await prisma.user.upsert({
    where: { email: 'admin@demo.local' },
    update: {},
    create: { email: 'admin@demo.local', passwordHash: adminPass, name: 'Admin Demo', roleId: adminRole.id }
  })

  await prisma.user.upsert({
    where: { email: 'docente@demo.local' },
    update: {},
    create: { email: 'docente@demo.local', passwordHash: teacherPass, name: 'Docente Demo', roleId: teacherRole.id }
  })

  await prisma.user.upsert({
    where: { email: 'estudiante@demo.local' },
    update: {},
    create: { email: 'estudiante@demo.local', passwordHash: studentPass, name: 'Estudiante Demo', roleId: studentRole.id }
  })

  await prisma.user.upsert({
    where: { email: 'apoderado@demo.local' },
    update: {},
    create: { email: 'apoderado@demo.local', passwordHash: parentPass, name: 'Apoderado Demo', roleId: parentRole.id }
  })

  // Invitation codes by role
  await prisma.invitationCode.upsert({
    where: { code: 'CODE-ESTUDIANTE-2026' },
    update: {},
    create: { code: 'CODE-ESTUDIANTE-2026', roleId: studentRole.id, singleUse: false }
  })
  await prisma.invitationCode.upsert({
    where: { code: 'CODE-DOCENTE-2026' },
    update: {},
    create: { code: 'CODE-DOCENTE-2026', roleId: teacherRole.id, singleUse: false }
  })
  await prisma.invitationCode.upsert({
    where: { code: 'CODE-APODERADO-2026' },
    update: {},
    create: { code: 'CODE-APODERADO-2026', roleId: parentRole.id, singleUse: false }
  })

  console.log('Seeding finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
