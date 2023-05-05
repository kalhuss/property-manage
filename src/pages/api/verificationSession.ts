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

    // Create a new Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    try {

        const { email } : { email: string } = JSON.parse(req.body);

        // Check if user is logged in
        if (!email) {
            return res.status(400).json({ message: "No current session" });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // Get bank account details from database
        const account = await prisma.bankDetails.findFirst({
            where: {
                userId: user?.id,
            },
        });


        const verificationSession = await stripe.identity.verificationSessions.create({
            type: "document",
            metadata: {
                user_id: account?.accountId!,
            },
            return_url: "https://property-manage.vercel.app/verified", // Replace with your actual return URL
        });

        return res.status(200).json({ verificationURL: verificationSession.url, verificationSessionId: verificationSession.id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}