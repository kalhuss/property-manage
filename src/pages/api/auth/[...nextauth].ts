import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../prisma/prisma";
import { compare } from "bcrypt";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials!.email,
                    },
                });

                if (!user) {
                    throw new Error("No user found");
                }

                const isValid = await compare(credentials!.password, user.password);

                if (!isValid) {
                    return Promise.resolve(null);
                }

                return Promise.resolve(user);
            },
        }),
    ],
});
