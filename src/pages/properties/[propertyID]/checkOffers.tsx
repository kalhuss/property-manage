import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import { User } from "@prisma/client";
import { Offer } from "@prisma/client";
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
import DisplayCard from "../../../components/DisplayCard";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";
import BackArrow from "@/components/BackArrow";

interface CheckOffersPageProps {
    offers: Offer[];
    users: User[];
    property: Property;
}

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session;
};

const checkOffers: NextPage<CheckOffersPageProps> = ({
    offers,
    users,
    property,
}) => {
    const { data: session, status } = useSession();
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [offersValue, setOffers] = useState<Offer[]>(offers);

    const handleOfferClick = (offer: Offer) => {
        setSelectedOffer(offer);
    };

    async function handleConfirmClick() {
        fetch("/api/updateOffers", {
            method: "POST",
            body: JSON.stringify({ offerId: selectedOffer?.id }),
        });
        Router.reload();
    }

    const handleCancelClick = () => {
        setSelectedOffer(null);
    };
    return (
        <>
            <Background />
            <NavBar isLoggedIn={!!session} />
            <Head>
                <title>Check Offers</title>
                <meta name="description" content={property.description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container mx-auto p-5 pt-20">
                <BackArrow label="Back" url="back"/>
                <h1 className="text-4xl font-bold text-center mb-5">Offers</h1>
                <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-auto">
                    <h2 className="text-2xl font-bold mb-4">
                        {property.address}
                    </h2>
                    <p className="text-lg mb-2">Price: £{property.price}</p>
                    <p className="text-lg mb-2">
                        {property.bedrooms} Bedrooms, {property.bathrooms}{" "}
                        Bathrooms
                    </p>
                    <p className="text-lg mb-2"></p>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {offers
                        .filter(
                            (offer) =>
                                offer.offerStatus === "Pending" ||
                                offer.offerStatus === "Accepted"
                        )
                        .map((offer) => (
                            <button
                                key={offer.id}
                                className={`${
                                    selectedOffer?.id === offer.id
                                        ? "bg-green-200"
                                        : "bg-white"
                                } rounded-lg shadow-lg p-4 transition duration-300 group hover:shadow-2xl`}
                                onClick={() => handleOfferClick(offer)}
                            >
                                <p className="text-lg mb-2">
                                    {
                                        users.filter(
                                            (user) => user.id === offer.userId
                                        )[0]?.name
                                    }{" "}
                                    {
                                        users.filter(
                                            (user) => user.id === offer.userId
                                        )[0]?.surname
                                    }
                                </p>
                                <p className="text-lg mb-2">
                                    Offer amount: £{offer.amount}
                                </p>
                                <p className="text-lg mb-2">
                                    Mortgage status: {offer.status}
                                </p>
                            </button>
                        ))}
                </div>
                {selectedOffer && (
                    <div className="flex justify-end mt-4">
                        {selectedOffer.offerStatus === "Pending" && (
                            <>
                                <button
                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded mr-4"
                                    onClick={handleConfirmClick}
                                >
                                    Confirm
                                </button>
                                <button
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleCancelClick}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.propertyID;

    const property = await prisma.property.findFirst({
        where: {
            propertyID: Number(id),
        },
    });

    const offers = await prisma.offer.findMany({
        where: {
            propertyId: property?.id,
        },
    });

    const users = await prisma.user.findMany({
        where: {
            id: {
                in: offers.map((offer) => offer.userId),
            },
        },
    });

    return {
        props: {
            offers: JSON.parse(JSON.stringify(offers)),
            users: JSON.parse(JSON.stringify(users)),
            property: JSON.parse(JSON.stringify(property)),
        },
    };
};

export default checkOffers;
