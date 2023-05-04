import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

// Handler for /api/test
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

    // Create a new Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    // Get the contract from the database
    const contract = await prisma.contract.findUnique({
        where: {
            id: id,
        },
    });

    // Get the property from the database
    const property = await prisma.property.findUnique({
        where: {
            id: contract!.propertyId,
        },
    });

    // Get the user from the database
    const user = await prisma.user.findUnique({
        where: {
            id: property!.userId,
        },
    });

    // Get the bank details from the database
    const bankDetails = await prisma.bankDetails.findFirst({
        where: {
            userId: user!.id,
        },
    });

    // Get the offer from the database
    const offer = await prisma.offer.findFirst({
        where: {
            id: contract!.offerId,
        },
    });

    // Create a transfer to the Stripe account
    try {
        const transfer = await stripe.transfers.create({
            amount: Number(offer?.amount!) * 100,
            currency: "gbp",
            destination: bankDetails?.accountId!,
        });

        res.status(200).json({ transfer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to transfer to Stripe account" });
    }
}
