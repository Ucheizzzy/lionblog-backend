import { Router } from 'express'
const router = Router()
import {
  blockUser,
  followingUser,
  unFollowingUser,
  getProfile,
  profileViewers,
  unBlockUser,
} from '../controllers/userController.js'

router.route('/profile').get(getProfile)
router.route('/block/:userIdToBlock').patch(blockUser)
router.route('/unblock/:userIdToUnBlock').patch(unBlockUser)
router.route('/profile-viewer/:userIdProfileViewed').get(profileViewers)

router.route('/following/:userToFollowId').patch(followingUser)
router.route('/unFollowing/:userToUnFollowId').patch(unFollowingUser)
export default router
