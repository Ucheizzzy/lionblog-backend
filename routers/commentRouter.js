import { Router } from 'express'
import {
  createComment,
  deletedComment,
  updateComment,
} from '../controllers/commentController.js'
import { globalValidateIdParams } from '../middleware/validationMiddleware.js'

import Post from '../models/Post.js'

const router = Router()

router.route('/:postId').post(createComment)
router.route('/:id').patch(updateComment).delete(deletedComment)
export default router
