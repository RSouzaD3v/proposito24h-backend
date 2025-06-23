import { DevocionalRepository } from "../repositories/DevocionalRepository";
import { v4 as uuidv4 } from 'uuid';
import { Mode, DifficultyLevel } from "@prisma/client";
import { PageRepository } from "../repositories/PageRepository";

export class DevocionalService {
    private devocionalRepository = new DevocionalRepository();
    private pageRepository = new PageRepository();

    async createDevocional(
        title: string,
        content: string,
        authorName: string,
        userId: string,
        category: string,
        tags: string[],
        verseGuide?: string,
        coverImageUrl?: string,
        mode: Mode = Mode.SKETCH,
        difficultyLevel: DifficultyLevel = DifficultyLevel.EASY,
        readingTime: number = 0,
        bookPrice: number = 0,
        pages?: any[]
    ) {
        const devocionalId = uuidv4();

        // Cria o livro (devocional)
        const now = new Date();
        const book = await this.devocionalRepository.create({
            id: devocionalId,
            title,
            description: content.substring(0, 200), // Pequeno resumo
            verseGuide: verseGuide || null,
            coverImage: coverImageUrl || "none",
            userId,
            authorName,
            bookPrice, // Gratuito
            category,
            tags,
            readingTime: readingTime || Math.ceil(content.split(" ").length / 200), // Tempo estimado de leitura
            difficultyLevel,
            mode,
            createdAt: now,
            updatedAt: now,
        });

        if(pages && pages.length === 0) {
            return new Error("Pelo menos uma página deve ser fornecida.");
        };

        pages?.forEach(async (page) => {
            const pageId = uuidv4();

            await this.pageRepository.createPage({
                id: pageId,
                bookId: devocionalId,
                title: page.title,
                contentMain: page.contentMain,
                introText: page.introText,
                mainVerse: page.mainVerse,
                pageOrder: page.pageOrder || 0,
                practicalApplication: page.practicalApplication || null,
                prayer: page.prayer || null,
                referenceDay: page.referenceDay || null,
                textVerse: page.textVerse || null,
                verseGuide: page.verseGuide || null,
            });
        });

        return { book };
    }

    async getDevocionalByUserId(userId: string) {
        const devocionais = await this.devocionalRepository.findByUserId(userId);
        if (!devocionais || devocionais.length === 0) {
            throw new Error("Nenhum devocional encontrado para este usuário.");
        }
        
        return devocionais;
    }

    async deleteDevocional(id: string) {
        await this.pageRepository.deletePagesByBookId(id);
        await this.devocionalRepository.delete(id);
    }

    async findDevocionalById(id: string) {
        return await this.devocionalRepository.findById(id);
    }

    async findDevocionalByUserId(userId: string) {
        return await this.devocionalRepository.findByUserId(userId);
    }

    async findAllDevocionais() {
        return await this.devocionalRepository.findAll();
    }

    async findDevocionalByCategory(category: string) {
        return await this.devocionalRepository.findByCategory(category);
    }

    async findDevocionalByTag(tag: string) {
        return await this.devocionalRepository.findByTag(tag);
    }

    async findDevocionalByTitle(title: string) {
        return await this.devocionalRepository.findByTitle(title);
    }
}
