const express = require("express")
const User = require("../models/User")
const router = express.Router()
const bcrypt = require("bcrypt")

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body

  const user = await User.findOne({ username })
  if (user)
    return res
      .status(400)
      .json({ success: false, message: "Username already taken" })

  const newUser = new User({
    username,
    email,
    password,
  })

  await newUser.save()

  res
    .status(200)
    .json({ success: true, message: "Successfully", user: newUser })
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "incorrect email or password" })

    if (user.password === password)
      return res
        .status(400)
        .json({ success: false, message: "incorrect email or password" })
    return res.json({ success: true, user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: "has some error" })
  }
})

module.exports = router
