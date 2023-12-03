const express = require('express')
const { JobRoutes } = require('../modules/job/job.route')
const { UserRoutes } = require('../modules/user/user.route')
const { AuthRoutes } = require('../modules/auth/auth.route')
const { AppliedRoutes } = require('../modules/appliedJob/applied.route')

const router = express.Router()

const routes = [
  {
    path: '/jobs',
    route: JobRoutes,
  },
  {
    path: '/job',
    route: AppliedRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

routes.forEach(route => {
  router.use(route.path, route.route)
})

module.exports = router
