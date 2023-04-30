import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import prisma from "../../../../prisma/prisma";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";
import NavBar from "../../../components/NavBar";
import { useState } from "react";
import Background from "@/components/Backgrounds";
import { useFormik } from "formik";
import Router from "next/router";
import { ChangeEvent } from "react";
import FileUpload from "../../../components/FileUpload";
import { useEffect } from "react";
import { Formik } from "formik";
import ListingInput from "@/components/ListingInput";
import ListingFileUpload from "@/components/ListingFileUpload";
import KeyFeaturesInput from "@/components/KeyFeaturesInput";
import { User } from "@prisma/client";


interface PropertyProps {
    property: Property;
    user: User;
}

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

const EditProperty: NextPage<PropertyProps> = ({ property, user }) => {
    const { data: session, status } = useSession();
    let exteriorImage: string[] = [];
    let images: string[] = [];
    let floorPlans: string[] = [];
    let panoramicImages: string[] = [];

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
            email: session?.user?.email,
            propertyId: property.id,
        },

        onSubmit: async (values) => {
            const res = await fetch("/api/editProperty", {
                method: "POST",
                body: JSON.stringify(values),
            });
            Router.push(`/properties/${property.propertyID}`);
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
                        <title>Edit Listing</title>
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
                                    <p className="col-span-2 w-full text-center">You must re-upload images</p>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.propertyID;
    const session = await getSession(context);
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

    return {
        props: {
            property: JSON.parse(JSON.stringify(property)),
            user: JSON.parse(JSON.stringify(user)),
        },
    };
};

export default EditProperty;