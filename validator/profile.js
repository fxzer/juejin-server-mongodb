const { body, param } = require("express-validator")
const { validate } = require("../middleware/validate")

exports.getProfileValid = validate([
  param('id').notEmpty().withMessage('id不能为空').isMongoId().withMessage('id不合法'),
])
exports.followValid = validate([
  param('id').notEmpty().withMessage('id不能为空').isMongoId().withMessage('id不合法'),
  param('id').custom(async(id,{req}) => {
   //关注的用户id 和 自己id 不能相同
    if(id === req.user.id.toString()){
      return Promise.reject('不能关注自己!')
    }
  }),
])
 