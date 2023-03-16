const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { validate } = require("../middleware/validate");
const UserCtrl = require("../controller/user");
const UserValidator = require('../validator/user')
const auth = require('../middleware/auth')
//用户注册
router.post( "/", UserValidator.register,  UserCtrl.register );
//用户登录
router.post("/login",UserValidator.login, UserCtrl.login);
//获取用户
router.get("/", auth, UserCtrl.getCurrentUser);
//更新用户
router.put("/",auth,UserValidator.update, UserCtrl.updateUser);
//更新用户

module.exports = router;
