import { Book, Page } from "@prisma/client";
import { db } from "../libs/db";

export class DevocionalRepository {
    async create(data: Book): Promise<Book> {
        return await db.book.create({ data });
    };

    async delete(id: string): Promise<void> {
        await db.book.delete({ where: { id } });
    }

    async findById(id: string): Promise<Book | null> {
        return await db.book.findUnique({ where: { id }, include: { pages: true } });
    }

    async findByUserId(userId: string): Promise<Book[]> {
        return await db.book.findMany({ where: { userId } });
    }

    async findAll(): Promise<Book[]> {
        return await db.book.findMany();
    }

    async findByCategory(category: string): Promise<Book[]> {
        return await db.book.findMany({ where: { category } });
    }

    async findByTag(tag: string): Promise<Book[]> {
        return await db.book.findMany({ where: { tags: { has: tag } } });
    }

    async findByTitle(title: string): Promise<Book[]> {
        return await db.book.findMany({ where: { title: { contains: title, mode: "insensitive" } } });
    }
}