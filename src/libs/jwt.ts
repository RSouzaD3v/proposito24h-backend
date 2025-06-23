import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    email: string;
    role: "READER" | "ADMIN" | "WRITER";
}

const secret = process.env.JWT_SECRET || "devocionalsecret"; // Pegando do .env

export function generateToken(payload: JwtPayload): string {
    const expiresIn = '1d';
    return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
}
