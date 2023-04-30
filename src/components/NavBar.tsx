import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineUserCircle } from "react-icons/hi";
import Router from "next/router";

type NavbarProps = {
    isLoggedIn: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleProfileMenuOpen = () => {
        setIsProfileMenuOpen(true);
    };

    const handleProfileMenuClose = () => {
        setIsProfileMenuOpen(false);
    };

    return (
        <nav className="flex items-center justify-between flex-wrap bg-white bg-opacity-80 p-6 px-10 w-full fixed z-20">
            <div className="flex items-center flex-shrink-0 text-black mr-6">
                <Link href="/">
                    <div className="block group text-lg mt-4 lg:inline-block lg:mt-0 font-bold text-black relative">
                        Real Estate
                        <span className="absolute bottom-0 group-hover:w-full left-0 w-0 h-0.5 bg-blue-500  transition-all duration-300 origin-left"></span>
                    </div>
                </Link>
            </div>
            <div className="w-full flex lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow mr-20">
                    <Link href="/properties">
                        <div className="block group text-lg mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-500 relative">
                            Properties
                            <span className="absolute bottom-0 group-hover:w-full left-0 w-0 h-0.5 bg-blue-500  transition-all duration-300 origin-left"></span>
                        </div>
                    </Link>
                </div>
                {isLoggedIn ? (
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                className=""
                                onMouseEnter={handleProfileMenuOpen}
                                onClick={() => Router.push("/profile")}
                            >
                                <span className="icon flex items-center px-4">
                                    <HiOutlineUserCircle
                                        size={25}
                                        className="hover:text-blue-500"
                                    />
                                </span>
                            </button>
                            {isProfileMenuOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                                    onMouseEnter={handleProfileMenuOpen}
                                    onMouseLeave={handleProfileMenuClose}
                                >
                                    <div
                                        className="py-1"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                    >
                                        <Link href="/profile">
                                            <div
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                role="menuitem"
                                                onClick={handleProfileMenuClose}
                                            >
                                                Profile
                                            </div>
                                        </Link>
                                        <Link href="/myListings">
                                            <div
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                role="menuitem"
                                                onClick={handleProfileMenuClose}
                                            >
                                                My Listings
                                            </div>
                                        </Link>
                                        <Link href="/listing">
                                            <div
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                role="menuitem"
                                                onClick={handleProfileMenuClose}
                                            >
                                                New Listing
                                            </div>
                                        </Link>
                                        <Link href="/offers">
                                            <div
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                role="menuitem"
                                                onClick={handleProfileMenuClose}
                                            >
                                                My Offers
                                            </div>
                                        </Link>
                                        <div
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                            role="menuitem"
                                            onClick={() => signOut()}
                                        >
                                            Sign Out
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <Link href="/login">
                            <div className="inline-block text-lg px-4 py-2 leading-none border rounded text-black border-white hover:border-transparent hover:text-indigo-500 hover:bg-white mt-4 lg:mt-0">
                                <span className="icon flex items-center px-4">
                                    <HiOutlineUserCircle
                                        size={25}
                                        className="mr-2"
                                    />
                                    Login
                                </span>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
