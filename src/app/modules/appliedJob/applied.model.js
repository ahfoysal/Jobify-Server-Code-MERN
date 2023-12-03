const { Schema, model } = require('mongoose')

const AppliedJodSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

const Applied = model('AppliedJob', AppliedJodSchema)
module.exports = Applied
