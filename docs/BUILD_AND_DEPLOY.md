# Building and Deploying

## Quick Start

### Install Dependencies
```bash
npm install
```

### Build the Package
```bash
npm run build
```

This creates optimized builds in `dist/`:
- `index.js` - ES Module
- `index.cjs` - CommonJS
- `index.d.ts` - TypeScript declarations

### Run Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Watch Mode (Development)
```bash
npm run dev
```

---

## Pre-Publish Checklist

- [ ] **Version updated** in `package.json` (semantic versioning)
- [ ] **CHANGELOG updated** (if maintaining one)
- [ ] **README reviewed** for accuracy
- [ ] **All tests pass**: `npm test`
- [ ] **Type checking passes**: `npm run type-check`
- [ ] **Build succeeds**: `npm run build`
- [ ] **Example runs**: `cd examples/basic && npm install && npm run dev`
- [ ] **Git status clean**: `git status` shows no uncommitted changes
- [ ] **Git tags exist** for version: `git tag v0.5.0`

---

## Publishing to npm

### 1. Prerequisites
- **npm account** (create at https://www.npmjs.com)
- **Logged in locally**: `npm login`
- **Verified email** on npm account
- **Proper package name** (scoped or unscoped)

### 2. Update Version
Edit `package.json`:
```json
{
  "name": "@dnd-kit/react-snap-center-to-cursor",
  "version": "0.5.0"  // Update this
}
```

Use semantic versioning:
- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features, backward compatible (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes only (1.0.0 → 1.0.1)

### 3. Build Release
```bash
npm run build
npm test                    # Verify tests pass
npm run type-check         # Verify types are correct
```

### 4. Commit & Tag (if using git)
```bash
git add package.json package-lock.json
git commit -m "Release v0.5.0"
git tag v0.5.0
git push origin main --tags
```

### 5. Publish to npm
```bash
npm publish
```

**Important flags:**
- `--access public` - for scoped packages (might be required)
- `--tag latest` - publish as latest version (default)
- `--tag beta` - publish as beta version (optional)
- `--dry-run` - preview what would be published (test run)

**Example:**
```bash
npm publish --access public
```

### 6. Verify Publication
```bash
npm view @dnd-kit/react-snap-center-to-cursor
npm info @dnd-kit/react-snap-center-to-cursor@0.5.0
```

Visit: https://www.npmjs.com/package/@dnd-kit/react-snap-center-to-cursor

---

## Distribution Files

### What Gets Published
Files listed in `package.json` `"files"`:
```json
"files": [
  "dist",
  "README.md",
  "LICENSE"
]
```

### dist/ Directory Contents
```
dist/
├── index.js              # ESM build (~3KB)
├── index.js.map         # Source map
├── index.cjs            # CommonJS build (~3KB)
├── index.cjs.map        # Source map
├── index.d.ts           # TypeScript declarations (~2KB)
└── index.d.ts.map       # Declaration source map
```

### Not Published
- `src/` - Source code (consumers don't need it)
- `examples/` - Example projects
- Configuration files (tsconfig.json, vitest.config.ts, etc.)
- Tests (__tests__ directory)
- node_modules/
- .git/

---

## Version Numbering Strategy

### Current Release
```
Version: 0.5.0
Status: Stable
```

### Suggested Path Forward
```
0.5.0  → 0.5.1  (patch: bug fixes)
     → 0.6.0  (minor: new features)
     → 1.0.0  (major: production release)
```

### Alpha/Beta Releases
```bash
# Alpha release (unstable)
npm publish --tag alpha

# Beta release (almost stable)
npm publish --tag beta

# Release candidate
npm publish --tag rc

# Stable release (default)
npm publish
```

---

## Post-Publish Actions

### 1. Update Repository
```bash
git push origin main
git push origin --tags
```

### 2. Create GitHub Release
```bash
gh release create v0.5.0 --generate-notes
```

Or manually at: https://github.com/yourorg/dnd-kit-react-snap-center-to-cursor/releases

### 3. Announce
- Update project documentation
- Share on social media / dev communities
- Add to package ecosystem catalogs (if applicable)

### 4. Monitor
- Watch for issues on GitHub
- Monitor npm package stats
- Track download numbers

---

## Troubleshooting

### "ERR! 403 Forbidden"
- **Cause**: Not authenticated or insufficient permissions
- **Fix**: Run `npm login` again

### "ERR! 409 Conflict"
- **Cause**: Version already published
- **Fix**: Increment version in package.json and rebuild

### "ERR! You do not have permission"
- **Cause**: Not the package owner
- **Fix**: Verify you own the npm package / organization

### Type Errors During Build
- **Cause**: TypeScript compilation errors
- **Fix**: Run `npm run type-check` to see detailed errors

### Tests Failing
- **Cause**: Code errors introduced
- **Fix**: Fix the errors before building

---

## Development Workflow

For ongoing development:

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Watch for changes
npm run dev

# 3. Run tests
npm test

# 4. Verify types
npm run type-check

# 5. Build final version
npm run build

# 6. Commit changes
git add .
git commit -m "feat: add new feature"

# 7. Push and create PR
git push origin feature/new-feature
```

---

## Continuous Integration (Optional)

Consider setting up GitHub Actions to automate:
- Running tests on every commit
- Type checking
- Building
- Automated publishing on release tags

Example workflow file (`.github/workflows/publish.yml`):
```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Security Notes

- **Never commit** `.npmrc` with auth tokens
- **Use npm tokens** instead of password
- **Keep dependencies updated**: `npm update`
- **Audit for vulnerabilities**: `npm audit`
- **Sign commits** (recommended): `git commit -S`

---

## Support

For issues with:
- **Publishing**: See [npm docs](https://docs.npmjs.com/cli/publish)
- **Versioning**: See [semver](https://semver.org/)
- **Package metadata**: See [package.json docs](https://docs.npmjs.com/cli/configuring-npm/package-json)
