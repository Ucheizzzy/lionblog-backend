import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors/customError.js'
import User from '../models/User.js'
import { verifyJWT } from '../utils/tokenUtils.js'

export const authenticatedUser = (req, res, next) => {
  const { token } = req.cookies

  if (!token) throw new UnauthenticatedError('authentication invalid')
  try {
    const { userId, role } = verifyJWT(token)
    // console.log(userId, role)
    req.user = { userId, role }

    next()
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication')
  }
}

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('You are not authorized to see this')
    }
    next()
  }
}
export const checkAccountVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
    user?.isVerified
      ? next()
      : res
          .status(StatusCodes.FORBIDDEN)
          .json({ msg: ' Verify your account first!' })
  } catch (error) {
    throw new BadRequestError('Something went wrong')
  }
}
