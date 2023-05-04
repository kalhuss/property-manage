import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

// Handler for /api/updatePaid
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Get data from request body
    const { id }: { id: string } = JSON.parse(req.body);

    // Check if user is logged in
    if (!id) {
        return res.status(400).json({ message: "No contract id" });
    }

    // Update contract
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

    // Return updated contract
    res.status(200).json({ updateContract });
}
