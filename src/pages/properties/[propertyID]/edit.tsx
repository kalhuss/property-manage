import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import prisma from "../../../../prisma/prisma";
import Head from "next/head";
import { getSession, useSession } from "next-auth/react";
import NavBar from "../../../components/NavBar";
import Background from "@/components/Backgrounds";
import { useFormik } from "formik";
import Router from "next/router";
import { ChangeEvent } from "react";
import ListingInput from "@/components/ListingInput";
import ListingFileUpload from "@/components/ListingFileUpload";
import KeyFeaturesInput from "@/components/KeyFeaturesInput";
import { User } from "@prisma/client";
import Spinner from "@/components/Spinner";
import { validateListing } from "lib/validate";
import imageCompression from "browser-image-compression";
import { useState } from "react";

// Props for the edit property page
interface PropertyProps {
    property: Property;
    user: User;
}

// Edit property page
const EditProperty: NextPage<PropertyProps> = ({ property, user }) => {
    const { data: session } = useSession();
    let exteriorImage: string[] = [];
    let images: string[] = [];
    let floorPlans: string[] = [];
    let panoramicImages: string[] = [];
    const [isLoading, setIsLoading] = useState(false);

    // Set up formik and populate the form with the property's data
    const formik = useFormik({
        initialValues: {
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            houseType: property.houseType,
            address: property.address,
            postcode: property.postcode,
            tenure: property.tenure,
            taxBand: property.taxBand,
            rent: property.rent,
            keyFeatures: property.keyFeatures,
            description: property.description,
            contactNumber: property.contactNumber,
            contactEmail: property.contactEmail,
            exteriorImage: exteriorImage,
            images: images,
            panoramicImages: panoramicImages,
            floorPlan: floorPlans,
            email: session?.user?.email!,
            propertyId: property.id,
        },
        validate: validateListing,
        onSubmit: async (values) => {
            // Show the loading spinner or modal
            setIsLoading(true);
            // Calculate the total size of all the images in bytes
            const totalSize =
                values.exteriorImage.reduce((acc, img) => acc + img.length, 0) +
                values.images.reduce((acc, img) => acc + img.length, 0) +
                values.panoramicImages.reduce(
                    (acc, img) => acc + img.length,
                    0
                ) +
                values.floorPlan.reduce((acc, img) => acc + img.length, 0);

            // Convert the total size to MB
            const totalSizeMB = totalSize / 1024 / 1024;
            console.log("size: ", totalSizeMB);
            // Check if the total size is greater than 4.5MB
            if (totalSizeMB > 4.5) {
                alert(
                    "The total size of the images exceeds the limit of 4.5MB."
                );
                return;
            }
            // Call the editProperty API
            const res = await fetch("/api/editProperty", {
                method: "POST",
                body: JSON.stringify(values),
            });
            // Redirect to the property page
            if (res.status === 200) {
                // Hide the loading spinner or modal
                setIsLoading(false);
                Router.push(`/properties/${property.propertyID}`);
            }
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

    async function compressAndEncodeImage(file: File): Promise<string> {
        const options = {
            maxSizeMB: 1, // max size in MB
            maxWidthOrHeight: 1920, // max width/height
            useWebWorker: true, // use WebWorker for faster compression
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const base64String = await readFileAsText(compressedFile);
            return base64String as string;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    // Encode the exterior image as a base64 string
    async function encodeExteriorImage(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(compressAndEncodeImage(files[i]));
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

    // Encode the image as a base64 string
    async function encodeImage(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(compressAndEncodeImage(files[i]));
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

    // Encode the panoramic image as a base64 string
    async function encodePanoramicImage(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(compressAndEncodeImage(files[i]));
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

    // Encode the floor plan as a base64 string
    async function encodeFloorPlan(e: ChangeEvent<HTMLInputElement>) {
        let files = e.target.files!;
        let readers = [];

        // Abort if there were no files selected
        if (!files.length) return;

        // Store promises in array
        for (let i = 0; i < files.length; i++) {
            readers.push(compressAndEncodeImage(files[i]));
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

    // Render the page
    // Render the listing page
    return (
        <>
            <Head>
                <title>Edit listing</title>
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
            {isLoading && <Spinner />}
            <div className="flex flex-col items-center justify-center pt-20">
                <div className=" min-h-fit p-5 w-3/6 bg-white rounded-lg shadow-lg ">
                    {/* Title */}
                    <h1 className="text-4xl font-bold text-center">
                        Edit listing
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
                            {/* Tenure */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Tenure"
                                inputType="dropdown"
                                formikName="tenure"
                                isRequired={true}
                            />

                            {/* Price */}
                            <div
                                className={
                                    formik.values.tenure === "to rent"
                                        ? "hidden"
                                        : "block"
                                }
                            >
                                <ListingInput
                                    getFieldProps={formik.getFieldProps}
                                    labelName="Price"
                                    inputType="text"
                                    formikName="price"
                                    isRequired={
                                        formik.values.tenure !== "to rent"
                                    }
                                />

                                {formik.touched.price && formik.errors.price ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.price}
                                    </div>
                                ) : null}
                            </div>

                            {/* Rent */}
                            <div
                                className={
                                    formik.values.tenure === "to rent"
                                        ? "block"
                                        : "hidden"
                                }
                            >
                                <ListingInput
                                    getFieldProps={formik.getFieldProps}
                                    labelName="Rent"
                                    inputType="text"
                                    formikName="rent"
                                    isRequired={
                                        formik.values.tenure === "to rent"
                                    }
                                />

                                {formik.touched.rent && formik.errors.rent ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.rent}
                                    </div>
                                ) : null}
                            </div>

                            {/* Bedrooms */}
                            <div>
                                <ListingInput
                                    getFieldProps={formik.getFieldProps}
                                    labelName="Bedrooms"
                                    inputType="text"
                                    formikName="bedrooms"
                                    isRequired={true}
                                />
                                {formik.touched.bedrooms &&
                                formik.errors.bedrooms ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.bedrooms}
                                    </div>
                                ) : null}
                            </div>

                            <div>
                                {/* Bathrooms */}
                                <ListingInput
                                    getFieldProps={formik.getFieldProps}
                                    labelName="Bathrooms"
                                    inputType="text"
                                    formikName="bathrooms"
                                    isRequired={true}
                                />
                                {formik.touched.bathrooms &&
                                formik.errors.bathrooms ? (
                                    <div className="text-red-500 text-sm">
                                        {formik.errors.bathrooms}
                                    </div>
                                ) : null}
                            </div>

                            {/* House Type */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="House Type"
                                inputType="text"
                                formikName="houseType"
                                isRequired={true}
                            />

                            {/* Address */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Address"
                                inputType="text"
                                formikName="address"
                                isRequired={true}
                            />

                            {/* Postcode */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Postcode"
                                inputType="text"
                                formikName="postcode"
                                isRequired={true}
                            />

                            {/* Tax Band */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Tax Band"
                                inputType="text"
                                formikName="taxBand"
                                isRequired={true}
                            />

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
                                isRequired={true}
                            />

                            {/* Contact Number */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Contact Number"
                                inputType="text"
                                formikName="contactNumber"
                                isRequired={true}
                            />

                            {/* Contact Email */}
                            <ListingInput
                                getFieldProps={formik.getFieldProps}
                                labelName="Contact Email"
                                inputType="text"
                                formikName="contactEmail"
                                isRequired={true}
                            />

                            <p className="col-span-2 w-full text-center">
                                You must re-upload images
                            </p>

                            {/* Exterior Images */}
                            <ListingFileUpload
                                labelName="Exterior Image"
                                onChange={encodeExteriorImage}
                                isRequired={true}
                            />

                            {/* Images */}
                            <ListingFileUpload
                                labelName="Images"
                                onChange={encodeImage}
                                isRequired={true}
                            />

                            {/* Panoramic Images */}
                            <ListingFileUpload
                                labelName="Panoramic Images"
                                onChange={encodePanoramicImage}
                                isRequired={false}
                            />

                            {/* Floor Plan */}
                            <ListingFileUpload
                                labelName="Floor Plan"
                                onChange={encodeFloorPlan}
                                isRequired={false}
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

// Get the property and user data from the database
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Get the session
    const session = await getSession(context);
    const id = context.params?.propertyID;

    // Get the property and user data
    const property = await prisma.property.findFirst({
        where: {
            propertyID: parseInt(id as string),
        },
    });

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email!,
        },
    });

    // If the user is not logged in, redirect to the home page
    if (user?.id !== property?.userId) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            property: JSON.parse(JSON.stringify(property)),
            user: JSON.parse(JSON.stringify(user)),
        },
    };
};

export default EditProperty;
