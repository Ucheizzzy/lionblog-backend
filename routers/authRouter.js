import { Router } from 'express'
import { register, login } from '../controllers/authController.js'
import {
  registerInputValidation,
  validateLoginInput,
} from '../middleware/validationMiddleware.js'

const router = Router()

router.route('/register').post(registerInputValidation, register)
router.route('/login').post(validateLoginInput, login)

export default router
