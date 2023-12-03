const express = require('express')
const JobController = require('./job.controller')
const auth = require('../../middlewares/auth')
const { ENUM_USER_ROLE } = require('../../../enums/user')

const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JobController.createJob,
)
router.get('/', JobController.getAllJob)
router.get('/:id', JobController.getSingleJob)
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JobController.updateJob,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JobController.deleteJob,
)

exports.JobRoutes = router
