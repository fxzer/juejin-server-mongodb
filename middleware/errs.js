//封装路由错误处理中间件
module.exports = (req, res, next) => {
  res.errs = (err,success = false,code = 200) => {
    return res
      .status(code)
      .send({ success, message: err instanceof Error ? err.message : err });
  };
  next();
};
