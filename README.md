# Virgen de Chapi CIRCA - Plataforma educativa

Repositorio inicial con scaffold para la plataforma escolar "Virgen de Chapi CIRCA".

Contenido:
- Frontend: Next.js + TypeScript + Tailwind
- Backend: Next API routes + Prisma
- DB: PostgreSQL (Prisma)
- Auth: NextAuth (Credentials + Email/magic links prepared)
- Invitation codes por rol (registro controlado)
- Docker Compose para desarrollo local
- Seed con usuarios demo y códigos por rol

Cómo ejecutar en local (resumen):
1. Clona el repo
2. Copia .env.example a .env y ajusta DATABASE_URL
3. npm install (o pnpm/yarn)
4. npx prisma migrate dev --name init
5. npx ts-node prisma/seed.ts
6. npm run dev

Despliegue en Vercel:
- Crear proyecto en Vercel apuntando al repo
- Añadir variables de entorno según .env.example (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, SMTP_*, S3_*)
- Configurar Add-ons: Managed Postgres (Neon, Railway, Supabase) y S3 storage

Credenciales demo:
- admin@demo.local / PasswordDemo123!
- docente@demo.local / TeacherDemo123!
- estudiante@demo.local / StudentDemo123!
- apoderado@demo.local / ParentDemo123!

Próximos pasos:
- Completar UI y paneles por rol
- Implementar endpoints y validaciones adicionales
- Añadir pruebas E2E y CI

