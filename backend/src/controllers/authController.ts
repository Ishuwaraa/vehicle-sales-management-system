import User, { UserRole } from "../models/userModel.js"
import { genAccessToken, genRefreshToken } from "../middlewares/authMiddleware.js";
import bcrypt from "bcrypt";
import { Request, Response, CookieOptions } from 'express';
import { UserLogin, UserRegister } from "../types/user.types.js";
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { addUser, findUserByEmail, findUserById } from "../repositories/userRepository.js";

interface JwtPayload {
    id: string;
    role: string;
}

const cookieOptions: CookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 3 * 24 * 60 * 60 * 1000    //exp in 3d
}

const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, password }: UserRegister = req.body;
    if (!name || !email || !phone || !password) {
        res.status(400).json({ message: 'All fields are required.' });
        return;
    }

    const convEmail = email.toLowerCase().trim();

    try{
        const exists = await findUserByEmail(convEmail);
        if(exists) {
            res.status(409).json({ message: 'Email already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);                

        
        const newUser = await addUser({ name, email: convEmail, phone, password: hash, role: UserRole.ADMIN });
        if(!newUser) {
            res.status(500).json({ message: 'Account creation failed' });
            return;
        }

        const accessToken = genAccessToken(newUser.id, newUser.role);
        const refreshToken = genRefreshToken(newUser.id, newUser.role);

        res.cookie("refreshToken", refreshToken, cookieOptions);   
        res.status(201).json({ accessToken, name: newUser.name, email: newUser.email });
    
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const login = async(req: Request, res: Response): Promise<void> => {
    const { email, password }: UserLogin = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'All fields are required.' });
        return;
    }

    const convEmail = email.toLowerCase().trim();

    try {
        const user = await findUserByEmail(convEmail);
        if(!user) {
            res.status(404).json({ message: 'Invalid email or password' });
            return;
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const accessToken = genAccessToken(user.id, user.role);
        const refreshToken = genRefreshToken(user.id, user.role);
        
        res.cookie("refreshToken", refreshToken, cookieOptions);
        res.status(200).json({ accessToken, id: user.id});
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const logout = (req: Request, res: Response): void => {
    const cookies = req.cookies;

    if(!cookies?.refreshToken) {
        res.status(401).json({ message: 'No token' });
        return
    }

    res.clearCookie('refreshToken', {
        httpOnly: cookieOptions.httpOnly, 
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
    });
    res.sendStatus(200);    
}

const refreshAccessToken = (req: Request, res: Response): void => {
    const cookies = req.cookies;

    if(!cookies?.refreshToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const refreshToken = cookies.refreshToken;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refreshtokensecret";

    jwt.verify(refreshToken, refreshTokenSecret, async (err: VerifyErrors | null, data: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Session expired' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Invalid token' });
            }

            return res.status(403).json({ message: err.message });
        }
        
        const payload = data as JwtPayload;

        try {
            const user = await findUserById(payload.id);
            if(!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
    
            const accessToken = genAccessToken(user.id, user.role);
            const refreshToken = genRefreshToken(user.id, user.role);
    
            res.cookie('refreshToken', refreshToken, cookieOptions)
            res.status(200).json({ accessToken });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    })
}

export { register, login, logout, refreshAccessToken }