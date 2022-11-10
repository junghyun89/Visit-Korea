const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
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

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  '/user/:id/image',
  isLoggedIn,
  upload.single('img'),
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { id: req.params.id },
      });
      await user.update({
        img: req.file.filename,
      });
      res.redirect('/mypage');
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
