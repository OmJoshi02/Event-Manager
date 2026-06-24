import express, { Router } from 'express'
import { health, loginUser, registerUser } from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { getProfile, updateProfile, getUsers, deleteUser } from '../controllers/userController.js'
import {profileSchema} from '../zodValidator/authValidation.js'
import validate from '../middleware/validate.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = Router()

router.get('/health', health)
router.post('/register', registerUser)
router.post('/login', loginUser)

router.get(
    '/profile',
    authMiddleware,
    getProfile
)

router.put(
    '/profile',
    authMiddleware,
    validate(profileSchema),
    updateProfile
)

router.get(
    '/users',
    authMiddleware,
    adminMiddleware,
    getUsers
)

router.delete(
    '/users/:id',
    authMiddleware,
    adminMiddleware,
    deleteUser
)

// router.get('/me', authMiddleware, (req, res) => {
//     res.status(200).json({
//         user: req.user
//     })
// })


export default router