import express, { Router } from 'express'

import { createEvent, deleteEvent, getEvent, getEventById, updateEvent } from '../controllers/eventController.js'

import validate from '../middleware/validate.js'
import { eventSchema } from '../validator/eventValidation.js'

const router = Router()

router.post('/add',validate(eventSchema), createEvent)
router.get('/show', getEvent)
router.get('/show/:id', getEventById)
router.put('/update/:id', validate(eventSchema),updateEvent)
router.delete('/delete/:id', deleteEvent)

export default router