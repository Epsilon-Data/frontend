describe('Create Archetype', () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  it('should navigate to a test project and be able to start defining the object, its categories, and columns in the dataset ', () => {
    cy.archetypeViewReadyOrMappedProjectCard();

    cy.archetypeFillName('Test Archetype Template CYPRESS');
    cy.contains('button', 'Next').click();

    cy.archetypeCreateNode();
    cy.contains('button', 'Next').click();

    cy.contains('.react-flow__node', 'Category 1').click();

    // verify the Columns sidebar/panel appears
    cy.contains('Columns').should('be.visible');
  });
});
