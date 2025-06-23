import { Page } from "@prisma/client";
import { db } from "../libs/db";

export class PageRepository {
    async createPage(data: Page): Promise<Page> {
        return await db.page.create({ data });
    };

    async deletePagesByBookId(bookId: string): Promise<void> {
        await db.page.deleteMany({ where: { bookId } });
    }

    async deletePage(id: string): Promise<void> {
        await db.page.delete({ where: { id } });
    }

    async updatePage(id: string, data: Omit<Page, "id" | "authorName">): Promise<void> {
        await db.user.update({ where: { id }, data });
    }

    async findPageById(id: string): Promise<Page | null> {
        return await db.page.findUnique({ where: { id } });
    }

    async findPageByBokId(bookId: string): Promise<Page[]> {
        return await db.page.findMany({ where: { bookId } });
    }
}