# GitHub Actions CI/CD Setup Guide

This guide will help you set up automated deployments for your Legacy-Builder application using GitHub Actions.

## Overview

The CI/CD pipeline automatically:
1. ✅ Checks out your code
2. ✅ Sets up Node.js environment
3. ✅ Installs dependencies
4. ✅ Builds the application
5. ✅ Connects to your server via SSH
6. ✅ Pulls latest changes
7. ✅ Rebuilds on the server
8. ✅ Restarts PM2 process

## Prerequisites

Before setting up the pipeline, ensure you have:
- A GitHub repository for this project
- A production server with SSH access
- PM2 installed on your server
- Git configured on your server

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### 1. Navigate to Repository Settings
Go to: `Your Repository → Settings → Secrets and variables → Actions → New repository secret`

### 2. Add the Following Secrets

#### `SSH_HOST`
- **Description**: Your server's IP address or domain name
- **Example**: `123.45.67.89` or `yourserver.com`

#### `SSH_USERNAME`
- **Description**: SSH username for your server
- **Example**: `ubuntu`, `root`, or your custom user

#### `SSH_PRIVATE_KEY`
- **Description**: Your SSH private key for authentication
- **How to get it**:
  ```bash
  # On your local machine, generate a new SSH key pair (if you don't have one)
  ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key
  
  # Copy the private key content
  cat ~/.ssh/github_actions_key
  
  # Copy the public key to your server
  ssh-copy-id -i ~/.ssh/github_actions_key.pub your-username@your-server
  ```
- **Note**: Copy the ENTIRE private key including the `-----BEGIN` and `-----END` lines

#### `SSH_PORT` (Optional)
- **Description**: SSH port number
- **Default**: 22
- **Example**: `2222` (if you use a custom SSH port)

#### `PROJECT_PATH`
- **Description**: Absolute path to your project on the server
- **Example**: `/home/ubuntu/Legacy-Builder` or `/var/www/legacy-builder`

#### `PM2_APP_NAME`
- **Description**: Name of your PM2 process
- **Example**: `legacy-builder` or `legacy-builder-app`
- **How to check**: Run `pm2 list` on your server to see existing process names

## Server Setup

### 1. Install PM2 (if not already installed)
```bash
npm install -g pm2
```

### 2. Configure PM2 to start on system boot
```bash
pm2 startup
pm2 save
```

### 3. Ensure Git is configured
```bash
cd /path/to/your/project
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 4. Set up environment variables on server
Make sure your `.env` file exists on the server with all required variables:
```bash
cd /path/to/your/project
cp .env.example .env
# Edit .env with your production values
nano .env
```

## Testing the Pipeline

### 1. Manual Trigger
- Go to `Actions` tab in your GitHub repository
- Select `Deploy to Production` workflow
- Click `Run workflow` button

### 2. Automatic Trigger
- Push changes to the `main` branch
- The workflow will automatically start

## Monitoring Deployments

### View Workflow Status
1. Go to the `Actions` tab in your GitHub repository
2. Click on the latest workflow run
3. View logs for each step

### Check Server Status
```bash
# SSH into your server
ssh your-username@your-server

# Check PM2 status
pm2 status

# View application logs
pm2 logs legacy-builder

# Monitor in real-time
pm2 monit
```

## Troubleshooting

### SSH Connection Failed
- Verify `SSH_HOST`, `SSH_USERNAME`, and `SSH_PORT` are correct
- Ensure the SSH private key is properly formatted
- Check that the public key is in `~/.ssh/authorized_keys` on the server

### Build Failed
- Check the workflow logs in GitHub Actions
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility

### PM2 Restart Failed
- Verify `PM2_APP_NAME` matches your actual PM2 process name
- Check PM2 logs: `pm2 logs`
- Manually restart: `pm2 restart your-app-name`

### Environment Variables Missing
- Ensure `.env` file exists on the server
- Verify all required variables are set
- Check file permissions: `chmod 600 .env`

## Advanced Configuration

### Deploy to Different Branches
Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches:
      - main
      - staging  # Add more branches
```

### Add Slack/Discord Notifications
You can add notification steps to the workflow to get alerts on deployment status.

### Run Database Migrations
Add a step before PM2 restart:
```yaml
- name: Run Database Migrations
  run: npm run db:push
```

## Security Best Practices

1. ✅ Never commit `.env` files to Git
2. ✅ Use GitHub Secrets for sensitive data
3. ✅ Regularly rotate SSH keys
4. ✅ Use a dedicated deployment user with limited permissions
5. ✅ Enable two-factor authentication on GitHub
6. ✅ Review workflow logs for sensitive data before making repository public

## Rollback Procedure

If a deployment fails:
```bash
# SSH into server
ssh your-username@your-server

# Navigate to project
cd /path/to/your/project

# Checkout previous commit
git log  # Find the previous working commit hash
git checkout <previous-commit-hash>

# Rebuild and restart
npm ci
npm run build
pm2 restart legacy-builder
```

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review server logs: `pm2 logs`
3. Verify all secrets are correctly configured
4. Ensure server has enough resources (disk space, memory)

---

**Last Updated**: February 2026
