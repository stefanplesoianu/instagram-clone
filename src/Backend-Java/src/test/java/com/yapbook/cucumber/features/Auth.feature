Feature: Authentication Tests

  Scenario: Successful login
    Given the login API endpoint is "/users/login"
    When the user submits valid credentials username "testUser" and password "password123"
    Then the login should be successful with status 200

  Scenario: Failed login
    Given the login API endpoint is "/users/login"
    When the user submits invalid credentials username "testUser" and password "wrongPassword"
    Then the login should fail with status 401
