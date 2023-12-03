const catchAsync = require('../../../shared/catchAsync')
const sendResponse = require('../../../shared/sendResponse')
const httpStatus = require('http-status')
const UserService = require('./user.service')

const createUser = catchAsync(async (req, res) => {
  const userData = req.body
  const result = await UserService.createUser(userData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  })
})

const UserController = {
  createUser,
}
module.exports = UserController
