const { createLogger, transports } = require('winston')
const winston = require('winston')
// require('winston-mongodb')

module.exports = function () {
  process.on('unhandledRejection', (ex) => {
    throw ex
  })
  winston.createLogger({
    transports: [
      new transports.File({
        filename: 'combined.log',
        // level: 'info',
        // format: format.combine(format.timestamp(), format.json())
      })
    ],
    exceptionHandlers: [
      new transports.File({
        filename: 'exceptions.log'
      }),
      // new transports.MongoDB({
      //   level:'error',
      //   db:process.env.CONNECTION_STRING,
      //   collection:'baba'
      // })
    ],
  })
}

