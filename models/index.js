const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Review = require('./review');
const Site = require('./site')

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Review = Review;
db.Site = Site;

User.init(sequelize);
Review.init(sequelize);
Site.init(sequelize);

User.associate(db);
Review.associate(db);
Site.associate(db);

module.exports = db;
