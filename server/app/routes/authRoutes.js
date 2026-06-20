import express, { Router } from 'express'
import { health, loginUser, registerUser } from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.get('/health', health)
router.post('/register', registerUser)
router.post('/login', loginUser)


// router.get('/me', authMiddleware, (req, res) => {
//     res.status(200).json({
//         user: req.user
//     })
// })


export default router