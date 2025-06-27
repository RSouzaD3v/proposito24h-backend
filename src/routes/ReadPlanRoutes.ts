import { Router } from 'express';
import { ReadPlan } from '../controllers/ReadPlanController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { json } from 'body-parser';

const router = Router();

const readPlan = new ReadPlan();

router.use(authMiddleware);

router.post('/create', json(), (req, res) => readPlan.createReadPlan(req, res));
router.put('/update/:id', json(), (req, res) => readPlan.updateReadPlan(req, res));
router.put('/update-day/:id', json(), (req, res) => readPlan.updateDay(req, res));
router.post('/create-newday/:id', json(), (req, res) => readPlan.createNewDay(req, res));
router.get('/findall-by-authorid', json(), (req, res) => readPlan.getAllByAuthorId(req, res));
router.get('/findunique-by-id/:id', json(), (req, res) => readPlan.getUnicById(req, res));
router.delete('/delete/:id', json(), (req, res) => readPlan.deleteReadPlanById(req, res));
router.delete('/day/delete/:id', (req, res) => readPlan.deleteDay(req, res));

export default router;