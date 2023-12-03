const paginationHelper = require('../../../helpers/paginationHelper')
const User = require('../user/user.model')
const { jobSearchableFields } = require('./job.constant')
const Job = require('./job.model')

const createJob = async (jobData, userID) => {
  jobData.postedBy = userID
  const session = await Job.startSession()
  session.startTransaction()

  try {
    const options = { session }

    const newJob = await Job.create([jobData], options)

    const createdJob = newJob[0]

    await User.updateOne(
      { _id: userID },
      { $push: { myJobs: createdJob._id } },
      options,
    )

    await session.commitTransaction()
    session.endSession()

    return createdJob
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

const getAllJob = async (filters, pagination) => {
  const { searchTerm, ...filterData } = filters
  const andCondition = []
  console.log(searchTerm)

  if (searchTerm) {
    andCondition.push({
      $or: jobSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination)

  const sortConditions = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}

  const result = await Job.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('postedBy')

  const total = await Job.count()

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const updateJob = async (id, payload) => {
  console.log(payload)
  const result = await Job.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })

  return result
}
const getSingleJob = async id => {
  const result = await Job.findById(id).populate('postedBy')
  return result
}
const deleteJob = async (id, userID) => {
  const session = await Job.startSession()
  session.startTransaction()

  try {
    const options = { session }

    // Delete the job and store the result
    const result = await Job.findByIdAndDelete(id, options)

    // Remove the job from the user's myJobs array
    await User.updateOne({ _id: userID }, { $pull: { myJobs: id } }, options)

    await session.commitTransaction()
    session.endSession()

    return result
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

const JobService = {
  createJob,
  getAllJob,
  updateJob,
  getSingleJob,
  deleteJob,
}

module.exports = JobService
