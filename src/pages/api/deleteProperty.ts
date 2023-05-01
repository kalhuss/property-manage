import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

// Handler for /api/deleteProperty
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Get data from request body
    const { propertyId }: { propertyId: string } = JSON.parse(req.body);

    // Delete the property
    const deleteProperty = await prisma.property
        .delete({
            where: {
                id: propertyId,
            },
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error deleting entry" });
        });

    // Return the deleted property
    return res.status(200).json({ deleteProperty });
}
