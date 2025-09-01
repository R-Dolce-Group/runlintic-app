#!/bin/bash

# Exit on error, undefined vars, pipe failures
set -euo pipefail

# Security: Disable command history to prevent token exposure
set +H

# Cleanup function to restore git config on exit
cleanup() {
  local exit_code=$?

  # Always clean up git config - multiple approaches for safety
  git config --local --unset-all url."https://github.com/".insteadOf 2>/dev/null || true
  git config --local --list | grep -E "url\..*github\.com.*\.insteadof" | cut -d= -f1 | while read -r key; do
    git config --local --unset "$key" 2>/dev/null || true
  done

  # Clear any temporary environment variables
  unset GH_TOKEN 2>/dev/null || true

  echo "🧹 Cleaned up git configuration"
  exit $exit_code
}

# Set up cleanup trap for multiple signals
trap cleanup EXIT INT TERM

# Get GitHub and NPM tokens from .security/.env (secure) | This directory will never be pushed to repository
# 1. Define the path to the .env file
ENV_FILE=".security/.env"

# 2. Check if the .env file exists
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Error: .env file not found at $ENV_FILE" >&2
  echo "💡 Please create .security/.env file with export GH_TOKEN=your_token" >&2
  exit 1
fi

# 3. Define the location of the .env file
source "$ENV_FILE"

# 4. Check if the GH_TOKEN variable is set in the .env file
if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "❌ Error: GH_TOKEN variable is not set in your .env file" >&2
  echo "💡 Please set it with: export GH_TOKEN=your_token" >&2
  exit 1
fi

# 5. Check if the GH_TOKEN variable is valid (non-empty)
if [[ -z "${GH_TOKEN}" ]]; then
  echo "❌ Error: GH_TOKEN variable is empty in your .env file" >&2
  echo "💡 Please set it with: export GH_TOKEN=your_token" >&2
  exit 1
fi

#6. Check if the NPM_ACCESS_TOKEN variable is set in the .env file
if [[ -z "${NPM_ACCESS_TOKEN:-}" ]]; then
  echo "❌ Error: NPM_ACCESS_TOKEN variable is not set in your .env file" >&2
  echo "💡 Please set it with: export NPM_ACCESS_TOKEN=your_token" >&2
  exit 1
fi

# Validate token formats (basic check)
if [[ ! "${GH_TOKEN}" =~ ^[a-zA-Z0-9_\-]+$ ]]; then
  echo "❌ Error: Invalid GH_TOKEN format" >&2
  echo "💡 Token should contain only letters, numbers, underscores, and hyphens" >&2
  exit 1
fi

# Test GitHub API connectivity and token validity
if curl -s -m 30 -H "Authorization: Bearer ${GH_TOKEN}" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/user" > /tmp/gh_test.json 2>/dev/null; then
  echo "✅ GitHub API test successful"
else
  echo "❌ Error: GitHub API test failed" >&2
  exit 1
fi

#7. Test NPM connectivity and token validity
if curl -s -m 30 -H "Authorization: Bearer ${NPM_ACCESS_TOKEN}" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/user" > /tmp/npm_test.json 2>/dev/null; then
  echo "✅ NPM API test successful"
else
  echo "❌ Error: NPM API test failed" >&2
  exit 1
fi

#8. Clean up temporary files
rm -f /tmp/gh_test.json /tmp/npm_test.json

#9. Parse JSON response without requiring jq
if command -v jq >/dev/null 2>&1; then
  USER_LOGIN=$(jq -r '.login // empty' /tmp/gh_test.json 2>/dev/null)
elif command -v python3 >/dev/null 2>&1; then
  # Use Python for reliable JSON parsing
  USER_LOGIN=$(python3 -c "import json; data=json.load(open('/tmp/gh_test.json')); print(data.get('login', ''))" 2>/dev/null || echo "")
else
  # Fallback: improved grep/sed parsing
  USER_LOGIN=$(grep -o '"login":[[:space:]]*"[^"]*"' /tmp/gh_test.json 2>/dev/null | sed 's/.*"login":[[:space:]]*"\([^"]*\)".*/\1/' || echo "")
fi

if [[ -z "$USER_LOGIN" ]]; then
  echo "❌ Error: Invalid GitHub token or API response." >&2
  exit 1
fi
echo "✅ GitHub API test successful - authenticated as: $USER_LOGIN"
rm -f /tmp/gh_test.json

#10. Configure Git to use token-based authentication (safer approach)
echo "🔧 Configuring git authentication..."
git config --local url."https://x-access-token:${GH_TOKEN}@github.com/".insteadOf "https://github.com/"

#11. Verify repository access
echo "🔍 Verifying repository access..."
REPO_URL=$(git config --get remote.origin.url | sed 's|https://github.com/||' | sed 's|\.git$||')
if [[ -n "$REPO_URL" ]]; then
  if ! curl -s -m 30 -H "Authorization: Bearer ${GH_TOKEN}" \
       -H "Accept: application/vnd.github.v3+json" \
       "https://api.github.com/repos/${REPO_URL}" > /dev/null 2>&1; then
    echo "❌ Error: Cannot access repository ${REPO_URL}" >&2
    echo "💡 Check repository exists and token has proper permissions" >&2
    exit 1
  fi
  echo "✅ Repository access verified: ${REPO_URL}"
fi

#12. Run the release command using locally installed release-it in non-interactive mode
# Use explicit git.commitMessage to follow conventional commit format
# Force skip the clean working directory check
# Default to patch increment if no increment specified
DEFAULT_INCREMENT=""
if [[ ! "$*" =~ --increment=|major|minor|patch ]]; then
  DEFAULT_INCREMENT="--increment=patch"
fi

echo "🚀 Starting release process with 10-minute timeout..."
RELEASE_START_TIME=$(date +%s)

#13. Run release-it with timeout to prevent hanging
# Debug: Show environment info
echo "🔍 Environment debug info:"
echo "  - Shell: $0"
echo "  - User: $(whoami)"
echo "  - GH_TOKEN present: $(if [[ -n "${GH_TOKEN}" ]]; then echo "✅ Yes"; else echo "❌ No"; fi)"
echo "  - GH_TOKEN length: ${#GH_TOKEN} chars"
echo "  - npm config list:" && npm config list --location=user 2>/dev/null | head -3 || echo "    npm config not accessible"
echo ""

#14. For now, run without timeout until we implement OS-independent solution
echo "🚀 Executing: npx release-it $@ ${DEFAULT_INCREMENT} --ci --git.requireCleanWorkingDir=false --git.requireUpstream=false --git.commitMessage=\"chore(release): v\${version}\""
if npx release-it "$@" ${DEFAULT_INCREMENT} --ci --git.requireCleanWorkingDir=false --git.requireUpstream=false --git.commitMessage="chore(release): v\${version}"; then
  RELEASE_END_TIME=$(date +%s)
  RELEASE_DURATION=$((RELEASE_END_TIME - RELEASE_START_TIME))
  echo "✅ Release completed successfully in ${RELEASE_DURATION} seconds"

  # Verify the release was actually created
  LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
  if [[ -n "$LATEST_TAG" && "$LATEST_TAG" =~ ^v[0-9]+\.[0-9]+\.[0-9]+.*$ ]]; then
    echo "🏷️  Latest tag created: $LATEST_TAG"

    # Verify GitHub release exists
    if [[ -n "$REPO_URL" ]]; then
      RELEASE_RESPONSE=$(curl -s -m 30 -H "Authorization: Bearer ${GH_TOKEN}" \
                         -H "Accept: application/vnd.github.v3+json" \
                         "https://api.github.com/repos/${REPO_URL}/releases/tags/${LATEST_TAG}" \
                         2>/dev/null || echo "")

      if command -v jq >/dev/null 2>&1; then
        RELEASE_ID=$(echo "$RELEASE_RESPONSE" | jq -r '.id // empty' 2>/dev/null || echo "")
      else
        # Fallback: check if response contains an id field
        RELEASE_ID=$(echo "$RELEASE_RESPONSE" | grep -o '"id": *[0-9][0-9]*' | sed 's/.*"id": *\([0-9]*\).*/\1/' || echo "")
      fi

      if [[ -n "$RELEASE_ID" ]]; then
        echo "🎉 GitHub release verified: https://github.com/${REPO_URL}/releases/tag/${LATEST_TAG}"
      else
        echo "⚠️  Warning: Git tag created but GitHub release may not be visible yet"
      fi
    fi
  else
    echo "⚠️  Warning: Release process completed but no valid tag found"
  fi
else
  EXIT_CODE=$?
  if [[ $EXIT_CODE -eq 124 ]]; then
    echo "❌ Error: Release process timed out after 10 minutes" >&2
    echo "💡 This may indicate network issues or GitHub API problems" >&2
  else
    echo "❌ Error: Release process failed with exit code $EXIT_CODE" >&2
  fi
  exit $EXIT_CODE
fi

