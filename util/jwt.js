const express = require('express')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

//Promise转化 
//生成token
exports.sign = () =>promisify(jwt.sign)
// 验证
exports.verify = () =>promisify(jwt.verify)


// exports.sign = () => jwt.sign(info,jwtSecretKey,algorithms: ["HS256"])
// exports.verify = () => jwt.verify(info,jwtSecretKey,algorithms: ["HS256"])
