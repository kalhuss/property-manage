import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/router";

// Props for the BackArrow component
interface BackArrowProps {
    label: string;
    url: string;
}

// BackArrow component
const BackArrow = ({ label, url }: BackArrowProps) => {
    const router = useRouter();

    // Function to handle the click on the back arrow
    const handleClick = (url: string) => {
        if (url === "back") {
            router.back();
        } else {
            router.push(url);
        }
    };

    // Return the BackArrow component
    return (
        <button className="flex pb-5" onClick={() => handleClick(url)}>
            <span className="text-2xl font-bold mr-2">
                <BsArrowLeft className="group" />
            </span>
            <div className="block group text-lg mt-4 lg:inline-block lg:mt-0 font-bold text-black relative">
                {label}
                <span className="absolute bottom-0 group-hover:w-full left-0 w-0 h-0.5 bg-blue-500  transition-all duration-300 origin-left"></span>
            </div>
        </button>
    );
};

export default BackArrow;
