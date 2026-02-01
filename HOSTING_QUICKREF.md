# Hosting Quick Reference

**Last Updated**: 2026-02-01  
**For Full Analysis**: See [docs/HOSTING_DECISION_GUIDE.md](./docs/HOSTING_DECISION_GUIDE.md)

---

## TL;DR - Just Tell Me What To Do

### ✅ Recommended: Cloudflare Pages

**Why**: Unlimited bandwidth, global CDN, $0/month, perfect for static sites + Supabase

**Setup**:
1. Go to https://dash.cloudflare.com → Pages → Connect Git
2. Create two projects:
   - `math7-student` (student-app)
   - `math7-admin` (admin-panel)
3. Configure GitHub Actions (see `.github/workflows/deploy-production.yml`)
4. Add secrets to GitHub repo settings

**URLs**:
- Student: `https://math7-student.pages.dev` or `app.math7.com`
- Admin: `https://math7-admin.pages.dev` or `admin.math7.com`

**Cost**: **$0/month** (even at 100K users/month)

---

## Platform Comparison (One-Liner)

| Platform | Use Case | Cost Risk | Verdict |
|----------|----------|-----------|---------|
| **Cloudflare Pages** | Everything | ✅ Zero | **Primary choice** |
| **Vercel** | If Cloudflare has issues | ⚠️ Low | **Backup choice** |
| **Netlify** | — | ❌ Medium | ❌ Avoid (bandwidth limits) |
| **Firebase Hosting** | — | ❌ High | ❌ Avoid (wrong ecosystem) |

---

## Decision Tree

```
Do you need SSR (Next.js, server-side rendering)?
├─ NO  → Cloudflare Pages (primary) or Vercel (backup)
└─ YES → Vercel (Next.js optimized)

Do you expect >100K users/month?
├─ NO  → Cloudflare Pages (free tier forever)
└─ YES → Cloudflare Pages (still free, or $20/mo for advanced features)

Do you care about cost predictability?
├─ YES → Cloudflare Pages (no surprise charges)
└─ NO  → Any platform works

Already using Firebase for backend?
├─ NO  → Cloudflare Pages (we use Supabase)
└─ YES → Firebase Hosting makes sense
```

---

## Quick Commands

### Deploy to Cloudflare Pages (Manual)

```bash
# Install CLI
npm install -g wrangler

# Login
wrangler login

# Deploy student app
cd student-app && flutter build web --release --web-renderer html
wrangler pages publish build/web --project-name=math7-student

# Deploy admin panel
cd admin-panel && npm run build
wrangler pages publish dist --project-name=math7-admin
```

### Deploy to Vercel (Backup)

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
cd student-app && flutter build web --release
vercel --prod --cwd=build/web

cd ../admin-panel
vercel --prod
```

---

## Required GitHub Secrets

For automated deployment via GitHub Actions:

```
CLOUDFLARE_API_TOKEN          # From Cloudflare Dashboard → API Tokens
CLOUDFLARE_ACCOUNT_ID         # From Cloudflare Dashboard (right sidebar)
VITE_SUPABASE_URL            # https://qvslbiceoonrgjxzkotb.supabase.co
VITE_SUPABASE_ANON_KEY       # From Supabase Dashboard → Settings → API
```

Optional (for Vercel backup):
```
VERCEL_TOKEN                  # From Vercel → Account Settings → Tokens
VERCEL_ORG_ID                # From Vercel project settings
VERCEL_PROJECT_ID            # From Vercel project settings
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| 404 on sub-routes | Add `_redirects` or `vercel.json` (already created) |
| CORS errors | Add deployment URL to Supabase → Auth → URL Configuration |
| Blank page (admin) | Verify environment variables in hosting platform settings |
| Slow Flutter builds | Use GitHub Actions cache (already configured) |

---

## Cost Breakdown (12 Months)

### Cloudflare Pages
- **0-10K users**: $0
- **10K-100K users**: $0
- **100K+ users**: $0 (or optional $240/year for Pages Plus features)

### Vercel
- **0-1K users**: $0
- **1K-10K users**: $240/year (Pro plan)
- **10K-100K users**: $240/year (Pro plan)
- **100K+ users**: Custom pricing

### Why Cloudflare Wins
- No bandwidth limits on free tier
- No surprise charges
- Same performance as paid competitors
- Works identically for 100 users or 100K users

---

## File Checklist

Make sure these files exist (they should already):

- ✅ `.github/workflows/deploy-production.yml` - Production deployment workflow
- ✅ `.github/workflows/deploy-preview.yml` - PR preview deployment workflow
- ✅ `student-app/web/_redirects` - SPA routing for Cloudflare/Netlify
- ✅ `student-app/vercel.json` - SPA routing for Vercel
- ✅ `admin-panel/public/_redirects` - SPA routing for Cloudflare/Netlify
- ✅ `admin-panel/vercel.json` - SPA routing for Vercel
- ✅ `docs/HOSTING_DECISION_GUIDE.md` - Full analysis
- ✅ `docs/DEPLOYMENT.md` - Step-by-step setup guide

---

## Next Steps

1. **Read**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed setup instructions
2. **Create**: Cloudflare account and connect GitHub repo
3. **Configure**: GitHub Actions secrets
4. **Deploy**: Push to `main` branch (automatic via GitHub Actions)
5. **Verify**: Test both apps on production URLs
6. **Monitor**: Set up Cloudflare Analytics and Sentry error tracking

---

## One-Page Summary

**Hosting Platform**: Cloudflare Pages  
**Monthly Cost**: $0 (unlimited bandwidth)  
**Setup Time**: 15 minutes  
**Deployment**: Automatic via GitHub Actions  
**Backup Platform**: Vercel (in case of Cloudflare issues)  
**Why Not Others**: Netlify has bandwidth limits, Firebase is expensive  

**Domain Structure**:
- `app.math7.com` → Student App (Flutter Web)
- `admin.math7.com` → Admin Panel (React)

**Deployment Workflow**:
- Push to `main` → Auto-deploy to production
- Open PR → Auto-deploy to preview URLs
- Preview URLs posted as PR comments

**Support**: See [docs/HOSTING_DECISION_GUIDE.md](./docs/HOSTING_DECISION_GUIDE.md) for detailed analysis and troubleshooting.
