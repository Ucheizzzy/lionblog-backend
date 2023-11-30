import { StatusCodes } from 'http-status-codes'
import Post from '../models/Post.js'
import User from '../models/User.js'
import Category from '../models/Category.js'
import { BadRequestError } from '../errors/customError.js'

// @desc create post
// @route POST /api/v1/posts/
// @access private
export const createPost = async (req, res) => {
  // console.log(req.file.path)
  req.body.author = req.user.userId
  req.body.image = req.file.path
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
  //get the current user
  const currentUserId = req.user.userId
  const usersBlockingCurrentUser = await User.find({
    blockedUsers: currentUserId,
  })
  //map through them and retrieve the ids
  const idsOfThoseBlockingCurrentUser = usersBlockingCurrentUser?.map(
    (user) => user?._id
  )
  // console.log(idsOfThoseBlockingCurrentUser)
  const currentTime = new Date()
  let query = {
    author: { $nin: idsOfThoseBlockingCurrentUser },
    $or: [
      {
        schedulePublished: { $lte: currentTime },
        schedulePublished: null,
      },
    ],
  }

  const { search, sort } = req.query
  //search both title and content
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ]
  }
  // if (category !== 'all') {
  //   query.category = category
  // }
  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'title',
    'z-a': 'title',
  }
  const sortKey = sortOptions[sort] || sortOptions.newest

  //setting up pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 2
  const skip = (page - 1) * limit
  const posts = await Post.find(query)
    .populate({
      path: 'author',
      model: 'User',
      select: 'username email role',
    })
    .populate({ path: 'category', model: 'Category', select: 'name' })
    .sort(sortKey)
    .skip(skip)
    .limit(limit)

  const totalPosts = await Post.countDocuments(query)
  const numOfPages = Math.ceil(totalPosts / limit)
  res.status(StatusCodes.OK).json({
    msg: 'All post ',
    totalPosts,
    numOfPages,
    currentPage: page,
    posts,
  })
}
// @desc single post
// @route GET /api/v1/posts/:id
// @access public
export const getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: 'author',
      model: 'User',
      select: 'username email role',
    })
    .populate({
      path: 'category',
      model: 'Category',
      select: 'name',
    })
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: {
        path: 'author',
        select: 'username',
      },
    })

  if (!post) throw new BadRequestError('post does not exist')
  res.status(StatusCodes.OK).json({ msg: 'All post ', post })
}

// @desc public post
// @route GET /api/v1/posts
// @access public
export const getPublicPost = async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('category')
  res.status(StatusCodes.OK).json({ msg: 'All public post', posts })
}

// @desc update post
// @route PATCH /api/v1/posts/:id
// @access private
export const updatePost = async (req, res) => {
  const postFound = await Post.findById(req.params.id)
  const { title, category, content } = req.body

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      image: req?.file?.path ? req?.file?.path : postFound?.image,
      title: title ? title : postFound?.title,
      category: category ? category : postFound?.category,
      content: content ? content : postFound?.content,
    },
    {
      new: true,
      runValidators: true,
    }
  )
  res.status(StatusCodes.OK).json({ msg: 'Post updated successfully ', post })
}
// @desc DELETE post
// @route dELETE /api/v1/posts/:id
// @access private
export const deletePost = async (req, res) => {
  const postFound = await Post.findById(req.params.id)
  const isAuthor =
    req.user.userId.toString() === postFound.author._id.toString()
  // console.log(isAuthor)
  if (!isAuthor) throw new BadRequestError('You can only delete your post')
  const post = await Post.findByIdAndDelete(req.params.id)
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Post deleted successfully ', postFound })
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
