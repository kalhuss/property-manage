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

    const { id }: { id: string } = JSON.parse(req.body);

    // Create a new Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    // Get the accountId from the bankDetails database -> First you must get the propertyId from the id -> then get the user that owns the property -> then get the bank details from the user
    const offer = await prisma.offer.findUnique({
        where: {
            id: id,
        },
    });

    const property = await prisma.property.findUnique({
        where: {
            id: offer!.propertyId,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: property!.userId,
        },
    });

    const bankDetails = await prisma.bankDetails.findUnique({
        where: {
            id: user!.id,
        },
    });


    try {
        const transfer = await stripe.transfers.create({
            amount: 1000,
            currency: "gbp",
            destination: bankDetails?.accountId!,
        });

        res.status(200).json({ transfer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to transfer to Stripe account" });
    }
}

// On the profile page the user will need to implement their bank details
// and once they have done this the details will be stored in a bank detail database
// The user can only create new listings as long as they have bank details
// One the contract is paid for the money goes to my stripe account and then automatically transfered to the users account
