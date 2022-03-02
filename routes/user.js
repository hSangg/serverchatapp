const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")

// update user 🎉🎉
router.put("/:id", async (req, res) => {
  const id = req.params.id
  const { userId, isAdmin, password } = req.body
  if (id === userId || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
      } catch (error) {
        return res.status(500).json({ success: false, error })
      }
    }

    try {
      const user = await User.findByIdAndUpdate(id, {
        $set: req.body,
      })
      res
        .status(200)
        .json({ success: true, message: "Accout has been updated" })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  } else {
    return res
      .status(403)
      .json({ success: false, message: "You can only update your account" })
  }
})
// delete user 🎉🎉
router.delete("/:id", async (req, res) => {
  const { userId, isAdmin } = req.body
  const id = req.params.id
  if (userId === id || isAdmin) {
    try {
      await User.findByIdAndDelete(id)
      res
        .status(200)
        .json({ success: true, message: "Account has been deleted" })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "You can only delete your account" })
  }
})

//get user infor
router.get("/", async (req, res) => {
  const userId = req.query.userId
  const username = req.query.username

  try {
    const user = userId
      ? await User.findById(userId)
      : User.findOne({ username })

    const { password, updatedAt, ...ress } = user._doc
    res.status(200).json({ success: true, infor: ress })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.get("/friends/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const friends = await Promise.all(
      user.following.map((friendId) => User.findById(friendId))
    )

    let friendList = []
    friends.forEach((friend) => {
      const { _id, username, profilePicture } = friend
      friendList.push({ _id, username, profilePicture })
    })

    res.status(200).json({ success: true, friendList })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

//follow user 🎉🎉
router.put("/:id/follow", async (req, res) => {
  const userId = req.body.userId // is you
  const id = req.params.id // is person you want to follow
  if (id !== userId) {
    try {
      const user = await User.findById(id) //is person you follow
      const currentUser = await User.findById(userId) //is you
      if (!user.followers.includes(userId)) {
        await currentUser.updateOne({ $push: { following: id } })
        await user.updateOne({ $push: { followers: userId } })
        res
          .status(200)
          .json({ success: true, message: "user has ben followed" })
      } else {
        res
          .status(403)
          .json({ success: false, message: "you already followed this user" })
      }
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "you can not following your self" })
  }
})

//unfollow user 🎉🎉
router.put("/:id/unfollow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { following: req.params.id } })
        res.status(200).json({
          success: true,
          message: "you has been unfollowed this user",
        })
      } else
        res
          .status(403)
          .json({ success: false, message: "you dont follow this user" })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  } else {
    res
      .status(403)
      .json({ success: false, message: "you can not unfollow yourself" })
  }
})

module.exports = router
