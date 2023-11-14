import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { comparePassword, hashedPassword } from '../utils/passwordUtils.js'
import { BadRequestError } from '../errors/customError.js'
import { createJWT } from '../utils/tokenUtils.js'

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
  const oneHour = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneHour),
    secure: process.env.NODE_ENV,
  })
  res.status(StatusCodes.OK).json({ msg: 'User logged in successfully', user })
}
