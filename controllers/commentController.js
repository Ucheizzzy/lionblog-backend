import { StatusCodes } from 'http-status-codes'
import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

export const createComment = async (req, res) => {
  const { message } = req.body
  const { postId } = req.params
  const comment = await Comment.create({
    message,
    author: req.user.userId,
    postId,
  })
  //associate post to comments
  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment._id },
    },
    {
      new: true,
    }
  )
  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'comment added successfully', comment })
}
export const updateComment = async (req, res) => {
  const { id } = req.params
  const comment = await Comment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'comment updated successfully', comment })
}
export const deletedComment = async (req, res) => {
  const { id } = req.params
  const comment = await Comment.findByIdAndDelete(id)
  res
    .status(StatusCodes.OK)
    .json({ msg: 'comment deleted successfully', comment })
}
