const express = require('express')
const router = express.Router()
const passport = require('passport')

const ProFile = require('../../models/Profile')

// router.get('/test', (req, res) => {
//   res.json({msg: 'profile works!'})
// })

// 添加数据
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFields = {}
  if (req.body.type) profileFields.type = req.body.type
  if (req.body.describe) profileFields.describe = req.body.describe
  if (req.body.income) profileFields.income = req.body.income
  if (req.body.expend) profileFields.expend = req.body.expend
  if (req.body.cash) profileFields.cash = req.body.cash
  if (req.body.remark) profileFields.remark = req.body.remark
  if (req.body.date) profileFields.date = req.body.date
  ProFile(profileFields).save()
    .then(profile => res.json(profile))
    .catch(err => console.log(`ERR: ${err}`))
})

// 根据指定id获取数据
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  ProFile.findOne({_id: req.params.id})
    .then(profile => {
      if (!profile) {
        return res.status(404).json("没有内容！")
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// 获取全部数据
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  ProFile.find()
    .then(profile => {
      if (!profile) {
        return res.status(404).json("没有内容！")
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// 根据指定id更改数据
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFields = {}
  if (req.body.type) profileFields.type = req.body.type
  if (req.body.describe) profileFields.describe = req.body.describe
  if (req.body.income) profileFields.income = req.body.income
  if (req.body.expend) profileFields.expend = req.body.expend
  if (req.body.cash) profileFields.cash = req.body.cash
  if (req.body.remark) profileFields.remark = req.body.remark
  if (req.body.date) profileFields.date = req.body.date
  ProFile.findOneAndUpdate(
    {_id: req.params.id},
    {$set: profileFields},
    {new: true}
  ).then(profile => {
    res.json(profile)
  })
})

// 根据指定id删除数据
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  ProFile.findOneAndRemove({_id: req.params.id})
    .then(profile => res.json('删除成功！'))
    .catch(err => res.status(404).json(err))
})

module.exports = router