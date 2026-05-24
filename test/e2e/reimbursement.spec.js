describe('Reimbursement', () => {

beforeEach(() => {
    cy.visit('/');
    cy.login('Iva', 'Iva123');
});

  // Pozitivni scenarij - kreiranje ispravne refundacije
  it('should create a reimbursement with valid data', () => {
    cy.contains('Add Reimbursement').click();
    cy.get('[data-testid="description-input"]').type('Business lunch with client');
    cy.get('[data-testid="type-input"]').select('business_expenses');
    cy.get('[data-testid="amount-input"]').type('100');
    cy.get('[data-testid="submit-button"]').click();
    cy.contains('successfully').should('be.visible');
  });

  // Negativni scenarij - prazan obrazac bez opisa
  it('should not create reimbursement with too short description', () => {
      cy.contains('Add Reimbursement').click();
      cy.get('[data-testid="description-input"]').type('Hi');
      cy.get('[data-testid="type-input"]').select('business_expenses');
      cy.get('[data-testid="amount-input"]').type('100');
      cy.get('[data-testid="submit-button"]').click();
      cy.url().should('include', 'add-reimbursement');
  });

  // Negativni scenarij - iznos nula
  it('should not create reimbursement with zero amount', () => {
      cy.contains('Add Reimbursement').click();
      cy.get('[data-testid="description-input"]').type('Business lunch with client');
      cy.get('[data-testid="type-input"]').select('business_expenses');
      cy.get('[data-testid="amount-input"]').type('0');
      cy.get('[data-testid="submit-button"]').click();
      cy.url().should('include', 'add-reimbursement');
  });

  // Negativni scenarij - predugačak opis
  it('should not create reimbursement with too long description', () => {
      cy.contains('Add Reimbursement').click();
      cy.get('[data-testid="description-input"]').type('a'.repeat(201));
      cy.get('[data-testid="type-input"]').select('business_expenses');
      cy.get('[data-testid="amount-input"]').type('100');
      cy.get('[data-testid="submit-button"]').click();
      cy.url().should('include', 'add-reimbursement');
  });

  // Negativni scenarij - negativan iznos
  it('should not create reimbursement with negative amount', () => {
      cy.contains('Add Reimbursement').click();
      cy.get('[data-testid="description-input"]').type('Business lunch with client');
      cy.get('[data-testid="type-input"]').select('business_expenses');
      cy.get('[data-testid="amount-input"]').type('-50');
      cy.get('[data-testid="submit-button"]').click();
      cy.url().should('include', 'add-reimbursement');
  });

  // Pozitivni scenarij - korisnik vidi samo svoje refundacije
  it('should show only own reimbursements for enduser', () => {
      cy.contains('Add Reimbursement').click();
      cy.get('[data-testid="description-input"]').type('Iva business lunch');
      cy.get('[data-testid="type-input"]').select('business_expenses');
      cy.get('[data-testid="amount-input"]').type('100');
      cy.get('[data-testid="submit-button"]').click();
      cy.contains('successfully').should('be.visible');

      cy.contains('Logout').click();
      cy.login('Marta', 'Marta123'); // Jelena ne postoji
      cy.contains('Iva business lunch').should('not.exist');
  });

  // Pozitivni scenarij - admin vidi sve refundacije
  it('should show all reimbursements for admin', () => {
      cy.contains('Logout').click();
      cy.get('[data-testid="username-input"]').type('admin');
      cy.get('[data-testid="password-input"]').type('adminPass'); 
      cy.get('[data-testid="login-button"]').click();
      cy.contains('Dashboard - Admin').should('be.visible');
  });

  // Pozitivni scenarij - pretraga refundacija
  it('should search reimbursements by description', () => {
      cy.visit('/dashboard');
      cy.get('input[placeholder="Search reimbursements..."]').type('Business');
      cy.url().should('include', 'dashboard');
  });

  // Pozitivni scenarij - admin odobrava refundaciju
  it('should allow admin to approve a reimbursement', () => {
      cy.contains('Add Reimbursement').click();
      cy.get('[data-testid="description-input"]').type('Travel expenses for meeting');
      cy.get('[data-testid="type-input"]').select('travel');
      cy.get('[data-testid="amount-input"]').type('150');
      cy.get('[data-testid="submit-button"]').click();
      cy.contains('successfully').should('be.visible');
      
      cy.contains('Logout').click();
      cy.get('[data-testid="username-input"]').type('admin');
      cy.get('[data-testid="password-input"]').type('adminPass'); // bilo adminPass
      cy.get('[data-testid="login-button"]').click();
      cy.contains('Dashboard - Admin').should('be.visible');
      cy.contains('Travel expenses for meeting').should('be.visible');
      cy.contains('button', 'Approve').first().click({ force: true });
      cy.contains('Approved').should('be.visible');
  });

  // Pozitivni scenarij - admin odbija refundaciju
  it('should allow admin to reject a reimbursement', () => {
      cy.contains('Add Reimbursement').click();
      cy.get('[data-testid="description-input"]').type('Medical expenses claim');
      cy.get('[data-testid="type-input"]').select('medical_expenses');
      cy.get('[data-testid="amount-input"]').type('200');
      cy.get('[data-testid="submit-button"]').click();
      cy.contains('successfully').should('be.visible');

      cy.contains('Logout').click();
      cy.get('[data-testid="username-input"]').type('admin');
      cy.get('[data-testid="password-input"]').type('adminPass');
      cy.get('[data-testid="login-button"]').click();
      cy.contains('Dashboard - Admin').should('be.visible');
      cy.contains('Medical expenses claim').should('be.visible');
      cy.contains('tr', 'Medical expenses claim')
          .contains('button', 'Reject')
          .click({ force: true });
      cy.contains('Rejected').should('be.visible');
  });

});