const { Schema, model } = require('mongoose')

const JobSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    jobLocation: {
      type: String,
      required: true,
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['On Site', 'Remote', 'Part-Time', 'Hybrid'],
    },

    minSalary: {
      type: Number,
      required: true,
    },
    maxSalary: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },
    applied: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

const Job = model('Job', JobSchema)
module.exports = Job
