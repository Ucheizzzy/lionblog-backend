import { StatusCodes } from 'http-status-codes'
import Post from '../models/Post.js'
import User from '../models/User.js'
import Category from '../models/Category.js'

// @desc create post
// @route POST /api/v1/posts/
// @access private
export const createPost = async (req, res) => {
  req.body.author = req.user.userId
  const post = await Post.create(req.body)
  // push the post to the post array in the user model
  await User.findByIdAndUpdate(
    req.user.userId,
    { $push: { posts: post._id } },
    {
      new: true,
    }
  )
  const categoryId = await Category.findById({ _id: req.body.category })
//   console.log(categoryId)
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { posts: post._id } },
      {
        new: true,
      }
    )
  res.status(StatusCodes.CREATED).json({ msg: 'post created', post })
}
