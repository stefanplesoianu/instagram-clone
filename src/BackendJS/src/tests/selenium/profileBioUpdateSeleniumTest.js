const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

let driver;

async function login() {
  await driver.get('http://localhost:3000/login'); 
  
  const usernameField = await driver.findElement(By.id('admin'));
  const passwordField = await driver.findElement(By.id('password'));
  const loginButton = await driver.findElement(By.id('login-button'));
  
  await usernameField.sendKeys('testuser'); 
  await passwordField.sendKeys('password123'); 
  await loginButton.click();

  await driver.wait(until.elementLocated(By.id('profile-link')), 10000);
}

async function testUpdateBio() {
  try {
    await login();

    const profileLink = await driver.findElement(By.id('profile-link'));
    await profileLink.click();

    await driver.wait(until.elementLocated(By.id('bio-input')), 10000);

    const bioInput = await driver.findElement(By.id('bio-input'));
    await bioInput.clear();
    await bioInput.sendKeys('This is my updated bio!');

    const saveButton = await driver.findElement(By.id('save-bio-button'));
    await saveButton.click();

    const bioDisplay = await driver.findElement(By.id('bio-display'));
    const updatedBio = await bioDisplay.getText();

    assert(updatedBio.includes('This is my updated bio!'), 'Bio was not updated correctly');

    const successMessage = await driver.findElement(By.id('bio-update-success'));
    const successText = await successMessage.getText();
    assert(successText.includes('Profile updated'), 'Success message not found');

    console.log('Bio updated successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function testUpdateBioFailure() {
  try {
    await login();

    const profileLink = await driver.findElement(By.id('profile-link'));
    await profileLink.click();

    await driver.wait(until.elementLocated(By.id('bio-input')), 10000);

    const bioInput = await driver.findElement(By.id('bio-input'));
    await bioInput.clear(); 
    const saveButton = await driver.findElement(By.id('save-bio-button'));
    await saveButton.click();

    const errorMessage = await driver.findElement(By.id('bio-update-error'));
    const errorText = await errorMessage.getText();
    assert(errorText.includes('Something went wrong, try again'), 'Error message not found or incorrect');

    console.log('Error message displayed as expected!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function runTests() {
  driver = await new Builder().forBrowser('chrome').build();
  try {
    await testUpdateBio();
    await testUpdateBioFailure();
  } finally {
    await driver.quit();
  }
}

runTests();
