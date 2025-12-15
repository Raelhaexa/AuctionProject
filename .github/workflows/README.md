# CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing and deployment.

## Workflows

### CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches

**Steps:**
1. Checkout code
2. Setup Node.js (version 20.x)
3. Install dependencies with `npm ci`
4. Run ESLint for code quality checks
5. Build the application
6. Upload build artifacts (retained for 7 days)

**Purpose:** Ensures code quality and build integrity on every commit and pull request.

### Deploy Workflow (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build the application with production optimizations
5. Deploy to GitHub Pages

**Purpose:** Automatically deploys the application to GitHub Pages when changes are pushed to the main branch.

## Setup Requirements

### For GitHub Pages Deployment

1. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Under "Build and deployment", set Source to "GitHub Actions"

2. **Repository Settings:**
   - The deploy workflow requires `pages: write` and `id-token: write` permissions
   - These are configured in the workflow file

## Local Testing

Before pushing changes, you can test locally:

```bash
cd frontend
npm ci
npm run lint    # Run linting
npm run build   # Build the application
npm run preview # Preview the production build
```

## Customization

### Changing Node.js Version
Edit the `node-version` in both workflow files:
```yaml
node-version: '20.x'  # Change to your desired version
```

### Adding More Branches
Edit the `branches` array in workflow triggers:
```yaml
on:
  push:
    branches: [ main, develop, your-branch ]
```

### Adding Tests
If you add tests to the project, include a test step in `ci.yml`:
```yaml
- name: Run tests
  working-directory: ./frontend
  run: npm test
```

## Monitoring

- View workflow runs in the "Actions" tab of your GitHub repository
- Each workflow run shows detailed logs for debugging
- Build artifacts can be downloaded from successful CI runs

## Troubleshooting

### Build Failures
- Check that all dependencies are properly listed in `package.json`
- Ensure the build succeeds locally before pushing
- Review the workflow logs for specific error messages

### Deployment Issues
- Verify GitHub Pages is enabled in repository settings
- Check that the workflow has necessary permissions
- Ensure the base path in `vite.config.js` matches your repository name
