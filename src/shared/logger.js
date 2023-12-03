/* eslint-disable no-undef */
const path = require('path')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

const { combine, timestamp, label, printf } = winston.format

// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return ` ${message} | [${label}] [${level}] ${date.toDateString()} ${hour}:${minutes}:${seconds}  `
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(label({ label: 'Success' }), timestamp(), myFormat),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'successes',
        'um-%DATE%-success.log',
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})

const errorLogger = winston.createLogger({
  level: 'error',
  format: combine(label({ label: 'Error' }), timestamp(), myFormat),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'um-%DATE%-error.log',
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})

module.exports = { errorLogger, logger }
