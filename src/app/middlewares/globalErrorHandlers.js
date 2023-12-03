const { ZodError } = require('zod')
const config = require('../../config')
const ApiError = require('../../errors/ApiError')
const handleCastError = require('../../errors/handleCastError')
const handleValidationError = require('../../errors/handleValidationError')
const handleZodError = require('../../errors/handleZodError')
const { errorLogger } = require('../../shared/logger')

const globalErrorHandler = (err, req, res, next) => {
  config.env === 'development'
    ? console.log('Global Error', err)
    : errorLogger.error('Global Error', err)

  let statusCode = 500
  let message = 'Something went wrong'
  let errorMessages = []

  if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  }
  if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (err) {
    statusCode = err.statusCode
    message = err.message
    errorMessages = err.message
      ? [
          {
            path: '',
            message: err.message,
          },
        ]
      : []
  } else if (err) {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (err) {
    message = err.message
    errorMessages = err?.message
      ? [
          {
            path: '',
            message: err.message,
          },
        ]
      : []
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? err.stack : undefined,
  })
}

module.exports = globalErrorHandler
