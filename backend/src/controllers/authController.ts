import User from "../models/userModel.js"
import { genAccessToken, genRefreshToken } from "../middlewares/authMiddleware.js";
import bcrypt from "bcrypt";
import { Request, Response, CookieOptions } from 'express';
import { UserLogin, UserRegister } from "../types/user.types.js";
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { addUser, findUserByEmail, findUserById } from "../repositories/userRepository.js";

interface JwtPayload {
    id: string;
}

//TODO: check strict vs lax
const cookieOptions: CookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000    //exp in 3d
}

const register = async (req: Request, res: Response) => {
    const { name, email, phone, password }: UserRegister = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const convEmail = email.toLowerCase().trim();

    try{
        const exists = await findUserByEmail(convEmail);
        if(exists) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);                

        
        const newUser = await addUser({ name, email: convEmail, phone, password: hash });
        if(!newUser) {
            return res.status(500).json({ message: 'Account creation failed' });
        }

        const accessToken = genAccessToken(newUser.id);
        const refreshToken = genRefreshToken(newUser.id);

        res.cookie("refreshToken", refreshToken, cookieOptions);   
        res.status(201).json({ accessToken, name: newUser.name, email: newUser.email });
    
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const login = async(req: Request, res: Response) => {
    const { email, password }: UserLogin = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const convEmail = email.toLowerCase().trim();

    try {
        const user = await findUserByEmail(convEmail);
        if(!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = genAccessToken(user.id);
        const refreshToken = genRefreshToken(user.id);
        
        res.cookie("refreshToken", refreshToken, cookieOptions);
        res.status(200).json({ accessToken, id: user.id});
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

const logout = (req: Request, res: Response) => {
    const cookies = req.cookies;

    if(!cookies?.refreshToken) {
        return res.status(401).json({ message: 'No token' });
    }

    res.clearCookie('refreshToken', {
        httpOnly: cookieOptions.httpOnly, 
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
    });
    res.sendStatus(200);    
}

const refreshAccessToken = (req: Request, res: Response) => {
    const cookies = req.cookies;

    if(!cookies?.refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
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
                return res.status(404).json({ message: 'User not found' });
            }
    
            const accessToken = genAccessToken(user.id);
            const refreshToken = genRefreshToken(user.id);
    
            res.cookie('refreshToken', refreshToken, cookieOptions)
            res.status(200).json({ accessToken });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    })
}

export { register, login, logout, refreshAccessToken }