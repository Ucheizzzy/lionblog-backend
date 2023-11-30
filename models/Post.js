import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: String,
    image: {
      type: String,
      required: true,
    },
    claps: {
      type: Number,
      default: 0,
    },
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shares: {
      type: Number,
      default: 0,
    },
    postViews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    schedulePublished: {
      type: Date,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Post', PostSchema)
