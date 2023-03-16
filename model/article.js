const mongoose =  require('mongoose')
const Schema = mongoose.Schema
const baseSchema = require('./base')
//文章模型
const articleSchema = new mongoose.Schema({
  ...baseSchema,
  title:{
    type:String,
    required:true
  },
  desc:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  },
  cate:{
    type:String,
    required:true
  },
  cover:{
    type:String,
    required:true
  },
  likeCount:{
    type:Number,
    default:0
  },
  tagList:{
    type:[String],
    default:null
  },
  author:{
     type:Schema.Types.ObjectId,
     ref:'User',
     required:true,
   }
})
module.exports = articleSchema