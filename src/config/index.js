/* eslint-disable no-undef */
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(process.cwd(), '.env') })

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    refresh: process.env.JWT_REFRESH_KEY,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expire_in: process.env.JWT_REFRESH_IN,
  },
}
