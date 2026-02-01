# Hosting Decision Guide: Math7 Platform

**Document Version**: 1.0  
**Date**: 2026-02-01  
**Status**: Production-Grade Recommendation

---

## Executive Summary

**Context**: Math7 consists of two static web applications (Flutter Web + React SPA) with Supabase backend (database, auth, storage, APIs). No server-side rendering required.

**Key Findings**:
1. **Recommended Primary**: **Cloudflare Pages** — Zero-cost for this workload, global CDN, unlimited bandwidth, best performance characteristics, trivial Supabase integration
2. **Recommended Backup**: **Vercel** — Battle-tested for React SPAs, excellent DX, free tier sufficient, robust preview deployments
3. **Exclude Netlify**: Bandwidth limits (100GB/mo free) create cost risk; no technical advantage over Cloudflare Pages
4. **Exclude Firebase Hosting**: Vendor lock-in with Google, less suitable for multi-app setup, Firebase SDKs not needed here
5. **Flutter Web Considerations**: Build artifact size (~2-3MB compressed), requires proper MIME types and routing rules, works on all platforms tested
6. **Domain Layout**: `app.math7.com` (student), `admin.math7.com` (admin panel), both on same hosting provider for operational simplicity
7. **Cost Projection**: $0/month on Cloudflare Pages free tier (handles expected traffic of <10K users/month easily)

**Decision**: Deploy both apps to **Cloudflare Pages**. Use **Vercel** as a tested fallback if Cloudflare has issues.

---

## Detailed Platform Analysis

### 1. Cloudflare Pages

#### Hosting Model
- **Type**: Static site hosting with global CDN (Cloudflare's edge network, 300+ locations)
- **Build**: GitHub integration with automatic builds on push
- **Edge**: Content served from edge, no origin servers to manage
- **Routing**: Supports SPA routing via `_redirects` or `_headers` files

#### Reliability & Performance
- **Uptime**: 99.99%+ SLA on paid plans; free tier historically very stable
- **Global Performance**: Best-in-class CDN with 300+ PoPs, sub-50ms latency for most users
- **Cold Start**: N/A (static assets, no cold starts)
- **DDoS Protection**: Enterprise-grade DDoS mitigation included free

#### Build & Deploy Workflow
- **GitHub Integration**: Native integration, auto-deploy on push to main/PR branches
- **Preview Deployments**: Unlimited preview deployments per PR (unique URL per commit)
- **Build Config**: `wrangler.toml` or Web UI configuration
- **Build Minutes**: Unlimited (free tier)
- **Build Environment**: Node.js, Python, Go, Rust supported; Flutter requires custom Docker image or pre-build step

#### Cost Model
| Metric | Free Tier | Paid Tier | Risk Assessment |
|--------|-----------|-----------|-----------------|
| Bandwidth | **Unlimited** | **Unlimited** | ✅ No surprise charges |
| Builds | **Unlimited** | **Unlimited** | ✅ Safe |
| Sites | 500 projects | Unlimited | ✅ More than enough |
| Build Concurrency | 1 concurrent | 5 concurrent | ⚠️ May queue builds during high activity |
| Custom Domains | 100/project | 100/project | ✅ Sufficient |

**Verdict**: Zero cost risk. Free tier covers this workload indefinitely.

#### Limits That Matter
- **Max File Size**: 25MB per file (Flutter build artifacts typically 2-3MB compressed)
- **Max Files**: 20,000 files per deployment (Flutter Web ~200-500 files)
- **Build Timeout**: 20 minutes (Flutter build takes ~3-5 minutes)
- **Deployment Frequency**: Unlimited
- **Edge Functions**: 100K requests/day free (not needed for static hosting)

**Verdict**: No blocking limits for this use case.

#### Supabase Compatibility
- **CORS**: Cloudflare does not inject CORS headers; configure CORS in Supabase dashboard
- **Auth Redirects**: Works seamlessly; configure redirect URLs in Supabase Auth settings
  - Example: `https://admin.math7.com/auth/callback`
- **Custom Domains**: Simple DNS setup (CNAME to `pages.dev` domain)
- **API Calls**: Direct client-side calls to Supabase API (no proxy needed)

**Verdict**: ✅ Perfect fit. Zero compatibility issues.

#### Flutter Web Specifics
- **Build Output**: Deploy `build/web/` directory directly
- **Routing**: Add `_redirects` file for SPA routing:
  ```
  /*    /index.html   200
  ```
- **MIME Types**: Cloudflare auto-detects; may need `_headers` for `.wasm` files:
  ```
  /flutter_service_worker.js
    Content-Type: application/javascript
  /main.dart.js
    Content-Type: application/javascript
  ```
- **Build Performance**: Pre-build Flutter locally or in GitHub Actions (Pages build may be slow for Flutter)

**Recommendation**: ✅ Use Cloudflare Pages. Pre-build Flutter artifacts in CI, then deploy to Pages.

---

### 2. Vercel

#### Hosting Model
- **Type**: Static & serverless hosting (designed for Next.js, works for any static site)
- **Build**: GitHub/GitLab/Bitbucket integration
- **Edge**: Vercel Edge Network (global CDN)
- **Routing**: Automatic SPA routing detection

#### Reliability & Performance
- **Uptime**: 99.99% SLA (historically excellent)
- **Global Performance**: Very good CDN (70+ regions), slightly behind Cloudflare in edge coverage
- **Cold Start**: N/A for static sites
- **Developer Experience**: Industry-leading; best-in-class preview deployments and DX

#### Build & Deploy Workflow
- **GitHub Integration**: Excellent native integration
- **Preview Deployments**: Automatic PR previews with unique URLs
- **Build Config**: `vercel.json` or auto-detection
- **Build Minutes**: Free tier includes builds (no hard limit published, fair use policy)
- **Build Environment**: Full Node.js support, custom Docker images possible

#### Cost Model
| Metric | Free (Hobby) | Pro ($20/mo) | Enterprise | Risk Assessment |
|--------|--------------|--------------|------------|-----------------|
| Bandwidth | 100GB/mo | 1TB/mo | Custom | ⚠️ Could exceed free tier at scale |
| Builds | Unlimited | Unlimited | Unlimited | ✅ Safe |
| Deployments | Unlimited | Unlimited | Unlimited | ✅ Safe |
| Serverless Invocations | 100K/day | 1M/day | Custom | ✅ N/A (static only) |
| Team Size | 1 user | Unlimited | Unlimited | ⚠️ Must upgrade for team access |

**Verdict**: Free tier works for MVP. May need Pro ($20/mo) for team collaboration or if bandwidth exceeds 100GB/mo.

#### Limits That Matter
- **Max File Size**: 50MB per file (no issue)
- **Max Deployment Size**: 250MB uncompressed (Flutter ~50-80MB uncompressed)
- **Build Timeout**: 45 minutes (free tier; more than enough)
- **Concurrent Builds**: Fair use limits (typically 1-3 concurrent)

**Verdict**: No blocking limits.

#### Supabase Compatibility
- **CORS**: No issues; configure CORS in Supabase
- **Auth Redirects**: Works perfectly; Vercel provides HTTPS by default
- **Custom Domains**: Simple setup via Vercel dashboard
- **API Calls**: Direct client-side calls to Supabase

**Verdict**: ✅ Excellent compatibility. Zero issues.

#### Flutter Web Specifics
- **Build Output**: Deploy `build/web/` directory
- **Routing**: Auto-detected SPA routing (or use `vercel.json`):
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- **MIME Types**: Auto-detected correctly
- **Build Performance**: Good support for custom build commands

**Recommendation**: ✅ Excellent choice, especially for React admin panel. Works well for Flutter too.

---

### 3. Netlify

#### Hosting Model
- **Type**: Static hosting with edge network
- **Build**: GitHub/GitLab/Bitbucket integration
- **Edge**: Netlify Edge (global CDN)
- **Routing**: `_redirects` file for SPA routing

#### Reliability & Performance
- **Uptime**: 99.9%+ (good but not best-in-class)
- **Global Performance**: Good CDN coverage, comparable to Vercel
- **Cold Start**: N/A for static
- **Developer Experience**: Good but has fallen behind Vercel/Cloudflare in recent years

#### Build & Deploy Workflow
- **GitHub Integration**: Native integration
- **Preview Deployments**: Automatic PR previews
- **Build Config**: `netlify.toml` or Web UI
- **Build Minutes**: 300 minutes/month free
- **Build Environment**: Standard Node.js environments

#### Cost Model
| Metric | Free (Starter) | Pro ($19/mo) | Risk Assessment |
|--------|----------------|--------------|-----------------|
| Bandwidth | **100GB/mo** | 1TB/mo | ⚠️ **Cost risk at scale** |
| Build Minutes | 300/mo | 25,000/mo | ⚠️ May run out with frequent deploys |
| Sites | 500 | 500 | ✅ Sufficient |
| Team Size | 1 user | 5 users | ⚠️ Must upgrade for team |

**Verdict**: Free tier has restrictive bandwidth limits. Risk of surprise $0.20/GB overage charges.

#### Limits That Matter
- **Bandwidth Limit**: **100GB/month** — **DEALBREAKER** for growing app
  - Flutter Web: ~2.5MB per page load
  - 100GB = ~40,000 page loads/month
  - If you get 2,000 users/month doing 30 page loads each = 150GB/month = **$10 overage**
- **Build Minutes**: 300/month (Flutter builds ~5 min = 60 deploys/month max)
- **Max File Size**: 50MB per file
- **Concurrent Builds**: 1 concurrent (free tier)

**Verdict**: ⚠️ Bandwidth limit is a **hard blocker** for production use without paid plan.

#### Supabase Compatibility
- **CORS**: Configure in Supabase
- **Auth Redirects**: Works correctly
- **Custom Domains**: Standard setup
- **API Calls**: Direct client-side calls

**Verdict**: ✅ No compatibility issues.

#### Flutter Web Specifics
- **Build Output**: Deploy `build/web/` directory
- **Routing**: Add `_redirects`:
  ```
  /*    /index.html   200
  ```
- **MIME Types**: Generally works; may need `_headers` tweaks

**Recommendation**: ❌ **Exclude**. Bandwidth limits create unacceptable cost risk. No advantage over Cloudflare Pages.

---

### 4. Firebase Hosting

#### Hosting Model
- **Type**: Static hosting on Google's CDN
- **Build**: Requires Firebase CLI or GitHub Actions integration
- **Edge**: Google Cloud CDN
- **Routing**: `firebase.json` rewrite rules

#### Reliability & Performance
- **Uptime**: 99.95% SLA (Firebase SLA)
- **Global Performance**: Good (Google Cloud CDN), but not as performant as Cloudflare
- **Cold Start**: N/A for static
- **Vendor Lock-in**: ⚠️ Tightly coupled to Firebase ecosystem

#### Build & Deploy Workflow
- **GitHub Integration**: Requires Firebase CLI or custom GitHub Actions setup (less streamlined)
- **Preview Deployments**: Supports preview channels via CLI
- **Build Config**: `firebase.json`
- **Build Environment**: Deploy pre-built artifacts (no built-in CI/CD)

#### Cost Model
| Metric | Free (Spark) | Paid (Blaze) | Risk Assessment |
|--------|--------------|--------------|-----------------|
| Storage | 10GB | Pay-as-you-go | ✅ Sufficient |
| Bandwidth | 360MB/day (~10GB/mo) | $0.15/GB | ⚠️ **Very low free tier** |
| Custom Domains | 10 | Unlimited | ✅ Sufficient |

**Verdict**: Free tier is too small (10GB/month bandwidth). Must use paid plan.

#### Limits That Matter
- **Bandwidth Limit**: **360MB/day** (~10GB/month) on free tier — **BLOCKING**
  - 10GB = ~4,000 page loads/month (Flutter Web ~2.5MB per load)
- **On Paid Plan**: $0.15/GB bandwidth (expensive compared to $0/GB on Cloudflare)
- **Max File Size**: 2GB per file
- **Deployments**: 10 versions retained

**Verdict**: ❌ Free tier unusable. Paid tier more expensive than competitors with no advantage.

#### Supabase Compatibility
- **CORS**: Configure in Supabase
- **Auth Redirects**: Works but requires careful `firebase.json` configuration
- **Custom Domains**: Standard setup
- **API Calls**: Direct client-side calls
- **Philosophy Clash**: Firebase prefers Firebase Auth + Firestore; using Supabase instead creates tooling friction

**Verdict**: ⚠️ Works but not ideal. No benefit from Firebase ecosystem since we use Supabase.

#### Flutter Web Specifics
- **Build Output**: Deploy `build/web/`
- **Routing**: Configure in `firebase.json`:
  ```json
  {
    "hosting": {
      "public": "build/web",
      "rewrites": [{"source": "**", "destination": "/index.html"}]
    }
  }
  ```
- **MIME Types**: Works correctly
- **Integration**: Firebase has good Flutter integration, but **we're not using Firebase services**

**Recommendation**: ❌ **Exclude**. Expensive bandwidth costs, vendor lock-in, no advantages for this stack.

---

## Comparison Matrix

| Criterion | Cloudflare Pages | Vercel | Netlify | Firebase Hosting |
|-----------|------------------|--------|---------|------------------|
| **Free Bandwidth** | ✅ Unlimited | ⚠️ 100GB/mo | ❌ 100GB/mo | ❌ 10GB/mo |
| **Build Minutes** | ✅ Unlimited | ✅ Unlimited | ⚠️ 300/mo | N/A |
| **Global CDN** | ✅ Best (300+ PoPs) | ✅ Excellent (70+) | ✅ Good | ✅ Good |
| **GitHub Integration** | ✅ Native | ✅ Excellent | ✅ Native | ⚠️ Manual setup |
| **Preview Deploys** | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited | ⚠️ Via CLI |
| **Supabase Compat** | ✅ Perfect | ✅ Perfect | ✅ Perfect | ✅ Works |
| **Flutter Web** | ✅ Works well | ✅ Works well | ✅ Works well | ✅ Works well |
| **React SPA** | ✅ Perfect | ✅ Perfect | ✅ Perfect | ✅ Perfect |
| **Cost Risk** | ✅ Zero | ⚠️ Low | ❌ Medium | ❌ High |
| **Team Collab** | ✅ Free | ❌ $20/mo | ❌ $19/mo | ✅ Free |
| **Operational Overhead** | ✅ Minimal | ✅ Minimal | ✅ Minimal | ⚠️ Higher |
| **Vendor Lock-in** | ✅ None | ✅ None | ✅ None | ❌ High (Google) |

**Scores** (0-10, higher is better for this use case):
- **Cloudflare Pages**: 9.5/10 — Best overall, zero cost risk, unlimited bandwidth
- **Vercel**: 8.5/10 — Excellent DX, slight cost risk at scale
- **Netlify**: 6/10 — Bandwidth limits are dealbreaker
- **Firebase Hosting**: 4/10 — Expensive, vendor lock-in, no advantages

---

## Final Recommendation

### Primary Choice: **Cloudflare Pages**

**Why**:
1. **Zero Cost Risk**: Unlimited bandwidth and builds on free tier eliminate surprise charges
2. **Best Performance**: 300+ edge locations, sub-50ms latency globally
3. **Perfect Supabase Fit**: No CORS issues, auth redirects work seamlessly
4. **Operational Simplicity**: Set-and-forget infrastructure, no scaling concerns
5. **Multi-App Support**: Host both student-app and admin-panel with identical workflow
6. **Future-Proof**: Handles 10K-100K users/month without upgrade

**Setup**:
```bash
# Deploy student-app
cd student-app
flutter build web --release
# Push build/web/ to Cloudflare Pages via GitHub Actions

# Deploy admin-panel
cd admin-panel
npm run build
# Push dist/ to Cloudflare Pages via GitHub Actions
```

**Estimated Monthly Cost**: **$0** (free tier, handles up to ~50K users/month before considering upgrade)

---

### Backup Choice: **Vercel**

**When to Use**:
- Cloudflare Pages has extended outage (rare)
- Need advanced team collaboration features immediately
- Prefer Vercel's developer dashboard and tooling

**Why Not Primary**:
- 100GB/month bandwidth limit creates risk at scale
- $20/month minimum for team access
- No technical advantage over Cloudflare for static hosting

**Setup**:
```bash
# Deploy to Vercel
vercel --prod
```

**Estimated Monthly Cost**: $0-20/month (free tier works initially, may need Pro)

---

### Excluded Options

#### Netlify: ❌ Bandwidth Limits
- **Issue**: 100GB/month bandwidth cap
- **Impact**: Risk of $10-50/month overage charges as traffic grows
- **Verdict**: No advantage over Cloudflare to justify cost risk

#### Firebase Hosting: ❌ Wrong Ecosystem
- **Issue**: 10GB/month free bandwidth, $0.15/GB paid
- **Impact**: Expensive at scale, vendor lock-in with Google, no Firebase services used
- **Verdict**: Architectural mismatch; would cost $30-60/month for traffic that's free on Cloudflare

---

## Domain & Subdomain Layout

### Recommended Structure

```
math7.com (apex domain)
├── app.math7.com       → Student App (Flutter Web)
├── admin.math7.com     → Admin Panel (React)
└── api.math7.com       → Supabase API (CNAME to Supabase)
```

**Rationale**:
- **Separate Subdomains**: Clear separation of concerns, different auth contexts
- **Same Hosting Provider**: Operational simplicity (both on Cloudflare Pages)
- **API Subdomain**: Optional; can use Supabase's default URL initially

### DNS Configuration

**For Cloudflare Pages**:
```
app.math7.com     CNAME   math7-student.pages.dev
admin.math7.com   CNAME   math7-admin.pages.dev
```

**For Vercel (backup)**:
```
app.math7.com     CNAME   cname.vercel-dns.com
admin.math7.com   CNAME   cname.vercel-dns.com
```

### SSL/TLS
- **Cloudflare Pages**: Automatic HTTPS (Let's Encrypt), no configuration needed
- **Vercel**: Automatic HTTPS (Let's Encrypt), no configuration needed

---

## CI/CD Structure for Dual Apps

### GitHub Actions Workflow (Recommended)

**File**: `.github/workflows/deploy-production.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-student-app:
    name: Deploy Student App (Flutter)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./student-app
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.0'
          channel: 'stable'
      
      - name: Install Dependencies
        run: flutter pub get
      
      - name: Build Flutter Web
        run: flutter build web --release --web-renderer html
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: math7-student
          directory: build/web
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

  deploy-admin-panel:
    name: Deploy Admin Panel (React)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./admin-panel
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: admin-panel/package-lock.json
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build React App
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: math7-admin
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Preview Deployments (PR Branches)

**File**: `.github/workflows/deploy-preview.yml`

```yaml
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    name: Deploy PR Preview
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      # Build both apps (same steps as production)
      # Deploy to Cloudflare Pages with branch name
      
      - name: Comment PR with Preview URLs
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 **Preview Deployed**\n\n- Student App: https://pr-${{ github.event.number }}-math7-student.pages.dev\n- Admin Panel: https://pr-${{ github.event.number }}-math7-admin.pages.dev`
            })
```

### Environment Variables

**Required Secrets** (GitHub Repository Settings > Secrets):
```
CLOUDFLARE_API_TOKEN          # Cloudflare API token with Pages permissions
CLOUDFLARE_ACCOUNT_ID         # Cloudflare account ID
VITE_SUPABASE_URL            # https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY       # Supabase anon/public key
```

**Optional** (for Vercel backup):
```
VERCEL_TOKEN                  # Vercel API token
VERCEL_ORG_ID                # Vercel organization ID
VERCEL_PROJECT_ID            # Vercel project ID
```

---

## Flutter Web Pitfalls & Solutions

### 1. Large Initial Bundle Size

**Problem**: Flutter Web generates ~2-3MB of JavaScript (even after compression).

**Solutions**:
- ✅ Use `--web-renderer html` for better compatibility and smaller size
- ✅ Enable `--dart2js-optimization` (default in release mode)
- ✅ Use code splitting if deploying multiple apps from same codebase (not applicable here)
- ❌ Don't try to lazy-load Flutter core (breaks app)

**Impact**: All platforms tested handle 2-3MB payloads efficiently. Non-issue.

### 2. Routing and Deep Links

**Problem**: Direct navigation to `/domains/123` fails (404) without SPA routing config.

**Solution**: Add platform-specific routing config:

**Cloudflare Pages**: Create `student-app/web/_redirects`:
```
/*    /index.html   200
```

**Vercel**: Create `student-app/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: Create `student-app/web/_redirects`:
```
/*    /index.html   200
```

### 3. MIME Type Issues

**Problem**: `main.dart.js` served with wrong Content-Type.

**Solution**: Platforms auto-detect correctly. If issues arise, add `_headers` file:

**Cloudflare Pages** (`student-app/web/_headers`):
```
/main.dart.js
  Content-Type: application/javascript

/flutter_service_worker.js
  Content-Type: application/javascript
```

### 4. Service Worker Caching

**Problem**: Flutter's service worker aggressively caches, causing stale deployments.

**Solution**: 
- ✅ Cloudflare/Vercel auto-busts cache on new deployments
- ✅ Service worker version is based on build hash (auto-updates)
- ⚠️ May need manual cache clear for users on very old versions

**Recommendation**: Add version indicator in app UI to prompt refresh if needed.

### 5. Build Performance in CI

**Problem**: Flutter build takes 3-5 minutes, slowing CI pipeline.

**Solutions**:
- ✅ Use cached Flutter SDK in GitHub Actions (`subosito/flutter-action@v2`)
- ✅ Cache dependencies (`flutter pub get` artifacts)
- ✅ Use `--release` mode only for production deploys (faster dev builds)

**Example** (GitHub Actions):
```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.pub-cache
      student-app/.dart_tool
    key: flutter-${{ runner.os }}-${{ hashFiles('student-app/pubspec.lock') }}
```

### 6. Cross-Origin Resource Sharing (CORS)

**Problem**: Supabase API calls fail due to CORS.

**Solution**: Configure allowed origins in Supabase Dashboard:
```
https://app.math7.com
https://admin.math7.com
https://*.pages.dev          # For preview deployments
```

**Note**: This is a Supabase configuration, not a hosting platform issue.

### 7. SEO and Meta Tags

**Problem**: Flutter Web generates minimal HTML; bad for SEO and social sharing.

**Solution**: Edit `student-app/web/index.html` to add meta tags:
```html
<head>
  <title>Math7 - Interactive Math Learning</title>
  <meta name="description" content="Offline-first math education platform">
  <meta property="og:title" content="Math7">
  <meta property="og:description" content="Interactive math learning">
  <meta property="og:image" content="https://app.math7.com/og-image.png">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
```

**Impact**: Student app is gated behind auth, so SEO less critical. Admin panel doesn't need SEO.

---

## Cost Projections

### Scenario 1: MVP Launch (0-1K users/month)

| Platform | Student App | Admin Panel | Total/Month |
|----------|-------------|-------------|-------------|
| **Cloudflare Pages** | $0 | $0 | **$0** |
| **Vercel** | $0 | $0 | **$0** |
| **Netlify** | $0 | $0 | **$0** |
| **Firebase** | $5 | $5 | **$10** |

**Recommendation**: All platforms work. Choose Cloudflare Pages for zero risk.

### Scenario 2: Growing (10K users/month, ~300GB bandwidth)

| Platform | Student App | Admin Panel | Total/Month |
|----------|-------------|-------------|-------------|
| **Cloudflare Pages** | $0 | $0 | **$0** |
| **Vercel** | $20 (Pro) | $0 | **$20** |
| **Netlify** | $19 (Pro) | $0 | **$19** |
| **Firebase** | $35 | $10 | **$45** |

**Recommendation**: Cloudflare Pages still free. Vercel/Netlify require paid plans. Firebase expensive.

### Scenario 3: Scale (100K users/month, ~3TB bandwidth)

| Platform | Student App | Admin Panel | Total/Month |
|----------|-------------|-------------|-------------|
| **Cloudflare Pages** | $0 | $0 | **$0** |
| **Vercel** | $20 (Pro) | $0 | **$20** |
| **Netlify** | $99 (Business) | $0 | **$99** |
| **Firebase** | $450 | $50 | **$500** |

**Recommendation**: Cloudflare Pages remains free. Others become prohibitively expensive.

**Caveat**: At 100K users, consider Cloudflare's $20/mo "Pages Plus" for advanced features (not required, but nice to have).

---

## "If This Assumption Is Wrong, Here's What Would Change"

### Assumption 1: "No server-side rendering needed"

**If Wrong**: Need Next.js (React) or server-side rendering for Flutter

**Impact**:
- ✅ **Vercel**: Best choice (built for Next.js, edge functions for SSR)
- ⚠️ **Cloudflare Pages**: Supports SSR via Cloudflare Workers (more complex)
- ❌ **Netlify**: Less mature SSR support
- ❌ **Firebase**: Requires Cloud Functions (expensive)

**New Recommendation**: Switch primary to **Vercel**, backup to **Cloudflare Pages** with Workers.

### Assumption 2: "Traffic stays under 100K users/month"

**If Wrong**: Need to handle 500K+ users, multi-TB bandwidth

**Impact**:
- ✅ **Cloudflare Pages**: Still free (unlimited bandwidth)
- ⚠️ **Vercel**: Enterprise plan required ($custom pricing)
- ❌ **Netlify**: Prohibitively expensive ($500+/month)
- ❌ **Firebase**: Very expensive ($2000+/month)

**New Recommendation**: Stay with **Cloudflare Pages**. At this scale, consider Cloudflare Enterprise for SLA guarantees.

### Assumption 3: "Supabase remains the backend"

**If Wrong**: Migrate to Firebase (Firestore + Firebase Auth)

**Impact**:
- ✅ **Firebase Hosting**: Now makes sense (ecosystem integration)
- ⚠️ **Cloudflare Pages**: Still works but loses simplicity advantage
- ✅ **Vercel**: Still excellent choice
- ✅ **Netlify**: Still works

**New Recommendation**: Switch to **Firebase Hosting** if fully committed to Firebase ecosystem.

### Assumption 4: "No team collaboration needed initially"

**If Wrong**: Need 5+ developers with deploy access immediately

**Impact**:
- ✅ **Cloudflare Pages**: Free for unlimited team members
- ❌ **Vercel**: Requires Pro ($20/mo)
- ❌ **Netlify**: Requires Pro ($19/mo)
- ✅ **Firebase**: Free for team collaboration

**New Recommendation**: Stay with **Cloudflare Pages** (best free team support).

### Assumption 5: "Cost predictability is critical"

**If Wrong**: Budget allows for $100-200/month hosting spend

**Impact**:
- ✅ **Vercel**: Excellent DX worth $20/mo Pro plan
- ✅ **Cloudflare Pages**: Still best value
- ⚠️ **Netlify**: Viable but no advantage over Vercel
- ❌ **Firebase**: Still expensive relative to features

**New Recommendation**: Consider **Vercel Pro** for superior developer experience.

### Assumption 6: "Flutter Web bundle size stays ~2-3MB"

**If Wrong**: App grows to 10MB+ (very unlikely)

**Impact**:
- ✅ **All Platforms**: No file size limits blocking (max 25-50MB)
- ⚠️ **Performance**: Longer initial load times, but all CDNs handle it
- ⚠️ **Bandwidth**: Costs increase on Vercel/Netlify/Firebase

**New Recommendation**: Investigate code splitting or lazy loading Flutter modules.

---

## Implementation Checklist

### Phase 1: Setup Cloudflare Pages (Primary)

- [ ] Create Cloudflare account (free tier)
- [ ] Connect GitHub repository to Cloudflare Pages
- [ ] Create `math7-student` project (student-app)
  - [ ] Configure build: `cd student-app && flutter build web --release`
  - [ ] Set build output directory: `student-app/build/web`
  - [ ] Add `_redirects` file for SPA routing
- [ ] Create `math7-admin` project (admin-panel)
  - [ ] Configure build: `cd admin-panel && npm run build`
  - [ ] Set build output directory: `admin-panel/dist`
- [ ] Configure custom domains
  - [ ] Add `app.math7.com` → math7-student project
  - [ ] Add `admin.math7.com` → math7-admin project
- [ ] Set environment variables
  - [ ] `VITE_SUPABASE_URL` (admin-panel)
  - [ ] `VITE_SUPABASE_ANON_KEY` (admin-panel)
- [ ] Test production deployments
- [ ] Verify CORS configuration in Supabase

### Phase 2: Setup GitHub Actions CI/CD

- [ ] Create `.github/workflows/deploy-production.yml`
- [ ] Add Cloudflare API token to GitHub Secrets
- [ ] Add Supabase environment variables to GitHub Secrets
- [ ] Test automated deployment on push to main
- [ ] Create `.github/workflows/deploy-preview.yml`
- [ ] Test PR preview deployments
- [ ] Document deployment process in repo README

### Phase 3: Vercel Backup (Optional but Recommended)

- [ ] Create Vercel account (free tier)
- [ ] Import GitHub repository to Vercel
- [ ] Configure `math7-student-backup` project
  - [ ] Framework preset: "Other"
  - [ ] Build command: `cd student-app && flutter build web --release`
  - [ ] Output directory: `student-app/build/web`
  - [ ] Add `vercel.json` for SPA routing
- [ ] Configure `math7-admin-backup` project
  - [ ] Framework preset: "Vite"
  - [ ] Root directory: `admin-panel`
- [ ] **Pause deployments** (use only as failover)
- [ ] Document failover process

### Phase 4: Monitoring and Observability

- [ ] Add Cloudflare Web Analytics (free, privacy-friendly)
- [ ] Configure Sentry error tracking (already in Phase 4)
- [ ] Set up uptime monitoring (UptimeRobot free tier or Cloudflare Workers)
- [ ] Create deployment status dashboard (GitHub Actions status)

---

## Appendix: Quick Reference

### Cloudflare Pages Deployment (Manual)

```bash
# Student App
cd student-app
flutter build web --release
npx wrangler pages publish build/web --project-name=math7-student

# Admin Panel
cd admin-panel
npm run build
npx wrangler pages publish dist --project-name=math7-admin
```

### Vercel Deployment (Manual)

```bash
# Install Vercel CLI
npm i -g vercel

# Student App
cd student-app
flutter build web --release
vercel --prod --cwd=build/web

# Admin Panel
cd admin-panel
vercel --prod
```

### Environment Variable Template

**`.env.production`** (for admin-panel):
```bash
VITE_SUPABASE_URL=https://qvslbiceoonrgjxzkotb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Anon/public key (safe to commit)
```

**Student App** (uses anonymous auth, no env vars needed):
- Supabase URL/Key hardcoded or configured in `lib/src/core/supabase/providers.dart`

### Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on sub-routes | Add `_redirects` or `vercel.json` SPA routing |
| CORS errors | Configure allowed origins in Supabase dashboard |
| Slow Flutter builds | Cache Flutter SDK and dependencies in CI |
| Stale deployments | Clear Cloudflare cache or increment app version |
| Auth redirect fails | Verify redirect URL in Supabase Auth settings |
| Large bundle size | Use `--web-renderer html` and check for large assets |

---

## Conclusion

**Deploy both apps to Cloudflare Pages.** It offers the best combination of zero cost, unlimited bandwidth, global performance, and operational simplicity. Vercel is an excellent backup if needed, but Cloudflare is the clear winner for this architecture.

**Key Takeaways**:
1. Cloudflare Pages free tier eliminates cost surprises
2. Flutter Web works on all platforms tested; no blockers
3. Supabase integrates seamlessly with static hosting (no proxy needed)
4. GitHub Actions provides production-grade CI/CD for both apps
5. Avoid Netlify (bandwidth limits) and Firebase (expensive, wrong ecosystem)

**Next Steps**: Proceed to implementation checklist and deploy to production.
