const { validate } = require("../middleware/validate");
const { body } = require("express-validator");
const { User } = require("../model");
const md5 = require("../util/md5");
//数据验证:
// 基本数据验证
//业务数据验证
exports.register = validate(
  //配置验证规则
  [
    body("user.username")
      .notEmpty()
      .withMessage("用户名不能为空!")
      .trim()
      .bail()
      .custom(async (username) => {
        const user = await User.findOne({ username });
        if (user) {
          return Promise.reject("用户名已存在!");
        }
      }),
    body("user.password")
      .notEmpty()
      .withMessage("密码不能为空!")
      .isLength({ min: 5 })
      .withMessage("密码长度不小于5!"),
    body("user.email")
      .notEmpty()
      .withMessage("邮箱不能为空!")
      .isEmail()
      .withMessage("邮箱格式不正确!")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({ email });
        if (user) {
          return Promise.reject("邮箱已存在!");
        }
      }),
  ]
);
exports.login = [
  //配置多个中间件, 利用执行顺序机制验证
  validate(
    //配置验证规则
    [
      body("user.email")
        .notEmpty()
        .withMessage("邮箱不能为空!")
        .isEmail()
        .withMessage("邮箱格式不正确!"),

      body("user.password")
        .notEmpty()
        .withMessage("密码不能为空!")
        .isLength({ min: 5 }),
    ]
  ),
  //查询数据库校验账户
  validate([
    body("user.email").custom(async (email, { req }) => {
      //手动把密码查询带回来
      const user = await User.findOne({ email }).select(['username','password','email','bio','image']);
      if (!user) {
        return Promise.reject("账号不存在!");
      }
      req.user = user
    }),
  ]),
];
exports.update = [
  //配置多个中间件, 利用执行顺序机制验证
  validate(
    //配置验证规则
    [
      body("user.username")
        .notEmpty()
        .withMessage("用户名不能为空!")
        .isLength({ min: 2 }).withMessage("用户名长度不能小于2!"),
    ]
  ),
  //查询数据库校验账户
  validate([
    body("user.username").custom(async (username, { req }) => {
      let id = req.body.user.id
      const user = await User.findById(id);
      if(user){
        let isRepeat = id !== user.id.toString() && user.username == req.body.user.username
        if (isRepeat) {
          return Promise.reject("用户名已存在!");
        }
      }else{
        return Promise.reject("当前用户不存在!");
      }
      
    }),
  ]),
];
