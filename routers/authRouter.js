import { Router } from 'express'
import { register, login } from '../controllers/authController.js'
import { registerInputValidation } from '../middleware/validationMiddleware.js'

const router = Router()

router.route('/register').post(registerInputValidation, register)
router.route('/login').post(login)

export default router
