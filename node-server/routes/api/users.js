const express = require('express')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const router = express.Router()

const keys = require('../../config/keys')
const User = require('../../models/User')

router.get('/test', (req, res) => {
  res.json({msg: "OK!"})
})

// 注册模块
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
      .then((user) => {
        if (user) {
          return res.status(400).json('该邮箱已被注册！')
        } else {
          const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password,
            identity: req.body.identity
          })
          // 密码加密处理
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                // Store hash in your password DB.
                if (err) throw err
                newUser.password = hash // 已加密
                newUser.save()
                       .then(user => res.json(user))
                       .catch(err => console.log(`ERR: ${err}`))
            })
          })
        }
      })
})

// 登录模块
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({email})
      .then(user => {
        if (!user) {
          return res.status(400).json('邮箱不存在！')
        }
        // 密码匹配
        bcrypt.compare(password, user.password)
              .then(isMatch => {
                if (isMatch) {
                  const rule = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity
                  }
                  // jwt.sign("规则","加密名字","过期时间","回调")
                  jwt.sign(rule, keys.secretKey, {expiresIn: 3600}, (err, token) => {
                    if (err) throw err
                    res.json({
                      success: true,
                      token: 'Bearer ' + token
                    })
                  })
                } else {
                  return res.status(400).json('密码错误！')
                }
              })
      })
})

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity
  })
})
module.exports = router