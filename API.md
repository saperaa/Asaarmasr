# API Documentation - Asaar Masr

> Complete reference for the Asaar Masr REST API

---

## Base URL

```
Development: http://localhost:3001/api
Production:  https://your-domain.com/api
```

---

## Authentication

Most endpoints require authentication via JWT token.

### Getting a Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@asaarmasr.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@asaarmasr.com",
      "role": "admin"
    }
  }
}
```

### Using the Token

Include the token in the Authorization header:

```http
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Response Format

All API responses follow a consistent structure:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": 400,
  "details": { ... }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

---

## Endpoints Reference

### 🔐 Authentication

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "admin | shipper"
    }
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Register (Admin Only)
```http
POST /auth/register
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 chars)",
  "role": "admin | shipper (default: shipper)"
}
```

---

### 📊 Public Endpoints (No Auth Required)

#### Get Gold Prices
```http
GET /public/gold-prices
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-15T10:30:00Z",
    "prices": {
      "gold24k": 2450.50,
      "gold21k": 2144.19,
      "gold18k": 1837.88,
      "goldPound": 17120.00
    },
    "changes": {
      "gold24k": 15.50,
      "gold21k": 13.60,
      "gold18k": 11.63,
      "goldPound": 108.00
    },
    "currency": "EGP"
  }
}
```

#### Get Currency Rates
```http
GET /public/currency-rates
```

**Response:**
```json
{
  "success": true,
  "data": {
    "usdToEgp": 30.85,
    "saghaRate": 30.90,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

#### List Stores
```http
GET /public/stores
```

**Query Parameters:**
- `city` (optional) - Filter by city
- `service` (optional) - Filter by service type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "nameEn": "Gold Palace",
      "nameAr": "قصر الذهب",
      "address": "123 Talaat Harb St",
      "city": "Cairo",
      "phone": "+20 123 456 7890",
      "hours": {
        "open": "09:00",
        "close": "21:00"
      },
      "services": ["buy", "sell", "exchange"],
      "location": {
        "lat": 30.0444,
        "lng": 31.2357
      }
    }
  ]
}
```

#### List Products
```http
GET /public/products
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `karat` (optional) - Filter by karat (24, 21, 18)
- `inStock` (optional) - Filter by availability
- `featured` (optional) - Filter featured products

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "nameEn": "24K Gold Bar 10g",
      "nameAr": "سبيكة ذهب 24 قيراط 10 جرام",
      "category": "bars",
      "karat": 24,
      "weight": 10,
      "price": 24505.00,
      "images": ["url1", "url2"],
      "inStock": true,
      "featured": true
    }
  ]
}
```

#### Get Single Product
```http
GET /public/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "nameEn": "string",
    "nameAr": "string",
    "descriptionEn": "string",
    "descriptionAr": "string",
    "category": "string",
    "karat": 24,
    "weight": 10,
    "price": 24505.00,
    "images": ["string"],
    "inStock": true,
    "featured": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 📦 Orders (Protected)

#### List All Orders
```http
GET /orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional) - Filter by status
- `customerId` (optional) - Filter by customer
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "orderNumber": "ORD-2024-001",
      "customer": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "items": [
        {
          "product": {
            "id": "string",
            "nameEn": "string",
            "nameAr": "string"
          },
          "quantity": 2,
          "price": 24505.00
        }
      ],
      "totalAmount": 49010.00,
      "status": "pending | processing | shipped | delivered",
      "shippingAddress": {
        "street": "string",
        "city": "string",
        "governorate": "string",
        "phone": "string"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "customer": {
    "name": "string (required)",
    "email": "string (required)",
    "phone": "string (required)"
  },
  "items": [
    {
      "productId": "string (required)",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "string (required)",
    "city": "string (required)",
    "governorate": "string (required)",
    "phone": "string (required)"
  },
  "paymentMethod": "cash | card",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "orderNumber": "ORD-2024-001",
    "status": "pending",
    "totalAmount": 49010.00,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Order created successfully"
}
```

#### Get Order Details
```http
GET /orders/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "orderNumber": "ORD-2024-001",
    "customer": { ... },
    "items": [ ... ],
    "totalAmount": 49010.00,
    "status": "pending",
    "shippingAddress": { ... },
    "paymentMethod": "cash",
    "notes": "string",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Order Status
```http
PUT /orders/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "processing | shipped | delivered | cancelled",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "processing",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Order updated successfully"
}
```

#### Delete Order
```http
DELETE /orders/:id
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

---

### 🏷️ Products (Protected)

#### List All Products
```http
GET /products
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional)
- `karat` (optional)
- `inStock` (optional)
- `featured` (optional)

#### Create Product
```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "nameEn": "string (required)",
  "nameAr": "string (required)",
  "descriptionEn": "string",
  "descriptionAr": "string",
  "category": "bars | coins | jewelry (required)",
  "karat": 24,
  "weight": 10.0,
  "price": 24505.00,
  "images": ["url1", "url2"],
  "inStock": true,
  "featured": false
}
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <admin-token>
```

**Request Body:** Same as create (all fields optional)

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <admin-token>
```

---

### 🏪 Stores (Protected)

#### List All Stores
```http
GET /stores
Authorization: Bearer <token>
```

#### Create Store
```http
POST /stores
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "nameEn": "string (required)",
  "nameAr": "string (required)",
  "address": "string (required)",
  "city": "string (required)",
  "phone": "string (required)",
  "hours": {
    "open": "09:00",
    "close": "21:00"
  },
  "services": ["buy", "sell", "exchange"],
  "location": {
    "lat": 30.0444,
    "lng": 31.2357
  },
  "isActive": true
}
```

#### Update Store
```http
PUT /stores/:id
Authorization: Bearer <admin-token>
```

#### Delete Store
```http
DELETE /stores/:id
Authorization: Bearer <admin-token>
```

---

### 👥 Users (Admin Only)

#### List All CRM Users
```http
GET /users
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "admin | shipper",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Create User
```http
POST /users
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 chars)",
  "role": "admin | shipper",
  "isActive": true
}
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <admin-token>
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <admin-token>
```

---

### 📝 Blog (Partially Protected)

#### List All Posts
```http
GET /blog
```

**Query Parameters:**
- `category` (optional)
- `published` (optional) - true/false
- `page` (optional)
- `limit` (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "titleEn": "string",
      "titleAr": "string",
      "slug": "string",
      "excerptEn": "string",
      "excerptAr": "string",
      "featuredImage": "url",
      "category": "string",
      "published": true,
      "publishedAt": "2024-01-15T10:30:00Z",
      "views": 150
    }
  ]
}
```

#### Get Single Post
```http
GET /blog/:slug
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "titleEn": "string",
    "titleAr": "string",
    "slug": "string",
    "contentEn": "string (HTML)",
    "contentAr": "string (HTML)",
    "excerptEn": "string",
    "excerptAr": "string",
    "featuredImage": "url",
    "category": "string",
    "tags": ["tag1", "tag2"],
    "author": {
      "id": "string",
      "name": "string"
    },
    "published": true,
    "publishedAt": "2024-01-15T10:30:00Z",
    "views": 150
  }
}
```

#### Create Post (Protected)
```http
POST /blog
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "titleEn": "string (required)",
  "titleAr": "string (required)",
  "contentEn": "string (HTML) (required)",
  "contentAr": "string (HTML) (required)",
  "excerptEn": "string",
  "excerptAr": "string",
  "featuredImage": "url",
  "category": "string",
  "tags": ["string"],
  "published": true
}
```

#### Update Post (Protected)
```http
PUT /blog/:id
Authorization: Bearer <admin-token>
```

#### Delete Post (Protected)
```http
DELETE /blog/:id
Authorization: Bearer <admin-token>
```

---

## Error Handling

### Common Errors

#### 400 - Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "code": 400,
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "code": 401
}
```

#### 403 - Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "code": 403
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "code": 404
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "code": 500
}
```

---

## Rate Limiting

API requests are limited to:
- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Postman Collection

A Postman collection is available at `/docs/postman-collection.json` for easy API testing.

### Import Steps:
1. Open Postman
2. Click "Import"
3. Select `postman-collection.json`
4. Set up environment variables:
   - `baseUrl`: `http://localhost:3001/api`
   - `token`: Your JWT token

---

## SDK & Client Libraries

### JavaScript/TypeScript Example

```typescript
class AsaarAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.data.token);
    return data;
  }

  // Public
  async getGoldPrices() {
    return this.request('/public/gold-prices');
  }

  async getProducts() {
    return this.request('/public/products');
  }

  // Orders (protected)
  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

// Usage
const api = new AsaarAPI('http://localhost:3001/api');

// Login
await api.login('admin@example.com', 'password');

// Get data
const prices = await api.getGoldPrices();
const orders = await api.getOrders();
```

---

**Last Updated:** January 2024  
**API Version:** 1.0.0
