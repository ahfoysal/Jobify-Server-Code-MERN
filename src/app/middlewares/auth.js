const httpStatus = require('http-status')
const ApiError = require('../../errors/ApiError')
const config = require('../../config')
const { jwtHelpers } = require('../../helpers/jwtHelper')
const User = require('../modules/user/user.model')

const auth =
  (...roles) =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Request')
      }
      let verifiedUser = null

      try {
        verifiedUser = jwtHelpers.verifyToken(token, config.jwt.refresh)
        console.log(verifiedUser)
      } catch (error) {
        console.error('JWT verification failed:', error.message)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Request')
      }
      const { email } = verifiedUser

      const isUserExist = await User.isUserExist(email)
      if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
      }

      req.user = verifiedUser
      if (roles.length && !roles.includes(isUserExist.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
      }
      return next()
    } catch (err) {
      next(err)
    }
  }

module.exports = auth
