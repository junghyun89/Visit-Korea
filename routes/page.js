const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Site = require('../models/site');
const User = require('../models/user');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  // res.locals.myZzimCount = req.user ? req.user.Zzim.length : 0;
  // res.locals.myLikeCount = req.user ? req.user.Like.length : 0;
  next();
});

router.get('/', (req, res) => {
  res.render('main', {
    title: 'VISIT-KOREA',
  });
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', { title: 'VISIT-KOREA || login' });
});

router.get('/register', isNotLoggedIn, (req, res) => {
  res.render('register', { title: 'VISIT-KOREA || register' });
});

router.get('/mypage', isLoggedIn, (req, res) => {
  res.render('mypage', { title: 'VISIT-KOREA || mypage' });
});

router.post('/search', (req, res) => {
  res.redirect(`result/${req.body.region}`);
});

router.get('/result/:region', async (req, res) => {
  res.render('result', {
    title: 'VISIT-KOREA || result',
    region: req.params.region,
    serviceKey: process.env.SERVICE_KEY,
  });
});

router.get('/site/:id', async (req, res, next) => {
  try {
    const site = await Site.findOne({
      where: { contentId: req.params.id },
      // raw: true
    });
    const likers = []
    if (site) {
      return likers = await site.getLikers({include: [{ model: User, as: 'Liker' }]})
    }
    // const likers = await site.getLiker();
    // const likerCount = await site.Liker.length;
    console.log('----', likers)
    res.render('site', {
      title: `VISIT-KOREA || ${req.params.id}`,
      id: req.params.id,
      serviceKey: process.env.SERVICE_KEY,
      // likerCount,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/site/:id/like', async (req, res, next) => {
  try {
    const site = await Site.findOne({
      where: { contentId: req.params.id },
      // include: { model: User, as: 'Liker', attributes: ['id'] },
    });
    const likers = await site.getLiker();
    console.log('----', likers.userId)
    if (likers.indexOf(req.user.id) = -1) {
      await site.addLiker(parseInt(req.user.id, 10));
      return res.send('success');
    } else {
      await site.removeLiker(parseInt(req.user.id, 10));
      return res.send('success');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
