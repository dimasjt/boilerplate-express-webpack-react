import express from 'express'
import morgan from 'morgan'
import responseTime from 'response-time'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpack from 'webpack'

import fs from 'fs'
import path from 'path'

import webpackConfig from './webpack/dev'

const logFile = path.resolve(__dirname, '../log/dev.log')
const logDir = path.resolve(__dirname, '../log')
const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' })
const PORT = process.env.PORT || 3000

fs.existsSync(logDir) || fs.mkdirSync(logDir)

const app = express()
const compiler = webpack(webpackConfig)
const middleware = webpackDevMiddleware(compiler, {
  publicPath: '/assets',
  stats: {
    color: true,
  },
})

app.use(morgan('combined', { stream: accessLogStream }))
app.use(responseTime())
app.use(middleware)

app.get('*', (req, res) => {
  res.write(middleware.fileSystem.readFileSync(path.resolve(__dirname, 'assets/index.html')))
  res.end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
