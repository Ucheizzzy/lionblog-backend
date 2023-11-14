import { StatusCodes } from 'http-status-codes'

export const createCategory = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ msg: 'created category' })
}
export const getCategories = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'all categories' })
}
export const updateCategory = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'update category' })
}
export const deleteCategory = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'delete category' })
}
