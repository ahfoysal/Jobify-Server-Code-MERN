const bcrypt = require('bcrypt')
const { Schema, model } = require('mongoose')
const config = require('../../../config')

const UserSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    imageUrl: {
      type: String,
      default: 'https://i.imgur.com/eLzZ2ny.png',
    },
    email: {
      type: String,

      required: true,
      unique: true,
    },
    myJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    applied: [{ type: Schema.Types.ObjectId, ref: 'AppliedJob' }],

    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

UserSchema.statics.isUserExist = async function (email) {
  return await User.findOne(
    { email },
    { id: 1, password: 1, role: 1, email: 1, name: 1, imageUrl: 1 },
  )
}

UserSchema.statics.isPasswordMatched = async function (
  givenPassword,
  savedPassword,
) {
  return await bcrypt.compare(givenPassword, savedPassword)
}

// User.create() / user.save()
UserSchema.pre('save', async function (next) {
  // hashing user password
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date()
  }
  next()
})

const User = model('User', UserSchema)

module.exports = User
