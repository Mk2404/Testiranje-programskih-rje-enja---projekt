describe('Login', () => {
    beforeEach(() => {
        cy.fixture('users').as('users');
        cy.visit('/');
    });

    it('trebao bi uspješno prijaviti admina, Ivu i Martu', function () {
        const korisnici = [this.users.admin, this.users.iva, this.users.marta];
        
        korisnici.forEach(user => {
            cy.login(user.username, user.password);
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Logout').click();
        });
    });

    it('trebao bi prikazati grešku za neispravne podatke', function () {
        cy.login(this.users.admin.username, 'pogresnaLozinka');
        cy.contains('Invalid username or password').should('be.visible');
    });

    it('trebao bi zabraniti pristup dashboardu bez prijave', () => {
        cy.visit('/dashboard');
        cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('trebao bi odjaviti korisnika i blokirati povratak na dashboard', function () {
        cy.login(this.users.admin.username, this.users.admin.password);
        cy.contains('Logout').click();
        cy.visit('/dashboard');
        cy.get('[data-testid="login-button"]').should('be.visible');
    });
});