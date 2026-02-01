# Deployment Setup Guide

This guide walks you through deploying the Math7 platform to production using **Cloudflare Pages** (recommended) or **Vercel** (backup).

For detailed platform analysis and decision rationale, see [HOSTING_DECISION_GUIDE.md](./HOSTING_DECISION_GUIDE.md).

---

## Quick Start (Cloudflare Pages)

### Prerequisites

- GitHub account with admin access to this repository
- Cloudflare account (free tier: https://dash.cloudflare.com/sign-up)
- Domain name (optional; can use `*.pages.dev` subdomain initially)

### Step 1: Create Cloudflare Pages Projects

1. **Sign in to Cloudflare Dashboard**: https://dash.cloudflare.com
2. Navigate to **Pages** in the sidebar
3. Click **Create a project** → **Connect to Git**
4. Select your GitHub account and the `Math7` repository
5. Click **Begin setup**

#### Project 1: Student App

- **Project name**: `math7-student`
- **Production branch**: `main`
- **Framework preset**: `None` (custom build)
- **Build command**: `cd student-app && flutter build web --release --web-renderer html`
- **Build output directory**: `student-app/build/web`
- **Root directory**: `/` (leave blank)
- **Environment variables**: None needed (anonymous auth)

Click **Save and Deploy**

#### Project 2: Admin Panel

Create a second project:
- **Project name**: `math7-admin`
- **Production branch**: `main`
- **Framework preset**: `Vite`
- **Build command**: `cd admin-panel && npm ci && npm run build`
- **Build output directory**: `admin-panel/dist`
- **Root directory**: `/` (leave blank)
- **Environment variables**:
  - `VITE_SUPABASE_URL`: `https://qvslbiceoonrgjxzkotb.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

Click **Save and Deploy**

### Step 2: Configure Custom Domains (Optional)

If you have a domain (e.g., `math7.com`):

1. In Cloudflare Pages, go to your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter domain:
   - Student App: `app.math7.com`
   - Admin Panel: `admin.math7.com`
4. Follow DNS instructions (add CNAME records)
5. Wait for SSL certificate provisioning (~5 minutes)

### Step 3: Configure GitHub Actions (Recommended)

For faster deployments and better CI/CD control, use GitHub Actions instead of Cloudflare's built-in CI:

1. **Get Cloudflare API Token**:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click **Create Token** → **Use template** for "Edit Cloudflare Workers"
   - Customize permissions: `Account.Cloudflare Pages = Edit`
   - Create token and copy it

2. **Get Cloudflare Account ID**:
   - Go to https://dash.cloudflare.com
   - Select any domain or go to Pages
   - Copy Account ID from right sidebar

3. **Add GitHub Secrets**:
   - Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret** and add:
     - `CLOUDFLARE_API_TOKEN`: Paste API token
     - `CLOUDFLARE_ACCOUNT_ID`: Paste account ID
     - `VITE_SUPABASE_URL`: `https://qvslbiceoonrgjxzkotb.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Enable Workflows**:
   - Workflows are already in `.github/workflows/`
   - Push to `main` branch to trigger production deployment
   - Open a PR to trigger preview deployment

### Step 4: Configure Supabase CORS

Add your deployment URLs to Supabase allowed origins:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/qvslbiceoonrgjxzkotb
2. Navigate to **Authentication** → **URL Configuration**
3. Add to **Site URL** and **Redirect URLs**:
   ```
   https://math7-student.pages.dev
   https://math7-admin.pages.dev
   https://app.math7.com
   https://admin.math7.com
   https://*.pages.dev
   ```
4. Save changes

### Step 5: Test Deployment

1. Visit your deployed URLs:
   - Student App: `https://math7-student.pages.dev` or `https://app.math7.com`
   - Admin Panel: `https://math7-admin.pages.dev` or `https://admin.math7.com`

2. Verify functionality:
   - Student app loads and shows curriculum
   - Admin panel login works
   - Data syncs between apps

---

## Alternative: Vercel Deployment

If you prefer Vercel or need it as a backup:

### Step 1: Create Vercel Account

- Sign up at https://vercel.com/signup
- Connect your GitHub account

### Step 2: Import Projects

#### Student App

1. Click **Add New** → **Project**
2. Import `Math7` repository
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `student-app`
   - **Build Command**: `flutter build web --release --web-renderer html`
   - **Output Directory**: `build/web`
   - **Install Command**: Skip (Flutter pre-built)

#### Admin Panel

1. Import `Math7` repository again
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin-panel`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Step 3: Configure Domains

- Student App: `app.math7.com`
- Admin Panel: `admin.math7.com`

### Step 4: Configure GitHub Actions (Optional)

Add secrets:
- `VERCEL_TOKEN`: From https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: From project settings
- `VERCEL_PROJECT_ID`: From project settings

---

## Deployment Workflow

### Production Deployment

**Automatic** (via GitHub Actions):
- Push to `main` branch
- GitHub Actions builds and deploys both apps
- Check status in Actions tab

**Manual** (Cloudflare CLI):
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy student app
cd student-app
flutter build web --release --web-renderer html
wrangler pages publish build/web --project-name=math7-student

# Deploy admin panel
cd ../admin-panel
npm run build
wrangler pages publish dist --project-name=math7-admin
```

**Manual** (Vercel CLI):
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy student app
cd student-app
flutter build web --release
vercel --prod --cwd=build/web

# Deploy admin panel
cd ../admin-panel
vercel --prod
```

### Preview Deployments (Pull Requests)

1. Open a Pull Request
2. GitHub Actions automatically builds and deploys preview versions
3. Preview URLs are posted as PR comments:
   - `https://pr-{number}-math7-student.pages.dev`
   - `https://pr-{number}-math7-admin.pages.dev`
4. Preview updates automatically on each push to PR

---

## Troubleshooting

### Issue: Flutter build fails in CI

**Cause**: Flutter SDK not installed or wrong version

**Solution**: Verify GitHub Actions uses correct Flutter version (3.19.0):
```yaml
- uses: subosito/flutter-action@v2
  with:
    flutter-version: '3.19.0'
```

### Issue: Admin panel shows blank page

**Cause**: Environment variables not set

**Solution**: 
1. Check Cloudflare Pages → Settings → Environment variables
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Redeploy

### Issue: 404 on sub-routes

**Cause**: SPA routing not configured

**Solution**: Verify files exist:
- `student-app/web/_redirects`
- `admin-panel/public/_redirects`
- `student-app/vercel.json` (if using Vercel)
- `admin-panel/vercel.json` (if using Vercel)

### Issue: CORS errors

**Cause**: Deployment URL not whitelisted in Supabase

**Solution**: Add URL to Supabase → Authentication → URL Configuration

### Issue: Slow initial page load

**Cause**: Flutter Web bundle size (~2-3MB)

**Solution**: This is expected. Consider:
- Adding loading indicator
- Using service worker caching (already enabled)
- Using `--web-renderer html` for smaller bundles

---

## Monitoring

### Cloudflare Analytics

Free, privacy-friendly analytics included:
- Go to Pages project → Analytics
- View traffic, performance, requests

### Vercel Analytics

Free tier includes basic analytics:
- Go to project → Analytics
- View visits, performance

### Uptime Monitoring

Recommended tools:
- **UptimeRobot** (free): https://uptimerobot.com
- **Cloudflare Workers** (cron-based checks): https://developers.cloudflare.com/workers/

### Error Tracking

Already configured:
- **Sentry** (student-app): `sentry_flutter`
- **Sentry** (admin-panel): `@sentry/react`

Configure DSN in environment variables:
- `SENTRY_DSN` (Flutter)
- `VITE_SENTRY_DSN` (React)

---

## Cost Estimates

### Cloudflare Pages (Recommended)

| Traffic Level | Users/Month | Bandwidth | Cost |
|--------------|-------------|-----------|------|
| MVP | 0-1K | ~30GB | **$0** |
| Growth | 1K-10K | ~300GB | **$0** |
| Scale | 10K-100K | ~3TB | **$0** |
| Enterprise | 100K+ | 10TB+ | **$0** (or $20/mo Pages Plus) |

### Vercel (Backup)

| Traffic Level | Users/Month | Bandwidth | Cost |
|--------------|-------------|-----------|------|
| MVP | 0-1K | ~30GB | **$0** |
| Growth | 1K-10K | ~300GB | **$20/mo** (Pro) |
| Scale | 10K-100K | ~3TB | **$20/mo** (Pro) |
| Enterprise | 100K+ | 10TB+ | **Custom pricing** |

**Recommendation**: Use Cloudflare Pages to avoid bandwidth costs.

---

## Security Checklist

Before going to production:

- [ ] Environment variables use `secrets` in GitHub Actions (not hardcoded)
- [ ] Supabase RLS policies are enabled and tested
- [ ] CORS is configured in Supabase (not overly permissive)
- [ ] Admin panel requires authentication (Supabase Auth)
- [ ] Student app uses anonymous auth (no sensitive data exposed)
- [ ] API keys are `anon` keys (not `service_role` keys)
- [ ] Custom domains use HTTPS (automatic on Cloudflare/Vercel)
- [ ] Preview deployments do not expose production secrets
- [ ] Sentry DSN is configured for error tracking
- [ ] No sensitive data in client-side code or build artifacts

---

## Next Steps

1. Complete deployment following this guide
2. Test functionality on production URLs
3. Configure custom domains (if applicable)
4. Set up monitoring and alerts
5. Document deployment process for your team
6. Consider adding:
   - Staging environment (separate Cloudflare project on `develop` branch)
   - Automated testing in CI/CD (already configured)
   - Performance monitoring (Cloudflare Analytics or Vercel Analytics)

---

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vercel Documentation](https://vercel.com/docs)
- [Flutter Web Deployment](https://docs.flutter.dev/deployment/web)
- [Supabase CORS Configuration](https://supabase.com/docs/guides/api/cors)
- [Hosting Decision Guide](./HOSTING_DECISION_GUIDE.md) (full platform analysis)
