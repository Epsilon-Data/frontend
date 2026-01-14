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

type roles = 'owner' | 'researcher' | 'admin';

declare namespace Cypress {
  interface Chainable<Subject> {
    login(role: roles, ...options: any): Chainable<JQuery<HTMLElement>>;
    archetypeViewReadyOrMappedProjectCard(...options: any): Chainable<JQuery<HTMLElement>>;
    archetypeFillName(title: string, ...options: any): Chainable<JQuery<HTMLElement>>;
    archetypeCreateNode(...options: any): Chainable<JQuery<HTMLElement>>;
    archetypeMapNodeToColumn(...options: any): Chainable<JQuery<HTMLElement>>;
    archetypeSetPermissionForRow(permissionIndex: 0 | 1, ...options: any): Chainable<JQuery<HTMLElement>>;
    createProjectWithDBConnection(title: string, ...options: any): Chainable<JQuery<HTMLElement>>;
  }
}

/**
 * log into Epsilon
 */
Cypress.Commands.add('login', (role: roles) => {
  cy.session('user-session', () => {
    cy.visit('/auth/login');

    // intercept the login requests to add the correct origin header
    // this took me 5 hours to figure out
    cy.intercept('POST', '/api/v1/token/login/start', (req) => {
      req.headers['origin'] = 'http://localhost:3000';
    }).as('loginRequest');

    cy.get('#username').type(Cypress.env(`${role}_username`));
    cy.get('#password').type(Cypress.env(`${role}_password`));
    cy.get('#kc-login').click();

    cy.intercept('POST', '/api/v1/token/login/end', (req) => {
      req.headers['origin'] = 'http://localhost:3000';
    }).as('loginRequest');

    cy.url().should('not.include', 'keycloak');
  });
});

/**
 * view a project card that is either READY or MAPPED
 */
Cypress.Commands.add('archetypeViewReadyOrMappedProjectCard', () => {
  // find any project card that has "Ready" or "Mapped" status tag
  cy.get('.ant-card')
    .filter(':has(.ant-tag)')
    .filter((index, card) => {
      const tagText = Cypress.$(card).find('.ant-tag').text();
      return tagText.includes('Ready') || tagText.includes('Mapped');
    })
    .first() // select the first matching card because i think it doesnt matter, as long as its ready or mapped
    .as('testProjectCard'); // alias it for later use

  // view project and create new template
  cy.get('@testProjectCard').trigger('mouseover');
  cy.get('@testProjectCard').find('button').contains('View project').click();
});

/**
 * fills in the name of the archetype
 */
Cypress.Commands.add('archetypeFillName', (title: string) => {
  cy.get('.ant-modal input[type="text"]').type(title);
});

/**
 * creates a new node in the react flow archetype editor
 */
Cypress.Commands.add('archetypeCreateNode', () => {
  cy.contains('.react-flow__node', 'Main Entity')
    .click()
    .within(() => {
      cy.get('.react-flow__handle')
        .should('exist')
        .trigger('mousedown', { button: 0 })
        .trigger('mousemove', { clientX: 100, clientY: 50 })
        .trigger('mouseup', { force: true });
    });
});

/**
 * maps the default "Category 1" node to a column
 */
Cypress.Commands.add('archetypeMapNodeToColumn', () => {
  cy.contains('.react-flow__node', 'Category 1').click();

  cy.get('button.mt-2.w-full.text-left.rounded-md.border.border-sky-300.hover\\:bg-sky-50').first().click();
});

Cypress.Commands.add('archetypeSetPermissionForRow', (permissionIndex: 0 | 1) => {
  // cy.contains('tr').eq(0).find('.ant-radio-input').eq(permissionIndex).check();
  cy.get('[data-testid="permissions-step"]').find('tbody tr').first().find('.ant-radio').eq(permissionIndex).click();
});
