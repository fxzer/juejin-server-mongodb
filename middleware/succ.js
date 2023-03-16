//成功处理中间件
module.exports = (req, res, next) => {
  res.succ = (args) => {
    args.success =  true 
    return res.send(args);
  };
  next();
};
