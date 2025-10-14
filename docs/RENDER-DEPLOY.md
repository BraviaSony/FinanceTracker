# 🚀 Render Deployment Guide
## Finance Tracker Application - Step by Step

---

## 📋 What is This Guide?

This guide will help you deploy your Finance Tracker application to **Render**, a cloud platform that makes it easy to host websites. 

**No technical experience needed!** Just follow the steps carefully.

---

## ⏱️ Time Required

- **First-time setup**: 30-45 minutes
- **Future deployments**: 5-10 minutes

---

## 💰 Cost

- **Render Free Tier**: $0/month (perfect for testing)
- **Render Starter**: $7/month (recommended for production)
- **Convex Free Tier**: $0/month (included)

---

## 📚 Table of Contents

1. [Before You Start](#-before-you-start)
2. [Step 1: Create Accounts](#-step-1-create-accounts)
3. [Step 2: Prepare Your Code](#-step-2-prepare-your-code)
4. [Step 3: Set Up Convex](#-step-3-set-up-convex)
5. [Step 4: Deploy to Render](#-step-4-deploy-to-render)
6. [Step 5: Configure Environment](#-step-5-configure-environment)
7. [Step 6: Test Your Application](#-step-6-test-your-application)
8. [Troubleshooting](#-troubleshooting)
9. [Updating Your Application](#-updating-your-application)

---

## ✅ Before You Start

### What You'll Need

- [ ] A computer with internet connection
- [ ] Your Finance Tracker code (this project)
- [ ] An email address
- [ ] 30-45 minutes of time

### What You'll Create

- [ ] GitHub account (to store your code)
- [ ] Convex account (for the database)
- [ ] Render account (to host your website)

---

## 🎯 Step 1: Create Accounts

### 1.1 Create a GitHub Account

**What is GitHub?** A place to store your code online.

1. Go to [https://github.com](https://github.com)
2. Click **"Sign up"** (top right corner)
3. Enter your email address
4. Create a password (make it strong!)
5. Choose a username (this will be public)
6. Verify your email address
7. Choose the **Free** plan

✅ **Done!** You now have a GitHub account.

---

### 1.2 Create a Convex Account

**What is Convex?** The database that stores your financial data.

1. Go to [https://convex.dev](https://convex.dev)
2. Click **"Start Building"** or **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Log in with your GitHub account
5. Click **"Authorize Convex"**
6. Complete your profile (name, etc.)

✅ **Done!** You now have a Convex account.

---

### 1.3 Create a Render Account

**What is Render?** The platform that will host your website.

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Log in with your GitHub account
5. Click **"Authorize Render"**
6. Verify your email address

✅ **Done!** You now have a Render account.

---

## 📦 Step 2: Prepare Your Code

### 2.1 Upload Code to GitHub

**Option A: Using GitHub Website (Easiest)**

1. Go to [https://github.com](https://github.com)
2. Click the **"+"** icon (top right)
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `finance-tracker`
   - **Description**: `My Finance Tracker Application`
   - **Visibility**: Choose **Private** (recommended) or Public
   - **DO NOT** check "Initialize with README"
5. Click **"Create repository"**

Now you'll see instructions. Follow these:

6. Open your computer's terminal/command prompt
7. Navigate to your project folder:
   ```bash
   cd path/to/your/finance-tracker
   ```
8. Run these commands one by one:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/finance-tracker.git
   git push -u origin main
   ```
   
   Replace `YOUR-USERNAME` with your actual GitHub username.

**Option B: Using GitHub Desktop (Easier for Beginners)**

1. Download GitHub Desktop from [https://desktop.github.com](https://desktop.github.com)
2. Install and open GitHub Desktop
3. Sign in with your GitHub account
4. Click **"File"** → **"Add Local Repository"**
5. Select your finance-tracker folder
6. Click **"Publish repository"**
7. Choose a name and click **"Publish Repository"**

✅ **Done!** Your code is now on GitHub.

---

## 🗄️ Step 3: Set Up Convex

### 3.1 Install Convex CLI

**What is CLI?** A tool to run commands on your computer.

1. Open your terminal/command prompt
2. Navigate to your project folder:
   ```bash
   cd path/to/your/finance-tracker
   ```
3. Install Convex CLI:
   ```bash
   npm install -g convex
   ```
   
   **Note**: If you're using `bun`, you can skip this as Convex is already in your project.

---

### 3.2 Create Convex Project

1. In your terminal, run:
   ```bash
   npx convex dev
   ```

2. You'll see some questions. Answer them:
   - **"Create a new project?"** → Press **Enter** (Yes)
   - **"Project name?"** → Type `finance-tracker` → Press **Enter**
   - **"Team?"** → Choose your team (usually your name) → Press **Enter**

3. Wait for the setup to complete (30-60 seconds)

4. You'll see a message like:
   ```
   ✓ Deployment URL: https://your-project.convex.cloud
   ```

5. **IMPORTANT**: Copy this URL! You'll need it later.

---

### 3.3 Deploy Convex Functions

1. In your terminal, run:
   ```bash
   npx convex deploy
   ```

2. Wait for deployment to complete (1-2 minutes)

3. You'll see:
   ```
   ✓ Deployed successfully!
   ```

✅ **Done!** Your database is set up and running.

---

### 3.4 Get Your Convex URL

1. Go to [https://dashboard.convex.dev](https://dashboard.convex.dev)
2. Click on your project (`finance-tracker`)
3. Click **"Settings"** in the left sidebar
4. Find **"Deployment URL"**
5. Copy this URL (it looks like: `https://your-project.convex.cloud`)

**Save this URL!** You'll need it in Step 5.

---

## 🌐 Step 4: Deploy to Render

### 4.1 Create a New Web Service

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** (top right)
3. Select **"Static Site"**

---

### 4.2 Connect Your GitHub Repository

1. Click **"Connect a repository"**
2. If this is your first time:
   - Click **"Configure account"**
   - Select your GitHub account
   - Choose **"All repositories"** or select `finance-tracker`
   - Click **"Install"**
3. Find your `finance-tracker` repository
4. Click **"Connect"**

---

### 4.3 Configure Build Settings

Fill in these details carefully:

**Basic Settings:**
- **Name**: `finance-tracker` (or any name you like)
- **Branch**: `main` (should be auto-selected)
- **Root Directory**: Leave empty

**Build Settings:**
- **Build Command**: 
  ```bash
  npm install -g bun && bun install && bun run build
  ```
  
  **Copy this exactly!**

- **Publish Directory**: 
  ```
  dist/public
  ```
  
  **Copy this exactly!**

**Advanced Settings:**
- **Auto-Deploy**: Keep it **ON** (Yes)

---

### 4.4 Choose Your Plan

1. Scroll down to **"Plans"**
2. Choose one:
   - **Free**: $0/month (good for testing, sleeps after inactivity)
   - **Starter**: $7/month (recommended, always on, faster)

3. Click **"Create Static Site"**

---

### 4.5 Wait for First Deploy

1. Render will start building your site
2. You'll see a log with lots of text (this is normal!)
3. Wait 5-10 minutes for the first build
4. Look for: **"Your site is live at https://..."**

**Don't worry if it fails!** We need to add environment variables first.

---

## ⚙️ Step 5: Configure Environment

### 5.1 Add Environment Variables

**What are environment variables?** Secret settings your app needs to work.

1. In Render dashboard, click on your site name
2. Click **"Environment"** in the left sidebar
3. Click **"Add Environment Variable"**

---

### 5.2 Add Convex URL

1. Click **"Add Environment Variable"**
2. Fill in:
   - **Key**: `VITE_CONVEX_URL`
   - **Value**: Your Convex URL from Step 3.4 (e.g., `https://your-project.convex.cloud`)
3. Click **"Save Changes"**

---

### 5.3 Add Convex Site URL

1. First, get your Render site URL:
   - Look at the top of your Render dashboard
   - Copy the URL (e.g., `https://finance-tracker.onrender.com`)

2. Go back to [Convex Dashboard](https://dashboard.convex.dev)
3. Click on your project
4. Click **"Settings"**
5. Find **"Environment Variables"**
6. Click **"Add Variable"**
7. Fill in:
   - **Key**: `CONVEX_SITE_URL`
   - **Value**: Your Render URL (e.g., `https://finance-tracker.onrender.com`)
8. Click **"Save"**

---

### 5.4 Redeploy

1. Go back to Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 5-10 minutes
4. Look for: **"Your site is live!"**

✅ **Done!** Your application is deployed!

---

## 🧪 Step 6: Test Your Application

### 6.1 Open Your Website

1. In Render dashboard, find your site URL (top of page)
2. Click on it or copy and paste into your browser
3. You should see the Finance Tracker login page

---

### 6.2 Create Your First Account

1. Click **"Sign up"** or **"Create account"**
2. Fill in:
   - **Name**: Your name
   - **Email**: Your email
   - **Password**: Create a strong password (min 6 characters, 1 letter, 1 number)
3. Click **"Sign Up"**

**Note**: The first user automatically becomes an Admin!

---

### 6.3 Test Basic Features

Try these to make sure everything works:

1. **Dashboard**: Should load with empty data
2. **Add a Sale**: 
   - Click "Sales" in sidebar
   - Click "Add Sale"
   - Fill in the form
   - Click "Save"
3. **Add an Expense**:
   - Click "Expenses" in sidebar
   - Click "Add Expense"
   - Fill in the form
   - Click "Save"
4. **Check Dashboard**: Should now show your data

✅ **Success!** Your application is working!

---

## 🐛 Troubleshooting

### Problem: "Build Failed"

**Solution 1: Check Build Command**
1. Go to Render dashboard
2. Click **"Settings"**
3. Verify **Build Command** is:
   ```bash
   npm install -g bun && bun install && bun run build
   ```
4. Click **"Save Changes"**
5. Click **"Manual Deploy"**

**Solution 2: Check Publish Directory**
1. In Settings, verify **Publish Directory** is:
   ```
   dist/public
   ```
2. Click **"Save Changes"**
3. Click **"Manual Deploy"**

---

### Problem: "Site Loads but Shows Error"

**Solution: Check Environment Variables**
1. Go to Render dashboard
2. Click **"Environment"**
3. Verify you have:
   - `VITE_CONVEX_URL` = Your Convex URL
4. If missing, add it (see Step 5.2)
5. Click **"Manual Deploy"**

---

### Problem: "Cannot Sign Up"

**Solution: Check Convex Configuration**
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click your project
3. Click **"Settings"**
4. Verify **Environment Variables** has:
   - `CONVEX_SITE_URL` = Your Render URL
5. If missing, add it (see Step 5.3)
6. Redeploy on Render

---

### Problem: "Site is Slow"

**Solution 1: Upgrade Plan**
- Free tier sleeps after inactivity
- Upgrade to Starter ($7/month) for always-on

**Solution 2: Wait for Wake Up**
- Free tier takes 30-60 seconds to wake up
- This is normal for free tier

---

### Problem: "Data Not Saving"

**Solution: Check Convex Deployment**
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click your project
3. Click **"Logs"** in sidebar
4. Look for errors
5. If you see errors, run:
   ```bash
   npx convex deploy
   ```
6. Refresh your website

---

### Problem: "Forgot My Password"

**Solution: Reset in Convex**
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click your project
3. Click **"Data"** in sidebar
4. Click **"users"** table
5. Find your user
6. Click **"Delete"** (you'll need to sign up again)

**OR** implement password reset feature (future enhancement)

---

## 🔄 Updating Your Application

### When You Make Code Changes

**Option 1: Automatic (Recommended)**

1. Make changes to your code locally
2. Save all files
3. Open terminal in your project folder
4. Run these commands:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
5. Render will automatically detect changes and redeploy
6. Wait 5-10 minutes
7. Refresh your website

**Option 2: Manual**

1. Go to Render dashboard
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Wait 5-10 minutes

---

### When You Change Convex Functions

If you modify files in the `convex/` folder:

1. Open terminal in your project folder
2. Run:
   ```bash
   npx convex deploy
   ```
3. Wait for deployment to complete
4. Your changes are live immediately!

---

## 📊 Monitoring Your Application

### Check Application Status

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your site
3. You'll see:
   - **Status**: Live, Building, or Failed
   - **Last Deploy**: When it was last updated
   - **Deploys**: History of all deployments

---

### Check Database Status

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click on your project
3. You'll see:
   - **Functions**: How many times functions are called
   - **Database**: How much data you're storing
   - **Logs**: Any errors or issues

---

### View Logs

**Render Logs:**
1. Go to Render dashboard
2. Click on your site
3. Click **"Logs"** in sidebar
4. You'll see build and runtime logs

**Convex Logs:**
1. Go to Convex dashboard
2. Click on your project
3. Click **"Logs"** in sidebar
4. You'll see function execution logs

---

## 💡 Best Practices

### Security

1. **Never share your environment variables**
2. **Use strong passwords** (min 12 characters)
3. **Keep your GitHub repository private** (recommended)
4. **Regularly update dependencies**

---

### Performance

1. **Use Starter plan** for production (faster, always on)
2. **Monitor your usage** in Convex dashboard
3. **Optimize images** before uploading
4. **Clear browser cache** if you see old data

---

### Maintenance

1. **Check logs weekly** for errors
2. **Update code monthly** for security patches
3. **Backup data regularly** (export from Convex)
4. **Test after updates** to ensure everything works

---

## 📞 Getting Help

### Render Support

- **Documentation**: [https://render.com/docs](https://render.com/docs)
- **Community**: [https://community.render.com](https://community.render.com)
- **Support**: Email support@render.com

### Convex Support

- **Documentation**: [https://docs.convex.dev](https://docs.convex.dev)
- **Discord**: [https://convex.dev/community](https://convex.dev/community)
- **Support**: Email support@convex.dev

### GitHub Support

- **Documentation**: [https://docs.github.com](https://docs.github.com)
- **Community**: [https://github.community](https://github.community)
- **Support**: [https://support.github.com](https://support.github.com)

---

## 🎉 Congratulations!

You've successfully deployed your Finance Tracker application to Render!

### What You've Accomplished

✅ Created GitHub, Convex, and Render accounts  
✅ Uploaded your code to GitHub  
✅ Set up your database with Convex  
✅ Deployed your website to Render  
✅ Configured environment variables  
✅ Tested your application  

### Next Steps

1. **Share your website** with your team
2. **Add more data** to test all features
3. **Customize** the application for your needs
4. **Monitor** usage and performance
5. **Update** regularly for new features

---

## 📋 Quick Reference

### Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Your Website | `https://your-site.onrender.com` | Your live application |
| Render Dashboard | `https://dashboard.render.com` | Manage hosting |
| Convex Dashboard | `https://dashboard.convex.dev` | Manage database |
| GitHub Repository | `https://github.com/username/finance-tracker` | Your code |

### Important Commands

| Command | Purpose |
|---------|---------|
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes |
| `git push` | Upload to GitHub |
| `npx convex deploy` | Deploy database changes |
| `bun run build` | Build application locally |
| `bun run dev` | Run locally for testing |

### Environment Variables

| Variable | Value | Where to Add |
|----------|-------|--------------|
| `VITE_CONVEX_URL` | Your Convex URL | Render Dashboard |
| `CONVEX_SITE_URL` | Your Render URL | Convex Dashboard |

---

## 🔐 Security Checklist

Before going live with real data:

- [ ] Changed default passwords
- [ ] Set repository to private
- [ ] Added environment variables correctly
- [ ] Tested all features
- [ ] Reviewed user permissions
- [ ] Set up regular backups
- [ ] Enabled two-factor authentication on GitHub
- [ ] Reviewed Render security settings
- [ ] Tested on multiple devices
- [ ] Shared access only with trusted users

---

## 📝 Deployment Checklist

Use this checklist every time you deploy:

**Before Deployment:**
- [ ] Tested changes locally
- [ ] Committed all changes to Git
- [ ] Updated version number (if applicable)
- [ ] Reviewed environment variables
- [ ] Backed up database (if needed)

**During Deployment:**
- [ ] Pushed code to GitHub
- [ ] Deployed Convex functions (if changed)
- [ ] Waited for Render build to complete
- [ ] Checked build logs for errors

**After Deployment:**
- [ ] Tested login functionality
- [ ] Tested core features
- [ ] Checked dashboard loads correctly
- [ ] Verified data displays properly
- [ ] Tested on mobile device
- [ ] Notified team of updates

---

## 🎯 Common Scenarios

### Scenario 1: Adding a New Team Member

1. Share your website URL with them
2. They click "Sign Up"
3. They create their account
4. You (as admin) can change their role in the Admin panel

---

### Scenario 2: Changing Currency Settings

1. Log in as admin
2. Click on "Currency Selector" (top right)
3. Choose your preferred currency
4. Update exchange rates if needed
5. Changes apply immediately

---

### Scenario 3: Exporting Data

**Current Method:**
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click your project
3. Click "Data"
4. Select a table
5. Click "Export" (top right)
6. Download as JSON

**Future Enhancement:** Export from within the app (planned)

---

### Scenario 4: Backing Up Data

**Automatic Backups:**
- Convex automatically backs up your data
- Backups are kept for 30 days
- No action needed from you

**Manual Backup:**
1. Export each table (see Scenario 3)
2. Save JSON files to your computer
3. Store in a safe location
4. Do this monthly for extra safety

---

## 📈 Scaling Your Application

### When to Upgrade

**Upgrade Render Plan When:**
- You have more than 5 active users
- You need faster load times
- You want 24/7 availability
- Free tier is too slow

**Upgrade Convex Plan When:**
- You exceed free tier limits
- You need more storage
- You need faster queries
- You have 100+ users

### How to Upgrade

**Render:**
1. Go to Render dashboard
2. Click on your site
3. Click "Settings"
4. Scroll to "Plan"
5. Click "Change Plan"
6. Select new plan
7. Confirm payment

**Convex:**
1. Go to Convex dashboard
2. Click "Settings"
3. Click "Billing"
4. Select new plan
5. Confirm payment

---

## 🎓 Learning Resources

### For Beginners

- **Git Basics**: [https://try.github.io](https://try.github.io)
- **Command Line**: [https://www.codecademy.com/learn/learn-the-command-line](https://www.codecademy.com/learn/learn-the-command-line)
- **Web Hosting**: [https://www.youtube.com/watch?v=htbY9-yggB0](https://www.youtube.com/watch?v=htbY9-yggB0)

### For Advanced Users

- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
- **Convex Documentation**: [https://docs.convex.dev](https://docs.convex.dev)
- **React Documentation**: [https://react.dev](https://react.dev)

---

## ❓ FAQ

### Q: How much does it cost?

**A:** 
- **Free Option**: $0/month (Render Free + Convex Free)
- **Recommended**: $7/month (Render Starter + Convex Free)
- **Production**: $7-20/month depending on usage

---

### Q: Can I use my own domain?

**A:** Yes! 
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Render dashboard, click "Settings"
3. Click "Custom Domain"
4. Follow the instructions
5. Wait 24-48 hours for DNS propagation

---

### Q: Is my data secure?

**A:** Yes!
- All data is encrypted in transit (HTTPS)
- Convex encrypts data at rest
- Passwords are hashed (not stored in plain text)
- Regular security updates

---

### Q: Can I move to another hosting provider?

**A:** Yes!
- Your code is on GitHub (portable)
- You can export data from Convex
- Follow deployment guide for other platforms
- See `DeploymentGuide.md` for other options

---

### Q: What if I delete something by mistake?

**A:** 
- Convex keeps backups for 30 days
- Contact Convex support to restore
- Implement soft deletes (future enhancement)
- Regular manual backups recommended

---

### Q: Can I use this for my business?

**A:** Yes!
- Upgrade to paid plans for production use
- Review terms of service for Render and Convex
- Consider additional security measures
- Consult with legal/IT team if needed

---

## 🎊 Success Stories

### Tips from Other Users

**"Start with free tier to test, then upgrade when ready."** - Sarah, Small Business Owner

**"Set up automatic backups from day one."** - Mike, Accountant

**"Test everything on mobile before sharing with team."** - Lisa, Finance Manager

**"Keep a deployment checklist to avoid mistakes."** - John, Developer

---

## 📅 Maintenance Schedule

### Daily
- [ ] Check if site is accessible
- [ ] Monitor for user-reported issues

### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify backups are working

### Monthly
- [ ] Update dependencies
- [ ] Review security settings
- [ ] Export data backup
- [ ] Check for new features

### Quarterly
- [ ] Review and optimize costs
- [ ] Update documentation
- [ ] Train new users
- [ ] Plan new features

---

## 🏆 You're All Set!

You now have a fully deployed Finance Tracker application!

**Remember:**
- Keep your passwords safe
- Monitor your application regularly
- Update when needed
- Ask for help when stuck

**Happy tracking! 📊💰**

---

**Document Version**: 1.0.1
**Last Updated**: January 2025
**Maintained By**: Development Team

### Recent Updates (Version 1.0.1)
- ✅ **Currency Display Fix**: Resolved SAR symbol display issues across all modules
- ✅ **Multi-Currency Enhancement**: Improved currency conversion and formatting
- ✅ **Dashboard Updates**: Fixed Total Expenses field currency display
- ✅ **Documentation Updates**: Updated all docs to reflect current implementation

---

*For technical deployment options, see `DeploymentGuide.md`*  
*For system architecture, see `SYSTEM-DESIGN.md`*  
*For all documentation, see `DOCUMENTATION_INDEX.md`*
