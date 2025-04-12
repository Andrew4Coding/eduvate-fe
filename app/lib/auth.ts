import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    plugins: [
        customSession(async ({ user, session }) => {
            const teacher = await prisma.teacher.findFirst({
                where: {
                    userId: user.id,
                },
                select: {
                    id: true,
                }
            });

            const student = await prisma.student.findFirst({
                where: {
                    userId: user.id,
                },
                select: {
                    id: true,
                }
            });
            const admin = await prisma.admin.findFirst({
                where: {
                    userId: user.id,
                },
                select: {
                    id: true,
                }
            });

            let role = ''
            if (teacher) {
                role = 'teacher'
            } else if (student) {
                role = 'student'
            } else if (admin) {
                role = 'admin'
            }

            return {
                user: {
                    ...user,
                    role: role,
                },
                session
            };
        })
    ]
})

