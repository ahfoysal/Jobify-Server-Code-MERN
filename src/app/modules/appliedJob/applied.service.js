const { default: mongoose } = require('mongoose')
const Job = require('../job/job.model')
const User = require('../user/user.model')
const Applied = require('./applied.model')
const ApiError = require('../../../errors/ApiError')
const httpStatus = require('http-status')

const apply = async (jobID, userID, restData) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const options = { session }

    const existingApplied = await Applied.findOne({ job: jobID, user: userID })
    if (existingApplied) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You have already applied to this job',
      )
    }

    const newApplied = await Applied.create(
      [{ job: jobID, user: userID, ...restData }],
      options,
    )

    await Job.updateOne(
      { _id: jobID },
      { $push: { applied: newApplied[0]._id } },
      options,
    )

    await User.updateOne(
      { _id: userID },
      { $push: { applied: newApplied[0]._id } },
      options,
    )

    await session.commitTransaction()
    session.endSession()

    return newApplied[0]
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

const applied = async user => {
  const appliedJobs = await Applied.find({ user: user.id, job: { $ne: null } })
    .populate({
      path: 'job',
      populate: {
        path: 'postedBy',
      },
    })
    .exec()
  const filteredAppliedJobs = appliedJobs.filter(
    appliedJob => appliedJob.job !== null,
  )

  return filteredAppliedJobs
}
const AppliedService = {
  apply,
  applied,
}

module.exports = AppliedService
