import React from 'react';
import prisma from "../../prisma/prisma";
import { NextPage } from 'next';
import { Property } from '@prisma/client';
import DisplayCard from '../components/DisplayCard';
import Head from 'next/head';

interface PropertyProps {
    properties: Property[];
}

const Properties: NextPage<PropertyProps> = ({ properties }) => {

    return(
        <div>
            <Head>
                <title>Properties</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className = "p-5">
                <DisplayCard properties = {properties} />
            </div>
        </div>
    )
};

export async function getServerSideProps() {
    const properties = await prisma.property.findMany();
    return {
        props: { properties: JSON.parse(JSON.stringify(properties)) },
    };
}

export default Properties;