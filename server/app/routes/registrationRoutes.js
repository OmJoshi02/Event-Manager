import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import { cancelRegistration, getEventRegistrations, getMyRegistration, registerForEvent } from '../controllers/registrationController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import validate from '../middleware/validate.js';
import { registrationSchema } from '../zodValidator/registrationValidation.js';

const router = Router();

router.post('/', authMiddleware,validate(registrationSchema), registerForEvent)
router.get('/me',authMiddleware ,getMyRegistration)
router.get('/event/:eventId', authMiddleware, adminMiddleware, getEventRegistrations)
router.delete('/:id', authMiddleware, cancelRegistration)

export default router