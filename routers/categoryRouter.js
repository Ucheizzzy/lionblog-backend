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
import {
  validateCategoryInput,
  validateIdParams,
} from '../middleware/validationMiddleware.js'

const router = Router()

router
  .route('/')
  .post(
    authenticatedUser,
    authorizePermission('admin'),
    validateCategoryInput,
    createCategory
  )
  .get(getCategories)
router
  .route('/:id')
  .patch(
    authenticatedUser,
    authorizePermission('admin'),
    validateIdParams,
    validateCategoryInput,
    updateCategory
  )
  .delete(
    authenticatedUser,
    authorizePermission('admin'),
    validateIdParams,
    deleteCategory
  )

export default router
