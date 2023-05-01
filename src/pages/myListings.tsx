import { GetServerSideProps, NextPage } from "next";
import { Property } from "@prisma/client";
import prisma from "../../prisma/prisma";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";
import NavBar from "@/components/NavBar";
import Background from "@/components/Backgrounds";
import MyListingCard from "@/components/MyListingCard";

// Props for the my listings page
interface PropertyProps {
    properties: Property[];
}

const MyListings: NextPage<PropertyProps> = ({ properties }) => {
    // Get the session
    const { data: session } = useSession();

    // Render the my listings page
    return (
        <div>
            <Head>
                <title>My Listings</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Background />
            <NavBar isLoggedIn={!!session} />
            <div className="p-5 pt-20">
                <h1 className="text-4xl font-bold text-center mb-5">
                    My Listings
                </h1>
                <MyListingCard properties={properties} />
            </div>
        </div>
    );
};

// Get the user and property data from the database
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Get the session
    const session = await getSession(context);

    // If there's no session, redirect to the login page
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    // Get the user
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email!,
        },
    });

    // Get all properties that the user has created
    const properties = await prisma.property.findMany({
        where: {
            user: {
                email: user?.email,
            },
        },
    });

    return {
        props: {
            properties: JSON.parse(JSON.stringify(properties)),
        },
    };
};

export default MyListings;