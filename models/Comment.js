import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
  {
    message: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Comment', CommentSchema)
