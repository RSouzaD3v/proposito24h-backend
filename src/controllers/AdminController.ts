import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../libs/db';

export class AdminController {
    private userRepository = new UserRepository();

    async createWriter (req: Request, res: Response) {
        const userRole = req.user?.role;
        const { email, password, name, role } = req.body;

        if(!userRole || userRole !== "ADMIN") {
            res.status(403).json({ message: "Acesso não permitido" });
            return 
        };

        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) throw new Error('E-mail já cadastrado');

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdWriter = await db.user.create({
            data: {
                id: uuidv4(),
                email,
                name,
                role: 'WRITER',
                password: hashedPassword
            }
        })

        res.status(201).json({ message: 'Usuário criado com sucesso!', user: createdWriter })
    }

    async listWriters (req: Request, res: Response) {
        const userRole = req.user?.role;
        const { createdBy, search } = req.query;

        if(!userRole || userRole !== "ADMIN") {
            res.status(403).json({ message: "Acesso não permitido" });
            return 
        };

        const orderDirection = (typeof createdBy === 'string' && ['asc', 'desc'].includes(createdBy.toLowerCase()))
            ? createdBy.toLowerCase()
            : 'asc';

        const findManyWriters = await db.user.findMany({
            where: {
            role: 'WRITER',
            OR: search
                ? [
                { name: { contains: String(search), mode: 'insensitive' } },
                { email: { contains: String(search), mode: 'insensitive' } }
                ]
                : undefined
            },
            orderBy: {
            createdAt: orderDirection as 'asc' | 'desc'
            }
        });

        if(findManyWriters.length === 0) {
            res.status(404).json({ message: 'Nenhum escritor encontrado!' });
        }

        res.status(200).json({ writers: findManyWriters })
    }

    async writersDetails (req: Request, res: Response) {
        const userRole = req.user?.role;
        const { id } = req.params;

        if(!userRole || userRole !== "ADMIN") {
            res.status(403).json({ message: "Acesso não permitido" });
            return 
        };

        const existingWriter = await db.user.findUnique({
            where: {
                id,
                role:  'WRITER',
            }
        });

        if(!existingWriter) {
            res.status(404).json({ message: "Escritor não encontrado!" });
            return 
        }

        res.status(200).json({ writer: existingWriter });
    }

    async updateWriter (req: Request, res: Response) {
        const userRole = req.user?.role;
        const { name, password, email, status } = req.body;
        const { id } = req.params;

        if(!userRole || userRole !== "ADMIN") {
            res.status(403).json({ message: "Acesso não permitido" });
            return 
        };

        const existingWriter = await db.user.findUnique({
            where: {
                id,
                role:  'WRITER',
            }
        });

        if(!existingWriter) {
            res.status(404).json({ message: "Escritor não encontrado!" });
            return 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const uptatedWriter = await db.user.update({
            where: {
                id,
                role: 'WRITER'
            },
            data: {
                email: email || existingWriter.email,
                name: name || existingWriter.name,
                status: status || existingWriter.status,
                password: hashedPassword || existingWriter.password,
                updatedAt: new Date()
            }
        })

        res.status(200).json({ message: "Escritor atualizado com sucesso!", writer: uptatedWriter });
    }

    async deleteWriter (req: Request, res: Response) {
        const userRole = req.user?.role;
        const { id } = req.params;

        if(!userRole || userRole !== "ADMIN") {
            res.status(403).json({ message: "Acesso não permitido" });
            return 
        };

        const existingWriter = await db.user.findUnique({
            where: {
                id,
                role:  'WRITER',
            }
        });

        if(!existingWriter) {
            res.status(404).json({ message: "Escritor não encontrado!" });
            return 
        }


        await db.user.delete({
            where: {
                id,
                role: 'WRITER'
            },
        })

        res.status(200).json({ message: "Escritor deletado com sucesso!" });
    }

    async myProfileWriter (req: Request, res: Response) {
        const user = req.user;

        if(!user) {
            res.status(404).json({ message: "Usuário não autenticado." });
            return 
        };

        if(user.role !== 'ADMIN') {
            res.status(403).json({ message: "Você não é Admin Writer!" });
        };

        const userWriter = await db.user.findUnique({
            where: {
                email: user.email,
                id: user.id,
                role: 'ADMIN'
            }
        });

        const books = await db.book.findMany({
            where: {
                userId: userWriter?.id
            },
            include: {
                _count: true
            }
        });

        const readPlans = await db.readPlan.findMany({
            where: {
                authorId: userWriter?.id
            },
            include: {
                _count: true
            }
        });

        res.status(200).json({ user: userWriter, books, readPlans });
    }

    async updateMyProfileWriter (req: Request, res: Response) {
        const user = req.user;
        const { id } = req.params;
        const { avatar, email, password, bio, name } = req.body;

        if(!user) {
            res.status(404).json({ message: "Usuário não autenticado." });
            return 
        };

        if(user.role !== 'ADMIN') {
            res.status(403).json({ message: "Você não é Admin Writer!" });
        };

        const userWriter = await db.user.findUnique({
            where: {
                email: user.email,
                id: user.id,
                role: 'ADMIN'
            }
        });

        if(!userWriter) {
            res.status(404).json({ message: "Usuário não autenticado." });
            return 
        }

        const updatedAdminWriter = await db.user.update({
            where: {
                id,
                role: 'ADMIN'
            },
            data: {
                avatar: avatar || userWriter.avatar,
                bio: bio || userWriter.bio,
                email: email || userWriter.email,
                name: name || userWriter.name
            }
        })

        res.status(200).json({ user: updatedAdminWriter });
    }

    async metrics (req: Request, res: Response) {
        const user = req.user;

        if(!user) {
            res.status(404).json({ message: "Usuário não autenticado." });
            return 
        };

        if(user.role !== 'ADMIN') {
            res.status(403).json({ message: "Você não é Admin Writer!" });
        };

        const [
            totalUsers,
            totalDevocionais,
            totalReadPlans,
            totalQuizzes,
            usersActive
        ] = await Promise.all([
            db.user.count(),
            db.book.count(),
            db.readPlan.count(),
            db.quiz.count(),
            db.user.count({ where: { status: 'ACTIVE' } })
        ]);

        res.status(200).json({
            totalDevocionais,
            totalQuizzes,
            totalReadPlans,
            totalUsers,
            usersActive
        });
    }
}