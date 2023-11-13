import { StatusCodes } from 'http-status-codes'

// @desc Register a new user
// @route POST /api/v1/auth/register
// @access public
export const register = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'I am the register route' })
}
export const login = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'I am the login route' })
}
