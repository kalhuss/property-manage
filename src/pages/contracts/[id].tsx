import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import handlebars from "handlebars";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import prisma from "../../../prisma/prisma";
import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import { User } from "@prisma/client";
import { Offer } from "@prisma/client";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";
import NavBar from "../../components/NavBar";
import blobStream from "blob-stream";

interface ContractPageProps {
    offers: Offer[];
    users: User;
    property: Property;
}

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

const ContractPage: React.FC<ContractPageProps> = ({
    offers,
    users,
    property,
}) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        const generatePdf = async () => {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();

            // Add content to the PDF document here
            page.drawText("Contract", {
                x: 100,
                y: 750,
                size: 24,
                font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
                color: rgb(0, 0.53, 0.71),
            });
            page.drawText(`Property address: ${property.address}`, {
                x: 100,
                y: 700,
                size: 16,
                font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                color: rgb(0, 0.53, 0.71),
            });
            page.drawText(`Tenant name: ${users.name}`, {
                x: 100,
                y: 650,
                size: 16,
                font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                color: rgb(0, 0.53, 0.71),
            });

            // End the document and wait for the stream to finish
            const pdfBytes = await pdfDoc.save();
            const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
            setPdfUrl(URL.createObjectURL(pdfBlob));
        };
        generatePdf();
    }, [offers, property, users]);

    return (
        <div className="h-screen w-full flex flex-col">
            <Head>
                <title>Contract</title>
            </Head>
            <NavBar isLoggedIn={!!session} />
            <main className="flex-grow flex flex-col items-center justify-center ">
                {pdfUrl ? (
                    <iframe
                        className="w-full h-full pt-20"
                        src={pdfUrl}
                        title="Contract PDF"
                    />
                ) : (
                    <p>Generating contract...</p>
                )}
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id;

    const property = await prisma.property.findFirst({
        where: {
            id: id?.toString(),
        },
    });

    const offers = await prisma.offer.findMany({
        where: {
            propertyId: property?.id,
        },
    });

    // Get the user who made the offer
    const users = await Promise.all(
        offers.map(async (offer) => {
            const user = await prisma.user.findFirst({
                where: {
                    id: offer.userId,
                },
            });
            return user;
        })
    );

    return {
        props: {
            offers: JSON.parse(JSON.stringify(offers)),
            users: JSON.parse(JSON.stringify(users)),
            property: JSON.parse(JSON.stringify(property)),
        },
    };
};

export default ContractPage;
