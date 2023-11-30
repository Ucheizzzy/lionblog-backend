import { v2 as cloudinary } from 'cloudinary'

import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

//create an instance of the cloudinary storage
export const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png', 'jpeg'],
  params: {
    folder: 'lionBlog',
    transformation: [{ width: 300, height: 300, crop: 'limit' }],
  },
})
