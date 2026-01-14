describe('Browse Projects - Search with extracted data', () => {
  let projectTitle: string;
  let organization: string;
  let keywords: string[] = [];

  before(() => {
    cy.login('researcher');
    cy.viewport(1920, 1080);
    cy.visit('/browse');
  });

  it('should go to the request access modal and successfully fill in the form', () => {
    cy.intercept('GET', '/api/v1/hub/project/**/public').as('getProjectPublic');
    cy.intercept('GET', '/api/v1/hub/archetype/**/published').as('getArchetypePublished');

    // Open modal
    cy.get('.ant-card').first().trigger('mouseover');
    cy.get('.ant-card').first().find('button').click();

    cy.wait(['@getProjectPublic', '@getArchetypePublished']);

    cy.get('.ant-modal')
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Request access').click();
      });

    cy.get('input[placeholder="e.g. Student Learning Analytics Study"]').type('Student Learning Analytics Study');

    cy.get('input[placeholder="Start date"]').type('2025-01-01{enter}');
    cy.get('input[placeholder="End date"]').type('2025-12-31{enter}');

    cy.get('input[placeholder="Describe the purpose, methodology, and scope of your research project."]').type(
      'lorem ipsum or sum idk',
    );

    cy.get('input[placeholder="e.g., HREC-2024-001234"]').type('ECE-2025-5678');

    cy.get('input[placeholder="What specific goals do you aim to achieve with this research?"]').type('yeah idk');

    cy.get('input[placeholder="What results or deliverables do you expect from this project?"]').type(
      'im gonna crash out',
    );

    cy.contains('div', 'Project team members')
      .parent()
      .parent()
      .find('.ant-select')
      .click()
      .type('researcher1@gmail.com, researcher2@gmail.com{enter}');

    cy.contains('button', 'Submit').click();
  });
});
