import prisma from "../../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { propertyId, userId, pdfUrl }: { propertyId: string, userId: string, pdfUrl: string } = JSON.parse(req.body);

    if (!propertyId || !userId || !pdfUrl) {
        return res.status(400).json({ message: "Missing fields" });
    }

}