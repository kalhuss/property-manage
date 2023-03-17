import { useState } from "react";

interface KeyFeaturesInputProps {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

const KeyFeaturesInput: React.FC<KeyFeaturesInputProps> = ({setFieldValue}) => {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

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

    return (
        <div className="flex flex-col items-start w-full">
            <label className="mb-1 font-bold" htmlFor="keyFeatures">Key Features</label>
            <div className="flex flex-wrap items-center w-full py-2 px-1 border rounded-lg bg-gray-50 border-gray-300 text-gray-900">
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
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 011.414 1.414L11.414 12l1.293 1.293a1 1 0 01-1.414 1.414L10 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 12 7.293 10.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
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