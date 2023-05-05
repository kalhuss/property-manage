import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getSession } from "next-auth/react";
import prisma from "../../../prisma/prisma";

// Handler for /api/verificationCheck
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Create a new Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    const { email }: { email: string } = JSON.parse(req.body);

    // Get user from database
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    // Set verified to true
    await prisma.user.update({
        where: {
            id: user?.id,
        },
        data: {
            verified: true,
        },
    });

    return res.status(200).json({ message: "User verified" });
}
