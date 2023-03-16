const { default: mongoose } = require("mongoose");
module.exports =  {
  createAt:{
    type:Date,
    default:Date.now
  },
  updtedAt:{
    type:Date,
    default:Date.now
  }
}