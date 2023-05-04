import React from "react";
import { Property } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

// Props for the DisplayCard component
interface PropertyProps {
    properties: Property[];
}

// CDN for the property images
let CDN =
    "https://zqmbrfgddurttslljblz.supabase.co/storage/v1/object/public/property-images/";

// DisplayCard component
const DisplayCard: React.FC<PropertyProps> = ({ properties }) => {
    // Return the DisplayCard component
    return (
        <div className="grid grid-cols-1 gap-6 font-mono">
            {/* Map through the properties */}
            {properties.map((property) => (
                <div
                    key={property.id}
                    className="bg-white p-6 rounded-lg shadow-lg mb-6 cursor-default grid grid-cols-2 group hover:drop-shadow-md w-4/12 md:mx-auto"
                >
                    {/* Image of the property */}
                    <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-t-lg overflow-hidden mb-4 place-items-center mx-auto">
                        <Image
                            src={CDN + property.images[0]}
                            alt={property.address}
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="absolute inset-0 h-full w-full object-cover"
                            priority={true}
                        />
                    </div>

                    {/* Details of the property */}
                    <div className="flex flex-col flex-grow justify-center">
                        {property.tenure === "to rent" ? (
                            <h1 className="text-2xl font-medium mb-2">
                                £{property.rent} per month
                            </h1>
                        ) : (
                            <h1 className="text-2xl font-medium mb-2">
                                £{property.price}
                            </h1>
                        )}
                        <p className="text-gray-600 mb-4">{`${property.bedrooms} bed, ${property.bathrooms} bathroom ${property.houseType} ${property.tenure}`}</p>
                        <p className="mb-4 text-lg">{property.address}</p>

                        <Link href={`/properties/${property.propertyID}`}>
                            <button className="mb-4 px-8 py-3 bg-white bg-opacity-75 text-blue-500 font-bold rounded-md hover:bg-blue-500 hover:text-white border-2 border-blue-500">
                                View Details
                                {/* </div> */}
                            </button>
                        </Link>
                        <p className="mb-4 text-sm text-gray-600">
                            Listed on:{" "}
                            {property.createdAt
                                .toString()
                                .substring(
                                    0,
                                    property.createdAt.toString().indexOf("T")
                                )}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisplayCard;
