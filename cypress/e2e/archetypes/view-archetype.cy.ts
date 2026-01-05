describe('Create Archetype', () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  it('should navigate to a test project and be able to view the archetype', () => {
    cy.archetypeViewReadyOrMappedProjectCard();

    cy.contains('button', 'Manage').click();

    // not sure how exactly im supposed to verify that the archetype view loaded correctly, but at least we can check that the react flow pane is visible
    cy.get('.react-flow__pane.draggable').should('be.visible');
  });
});
