import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'

// @desc get profile
// @route GET /api/v1/users/profile
// @access private
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    'username email role _id'
  )
  res.status(StatusCodes.OK).json({ msg: 'I am the profile route', user })
}
