const express = require('express')
const { User } = require('../model')
const auth = require('../middleware/auth')
const { getProfile,follow,unfollow} = require('../controller/profile')
const { getProfileValid,followValid} = require('../validator/profile')
const router = express.Router()
 
//获取用户资料
router.get('/:id',getProfileValid,getProfile)
//关注用户 + 取消关注
router.post('/:id/follow',auth,followValid,follow)
// //
// router.delete('/:id/unfollow',auth,unfollowValid,unfollow)
 

module.exports=router