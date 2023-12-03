const handleZodError = err => {
  const errors = err.issues.map(issue => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    }
  })

  const statusCode = 400
  return {
    statusCode,
    message: 'Validation Error (Zod)',
    errorMessages: errors,
  }
}

module.exports = handleZodError
