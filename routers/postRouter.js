import { Router } from 'express'
import {
  createPost,
  deletePost,
  disLikePost,
  getAllPost,
  getSinglePost,
  likePost,
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

router
  .route('/like/:id')
  .patch(authenticatedUser, globalValidateIdParams(Post), likePost)

router
  .route('/dislike/:id')
  .patch(authenticatedUser, globalValidateIdParams(Post), disLikePost)
export default router
