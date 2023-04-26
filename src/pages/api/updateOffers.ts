import prisma from "../../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { offerId }: { offerId: string } = JSON.parse(req.body);

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

    return res.status(200).json({ message: "Offer updated" });
}

