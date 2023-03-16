const { User } = require("../model")
//获取用户
const transformId = (user) =>{
  let newuser = user.toJSON()
  newuser.id = newuser._id.toString()
  delete newuser._id
  return newuser
}
exports.getProfile = async (req,res,next) =>{
 try {
   let user = await User.findById(req.params.id)
    
   if(!user){
    return res.errs('用户不存在')
   }
    res.send({
      msg:'获取成功!',
      user:transformId(user)
    })
 } catch (error) {
   next(error)
 }
}
//关注用户 + //取消关注
exports.follow = async (req,res,next) =>{
  try {
    //1.更新当前用户的关注列表
    const followId = req.params.id
    const fansId = req.user.id
    let user = await User.findById(fansId)
    //如果已关注过了
    let isFollowed =  user.followList.some((item,index) => {
      return item == followId 
    })
    let followType = '$push'
    if(isFollowed){
      followType = '$pull'
    }
     user = await User.findByIdAndUpdate(fansId,
      { [followType]:{followList:followId}},{new:true}) 
      //被关注用户 //2.更新被关注用户的粉丝列表
     let fans = await User.findByIdAndUpdate(followId,
      { [followType]:{fansList:fansId}},{new:true}) 
      res.succ({
        msg:isFollowed ?'取关成功!': '关注成功!',
        user:transformId(user),
        fans:transformId(fans)
      })
  } catch (error) {
    next(error)
  }

}

 
 