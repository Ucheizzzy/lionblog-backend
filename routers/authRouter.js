import { Router } from 'express'
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  accountVerification,
  verifyAccount,
} from '../controllers/authController.js'
import {
  registerInputValidation,
  validateLoginInput,
} from '../middleware/validationMiddleware.js'
import { authenticatedUser } from '../middleware/authMiddleware.js'

const router = Router()

router.route('/register').post(registerInputValidation, register)
router.route('/login').post(validateLoginInput, login)
router.route('/logout').get(logout)
router.route('/forget-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)
router
  .route('/account-verification-email')
  .patch(authenticatedUser, accountVerification)
router
  .route('/account-verification/:verifyToken')
  .patch(authenticatedUser, verifyAccount)

export default router
