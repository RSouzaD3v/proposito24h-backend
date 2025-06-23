import { Router } from 'express';
import { DevocionalController } from '../controllers/DevocionalController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { json } from 'body-parser';

import multer from 'multer';
const upload = multer(); // Armazena em memória (buffer)

const router = Router();
const devocionalController = new DevocionalController();

// Rotas protegidas por autenticação
router.use(authMiddleware);

// GET /devocional/all-books ADMIN
router.get('/all-books', (req, res) => devocionalController.getAll(req, res));

// GET /devocional/books por usuário userId;
router.get('/books', (req, res) => devocionalController.getDevocionalByUser(req, res));

// GET /devocional/:id
router.get('/get/:id', (req, res) => devocionalController.getById(req, res));

// POST /devocional/
router.post('/create', upload.single('coverImage'), (req, res) => devocionalController.create(req, res));

// PUT /devocional//:id
router.put('/update/:id', upload.single('coverImage'), (req, res) => devocionalController.updateDevocional(req, res));

router.put('/page/update/:id', json(), (req, res) => devocionalController.updatePage(req, res));
router.delete('/page/delete/:bookId/:pageId', (req, res) => devocionalController.deletePage(req, res));

router.post('/page/create/:id', json(), (req, res) => devocionalController.createNewPage(req, res));

// DELETE /devocional//:id
router.delete('/delete/:id', (req, res) => devocionalController.delete(req, res));

router.get('/get-devocional-by-writer', json(), (req, res) => devocionalController.getDevocionalByWriterId(req, res));

export default router;
