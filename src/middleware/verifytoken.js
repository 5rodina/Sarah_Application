import jwt from 'jsonwebtoken'
import tokenBlacklist from '../utils/tokenBlacklist.js';

export const verifyToken = async (req, res, next) => {
    let token = req.headers.token; // Extract token from headers

    if (!token) return res.status(401).json({ message: 'Token is missing' });

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Token has been invalidated' });
    }

    jwt.verify(token, 'koko', async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token', err });

        req.decodedToken = decoded;
        next();
    });
};
