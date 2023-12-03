const sendResponse = require('../../../shared/sendResponse')
const httpStatus = require('http-status')
const catchAsync = require('../../../shared/catchAsync')
const paginationFields = require('../../constants/pagination')
const pick = require('../../../shared/pick')
const JobService = require('./job.service')
const { jobFilterableFields } = require('./job.constant')

const createJob = catchAsync(async (req, res) => {
  const user = req.user

  const result = await JobService.createJob(req.body, user.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job created successfully!',
    data: result,
  })
})
const getAllJob = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields)
  const filters = pick(req.query, jobFilterableFields)
  const result = await JobService.getAllJob(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleJob = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await JobService.getSingleJob(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job retrieved successfully',
    data: result,
  })
})
const updateJob = catchAsync(async (req, res) => {
  const { id } = req.params
  const updatedData = req.body
  const result = await JobService.updateJob(id, updatedData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job updated successfully',
    data: result,
  })
})

const deleteJob = catchAsync(async (req, res) => {
  const { id } = req.params
  const user = req.user
  const result = await JobService.deleteJob(id, user.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  })
})
const JobController = {
  createJob,
  getAllJob,
  getSingleJob,
  updateJob,
  deleteJob,
}

module.exports = JobController
