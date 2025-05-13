reset_cik:
	pnpm exec prisma migrate reset --force && tsx prisma/seed/quiz.ts
