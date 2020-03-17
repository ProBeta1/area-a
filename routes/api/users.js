const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load input validation
const validatRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load user model
const User = require("../../models/User");

// @route GET api/users/register
// @desc register a new user
// @access Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validatRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      const errors = { email: "Email is already registered!" };
      return res.status(400).json(errors);
    } else {
      // fetch the dp from the email , if it has one
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

// @route GET api/users/login
// @desc Logging in a user / return JWT token
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find the user through email
  User.findOne({ email }).then(user => {
    if (user) {
      //check the pass , remember , no encyption
      if (password === user.password) {
        // user is matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3663 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Oops , the password seems incorrect.. Think hard!";
        return res.status(400).json(errors);
      }
    } else {
      errors.email = "User not found :(";
      return res.status(404).json(errors);
    }
  });
});

// @route GET api/users/current
// @desc Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
