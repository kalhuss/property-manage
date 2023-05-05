import Router from "next/router";
import { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import prisma from "../../../prisma/prisma";
import { GetServerSideProps } from "next";
import { Property } from "@prisma/client";
import { User } from "@prisma/client";
import { Offer } from "@prisma/client";
import Head from "next/head";
import { useSession } from "next-auth/react";
import NavBar from "../../components/NavBar";
import { useFormik } from "formik";
import { getSession } from "next-auth/react";

// Props for the contract page
interface ContractPageProps {
    offers: Offer[];
    users: User;
    property: Property;
    acceptedOffer: Offer;
    propertyOwner: User;
}

// Contract page
const ContractPage: React.FC<ContractPageProps> = ({
    users,
    property,
    acceptedOffer,
    propertyOwner,
}) => {
    // Get the session
    const { data: session } = useSession();
    const [pdfUrl, setPdfUrl] = useState<string>("");
    const [isSigned, setIsSigned] = useState<boolean>(false);
    const [submitPressed, setSubmitPressed] = useState<boolean>(false);
    let file: string[] = [];

    const offerId = acceptedOffer.id;

    // Get the contract file from the server
    const formik = useFormik({
        initialValues: {
            userId: users.id,
            propertyId: property.id,
            file: file,
            offerId: offerId,
        },
        onSubmit: async (values) => {
            //call the createListing api
            const response = fetch("/api/uploadContract", {
                method: "POST",
                body: JSON.stringify(values),
            });

            if ((await response).ok) {
                Router.push("/offers");
            }
        },
    });

    // Generate the PDF document
    const generatePdf = async () => {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();
        const form = pdfDoc.getForm();
        const page = pdfDoc.addPage();

        // Add the signature field to the PDF document
        const textField = form.createTextField("signature");
        textField.isRequired();

        const filledTextField = form.createTextField("signed");
        filledTextField.setText(
            propertyOwner.name + " " + propertyOwner.surname
        );

        const headerText = "RESIDENTIAL LEASE AGREEMENT";
        const footerText = "Page 1 of 1";

        // Termination reasons
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
        page.drawText(
            `Property address: ${property.address}, ${property.postcode}`,
            {
                x: 100,
                y: 700,
                size: 14,
                font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                color: rgb(0, 0, 0),
            }
        );

        // Add tenant information to the PDF document
        page.drawText(`Tenant name: ${users.name} ${users.surname}`, {
            x: 100,
            y: 680,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        // Add lease terms to the PDF document
        page.drawText("TERMS", {
            x: 100,
            y: 650,
            size: 18,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            color: rgb(0, 0.53, 0.71),
        });

        // If tenure is "to rent" show rent, otherwise show price
        if (property.tenure === "To rent") {
            // Add rent amount to the PDF document
            page.drawText(`Rent amount: ${property.rent}`, {
                x: 100,
                y: 620,
                size: 14,
                font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                color: rgb(0, 0, 0),
            });
        } else {
            // Add price to the PDF document
            page.drawText(`Price: ${property.price}`, {
                x: 100,
                y: 620,
                size: 14,
                font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                color: rgb(0, 0, 0),
            });
        }

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
                color: rgb(0, 0, 0),
            });
        });

        // Add signature section to the PDF document
        page.drawText("SIGNATURES", {
            x: 100,
            y: 310,
            size: 18,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            color: rgb(0, 0.53, 0.71),
        });

        page.drawText(`Tenant signature:`, {
            x: 100,
            y: 280,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        textField.addToPage(page, { x: 220, y: 260 });

        page.drawText(`Landlord signature:`, {
            x: 100,
            y: 200,
            size: 14,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        filledTextField.addToPage(page, { x: 220, y: 180 });

        page.drawText(
            `        By signing this contract, the Tenant agrees to abide by all terms
        and conditions set forth herein. Any violation of the terms of this contract may 
        result in eviction and/or forfeiture of any security deposit. The Tenant agrees to
        keep the Property clean and well-maintained, and to promptly notify the Landlord of
        any necessary repairs. The Landlord reserves the right to make reasonable inspections 
        of the Property to ensure compliance with these terms.`,
            {
                x: 90,
                y: 150,
                size: 6,
                font: await pdfDoc.embedFont(StandardFonts.Helvetica),
                lineHeight: 10,
                color: rgb(0, 0, 0),
            }
        );

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

    // Handle the click event on the "Sign" button
    async function clickToSign() {
        setIsSigned(true);
        // Generate the PDF document
        const existingPdfBytes = await fetch(pdfUrl).then((res) =>
            res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        // Fill the signature field
        form.getTextField("signature").setText(
            users.name + " " + users.surname
        );
        form.flatten();

        // Save the PDF document
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(pdfBlob));
    }

    // Handle submit event
    async function encodePDF() {
        setSubmitPressed(true);
        // Generate the PDF document
        const existingPdfBytes = await fetch(pdfUrl).then((res) =>
            res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        let readers = [];

        // Convert the PDF document as a base64 string
        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
        const pdfString = pdfBytes.toString();
        readers.push(pdfString);

        // Use formik to set file value to pdfString
        formik.setValues({
            ...formik.values,
            file: readers,
        });
    }

    // Generate the PDF document on page load
    useEffect(() => {
        generatePdf();
    }, []);

    // Render the page
    return (
        <div className="h-screen w-full flex flex-col">
            <Head>
                <title>Contract</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
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

            {!isSigned ? (
                <button
                    onClick={clickToSign}
                    className="w-full bg-blue-500 text-white font-bold hover:bg-white hover:text-blue-500 border-2 border-blue-500"
                >
                    Click To Sign
                </button>
            ) : !submitPressed ? (
                <button
                    onClick={encodePDF}
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold hover:bg-white hover:text-blue-500 border-2 border-blue-500"
                >
                    Submit
                </button>
            ) : (
                <div className="grid grid-cols-2 text-center">
                    <form onSubmit={formik.handleSubmit}>
                        <button
                            onClick={encodePDF}
                            type="submit"
                            className="w-full bg-green-500 text-white font-bold hover:bg-white hover:text-green-500 border-2 border-green-500"
                        >
                            Confirm
                        </button>
                    </form>
                    <button
                        onClick={() => setSubmitPressed(false)}
                        className="w-full bg-red-500 text-white font-bold hover:bg-white hover:text-red-500 border-2 border-red-500"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

// Get the property and offer data from the database
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Get the session
    const session = await getSession(context);
    const id = context.params?.id;

    // Get the property and offer data from the database
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

    // Get the accepted offer data from the database
    const acceptedOffer = offers.find(
        (offer) => offer.offerStatus === "Accepted"
    );

    // Get the user data from the database
    const users = await prisma.user.findFirst({
        where: {
            id: acceptedOffer?.userId,
        },
    });

    // Get the property owner data from the database
    const propertyOwner = await prisma.user.findFirst({
        where: {
            id: property?.userId,
        },
    });

    // If the user is not logged in or is not the tenant, redirect to the homepage
    if (users?.email !== session?.user?.email) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            offers: JSON.parse(JSON.stringify(offers)),
            users: JSON.parse(JSON.stringify(users)),
            propertyOwner: JSON.parse(JSON.stringify(propertyOwner)),
            property: JSON.parse(JSON.stringify(property)),
            acceptedOffer: JSON.parse(JSON.stringify(acceptedOffer)),
        },
    };
};

export default ContractPage;
