const mongoose =  require('mongoose')
const baseSchema = require('./base')
const md5 = require('../util/md5')
//用户模型
const userSchema = new mongoose.Schema({
  ...baseSchema,
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true,
    set:value => md5(value),
    select:false,
  },
  email:{
    type:String,
    required:true
  },
  bio:{
    type:String,
    default:null
  },
  image:{
    type:String,
    default:null
  },
  //关注列表
  followList:{
      type:[String],
      default:null
    },
  //粉丝列表
  fansList:{
    type:[String],
    default:null
  },
  //收藏文章 
  likeArticles:{
    type:[String],//文章id数组
    default:null
  }
})

module.exports = userSchema