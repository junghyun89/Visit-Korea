const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Site = require('../models/site');
const User = require('../models/user');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.myZzimCount = req.user ? req.user.Zzimed.length : 0;
  res.locals.myLikeCount = req.user ? req.user.Liked.length : 0;
  res.locals.likeList =
    req.user && req.user.Liked ? req.user.Liked.map((l) => l.contentId) : [];
  res.locals.zzimList =
    req.user && req.user.Zzimed ? req.user.Zzimed.map((l) => l.contentId) : [];
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

router.get('/review', isLoggedIn, (req, res) => {
  res.render(`review`, { title: 'VISIT-KOREA || review' });
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
      include: [{ model: User, as: 'Liker' }],
    });
    const liked =
      res.locals.likeList.indexOf(req.params.id) !== -1 ? 'liked' : 'unliked';
    const likerCount = site ? site.Liker.length : 0;
    res.render('site', {
      title: `VISIT-KOREA || site: ${req.params.id}`,
      id: req.params.id,
      serviceKey: process.env.SERVICE_KEY,
      likerCount,
      liked,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/site/:id/like', async (req, res, next) => {
  try {
    let site = await Site.findOne({
      where: { contentId: req.params.id },
    });
    if (!site) {
      site = await Site.create({
        name: req.body.name,
        contentId: req.body.contentId,
      });
    }
    await site.addLiker(parseInt(req.user.id, 10));
    return res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/site/:id/like', async (req, res, next) => {
  try {
    const site = await Site.findOne({
      where: { contentId: req.params.id },
    });
    await site.removeLiker(parseInt(req.user.id, 10));
    return res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/site/:id/zzim', async (req, res, next) => {
  try {
    let site = await Site.findOne({
      where: { contentId: req.params.id },
    });
    if (!site) {
      site = await Site.create({
        name: req.body.name,
        contentId: req.body.contentId,
      });
    }
    await site.addZzimer(parseInt(req.user.id, 10));
    return res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/site/:id/zzim', async (req, res, next) => {
  try {
    const site = await Site.findOne({
      where: { contentId: req.params.id },
    });
    await site.removeZzimer(parseInt(req.user.id, 10));
    return res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
