import jwt from 'jsonwebtoken';

// Enhanced user authentication middleware with improved cookie handling
const authUser = async (req, res, next) => {
    try {
        console.log('🔐 Authenticating user...');
        console.log('🌐 Request URL:', req.url);
        console.log('🌐 Request Method:', req.method);
        
        // Get token from multiple sources
        let token = null;
        let tokenSource = null;
        
        // 1. Check HTTP-only cookies first (most secure)
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            tokenSource = 'cookie';
            console.log('🍪 Token found in HTTP-only cookie');
        }
        
        // 2. Check Authorization header (fallback)
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
                tokenSource = 'header';
                console.log('🎫 Token found in Authorization header');
            }
        }
        
        // 3. Check session (fallback)
        if (!token && req.session && req.session.token) {
            token = req.session.token;
            tokenSource = 'session';
            console.log('🔐 Token found in session');
        }
        
        // Log token source for debugging
        console.log('🔑 Final token source:', tokenSource);
        console.log('🔑 Token exists:', !!token);
        
        if (!token) {
            console.log('❌ TOKEN_MISSING - No token found in any source');
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'TOKEN_MISSING'
            });
        }
        
        // Verify JWT token
        console.log('🔍 Verifying JWT token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            console.log('❌ Invalid token signature');
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }
        
        console.log('✅ Token verified successfully');
        console.log('👤 User ID:', decoded.id);
        console.log('👤 User Email:', decoded.email);
        
        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || 'user'
        };
        
        console.log('🎯 Authentication successful, proceeding to next middleware');
        next();
        
    } catch (error) {
        console.error('❌ Authentication error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            console.log('⏰ Token expired');
            return res.status(401).json({
                success: false,
                message: 'Token expired, please login again',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            console.log('❌ Invalid JWT token');
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
};

export default authUser;
