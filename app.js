var express = require('express')
var app = express()
var imageRouter = require('./router')
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', imageRouter)

var server = app.listen(3000, function() {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
