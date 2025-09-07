import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Generate JWT token for a user
export const signToken = (user) => {
    const payload = { userId: user.id };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// Middleware to verify JWT and attach user info to req.user
export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
