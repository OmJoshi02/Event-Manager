import express, { Router } from 'express'

import { createEvent, deleteEvent, getEvent, getEventById, updateEvent } from '../controllers/eventController.js'

import validate from '../middleware/validate.js'
import { eventSchema } from '../validator/eventValidation.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = Router()

router.post('/add',authMiddleware,adminMiddleware,validate(eventSchema), createEvent)
router.get('/show', getEvent)
router.get('/show/:id', getEventById)
router.put('/update/:id',authMiddleware,adminMiddleware, validate(eventSchema),updateEvent)
router.delete('/delete/:id',authMiddleware,adminMiddleware, deleteEvent)

export default router