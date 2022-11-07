const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Site = require('../models/site');
const Review = require('../models/review');
const User = require('../models/user');

const router = express.Router();

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
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

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
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

router.post('/:id/zzim', isLoggedIn, async (req, res, next) => {
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

router.delete('/:id/zzim', isLoggedIn, async (req, res, next) => {
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
  '/:id/review',
  isLoggedIn,
  upload.single('img'),
  async (req, res, next) => {
    try {
      const { content, rate, name } = req.body;
      const img = req.file ? req.file.filename : '';
      let site = await Site.findOne({
        where: { contentId: req.params.id },
      });
      if (!site) {
        site = await Site.create({
          name,
          contentId: req.params.id,
        });
      }
      const exReview = await Review.findOne({
        where: { UserId: req.user.id, content },
      });
      if (exReview) return;
      await Review.create({
        content,
        rate,
        img,
        UserId: req.user.id,
        SiteId: site.id,
      });
      return res.send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
