import { readFile } from 'fs/promises'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import Post from './models/Post.js'
import User from './models/User.js'

try {
  await mongoose.connect(process.env.MONGO_URL)
  const user = await User.findOne({ username: 'lion' })
  const jsonPosts = JSON.parse(
    await readFile(new URL('./utils/mockData.json', import.meta.url))
  )
  const posts = jsonPosts.map((post) => {
    return { ...post, author: user._id, category: '655b7b00c6cd0700e9c69d01' }
  })
  await Post.deleteMany({ author: user._id })
  await Post.create(posts)
  console.log('Success!!!')
  process.exit(0)
} catch (error) {
  console.log(error)
  process.exit(1)
}
