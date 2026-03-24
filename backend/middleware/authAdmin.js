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
        
        // For admin, check if it matches admin credentials (backward compatibility)
        if (token_decode.email !== process.env.ADMIN_EMAIL || token_decode.role !== 'admin') {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;