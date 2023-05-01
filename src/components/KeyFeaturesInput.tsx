import { useState } from "react";
import Image from "next/image";

// Props for the element
interface KeyFeaturesInputProps {
    setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => void;
}

// Function to generate the elements
const KeyFeaturesInput: React.FC<KeyFeaturesInputProps> = ({
    setFieldValue,
}) => {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    // Event handlers
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setFieldValue("keyFeatures", [...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleTagRemove = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // Return the KeyFeaturesInput component
    return (
        <div className="flex flex-col items-start w-full">
            <label className="mb-1 font-bold" htmlFor="keyFeatures">
                Key Features
            </label>
            <div className="flex flex-wrap items-center w-full py-2 px-1 border rounded-lg bg-gray-50 border-gray-300 text-gray-900">
                {/* Map the tags */}
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 mx-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                    >
                        {tag}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center ml-2 text-gray-400 bg-transparent rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => handleTagRemove(tag)}
                        >
                            <span className="sr-only">Remove tag</span>
                            <Image src="/assets/x-circle.svg" width={20} height={20} alt="x circle" /> 
                        </button>
                    </span>
                ))}
                <input
                    className="flex-1 ml-2 outline-none bg-transparent"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Add a feature then press enter"
                />
            </div>
        </div>
    );
};

export default KeyFeaturesInput;
