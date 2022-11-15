const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Site = require('../models/site');
const User = require('../models/user');
const Review = require('../models/review');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
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

router.get('/mypage', isLoggedIn, async (req, res) => {
  const userLiked = req.user.Liked;
  const userZzimed = req.user.Zzimed;
  const reviews = await Review.findAll({
    where: { ReviewerId: req.user.id },
    include: { model: Site },
  });
  res.render('mypage', {
    title: 'VISIT-KOREA || mypage',
    userLiked,
    userZzimed,
    reviews,
    serviceKey: process.env.SERVICE_KEY,
  });
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
      include: [
        {
          model: User,
          as: 'Liker',
        },
        {
          model: User,
          as: 'Zzimer',
        },
      ],
    });
    const reviews = site
      ? await Review.findAll({
          where: { SiteId: site.id },
          include: [
            { model: User, as: 'Reviewer' },
            { model: User, as: 'Upuser' },
          ],
        })
      : [];
    const likeList =
      req.user && req.user.Liked ? req.user.Liked.map((l) => l.contentId) : [];
    const zzimList =
      req.user && req.user.Zzimed
        ? req.user.Zzimed.map((l) => l.contentId)
        : [];
    const thumbsList =
      req.user && req.user.Uped ? req.user.Uped.map((l) => l.id) : [];

    const liked = likeList.indexOf(req.params.id) !== -1 ? 'checked' : 'unchecked';
    const likerCount = site ? site.Liker.length : 0;
    const zzimed =
      zzimList.indexOf(req.params.id) !== -1 ? 'checked' : 'unchecked';
    const zzimerCount = site ? site.Zzimer.length : 0;
    res.render('site', {
      title: `VISIT-KOREA || site: ${req.params.id}`,
      id: req.params.id,
      serviceKey: process.env.SERVICE_KEY,
      likerCount,
      liked,
      zzimed,
      zzimerCount,
      reviews,
      thumbsList,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
