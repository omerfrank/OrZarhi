import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function reqLogin(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Optional: Verify user still exists in DB
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        // Attach user to request object for downstream use
        req.user = user;
        
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ success: false, error: 'Invalid or expired token.' });
    }
}

/**
 * Middleware to check if the authenticated user has admin privileges.
 * Requires reqLogin to run first.
 */
export function reqAdmin(req, res, next) {
    // Check if user is authenticated and has admin role
    // Note: You will need to add a 'role' or 'isAdmin' field to your User model
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Access denied. Admin privileges required.' });
    }
    
    next();
}