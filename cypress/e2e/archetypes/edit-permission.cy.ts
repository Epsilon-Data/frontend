describe('Create Archetype', () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  it('should navigate to a test project and create permissions for the archetype', () => {
    cy.archetypeViewReadyOrMappedProjectCard();
    cy.contains('button', 'Manage').click();

    cy.contains('button', 'Edit template').click();
    cy.contains('button', 'Next').click(); // template Name to db structure
    cy.contains('button', 'Next').click(); // db structure to node mapping
    cy.contains('button', 'Next').click(); // node mapping to permissions

    cy.archetypeSetPermissionForRow(1);
    cy.archetypeSetPermissionForRow(0);
    cy.contains('button', 'Save database mapping').click();

    // do the reverse to verify it actually swaps
    cy.contains('button', 'Edit template').click();
    cy.contains('button', 'Next').click(); // template Name to db structure
    cy.contains('button', 'Next').click(); // db structure to node mapping
    cy.contains('button', 'Next').click(); // node mapping to permissions

    cy.archetypeSetPermissionForRow(0);
    cy.archetypeSetPermissionForRow(1);
    cy.contains('button', 'Save database mapping').click();
  });
});
