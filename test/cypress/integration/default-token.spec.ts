describe('sign in with default token', () => {
    it('given provider has not been primed, when user signs in, then default token is issued', () => {
        // Given
        cy.visit('http://localhost:3000');

        // When
        cy.contains('button', 'Sign in').click();

        // Then
        cy.contains('Subject: fixed-account-id');
    });
});
