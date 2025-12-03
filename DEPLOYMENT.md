# Deployment Guide

This guide explains how to build and deploy the AgentSea documentation website to GitHub Pages.

## Overview

The website is built as a static site using Next.js static export and deployed to the `agentic-sdk` repository's `docs/` folder for GitHub Pages hosting.

## Prerequisites

- Node.js 20+ and npm installed
- The `agentic-sdk` repository cloned in the parent directory (`../agentic-sdk`)
- Git configured for commits

## Quick Start

### 1. Test the Static Build Locally

Before deploying, test that the static build works correctly:

```bash
npm run test:static
```

This will:

- Build the static site to the `out/` directory
- Analyze the build (size, file counts, etc.)
- Check for common issues
- Start a local server at http://localhost:3000

**Testing Checklist:**

- [ ] Homepage loads correctly
- [ ] Navigation works (all menu items)
- [ ] All documentation pages are accessible
- [ ] Examples page displays correctly
- [ ] Code blocks are formatted properly
- [ ] DaisyUI theme is applied
- [ ] All internal links work
- [ ] No 404 errors in browser console

Press `Ctrl+C` to stop the local server when done testing.

### 2. Deploy to SDK Repository

Once you've verified the build locally:

```bash
npm run deploy:sdk
```

Or run the script directly:

```bash
./deploy-to-sdk.sh
```

This script will:

1. Clean previous builds
2. Build the static site
3. Backup existing docs (if any)
4. Copy the built site to `../agentic-sdk/docs/`
5. Create `.nojekyll` file for GitHub Pages
6. Optionally commit and push changes

The script is interactive and will ask for confirmation before committing and pushing.

## Manual Deployment Steps

If you prefer to deploy manually:

```bash
# 1. Build the static site
npm run build

# 2. Navigate to the SDK repository
cd ../agentic-sdk

# 3. Copy the built site
rm -rf docs/*
cp -r ../agenticjs-website/out/* docs/
touch docs/.nojekyll

# 4. Commit and push
git add docs/
git commit -m "Update documentation website"
git push
```

## Available Scripts

```json
{
  "dev": "next dev --turbopack", // Development server
  "build": "next build", // Build static site
  "export": "next build", // Alias for build
  "test:static": "./test-static-build.sh", // Test build locally
  "deploy:sdk": "./deploy-to-sdk.sh", // Deploy to SDK repo
  "serve": "npx serve out -p 3000" // Serve built site
}
```

## Configuration

### Next.js Configuration (`next.config.ts`)

```typescript
{
  output: 'export',              // Enable static export
  images: { unoptimized: true }, // Required for static export
  trailingSlash: true,           // Add trailing slashes to URLs
}
```

### GitHub Pages Setup

In your `agentic-sdk` repository settings:

1. Go to **Settings** → **Pages**
2. Under **Source**, select:
   - Branch: `main` (or your default branch)
   - Folder: `/docs`
3. Save

GitHub Pages will automatically deploy from the `docs/` folder.

## Custom Domain (Optional)

To use a custom domain:

1. Uncomment and modify in `deploy-to-sdk.sh`:

   ```bash
   echo "docs.agentsea.dev" > "${DOCS_DIR}/CNAME"
   ```

2. Configure DNS:

   - Add a CNAME record pointing to `<username>.github.io`
   - Or an A record pointing to GitHub's IPs

3. Enable custom domain in GitHub Pages settings

## Troubleshooting

### Build Failures

If the build fails:

- Check for TypeScript errors: `npm run lint`
- Ensure all dependencies are installed: `npm install`
- Check for dynamic routes or server-side code

### 404 Errors After Deployment

- Verify `.nojekyll` file exists in `docs/`
- Check GitHub Pages settings are correct
- Wait 2-5 minutes for GitHub to rebuild

### Styles Not Loading

- Ensure `images.unoptimized: true` in `next.config.ts`
- Check browser console for 404s on CSS/JS files
- Verify `_next/static` folder exists in output

### Local Server Issues

If `npx serve` fails:

- Install serve globally: `npm install -g serve`
- Or use any other static server: `python -m http.server 3000`

## Build Output Structure

```
out/
├── _next/              # Next.js assets (CSS, JS)
├── docs/              # Documentation pages
│   ├── quick-start/
│   ├── cli/
│   └── ...
├── examples/          # Examples page
├── api/              # API documentation
├── index.html        # Homepage
├── 404.html          # 404 page
└── *.svg, *.txt      # Static assets
```

## Performance

**Build Stats:**

- Build time: ~3-5 seconds
- Total size: ~3.4 MB
- Pages generated: 26
- First load JS: ~102-107 KB per page

## CI/CD Integration (Future)

You can automate deployment using GitHub Actions:

```yaml
name: Deploy Docs
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          # Copy to SDK repo and commit
```

## Support

For issues or questions:

- Check Next.js static export docs: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- GitHub Pages docs: https://docs.github.com/en/pages
- File an issue in the repository
