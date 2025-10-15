# Technical Context: Finance Tracker V3

## Technology Stack Overview

### Frontend Technologies

#### **Core Framework**
- **React 19.0.0**: Modern React with concurrent features, hooks, and improved performance
- **TypeScript 5.7.2**: Full type safety, compile-time error checking, enhanced IDE support
- **Vite 7.1.0**: Fast build tool with instant hot module replacement and optimized production builds

#### **User Interface & Styling**
- **Tailwind CSS 4.0.14**: Utility-first CSS framework for consistent design system
- **Shadcn UI Components**: High-quality, accessible React components built on Radix UI
- **Recharts 2.12.7**: Declarative charting library for interactive data visualizations
- **React Hook Form 7.53.0**: Performant forms with easy validation integration
- **Zod 3.24.1**: TypeScript-first schema validation with excellent error messages
- **React Router DOM 7.7.1**: Declarative routing with navigation guards

#### **State Management & Data Fetching**
- **Convex React Hooks**: Real-time data queries, mutations, and subscriptions
- **Custom React Hooks**: Reusable logic for currency conversion, form handling, and business logic

#### **Development Tools**
- **Bun**: Fast JavaScript runtime and package manager (replacing npm)
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **Date-fns 4.1.0**: Modern date utility library

### Backend Technologies

#### **Serverless Database & API**
- **Convex**: Serverless platform providing:
  - NoSQL document database with real-time subscriptions
  - Type-safe APIs with automatic code generation
  - Built-in authentication and authorization
  - Global CDN distribution and automatic scaling
  - Point-in-time recovery and automatic backups

#### **Authentication & Authorization**
- **Convex Auth**: Complete authentication system with email/password
- **Role-Based Access Control**: Admin, Editor, Viewer roles
- **Row-Level Security**: Database-level permissions

### Development & Build Tools

#### **Package Manager & Scripts**
- **Bun**: Fast, JavaScript-focused package manager replacing npm/yarn
- **Scripts**: Typed scripts for development, building, and deployment

#### **Linting & Code Quality**
- **ESLint**: Configured with React, TypeScript, and accessibility rules
- **Prettier**: Consistent code formatting across the team
- **TypeScript Compiler**: Type checking and compilation

#### **Development Server**
- **Vite Development Server**: Fast hot reload, modern browser support
- **Convex Development Server**: Local Convex environment with live reload

## System Architecture

### Three-Tier Architecture Implementation

#### **Presentation Layer (React Frontend)**
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── layout.tsx      # Main layout with navigation
│   │   └── currency-selector.tsx
│   ├── pages/              # Page components (routes)
│   │   ├── index.tsx       # Dashboard (/)
│   │   ├── sales.tsx       # Sales module (/sales)
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── use-currency-conversion.tsx
│   │   └── use-mobile.tsx
│   ├── lib/                # Utility functions
│   │   ├── utils.ts        # General utilities
│   │   └── currency-utils.ts
│   └── App.tsx             # Root component
```

#### **Application Layer (Convex Backend)**
```
convex/
├── schema.ts               # Database schema definitions
├── auth.ts                 # Authentication logic
├── dashboard.ts            # Dashboard queries & aggregations
├── sales.ts                # Sales CRUD operations
├── expenses.ts             # Expense CRUD operations
├── liabilities.ts          # Liability CRUD operations
├── salaries.ts             # Salary CRUD operations
├── cashflow.ts             # Cash flow operations
├── bankPdc.ts              # Bank PDC operations
├── futureNeeds.ts          # Future needs operations
├── businessInHand.ts       # Business in hand operations
├── currency.ts             # Currency management
├── users.ts                # User management
└── _generated/            # Auto-generated types & API
```

#### **Data Layer (Convex Database)**
```
Database Collections:
├── sales                   # Sales transactions & profit calculations
├── expenses                # Business expenses by category
├── liabilities             # Debts, loans, outstanding balances
├── salaries                # Employee salaries & payment status
├── cashflow                # All cash inflows & outflows
├── bankPdc                 # Post-dated cheques
├── futureNeeds            # Future expense planning
├── businessInHand         # Expected revenue & pipeline
├── currencySettings       # Exchange rates & preferences
└── users                 # User accounts & roles
```

### Real-time Architecture

#### **WebSocket Implementation**
- Persistent WebSocket connections via Convex subscriptions
- Instant UI updates when data changes
- Optimistic updates with server validation
- Automatic conflict resolution

#### **Data Synchronization**
- Real-time queries using `useQuery` hooks
- Mutation synchronization with `useMutation`
- Subscription-based updates with `useConvexSubscription`
- Offline capability with background sync

## Key Technical Patterns

### Currency Management System

#### **Single Currency Support**
```typescript
// Single currency - PKR only
type CurrencyType = 'PKR';

// Simplified - no exchange rates needed
interface Money {
  amount: number;
  currency: CurrencyType;  // Always 'PKR'
}
```

#### **Currency Implementation**
- All calculations performed in PKR
- No conversion needed (single currency system)
- Amounts stored and displayed in PKR
- Simplified data structures and operations

### Performance Optimization

#### **Frontend Optimizations**
- **Code Splitting**: Route-based lazy loading with React.lazy
- **Bundle Optimization**: Tree shaking, minification, compression
- **Memoization**: React.memo, useMemo, useCallback
- **Virtual Scrolling**: For large datasets
- **Mobile Responsiveness**: Comprehensive mobile-first design with adaptive layouts
- **Touch Targets**: 44px minimum touch targets for accessibility compliance

#### **Backend Optimizations**
- **Query Optimization**: Indexed fields, selective querying
- **Pagination**: Server-side pagination for large datasets
- **Caching**: Convex automatic query caching
- **Real-time Subscriptions**: Efficient change detection

#### **Database Optimizations**
- **Indexing Strategy**: Date, category, status, and type indexes
- **Query Design**: Optimized for most common access patterns
- **Aggregation**: Server-side data aggregation for charts

### Security Implementation

#### **Authentication Security**
- Email/password with bcrypt hashing
- Secure session management via HTTP-only cookies
- Automatic session expiry and refresh
- Password complexity requirements

#### **Authorization Security**
- Role-based access control (RBAC)
- Database row-level security (RLS)
- API function-level permissions
- Business rule validation

#### **Data Security**
- HTTPS encryption (TLS 1.3)
- Input validation (client & server)
- XSS prevention (DOMPurify)
- CSRF protection (token-based)

### Error Handling & Reliability

#### **Error Boundary Pattern**
```typescript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }
}
```

#### **Error Recovery**
- Graceful degradation when features fail
- Automatic retry logic for network failures
- User-friendly error messages
- Loading states and fallbacks

## Development Workflow

### Local Development Environment
```bash
# Development setup
bun install                    # Install dependencies
bun run dev                   # Start development server
# Opens http://localhost:8080
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### Convex Development Workflow
```bash
# Start Convex dev environment
npx convex dev

# Deploy to Convex production
npx convex deploy
```

## Build & Deployment

### Build Process
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
  },
  server: {
    host: true,
    port: 8080,
  },
})
```

### Deployment Platforms

#### **Frontend Deployment Options**
1. **Vercel** (Recommended)
   - Automatic deployments from Git
   - Global CDN distribution
   - Built-in preview deployments

2. **Netlify**
   - Git integration
   - Form handling
   - Lambda functions

3. **Self-hosted**
   - Static hosting with services like S3 + CloudFront
   - Automated via CI/CD pipelines

#### **Backend Deployment**
- **Convex Cloud** (Auto-managed)
  - Global serverless functions
  - Multi-region database replication
  - Built-in monitoring and backups

### Environment Management
```env
# .env.local (local development)
VITE_CONVEX_URL=https://young-smoke-123.convex.cloud

# Production environment variables
NODE_ENV=production
VITE_CONVEX_URL=https://magnificent-sloth-456.convex.cloud
```

## Testing Strategy

### Testing Types

#### **Unit Tests**
```typescript
// Jest + Testing Library for React components
describe('CurrencyConverter', () => {
  test('converts USD to SAR correctly', () => {
    render(<CurrencyConverter amount={100} from="USD" to="SAR" />);
    expect(screen.getByText('375.00')).toBeInTheDocument();
  });
});
```

#### **Integration Tests**
- Test interactions between components
- API call testing with Convex functions
- End-to-end form submissions

#### **E2E Tests**
```typescript
// Playwright or Cypress for full user journeys
test('complete sales workflow', async ({ page }) => {
  await page.goto('/sales');
  await page.fill('[data-testid="description"]', 'Test Sale');
  await page.fill('[data-testid="amount"]', '1000');
  await page.click('[data-testid="submit"]');
  await expect(page.getByText('Sale created')).toBeVisible();
});
```

### Test Coverage Goals
- **Minimum 80% code coverage**
- **All critical paths tested**
- **All calculation functions tested**
- **Error handling tested**

## Monitoring & Observability

### Performance Monitoring
- **Lighthouse CI**: Automated performance testing
- **Web Vitals**: Core web metrics tracking
- **Bundle Analyzer**: Bundle size monitoring

### Error Tracking
- **Convex Dashboard**: Backend errors and performance
- **Browser Console**: Client-side error logging
- **Environment-specific error handling**

### Business Metrics
- **User engagement**: Page views, feature usage
- **Performance metrics**: Load times, API response times
- **Error rates**: Application stability indicators

## Development Tools & Utilities

### Code Generation
- **Convex DevTools**: Auto-generated TypeScript types
- **React DevTools**: Component inspection and profiling
- **TypeScript Language Service**: Enhanced IntelliSense

### Debugging Tools
- **React Developer Tools**: Component tree inspection
- **Convex Dashboard**: Database queries and subscriptions
- **Browser DevTools**: Network, console, performance

### Code Quality Tools
- **ESLint**: Code style enforcement
- **Prettier**: Automatic formatting
- **TypeScript**: Compile-time type checking
- **Git Hooks**: Pre-commit quality checks

## Future Technical Roadmap

### Version 1.1.0 Enhancements
- **Advanced Analytics**: Server-side data aggregation
- **Export Functionality**: Excel/PDF generation
- **Advanced Filtering**: Complex query building
- **Bulk Operations**: Mass updates and deletions

### Version 2.0.0 Architecture
- **PWA Support**: Offline functionality
- **Mobile App**: React Native implementation
- **Microservices**: Optional component decoupling
- **AI Features**: ML-powered insights and categorization

### Technical Debt & Improvements
- **Component Library**: Standardized design system
- **Test Infrastructure**: Complete CI/CD test integration
- **Performance Profiling**: Advanced optimization tools
- **Documentation**: Comprehensive API documentation
