#!/bin/bash

# GooseOps Neural Empire - GitHub Digital Archive System
# This script creates an enhanced digital archive of the current codebase to a GitHub repository
# Usage: ./gooseops-neural-empire-github-archive.sh [repository-name]

# Default repository name if not provided
REPO_NAME=${1:-"gooseops-neural-empire-enhanced-archive"}
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ARCHIVE_BRANCH="neural-empire-archive-${TIMESTAMP}"

echo "===== GooseOps Neural Empire - GitHub Digital Archive ====="
echo "Repository: ${REPO_NAME}"
echo "Archive Branch: ${ARCHIVE_BRANCH}"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if current directory is a git repository
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Check if GitHub CLI is installed for easier authentication
if command -v gh &> /dev/null; then
    echo "GitHub CLI detected. Checking authentication..."
    if ! gh auth status &> /dev/null; then
        echo "Please authenticate with GitHub:"
        gh auth login
    fi
fi

# Create a new branch for the archive
echo "Creating archive branch: ${ARCHIVE_BRANCH}..."
git checkout -b "${ARCHIVE_BRANCH}"

# Add all files to the archive
echo "Adding files to archive..."
git add .

# Commit the changes
echo "Committing archive..."
git commit -m "GooseOps Neural Empire Enhanced Archive - ${TIMESTAMP}"

# Check if the repository exists on GitHub
echo "Checking if repository exists..."
if command -v gh &> /dev/null; then
    if ! gh repo view "${REPO_NAME}" &> /dev/null; then
        echo "Creating new GitHub repository: ${REPO_NAME}..."
        gh repo create "${REPO_NAME}" --private --confirm
    fi
    
    # Set the remote
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/${GITHUB_USER:-$(gh api user | jq -r .login)}/${REPO_NAME}.git"
else
    echo "GitHub CLI not installed. Please create the repository manually and set the remote."
    echo "Example commands:"
    echo "  git remote add origin https://github.com/yourusername/${REPO_NAME}.git"
fi

# Push the archive branch to GitHub
echo "Pushing archive to GitHub..."
git push -u origin "${ARCHIVE_BRANCH}"

echo "=================================================="
echo "Digital archive completed successfully!"
echo "Repository: ${REPO_NAME}"
echo "Branch: ${ARCHIVE_BRANCH}"
echo "=================================================="
