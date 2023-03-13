import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../prisma/prisma";
import { compare } from "bcrypt";
import { User } from "next-auth";

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token, user }) {
            return session; // The return type will match the one returned in `useSession()`
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token; // The return type will match the one returned in `getToken()`
        },
    },

    providers: [

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials!.email,
                    },
                });

                if (!user) {
                    throw new Error("No user found");
                }

                const isValid = await compare(
                    credentials!.password,
                    user.password
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],
});
