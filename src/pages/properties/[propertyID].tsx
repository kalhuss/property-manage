import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import prisma from "../../../prisma/prisma";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";
import NavBar from "../../components/NavBar";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Background from "@/components/Backgrounds";
import PanoramaViewer from "@/components/PanoramaViewer";
import { User } from "@prisma/client";
import BackArrow from "@/components/BackArrow";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";

interface PropertyPageProps {
    property: Property;
    user: User;
}

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

let CDN =
    "https://zqmbrfgddurttslljblz.supabase.co/storage/v1/object/public/property-images/";

const PropertyPage: NextPage<PropertyPageProps> = ({ property, user }) => {
    const { data: session, status } = useSession();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);
    const [offerValue, setOfferValue] = useState("");

    const libraries = useMemo(() => ["places"], []);

    const [mapCenter, setMapCenter] = useState<{
        lat: number;
        lng: number;
    }>({ lat: 0, lng: 0 });

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: true,
            clickableIcons: true,
            scrollwheel: false,
        }),
        []
    );

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
        libraries: libraries as any,
    });

    const address = `${property.address} ${property.postcode}`;
    console.log(address);

    useEffect(() => {
        if (isLoaded && property.address && property.postcode) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                { address: address.toLocaleLowerCase() },
                (results, status) => {
                    if (status === "OK") {
                        const { lat, lng } = results![0].geometry.location;
                        setMapCenter({ lat: lat(), lng: lng() });
                    }
                }
            );
        }
    }, [isLoaded, property.address, property.postcode]);

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    const imageSliderLength =
        property.images.length + property.panoramicImages.length;
    const floorPlanSliderLength = property.floorPlan.length;

    function handleNextImage(imageType: string) {
        if (imageType === "image") {
            setCurrentImageIndex((currentImageIndex + 1) % imageSliderLength);
        } else if (imageType === "floorPlan") {
            setCurrentFloorPlanIndex(
                (currentFloorPlanIndex + 1) % floorPlanSliderLength
            );
        }
    }

    function handlePrevImage(imageType: string): void {
        if (imageType === "image") {
            setCurrentImageIndex(
                (currentImageIndex - 1 + imageSliderLength) % imageSliderLength
            );
        } else if (imageType === "floorPlan") {
            setCurrentFloorPlanIndex(
                (currentFloorPlanIndex - 1 + floorPlanSliderLength) %
                    floorPlanSliderLength
            );
        }
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
                <BackArrow label="Back to properties" url="/properties" />
                <div className="grid grid-cols-2 gap-2">
                    <div className="grid grid-flow-row mb-3">
                        <div className="relative">
                            {currentImageIndex < property.images.length ? (
                                <Image
                                    src={
                                        CDN + property.images[currentImageIndex]
                                    }
                                    alt={property.address}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="w-full h-auto object-cover -z-10"
                                    priority={true}
                                />
                            ) : property.panoramicImages.length > 0 &&
                              currentImageIndex >= property.images.length ? (
                                <PanoramaViewer
                                    image={
                                        CDN +
                                        property.panoramicImages[
                                            currentImageIndex -
                                                property.images.length
                                        ]
                                    }
                                />
                            ) : null}
                            {property.images.length +
                                property.panoramicImages.length >
                                1 && (
                                <div className="absolute top-1/2 left-0 right-0 bottom-0">
                                    <button
                                        onClick={() => handlePrevImage("image")}
                                        className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute left-2"
                                    >
                                        {"<"}
                                    </button>

                                    <button
                                        onClick={() => handleNextImage("image")}
                                        className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute -right-0"
                                    >
                                        {">"}
                                    </button>
                                    <div className="absolute bottom-2 left-2 text-white bg-gray-700 bg-opacity-50 p-2">
                                        {currentImageIndex + 1} /{" "}
                                        {imageSliderLength}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white shadow-lg p-4 mb- h-fit flex-col">
                            {property.tenure === "to rent" ? (
                                <p className="text-2xl font-extrabold mb-2">
                                    £{property.rent} per month
                                </p>
                            ) : (
                                <p className="text-2xl font-extrabold mb-2">
                                    £{property.price}
                                </p>
                            )}
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
                                <p className="text-lg mb-2 mt-2">
                                    Key Features:
                                </p>
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
                            <p className="mb-4 text-sm text-gray-600">
                                Listed on:{" "}
                                {property.createdAt
                                    .toString()
                                    .substring(
                                        0,
                                        property.createdAt
                                            .toString()
                                            .indexOf("T")
                                    )}
                            </p>
                        </div>
                        {/* if there is a floor plan show otherwise do not show anything */}
                        {property.floorPlan.length > 0 && (
                            <div className="relative bg-white shadow-lg p-4">
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
                                {property.floorPlan.length > 1 && (
                                    <div className="absolute top-1/2 left-0 right-0 bottom-0">
                                        <button
                                            onClick={() =>
                                                handlePrevImage("floorPlan")
                                            }
                                            className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute left-2"
                                        >
                                            {"<"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleNextImage("floorPlan")
                                            }
                                            className="text-white bg-gray-700 opacity-80 hover:opacity-100 py-2 px-4 rounded-full mr-2 focus:outline-none absolute -right-0"
                                        >
                                            {">"}
                                        </button>
                                        <div className="absolute bottom-2 left-2 text-white bg-gray-700 bg-opacity-50 p-2">
                                            {currentFloorPlanIndex + 1} /{" "}
                                            {floorPlanSliderLength}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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
                                        {user ? (
                                            property.userId === user.id ? (
                                                <Link
                                                    href={`/properties/${property.propertyID}/checkOffers`}
                                                >
                                                    <button className="p-4 border-blue-500 border-2 text-blue-500 hover:border-white hover:text-white hover:bg-blue-500 rounded-lg">
                                                        Check Offers
                                                    </button>
                                                </Link>
                                            ) : (
                                                <>
                                                    <input
                                                        type="text"
                                                        placeholder="£"
                                                        className="border border-gray-300 rounded-md p-2 mr-2"
                                                        value={offerValue}
                                                        onChange={(e) =>
                                                            setOfferValue(
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            property.userId ===
                                                            user?.id
                                                        }
                                                    />
                                                    <Link
                                                        href={`/properties/${property.propertyID}/createOffer?offerValue=${offerValue}`}
                                                    >
                                                        {property.tenure ===
                                                        "to rent" ? (
                                                            <button
                                                                className="p-4 border-blue-500 border-2 text-blue-500 hover:border-white hover:text-white hover:bg-blue-500 rounded-lg"
                                                                disabled={
                                                                    !offerValue
                                                                }
                                                            >
                                                                Offer Deopsit
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="p-4 border-blue-500 border-2 text-blue-500 hover:border-white hover:text-white hover:bg-blue-500 rounded-lg"
                                                                disabled={
                                                                    !offerValue
                                                                }
                                                            >
                                                                Make Offer
                                                            </button>
                                                        )}
                                                    </Link>
                                                </>
                                            )
                                        ) : (
                                            <Link href={`/login`}>
                                                <button className="p-4 border-blue-500 border-2 text-blue-500 hover:border-white hover:text-white hover:bg-blue-500 rounded-lg">
                                                    Log in to make an offer
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <GoogleMap
                                    options={mapOptions}
                                    zoom={14}
                                    center={mapCenter}
                                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                                    mapContainerStyle={{
                                        width: "800px",
                                        height: "800px",
                                    }}
                                    onLoad={() =>
                                        console.log("Map Component Loaded...")
                                    }
                                >
                                    <MarkerF
                                        position={mapCenter}
                                        onLoad={() =>
                                            console.log("Marker Loaded")
                                        }
                                    />
                                </GoogleMap>
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

export default PropertyPage;
