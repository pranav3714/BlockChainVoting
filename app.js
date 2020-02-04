const express = require('express')
const app = express()
const bp = require('body-parser')
const mongo = require('./mongo')

app.use(bp.json())
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index')
})
app.post('/auth', (req, res) => {
  //console.log(req.body)
  mongo.userAuth(req.body.panNumber.toUpperCase(), req.body.phone, res, req.body.imageData)
})
app.post('/otp', (req, res) => {
  //console.log(req.body)
  mongo.otpAuth(req.body.panNumber.toUpperCase(), req.body.otp, res)
})
app.get('/vote', (req, res) => {
  res.render('vote')
})

app.post("/publickey", (req, res) => {
  mongo.publicRegister(req.body.public, req.body.token, res)
})

app.get('/results', (req, res) => {
  res.render('result')
})

app.listen(3000, () => {
    console.log("Listening at http://localhost:3000")
})