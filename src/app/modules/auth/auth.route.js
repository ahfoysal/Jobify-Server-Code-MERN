const express = require('express')
const AuthController = require('./auth.controller')
const auth = require('../../middlewares/auth')
const { ENUM_USER_ROLE } = require('../../../enums/user')

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/provider', AuthController.providerLogin)
router.post(
  '/change-password',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),

  AuthController.changePassword,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),

  AuthController.me,
)

exports.AuthRoutes = router
