# Release & Version Management Guide

This guide explains how to release and manage versions of `code-intelligence-mcp` on npm.

## Overview

The `code-intelligence-mcp` package is designed to be published on npm with the following philosophy:

- **Versioned Core Code**: The core MCP service code is versioned and released to npm
- **User-Configurable Data**: Users configure their own knowledge base data locally
- **Zero Configuration Overhead**: Setup script guides users through configuration

## Version Strategy

### Semantic Versioning

Follow [Semantic Versioning (SemVer)](https://semver.org/):

```
MAJOR.MINOR.PATCH

- MAJOR: Breaking changes to API, configuration format, or core features
- MINOR: New features that are backwards compatible
- PATCH: Bug fixes, minor improvements, internal refactoring
```

### Examples

```bash
# Bug fix or internal improvement (1.0.0 → 1.0.1)
npm version patch

# New feature, backwards compatible (1.0.1 → 1.1.0)
npm version minor

# Breaking changes to API or configuration (1.1.0 → 2.0.0)
npm version major
```

## Release Workflow

### 1. Prepare Release

#### Step 1: Update Changelog

Create or update `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [1.1.0] - 2024-01-15

### Added

- New feature X
- New feature Y

### Changed

- Improved performance of component suggestion
- Updated prompt redesigner logic

### Fixed

- Fixed bug with utility knowledge base loading
- Fixed configuration file path resolution

### Deprecated

- Deprecated old API endpoint

### Removed

- Removed legacy configuration support
```

#### Step 2: Code Review

Ensure all changes are committed and reviewed:

```bash
# Check code quality
npm run check-all

# Verify build works
npm run build
```

#### Step 3: Test

Run comprehensive tests before release:

```bash
# Run all checks
npm run check-all

# Manual testing
npm run dev

# Test setup script in a new environment
npm run setup:dev
```

### 2. Version Bump

Use npm built-in versioning:

```bash
# For patch release (bug fixes)
npm version patch

# For minor release (new features)
npm version minor

# For major release (breaking changes)
npm version major

# For prerelease
npm version prerelease --preid=alpha
npm version prerelease --preid=beta
npm version prerelease --preid=rc
```

This automatically:

- Updates `package.json` version
- Creates a git tag
- Commits the changes

### 3. Publish to npm

Before publishing, ensure:

```bash
# Clean build
npm run clean
npm run rebuild

# Final verification
npm run check-all

# Publish
npm publish
```

#### First Time Publishing

If this is your first time publishing to npm:

```bash
# Create npm account at https://www.npmjs.com/signup
npm adduser

# Verify you're logged in
npm whoami

# Test publish to see what would be included
npm publish --dry-run

# Publish
npm publish
```

#### Publishing with Access Token

For CI/CD or automated publishing:

```bash
# Create access token at https://www.npmjs.com/settings/~/tokens
npm set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE

# Publish
npm publish
```

### 4. Push Changes

```bash
# Push commits and tags to GitHub
git push origin main
git push origin --tags
```

## What Gets Published?

The `files` field in `package.json` controls what's included:

```json
{
  "files": [
    "dist", // Compiled code
    "data/*.example.json", // Example configuration files
    "scripts/setup.js", // Setup script for users
    "README.md", // Documentation
    "README.zh-CN.md", // Chinese documentation
    "LICENSE" // License file
  ]
}
```

### NOT Published (gitignored):

```
data/config.json      # User's actual AI config
data/components.json  # User's actual components
data/utils.json       # User's actual utilities
node_modules/         # Dependencies
dist/                 # Build output (recreated during install)
```

## Version Compatibility

### How Users Update

```bash
# Update to latest patch version
npm update code-intelligence-mcp

# Update to specific version
npm install code-intelligence-mcp@1.2.0

# Install from GitHub
npm install github:lyw405/code-intelligence-mcp

# Install from development branch
npm install github:lyw405/code-intelligence-mcp#develop
```

### Breaking Changes

When releasing a MAJOR version with breaking changes:

1. Update documentation clearly
2. Provide migration guide in `CHANGELOG.md`
3. Consider supporting both old and new versions temporarily
4. Tag old version as deprecated if needed

```bash
npm deprecate code-intelligence-mcp@1.0.0 "Deprecated: Please upgrade to 2.0.0"
```

## Release Checklist

Before each release, verify:

- [ ] All tests pass: `npm run check-all`
- [ ] Build successful: `npm run rebuild`
- [ ] CHANGELOG.md updated with version and changes
- [ ] README.md and documentation up to date
- [ ] No sensitive data in files to be published
- [ ] Example files (\*.example.json) are present
- [ ] Version number updated in package.json
- [ ] Git commits and tags are clean
- [ ] npm publish --dry-run shows correct files
- [ ] Publish to npm: `npm publish`
- [ ] Verify on npm: https://www.npmjs.com/package/code-intelligence-mcp
- [ ] Update GitHub releases with release notes

## Common Commands Reference

```bash
# View current version
npm version

# Check npm registry
npm view code-intelligence-mcp

# Check installed version locally
npm list code-intelligence-mcp

# Unpublish (use with caution, requires npm account)
npm unpublish code-intelligence-mcp@1.0.0 --force

# List all published versions
npm view code-intelligence-mcp versions

# Check npm publish permissions
npm owner ls code-intelligence-mcp
```

## CI/CD Integration

For GitHub Actions automatic publishing:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm run check-all
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### Cannot publish: "You must be logged in"

```bash
npm login
npm whoami
npm publish
```

### Version already exists

```bash
# Check published versions
npm view code-intelligence-mcp versions

# Use a different version number or pre-release tag
npm version prerelease --preid=alpha
```

### Want to unpublish a version

```bash
# For versions published less than 72 hours ago (non-breaking)
npm unpublish code-intelligence-mcp@VERSION --force

# Better: Use deprecation instead
npm deprecate code-intelligence-mcp@VERSION "Deprecated due to bug"
```

## User Experience

### Installation

```bash
npm install code-intelligence-mcp
```

### Post-Installation

```
📦 code-intelligence-mcp installed!
Run: npm run setup:dev  (to configure the MCP server)
```

### Setup

```bash
npm run setup:dev
```

This guides users through:

1. Creating `data/` directory
2. Configuring `data/config.json` (AI models)
3. Configuring `data/components.json` (UI components)
4. Configuring `data/utils.json` (utility methods)

### First Run

```bash
npm run dev
```

## Support

For release issues, visit: https://github.com/lyw405/code-intelligence-mcp/issues
