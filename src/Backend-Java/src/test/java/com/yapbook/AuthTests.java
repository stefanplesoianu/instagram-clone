package com.yapbook;

import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.notNullValue;

public class AuthTests {
    static {
        RestAssured.baseURI = "http://localhost:8080";
    }

    @Test 
    void testRegisterUser() {
        String payload = ""
            {
                "username": "somebodyNew",
                "password": "newPassword",
                "email": "anotherNewEmail@yahoo.com",
                "confirmPassword": "newPassword",
            }
        "";

        given()
            .header("Content-Type", "application/json")
            .body(payload)
            .when()
            .post("/users/register")
            .then()
            .statusCode(201)
            .body("userId", notNullValue());
    }

    @Test 
    void testLoginUser() {
        String payload = ""
            {
                "username": "admin",
                "password": "password"
            }
        "";

        given()
            .header("Content-Type", "application/json")
            .body(payload)
            .when()
            .post("/users/login")
            .then()
            .statusCode(200)
            .body("token", notNullValue());
    }

    @Test 
    void testGuestLogin() {
        given()
            .when()
            .post("/users/guest")
            .then()
            .statusCode(200)
            .body("guestId", notNullValue());
    }
}