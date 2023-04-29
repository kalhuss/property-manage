import prisma from "../../../prisma/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import stream from "stream";
import { promisify } from "util";

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

    const { propertyId }: { propertyId: string } = JSON.parse(req.body);

    // Get the contract id from the property id
    const contractId = await prisma.contract.findFirst({
        where: {
            propertyId: propertyId,
        },
    });

    // Get the property address
    const propertyAddress = await prisma.property.findFirst({
        where: {
            id: propertyId,
        },
        select: {
            address: true,
        },
    });


      































    // Download the file from supabase storage
    // async function downloadFile() {
    //     const { data, error } = await supabase.storage
    //         .from("property-images")
    //         .download(`${contractId?.mortgageImage}`);

    //     if (data) {
    //         return data;
    //     } else if (error) {
    //         console.log(error);
    //     }
    // }

    // console.log("contractId?.mortgageImage ", contractId?.mortgageImage);

    // const file = await downloadFile();
    // console.log("file ", file);
    // const buffer = await file!.arrayBuffer();
    // console.log("buffer ", buffer);
    // // Set response headers for PDF content
    // res.setHeader("Content-Type", "application/pdf");
    // // res.setHeader("Content-Disposition", `attachment; filename="${contractId?.mortgageImage}"`);
    // res.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encodeURIComponent(contractId?.mortgageImage[0]!));


    // // Write the file to the response as a stream
    // res.write(Buffer.from(buffer));
    // res.end();


    // async function download(url: string, name: string) {
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = name;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }

    // download(`${contractId?.mortgageImage}`, `${propertyAddress?.address}.pdf`);

}
