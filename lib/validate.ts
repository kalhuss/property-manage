interface LoginErrors {
    name?: string;
    surname?: string;
    dob?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    cpassword?: string;
    username?: string;
}

export const validateLogin = (values: LoginErrors): LoginErrors => {
    const errors: LoginErrors = {};

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 6 || values.password.length > 20) {
        errors.password =
            "Password must be at least 6 characters and less than 20 characters";
    } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(
            values.password
        )
    ) {
        errors.password =
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
    } else if (values.password.includes(" ")) {
        errors.password = "Invalid password";
    }

    return errors;
};

export const validateRegister = (values: LoginErrors): LoginErrors => {
    const errors: LoginErrors = {};

    if (!values.name) {
        errors.name = "Name is required";
    } else if (values.name.length < 3 || values.name.length > 20) {
        errors.name =
            "Name must be at least 3 characters and less than 20 characters";
    } else if (!/^[a-zA-Z]+$/.test(values.name)) {
        errors.name = "Name must contain only letters";
    } else if (values.name.includes(" ")) {
        errors.name = "Invalid name";
    }

    if (!values.surname) {
        errors.surname = "Surname is required";
    } else if (values.surname.length < 3 || values.surname.length > 20) {
        errors.surname =
            "Surname must be at least 3 characters and less than 20 characters";
    } else if (!/^[a-zA-Z]+$/.test(values.surname)) {
        errors.surname = "Surname must contain only letters";
    } else if (values.surname.includes(" ")) {
        errors.surname = "Invalid surname";
    }

    if (!values.dob) {
        errors.dob = "Username is required";
    }

    if (!values.phoneNumber) {
        errors.phoneNumber = "Phone number is required";
    }

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 6 || values.password.length > 20) {
        errors.password =
            "Password must be at least 6 characters and less than 20 characters";
    } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(
            values.password
        )
    ) {
        errors.password =
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
    } else if (values.password.includes(" ")) {
        errors.password = "Invalid password";
    }

    if (!values.cpassword) {
        errors.cpassword = "Confirm password is required";
    } else if (values.cpassword !== values.password) {
        errors.cpassword = "Passwords do not match";
    } else if (values.cpassword.includes(" ")) {
        errors.cpassword = "Invalid password";
    }

    return errors;
};

export default validateLogin;
