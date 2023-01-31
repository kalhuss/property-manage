import Link from 'next/link';
import { FC } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session; 
};

const Profile: FC<sessionProps> = () => {
    const { data: session, status } = useSession();
    console.log(session);
    return (
        <section className='container mx-auto text-center'>
            <h3 className='text-4xl font-bold'>Profile Page</h3>

            <Link href = {"/"}>Home page</Link>
            <h1>{session?.user?.name}</h1>
        </section>
    );
};

// export async function getServerSideProps(context: NextApiRequest) {
//     const session = await getSession({ req: context });

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



export default Profile;