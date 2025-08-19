// Example E2E test for login flow with Cypress

describe("Login Flow", () => {
  it("should successfully log in an admin user", () => {
    cy.visit("/login");

    // Select role
    cy.get("#role").click();
    cy.contains("Admin").click();

    // Click sign in
    cy.contains("button", "Sign In").click();

    // Check for redirection to dashboard
    cy.url().should("include", "/dashboard");
    cy.contains("Welcome back, Admin User").should("be.visible");
  });
});
