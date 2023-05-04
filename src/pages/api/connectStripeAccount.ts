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
try{
    const {
        email,
        name,
        surname,
        phoneNumber,
        dobDay,
        dobMonth,
        dobYear,
        address,
        city,
        postcode,
        sortCode,
        accountNumber,
    }: {
        email: string;
        name: string;
        surname: string;
        phoneNumber: string;
        dobDay: string;
        dobMonth: string;
        dobYear: string;
        address: string;
        city: string;
        postcode: string;
        sortCode: string;
        accountNumber: string;
    } = JSON.parse(req.body);
    console.log("req", req.body);

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

    if (user?.bankAdded) {
        return res.status(400).json({ message: "Bank details already added" });
    }

    // Create a new stripe account for the user
    const account = await stripe.accounts.create({
        type: "custom",
        country: "GB",
        email: email,
        default_currency: "gbp",
        business_type: "individual",
        individual: {
            email: email,
            first_name: name,
            last_name: surname,
            phone: "+44" + phoneNumber,
            dob: {
                day: Number(dobDay),
                month: Number(dobMonth),
                year: Number(dobYear),
            },
            address: {
                line1: address,
                city: city,
                postal_code: postcode,
                country: "GB",
            },
        },
        business_profile: {
            mcc: "5734",
            product_description: "Property",
        },
        tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: req.socket.remoteAddress!,
        },
        external_account: {
            object: "bank_account",
            country: "GB",
            currency: "gbp",
            account_holder_name: name,
            account_holder_type: "individual",
            routing_number: sortCode,
            account_number: accountNumber,
        },
        capabilities: {
            card_payments: {
                requested: true,
            },
            transfers: {
                requested: true,
            },
        },
    })

    const accountId = account.id;

    // Create a new bank detail in the database
    const bankDetail = await prisma.bankDetails.create({
        data: {
            accountId: accountId as string,
            address: address,
            city: city,
            postcode: postcode,
            sortCode: sortCode,
            accountNumber: accountNumber,
            user: {
                connect: {
                    id: user?.id,
                },
            },
        },
    });

    // Update user to show bank details have been added
    const updatedUser = await prisma.user.update({
        where: {
            id: user?.id,
        },
        data: {
            bankAdded: true,
        },
    });

} catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create Stripe account" });
}

    // Return the bank details
    return res.status(200).json({ message: "Bank details added" }); 

}
