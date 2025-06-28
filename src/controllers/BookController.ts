import { Request, Response } from 'express';
import { db } from '../libs/db';

export class BookController {
  /**
   * Listar livros disponíveis para venda (todos os autores)
   * Apenas livros publicados
   */
  async getAvailableBooks(req: Request, res: Response) {
    try {
      const books = await db.book.findMany({
        where: {
          mode: 'PUBLISHED'
        },
        orderBy: {
          title: 'asc'
        }
      });

      res.json(books);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar livros disponíveis.', error: error.message });
    }
  }
}
