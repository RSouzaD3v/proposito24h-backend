import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { AdminController } from '../controllers/AdminController';
import { json } from 'body-parser';

const router = Router();

// ✅ proteção com login
router.use(authMiddleware);

const adminController = new AdminController();

// POST   /admin/writers           # Criar escritor
router.post('/writers', json(), (req, res) => adminController.createWriter(req, res));

// GET    /admin/writers           # Listar escritores
router.get('/writers', (req, res) => adminController.listWriters(req, res));

// GET    /admin/writers/:id       # Detalhes do escritor
router.get('/writers/:id', (req, res) => adminController.writersDetails(req, res));

// PUT    /admin/writers/:id       # Atualizar escritor
router.put('/writers/:id', json(), (req, res) => adminController.updateWriter(req, res));

// DELETE /admin/writers/:id       # Inativar escritor
router.put('/writers/:id', (req, res) => adminController.deleteWriter(req, res));

// GET    /writers/me              # Meu perfil de escritor
router.put('/writers/me', (req, res) => adminController.myProfileWriter(req, res));

// PUT    /writers/me              # Atualizar meu perfil
router.put('/writers/me', json(), (req, res) => adminController.updateMyProfileWriter(req, res));

// GET    /writers/me/metrics      # Minhas métricas
router.put('/writers/me/metrics', (req, res) => adminController.metrics(req, res));


export default router;