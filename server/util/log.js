const winston = require('winston')
require('winston-daily-rotate-file') // 하루 간격으로 로그 파일을 저장하기 위한 방법
require('date-utils') // node.js에서 현재시간을 받아오는 모듈

const logger = winston.createLogger({
  level: 'debug', // 최소 레벨
  // 파일저장
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'log/system.log', // log 폴더에 system.log 이름으로 저장
      zippedArchive: true, // 압축여부
      format: winston.format.printf(
        (info) =>
          `${new Date().toFormat(
            'YYYY-MM-DD HH24:MI:SS'
          )} [${info.level.toUpperCase()}] - ${info.message}`
      ),
    }),
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.printf(
        (info) =>
          `${new Date().toFormat(
            'YYYY-MM-DD HH24:MI:SS'
          )} [${info.level.toUpperCase()}] - ${info.message}`
      ),
    }),
  ],
})

module.exports = logger
