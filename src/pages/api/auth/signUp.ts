import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/prisma";
import bcrypt from "bcrypt";

// Number of rounds to use when generating salt
const saltRounds = 10;

// Handler for /api/auth/signUp
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Get data from request body
    const {
        name,
        surname,
        dob,
        phoneNumber,
        email,
        password,
    }: {
        name: string;
        surname: string;
        dob: string;
        phoneNumber: string;
        email: string;
        password: string;
    } = JSON.parse(req.body);

    //Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    // If user exists, return error
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user
        .create({
            data: {
                name: name,
                surname: surname,
                dob: dob,
                phoneNumber: phoneNumber,
                email: email,
                password: hashedPassword,
            },
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ message: "Error adding entry to database" });
        });

    // Return user
    return res.status(200).json({ user: user });
}
