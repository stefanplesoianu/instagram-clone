package com.yapbook.cucumber;

import io.cucumber.java.en.*;
import org.junit.jupiter.api.Assertions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@SpringBootTest
public class PostCucumber {
    private String endpoint;
    private ResponseEntity<Sring> response;

    @Autowired
    private RestTemplate restTemplate;

    @Given("the post API endpoint is {string}")
    public void thePostApiEndpointIs(String endpoint) {
        this.endpoint = endpoint;
    }

    @When("the user creates a post with title {string} and content {string}")
    public void theUserCreatesPost(String title, String content) {
        String requestBody = String.format("{\"title\": \"%s\", \"content\": \"%s\"}", title, content);
        response = restTemplate.postForEntity(endpoint, requestBody, String.class);
    }

    @Then("the post creation should be successful with status {init}")
    public void thePostCreationShouldBeSuccessful(int expectedStatus) {
        Assertions.assertEquals(expectedStatus, response.getStatusCodeValue());
    }

    @When("the user tries to delete a post with ID {int}")
    public void theUserTrieToDeletePost(int postId) {
        String deleteEndpoint = endpoint + "/" + postId;
        restTemplate.delete(deleteEndpoint);
    }

    @Then("the post should no longer exist with status {int}")
    public void thePostShouldNoLongerExist(int expectedStatus) {
        response = restTemplate.getForEntity(endpoint, String.class);
        Assertions.assertEquals(expectedStatus, response.getStatusCodeValue());
    }
}