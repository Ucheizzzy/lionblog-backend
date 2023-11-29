import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { BadRequestError } from '../errors/customError.js'

// @desc get profile
// @route GET /api/v1/users/profile
// @access private
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId)
    .populate({
      path: 'posts',
      model: 'Post',
    })
    .populate({
      path: 'following',
      model: 'User',
      select: 'username email role',
    })
    .populate({
      path: 'followers',
      model: 'User',
      select: 'username email role',
    })
    .populate({
      path: 'blockedUsers',
      model: 'User',
      select: 'username email role',
    })
    .populate({
      path: 'profileViewers',
      model: 'User',
      select: 'username email role',
    })
  res.status(StatusCodes.OK).json({ msg: 'I am the profile route', user })
}

// @desc block user
// @route patch /api/v1/users/block/:userIdToBlock
// @access private
export const blockUser = async (req, res) => {
  //get the user to block from params
  const { userIdToBlock } = req.params
  const findUserToBlock = await User.findById(userIdToBlock).select(
    'username email role _id'
  )
  if (!findUserToBlock) throw new BadRequestError('user to block not found')
  // user who is blocking form cookie
  const userBlocking = req.user.userId
  if (userIdToBlock.toString() === userBlocking.toString())
    throw new BadRequestError('You cannot block yourself')

  //find the logged in or current User
  const currentUser = await User.findById(userBlocking)
  //ensure you do not block twice
  if (currentUser.blockedUsers.includes(userIdToBlock))
    throw new BadRequestError('User has already been blocked')

  currentUser.blockedUsers.push(userIdToBlock)
  await currentUser.save()
  res
    .status(StatusCodes.OK)
    .json({ msg: 'You blocked this user', findUserToBlock })
}

// @desc unblock user
// @route patch /api/v1/users/unblock/:userIdToBlock
// @access private
export const unBlockUser = async (req, res) => {
  //find the user to block in params
  const { userIdToUnBlock } = req.params
  const findUserToUnblock = await User.findById(userIdToUnBlock).select(
    'username email role _id'
  )
  if (!findUserToUnblock) throw new BadRequestError('user not found')
  //get the current user
  const userIdUnblocking = req.user.userId
  const currentUser = await User.findById(userIdUnblocking).populate(
    'blockedUsers'
  )
  //check if user is blocked before unblocking. Why would we want to do this?
  // if (!currentUser.blockedUsers.includes(userIdToUnBlock))
  //   throw new BadRequestError('User not block')

  //remove the user from the blockedUser array
  currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => {
    id.toString() !== userIdToUnBlock.toString()
  })
  currentUser.save()

  res.status(StatusCodes.OK).json({ msg: 'User unblocked', findUserToUnblock })
}

// @desc profile views
// @route patch /api/v1/users/profile-view/:userIdVProfileViewed
// @access private
export const profileViewers = async (req, res) => {
  //get the id of the user to view from params
  const { userIdProfileViewed } = req.params
  const userProfileViewed = await User.findById(userIdProfileViewed)
  if (!userProfileViewed) throw new BadRequestError('User profile not found')

  // currentUser
  const currentUserId = req.user.userId

  //check from the user who is being viewed perspective
  if (userProfileViewed.profileViewers.includes(currentUserId))
    throw new BadRequestError('You have viewed this profile ')

  userProfileViewed.profileViewers.push(currentUserId)
  await userProfileViewed.save()
  res
    .status(StatusCodes.OK)
    .json({ msg: 'You have viewed this profile', userProfileViewed })
}

// @desc following users
// @route patch /api/v1/users/following/:userIdToFollow
// @access private
export const followingUser = async (req, res) => {
  //current user
  const currentUserId = req.user.userId
  //user to follow
  const { userToFollowId } = req.params
  const userToFollow = await User.findById(userToFollowId)
  //users cannot follow themselves
  if (currentUserId.toString() === userToFollowId.toString()) {
    throw new BadRequestError('you cannot follow yourself')
  }

  //push the user to follow into the current user following field
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: { following: userToFollowId },
    },
    {
      new: true,
    }
  )
  //push the current user into the user to follow followers table
  await User.findByIdAndUpdate(
    userToFollowId,
    {
      $addToSet: { followers: currentUserId },
    },
    {
      new: true,
    }
  )

  res
    .status(StatusCodes.OK)
    .json({ msg: `You have followed ${userToFollow.username}` })
}

// @desc unFollowing users
// @route patch /api/v1/users/unFollowing/:userToUnFollowId
// @access private
export const unFollowingUser = async (req, res) => {
  //get the current user
  const currentUserId = req.user.userId
  //get the user to unFollow
  const { userToUnFollowId } = req.params
  const userToUnFollow = await User.findById(userToUnFollowId)
  //you cannot unFollow yourself
  if (currentUserId.toString() === userToUnFollowId.toString()) {
    throw new BadRequestError('You cannot follow and unFollow yourself')
  }
  //remove the id from the current userID
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToUnFollowId },
    },
    { new: true }
  )
  //remove current user id to unFollow back
  await User.findByIdAndUpdate(
    userToUnFollowId,
    {
      $pull: { followers: currentUserId },
    },
    { new: true }
  )
  res
    .status(StatusCodes.OK)
    .json({ msg: `You have unFollowed ${userToUnFollow.username}` })
}
