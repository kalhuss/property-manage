import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import prisma from "../../../../prisma/prisma";
import Head from "next/head";
import { useSession } from "next-auth/react";
import NavBar from "../../../components/NavBar";
import { useState } from "react";
import Background from "@/components/Backgrounds";
import { useFormik } from "formik";
import Router from "next/router";
import { ChangeEvent } from "react";
import FileUpload from "../../../components/FileUpload";

// Props for the check offers page
interface OfferPageProps {
    property: Property;
    offerValue: string;
}

//
const Offer: NextPage<OfferPageProps> = ({ property, offerValue }) => {
    // Get the session
    const { data: session } = useSession();
    const [value, setOfferValue] = useState(offerValue);
    let mortgageImage: string[] = [];

    // Set up formik
    const formik = useFormik({
        initialValues: {
            offerValue: value,
            mortgage: mortgageImage,
            email: session?.user?.email,
            propertyId: property.propertyID,
        },
        onSubmit: async (values) => {
            // Call the createOffer API
            fetch("/api/createOffer", {
                method: "POST",
                body: JSON.stringify(values),
            });
            // Redirect to the property page
            Router.push(
                "/properties/[propertyID]",
                `/properties/${property.propertyID}`
            );
        },
    });

    // Read the file as text and return a promise
    function readFileAsText(file: File) {
        // Return a Promise that resolves when the file is read
        return new Promise(function (resolve, reject) {
            let fr = new FileReader();

            fr.onload = function () {
                resolve(fr.result);
            };

            fr.onerror = function () {
                reject(fr);
            };

            fr.readAsDataURL(file);
        });
    }

    // Encode the image as a base64 string
    async function encodeImage(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(readFileAsText(files[i]));
        }

        // Trigger Promises
        Promise.all(readers).then((mortgageImage) => {
            // Values will be an array that contains an item
            // with the text of every selected file
            // ["File1 Content", "File2 Content" ... "FileN Content"]
            formik.setValues((values) => ({
                ...values,
                mortgage: mortgageImage as string[],
            }));
        });
    }

    // Render the check offers page
    return (
        <div>
            <Head>
                <title>{property.address}</title>
                <meta name="description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Background />
            <NavBar isLoggedIn={!!session} />

            <div className="w-full items-center justify-center flex flex-col pt-24">
                <div className="mt-5 p-5 w-3/6 bg-white rounded-lg shadow-lg flex flex-col">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold text-center">
                            Make an offer
                        </h1>
                        <section className="w-3/4 mx-auto flex flex-col">
                            <form
                                className="mt-10 mx-auto"
                                onSubmit={formik.handleSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="offer-value"
                                        className="mb-2 mr-5"
                                    >
                                        Offer Value (£)
                                    </label>
                                    <input
                                        type="text"
                                        id="offer-value"
                                        name="offer-value"
                                        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                                        defaultValue={offerValue}
                                        onChange={(e) =>
                                            setOfferValue(e.target.value)
                                        }
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                <FileUpload
                                    labelName="Mortgage Upload"
                                    onChange={encodeImage}
                                />

                                <button
                                    className="p-4 w-full mt-4 border-blue-500 border-2 text-blue-500 hover:border-white hover:text-white hover:bg-blue-500 rounded-lg"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Get the property data from the database
export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.propertyID;
    const offerValue = context.query.offerValue;

    // Get the property from the database
    const property = await prisma.property.findFirst({
        where: {
            propertyID: parseInt(id as string),
        },
    });

    return {
        props: { property: JSON.parse(JSON.stringify(property)), offerValue },
    };
};

export default Offer;
