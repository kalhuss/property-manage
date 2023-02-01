import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const {
        price,
        size,
        bedrooms,
        bathrooms,
        houseType,
        address,
        tenure,
        taxBand,
        rent,
        keyFeatures,
        description,
        contactNumber,
        contactEmail,
        photos,
        floorPlan,
        emailID
    }: {
        price: string;
        size: string;
        bedrooms: string;
        bathrooms: string;
        houseType: string;
        address: string;
        tenure: string;
        taxBand: string;
        rent: string;
        keyFeatures: string;
        description: string;
        contactNumber: string;
        contactEmail: string;
        photos: string;
        floorPlan: string;
        emailID: string;
    } = JSON.parse(req.body);

    // Check if user is logged in
    if (!emailID) {
        return res.status(400).json({ message: "No current session" });
    }

    const userID = await prisma.user.findUnique({
        where: {
            email: emailID,
        },
    });


    //Check if listing already exists
    const listingExists = await prisma.property.findUnique({
        where: {
            address: address,
        },
    });
    
    if (listingExists) {
        return res.status(400).json({ message: "Listing already exists" });
    }

    // Create listing
    const listing = await prisma.property
        .create({
            data: {
                price: price,
                size: size,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                houseType: houseType,
                address: address,
                tenure: tenure,
                taxBand: taxBand,
                rent: rent,
                keyFeatures: keyFeatures,
                description: description,
                contactNumber: contactNumber,
                contactEmail: contactEmail,
                photos: photos,
                floorPlan: floorPlan,
                user: {
                    connect: {
                        id : userID?.id
                    }
                }
            },
        })
        .catch((err) => {
            return res.status(500).json({message: "Error adding entry to database"})
        });

    // Return listing
    return res.status(200).json({ listing: listing });
}
