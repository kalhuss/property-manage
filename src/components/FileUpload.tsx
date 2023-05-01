import React from "react";

// Props for the element
interface InputProps {
    labelName: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Function to generate the elements
const FileUpload: React.FC<InputProps> = ({ labelName, onChange }) => {
    return (
        // Custom file upload input
        <div className="flex flex-col">
            <label htmlFor={labelName} className="font-bold">
                {labelName}
            </label>
            <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                multiple
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 dark:border-neutral-600 bg-clip-padding py-[0.32rem] px-3 text-base font-normal text-neutral-700 dark:text-neutral-200 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 dark:file:bg-neutral-700 file:px-3 file:py-[0.32rem] file:text-neutral-700 dark:file:text-neutral-100 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
                onChange={(e) => {
                    onChange(e);
                }}
            />
        </div>
    );
};

export default FileUpload;
