import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getSession } from "next-auth/react";
import prisma from "../../../prisma/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Create a new Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    // Retrieve the verification session ID from the query string
    const { id } = req.query;
    console.log(id);

    // Retrieve the verification session
    const verificationSession =
        await stripe.identity.verificationSessions.retrieve(id as string);

    console.log(verificationSession);

    if(verificationSession.status === "verified") {
        console.log("verified");
    }
    else {
        console.log("pending");
    }
    

    // Return the verification session
    return res.status(200).json({ verificationSession });
}
