# Frontend JS Tests

This project includes automated tests to verify the functionality and reliability of the frontend for various features like post sharing, commenting, and logging out. The tests are implemented using **Cypress**.

### Features Tested:

1. **Logout Button**
   - Ensure the logout button logs the user out correctly.
   - Verify that the user is redirected to the login page after logging out.

2. **Post Sharing Button**
   - Test that the post sharing button correctly triggers the share action.
   - Validate that the share count is updated accordingly.

3. **Comment Posting Button**
   - Test the functionality of posting a comment.
   - Ensure comments are correctly added to the post and displayed.
   - Validate proper error handling for invalid comment submissions.


## Tools and Frameworks Used:

- **Cypress**  

## How to Run the Tests:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Run the tests using `npm test` for unit tests or `npx cypress open` for Cypress tests.
4. Test results will be displayed in the terminal or Cypress UI.
