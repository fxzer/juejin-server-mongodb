//加密
// const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { md5SerectKey } = require('../config/config.default')

module.exports = str =>{
  return crypto.createHash('md5').update(md5SerectKey + str).digest('hex')
}