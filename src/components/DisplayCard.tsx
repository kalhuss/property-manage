import React from "react";
import { Property } from "@prisma/client";
import { NextPage } from "next";
import Link from "next/link";

interface PropertyProps {
    properties: Property[];
}

let CDN = "https://zqmbrfgddurttslljblz.supabase.co/storage/v1/object/public/property-images/";

const DisplayCard: NextPage<PropertyProps> = ({ properties }) => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {properties.map((property) => (
                <div
                    key={property.id}
                    className="bg-white p-6 rounded-lg shadow-lg w-auto mb-6 cursor-default flex flex-col group hover:drop-shadow-md"
                >
                    <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                        <img className="absolute inset-0 h-full w-full object-cover" src={CDN + property.images[0]} alt={property.address} />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <h1 className="text-2xl font-medium mb-2">
                            £{property.price}
                        </h1>
                        <p className="text-gray-400 mb-4">{`${property.bedrooms} bed, ${property.bathrooms} bathroom ${property.houseType} for sale`}</p>
                        <p className="mb-4 text-lg">{property.address}</p>
                        <Link href={`/properties/${property.propertyID}`}>
                            <div className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                View Details
                            </div>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisplayCard;
