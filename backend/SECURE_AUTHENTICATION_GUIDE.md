# Secure Authentication System Implementation Guide

## 🔐 **Overview**

Complete secure authentication system with JWT tokens, session management, rate limiting, and comprehensive security measures for the prescription doctor appointment application.

---

## 🛡️ **Security Features Implemented**

### **1. JWT Token Authentication**
- **Token Generation**: Secure JWT with 1-hour expiry
- **Token Verification**: Robust validation with error handling
- **Multiple Token Sources**: Authorization header, HTTP-only cookies, session fallback
- **Token Refresh**: Automatic token renewal capability

### **2. Session Management**
- **Express Session**: Secure server-side sessions
- **Session Security**: IP and User-Agent validation
- **Session Cleanup**: Automatic session invalidation
- **Cookie Security**: HTTP-only, secure, sameSite settings

### **3. Rate Limiting**
- **Login Rate Limit**: 5 requests per minute per IP
- **API Rate Limit**: 100 requests per 15 minutes
- **Custom Handlers**: Proper error responses and headers
- **Development Bypass**: Skip rate limiting in development

### **4. Security Headers**
- **Helmet.js**: Comprehensive security headers
- **CORS**: Proper cross-origin configuration
- **CSP**: Content Security Policy implementation
- **HSTS**: HTTP Strict Transport Security

### **5. Input Validation**
- **Email Validation**: Proper email format checking
- **Password Requirements**: Minimum length and strength
- **Sanitization**: Input sanitization and validation
- **Error Codes**: Standardized error response codes

---

## 📁 **File Structure**

```
backend/
├── config/
│   └── auth.js                    # Authentication configuration
├── middleware/
│   ├── authMiddleware.js           # JWT verification middleware
│   ├── rateLimiter.js            # Rate limiting middleware
│   └── sessionMiddleware.js       # Session management middleware
├── controllers/
│   └── userController.js          # Enhanced login controller
├── routes/
│   └── userRoute.js              # Updated routes with middleware
├── server.js                     # Enhanced server with security
├── test-authentication.js         # Comprehensive test suite
└── .env.example                  # Environment variables template
```

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/prescription_full-stack_doctor

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
CURRENCY=PKR

# Cookie Configuration (Production)
COOKIE_DOMAIN=yourdomain.com
```

### **Security Configuration**
```javascript
// JWT Configuration
JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  algorithm: 'HS256'
}

// Session Configuration
SESSION_CONFIG = {
  name: 'sessionId',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: 'strict'
  }
}

// Rate Limiting
RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute for login
  message: 'Too many login attempts. Please try again later.'
}
```

---

## 🚀 **API Endpoints**

### **Authentication Endpoints**

#### **POST /api/user/login**
```javascript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (Success)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "jwt_token_here",
    "expiresIn": "1h",
    "tokenType": "Bearer"
  },
  "timestamp": "2024-03-29T15:30:00.000Z"
}

// Response (Error)
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS",
  "timestamp": "2024-03-29T15:30:00.000Z"
}
```

#### **POST /api/user/logout**
```javascript
// Request (Requires Authentication)
Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2024-03-29T15:30:00.000Z"
}
```

#### **POST /api/user/refresh-token**
```javascript
// Request (Optional Authentication)
Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token_here",
    "expiresIn": "1h"
  },
  "timestamp": "2024-03-29T15:30:00.000Z"
}
```

### **Protected Endpoints**

All endpoints below require authentication:
- `GET /api/user/get-profile`
- `POST /api/user/update-profile`
- `POST /api/user/book-appointment`
- `GET /api/user/appointments`
- `POST /api/user/payment-*`

---

## 🛡️ **Middleware Usage**

### **Authentication Middleware**
```javascript
import { authenticateToken, requireRole, optionalAuth } from '../middleware/authMiddleware.js';

// Required authentication
router.get('/protected', authenticateToken, handler);

// Role-based access
router.get('/admin', authenticateToken, requireRole(['admin']), handler);

// Optional authentication
router.get('/public', optionalAuth, handler);
```

### **Rate Limiting**
```javascript
import { loginLimiter, apiLimiter } from '../middleware/rateLimiter.js';

// Login rate limiting (5 requests per minute)
router.post('/login', loginLimiter, loginHandler);

// General API rate limiting (100 requests per 15 minutes)
router.use(apiLimiter);
```

### **Session Management**
```javascript
import { sessionMiddleware, sessionCleanup, sessionSecurity } from '../middleware/sessionMiddleware.js';

// Apply to all routes
app.use(sessionMiddleware);
app.use(sessionCleanup);
app.use(sessionSecurity);
```

---

## 🧪 **Testing**

### **Run Authentication Tests**
```bash
cd backend
node test-authentication.js
```

### **Test Coverage**
- ✅ Health check endpoint
- ✅ Login functionality
- ✅ Protected route access
- ✅ Rate limiting enforcement
- ✅ Token refresh mechanism
- ✅ Logout functionality
- ✅ Invalid token handling

### **Manual Testing**

#### **Test Login Rate Limiting**
```bash
# Make 6 login requests within 1 minute
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/user/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  sleep 0.5
done
# Should get 429 status on 6th request
```

#### **Test Protected Route**
```bash
# Without token (should fail)
curl -X GET http://localhost:4000/api/user/get-profile

# With token (should succeed)
curl -X GET http://localhost:4000/api/user/get-profile \
  -H "Authorization: Bearer your_jwt_token_here"
```

---

## 🔍 **Security Features**

### **Token Security**
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite**: CSRF protection
- **Short Expiry**: 1-hour token lifetime
- **Strong Secret**: Environment-based secret keys

### **Session Security**
- **Session Fixation**: Prevents session hijacking
- **IP Validation**: Detects IP changes
- **User-Agent Validation**: Detects browser changes
- **Automatic Cleanup**: Session invalidation

### **Rate Limiting**
- **IP-Based**: Per-IP request limits
- **Sliding Window**: Accurate rate calculation
- **Custom Headers**: Rate limit information
- **Graceful Degradation**: Proper error responses

### **Input Validation**
- **Email Format**: RFC-compliant validation
- **Password Strength**: Minimum requirements
- **SQL Injection**: Parameterized queries
- **XSS Prevention**: Input sanitization

---

## 🚨 **Error Codes**

### **Authentication Errors**
- `TOKEN_MISSING`: No token provided
- `TOKEN_INVALID`: Invalid token format
- `TOKEN_EXPIRED`: Token has expired
- `USER_NOT_FOUND`: User doesn't exist
- `ACCOUNT_DEACTIVATED`: Account is disabled

### **Validation Errors**
- `MISSING_CREDENTIALS`: Email/password missing
- `INVALID_EMAIL`: Invalid email format
- `INVALID_CREDENTIALS`: Wrong email/password

### **Authorization Errors**
- `AUTH_REQUIRED`: Authentication needed
- `INSUFFICIENT_PERMISSIONS`: Role-based access denied

### **Rate Limiting**
- `TOO_MANY_REQUESTS`: Rate limit exceeded

---

## 🔄 **Migration Guide**

### **From Old System**
1. **Update Middleware**: Replace `authUser.js` with new `authMiddleware.js`
2. **Update Routes**: Apply new middleware to protected routes
3. **Update Frontend**: Handle new response format and token storage
4. **Update Environment**: Add new environment variables

### **Frontend Integration**
```javascript
// Login request
const loginResponse = await fetch('/api/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({ email, password })
});

// Token is automatically stored in HTTP-only cookie
// Use Authorization header for API calls
const profileResponse = await fetch('/api/user/get-profile', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + token }, // Optional, cookie works too
  credentials: 'include'
});
```

---

## 📊 **Monitoring**

### **Security Logs**
```bash
# Login attempts
🔐 Login attempt received
📧 Email: user@example.com
🌐 IP: 192.168.1.100
🔍 User-Agent: Mozilla/5.0...

# Authentication events
✅ Authentication successful for: user@example.com
❌ Authentication error: Token has expired

# Rate limiting
⚠️ Rate limit exceeded for IP: 192.168.1.100

# Session events
🔐 New session initialized: sess_1234567890
🔐 Session sess_1234567890 accessed at 2024-03-29T15:30:00.000Z
```

### **Health Check**
```bash
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-29T15:30:00.000Z",
  "uptime": 3600.123,
  "environment": "development",
  "version": "1.0.0"
}
```

---

## 🎯 **Best Practices**

### **Development**
- ✅ Use environment variables for secrets
- ✅ Enable debug logging
- ✅ Test rate limiting bypass
- ✅ Use HTTPS in development

### **Production**
- ✅ Set NODE_ENV=production
- ✅ Use strong JWT secrets
- ✅ Enable HTTPS with valid certificates
- ✅ Configure proper CORS origins
- ✅ Monitor security logs
- ✅ Set up log rotation

### **Security**
- ✅ Regular security audits
- ✅ Keep dependencies updated
- ✅ Use HTTPS everywhere
- ✅ Implement proper logging
- ✅ Monitor for suspicious activity

---

## 🚀 **Deployment**

### **Environment Setup**
1. **Set Environment Variables**: Configure all required variables
2. **Database Connection**: Ensure MongoDB is accessible
3. **HTTPS Setup**: Configure SSL certificates
4. **Domain Configuration**: Update CORS origins
5. **Security Headers**: Verify security headers

### **Testing in Production**
1. **Health Check**: Verify `/health` endpoint
2. **Authentication**: Test login/logout flow
3. **Rate Limiting**: Verify protection works
4. **Security Headers**: Check security headers
5. **Session Management**: Verify cookie settings

---

## 📞 **Troubleshooting**

### **Common Issues**

#### **Token Not Working**
- Check JWT_SECRET is set
- Verify token format (Bearer token)
- Check token expiry
- Verify cookie settings

#### **Rate Limiting Issues**
- Check IP detection
- Verify time windows
- Check rate limit configuration
- Verify headers in response

#### **Session Problems**
- Check session secret
- Verify cookie configuration
- Check session store
- Verify CORS settings

#### **CORS Issues**
- Check origin configuration
- Verify credentials setting
- Check preflight requests
- Verify headers configuration

### **Debug Mode**
```javascript
// Enable debug logging
process.env.DEBUG = 'auth:*';

// Skip rate limiting in development
process.env.NODE_ENV = 'development';
```

---

## 🎉 **Summary**

This secure authentication system provides:

✅ **Complete JWT Authentication** with token refresh  
✅ **Secure Session Management** with multiple validation layers  
✅ **Advanced Rate Limiting** with IP-based protection  
✅ **Comprehensive Security Headers** with Helmet.js  
✅ **Input Validation** with proper error handling  
✅ **Role-Based Access Control** for admin functions  
✅ **Comprehensive Testing** with automated test suite  
✅ **Production Ready** with environment-based configuration  
✅ **Detailed Logging** for security monitoring  
✅ **Graceful Error Handling** with standardized responses  

The system is now production-ready with enterprise-grade security features while maintaining backward compatibility with existing functionality.
