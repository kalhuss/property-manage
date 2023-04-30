import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    //Get the id from the request
    const { propertyId } : { propertyId: string} = JSON.parse(req.body)

    const deleteProperty = await prisma.property.delete({
        where: {
            id: propertyId
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({ message: 'Error deleting entry' })
    })

    return res.status(200).json({ deleteProperty })
}
