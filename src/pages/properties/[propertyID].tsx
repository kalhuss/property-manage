import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";
import NavBar from "../../components/NavBar";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Background from "@/components/Backgrounds";

interface PropertyPageProps {
    property: Property;
}

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

let CDN =
    "https://zqmbrfgddurttslljblz.supabase.co/storage/v1/object/public/property-images/";

const PropertyPage: NextPage<PropertyPageProps> = ({ property }) => {
    const { data: session, status } = useSession();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);

    function handleNextImage() {
        setCurrentImageIndex(
            currentImageIndex === property.images.length - 1
                ? 0
                : currentImageIndex + 1
        );
    }

    function handlePrevImage() {
        setCurrentImageIndex(
            currentImageIndex === 0
                ? property.images.length - 1
                : currentImageIndex - 1
        );
    }

    function handleNextFloorPlan() {
        setCurrentFloorPlanIndex(
            currentFloorPlanIndex === property.floorPlan.length - 1
                ? 0
                : currentFloorPlanIndex + 1
        );
    }

    function handlePrevFloorPlan() {
        setCurrentFloorPlanIndex(
            currentFloorPlanIndex === 0
                ? property.floorPlan.length - 1
                : currentFloorPlanIndex - 1
        );
    }

    return (
        <div>
            <Head>
                <title>{property.address}</title>
                <meta name="description" content={property.description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Background />
            <NavBar isLoggedIn={!!session} />
            <div className="container mx-auto px-4 pt-20">
                <Link className="flex pb-5" href={"/properties"}>
                    <span className="text-2xl font-bold mr-2">
                        <BsArrowLeft />
                    </span>
                    <div className="block group text-lg mt-4 lg:inline-block lg:mt-0 font-bold text-black relative">
                        Back to properties
                        <span className="absolute bottom-0 group-hover:w-full left-0 w-0 h-0.5 bg-blue-500  transition-all duration-300 origin-left"></span>
                    </div>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                    <div className="grid grid-flow-row mb-3">
                        <div className="relative">
                            <Image
                                src={CDN + property.images[currentImageIndex]}
                                alt={property.address}
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-auto object-cover aspect-square -z-10"
                            />
                            {property.images.length > 1 && (
                                <div className="absolute top-1/2 left-0 right-0 bottom-0">
                                    <button
                                        onClick={handlePrevImage}
                                        className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute left-2"
                                    >
                                        {"<"}
                                    </button>

                                    <button
                                        onClick={handleNextImage}
                                        className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute -right-0"
                                    >
                                        {">"}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="bg-white shadow-lg p-4 mb- h-fit flex-col">
                            <p className="text-2xl font-extrabold mb-2">
                                £{property.price}
                            </p>
                            <p className="text-2xl font-semibold mb-2">
                                {property.address}
                            </p>
                            <div className="flex mb-2">
                                <p className="text-lg mr-1">
                                    {property.bedrooms} bedroom
                                </p>
                                <p className="text-lg mr-2">
                                    {property.bathrooms} bathroom
                                </p>
                                <p className="text-lg mr-1">
                                    {property.houseType} {property.tenure}
                                </p>
                            </div>
                            <p className="text-lg mb-2">
                                Tax Band: {property.taxBand}
                            </p>
                            <div className="flex flex-col border-t-2">
                                <p className="text-lg mb-2 mt-2">Key Features:</p>
                                <div className="flex flex-wrap">
                                    {property.keyFeatures.map(
                                        (feature, index) => (
                                            <div
                                                className="flex items-center mr-5 mb-2"
                                                key={index}
                                            >
                                                <span className="mr-1">
                                                    &#8226;
                                                </span>
                                                <p className="text-lg">
                                                    {feature}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="border-t border-b pt-2 mt-2 mb-4">
                                <p className="text-lg mb-1">Description:</p>
                                <p className="text-lg">
                                    {property.description}
                                </p>
                            </div>
                            <p className="mb-4 text-sm text-gray-600">Listed on: {property.createdAt.toString().substring(0, property.createdAt.toString().indexOf('T'))}</p>
                        </div>
                        <div className="relative">
                            <div className="bg-white shadow-lg p-4 mb-4 h-fit">
                                <Image
                                    src={
                                        CDN +
                                        property.floorPlan[
                                            currentFloorPlanIndex
                                        ]
                                    }
                                    alt={property.address}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="w-full h-auto object-scale-down aspect-square -z-10"
                                />
                            </div>
                            {property.floorPlan.length > 1 && (
                                <div className="absolute top-1/2 left-0 right-0 bottom-0">
                                    <button
                                        onClick={handlePrevFloorPlan}
                                        className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute left-2"
                                    >
                                        {"<"}
                                    </button>

                                    <button
                                        onClick={handleNextFloorPlan}
                                        className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute -right-0"
                                    >
                                        {">"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-flow-row mb-3">
                        <div className="">
                            <div className="bg-white shadow-lg p-4 mb-4 h-fit">
                                <div className="flex flex-col">
                                    <p className="text-2xl font-semibold mb-2">
                                        Contact
                                    </p>
                                    <div className="flex mb-2">
                                        <p className="text-lg mr-1 font-semibold">
                                            Phone Number:
                                        </p>
                                        <p className="text-lg mr-2">
                                            {property.contactNumber}
                                        </p>
                                    </div>
                                    <div className="flex mb-2">
                                        <p className="text-lg mr-1 font-semibold">
                                            Email:
                                        </p>
                                        <p className="text-lg mr-2">
                                            {property.contactEmail}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white shadow-lg p-4 mb-4 h-fit">
                                <div className="flex flex-col">
                                    <p className="text-2xl font-semibold mb-2">
                                        Offer
                                    </p>
                                    <div className="flex mb-2">
                                        <input
                                            type="text"
                                            placeholder="£"
                                            className="border border-gray-300 rounded-md p-2 mr-2"
                                        />
                                        <button className="p-4 border-blue-500 border-2 text-blue-500 hover:border-white hover:text-white hover:bg-blue-500 rounded-lg">
                                            Make Offer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.propertyID;
    const property = await prisma.property.findFirst({
        where: {
            propertyID: parseInt(id as string),
        },
    });

    return {
        props: { property: JSON.parse(JSON.stringify(property)) },
    };
};

export default PropertyPage;
