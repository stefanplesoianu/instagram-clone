package com.yapbook;

import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class ApiTests {
    static {
        RestAssured.baseURI = "http://localhost:8080";
    }

    @Test 
    void testHealthEndpoint() {
        given()
            .when()
            .get("/actuator/health")
            .then()
            .statusCode(200)
            .body("status", equalTo("UP"))
    }

    @Test 
    void testInvalidEndpoint() {
        given()
            .when()
            .get("/invalid-endpoint")
            .then()
            .statusCode(404);
    }
}