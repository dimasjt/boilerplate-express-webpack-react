import express from 'express'
import morgan from 'morgan'
import responseTime from 'response-time'
import bodyParser from 'body-parser'

import fs from 'fs'
import path from 'path'

import routes from '../config/routes'

const logFile = path.resolve(__dirname, '../log/dev.log')
const logDir = path.resolve(__dirname, '../log')
const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' })
const PORT = process.env.PORT || 3000

fs.existsSync(logDir) || fs.mkdirSync(logDir)

const app = express()

app.use(morgan('combined', { stream: accessLogStream }))
app.use(responseTime())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
