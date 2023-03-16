const jwt = require('jsonwebtoken');
const { User } = require('../model')
const { jwtSecretKey } = require('../config/config.default');
module.exports = async (req,res,next) =>{
  let token = req.headers['authorization']
  token = token ? token.split(' ')[1] : null
  
  if(!token){
    return res.errs('未认证!')
  }
  try {
    let result = jwt.verify(token,jwtSecretKey)
    console.log('result: ', result);
    let user = await User.findById(result.userId)
    if(!user){
      return  res.errs('认证已过期!')
    }
    //user 的 _id赋给id
    req.user = user.toJSON()
    req.user.id = user._id.toString()
    delete req.user._id
    next()
  } catch (error) {
    next(error)
  }
}