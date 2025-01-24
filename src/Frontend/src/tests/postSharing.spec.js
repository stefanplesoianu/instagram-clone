describe('Post Sharing Button Test', () => {
    it('should increase share count when the share button is clicked', () => {
      cy.loginAsUser();
  
      cy.visit('/posts/1');

      cy.get('p').contains('0 shares').should('exist');

      cy.get('FaShare').click();
  
      cy.get('p').contains('1 shares').should('exist');
    });
  });
  