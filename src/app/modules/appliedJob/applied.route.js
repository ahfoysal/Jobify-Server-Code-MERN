const express = require('express')
const AppliedController = require('./applied.controller')
const auth = require('../../middlewares/auth')
const { ENUM_USER_ROLE } = require('../../../enums/user')

const router = express.Router()

router.post(
  '/apply',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  AppliedController.apply,
)
router.get(
  '/applied',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),

  AppliedController.applied,
)

exports.AppliedRoutes = router
