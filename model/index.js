const mongoose = require('mongoose');
const { dbUri  } = require('../config/config.default')
mongoose.connect(dbUri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongDB数据库连接失败!'));

db.once('open', function() {
  console.log('MongDB数据库连接成功!');
});
const Cat = mongoose.model('Cat', { name: String });

module.exports = {
  User:mongoose.model('User',require('./user')),
  Article:mongoose.model('Article',require('./article')),
}