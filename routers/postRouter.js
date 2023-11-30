import { Router } from 'express'
import multer from 'multer'
import {
  claps,
  createPost,
  deletePost,
  disLikePost,
  getAllPost,
  getPublicPost,
  getSinglePost,
  likePost,
  schedule,
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
import { storage } from '../utils/fileUpload.js'
import Post from '../models/Post.js'
const router = Router()

const upload = multer({ storage })
router
  .route('/')
  .post(
    authenticatedUser,
    checkAccountVerification,
    upload.single('image'),
    createPost
  )
  .get(authenticatedUser, getAllPost)
  .get(getPublicPost)

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
router
  .route('/claps/:id')
  .patch(authenticatedUser, globalValidateIdParams(Post), claps)
router
  .route('/schedule/:id')
  .patch(authenticatedUser, globalValidateIdParams(Post), schedule)
export default router
