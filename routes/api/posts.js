const express = require("express");

const router = express.Router();

// @route GET api/profile/test
// @desc Checks posts route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: " stuff of posts"
  })
);

module.exports = router;
