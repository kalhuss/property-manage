import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const {
        userId,
        name,
        surname,
        dob,
        email,
        phoneNumber,
    }: {
        userId: string;
        name: string;
        surname: string;
        dob: string;
        email: string;
        phoneNumber: string;
    } = JSON.parse(req.body);
    console.log("req body: ", req.body);
    if (!userId) {
        return res.status(400).json({ message: "No user" });
    }

    const updateProfile = await prisma.user
        .update({
            where: {
                id: userId,
            },
            data: {
                name: name,
                surname: surname,
                dob: dob,
                email: email,
                phoneNumber: phoneNumber,
            },
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ message: "Error adding entry to database" });
        });

    res.status(200).json({ message: "Update successfull" });
}
