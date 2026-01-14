describe('Create Archetype', () => {
  beforeEach(() => {
    cy.login('owner');
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  it('should navigate to a the metadata page and check that the erd and table information tabs are there', () => {
    cy.archetypeViewReadyOrMappedProjectCard();
    cy.get('.ant-layout-sider-children').contains('Metadata').click();

    // ensure the svg with the erd is visible
    cy.wait(5000);
    cy.get('svg#erd-svg').should('be.visible');

    // go to "Table Information" tab and make sure the dropdown has at least 1 option
    cy.contains('.ant-tabs-tab', 'Table Information').click();
    cy.get('.ant-select').click();

    cy.get('.ant-select-dropdown')
      .wait(5000)
      .should('be.visible')
      .find('.ant-select-item-option')
      .should('have.length.greaterThan', 0);

    cy.get('.ant-select-item-option').first().click();
  });
});
