import { useSession, getSession } from "next-auth/react";
import NavBar from "../../components/NavBar";
import Head from "next/head";
import { NextPage } from "next";
import Link from "next/link";
import { GetServerSideProps } from "next";
import prisma from "../../../prisma/prisma";
import { User } from "@prisma/client";
import { useState } from "react";
import Background from "@/components/Backgrounds";
import { Offer } from "@prisma/client";
import { Property } from "@prisma/client";
import BackArrow from "@/components/BackArrow";
import { Contract } from "@prisma/client";
import { useRouter } from "next/router";

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

interface SuccessPageProps {
    user: User;
    offers: Offer[];
    properties: Property[];
    contracts: Contract[];
}

const SuccessPage: NextPage<SuccessPageProps> = ({
    user,
    offers,
    properties,
    contracts,
}) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;

    // Call your API to update the user's paid status
    if (session) {
        fetch("/api/updatePaid", {
            method: "POST",
            body: JSON.stringify({
                userId: user.id,
                id: id,
            }),
        });
    }

    return (
        <>
            <Head>
                <title>Offers</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Background />
            <NavBar isLoggedIn={!!session} />
            <div className="container mx-auto p-5 pt-20 flex flex-col">
                <BackArrow label="Back" url="/" />
                <h1 className="text-4xl font-bold text-center mb-5">
                    Payment Successful!
                </h1>
                <p className="text-center text-lg">
                    Thank you for your payment
                </p>
                <Link href="/" className="flex justify-center">
                    <button className="justify-center px-8 py-3 mt-44 bg-white bg-opacity-75 text-blue-500 font-bold text-3xl rounded-md hover:shadow-lg  hover:bg-blue-500 hover:text-white border-2 border-blue-500">
                        Back to Home
                    </button>
                </Link>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const email = session?.user?.email;

    const user = await prisma.user.findFirst({
        where: {
            email: email as string,
        },
    });

    const offers = await prisma.offer.findMany({
        where: {
            userId: user?.id,
        },
    });

    const properties = await prisma.property.findMany({
        where: {
            offers: {
                some: {
                    userId: user?.id,
                },
            },
        },
    });

    // Get the contracts
    const contracts = await prisma.contract.findMany({
        where: {
            userId: user?.id,
        },
    });

    return {
        props: {
            offers: JSON.parse(JSON.stringify(offers)),
            user: JSON.parse(JSON.stringify(user)),
            properties: JSON.parse(JSON.stringify(properties)),
            contracts: JSON.parse(JSON.stringify(contracts)),
        },
    };
};

export default SuccessPage;
