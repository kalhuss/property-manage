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
import { useRef } from "react";
import WebViewer from "@pdftron/webviewer";
import { useFormik } from "formik";


interface ContractPageProps {
    offers: Offer[];
    users: User;
    property: Property;
    acceptedOffer: Offer;
}

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

const ContractPage: React.FC<ContractPageProps> = ({
    users,
    property,
    acceptedOffer,
}) => {
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const { data: session, status } = useSession();
    const [isSigned, setIsSigned] = useState<boolean>(false);
    let file: string[] = [];

    const offerId = acceptedOffer.id;

    const formik = useFormik({
        initialValues: {
            userId: users.id,
            propertyId: property.id,
            file: file,
            offerId: offerId,
        },
        onSubmit: async (values) => {

            if (values.file.length === 0) {
                alert("Please upload a file");
                return;
            } 

            //call the createListing api
            fetch("/api/uploadContract", {
                method: "POST",
                body: JSON.stringify(values),
            });
            
        },
    });

    console.log(formik.values);

    const generatePdf = async () => {
        const pdfDoc = await PDFDocument.create();
        const form = pdfDoc.getForm()
        const page = pdfDoc.addPage();

        const textField = form.createTextField('signature')
        textField.isRequired()
        
        const headerText = "RESIDENTIAL LEASE AGREEMENT";
        const footerText = "Page 1 of 1";

        const terminationReasons = [
            "Failure to pay rent on time",
            "Violation of terms of the lease agreement",
            "Damage to the property",
            "Noise complaints from neighbors",
            "Illegal activities on the property",
            "Subleasing without permission",
            "Unauthorized pets on the property",
            "Excessive wear and tear on the property",
            "Violent or threatening behavior towards other tenants or neighbors",
            "Health or safety hazards on the property",
        ];

        // Add header to the PDF document
        page.drawText(headerText, {
            x: 100,
            y: 750,
            size: 24,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            color: rgb(0, 0.53, 0.71),
        });

        // Add property information to the PDF document
        page.drawText(`Property address: ${property.address}`, {
            x: 100,
            y: 700,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });


        // Add tenant information to the PDF document
        page.drawText(`Tenant name: ${users.name} ${users.surname}`, {
            x: 100,
            y: 680,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        // Add lease terms to the PDF document
        page.drawText("LEASE TERMS", {
            x: 100,
            y: 650,
            size: 18,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            color: rgb(0, 0.53, 0.71),
        });

        // Add rent amount to the PDF document
        page.drawText(`Rent amount: ${property.rent}`, {
            x: 100,
            y: 620,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        // Add termination clause to the PDF document
        page.drawText("TERMINATION", {
            x: 100,
            y: 580,
            size: 18,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            color: rgb(0, 0.53, 0.71),
        });

        // Add termination notice period to the PDF document
        page.drawText(`Termination notice period: 90 days`, {
            x: 100,
            y: 560,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        // Draw the termination reasons on the page
        page.drawText("Termination reasons:", {
            x: 100,
            y: 540,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });
        terminationReasons.forEach((reason, index) => {
            const yCoord = 520 - index * 20;
            page.drawText(`${index + 1}. ${reason}`, {
                x: 120,
                y: yCoord,
                size: 12,
                //font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                color: rgb(0, 0, 0),
            });
        });

        // Add signature section to the PDF document
        page.drawText("SIGNATURES", {
            x: 100,
            y: 200,
            size: 18,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            color: rgb(0, 0.53, 0.71),
        });

        page.drawText(`Tenant signature:`, {
            x: 100,
            y: 140,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        textField.addToPage(page, { x: 220, y: 120 })


        // Add footer to the PDF document
        page.drawText(footerText, {
            x: 450,
            y: 50,
            size: 12,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        

        // End the document and wait for the stream to finish
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(pdfBlob));
    };


    async function clickToSign(){
        setIsSigned(true);
        const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm()

        form.getTextField('signature').setText(users.name + " " + users.surname);
        form.flatten();

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(pdfBlob));
    }

    async function encodePDF() {
        const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        let readers = [];

        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
        console.log("pdfBytes ", pdfBytes);
        const pdfString = pdfBytes.toString();
        console.log("pdfString ", pdfString);
        readers.push(pdfString);

        // Use formik to set file value to pdfString
        formik.setValues({
            ...formik.values,
            file: readers,
        });
        console.log("formik ", formik.values);


    }

    useEffect(() => {
        generatePdf();
    }, []);

    return (
        <div className="h-screen w-full flex flex-col">
            <Head>
                <title>Contract</title>
            </Head>
            <NavBar isLoggedIn={!!session} />
            <main className="flex-grow flex flex-col items-center justify-center ">
                {pdfUrl ? (
                    <iframe
                        className="w-full h-full pt-24"
                        src={pdfUrl}
                        title="Contract PDF"
                    />
                ) : (
                    <p>Generating contract...</p>
                )}
            </main>
            {/* If isSigned true then show the submit button but if isSigned is false show sign button */}
            {isSigned ? (
                <form
                    className="mt-10 grid grid-cols-2 gap-y-5 gap-x-10"
                    onSubmit={formik.handleSubmit}
                >
                    <button onClick={encodePDF} type="submit">Download PDF and upload to database</button>
                </form>
            ) : (
                <button onClick={clickToSign}>Click To Sign</button>
            )}
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

    const acceptedOffer = offers.find(
        (offer) => offer.offerStatus === "Accepted"
    );

    const users = await prisma.user.findFirst({
        where: {
            id: acceptedOffer?.userId,
        },
    });

    return {
        props: {
            offers: JSON.parse(JSON.stringify(offers)),
            users: JSON.parse(JSON.stringify(users)),
            property: JSON.parse(JSON.stringify(property)),
            acceptedOffer: JSON.parse(JSON.stringify(acceptedOffer)),
        },
    };
};

export default ContractPage;
