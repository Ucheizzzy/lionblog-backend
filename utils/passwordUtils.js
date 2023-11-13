import bcrypt from 'bcryptjs'

export const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashed_password = await bcrypt.hash(password, salt)
  return hashed_password
}

export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}
