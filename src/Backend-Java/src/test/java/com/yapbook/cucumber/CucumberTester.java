package com.yapbook.cucumber;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
    features = "Backend-Java/test/java/com/yapbook/cucumber/features",
    glue = "com.yapbook.cucumber"
)

public class CucumberTestRunner {   
}