import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        // Expecting Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id; // attach userId to request object
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
