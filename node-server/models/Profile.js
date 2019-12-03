const mongoose = require('mongoose')
const Schema = mongoose.Schema

const proFileSchema = new Schema({
  type: { // 收支类型
    type: String
  },
  describe: { //收支描述
    type: String,
    required: true
  },
  income: { // 收入
    type: Number,
    required: true
  },
  expend: { // 支出
    type: Number,
    required: true
  },
  cash: { // 账户现金
    type: Number
  },
  remark: { // 备注
    type: String
  },
  date: { // 创建时间
    type: Date,
    default: Date.now
  }
})

const ProFile = mongoose.model('profiles', proFileSchema)

module.exports = ProFile