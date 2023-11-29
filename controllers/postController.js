import { StatusCodes } from 'http-status-codes'
import Post from '../models/Post.js'
import User from '../models/User.js'
import Category from '../models/Category.js'
import { BadRequestError } from '../errors/customError.js'

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

// @desc all post
// @route GET /api/v1/posts/
// @access private
export const getAllPost = async (req, res) => {
  const post = await Post.find({}).populate('comments')
  res.status(StatusCodes.OK).json({ msg: 'All post ', post })
}
// @desc single post
// @route GET /api/v1/posts/:id
// @access public
export const getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) throw new BadRequestError('post does not exist')
  res.status(StatusCodes.OK).json({ msg: 'All post ', post })
}

// @desc update post
// @route PATCH /api/v1/posts/:id
// @access private
export const updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  res.status(StatusCodes.OK).json({ msg: 'Post updated successfully ', post })
}
// @desc DELETE post
// @route dELETE /api/v1/posts/:id
// @access private
export const deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).json({ msg: 'Post deleted successfully ', post })
}

// @desc liking  post
// @route patch /api/v1/posts/likes/:id
// @access private
export const likePost = async (req, res) => {
  const { userId } = req.user

  //push the user into the liked post field
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: userId },
    },
    { new: true }
  )
  //remove the user from the dislikes array if present
  post.disLikes = post.disLikes.filter(
    (id) => id.toString() !== userId.toString()
  )
  await post.save()
  res.status(StatusCodes.OK).json({ msg: 'Post liked successfully ', post })
}

// @desc dis liking  post
// @route patch /api/v1/posts/dislike/:id
// @access private
export const disLikePost = async (req, res) => {
  const { userId } = req.user

  //push the user into the liked post field
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { disLikes: userId },
    },
    { new: true }
  )
  //remove the user from the dislikes array if present
  post.likes = post.likes.filter((id) => id.toString() !== userId.toString())
  await post.save()
  res.status(StatusCodes.OK).json({ msg: 'Post disliked successfully ', post })
}

// @desc clapping for a post
// @route patch /api/v1/posts/claps/:id
// @access private

export const claps = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { claps: 1 },
    },
    { new: true }
  )
  res.status(StatusCodes.OK).json({ msg: 'You clapped for this post', post })
}
// @desc scheduling a post
// @route patch /api/v1/posts/schedule/:id
// @access private
export const schedule = async (req, res) => {
  const { scheduleDate } = req.body
  if (!scheduleDate) throw new BadRequestError('Date is required')
  //check if the user is the owner of the post
  const post = await Post.findById(req.params.id)
  if (post.author.toString() !== req.user.userId.toString()) {
    throw new BadRequestError(`You cannot schedule someone else's post`)
  }
  //check if the scheduled date is in the past
  const currentDate = new Date()
  const plannedDate = new Date(scheduleDate)
  if (plannedDate < currentDate) {
    throw new BadRequestError('The scheduled date cannot be in the past.')
  }
  post.schedulePublished = scheduleDate
  await post.save()
  res.status(StatusCodes.OK).json({ msg: 'Post scheduled', post })
}
