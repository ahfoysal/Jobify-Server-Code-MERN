const httpStatus = require('http-status')
const sendResponse = require('../../../shared/sendResponse')
const AuthService = require('./auth.service')
const catchAsync = require('../../../shared/catchAsync')
const config = require('../../../config')
const ApiError = require('../../../errors/ApiError')

const login = catchAsync(async (req, res) => {
  const data = req.body

  const result = await AuthService.login(data)
  // Refresh token as a cookie
  const { refreshToken, ...others } = result
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions)
  // Delete
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: others,
  })
})
const providerLogin = catchAsync(async (req, res) => {
  const token = req.headers.authorization

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Request')
  }
  const result = await AuthService.providerLogin(token)
  // Refresh token as a cookie
  // const { refreshToken, ...others } = result
  // const cookieOptions = {
  //   secure: config.env === 'production',
  //   httpOnly: true,
  // }
  // res.cookie('refreshToken', refreshToken, cookieOptions)
  // // Delete
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: result,
  })
})

// const refreshToken = catchAsync(async (req, res) => {
//   const { refreshToken } = req.cookies
//   const result = await AuthService.refreshToken(refreshToken)
//   const cookieOptions = {
//     secure: config.env === 'production',
//     httpOnly: true,
//   }
//   res.cookie('refreshToken', refreshToken, cookieOptions)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Access token retrieved successfully!',
//     data: result,
//   })
// })

const changePassword = catchAsync(async (req, res) => {
  const user = req.user
  const { ...passwordData } = req.body

  await AuthService.changePassword(user, passwordData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
  })
})
const me = catchAsync(async (req, res) => {
  const token = req.user

  const result = await AuthService.me(token)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  })
})

const AuthController = {
  login,
  changePassword,
  me,
  providerLogin,
}

module.exports = AuthController
