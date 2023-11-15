import { StatusCodes } from 'http-status-codes'
import Category from '../models/Category.js'

// @desc create category only for admin
// @route POST /api/v1/categories/
// @access private
export const createCategory = async (req, res) => {
  req.body.author = req.user.userId
  const category = await Category.create(req.body)
  res.status(StatusCodes.CREATED).json({ msg: 'created category', category })
}

// @desc get categories
// @route GET /api/v1/categories/
// @access private
export const getCategories = async (req, res) => {
  const categories = await Category.find({})
  res.status(StatusCodes.OK).json({ msg: 'All categories fetched', categories })
}
export const updateCategory = async (req, res) => {
  const { id } = req.params

  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(StatusCodes.OK).json({ msg: 'update category', updatedCategory })
}
export const deleteCategory = async (req, res) => {
  const { id } = req.params
  await Category.findByIdAndDelete(id)
  res.status(StatusCodes.OK).json({ msg: 'category deleted successfully' })
}
