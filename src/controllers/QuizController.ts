import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../libs/db';

export class Quiz {
  /**
   * Criar novo quiz
   */
  async createQuiz(req: Request, res: Response) {
    try {
      const { title, description, bookId, questions } = req.body;

      if (!title || !bookId || !questions || !Array.isArray(questions)) {
        res.status(400).json({ message: 'Dados obrigatórios faltando ou mal formatados.' });
        return;
      }

      const quizId = uuidv4();
      await db.quiz.create({
        data: {
          id: quizId,
          title,
          description,
          bookId,
          questions: {
            create: questions.map((q: any) => ({
              id: uuidv4(),
              question: q.question,
              option: {
                create: q.options.map((opt: any) => ({
                  id: uuidv4(),
                  option: opt.option,
                  isCorrect: opt.isCorrect
                }))
              }
            }))
          }
        },
        include: {
          questions: {
            include: {
              option: true
            }
          }
        }
      });

      res.status(201).json({ message: 'Quiz criado com sucesso.' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar quiz.', error: error.message });
    }
  }

  /**
   * Buscar quiz por ID (com perguntas e opções)
   */
  async getQuizById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const quiz = await db.quiz.findUnique({
        where: { id },
        include: {
          questions: {
            include: {
              option: true
            }
          }
        }
      });

      if (!quiz) {
        res.status(404).json({ message: 'Quiz não encontrado.' });
        return;
      }

      res.json(quiz);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar quiz.', error: error.message });
    }
  }

  /**
   * Atualizar quiz existente
   */
  async updateQuiz(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, bookId, questions } = req.body;

    if (!title || !bookId || !questions || !Array.isArray(questions)) {
      res.status(400).json({ message: 'Dados obrigatórios faltando ou mal formatados.' });
      return;
    }

    try {
      // Apaga as perguntas antigas em cascata (via onDelete: Cascade)
      await db.question.deleteMany({
        where: { quizId: id }
      });

      // Atualiza quiz
      await db.quiz.update({
        where: { id },
        data: {
          title,
          description,
          bookId,
          questions: {
            create: questions.map((q: any) => ({
              id: uuidv4(),
              question: q.question,
              option: {
                create: q.options.map((opt: any) => ({
                  id: uuidv4(),
                  option: opt.option,
                  isCorrect: opt.isCorrect
                }))
              }
            }))
          }
        }
      });

      res.json({ message: 'Quiz atualizado com sucesso.' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar quiz.', error: error.message });
    }
  }

  /**
   * Deletar quiz por ID
   */
  async deleteQuiz(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await db.quiz.delete({
        where: { id }
      });

      res.json({ message: 'Quiz deletado com sucesso.' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao deletar quiz.', error: error.message });
    }
  }

  /**
   * Listar quizzes por usuário (via book.userId)
   */
  async getAllQuizzesByUser(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const quizzes = await db.quiz.findMany({
        where: {
          book: {
            userId
          }
        },
        include: {
          book: true
        }
      });

      res.json(quizzes);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar quizzes.', error: error.message });
    }
  }
}
