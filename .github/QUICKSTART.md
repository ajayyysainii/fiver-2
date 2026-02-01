# GitHub Actions CI/CD - Quick Start

## 🚀 Quick Setup (5 minutes)

### Step 1: Add GitHub Secrets
Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name | Example Value | Description |
|------------|---------------|-------------|
| `SSH_HOST` | `123.45.67.89` | Your server IP or domain |
| `SSH_USERNAME` | `ubuntu` | SSH username |
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH...` | Your SSH private key |
| `SSH_PORT` | `22` | SSH port (optional, defaults to 22) |
| `PROJECT_PATH` | `/home/ubuntu/Legacy-Builder` | Project path on server |
| `PM2_APP_NAME` | `legacy-builder` | PM2 process name |

### Step 2: Generate SSH Key (if needed)
```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key

# View private key (copy this to SSH_PRIVATE_KEY secret)
cat ~/.ssh/github_actions_key

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions_key.pub your-username@your-server
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Add GitHub Actions CI/CD"
git push origin main
```

## 📋 Available Workflows

### 1. `deploy.yml` - Standard Deployment
- Builds on the server
- Best for: Small to medium projects
- Trigger: Push to main branch

### 2. `deploy-prebuilt.yml` - Pre-built Deployment  
- Builds in GitHub Actions
- Transfers only built files
- Best for: Faster deployments, lower server load
- Trigger: Push to main branch

### 3. `ci.yml` - Continuous Integration
- Runs type checks and builds
- Best for: Pull request validation
- Trigger: All pushes and PRs

## 🎯 Choose Your Workflow

**Use `deploy.yml` if:**
- ✅ You want simple setup
- ✅ Your server has good resources
- ✅ You're okay with slightly longer deployments

**Use `deploy-prebuilt.yml` if:**
- ✅ You want faster deployments
- ✅ Your server has limited resources
- ✅ You want to reduce server load

**Disable unused workflows:**
```bash
# Rename to disable
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
```

## 🔄 Manual Deployment

1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow** button

## 📊 Monitor Deployment

### On GitHub
- Go to **Actions** tab
- Click on latest workflow run
- View real-time logs

### On Server
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs legacy-builder

# Monitor resources
pm2 monit
```

## 🆘 Quick Troubleshooting

### Deployment Failed?
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. SSH into server and check: `pm2 logs`

### SSH Connection Failed?
```bash
# Test SSH connection locally
ssh -i ~/.ssh/github_actions_key your-username@your-server

# Check authorized_keys on server
cat ~/.ssh/authorized_keys
```

### PM2 Not Found?
```bash
# Install PM2 globally on server
npm install -g pm2
```

## 🎉 That's It!

Your CI/CD pipeline is now ready. Every push to main will automatically:
1. ✅ Build your application
2. ✅ Deploy to your server
3. ✅ Restart PM2
4. ✅ Notify you of the status

---

**Need more details?** See [DEPLOYMENT.md](./DEPLOYMENT.md)
