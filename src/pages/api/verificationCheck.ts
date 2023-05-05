import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Create a new Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    const { sessionId } : { sessionId: string } = JSON.parse(req.body);

    // Get the verification session ID from the request body
    const verificationSessionId = sessionId;
    
    // Retrieve the verification session
    const verificationSession = await stripe.identity.verificationSessions.retrieve(
        verificationSessionId
    );

    console.log(verificationSession)

    // Return the verification session
    return res.status(200).json({ verificationSession });
}
