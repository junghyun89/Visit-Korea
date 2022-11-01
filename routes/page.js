const express = require('express');
const axios = require('axios');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  next();
});

router.get('/', (req, res) => {
  res.render('main', {
    title: 'VISIT-KOREA',
    serviceKey: process.env.SERVICE_KEY,
  });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'VISIT-KOREA || login' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'VISIT-KOREA || register' });
});

router.post('/search', (req, res) => {
  res.send(req.body.data);
});

router.get('/result', async (req, res) => {
  res.render('result', { title: 'VISIT-KOREA || result' });
});

module.exports = router;
