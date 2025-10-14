#!/bin/bash

# Release script for url-env
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

# Default to patch if no argument provided
RELEASE_TYPE=${1:-patch}

echo "🚀 Starting $RELEASE_TYPE release for url-env..."

# Ensure we're on main branch
if [[ $(git branch --show-current) != "main" ]]; then
  echo "❌ Error: Must be on main branch to release"
  exit 1
fi

# Ensure working directory is clean
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Error: Working directory must be clean"
  exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Run tests
echo "🧪 Running tests..."
npm run test:run

# Build the package
echo "🔨 Building package..."
npm run build

# Bump version and create git tag
echo "📝 Bumping version..."
npm version $RELEASE_TYPE --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "📋 New version: $NEW_VERSION"

# Commit changes
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create and push tag
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

echo "✅ Release $NEW_VERSION completed!"
echo "🎉 GitHub Action will automatically publish to npm when the release is created on GitHub"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/jimthedev/url-env/releases"
echo "2. Create a new release for tag v$NEW_VERSION"
echo "3. Add release notes"
echo "4. Publish the release"
echo "5. The package will be automatically published to npm!"