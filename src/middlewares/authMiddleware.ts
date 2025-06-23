import { config } from "dotenv";
config();

import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

interface AuthUser {
    id: string;
    email: string;
    role: "READER" | "ADMIN" | "WRITER";
}

interface JwtPayload {
    id: string;
    email: string;
    role: "READER" | "ADMIN" | "WRITER";
    iat?: number;
    exp?: number;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthUser;
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization?.toString();

    if (!authHeader) {
        res.status(401).json({ message: 'Token não fornecido' });
        return 
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "devocionalsecret") as JwtPayload;

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (err) {
        console.error("Erro ao verificar token:", err);
        res.status(401).json({ message: 'Token inválido' });
        return 
    }
}
