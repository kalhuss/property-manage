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

    // Get the contract and get the property id from the contract and then get the user that listed it
    const contract = await prisma.contract.findUnique({
        where: {
            id: id,
        },
    });

    const property = await prisma.property.findUnique({
        where: {
            id: contract?.propertyId,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: property?.userId,
        },
    });

    // Get the back details from the user
    const bankDetails = await prisma.bankDetails.findFirst({
        where: {
            userId: user?.id,
        },
    });


    const accountId = bankDetails?.accountId;

    fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({ accountId}),
    });

    // Return updated contract
    res.status(200).json({ updateContract });
}
