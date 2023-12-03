const httpStatus = require('http-status')
const User = require('../user/user.model')
const ApiError = require('../../../errors/ApiError')
const { jwtHelpers } = require('../../../helpers/jwtHelper')
const config = require('../../../config')
const serviceAccount = require('../../../shared/serviceAccountKey.json') // Replace with your service account key
const admin = require('firebase-admin')
const UserService = require('../user/user.service')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
const login = async payload => {
  const { email, password } = payload

  // check user exists
  console.log(email)
  const isUserExist = await User.isUserExist(email)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  // generate access token
  const { _id: userId, role, email: userEmail, imageUrl } = isUserExist
  console.log(isUserExist)
  const accessToken = jwtHelpers.generateToken(
    { id: userId, role, email: userEmail, imageUrl },
    config.jwt.secret,
    config.jwt.expires_in,
  )
  const refreshToken = jwtHelpers.generateToken(
    { id: userId, role, email: userEmail },
    config.jwt.refresh,
    config.jwt.refresh_expire_in,
  )
  console.log(refreshToken)
  return { accessToken, refreshToken, user: isUserExist }
}
const providerLogin = async token => {
  // check user exists

  const user = await admin
    .auth()
    .verifyIdToken(token)
    .then(decodedToken => {
      console.log(decodedToken)
      return decodedToken
    })
    .catch(error => {
      // Token verification failed
      console.log(error)
    })

  const isUserExist = await User.isUserExist(user.email)
  if (!isUserExist) {
    const result = await UserService.createUser({
      name: user.name,
      imageUrl: user.picture,
      email: user.email,
      role: 'user',
      password: 'not_provided',
    })

    return result
  }

  const { _id: userId, role, email: userEmail, imageUrl } = isUserExist

  const accessToken = jwtHelpers.generateToken(
    { id: userId, role, email: userEmail, imageUrl },
    config.jwt.secret,
    config.jwt.expires_in,
  )
  const refreshToken = jwtHelpers.generateToken(
    { id: userId, role, email: userEmail },
    config.jwt.refresh,
    config.jwt.refresh_expire_in,
  )
  console.log(refreshToken)
  return { accessToken, refreshToken, user: isUserExist }
}

// const refreshToken = async token => {
//   // verify the token
//   let decodedToken = null
//   try {
//     decodedToken = jwtHelpers.verifyToken(token, config.jwt.refresh)
//   } catch (err) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token')
//   }
//   const { id } = decodedToken
//   const isUserExist = await User.isUserExist(id)
//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
//   }
//   // generate a new access token
//   const accessToken = jwtHelpers.generateToken(
//     { id: id, role: isUserExist.role },
//     config.jwt.secret,
//     config.jwt.expires_in,
//   )
//   return { accessToken }
// }

const changePassword = async (user, payload) => {
  const { oldPassword, newPassword } = payload

  // checking if the user exists
  const isUserExist = await User.findOne({ email: user.email }).select(
    '+password',
  )

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect')
  }

  // data update
  isUserExist.password = newPassword

  // updating using save()
  isUserExist.save()
}
const me = async user => {
  console.log(user.email)
  const userData = await User.findOne({ email: user.email })
    .populate({
      path: 'myJobs',
      populate: {
        path: 'postedBy',
      },
    })
    .exec()

  return { user: userData }
}

const AuthService = {
  login,
  changePassword,
  me,
  providerLogin,
}

module.exports = AuthService
