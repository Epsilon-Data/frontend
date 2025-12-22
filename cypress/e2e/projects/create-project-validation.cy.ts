// Test validation and error handling for project creation

const validFormData = {
  projectName: 'Test Project CYPRESS',
  startDate: '2025-01-01{enter}',
  endDate: '2025-12-31{enter}',
  description: 'This is a valid test description',
  participantCount: '150',
  teamMemberEmail: 'valid@email.com',
  tags: 'Test, Validation, Cypress, ',
  universityName: 'Monash University',
  facultyName: 'Faculty of IT',
  ethicsId: 'ETH-2025-123',
  databaseName: 'Test Database',
  databaseURL: 'postgresql://localhost:5432/test',
  ownerEmail: 'owner@email.com',
};

describe('Project Creation - Validation', () => {
  beforeEach(() => {
    cy.login();
    cy.viewport(1920, 1080);
    cy.visit('/');
    cy.contains('New project').click();
  });

  describe('About project validation', () => {
    // Valid data for the entire form
    const validFormData = {
      projectName: 'Test Project CYPRESS',
      startDate: '2025-01-01{enter}',
      endDate: '2025-12-31{enter}',
      description: 'This is a valid test description',
      participantCount: '150',
      teamMemberEmail: 'valid@email.com',
      tags: 'Test, Validation, Cypress, ',
    };

    // Fill form with valid data
    const fillValidFirstModal = () => {
      cy.get('input[placeholder="e.g. Student Learning Analytics Study"]').type(validFormData.projectName);
      cy.get('input[placeholder="Start date"]').type(validFormData.startDate);
      cy.get('input[placeholder="End date"]').type(validFormData.endDate);
      cy.get('textarea[placeholder="Enter a brief description about your project"]').type(validFormData.description);
      cy.get('input[placeholder="e.g., 150"]').type(validFormData.participantCount);
      cy.get('input[placeholder="Enter team member\'s email address"]').type(validFormData.teamMemberEmail);
      cy.get('[data-testid="add-member"]').click();
      cy.get('[data-testid="tag-input"]').type(validFormData.tags);
    };

    // Validation test cases
    const validationCases = [
      {
        name: 'empty project name',
        field: 'input[placeholder="e.g. Student Learning Analytics Study"]',
        validInput: validFormData.projectName,
        invalidInput: '',
        clearInput: true,
        expectedError: 'This field is required',
        triggerValidation: () => cy.contains('button', 'Next').click(),
        skipAddMember: false,
      },
      {
        name: 'negative participant count',
        field: 'input[placeholder="e.g., 150"]',
        validInput: validFormData.participantCount,
        invalidInput: '-5',
        clearInput: true,
        expectedError: 'Please enter a whole number 0 or greater',
        triggerValidation: () => cy.contains('button', 'Next').click(),
        skipAddMember: false,
      },
      {
        name: 'invalid email format',
        field: 'input[placeholder="Enter team member\'s email address"]',
        validInput: validFormData.teamMemberEmail,
        invalidInput: 'notanemail',
        clearInput: true,
        expectedError: 'The input is not a valid email',
        triggerValidation: () => cy.get('[data-testid="add-member"]').click(),
        skipAddMember: true, // Don't add member in fillValidFirstModal for this test
      },
    ];

    validationCases.forEach((data) => {
      it(`should validate ${data.name}`, () => {
        // fill form with all valid data then replace field with invalid input
        fillValidFirstModal();

        if (data.clearInput) {
          cy.get(data.field).clear();
        }

        if (data.invalidInput) {
          cy.get(data.field).click().type(data.invalidInput);
        }

        // triggers validation
        data.triggerValidation();
        cy.contains(data.expectedError).should('be.visible');

        // fill with valid input and check that the error is gone
        cy.get(data.field).clear().type(data.validInput);
        cy.contains(data.expectedError).should('not.exist');

        if (!data.skipAddMember && data.name === 'invalid email format') {
          cy.get('[data-testid="add-member"]').click();
        }
      });
    });

    it('should validate less than 2 tags', () => {
      // fill valid form first, cant use fillValidFirstModal() because i cant figure out how to remove tags after adding them
      // TODO: figure out how to remove tags and use fillValidFirstModal() instead
      cy.get('input[placeholder="e.g. Student Learning Analytics Study"]').type(validFormData.projectName);
      cy.get('input[placeholder="Start date"]').type(validFormData.startDate);
      cy.get('input[placeholder="End date"]').type(validFormData.endDate);
      cy.get('textarea[placeholder="Enter a brief description about your project"]').type(validFormData.description);
      cy.get('input[placeholder="e.g., 150"]').type(validFormData.participantCount);
      cy.get('input[placeholder="Enter team member\'s email address"]').type(validFormData.teamMemberEmail);
      cy.get('[data-testid="add-member"]').click();

      // triggers validation
      cy.contains('button', 'Next').click();
      cy.contains('Please enter at least 2 keywords').should('be.visible');

      // fill with valid input and check that the error is gone
      cy.get('[data-testid="tag-input"]').type(validFormData.tags);
      cy.contains('Please enter at least 2 keywords').should('not.exist');
    });
  });

  describe('University details validation', () => {
    const validFormData = {
      projectName: 'Test Project CYPRESS',
      startDate: '2025-01-01{enter}',
      endDate: '2025-12-31{enter}',
      description: 'This is a valid test description',
      participantCount: '150',
      teamMemberEmail: 'valid@email.com',
      tags: 'Test, Validation, Cypress, ',
      universityName: 'Monash University',
      facultyName: 'Faculty of IT',
      ethicsId: 'ETH-2025-123',
    };

    const fillValidSecondModal = () => {
      cy.get('input[placeholder="Enter your university name"]').type(validFormData.universityName);
      cy.get('input[placeholder="Enter faculty name"]').type(validFormData.facultyName);
      cy.get('input[placeholder="Enter ethics approval ID"]').type(validFormData.ethicsId);
    };

    beforeEach(() => {
      cy.get('input[placeholder="e.g. Student Learning Analytics Study"]').type(validFormData.projectName);
      cy.get('input[placeholder="Start date"]').type(validFormData.startDate);
      cy.get('input[placeholder="End date"]').type(validFormData.endDate);
      cy.get('textarea[placeholder="Enter a brief description about your project"]').type(validFormData.description);
      cy.get('input[placeholder="e.g., 150"]').type(validFormData.participantCount);
      cy.get('input[placeholder="Enter team member\'s email address"]').type(validFormData.teamMemberEmail);
      cy.get('[data-testid="add-member"]').click();
      cy.get('[data-testid="tag-input"]').type(validFormData.tags);
      cy.contains('button', 'Next').click();
    });

    const validationCases = [
      {
        name: 'empty university name',
        field: 'input[placeholder="Enter your university name"]',
        validInput: validFormData.universityName,
        invalidInput: '',
        expectedError: 'This field is required',
        triggerValidation: () => cy.contains('button', 'Next').click(),
      },
      {
        name: 'empty faculty name',
        field: 'input[placeholder="Enter faculty name"]',
        validInput: validFormData.facultyName,
        invalidInput: '',
        expectedError: 'This field is required',
        triggerValidation: () => cy.contains('button', 'Next').click(),
      },
      {
        name: 'empty ethics approval ID',
        field: 'input[placeholder="Enter ethics approval ID"]',
        validInput: validFormData.ethicsId,
        invalidInput: '',
        expectedError: 'This field is required',
        triggerValidation: () => cy.contains('button', 'Next').click(),
      },
    ];

    validationCases.forEach(({ name, field, validInput, invalidInput, expectedError, triggerValidation }) => {
      it(`should validate ${name}`, () => {
        fillValidSecondModal();

        cy.get(field).clear();
        if (invalidInput) {
          cy.get(field).type(invalidInput);
        }

        triggerValidation();
        cy.contains(expectedError).should('be.visible');

        cy.get(field).clear().type(validInput);
        cy.contains(expectedError).should('not.exist');
      });
    });
  });

  describe('Database step - validation', () => {
    const fillValidThirdModal = () => {
      cy.get('input[placeholder="Enter your database name"]').type(validFormData.databaseName);
      cy.contains('label', 'No').click();
      cy.get('input[placeholder="Enter database owner\'s email address"]').type(validFormData.ownerEmail);
    };

    beforeEach(() => {
      // fill in all modals with valid form data
      cy.get('input[placeholder="e.g. Student Learning Analytics Study"]').type(validFormData.projectName);
      cy.get('input[placeholder="Start date"]').type(validFormData.startDate);
      cy.get('input[placeholder="End date"]').type(validFormData.endDate);
      cy.get('textarea[placeholder="Enter a brief description about your project"]').type(validFormData.description);
      cy.get('input[placeholder="e.g., 150"]').type(validFormData.participantCount);
      cy.get('input[placeholder="Enter team member\'s email address"]').type(validFormData.teamMemberEmail);
      cy.get('[data-testid="add-member"]').click();
      cy.get('[data-testid="tag-input"]').type(validFormData.tags);
      cy.contains('button', 'Next').click();

      cy.get('input[placeholder="Enter your university name"]').type(validFormData.universityName);
      cy.get('input[placeholder="Enter faculty name"]').type(validFormData.facultyName);
      cy.get('input[placeholder="Enter ethics approval ID"]').type(validFormData.ethicsId);
      cy.contains('button', 'Next').click();
    });

    const validationCases = [
      {
        name: 'empty database name',
        field: 'input[placeholder="Enter your database name"]',
        validInput: validFormData.databaseName,
        invalidInput: '',
        expectedError: 'This field is required',
        triggerValidation: () => cy.contains('button', 'Next').click(),
      },
      {
        name: 'invalid database owner email',
        field: 'input[placeholder="Enter database owner\'s email address"]',
        validInput: validFormData.ownerEmail,
        invalidInput: 'invalid-email',
        expectedError: 'The input is not a valid email',
        triggerValidation: () => cy.contains('button', 'Next').click(),
      },
    ];

    validationCases.forEach(({ name, field, validInput, invalidInput, expectedError, triggerValidation }) => {
      it(`should validate ${name}`, () => {
        fillValidThirdModal();

        cy.get(field).clear();
        if (invalidInput) {
          cy.get(field).type(invalidInput);
        }

        triggerValidation();
        cy.contains(expectedError).should('be.visible');

        cy.get(field).clear().type(validInput);
        cy.contains(expectedError).should('not.exist');
      });
    });
  });
});
