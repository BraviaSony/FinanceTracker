# System Patterns: Finance Tracker V2

## Core Architecture Patterns

### Three-Tier Architecture
```
┌─────────────────────────────────────────┐
│            PRESENTATION LAYER           │
│  React Frontend Components              │
├─────────────────────────────────────────┤
│  • User Interface Components (UI)       │
│  • State Management (Hooks)             │
│  • Routing (React Router)               │
│  • Form Handling (React Hook Form)      │
└─────────────────────────────────────────┘
                              │ HTTP/WebSocket
┌─────────────────────────────────────────┐
│           APPLICATION LAYER             │
│  Convex Serverless Functions            │
├─────────────────────────────────────────┤
│  • Business Logic (Mutations/Queries)   │
│  • Data Validation (Zod Schemas)        │
│  • Authentication (Convex Auth)         │
│  • Authorization (RBAC)                 │
│  • Real-time Updates (WebSocket)        │
└─────────────────────────────────────────┘
                              │ NoSQL Queries
┌─────────────────────────────────────────┐
│               DATA LAYER                │
│  Convex Database Document Store         │
├─────────────────────────────────────────┤
│  • Document Collections                 │
│  • Real-time Subscriptions              │
│  • Type-Safe Schemas                    │
│  • Automatic Indexing                   │
└─────────────────────────────────────────┘
```

### Serverless Architecture Pattern
- **Auto-scaling**: Functions scale automatically based on demand
- **Pay-per-use**: Cost directly tied to actual usage
- **Zero maintenance**: No server provisioning or management
- **Global distribution**: Functions run close to users worldwide

### Real-time Synchronization Pattern
- **WebSocket Connections**: Persistent connections for instant updates
- **Optimistic Updates**: UI updates immediately, validates server-side
- **Automatic Conflict Resolution**: Server state is authoritative
- **Subscription-Based**: Clients subscribe to data changes

### Command Query Responsibility Segregation (CQRS)
```
Commands (Write Operations)
├── Create/Update/Delete entities
├── Side effects and validations
└── Event publishing

Queries (Read Operations)
├── Data aggregation and summaries
├── Complex filtering and sorting
├── Chart data generation
└── Optimized for performance
```

## Domain Modeling Patterns

### Entity Patterns
```typescript
// Base Entity Interface
interface BaseEntity {
  _id: Id<T>;
  _creationTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// Financial Transaction Entity
interface FinancialTransaction extends BaseEntity {
  amount: number;
  currency: CurrencyType;
  date: Date;
  description: string;
}
```

### Value Objects
```typescript
// Currency Type (Value Object)
type CurrencyType = 'USD' | 'SAR' | 'AED';

// Money (Value Object)
interface Money {
  amount: number;
  currency: CurrencyType;
}

// Date Range (Value Object)
interface DateRange {
  start: Date;
  end: Date;
}
```

### Repository Pattern (Convex Implementation)
```typescript
// Repository Interface Pattern
interface Repository<T> {
  create(item: Omit<T, '_id' | '_creationTime'>): Promise<Id<T>>;
  getById(id: Id<T>): Promise<T | null>;
  update(id: Id<T>, updates: Partial<T>): Promise<void>;
  delete(id: Id<T>): Promise<void>;
  list(filter?: QueryFilter): Promise<T[]>;
}

// Convex Repository Implementation
export const salesRepo = {
  create: async (sale) => await ctx.db.insert('sales', sale),
  getById: async (id) => await ctx.db.get(id),
  // ... other methods
};
```

## Component Design Patterns

### Container/Presentational Pattern
```tsx
// Presentational Component (Pure Function)
function SaleCard({ sale, onEdit, onDelete, currency }) {
  return (
    <Card>
      <div>{formatMoney(sale.amount, currency)}</div>
      <Button onClick={() => onEdit(sale)}>Edit</Button>
      <Button onClick={() => onDelete(sale.id)}>Delete</Button>
    </Card>
  );
}

// Container Component (Logic & State)
function SalesContainer() {
  const { sales, currency } = useConvexSubscription();
  const [editingSale, setEditingSale] = useState(null);

  const handleEdit = (sale) => setEditingSale(sale);
  const handleDelete = (saleId) => {/* delete logic */};

  return (
    <SaleCard
      sale={editingSale}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currency={currency}
    />
  );
}
```

### Custom Hooks Pattern
```typescript
// Data Fetching Hook
export function useSales(filter?: SaleFilter) {
  return useQuery(api.sales.list, { filter });
}

// Form Management Hook
export function useSaleForm(initialValues?: Partial<Sale>) {
  const form = useForm<Sale>({ defaultValues: initialValues });
  const createMutation = useMutation(api.sales.create);
  const updateMutation = useMutation(api.sales.update);

  const onSubmit = async (data: Sale) => {
    if (data._id) {
      await updateMutation({ id: data._id, ...data });
    } else {
      await createMutation(data);
    }
  };

  return { form, onSubmit };
}

// Currency Management Hook
export function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage<CurrencyType>('selectedCurrency', 'USD');
  const rates = useQuery(api.currency.getExchangeRates);

  const convert = (amount: number, from: CurrencyType, to: CurrencyType) => {
    // Conversion logic
  };

  return { selectedCurrency, setSelectedCurrency, convert };
}
```

### Context Provider Pattern
```tsx
// Currency Context
const CurrencyContext = createContext<CurrencyContextType>({
  selectedCurrency: 'USD',
  exchangeRates: { USD_TO_SAR: 3.75, USD_TO_AED: 3.67 },
  convertAmount: () => 0,
  setSelectedCurrency: () => {},
});

export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('USD');
  const exchangeRates = useQuery(api.currency.getExchangeRates);

  const convertAmount = useCallback((amount, from, to) => {
    // Conversion logic
  }, [exchangeRates]);

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      exchangeRates,
      convertAmount,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}
```

## Error Handling Patterns

### Global Error Boundary
```tsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
```

### Convex Error Handling
```typescript
// Mutation with Error Handling
export async function handleSaleCreation(saleData: SaleInput) {
  try {
    const result = await api.sales.create(saleData);
    toast.success('Sale created successfully');
    return result;
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
    throw error;
  }
}

// API Error Types
class ConvexError extends Error {
  constructor(code: string, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
}
```

## State Management Patterns

### Local State Management
- **useState**: Component-specific state
- **useReducer**: Complex local state logic
- **useLocalStorage**: Persistent client-side storage

### Server State Management (Convex Patterns)
- **useQuery**: Fetched server state
- **useMutation**: Server state updates
- **useConvexSubscription**: Real-time data subscriptions

### Global State Patterns
```typescript
// Zustand Store Pattern (if needed)
interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  notifications: [],
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (notification) => set(state => ({
    notifications: [...state.notifications, notification]
  })),
}));
```

## Validation Patterns

### Schema Validation
```typescript
// Zod Schema Pattern
export const saleSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().positive('Cost must be positive'),
  sellingPrice: z.number().positive('Selling price must be positive'),
  expenses: z.number().min(0, 'Expenses cannot be negative'),
  currency: z.enum(['USD', 'SAR', 'AED'], {
    errorMap: () => ({ message: 'Invalid currency' })
  }),
});

export type SaleInput = z.infer<typeof saleSchema>;
```

### Form Validation Pattern
```tsx
// React Hook Form + Zod Pattern
function SaleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SaleInput>({
    resolver: zodResolver(saleSchema),
  });

  const onSubmit = async (data) => {
    await createSale(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('description')} />
      {errors.description && <span>{errors.description.message}</span>}
      <button type="submit">Create Sale</button>
    </form>
  );
}
```

## Performance Patterns

### Code Splitting Pattern
```typescript
// Route-based Code Splitting
const SalesPage = lazy(() => import('./pages/SalesPage'));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/sales" element={<SalesPage />} />
    <Route path="/expenses" element={<ExpensesPage />} />
  </Routes>
</Suspense>
```

### Memoization Patterns
```tsx
// Component Memoization
const ExpenseList = memo(function ExpenseList({ expenses, onEdit }) {
  return (
    <div>
      {expenses.map(expense => (
        <ExpenseItem key={expense._id} expense={expense} onEdit={onEdit} />
      ))}
    </div>
  );
});

// Computation Memoization
const useExpenseSummary = (expenses: Expense[]) => {
  return useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categories = groupBy(expenses, 'category');
    return { total, categories };
  }, [expenses]);
};
```

### Database Query Optimization
```typescript
// Efficient Queries Pattern
export const getExpensesList = query({
  returns: ExpenseTable,
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    category: v.optional(v.string()),
  },
}, async ({ db }, { limit = 20, offset = 0, category }) => {
  let query = db.query('expenses').order('desc');

  if (category) {
    query = query.filter(q => q.eq(q.field('category'), category));
  }

  return await query.paginate({ numItems: limit, cursor: null });
});
```

## Testing Patterns

### Unit Testing Pattern
```typescript
describe('useCurrency', () => {
  test('converts USD to SAR correctly', () => {
    const { result } = renderHook(() => useCurrency());
    expect(result.current.convert(100, 'USD', 'SAR')).toBe(375);
  });
});
```

### Integration Testing Pattern
```typescript
describe('Sales Module', () => {
  test('creates sale and updates dashboard', async () => {
    // Setup test data
    const saleData = { amount: 100, description: 'Test sale' };

    // Insert sale
    await api.sales.create(saleData);

    // Verify dashboard updates
    const dashboard = await api.dashboard.getSummary();
    expect(dashboard.totalSales).toEqual(100);
  });
});
```

## Security Patterns

### Authentication Pattern
```typescript
// Protected Route Pattern
function PrivateRoute({ children }) {
  const { isLoaded, isAuthenticated } = useAuth();

  if (!isLoaded) return <Spinner />;

  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### Authorization Pattern
```typescript
// RBAC Pattern
const rolePermissions = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['create', 'read', 'update'],
  viewer: ['read'],
};

function canUserPerform(userRole: Role, action: string) {
  return rolePermissions[userRole].includes(action);
}
```

### Input Sanitization Pattern
```typescript
// XSS Prevention
const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTRS: [],
  });
};
```

## Component Patterns

### Compound Component Pattern
```tsx
// Table Compound Component
const Table = ({ children }) => <table>{children}</table>;
Table.Header = ({ children }) => <thead>{children}</thead>;
Table.Body = ({ children }) => <tbody>{children}</tbody>;
Table.Row = ({ children }) => <tr>{children}</tr>;
Table.Cell = ({ children }) => <td>{children}</td>;

// Usage
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Cell>Name</Table.Cell>
      <Table.Cell>Amount</Table.Cell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Sale 1</Table.Cell>
      <Table.Cell>$100</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## Critical Implementation Details

### Currency Conversion Implementation
- All calculations done in base currency (USD)
- Exchange rates stored and cached
- Rounding precision maintained
- Original currency preserved in database

### Real-time Update Implementation
- WebSocket subscriptions for all queries
- Optimistic UI updates
- Conflict resolution favors server state
- Error handling for disconnected states

### Responsive Design Implementation
- Mobile-first approach
- Breakpoints: 375px, 768px, 1024px
- Touch-friendly interactions
- Optimized font sizes and spacing
