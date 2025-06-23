import { UserRepository } from "../repositories/UserRepository";
import { v4 as uuidv4 } from 'uuid';
import { Role, Status } from "@prisma/client";

export class UserService {
    private userRepository = new UserRepository();

    async createUser(name: string, password: string, email: string, avatar: string, role: Role, interest: string[], status: Status) {
        const existingUser = await this.userRepository.findByEmail(email);

        if(existingUser) throw new Error("Usuário já existe");

        const id = uuidv4();
        const createdAt = new Date();
        const updatedAt = new Date();
        
        return await this.userRepository.create(
            {
                id,
                name,
                password,
                email,
                avatar: avatar ?? null,
                bio: null,
                role,
                status,
                lastAccess: null,
                interest,
                createdAt, 
                updatedAt
            }
        );
    };
    
    async deleteUser(id: string) {
        const noExistUser = await this.userRepository.findById(id);

        if(noExistUser) throw new Error("Usuário não existe.");

        return await this.userRepository.delete(id);
    };

    async updateUser(id: string, name: string, bio: string, avatar: string, interest: string[]) {
        const existingUser = await this.userRepository.findById(id);

        if(!existingUser) throw new Error("Usuário não existe.");

        const updatedAt = new Date();
        await this.userRepository.update(id, { 
            id,
            name,
            bio,
            avatar,
            interest,
            createdAt: existingUser.createdAt,
            updatedAt
        });
    };
}