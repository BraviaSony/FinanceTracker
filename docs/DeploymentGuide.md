# Deployment Guide
## Finance Tracker Application

---

## 📋 Document Information

| Field | Value |
|-------|-------|
| **Application** | Finance Tracker |
| **Version** | 1.0.0 |
| **Last Updated** | January 2025 |
| **Deployment Status** | Production Ready |

---

## 🎯 Overview

This guide provides comprehensive instructions for deploying the Finance Tracker application to production. The application uses a modern serverless architecture with Convex as the backend and can be deployed to various hosting platforms.

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend**:
- React 19.0.0
- TypeScript 5.7.2
- Vite 7.1.0 (Build tool)
- Tailwind CSS 4.0.14
- Shadcn UI Components

**Backend**:
- Convex (Serverless database and backend)
- Convex Auth (Authentication)

**Runtime**:
- Bun (Development and build)
- Node.js (Production server)

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   CDN / HOSTING PLATFORM                    │
│              (Vercel / Netlify / AWS / etc.)                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Static Assets (HTML, CSS, JS)             │   │
│  │              React Application Bundle                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket + HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONVEX CLOUD                             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Database   │  │     Auth     │  │   Functions  │     │
│  │   (NoSQL)    │  │   Service    │  │  (Queries/   │     │
│  │              │  │              │  │  Mutations)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

### Required Software

1. **Node.js**: Version 18.x or higher
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **Bun**: Latest version (for development)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   bun --version
   ```

3. **Git**: For version control
   ```bash
   git --version
   ```

### Required Accounts

1. **Convex Account**
   - Sign up at: https://convex.dev
   - Create a new project
   - Note your deployment URL

2. **Hosting Platform Account** (Choose one)
   - Vercel: https://vercel.com
   - Netlify: https://netlify.com
   - AWS Amplify: https://aws.amazon.com/amplify
   - Cloudflare Pages: https://pages.cloudflare.com

---

## 🔧 Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd finance-tracker
```

### 2. Install Dependencies

```bash
# Using Bun (recommended for development)
bun install

# Or using npm
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Convex Configuration
VITE_CONVEX_URL=https://your-project.convex.cloud

# Optional: Node Environment
NODE_ENV=production

# Optional: Convex Site URL (for OAuth)
CONVEX_SITE_URL=https://your-domain.com
```

**Important**: 
- Never commit `.env` file to version control
- Add `.env` to `.gitignore`
- Use environment variables in your hosting platform

---

## 🚀 Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Vercel provides the easiest deployment experience with automatic builds and deployments.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy Convex Backend

```bash
# Install Convex CLI
npm install -g convex

# Login to Convex
npx convex login

# Deploy Convex functions
npx convex deploy
```

This will output your Convex deployment URL. Copy it for the next step.

#### Step 4: Configure Environment Variables

In your Vercel project settings, add:
- `VITE_CONVEX_URL`: Your Convex deployment URL
- `CONVEX_SITE_URL`: Your Vercel deployment URL

#### Step 5: Deploy to Vercel

```bash
# Deploy to production
vercel --prod
```

#### Step 6: Configure Custom Domain (Optional)

1. Go to Vercel dashboard
2. Navigate to your project settings
3. Add your custom domain
4. Update DNS records as instructed

---

### Option 2: Deploy to Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

#### Step 3: Deploy Convex Backend

```bash
# Deploy Convex functions
npx convex deploy
```

#### Step 4: Build the Application

```bash
# Build for production
bun run build
```

#### Step 5: Deploy to Netlify

```bash
# Initialize Netlify
netlify init

# Deploy to production
netlify deploy --prod --dir=dist/public
```

#### Step 6: Configure Environment Variables

In Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add `VITE_CONVEX_URL` with your Convex URL
3. Redeploy the site

---

### Option 3: Deploy to AWS Amplify

#### Step 1: Install AWS Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

#### Step 2: Configure AWS Credentials

```bash
amplify configure
```

#### Step 3: Deploy Convex Backend

```bash
npx convex deploy
```

#### Step 4: Initialize Amplify

```bash
amplify init
```

#### Step 5: Add Hosting

```bash
amplify add hosting
```

Select:
- Hosting with Amplify Console
- Manual deployment

#### Step 6: Build and Deploy

```bash
# Build the application
bun run build

# Deploy to AWS
amplify publish
```

#### Step 7: Configure Environment Variables

In AWS Amplify Console:
1. Go to App settings → Environment variables
2. Add `VITE_CONVEX_URL`
3. Redeploy

---

### Option 4: Deploy to Cloudflare Pages

#### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

#### Step 2: Login to Cloudflare

```bash
wrangler login
```

#### Step 3: Deploy Convex Backend

```bash
npx convex deploy
```

#### Step 4: Build the Application

```bash
bun run build
```

#### Step 5: Deploy to Cloudflare Pages

```bash
wrangler pages deploy dist/public --project-name=finance-tracker
```

#### Step 6: Configure Environment Variables

In Cloudflare dashboard:
1. Go to Pages → Your project → Settings
2. Add environment variable `VITE_CONVEX_URL`
3. Redeploy

---

### Option 5: Self-Hosted Deployment

For self-hosted deployments on your own server.

#### Step 1: Deploy Convex Backend

```bash
npx convex deploy
```

#### Step 2: Build the Application

```bash
bun run build
```

#### Step 3: Prepare Server

Install Node.js on your server:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 4: Transfer Files

```bash
# Copy built files to server
scp -r dist/ user@your-server:/var/www/finance-tracker/
```

#### Step 5: Configure Nginx

Create Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/finance-tracker/dist/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 6: Enable HTTPS

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

#### Step 7: Start the Server

```bash
# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔐 Security Configuration

### 1. Environment Variables

**Never expose sensitive data in client-side code**:
- ✅ Use `VITE_` prefix for client-side variables
- ❌ Don't store API keys in frontend code
- ✅ Use Convex Auth for authentication
- ✅ Store secrets in hosting platform's environment variables

### 2. HTTPS Configuration

**Always use HTTPS in production**:
- Most hosting platforms provide automatic HTTPS
- For self-hosted: Use Let's Encrypt (Certbot)
- Redirect HTTP to HTTPS

### 3. CORS Configuration

Convex handles CORS automatically, but ensure:
- `CONVEX_SITE_URL` matches your production domain
- No wildcard origins in production

### 4. Content Security Policy

Add CSP headers in your hosting platform:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.convex.cloud wss://*.convex.cloud;
```

---

## 📊 Monitoring & Logging

### Convex Dashboard

Monitor your backend at: https://dashboard.convex.dev

**Available Metrics**:
- Function execution times
- Database query performance
- Error rates and logs
- Active connections
- Storage usage

### Frontend Monitoring

**Recommended Tools**:
1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics**
3. **Sentry** for error tracking
4. **LogRocket** for session replay

### Setting up Sentry (Optional)

```bash
npm install @sentry/react
```

Add to `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Type check
        run: bun run typecheck
        
      - name: Lint
        run: bun run lint
        
      - name: Build
        run: bun run build
        env:
          VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL }}
          
      - name: Deploy Convex
        run: npx convex deploy --cmd 'bun run build'
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets

Add these secrets to your GitHub repository:
- `VITE_CONVEX_URL`: Your Convex deployment URL
- `CONVEX_DEPLOY_KEY`: From Convex dashboard
- `VERCEL_TOKEN`: From Vercel account settings
- `VERCEL_ORG_ID`: From Vercel project settings
- `VERCEL_PROJECT_ID`: From Vercel project settings

---

## 🧪 Pre-Deployment Checklist

### Code Quality

- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Code formatted with Prettier
- [ ] No console.log statements in production code
- [ ] All tests passing (if applicable)

### Configuration

- [ ] Environment variables configured
- [ ] Convex deployment URL set
- [ ] Production build tested locally
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)

### Security

- [ ] Authentication working correctly
- [ ] Authorization rules tested
- [ ] No sensitive data in client code
- [ ] CORS configured properly
- [ ] Rate limiting enabled (Convex default)

### Performance

- [ ] Bundle size optimized (< 500KB gzipped)
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] Caching headers set

### Functionality

- [ ] All CRUD operations working
- [ ] Multi-currency conversion accurate
- [ ] Charts rendering correctly
- [ ] Forms validating properly
- [ ] Real-time updates working
- [ ] Mobile responsive design verified

---

## 🚀 Deployment Steps

### Step-by-Step Production Deployment

#### 1. Prepare the Code

```bash
# Pull latest changes
git pull origin main

# Install dependencies
bun install

# Run type check
bun run typecheck

# Run linter
bun run lint

# Build for production
bun run build
```

#### 2. Deploy Convex Backend

```bash
# Login to Convex
npx convex login

# Deploy Convex functions
npx convex deploy

# Note the deployment URL
```

#### 3. Update Environment Variables

Update `VITE_CONVEX_URL` in your hosting platform with the Convex deployment URL.

#### 4. Deploy Frontend

```bash
# For Vercel
vercel --prod

# For Netlify
netlify deploy --prod --dir=dist/public

# For other platforms, follow their specific deployment commands
```

#### 5. Verify Deployment

1. Visit your production URL
2. Test authentication (login/signup)
3. Test CRUD operations in each module
4. Verify charts and analytics
5. Test on mobile devices
6. Check browser console for errors

#### 6. Monitor Initial Traffic

- Watch Convex dashboard for errors
- Monitor hosting platform analytics
- Check error tracking service (if configured)

---

## 🔧 Post-Deployment Configuration

### 1. Set Up Custom Domain

**For Vercel**:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

**For Netlify**:
1. Go to Domain Settings
2. Add custom domain
3. Update DNS records as instructed

### 2. Configure Email Notifications (Future)

When implementing email notifications:
1. Set up SendGrid or similar service
2. Add API keys to environment variables
3. Configure email templates
4. Test email delivery

### 3. Set Up Backups

**Convex Backups**:
- Automatic backups enabled by default
- Point-in-time recovery available
- Export data regularly for additional safety

**Manual Backup Script**:
```bash
# Create backup script
npx convex export --path ./backups/backup-$(date +%Y%m%d).json
```

### 4. Configure Monitoring Alerts

Set up alerts for:
- High error rates
- Slow response times
- Database connection issues
- High memory usage
- SSL certificate expiration

---

## 📈 Scaling Considerations

### Database Scaling

**Convex automatically scales**, but monitor:
- Query performance
- Index usage
- Document size
- Connection count

**Optimization Tips**:
- Use indexes for common queries
- Paginate large result sets
- Cache frequently accessed data
- Optimize document structure

### Frontend Scaling

**CDN Configuration**:
- Most hosting platforms include CDN
- Configure cache headers appropriately
- Use image optimization services

**Code Splitting**:
- Already configured with Vite
- Lazy load routes if needed
- Split large components

### Cost Optimization

**Convex Pricing**:
- Free tier: 1M function calls/month
- Monitor usage in dashboard
- Optimize queries to reduce calls

**Hosting Costs**:
- Vercel: Free for personal projects
- Netlify: Free tier available
- AWS: Pay per use
- Self-hosted: Server costs

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Build Fails

**Error**: `Module not found` or `Type error`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lock
bun install

# Rebuild
bun run build
```

#### Issue 2: Convex Connection Error

**Error**: `Failed to connect to Convex`

**Solution**:
1. Verify `VITE_CONVEX_URL` is correct
2. Check Convex deployment status
3. Ensure CORS is configured
4. Check network connectivity

#### Issue 3: Authentication Not Working

**Error**: `Authentication failed`

**Solution**:
1. Verify `CONVEX_SITE_URL` matches production domain
2. Check Convex Auth configuration
3. Clear browser cookies and cache
4. Check Convex dashboard for auth errors

#### Issue 4: Charts Not Rendering

**Error**: Charts appear blank or broken

**Solution**:
1. Check browser console for errors
2. Verify data is loading correctly
3. Check Recharts version compatibility
4. Ensure responsive container has height

#### Issue 5: Slow Performance

**Symptoms**: Slow page loads, laggy interactions

**Solution**:
1. Check bundle size: `bun run build --analyze`
2. Optimize images
3. Enable code splitting
4. Check Convex query performance
5. Use React DevTools Profiler

---

## 🔄 Rollback Procedure

### If Deployment Fails

#### 1. Rollback Frontend

**Vercel**:
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

**Netlify**:
1. Go to Deploys tab
2. Click on previous successful deploy
3. Click "Publish deploy"

#### 2. Rollback Convex

```bash
# List deployments
npx convex deployments list

# Rollback to previous version
npx convex deployments rollback <deployment-id>
```

#### 3. Verify Rollback

1. Check application is working
2. Verify data integrity
3. Monitor error rates
4. Communicate with users if needed

---

## 📊 Performance Benchmarks

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Total Bundle Size | < 500KB | Build output |
| API Response Time | < 200ms | Convex dashboard |

### Measuring Performance

```bash
# Run Lighthouse audit
npx lighthouse https://your-domain.com --view

# Analyze bundle size
npx vite-bundle-visualizer
```

---

## 🔐 Security Best Practices

### 1. Regular Updates

```bash
# Check for outdated packages
bun outdated

# Update dependencies
bun update

# Update Convex
npx convex update
```

### 2. Security Scanning

```bash
# Run security audit
bun audit

# Fix vulnerabilities
bun audit --fix
```

### 3. Access Control

- Use strong passwords
- Enable 2FA on all accounts
- Limit access to production environment
- Rotate API keys regularly
- Review user permissions quarterly

### 4. Data Protection

- Enable HTTPS everywhere
- Use secure cookies
- Implement rate limiting
- Sanitize user inputs
- Encrypt sensitive data

---

## 📞 Support & Resources

### Documentation

- **Convex Docs**: https://docs.convex.dev
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com

### Community

- **Convex Discord**: https://convex.dev/community
- **GitHub Issues**: Create issues in your repository
- **Stack Overflow**: Tag questions with `convex`, `react`, `vite`

### Emergency Contacts

- **Convex Support**: support@convex.dev
- **Hosting Support**: Check your platform's support page
- **Development Team**: [Your team contact]

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Convex backend deployed
- [ ] Build successful locally
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Documentation updated

### Deployment

- [ ] Frontend deployed to hosting platform
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled and working
- [ ] Environment variables set in production
- [ ] Database migrations completed (if any)
- [ ] Monitoring and logging configured

### Post-Deployment

- [ ] Application accessible at production URL
- [ ] Authentication working
- [ ] All features functional
- [ ] Mobile responsive design verified
- [ ] Charts and analytics working
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Team notified of deployment
- [ ] Documentation updated with production URLs

---

## 🎉 Conclusion

Your Finance Tracker application is now deployed and ready for production use! 

### Next Steps

1. **Monitor**: Keep an eye on performance and errors
2. **Iterate**: Gather user feedback and improve
3. **Scale**: Optimize as usage grows
4. **Maintain**: Regular updates and security patches

### Maintenance Schedule

- **Daily**: Monitor error rates and performance
- **Weekly**: Review analytics and user feedback
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Performance optimization and feature releases

---

**Deployment Owner**: Development Team  
**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

---

*For questions or issues, please contact the development team or refer to the documentation.*
