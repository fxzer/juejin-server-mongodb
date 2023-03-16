const { User } = require('../model')
const md5 = require("../util/md5");
const jwt = require('jsonwebtoken')
const { jwtSecretKey,expiresIn }  = require('../config/config.default')
// 指定上传的文件路径  //这里是当前文件平级的public/images

exports.register = async (req,res,next)=>{
  try {
     let user = new User(req.body.user)
     await user.save() 
     //转化为json才能移除密码
     user = user.toJSON()
     delete user.password
     user.id = user._id.toString()
     delete user._id
     res.succ({
       msg:'注册成功!',
       user
     });
  } catch (error) {
    next(error)
  }
}
exports.login = async (req,res,next)=> {
  //校验账户后校验密码
  try {
    if (md5(req.body.user.password) !== req.user.password) {
      return  res.errs("密码错误!")
    } 
    const user = req.user.toJSON()
    // 去除密码生成Token
    delete user.password
     //user 的 _id赋给id
     user.id = user._id.toString()
     delete user._id
    const token =  jwt.sign({ userId:user.id },jwtSecretKey,{expiresIn})
    let result = jwt.verify(token,jwtSecretKey)
    res.succ({msg:'登录成功!',user,token});
  } catch (error) {
    next(error)
  }
}
exports.getCurrentUser = async (req,res,next)=>{
  res.succ({
    msg:'获取成功!',
    user:req.user
  })
}
exports.updateUser = async (req,res,next)=>{
 
  let {id:id,username,bio,image} = req.body.user 
  let result  = User.findByIdAndUpdate(id, { $set: { username,bio,image }},  {new:true}, function (err, tank) {
    if (err) return res.errs(err);
    res.succ({
      msg:'更新成功!',
      user:tank
    })
  });
}
 