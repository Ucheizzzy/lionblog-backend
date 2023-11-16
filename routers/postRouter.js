import { Router } from 'express'
import { createPost } from '../controllers/postController.js'
import { authenticatedUser } from '../middleware/authMiddleware.js'
const router = Router()

router.route('/').post(authenticatedUser, createPost)

export default router
