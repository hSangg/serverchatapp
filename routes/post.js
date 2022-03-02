const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const User = require("../models/User")

router.post("/", async (req, res) => {
  const { userId, desc } = req.body
  try {
    const newPost = new Post({ userId, desc })
    await newPost.save()
    res.status(200).json({ success: true, message: "save post", newPost })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error })
  }
})

router.put("/:id", async (req, res) => {
  const id = req.params.id
  const { userId } = req.body
  try {
    const post = await Post.findById(id)
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body })
      res
        .status(200)
        .json({ success: true, message: "the post has been updated" })
    } else {
      res
        .status(400)
        .json({ success: false, message: "you can update only your post" })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

router.delete("/:id", async (req, res) => {
  const id = req.params.id
  const { userId } = req.body
  try {
    const post = await Post.findById(id)
    if (post.userId === userId) {
      await post.deleteOne()
      res
        .status(200)
        .json({ success: true, message: "the post has been deleted" })
    } else {
      res
        .status(400)
        .json({ success: false, message: "you can delete only your post" })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

router.put("/:id/like", async (req, res) => {
  try {
    const id = req.params.id
    const { userId } = req.body
    const post = await Post.findOne({ _id: id })
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } })
      res
        .status(200)
        .json({ success: true, message: "The post has been liked" })
    } else {
      await post.updateOne({ $pull: { likes: userId } })
      res
        .status(200)
        .json({ success: true, message: "the post has been dislike" })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    const post = await Post.findOne({ _id: id })
    res.status(200).json({ success: true, post })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId)
    const userPosts = await Post.find({ userId: currentUser._id })
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId })
      })
    )
    res
      .status(200)
      .json({ success: true, timeline: userPosts.concat(...friendPosts) })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.get("/profile/:username", async (req, res) => {
  try {
    console.log(req.params.username)
    const user = await User.findOne({ username: req.params.username })
    console.log("user: ", user)

    const posts = await Post.find({ userId: user._id })
    res.status(200).json({ success: true, posts, user })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

module.exports = router
