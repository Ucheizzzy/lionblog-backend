import 'express-async-errors'
import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import morgan from 'morgan'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import mongoose, { connect } from 'mongoose'
import cookieParser from 'cookie-parser'
import { authenticatedUser } from './middleware/authMiddleware.js'
// routers
import authRouter from './routers/authRouter.js'
import usersRouter from './routers/userRouter.js'
import categoryRouter from './routers/categoryRouter.js'
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authenticatedUser, usersRouter)
app.use('/api/v1/categories', categoryRouter)

app.get('/', (req, res) => {
  res.send('Hello')
})
//not found middleware
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})
// error handler middleware
app.use(errorHandlerMiddleware)
const port = process.env.PORT || 3000

try {
  await mongoose, connect(process.env.MONGO_URL)
  app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
