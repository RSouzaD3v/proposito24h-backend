import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const bookController = new BookController();

// ✅ proteção com login
router.use(authMiddleware);

// GET /devocional/books/available
router.get('/available', (req, res) => bookController.getAvailableBooks(req, res));

export default router;
