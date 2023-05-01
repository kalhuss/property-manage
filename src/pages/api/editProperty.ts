import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_APIKEY!
);

// Handler for /api/editProperty
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
        price,
        bedrooms,
        bathrooms,
        houseType,
        address,
        postcode,
        tenure,
        taxBand,
        rent,
        keyFeatures,
        description,
        contactNumber,
        contactEmail,
        exteriorImage,
        images,
        panoramicImages,
        floorPlan,
        email,
        propertyId,
    }: {
        price: string;
        bedrooms: string;
        bathrooms: string;
        houseType: string;
        address: string;
        postcode: string;
        tenure: string;
        taxBand: string;
        rent: string;
        keyFeatures: string[];
        description: string;
        contactNumber: string;
        contactEmail: string;
        exteriorImage: string[];
        images: string[];
        panoramicImages: string[];
        floorPlan: string[];
        email: string;
        propertyId: string;
    } = JSON.parse(req.body);
    console.log("req body: ", propertyId);

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

    // Check if the property belongs to the user
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
        },
    });

    // Decide the image type
    function getImageType(image: string) {
        if (image.includes("data:image/jpeg;base64,")) {
            return "image/jpeg";
        } else if (image.includes("data:image/png;base64,")) {
            return "image/png";
        }
    }

    // Upload panoramic images to supabase
    async function uploadPanoramicImages(panoramicImages: string[]) {
        // Array to store image paths
        let dataArray = [];
        for (let i = 0; i < panoramicImages.length; i++) {
            // Convert base64 string to buffer
            const panoramicImagesFile = Buffer.from(
                panoramicImages[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            const { data, error } = await supabase.storage
                .from("property-images")
                .upload(
                    `${userID?.id}/panoramicImages/${nanoid(10)}`,
                    panoramicImagesFile,
                    { contentType: getImageType(panoramicImages[i]) }
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

    // Upload interior and exterior images to supabase
    async function uploadImages(images: string[], exteriorImage: string[]) {
        // Array to store image paths
        let dataArray = [];
        // Exterior image uploaded first
        for (let i = 0; i < exteriorImage.length; i++) {
            // Convert base64 string to buffer
            const exteriorImageFile = Buffer.from(
                exteriorImage[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            // Upload exterior images to supabase
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

        // Interior images uploaded after exterior image
        for (let i = 0; i < images.length; i++) {
            // Convert base64 string to buffer
            const imageFile = Buffer.from(
                images[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            // Upload interior images to supabase
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
        // Array to store image paths
        let dataArray = [];

        for (let i = 0; i < floorPlan.length; i++) {
            // Convert base64 string to buffer
            const imageFile = Buffer.from(
                floorPlan[i].replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            );

            // Upload floorplans to supabase
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

    // Update listing
    if (property?.userId === userID?.id) {
        const updateListing = await prisma.property
            .update({
                where: {
                    id: propertyId,
                },
                data: {
                    price: price,
                    bedrooms: bedrooms,
                    bathrooms: bathrooms,
                    houseType: houseType,
                    address: address,
                    postcode: postcode,
                    tenure: tenure,
                    taxBand: taxBand,
                    rent: rent,
                    keyFeatures: keyFeatures,
                    description: description,
                    contactNumber: contactNumber,
                    contactEmail: contactEmail,
                    images: await uploadImages(images, exteriorImage),
                    panoramicImages: await uploadPanoramicImages(
                        panoramicImages
                    ),
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
    } else {
        return res
            .status(400)
            .json({ message: "Property does not belong to user" });
    }

    // Return success message
    return res.status(200).json({ message: "Property updated" });
}

// Set body size limit to 50mb
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb", // Set desired value here
        },
    },
};
