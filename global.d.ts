// Source - https://stackoverflow.com/a
// Posted by KMaster, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-13, License - CC BY-SA 4.0

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
  }
}
