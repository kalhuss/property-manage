import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_APIKEY!
);

// Handler for /api/createOffer
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
        offerValue,
        mortgage,
        email,
        propertyId,
    }: {
        offerValue: string;
        mortgage: string[];
        email: string;
        propertyId: string;
    } = JSON.parse(req.body);

    // Check if user is logged in
    if (!email) {
        return res.status(400).json({ message: "No current session" });
    }

    // Get user id
    const userID = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    // Get property id
    const property = await prisma.property.findUnique({
        where: {
            propertyID: parseInt(propertyId),
        },
    });

    // Check if offer from user already exists
    const offerExists = await prisma.offer.findFirst({
        where: {
            AND: [{ userId: userID?.id }, { propertyId: property?.id }],
        },
    });

    // If offer exists, update the offer
    if (offerExists) {
        const updatedOffer = await prisma.offer.update({
            where: {
                id: offerExists.id,
            },
            data: {
                amount: offerValue,
                status: offerExists.status,
                offerStatus: offerExists.offerStatus,
                mortgageImage: await uploadImages(mortgage),
            },
        });

        // Return listing
        return res.status(400).json({ message: "Offer already exists" });
    }

    // Decide the image type
    function getImageType(image: string) {
        if (image.includes("data:image/jpeg;base64,")) {
            return "image/jpeg";
        } else if (image.includes("data:image/png;base64,")) {
            return "image/png";
        }
    }

    // Upload mortgage image to supabase
    async function uploadImages(mortgage: string[]) {
        let dataArray = [];
        for (let i = 0; i < mortgage.length; i++) {
            const mortgageImageFile = Buffer.from(
                mortgage[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(
                    `${userID?.id}/mortgages/${nanoid(10)}`,
                    mortgageImageFile,
                    { contentType: getImageType(mortgage[i]) }
                );
            if (data) {
                console.log(data.path);
                dataArray.push(data.path);
            } else if (error) {
                console.log(error);
            }
        }
        return dataArray;
    }

    // Check if property exists
    const propertyExists = await prisma.property.findUnique({
        where: { propertyID: parseInt(propertyId) },
    });

    // If property does not exist, return error
    if (!propertyExists) {
        return res.status(400).json({ message: "Property does not exist" });
    }

    // Create new offer
    try {
        const newOffer = await prisma.offer.create({
            data: {
                amount: offerValue,
                status: "Pending",
                mortgageImage: await uploadImages(mortgage),
                property: {
                    connect: {
                        propertyID: Number(propertyId),
                    },
                },
                user: {
                    connect: {
                        id: userID?.id!,
                    },
                },
            },
        });

        // Return listing
        return res.status(200).json({ newOffer });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error adding entry to database" });
    }
}

// Set body size limit to 50mb
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb",
        },
    },
};
