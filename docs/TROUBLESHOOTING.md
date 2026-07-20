# StarryCrypt Troubleshooting Guide

Solutions for common issues encountered when using or developing StarryCrypt.

## Table of Contents

- [Setup Issues](#setup-issues)
- [Runtime Issues](#runtime-issues)
- [Encryption/Decryption Issues](#encryptiondecryption-issues)
- [Build Issues](#build-issues)
- [Testing Issues](#testing-issues)
- [Deployment Issues](#deployment-issues)
- [Browser Compatibility](#browser-compatibility)
- [Performance Issues](#performance-issues)
- [Getting Help](#getting-help)

## Setup Issues

### Node.js Not Found

**Error**: `node: command not found`

**Solution**:
1. Install Node.js 18+ from [nodejs.org](https://nodejs.org)
2. Verify installation:
   ```bash
   node --version  # Should show v18+
   npm --version   # Should show v9+
   ```

### npm Install Fails

**Error**: `npm ERR! code ERESOLVE`

**Causes**:
- Conflicting dependencies
- Old npm version

**Solutions**:
```bash
# Update npm
npm install -g npm@latest

# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Try with exact versions
npm ci  # Instead of npm install
```

### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Find process using port
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found

**Error**: `Cannot find module '@/lib/crypto'`

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check tsconfig.json paths configuration
cat tsconfig.json | grep -A 5 '"paths"'

# Verify import path is correct
# Should be: import { encryptText } from '@/lib/crypto'
```

### TypeScript Errors

**Error**: `Type 'string' is not assignable to type 'number'`

**Solutions**:
```bash
# Type-check entire project
npx tsc --noEmit

# Check specific file
npx tsc src/lib/crypto.ts --noEmit

# Fix common issues
npm run lint -- --fix
```

## Runtime Issues

### "Decryption failed" Error

**Causes**:
1. Wrong password entered
2. Ciphertext corrupted or modified
3. Invalid Base64 encoding
4. Browser doesn't support Web Crypto API

**Solutions**:
- **Check password**: Verify caps lock, language layout
- **Check ciphertext**: Copy carefully, no modifications
- **Check browser**: Use modern browser (Chrome 37+, Firefox 34+, Safari 11+)
- **Check HTTPS**: Web Crypto requires HTTPS or localhost

**Debug steps**:
```javascript
// In browser console
// Check ciphertext is valid Base64
const isValidBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(ciphertext);
console.log('Valid Base64:', isValidBase64);

// Check Web Crypto API available
console.log('Web Crypto:', window.crypto.subtle ? 'Available' : 'Not available');
```

### Encryption Takes Too Long

**Causes**:
- High iteration count (slower but more secure)
- Slow device
- Too much data

**Solutions**:
```typescript
// Reduce iterations for faster performance
const iterations = 400000; // Minimum, fastest
await encryptText(text, password, iterations);

// Higher iterations for more security (slower)
const iterations = 1000000; // Takes ~3-4 seconds
await encryptText(text, password, iterations);
```

### Web Crypto API Not Available

**Error**: `crypto.subtle is not defined`

**Causes**:
- Not HTTPS (outside localhost)
- Old browser
- Browser privacy settings

**Solutions**:
1. **Use HTTPS**: Deploy with SSL/TLS
2. **Use localhost**: For development
3. **Update browser**: Use latest version
4. **Check privacy settings**: Allow crypto APIs
5. **Check DevTools**: See specific error message

```javascript
// Check Web Crypto availability
if (!window.crypto?.subtle) {
  console.error('Web Crypto API not available');
  alert('Your browser does not support encryption');
}
```

### Blank Screen

**Causes**:
- Build errors
- Missing dependencies
- JavaScript error

**Solutions**:
```bash
# Check browser console for errors (F12)
# Look for red error messages

# Try full rebuild
npm run build && npm run preview

# Check local storage issues
# In browser console:
localStorage.clear()
location.reload()

# Verify all dependencies installed
npm ls

# Check for circular dependencies
npm run lint
```

### URL Query Parameters Lost

**Error**: Encrypted text in URL disappears

**Cause**: Browser or proxy sanitizing URL

**Solution**: Use the "Copy" button instead of URL sharing

## Encryption/Decryption Issues

### Same Password Produces Different Results

**Explanation**: This is normal and secure!

Each encryption creates:
- New random salt (32 bytes)
- New random IV (12 bytes)

Same plaintext + password always produces different ciphertext.

```typescript
// Expected behavior:
const cipher1 = await encryptText('test', 'password', 400000);
const cipher2 = await encryptText('test', 'password', 400000);

console.log(cipher1 === cipher2); // false (good!)

// But both decrypt to same plaintext:
const plain1 = await decryptText(cipher1, 'password');
const plain2 = await decryptText(cipher2, 'password');

console.log(plain1 === plain2); // true
console.log(plain1); // 'test'
```

### Can't Decrypt Old Ciphertexts

**Causes**:
- Format changed
- Password changed
- Ciphertext corrupted

**Solutions**:
- Format Version 1 is current standard
- Verify password hasn't changed
- Verify ciphertext is complete (no truncation)
- Try in different browser

### Very Long Text Fails

**Cause**: Browser memory limit exceeded

**Browsers limit**:
- Chrome: ~50MB+
- Firefox: ~50MB+
- Safari: ~30MB+

**Solutions**:
```typescript
// Check text length before encrypting
if (text.length > 50_000_000) {
  console.error('Text too large');
  // Encrypt in chunks or split file
}

// Estimate size
const sizeInMB = text.length / (1024 * 1024);
console.log(`Size: ${sizeInMB.toFixed(2)} MB`);
```

### Non-ASCII Characters Issue

**Cause**: Some encodings not supported

**Solution**: All UTF-8 characters supported:
```typescript
// These all work fine:
await encryptText('Hello', 'password', 400000); // ASCII
await encryptText('你好', 'password', 400000); // Chinese
await encryptText('🔒 secure', 'password', 400000); // Emoji
await encryptText('Привет', 'password', 400000); // Cyrillic
```

## Build Issues

### Build Command Fails

**Error**: `npm run build` returns error

**Debug steps**:
```bash
# See full error output
npm run build -- --verbose

# Check for type errors
npx tsc --noEmit

# Check ESLint errors
npm run lint

# Clear cache and retry
rm -rf dist .vite
npm run build
```

### Large Bundle Size

**Error**: Build size > 500KB gzipped

**Solutions**:
```bash
# Analyze bundle
npm run build -- --analyze

# Check what's large
npm ls --depth=0

# Look for duplicates
npm dedupe

# Remove unused dependencies
npm prune

# Check for large dependencies in node_modules
du -sh node_modules/* | sort -hr | head
```

### Build Works Locally but Fails in CI

**Causes**:
- Different Node.js version
- Node version mismatch
- Missing environment variables

**Solutions**:
```bash
# Use same Node version as CI
nvm use 18  # Or version CI uses

# Install exact versions
npm ci  # Instead of npm install

# Check environment variables
echo $CI
echo $GITHUB_ACTIONS

# Try building with exact ci environment
npm ci
npm run lint
npm run test
npm run build
```

## Testing Issues

### Tests Fail Locally but Pass on CI

**Causes**:
- Different timezone
- System time issues
- Timing-sensitive tests

**Solutions**:
```bash
# Run tests multiple times
for i in {1..5}; do npm run test; done

# Run in watch mode
npm run test:watch

# Run with specific seed
npm run test -- --seed 12345
```

### Test Timeouts

**Error**: `Test timed out after 5000ms`

**Cause**: Async operation too slow

**Solution**:
```typescript
// Increase timeout for slow operations
it('should encrypt large text', async () => {
  // ... long operation
}, 10000); // 10 second timeout
```

### Cannot Find Test File

**Error**: `Cannot find test file`

**Solutions**:
```bash
# Check file exists
ls tests/crypto.test.ts

# Check path in import
# Should match actual path

# Run specific test
npm run test -- tests/crypto.test.ts

# Run all tests
npm run test
```

## Deployment Issues

### CORS Errors in Production

**Error**: `Access-Control-Allow-Origin header missing`

**Cause**: Usually not an issue for StarryCrypt (no backend calls)

**If encountered**:
```typescript
// Check what's making cross-origin requests
// StarryCrypt should make none

// If third-party scripts causing issues:
fetch(url, {
  mode: 'cors',
  credentials: 'include'
});
```

### Service Worker Cache Issues

**Problem**: Old version cached, new version not loading

**Solution**:
```javascript
// Clear service worker cache in browser console:
navigator.serviceWorker.getRegistrations()
  .then(regs => {
    regs.forEach(reg => reg.unregister());
  });

// Hard refresh
Ctrl + Shift + Delete (or Cmd + Shift + Delete)
```

### HTTPS Certificate Issues

**Error**: `NET::ERR_CERT_AUTHORITY_INVALID`

**Solutions**:
- Let Vercel handle SSL (recommended)
- Use certbot for self-hosted: `certbot certonly --standalone`
- Purchase certificate from cert provider

### 404 on Refresh

**Cause**: Web server not configured for SPA

**Solution** (depends on hosting):

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Vercel**: Automatic

## Browser Compatibility

### Checking Browser Support

```javascript
// Check Web Crypto API
if (!window.crypto?.subtle?.encrypt) {
  console.warn('Web Crypto not fully supported');
}

// Check required APIs
const apis = {
  'Web Crypto': window.crypto?.subtle,
  'TextEncoder': typeof TextEncoder !== 'undefined',
  'Uint8Array': typeof Uint8Array !== 'undefined',
  'Promise': typeof Promise !== 'undefined',
};

Object.entries(apis).forEach(([name, supported]) => {
  console.log(`${name}: ${supported ? '✓' : '✗'}`);
});
```

### Polyfills Needed

**Modern browsers**: No polyfills needed

**Legacy browsers**: Not supported
- No polyfill for Web Crypto API
- Use modern browser instead

### Testing Different Browsers

```bash
# Use BrowserStack or similar service
# Or test locally with different browsers

# Chrome
# Firefox  
# Safari
# Edge
```

## Performance Issues

### Slow Encryption

**Causes**:
- High iteration count
- Slow device
- Large text

**Optimize**:
```typescript
// Monitor performance
const start = performance.now();
const cipher = await encryptText(text, password, 400000);
const end = performance.now();

console.log(`Encryption took: ${(end - start) / 1000}s`);

// Reduce iterations if too slow
// Or increase for better security
```

### Slow UI

**Causes**:
- Encryption blocking UI thread
- Large DOM updates
- Unoptimized components

**Solutions**:
```typescript
// Use Web Workers for encryption
const worker = new Worker('crypto-worker.js');
worker.postMessage({ text, password, iterations });
worker.onmessage = (e) => {
  console.log('Encrypted:', e.data);
};
```

### Memory Issues

**Symptoms**:
- Browser becomes slow
- Memory usage high
- "Out of memory" errors

**Solutions**:
```bash
# Check for memory leaks
# In Chrome DevTools: Memory tab

# Solutions:
# - Close other tabs
# - Clear browser cache
# - Restart browser
# - Use lower iteration counts
```

## Network Issues

### Slow Downloads (if self-hosted)

**Solutions**:
- Enable gzip compression
- Use CDN
- Optimize bundle size
- Cache aggressively

### Connection Drops Mid-Encryption

**Causes**: StarryCrypt runs entirely client-side, so should not be affected

**If encountered**: It's unrelated to StarryCrypt. Check:
- Internet connection
- Browser cache
- Firewall/proxy

## Getting Help

### Before Opening an Issue

1. **Check existing issues**: [GitHub Issues](https://github.com/Samin-yasar/StarryCrypt/issues)
2. **Read documentation**: Check [DEVELOPMENT.md](DEVELOPMENT.md) and [API.md](API.md)
3. **Search Google**: Your error message + "StarryCrypt"
4. **Reproduce**: Test in browser console and multiple browsers

### How to Report Issues

When opening an issue, include:

1. **Description**: Clear, specific title
2. **Steps to reproduce**: Numbered steps
3. **Expected vs actual**: What should happen vs. what does
4. **Environment**:
   ```
   Browser: Chrome 120
   OS: Windows 11
   Node: 18.17.0
   npm: 9.8.1
   ```
5. **Console errors**: Screenshots or text of error
6. **Minimal example**: Simplified code to reproduce

### Useful Commands for Debugging

```bash
# Check environment
npm list node --depth=0
npm --version
node --version
git --version

# Check browser compatibility
# Open DevTools and run:
# window.crypto.subtle

# Check build
npm run build -- --verbose

# Check tests
npm run test -- --reporter=verbose

# Check dependencies
npm audit
npm outdated
```

### Resources

- [Documentation](../docs/)
- [GitHub Issues](https://github.com/Samin-yasar/StarryCrypt/issues)
- [Discussions](https://github.com/Samin-yasar/StarryCrypt/discussions)
- [Web Crypto API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Crypto Guidelines](https://owasp.org/www-community/attacks/Cryptanalysis)

## Emergency Contacts

For security issues: See [SECURITY.md](../SECURITY.md)

For urgent support: Open GitHub Discussion
