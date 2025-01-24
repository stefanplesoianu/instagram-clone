package com.yapbook.cucumber;

import io.cucumber.java.en.*;
import org.junit.jupiter.api.Assertions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@SpringBootTest
public class AuthCucumber {
    private String endpoint;
    private String token;
    private ResponseEntity<String> response;

    @Autowired
    private RestTemplate restTemplate;

    @Given("the login API endpoint is {string}")
    public void theLoginApiEndpointIs(String endpoint) {
        this.endpoint = endpoint;
    }

    @When("the user submits valid credentials username {string} and password {string}")
    public void theUserSubmitsValidCredentials(String username, String password) {
        String requestBody = String.format("{\"username\": \"%s\", \"password\": \"%s\"}", username, password);
        response = restTemplate.postForEntity(endpoint, requestBody, String.class);
        token = response.getBody();
    }

    @Then("the login should be successful with status {int}")
    public void theLoginShouldBeSuccessful(int expectedStatus) {
        Assertions.assertEquals(expectedStatus, response.getStatusCodeValue());
        Assertions.assertNotNull(token);
    }

    @When("the user submits invalid credentials username {string} and password {string}")
    public void theUserSubmitsInvalidCredentials(String username, String password) {
        String requestBody = String.format("{\"username\": \"%s\", \"password\": \"%s\"}", username, password);
        response = restTemplate.postForEntity(endpoint, requestBody, String.class);
    }

    @Then("the login should fail with status {int}")
    public void theLoginShouldFail(int expectedStatus) {
        Assertions.assertEquals(expectedStatus, response.getStatusCodeValue());
    }
}