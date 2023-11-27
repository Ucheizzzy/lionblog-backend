import nodemailer from 'nodemailer'
import { BadRequestError } from '../errors/customError.js'
import * as dotenv from 'dotenv'
dotenv.config()

export const sendVerificationEmail = async (to, verifyToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    })

    //create message
    const message = {
      from: 'uchechukwuobiakor@gmail.com',
      to,
      subject: 'Account Verification Email',
      html: `
        <p>Hello, you are receiving this email because you (or someone else) have requested to verify your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p><a href="http://localhost:3000/api/v1/account-verification/${verifyToken}">Account verification Link</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged. Token expires in 10 mins. Thank you.</p>
        `,
    }
    //send the email
    const info = await transporter.sendMail(message)
    console.log('Email sent', info.messageId)
  } catch (error) {
    console.log(error)
    throw new BadRequestError(`Email failed to send: ${error}`)
  }
}
