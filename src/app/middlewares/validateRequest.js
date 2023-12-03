const { Request, Response, NextFunction } = require('express')

const validateRequest = schema => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    })
    return next()
  } catch (err) {
    next(err)
  }
}

module.exports = validateRequest
