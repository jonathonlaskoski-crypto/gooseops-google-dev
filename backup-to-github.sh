#!/bin/bash

# GooseOps Neural Empire - GitHub Backup Script
# This script creates a backup of the current codebase to a GitHub repository
# Usage: ./backup-to-github.sh [repository-name]

# Default repository name if not provided
REPO_NAME=${1:-"gooseops-neural-empire-backup"}
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_BRANCH="backup-${TIMESTAMP}"

echo "===== GooseOps Neural Empire - GitHub Backup ====="
echo "Repository: ${REPO_NAME}"
echo "Backup Branch: ${BACKUP_BRANCH}"
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

# Create a new branch for the backup
echo "Creating backup branch: ${BACKUP_BRANCH}..."
git checkout -b "${BACKUP_BRANCH}"

# Add all files to the backup
echo "Adding files to backup..."
git add .

# Commit the changes
echo "Committing backup..."
git commit -m "GooseOps Neural Empire Backup - ${TIMESTAMP}"

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

# Push the backup branch to GitHub
echo "Pushing backup to GitHub..."
git push -u origin "${BACKUP_BRANCH}"

echo "=================================================="
echo "Backup completed successfully!"
echo "Repository: ${REPO_NAME}"
echo "Branch: ${BACKUP_BRANCH}"
echo "=================================================="
