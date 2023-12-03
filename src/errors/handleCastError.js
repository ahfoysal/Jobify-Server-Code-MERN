const mongoose = require('mongoose')

const handleCastError = err => {
  const errors = [
    {
      path: err?.path,
      message: 'Invalid Id',
    },
  ]

  return {
    statusCode: 400,
    message: 'Cast Error',
    errorMessages: errors,
  }
}

module.exports = handleCastError
