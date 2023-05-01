import prisma from "../../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Handler for /api/updateOffers
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Get data from request body
    const { offerId }: { offerId: string } = JSON.parse(req.body);

    // Check if user is logged in
    if (!offerId) {
        return res.status(400).json({ message: "No offer id" });
    }

    // Update offer status
    const updatedOffer = await prisma.offer.update({
        where: {
            id: offerId,
        },
        data: {
            offerStatus: "Accepted",
        },
    });

    const updatedProperty = await prisma.property.update({
        where: {
            id: updatedOffer.propertyId,
        },
        data: {
            sold: true,
        },
    });

    // Update the rest of the offers to be rejected
    const rejectedOffers = await prisma.offer.updateMany({
        where: {
            propertyId: updatedOffer.propertyId,
            id: {
                not: updatedOffer.id,
            },
        },
        data: {
            offerStatus: "Rejected",
        },
    });

    // Return rejectedOffers
    return res.status(200).json({ updatedOffer, updatedProperty , rejectedOffers });
}
