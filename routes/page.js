const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  next();
});

router.get('/', (req, res) => {
  res.render('main', { title: 'VISIT-KOREA' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'VISIT-KOREA || login' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'VISIT-KOREA || register' });
});

module.exports = router;
