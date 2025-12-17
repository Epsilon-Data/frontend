describe('Projects', () => {
  beforeEach(() => {
    cy.login();
  });

  // test the happy path of creating a project
  it('can create a project', () => {
    const projectName = 'E2E Project 1 TESTING PENDING';

    cy.viewport(1920, 1080);
    cy.visit('/');

    // creating a new project
    cy.contains('New project').click();

    // About Project modal
    // project name
    cy.get('input[placeholder="e.g. Student Learning Analytics Study"]').type(projectName);

    // project dates
    cy.get('input[placeholder="Start date"]').type('2025-01-01{enter}');
    cy.get('input[placeholder="End date"]').type('2025-12-31{enter}');

    // description
    cy.get('textarea[placeholder="Enter a brief description about your project"]').type(
      'This is a very brief description',
    );

    // participant count
    cy.get('input[placeholder="e.g., 150"]').type('150');

    // team members
    cy.get('input[placeholder="Enter team member\'s email address"]').type('vincentliem385@gmail.com');
    cy.get('[data-testid="add-member"]').click(); // im taking the easy way out and adding a data-testid prop to some html elements

    cy.get('input[placeholder="Enter team member\'s email address"]').clear().type('vincentliem3852@gmail.com');
    cy.get('[data-testid="role-select"]').click();
    cy.contains('.ant-select-item-option-content', 'Admin').click();
    cy.get('[data-testid="add-member"]').click();

    // tags
    cy.get('[data-testid="tag-input"]').type('Body Health, Liver Function, Cardiovascular Activities, ');

    // go to next step
    cy.contains('button', 'Next').click();

    // University details modal
    cy.get('input[placeholder="Enter your university name"]').type('Monash University');
    cy.get('input[placeholder="Enter faculty name"]').type('Faculty of Information Technology');
    cy.get('input[placeholder="Enter ethics approval ID"]').type('ECR-2025-123');

    // go to next step
    cy.contains('button', 'Next').click();

    // Database modal
    cy.get('input[placeholder="Enter your database name"]').type('Some Postgres DB Name');
    // assume its using postgres by default, so no need to change db type
    // cy.contains('PostgreSQL').click();
    // cy.contains('CSV').click();
    cy.contains('label', 'No').click(); // this should be a radio but ant design uses labels?
    cy.get('input[placeholder="Enter database owner\'s email address"]').type('vincentliem3853@gmail.com');

    // go to next step
    cy.contains('button', 'Next').click();

    // Confirmation modal
    cy.get('input[type="checkbox"]').eq(0).check({ force: true });
    cy.get('input[type="checkbox"]').eq(1).check({ force: true });
    cy.get('input[type="checkbox"]').eq(2).check({ force: true });

    // submit the form
    // this works but im commenting it out so it doesnt submit every time i run e2e tests
    cy.contains('button', 'Submit').click();

    // wait for modal to close, not sure if this is needed seeing how the calendar
    cy.url({ timeout: 5000 }).should('include', '/');

    // make sure the newly created card has PENDING status
    cy.contains('.ant-card', projectName, { timeout: 10000 }).within(() => {
      cy.get('.ant-tag').should('contain.text', 'Pending');
    });
  });
});
