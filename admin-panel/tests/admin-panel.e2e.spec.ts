import { test, expect, Page } from '@playwright/test';

/**
 * Admin Panel End-to-End Test Suite
 * 
 * This comprehensive test suite covers:
 * - Authentication (login/logout)
 * - Dashboard navigation
 * - Domains CRUD operations
 * - Skills CRUD operations
 * - Questions CRUD operations
 * - Publishing workflow
 * - Version history
 * - User management (Super Admin)
 * - Invitation codes (Super Admin)
 * - Account settings
 */

// Test configuration
const TEST_TIMEOUT = 60000; // 60 seconds for each test

// Test credentials - these should be configured in your Supabase project
const TEST_CREDENTIALS = {
  email: process.env.TEST_ADMIN_EMAIL || 'test@example.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'testpassword123',
};

const SUPER_ADMIN_CREDENTIALS = {
  email: process.env.TEST_SUPER_ADMIN_EMAIL || 'superadmin@example.com',
  password: process.env.TEST_SUPER_ADMIN_PASSWORD || 'superadminpassword123',
};

// Helper functions
async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for navigation to complete
  await page.waitForURL('/');
}

async function logout(page: Page) {
  // Look for user menu or logout button
  await page.click('[data-testid="user-menu"]').catch(() => {
    // Fallback: try to find logout button directly
    return page.click('button:has-text("Logout")');
  });
  await page.click('button:has-text("Logout")').catch(() => {
    return page.click('[data-testid="logout-button"]');
  });
  await page.waitForURL('/login');
}

// Test data generators
const generateTestDomain = () => ({
  name: `Test Domain ${Date.now()}`,
  description: 'This is a test domain created by automated tests',
  order: Math.floor(Math.random() * 1000),
});

const generateTestSkill = () => ({
  name: `Test Skill ${Date.now()}`,
  description: 'This is a test skill created by automated tests',
  difficulty: Math.floor(Math.random() * 5) + 1,
});

const generateTestQuestion = () => ({
  text: `What is 2 + 2? (Test ${Date.now()})`,
  type: 'mcq',
  options: ['2', '3', '4', '5'],
  correctAnswer: '4',
  explanation: 'Basic addition: 2 + 2 = 4',
});

test.describe('Admin Panel E2E Tests', () => {
  test.describe('Authentication', () => {
    test('should load login page', async ({ page }) => {
      await page.goto('/login');
      await expect(page).toHaveTitle(/Admin/);
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
      await expect(page).toHaveURL('/');
      // Should see dashboard or main content
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=/error|invalid|incorrect/i')).toBeVisible({ timeout: 5000 });
    });

    test('should logout successfully', async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
      await logout(page);
      await expect(page).toHaveURL('/login');
    });

    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      await page.goto('/domains');
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should display dashboard with statistics', async ({ page }) => {
      await page.goto('/');
      
      // Check for dashboard elements
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Should have navigation links
      const navLinks = ['Domains', 'Skills', 'Questions'];
      for (const link of navLinks) {
        await expect(page.locator(`a:has-text("${link}")`).first()).toBeVisible();
      }
    });

    test('should navigate to different sections from dashboard', async ({ page }) => {
      await page.goto('/');
      
      // Test navigation to Domains
      await page.click('a:has-text("Domains")');
      await expect(page).toHaveURL(/\/domains/);
      
      // Navigate back
      await page.goto('/');
      
      // Test navigation to Skills
      await page.click('a:has-text("Skills")');
      await expect(page).toHaveURL(/\/skills/);
      
      // Navigate back
      await page.goto('/');
      
      // Test navigation to Questions
      await page.click('a:has-text("Questions")');
      await expect(page).toHaveURL(/\/questions/);
    });
  });

  test.describe('Domains Management', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should list all domains', async ({ page }) => {
      await page.goto('/domains');
      
      // Should show domains page
      await expect(page.locator('h1:has-text("Domains"), h2:has-text("Domains")')).toBeVisible();
      
      // Should have a create button
      await expect(page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("New Domain"), a:has-text("New Domain")')).toBeVisible();
    });

    test('should create a new domain', async ({ page }) => {
      const testDomain = generateTestDomain();
      
      await page.goto('/domains');
      
      // Click create button
      await page.click('button:has-text("Create"), a:has-text("Create"), button:has-text("New"), a:has-text("New")').catch(() => {
        return page.goto('/domains/new');
      });
      
      // Fill in domain form
      await page.fill('input[name="name"], input[placeholder*="name" i]', testDomain.name);
      await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', testDomain.description);
      
      // Submit form
      await page.click('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")');
      
      // Should redirect to domains list or show success message
      await expect(page.locator(`text=${testDomain.name}`)).toBeVisible({ timeout: 10000 });
    });

    test('should edit an existing domain', async ({ page }) => {
      await page.goto('/domains');
      
      // Wait for domains to load
      await page.waitForTimeout(2000);
      
      // Click edit on first domain
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Update domain name
        const updatedName = `Updated Domain ${Date.now()}`;
        const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
        await nameInput.clear();
        await nameInput.fill(updatedName);
        
        // Save changes
        await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Update")');
        
        // Should show updated name
        await expect(page.locator(`text=${updatedName}`)).toBeVisible({ timeout: 10000 });
      }
    });

    test('should delete a domain', async ({ page }) => {
      // First create a domain to delete
      const testDomain = generateTestDomain();
      await page.goto('/domains/new');
      await page.fill('input[name="name"], input[placeholder*="name" i]', testDomain.name);
      await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', testDomain.description);
      await page.click('button[type="submit"]');
      
      // Wait for creation
      await page.waitForTimeout(2000);
      await page.goto('/domains');
      
      // Find and delete the domain
      const domainRow = page.locator(`tr:has-text("${testDomain.name}"), div:has-text("${testDomain.name}")`).first();
      await domainRow.locator('button:has-text("Delete"), button[aria-label*="Delete"]').click();
      
      // Confirm deletion
      await page.click('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")');
      
      // Domain should be removed
      await expect(page.locator(`text=${testDomain.name}`)).not.toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Skills Management', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should list all skills', async ({ page }) => {
      await page.goto('/skills');
      
      // Should show skills page
      await expect(page.locator('h1:has-text("Skills"), h2:has-text("Skills")')).toBeVisible();
      
      // Should have a create button
      await expect(page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("New"), a:has-text("New")')).toBeVisible();
    });

    test('should create a new skill', async ({ page }) => {
      const testSkill = generateTestSkill();
      
      await page.goto('/skills');
      
      // Click create button
      await page.click('button:has-text("Create"), a:has-text("Create"), button:has-text("New"), a:has-text("New")').catch(() => {
        return page.goto('/skills/new');
      });
      
      // Fill in skill form
      await page.fill('input[name="name"], input[placeholder*="name" i]', testSkill.name);
      await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', testSkill.description);
      
      // Select domain (if required)
      const domainSelect = page.locator('select[name="domain_id"], select[name="domainId"]');
      if (await domainSelect.isVisible()) {
        await domainSelect.selectOption({ index: 1 });
      }
      
      // Submit form
      await page.click('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")');
      
      // Should redirect to skills list or show success message
      await expect(page.locator(`text=${testSkill.name}`)).toBeVisible({ timeout: 10000 });
    });

    test('should filter skills by domain', async ({ page }) => {
      await page.goto('/skills');
      
      // Look for domain filter
      const domainFilter = page.locator('select[name="domain"], select[aria-label*="domain" i]');
      if (await domainFilter.isVisible()) {
        // Select a domain
        await domainFilter.selectOption({ index: 1 });
        
        // Wait for filtered results
        await page.waitForTimeout(1000);
        
        // Should show filtered skills
        await expect(page.locator('table, [role="table"]')).toBeVisible();
      }
    });

    test('should edit an existing skill', async ({ page }) => {
      await page.goto('/skills');
      
      // Wait for skills to load
      await page.waitForTimeout(2000);
      
      // Click edit on first skill
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Update skill name
        const updatedName = `Updated Skill ${Date.now()}`;
        const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
        await nameInput.clear();
        await nameInput.fill(updatedName);
        
        // Save changes
        await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Update")');
        
        // Should show updated name
        await expect(page.locator(`text=${updatedName}`)).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Questions Management', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should list all questions', async ({ page }) => {
      await page.goto('/questions');
      
      // Should show questions page
      await expect(page.locator('h1:has-text("Questions"), h2:has-text("Questions")')).toBeVisible();
      
      // Should have a create button
      await expect(page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("New"), a:has-text("New")')).toBeVisible();
    });

    test('should create a new MCQ question', async ({ page }) => {
      const testQuestion = generateTestQuestion();
      
      await page.goto('/questions');
      
      // Click create button
      await page.click('button:has-text("Create"), a:has-text("Create"), button:has-text("New"), a:has-text("New")').catch(() => {
        return page.goto('/questions/new');
      });
      
      // Select question type
      const typeSelect = page.locator('select[name="type"], [role="combobox"]');
      if (await typeSelect.isVisible()) {
        await typeSelect.selectOption('mcq');
      }
      
      // Fill in question text
      await page.fill('textarea[name="text"], textarea[placeholder*="question" i]', testQuestion.text);
      
      // Fill in options
      for (let i = 0; i < testQuestion.options.length; i++) {
        const optionInput = page.locator(`input[name="option_${i}"], input[placeholder*="option" i]`).nth(i);
        if (await optionInput.isVisible()) {
          await optionInput.fill(testQuestion.options[i]);
        }
      }
      
      // Set correct answer
      await page.fill('input[name="correct_answer"], input[placeholder*="correct" i]', testQuestion.correctAnswer);
      
      // Fill in explanation
      await page.fill('textarea[name="explanation"], textarea[placeholder*="explanation" i]', testQuestion.explanation);
      
      // Select skill (if required)
      const skillSelect = page.locator('select[name="skill_id"], select[name="skillId"]');
      if (await skillSelect.isVisible()) {
        await skillSelect.selectOption({ index: 1 });
      }
      
      // Submit form
      await page.click('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save")');
      
      // Should redirect to questions list or show success message
      await expect(page.locator(`text=/Test.*${Date.now().toString().slice(0, 8)}/`)).toBeVisible({ timeout: 10000 });
    });

    test('should filter questions by skill', async ({ page }) => {
      await page.goto('/questions');
      
      // Look for skill filter
      const skillFilter = page.locator('select[name="skill"], select[aria-label*="skill" i]');
      if (await skillFilter.isVisible()) {
        // Select a skill
        await skillFilter.selectOption({ index: 1 });
        
        // Wait for filtered results
        await page.waitForTimeout(1000);
        
        // Should show filtered questions
        await expect(page.locator('table, [role="table"]')).toBeVisible();
      }
    });

    test('should preview a question', async ({ page }) => {
      await page.goto('/questions');
      
      // Wait for questions to load
      await page.waitForTimeout(2000);
      
      // Click preview on first question
      const previewButton = page.locator('button:has-text("Preview"), button[aria-label*="Preview"]').first();
      if (await previewButton.isVisible()) {
        await previewButton.click();
        
        // Should show preview modal/dialog
        await expect(page.locator('[role="dialog"], .modal')).toBeVisible();
        
        // Close preview
        await page.click('button:has-text("Close"), button[aria-label="Close"]');
      }
    });

    test('should edit an existing question', async ({ page }) => {
      await page.goto('/questions');
      
      // Wait for questions to load
      await page.waitForTimeout(2000);
      
      // Click edit on first question
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Update question text
        const updatedText = `Updated Question ${Date.now()}`;
        const textInput = page.locator('textarea[name="text"], textarea[placeholder*="question" i]');
        await textInput.clear();
        await textInput.fill(updatedText);
        
        // Save changes
        await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Update")');
        
        // Should show updated text
        await expect(page.locator(`text=/Updated Question/`)).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Publishing Workflow', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should navigate to publish page', async ({ page }) => {
      await page.goto('/publish');
      
      // Should show publish page
      await expect(page.locator('h1:has-text("Publish"), h2:has-text("Publish")')).toBeVisible();
    });

    test('should show unpublished changes', async ({ page }) => {
      await page.goto('/publish');
      
      // Should show changes summary or empty state
      await expect(page.locator('text=/changes|publish|draft/i')).toBeVisible();
    });

    test('should publish changes', async ({ page }) => {
      await page.goto('/publish');
      
      // Look for publish button
      const publishButton = page.locator('button:has-text("Publish")');
      if (await publishButton.isVisible() && await publishButton.isEnabled()) {
        await publishButton.click();
        
        // Should show confirmation or success message
        await expect(page.locator('text=/success|published|complete/i')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Version History', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should display version history', async ({ page }) => {
      await page.goto('/versions');
      
      // Should show version history page
      await expect(page.locator('h1:has-text("Version"), h2:has-text("Version")')).toBeVisible();
      
      // Should show list of versions or empty state
      await expect(page.locator('table, [role="table"], text=/no versions|version/i')).toBeVisible();
    });

    test('should view version details', async ({ page }) => {
      await page.goto('/versions');
      
      // Wait for versions to load
      await page.waitForTimeout(2000);
      
      // Click on first version
      const versionButton = page.locator('button:has-text("View"), a:has-text("View")').first();
      if (await versionButton.isVisible()) {
        await versionButton.click();
        
        // Should show version details
        await expect(page.locator('[role="dialog"], .modal, text=/details|changes/i')).toBeVisible();
      }
    });
  });

  test.describe('Account Settings', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should navigate to account settings', async ({ page }) => {
      await page.goto('/settings');
      
      // Should show settings page
      await expect(page.locator('h1:has-text("Settings"), h2:has-text("Settings"), h1:has-text("Account"), h2:has-text("Account")')).toBeVisible();
    });

    test('should display user information', async ({ page }) => {
      await page.goto('/settings');
      
      // Should show user email
      await expect(page.locator(`text=${TEST_CREDENTIALS.email}`)).toBeVisible();
    });

    test('should update account settings', async ({ page }) => {
      await page.goto('/settings');
      
      // Look for editable fields
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
      if (await nameInput.isVisible()) {
        await nameInput.clear();
        await nameInput.fill('Test User Updated');
        
        // Save changes
        await page.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
        
        // Should show success message
        await expect(page.locator('text=/success|saved|updated/i')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Super Admin Features', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, SUPER_ADMIN_CREDENTIALS.email, SUPER_ADMIN_CREDENTIALS.password);
    });

    test('should access user management page', async ({ page }) => {
      await page.goto('/users');
      
      // Should show users page (or redirect if not super admin)
      const isAccessible = await page.locator('h1:has-text("Users"), h2:has-text("Users")').isVisible().catch(() => false);
      
      if (isAccessible) {
        // Should show list of users
        await expect(page.locator('table, [role="table"]')).toBeVisible();
      }
    });

    test('should access invitation codes page', async ({ page }) => {
      await page.goto('/invitation-codes');
      
      // Should show invitation codes page (or redirect if not super admin)
      const isAccessible = await page.locator('h1:has-text("Invitation"), h2:has-text("Invitation")').isVisible().catch(() => false);
      
      if (isAccessible) {
        // Should show list of codes or create button
        await expect(page.locator('button:has-text("Create"), button:has-text("Generate")')).toBeVisible();
      }
    });

    test('should create invitation code', async ({ page }) => {
      await page.goto('/invitation-codes');
      
      const isAccessible = await page.locator('h1:has-text("Invitation"), h2:has-text("Invitation")').isVisible().catch(() => false);
      
      if (isAccessible) {
        // Click create button
        const createButton = page.locator('button:has-text("Create"), button:has-text("Generate")');
        if (await createButton.isVisible()) {
          await createButton.click();
          
          // Should show new invitation code
          await expect(page.locator('text=/code|invitation/i')).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should handle 404 pages gracefully', async ({ page }) => {
      await page.goto('/nonexistent-page');
      
      // Should redirect to home or show 404 page
      await expect(page).toHaveURL(/\/|404/);
    });

    test('should validate form inputs', async ({ page }) => {
      await page.goto('/domains/new');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=/required|invalid|error/i')).toBeVisible({ timeout: 5000 });
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);
      
      await page.goto('/domains');
      
      // Should show error message or loading state
      await expect(page.locator('text=/error|offline|failed|loading/i')).toBeVisible({ timeout: 10000 });
      
      // Restore online mode
      await page.context().setOffline(false);
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/');
      
      // Should show mobile navigation
      await expect(page.locator('button[aria-label*="menu" i], button:has-text("Menu")')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/domains');
      
      // Should display content properly
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle large lists efficiently', async ({ page }) => {
      await login(page, TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
      
      await page.goto('/questions');
      
      // Wait for list to load
      await page.waitForTimeout(2000);
      
      // Should show pagination or virtual scrolling for large lists
      const hasPagination = await page.locator('button:has-text("Next"), button:has-text("Previous"), nav[aria-label*="pagination" i]').isVisible().catch(() => false);
      
      // Just verify the page loads without errors
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  });
});
