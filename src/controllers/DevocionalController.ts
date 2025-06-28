import { Request, Response } from 'express';
import { DevocionalService } from '../services/DevocionalService'; // para buscar nome do autor
import { v4 as uuidv4 } from 'uuid';
import { db } from '../libs/db';
import { uploadToS3 } from '../services/S3Service';

const devocionalService = new DevocionalService();

export class DevocionalController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const devocionais = await devocionalService.findAllDevocionais(req.user?.id as string);
            res.json(devocionais);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar devocionais.' });
        }
    }

    async getDevocionalByUser(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Usuário não autenticado.' });
            return;
        }

        try {
            const devocionais = await devocionalService.findAllDevocionais(userId);
            res.json(devocionais);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar devocionais.' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const devocional = await devocionalService.findDevocionalById(id);
            if (!devocional) {
                res.status(404).json({ message: 'Devocional não encontrado.' });
                return;
            }
            res.json(devocional);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar devocional.' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
        
        if (!userId) {
          res.status(401).json({ message: 'Usuário não autenticado.' });
          return;
        }
      
        // Extrair o JSON serializado de dentro do FormData
        const rawData = req.body.data;
      
        if (!rawData) {
          res.status(400).json({ message: 'Dados do livro ausentes.' });
          return;
        }
      
        const {
          title,
          description,
          verseGuide,
          bookPrice,
          readingTime,
          difficultyLevel,
          pages,
          mode,
          category,
          tags
        } = JSON.parse(rawData);
      
        // Buscar nome do autor
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });
      
        if (!user) {
          res.status(404).json({ message: 'Usuário não encontrado.' });
          return;
        }
      
        // Upload da imagem se existir
        let coverImageUrl: string | undefined = undefined;
      
        if (req.file) {
          coverImageUrl = await uploadToS3({
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            mimetype: req.file.mimetype,
            folder: 'cover-books-image',
          });
        }
      
        const devocional = await devocionalService.createDevocional(
          title,
          description,
          user.name,
          userId,
          category,
          tags || [],
          verseGuide,
          coverImageUrl,
          mode || 'SKETCH',
          difficultyLevel,
          readingTime || 0,
          bookPrice || 0,
          pages
        );
      
        res.status(201).json(devocional);
      } catch (error) {
        console.error('Erro ao criar devocional:', error);
        res.status(500).json({ message: 'Erro ao criar devocional.' });
      }
    }

    async updateDevocional(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const rawData = req.body.data;
      
        if (!rawData) {
          res.status(400).json({ message: 'Dados do livro ausentes.' });
          return;
        }
      
        const {
          title,
          description,
          verseGuide,
          bookPrice,
          readingTime,
          difficultyLevel,
          mode,
          category,
          tags
        } = JSON.parse(rawData);

        let coverImageUrl: string | undefined = undefined;
      
        if (req.file) {
          coverImageUrl = await uploadToS3({
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            mimetype: req.file.mimetype,
            folder: 'cover-books-image',
          });
        }

        const existingDevocional = await db.book.findUnique({
            where: {
                id
            }
        });

        const updatedDevocional = await db.book.update({
            where: {
                id
            },
            data: {
                bookPrice,
                category,
                coverImage: coverImageUrl || existingDevocional?.coverImage,
                description,
                difficultyLevel,
                mode,
                readingTime: parseInt(readingTime),
                verseGuide,
                title,
                tags
            }
        })



        res.status(200).json({ error: false, updatedDevotional: updatedDevocional })
    }

    async updatePage(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { pageId, title, introText, mainVerse, textVerse, verseGuide, referenceDay, contentMain, practicalApplication, prayer, pageOrder, bookId } = req.body;

        try {
            const updatedPage = await db.page.update({
                where: {
                    id,
                    bookId
                },
                data: {
                    title,
                    introText,
                    mainVerse,
                    textVerse,
                    verseGuide,
                    referenceDay,
                    contentMain,
                    practicalApplication,
                    prayer,
                    pageOrder,
                }
            });

            res.status(200).json({ error: false, updatedPage });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar página do devocional.' });
        }
    }

    async createNewPage(req: Request, res: Response): Promise<void> {
        const { id } = req.params; // Id do livro
        const { title, introText, mainVerse, textVerse, verseGuide, referenceDay, contentMain, practicalApplication, prayer, pageOrder } = req.body;

        console.log("Testando: ", title, id);
        
        const pageId = uuidv4();

        try {
            const newPage = await db.page.create({
                data: {
                    id: pageId,
                    bookId: id,
                    title,
                    introText,
                    mainVerse,
                    textVerse,
                    verseGuide,
                    referenceDay,
                    contentMain,
                    practicalApplication,
                    prayer,
                    pageOrder
                }
            });

            res.status(201).json({ error: false, newPage });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar nova página do devocional.' });
        }
    }

    async deletePage(req: Request, res: Response): Promise<void> {
        const { pageId, bookId } = req.params; // Id da página
        try {
            await db.page.delete({
                where: { id: pageId, bookId }
            });
            res.status(204).json({ deleted: true });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar página do devocional.' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await devocionalService.deleteDevocional(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar devocional.' });
        }
    }

    async getDevocionalByWriterId(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Usuário não autenticado.' });
            return;
        }

        try {
            const devocionais = await db.book.findMany({
                where: {
                    userId
                }
            });
            
            res.json(devocionais);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar devocionais.' });
        }
    }
}
