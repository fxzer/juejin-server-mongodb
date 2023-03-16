const express = require("express");
const router = express.Router();
const {
  createArticle,
  deleteArticle,
  updateArticle,
  getArticleById,
  getArticles,
  likeArticle,
} = require("../controller/article");
const {
  createValid,
  deleteValid,
  updateValid,
  getValid,
  likeValid,
} = require("../validator/article");
const auth = require("../middleware/auth");
//创建文章
router.post("/", auth, createValid, createArticle);

//更新文章
router.put("/", auth, updateValid, updateArticle);
//查询文章
router.get("/:articleId",  getValid, getArticleById);
//查询文章列表
router.post("/list", getArticles);
//收藏文章
router.post("/:articleId/like", auth, likeValid, likeArticle);
//删除文章
router.delete("/", auth, deleteValid, deleteArticle);

module.exports = router;
