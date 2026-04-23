//testing file for event hub application
//Shubh Prajapati


//file has both black-box and white-box testing scenarios
// including validation, authentication, and event registration flows

const { test, expect } = require('@playwright/test');


// user registration tests

test('should register user with valid inputs', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.fill('input[name="name"]', 'Shubh Test');
  await page.fill('input[name="email"]', 'shubh123@test.com');
  await page.fill('input[name="password"]', '123456');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/registrations/);
});

test('should show error when registration fields are missing', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.click('button[type="submit"]');

  await expect(page.locator('body')).toContainText('Please complete every account field');
});


// user login tests

//login test with valid credentials and invalid credentials

test('should login successfully with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/login');


  await page.fill('input[name="email"]', 'shubh123@test.com');
  await page.fill('input[name="password"]', '123456');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/registrations/);
});

test('should show error for invalid login credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[name="email"]', 'wrong@test.com');
  await page.fill('input[name="password"]', 'wrongpass');

  await page.click('button[type="submit"]');

  await expect(page.locator('body')).toContainText('Incorrect email address or password');
});




// event listing test
test('should load events page', async ({ page }) => {
  await page.goto('http://localhost:3000/events');

  await expect(page.locator('body')).toContainText('Events');
});


//event registration tests  usng black-box

test('should register for an event with valid seat count', async ({ page }) => {
  await page.goto('http://localhost:3000/events');

  await page.locator('a').first().click();

  await page.click('text=Register');

  await page.fill('input[name="ticketCount"]', '2');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/registrations/);
});

test('should reject registration with invalid seat count', async ({ page }) => {
  await page.goto('http://localhost:3000/events');

  await page.locator('a').first().click();

  await page.click('text=Register');

  await page.fill('input[name="ticketCount"]', '0');
  await page.click('button[type="submit"]');

  await expect(page.locator('body')).toContainText('Please choose a whole number of seats');
});


// edit registration test using white-box testing approach
test('should update registration seat count', async ({ page }) => {
  await page.goto('http://localhost:3000/events/registrations');

  const editLink = page.locator('a:has-text("Edit")').first();

  if (await editLink.count() > 0) {
    await editLink.click();

    await page.fill('input[name="ticketCount"]', '3');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/registrations/);
  }
});


// delete regstation(whtbox)
test('should delete a registration', async ({ page }) => {
  await page.goto('http://localhost:3000/events/registrations');

  const deleteButton = page.locator('form button:has-text("Delete")').first();

  if (await deleteButton.count() > 0) {
    await deleteButton.click();

    await expect(page).toHaveURL(/registrations/);
  }
});


// security test
test('should redirect to login when accessing protected route without auth', async ({ page }) => {
  await page.goto('http://localhost:3000/events/registrations');

  await expect(page).toHaveURL(/login/);
});


// Admin login test using black-box testing approach
test('should allow admin to login and access dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login');

  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/admin\/events/);
});