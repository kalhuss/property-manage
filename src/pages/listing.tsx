import { FC } from 'react';
import Head from 'next/head';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';

type Session = ReturnType<typeof useSession>["data"];
type SessionNoNull = NonNullable<Session>;

type sessionProps = {
    session: Session; 
};

const Listing: FC<sessionProps> = () => {

    const { data: session, status } = useSession();

    const formik = useFormik({
        initialValues: {
            price: "",
            size: "",
            bedrooms: "",
            bathrooms: "",
            houseType: "",
            address: "",
            tenure: "",
            taxBand: "",
            rent: "",
            keyFeatures: "",
            description: "",
            contactNumber: "",
            contactEmail: "",
            photos: "",
            floorPlan: "",
            email: session?.user?.email,
        },
        onSubmit: async (values) => {
            //call the createListing api
            fetch('/api/auth/createListing', { method: 'POST', body: JSON.stringify(values) })

        },
    });


    return (
        <>
            <Head>
                <title>Listing</title>
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


            {/* Title */}
            <h1 className="text-4xl font-bold">Create a new listing</h1>

            <section className="w-3/4 mx-auto flex flex-col gap-10">
                

                {/* Form */}
                <form className="mt-10 flex flex-col" onSubmit={formik.handleSubmit}>
                    {/* Price */}
                    <div className="flex flex-row">
                        <label htmlFor="price">Price</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("price")}
                        />
                    </div>

                    {/* Bedrooms */}
                    <div className="flex flex-row">
                        <label htmlFor="bedrooms">Bedrooms</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("bedrooms")}
                        />
                    </div>

                    {/* Bathrooms */}
                    <div className="flex flex-row">
                        <label htmlFor="bathrooms">Bathrooms</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("bathrooms")}
                        />
                    </div>

                    {/* House Type */}
                    <div className="flex flex-row">
                        <label htmlFor="houseType">House Type</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("houseType")}
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-row">
                        <label htmlFor="address">Address</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("address")}
                        />
                    </div>

                    {/* Tenure */}
                    <div className="flex flex-row">
                        <label htmlFor="tenure">Tenure</label>
                        <input
                            className='border'
                            type="text"
                            {...formik.getFieldProps("tenure")}
                        />
                    </div>

                    {/* Tax Band */}
                    <div className="flex flex-row">
                        <label htmlFor="taxBand">Tax Band</label>
                        <input

                            className="border"
                            type="text"
                            {...formik.getFieldProps("taxBand")}
                        />
                    </div>

                    {/* Rent */}
                    <div className="flex flex-row">
                        <label htmlFor="rent">Rent</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("rent")}
                        />
                    </div>

                    {/* Key Features */}
                    <div className="flex flex-row">
                        <label htmlFor="keyFeatures">Key Features</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("keyFeatures")}
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-row">
                        <label htmlFor="description">Description</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("description")}
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-row">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("contactNumber")}
                        />
                    </div>

                    {/* Contact Email */}
                    <div className="flex flex-row">
                        <label htmlFor="contactEmail">Contact Email</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("contactEmail")}
                        />
                    </div>

                    {/* Photos */}
                    <div className="flex flex-row">
                        <label htmlFor="photos">Photos</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("photos")}
                        />
                    </div>

                    {/* Floor Plan */}
                    <div className="flex flex-row">
                        <label htmlFor="floorPlan">Floor Plan</label>
                        <input
                            className="border"
                            type="text"
                            {...formik.getFieldProps("floorPlan")}
                        />
                    </div>

                    {/* Submit */}
                    <button className="bg-blue-500 text-white" type="submit">
                        Submit
                    </button>
                </form>

            </section>
        </>

    );
};

export default Listing;