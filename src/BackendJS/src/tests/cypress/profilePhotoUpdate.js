describe('Profile Photo Update', () => {
    before(() => {
      cy.login();
    });
  
    it('should successfully update profile photo', () => {
      const fileName = 'profile-pic.jpg';
  
      cy.visit('/profile');
      cy.get('[data-cy="photo-upload"]').attachFile(fileName);
      cy.get('[data-cy="save-photo-button"]').click(); 

      cy.contains('Profile updated').should('be.visible');

      cy.get('[data-cy="profile-photo"]').should('have.attr', 'src').and('include', fileName);
    });
  
    it('should show an error if no photo is selected', () => {
      cy.visit('/profile');
      cy.get('[data-cy="save-photo-button"]').click();

      cy.contains('Something went wrong, try again').should('be.visible');
    });
  });
  