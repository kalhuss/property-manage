import React from "react";
import { Property } from "@prisma/client";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

interface PropertyProps {
    properties: Property[];
}

let CDN = "https://zqmbrfgddurttslljblz.supabase.co/storage/v1/object/public/property-images/";

const DisplayCard: NextPage<PropertyProps> = ({ properties }) => {

    return (
        <div className="grid grid-cols-1 gap-6 font-mono">
            {properties.map((property) => (
                <div
                    key={property.id}
                    className="bg-white p-6 rounded-lg shadow-lg mb-6 cursor-default grid grid-cols-2 group hover:drop-shadow-md w-4/12 md:mx-auto"
                >
                    <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-t-lg overflow-hidden mb-4 place-items-center mx-auto">
                        <Image src={CDN + property.images[0]} alt={property.address} width="0" height="0" sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow justify-center">
                        <h1 className="text-2xl font-medium mb-2">
                            £{property.price}
                        </h1>
                        <p className="text-gray-400 mb-4">{`${property.bedrooms} bed, ${property.bathrooms} bathroom ${property.houseType} for sale`}</p>
                        <p className="mb-4 text-lg">{property.address}</p>
                        <Link href={`/properties/${property.propertyID}`}>
                            <button className="px-8 py-3 bg-white bg-opacity-75 text-blue-500 font-bold rounded-md hover:bg-transparent hover:bg-blue-500 hover:text-white border-2 border-blue-500">
                                View Details
                            {/* </div> */}
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default DisplayCard;
