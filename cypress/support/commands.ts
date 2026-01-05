/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

declare namespace Cypress {
  interface Chainable<Subject> {
    login(...options: any): Chainable<JQuery<HTMLElement>>;
  }
}

/**
 * log into Epsilon
 */
Cypress.Commands.add('login', () => {
  cy.session('user-session', () => {
    cy.visit('/auth/login');

    // intercept the login requests to add the correct origin header
    // this took me 5 hours to figure out
    cy.intercept('POST', '/api/v1/token/login/start', (req) => {
      req.headers['origin'] = 'http://localhost:3000';
    }).as('loginRequest');

    cy.get('#username').type(Cypress.env('username'));
    cy.get('#password').type(Cypress.env('password'));
    cy.get('#kc-login').click();

    cy.intercept('POST', '/api/v1/token/login/end', (req) => {
      req.headers['origin'] = 'http://localhost:3000';
    }).as('loginRequest');

    cy.url().should('not.include', 'keycloak');
  });
});
