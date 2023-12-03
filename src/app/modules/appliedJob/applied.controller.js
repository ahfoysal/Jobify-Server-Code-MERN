const sendResponse = require('../../../shared/sendResponse')
const httpStatus = require('http-status')
const catchAsync = require('../../../shared/catchAsync')
const AppliedService = require('./applied.service')

const apply = catchAsync(async (req, res) => {
  const { id } = req.user

  const { jobID, ...restData } = req.body
  console.log(req.body, jobID)
  const result = await AppliedService.apply(jobID, id, restData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job Applied successfully!',
    data: result,
  })
})
const applied = catchAsync(async (req, res) => {
  const user = req.user

  const result = await AppliedService.applied(user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applied jobs retrieved successfully!',
    data: result,
  })
})

const AppliedController = {
  apply,

  applied,
}

module.exports = AppliedController
