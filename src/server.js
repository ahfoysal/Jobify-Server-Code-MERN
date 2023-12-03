/* eslint-disable no-undef */
const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

//////Database Connection
async function connectDB() {
  let server

  try {
    await mongoose.connect(config.database_url)

    console.log('MongoDB Connected')

    server = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`)
    })
  } catch (err) {
    console.log('failed to connect database', err)
  }

  process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection, Server is closing', err)
    if (server) {
      server.close(() => {
        console.log('Unhandled Rejection, Server is closing', err)

        process.exit(1)
      })
    } else {
      console.log('Unhandled Rejection, Server is closing', err)
      process.exit(1)
    }
  })
}

connectDB()
