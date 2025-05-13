reset-cik:
	pnpm exec prisma migrate reset --force && tsx prisma/seed/quiz.ts

copy-schema:
	chmod +x copy-schema.sh && \
	./copy-schema.sh

bikin-db:
	docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=eduvate --name=eduvate-db -p 5432:5432 -d postgres

masuk-db:
	docker exec -it eduvate-db psql -U postgres -d eduvate

hapus-db:
	docker rm -f eduvate-db && docker rmi -f eduvate-db
