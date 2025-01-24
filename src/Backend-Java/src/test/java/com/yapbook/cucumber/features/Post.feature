Feature: Post Management Tests

  Scenario: Create a new post
    Given the post API endpoint is "/posts"
    When the user creates a post with title "My First Post" and content "This is my first post content"
    Then the post creation should be successful with status 201

  Scenario: Delete a post
    Given the post API endpoint is "/posts"
    When the user tries to delete a post with ID 1
    Then the post should no longer exist with status 404
