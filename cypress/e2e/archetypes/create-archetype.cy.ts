describe('Create Archetype', () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  it('should navigate to a test project and create archetype', () => {
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
    cy.contains('button', 'New template').click();

    cy.get('.ant-modal input[type="text"]').type('Test Archetype Template CYPRESS');
    cy.contains('button', 'Next').click();

    // create a new react flow node
    cy.contains('.react-flow__node', 'Main Entity')
      .click()
      .within(() => {
        cy.get('.react-flow__handle')
          .should('exist')
          .trigger('mousedown', { button: 0 })
          .trigger('mousemove', { clientX: 100, clientY: 50 }) // Adjust coordinates as needed
          .trigger('mouseup', { force: true });
      });
    cy.contains('button', 'Next').click();

    cy.contains('.react-flow__node', 'Category 1').click();

    // Verify the Columns sidebar/panel appears
    cy.contains('Columns').should('be.visible');
  });
});
