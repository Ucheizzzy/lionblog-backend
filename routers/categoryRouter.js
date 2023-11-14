import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/categoryController.js'
import {
  authenticatedUser,
  authorizePermission,
} from '../middleware/authMiddleware.js'

const router = Router()

router
  .route('/')
  .post(authenticatedUser, authorizePermission('admin'), createCategory)
  .get(getCategories)
router.route('/:id').patch(updateCategory).delete(deleteCategory)

export default router
