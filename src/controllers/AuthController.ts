import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const { token, user } = await authService.login(email, password);

            const userWithoutPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                role: user.role,
                status: user.status,
                lastAccess: user.lastAccess,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }

            res.json({ token, user: userWithoutPassword });
            return 
        } catch (err: any) {
            res.status(401).json({ message: err.message });
            return 
        }
    }

    static async register(req: Request, res: Response) {
        const { name, email, password, role, avatar, interest, status } = req.body;

        try {
            const { token } = await authService.register(
                name,
                email,
                password,
                role,
                avatar,
                interest,
                status
            );

            const user = await authService.validateToken(token);
            
            if (!user) {
                res.status(401).json({ message: 'Token inválido ou expirado' });
                return 
            }

            const userWithoutPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                role: user.role,
                status: user.status,
                lastAccess: user.lastAccess,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }

            res.status(201).json({ token, user: userWithoutPassword });
            return 
        } catch (err: any) {
            res.status(400).json({ message: err.message });
            return 
        }
    }
}
