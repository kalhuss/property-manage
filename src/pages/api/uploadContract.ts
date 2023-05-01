import prisma from "../../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_APIKEY!
);

// Handler for /api/uploadContract
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Get data from request body
    const {
        propertyId,
        userId,
        file,
        offerId,
    }: {
        propertyId: string;
        userId: string;
        file: string[];
        offerId: string;
    } = JSON.parse(req.body);

    // Check if user is logged in
    if (!userId) {
        return res.status(400).json({ message: "No current session" });
    }

    // Upload the file to supabase storage
    async function uploadFile(file: string[]) {
        // Array to store image paths
        let dataArray = [];

        for (let i = 0; i < file.length; i++) {
            // Convert base64 string to buffer
            const base64Data = Buffer.from(
                file[i].replace(/^data:application\/\w+;base64,/, ""),
                "base64"
            );

            // Upload the file to supabase storage
            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(`${userId}/contracts/${nanoid(10)}`, base64Data, {
                    contentType: "application/pdf",
                });
            if (data) {
                console.log(data.path);
                dataArray.push(data.path);
            } else if (error) {
                console.log(error);
            }
        }
        return dataArray;
    }

    // Create a new contract
    const contract = await prisma.contract
        .create({
            data: {
                propertyId,
                userId,
                contractPDF: await uploadFile(file),
                paid: false,
            },
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ message: "Error adding entry to database" });
        });

    // Update the offer signed status
    const updateOffer = await prisma.offer
        .update({
            where: {
                id: offerId,
            },
            data: {
                signed: true,
            },
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ message: "Error updating offer status" });
        });

    // Return the contract and updated offer
    return res.status(200).json({ contract: contract, signed: updateOffer });
}
