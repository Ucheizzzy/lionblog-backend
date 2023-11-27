import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { comparePassword, hashedPassword } from '../utils/passwordUtils.js'
import { BadRequestError } from '../errors/customError.js'
import { createJWT } from '../utils/tokenUtils.js'
import { sendEmail } from '../utils/sendEmail.js'
import crypto from 'crypto'
// @desc Register a new user
// @route POST /api/v1/auth/register
// @access public
export const register = async (req, res) => {
  const isFirstLogin = (await User.countDocuments()) === 0
  req.body.role = isFirstLogin ? 'admin' : 'user'
  const hashed = await hashedPassword(req.body.password)
  req.body.password = hashed

  const user = await User.create(req.body)
  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'User created successfully', user })
}

// @desc Login a new user
// @route POST /api/v1/auth/login
// @access public
export const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password))

  if (!isValidUser) throw new BadRequestError('invalid credentials')
  //update lastLogin
  user.lastLogin = new Date()
  //create token
  const token = createJWT({ userId: user._id, role: user.role })
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  })
  res.status(StatusCodes.OK).json({ msg: 'User logged in successfully', user })
}
// @desc Logout a new user
// @route GET /api/v1/auth/logout
// @access public
export const logout = async (req, res) => {
  res
    .clearCookie('token')
    .status(StatusCodes.OK)
    .json({ msg: 'user logout successful' })
}

// @desc forgot password
// @route patch /api/v1/auth/forgot-password
// @access public
export const forgotPassword = async (req, res) => {
  const { email } = req.body

  //find the user
  const userFound = await User.findOne({ email })
  if (!userFound) {
    throw new BadRequestError('No email found, please sign up..')
  }
  //create the token
  const resetToken = await userFound.generatePasswordResetToken()
  //save the user
  await userFound.save()
  //send email
  sendEmail(email, resetToken)
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Password Reset Email Sent', resetToken })
}

// @desc reset password
// @route patch /api/v1/auth/reset-password/:resetToken
// @access public

export const resetPassword = async (req, res) => {
  const { resetToken } = req.params
  const { password } = req.body

  //convert the reset token to what was actually saved in the db
  const cryptoToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  //find the user by the crypto token
  const userFound = await User.findOne({
    passwordResetToken: cryptoToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!userFound)
    throw new BadRequestError(
      'password reset token invalid or expired. Reset again!'
    )

  //update the password
  const hash = await hashedPassword(password)
  userFound.password = hash
  userFound.passwordResetToken = undefined
  userFound.passwordResetExpires = undefined
  await userFound.save()

  res
    .clearCookie('token')
    .status(StatusCodes.OK)
    .json({ msg: 'Password Reset Successfully' })
}

// @desc send account verification email
// @route patch /api/v1/auth/account-verification-email
// @access private
export const accountVerification = async (req, res) => {
  //find the logged in user by id
  const user = await User.findById(req.user.useId)
  if (!user) throw new BadRequestError('user not found')
}
