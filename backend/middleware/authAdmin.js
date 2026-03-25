import jwt from "jsonwebtoken"
import { verifyToken } from "../utils/authUtils.js"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        // Try to get token from header first (for backward compatibility)
        let token = req.headers.atoken
        
        // If no header token, try to get from cookie
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token
        }
        
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        // Verify token using utility function
        const token_decode = verifyToken(token)
        
        // Check authentication - support both old and new token formats
        let isAdmin = false;
        
        // New format: check role
        if (token_decode.role === 'admin') {
            isAdmin = true;
        }
        // Old format: check if token matches admin credentials (string comparison)
        else if (typeof token_decode === 'string') {
            if (token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                isAdmin = true;
            }
        }
        
        if (!isAdmin) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;