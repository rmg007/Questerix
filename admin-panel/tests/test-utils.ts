
export const TEST_CREDENTIALS = {
  email: process.env.TEST_SUPER_ADMIN_EMAIL || process.env.TEST_ADMIN_EMAIL || 'test@example.com',
  password: process.env.TEST_SUPER_ADMIN_PASSWORD || process.env.TEST_ADMIN_PASSWORD || 'testpassword123',
};

export function generateTestUser() {
  return {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };
}

export function generateTestDomain() {
  return {
    name: `Test Domain ${Date.now()}`,
    description: `Description for test domain ${Date.now()}`,
  };
}

export function generateTestSkill() {
  return {
    name: `Test Skill ${Date.now()}`,
    description: `Description for test skill ${Date.now()}`,
  };
}

export function generateTestQuestion() {
  return {
    text: `Test Question ${Date.now()}`,
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswer: 'Option 1',
    explanation: 'Test explanation',
  };
}
