import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    const { amount, currency, contractId,  }: { amount: number, currency: string, contractId: string } = JSON.parse(req.body);
    console.log(amount, currency, contractId);

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
        success_url: `http://localhost:3000/offers/success?id=${contractId}`,
        cancel_url: `http://localhost:3000`,
    });

    // Return the url to the client
    res.status(200).json({ url: session.url });
}