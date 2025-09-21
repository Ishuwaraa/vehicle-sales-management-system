import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

interface JwtPayload {
    id: string;
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

const genAccessToken = (id: string ) => jwt.sign({ id }, accessTokenSecret, { expiresIn: '1m' });
const genRefreshToken = (id: string ) => jwt.sign({ id }, refreshTokenSecret, { expiresIn: '3d' });

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).json({ message: 'Authorization header is missing' });

    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json({ message: 'No token found' });
    
    jwt.verify(token, accessTokenSecret, (err, data) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token expired' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Invalid token' });
            }

            return res.status(403).json({ message: err.message });
        }
        
        const payload = data as JwtPayload;
        req.userId = payload.id;
        next();
    })
}

export { genAccessToken, genRefreshToken, verifyJWT };