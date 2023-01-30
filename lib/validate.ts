
interface LoginErrors {
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
        errors.password = "Password must be at least 6 characters and less than 20 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(values.password)) {
        errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
    } else if (values.password.includes(" ")) {
        errors.password = "Invalid password";
    }

    return errors;
};

export const validateRegister = (values: LoginErrors): LoginErrors => {

    const errors: LoginErrors = {};

    if (!values.username){
        errors.username = "Username is required";
    } else if (values.username.length < 3 || values.username.length > 20) {
        errors.username = "Username must be at least 3 characters and less than 20 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(values.username)) {
        errors.username = "Username must contain only letters and numbers";
    } else if (values.username.includes(" ")) {
        errors.username = "Invalid username";
    }


    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 6 || values.password.length > 20) {
        errors.password = "Password must be at least 6 characters and less than 20 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(values.password)) {
        errors.password = "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
    } else if (values.password.includes(" ")) {
        errors.password = "Invalid password";
    }

    if (!values.cpassword){
        errors.cpassword = "Confirm password is required";
    } else if (values.cpassword !== values.password){
        errors.cpassword = "Passwords do not match";
    } else if (values.cpassword.includes(" ")) {
        errors.cpassword = "Invalid password";
    }

    return errors;
};

export default validateLogin;