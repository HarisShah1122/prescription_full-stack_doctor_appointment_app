import jwt from 'jsonwebtoken'
import { verifyToken } from "../utils/authUtils.js"

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        // Try to get token from header first (for backward compatibility)
        let token = req.headers.dtoken
        
        // If no header token, try to get from cookie
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token
        }
        
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        // Verify token using utility function
        const token_decode = verifyToken(token)
        
        // Check doctor authentication - support both old and new token formats
        let isDoctor = false;
        
        // New format: check role
        if (token_decode.role === 'doctor') {
            isDoctor = true;
            req.userId = token_decode.id;
            req.body.docId = token_decode.id;
        }
        // Old format: check if token has id property (no role)
        else if (token_decode.id && !token_decode.role) {
            isDoctor = true;
            req.userId = token_decode.id;
            req.body.docId = token_decode.id;
        }
        
        if (!isDoctor) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor;