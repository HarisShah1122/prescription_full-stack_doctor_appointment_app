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
        
        // Check if user role is doctor
        if (token_decode.role !== 'doctor') {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        req.userId = token_decode.id  // Set req.userId for consistency
        req.body.docId = token_decode.id  // Keep for backward compatibility
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor;