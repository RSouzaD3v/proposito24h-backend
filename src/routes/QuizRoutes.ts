import { Router } from 'express';
import { Quiz } from '../controllers/QuizController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { json } from 'body-parser';

const router = Router();
const quiz = new Quiz();

// Proteger todas as rotas com authMiddleware
router.use(authMiddleware);
router.use(json());

// Criar quiz
router.post('/create', (req, res) => quiz.createQuiz(req, res));

// Obter quiz para edição (usado no GET /quiz/:id)
router.get('/:id', (req, res) => quiz.getQuizById(req, res));

// Atualizar quiz (usado no PUT /quiz/:id)
router.put('/:id', (req, res) => quiz.updateQuiz(req, res));

// Deletar quiz
router.delete('/:id', (req, res) => quiz.deleteQuiz(req, res));

// Listar quizzes de um escritor
router.get('/user/:userId', (req, res) => quiz.getAllQuizzesByUser(req, res));

export default router;
