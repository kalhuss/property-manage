import { ChangeEvent, FC } from "react";
import Head from "next/head";
import { useFormik } from "formik";
import { useEffect } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import NavBar from "../components/NavBar";
import Image from "next/image";
import Router from "next/router";
import KeyFeaturesInput from "../components/KeyFeaturesInput";
import { useState } from "react";
import ListingInput from "../components/ListingInput";
import ListingFileUpload from "../components/ListingFileUpload";
import Background from "@/components/Backgrounds";

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

const Listing: FC<sessionProps> = () => {
    const { data: session, status } = useSession();
    let exteriorImage: string[] = [];
    let images: string[] = [];
    let floorPlans: string[] = [];
    let panoramicImages: string[] = [];

    const formik = useFormik({
        initialValues: {
            price: "",
            size: "",
            bedrooms: "",
            bathrooms: "",
            houseType: "",
            address: "",
            postcode: "",
            tenure: "",
            taxBand: "",
            rent: "",
            keyFeatures: [],
            description: "",
            contactNumber: "",
            contactEmail: "",
            exteriorImage: exteriorImage,
            images: images,
            panoramicImages: panoramicImages,
            floorPlan: floorPlans,
            email: session?.user?.email,
        },
        onSubmit: async (values) => {
            //call the createListing api
            fetch("/api/createListing", {
                method: "POST",
                body: JSON.stringify(values),
            });
            Router.push("/properties");
        },
    });

    function readFileAsText(file: File) {
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

    async function encodeExteriorImage(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(readFileAsText(files[i]));
        }

        // Trigger Promises
        Promise.all(readers).then((exteriorImage) => {
            // Values will be an array that contains an item
            // with the text of every selected file
            // ["File1 Content", "File2 Content" ... "FileN Content"]
            formik.setValues((values) => ({
                ...values,
                exteriorImage: exteriorImage as string[],
            }));
        });
    }

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
        Promise.all(readers).then((images) => {
            // Values will be an array that contains an item
            // with the text of every selected file
            // ["File1 Content", "File2 Content" ... "FileN Content"]
            formik.setValues((values) => ({
                ...values,
                images: images as string[],
            }));
        });
    }

    async function encodePanoramicImage(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(readFileAsText(files[i]));
        }

        // Trigger Promises
        Promise.all(readers).then((panoramicImages) => {
            // Values will be an array that contains an item
            // with the text of every selected file
            // ["File1 Content", "File2 Content" ... "FileN Content"]
            formik.setValues((values) => ({
                ...values,
                panoramicImages: panoramicImages as string[],
            }));
        });
    }

    async function encodeFloorPlan(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(readFileAsText(files[i]));
        }

        // Trigger Promises
        Promise.all(readers).then((floorPlan) => {
            // Values will be an array that contains an item
            // with the text of every selected file
            // ["File1 Content", "File2 Content" ... "FileN Content"]
            formik.setValues((values) => ({
                ...values,
                floorPlan: floorPlan as string[],
            }));
        });
    }

    return (
        <>
            <Head>
                <title>Listing</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Background />
            <NavBar isLoggedIn={!!session} />
            <div className="flex flex-col items-center justify-center pt-20">
                <div className=" min-h-fit p-5 w-3/6 bg-white rounded-lg shadow-lg ">
                    {/* Title */}
                    <h1 className="text-4xl font-bold text-center">
                        Create a new listing
                    </h1>

                    <section className="w-3/4 mx-auto flex flex-col">
                        {/* Form */}
                        <form
                            className="mt-10 grid grid-cols-2 gap-y-5 gap-x-10"
                            onSubmit={formik.handleSubmit}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                        >
                            {/* Price */}
                            <div className={formik.values.tenure === "to rent" ? "hidden" : "block"}>
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Price"
                                inputType="text"
                                formikName="price"
                            />
                            </div>

                            {/* Bedrooms */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Bedrooms"
                                inputType="text"
                                formikName="bedrooms"
                            />

                            {/* Bathrooms */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Bathrooms"
                                inputType="text"
                                formikName="bathrooms"
                            />

                            {/* House Type */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="House Type"
                                inputType="text"
                                formikName="houseType"
                            />

                            {/* Address */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Address"
                                inputType="text"
                                formikName="address"
                            />

                            {/* Postcode */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Postcode"
                                inputType="text"
                                formikName="postcode"
                            />

                            {/* Tenure */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Tenure"
                                inputType="dropdown"
                                formikName="tenure"
                            />

                            {/* Tax Band */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Tax Band"
                                inputType="text"
                                formikName="taxBand"
                            />

                            {/* Rent */}
                            <div className={formik.values.tenure === "to rent" ? "block" : "hidden"}>
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Rent"
                                inputType="text"
                                formikName="rent"
                            />
                            </div>

                            {/* Key Features */}
                            <KeyFeaturesInput
                                setFieldValue={formik.setFieldValue}
                            />

                            {/* Description */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Description"
                                inputType="textarea"
                                formikName="description"
                            />

                            {/* Contact Number */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Contact Number"
                                inputType="text"
                                formikName="contactNumber"
                            />

                            {/* Contact Email */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Contact Email"
                                inputType="text"
                                formikName="contactEmail"
                            />

                            {/* Exterior Images */}
                            <ListingFileUpload
                                labelName="Exterior Image"
                                onChange={encodeExteriorImage}
                            />

                            {/* Images */}
                            <ListingFileUpload
                                labelName="Images"
                                onChange={encodeImage}
                            />

                            {/* Panoramic Images */}
                            <ListingFileUpload
                                labelName="Panoramic Images"
                                onChange={encodePanoramicImage}
                            />

                            {/* Floor Plan */}
                            <ListingFileUpload
                                labelName="Floor Plan"
                                onChange={encodeFloorPlan}
                            />

                            {/* Submit */}
                            <button
                                className="p-4 col-span-2 border-blue-500 border-2 text-blue-500 hover:border-white hover:text-white hover:bg-blue-500 rounded-lg"
                                type="submit"
                            >
                                Submit
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Listing;
