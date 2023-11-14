import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/categoryController.js'

const router = Router()

router.route('/').post(createCategory).get(getCategories)
router.route('/:id').patch(updateCategory).delete(deleteCategory)

export default router
