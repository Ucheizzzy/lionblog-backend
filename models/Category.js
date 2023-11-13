import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shares: {
      type: Number,
      default: 0,
    },
    posts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Category', CategorySchema)
