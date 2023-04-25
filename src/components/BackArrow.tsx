import React from "react";
import { Property } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/router";

interface BackArrowProps {
    label: string;
}

const BackArrow = ({ label }: BackArrowProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    };

    return (
        <button className="flex pb-5" onClick={handleClick}>
            <span className="text-2xl font-bold mr-2">
                <BsArrowLeft className="group"/>
            </span>
            <div className="block group text-lg mt-4 lg:inline-block lg:mt-0 font-bold text-black relative">
                {label}
                <span className="absolute bottom-0 group-hover:w-full left-0 w-0 h-0.5 bg-blue-500  transition-all duration-300 origin-left"></span>
            </div>
        </button>
    );
};

export default BackArrow;
