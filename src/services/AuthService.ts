import { generateToken, verifyToken } from '../libs/jwt';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Role, Status } from '@prisma/client'; // Ajuste de acordo com seu schema
// import { EmailService } from './EmailService';

// const emailService = new EmailService();

export class AuthService {
    private userRepository = new UserRepository();

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Usuário não encontrado');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Senha inválida');

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role as any
        });

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

        return { token, user: userWithoutPassword };
    }

    async register(
        name: string,
        email: string,
        password: string,
        role: Role = Role.READER, // default para leitor, ajustável
        avatar: string = '',
        interest: string[] = [],
        status: Status = Status.ACTIVE // ou qualquer status default
    ) {
        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) throw new Error('E-mail já cadastrado');

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        const now = new Date();
        await this.userRepository.create({
            id,
            name,
            email,
            password: hashedPassword,
            avatar: avatar || null,
            bio: null,
            role,
            status,
            lastAccess: null,
            interest,
            createdAt: now,
            updatedAt: now
        });

        const token = generateToken({ id, email, role });

        // await emailService.sendMail(email, "Seja Bem vindo a nossa plantaforma", "<h1>Seja bem vindo</h1> <br/> <br/> <p>Estamos muito felizes de te-lo no <a href='https://devocional.com.br'>devocional.com.br</a></p>");

        return { token };
    }
    
    async validateToken(token: string) {
        try {
            const decoded = verifyToken(token);
            if (!decoded) throw new Error('Token inválido ou expirado');

            const user = await this.userRepository.findById(decoded.id);
            if (!user) throw new Error('Usuário não encontrado');

            return user;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }
}
