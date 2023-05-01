import React from "react";
import { FC } from "react";
import styles from "../styles/Layout.module.css";
import NavBar from "@/components/NavBar";
import { useSession } from "next-auth/react";

// Props for the Layout component
interface LayoutProps {
    children: React.ReactNode;
}

// Layout component
const Layout: FC<LayoutProps> = ({ children }) => {
    // Get the session
    const { data: session } = useSession();

    return (
        <>
            <NavBar isLoggedIn={!!session} />
            <div className="flex h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
                <div className="m-auto bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2">
                    <div className={styles.imgStyle}>
                        <div className={styles.layoutImg}></div>
                    </div>

                    <div className="right flex flex-col justify-evenly">
                        <div className="text-center py-10">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
