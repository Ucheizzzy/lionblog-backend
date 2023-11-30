import { Router } from 'express'
import multer from 'multer'
const router = Router()
import {
  blockUser,
  followingUser,
  unFollowingUser,
  getProfile,
  profileViewers,
  unBlockUser,
  uploadProfilePicture,
  uploadCoverImage,
} from '../controllers/userController.js'
import { storage } from '../utils/fileUpload.js'
//file upload middleware

const upload = multer({ storage })
router.route('/profile').get(getProfile)
router.route('/block/:userIdToBlock').patch(blockUser)
router.route('/unblock/:userIdToUnBlock').patch(unBlockUser)
router.route('/profile-viewer/:userIdProfileViewed').get(profileViewers)

router.route('/following/:userToFollowId').patch(followingUser)
router.route('/unFollowing/:userToUnFollowId').patch(unFollowingUser)
router
  .route('/profile-picture')
  .patch(upload.single('profilePicture'), uploadProfilePicture)
router
  .route('/cover-image')
  .patch(upload.single('coverImage'), uploadCoverImage)
export default router
