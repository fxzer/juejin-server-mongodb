const { body,param,query } = require("express-validator")
const { default: mongoose } = require("mongoose")
const { validate } = require("../middleware/validate")
const { Article } = require("../model")

exports.createValid =[
  validate([
    body('article.title').notEmpty().withMessage('文章标题不能为空!').isLength({ min: 5 }).withMessage('文章标题长度不小于5!') ,
    body('article.desc').notEmpty().withMessage('文章描述不能为空!').isLength({ min: 5 }).withMessage('文章描述长度不小于5!') ,
    body('article.body').notEmpty().withMessage('文章主体不能为空!').isLength({min:20}).withMessage('文章主体长度不小于20!')
  ]),
  validate( [
    body('article.title').custom(async (title, {req})=>{
      const article = await Article.findOne({title})
      if(article){
        return Promise.reject('文章标题已存在!')
      }
    })
  ]) 
]

exports.updateValid =[
  validate([
    body('article.id').notEmpty().withMessage('articleId不能为空!').isMongoId().withMessage('articleId 格式不合法!'),
    body('article.title').notEmpty().withMessage('文章标题不能为空!').isLength({ min: 5 }).withMessage('文章标题长度不小于5!') ,
    body('article.desc').notEmpty().withMessage('文章描述不能为空!').isLength({ min: 5 }).withMessage('文章描述长度不小于5!') ,
    body('article.body').notEmpty().withMessage('文章主体不能为空!').isLength({min:20}).withMessage('文章主体长度不小于20!')
  ]),
  
  validate([
    body('article.id').custom(async (id, {req})=>{
      const article = await Article.findById(id)
      
      if(!article){
        return Promise.reject('该文章不存在!')
      }
      if(article.title === req.body.article.title){
        return Promise.reject('文章标题已存在!')
      }
      //方式一: req.author = article.author+''
      //方式二:
      req.author = mongoose.Types.ObjectId(article.author).toString()
    })
  ]),
  //验证当前用户是否是文章作者
  async (req,res,next) =>{
    //id为对象,转为字符串比较
    let id = mongoose.Types.ObjectId(req.user.id).toString()
    if(id != req.author){
      return res.errs('权限不足,当前用户不是文章作者!')
    }
   next()
  }
]
exports.getValid =validate([
  param('articleId').notEmpty().withMessage('articleId不能为空!').isMongoId().withMessage('articleId 格式不合法!'),
])
exports.likeValid =  validate([
  param('articleId').notEmpty().withMessage('articleId不能为空!').isMongoId().withMessage('articleId 格式不合法!'),
])

exports.deleteValid =[
  validate([
    body('id').notEmpty().withMessage('文章d不能为空!').isMongoId().withMessage('文章id格式不合法!')
  ]),
  //验证作者
  async (req,res,next) =>{
    try {
      
      const article = await Article.findById(req.body.id)
      if(!article){
        return res.errs('文章不存在!')
      }
      let author = mongoose.Types.ObjectId(req.user.id).toString()
      req.author = mongoose.Types.ObjectId(article.author).toString()
    
      if(req.author !== author){
        return res.errs('当前用户不是文章作者!!')
      }
      next()
    } catch (error) {
      res.errs(error)
    }
  }
]