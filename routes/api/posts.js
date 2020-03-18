const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Posts");
const Profile = require("../../models/Profile");

const validatePostInput = require("../../validation/post");

// @route POST api/posts
// @desc Create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route GET api/posts
// @desc Get post
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostfound: "Nobody has posted anything yet!" })
    );
});

// @route GET api/posts/:id
// @desc Get post by ID
// @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err =>
      res
        .status(404)
        .json({ nopostfound: "This user hasnt posted anything yet!" })
    );
});

// @route DELETE api/posts/:id
// @desc Delete post by ID
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: "User not authorized to do such stuff.."
            });
          }

          post.remove().then(() => res.json({ success: true }));
        });
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found." }));
  }
);

// @route POST api/posts/haha/:id
// @desc Haha at the post
// @access Private
router.post(
  "/haha/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.hahas.filter(haha => haha.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyhahaed: "You have already hahaed at this meme" });
          }

          post.haha.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No such post.." }));
    });
  }
);

module.exports = router;
