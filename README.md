# 💰 Finance Tracker V2

> A comprehensive financial management system for small businesses with multi-currency support, real-time analytics, and intuitive dashboards.

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)]()
[![React](https://img.shields.io/badge/React-19.0.0-61dafb)]()
[![Convex](https://img.shields.io/badge/Convex-1.25.0-orange)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Finance Tracker is a modern, full-stack financial management application designed for small businesses (2-10 employees) to track, analyze, and manage their financial operations in real-time. Built with React, TypeScript, and Convex, it provides a seamless experience across all devices.

### Key Highlights

- ✅ **9 Integrated Financial Modules** - Complete business oversight
- ✅ **Multi-Currency Support** - USD, SAR, AED with real-time conversion
- ✅ **Real-Time Analytics** - Interactive charts and dashboards
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Serverless Architecture** - Scalable and reliable
- ✅ **Production Ready** - Fully tested and documented

---

## ✨ Features

### 📊 Dashboard & Analytics
- Real-time financial overview with key metrics
- Interactive charts (Line, Bar, Pie)
- Cash flow trends and expense breakdowns
- Recent activity feed
- Currency conversion on-the-fly

### 💵 Sales Management
- Track revenue with automatic profit calculations
- Gross and net profit margins
- Multi-currency sales recording
- Sales trend visualization

### 💳 Expense Management
- Categorize expenses by type
- Track paid/unpaid status
- Vendor management
- Expense analytics by category

### 🏦 Liability Management
- Track debts, loans, and payables
- Due date monitoring
- Outstanding balance tracking
- Liability type categorization

### 👥 Salary Management
- Employee salary tracking
- Payment status monitoring
- Monthly salary organization
- Paid vs. pending breakdown

### 💰 Cash Flow Tracking
- Monitor all inflows and outflows
- Category-wise breakdown
- Net cash flow calculation
- Monthly trend analysis

### 📝 Bank PDC Management
- Post-dated cheque tracking
- Pending/cleared status
- Bank-wise organization
- Supplier management

### 📅 Future Needs Planning
- Budget planning by month
- Recurring vs. one-time expenses
- Quantity and amount tracking
- Future expense forecasting

### 💼 Business in Hand
- Revenue pipeline tracking
- PO and invoice management
- Expected revenue monitoring
- Status tracking (confirmed/pending/received)

### 🌍 Multi-Currency Support
- Support for USD, SAR, AED
- Real-time currency conversion
- Configurable exchange rates
- Original currency preservation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.0.0
- **Language**: TypeScript 5.7.2
- **Build Tool**: Vite 7.1.0
- **Styling**: Tailwind CSS 4.0.14
- **UI Components**: Shadcn UI (Radix UI)
- **Charts**: Recharts 2.12.7
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM 7.7.1

### Backend
- **Database**: Convex (Serverless)
- **Authentication**: Convex Auth
- **Real-time**: Convex Subscriptions
- **API**: Convex Queries & Mutations

### Development Tools
- **Package Manager**: Bun
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- Bun (recommended) or npm
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up Convex**
   ```bash
   # Login to Convex
   npx convex login
   
   # Initialize Convex project
   npx convex dev
   ```
   
   This will create a `.env.local` file with your `VITE_CONVEX_URL`.

4. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

### First Time Setup

1. **Create an account**: Sign up with email and password
2. **Explore the dashboard**: View the financial overview
3. **Add sample data**: Click "Add Sample Data" button (development only)
4. **Navigate modules**: Use the sidebar to explore different features

---

## 📁 Project Structure

```
finance-tracker/
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── layout.tsx   # Main layout with navigation
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── index.tsx    # Dashboard
│   │   │   ├── sales.tsx    # Sales module
│   │   │   ├── expenses.tsx # Expenses module
│   │   │   └── ...
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── App.tsx          # Root component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   └── index.html           # HTML template
│
├── convex/                   # Backend (Convex)
│   ├── _generated/          # Auto-generated types
│   ├── lib/                 # Shared utilities
│   │   ├── internal_schema.ts  # Auth schema
│   │   └── roles.ts         # RBAC utilities
│   ├── auth.ts              # Authentication logic
│   ├── schema.ts            # Database schema
│   ├── dashboard.ts         # Dashboard queries
│   ├── sales.ts             # Sales CRUD operations
│   ├── expenses.ts          # Expenses CRUD operations
│   ├── liabilities.ts       # Liabilities CRUD operations
│   ├── salaries.ts          # Salaries CRUD operations
│   ├── cashflow.ts          # Cash flow CRUD operations
│   ├── bankPdc.ts           # Bank PDC CRUD operations
│   ├── futureNeeds.ts       # Future needs CRUD operations
│   ├── businessInHand.ts    # Business in hand CRUD operations
│   ├── currency.ts          # Currency management
│   ├── users.ts             # User management
│   └── seedData.ts          # Sample data seeding
│
├── server/                   # Express server (optional)
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   └── vite.ts              # Vite middleware
│
├── docs/                     # Documentation
│   ├── PRD.md               # Product Requirements Document
│   ├── ERD.md               # Entity Relationship Diagram
│   └── DeploymentGuide.md   # Deployment instructions
│
├── .env.local               # Environment variables (not in git)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
└── README.md                # This file
```

---

## 📚 Documentation

Comprehensive documentation is available in the following files:

### 📚 [Documentation Index (DOCUMENTATION_INDEX.md)](./DOCUMENTATION_INDEX.md) - **START HERE!**
- Complete documentation navigation guide
- Quick reference by role and topic
- Documentation map for all users

### 📄 [Product Requirements Document (PRD.md)](./PRD.md)
- Product vision and goals
- User personas and stories
- Detailed feature specifications
- Technical requirements
- Success criteria

### 📊 [Entity Relationship Diagram (ERD.md)](./ERD.md)
- Database schema overview
- Entity specifications
- Relationships and data flow
- Indexes and query optimization
- Data security and validation

### 🏗️ [Architecture Document (ARCHITECTURE.md)](./ARCHITECTURE.md)
- High-level system architecture
- Component hierarchy
- Data flow patterns
- Security architecture
- Performance optimization

### 🏗️ [System Design Document (SYSTEM-DESIGN.md)](./SYSTEM-DESIGN.md)
- Comprehensive system design
- Requirements analysis
- Component design
- API design
- Scalability strategies
- Disaster recovery

### 🚀 [Deployment Guide (DeploymentGuide.md)](./DeploymentGuide.md)
- Deployment options (Vercel, Netlify, AWS, Cloudflare, Self-hosted)
- Environment setup
- CI/CD pipeline configuration
- Security best practices
- Troubleshooting guide

### 🚀 [Render Deployment Guide (RENDER-DEPLOY.md)](./RENDER-DEPLOY.md) - **For Beginners!**
- Step-by-step deployment to Render
- Beginner-friendly instructions
- Account creation guides
- Troubleshooting common issues
- Maintenance and updates

### 🖥️ [Hostinger VPS Deployment Guide (HOSTINGER-DEPLOY.md)](./HOSTINGER-DEPLOY.md) - **For VPS Users!**
- Complete VPS setup from scratch
- Server configuration and software installation
- Nginx web server setup
- Domain and SSL certificate configuration
- Security best practices
- Performance optimization
- Emergency procedures

### 🧪 [Testing Report (TESTING_REPORT.md)](./TESTING_REPORT.md)
- Comprehensive testing results
- Sample data overview
- Test cases and coverage
- Manual testing checklist

---

## 📸 Screenshots

### Dashboard
![Dashboard Overview](docs/screenshots/dashboard.png)
*Real-time financial overview with interactive charts*

### Sales Management
![Sales Module](docs/screenshots/sales.png)
*Track sales with automatic profit calculations*

### Expense Tracking
![Expenses Module](docs/screenshots/expenses.png)
*Categorize and monitor expenses*

### Cash Flow Analysis
![Cash Flow](docs/screenshots/cashflow.png)
*Monitor inflows and outflows*

---

## 💻 Development

### Available Scripts

```bash
# Start development server (frontend + Convex)
bun run dev

# Start only frontend server
bun run dev:server

# Start only Convex backend
bun run dev:convex

# Build for production
bun run build

# Type checking
bun run typecheck

# Linting
bun run lint

# Format code
bun run format

# Format check
bun run format:check
```

### Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript best practices
   - Use existing UI components from Shadcn
   - Add proper type definitions
   - Write clean, documented code

3. **Test your changes**
   ```bash
   bun run typecheck
   bun run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any` types
- **React**: Use functional components with hooks
- **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)
- **Comments**: Add JSDoc comments for complex functions
- **Formatting**: Use Prettier (runs automatically)

### Adding a New Module

1. **Create database schema** in `convex/schema.ts`
2. **Create CRUD operations** in `convex/yourModule.ts`
3. **Create page component** in `client/src/pages/your-module.tsx`
4. **Add route** in `client/src/App.tsx`
5. **Add navigation** in `client/src/components/layout.tsx`
6. **Update dashboard** to include new data

---

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Deploy Convex backend**
   ```bash
   npx convex deploy
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard
   - `VITE_CONVEX_URL`: Your Convex deployment URL

For detailed deployment instructions, see [DeploymentGuide.md](./DeploymentGuide.md).

### Deployment Platforms

- ✅ **Vercel** (Recommended)
- ✅ **Netlify**
- ✅ **AWS Amplify**
- ✅ **Cloudflare Pages**
- ✅ **Self-hosted**

---

## 🧪 Testing

### Manual Testing

1. Navigate to `/test` route (development only)
2. Click "Run All Tests"
3. Verify all modules are working
4. Check data integrity

### Test Coverage

- ✅ CRUD operations for all modules
- ✅ Form validation
- ✅ Currency conversion
- ✅ Dashboard calculations
- ✅ Real-time synchronization
- ✅ Responsive design
- ✅ Authentication flow

---

## 🔐 Security

### Authentication
- Email/password authentication via Convex Auth
- Secure password hashing
- Session management

### Authorization
- Role-based access control (Admin/Editor/Viewer)
- Row-level security for sensitive operations
- Protected API endpoints

### Data Protection
- HTTPS encryption
- Input validation (client and server)
- XSS protection
- CSRF protection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shaharyar Khalid**

- Created: January 2025
- Status: Production Ready

---

## 🙏 Acknowledgments

- [Convex](https://convex.dev) - Serverless backend platform
- [Shadcn UI](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Recharts](https://recharts.org) - Composable charting library
- [React](https://react.dev) - UI library

---

## 📞 Support

For questions, issues, or feature requests:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

## 🗺️ Roadmap

### Version 1.1.0 (Planned)
- [ ] Export to Excel/PDF
- [ ] Email notifications
- [ ] Recurring transaction templates
- [ ] Advanced filtering
- [ ] Custom date ranges
- [ ] Bulk operations

### Version 1.2.0 (Planned)
- [ ] Mobile app (iOS/Android)
- [ ] Advanced reporting
- [ ] Budget vs. Actual comparison
- [ ] Forecasting
- [ ] Accounting software integration
- [ ] API for third-party integrations

### Version 2.0.0 (Future)
- [ ] AI-powered insights
- [ ] Automated expense categorization
- [ ] Invoice generation
- [ ] Payment gateway integration
- [ ] Advanced permissions
- [ ] Audit trail

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 50+
- **Database Tables**: 9
- **API Endpoints**: 50+
- **Test Coverage**: Comprehensive manual testing
- **Documentation**: 4 comprehensive guides

---

## 🎉 Getting Help

### Quick Links

- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Deployment Guide](./DeploymentGuide.md)
- [Testing Report](./TESTING_REPORT.md)

### Common Issues

**Q: Convex connection error?**  
A: Ensure `VITE_CONVEX_URL` is set correctly in `.env.local`

**Q: Build fails?**  
A: Run `bun install` and `bun run typecheck` to identify issues

**Q: Charts not rendering?**  
A: Check browser console for errors and verify data is loading

For more troubleshooting, see [DeploymentGuide.md](./DeploymentGuide.md#-troubleshooting).

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Shaharyar Khalid

</div>
