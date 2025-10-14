# 🚀 Hostinger VPS Deployment Guide
## Finance Tracker Application - Complete Step-by-Step Guide

---

## 📋 What is This Guide?

This guide will help you deploy your Finance Tracker application to **Hostinger VPS** (Virtual Private Server). 

**No technical experience needed!** Just follow the steps carefully, one by one.

---

## ⏱️ Time Required

- **First-time setup**: 60-90 minutes
- **Future deployments**: 10-15 minutes

---

## 💰 Cost

- **Hostinger VPS**: Starting from $4.99/month
- **Convex Database**: $0/month (free tier)
- **Domain** (optional): $9.99/year

---

## 📚 Table of Contents

1. [Before You Start](#-before-you-start)
2. [Step 1: Set Up Hostinger VPS](#-step-1-set-up-hostinger-vps)
3. [Step 2: Connect to Your Server](#-step-2-connect-to-your-server)
4. [Step 3: Install Required Software](#-step-3-install-required-software)
5. [Step 4: Set Up Convex Database](#-step-4-set-up-convex-database)
6. [Step 5: Upload Your Code](#-step-5-upload-your-code)
7. [Step 6: Configure the Application](#-step-6-configure-the-application)
8. [Step 7: Set Up Web Server](#-step-7-set-up-web-server)
9. [Step 8: Configure Domain](#-step-8-configure-domain)
10. [Step 9: Set Up SSL Certificate](#-step-9-set-up-ssl-certificate)
11. [Step 10: Test Your Application](#-step-10-test-your-application)
12. [Troubleshooting](#-troubleshooting)
13. [Maintenance & Updates](#-maintenance--updates)

---

## ✅ Before You Start

### What You'll Need

- [ ] Hostinger VPS account (active subscription)
- [ ] Your Finance Tracker code
- [ ] A domain name (optional but recommended)
- [ ] Email address
- [ ] 60-90 minutes of time
- [ ] Patience and focus!

### What You'll Create

- [ ] Convex account (for database)
- [ ] GitHub account (to store code)
- [ ] Running server with your application
- [ ] SSL certificate (for HTTPS)

---

## 🖥️ Step 1: Set Up Hostinger VPS

### 1.1 Purchase Hostinger VPS

If you haven't already:

1. Go to [https://www.hostinger.com/vps-hosting](https://www.hostinger.com/vps-hosting)
2. Choose a VPS plan:
   - **KVM 1**: $4.99/month (good for testing)
   - **KVM 2**: $8.99/month (recommended for production)
   - **KVM 4**: $12.99/month (for high traffic)
3. Click **"Add to Cart"**
4. Complete the purchase
5. Wait for setup email (5-10 minutes)

---

### 1.2 Access VPS Panel

1. Check your email for "VPS Setup Complete"
2. Note down these details:
   - **IP Address**: (e.g., 123.45.67.89)
   - **Username**: Usually `root`
   - **Password**: (provided in email)
3. Go to [https://hpanel.hostinger.com](https://hpanel.hostinger.com)
4. Log in with your Hostinger account
5. Click on **"VPS"** in the menu
6. You'll see your VPS listed

✅ **Done!** Your VPS is ready.

---

### 1.3 Choose Operating System

1. In hPanel, click on your VPS
2. Click **"Operating System"** or **"OS"**
3. Choose **"Ubuntu 22.04"** (recommended)
4. Click **"Change OS"** or **"Install"**
5. Confirm the action
6. Wait 5-10 minutes for installation

**Important**: This will erase everything on the VPS!

✅ **Done!** Ubuntu is installed.

---

## 🔌 Step 2: Connect to Your Server

### 2.1 Get Connection Details

1. In hPanel, click on your VPS
2. Find these details:
   - **IP Address**: (e.g., 123.45.67.89)
   - **SSH Port**: Usually 22
   - **Username**: root
   - **Password**: (click "Show" to reveal)

**Write these down!** You'll need them.

---

### 2.2 Connect Using SSH (Windows)

**Option A: Using PuTTY (Easiest for Windows)**

1. Download PuTTY from [https://www.putty.org](https://www.putty.org)
2. Install and open PuTTY
3. In "Host Name" field, enter your IP address
4. Port: 22
5. Connection type: SSH
6. Click **"Open"**
7. If you see a security alert, click **"Yes"**
8. Login as: `root`
9. Password: (paste your password, it won't show as you type)
10. Press Enter

**Option B: Using Windows Terminal (Windows 10/11)**

1. Press `Windows + X`
2. Select **"Terminal"** or **"PowerShell"**
3. Type this command (replace with your IP):
   ```bash
   ssh root@123.45.67.89
   ```
4. Type `yes` when asked about fingerprint
5. Enter your password (it won't show as you type)
6. Press Enter

---

### 2.3 Connect Using SSH (Mac/Linux)

1. Open **Terminal** application
2. Type this command (replace with your IP):
   ```bash
   ssh root@123.45.67.89
   ```
3. Type `yes` when asked about fingerprint
4. Enter your password
5. Press Enter

---

### 2.4 Verify Connection

You should see something like:
```
Welcome to Ubuntu 22.04 LTS
root@vps-123456:~#
```

✅ **Success!** You're connected to your server.

**Important**: Keep this window open for all next steps!

---

## 📦 Step 3: Install Required Software

### 3.1 Update System

Copy and paste these commands one by one:

```bash
apt update
```
Press Enter. Wait 30-60 seconds.

```bash
apt upgrade -y
```
Press Enter. Wait 2-5 minutes.

✅ **Done!** System is updated.

---

### 3.2 Install Node.js

Node.js is needed to run the application.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
```
Press Enter. Wait 30 seconds.

```bash
apt install -y nodejs
```
Press Enter. Wait 1-2 minutes.

**Verify installation:**
```bash
node --version
```
You should see: `v20.x.x`

```bash
npm --version
```
You should see: `10.x.x`

✅ **Done!** Node.js is installed.

---

### 3.3 Install Bun

Bun is a fast JavaScript runtime (alternative to Node.js).

```bash
curl -fsSL https://bun.sh/install | bash
```
Press Enter. Wait 30 seconds.

```bash
source ~/.bashrc
```
Press Enter.

**Verify installation:**
```bash
bun --version
```
You should see: `1.x.x`

✅ **Done!** Bun is installed.

---

### 3.4 Install Git

Git is needed to download your code.

```bash
apt install -y git
```
Press Enter. Wait 1 minute.

**Verify installation:**
```bash
git --version
```
You should see: `git version 2.x.x`

✅ **Done!** Git is installed.

---

### 3.5 Install Nginx

Nginx is a web server that will serve your application.

```bash
apt install -y nginx
```
Press Enter. Wait 1-2 minutes.

**Start Nginx:**
```bash
systemctl start nginx
```

**Enable Nginx to start on boot:**
```bash
systemctl enable nginx
```

**Verify installation:**
```bash
systemctl status nginx
```
You should see: `active (running)`

Press `q` to exit.

✅ **Done!** Nginx is installed.

---

### 3.6 Install Certbot (for SSL)

Certbot provides free SSL certificates.

```bash
apt install -y certbot python3-certbot-nginx
```
Press Enter. Wait 1-2 minutes.

✅ **Done!** Certbot is installed.

---

## 🗄️ Step 4: Set Up Convex Database

### 4.1 Create Convex Account

1. Open a new browser tab
2. Go to [https://convex.dev](https://convex.dev)
3. Click **"Start Building"** or **"Sign Up"**
4. Choose **"Continue with GitHub"**
5. If you don't have GitHub:
   - Go to [https://github.com](https://github.com)
   - Click **"Sign up"**
   - Create your account
   - Come back to Convex
6. Log in with GitHub
7. Click **"Authorize Convex"**

✅ **Done!** Convex account created.

---

### 4.2 Create Convex Project

1. In Convex dashboard, click **"Create a project"**
2. Project name: `finance-tracker`
3. Team: Choose your team (usually your name)
4. Click **"Create project"**
5. You'll see a deployment URL like:
   ```
   https://your-project-name.convex.cloud
   ```

**IMPORTANT**: Copy this URL and save it somewhere safe!

✅ **Done!** Convex project created.

---

## 📤 Step 5: Upload Your Code

### 5.1 Create Application Directory

Back in your SSH terminal:

```bash
cd /var/www
```

```bash
mkdir finance-tracker
```

```bash
cd finance-tracker
```

✅ **Done!** Directory created.

---

### 5.2 Upload Code (Option A: Using Git)

**If your code is on GitHub:**

```bash
git clone https://github.com/YOUR-USERNAME/finance-tracker.git .
```

Replace `YOUR-USERNAME` with your GitHub username.

**If you need to upload code to GitHub first:**

1. Go to [https://github.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Name: `finance-tracker`
4. Click **"Create repository"**
5. On your local computer, open terminal in project folder
6. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/finance-tracker.git
   git push -u origin main
   ```
7. Then on your VPS, run the clone command above

✅ **Done!** Code uploaded via Git.

---

### 5.3 Upload Code (Option B: Using FTP)

**If you prefer using FTP:**

1. Download FileZilla from [https://filezilla-project.org](https://filezilla-project.org)
2. Install and open FileZilla
3. Fill in connection details:
   - **Host**: Your VPS IP address
   - **Username**: root
   - **Password**: Your VPS password
   - **Port**: 22
4. Click **"Quickconnect"**
5. Navigate to `/var/www/finance-tracker` on the right side
6. Drag and drop your project files from left to right
7. Wait for upload to complete

✅ **Done!** Code uploaded via FTP.

---

### 5.4 Verify Code Upload

```bash
ls -la
```

You should see your project files:
- `client/`
- `convex/`
- `server/`
- `package.json`
- etc.

✅ **Done!** Code is on the server.

---

## ⚙️ Step 6: Configure the Application

### 6.1 Install Dependencies

```bash
bun install
```

Press Enter. Wait 2-5 minutes.

You should see: `✓ Installed dependencies`

✅ **Done!** Dependencies installed.

---

### 6.2 Create Environment File

```bash
nano .env.local
```

This opens a text editor. Type or paste:

```env
VITE_CONVEX_URL=https://your-project-name.convex.cloud
CONVEX_SITE_URL=http://your-vps-ip
```

**Replace**:
- `your-project-name.convex.cloud` with your actual Convex URL
- `your-vps-ip` with your actual VPS IP address

**To save and exit:**
1. Press `Ctrl + X`
2. Press `Y`
3. Press `Enter`

✅ **Done!** Environment file created.

---

### 6.3 Deploy Convex Functions

```bash
npx convex deploy
```

You'll be asked to log in:
1. A URL will appear
2. Copy the URL
3. Open it in your browser
4. Log in with your Convex account
5. Click **"Authorize"**
6. Go back to terminal
7. Wait for deployment to complete (1-2 minutes)

You should see: `✓ Deployed successfully!`

✅ **Done!** Convex functions deployed.

---

### 6.4 Build the Application

```bash
bun run build
```

Press Enter. Wait 2-5 minutes.

You should see:
```
✓ built in XXXms
```

**Verify build:**
```bash
ls dist/public
```

You should see files like:
- `index.html`
- `assets/`
- etc.

✅ **Done!** Application built.

---

## 🌐 Step 7: Set Up Web Server

### 7.1 Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/finance-tracker
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # If you don't have a domain yet, use your IP:
    # server_name 123.45.67.89;

    root /var/www/finance-tracker/dist/public;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

**Replace**:
- `your-domain.com` with your actual domain
- OR use your IP address if you don't have a domain

**To save and exit:**
1. Press `Ctrl + X`
2. Press `Y`
3. Press `Enter`

✅ **Done!** Nginx configuration created.

---

### 7.2 Enable the Site

```bash
ln -s /etc/nginx/sites-available/finance-tracker /etc/nginx/sites-enabled/
```

**Remove default site:**
```bash
rm /etc/nginx/sites-enabled/default
```

**Test configuration:**
```bash
nginx -t
```

You should see:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Restart Nginx:**
```bash
systemctl restart nginx
```

✅ **Done!** Nginx configured.

---

## 🌍 Step 8: Configure Domain

### 8.1 If You Have a Domain

**In your domain registrar (e.g., Namecheap, GoDaddy, Hostinger):**

1. Log in to your domain provider
2. Find **"DNS Management"** or **"DNS Settings"**
3. Add/Edit these records:

**A Record:**
- **Type**: A
- **Host**: @ (or leave empty)
- **Value**: Your VPS IP address
- **TTL**: 3600 (or default)

**A Record (www):**
- **Type**: A
- **Host**: www
- **Value**: Your VPS IP address
- **TTL**: 3600 (or default)

4. Click **"Save"** or **"Add Record"**
5. Wait 5-60 minutes for DNS propagation

✅ **Done!** Domain configured.

---

### 8.2 If You Don't Have a Domain

You can use your VPS IP address directly:

1. Your application will be accessible at: `http://your-vps-ip`
2. Example: `http://123.45.67.89`

**Note**: You won't be able to get SSL certificate without a domain.

**To get a domain:**
- Hostinger: [https://www.hostinger.com/domain-name-search](https://www.hostinger.com/domain-name-search)
- Namecheap: [https://www.namecheap.com](https://www.namecheap.com)
- GoDaddy: [https://www.godaddy.com](https://www.godaddy.com)

---

### 8.3 Update Convex Site URL

**If you configured a domain:**

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click on your project
3. Click **"Settings"**
4. Find **"Environment Variables"**
5. Add or update:
   - **Key**: `CONVEX_SITE_URL`
   - **Value**: `https://your-domain.com` (or `http://your-vps-ip`)
6. Click **"Save"**

**Also update your local .env.local:**

```bash
nano /var/www/finance-tracker/.env.local
```

Update the `CONVEX_SITE_URL` line:
```env
CONVEX_SITE_URL=https://your-domain.com
```

Save and exit (Ctrl+X, Y, Enter).

✅ **Done!** URLs updated.

---

## 🔒 Step 9: Set Up SSL Certificate

**Note**: You need a domain for this step!

### 9.1 Install SSL Certificate

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

Replace `your-domain.com` with your actual domain.

**Follow the prompts:**

1. **Email address**: Enter your email
2. **Terms of Service**: Type `Y` and press Enter
3. **Share email**: Type `N` and press Enter
4. **Redirect HTTP to HTTPS**: Type `2` and press Enter

Wait 30-60 seconds.

You should see:
```
Congratulations! You have successfully enabled HTTPS
```

✅ **Done!** SSL certificate installed.

---

### 9.2 Test SSL Certificate

1. Open your browser
2. Go to: `https://your-domain.com`
3. You should see a padlock icon 🔒
4. Your site should load with HTTPS

✅ **Done!** SSL is working.

---

### 9.3 Set Up Auto-Renewal

SSL certificates expire after 90 days. Set up automatic renewal:

```bash
certbot renew --dry-run
```

This tests the renewal process.

**Set up automatic renewal:**
```bash
systemctl enable certbot.timer
```

```bash
systemctl start certbot.timer
```

**Verify timer:**
```bash
systemctl status certbot.timer
```

You should see: `active (waiting)`

Press `q` to exit.

✅ **Done!** Auto-renewal configured.

---

## 🧪 Step 10: Test Your Application

### 10.1 Open Your Website

1. Open your browser
2. Go to your website:
   - With domain: `https://your-domain.com`
   - Without domain: `http://your-vps-ip`
3. You should see the Finance Tracker login page

✅ **Success!** Application is live.

---

### 10.2 Create Your First Account

1. Click **"Sign up"** or **"Create account"**
2. Fill in:
   - **Name**: Your name
   - **Email**: Your email
   - **Password**: Strong password (min 6 chars, 1 letter, 1 number)
3. Click **"Sign Up"**

**Note**: The first user automatically becomes an Admin!

✅ **Done!** Account created.

---

### 10.3 Test Features

Try these to ensure everything works:

1. **Dashboard**: Should load (empty at first)
2. **Add a Sale**:
   - Click "Sales" in sidebar
   - Click "Add Sale"
   - Fill in the form
   - Click "Save"
3. **Add an Expense**:
   - Click "Expenses"
   - Click "Add Expense"
   - Fill in the form
   - Click "Save"
4. **Check Dashboard**: Should show your data

✅ **Success!** Everything is working!

---

## 🐛 Troubleshooting

### Problem: "502 Bad Gateway"

**Cause**: Application not running or Nginx misconfigured.

**Solution 1: Check Nginx**
```bash
nginx -t
```
If errors, fix the configuration file.

**Solution 2: Restart Nginx**
```bash
systemctl restart nginx
```

**Solution 3: Check if files exist**
```bash
ls /var/www/finance-tracker/dist/public
```
If empty, rebuild:
```bash
cd /var/www/finance-tracker
bun run build
```

---

### Problem: "Cannot connect to Convex"

**Solution 1: Check Environment Variables**
```bash
cat /var/www/finance-tracker/.env.local
```
Verify `VITE_CONVEX_URL` is correct.

**Solution 2: Rebuild Application**
```bash
cd /var/www/finance-tracker
bun run build
systemctl restart nginx
```

**Solution 3: Check Convex Deployment**
```bash
cd /var/www/finance-tracker
npx convex deploy
```

---

### Problem: "Site Not Loading"

**Solution 1: Check Nginx Status**
```bash
systemctl status nginx
```
If not running:
```bash
systemctl start nginx
```

**Solution 2: Check Firewall**
```bash
ufw status
```
If active, allow HTTP and HTTPS:
```bash
ufw allow 80/tcp
ufw allow 443/tcp
```

**Solution 3: Check DNS**
Wait 5-60 minutes for DNS propagation.
Test with IP address instead of domain.

---

### Problem: "SSL Certificate Failed"

**Solution 1: Check Domain DNS**
```bash
nslookup your-domain.com
```
Should return your VPS IP address.

**Solution 2: Try Again**
Wait 30 minutes for DNS propagation, then:
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Solution 3: Use HTTP First**
Access via `http://` first, then add SSL later.

---

### Problem: "Cannot Sign Up"

**Solution 1: Check Convex**
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click your project
3. Click **"Logs"**
4. Look for errors

**Solution 2: Check CONVEX_SITE_URL**
1. In Convex Dashboard → Settings
2. Verify `CONVEX_SITE_URL` matches your domain/IP
3. Update if needed
4. Rebuild application

**Solution 3: Check Browser Console**
1. Press F12 in browser
2. Click "Console" tab
3. Look for errors
4. Share errors for help

---

### Problem: "Slow Performance"

**Solution 1: Enable Caching**
Already configured in Nginx. Verify:
```bash
cat /etc/nginx/sites-available/finance-tracker | grep cache
```

**Solution 2: Upgrade VPS**
If using KVM 1, upgrade to KVM 2 or higher.

**Solution 3: Optimize Images**
Compress images before uploading.

---

### Problem: "Out of Memory"

**Solution: Add Swap Space**
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 🔄 Maintenance & Updates

### Daily Checks

**Check if site is running:**
```bash
systemctl status nginx
```

**Check disk space:**
```bash
df -h
```

---

### Weekly Maintenance

**Update system packages:**
```bash
apt update && apt upgrade -y
```

**Check logs for errors:**
```bash
tail -n 50 /var/log/nginx/error.log
```

---

### Updating Your Application

**When you make code changes:**

1. **On your local computer**, commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. **On your VPS**, pull the changes:
   ```bash
   cd /var/www/finance-tracker
   git pull
   ```

3. **If you changed Convex functions:**
   ```bash
   npx convex deploy
   ```

4. **Rebuild the application:**
   ```bash
   bun install
   bun run build
   ```

5. **Restart Nginx:**
   ```bash
   systemctl restart nginx
   ```

6. **Test your website**

✅ **Done!** Application updated.

---

### Backup Your Data

**Backup Convex Data:**
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Click your project
3. Click **"Data"**
4. For each table, click **"Export"**
5. Save JSON files to your computer

**Backup Application Files:**
```bash
cd /var/www
tar -czf finance-tracker-backup-$(date +%Y%m%d).tar.gz finance-tracker
```

**Download backup to your computer:**
Use FileZilla to download the `.tar.gz` file.

**Schedule automatic backups:**
```bash
crontab -e
```

Add this line (backup daily at 2 AM):
```
0 2 * * * cd /var/www && tar -czf finance-tracker-backup-$(date +\%Y\%m\%d).tar.gz finance-tracker
```

Save and exit.

---

### Monitoring

**Check application logs:**
```bash
tail -f /var/log/nginx/access.log
```
Press `Ctrl+C` to exit.

**Check error logs:**
```bash
tail -f /var/log/nginx/error.log
```
Press `Ctrl+C` to exit.

**Check system resources:**
```bash
htop
```
Press `q` to exit.

If `htop` is not installed:
```bash
apt install -y htop
```

---

## 🔐 Security Best Practices

### Change SSH Port

**For extra security:**

```bash
nano /etc/ssh/sshd_config
```

Find the line:
```
#Port 22
```

Change to:
```
Port 2222
```

Save and exit.

**Restart SSH:**
```bash
systemctl restart sshd
```

**Update firewall:**
```bash
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

**Next time, connect with:**
```bash
ssh -p 2222 root@your-vps-ip
```

---

### Set Up Firewall

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

Type `y` and press Enter.

**Check firewall status:**
```bash
ufw status
```

---

### Create Non-Root User

**For better security:**

```bash
adduser appuser
```

Follow the prompts to set password and details.

**Give sudo privileges:**
```bash
usermod -aG sudo appuser
```

**Switch to new user:**
```bash
su - appuser
```

**Use this user for future logins:**
```bash
ssh appuser@your-vps-ip
```

---

### Enable Automatic Security Updates

```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

Select **"Yes"** and press Enter.

---

## 📊 Performance Optimization

### Enable HTTP/2

Already enabled with SSL certificate!

**Verify:**
```bash
curl -I --http2 https://your-domain.com
```

You should see: `HTTP/2 200`

---

### Enable Brotli Compression

**Install Brotli:**
```bash
apt install -y brotli
```

**Update Nginx config:**
```bash
nano /etc/nginx/sites-available/finance-tracker
```

Add inside `server` block:
```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

Save and exit.

**Restart Nginx:**
```bash
systemctl restart nginx
```

---

### Set Up Caching

Already configured in the Nginx config!

**Verify caching headers:**
```bash
curl -I https://your-domain.com/assets/index.js
```

You should see: `Cache-Control: public, immutable`

---

## 💡 Tips & Best Practices

### Regular Maintenance

1. **Update system weekly**
2. **Check logs for errors**
3. **Monitor disk space**
4. **Backup data monthly**
5. **Test application after updates**

---

### Security

1. **Use strong passwords**
2. **Enable firewall**
3. **Keep software updated**
4. **Use SSL certificate**
5. **Monitor access logs**

---

### Performance

1. **Use CDN for static assets** (optional)
2. **Optimize images before upload**
3. **Enable caching** (already done)
4. **Monitor server resources**
5. **Upgrade VPS if needed**

---

### Backup Strategy

1. **Daily automatic backups**
2. **Weekly manual verification**
3. **Monthly off-site backup**
4. **Test restore procedure**

---

## 📞 Getting Help

### Hostinger Support

- **Live Chat**: Available 24/7 in hPanel
- **Email**: support@hostinger.com
- **Knowledge Base**: [https://support.hostinger.com](https://support.hostinger.com)

### Convex Support

- **Documentation**: [https://docs.convex.dev](https://docs.convex.dev)
- **Discord**: [https://convex.dev/community](https://convex.dev/community)
- **Email**: support@convex.dev

### Community Help

- **Stack Overflow**: Tag questions with `nginx`, `ubuntu`, `convex`
- **Reddit**: r/webhosting, r/selfhosted
- **Discord**: Join Convex community

---

## 🎉 Congratulations!

You've successfully deployed your Finance Tracker application to Hostinger VPS!

### What You've Accomplished

✅ Set up Hostinger VPS  
✅ Installed all required software  
✅ Configured Convex database  
✅ Uploaded and built your application  
✅ Configured Nginx web server  
✅ Set up domain (optional)  
✅ Installed SSL certificate  
✅ Tested your application  
✅ Learned maintenance procedures  

### Next Steps

1. **Share your website** with your team
2. **Add more data** to test all features
3. **Set up regular backups**
4. **Monitor performance**
5. **Keep system updated**

---

## 📋 Quick Reference

### Important Commands

| Command | Purpose |
|---------|---------|
| `systemctl restart nginx` | Restart web server |
| `systemctl status nginx` | Check web server status |
| `cd /var/www/finance-tracker` | Go to app directory |
| `git pull` | Update code from GitHub |
| `bun run build` | Build application |
| `npx convex deploy` | Deploy database changes |
| `tail -f /var/log/nginx/error.log` | View error logs |
| `df -h` | Check disk space |
| `htop` | Monitor system resources |

### Important Files

| File | Purpose |
|------|---------|
| `/var/www/finance-tracker/` | Application directory |
| `/etc/nginx/sites-available/finance-tracker` | Nginx config |
| `/var/www/finance-tracker/.env.local` | Environment variables |
| `/var/log/nginx/error.log` | Error logs |
| `/var/log/nginx/access.log` | Access logs |

### Important URLs

| URL | Purpose |
|-----|---------|
| Your website | `https://your-domain.com` |
| Hostinger Panel | `https://hpanel.hostinger.com` |
| Convex Dashboard | `https://dashboard.convex.dev` |

---

## 🔧 Advanced Configuration

### Set Up Process Manager (PM2)

**For running Node.js processes:**

```bash
npm install -g pm2
```

**Start your app with PM2:**
```bash
cd /var/www/finance-tracker
pm2 start "bun run dev" --name finance-tracker
```

**Save PM2 configuration:**
```bash
pm2 save
pm2 startup
```

**Useful PM2 commands:**
```bash
pm2 list          # List all processes
pm2 logs          # View logs
pm2 restart all   # Restart all processes
pm2 stop all      # Stop all processes
```

---

### Set Up Redis (Optional)

**For caching:**

```bash
apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server
```

---

### Set Up Monitoring

**Install monitoring tools:**

```bash
apt install -y netdata
```

**Access monitoring:**
Open browser: `http://your-vps-ip:19999`

---

## 📝 Deployment Checklist

Use this checklist every time you deploy:

**Before Deployment:**
- [ ] Tested changes locally
- [ ] Committed all changes to Git
- [ ] Backed up current version
- [ ] Reviewed environment variables
- [ ] Checked Convex deployment

**During Deployment:**
- [ ] Connected to VPS via SSH
- [ ] Pulled latest code
- [ ] Installed dependencies
- [ ] Deployed Convex functions
- [ ] Built application
- [ ] Restarted Nginx

**After Deployment:**
- [ ] Tested login functionality
- [ ] Tested core features
- [ ] Checked dashboard loads
- [ ] Verified data displays correctly
- [ ] Tested on mobile device
- [ ] Checked error logs
- [ ] Notified team of updates

---

## 🎯 Common Scenarios

### Scenario 1: Server Restart

**After VPS restart:**

```bash
systemctl start nginx
systemctl start redis-server  # if installed
pm2 resurrect  # if using PM2
```

---

### Scenario 2: Domain Change

1. Update DNS records
2. Update Nginx config
3. Get new SSL certificate
4. Update Convex settings
5. Rebuild application

---

### Scenario 3: Moving to Larger VPS

1. Backup everything
2. Set up new VPS (follow this guide)
3. Restore backups
4. Update DNS to new IP
5. Test thoroughly

---

### Scenario 4: Database Migration

1. Export data from Convex
2. Create new Convex project
3. Update environment variables
4. Deploy Convex functions
5. Import data
6. Test application

---

## 🚨 Emergency Procedures

### Site is Down

1. **Check Nginx:**
   ```bash
   systemctl status nginx
   systemctl restart nginx
   ```

2. **Check disk space:**
   ```bash
   df -h
   ```
   If full, clean up:
   ```bash
   apt autoremove -y
   apt clean
   ```

3. **Check logs:**
   ```bash
   tail -n 100 /var/log/nginx/error.log
   ```

4. **Restart server (last resort):**
   ```bash
   reboot
   ```

---

### Data Loss

1. **Restore from Convex backup** (automatic)
2. **Restore from manual backup**
3. **Contact Convex support**

---

### Security Breach

1. **Change all passwords immediately**
2. **Check access logs:**
   ```bash
   tail -n 1000 /var/log/nginx/access.log
   ```
3. **Update all software:**
   ```bash
   apt update && apt upgrade -y
   ```
4. **Review firewall rules**
5. **Contact Hostinger support**

---

## 📚 Additional Resources

### Learning Resources

- **Linux Command Line**: [https://linuxjourney.com](https://linuxjourney.com)
- **Nginx Documentation**: [https://nginx.org/en/docs/](https://nginx.org/en/docs/)
- **Ubuntu Server Guide**: [https://ubuntu.com/server/docs](https://ubuntu.com/server/docs)

### Video Tutorials

- Search YouTube for: "Deploy Node.js app on VPS"
- Search YouTube for: "Nginx configuration tutorial"
- Search YouTube for: "Linux server administration"

---

## ❓ FAQ

### Q: How much does Hostinger VPS cost?

**A:** Starting from $4.99/month for KVM 1. Recommended: KVM 2 at $8.99/month for production.

---

### Q: Do I need a domain?

**A:** No, but highly recommended. You can use your IP address, but you won't get SSL certificate without a domain.

---

### Q: Can I use this for my business?

**A:** Yes! Make sure to:
- Use KVM 2 or higher
- Set up SSL certificate
- Enable automatic backups
- Monitor regularly

---

### Q: What if I make a mistake?

**A:** You can:
- Restore from backup
- Reinstall OS and start over
- Contact Hostinger support

---

### Q: How do I scale for more users?

**A:** 
1. Upgrade to larger VPS plan
2. Enable caching
3. Use CDN for static assets
4. Optimize database queries

---

### Q: Can I host multiple applications?

**A:** Yes! Create separate directories and Nginx configs for each application.

---

## 🎊 You're All Set!

Your Finance Tracker is now live on Hostinger VPS!

**Remember:**
- Keep your server updated
- Monitor regularly
- Backup frequently
- Ask for help when needed

**Happy hosting! 🚀**

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

*For other deployment options, see `DeploymentGuide.md`*  
*For Render deployment, see `RENDER-DEPLOY.md`*  
*For system design, see `SYSTEM-DESIGN.md`*  
*For all documentation, see `DOCUMENTATION_INDEX.md`*
