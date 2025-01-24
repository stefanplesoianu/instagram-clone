# Backend Java API Tests

This project includes automated tests built to ensure the functionality and reliability of the backend API for various features like posts, comments, and profile updates. The tests are implemented using **Selenium**, **Cucumber** and **RestAssured**.
The following features are covered:

### 1. **Post Creation & Retrieval**
   - Create, retrieve, and delete posts via the API.
   - Validate that the correct status codes and responses are returned.

### 2. **Comment Creation & Deletion**
   - Test the functionality of creating and deleting comments for posts.
   - Ensure proper error handling for invalid actions (e.g., unauthorized comments).

### 3. **Profile Update (Bio and Photo)**
   - Test that users can successfully update their bio and profile photo.
   - Validate that the backend handles the updates correctly and returns the expected response.

### 4. **Post Sharing**
   - Validate that the post-sharing functionality is working.
   - Ensure the share count is updated and the post is correctly shared.

### 5. **Authorization**
   - Test JWT authentication to ensure protected routes are only accessible by authorized users.
   - Verify that unauthorized access is handled appropriately.



## **Tools and Frameworks Used**

The following tools and libraries were utilized in creating the tests for this project: **Selenium** , **Cucumber** , **RestAssured**  

## **How to Run the Tests**

Before running the tests, you need to have installed Maven and Java 11+. Then follow these steps:

1. Clone the repository

2. Install dependencies with mvn clean install

3. Run the Tests with mvn test

4. Test results will be displayed in the terminal.
