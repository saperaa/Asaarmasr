# Technical Specification Document

> Detailed technical specifications for Asaar Masr

---

## 1. System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.15, Ubuntu 20.04+
- **Node.js**: v18.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended for Development
- **OS**: macOS 13+, Ubuntu 22.04 LTS, Windows 11
- **RAM**: 16GB
- **Storage**: 10GB free space (SSD recommended)
- **Display**: 1920x1080 or higher

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Browser   │  │   Mobile    │  │      Tablet             │  │
│  │  (Chrome)   │  │   (iOS)     │  │      (iPad)             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                               │
│                    (Vercel Edge)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐
│        FRONTEND             │  │         BACKEND             │
│      (React + Vite)         │  │    (Node.js + Express)      │
│  ┌───────────────────────┐  │  │  ┌───────────────────────┐  │
│  │   Static Files        │  │  │  │   REST API Server     │  │
│  │   (HTML/CSS/JS)       │  │  │  │   (Port 3001)         │  │
│  └───────────────────────┘  │  │  └───────────────────────┘  │
│  ┌───────────────────────┐  │  │  ┌───────────────────────┐  │
│  │   3D Assets           │  │  │  │   AdminJS Panel       │  │
│  │   (GLB + Draco)       │  │  │  │   (Port 3000)         │  │
│  └───────────────────────┘  │  │  └───────────────────────┘  │
└─────────────────────────────┘  └─────────────────────────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────┐
                              │        DATABASE             │
                              │     (MongoDB v5.0+)         │
                              │  ┌───────────────────────┐  │
                              │  │   Collections:        │  │
                              │  │   - Users             │  │
                              │  │   - Products          │  │
                              │  │   - Orders            │  │
                              │  │   - Stores            │  │
                              │  │   - BlogPosts         │  │
                              │  └───────────────────────┘  │
                              └─────────────────────────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────┐
                              │     EXTERNAL SERVICES       │
                              │  ┌───────────────────────┐  │
                              │  │   Gold Price API      │  │
                              │  │   (asaarmasr.info)    │  │
                              │  └───────────────────────┘  │
                              └─────────────────────────────┘
```

### 2.2 Component Architecture

#### Frontend Components Hierarchy
```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── Language Switcher
│   └── Footer
├── Pages
│   ├── HomePage
│   │   ├── CinematicHero3D
│   │   ├── PriceDashboard
│   │   ├── PriceChart
│   │   ├── GoldCalculator
│   │   └── BlogPreview
│   ├── BuyGoldPage
│   ├── BlogListPage
│   ├── BlogArticlePage
│   └── CRM Pages
│       ├── CrmLoginPage
│       └── CrmDashboardPage
└── Context Providers
    ├── AuthContext
    ├── LanguageContext
    └── CrmContext
```

---

## 3. Data Models

### 3.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    CrmUser      │       │    Customer     │       │     Order       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ _id: ObjectId   │       │ _id: ObjectId   │◄──────│ customer: Ref   │
│ name: String    │       │ name: String    │       │ orderNumber: Str│
│ email: String   │       │ email: String   │       │ items: Array    │
│ password: String│       │ phone: String   │       │ totalAmount: Num│
│ role: Enum      │       │ address: Object │       │ status: Enum    │
│ isActive: Bool  │       │ createdAt: Date │       │ shipping: Object│
│ createdAt: Date │       └─────────────────┘       │ payment: String │
└─────────────────┘                                 │ createdAt: Date │
                                                    └─────────────────┘
                                                             │
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │     Product     │
                                                    ├─────────────────┤
                                                    │ _id: ObjectId   │
                                                    │ nameEn: String  │
                                                    │ nameAr: String  │
                                                    │ description: Str│
                                                    │ category: Enum  │
                                                    │ karat: Number   │
                                                    │ weight: Number  │
                                                    │ price: Number   │
                                                    │ images: Array   │
                                                    │ inStock: Bool   │
                                                    └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│     Store       │       │    BlogPost     │
├─────────────────┤       ├─────────────────┤
│ _id: ObjectId   │       │ _id: ObjectId   │
│ nameEn: String  │       │ titleEn: String │
│ nameAr: String  │       │ titleAr: String │
│ address: String │       │ slug: String    │
│ city: String    │       │ contentEn: Str  │
│ phone: String   │       │ contentAr: Str  │
│ hours: Object   │       │ excerpt: String │
│ services: Array │       │ image: String   │
│ location: Object│       │ category: Str   │
│ isActive: Bool  │       │ tags: Array     │
└─────────────────┘       │ published: Bool │
                          │ views: Number   │
                          └─────────────────┘
```

### 3.2 Model Specifications

#### CrmUser Schema
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't return by default
  },
  role: {
    type: String,
    enum: ['admin', 'shipper'],
    default: 'shipper'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### Product Schema
```javascript
{
  _id: ObjectId,
  nameEn: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  nameAr: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descriptionEn: {
    type: String,
    maxlength: 2000
  },
  descriptionAr: {
    type: String,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['bars', 'coins', 'jewelry'],
    required: true
  },
  karat: {
    type: Number,
    enum: [24, 21, 18],
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    validate: /^https?:\/\/.+/
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### Order Schema
```javascript
{
  _id: ObjectId,
  orderNumber: {
    type: String,
    unique: true,
    required: true
    // Format: ORD-YYYY-XXXX
  },
  customer: {
    type: ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [{
    product: {
      type: ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: { // Price at time of order
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    governorate: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'cash'
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 4. API Specifications

### 4.1 Authentication Flow

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                          │
     │  POST /auth/login                        │
     │  {email, password}                       │
     │ ────────────────────────────────────────>│
     │                                          │
     │                                          │  Validate
     │                                          │  credentials
     │                                          │
     │  {token, user}                           │
     │ <────────────────────────────────────────│
     │                                          │
     │  Store token                             │
     │  (localStorage/httpOnly cookie)          │
     │                                          │
     │  Subsequent requests                     │
     │  Authorization: Bearer <token>           │
     │ ────────────────────────────────────────>│
     │                                          │
     │                                          │  Verify JWT
     │                                          │  Check role
     │                                          │
     │  Protected data                          │
     │ <────────────────────────────────────────│
```

### 4.2 JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user_id_here",
  "name": "Admin User",
  "email": "admin@asaarmasr.com",
  "role": "admin",
  "iat": 1640995200,
  "exp": 1643587200
}
```

**Security Measures:**
- Tokens expire after 7 days
- Refresh token mechanism (planned)
- HTTPOnly cookies for XSS protection
- CORS restricted to specific origins
- Rate limiting on auth endpoints

---

## 5. Frontend Specifications

### 5.1 React Component Structure

#### Component Categories

1. **UI Components** (`/components/ui/`)
   - Atomic components from shadcn/ui
   - 47+ reusable components
   - Radix UI primitives

2. **Feature Components** (`/components/`)
   - Domain-specific components
   - Business logic integration
   - Custom styling

3. **Page Components** (`/pages/`)
   - Route-level components
   - Layout composition
   - Data fetching

### 5.2 State Management

```
┌─────────────────────────────────────────────────────────┐
│                   STATE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐ │
│  │  AuthContext    │  │ LanguageContext │  │CrmContext│ │
│  │  ├ user state   │  │  ├ currentLang  │  │ ├ data  │ │
│  │  ├ login()      │  │  ├ setLanguage  │  │ ├ fetch │ │
│  │  ├ logout()     │  │  ├ direction    │  │ ├ cache │ │
│  │  └ isLoading    │  │  └ translations │  │ └ update│ │
│  └────────┬────────┘  └────────┬────────┘  └────┬────┘ │
│           │                    │                │       │
│           └────────────────────┴────────────────┘       │
│                              │                          │
│                              ▼                          │
│                    ┌─────────────────┐                  │
│                    │   App Component │                  │
│                    │   (Provider)    │                  │
│                    └────────┬────────┘                  │
│                             │                           │
│              ┌──────────────┼──────────────┐            │
│              ▼              ▼              ▼            │
│       ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│       │  Pages   │  │  Hooks   │  │Components│        │
│       └──────────┘  └──────────┘  └──────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Custom Hooks

#### useGoldApi Hook
```typescript
interface UseGoldApiReturn {
  prices: GoldPrices | null;
  changes: PriceChanges | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

function useGoldApi(): UseGoldApiReturn {
  // Polling every 12 seconds
  // Caching with localStorage
  // Error handling and retry
  // Baseline calculation for changes
}
```

#### useLanguage Hook
```typescript
interface UseLanguageReturn {
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
}

function useLanguage(): UseLanguageReturn {
  // Language switching
  // RTL/LTR direction management
  // Translation lookup
}
```

---

## 6. Styling Specifications

### 6.1 Design System

#### Color Palette
```css
:root {
  /* Primary Gold */
  --gold-primary: #D4AF37;
  --gold-light: #FFD700;
  --gold-dark: #B8860B;
  --gold-pale: #F4E4BC;
  
  /* Dark Theme */
  --dark-primary: #1a1a1a;
  --dark-secondary: #2d2d2d;
  --dark-tertiary: #404040;
  
  /* Accents */
  --accent-red: #C0392B;
  --accent-blue: #2980B9;
  --accent-green: #27AE60;
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.5);
}
```

#### Typography Scale
```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-arabic: 'Cairo', sans-serif;
  
  /* Headings */
  --text-h1: 3rem;      /* 48px */
  --text-h2: 2.25rem;   /* 36px */
  --text-h3: 1.875rem;  /* 30px */
  --text-h4: 1.5rem;    /* 24px */
  
  /* Body */
  --text-lg: 1.125rem;  /* 18px */
  --text-base: 1rem;    /* 16px */
  --text-sm: 0.875rem;  /* 14px */
  --text-xs: 0.75rem;   /* 12px */
}
```

#### Spacing Scale
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### 6.2 Breakpoints

```javascript
// tailwind.config.ts
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Laptop
  'xl': '1280px',  // Desktop
  '2xl': '1536px', // Large screens
}
```

---

## 7. Performance Specifications

### 7.1 Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Largest Contentful Paint | < 2.5s | ~2.0s |
| Time to Interactive | < 3.5s | ~2.8s |
| Cumulative Layout Shift | < 0.1 | ~0.05 |
| Bundle Size (gzipped) | < 500KB | ~450KB |

### 7.2 Optimization Strategies

#### Code Splitting
```typescript
// Route-based code splitting
const BuyGoldPage = lazy(() => import('./pages/BuyGoldPage'));
const CrmDashboardPage = lazy(() => import('./pages/crm/CrmDashboardPage'));

// Component-based splitting
const CinematicHero3D = lazy(() => import('./components/cinematic-hero-3d'));
```

#### 3D Optimization
- Draco compression reduces GLB by ~70%
- Lazy loading for 3D components
- Progressive enhancement (fallback image)
- GPU-accelerated rendering

#### Image Optimization
- Responsive images with srcset
- WebP format with fallbacks
- Lazy loading below the fold
- Image CDN (Cloudinary/Cloudflare)

---

## 8. Security Specifications

### 8.1 Authentication & Authorization

```
┌─────────────────────────────────────────────────────────┐
│              AUTHENTICATION FLOW                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. User submits credentials                            │
│     POST /auth/login                                    │
│                                                          │
│  2. Server validates                                    │
│     - Check email exists                                │
│     - Compare bcrypt password                           │
│     - Verify account is active                          │
│                                                          │
│  3. Generate JWT                                        │
│     - Payload: {userId, role, exp}                      │
│     - Sign with HS256 + secret                          │
│     - Expire: 7 days                                    │
│                                                          │
│  4. Client stores token                                 │
│     - Prefer: HTTPOnly cookie                           │
│     - Alternative: localStorage                         │
│                                                          │
│  5. Subsequent requests                                 │
│     - Header: Authorization: Bearer <token>             │
│     - Middleware verifies JWT                           │
│     - Check role permissions                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Security Measures

| Layer | Measure | Implementation |
|-------|---------|----------------|
| Transport | HTTPS | TLS 1.3 |
| Authentication | JWT | HS256, 7-day expiry |
| Passwords | bcrypt | 10 salt rounds |
| Input | Validation | express-validator |
| Headers | Security | helmet.js |
| CORS | Restriction | whitelist origins |
| Rate Limit | Protection | express-rate-limit |
| XSS | Prevention | Input sanitization |
| NoSQL | Injection | Mongoose strict mode |

---

## 9. Deployment Specifications

### 9.1 Production Checklist

```markdown
## Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Tests passing
- [ ] Security headers configured
- [ ] SSL certificate obtained
- [ ] CDN configured for assets

## Deployment
- [ ] Build optimized bundle
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Monitor error logs

## Post-deployment
- [ ] Verify all features working
- [ ] Check performance metrics
- [ ] Monitor for 24 hours
- [ ] Create rollback plan
```

### 9.2 Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE CDN                             │
│         (DDoS Protection + Caching + SSL)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   LOAD BALANCER                              │
│                    (Vercel Edge)                             │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   FRONTEND (Vercel)     │     │   BACKEND (Railway/Render)  │
│  ┌─────────────────┐    │     │  ┌───────────────────────┐  │
│  │  Static Assets  │    │     │  │  Node.js Cluster      │  │
│  │  React Build    │    │     │  │  PM2 Process Manager  │  │
│  └─────────────────┘    │     │  └───────────────────────┘  │
└─────────────────────────┘     └──────────────┬──────────────┘
                                               │
                                               ▼
                              ┌────────────────────────────────┐
                              │     MONGODB ATLAS              │
                              │  (Replica Set + Backup)        │
                              └────────────────────────────────┘
```

---

## 10. Testing Specifications

### 10.1 Testing Pyramid

```
                    /\
                   /  \
                  / E2E \           <- Cypress/Playwright
                 /  10%  \
                /──────────\
               /            \
              / Integration  \      <- React Testing Library
             /     20%       \
            /──────────────────\
           /                    \
          /      Unit Tests      \   <- Jest/Vitest
         /         70%           \
        /──────────────────────────\
```

### 10.2 Test Categories

| Category | Tools | Coverage |
|----------|-------|----------|
| Unit Tests | Jest/Vitest | Components, hooks, utils |
| Integration | React Testing Library | Component interactions |
| E2E Tests | Cypress | User workflows |
| API Tests | Postman | REST endpoints |
| Load Tests | k6/Artillery | Performance under load |

---

## 11. Maintenance & Monitoring

### 11.1 Health Checks

```javascript
// /api/health endpoint
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "checks": {
    "database": "connected",
    "api": "responsive",
    "external": {
      "goldApi": "reachable",
      "latency": "120ms"
    }
  }
}
```

### 11.2 Logging Levels

```javascript
// Structured logging
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "error",
  "message": "Database connection failed",
  "service": "asaar-api",
  "traceId": "abc-123",
  "userId": "user-456",
  "metadata": {
    "error": "Connection timeout",
    "retryCount": 3
  }
}
```

---

## 12. Documentation Standards

### 12.1 Code Documentation

```typescript
/**
 * Calculates gold value based on weight and karat
 * @param weight - Weight in grams
 * @param karat - Gold purity (24, 21, or 18)
 * @param pricePerGram - Current price per gram for 24K gold
 * @returns Calculated value in EGP
 * @throws Error if karat is invalid
 * 
 * @example
 * ```typescript
 * const value = calculateGoldValue(10, 21, 2450);
 * console.log(value); // 21441.67
 * ```
 */
function calculateGoldValue(
  weight: number,
  karat: 24 | 21 | 18,
  pricePerGram: number
): number {
  // Implementation
}
```

### 12.2 API Documentation

See `API.md` for complete API documentation.

---

**Document Version:** 1.0.0  
**Last Updated:** January 2024  
**Author:** Development Team
