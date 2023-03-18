import React from "react";
import { useFormik } from "formik";

interface InputProps {
    getFieldProps: ReturnType<typeof useFormik>["getFieldProps"];
    labelName: string;
    inputType: string;
    formikName: string;
}

const ListingInput: React.FC<InputProps> = ({
    getFieldProps,
    labelName,
    inputType,
    formikName,
}) => {
    return (
        <>
            {inputType === "textarea" ? (
                <div className="flex flex-col row-span-2">
                    <label htmlFor={labelName} className="font-bold">
                        {labelName}
                    </label>
                    <textarea
                        className="p-1 border h-full resize-none rounded-lg bg-gray-50 border-gray-300 text-gray-900"
                        {...getFieldProps(formikName)}
                    />
                </div>
            ) : inputType === "dropdown" ? (
                <div className="flex flex-col">
                    <label htmlFor={labelName} className="font-bold">
                        {labelName}
                    </label>
                    <select
                        className="p-1 border rounded-lg bg-gray-50 border-gray-300 text-gray-900"
                        {...getFieldProps(formikName)}
                    >
                        <option value="">Select an option</option>
                        <option value="for sale">Sale</option>
                        <option value="to rent">Rent</option>
                        <option value="to let">Let</option>
                        <option value="to lease">Lease</option>
                    </select>
                </div>
            ) : (
                <div className="flex flex-col">
                    <label htmlFor={labelName} className="font-bold">
                        {labelName}
                    </label>
                    <input
                        className="p-1 border rounded-lg bg-gray-50 border-gray-300 text-gray-900"
                        type={inputType}
                        {...getFieldProps(formikName)}
                    />
                </div>
            )}
        </>
    );
};

export default ListingInput;
