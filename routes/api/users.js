const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
//Load user model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Checks users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: " stuff of users"
  })
);

// @route GET api/users/register
// @desc register a new user
// @access Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email is already registered!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size of icon
        r: "pg", //idk , it says rating
        d: "retro" // default icon
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password // Wont hash your pass , do whatever you can!
      });

      newUser
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
    }
  });
});

module.exports = router;
