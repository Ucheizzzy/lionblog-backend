import { body, param, validationResult } from 'express-validator'
import { BadRequestError, NotFoundError } from '../errors/customError.js'
import User from '../models/User.js'
import Category from '../models/Category.js'
import mongoose from 'mongoose'
import Post from '../models/Post.js'
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

export const validateLoginInput = withValidationErrors([
  body('username').notEmpty().withMessage('Username field cannot be empty'),
  body('password')
    .notEmpty()
    .withMessage('Please enter the password you registered with'),
])
export const validateCategoryInput = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('your category must have a name')
    .custom(async (name) => {
      const category = await Category.findOne({ name })
      if (category) throw new BadRequestError('category already exist')
    }),
])

export const validateIdParams = withValidationErrors([
  param('id').custom(async (value) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value)
    if (!isValidMongoId) throw new BadRequestError('invalid mongo id')
    const category = await Category.findById(value)
    if (!category) throw new NotFoundError(`No category with is ${value}`)
  }),
])
export const globalValidateIdParams = (Model) => {
  return withValidationErrors([
    param('id').custom(async (value) => {
      const isValidMongoId = mongoose.Types.ObjectId.isValid(value)
      if (!isValidMongoId) throw new BadRequestError('invalid mongo id')
      const model = await Model.findById(value)
      if (!model) throw new NotFoundError(`None found with ${value}`)
    }),
  ])
}

export const validatePostInputs = withValidationErrors([
  body('title').notEmpty().withMessage('Post title cannot be empty'),
  body('content')
    .notEmpty()
    .withMessage('The content of post cannot be empty')
    .custom(async (content) => {
      const post = await Post.findOne({ content })
      if (post) throw new BadRequestError('Post content already exist')
    }),
])
