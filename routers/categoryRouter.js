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
  validateCategoryParams,
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
    validateCategoryParams,
    validateCategoryInput,
    updateCategory
  )
  .delete(
    authenticatedUser,
    authorizePermission('admin'),
    validateCategoryParams,
    deleteCategory
  )

export default router
