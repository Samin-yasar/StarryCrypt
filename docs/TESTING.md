# StarryCrypt Testing Guide

Comprehensive guide to testing strategy, running tests, and writing new tests for StarryCrypt.

## Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Coverage Goals](#coverage-goals)
- [Crypto Testing](#crypto-testing)
- [Best Practices](#best-practices)
- [CI/CD Testing](#cicd-testing)

## Overview

StarryCrypt uses **Vitest** for unit and integration testing:

- **Framework**: Vitest (Jest-compatible)
- **Location**: `tests/` directory
- **Config**: `vitest.config.ts`
- **Coverage**: Aims for 80%+ on crypto functions
- **Speed**: Most tests run in < 1 second

### Why Vitest?

- Fast and lightweight
- Jest-compatible syntax (easy migration)
- Built with Vite for consistency
- Excellent TypeScript support
- ESM-friendly

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- crypto.test.ts

# Run tests matching a pattern
npm run test -- --grep "encrypt"

# Run with coverage report
npm run test -- --coverage
```

### Watch Mode

```bash
npm run test:watch
```

Automatically re-runs tests when files change. Perfect for development:
- Instant feedback on changes
- Focused debugging
- Fast iteration

### Coverage Reports

```bash
npm run test -- --coverage
```

Generates coverage report showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### Running in CI/CD

```bash
# Non-interactive mode (for CI environments)
npm run test -- --run

# With specific reporter
npm run test -- --reporter=verbose
```

## Test Structure

### Directory Organization

```
tests/
├── crypto.test.ts          # Crypto functions tests
├── components/
│   └── Button.test.tsx     # Component tests
└── utils/
    └── helpers.test.ts     # Utility function tests
```

### Naming Conventions

- Test files end with `.test.ts` or `.test.tsx`
- Group related tests with `describe()`
- Name tests clearly with `it()`
- One concept per test

### Basic Structure

```typescript
// tests/crypto.test.ts
import { describe, it, expect } from 'vitest';
import { encryptText, decryptText } from '../src/lib/crypto';

describe('Crypto Module', () => {
  describe('encryptText', () => {
    it('should encrypt text successfully', async () => {
      // Arrange
      const plaintext = 'Hello';
      const password = 'password123';
      
      // Act
      const ciphertext = await encryptText(plaintext, password, 400000);
      
      // Assert
      expect(ciphertext).toBeDefined();
      expect(typeof ciphertext).toBe('string');
    });
  });
});
```

## Writing Tests

### Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  let fixture: any;

  beforeEach(() => {
    // Setup before each test
    fixture = setupTestData();
  });

  afterEach(() => {
    // Cleanup after each test
    cleanupTestData();
  });

  it('should do something specific', async () => {
    // Arrange - Set up test data
    const input = 'test input';

    // Act - Execute the function
    const result = await myFunction(input);

    // Assert - Verify the result
    expect(result).toBeDefined();
  });
});
```

### Testing Crypto Functions

#### Encryption Tests

```typescript
it('should encrypt text with valid password', async () => {
  const plaintext = 'Secret message';
  const password = 'secure-password';
  const iterations = 400000;

  const ciphertext = await encryptText(plaintext, password, iterations);

  expect(ciphertext).toBeDefined();
  expect(typeof ciphertext).toBe('string');
  expect(ciphertext.length).toBeGreaterThan(0);
});

it('should generate different ciphertext for same input', async () => {
  const plaintext = 'Test';
  const password = 'password';

  const cipher1 = await encryptText(plaintext, password, 400000);
  const cipher2 = await encryptText(plaintext, password, 400000);

  // Different due to random salt and IV
  expect(cipher1).not.toBe(cipher2);
});

it('should handle empty plaintext', async () => {
  const plaintext = '';
  const password = 'password';

  const ciphertext = await encryptText(plaintext, password, 400000);

  expect(ciphertext).toBeDefined();
});
```

#### Decryption Tests

```typescript
it('should decrypt to original plaintext', async () => {
  const plaintext = 'Secret message';
  const password = 'secure-password';
  const iterations = 400000;

  const ciphertext = await encryptText(plaintext, password, iterations);
  const decrypted = await decryptText(ciphertext, password);

  expect(decrypted).toBe(plaintext);
});

it('should fail with wrong password', async () => {
  const plaintext = 'Secret';
  const password = 'correct-password';
  const wrongPassword = 'wrong-password';

  const ciphertext = await encryptText(plaintext, password, 400000);

  await expect(
    decryptText(ciphertext, wrongPassword)
  ).rejects.toThrow('Decryption failed');
});

it('should fail with invalid ciphertext', async () => {
  const invalidCiphertext = 'not-valid-base64!!!';
  const password = 'password';

  await expect(
    decryptText(invalidCiphertext, password)
  ).rejects.toThrow('Decryption failed');
});

it('should fail with corrupted ciphertext', async () => {
  const plaintext = 'Secret';
  const password = 'password';

  let ciphertext = await encryptText(plaintext, password, 400000);
  // Corrupt a character in the middle
  const corrupted = ciphertext.slice(0, 50) + 'X' + ciphertext.slice(51);

  await expect(
    decryptText(corrupted, password)
  ).rejects.toThrow('Decryption failed');
});
```

#### Iteration Count Tests

```typescript
it('should respect min iteration count', async () => {
  const plaintext = 'Test';
  const password = 'password';
  const lowIterations = 1000; // Below minimum

  // Should be clamped to MIN_ITERATIONS
  const ciphertext = await encryptText(plaintext, password, lowIterations);
  const decrypted = await decryptText(ciphertext, password);

  expect(decrypted).toBe(plaintext);
});

it('should respect max iteration count', async () => {
  const plaintext = 'Test';
  const password = 'password';
  const highIterations = 100000000; // Above maximum

  // Should be clamped to MAX_ITERATIONS
  const ciphertext = await encryptText(plaintext, password, highIterations);
  const decrypted = await decryptText(ciphertext, password);

  expect(decrypted).toBe(plaintext);
});
```

### Testing React Components

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../src/components/MyComponent';

describe('MyComponent', () => {
  it('should render with title', () => {
    render(<MyComponent title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Coverage Goals

### Target Coverage Metrics

| Component | Target | Priority |
|-----------|--------|----------|
| Crypto functions | 95%+ | Critical |
| Components | 80%+ | High |
| Utils | 85%+ | High |
| Pages | 70%+ | Medium |

### Checking Coverage

```bash
npm run test -- --coverage
```

Generates HTML report at `coverage/index.html`

### Critical Paths to Test

1. **Encryption flow** - Most important security function
2. **Decryption flow** - Must handle all error cases
3. **Key derivation** - Verify iteration count handling
4. **Error handling** - Ensure generic error messages

## Crypto Testing

### Security Considerations

#### What NOT to Test
```typescript
// ❌ DON'T hardcode expected ciphertext
// (Changes with random salt/IV)
it('should produce exact ciphertext', async () => {
  const cipher = await encryptText('test', 'pass', 400000);
  expect(cipher).toBe('AQAAAAk5VvI...'); // WRONG!
});
```

#### What to Test
```typescript
// ✅ DO test properties and round-trip
it('should produce valid ciphertext', async () => {
  const cipher = await encryptText('test', 'pass', 400000);
  
  // Test: is it Base64?
  expect(/^[A-Za-z0-9+/]*={0,2}$/.test(cipher)).toBe(true);
  
  // Test: can we decrypt it?
  const decrypted = await decryptText(cipher, 'pass');
  expect(decrypted).toBe('test');
});
```

### Testing Random Generation

```typescript
it('should use random values', async () => {
  const plaintext = 'Test';
  const password = 'password';

  const cipher1 = await encryptText(plaintext, password, 400000);
  const cipher2 = await encryptText(plaintext, password, 400000);

  // Should be different (different random salt/IV)
  expect(cipher1).not.toBe(cipher2);

  // But both should decrypt to same plaintext
  const plain1 = await decryptText(cipher1, password);
  const plain2 = await decryptText(cipher2, password);

  expect(plain1).toBe(plain2);
  expect(plain1).toBe(plaintext);
});
```

### Performance Testing

```typescript
it('should complete encryption within reasonable time', async () => {
  const plaintext = 'Test';
  const password = 'password';

  const startTime = performance.now();
  await encryptText(plaintext, password, 400000);
  const endTime = performance.now();

  // Should complete within 5 seconds
  expect(endTime - startTime).toBeLessThan(5000);
});
```

## Best Practices

### Do's ✅

- **Use descriptive test names**: "should encrypt text with valid password"
- **One assertion focus per test**: Test one behavior at a time
- **Use AAA pattern**: Arrange, Act, Assert
- **Test edge cases**: Empty strings, max values, invalid inputs
- **Test error paths**: What happens when things fail?
- **Keep tests independent**: Each test stands alone
- **Use fixtures for setup**: Don't repeat setup code
- **Mock external dependencies**: Isolate what you're testing

### Don'ts ❌

- **Don't test implementation details**: Test behavior, not code structure
- **Don't hardcode expected values**: For crypto, expect properties instead
- **Don't skip error tests**: Error handling is crucial
- **Don't make tests too slow**: Should run in milliseconds (except crypto)
- **Don't couple tests**: One test shouldn't depend on another
- **Don't use random data in assertions**: Use known data for predictable results
- **Don't test third-party libraries**: Test your usage, not library implementation

### Test Data

Use realistic but simple test data:

```typescript
// Good test data
const testCases = [
  { plaintext: '', password: 'test' },
  { plaintext: 'a', password: 'b' },
  { plaintext: 'Hello, World!', password: 'password123' },
  { plaintext: '🔒 emoji', password: 'unicode-test' },
  { plaintext: 'Long text '.repeat(100), password: 'long-password' },
];

testCases.forEach(({ plaintext, password }) => {
  it(`should round-trip "${plaintext.slice(0, 20)}..."`, async () => {
    const ciphertext = await encryptText(plaintext, password, 400000);
    const decrypted = await decryptText(ciphertext, password);
    expect(decrypted).toBe(plaintext);
  });
});
```

## CI/CD Testing

### GitHub Actions Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Pre-commit Testing

Run tests before committing:

```bash
# Install husky
npm install husky --save-dev
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "npm run test"
```

### Continuous Testing

```bash
# Watch mode during development
npm run test:watch

# Full suite before pushing
npm run test && npm run lint && npm run build
```

## Debugging Tests

### Logging in Tests

```typescript
it('should debug encryption', async () => {
  const plaintext = 'Test';
  const password = 'password';

  console.log('[test] Starting encryption...');
  const ciphertext = await encryptText(plaintext, password, 400000);
  console.log('[test] Ciphertext length:', ciphertext.length);

  const decrypted = await decryptText(ciphertext, password);
  console.log('[test] Decrypted:', decrypted);

  expect(decrypted).toBe(plaintext);
});
```

Run with:
```bash
npm run test -- --reporter=verbose
```

### Using Debugger

```typescript
it('should debug with debugger', async () => {
  debugger; // Set breakpoint
  const plaintext = 'Test';
  const cipher = await encryptText(plaintext, 'pass', 400000);
  expect(cipher).toBeDefined();
});
```

Run with:
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

## Common Test Patterns

### Testing Async Functions

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// Or with .resolves
it('should resolve correctly', () => {
  return expect(asyncFunction()).resolves.toBeDefined();
});
```

### Testing Error Cases

```typescript
// Method 1: try/catch
it('should throw on invalid input', async () => {
  try {
    await decryptText('invalid', 'password');
    throw new Error('Should have thrown');
  } catch (error) {
    expect(error.message).toBe('Decryption failed');
  }
});

// Method 2: expect().rejects
it('should throw on invalid input', () => {
  return expect(
    decryptText('invalid', 'password')
  ).rejects.toThrow('Decryption failed');
});
```

### Testing Multiple Cases

```typescript
describe.each([
  ['hello', 'world'],
  ['foo', 'bar'],
  ['test', 'case'],
])('encryptDecrypt(%s, %s)', (plaintext, password) => {
  it('should round-trip', async () => {
    const cipher = await encryptText(plaintext, password, 400000);
    const decrypted = await decryptText(cipher, password);
    expect(decrypted).toBe(plaintext);
  });
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Jest Matchers](https://jestjs.io/docs/expect) (compatible with Vitest)
- [Web Crypto API Tests](https://github.com/web-platform-tests/wpt)

## Next Steps

1. Run existing tests: `npm run test`
2. Check coverage: `npm run test -- --coverage`
3. Write a test for your feature
4. Ensure all tests pass before PR
5. Maintain 80%+ coverage for your changes
