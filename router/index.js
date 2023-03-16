const express = require('express')
const router = express.Router()
 
router.use('/user',require('./user'))
router.use('/article',require('./article'))
router.use('/profile',require('./profile'))
module.exports=router