import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { id }: { id: string } = JSON.parse(req.body);

    if (!id) {
        return res.status(400).json({ message: "No contract id" });
    }

    const updateContract = await prisma.contract
        .update({
            where: {
                id: id,
            },
            data: {
                paid: true,
            },
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ message: "Error adding entry to database" });
        });

    res.status(200).json({ message: "Payment successful" });
}
