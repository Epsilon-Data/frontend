describe('Browse Projects - Search with extracted data', () => {
  let projectTitle: string;
  let organization: string;
  let keywords: string[] = [];

  before(() => {
    cy.login('owner');
    cy.viewport(1920, 1080);
    cy.visit('/browse');

    cy.get('.ant-card')
      .first()
      .within(() => {
        cy.get('div[class*="text-xs"]')
          .eq(0)
          .invoke('text')
          .then((txt) => {
            projectTitle = txt.trim();
          });
        cy.get('div[class*="text-xs"]')
          .eq(1)
          .invoke('text')
          .then((txt) => {
            organization = txt.replace(/^By:\s*/, '').trim();
          });
      });

    // Open modal and get keywords
    cy.get('.ant-card').first().trigger('mouseover');
    cy.get('.ant-card').first().find('button').click();

    cy.get('.ant-modal')
      .should('be.visible')
      .within(() => {
        cy.get('.ant-tag').then(($tags) => {
          keywords = Array.from($tags).map((tag) => tag.innerText.trim());
        });
      });

    cy.get('.ant-modal-mask').click({ force: true });
  });

  beforeEach(() => {
    cy.login('owner');
    cy.viewport(1920, 1080);
  });

  it('should search using extracted title', () => {
    cy.visit('/browse');

    // checkk All fields filter
    cy.get('input[placeholder*="Search"]').type(projectTitle);
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('be.visible');

    // check Project title filter
    cy.contains('label', 'Project title').click();
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('be.visible');
  });

  it('should search using extracted keyword', () => {
    cy.visit('/browse');

    cy.get('input[placeholder*="Search"]').type(keywords[0]);
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('be.visible');

    cy.contains('label', 'Keywords').click();
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('be.visible');
  });

  it('should search using extracted organization', () => {
    cy.visit('/browse');

    cy.get('input[placeholder*="Search"]').type(organization);
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('be.visible');

    cy.contains('label', 'Organisation(s)').click();
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('be.visible');
  });

  it('should NOT show card when searching with invalid title', () => {
    cy.visit('/browse');
    cy.contains('label', 'Project title').click();
    cy.get('input[placeholder*="Search"]').type(projectTitle + '💀'); // add a 💀 so that the project doesnt show up
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('not.exist');
  });

  it('should NOT show card when searching with invalid keyword', () => {
    cy.visit('/browse');
    cy.contains('label', 'Keywords').click();
    cy.get('input[placeholder*="Search"]').type(keywords[0] + '💀');
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('not.exist');
  });

  it('should NOT show card when searching with invalid organization', () => {
    cy.visit('/browse');
    cy.contains('label', 'Organisation(s)').click();
    cy.get('input[placeholder*="Search"]').type(organization + '💀');
    cy.get('input[placeholder*="Search"]').type('{enter}');
    cy.contains('.ant-card', projectTitle).should('not.exist');
  });
});
