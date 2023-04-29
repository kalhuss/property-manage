import prisma from "../../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_APIKEY!
);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Get the request body values
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
        let dataArray = [];
        for (let i = 0; i < file.length; i++) {
            const base64Data = Buffer.from(
                file[i].replace(/^data:application\/\w+;base64,/, ""),
                "base64"
            );

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

    return res.status(200).json({ contract: contract, signed: updateOffer });
}
