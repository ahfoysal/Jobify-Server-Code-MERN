const jwt = require('jsonwebtoken')

const generateToken = (payload, secret, expireTime) => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  })
}

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret)
}

const jwtHelpers = { generateToken, verifyToken }

module.exports = { jwtHelpers }
