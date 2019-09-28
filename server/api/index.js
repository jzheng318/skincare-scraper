const router = require('express').Router();

router.use('/sephora', require('./sephora'));
router.use('/ulta', require('./ulta'));
router.use('/yesstyle', require('./yesstyle'));

router.use(function(req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
});

module.exports = router;
