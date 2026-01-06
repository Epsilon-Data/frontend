describe('Create Archetype', () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  it('should navigate to a test project and create permissions for the archetype', () => {
    cy.archetypeViewReadyOrMappedProjectCard();
    cy.contains('button', 'New template').click();

    cy.archetypeFillName('Test Archetype Template CYPRESS');
    cy.contains('button', 'Next').click();

    cy.archetypeCreateNode();
    cy.contains('button', 'Next').click();

    cy.archetypeMapNodeToColumn();
    cy.contains('button', 'Next').click();

    // test that setting both permissions works
    cy.archetypeSetPermissionForRow(0);
    cy.archetypeSetPermissionForRow(1);
    cy.contains('button', 'Save database mapping').click();
  });
});
