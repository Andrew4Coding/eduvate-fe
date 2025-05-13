reset-cik:
	pnpm exec prisma migrate reset --force && tsx prisma/seed/quiz.ts

copy-schema:
	chmod +x copy-schema.sh && \
	./copy-schema.sh
