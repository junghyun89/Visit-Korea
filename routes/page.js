const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  next();
});

router.get('/', (req, res) => {
  res.render('main', {
    title: 'VISIT-KOREA',
  });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'VISIT-KOREA || login' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'VISIT-KOREA || register' });
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

router.get('/site/:id', async (req, res) => {
  res.render('site', {
    title: `VISIT-KOREA || ${req.params.id}`,
    id: req.params.id,
    serviceKey: process.env.SERVICE_KEY,
  });
});

module.exports = router;
