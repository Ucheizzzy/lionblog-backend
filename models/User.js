import mongoose from 'mongoose'

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
    accountVerificationExpires: String,
  },
  { timestamps: true }
)

UserSchema.methods.toJSON = function () {
  let obj = this.toObject()
  delete obj.password
  return obj
}
export default mongoose.model('User', UserSchema)
