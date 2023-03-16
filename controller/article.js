const { default: mongoose } = require("mongoose");
const { Article, User } = require("../model");
const transformId = (article) => {
  let newArticle = article.toJSON();
  newArticle.id = newArticle._id;
  newArticle.author.id = newArticle.author._id;
  delete newArticle._id;
  delete newArticle.author._id;
  return newArticle;
};
exports.createArticle = async (req, res, next) => {
  try {
    let article = new Article(req.body.article);
    article.author = req.user.id;
    article.username = req.user.username;
    //把user对象映射到article
    article.populate("author","username");
    await article.save();

    res.succ({
      msg: "文章创建成功!",
      article: transformId(article),
    });
  } catch (error) {
    res.errs(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  const article = req.body.article;
  try {
    let { id, title, desc, body, tagList } = req.body.article;

    let article = await Article.findByIdAndUpdate(
      id,
      { $set: req.body.article },
      { new: true }
    );

    res.succ({
      msg: "文章更新成功!",
      article: transformId(article),
    });
  } catch (error) {
    res.errs(error);
  }
};
//通过id查询单个文章
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId).populate(
      "author"
    );
    if (!article) {
      return res.errs("文章不存在!");
    }
    res.succ({
      msg: "文章查询成功!",
      article: transformId(article),
    });
  } catch (error) {
    res.errs(error);
  }
};
// 获取文章列表
exports.getArticles = async (req, res, next) => {
  try {
    const {
      limit = 20,
      offset = 0,
      tag,
      author,
      favorited,
      sortBy,
    } = req.body.conditions || {};
    const filter = {};
    if (tag) {
      filter.tagList = tag;
    }
    //某个作者的文章
    if (author) {
      const user = await User.findOne({ username: author });
      filter.author = user ? user._id : null;
    }
    let articleList = await Article.find(filter).populate("author")
      .skip(Number.parseInt(offset))
      .limit(Number.parseInt(limit))
      .sort({ creeateAt: -1, ...sortBy });

    const articleCount = await Article.find(filter)
      .skip(offset)
      .limit(limit)
      .count();
    const totalCount = await Article.countDocuments();
    if (!articleList) {
      return res.errs("暂无文章!");
    }
    articleList =  articleList.map((article) => {
      
      return  transformId(article)
    });
    res.succ({
      msg: "文章查询列表成功!",
      articleList,
      articleCount,
      totalCount,
    });
  } catch (error) {
    res.errs(error);
  }
};

//收藏文章
exports.likeArticle = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const userId = req.user.id;
    let user = await User.findById(userId);
    const isLiked = user.likeArticles.some((item) => item == articleId);
    let updateType = "$push";
    if (isLiked) {
      updateType = "$pull";
    }
    //1.更新用户的收藏文章列表

    user = await User.findByIdAndUpdate(
      userId,
      { [updateType]: { likeArticles: articleId } },
      { new: true }
    );
    //2.更新文章的被收藏数
    let { likeCount } = await Article.findById(articleId).select("likeCount");

    let article = await Article.findByIdAndUpdate(
      articleId,
      { likeCount: isLiked ? likeCount - 1 : likeCount + 1 },
      { new: true }
    );
    res.succ({
      msg: isLiked ? "取消收藏成功!" : "文章收藏成功!",
      user,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteArticle = async (req, res, next) => {
  try {
    let id = mongoose.Types.ObjectId(req.body.id);
    const result = await Article.findByIdAndRemove(id);
    res.succ({
      msg: "文章删除成功!",
    });
  } catch (error) {
    res.errs(error);
  }
};
