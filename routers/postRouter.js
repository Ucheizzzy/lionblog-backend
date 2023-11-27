import { Router } from 'express'
import {
  createPost,
  deletePost,
  getAllPost,
  getSinglePost,
  updatePost,
} from '../controllers/postController.js'
import {
  authenticatedUser,
  checkAccountVerification,
} from '../middleware/authMiddleware.js'
import {
  globalValidateIdParams,
  validatePostInputs,
} from '../middleware/validationMiddleware.js'
import Post from '../models/Post.js'
const router = Router()

router
  .route('/')
  .post(
    authenticatedUser,
    checkAccountVerification,
    validatePostInputs,
    createPost
  )
  .get(getAllPost)
router
  .route('/:id')
  .get(globalValidateIdParams(Post), getSinglePost)
  .patch(authenticatedUser, globalValidateIdParams(Post), updatePost)
  .delete(authenticatedUser, globalValidateIdParams(Post), deletePost)
export default router
