const express = require('express')
const path = require('path')
const logger = require('morgan')
const fetch = require('node-fetch')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv').config()
const video = require('./api/video')

const app = express()

app.use(cors({
  credentials: true
  // origin:'*'
}))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/video', video)

app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  res.status(500)
  // res.status(err.status || res.statusCode || 500)
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  })
})

module.exports = app
