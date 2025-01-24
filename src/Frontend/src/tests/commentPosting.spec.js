describe('Comment Post Button Test', () => {
    it('should add a new comment when the user posts a comment', () => {
      cy.loginAsUser();
  
      cy.visit('/posts/1');

      const commentText = 'This is a new comment!';
      cy.get('input[type="text"]').type(commentText);

      cy.get('button[type="submit"]').click();

      cy.get('.comment')
        .last()
        .should('contain.text', commentText);
    });
  });
  