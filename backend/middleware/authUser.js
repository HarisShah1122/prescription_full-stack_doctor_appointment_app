import jwt from 'jsonwebtoken';

// Enhanced user authentication middleware with improved cookie handling
const authUser = async (req, res, next) => {
    try {
        console.log('🔐 Authenticating user...');
        console.log('🌐 Request URL:', req.url);
        console.log('🌐 Request Method:', req.method);
        console.log('🌐 Request Origin:', req.headers.origin);
        
        // Enhanced cookie debugging
        console.log('🍪 Raw Cookie Header:', req.headers.cookie);
        console.log('🍪 Parsed Cookies:', req.cookies);
        
        // Check if cookie-parser is working
        if (!req.cookies) {
            console.log('❌ req.cookies is undefined - cookie-parser not working!');
            console.log('🔍 Attempting to parse cookies manually...');
            
            // Manual cookie parsing as fallback
            const rawCookies = req.headers.cookie;
            if (rawCookies) {
                const cookies = {};
                rawCookies.split(';').forEach(cookie => {
                    const [name, value] = cookie.trim().split('=');
                    if (name && value) {
                        cookies[name] = value;
                    }
                });
                req.cookies = cookies;
                console.log('✅ Manually parsed cookies:', req.cookies);
            }
        }
        
        // Read token from multiple sources with enhanced logic
        let token = null;
        let tokenSource = '';
        
        // 1. Try HTTP-only cookie (primary method)
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            tokenSource = 'HTTP-only cookie';
            console.log('🔑 Token found in HTTP-only cookie:', token.substring(0, 20) + '...');
        } else {
            console.log('❌ No token found in HTTP-only cookies');
        }
        
        // 2. Try Authorization header (fallback)
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
                tokenSource = 'Authorization header';
                console.log('🔑 Token found in Authorization header:', token.substring(0, 20) + '...');
            } else {
                console.log('❌ Authorization header exists but not Bearer format:', authHeader.substring(0, 30));
            }
        } else if (!token) {
            console.log('❌ No Authorization header found');
        }
        
        // 3. Try session (final fallback)
        if (!token && req.session && req.session.token) {
            token = req.session.token;
            tokenSource = 'session';
            console.log('🔑 Token found in session:', token.substring(0, 20) + '...');
        } else if (!token) {
            console.log('❌ No token found in session');
        }
        
        console.log('🔑 Final token source:', tokenSource);
        console.log('🔑 Token exists:', !!token);
        
        if (!token) {
            console.log('❌ TOKEN_MISSING - No token found in any source');
            console.log('🔍 Enhanced debugging info:');
            console.log('  - req.cookies exists:', !!req.cookies);
            console.log('  - req.cookies.token:', req.cookies?.token ? 'present' : 'missing');
            console.log('  - req.headers.authorization:', req.headers.authorization ? 'present' : 'missing');
            console.log('  - req.session.token:', req.session?.token ? 'present' : 'missing');
            console.log('  - Raw cookie header:', req.headers.cookie);
            console.log('  - All request headers:', Object.keys(req.headers));
            
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required. Please login.',
                code: 'TOKEN_MISSING',
                debug: {
                    cookiesExist: !!req.cookies,
                    cookieTokenExists: !!req.cookies?.token,
                    authHeaderExists: !!req.headers.authorization,
                    sessionTokenExists: !!req.session?.token,
                    rawCookieHeader: req.headers.cookie,
                    requestUrl: req.url,
                    requestMethod: req.method,
                    requestOrigin: req.headers.origin,
                    allHeaders: Object.keys(req.headers)
                }
            });
        }
        
        // Verify JWT token with enhanced error handling
        console.log('🔍 Verifying token from:', tokenSource);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log('✅ Token verified successfully');
        console.log('✅ User ID:', decoded.id);
        console.log('✅ User email:', decoded.email);
        console.log('✅ User role:', decoded.role || 'user');
        
        // Attach user data to request object
        req.userId = decoded.id; // Keep for backward compatibility
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || 'user'
        };
        
        console.log('✅ User authentication successful - proceeding to next');
        next();
        
    } catch (error) {
        console.error('❌ User authentication error:', error.message);
        console.error('🔍 Error type:', error.name);
        console.error('🔍 Error stack:', error.stack);
        
        let message = 'Authentication failed';
        let code = 'AUTH_FAILED';
        
        if (error.name === 'TokenExpiredError') {
            message = 'Token has expired. Please login again.';
            code = 'TOKEN_EXPIRED';
            console.log('⏰ Token expired at:', new Date(error.expired * 1000).toISOString());
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token. Please login again.';
            code = 'TOKEN_INVALID';
            console.log('🚫 Invalid token format or signature');
        }
        
        // Clear invalid tokens
        console.log('🧹 Clearing invalid tokens...');
        res.clearCookie('token');
        if (req.session) {
            req.session.token = null;
            req.session.user = null;
        }
        
        res.status(401).json({ 
            success: false, 
            message,
            code,
            timestamp: new Date().toISOString(),
            debug: {
                errorType: error.name,
                errorMessage: error.message,
                tokenSource: 'authentication middleware',
                action: 'token_cleared'
            }
        });
    }
};

export default authUser;
