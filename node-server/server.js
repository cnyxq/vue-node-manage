const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()

const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// passport初始化
app.use(passport.initialize())

require('./config/passport')(passport)

// Connect to mongodb
const db = require('./config/keys').mongodbAtlas
mongoose.connect(db)
        .then(() => console.log("MongoDB Connected~"))
        .catch((err) => console.log(err))

app.use('/api/users', users)
app.use('/api/profiles', profiles)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
