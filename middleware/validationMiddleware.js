import { body, param, validationResult } from 'express-validator'
import { BadRequestError } from '../errors/customError.js'
import User from '../models/User.js'
const withValidationErrors = (validationValues) => {
  return [
    validationValues,
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => error.msg)
        throw new BadRequestError(errorMessage)
      }
      next()
    },
  ]
}

export const registerInputValidation = withValidationErrors([
  body('username')
    .notEmpty()
    .withMessage('Your username cannot be empty')
    .custom(async (username) => {
      const user = await User.findOne({ username })
      if (user) {
        throw new BadRequestError('username already exist')
      }
    }),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if (user) {
        throw new BadRequestError('Email already exist')
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 5 })
    .withMessage('Password cannot be less than 5 characters'),
])
