// import { mount } from "@cypress/react";
// import Login from "../../pages/login";
/// <reference types="cypress" />
describe("Login", () => {
    beforeEach(() => {
        // Visit the login page
        cy.visit("/login");
    });

    it("should display the login form", () => {
        // Check that the email and password inputs exist
        cy.get("input[name='email']").should("exist");
        cy.get("input[name='password']").should("exist");

        // Check that the login button exists
        cy.contains("Login").should("exist");
    });

    it("should show an error message when the email or password is invalid", () => {
        // Type an invalid email and password into the form
        cy.get("input[name='email']").type("invalidemail@example.com");
        cy.get("input[name='password']").type("invalidpassword");

        // Submit the form
        cy.get("form").submit();

        // Check that the error message is displayed
        cy.contains("Invalid email or password").should("exist");
    });

    it("successfully signs in a user", () => {
        const { email, password } = { email: "test@test.com", password: "Test123!" };
        cy.visit("/login");

        // Fill out the email and password fields
        cy.get("input[type=email]").type("test@test.com");
        cy.get("input[type=password]").type("Test123!");

        // Submit the form
        cy.get("form").submit();

        cy.window().then((window) => {
            cy.stub(window, "fetch").resolves(
                new Response(JSON.stringify({ ok: true }), { status: 200 })
            );
        });

        // Check that the user is redirected to the home page
        cy.url().should("include", "/");
    });
});
