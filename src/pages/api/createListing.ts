import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";
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
        images,
        floorPlan,
        email,
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
        images: string[];
        floorPlan: string;
        email: string;
    } = JSON.parse(req.body);

    // Check if user is logged in
    if (!email) {
        return res.status(400).json({ message: "No current session" });
    }
    //TODO: Check if user is logged in

    // Get user id
    const userID = await prisma.user.findUnique({
        where: {
            email: email,
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

    async function uploadImages(images: string[]){
        let dataArray = [];
        for(let i = 0; i < images.length; i++){
            let imageType = "";
            if (images[i].includes("data:image/jpg;base64,")) {
                imageType = "image/jpg";
            }
            else if (images[i].includes("data:image/png;base64,")) {
                imageType = "image/png";
            }

            const imageFile = Buffer.from(images[i].replace(/^data:image\/\w+;base64,/, ""), "base64");
            const filePath = `${userID?.id}/images/${nanoid(10)}`
            console.log(filePath);
            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(filePath, imageFile, { contentType: imageType });
            if(data){
                console.log(data.path);
                dataArray.push(data.path);

            } else if(error){
                console.log(error);
            }
        }
        return dataArray;
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
                images: await uploadImages(images),
                floorPlan: floorPlan,
                user: {
                    connect: {
                        id: userID?.id,
                    },
                },
            },
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ message: "Error adding entry to database" });
        });

    // Return listing
    return res.status(200).json({ listing: listing });

}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb' // Set desired value here
        }
    }
}