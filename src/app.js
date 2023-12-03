const cors = require('cors')
const express = require('express')
const globalErrorHandler = require('./app/middlewares/globalErrorHandlers')
const routes = require('./app/routes')
const cookieParser = require('cookie-parser')

const app = express()

///cors

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://jobify-bd6c2.web.app'],
    credentials: true,
  }),
)

///body and cookie parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
/// Routes Setup
app.use('/api/v1', routes)
app.use(globalErrorHandler)

/////// Testing
app.get('/', async (req, res) => {
  res.send("You're not supposed to be here.")
})

module.exports = app
