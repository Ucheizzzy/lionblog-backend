import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { hashedPassword } from '../utils/passwordUtils.js'

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
export const login = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'I am the login route' })
}
