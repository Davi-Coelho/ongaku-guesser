require('./cronJob')
const express = require('express')
const consign = require('consign')
const app = express()
const db = require('./dbConnection')

app.set('view engine', 'ejs')
app.set('views', './app/views')
app.use(express.static('./app/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

consign()
.include('app/controllers')
.then('app/models')
.then('app/routes')
.into(app)

app.db = db

module.exports = app