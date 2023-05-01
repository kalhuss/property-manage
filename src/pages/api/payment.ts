import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

// Handler for /api/payment
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

    // Get data from request body
    const {
        amount,
        currency,
        contractId,
    }: { amount: number; currency: string; contractId: string } = JSON.parse(
        req.body
    );

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: "Property Purchase",
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `https://property-manage.vercel.app/offers/success?id=${contractId}`,
        cancel_url: `https://property-manage.vercel.app/offers/cancel`,
    });

    // Return the url to the client
    res.status(200).json({ url: session.url });
}
