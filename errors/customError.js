import { StatusCodes } from 'http-status-codes'

export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Not-Found Error'
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Bad request error'
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}
export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'unauthenticated error'
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Unauthorized error'
    this.statusCode = StatusCodes.FORBIDDEN
  }
}
