import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getSession, useSession, signOut } from "next-auth/react";
import { FC } from "react";
import { NextApiRequest } from "next";


type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session; 
};

export default function Home() {
    const { data: session, status } = useSession();

    return (
        <>
            <Head>
                <title>Home</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {session ? <User session={session} /> : <Guest />}
        </>
    );
}

// Guest
function Guest() {
    return (
        <main className="container mx-auto text-center py-20">
            <h3 className="text-4xl font-bold">Guest Homepage</h3>
            <div className="flex justify-center">
                <Link
                    className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
                    href="/login"
                >
                    Sign In
                </Link>
            </div>
        </main>
    );
}

// Authorised User
const User: FC<sessionProps> = ({ session }) => {
    return (
        <main className="container mx-auto text-center py-20">
            <h3 className="text-4xl font-bold">Authorised User Homepage</h3>

            <div className="details">
                <h5>{session?.user?.name}</h5>
                <h5>{session?.user?.email}</h5>
            </div>

            <div className="flex justify-center">
                <button
                    className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
                    onClick={() => signOut()}
                >
                    Sign Out
                </button>
            </div>

            <div className="flex justify-center">
                <Link
                    className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
                    href="/profile"
                >
                    Profile Page
                </Link>
            </div>
        </main>
    );
};

// export async function getserverSideProps({ req }: { req: NextApiRequest }) {
//     const session = await getSession({ req });

//     if (!session) {
//         return {
//             redirect: {
//                 destination: "/login",
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {
//             session,
//         },
//     };
// }
