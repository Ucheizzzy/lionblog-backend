import { Router } from 'express'
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import {
  registerInputValidation,
  validateLoginInput,
} from '../middleware/validationMiddleware.js'

const router = Router()

router.route('/register').post(registerInputValidation, register)
router.route('/login').post(validateLoginInput, login)
router.route('/logout').get(logout)
router.route('/forget-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)

export default router
