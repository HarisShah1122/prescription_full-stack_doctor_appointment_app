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
        
        // Check if user role is user
        if (decoded.role !== 'user') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        req.userId = decoded.id; // attach userId to request object
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
