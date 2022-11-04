const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.delete('/quit', async (req, res) => {
  try {
    await User.destroy({ where: { email: req.body.email } });
    req.logout(() => {
      req.session.destroy();
      res.send(200);
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
