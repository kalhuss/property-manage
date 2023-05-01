import Head from "next/head";
import Layout from "../layout/layout";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import { HiAtSymbol, HiUser } from "react-icons/hi";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { useFormik } from "formik";
import { validateRegister } from "lib/validate";
import { FaCalendarAlt } from "react-icons/fa";
import { AiFillPhone } from "react-icons/ai";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

// Register page
export default function Register() {
    const [show, setShow] = useState({ password: false, cpassword: false });

    // Setup formik for form validation
    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            dob: "",
            phoneNumber: "",
            email: "",
            password: "",
            cpassword: "",
        },
        validate: validateRegister,
        onSubmit: async (values) => {
            // Call the signUp API
            fetch("/api/auth/signUp", {
                method: "POST",
                body: JSON.stringify(values),
            })
                // Then go to the login page
                .then(() => (window.location.href = "/login"));
        },
    });

    // Render the register page
    return (
        <Layout>
            <Head>
                <title>Register</title>
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
            <section className="w-3/4 h-full mx-auto flex flex-col gap-10 pt-5">
                {/* Title */}
                <div className="title">
                    <h1 className="text-gray-800 text-4xl font-bold py-4">
                        Register
                    </h1>
                    <p className="w-3/4 mx-auto text-gray-400">
                        Let us help you find your next home
                    </p>
                </div>

                {/* Form */}
                <form
                    className="flex flex-col gap-5"
                    onSubmit={formik.handleSubmit}
                >
                    {/* Name */}
                    <div className={styles.input_group}>
                        <input
                            className={styles.input_text}
                            type="text"
                            placeholder="Name"
                            {...formik.getFieldProps("name")}
                        />
                        <span className="icon flex items-center px-4">
                            <HiUser size={25} />
                        </span>
                    </div>
                    {formik.touched.name && formik.errors.name ? (
                        <div className="text-red-500 text-sm">
                            {formik.errors.name}
                        </div>
                    ) : null}

                    {/* Surname */}
                    <div className={styles.input_group}>
                        <input
                            className={styles.input_text}
                            type="text"
                            placeholder="Surname"
                            {...formik.getFieldProps("surname")}
                        />
                        <span className="icon flex items-center px-4">
                            <HiUser size={25} />
                        </span>
                    </div>
                    {formik.touched.surname && formik.errors.surname ? (
                        <div className="text-red-500 text-sm">
                            {formik.errors.surname}
                        </div>
                    ) : null}

                    {/* Date of Birth */}
                    <div className={styles.input_group}>
                        <input
                            className={styles.input_text}
                            type="date"
                            placeholder="Date of Birth"
                            {...formik.getFieldProps("dob")}
                        />
                        <span className="icon flex items-center px-4">
                            <FaCalendarAlt size={20} />
                        </span>
                    </div>

                    {/* Phone Number */}
                    <div className={styles.input_group}>
                        <input
                            className={styles.input_text}
                            type="text"
                            placeholder="Phone Number"
                            {...formik.getFieldProps("phoneNumber")}
                        />
                        <span className="icon flex items-center px-4">
                            <AiFillPhone size={25} />
                        </span>
                    </div>
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <div className="text-red-500 text-sm">
                            {formik.errors.phoneNumber}
                        </div>
                    ) : null}

                    {/* Email */}
                    <div className={styles.input_group}>
                        <input
                            className={styles.input_text}
                            type="email"
                            placeholder="Email"
                            {...formik.getFieldProps("email")}
                        />
                        <span className="icon flex items-center px-4">
                            <HiAtSymbol size={25} />
                        </span>
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-sm">
                            {formik.errors.email}
                        </div>
                    ) : null}

                    {/* Password */}
                    <div className={styles.input_group}>
                        <input
                            className={styles.input_text}
                            type={show.password ? "text" : "password"}
                            placeholder="Password"
                            {...formik.getFieldProps("password")}
                        />
                        <span
                            className="icon flex items-center px-4"
                            onClick={() =>
                                setShow({ ...show, password: !show.password })
                            }
                        >
                            <FaLock size={20} />
                        </span>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm">
                            {formik.errors.password}
                        </div>
                    ) : null}

                    {/* Confirm password */}
                    <div className={styles.input_group}>
                        <input
                            className={styles.input_text}
                            type={show.cpassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...formik.getFieldProps("cpassword")}
                        />
                        <span
                            className="icon flex items-center px-4"
                            onClick={() =>
                                setShow({ ...show, cpassword: !show.cpassword })
                            }
                        >
                            <FaLock size={20} />
                        </span>
                    </div>
                    {formik.touched.cpassword && formik.errors.cpassword ? (
                        <div className="text-red-500 text-sm">
                            {formik.errors.cpassword}
                        </div>
                    ) : null}

                    {/* Login buttons */}
                    <div className="input-button">
                        <button className={styles.button} type="submit">
                            Register
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-400">
                    Already have an account?{" "}
                    <Link href={"/login"} className="text-blue-700">
                        Sign In
                    </Link>
                </p>
            </section>
        </Layout>
    );
}

// Get the offers and users for the property
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Get the session
    const session = await getSession(context);

    // If the user is logged in, redirect to the home page
    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
