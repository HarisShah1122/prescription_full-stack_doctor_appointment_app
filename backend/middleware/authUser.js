import jwt from 'jsonwebtoken';
import { verifyToken } from "../utils/authUtils.js";

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        // Try to get token from Authorization header first (for backward compatibility)
        let token = null;
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        
        // If no header token, try to get from cookie
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token
        }
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
        }

        const decoded = verifyToken(token);
        
        // Check user authentication - support both old and new token formats
        let isUser = false;
        
        // New format: check role
        if (decoded.role === 'user') {
            isUser = true;
            req.userId = decoded.id;
        }
        // Old format: check if token has id property (no role)
        else if (decoded.id && !decoded.role) {
            isUser = true;
            req.userId = decoded.id;
        }

        if (!isUser) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
