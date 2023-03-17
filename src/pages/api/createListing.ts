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
        exteriorImage,
        images,
        floorPlan,
        email,
    }: {
        price: string;
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
        exteriorImage: string[];
        images: string[];
        floorPlan: string[];
        email: string;
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

    //Check if listing already exists
    const listingExists = await prisma.property.findUnique({
        where: {
            address: address,
        },
    });

    if (listingExists) {
        return res.status(400).json({ message: "Listing already exists" });
    }

    // Decide the image type
    function getImageType(image: string) {
        if (image.includes("data:image/jpeg;base64,")) {
            return "image/jpeg";
        } else if (image.includes("data:image/png;base64,")) {
            return "image/png";
        }
    }

    // Upload exterior image to supabase
    async function uploadExteriorImage(exteriorImage: string[]) {
        let dataArray = [];
        for (let i = 0; i < images.length; i++) {
            const exteriorImageFile = Buffer.from(
                images[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(
                    `${userID?.id}/exteriorImage/${nanoid(10)}`,
                    exteriorImageFile,
                    { contentType: getImageType(exteriorImage[i]) }
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

    async function uploadImages(images: string[], exteriorImage: string[]) {
        let dataArray = [];
        // Upload exterior image first so that it will always be the first image in the array and then upload the rest of the images from images array
        for (let i = 0; i < exteriorImage.length; i++) {
            const exteriorImageFile = Buffer.from(
                exteriorImage[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(
                    `${userID?.id}/images/${nanoid(10)}`,
                    exteriorImageFile,
                    { contentType: getImageType(exteriorImage[i]) }
                );
            if (data) {
                console.log(data.path);
                dataArray.push(data.path);
            } else if (error) {
                console.log(error);
            }
        }
        for (let i = 0; i < images.length; i++) {
            const imageFile = Buffer.from(
                images[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(`${userID?.id}/images/${nanoid(10)}`, imageFile, {
                    contentType: getImageType(images[i]),
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

    // Upload floorplans to supabase
    async function uploadFloorPlan(floorPlan: string[]) {
        let dataArray = [];
        for (let i = 0; i < floorPlan.length; i++) {
            const imageFile = Buffer.from(
                floorPlan[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(`${userID?.id}/floorplans/${nanoid(10)}`, imageFile, {
                    contentType: getImageType(floorPlan[i]),
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

    // Create listing
    const listing = await prisma.property
        .create({
            data: {
                price: price,
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
                images: await uploadImages(images, exteriorImage),
                floorPlan: await uploadFloorPlan(floorPlan),
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
            sizeLimit: "50mb", // Set desired value here
        },
    },
};
