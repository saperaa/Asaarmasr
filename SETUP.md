# Setup & Deployment Guide

> Step-by-step instructions to run and deploy Asaar Masr

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js (v18.0.0 or higher) installed
- [ ] MongoDB (v5.0 or higher) installed and running
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Web browser (Chrome/Firefox/Edge)

### Verify Installations

```bash
# Check Node.js version
node --version
# Should show v18.x.x or higher

# Check npm version
npm --version
# Should show 9.x.x or higher

# Check MongoDB
mongod --version
# Should show v5.0.x or higher

# Check Git
git --version
```

---

## 🚀 Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Asaarmasr

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Setup

```bash
# Create backend environment file
cp backend/.env.example backend/.env

# Edit the .env file with your settings
# Windows: notepad backend/.env
# Mac/Linux: nano backend/.env
```

**Required environment variables:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/asaarmasr
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see: `Server running on port 3001` and `Connected to MongoDB`

**Terminal 2 - Frontend:**
```bash
# In project root
npm run dev
```

You should see: `Local: http://localhost:5173/`

### 4. Access the Application

- **Website**: http://localhost:5173
- **API**: http://localhost:3001/api
- **AdminJS**: http://localhost:3000/admin (if running)

---

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Mac: `brew tap mongodb/brew && brew install mongodb-community`
   - Linux: `sudo apt install mongodb`

2. **Start MongoDB Service**
   ```bash
   # Windows (as Administrator)
   net start MongoDB

   # Mac
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Connection**
   ```bash
   mongosh
   # Should open MongoDB shell
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asaarmasr?retryWrites=true&w=majority
   ```

### Database Seeding

The backend automatically seeds sample data on first run:
- Admin user: `admin@asaarmasr.com` / `admin123`
- Sample products, stores, and blog posts

To re-seed:
```bash
# In backend directory
node src/seed.js
```

---

## 🔧 Development Workflow

### Frontend Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

### Backend Development

```bash
cd backend

# Start with nodemon (auto-restart on changes)
npm run dev

# Start production server
npm start

# AdminJS panel only
npm run admin
```

### Running Both (Concurrently)

```bash
# Install concurrently globally
npm install -g concurrently

# Run both servers
concurrently "npm run dev" "cd backend && npm start"
```

---

## 🌐 Deployment

### Option 1: Vercel (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure**
   - Link to your GitHub repo for auto-deployments
   - Set environment variables in Vercel dashboard
   - Configure custom domain (optional)

### Option 2: Railway/Render (Backend)

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up
```

**Render:**
1. Push code to GitHub
2. Connect GitHub repo to Render
3. Create Web Service
4. Set environment variables
5. Deploy automatically

### Option 3: Full Stack on VPS (DigitalOcean/AWS/Azure)

```bash
# 1. Provision server (Ubuntu 22.04 LTS)
# 2. SSH into server
ssh user@your-server-ip

# 3. Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb

# 4. Clone repository
git clone <your-repo>
cd Asaarmasr

# 5. Install dependencies
npm install
cd backend && npm install && cd ..

# 6. Setup PM2 for process management
sudo npm install -g pm2

# 7. Build frontend
npm run build

# 8. Start backend with PM2
pm2 start backend/src/server.js --name asaar-backend

# 9. Setup Nginx reverse proxy
sudo apt install nginx

# Edit /etc/nginx/sites-available/default:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/asaarmasr/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 10. Enable SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ⚙️ Environment Variables Reference

### Frontend (.env)
```env
# API Base URL
VITE_API_URL=http://localhost:3001/api

# Optional: Analytics
VITE_ENABLE_ANALYTICS=false
```

### Backend (.env)
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/asaarmasr
# OR for Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/asaarmasr

# Authentication
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRE=7d

# Optional: Email Service (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: External APIs
GOLD_API_URL=https://asaarmasr.info/api/v1/gold
CURRENCY_API_KEY=your-api-key
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "MongoDB connection failed"
**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string in .env
```

#### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=3002
```

#### Issue: "CORS error in browser"
**Solution:**
```javascript
// In backend/src/server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

#### Issue: "3D model not loading"
**Solution:**
```bash
# Ensure Draco files are in public/draco/
ls public/draco/

# Should show: draco_decoder.js, draco_decoder.wasm, etc.
```

#### Issue: "Build fails with TypeScript errors"
**Solution:**
```bash
# Check TypeScript
npx tsc --noEmit

# Fix errors or skip type checking in build
# In vite.config.ts:
export default defineConfig({
  build: {
    sourcemap: true,
  },
});
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Public Website
- [ ] 3D hero section loads and animates
- [ ] Gold prices update automatically
- [ ] Calculator works correctly
- [ ] All pages load without errors
- [ ] Responsive on mobile/tablet
- [ ] Arabic language switch works

#### CRM System
- [ ] Login with admin credentials
- [ ] Create new product
- [ ] Place test order
- [ ] Update order status
- [ ] View dashboard statistics

#### API Endpoints
```bash
# Test public endpoints
curl http://localhost:3001/api/public/gold-prices

# Test protected endpoints
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Monitoring & Logging

### Backend Logs
```bash
# View logs
tail -f backend/logs/app.log

# Using PM2
pm2 logs asaar-backend
```

### Health Check
```bash
# API health
curl http://localhost:3001/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:30:00Z"}
```

---

## 🔄 Updating the Application

### Update Dependencies

```bash
# Frontend
npm update

# Backend
cd backend && npm update && cd ..
```

### Pull Latest Code

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies if package.json changed
npm install
cd backend && npm install && cd ..

# Restart servers
npm run dev
cd backend && npm start
```

---

## 🎓 For Instructors

### Quick Demo Setup

1. **Start the application** (follow Quick Start above)

2. **Login Credentials** (auto-seeded):
   - Email: `admin@asaarmasr.com`
   - Password: `admin123`

3. **Key URLs to Demo**:
   - Home page: http://localhost:5173
   - CRM Login: http://localhost:5173/crm/login
   - API: http://localhost:3001/api/public/gold-prices

4. **Sample Data Available**:
   - 5 gold products
   - 3 physical stores
   - 3 blog posts
   - 1 admin user

### Project Assessment

**To evaluate this project:**

1. **Code Quality**: Check `src/` and `backend/src/` for:
   - TypeScript usage
   - Component organization
   - Clean code practices

2. **Features**: Verify functionality:
   - Real-time gold prices
   - 3D hero section
   - CRM operations
   - Responsive design

3. **Documentation**: Review:
   - README.md
   - API.md
   - This file

4. **Database**: Explore MongoDB:
   ```bash
   mongosh
   use asaarmasr
   show collections
   db.products.find()
   ```

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review error logs
3. Check environment variables
4. Verify all prerequisites are installed

---

**Quick Reference Card:**

| Task | Command |
|------|---------|
| Start Frontend | `npm run dev` |
| Start Backend | `cd backend && npm start` |
| Build | `npm run build` |
| Install All | `npm install && cd backend && npm install` |
| Reset DB | `cd backend && node src/seed.js` |

---

*Last Updated: January 2024*
