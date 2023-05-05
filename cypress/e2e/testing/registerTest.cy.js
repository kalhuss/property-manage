/// <reference types="cypress" />

describe("Register", () => {
    beforeEach(() => {
        cy.visit("/register");
    });

    it("displays the register form", () => {
        cy.get("form").should("be.visible");
    });

    it("validates name input", () => {
        cy.get('input[name="name"]').type("123", {force: true}).click({force: true});
        cy.get('input[name="surname"]').click({force: true});
        cy.contains("Name must contain only letters").should("be.visible");

        // Remove the current text
        cy.get('input[name="name"]').clear({force: true});

        cy.get('input[name="name"]').type("John", {force: true});
        cy.get('input[name="surname"]').click({force: true});
        cy.get('[data-cy="name-error"]').should("not.exist");
    });

    it("validates surname input", () => {
        cy.get('input[name="surname"]').type("123", {force: true}).click({force: true});
        cy.get('input[name="email"]').click({force: true});
        cy.contains("Surname must contain only letters").should("be.visible");

        // Remove the current text
        cy.get('input[name="surname"]').clear({force: true});

        cy.get('input[name="surname"]').type("Doe", {force: true});
        cy.get('input[name="email"]').click({force: true});
        cy.get('[data-cy="surname-error"]').should("not.exist");
    });

    it("validates email input", () => {
        cy.get('input[name="email"]').type("invalidemail", {force: true}).click({force: true});
        cy.get('input[name="phoneNumber"]').click({force: true});
        cy.contains("Email is invalid").should("be.visible");

        // Remove the current text
        cy.get('input[name="email"]').clear({force: true});

        cy.get('input[name="email"]').type("johndoe@gmail.com", {force: true});
        cy.get('input[name="phoneNumber"]').click({force: true});
        cy.get('[data-cy="email-error"]').should("not.exist");
    });

    it("validates phone number input", () => {
        cy.get('input[name="phoneNumber"]').type("123", {force: true}).click({force: true});
        cy.get('input[name="phoneNumber"]').clear({force: true});
        cy.get('input[name="email"]').click({force: true});
        cy.contains("Phone number is required").should("be.visible");

        // Remove the current text
        cy.get('input[name="phoneNumber"]').clear({force: true});

        cy.get('input[name="phoneNumber"]').type("1234567890", {force: true});
        cy.get('input[name="dob"]').click({force: true});
        cy.get('[data-cy="phoneNumber-error"]').should("not.exist");
    });

    it("validates email input", () => {
        cy.get('input[name="email"]').type("invalidemail", {force: true}).click({force: true});
        cy.get('input[name="phoneNumber"]').click({force: true});
        cy.contains("Email is invalid").should("be.visible");

        // Remove the current text
        cy.get('input[name="email"]').clear({force: true});

        cy.get('input[name="email"]').type("johndoe@gmail.com", {force: true});
        cy.get('input[name="phoneNumber"]').click({force: true});
        cy.get('[data-cy="email-error"]').should("not.exist");
    });

    it("validates password", () => {
        cy.get('input[name="password"]').type("123", {force: true}).click({force: true});
        cy.get('input[name="cpassword"]').click({force: true});
        cy.contains("Password must be at least 6 characters and less than 20 characters").should("be.visible");

        // Remove the current text
        cy.get('input[name="password"]').clear({force: true});

        cy.get('input[name="password"]').type("password123", {force: true});
        cy.get('input[name="cpassword"]').click({force: true});
        cy.contains("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character").should("be.visible");

        // Remove the current text
        cy.get('input[name="password"]').clear({force: true});

        cy.get('input[name="password"]').type("Test123!", {force: true});
        cy.get('input[name="cpassword"]').click({force: true});
        cy.get('[data-cy="password-error"]').should("not.exist");
    });

    it("validates confirm password", () => {
        cy.get('input[name="password"]').type("Test123!", {force: true});
        cy.get('input[name="cpassword"]').type("password", {force: true});
        cy.get('input[name="email"]').click({force: true});
        cy.get('input[name="cpassword"]').click({force: true});
        cy.contains("Passwords do not match").should("be.visible");

        // Remove the current text
        cy.get('input[name="cpassword"]').clear({force: true});

        cy.get('input[name="cpassword"]').type("Test123!", {force: true});
        cy.get('[data-cy="cpassword-error"]').should("not.exist");
    });

    it("submits the form with valid inputs", () => {
        cy.get('input[name="name"]').type("John", {force: true});
        cy.get('input[name="surname"]').type("Doe", {force: true});
        cy.get('input[name="dob"]').type("2000-01-01", {force: true});
        cy.get('input[name="phoneNumber"]').type("1234567890", {force: true});
        cy.get('input[name="email"]').type("johndoe@gmail.com", {force: true});
        cy.get('input[name="password"]').type("Test123!", {force: true});
        cy.get('input[name="cpassword"]').type("Test123!", {force: true});
        cy.get('button[type="submit"]').click({force: true});

        // check if redirected to the login page
        cy.url().should("include", "/login");
    });
    

    // it("submits the form with valid inputs", () => {
    //     cy.get('input[name="name"]').type("John");
    //     cy.get('input[name="surname"]').type("Doe");
    //     cy.get('input[name="dob"]').type("2000-01-01");
    //     cy.get('input[name="phoneNumber"]').type("+1234567890");
    //     cy.get('input[name="email"]').type("test@example.com");
    //     cy.get('input[name="password"]').type("password123");
    //     cy.get('input[name="cpassword"]').type("password123");
    //     cy.get('button[type="submit"]').click();

    //     // check if redirected to the login page
    //     cy.url().should("include", "/login");
    });
// });
