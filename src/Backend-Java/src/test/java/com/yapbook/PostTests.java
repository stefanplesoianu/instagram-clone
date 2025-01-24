package com.yapbook;

import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

public class PostTests {
    static {
        RestAssured.baseURI = "http://localhost:8080";
    }

    @Test 
    void testCreatePost() {
        String payload = ""
            {
                "title": "yetAnotherPost",
                "content": "randomContent"
            }
        "";

        given()
            .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllMWIxNzNiNGUwYjQ4ZWI4ZTNlZDg2MGRjNDUxN2RjIiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsImV4cCI6MTczNzY0NDMwN30.obTkGF4FzRRSkMwc2RqRh9UL-WmRCc0V25u2kq6Df_E") // Replace with a real token
            .header("Content-Type", "application/json")
            .body(payload)
            .when()
            .post("/posts")
            .then()
            .statusCode(201)
            .body("postId", notNullValue());
    }

    @Test 
    void testGetPosts() {
        given()
            .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllMWIxNzNiNGUwYjQ4ZWI4ZTNlZDg2MGRjNDUxN2RjIiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsImV4cCI6MTczNzY0NDMwN30.obTkGF4FzRRSkMwc2RqRh9UL-WmRCc0V25u2kq6Df_E")
            .when()
            .get("/posts")
            .then()
            .statusCode(200)
            .body("size()", greaterThan(0));
    }

    @Test
    void testDeletePost() {
        given()
            .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllMWIxNzNiNGUwYjQ4ZWI4ZTNlZDg2MGRjNDUxN2RjIiwidXNlcm5hbWUiOiJ0ZXN0VXNlciIsImV4cCI6MTczNzY0NDMwN30.obTkGF4FzRRSkMwc2RqRh9UL-WmRCc0V25u2kq6Df_E")
                .when()
                .delete("/posts/8")
                .then
                .statusCode(200);
    }
}