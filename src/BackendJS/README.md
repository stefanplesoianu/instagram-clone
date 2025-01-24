# Backend JS API Tests

This project includes automated tests to verify the functionality and reliability of the JS backend API for various features like posts, comments, and profile updates. The tests are implemented using **Cypress** and **SeleniumWebDriverIO**.

### Features Tested:

1. **Post Creation & Retrieval**
   - Create, retrieve, and delete posts via the API.
   - Verify correct status codes and responses.

2. **Comment Creation & Deletion**
   - Test the functionality of creating and deleting comments.
   - Handle errors for invalid actions (e.g., unauthorized comments).

3. **Profile Update (Bio and Photo)**
   - Test updating user bio and profile photo.
   - Ensure the backend handles updates and returns expected responses.

4. **Post Sharing**
   - Validate the post-sharing functionality.
   - Verify that the share count is updated correctly.

5. **Authorization**
   - Test JWT authentication to ensure routes are protected.
   - Handle unauthorized access appropriately.

---

## Tools and Frameworks Used:

- **Cypress**  
- **Selenium**  

## How to Run the Tests:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Run the tests using `npm test` for unit tests or `npx cypress open` for Cypress tests.
4. Test results will be displayed in the terminal or Cypress UI.

