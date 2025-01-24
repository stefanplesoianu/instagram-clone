describe('logout button test', () => {
    it('should log out the user when the logout button is clicked', () => {
        cy.loginAsUser();

        cy.visit('/');

        cy.get('a').contains('Profile').should('exist');

        cy.get('a').contains('Logout').click();

        cy.get('a').contains('Login').should('exist');
        cy.get('a').contains('Profile').should('not.exist');
    });
})