import { User } from "@prisma/client";
import { db } from "../libs/db";

export class UserRepository {
    async create(data: User): Promise<User> {
        return await db.user.create({ data });
    };

    async delete(id: string): Promise<void> {
        await db.user.delete({ where: { id } });
    }

    async update(id: string, data: Omit<User, "email" | "password" | "role" | "status" | "lastAccess">): Promise<void> {
        await db.user.update({ where: { id }, data });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await db.user.findUnique({ where: { email } });
    };

    async findById(id: string): Promise<User | null> {
        return await db.user.findUnique({ where: { id } });
    }
}