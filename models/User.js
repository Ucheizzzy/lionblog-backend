import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: String,
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ['bronze', 'silver', 'gold'],
      default: 'bronze',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    bio: String,
    location: String,
    notificationPreferences: {
      email: { type: String, default: true },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'prefer not to say', 'non-binary'],
    },
    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    passwordResetToken: String,
    passwordResetExpires: Date,
    accountVerificationToken: String,
    accountVerificationExpires: Date,
  },
  { timestamps: true }
)

UserSchema.methods.toJSON = function () {
  let obj = this.toObject()
  delete obj.password
  return obj
}

UserSchema.methods.generatePasswordResetToken = function () {
  //generate the token using crypto
  const resetToken = crypto.randomBytes(20).toString('hex')
  //assign the token to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  //update the passwordResetExpires with when to expire
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 //10mins
  return resetToken
}

UserSchema.methods.generateAccVerifyToken = function () {
  const verifyToken = crypto.randomBytes(20).toString('hex')
  this.accountVerificationToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex')
  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000
  return verifyToken
}
export default mongoose.model('User', UserSchema)
