import { Router } from 'express'
const router = Router()
import {
  blockUser,
  getProfile,
  profileViewers,
  unBlockUser,
} from '../controllers/userController.js'
import { authenticatedUser } from '../middleware/authMiddleware.js'

router.route('/profile').get(getProfile)
router.route('/block/:userIdToBlock').patch(authenticatedUser, blockUser)
router.route('/unblock/:userIdToUnBlock').patch(authenticatedUser, unBlockUser)
router
  .route('/profile-viewer/:userIdProfileViewed')
  .get(authenticatedUser, profileViewers)
export default router
