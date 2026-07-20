# StarryCrypt Deployment Guide

Complete guide to deploying StarryCrypt to production environments.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Building for Production](#building-for-production)
- [Deployment Options](#deployment-options)
- [Vercel Deployment](#vercel-deployment)
- [GitHub Pages](#github-pages)
- [Static Hosting](#static-hosting)
- [PWA Deployment](#pwa-deployment)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting Deployment](#troubleshooting-deployment)

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests pass: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Code reviewed and approved
- [ ] Security implications reviewed
- [ ] Changelog updated
- [ ] Version bumped in `package.json`
- [ ] README and docs are current
- [ ] No console errors or warnings
- [ ] Performance benchmarks acceptable
- [ ] HTTPS/SSL certificate ready
- [ ] Environment variables configured

### Pre-Deployment Commands

```bash
# Run full verification
npm run lint && npm run test && npm run build

# Verify build size
du -sh dist/

# Test production build locally
npm run preview

# Check for dependencies issues
npm audit
```

## Building for Production

### Standard Production Build

```bash
# Build optimized production bundle
npm run build

# This generates:
# - Minified JavaScript
# - Optimized CSS
# - Tree-shaken dependencies
# - Source maps (optional)
```

### Build Output

The build generates:

```
dist/
├── index.html              # Entry HTML file
├── assets/
│   ├── index-*.js         # Main bundle (minified)
│   ├── vendor-*.js        # Dependencies bundle
│   └── *.css              # Stylesheet (minified)
└── manifest.json          # PWA manifest
```

### Build Size

Typical production build sizes:
- **Main bundle**: 200-400 KB (gzipped: 60-120 KB)
- **Vendor bundle**: 400-600 KB (gzipped: 120-200 KB)
- **CSS**: 50-100 KB (gzipped: 10-30 KB)

Optimize if larger than these estimates.

### Development vs Production Build

```bash
# Standard production build (recommended)
npm run build

# Development build (unoptimized, for testing)
npm run build:dev

# Local preview of production build
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

**Easiest for Next.js-like projects, excellent for Vite apps**

Pros:
- One-click deployment from GitHub
- Automatic SSL/TLS
- Global CDN
- Preview deployments
- Analytics included

See [Vercel Deployment](#vercel-deployment) section below.

### Option 2: GitHub Pages

**Free hosting for static sites**

Pros:
- Free
- Integrated with GitHub
- Automatic HTTPS

Cons:
- Limited customization
- No serverless functions

### Option 3: Netlify

**Similar to Vercel with good free tier**

Pros:
- Easy GitHub integration
- Free tier with 300GB bandwidth
- Good performance

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 4: AWS S3 + CloudFront

**Scalable, cost-effective for static content**

Pros:
- Highly scalable
- Pay-per-use pricing
- Global distribution

Requires:
- AWS account setup
- S3 bucket configuration
- CloudFront distribution

### Option 5: Nginx/Apache on VPS

**Full control, requires server management**

Pros:
- Full control
- No vendor lock-in

Cons:
- Requires server management
- Manual SSL/TLS renewal
- Infrastructure maintenance

## Vercel Deployment

### Quick Start

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select GitHub repository
   - Vercel auto-detects Vite config

3. **Deploy**
   - Click "Deploy"
   - Automatic HTTPS provisioning
   - Get unique domain URL

### Vercel Configuration File

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Environment Variables

Set in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add any needed variables:
   ```
   VITE_APP_TITLE=StarryCrypt
   ```
3. Redeploy to apply

### Preview Deployments

Every PR automatically gets a preview URL:
- Preview URL: `https://staging-xxxxx.vercel.app`
- Main domain: `https://starrycrypt.vercel.app`

### Analytics

Vercel provides built-in Web Analytics:
- Visit Project Settings → Analytics
- Track page views, visits, bounce rate
- No additional code needed

### Custom Domain

1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Update DNS records:
   ```
   CNAME: xxx.vercel.app (or A record if root)
   ```
4. SSL certificate auto-provisioned

## GitHub Pages

### Setup for GitHub Pages

1. **Update vite.config.ts**:
```typescript
export default defineConfig({
  base: '/StarryCrypt/', // or '/' if using custom domain
  // ... rest of config
});
```

2. **Create deploy workflow** `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Set source to "GitHub Actions"
   - Deployments appear under Environments

### Custom Domain with GitHub Pages

1. In `public/CNAME`:
```
starrycrypt.example.com
```

2. Update DNS CNAME to GitHub Pages:
```
CNAME: username.github.io
```

3. Verify domain in GitHub Pages settings

## Static Hosting

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://starrycrypt-bucket/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567 \
  --paths "/*"
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Select build command: `npm run build`
3. Set output directory: `dist/`
4. Deploy

## PWA Deployment

StarryCrypt includes PWA configuration (`vite-plugin-pwa`):

### PWA Features Enabled

- Service Worker caching
- Offline functionality
- Install to home screen
- `manifest.json` configuration

### Manifest Configuration

`public/manifest.json`:

```json
{
  "name": "StarryCrypt",
  "short_name": "StarryCrypt",
  "description": "Secure text encryption",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Testing PWA

1. Build and preview:
```bash
npm run build
npm run preview
```

2. Open in Chrome DevTools:
   - Application → Manifest
   - Application → Service Workers
   - Verify offline mode works

### PWA Deployment Considerations

- Must use HTTPS (requirement for Service Workers)
- Icons should be high quality
- Manifest must be valid
- Test offline functionality

## Environment Configuration

### Environment Variables

Set different variables per environment:

**Production (.env.production)**:
```
VITE_API_URL=https://api.starrycrypt.com
VITE_ENV=production
```

**Development (.env.development)**:
```
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

**Testing (.env.test)**:
```
VITE_ENV=test
```

### Accessing Environment Variables

In TypeScript:
```typescript
const env = import.meta.env.VITE_APP_TITLE;
```

Must be prefixed with `VITE_` to be exposed.

## Performance Optimization

### Build Size Optimization

Check bundle size:
```bash
npm run build -- --analyze
```

### Gzip Compression

Ensure server gzips responses:

**Vercel**: Automatic
**Nginx**:
```nginx
gzip on;
gzip_types text/javascript application/javascript;
```

### Caching Headers

**Production (Vercel/CDN)**:
```
Cache-Control: public, max-age=31536000, immutable
```

**HTML (no cache)**:
```
Cache-Control: public, max-age=0, must-revalidate
```

### Image Optimization

Use modern formats (WebP, AVIF):
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="...">
</picture>
```

### Critical Performance Metrics

Target metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

Monitor with:
```bash
npm run preview  # Local testing
```

Then use Chrome DevTools → Lighthouse.

## Monitoring & Analytics

### Vercel Analytics

Built-in monitoring:
- Page views and visits
- Core Web Vitals
- User geography
- Device types

### Error Tracking

Add error reporting:

```typescript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});
```

### Security Headers

Set these headers in deployment:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Vercel**: Automatic
**Nginx**:
```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options "nosniff" always;
```

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache
rm -rf dist node_modules package-lock.json

# Reinstall and rebuild
npm install
npm run build
```

### Port Already in Use

```bash
# Find and kill process
lsof -i :5173
kill -9 <PID>
```

### CORS Issues

If frontend/backend on different domains, configure:
```typescript
// In API calls
fetch(url, {
  mode: 'cors',
  credentials: 'include'
});
```

### Environment Variables Not Loaded

- Must prefix with `VITE_`
- Must restart dev server after changes
- Verify in `import.meta.env`

### Service Worker Caching Issues

Clear cache:
```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(r => r.unregister()));
```

### Large Bundle Size

```bash
# Analyze bundle
npm run build -- --analyze

# Identify large dependencies
npm ls

# Look for duplicate dependencies
npm dedupe
```

## Deployment Checklist

Before going live:

- [ ] Build passes locally: `npm run build`
- [ ] No console errors
- [ ] Performance acceptable (LCP < 2.5s)
- [ ] PWA works offline
- [ ] URLs work correctly
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Monitoring set up
- [ ] Rollback plan ready
- [ ] DNS/domain configured

## Rollback Procedure

If deployment has issues:

### Vercel
1. Go to Deployments
2. Find stable deployment
3. Click "Promote to Production"

### GitHub Pages
1. Revert commit: `git revert <commit>`
2. Push: `git push origin main`
3. Workflow redeploys automatically

### Manual Rollback
```bash
# Revert to previous version
git checkout <previous-commit>
git push origin main --force-with-lease
npm run build
# Redeploy
```

## Post-Deployment

After successful deployment:

1. Test all critical features
2. Monitor error logs
3. Check Core Web Vitals
4. Verify analytics tracking
5. Update status page if public
6. Communicate with team
7. Monitor for 24 hours

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Web Vitals](https://web.dev/vitals/)
- [PWA Deployment](https://web.dev/progressive-web-apps/)
