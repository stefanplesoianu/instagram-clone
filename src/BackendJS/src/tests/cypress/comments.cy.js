describe('Comment Api Tests', () => {
    const baseUrl = 'http://localhost:8080/api';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllMWIxNzNiNGUwYjQ4ZWI4ZTNlZDg2MGRjNDUxN2RjIiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsImV4cCI6MTczNzY0NDMwN30.obTkGF4FzRRSkMwc2RqRh9UL-WmRCc0V25u2kq6Df_E';

    it('should create comment successfully', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/posts/1/create-comment`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                content: 'This is a Cypress test comment',
            },
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.content).to.eq('This is a Cypress test comment');
        });
    });

    it('should delete a comment successfully', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/posts/1/1/delete-comment`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Comment deleted successfully');
        });
    });
})