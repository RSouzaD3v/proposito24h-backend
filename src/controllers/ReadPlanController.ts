import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../libs/db';

export class ReadPlan {
    async createReadPlan (req: Request, res: Response) {
        const { title, description, duration, days } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        const readPlan = await db.readPlan.create({
            data: {
                id: uuidv4(),
                duration: Number(duration),
                title,
                authorId: userId,
                description
            }
        });

        if (!readPlan.id) {
            res.status(400).json({ error: 'ReadPlan ID is required' });
            return 
        }

        days.forEach(async (v: any) => {
            await db.readingSchedule.create({
                data: {
                    titleDay: v.title,
                    bookId: v.bookId,
                    referenceDay: v.day.toString(),
                    id: uuidv4(),
                    readPlanId: readPlan.id
                }
            })
        })

        res.status(201).json({ error: false, message: "Read Plan created", id: readPlan.id })
    }

    async createNewDay (req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.user?.id;
        const { titleDay, referenceDay, bookId } = req.body;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        const getReadPlan = await db.readPlan.findUnique({
            where: {
                id
            }
        })

        if(!getReadPlan) {
            res.status(404).json({ error: true, message: "Read Plan not found" });
        }

        const createNewDay = await db.readingSchedule.create({
            data: {
                titleDay: titleDay,
                referenceDay: referenceDay?.toString(),
                bookId,
                readPlanId: id
            }
        });

        res.status(201).json({ newDay: createNewDay })
    }

    async updateReadPlan (req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, duration } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        const readPlan = await db.readPlan.findUnique({
            where: {
                id
            }
        })

        if(!readPlan) {
            res.status(404).json({ error: true, message: "Read Plan not found" });
        }

        const updatedReadPlan = await db.readPlan.update({
            where: {
                id: readPlan?.id
            },
            data: {
                title: title || readPlan?.title,
                description: description || readPlan?.description,
                duration: Number(duration) || readPlan?.duration
            }
        })

        res.status(200).json({ message: "Atualizado" })
    }

    async deleteDay (req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        const getDay = await db.readingSchedule.findUnique({
            where: {
                id
            }
        })

        if (!getDay) {
            res.status(404).json({ error: 'Day not found' });
            return 
        }

        await db.readingSchedule.delete({
            where: {
                id: getDay.id
            }
        });

        res.status(204).json({ error: false, message: "Day deleted" })
    }

    async updateDay (req: Request, res: Response) {
        const { id } = req.params;
        const { titleDay, bookId} = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        const getDay = await db.readingSchedule.findUnique({
            where: {
                id
            }
        })

        if (!getDay) {
            res.status(404).json({ error: 'Day not found' });
            return 
        }

        await db.readingSchedule.update({
            where: {
                id: getDay.id
            },
            data: {
                titleDay: titleDay || getDay.titleDay,
                bookId: bookId || getDay.bookId
            }
        })

        res.status(200).json({ message: "Atualizado com sucesso" });
    }

    async getAllByAuthorId (req: Request, res: Response) {
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        const readPlanByAuthorId = await db.readPlan.findMany({
            where: {
                authorId: userId
            },
            include: {
                _count: {select: {
                    readingShedules: true
                }}
            }
        });

        res.status(200).json({ error: false, readPlans: readPlanByAuthorId })
    }

    async getUnicById (req: Request, res: Response) {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        const readPlanByIdUnique = await db.readPlan.findUnique({
            where: {
                authorId: userId,
                id
            },
            include: {
                readingShedules: {
                    include: {
                        book: true
                    }
                }
            }
        });

        res.status(200).json({ error: false, readPlan: readPlanByIdUnique })
    }

    async deleteReadPlanById (req: Request, res: Response) {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return 
        }

        await db.readPlan.delete({
            where: {
                id,
                authorId: userId
            }
        });
    }
}