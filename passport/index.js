const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const Site = require('../models/site');
const Review = require('../models/review');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        {
          model: Site,
          as: 'Zzimed',
        },
        {
          model: Site,
          as: 'Liked',
        },
        {
          model: Review,
        },
      ],
    })
      .then((user) => done(null, user)) // req.user에 저장
      .catch((err) => done(err));
  });

  local();
  kakao();
};
