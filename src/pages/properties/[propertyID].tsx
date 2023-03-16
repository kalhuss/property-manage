import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";
import NavBar from "../../components/NavBar";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";

interface PropertyPageProps {
    property: Property;
}

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

let CDN = "https://zqmbrfgddurttslljblz.supabase.co/storage/v1/object/public/property-images/";

const PropertyPage: NextPage<PropertyPageProps> = ({ property }) => {

    const { data: session, status } = useSession();

    return (
        <div>
            <Head>
                <title>{property.address}</title>
                <meta name="description" content={property.description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar isLoggedIn={!!session} />
            <div className="container mx-auto px-4 pt-20">
                <Link className="flex pb-5"href={'/properties'}>
                    <span className="text-2xl font-bold mr-2"><BsArrowLeft /></span>
                    <h1 className="text-lg font-bold inline-block">Back to properties</h1>
                </Link>
                <div className="flex flex-wrap justify-center mb-8">
                    <div className="w-full md:w-1/2 lg:w-1/25">
                        <div className="relative">
                            {/* <img src={CDN + property.images[0]} alt={property.address} className="w-full h-auto rounded-lg object-contain" /> */}
                            <Image src={CDN + property.images[0]} alt={property.address} width="0" height="0" sizes="100vw" className="w-full h-auto rounded-lg object-contain" />
                            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                                <p className="text-2xl font-extrabold mb-2">£{property.price}</p>
                                <p className="text-2xl font-semibold mb-2">{property.address}</p>
                                <div className="flex mb-2">
                                    <p className="text-lg mr-2">{property.bedrooms} bedroom</p>
                                    <p className="text-lg mr-2">{property.bathrooms} bathroom</p>
                                </div>
                                <div className="flex mb-2">
                                    <div className="w-1/2">
                                        <p className="text-lg mb-1">Tenure:</p>
                                        <p className="text-lg">{property.tenure}</p>
                                    </div>
                                    <div className="w-1/2">
                                        <p className="text-lg mb-1">Tax Band:</p>
                                        <p className="text-lg">{property.taxBand}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-2 mt-2 mb-4">
                                    <p className="text-lg mb-1">Description:</p>
                                    <p className="text-lg">{property.description}</p>
                                </div>
                            </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 lg:w-2/5 lg:pl-8">
                        <div className="">
                            <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
                                <p className="text-xl font-bold mb-2">Contact</p>
                                <p className="text-lg mb-2">Phone: {property.contactNumber}</p>
                                <p className="text-lg">Email: {property.contactEmail}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 lg:w-2/5 lg:pl-8 left-0">
                        <Image src={CDN + property.floorPlan[0]} alt={property.address} width="0" height="0" sizes="100vw" className="w-full h-auto rounded-lg object-contain" />
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
            propertyID: parseInt(id as string)
        },
    });

    return {
        props: { property: JSON.parse(JSON.stringify(property)) },
    };
}

export default PropertyPage;
